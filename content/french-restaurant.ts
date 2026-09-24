import { withBasePath } from "@/content/paths";

export const siteContent = {
  brand: {
    name: "KAGARI",
    descriptor: "フレンチダイニング",
  },
  navigation: [
    { label: "トップ", href: "/" },
    { label: "KAGARIについて", href: "/#concept" },
    { label: "ドリンク", href: "/#drinks" },
    { label: "記念日ケーキ", href: "/#cake" },
    { label: "料理・店内写真", href: "/#gallery" },
    { label: "店舗情報・アクセス", href: "/#access" },
    { label: "ご予約", href: "/#reservation" },
    { label: "お問い合わせ", href: "/contact" },
  ],
  hero: {
    title: "記念日に選ぶ、\nフレンチコース。",
    body: "5,000円から、3つのコースをご用意しています。",
  },
  courses: [
    {
      id: "seasonal",
      name: "季節のフレンチコース",
      price: 5000,
      scene: "初めてのコース料理にも、気軽なデートにも。",
      description: "前菜、メイン料理、デザートを組み合わせたコースです。",
      composition: ["前菜", "メイン料理", "デザート など"],
      image: withBasePath("/images/french/hero.avif"),
      alt: "落ち着いた店内でテーブルに置かれたフレンチ料理",
    },
    {
      id: "colorful",
      name: "彩りフレンチコース",
      price: 7500,
      scene: "誕生日や交際記念日のディナーに。",
      description: "魚料理と肉料理の両方を楽しめるコースです。",
      composition: ["前菜", "魚料理", "肉料理", "デザート など"],
      image: withBasePath("/images/french/fish.avif"),
      alt: "白身魚にソースを仕上げるフレンチの一皿",
    },
    {
      id: "chef",
      name: "シェフ特選フレンチコース",
      price: 10000,
      scene: "節目の記念日や、料理を中心に楽しみたい日に。",
      description: "品数を増やした、料理中心のコースです。",
      composition: ["アミューズ", "前菜", "魚料理", "肉料理", "デザート など"],
      image: withBasePath("/images/french/beef.avif"),
      alt: "牛肉と季節の野菜を盛り付けたフレンチの一皿",
    },
  ],
  drinks: [
    { id: "single", label: "ドリンク単品", description: "お好きなものを一杯ずつ注文できます。" },
    { id: "free-flow", label: "飲み放題", description: "料金・時間・銘柄は、予約確認時にご案内します。" },
  ],
  details: {
    address: "東京都渋谷区恵比寿南1丁目",
    access: "JR恵比寿駅 西口より徒歩4分",
    hours: "17:30–23:00",
    lastEntry: "20:30",
    closed: "火曜日",
    dressCode: "スマートカジュアル",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=東京都渋谷区恵比寿南1丁目",
    instagram: { label: "@kagari.french", url: "https://www.instagram.com/kagari.french/" },
  },
  images: {
    hero: withBasePath("/images/french/hero.avif"),
    background: withBasePath("/images/french/anniversary.avif"),
    fish: withBasePath("/images/french/fish.avif"),
    beef: withBasePath("/images/french/beef.avif"),
    wine: withBasePath("/images/french/wine.avif"),
    anniversary: withBasePath("/images/french/anniversary.avif"),
  },
} as const;

export type CourseId = (typeof siteContent.courses)[number]["id"];
export type Course = (typeof siteContent.courses)[number];

export function isCourseId(value: string | null | undefined): value is CourseId {
  return siteContent.courses.some((course) => course.id === value);
}

export function getCourse(id: string): Course | undefined {
  return siteContent.courses.find((course) => course.id === id);
}

export function getCourseHref(id: CourseId) {
  return `/courses/${id}`;
}

export function getCourseReservationHref(id: CourseId) {
  return `/?course=${id}#reservation`;
}
