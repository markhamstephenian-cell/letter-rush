import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(145deg, #1e2436 0%, #161a28 100%)",
          position: "relative",
        }}
      >
        {/* Subtle corner accent */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 60,
            height: 60,
            background: "linear-gradient(225deg, rgba(212,165,116,0.15) 0%, transparent 70%)",
            display: "flex",
          }}
        />
        {/* Top number */}
        <span
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: "#d4a574",
            fontFamily: "Georgia, 'Times New Roman', serif",
            lineHeight: 1,
            textShadow: "0 1px 8px rgba(212,165,116,0.3)",
          }}
        >
          6
        </span>
        {/* Divider */}
        <div
          style={{
            width: 42,
            height: 2,
            borderRadius: 1,
            background: "rgba(212,165,116,0.4)",
            margin: "-1px 0",
            display: "flex",
          }}
        />
        {/* Label */}
        <span
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: "rgba(245, 240, 232, 0.7)",
            letterSpacing: 1.5,
            marginTop: 1,
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
          }}
        >
          in 60
        </span>
        {/* Bottom accent line */}
        <div
          style={{
            position: "absolute",
            bottom: 16,
            width: 30,
            height: 2,
            borderRadius: 1,
            background: "rgba(212,165,116,0.25)",
            display: "flex",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
