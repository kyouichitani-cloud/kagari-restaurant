"use client";

import { X } from "@phosphor-icons/react";
import { useEffect, useRef } from "react";
import { privacySettings } from "@/content/privacy";

type PrivacyPolicyDialogProps = {
  open: boolean;
  onClose: () => void;
};

export function PrivacyPolicyDialog({ open, onClose }: PrivacyPolicyDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className="privacy-dialog"
      aria-labelledby="privacy-dialog-title"
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClose={onClose}
    >
      <header className="privacy-dialog-header">
        <div>
          <h2 id="privacy-dialog-title">個人情報保護方針</h2>
          <p>更新日：{privacySettings.updatedAt}</p>
        </div>
        <button type="button" onClick={onClose} aria-label="プライバシーポリシーを閉じる"><X size={24} aria-hidden="true" /></button>
      </header>
      <div className="privacy-dialog-body">
        <p>KAGARIは、ご予約に必要な個人情報を必要な範囲で取り扱います。</p>
        <p className="privacy-demo-notice">{privacySettings.onlineReservationNotice}</p>

        <section><h3>取得する情報</h3><p>氏名、電話番号、メールアドレス、予約日時、利用人数、コース、ドリンク、記念日ケーキ、アレルギーや苦手な食材、プレートメッセージ、その他の要望を入力いただく場合があります。</p></section>
        <section><h3>利用目的</h3><p>予約受付・確認・変更・キャンセルへの対応、来店前後の連絡、安全な料理提供とアレルギー対応、お問い合わせ対応、法令上必要な対応のために利用します。</p></section>
        <section><h3>健康に関する情報</h3><p>アレルギーや苦手な食材に関する情報は、予約対応と安全な料理提供のためにのみ利用し、宣伝や分析には使用しません。</p></section>
        <section><h3>第三者への提供</h3><p>本人の同意がある場合、法令に基づく場合、安全確保のため緊急に必要な場合を除き、第三者に提供しません。</p></section>
        <section><h3>外部サービスへの委託</h3><p>現在は入力内容を外部サービスへ送信していません。将来利用する場合は、委託先、利用目的、保存の扱いをお知らせします。</p></section>
        <section><h3>安全管理</h3><p>オンライン予約開始時には、アクセス制限、権限管理、通信の保護など、情報の漏えい・紛失・改ざんを防ぐ対策を講じます。</p></section>
        <section><h3>保存期間と削除</h3><p>現在のフォームは入力内容を送信・保存しません。運用開始後は必要な保存期間を定め、目的を終えた情報を安全に削除します。</p></section>
        <section><h3>開示・訂正・削除</h3><p>オンライン予約開始後は、開示、訂正、削除、利用停止などを希望される場合の受付窓口を設けます。</p></section>
        <section><h3>Cookie・アクセス解析</h3><p>現在、広告目的のCookieおよびアクセス解析ツールは使用していません。</p></section>
        <section><h3>お問い合わせ</h3><p>個人情報に関するお問い合わせ先は、正式な運営情報の確定後に掲載します。</p></section>
        <section><h3>方針の変更</h3><p>サービス内容や法令の変更に合わせて見直し、重要な変更は更新日と内容を変更してお知らせします。</p></section>
      </div>
      <footer className="privacy-dialog-footer">
        <button type="button" className="privacy-dialog-confirm" onClick={onClose}>確認して閉じる</button>
      </footer>
    </dialog>
  );
}
