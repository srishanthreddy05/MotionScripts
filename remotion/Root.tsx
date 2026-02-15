import { Composition } from "remotion";
import { MyVideo, TypoVideoProps } from "./video";

const defaultLines = [
  "Enter your script"
];

const FRAMES_PER_LINE = 60;
const FPS = 30;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="TypoVideo"
        component={MyVideo as React.FC<any>}
        durationInFrames={defaultLines.length * FRAMES_PER_LINE}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{
          lines: defaultLines,
        }}
      />
    </>
  );
};
