// ─── REEL EDITOR ──────────────────────────────────────────────────────────────
// Turns a raw talking-head clip into a tight, fluid reel:
//   1. Detects silent gaps and removes the pauses between sentences.
//   2. Keeps a small margin so words aren't clipped.
//   3. Crossfades every cut so the jump-cuts look smooth.
//   4. Light + quality pass: denoise, upscale to 1080x1920, color correction,
//      and sharpening.
//
// Usage:
//   node scripts/edit-reel.mjs [input] [output]
//   node scripts/edit-reel.mjs public/reel.mp4 out/reel-edited.mp4
//
// Tunables live in CONFIG below.

import { execFile, spawn } from "node:child_process";
import { promisify } from "node:util";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const FFMPEG = process.env.FFMPEG || require("ffmpeg-static");
const FFPROBE = process.env.FFPROBE || require("ffprobe-static").path;
const pexec = promisify(execFile);

const CONFIG = {
  input: process.argv[2] || "public/reel.mp4",
  output: process.argv[3] || "out/reel-edited.mp4",
  noiseDb: -30, // anything quieter than this counts as silence
  minSilence: 0.3, // ignore pauses shorter than this (seconds)
  pad: 0.1, // keep this much around each speech segment (seconds)
  mergeGap: 0.12, // merge kept segments closer than this (seconds)
  minSegment: 0.3, // drop kept segments shorter than this (seconds)
  xfade: 0.18, // crossfade duration at each cut (seconds)
  width: 1080,
  height: 1920,
  fps: 30,
  crf: 19,
};

const sh = (label, args) =>
  new Promise((res, rej) => {
    const p = spawn(FFMPEG, args, { stdio: ["ignore", "inherit", "inherit"] });
    p.on("close", (code) =>
      code === 0 ? res() : rej(new Error(`${label} exited with ${code}`)),
    );
  });

async function probeDuration(file) {
  const { stdout } = await pexec(FFPROBE, [
    "-v", "error",
    "-show_entries", "format=duration",
    "-of", "csv=p=0",
    file,
  ]);
  return parseFloat(stdout.trim());
}

async function detectSilences(file) {
  // silencedetect writes to stderr; capture it.
  const { stderr } = await pexec(
    FFMPEG,
    ["-hide_banner", "-i", file, "-af",
     `silencedetect=noise=${CONFIG.noiseDb}dB:d=${CONFIG.minSilence}`,
     "-f", "null", process.platform === "win32" ? "NUL" : "/dev/null"],
    { maxBuffer: 1024 * 1024 * 16 },
  ).catch((e) => ({ stderr: e.stderr || "" }));

  const silences = [];
  let start = null;
  for (const line of stderr.split("\n")) {
    const s = line.match(/silence_start:\s*([\d.]+)/);
    const e = line.match(/silence_end:\s*([\d.]+)/);
    if (s) start = parseFloat(s[1]);
    if (e && start !== null) {
      silences.push([start, parseFloat(e[1])]);
      start = null;
    }
  }
  return silences;
}

// Complement of the silence intervals = the speech segments we keep.
function buildSegments(silences, duration) {
  const { pad, mergeGap, minSegment } = CONFIG;
  let segs = [];
  let cursor = 0;
  for (const [s, e] of silences) {
    if (s > cursor) segs.push([cursor, s]);
    cursor = e;
  }
  if (cursor < duration) segs.push([cursor, duration]);

  // pad each segment, clamped to the clip bounds
  segs = segs.map(([s, e]) => [Math.max(0, s - pad), Math.min(duration, e + pad)]);

  // merge segments that now touch / are very close
  const merged = [];
  for (const seg of segs) {
    const last = merged[merged.length - 1];
    if (last && seg[0] - last[1] < mergeGap) last[1] = seg[1];
    else merged.push([...seg]);
  }

  return merged.filter(([s, e]) => e - s >= minSegment);
}

function buildFiltergraph(segs) {
  const { xfade, width, height, fps, crf } = CONFIG;
  const lines = [];

  // 1) trim each kept segment into its own video/audio stream
  segs.forEach(([s, e], i) => {
    lines.push(`[0:v]trim=${s.toFixed(3)}:${e.toFixed(3)},setpts=PTS-STARTPTS,fps=${fps}[v${i}]`);
    lines.push(`[0:a]atrim=${s.toFixed(3)}:${e.toFixed(3)},asetpts=PTS-STARTPTS[a${i}]`);
  });

  // 2) crossfade the video segments together
  let vPrev = "v0";
  let cum = segs[0][1] - segs[0][0];
  for (let i = 1; i < segs.length; i++) {
    const dur = segs[i][1] - segs[i][0];
    const offset = (cum - xfade).toFixed(3);
    const out = `vx${i}`;
    lines.push(`[${vPrev}][v${i}]xfade=transition=fade:duration=${xfade}:offset=${offset}[${out}]`);
    vPrev = out;
    cum = cum + dur - xfade;
  }

  // 3) crossfade the audio the same way (keeps A/V in sync)
  let aPrev = "a0";
  for (let i = 1; i < segs.length; i++) {
    const out = `ax${i}`;
    lines.push(`[${aPrev}][a${i}]acrossfade=d=${xfade}:c1=tri:c2=tri[${out}]`);
    aPrev = out;
  }

  // 4) light + quality pass on the assembled video
  lines.push(
    `[${vPrev}]hqdn3d=1.5:1.5:6:6,` +
      `scale=${width}:${height}:flags=lanczos,` +
      `eq=contrast=1.07:brightness=0.03:saturation=1.12:gamma=0.97,` +
      `colorbalance=rs=0.02:gs=0.0:bs=-0.02:rm=0.02:bm=-0.02,` +
      `unsharp=5:5:0.6:5:5:0.0[vout]`,
  );

  return { graph: lines.join(";\n"), vLabel: "vout", aLabel: aPrev, crf };
}

async function main() {
  const input = resolve(CONFIG.input);
  const output = resolve(CONFIG.output);
  mkdirSync(dirname(output), { recursive: true });

  console.log(`▶ analysing ${CONFIG.input} …`);
  const duration = await probeDuration(input);
  const silences = await detectSilences(input);
  const segs = buildSegments(silences, duration);

  const kept = segs.reduce((t, [s, e]) => t + (e - s), 0);
  console.log(
    `  source: ${duration.toFixed(1)}s · ${silences.length} pauses removed · ` +
      `${segs.length} segments kept · final ≈ ${kept.toFixed(1)}s ` +
      `(−${(duration - kept).toFixed(1)}s)`,
  );
  if (segs.length === 0) throw new Error("No speech segments detected — loosen noiseDb/minSilence.");

  const { graph, vLabel, aLabel, crf } = buildFiltergraph(segs);
  const graphFile = resolve("out/.filtergraph.txt");
  mkdirSync(dirname(graphFile), { recursive: true });
  writeFileSync(graphFile, graph);

  console.log(`▶ rendering ${CONFIG.output} (this takes a bit) …`);
  await sh("ffmpeg", [
    "-y", "-hide_banner",
    "-i", input,
    "-filter_complex_script", graphFile,
    "-map", `[${vLabel}]`, "-map", `[${aLabel}]`,
    "-c:v", "libx264", "-preset", "medium", "-crf", String(crf),
    "-pix_fmt", "yuv420p",
    "-c:a", "aac", "-b:a", "160k",
    "-movflags", "+faststart",
    output,
  ]);

  console.log(`✓ done → ${CONFIG.output}`);
}

main().catch((e) => {
  console.error("✗", e.message);
  process.exit(1);
});
