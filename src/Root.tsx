import React from "react";
import { Composition } from "remotion";
import { Episode } from "./Episode";
import { DisclosureCard } from "./components/DisclosureCard";
import { RecapCard } from "./components/RecapCard";
import {
  disclosureSchema,
  episodeSchema,
  recapSchema,
  type DisclosureProps,
  type EpisodeProps,
  type RecapProps,
} from "./schema";
import { FPS, secondsToFrames } from "./lib/time";
import { resolveTimeline } from "./lib/timeline";
import disclosureData from "../data/disclosure.json";
import recapData from "../data/recap.json";
import episodeData from "../data/episode.json";

const WIDTH = 3840;
const HEIGHT = 2160;

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="Disclosure"
        component={DisclosureCard}
        schema={disclosureSchema}
        defaultProps={disclosureData as DisclosureProps}
        width={WIDTH}
        height={HEIGHT}
        fps={FPS}
        durationInFrames={secondsToFrames(8)}
        calculateMetadata={({ props }) => ({
          durationInFrames: secondsToFrames(props.holdSeconds),
        })}
      />
      <Composition
        id="Recap"
        component={RecapCard}
        schema={recapSchema}
        defaultProps={recapData as RecapProps}
        width={WIDTH}
        height={HEIGHT}
        fps={FPS}
        durationInFrames={secondsToFrames(20)}
        calculateMetadata={({ props }) => ({
          durationInFrames: secondsToFrames(props.holdSeconds),
        })}
      />
      <Composition
        id="Episode"
        component={Episode}
        schema={episodeSchema}
        defaultProps={episodeData as unknown as EpisodeProps}
        width={WIDTH}
        height={HEIGHT}
        fps={FPS}
        durationInFrames={FPS * 60}
        calculateMetadata={({ props }) => ({
          durationInFrames: resolveTimeline(props).totalFrames,
        })}
      />
    </>
  );
};
