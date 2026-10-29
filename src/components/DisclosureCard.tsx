import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import type { DisclosureProps } from "../schema";
import { DisclosureCardView } from "./DisclosureCardView";
import { fadeOpacity } from "./Fade";

export const DisclosureCard: React.FC<DisclosureProps> = ({
  text,
  fadeFrames,
  foreground,
  background,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <DisclosureCardView
      text={text}
      foreground={foreground}
      background={background}
      opacity={fadeOpacity(frame, durationInFrames, fadeFrames)}
    />
  );
};
