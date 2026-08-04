import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#0a0c10",
          border: "8px solid #c8f000",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 28,
            top: 32,
            color: "#ffffff",
            fontSize: 78,
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
            left: 88,
            top: 32,
            color: "#ffffff",
            fontSize: 78,
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
            right: 22,
            bottom: 22,
            width: 42,
            height: 42,
            borderRadius: 999,
            background: "#c8f000",
          }}
        />
      </div>
    ),
    size,
  );
}
