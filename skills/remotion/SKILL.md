---
name: remotion
description: Create and render videos programmatically with Remotion (React-based video). Use when the user asks to make a video, animation, motion graphic, edit or trim a video, or render an mp4 on the local machine.
---

## Overview

Remotion renders videos from React components — each frame is a React
render, and the video is the sequence of frames. Use this skill whenever
the task involves producing or editing a video file locally.

This is the core creative capability of the Mitra workbench: the agent
writes Remotion code, renders it on the user's machine, and produces an
mp4 the user can review.

## New project

In an empty workspace, scaffold a blank Remotion project:

```bash
npx create-video@latest --yes --blank --no-tailwind <project-name>
cd <project-name>
npm install
```

Project layout:

- `src/Root.tsx` — registers the `<Composition>`s
- `src/<Name>.tsx` — a composition component
- `remotion.config.ts` — render configuration

## Composition

A composition declares the video's id, dimensions, fps, and length:

```tsx
import { Composition } from "remotion";
import { MyVideo } from "./MyVideo";

export const Root = () => (
  <Composition
    id="MyVideo"
    component={MyVideo}
    durationInFrames={150}
    fps={30}
    width={1920}
    height={1080}
  />
);
```

`durationInFrames / fps = seconds` — 150 / 30 = 5 seconds.

## Animation

Drive every animation off the current frame — never `setTimeout` or CSS
transitions:

```tsx
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

export const MyVideo = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // linear fade-in over the first 30 frames
  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  // spring-based scale
  const scale = spring({ frame, fps, config: { damping: 200 } });

  return <div style={{ opacity, transform: `scale(${scale})` }}>Hello</div>;
};
```

- `interpolate(frame, inputRange, outputRange, { extrapolateLeft/Right: "clamp" })`
- `spring({ frame, fps, config })` — natural motion
- A given frame must always render the same output (deterministic).

## Preview

```bash
npx remotion studio
```

## Render to mp4

Use the bundled helper for a one-shot render:

```bash
node .opencode/skills/remotion/render.mjs <project-dir> <composition-id> [output.mp4]
```

Or render directly:

```bash
npx remotion render <composition-id> out/video.mp4
```

Sanity-check a single frame without a full render:

```bash
npx remotion still <composition-id> --frame=30 --scale=0.25
```

## Trimming / editing an existing video

For cutting, trimming, concatenating, or silence-detection on an existing
video file, use FFmpeg directly:

```bash
# trim: keep 00:05 to 00:12
ffmpeg -i input.mp4 -ss 00:00:05 -to 00:00:12 -c copy output.mp4
```

To composite an existing clip inside a Remotion video, use the
`<OffthreadVideo>` component.

## Parametrized videos

Add a Zod schema to a composition so it takes typed props (title, colors,
duration). The agent can then render variants without editing code.

## Notes

- Rendering needs a headless Chromium. Remotion downloads it on the first
  render. If the download is slow, point `REMOTION_CHROMIUM_EXECUTABLE` at
  a local Chrome/Chromium binary.
- Renders are CPU-bound; for long videos use `--concurrency` to match the
  core count.
