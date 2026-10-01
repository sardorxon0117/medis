import type { IconName } from "@/components/Icon";

export type PanelKey = "shifokor" | "klinika" | "apteka" | "reklama" | "admin";

export interface NavItem {
  href: string;
  label: string;
  icon: IconName;
  count?: number;
}

export interface PanelConfig {
  title: string;
  user: { name: string; sub: string };
  nav: NavItem[];
}

export const panels: Record<PanelKey, PanelConfig> = {
  shifokor: {
    title: "Shifokor paneli",
    user: { name: "Aziza Karimova", sub: "Umumiy jarroh" },
    nav: [
      { href: "/shifokor", label: "Bosh panel", icon: "home" },
      { href: "/shifokor/bemorlar", label: "Bemorlar", icon: "users" },
      { href: "/shifokor/signallar", label: "Signallar", icon: "bell", count: 3 },
      { href: "/shifokor/retsept", label: "Retsept yozish", icon: "rx" },
      { href: "/shifokor/navbat", label: "Navbat", icon: "calendar" },
      { href: "/shifokor/reels", label: "Reels", icon: "video" },
      { href: "/shifokor/profil", label: "Profil", icon: "user" },
    ],
  },
  klinika: {
    title: "Klinika paneli",
    user: { name: "Shifo Med klinikasi", sub: "Administrator" },
    nav: [
      { href: "/klinika", label: "Statistika", icon: "chart" },
      { href: "/klinika/navbat", label: "Navbat", icon: "calendar" },
      { href: "/klinika/shifokorlar", label: "Shifokorlar", icon: "stethoscope" },
      { href: "/klinika/jadval", label: "Ish jadvali", icon: "clock" },
      { href: "/klinika/profil", label: "Klinika profili", icon: "building" },
      { href: "/klinika/obuna", label: "Pro obuna", icon: "crown" },
    ],
  },
  apteka: {
    title: "Apteka paneli",
    user: { name: "Dorixona Plus", sub: "Chilonzor filiali" },
    nav: [
      { href: "/apteka", label: "Buyurtmalar", icon: "box", count: 2 },
      { href: "/apteka/katalog", label: "Dorilar katalogi", icon: "pill" },
      { href: "/apteka/hisobot", label: "Hisobot", icon: "chart" },
      { href: "/apteka/profil", label: "Apteka profili", icon: "building" },
    ],
  },
  reklama: {
    title: "Reklama kabineti",
    user: { name: "FitLife sport zali", sub: "Reklama beruvchi" },
    nav: [
      { href: "/reklama", label: "Kampaniyalar", icon: "megaphone" },
      { href: "/reklama/yangi", label: "Yangi reklama", icon: "plus" },
      { href: "/reklama/balans", label: "Balans", icon: "wallet" },
    ],
  },
  admin: {
    title: "Platforma admini",
    user: { name: "admin@medis.uz", sub: "Super administrator" },
    nav: [
      { href: "/admin", label: "Umumiy holat", icon: "home" },
      { href: "/admin/tasdiqlash", label: "Tasdiqlash", icon: "shield", count: 5 },
      { href: "/admin/moderatsiya", label: "Moderatsiya", icon: "flag", count: 3 },
      { href: "/admin/sos", label: "SOS jurnali", icon: "siren" },
      { href: "/admin/tolovlar", label: "Toʻlovlar", icon: "wallet" },
      { href: "/admin/sozlamalar", label: "Narx va sozlamalar", icon: "settings" },
      { href: "/admin/audit", label: "Audit jurnali", icon: "list" },
    ],
  },
};
