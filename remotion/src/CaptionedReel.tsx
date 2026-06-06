import {
  AbsoluteFill,
  OffthreadVideo,
  Sequence,
  staticFile,
  useVideoConfig,
} from "remotion";
import { CAPTIONS, resolveCaptions } from "./captions";
import { Caption } from "./components/Caption";
import { VeritasBug } from "./components/VeritasBug";

type Props = {
  src: string; // file in public/, e.g. "reel.mp4"
};

export const CaptionedReel: React.FC<Props> = ({ src }) => {
  const { fps } = useVideoConfig();
  const captions = resolveCaptions(CAPTIONS, fps);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* Layer 1 — the talking-head footage, full-bleed */}
      <OffthreadVideo
        src={staticFile(src)}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />

      {/* Layer 2 — bottom scrim so captions stay legible over any frame */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.25) 26%, rgba(0,0,0,0) 46%)",
          pointerEvents: "none",
        }}
      />

      {/* Layer 3 — brand bug */}
      <VeritasBug />

      {/* Layer 4 — captions, each scheduled on its own Sequence */}
      {captions.map((c, i) => (
        <Sequence key={i} from={c.from} durationInFrames={c.durationInFrames}>
          <AbsoluteFill
            style={{
              justifyContent: "flex-end",
              alignItems: "center",
              paddingBottom: 280,
            }}
          >
            <Caption text={c.text} highlight={c.highlight} />
          </AbsoluteFill>
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
