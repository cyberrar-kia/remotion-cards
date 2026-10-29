# remotion-cards

Props-driven Remotion title cards. JSON in, video out.

This repo is a working demo of a disclosure card and a toggleable recap card. All sample wording in `data/` is placeholder text, not client copy. Real copy goes into the JSON files and needs no code change.

## What is here

| Composition | Purpose | Default hold |
| --- | --- | --- |
| `Disclosure` | Verbatim text, white on black, hard hold | 8 s (192 frames) |
| `Recap` | Heading plus supplied lines, removable module | 20 s (480 frames) |
| `Episode` | Timeline that places cards from a cue list | derived from data |

Frame rate is 24 fps and the default size is 3840 x 2160.

## Quick start

```bash
npm install
npm run studio            # preview and edit props in the browser
npm run check:text        # exact-text and toggle checks
npm run render:disclosure # out/disclosure.mp4, 4K / 24 fps
npm run render:recap      # out/recap.mp4, 4K / 24 fps
```

## How copy stays exact

- Text lives in `data/*.json`. Components contain no string literals for card copy.
- `DisclosureCardView` and `RecapCardView` are pure components. They place the supplied string in the DOM with no case, quote or whitespace transform. Line breaks in the JSON are preserved with `white-space: pre-wrap`.
- `npm run check:text` renders the views to markup and compares the text to the JSON, including quotes, ampersands, double spaces and trailing spaces. It also checks hold lengths, placement and the toggle.
- Fade is off by default (`fadeFrames: 0`), so there is no motion over legal text.

## The feature-cut toggle

One flag in the episode props: `includeRecap`.

- `true`: recap and disclosure play as scheduled.
- `false`: every `recap` cue is removed. With `rippleOnRemove: true` (default) later cues move earlier by the recap length and the runtime shrinks by the same amount, so there is no gap. Set `rippleOnRemove: false` to keep original positions.

```bash
npm run render:episode      # with recap, 600 s timeline
npm run render:feature-cut  # recap removed, 580 s timeline
```

Adding an end card later means adding a cue kind to `src/schema.ts` and including it in the removal filter in `src/lib/timeline.ts`.

## Timing

Cue starts are timecodes (`h:mm:ss`, `mm:ss`, or `h:mm:ss:ff`) converted to frames at 24 fps in `src/lib/time.ts`. Hold lengths are in seconds and converted with `calculateMetadata`, so changing `holdSeconds` in JSON changes the composition length.

`0:09:00` is read as h:mm:ss, nine minutes in. If the brief means something else, change the `start` value in the JSON.

A guide voice track can be set with `guideTrack` (a file under `public/`). It plays in the Studio preview only. Set `includeGuideInRender: true` to bake it into a render.

## Keeping 4K renders manageable

- Render cards as short standalone compositions and place them in the edit, instead of rendering a whole timeline.
- To render a slice of the episode, use a frame range, for example the disclosure with the recap on:
  `npx remotion render Episode out/slice.mp4 --props=data/episode.json --frames=12960-13151`
- Use `--scale=0.25` for fast previews and keep 4K for finals.
- Raise `--concurrency` to match available cores.

## Fonts

The cards use a system serif stack (Georgia, Times New Roman, DejaVu Serif) so renders work offline. Swap in a licensed font through `@remotion/fonts` or `@remotion/google-fonts` if the client specifies one.

## Layout

```
data/        JSON props (placeholder copy)
scripts/     check-text.ts
src/
  schema.ts            Zod schemas for every prop
  Root.tsx             compositions
  Episode.tsx          timeline composition
  components/          card views and wrappers
  lib/                 timecode and timeline logic
```
