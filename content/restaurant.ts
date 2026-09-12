import { reservationPolicy } from "@/content/reservation";

export type CmsImage = {
  url: string;
  width?: number;
  height?: number;
  alt?: string;
};

export type Course = {
  id?: string;
  chapter: string;
  title: string;
  description: string;
  origin: string;
  details: { label: string; value: string }[];
  image: string;
  photo?: CmsImage;
  sortOrder?: number;
};

export type RestaurantContent = {
  brand: { ja: string; en: string };
  navigation: { label: string; href: string }[];
  hero: { title: string; body: string };
  philosophy: { title: string; body: string };
  courses: Course[];
  courseSection: { eyebrow: string; title: string; titleAccent: string; intro: string };
  chef: { name: string; nameEn: string; title: string; quote: string; bio: string };
  provenance: { title: string; body: string };
  space: { title: string; body: string };
  reservation: { title: string; note: string };
  details: {
    address: string;
    access: string;
    telephone: string;
    reception: string;
    hours: string;
    closed: string;
    course: string;
    seats: string;
    children: string;
    dress: string;
    allergy: string;
    pairing: string;
    cancellation: string;
  };
  notices: { id?: string; date: string; title: string; sortOrder?: number }[];
  publicationVerification: { status: string; items: string[] };
};

export const restaurant: RestaurantContent = {
  brand: { ja: "篝", en: "KAGARI" },
  navigation: [
    { label: "お品書き", href: "/menu" },
    { label: "店舗案内", href: "/#access" },
  ],
  hero: {
    title: "火と余白。",
    body: "銀座八丁目、カウンター八席の日本料理。",
  },
  philosophy: {
    title: "火の前で決める",
    body: "畑や浜で始まった時間を、厨房の都合で均さないこと。包丁を入れる厚み、塩を当てる時刻、炭から離す一呼吸を、その日の素材に聞いて決めます。",
  },
  courses: [
    { chapter: "序", title: "焼き無花果、胡麻", description: "果肉を崩さぬよう炭の遠火に当て、白胡麻の衣は供する直前に和えます。温度差を最初の一口に。", origin: "兵庫・川西　中西農園の桝井ドーフィン", details: [{ label: "器", value: "尾形アツシ　刷毛目小鉢" }, { label: "合わせる酒", value: "群馬・土田 生酛の常温" }], image: "01-jo" },
    { chapter: "先付", title: "菊菜、渡り蟹", description: "摘みたての苦みと、内子の甘み。土佐酢の輪郭だけを残します。", origin: "奈良・宇陀　松田さんの大和きくな", details: [{ label: "蟹", value: "愛知・三河湾 小型底曳網" }, { label: "仕立て", value: "土佐酢、生姜" }, { label: "温度", value: "十二度" }], image: "02-sakizuke" },
    { chapter: "椀", title: "鱧と松茸", description: "鱧は骨切りの幅をわずかに変え、椀の中で開く強さを整えます。松茸の香りを追い越さない一番出汁で。", origin: "兵庫・淡路島 沼島漁協の活け鱧", details: [{ label: "松茸", value: "岩手・岩泉　佐々木さんの朝採り" }, { label: "吸い口", value: "青柚子" }], image: "03-wan" },
    { chapter: "向付", title: "戻り鰹、藁の煙", description: "厚く引いた鰹を、藁の炎へ一度だけ。皮下の脂が緩むところで止めます。", origin: "宮城・気仙沼　第二十八安洋丸の一本釣り鰹", details: [{ label: "薬味", value: "高知・春野の葉にんにく" }, { label: "醤油", value: "和歌山・湯浅 九曜むらさき" }, { label: "その日の判断", value: "脂を見て藁の本数を二〜四束に" }], image: "04-mukozuke" },
    { chapter: "炭火", title: "賀茂茄子、すっぽん", description: "割らずに炭へ置き、皮の内側で蒸す。焼き上がりだけを匙で掬い、すっぽんの餡を薄くまとわせます。", origin: "京都・上賀茂　田鶴農園の賀茂茄子", details: [{ label: "炭", value: "和歌山・みなべ 紀州備長炭" }, { label: "餡", value: "静岡・服部中村養鼈場のすっぽん" }], image: "05-sumibi" },
    { chapter: "魚", title: "甘鯛、鱗", description: "身はしっとり、鱗は薄い硝子のように。油へ落とさず、炭と熱した胡麻油で立たせます。焼き上がりに酢橘をひと絞り。", origin: "長崎・平戸　志々伎漁協定置網の赤甘鯛", details: [{ label: "火入れ", value: "炭火、熱胡麻油" }, { label: "器", value: "内田鋼一　白釉輪花皿" }, { label: "酒", value: "秋田・新政 涅槃龜" }], image: "06-sakana" },
    { chapter: "肉", title: "短角牛と千住葱", description: "サーロインを塊で焼き、火から外していた時間と同じだけ休ませます。脂を足さず、葱の焦げた甘みで食べる一皿です。", origin: "岩手・岩泉　上山牧場の日本短角種", details: [{ label: "葱", value: "東京・足立　葱茂の千住葱" }, { label: "炭", value: "高知・室戸 土佐備長炭" }, { label: "休ませ", value: "六分を目安に肉の張りで判断" }], image: "07-niku" },
    { chapter: "土鍋", title: "毛蟹、新生姜の御飯", description: "一膳目はそのまま。二膳目には蟹味噌と煎り胡麻を。残りは小さなおむすびでお持ち帰りいただけます。", origin: "北海道・噴火湾　砂原漁協の毛蟹", details: [{ label: "米", value: "新潟・魚沼　関智晴さんのコシヒカリ" }, { label: "土鍋", value: "三重・伊賀　福森雅武作" }], image: "08-donabe" },
    { chapter: "甘味", title: "幸水梨、酢橘", description: "梨の果汁を寒天に寄せ、同じ梨の角切りを忍ばせます。", origin: "千葉・鎌ケ谷　初清園の幸水梨", details: [{ label: "香り", value: "徳島・神山町 里山みらいの酢橘" }, { label: "甘み", value: "和三盆を最小限に" }], image: "09-kanmi" },
    { chapter: "余韻", title: "薄茶、栗きんとん", description: "食事を閉じるのは、京都の薄茶と蒸した栗の小さな菓子。お急ぎでなければ、もう一服お点てします。", origin: "京都・宇治白川　辻喜代治さんの碾茶", details: [{ label: "栗", value: "岐阜・恵那　恵那川上屋の超特選恵那栗" }, { label: "菓子器", value: "赤木明登　黒漆小皿" }, { label: "一服", value: "七十五度、四十秒" }], image: "10-yoin" },
  ],
  courseSection: {
    eyebrow: "SEPTEMBER / TEN COURSES",
    title: "十皿、",
    titleAccent: "今夜の火加減。",
    intro: "九月の献立より。浜と畑の状態に合わせ、毎朝仕立てを決めます。",
  },
  chef: {
    name: "髙瀬 直人",
    nameEn: "NAOTO TAKASE",
    title: "料理長",
    quote: "鮎の青い香りが残る、わずかな旬を逃さない。炭との距離を見極め、皮は香ばしく、身はしっとりと焼き上げます。",
    bio: "1981年、山形県鶴岡市生まれ。京都・祇園の料亭で十二年、金沢の日本料理店で料理長を務める。2022年に銀座「篝」を開店。浜と畑へ足を運び、仕入れた日の状態から献立を組み立てる。",
  },
  provenance: {
    title: "誰が育て、誰が獲ったか",
    body: "産地名だけで終わらせません。畑の霜、浜の風、締め方の違いまで料理人が受け取り、献立と火入れへ返します。",
  },
  space: {
    title: "八席",
    body: "樹齢百年の檜を一枚で通したカウンター。厨房との間に段差を設けず、包丁の音と炭の気配が静かに届く距離に整えました。",
  },
  reservation: {
    title: "ご予約",
    note: "毎月一日正午に、翌々月末までの席を承ります。お電話は営業日の十二時から十六時まで。",
  },
  details: {
    address: "〒104-0061 東京都中央区銀座8丁目7番19号 銀座三鈴ビル3階",
    access: "東京メトロ銀座駅 A2出口より徒歩6分／JR新橋駅 銀座口より徒歩5分",
    telephone: "03-6263-8817",
    reception: "予約受付 12:00–16:00（営業日のみ）",
    hours: reservationPolicy.slots.map((slot) => `${slot} 一斉スタート`).join("／"),
    closed: "日曜・第2月曜 定休",
    course: "おまかせ 33,000円（税込・サービス料10%別）",
    seats: "檜カウンター8席／4名様までの個室1室",
    children: "カウンターは中学生以上。個室は未就学児もご相談いただけます。",
    dress: "香りの強い香水はお控えください。短パン、サンダルでのご来店はご遠慮いただいております。",
    allergy: "アレルギーと召し上がれない食材は、ご来店3日前までにお知らせください。広範な除去が必要な場合はお受けできないことがございます。",
    pairing: "日本酒ペアリング 16,500円／日本酒とワインの混合ペアリング 19,800円（税込・サービス料別）",
    cancellation: "ご来店7日前より50%、3日前より100%。人数減も同様に申し受けます。",
  },
  notices: [
    { date: "2026.09.01", title: "十一月席のご予約を開始しました" },
    { date: "2026.08.24", title: "九月十五日・十六日は器の入れ替えのため休業します" },
    { date: "2026.08.08", title: "秋の日本酒ペアリングが始まります" },
  ],
  publicationVerification: {
    status: "要確認",
    items: ["店名", "法人名", "住所", "電話番号", "営業時間", "価格", "定休日", "料理長名と経歴", "生産者名", "公開ドメイン", "キャンセル規定"],
  },
};
