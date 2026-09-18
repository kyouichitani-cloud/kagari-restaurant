export const siteContent = {
  brand: {
    name: "KAGARI",
    descriptor: "フレンチダイニング",
  },
  navigation: [
    { label: "トップ", href: "/" },
    { label: "私たちについて", href: "/#concept" },
    { label: "ドリンク", href: "/#drinks" },
    { label: "記念日ケーキ", href: "/#cake" },
    { label: "ギャラリー", href: "/#gallery" },
    { label: "店舗情報・アクセス", href: "/#access" },
    { label: "ご予約", href: "/#reservation" },
  ],
  hero: {
    title: "いつものふたりに、\n少しだけ特別な夜を。",
    body: "コースの価格も、選べる内容も分かりやすく。気負わず楽しめる、記念日のためのフレンチです。",
  },
  courses: [
    {
      id: "seasonal",
      name: "季節のフレンチコース",
      price: 5000,
      scene: "初めてのコース料理や、いつものデートを少し特別にしたい日に。",
      description: "季節の味わいを気軽に楽しめる、軽やかな構成を想定したコースです。",
      composition: ["前菜", "メイン料理", "デザート など"],
      image: "/images/french/hero.avif",
      alt: "落ち着いた店内でテーブルに置かれたフレンチ料理",
      note: "料理構成は差し替え用の仮データです。",
    },
    {
      id: "colorful",
      name: "彩りフレンチコース",
      price: 7500,
      scene: "誕生日や交際記念日など、食事の時間そのものをゆっくり楽しみたい日に。",
      description: "前菜からデザートまで、一皿ごとの変化を楽しめる構成を想定しています。",
      composition: ["前菜", "魚料理", "肉料理", "デザート など"],
      image: "/images/french/fish.avif",
      alt: "白身魚にソースを仕上げるフレンチの一皿",
      note: "料理構成は差し替え用の仮データです。",
    },
    {
      id: "chef",
      name: "シェフ特選フレンチコース",
      price: 10000,
      scene: "節目の記念日や、料理を主役にした特別な夜に。",
      description: "よりゆっくりと皿数を重ねる、充実した構成を想定したコースです。",
      composition: ["アミューズ", "前菜", "魚料理", "肉料理", "デザート など"],
      image: "/images/french/beef.avif",
      alt: "牛肉と季節の野菜を盛り付けたフレンチの一皿",
      note: "料理構成は差し替え用の仮データです。",
    },
  ],
  drinks: [
    { id: "single", label: "ドリンク単品", description: "その日の気分に合わせて、一杯ずつ選ぶスタイルです。" },
    { id: "free-flow", label: "飲み放題", description: "料金・時間・銘柄は、店舗からの確認連絡でご案内いたします。" },
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
    hero: "/images/french/hero.avif",
    background: "/images/french/anniversary.avif",
    fish: "/images/french/fish.avif",
    beef: "/images/french/beef.avif",
    wine: "/images/french/wine.avif",
    anniversary: "/images/french/anniversary.avif",
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
