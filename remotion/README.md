# GestorPro — Remotion videos

Programmatic videos for GestorPro (Record & Veritas), built with
[Remotion](https://remotion.dev). Authoring conventions live in the project
skill at `.claude/skills/remotion/SKILL.md`.

## Setup

```bash
cd remotion
npm install
```

## Preview (interactive studio)

```bash
npm run studio
```

Opens the Remotion Studio in the browser where you can scrub the timeline.

## Render to MP4

```bash
npm run render          # -> out/record-intro.mp4
# or directly:
npx remotion render RecordIntro out/record-intro.mp4
```

## Single still frame (PNG)

```bash
npm run still           # frame 75 -> out/frame.png
```

## What's here

| File | Purpose |
| --- | --- |
| `src/index.ts` | Registers the root. |
| `src/Root.tsx` | Declares the compositions. |
| `src/RecordIntro.tsx` | Example: a branded animated intro (1920×1080, 5s). |
| `src/CaptionedReel.tsx` | Vertical reel: clip + Veritas bug + captions (1080×1920). |
| `src/captions.ts` | Subtitle text + timing for the reel. |
| `src/components/Caption.tsx` | A single animated subtitle line. |
| `src/components/VeritasBug.tsx` | Corner logo bug. |

`RecordIntro` demonstrates the core Remotion APIs: `useCurrentFrame`,
`useVideoConfig`, `spring`, `interpolate` (clamped), `<AbsoluteFill>` layering,
and `<Sequence>` scheduling.

## CaptionedReel — captioned vertical reel

Lays animated subtitles and a Veritas brand bug over the talking-head clip.

1. **Add the footage** (kept out of git): copy your clip to
   `public/reel.mp4`.
2. **Edit the captions** in `src/captions.ts` — each line has `text`,
   `startSec`, `endSec`, and an optional `highlight` substring (rendered in
   gold). The seeded lines are **placeholders**, not a transcript.
3. Preview with `npm run studio` (pick `CaptionedReel`), or render:

```bash
npx remotion render CaptionedReel out/reel.mp4
# quick preview of a range:
npx remotion render CaptionedReel out/reel-preview.mp4 --frames=0-480
```

The composition duration (`durationInFrames` in `src/Root.tsx`) is set for the
~161s clip at 30fps; adjust it if your clip length changes.
