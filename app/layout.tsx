import "./globals.css";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "KAGARI｜記念日に楽しむフレンチコース",
  description: "KAGARIは、若いカップルや夫婦が記念日や少し特別な日に気負わず楽しめるフレンチダイニングです。",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#081A2B", colorScheme: "dark", viewportFit: "cover" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ja"><body>{children}</body></html>;
}
