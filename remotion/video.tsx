import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  useVideoConfig,
  Easing,
} from "remotion";

export interface TypoVideoProps {
  lines: string[];
}

export const MyVideo: React.FC<TypoVideoProps> = ({ lines }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const FRAMES_PER_LINE = 60;
  const lineIndex = Math.floor(frame / FRAMES_PER_LINE);

  if (!lines || lines.length === 0) return null;
  if (lineIndex >= lines.length) return null;

  const lineProgress = frame % FRAMES_PER_LINE;

  const opacity = interpolate(
    lineProgress,
    [0, 12, 60, 74],
    [0, 1, 1, 0],
    {
      easing: Easing.ease,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const translateY = interpolate(
    lineProgress,
    [0, 18],
    [40, 0],
    {
      easing: Easing.out(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const scale = interpolate(
    lineProgress,
    [0, 18],
    [0.98, 1],
    {
      easing: Easing.out(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#FDF8F2", // Cream background
        justifyContent: "center",
        alignItems: "center",
        padding: "0 120px",
      }}
    >
      <div
        style={{
          color: "#991B1B", // Deep premium red
          fontSize: 92,
          fontWeight: 700,
          textAlign: "center",
          lineHeight: 1.2,
          letterSpacing: "-1px",
          opacity,
          transform: `translateY(${translateY}px) scale(${scale})`,
          maxWidth: "100%",
          wordWrap: "break-word",
          textShadow: "0px 4px 20px rgba(153, 27, 27, 0.08)",
        }}
      >
        {lines[lineIndex]}
      </div>
    </AbsoluteFill>
  );
};
