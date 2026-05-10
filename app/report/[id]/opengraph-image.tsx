import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "StackSpend AI savings report";
export const size = {
  width: 1200,
  height: 630
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          color: "#fff8ea",
          background: "linear-gradient(135deg, #1b1509 0%, #070706 52%, #0b1a16 100%)"
        }}
      >
        <div style={{ fontSize: 34, fontWeight: 800, color: "#f4dca4" }}>StackSpend</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 76, fontWeight: 900, lineHeight: 0.96 }}>This startup wastes $11,280/year on AI tools.</div>
          <div style={{ marginTop: 28, fontSize: 30, color: "#d8d0c2" }}>AI spend score, benchmarks, and optimization timeline.</div>
        </div>
        <div style={{ display: "flex", gap: 20, fontSize: 24 }}>
          <div style={{ border: "1px solid rgba(244, 220, 164, 0.28)", borderRadius: 24, padding: "18px 24px", background: "rgba(244, 220, 164, 0.08)" }}>$940/mo savings</div>
          <div style={{ border: "1px solid rgba(244, 220, 164, 0.28)", borderRadius: 24, padding: "18px 24px", background: "rgba(244, 220, 164, 0.08)" }}>72/100 score</div>
          <div style={{ border: "1px solid rgba(244, 220, 164, 0.28)", borderRadius: 24, padding: "18px 24px", background: "rgba(244, 220, 164, 0.08)" }}>34% above peers</div>
        </div>
      </div>
    ),
    size
  );
}
