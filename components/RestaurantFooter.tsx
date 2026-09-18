import Link from "next/link";
import { siteContent } from "@/content/french-restaurant";

export function RestaurantFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-main"><p>{siteContent.brand.name}</p><span>{siteContent.brand.descriptor}</span></div>
      <nav aria-label="フッターナビゲーション"><Link href="/courses">コース料理</Link><Link href="/#access">店舗情報</Link><Link href="/#reservation">ご予約</Link>{siteContent.details.instagram.url && <a href={siteContent.details.instagram.url} target="_blank" rel="noopener noreferrer">Instagram <span aria-hidden="true">↗</span></a>}</nav>
      <p className="footer-note">掲載情報はデモ用の仮データです。<br />© {new Date().getFullYear()} {siteContent.brand.name}</p>
    </footer>
  );
}
