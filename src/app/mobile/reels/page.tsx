"use client";

import Link from "next/link";
import { Icon } from "@/components/Icon";
import { useToast } from "@/components/useToast";
import { getDoctor } from "@/lib/api";
import { ads, reels } from "@/lib/mock-data";
import { compact } from "@/lib/format";
import { useStore } from "../store";

const BG = [
  "linear-gradient(160deg,#0b8e9b,#1b2a4a,#0a5a66)",
  "linear-gradient(160deg,#3b4fa0,#132036,#2d6fd1)",
  "linear-gradient(160deg,#1f8a5b,#0f2a22,#2ec4d1)",
  "linear-gradient(160deg,#6a4fc4,#1b2a4a,#c9443a)",
];

type Card = { kind: "video"; id: string; title: string; author: string; tags: string[]; likes: number; views: number; doctorId: string } | { kind: "ad"; id: string; title: string; author: string; category: string };

export default function Page() {
  const { s, set } = useStore();
  const toast = useToast();
  const vids = reels.filter((r) => r.moderation === "tasdiqlangan");
  const pool = [...vids, ...vids, ...vids]; // demo lenta uzunroq boʻlishi uchun takrorlanadi
  const adPool = ads.filter((a) => a.moderation === "tasdiqlangan" && a.status === "faol");
  const feed: Card[] = [];
  pool.forEach((r, i) => {
    feed.push({ kind: "video", id: `${r.id}-${i}`, title: r.title, author: getDoctor(r.doctorId)!.fullName, tags: r.tags, likes: r.likes, views: r.views, doctorId: r.doctorId });
    if ((i + 1) % 4 === 0 && adPool.length) { // har 4 ta videodan keyin 1 ta reklama (TZ 4.7)
      const a = adPool[(i / 4) % adPool.length | 0];
      feed.push({ kind: "ad", id: `ad-${a.id}-${i}`, title: a.title, author: a.advertiser, category: a.category });
    }
  });
  const toggle = (key: "likes" | "saved", id: string) => set((x) => ({ ...x, [key]: x[key].includes(id) ? x[key].filter((y) => y !== id) : [...x[key], id] }));

  return (
    <div className="m-reels">
      {feed.map((c, i) => (
        <section key={c.id} className="m-reel">
          <div className="m-reel-bg" style={{ background: c.kind === "ad" ? "linear-gradient(160deg,#b7791f,#3a2a00,#f0b429)" : BG[i % BG.length], backgroundSize: "160% 160%" }} />
          <div className="m-reel-top"><span>Reels</span><Link href="/mobile" style={{ color: "#fff" }} aria-label="Yopish"><Icon name="x" size={24} /></Link></div>
          <div className="m-reel-play"><Icon name="play" size={64} /></div>
          {c.kind === "ad" ? (
            <>
              <span className="m-ad-tag">Reklama · {c.category}</span>
              <h2>{c.title}</h2>
              <span style={{ opacity: 0.85 }}>{c.author}</span>
              <button className="m-btn white" style={{ marginTop: 10, alignSelf: "flex-start" }} onClick={() => toast.show("Reklama beruvchi sahifasi ochildi")}>Batafsil</button>
            </>
          ) : (
            <>
              <Link href={`/mobile/shifokorlar/${c.doctorId}`} style={{ color: "#fff", fontWeight: 800, textDecoration: "none" }}>Dr. {c.author} ✓</Link>
              <h2>{c.title}</h2>
              <span style={{ opacity: 0.8, fontSize: 14 }}>{c.tags.map((t) => `#${t}`).join(" ")} · {compact(c.views)} koʻrish</span>
              <div className="m-reel-side">
                <button aria-pressed={s.likes.includes(c.id)} onClick={() => toggle("likes", c.id)}><span className="c"><Icon name="heart" size={22} /></span>{compact(c.likes + (s.likes.includes(c.id) ? 1 : 0))}</button>
                <button aria-pressed={s.saved.includes(c.id)} onClick={() => toggle("saved", c.id)}><span className="c"><Icon name="bookmark" size={22} /></span>Saqlash</button>
                <button onClick={() => { navigator.clipboard?.writeText(`https://medis.tayyorr.uz/mobile/reels`).catch(() => {}); toast.show("Havola nusxalandi"); }}><span className="c"><Icon name="share" size={22} /></span>Ulashish</button>
                <button onClick={() => toast.show("Shikoyat moderatorga yuborildi")}><span className="c"><Icon name="flag" size={20} /></span>Shikoyat</button>
              </div>
            </>
          )}
        </section>
      ))}
      {toast.node}
    </div>
  );
}
