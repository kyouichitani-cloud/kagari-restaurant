import "./globals.css";
import type { CSSProperties } from "react";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { GlobalMotion } from "@/components/GlobalMotion";
import { withBasePath } from "@/content/paths";
import { publicationReady, siteUrl } from "@/content/site";

const kagariSans = localFont({
  src: "../public/fonts/kagari-sans.woff2",
  display: "swap",
  variable: "--font-kagari-sans",
  weight: "100 900",
});

const shareImagePath = "/share/kagari-course-v2.png";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "KAGARI｜記念日に楽しむフレンチコース",
  description: "KAGARIは、3つのコースから選べるフレンチダイニングです。",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "/",
    siteName: "KAGARI",
    title: "KAGARI｜記念日に楽しむフレンチコース",
    description: "KAGARIは、3つのコースから選べるフレンチダイニングです。",
    images: [{ url: shareImagePath, width: 1200, height: 630, alt: "KAGARIの料理と落ち着いた店内" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "KAGARI｜記念日に楽しむフレンチコース",
    description: "KAGARIは、3つのコースから選べるフレンチダイニングです。",
    images: [shareImagePath],
  },
  robots: {
    index: publicationReady,
    follow: publicationReady,
    googleBot: {
      index: publicationReady,
      follow: publicationReady,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
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
