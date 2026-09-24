import "./globals.css";
import type { CSSProperties } from "react";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { GlobalMotion } from "@/components/GlobalMotion";
import { ReloadScrollReset } from "@/components/ReloadScrollReset";
import { withBasePath } from "@/content/paths";

const kagariSans = localFont({
  src: "../public/fonts/kagari-sans.woff2",
  display: "swap",
  variable: "--font-kagari-sans",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://kagari-restaurant.vercel.app"),
  title: "KAGARI｜記念日に楽しむフレンチコース",
  description: "KAGARIは、3つのコースから選べるフレンチダイニングです。",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#050A0F", colorScheme: "dark", viewportFit: "cover" };

const initialScrollReset = `
  if (!window.location.hash) {
    if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
  }
`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const style = { "--kagari-grain-image": `url("${withBasePath("/images/texture/ink-grain.png")}")` } as CSSProperties;
  return <html lang="ja"><head><script dangerouslySetInnerHTML={{ __html: initialScrollReset }} /></head><body className={kagariSans.variable} style={style}><ReloadScrollReset /><GlobalMotion />{children}</body></html>;
}
