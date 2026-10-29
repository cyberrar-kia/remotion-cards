import { z } from "zod";

/**
 * Timecode accepted everywhere: "h:mm:ss" or "mm:ss" (optionally with ":ff" frames,
 * e.g. "0:09:00:12"). Parsed in src/lib/time.ts.
 */
export const timecode = z
  .string()
  .regex(/^\d+(:\d{1,2}){1,3}$/, "Use h:mm:ss, mm:ss or h:mm:ss:ff");

/** Disclosure card: verbatim text, white on black, hard hold. */
export const disclosureSchema = z.object({
  /** Rendered exactly as supplied. Newlines are preserved. Never transformed. */
  text: z.string().min(1),
  /** Hold length in seconds. */
  holdSeconds: z.number().positive().default(8),
  /** Optional fade in and out, in frames. Default 0 = hard cut, no motion over legal text. */
  fadeFrames: z.number().int().min(0).default(0),
  foreground: z.string().default("#ffffff"),
  background: z.string().default("#000000"),
});
export type DisclosureProps = z.infer<typeof disclosureSchema>;

/** Recap card: heading plus supplied lines, held for a fixed duration. */
export const recapSchema = z.object({
  heading: z.string().min(1),
  lines: z.array(z.string()).min(1),
  holdSeconds: z.number().positive().default(20),
  fadeFrames: z.number().int().min(0).default(0),
  foreground: z.string().default("#ffffff"),
  background: z.string().default("#000000"),
});
export type RecapProps = z.infer<typeof recapSchema>;

/**
 * Episode timeline. Every cue is data. `module` marks cues that belong to a
 * removable module; `includeRecap` switches the recap cues on or off.
 */
const cueBase = {
  id: z.string(),
  /** Start on the episode timeline when the cue is included. */
  start: timecode,
};

export const cueSchema = z.discriminatedUnion("kind", [
  z.object({ ...cueBase, kind: z.literal("disclosure"), card: disclosureSchema }),
  z.object({ ...cueBase, kind: z.literal("recap"), card: recapSchema }),
]);
export type Cue = z.infer<typeof cueSchema>;

export const episodeSchema = z.object({
  /** Total runtime of the full episode, including the recap. */
  totalDuration: timecode,
  /** The one flag for the feature cut: false removes the recap module. */
  includeRecap: z.boolean().default(true),
  /**
   * When the recap is removed, shift later cues earlier by the recap length so
   * the feature cut has no gap. Set false to keep original positions.
   */
  rippleOnRemove: z.boolean().default(true),
  /** Optional guide voice track (path under /public). Plays in preview only. */
  guideTrack: z.string().nullable().default(null),
  /** Set true to bake the guide track into a render. Default false. */
  includeGuideInRender: z.boolean().default(false),
  cues: z.array(cueSchema),
});
export type EpisodeProps = z.infer<typeof episodeSchema>;
