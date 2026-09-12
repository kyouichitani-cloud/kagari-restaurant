import "server-only";

import { restaurant as localRestaurant, type CmsImage, type Course, type RestaurantContent } from "@/content/restaurant";
import { reservationPolicy as localReservationPolicy, reservationSlots, type ReservationPolicy } from "@/content/reservation";

export const MICROCMS_CACHE_TAG = "microcms-restaurant";

type ContentBundle = {
  restaurant: RestaurantContent;
  reservationPolicy: ReservationPolicy;
  source: "microcms" | "local";
};

type MicroCmsConfig = {
  serviceDomain: string;
  apiKey: string;
  settingsEndpoint: string;
  coursesEndpoint: string;
  noticesEndpoint: string;
  revalidate: number;
  timeout: number;
};

type UnknownRecord = Record<string, unknown>;

function record(value: unknown): UnknownRecord | null {
  return value !== null && typeof value === "object" && !Array.isArray(value) ? value as UnknownRecord : null;
}

function stringValue(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function numberValue(value: unknown, fallback: number, min: number, max: number) {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) && parsed >= min && parsed <= max ? parsed : fallback;
}

function booleanValue(value: unknown, fallback: boolean) {
  return typeof value === "boolean" ? value : fallback;
}

function endpoint(value: string | undefined, fallback: string) {
  const candidate = value?.trim() || fallback;
  return /^[a-z0-9_-]+$/i.test(candidate) ? candidate : fallback;
}

function readConfig(): MicroCmsConfig | null {
  const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN?.trim();
  const apiKey = process.env.MICROCMS_API_KEY?.trim();
  if (!serviceDomain || !apiKey || !/^[a-z0-9-]+$/i.test(serviceDomain)) return null;
  return {
    serviceDomain,
    apiKey,
    settingsEndpoint: endpoint(process.env.MICROCMS_SETTINGS_ENDPOINT, "restaurant"),
    coursesEndpoint: endpoint(process.env.MICROCMS_COURSES_ENDPOINT, "courses"),
    noticesEndpoint: endpoint(process.env.MICROCMS_NOTICES_ENDPOINT, "notices"),
    revalidate: Math.round(numberValue(process.env.MICROCMS_REVALIDATE_SECONDS, 300, 10, 86_400)),
    timeout: Math.round(numberValue(process.env.MICROCMS_TIMEOUT_MS, 5_000, 1_000, 30_000)),
  };
}

async function request(config: MicroCmsConfig, targetEndpoint: string, list = false): Promise<unknown | null> {
  const query = list ? "?limit=100&orders=sortOrder" : "";
  const url = `https://${config.serviceDomain}.microcms.io/api/v1/${targetEndpoint}${query}`;
  try {
    const response = await fetch(url, {
      headers: { "X-MICROCMS-API-KEY": config.apiKey },
      next: { revalidate: config.revalidate, tags: [MICROCMS_CACHE_TAG] },
      signal: AbortSignal.timeout(config.timeout),
    });
    if (!response.ok) {
      console.warn(`[microCMS] ${targetEndpoint} returned ${response.status}; local content will be used for this section.`);
      return null;
    }
    return await response.json();
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown error";
    console.warn(`[microCMS] ${targetEndpoint} could not be loaded (${message}); local content will be used for this section.`);
    return null;
  }
}

function listContents(value: unknown): UnknownRecord[] | null {
  const response = record(value);
  if (!response || !Array.isArray(response.contents)) return null;
  return response.contents.map(record).filter((item): item is UnknownRecord => item !== null);
}

function imageValue(value: unknown): CmsImage | undefined {
  const item = record(value);
  if (!item || typeof item.url !== "string") return undefined;
  try {
    if (new URL(item.url).protocol !== "https:") return undefined;
  } catch {
    return undefined;
  }
  return {
    url: item.url,
    width: typeof item.width === "number" && item.width > 0 ? item.width : undefined,
    height: typeof item.height === "number" && item.height > 0 ? item.height : undefined,
    alt: typeof item.alt === "string" && item.alt.trim() ? item.alt.trim() : undefined,
  };
}

function courseDetails(value: unknown): Course["details"] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((entry) => {
    const item = record(entry);
    if (!item) return [];
    const label = stringValue(item.label, "");
    const detail = stringValue(item.value, "");
    return label && detail ? [{ label, value: detail }] : [];
  });
}

function mapCourses(contents: UnknownRecord[] | null): Course[] | null {
  if (contents === null) return null;
  const mapped = contents.flatMap((item, index) => {
    const title = stringValue(item.title, "");
    const description = stringValue(item.description, "");
    if (!title || !description) return [];
    const fallback = localRestaurant.courses[index % localRestaurant.courses.length];
    return [{
      id: stringValue(item.id, `course-${index + 1}`),
      chapter: stringValue(item.chapter, fallback.chapter),
      title,
      description,
      origin: stringValue(item.origin, fallback.origin),
      details: courseDetails(item.details),
      image: fallback.image,
      photo: imageValue(item.photo),
      sortOrder: numberValue(item.sortOrder, index + 1, -10_000, 10_000),
    } satisfies Course];
  });
  return mapped.length ? mapped.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)) : null;
}

function formatNoticeDate(value: unknown, fallback: string) {
  if (typeof value !== "string") return fallback;
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  return match ? `${match[1]}.${match[2]}.${match[3]}` : fallback;
}

function mapNotices(contents: UnknownRecord[] | null): RestaurantContent["notices"] | null {
  if (contents === null) return null;
  return contents.flatMap((item, index) => {
    const title = stringValue(item.title, "");
    if (!title) return [];
    return [{
      id: stringValue(item.id, `notice-${index + 1}`),
      date: formatNoticeDate(item.date, localRestaurant.notices[index]?.date ?? ""),
      title,
      sortOrder: numberValue(item.sortOrder, index + 1, -10_000, 10_000),
    }];
  }).sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
}

function parseClosedWeekdays(value: unknown, fallback: number[]) {
  if (typeof value === "string" && ["none", "なし", "-"].includes(value.trim().toLowerCase())) return [];
  const raw = Array.isArray(value) ? value : typeof value === "string" ? value.split(/[\s,、]+/) : [];
  const weekdays = raw.map(Number).filter((day) => Number.isInteger(day) && day >= 0 && day <= 6);
  return weekdays.length ? [...new Set(weekdays)] : fallback;
}

function mergeSettings(settings: UnknownRecord | null) {
  if (!settings) return { restaurant: localRestaurant, reservationPolicy: localReservationPolicy };

  // Reservation slots are operational data and must not be narrowed by legacy CMS values.
  const slots = reservationSlots;
  const coursePrice = Math.round(numberValue(settings.coursePrice, localReservationPolicy.coursePrice, 0, 10_000_000));
  const serviceRate = numberValue(settings.serviceRatePercent, localReservationPolicy.serviceRate * 100, 0, 100) / 100;
  const reservationPolicy: ReservationPolicy = {
    timeZone: stringValue(settings.timeZone, localReservationPolicy.timeZone),
    slots,
    bookingWindowMonths: Math.round(numberValue(settings.bookingWindowMonths, localReservationPolicy.bookingWindowMonths, 1, 12)),
    guestRange: {
      min: Math.round(numberValue(settings.guestsMin, localReservationPolicy.guestRange.min, 1, 20)),
      max: Math.round(numberValue(settings.guestsMax, localReservationPolicy.guestRange.max, 1, 20)),
    },
    coursePrice,
    courses: localReservationPolicy.courses,
    serviceRate,
    closedWeekdays: parseClosedWeekdays(settings.closedWeekdays, localReservationPolicy.closedWeekdays),
    secondMondayClosed: booleanValue(settings.secondMondayClosed, localReservationPolicy.secondMondayClosed),
  };
  if (reservationPolicy.guestRange.max < reservationPolicy.guestRange.min) reservationPolicy.guestRange.max = reservationPolicy.guestRange.min;

  const courseName = stringValue(settings.courseName, "おまかせ");
  const priceSuffix = stringValue(settings.coursePriceSuffix, `（税込・サービス料${Math.round(serviceRate * 100)}%別）`);
  const restaurant: RestaurantContent = {
    ...localRestaurant,
    brand: {
      ja: stringValue(settings.brandJa, localRestaurant.brand.ja),
      en: stringValue(settings.brandEn, localRestaurant.brand.en),
    },
    hero: {
      title: stringValue(settings.heroTitle, localRestaurant.hero.title),
      body: stringValue(settings.heroBody, localRestaurant.hero.body),
    },
    courseSection: {
      eyebrow: stringValue(settings.courseEyebrow, localRestaurant.courseSection.eyebrow),
      title: stringValue(settings.courseSectionTitle, localRestaurant.courseSection.title),
      titleAccent: stringValue(settings.courseTitleAccent, localRestaurant.courseSection.titleAccent),
      intro: stringValue(settings.courseSectionIntro, localRestaurant.courseSection.intro),
    },
    reservation: {
      title: stringValue(settings.reservationTitle, localRestaurant.reservation.title),
      note: stringValue(settings.reservationNote, localRestaurant.reservation.note),
    },
    details: {
      address: stringValue(settings.address, localRestaurant.details.address),
      access: stringValue(settings.access, localRestaurant.details.access),
      telephone: stringValue(settings.telephone, localRestaurant.details.telephone),
      reception: stringValue(settings.reception, localRestaurant.details.reception),
      hours: stringValue(settings.hours, slots.map((slot) => `${slot} 一斉スタート`).join("／")),
      closed: stringValue(settings.closed, localRestaurant.details.closed),
      course: `${courseName} ${coursePrice.toLocaleString("ja-JP")}円${priceSuffix}`,
      pairing: stringValue(settings.pairing, localRestaurant.details.pairing),
      seats: stringValue(settings.seats, localRestaurant.details.seats),
      children: stringValue(settings.children, localRestaurant.details.children),
      dress: stringValue(settings.dress, localRestaurant.details.dress),
      allergy: stringValue(settings.allergy, localRestaurant.details.allergy),
      cancellation: stringValue(settings.cancellation, localRestaurant.details.cancellation),
    },
  };
  return { restaurant, reservationPolicy };
}

export async function getRestaurantContent(): Promise<ContentBundle> {
  const config = readConfig();
  if (!config) return { restaurant: localRestaurant, reservationPolicy: localReservationPolicy, source: "local" };

  const [settingsResponse, coursesResponse, noticesResponse] = await Promise.all([
    request(config, config.settingsEndpoint),
    request(config, config.coursesEndpoint, true),
    request(config, config.noticesEndpoint, true),
  ]);
  const settings = record(settingsResponse);
  const courses = mapCourses(listContents(coursesResponse));
  const notices = mapNotices(listContents(noticesResponse));
  const merged = mergeSettings(settings);
  return {
    restaurant: {
      ...merged.restaurant,
      courses: courses ?? localRestaurant.courses,
      notices: notices ?? localRestaurant.notices,
    },
    reservationPolicy: merged.reservationPolicy,
    source: settings || courses || notices ? "microcms" : "local",
  };
}
