import type { Metadata } from "next";
import { DemoContactForm } from "@/components/DemoContactForm";
import { KineticNavigation } from "@/components/KineticNavigation";
import { RestaurantFooter } from "@/components/RestaurantFooter";
import { privacySettings } from "@/content/privacy";

export const metadata: Metadata = {
  title: "KAGARI｜お問い合わせ",
  description: "KAGARIへのお問い合わせはこちらから。現在は送信・保存を行わないデモフォームです。",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <main id="top" className="contact-page">
      <a className="skip-link" href="#contact-content">お問い合わせフォームへ移動</a>
      <KineticNavigation />
      <article id="contact-content" className="contact-content" aria-labelledby="contact-title">
        <header className="contact-header">
          <h1 id="contact-title">お問い合わせ</h1>
          <p>ご予約前のご相談や、コース・記念日ケーキについてのご質問をお寄せください。</p>
        </header>
        <div className="contact-details" aria-label="デモ用連絡先">
          <div><span>デモ用メール</span><strong>{privacySettings.contactDemoEmail}</strong><small>{privacySettings.contactDemoEmailNote}</small></div>
          <div><span>電話窓口</span><strong>{privacySettings.contactPhoneNotice}</strong></div>
        </div>
        <DemoContactForm />
      </article>
      <RestaurantFooter />
    </main>
  );
}
