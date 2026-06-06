import { Composition } from "remotion";
import { RecordIntro } from "./RecordIntro";

// Every video in the project is declared here as a <Composition>.
export const RemotionRoot: React.FC = () => {
  return (
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
  );
};
