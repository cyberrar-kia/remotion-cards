/**
 * Verifies that supplied copy reaches the DOM unchanged, and that the recap
 * toggle and ripple behave. Run with: npm run check:text
 */
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { DisclosureCardView } from "../src/components/DisclosureCardView";
import { RecapCardView } from "../src/components/RecapCardView";
import { disclosureSchema, episodeSchema, recapSchema } from "../src/schema";
import { resolveTimeline } from "../src/lib/timeline";
import { FPS, timecodeToFrames } from "../src/lib/time";

const load = (p: string) => JSON.parse(readFileSync(p, "utf8"));

const decode = (s: string) =>
  s
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");

/** Text content of every element carrying a given data-testid. */
const textsByTestId = (html: string, id: string): string[] => {
  const re = new RegExp(`data-testid="${id}"[^>]*>([\\s\\S]*?)</(?:p|h1)>`, "g");
  const out: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) out.push(decode(m[1]));
  return out;
};

let failures = 0;
const check = (name: string, ok: boolean, detail = "") => {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? `  (${detail})` : ""}`);
  if (!ok) failures++;
};

// 1. Disclosure text is rendered exactly as supplied.
const disclosure = disclosureSchema.parse(load("data/disclosure.json"));
const dHtml = renderToStaticMarkup(
  React.createElement(DisclosureCardView, {
    text: disclosure.text,
    foreground: disclosure.foreground,
    background: disclosure.background,
  }),
);
const [rendered] = textsByTestId(dHtml, "card-text");
check("disclosure text identical to JSON", rendered === disclosure.text);

// 1b. Awkward characters survive: quotes, ampersands, double spaces, trailing space.
const nasty = 'He said "wait" & left.  Double  spaces, <tags>, it\'s fine. ';
const nHtml = renderToStaticMarkup(
  React.createElement(DisclosureCardView, {
    text: nasty,
    foreground: "#fff",
    background: "#000",
  }),
);
check("special characters and whitespace preserved", textsByTestId(nHtml, "card-text")[0] === nasty);

// 2. Recap lines and heading are identical to JSON.
const recap = recapSchema.parse(load("data/recap.json"));
const rHtml = renderToStaticMarkup(
  React.createElement(RecapCardView, {
    heading: recap.heading,
    lines: recap.lines,
    foreground: recap.foreground,
    background: recap.background,
  }),
);
check("recap heading identical to JSON", textsByTestId(rHtml, "recap-heading")[0] === recap.heading);
check(
  "recap lines identical to JSON",
  JSON.stringify(textsByTestId(rHtml, "recap-line")) === JSON.stringify(recap.lines),
);

// 3. Hold lengths and placement.
const full = resolveTimeline(episodeSchema.parse(load("data/episode.json")));
const disc = full.items.find((i) => i.kind === "disclosure")!;
const rec = full.items.find((i) => i.kind === "recap")!;
check("disclosure holds 8s (192 frames at 24fps)", disc.durationInFrames === 8 * FPS, `${disc.durationInFrames}f`);
check("recap holds 20s (480 frames at 24fps)", rec.durationInFrames === 20 * FPS, `${rec.durationInFrames}f`);
check("disclosure placed at 0:09:00", disc.from === timecodeToFrames("0:09:00"), `frame ${disc.from}`);

// 4. Toggle: one flag removes the recap and closes the gap.
const cutProps = { ...episodeSchema.parse(load("data/episode.json")), includeRecap: false };
const cut = resolveTimeline(cutProps);
check("feature cut has no recap cue", !cut.items.some((i) => i.kind === "recap"));
check(
  "feature cut shifts disclosure earlier by 20s",
  cut.items[0].from === disc.from - 20 * FPS,
  `frame ${cut.items[0].from}`,
);
check(
  "feature cut runtime is 20s shorter",
  cut.totalFrames === full.totalFrames - 20 * FPS,
  `${full.totalFrames} -> ${cut.totalFrames}`,
);

// 5. Flag off with ripple disabled keeps original positions.
const noRipple = resolveTimeline({ ...cutProps, rippleOnRemove: false });
check("no-ripple keeps disclosure position", noRipple.items[0].from === disc.from);

// 6. The feature-cut data file matches the toggle.
const cutFile = resolveTimeline(episodeSchema.parse(load("data/episode.feature-cut.json")));
check("episode.feature-cut.json has no recap", !cutFile.items.some((i) => i.kind === "recap"));

console.log(failures === 0 ? "\nAll checks passed." : `\n${failures} check(s) failed.`);
process.exit(failures === 0 ? 0 : 1);
