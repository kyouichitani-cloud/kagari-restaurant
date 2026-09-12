import { NextRequest, NextResponse } from "next/server";
import { getRestaurantContent } from "@/content/microcms";
import { validateReservationDate } from "@/content/reservation";

const attempts = new Map<string, number[]>();
const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;
const PHONE_PATTERN = /^[0-9+()\-\s]{8,}$/;

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  const fetchSite = request.headers.get("sec-fetch-site");
  if ((origin && origin !== request.nextUrl.origin) || fetchSite === "cross-site") {
    return NextResponse.json({ error: "この送信元からは予約を受け付けられません。" }, { status: 403 });
  }
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const now = Date.now();
  const recent = (attempts.get(ip) ?? []).filter((time) => now - time < 60 * 60 * 1000);
  if (recent.length >= 5) return NextResponse.json({ error: "しばらく時間を置いてからお試しください。" }, { status: 429 });
  attempts.set(ip, [...recent, now]);
  const { reservationPolicy } = await getRestaurantContent();

  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "入力内容を読み取れませんでした。" }, { status: 400 }); }
  if (body.website) return NextResponse.json({ error: "送信内容を受け付けられません。" }, { status: 400 });
  const required = ["courseId", "guests", "date", "time", "name", "email", "phone"];
  if (required.some((key) => typeof body[key] !== "string" || !String(body[key]).trim())) return NextResponse.json({ error: "必須項目をご確認ください。" }, { status: 400 });
  const fieldErrors: Record<string, string> = {};
  const selectedCourse = reservationPolicy.courses.find((course) => course.id === body.courseId);
  if (!selectedCourse) fieldErrors.courseId = "有効なコースを選択してください。";
  if (!selectedCourse || body.coursePrice !== selectedCourse.price) fieldErrors.courseId = "コース料金を確認できません。選び直してください。";
  if (body.consent !== true) fieldErrors.consent = "個人情報の取り扱いへの同意が必要です。";
  const guests = Number(body.guests);
  if (!Number.isInteger(guests) || guests < reservationPolicy.guestRange.min || guests > reservationPolicy.guestRange.max) fieldErrors.guests = "人数をご確認ください。";
  const dateError = validateReservationDate(String(body.date), undefined, reservationPolicy);
  if (dateError) fieldErrors.date = dateError === "invalid" ? "実在する日付を選択してください。" : dateError === "past" ? "過去の日付は選択できません。" : dateError === "closed" ? "定休日です。" : "予約可能期間内の日付を選択してください。";
  if (!reservationPolicy.slots.includes(String(body.time))) fieldErrors.time = `${reservationPolicy.slots.join("または")}を選択してください。`;
  if (!EMAIL_PATTERN.test(String(body.email))) fieldErrors.email = "連絡可能なメールアドレスを入力してください。";
  if (!PHONE_PATTERN.test(String(body.phone))) fieldErrors.phone = "電話番号をご確認ください。";
  if (Object.keys(fieldErrors).length) return NextResponse.json({ error: "入力内容をご確認ください。", fieldErrors }, { status: 400 });

  if (process.env.RESERVATION_MOCK_MODE === "true" && process.env.NODE_ENV !== "production") {
    return NextResponse.json({ receipt: `MOCK-${crypto.randomUUID().slice(0, 6).toUpperCase()}` });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESERVATION_FROM_EMAIL;
  if (!apiKey || !from) return NextResponse.json({ error: "オンライン受付を一時停止しています。お電話でお問い合わせください。" }, { status: 503 });
  const receipt = `KG-${new Date().getFullYear()}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;
  const safe = (value: unknown) => String(value ?? "").replace(/[<>&]/g, "");
  const response = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" }, body: JSON.stringify({ from, to: [safe(body.email)], bcc: [from], subject: `篝 ご予約リクエスト ${receipt}`, html: `<h1>ご予約リクエストを承りました</h1><p>受付番号: ${receipt}</p><p>コース: ${safe(selectedCourse?.name)}</p><p>${safe(body.date)} ${safe(body.time)} / ${safe(body.guests)}名</p><p>${safe(body.name)} 様</p><p>店舗からの確認連絡をもって予約成立となります。</p>` }) });
  if (!response.ok) return NextResponse.json({ error: "送信できませんでした。お電話でお問い合わせください。" }, { status: 502 });
  return NextResponse.json({ receipt });
}
