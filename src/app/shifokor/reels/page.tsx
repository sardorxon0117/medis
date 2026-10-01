import type { Metadata } from "next";
import { PageHead, Stat } from "@/components/ui";
import { CURRENT, reels } from "@/lib/mock-data";
import { compact } from "@/lib/format";
import { ReelsManager } from "./ReelsManager";

export const metadata: Metadata = { title: "Reels" };

export default function Page() {
  const mine = reels.filter((r) => r.doctorId === CURRENT.doctorId);
  const views = mine.reduce((s, r) => s + r.views, 0);
  const likes = mine.reduce((s, r) => s + r.likes, 0);
  return (
    <>
      <PageHead title="Reels" sub="60 soniyagacha vertikal video. Har bir video moderatsiyadan oʻtadi, faqat tasdiqlangan shifokorlar joylaydi." req="SH-10" />
      <div className="stats">
        <Stat label="Videolar" value={mine.length} />
        <Stat label="Koʻrishlar" value={compact(views)} />
        <Stat label="Layklar" value={compact(likes)} hint={`${((likes / Math.max(views, 1)) * 100).toFixed(1).replace(".", ",")}% jalb qilish`} />
      </div>
      <ReelsManager initial={mine} />
    </>
  );
}
