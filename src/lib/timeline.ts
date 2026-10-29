import type { Cue, EpisodeProps } from "../schema";
import { FPS, secondsToFrames, timecodeToFrames } from "./time";

export type ResolvedCue = {
  id: string;
  kind: Cue["kind"];
  from: number;
  durationInFrames: number;
  cue: Cue;
};

export type ResolvedTimeline = {
  items: ResolvedCue[];
  totalFrames: number;
  removedFrames: number;
};

const cueDuration = (cue: Cue, fps: number): number =>
  secondsToFrames(cue.card.holdSeconds, fps);

/**
 * Pure function: props in, frame-accurate timeline out.
 *
 * includeRecap = false removes every "recap" cue. With rippleOnRemove, every
 * later cue moves earlier by the length of the removed cues before it, and the
 * total runtime shrinks by the same amount, so the feature cut has no gap.
 */
export const resolveTimeline = (
  props: EpisodeProps,
  fps: number = FPS,
): ResolvedTimeline => {
  const removed: Cue[] = props.includeRecap
    ? []
    : props.cues.filter((c): boolean => c.kind === "recap");

  const removedFrames = removed.reduce((sum, c) => sum + cueDuration(c, fps), 0);

  const items: ResolvedCue[] = props.cues
    .filter((c) => !removed.includes(c))
    .map((cue) => {
      const start = timecodeToFrames(cue.start, fps);
      const shift = props.rippleOnRemove
        ? removed
            .filter((r) => timecodeToFrames(r.start, fps) < start)
            .reduce((sum, r) => sum + cueDuration(r, fps), 0)
        : 0;
      return {
        id: cue.id,
        kind: cue.kind,
        from: start - shift,
        durationInFrames: cueDuration(cue, fps),
        cue,
      };
    })
    .sort((a, b) => a.from - b.from);

  const fullTotal = timecodeToFrames(props.totalDuration, fps);
  const totalFrames = props.rippleOnRemove ? fullTotal - removedFrames : fullTotal;

  return { items, totalFrames, removedFrames };
};
