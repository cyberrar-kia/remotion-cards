import React from "react";

/**
 * Pure presentation. No hooks, no timing, no text transforms.
 * The string in `text` is placed in the DOM exactly as supplied, which is what
 * scripts/check-text.ts verifies.
 */
export const DisclosureCardView: React.FC<{
  text: string;
  foreground: string;
  background: string;
  opacity?: number;
}> = ({ text, foreground, background, opacity = 1 }) => {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: background,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity,
      }}
    >
      <p
        data-testid="card-text"
        style={{
          margin: 0,
          width: "70%",
          color: foreground,
          fontFamily: 'Georgia, "Times New Roman", "DejaVu Serif", serif',
          // Sized in percent of frame width so 4K, 1080p and phone screens all read the same.
          fontSize: "3.4vw",
          lineHeight: 1.45,
          textAlign: "center",
          whiteSpace: "pre-wrap",
          // No transforms: case, quotes and whitespace stay as supplied.
          textTransform: "none",
          fontVariantLigatures: "none",
        }}
      >
        {text}
      </p>
    </div>
  );
};
