import { ImageResponse } from "next/og";

export const dynamic = "force-static";

export function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://kagari-restaurant.vercel.app";
  const heroUrl = new URL("images/french/hero-source.png", `${siteUrl.replace(/\/$/, "")}/`).toString();

  return new ImageResponse(
    <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", overflow: "hidden", background: "#050A0F", color: "#F3EEE5" }}>
      {/* next/image cannot render inside ImageResponse. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={heroUrl} alt="" width="1200" height="630" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 58%" }} />
      <div style={{ position: "absolute", inset: 0, display: "flex", background: "linear-gradient(90deg, rgba(5,10,15,.88) 0%, rgba(5,10,15,.52) 38%, rgba(5,10,15,.08) 72%, rgba(5,10,15,.18) 100%)" }} />
      <div style={{ position: "relative", width: "100%", display: "flex", flexDirection: "column", padding: "68px 72px" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ display: "flex", fontSize: 72, lineHeight: 1, letterSpacing: "0.08em" }}>KAGARI</span>
          <span style={{ display: "flex", marginTop: 18, color: "#D8B46F", fontSize: 22, letterSpacing: "0.18em" }}>フレンチダイニング</span>
        </div>
      </div>
    </div>,
    { width: 1200, height: 630, headers: { "Cache-Control": "public, max-age=31536000, immutable" } },
  );
}
