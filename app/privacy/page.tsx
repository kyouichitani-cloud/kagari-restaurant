import type { Metadata } from "next";
import Link from "next/link";
import { KineticNavigation } from "@/components/KineticNavigation";
import { RestaurantFooter } from "@/components/RestaurantFooter";
import { privacySettings } from "@/content/privacy";

export const metadata: Metadata = {
  title: "KAGARI｜個人情報保護方針",
  description: "KAGARIの予約フォームにおける個人情報の取り扱いについてご案内します。",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <main id="top" className="privacy-page">
      <a className="skip-link" href="#privacy-content">本文へ移動</a>
      <KineticNavigation />
      <article id="privacy-content" className="privacy-content" aria-labelledby="privacy-title">
        <header className="privacy-header">
          <p className="section-kicker">KAGARI</p>
          <h1 id="privacy-title">個人情報保護方針</h1>
          <p className="privacy-updated">更新日：{privacySettings.updatedAt}</p>
          <p>KAGARIは、ご予約を検討される方が安心して情報を入力できるよう、個人情報を必要な範囲で丁寧に取り扱います。このページでは、現在の予約フォームで扱う情報と、その考え方を分かりやすくお知らせします。</p>
          <p className="privacy-demo-notice">{privacySettings.onlineReservationNotice}</p>
        </header>

        <section><h2>取得する情報</h2><p>予約フォームでは、氏名、電話番号、メールアドレス、予約日時、利用人数、選択コース、ドリンク、記念日ケーキ、アレルギーや苦手な食材、プレートメッセージ、その他の要望を入力いただく場合があります。</p></section>
        <section><h2>利用目的</h2><p>いただいた情報は、予約受付、予約確認、変更、キャンセルへの対応、来店前後の必要な連絡、安全な料理提供とアレルギー対応、利用者からのお問い合わせへの対応、法令上必要な対応のために利用します。広告メールの配信や、これらと無関係な営業には利用しません。</p></section>
        <section><h2>アレルギー等の健康に関する情報</h2><p>アレルギーや苦手な食材に関する情報は、予約対応と安全な料理提供のためにのみ取得・利用します。宣伝や分析には使用しません。現在のフォームでは、アレルギー等を入力した場合に、この目的での取り扱いへの同意を個別にお願いしています。</p></section>
        <section><h2>第三者への提供</h2><p>本人の同意がある場合、法令に基づく場合、安全確保のため緊急に必要な場合を除き、第三者に提供しません。</p></section>
        <section><h2>外部サービスへの委託</h2><p>現在のKAGARIの予約フォームはオンライン予約機能の準備中であり、入力内容を外部サービスへ送信する運用は行っていません。将来、予約管理や連絡のために外部サービスを利用する場合は、委託先、利用目的、保存の扱いをこのページでお知らせします。</p></section>
        <section><h2>安全管理</h2><p>オンライン予約を開始する際は、必要なアクセス制限、権限管理、通信の保護など、情報の漏えい、紛失、改ざんを防ぐための対策を講じます。取り扱いに関わる人も、必要な範囲に限って情報を扱います。</p></section>
        <section><h2>保存期間と削除</h2><p>現在の予約フォームは入力内容を送信・保存しません。オンライン予約開始後は、予約対応と法令上の必要性に応じた保存期間を定め、目的を終えた情報は安全な方法で削除または利用できない状態にします。</p></section>
        <section><h2>開示・訂正・削除等の請求</h2><p>オンライン予約開始後は、ご自身の情報について、開示、訂正、削除、利用停止などを希望される場合の受付窓口を設けます。現在はお問い合わせ先の正式情報を準備中のため、公開後にこのページへ掲載します。</p></section>
        <section><h2>Cookie・アクセス解析</h2><p>現在、広告目的のCookieおよびアクセス解析ツールは使用していません。</p></section>
        <section><h2>お問い合わせ窓口</h2><p>個人情報に関するお問い合わせ先は、正式な運営情報の確定後に掲載します。現在の設定状況は以下のとおりです。</p><dl className="privacy-contact-list"><div><dt>運営者名</dt><dd>{privacySettings.operatorName ?? "公開準備中"}</dd></div><div><dt>問い合わせ用メールアドレス</dt><dd>{privacySettings.contactEmail ?? "公開準備中"}</dd></div><div><dt>問い合わせ用電話番号</dt><dd>{privacySettings.contactPhone ?? "公開準備中"}</dd></div></dl></section>
        <section><h2>ポリシーの変更</h2><p>この方針は、サービスの開始や内容の変更、法令の改正などに合わせて見直すことがあります。重要な変更がある場合は、このページの更新日と内容を変更してお知らせします。</p></section>
        <Link className="privacy-return-link" href="/#reservation">予約フォームへ戻る</Link>
      </article>
      <RestaurantFooter />
    </main>
  );
}
