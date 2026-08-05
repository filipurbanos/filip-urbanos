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
          alignItems: "center",
          justifyContent: "center",
          background: "#c8f000",
          borderRadius: 999,
          position: "relative",
        }}
      >
        {/* left seam */}
        <div
          style={{
            position: "absolute",
            left: 22,
            top: 28,
            width: 42,
            height: 124,
            border: "7px solid #0a0c10",
            borderRight: "none",
            borderRadius: "999px 0 0 999px",
            boxSizing: "border-box",
          }}
        />
        {/* right seam */}
        <div
          style={{
            position: "absolute",
            right: 22,
            top: 28,
            width: 42,
            height: 124,
            border: "7px solid #0a0c10",
            borderLeft: "none",
            borderRadius: "0 999px 999px 0",
            boxSizing: "border-box",
          }}
        />
        <div
          style={{
            display: "flex",
            color: "#0a0c10",
            fontSize: 78,
            fontWeight: 800,
            letterSpacing: "-0.06em",
            fontFamily: "system-ui, sans-serif",
            lineHeight: 1,
            zIndex: 1,
          }}
        >
          FU
        </div>
      </div>
    ),
    size,
  );
}
