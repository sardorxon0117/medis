"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";
import { Badge, ModerationBadge } from "@/components/ui";
import { useToast } from "@/components/useToast";

export interface ModItem {
  id: string;
  kind: "Video" | "Reklama";
  title: string;
  author: string;
  meta: string;
  status: "kutilmoqda" | "tasdiqlangan" | "rad_etilgan";
  complaints: number;
}

const TABS = [
  { key: "kutilmoqda", label: "Kutilmoqda" },
  { key: "shikoyat", label: "Shikoyatlar" },
  { key: "tasdiqlangan", label: "Tasdiqlangan" },
  { key: "rad_etilgan", label: "Rad etilgan" },
] as const;

// Reklama qoidalari boʻyicha avtomatik belgilar (yakuniy qaror moderatorda)
const RED_FLAGS = ["xalos", "moʻjiza", "barcha kasallik", "kafolat"];

export function ModerationQueue({ initial }: { initial: ModItem[] }) {
  const [items, setItems] = useState(initial);
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("kutilmoqda");
  const toast = useToast();

  const shown = items.filter((i) => (tab === "shikoyat" ? i.complaints > 0 : i.status === tab));
  const set = (id: string, status: ModItem["status"], msg: string) => {
    setItems((l) => l.map((i) => (i.id === id ? { ...i, status } : i)));
    toast.show(msg);
  };

  return (
    <>
      <div className="tabs" role="tablist">
        {TABS.map((t) => (
          <button key={t.key} role="tab" aria-selected={tab === t.key} onClick={() => setTab(t.key)}>
            {t.label} ({items.filter((i) => (t.key === "shikoyat" ? i.complaints > 0 : i.status === t.key)).length})
          </button>
        ))}
      </div>
      <div className="reels" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}>
        {shown.map((i) => {
          const flag = RED_FLAGS.find((w) => i.title.toLowerCase().includes(w));
          return (
            <article className="reel" key={i.id}>
              <div className="thumb" style={{ aspectRatio: "9 / 10", background: i.kind === "Reklama" ? "linear-gradient(160deg,#b7791f,#1b2a4a)" : undefined }}>
                <Icon name="play" size={34} />
                <span className="dur">{i.kind}</span>
              </div>
              <div className="meta">
                <b>{i.title}</b>
                <span className="xs muted">{i.author}</span>
                <span className="xs muted">{i.meta}</span>
                <div className="row wrap-row">
                  <ModerationBadge status={i.status} />
                  {i.complaints ? <Badge tone="danger" plain>{i.complaints} shikoyat</Badge> : null}
                </div>
                {flag && <span className="xs" style={{ color: "var(--danger)", fontWeight: 700 }}>⚠ Shubhali ibora: “{flag}”</span>}
                <div className="row wrap-row">
                  {i.status !== "tasdiqlangan" && <button className="btn ok xs" onClick={() => set(i.id, "tasdiqlangan", `“${i.title}” tasdiqlandi`)}>Tasdiqlash</button>}
                  {i.status !== "rad_etilgan" && <button className="btn ghost xs" onClick={() => set(i.id, "rad_etilgan", `“${i.title}” rad etildi`)}>{i.status === "tasdiqlangan" ? "Lentadan olish" : "Rad etish"}</button>}
                </div>
              </div>
            </article>
          );
        })}
      </div>
      {!shown.length && <div className="empty">Bu boʻlim boʻsh</div>}
      {toast.node}
    </>
  );
}
