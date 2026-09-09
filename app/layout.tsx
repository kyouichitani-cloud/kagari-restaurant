import "./globals.css";
import type { Metadata, Viewport } from "next";
import { publicationReady, siteUrl } from "@/content/site";

const scrollBootstrap = `(() => {
  try {
    if (sessionStorage.getItem("kagari-entered") === "1") document.documentElement.dataset.revisit = "true";
  } catch {}
  const historyState = window.history;
  try { historyState.scrollRestoration = "manual"; } catch {}
  const navigation = window.performance?.getEntriesByType?.("navigation")[0];
  const navigationType = navigation?.type || (window.performance?.navigation?.type === 1 ? "reload" : "navigate");
  const reset = () => window.scrollTo(0, 0);
  if (navigationType === "navigate" || navigationType === "reload") reset();
  if (navigationType === "reload") {
    window.addEventListener("pageshow", (event) => { if (!event.persisted) reset(); }, { once: true });
  }
})();`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "篝 KAGARI | 銀座八丁目の日本料理", template: "%s | 篝 KAGARI" },
  description: "銀座八丁目、檜カウンター八席の日本料理 篝。夜二部制、おまかせ一コース。季節の献立とご予約はこちらから。",
  keywords: ["銀座 日本料理", "銀座 懐石", "東京 日本料理", "篝", "KAGARI"],
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "ja_JP", url: "/", siteName: "篝 KAGARI", title: "篝 KAGARI | 銀座八丁目の日本料理", description: "檜カウンター八席。季節と火入れを一皿ずつ。", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "篝 KAGARI" }] },
  twitter: { card: "summary_large_image", title: "篝 KAGARI | 銀座八丁目の日本料理", description: "檜カウンター八席。季節と火入れを一皿ずつ。", images: ["/opengraph-image"] },
  robots: publicationReady ? { index: true, follow: true } : { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#101211",
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <head><script dangerouslySetInnerHTML={{ __html: scrollBootstrap }} /></head>
      <body>{children}</body>
    </html>
  );
}
