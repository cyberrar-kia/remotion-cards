export const FPS = 24;

/**
 * Parse "h:mm:ss", "mm:ss", or "h:mm:ss:ff" into frames.
 * Two parts = mm:ss. Three parts = h:mm:ss. Four parts = h:mm:ss:ff.
 */
export const timecodeToFrames = (tc: string, fps: number = FPS): number => {
  const parts = tc.split(":").map((p) => Number(p));
  if (parts.some((n) => !Number.isFinite(n))) {
    throw new Error(`Invalid timecode: ${tc}`);
  }
  let h = 0;
  let m = 0;
  let s = 0;
  let f = 0;
  if (parts.length === 2) {
    [m, s] = parts;
  } else if (parts.length === 3) {
    [h, m, s] = parts;
  } else if (parts.length === 4) {
    [h, m, s, f] = parts;
  } else {
    throw new Error(`Invalid timecode: ${tc}`);
  }
  return Math.round(((h * 60 + m) * 60 + s) * fps) + f;
};

export const secondsToFrames = (seconds: number, fps: number = FPS): number =>
  Math.round(seconds * fps);
