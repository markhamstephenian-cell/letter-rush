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
          background: "linear-gradient(135deg, #1a1f2e 0%, #242938 100%)",
          borderRadius: 108,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 310,
            height: 310,
            borderRadius: "50%",
            border: "8px solid rgba(212, 165, 116, 0.3)",
          }}
        >
          <span
            style={{
              fontSize: 200,
              fontWeight: 700,
              color: "#d4a574",
              fontFamily: "Georgia, serif",
              lineHeight: 1,
              marginTop: -10,
            }}
          >
            L
          </span>
        </div>
        <span
          style={{
            fontSize: 36,
            fontWeight: 600,
            color: "rgba(245, 240, 232, 0.7)",
            letterSpacing: 12,
            marginTop: 20,
          }}
        >
          RUSH
        </span>
      </div>
    ),
    { ...size },
  );
}
