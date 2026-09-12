import type { Course } from "@/content/restaurant";
import { reservationCourses, type ReservationCourse } from "@/content/reservation";

export type MenuDish = Pick<Course, "chapter" | "title" | "description" | "origin" | "details"> & {
  imageSrc: string;
  alt: string;
};

export type CompleteMenuCourse = ReservationCourse & { dishes: MenuDish[] };

const chapters = ["先付", "前菜", "椀", "向付", "焼物", "温物", "肉", "食事", "甘味", "余韻"];
const dish = (title: string, file: string, index: number): MenuDish => ({ chapter: chapters[index], title, description: "", origin: "", details: [], imageSrc: file, alt: `${title}を盛り付けた一皿` });

const newMenus: Record<string, MenuDish[]> = {
  yoi: [
    ["胡麻豆腐、山葵", "01-gomadofu.webp"], ["新銀杏、藻塩", "02-ginnan.webp"], ["焼き椎茸、菊花", "03-shiitake.webp"], ["白身魚、蕪の椀", "04-shiromi-kabu-wan.webp"], ["秋鯖、辛子酢味噌", "05-saba.webp"], ["太刀魚、幽庵焼", "06-tachiuo.webp"], ["百合根、銀餡", "07-yurine.webp"], ["鶏つくね、実山椒", "08-tsukune.webp"], ["零余子御飯、香の物", "09-mukago-gohan.webp"], ["柿、白和え", "10-kaki.webp"],
  ].map(([title, file], index) => dish(title, `/images/courses/yoi/${file}`, index)),
  akari: [
    ["車海老、菜花", "01-kurumaebi-nanohana.webp"], ["平貝、うるい", "02-tairagai-urui.webp"], ["蛤、若布の椀", "03-hamaguri-wakame-wan.webp"], ["桜鯛、木の芽", "04-sakuradai-kinome.webp"], ["筍、蕗味噌焼", "05-takenoko-fukimiso.webp"], ["鰆、酒蒸し", "06-sawara-sakamushi.webp"], ["新じゃが、浅利餡", "07-shinjaga-asari.webp"], ["合鴨、芹", "08-aigamo-seri.webp"], ["浅蜊御飯、三つ葉", "09-asari-gohan.webp"], ["苺、甘酒", "10-ichigo-amazake.webp"],
  ].map(([title, file], index) => dish(title, `/images/courses/akari/${file}`, index)),
  honoo: [
    ["海胆、焼き海苔", "01-uni-nori.webp"], ["伊勢海老、黄身酢", "02-iseebi-kimizu.webp"], ["のどぐろ、潮椀", "03-nodoguro-ushio-wan.webp"], ["寒鰤、炙り", "04-kanburi-aburi.webp"], ["鮑、肝醤油", "05-awabi-kimojoyu.webp"], ["金目鯛、炭火焼", "06-kinmedai-sumibiyaki.webp"], ["近江牛、山椒", "07-omigyu-sansho.webp"], ["焼き穴子、土鍋御飯", "08-anago-donabe.webp"], ["林檎、焙じ茶", "09-ringo-hojicha.webp"], ["黒糖蕨餅、薄茶", "10-kokuto-warabi.webp"],
  ].map(([title, file], index) => dish(title, `/images/courses/homura/${file}`, index)),
  special: [
    ["唐墨、白子", "01-karasumi-shirako.webp"], ["松葉蟹、土佐酢", "02-matsubagani-tosazu.webp"], ["すっぽん、焼き葱の椀", "03-suppon-yakinegi-wan.webp"], ["九絵、煎り酒", "04-kue-irizake.webp"], ["伊勢海老、雲丹焼", "05-iseebi-uni-yaki.webp"], ["天然鰻、山椒焼", "06-tennen-unagi-sansho.webp"], ["松阪牛、花山椒", "07-matsusakagyu-hanazansho.webp"], ["鮑、肝土鍋御飯", "08-awabi-kimo-donabe.webp"], ["完熟マンゴー、葛", "09-mango-kuzu.webp"], ["本蕨、和三盆", "10-honwarabi-wasanbon.webp"],
  ].map(([title, file], index) => dish(title, `/images/courses/special/${file}`, index)),
};

export function getCompleteMenu(existing: Course[]): CompleteMenuCourse[] {
  return reservationCourses.map((course) => ({
    ...course,
    dishes: course.id === "kagari" ? existing.map((item) => ({ ...item, imageSrc: `/images/course/avif/${item.image}.avif`, alt: item.photo?.alt ?? `${item.chapter}「${item.title}」` })) : newMenus[course.id],
  }));
}
