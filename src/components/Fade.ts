import { interpolate } from "remotion";

/** Opacity for an optional fade. fadeFrames = 0 returns 1 on every frame (hard cut). */
export const fadeOpacity = (
  frame: number,
  durationInFrames: number,
  fadeFrames: number,
): number => {
  if (fadeFrames <= 0) return 1;
  return interpolate(
    frame,
    [0, fadeFrames, durationInFrames - fadeFrames, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
};
