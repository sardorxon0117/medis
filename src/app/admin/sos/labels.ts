import type { SosEvent } from "@/lib/types";

export const SOS_SOURCE: Record<SosEvent["source"], string> = {
  tugma: "SOS tugmasi",
  bilaguzuk: "Bilaguzuk",
  shifokor: "Shifokor",
};

export const SOS_STATUS: Record<SosEvent["status"], ["ok" | "warn" | "", string]> = {
  bekor_qilindi: ["", "Bekor qilindi"],
  yuborildi: ["warn", "Yuborildi"],
  yetib_keldi: ["ok", "Brigada yetib keldi"],
};
