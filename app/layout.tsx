import "./globals.css";
import type { CSSProperties } from "react";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { GlobalMotion } from "@/components/GlobalMotion";
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
  var navigationEntry = performance.getEntriesByType("navigation")[0];
  var isReload = (navigationEntry && navigationEntry.type === "reload") ||
    (performance.navigation && performance.navigation.type === 1);
  var forceTop = false;
  try {
    forceTop = sessionStorage.getItem("kagari-force-top") === "1";
    sessionStorage.removeItem("kagari-force-top");
  } catch (error) {}
  if ((isReload || forceTop) && window.location.hash) {
    window.history.replaceState(window.history.state, "", window.location.pathname + window.location.search);
  }
  if (isReload || forceTop || !window.location.hash) {
    if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }
`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const style = { "--kagari-grain-image": `url("${withBasePath("/images/texture/ink-grain.png")}")` } as CSSProperties;
  return <html lang="ja"><head><script dangerouslySetInnerHTML={{ __html: initialScrollReset }} /></head><body className={kagariSans.variable} style={style}><GlobalMotion />{children}</body></html>;
}
