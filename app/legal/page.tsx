import Link from "next/link";

export default function Legal() {
  return (
    <main className="policy-page">
      <p className="section-label">LEGAL NOTICE</p>
      <h1>特定商取引法に基づく表記</h1>
      <dl>
        <div><dt>販売事業者</dt><dd>株式会社 篝</dd></div>
        <div><dt>運営責任者</dt><dd>髙瀬 直人</dd></div>
        <div><dt>所在地</dt><dd>東京都中央区銀座8丁目7番19号 銀座三鈴ビル3階</dd></div>
        <div><dt>電話番号</dt><dd>03-6263-8817</dd></div>
        <div><dt>料金</dt><dd>おまかせ33,000円（税込）とサービス料10%。1名様あたり36,300円、複数名の合計額は予約確認画面に表示します。</dd></div>
        <div><dt>キャンセル</dt><dd>ご来店7日前より50%、3日前より100%。人数減も同様です。</dd></div>
        <div><dt>支払方法</dt><dd>店頭でのクレジットカード決済</dd></div>
      </dl>
      <p className="verification-note">販売事業者、運営責任者、所在地、電話番号、料金、キャンセル規定は実在確認後に確定します。</p>
      <Link href="/">戻る</Link>
    </main>
  );
}
