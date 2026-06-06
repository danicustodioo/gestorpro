import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

const GOLD = "#c9a96e";

// Renders one subtitle line. Mounted inside a <Sequence>, so useCurrentFrame()
// restarts at 0 when the caption appears.
export const Caption: React.FC<{ text: string; highlight?: string }> = ({
  text,
  highlight,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Pop in with a spring, then hold.
  const enter = spring({ frame, fps, config: { damping: 16, mass: 0.6 } });
  const opacity = interpolate(enter, [0, 1], [0, 1]);
  const translateY = interpolate(enter, [0, 1], [28, 0]);
  const scale = interpolate(enter, [0, 1], [0.94, 1]);

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
        maxWidth: "86%",
        textAlign: "center",
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        fontWeight: 800,
        fontSize: 58,
        lineHeight: 1.18,
        color: "#fff",
        textShadow: "0 4px 18px rgba(0,0,0,0.85)",
        WebkitTextStroke: "1px rgba(0,0,0,0.25)",
      }}
    >
      {renderWithHighlight(text, highlight)}
    </div>
  );
};

// Splits the line so the highlighted substring renders in the Veritas gold.
function renderWithHighlight(text: string, highlight?: string) {
  if (!highlight) return text;
  const idx = text.toLowerCase().indexOf(highlight.toLowerCase());
  if (idx === -1) return text;
  const before = text.slice(0, idx);
  const match = text.slice(idx, idx + highlight.length);
  const after = text.slice(idx + highlight.length);
  return (
    <>
      {before}
      <span style={{ color: GOLD }}>{match}</span>
      {after}
    </>
  );
}
