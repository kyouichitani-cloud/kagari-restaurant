import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "76px", background: "#081A2B", color: "#F3EEE5" }}>
      <div style={{ display: "flex", flexDirection: "column" }}><span style={{ display: "flex", fontSize: 108, lineHeight: 1, letterSpacing: "0.08em" }}>KAGARI</span><span style={{ display: "flex", marginTop: 22, color: "#C4A16B", fontSize: 22, letterSpacing: "0.2em" }}>フレンチダイニング</span></div>
      <span style={{ display: "flex", fontSize: 42, lineHeight: 1.35 }}>記念日に楽しむフレンチコース</span>
    </div>,
  );
}
