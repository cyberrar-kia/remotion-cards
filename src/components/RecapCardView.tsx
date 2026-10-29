import React from "react";

/** Pure presentation for the recap card. All strings come from props. */
export const RecapCardView: React.FC<{
  heading: string;
  lines: string[];
  foreground: string;
  background: string;
  opacity?: number;
}> = ({ heading, lines, foreground, background, opacity = 1 }) => {
  const font = 'Georgia, "Times New Roman", "DejaVu Serif", serif';
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: background,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity,
        color: foreground,
        fontFamily: font,
      }}
    >
      <h1
        data-testid="recap-heading"
        style={{
          margin: 0,
          fontSize: "4.2vw",
          fontWeight: 700,
          letterSpacing: "0.02em",
          textTransform: "none",
        }}
      >
        {heading}
      </h1>
      <div style={{ height: "3vw" }} />
      <div
        style={{
          width: "70%",
          display: "flex",
          flexDirection: "column",
          gap: "1.6vw",
        }}
      >
        {lines.map((line, i) => (
          <p
            key={i}
            data-testid="recap-line"
            style={{
              margin: 0,
              fontSize: "3vw",
              lineHeight: 1.4,
              textAlign: "center",
              whiteSpace: "pre-wrap",
              textTransform: "none",
            }}
          >
            {line}
          </p>
        ))}
      </div>
    </div>
  );
};
