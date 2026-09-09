"use client";

import { cloneElement, FormEvent, ReactElement, useEffect, useRef, useState } from "react";
import {
  getReservationEndDate,
  getReservationTotal,
  getTokyoDateString,
  validateReservationDate,
} from "@/content/reservation";
import type { ReservationPolicy } from "@/content/reservation";

type FormData = {
  guests: string;
  date: string;
  time: string;
  name: string;
  email: string;
  phone: string;
  allergies: string;
  dislikes: string;
  anniversary: string;
  consent: boolean;
  website: string;
};

function createInitial(policy: ReservationPolicy): FormData {
  return {
    guests: String(Math.min(policy.guestRange.max, Math.max(policy.guestRange.min, 2))),
    date: "",
    time: policy.slots[0],
    name: "",
    email: "",
    phone: "",
    allergies: "",
    dislikes: "",
    anniversary: "none",
    consent: false,
    website: "",
  };
}

export function ReservationForm({ policy, allergyNote, cancellation }: { policy: ReservationPolicy; allergyNote: string; cancellation: string }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormData>(() => createInitial(policy));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [receipt, setReceipt] = useState("");
  const stageRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  const mountedRef = useRef(false);

  useEffect(() => {
    if (!mountedRef.current) { mountedRef.current = true; return; }
    if (status === "success") successRef.current?.focus();
    else stageRef.current?.focus();
  }, [step, status]);

  const set = <K extends keyof FormData>(name: K, value: FormData[K]) => {
    setData((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
    setStatusMessage("");
    if (status === "error") setStatus("idle");
  };

  const focusFirstError = (nextErrors: Record<string, string>) => {
    const first = Object.keys(nextErrors)[0];
    if (first) requestAnimationFrame(() => document.getElementById(first)?.focus());
  };

  const collectErrors = (targetStep: number) => {
    const nextErrors: Record<string, string> = {};
    if (targetStep === 1) {
      const guests = Number(data.guests);
      const dateError = validateReservationDate(data.date, undefined, policy);
      if (!Number.isInteger(guests) || guests < policy.guestRange.min || guests > policy.guestRange.max) nextErrors.guests = "人数をご確認ください。";
      if (!data.date) nextErrors.date = "ご希望日を選択してください。";
      else if (dateError === "invalid") nextErrors.date = "実在する日付を選択してください。";
      else if (dateError === "past") nextErrors.date = "本日以降の日付を選択してください。";
      else if (dateError === "out-of-range") nextErrors.date = `ご予約は${getReservationEndDate(undefined, policy).replaceAll("-", "/")}まで承ります。`;
      else if (dateError === "closed") nextErrors.date = "定休日です。別の日を選択してください。";
      if (!policy.slots.includes(data.time)) nextErrors.time = `${policy.slots.join("または")}を選択してください。`;
    }
    if (targetStep === 2) {
      if (!data.name.trim()) nextErrors.name = "お名前を入力してください。";
      if (!/^\S+@\S+\.\S+$/.test(data.email)) nextErrors.email = "連絡可能なメールアドレスを入力してください。";
      if (!/^[0-9+()\-\s]{8,}$/.test(data.phone)) nextErrors.phone = "電話番号を数字で入力してください。";
      if (!data.consent) nextErrors.consent = "個人情報の取り扱いへの同意が必要です。";
    }
    return nextErrors;
  };

  const validate = (targetStep: number) => {
    const nextErrors = collectErrors(targetStep);
    setErrors(nextErrors);
    focusFirstError(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const next = () => { if (validate(step)) setStep((current) => Math.min(3, current + 1)); };
  const back = () => { setStatusMessage(""); setStep((current) => Math.max(1, current - 1)); };

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    const nextErrors = { ...collectErrors(1), ...collectErrors(2) };
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      setStep(nextErrors.date || nextErrors.time || nextErrors.guests ? 1 : 2);
      focusFirstError(nextErrors);
      return;
    }
    setStatus("sending");
    setStatusMessage("");
    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json() as { receipt?: string; error?: string; fieldErrors?: Record<string, string> };
      if (result.fieldErrors && Object.keys(result.fieldErrors).length) {
        setErrors(result.fieldErrors);
        setStep(result.fieldErrors.date || result.fieldErrors.time || result.fieldErrors.guests ? 1 : 2);
        focusFirstError(result.fieldErrors);
      }
      if (!response.ok || !result.receipt) throw new Error(result.error || "予約リクエストを送信できませんでした。");
      setReceipt(result.receipt);
      setStatus("success");
      setStep(5);
    } catch (error) {
      setStatus("error");
      setStatusMessage(error instanceof Error ? error.message : "予約リクエストを送信できませんでした。");
    }
  }

  function submitStep(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step < 3) next();
    else void submit(event);
  }

  const guests = Number(data.guests);
  const serviceFee = policy.coursePrice * policy.serviceRate * guests;
  const total = getReservationTotal(guests, policy);
  const serviceRatePercent = Math.round(policy.serviceRate * 1000) / 10;
  const yen = (value: number) => `${value.toLocaleString("ja-JP")}円`;

  if (status === "success") {
    return (
      <section className="request-complete" aria-labelledby="request-title" aria-live="polite">
        <div className="complete-ember" aria-hidden="true" />
        <p className="reservation-step">受付番号 {receipt}</p>
        <h3 id="request-title" ref={successRef} tabIndex={-1}>予約リクエストを承りました。</h3>
        <p className="complete-note">受付内容を記録しました。店舗からの確認連絡をもって予約成立となります。</p>
        <dl className="complete-summary">
          <div><dt>来店希望</dt><dd>{data.date}　{data.time}</dd></div>
          <div><dt>人数</dt><dd>{data.guests}名</dd></div>
          <div><dt>お名前</dt><dd>{data.name}</dd></div>
          <div><dt>お支払額</dt><dd>{yen(total)}（サービス料込）</dd></div>
        </dl>
        <div className="complete-actions"><button type="button" onClick={() => { setData(createInitial(policy)); setErrors({}); setReceipt(""); setStatusMessage(""); setStatus("idle"); setStep(1); }}>新しい予約リクエストを作成</button><a href="#top">トップへ戻る</a></div>
      </section>
    );
  }

  return (
    <form className="reservation-form" key={step} onSubmit={submitStep} noValidate>
      <div className="honeypot" aria-hidden="true"><label htmlFor="website">ウェブサイト</label><input id="website" name="website" tabIndex={-1} autoComplete="off" value={data.website} onChange={(event) => set("website", event.target.value)} /></div>
      <p className="demo-disclosure">{allergyNote}</p>
      <div className="step-track" aria-label={`予約入力 ${step}/3`}><span style={{ transform: `scaleX(${step / 3})` }} /><p><b>0{step}</b> / 03</p></div>
      <div ref={stageRef} tabIndex={-1} className="form-stage">
        {step === 1 && <fieldset><legend><small>日時と人数</small><span>席の輪郭を決める。</span></legend><div className="field-row"><Field id="guests" name="guests" label="人数" required error={errors.guests}><select value={data.guests} onChange={(event) => set("guests", event.target.value)}>{Array.from({ length: policy.guestRange.max - policy.guestRange.min + 1 }, (_, index) => index + policy.guestRange.min).map((n) => <option key={n} value={n}>{n}名</option>)}</select></Field><Field id="date" name="date" label="ご希望日" required error={errors.date}><input type="date" min={getTokyoDateString(undefined, policy)} max={getReservationEndDate(undefined, policy)} value={data.date} onChange={(event) => set("date", event.target.value)} /></Field><Field id="time" name="time" label="ご希望時間" required error={errors.time}><select value={data.time} onChange={(event) => set("time", event.target.value)}>{policy.slots.map((slot) => <option key={slot} value={slot}>{slot}</option>)}</select></Field></div></fieldset>}
        {step === 2 && <fieldset><legend><small>ご連絡と食事の情報</small><span>一席ずつ、準備する。</span></legend><div className="field-row"><Field id="name" name="name" label="お名前" required error={errors.name}><input autoComplete="name" value={data.name} onChange={(event) => set("name", event.target.value)} /></Field><Field id="email" name="email" label="メールアドレス" required error={errors.email}><input type="email" autoComplete="email" inputMode="email" value={data.email} onChange={(event) => set("email", event.target.value)} /></Field><Field id="phone" name="phone" label="電話番号" required error={errors.phone}><input type="tel" autoComplete="tel" inputMode="tel" value={data.phone} onChange={(event) => set("phone", event.target.value)} /></Field><Field id="allergies" name="allergies" label="アレルギー"><textarea rows={2} value={data.allergies} onChange={(event) => set("allergies", event.target.value)} placeholder="ない場合は空欄で構いません" /></Field><Field id="dislikes" name="dislikes" label="苦手な食材"><textarea rows={2} value={data.dislikes} onChange={(event) => set("dislikes", event.target.value)} placeholder="ない場合は空欄で構いません" /></Field><Field id="anniversary" name="anniversary" label="記念日について"><select value={data.anniversary} onChange={(event) => set("anniversary", event.target.value)}><option value="none">利用しない</option><option value="birthday">誕生日</option><option value="anniversary">記念日</option><option value="other">その他</option></select></Field></div><label className="consent" htmlFor="consent"><input id="consent" name="consent" type="checkbox" checked={data.consent} aria-invalid={Boolean(errors.consent)} aria-describedby={errors.consent ? "consent-error" : undefined} onChange={(event) => set("consent", event.target.checked)} /><span><a href="/privacy" target="_blank" rel="noreferrer">個人情報の取り扱い</a>を確認し、予約情報の送信に同意します。</span></label>{errors.consent && <em className="consent-error" id="consent-error" role="alert">{errors.consent}</em>}</fieldset>}
        {step === 3 && <fieldset><legend><small>入力内容の確認</small><span>火を入れる前に、確かめる。</span></legend><dl className="confirmation"><div><dt>来店希望</dt><dd>{data.date}　{data.time}</dd></div><div><dt>人数</dt><dd>{data.guests}名</dd></div><div><dt>お名前</dt><dd>{data.name}</dd></div><div><dt>ご連絡先</dt><dd>{data.email}<br />{data.phone}</dd></div><div><dt>料理代</dt><dd>{yen(policy.coursePrice)} × {guests}名</dd></div><div><dt>サービス料</dt><dd>{yen(serviceFee)}（{serviceRatePercent}%）</dd></div><div><dt>合計</dt><dd><strong>{yen(total)}</strong></dd></div></dl><p className="request-caveat">店舗からの確認連絡までは予約確定ではありません。{cancellation}</p></fieldset>}
      </div>
      <div className="form-actions">{step > 1 && <button className="secondary-button" type="button" onClick={back}>ひとつ戻る</button>}{step < 3 ? <button className="submit-button" type="submit">次へ進む</button> : <button className="submit-button" type="submit" disabled={status === "sending"}>{status === "sending" ? "送信しています" : "予約リクエストを送る"}</button>}</div>
      {status === "error" && <p className="form-error" role="alert">{statusMessage}</p>}
      <p className="sr-status" role="status" aria-live="polite">{status === "sending" ? "予約リクエストを送信しています。" : ""}</p>
    </form>
  );
}

type FieldControlProps = { id?: string; name?: string; required?: boolean; "aria-invalid"?: boolean; "aria-describedby"?: string };
function Field({ id, name, label, required = false, error, children }: { id: string; name: string; label: string; required?: boolean; error?: string; children: ReactElement<FieldControlProps> }) {
  const errorId = `${id}-error`;
  const control = cloneElement(children, { id, name, required, "aria-invalid": Boolean(error), "aria-describedby": error ? errorId : undefined });
  return <label className="field" htmlFor={id}><span>{label}{required && <b>必須</b>}</span>{control}{error && <em id={errorId} role="alert">{error}</em>}</label>;
}
