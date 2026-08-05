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
          alignItems: "center",
          justifyContent: "center",
          background: "#c8f000",
          borderRadius: 999,
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            color: "#0a0c10",
            fontSize: 15,
            fontWeight: 800,
            letterSpacing: "-0.08em",
            fontFamily: "system-ui, sans-serif",
            lineHeight: 1,
          }}
        >
          FU
        </div>
      </div>
    ),
    size,
  );
}
