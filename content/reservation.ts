export type ReservationPolicy = {
  timeZone: string;
  slots: string[];
  bookingWindowMonths: number;
  guestRange: { min: number; max: number };
  coursePrice: number;
  serviceRate: number;
  closedWeekdays: number[];
  secondMondayClosed: boolean;
};

export const reservationPolicy: ReservationPolicy = {
  timeZone: "Asia/Tokyo",
  slots: ["18:00", "20:45"],
  bookingWindowMonths: 2,
  guestRange: { min: 1, max: 6 },
  coursePrice: 33_000,
  serviceRate: 0.1,
  closedWeekdays: [0],
  secondMondayClosed: true,
};

export type ReservationDateError = "invalid" | "past" | "out-of-range" | "closed" | null;

function getTokyoParts(now: Date, policy: ReservationPolicy) {
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: policy.timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  return Object.fromEntries(parts.map((part) => [part.type, part.value]));
}

export function getTokyoDateString(now = new Date(), policy = reservationPolicy) {
  const values = getTokyoParts(now, policy);
  return `${values.year}-${values.month}-${values.day}`;
}

export function getReservationEndDate(now = new Date(), policy = reservationPolicy) {
  const today = getTokyoDateString(now, policy);
  const [year, month] = today.split("-").map(Number);
  const parts = getTokyoParts(now, policy);
  const beforeMonthlyRelease = Number(parts.day) === 1 && Number(parts.hour) < 12;
  const monthsAhead = beforeMonthlyRelease ? policy.bookingWindowMonths - 1 : policy.bookingWindowMonths;
  return new Date(Date.UTC(year, month + monthsAhead, 0)).toISOString().slice(0, 10);
}

export function isReservationClosedDate(value: string, policy = reservationPolicy) {
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  const weekday = date.getUTCDay();
  const isSecondMonday = weekday === 1 && day >= 8 && day <= 14;
  return policy.closedWeekdays.includes(weekday) || (policy.secondMondayClosed && isSecondMonday);
}

export function validateReservationDate(value: string, now = new Date(), policy = reservationPolicy): ReservationDateError {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return "invalid";
  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  if (parsed.getUTCFullYear() !== year || parsed.getUTCMonth() !== month - 1 || parsed.getUTCDate() !== day) return "invalid";
  const today = getTokyoDateString(now, policy);
  if (value < today) return "past";
  if (value > getReservationEndDate(now, policy)) return "out-of-range";
  if (isReservationClosedDate(value, policy)) return "closed";
  return null;
}

export function getReservationTotal(guests: number, policy = reservationPolicy) {
  return Math.round(policy.coursePrice * (1 + policy.serviceRate) * guests);
}
