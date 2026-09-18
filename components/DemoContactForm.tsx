"use client";

import { ArrowLeft, CheckCircle, WarningCircle } from "@phosphor-icons/react";
import { FormEvent, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { privacySettings } from "@/content/privacy";

const inquiryTypes = ["予約について", "コース・料理について", "アレルギーについて", "記念日ケーキについて", "取材・法人利用", "その他"] as const;
type InquiryType = (typeof inquiryTypes)[number] | "";
type ContactValues = { inquiryType: InquiryType; name: string; email: string; phone: string; message: string; privacy: boolean };
type ContactField = keyof ContactValues;
type ContactErrors = Partial<Record<ContactField, string>>;
type ContactStep = "input" | "review" | "success";

const initialValues: ContactValues = { inquiryType: "", name: "", email: "", phone: "", message: "", privacy: false };

function validate(values: ContactValues): ContactErrors {
  const errors: ContactErrors = {};
  if (!values.inquiryType) errors.inquiryType = "お問い合わせ種別を選択してください。";
  if (!values.name.trim()) errors.name = "お名前を入力してください。";
  else if (values.name.trim().length > 80) errors.name = "お名前は80文字以内で入力してください。";
  if (!values.email.trim()) errors.email = "メールアドレスを入力してください。";
  else if (values.email.length > 254) errors.email = "メールアドレスは254文字以内で入力してください。";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = "メールアドレスの形式を確認してください。";
  if (values.phone.length > 40) errors.phone = "電話番号は40文字以内で入力してください。";
  if (!values.message.trim()) errors.message = "お問い合わせ内容を入力してください。";
  else if (values.message.trim().length > 2000) errors.message = "お問い合わせ内容は2,000文字以内で入力してください。";
  if (!values.privacy) errors.privacy = "プライバシーポリシーへの同意が必要です。";
  return errors;
}

function receiptNumber() {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Tokyo", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date());
  const date = ["year", "month", "day"].map((type) => parts.find((part) => part.type === type)?.value ?? "").join("");
  return `KGR-${date}-${Math.floor(1000 + Math.random() * 9000)}`;
}

export function DemoContactForm() {
  const [values, setValues] = useState<ContactValues>(initialValues);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [step, setStep] = useState<ContactStep>("input");
  const [receipt, setReceipt] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);

  const update = <K extends ContactField>(field: K, value: ContactValues[K]) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const focusTop = () => requestAnimationFrame(() => panelRef.current?.focus());
  const review = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    const firstError = Object.keys(nextErrors)[0] as ContactField | undefined;
    if (firstError) {
      requestAnimationFrame(() => document.getElementById(firstError === "privacy" ? "contact-privacy" : `contact-${firstError}`)?.focus());
      return;
    }
    setStep("review");
    focusTop();
  };

  const startOver = () => {
    setValues(initialValues);
    setErrors({});
    setReceipt("");
    setStep("input");
    focusTop();
  };

  if (step === "success") {
    return (
      <section ref={panelRef} className="contact-complete" tabIndex={-1} aria-labelledby="contact-complete-title">
        <CheckCircle size={36} weight="light" aria-hidden="true" />
        <h2 id="contact-complete-title">お問い合わせを受け付けました</h2>
        <p>こちらはデモ画面のため、入力内容は実際には送信されていません。</p>
        <p className="contact-receipt"><span>デモ用受付番号</span><strong>{receipt}</strong></p>
        <Button type="button" variant="quiet" onClick={startOver}>新しいお問い合わせを入力する</Button>
      </section>
    );
  }

  if (step === "review") {
    return (
      <section ref={panelRef} className="contact-review" tabIndex={-1} aria-labelledby="contact-review-title">
        <p className="contact-stage">入力内容の確認</p>
        <h2 id="contact-review-title">この内容でよろしいですか？</h2>
        <p className="contact-demo-notice">{privacySettings.contactFormNotice}</p>
        <dl>
          <div><dt>お問い合わせ種別</dt><dd>{values.inquiryType}</dd></div>
          <div><dt>お名前</dt><dd>{values.name}</dd></div>
          <div><dt>メールアドレス</dt><dd>{values.email}</dd></div>
          <div><dt>電話番号</dt><dd>{values.phone || "入力なし"}</dd></div>
          <div><dt>お問い合わせ内容</dt><dd>{values.message}</dd></div>
        </dl>
        <div className="contact-actions">
          <Button type="button" variant="quiet" onClick={() => { setStep("input"); focusTop(); }}><ArrowLeft size={17} aria-hidden="true" />修正する</Button>
          <Button type="button" variant="ivory" onClick={() => { setReceipt(receiptNumber()); setStep("success"); focusTop(); }}>デモ送信する</Button>
        </div>
      </section>
    );
  }

  return (
    <div ref={panelRef} className="contact-form-panel" tabIndex={-1}>
      {Object.keys(errors).length > 0 && <div className="contact-error-summary" role="alert"><WarningCircle size={22} aria-hidden="true" /><p>入力内容を確認してください。各項目の下に修正方法を表示しています。</p></div>}
      <p className="contact-demo-notice">{privacySettings.contactFormNotice}</p>
      <form className="contact-form" noValidate onSubmit={review}>
        <div className="contact-field">
          <label htmlFor="contact-inquiryType">お問い合わせ種別 <span className="required-badge">必須</span></label>
          <select id="contact-inquiryType" name="inquiryType" value={values.inquiryType} aria-invalid={Boolean(errors.inquiryType)} aria-describedby={errors.inquiryType ? "contact-inquiryType-error" : undefined} onChange={(event) => update("inquiryType", event.target.value as InquiryType)}>
            <option value="">選択してください</option>
            {inquiryTypes.map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
          {errors.inquiryType && <p id="contact-inquiryType-error" className="field-error" role="alert">{errors.inquiryType}</p>}
        </div>
        <div className="contact-field-grid">
          <div className="contact-field"><label htmlFor="contact-name">お名前 <span className="required-badge">必須</span></label><input id="contact-name" name="name" autoComplete="name" maxLength={80} value={values.name} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "contact-name-error" : undefined} onChange={(event) => update("name", event.target.value)} />{errors.name && <p id="contact-name-error" className="field-error" role="alert">{errors.name}</p>}</div>
          <div className="contact-field"><label htmlFor="contact-email">メールアドレス <span className="required-badge">必須</span></label><input id="contact-email" name="email" type="email" inputMode="email" autoComplete="email" maxLength={254} value={values.email} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "contact-email-error" : undefined} onChange={(event) => update("email", event.target.value)} />{errors.email && <p id="contact-email-error" className="field-error" role="alert">{errors.email}</p>}</div>
        </div>
        <div className="contact-field"><label htmlFor="contact-phone">電話番号 <span className="optional-badge">任意</span></label><input id="contact-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" maxLength={40} value={values.phone} aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? "contact-phone-error" : undefined} onChange={(event) => update("phone", event.target.value)} />{errors.phone && <p id="contact-phone-error" className="field-error" role="alert">{errors.phone}</p>}</div>
        <div className="contact-field"><label htmlFor="contact-message">お問い合わせ内容 <span className="required-badge">必須</span></label><textarea id="contact-message" name="message" rows={8} maxLength={2000} value={values.message} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? "contact-message-error" : undefined} onChange={(event) => update("message", event.target.value)} />{errors.message && <p id="contact-message-error" className="field-error" role="alert">{errors.message}</p>}</div>
        <div className="contact-consent">
          <label className="privacy-check" htmlFor="contact-privacy"><input id="contact-privacy" name="privacy" type="checkbox" checked={values.privacy} aria-invalid={Boolean(errors.privacy)} aria-describedby={errors.privacy ? "contact-privacy-error" : undefined} onChange={(event) => update("privacy", event.target.checked)} /><span><a href="/privacy" target="_blank" rel="noopener noreferrer">プライバシーポリシー</a>を確認し、お問い合わせに必要な個人情報の取り扱いに同意します。 <span className="required-badge">必須</span></span></label>
          {errors.privacy && <p id="contact-privacy-error" className="field-error" role="alert">{errors.privacy}</p>}
        </div>
        <div className="contact-submit"><Button type="submit" variant="ivory" size="large">入力内容を確認する</Button></div>
      </form>
    </div>
  );
}
