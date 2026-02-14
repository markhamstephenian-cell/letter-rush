import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 512,
          height: 512,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(145deg, #1e2436 0%, #161a28 100%)",
          borderRadius: 108,
          position: "relative",
        }}
      >
        {/* Corner accent */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 170,
            height: 170,
            borderRadius: "0 108px 0 0",
            background: "linear-gradient(225deg, rgba(212,165,116,0.12) 0%, transparent 70%)",
            display: "flex",
          }}
        />
        {/* Ring */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 300,
            height: 300,
            borderRadius: "50%",
            border: "7px solid rgba(212, 165, 116, 0.35)",
            background: "radial-gradient(circle, rgba(212,165,116,0.08) 0%, transparent 70%)",
          }}
        >
          <span
            style={{
              fontSize: 195,
              fontWeight: 700,
              color: "#d4a574",
              fontFamily: "Georgia, 'Times New Roman', serif",
              lineHeight: 1,
              marginTop: -8,
              textShadow: "0 2px 16px rgba(212,165,116,0.3)",
            }}
          >
            L
          </span>
        </div>
        {/* Label */}
        <span
          style={{
            fontSize: 34,
            fontWeight: 700,
            color: "rgba(245, 240, 232, 0.65)",
            letterSpacing: 14,
            marginTop: 18,
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
          }}
        >
          RUSH
        </span>
        {/* Bottom accent line */}
        <div
          style={{
            position: "absolute",
            bottom: 50,
            width: 80,
            height: 4,
            borderRadius: 2,
            background: "rgba(212,165,116,0.25)",
            display: "flex",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
