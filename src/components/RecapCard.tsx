import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import type { RecapProps } from "../schema";
import { RecapCardView } from "./RecapCardView";
import { fadeOpacity } from "./Fade";

export const RecapCard: React.FC<RecapProps> = ({
  heading,
  lines,
  fadeFrames,
  foreground,
  background,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <RecapCardView
      heading={heading}
      lines={lines}
      foreground={foreground}
      background={background}
      opacity={fadeOpacity(frame, durationInFrames, fadeFrames)}
    />
  );
};
