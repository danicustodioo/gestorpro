import {
  AbsoluteFill,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// Brand palette (matches GestorPro's Record theme in src/App.jsx)
const BLUE = "#2a4a8a";
const GOLD = "#c9a96e";
const BG = "#080810";

type Props = {
  brand: string;
  title: string;
  tagline: string;
};

export const RecordIntro: React.FC<Props> = ({ brand, title, tagline }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // A slow background glow that drifts the whole 5 seconds.
  const glow = interpolate(frame, [0, 150], [0.25, 0.55], {
    extrapolateRight: "clamp",
  });

  // The monogram badge springs in from frame 0.
  const badgeScale = spring({ frame, fps, config: { damping: 14, mass: 0.7 } });
  const badgeRotate = interpolate(badgeScale, [0, 1], [-12, 0]);

  // Gentle "breathing" applied to the whole lockup after it settles.
  const breathe = 1 + 0.01 * Math.sin((frame / fps) * 2);

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      {/* Layer 1 — animated radial glow */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 42%, ${hexA(
            BLUE,
            glow,
          )} 0%, rgba(8,8,16,0) 60%)`,
        }}
      />

      {/* Layer 2 — centered lockup */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          fontFamily:
            "'Helvetica Neue', Helvetica, Arial, sans-serif",
          transform: `scale(${breathe})`,
        }}
      >
        {/* Monogram badge */}
        <div
          style={{
            width: 168,
            height: 168,
            borderRadius: 36,
            background: `linear-gradient(135deg, ${BLUE}, #1b3160)`,
            border: `2px solid ${hexA(GOLD, 0.6)}`,
            boxShadow: `0 30px 80px ${hexA(BLUE, 0.5)}`,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            transform: `scale(${badgeScale}) rotate(${badgeRotate}deg)`,
          }}
        >
          <span
            style={{
              fontSize: 104,
              fontWeight: 800,
              color: GOLD,
              lineHeight: 1,
            }}
          >
            {brand.charAt(0)}
          </span>
        </div>

        {/* Title — fades + slides up starting at frame 20 */}
        <Sequence from={20} layout="none">
          <FadeUp>
            <h1
              style={{
                marginTop: 56,
                fontSize: 88,
                fontWeight: 700,
                color: "#fff",
                letterSpacing: -1,
                textAlign: "center",
              }}
            >
              {title}
            </h1>
          </FadeUp>
        </Sequence>

        {/* Gold underline — draws its width in from frame 38 */}
        <Underline startFrame={38} maxWidth={Math.min(720, width * 0.4)} />

        {/* Tagline — fades in last, at frame 55 */}
        <Sequence from={55} layout="none">
          <FadeUp distance={20}>
            <p
              style={{
                marginTop: 28,
                fontSize: 34,
                fontWeight: 400,
                color: hexA("#ffffff", 0.7),
                letterSpacing: 6,
                textTransform: "uppercase",
                textAlign: "center",
              }}
            >
              {tagline}
            </p>
          </FadeUp>
        </Sequence>
      </AbsoluteFill>

      {/* Layer 3 — thin vignette frame to anchor the 1920x1080 canvas */}
      <AbsoluteFill
        style={{
          boxShadow: `inset 0 0 ${height * 0.4}px rgba(0,0,0,0.6)`,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};

// Fades children in while sliding them up. Lives inside a <Sequence>, so its
// useCurrentFrame() restarts at 0 when the sequence begins.
const FadeUp: React.FC<{ children: React.ReactNode; distance?: number }> = ({
  children,
  distance = 40,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 18 } });
  const opacity = interpolate(enter, [0, 1], [0, 1]);
  const translateY = interpolate(enter, [0, 1], [distance, 0]);
  return <div style={{ opacity, transform: `translateY(${translateY}px)` }}>{children}</div>;
};

// A gold underline whose width grows in.
const Underline: React.FC<{ startFrame: number; maxWidth: number }> = ({
  startFrame,
  maxWidth,
}) => {
  const frame = useCurrentFrame();
  const w = interpolate(frame, [startFrame, startFrame + 22], [0, maxWidth], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        marginTop: 22,
        height: 4,
        width: w,
        borderRadius: 2,
        background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
      }}
    />
  );
};

// Helper: hex color + alpha (0..1) -> rgba string.
function hexA(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
