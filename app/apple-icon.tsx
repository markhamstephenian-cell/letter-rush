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
          background: "linear-gradient(135deg, #1a1f2e 0%, #242938 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 110,
            height: 110,
            borderRadius: "50%",
            border: "3px solid rgba(212, 165, 116, 0.3)",
          }}
        >
          <span
            style={{
              fontSize: 72,
              fontWeight: 700,
              color: "#d4a574",
              fontFamily: "Georgia, serif",
              lineHeight: 1,
              marginTop: -4,
            }}
          >
            L
          </span>
        </div>
        <span
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "rgba(245, 240, 232, 0.7)",
            letterSpacing: 4,
            marginTop: 6,
          }}
        >
          RUSH
        </span>
      </div>
    ),
    { ...size },
  );
}
