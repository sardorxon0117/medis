import type { Metadata } from "next";
import { PageHead } from "@/components/ui";
import { getDoctor } from "@/lib/api";
import { ads, reels } from "@/lib/mock-data";
import { ModerationQueue, type ModItem } from "./ModerationQueue";

export const metadata: Metadata = { title: "Moderatsiya" };

export default function Page() {
  const items: ModItem[] = [
    ...reels.map((r) => ({
      id: r.id, kind: "Video" as const, title: r.title, author: `Dr. ${getDoctor(r.doctorId)?.fullName}`,
      meta: `${r.durationSec} s · ${r.tags.map((t) => `#${t}`).join(" ")}`, status: r.moderation, complaints: r.complaints,
    })),
    ...ads.map((a) => ({
      id: a.id, kind: "Reklama" as const, title: a.title, author: a.advertiser,
      meta: `Toifa: ${a.category} · ${a.media === "video" ? "video" : "rasm"}`, status: a.moderation, complaints: 0,
    })),
  ];
  return (
    <>
      <PageHead title="Moderatsiya" sub="Reels va reklama lentaga chiqishidan oldin tekshiriladi. Shikoyat tushgan videolar qayta koʻriladi." req="4.7" />
      <ModerationQueue initial={items} />
    </>
  );
}
