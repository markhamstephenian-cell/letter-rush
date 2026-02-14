import { ImageResponse } from "next/og";

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
        {/* Ring */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 105,
            height: 105,
            borderRadius: "50%",
            border: "2.5px solid rgba(212, 165, 116, 0.35)",
            background: "radial-gradient(circle, rgba(212,165,116,0.08) 0%, transparent 70%)",
          }}
        >
          <span
            style={{
              fontSize: 68,
              fontWeight: 700,
              color: "#d4a574",
              fontFamily: "Georgia, 'Times New Roman', serif",
              lineHeight: 1,
              marginTop: -2,
              textShadow: "0 1px 8px rgba(212,165,116,0.3)",
            }}
          >
            L
          </span>
        </div>
        {/* Label */}
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: "rgba(245, 240, 232, 0.65)",
            letterSpacing: 5,
            marginTop: 7,
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
          }}
        >
          RUSH
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
