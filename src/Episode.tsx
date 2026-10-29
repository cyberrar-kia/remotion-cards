import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  getRemotionEnvironment,
  staticFile,
} from "remotion";
import type { EpisodeProps } from "./schema";
import { resolveTimeline } from "./lib/timeline";
import { DisclosureCard } from "./components/DisclosureCard";
import { RecapCard } from "./components/RecapCard";

/**
 * Episode timeline. Cards are placed from the cue list in props.
 * Everything outside a card is a black base so the cards can be checked in context.
 * In production the base would be the film itself, or the cards are exported
 * on their own and placed in the edit.
 */
export const Episode: React.FC<EpisodeProps> = (props) => {
  const { items } = resolveTimeline(props);
  const { isRendering } = getRemotionEnvironment();
  const playGuide = props.guideTrack && (!isRendering || props.includeGuideInRender);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {playGuide ? <Audio src={staticFile(props.guideTrack as string)} /> : null}
      {items.map((item) => (
        <Sequence
          key={item.id}
          from={item.from}
          durationInFrames={item.durationInFrames}
          name={`${item.kind}:${item.id}`}
        >
          {item.cue.kind === "disclosure" ? (
            <DisclosureCard {...item.cue.card} />
          ) : (
            <RecapCard {...item.cue.card} />
          )}
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
