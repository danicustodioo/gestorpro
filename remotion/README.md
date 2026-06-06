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
| `src/Root.tsx` | Declares the `RecordIntro` composition (1920×1080, 30fps, 5s). |
| `src/RecordIntro.tsx` | The example: a branded animated intro. |

`RecordIntro` is a small but complete example that demonstrates the core
Remotion APIs: `useCurrentFrame`, `useVideoConfig`, `spring`, `interpolate`
(with clamped extrapolation), `<AbsoluteFill>` layering, and `<Sequence>`
scheduling. Use it as a template for new compositions.
