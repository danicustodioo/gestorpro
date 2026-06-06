import { Composition } from "remotion";
import { RecordIntro } from "./RecordIntro";
import { CaptionedReel } from "./CaptionedReel";

// Every video in the project is declared here as a <Composition>.
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="RecordIntro"
        component={RecordIntro}
        durationInFrames={150} // 5 seconds at 30fps
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          brand: "Record",
          title: "Record Assessoria Contábil",
          tagline: "Assessoria Contábil · 43 anos",
        }}
      />

      {/* Captioned vertical reel built on top of the WhatsApp clip.
          Drop the source video at remotion/public/reel.mp4.
          Source clip is ~161.38s; 161.38 * 30 ≈ 4841 frames. */}
      <Composition
        id="CaptionedReel"
        component={CaptionedReel}
        durationInFrames={4841}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ src: "reel.mp4" }}
      />
    </>
  );
};
