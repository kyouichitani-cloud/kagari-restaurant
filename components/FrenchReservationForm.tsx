"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle, WarningCircle } from "@phosphor-icons/react";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { isCourseId, siteContent } from "@/content/french-restaurant";
import { privacySettings } from "@/content/privacy";

type FormState = "idle" | "editing" | "review" | "submitting" | "success" | "error";
type MobileStep = 1 | 2 | 3 | 4;
type FormValues = {
  date: string;
  time: string;
  guests: string;
  name: string;
  kana: string;
  phone: string;
  email: string;
  course: string;
  drink: string;
  cake: "" | "yes" | "no";
  cakeName: string;
  cakeMessage: string;
  occasion: string;
  cakeOther: string;
  allergies: string;
  requests: string;
  privacy: boolean;
  healthConsent: boolean;
};

const initialValues: FormValues = {
  date: "", time: "", guests: "", name: "", kana: "", phone: "", email: "",
  course: "", drink: "", cake: "", cakeName: "", cakeMessage: "", occasion: "",
  cakeOther: "", allergies: "", requests: "", privacy: false, healthConsent: false,
};

const mobileStepLabels = ["日時と人数", "コース", "追加オプション", "お客様情報・確認"] as const;
const mobileStepFields: Record<MobileStep, (keyof FormValues)[]> = {
  1: ["date", "time", "guests"],
  2: ["course"],
  3: ["drink", "cake", "cakeName", "cakeMessage"],
  4: ["name", "kana", "phone", "email", "allergies", "requests", "privacy", "healthConsent"],
};

function validate(values: FormValues) {
  const errors: Partial<Record<keyof FormValues, string>> = {};
  if (!values.date) errors.date = "予約希望日を選択してください。";
  if (!values.time) errors.time = "予約希望時間を入力してください。";
  if (!values.guests || Number(values.guests) < 1) errors.guests = "利用人数を1名以上で入力してください。";
  if (!values.name.trim()) errors.name = "代表者名を入力してください。";
  if (!values.kana.trim()) errors.kana = "ふりがなを入力してください。";
  else if (!/^[ぁ-んー\s]+$/.test(values.kana)) errors.kana = "ふりがなは、ひらがなで入力してください。";
  if (!values.phone.trim()) errors.phone = "電話番号を入力してください。";
  else if (!/^[0-9+()\-\s]{10,20}$/.test(values.phone)) errors.phone = "連絡可能な電話番号を数字で入力してください。";
  if (!values.email.trim()) errors.email = "メールアドレスを入力してください。";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = "メールアドレスの形式を確認してください。";
  if (!values.course) errors.course = "希望するコースを選択してください。";
  if (!values.drink) errors.drink = "ドリンク単品または飲み放題を選択してください。";
  if (!values.cake) errors.cake = "記念日ケーキの希望を選択してください。";
  if (values.cake === "yes") {
    if (!values.cakeName.trim()) errors.cakeName = "ケーキに添えるお名前を入力してください。";
    if (!values.cakeMessage.trim()) errors.cakeMessage = "プレートに入れるメッセージを入力してください。";
  }
  if (!values.privacy) errors.privacy = "プライバシーポリシーへの同意が必要です。";
  if (values.allergies.trim() && !values.healthConsent) errors.healthConsent = "健康に関する情報の取り扱いへの同意が必要です。";
  return errors;
}

function Required() { return <span className="required-badge">必須</span>; }
function Optional() { return <span className="optional-badge">任意</span>; }

export function FrenchReservationForm() {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({});
  const [status, setStatus] = useState<FormState>("idle");
  const [mobileStep, setMobileStep] = useState<MobileStep>(1);
  const reduceMotion = useReducedMotion();
  const formTopRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const requestedCourse = new URLSearchParams(window.location.search).get("course");
    if (!isCourseId(requestedCourse)) return;
    const frame = window.requestAnimationFrame(() => {
      setValues((current) => current.course ? current : { ...current, course: requestedCourse });
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const courseName = useMemo(() => siteContent.courses.find((course) => course.id === values.course)?.name ?? "", [values.course]);
  const drinkName = useMemo(() => siteContent.drinks.find((drink) => drink.id === values.drink)?.label ?? "", [values.drink]);

  const update = <K extends keyof FormValues>(key: K, value: FormValues[K]) => {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    setStatus("editing");
  };

  const scrollToFormTop = () => formTopRef.current?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });

  const focusFirstError = (stepErrors: Partial<Record<keyof FormValues, string>>) => {
    const firstField = Object.keys(stepErrors)[0] as keyof FormValues | undefined;
    if (!firstField) return;
    const target = firstField === "privacy"
      ? document.getElementById("privacy-consent")
      : firstField === "healthConsent"
        ? document.getElementById("health-consent")
        : document.querySelector<HTMLElement>(`[name="${firstField}"]`);
    target?.focus();
  };

  const goToMobileStep = (step: MobileStep) => {
    setMobileStep(step);
    setStatus("editing");
    requestAnimationFrame(() => {
      document.getElementById(`reservation-step-${step}`)?.focus({ preventScroll: true });
      scrollToFormTop();
    });
  };

  const advanceMobileStep = (currentStep: MobileStep, nextStep: MobileStep) => {
    const allErrors = validate(values);
    const stepErrors = Object.fromEntries(
      mobileStepFields[currentStep]
        .filter((field) => allErrors[field])
        .map((field) => [field, allErrors[field]]),
    ) as Partial<Record<keyof FormValues, string>>;

    setErrors((current) => {
      const next = { ...current };
      mobileStepFields[currentStep].forEach((field) => delete next[field]);
      return { ...next, ...stepErrors };
    });

    if (Object.keys(stepErrors).length) {
      setStatus("error");
      requestAnimationFrame(() => focusFirstError(stepErrors));
      return;
    }

    goToMobileStep(nextStep);
  };

  const requestReview = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      setStatus("error");
      const firstInvalidStep = ([1, 2, 3, 4] as MobileStep[]).find((step) => mobileStepFields[step].some((field) => nextErrors[field])) ?? 4;
      setMobileStep(firstInvalidStep);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => focusFirstError(nextErrors));
      });
      return;
    }
    setStatus("review");
    requestAnimationFrame(scrollToFormTop);
  };

  const submitDemo = async () => {
    setStatus("submitting");
    try {
      await new Promise((resolve) => window.setTimeout(resolve, 950));
      if (new URLSearchParams(window.location.search).get("demo") === "failure") {
        throw new Error("demo failure");
      }
      setStatus("success");
      requestAnimationFrame(scrollToFormTop);
    } catch {
      setStatus("error");
      requestAnimationFrame(scrollToFormTop);
    }
  };

  if (status === "success") {
    return (
      <div ref={formTopRef} className="form-status-panel" tabIndex={-1}>
        <CheckCircle size={34} weight="light" aria-hidden="true" />
        <h3>入力内容の確認が完了しました</h3>
        <p>{privacySettings.onlineReservationNotice}</p>
        <Button type="button" variant="quiet" onClick={() => { setValues(initialValues); setMobileStep(1); setStatus("idle"); }}>入力画面に戻る</Button>
      </div>
    );
  }

  if (status === "review" || status === "submitting") {
    const reviewRows = [
      ["予約希望日", values.date], ["予約希望時間", values.time], ["利用人数", `${values.guests}名`],
      ["代表者名", values.name], ["ふりがな", values.kana], ["電話番号", values.phone], ["メールアドレス", values.email],
      ["希望するコース", courseName], ["ドリンク", drinkName], ["記念日ケーキ", values.cake === "yes" ? "希望する" : "希望しない"],
      ...(values.cake === "yes" ? [["ケーキに添えるお名前", values.cakeName], ["プレートのメッセージ", values.cakeMessage]] : []),
      ["アレルギーや苦手な食材", values.allergies || "なし"], ["その他の要望", values.requests || "なし"],
    ];
    return (
      <div ref={formTopRef} className="reservation-review" tabIndex={-1}>
        <p className="form-step">入力内容の確認</p>
        <h3>この内容でよろしいですか？</h3>
        <p className="form-demo-foot">{privacySettings.onlineReservationNotice}</p>
        <dl>{reviewRows.map(([term, detail]) => <div key={term}><dt>{term}</dt><dd>{detail}</dd></div>)}</dl>
        <div className="form-actions">
          <Button type="button" variant="quiet" disabled={status === "submitting"} onClick={() => { setMobileStep(4); setStatus("editing"); requestAnimationFrame(scrollToFormTop); }}><ArrowLeft size={17} aria-hidden="true" />入力内容を修正する</Button>
          <Button type="button" variant="ivory" disabled={status === "submitting"} onClick={submitDemo}>{status === "submitting" ? "内容を確認しています…" : "デモ送信する"}</Button>
        </div>
      </div>
    );
  }

  const inputProps = (name: keyof FormValues, id: string = name) => ({
    id,
    name,
    "aria-invalid": Boolean(errors[name]),
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  });

  return (
    <div ref={formTopRef}>
      {status === "error" && Object.keys(errors).length > 0 && (
        <div className="form-error-summary" role="alert"><WarningCircle size={22} aria-hidden="true" /><p>入力内容を確認してください。各項目の下に修正方法を表示しています。</p></div>
      )}
      {status === "error" && Object.keys(errors).length === 0 && (
        <div className="form-error-summary" role="alert"><WarningCircle size={22} aria-hidden="true" /><p>デモ送信の確認中にエラーが発生しました。入力内容は残っています。時間をおいて、もう一度お試しください。</p></div>
      )}
      <div className="reservation-form-layout">
      <form className="reservation-form" noValidate onSubmit={requestReview}>
        <div className="mobile-reservation-progress" role="status" aria-live="polite">
          <div><span>{mobileStep} / 4</span><strong>{mobileStepLabels[mobileStep - 1]}</strong></div>
          <div className="mobile-reservation-progress-track" aria-hidden="true"><i style={{ transform: `scaleX(${mobileStep / 4})` }} /></div>
        </div>

        <section className="reservation-group" data-mobile-active={mobileStep === 1}><div className="reservation-group-title"><span>01</span><h3 id="reservation-step-1" tabIndex={-1}>日時と人数</h3></div>
        <div className="form-grid form-grid-three">
          <div className="field">
            <label htmlFor="date">予約希望日 <Required /></label>
            <input {...inputProps("date")} type="date" value={values.date} onChange={(e) => update("date", e.target.value)} />
            {errors.date && <p id="date-error" className="field-error">{errors.date}</p>}
          </div>
          <div className="field">
            <label htmlFor="time">予約希望時間 <Required /></label>
            <input {...inputProps("time")} type="time" value={values.time} onChange={(e) => update("time", e.target.value)} />
            {errors.time && <p id="time-error" className="field-error">{errors.time}</p>}
          </div>
          <div className="field">
            <label htmlFor="guests">利用人数 <Required /></label>
            <input {...inputProps("guests")} inputMode="numeric" min="1" type="number" placeholder="2" value={values.guests} onChange={(e) => update("guests", e.target.value)} />
          {errors.guests && <p id="guests-error" className="field-error">{errors.guests}</p>}
          </div>
        </div>
        <div className="mobile-step-actions mobile-step-actions-next"><Button type="button" variant="ivory" onClick={() => advanceMobileStep(1, 2)}>次へ：コースを選ぶ<ArrowRight size={17} aria-hidden="true" /></Button></div>
        </section>

        <section className="reservation-group" data-mobile-active={mobileStep === 2}><div className="reservation-group-title"><span>02</span><h3 id="reservation-step-2" tabIndex={-1}>コース</h3></div>
        <fieldset>
          <legend>希望するコース <Required /></legend>
          <div className="choice-list course-choice-list">
            {siteContent.courses.map((course) => (
              <label key={course.id} className={values.course === course.id ? "is-selected" : ""}><input {...inputProps("course", `course-${course.id}`)} type="radio" value={course.id} checked={values.course === course.id} onChange={(e) => update("course", e.target.value)} /><span><strong>{course.price.toLocaleString("ja-JP")}円</strong><small>{course.name}</small></span></label>
            ))}
          </div>{errors.course && <p id="course-error" className="field-error">{errors.course}</p>}
        </fieldset>
        <div className="mobile-step-actions"><Button type="button" variant="quiet" onClick={() => goToMobileStep(1)}><ArrowLeft size={17} aria-hidden="true" />戻る</Button><Button type="button" variant="ivory" onClick={() => advanceMobileStep(2, 3)}>次へ：オプションを選ぶ<ArrowRight size={17} aria-hidden="true" /></Button></div>
        </section>

        <section className="reservation-group" data-mobile-active={mobileStep === 3}><div className="reservation-group-title"><span>03</span><h3 id="reservation-step-3" tabIndex={-1}>追加オプション</h3></div>
        <fieldset>
          <legend>ドリンク単品または飲み放題 <Required /></legend>
          <div className="choice-list compact-choice-list">{siteContent.drinks.map((drink) => <label key={drink.id} className={values.drink === drink.id ? "is-selected" : ""}><input {...inputProps("drink", `drink-${drink.id}`)} type="radio" value={drink.id} checked={values.drink === drink.id} onChange={(e) => update("drink", e.target.value)} /><span><strong>{drink.label}</strong><small>{drink.description}</small></span></label>)}</div>{errors.drink && <p id="drink-error" className="field-error">{errors.drink}</p>}
        </fieldset>
        <fieldset>
          <legend>記念日ケーキ <Required /></legend>
          <div className="choice-list compact-choice-list cake-choice-list">{[{ value: "yes", label: "希望する" }, { value: "no", label: "希望しない" }].map((option) => <label key={option.value} className={values.cake === option.value ? "is-selected" : ""}><input {...inputProps("cake", `cake-${option.value}`)} type="radio" value={option.value} checked={values.cake === option.value} onChange={(e) => update("cake", e.target.value as FormValues["cake"])} /><span><strong>{option.label}</strong></span></label>)}</div>{errors.cake && <p id="cake-error" className="field-error">{errors.cake}</p>}
        </fieldset>
        <AnimatePresence initial={false}>{values.cake === "yes" && <motion.div className="cake-fields" initial={{ opacity: 0, transform: reduceMotion ? "none" : "translate3d(0,14px,0)" }} animate={{ opacity: 1, transform: "translate3d(0,0,0)" }} exit={{ opacity: 0, transform: reduceMotion ? "none" : "translate3d(0,-8px,0)" }} transition={{ duration: reduceMotion ? 0.18 : 0.26, ease: [0.23, 1, 0.32, 1] }}><p>料金・サイズは確認時にご案内します。</p><div className="form-grid"><div className="field"><label htmlFor="cakeName">ケーキに入れる名前 <Required /></label><input {...inputProps("cakeName")} value={values.cakeName} onChange={(e) => update("cakeName", e.target.value)} />{errors.cakeName && <p id="cakeName-error" className="field-error">{errors.cakeName}</p>}</div><div className="field"><label htmlFor="cakeMessage">プレートメッセージ <Required /></label><input {...inputProps("cakeMessage")} value={values.cakeMessage} onChange={(e) => update("cakeMessage", e.target.value)} />{errors.cakeMessage && <p id="cakeMessage-error" className="field-error">{errors.cakeMessage}</p>}</div></div></motion.div>}</AnimatePresence>
        <div className="mobile-step-actions"><Button type="button" variant="quiet" onClick={() => goToMobileStep(2)}><ArrowLeft size={17} aria-hidden="true" />戻る</Button><Button type="button" variant="ivory" onClick={() => advanceMobileStep(3, 4)}>次へ：お客様情報へ<ArrowRight size={17} aria-hidden="true" /></Button></div>
        </section>

        <section className="reservation-group" data-mobile-active={mobileStep === 4}><div className="reservation-group-title"><span>04</span><h3 id="reservation-step-4" tabIndex={-1}>お客様情報・確認</h3></div>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="name">代表者名 <Required /></label>
            <input {...inputProps("name")} autoComplete="name" placeholder="山田 花子" value={values.name} onChange={(e) => update("name", e.target.value)} />
            {errors.name && <p id="name-error" className="field-error">{errors.name}</p>}
          </div>
          <div className="field">
            <label htmlFor="kana">ふりがな <Required /></label>
            <input {...inputProps("kana")} placeholder="やまだ はなこ" value={values.kana} onChange={(e) => update("kana", e.target.value)} />
            {errors.kana && <p id="kana-error" className="field-error">{errors.kana}</p>}
          </div>
          <div className="field">
            <label htmlFor="phone">電話番号 <Required /></label>
            <input {...inputProps("phone")} autoComplete="tel" inputMode="tel" placeholder="090-1234-5678" value={values.phone} onChange={(e) => update("phone", e.target.value)} />
            {errors.phone && <p id="phone-error" className="field-error">{errors.phone}</p>}
          </div>
          <div className="field">
            <label htmlFor="email">メールアドレス <Required /></label>
            <input {...inputProps("email")} autoComplete="email" inputMode="email" type="email" placeholder="mail@example.jp" value={values.email} onChange={(e) => update("email", e.target.value)} />
            {errors.email && <p id="email-error" className="field-error">{errors.email}</p>}
          </div>
        </div>

        <div className="field"><label htmlFor="allergies">アレルギーや苦手な食材 <Optional /></label><textarea {...inputProps("allergies")} rows={3} placeholder="ない場合は空欄で構いません" value={values.allergies} onChange={(e) => update("allergies", e.target.value)} /></div>
        <div className="field"><label htmlFor="requests">その他の要望 <Optional /></label><textarea {...inputProps("requests")} rows={3} value={values.requests} onChange={(e) => update("requests", e.target.value)} /></div>

        <div className="consent-stack">
          <label className="privacy-check" htmlFor="privacy-consent">
            <input {...inputProps("privacy", "privacy-consent")} type="checkbox" checked={values.privacy} onChange={(e) => update("privacy", e.target.checked)} />
            <span><Link href="/privacy" target="_blank" rel="noopener noreferrer">プライバシーポリシー</Link>を確認し、予約に必要な個人情報の取り扱いに同意します。 <Required /></span>
          </label>
          {errors.privacy && <p id="privacy-error" className="field-error" role="alert">{errors.privacy}</p>}
          <AnimatePresence initial={false}>{values.allergies.trim() && <motion.div className="health-consent" initial={{ opacity: 0, transform: reduceMotion ? "none" : "translate3d(0,8px,0)" }} animate={{ opacity: 1, transform: "translate3d(0,0,0)" }} exit={{ opacity: 0, transform: reduceMotion ? "none" : "translate3d(0,-6px,0)" }} transition={{ duration: reduceMotion ? 0.18 : 0.22, ease: [0.23, 1, 0.32, 1] }}><label className="privacy-check" htmlFor="health-consent"><input {...inputProps("healthConsent", "health-consent")} type="checkbox" checked={values.healthConsent} onChange={(e) => update("healthConsent", e.target.checked)} /><span>アレルギー等の健康に関する情報を、予約対応と安全な料理提供のために取得・利用することに同意します。 <Required /></span></label>{errors.healthConsent && <p id="healthConsent-error" className="field-error" role="alert">{errors.healthConsent}</p>}</motion.div>}</AnimatePresence>
        </div>

        <div className="form-submit"><Button className="mobile-form-back" type="button" variant="quiet" onClick={() => goToMobileStep(3)}><ArrowLeft size={17} aria-hidden="true" />戻る</Button><Button type="submit" variant="ivory" size="large">入力内容を確認する</Button></div>
        </section>
      </form>
      <aside className="reservation-summary" aria-live="polite"><p>ご予約内容</p><dl><div><dt>日時</dt><dd>{values.date || "未選択"} {values.time || ""}</dd></div><div><dt>人数</dt><dd>{values.guests ? `${values.guests}名` : "未選択"}</dd></div><div><dt>コース</dt><dd>{courseName || "未選択"}</dd></div><div><dt>ドリンク</dt><dd>{drinkName || "未選択"}</dd></div><div><dt>ケーキ</dt><dd>{values.cake === "yes" ? "希望する" : values.cake === "no" ? "希望しない" : "未選択"}</dd></div></dl></aside>
      </div>
      <Link className="reservation-contact-link" href="/contact">お問い合わせ</Link>
    </div>
  );
}
