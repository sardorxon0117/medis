"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/Icon";
import { Card } from "@/components/ui";
import { num, som } from "@/lib/format";
import type { AdCategory } from "@/lib/types";

const CATEGORIES: { key: AdCategory; label: string }[] = [
  { key: "klinika", label: "Klinikalar" },
  { key: "apteka", label: "Apteka tarmoqlari" },
  { key: "sport", label: "Sport" },
  { key: "sugʻurta", label: "Sugʻurta" },
];

// Tibbiy reklama qoidalari: dastlabki avtomatik tekshiruv, yakuniy qarorni moderator qiladi
const BANNED = ["moʻjiza", "mo'jiza", "barcha kasallik", "100% davolaydi", "kafolatli davo", "operatsiyasiz", "xalos"];

export function AdForm({ cpm }: { cpm: number }) {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [category, setCategory] = useState<AdCategory>("sport");
  const [budget, setBudget] = useState(2000000);
  const [sent, setSent] = useState(false);

  const flagged = BANNED.filter((w) => `${title} ${text}`.toLowerCase().includes(w));
  const views = Math.floor((budget / cpm) * 1000);

  if (sent) {
    return (
      <Card>
        <div className="empty stack" style={{ justifyItems: "center", color: "var(--fg)" }}>
          <Icon name="clock" size={36} />
          <h2>Reklama moderatsiyaga yuborildi</h2>
          <p className="muted">Odatda 24 soat ichida koʻrib chiqiladi. Tasdiqlangach byudjetdan yechish boshlanadi.</p>
          <Link className="btn" href="/reklama">Kampaniyalarga qaytish</Link>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid-main">
      <Card>
        <form className="stack" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
          <div className="field">
            <span className="label-txt">Toifa</span>
            <div className="chips" role="group" aria-label="Toifa">
              {CATEGORIES.map((c) => (
                <button type="button" key={c.key} className="chip" aria-pressed={category === c.key} onClick={() => setCategory(c.key)}>{c.label}</button>
              ))}
            </div>
            <span className="hint">Boshqa toifalar (oziq-ovqat qoʻshimchalari, kosmetika va h.k.) qabul qilinmaydi.</span>
          </div>
          <div className="field"><label htmlFor="ad-title">Sarlavha</label><input id="ad-title" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={60} required /></div>
          <div className="field"><label htmlFor="ad-text">Matn</label><textarea id="ad-text" value={text} onChange={(e) => setText(e.target.value)} maxLength={200} /></div>
          {flagged.length > 0 && (
            <div className="alert-row xavf" style={{ padding: 0 }}>
              <span className="bar" />
              <div className="small"><b>Taqiqlangan ibora:</b> {flagged.join(", ")}. Isbotlanmagan davolash vaʼdalari reklamada mumkin emas.</div>
            </div>
          )}
          <div className="field"><label htmlFor="ad-media">Video (9:16, 15 s gacha) yoki rasm</label><input id="ad-media" type="file" accept="video/mp4,image/*" /></div>
          <div className="field">
            <label htmlFor="ad-budget">Byudjet: <span className="mono">{som(budget)}</span></label>
            <input id="ad-budget" type="range" min={500000} max={20000000} step={500000} value={budget} onChange={(e) => setBudget(Number(e.target.value))} style={{ minHeight: 0, padding: 0, border: 0, background: "transparent", accentColor: "var(--teal)" }} />
          </div>
          <button className="btn" disabled={flagged.length > 0 || !title}>Moderatsiyaga yuborish</button>
        </form>
      </Card>

      <Card title="Taxminiy natija">
        <div className="stack">
          <dl className="kv">
            <dt>Narx</dt><dd>{som(cpm)} / 1 000 koʻrish</dd>
            <dt>Koʻrishlar</dt><dd className="mono">≈ {num(views)}</dd>
            <dt>Bosishlar</dt><dd className="mono">≈ {num(Math.round(views * 0.016))}</dd>
          </dl>
          <div className="reel" style={{ maxWidth: 200 }}>
            <div className="thumb" style={{ background: "linear-gradient(160deg,#1f8a5b,#1b2a4a)" }}>
              <span style={{ padding: 14, textAlign: "center", fontWeight: 700 }}>{title || "Sarlavha"}</span>
              <span className="dur">Reklama</span>
            </div>
            <div className="meta"><span className="xs muted">{text || "Reklama matni"}</span></div>
          </div>
        </div>
      </Card>
    </div>
  );
}
