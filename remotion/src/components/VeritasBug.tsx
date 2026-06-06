import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

// Veritas palette (matches BRANDS.veritas in src/App.jsx)
const GOLD = "#c9a96e";
const GOLD_DK = "#8f775f";

// A small persistent logo "bug" in the top-left corner.
export const VeritasBug: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 18 }, delay: 8 });
  const opacity = interpolate(enter, [0, 1], [0, 1]);
  const x = interpolate(enter, [0, 1], [-40, 0]);

  return (
    <div
      style={{
        position: "absolute",
        top: 48,
        left: 48,
        display: "flex",
        alignItems: "center",
        gap: 14,
        opacity,
        transform: `translateX(${x}px)`,
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 14,
          background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DK})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          fontWeight: 800,
          fontSize: 32,
          color: "#0c0a08",
          boxShadow: "0 8px 24px rgba(0,0,0,0.45)",
        }}
      >
        V
      </div>
      <div
        style={{
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          color: "#fff",
          textShadow: "0 2px 8px rgba(0,0,0,0.6)",
          lineHeight: 1.05,
        }}
      >
        <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: 0.5 }}>
          Veritas Hub
        </div>
        <div style={{ fontSize: 16, fontWeight: 400, color: GOLD, letterSpacing: 2 }}>
          BPO FINANCEIRO
        </div>
      </div>
    </div>
  );
};
