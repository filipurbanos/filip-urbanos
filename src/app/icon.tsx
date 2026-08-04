import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#0a0c10",
          border: "1.5px solid #c8f000",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 4,
            top: 5,
            color: "#ffffff",
            fontSize: 14,
            fontWeight: 800,
            letterSpacing: "-0.06em",
            fontFamily: "system-ui, sans-serif",
            lineHeight: 1,
          }}
        >
          F
        </div>
        <div
          style={{
            position: "absolute",
            left: 14,
            top: 5,
            color: "#ffffff",
            fontSize: 14,
            fontWeight: 800,
            letterSpacing: "-0.06em",
            fontFamily: "system-ui, sans-serif",
            lineHeight: 1,
          }}
        >
          U
        </div>
        <div
          style={{
            position: "absolute",
            right: 3,
            bottom: 3,
            width: 8,
            height: 8,
            borderRadius: 999,
            background: "#c8f000",
          }}
        />
      </div>
    ),
    size,
  );
}
