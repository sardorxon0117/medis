"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";
import { Card, ModerationBadge } from "@/components/ui";
import { compact, date } from "@/lib/format";
import { TODAY } from "@/lib/mock-data";
import type { Reel } from "@/lib/types";

const MAX_MB = 100;
const MAX_SEC = 60;

function readDuration(file: File) {
  return new Promise<number>((resolve) => {
    const v = document.createElement("video");
    v.preload = "metadata";
    v.onloadedmetadata = () => {
      URL.revokeObjectURL(v.src);
      resolve(v.duration);
    };
    v.onerror = () => resolve(NaN);
    v.src = URL.createObjectURL(file);
  });
}

export function ReelsManager({ initial }: { initial: Reel[] }) {
  const [list, setList] = useState(initial);
  const [file, setFile] = useState<{ name: string; sec: number; mb: number } | null>(null);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");

  const pick = async (f: File | undefined) => {
    setError("");
    setFile(null);
    if (!f) return;
    if (f.type !== "video/mp4") return setError("Faqat MP4 formatidagi video qabul qilinadi");
    const mb = f.size / 1024 / 1024;
    if (mb > MAX_MB) return setError(`Fayl hajmi ${MAX_MB} MB dan oshmasligi kerak (${mb.toFixed(0)} MB)`);
    const sec = await readDuration(f);
    if (Number.isFinite(sec) && sec > MAX_SEC) return setError(`Video ${MAX_SEC} soniyadan uzun boʻlmasligi kerak (${Math.round(sec)} s)`);
    setFile({ name: f.name, sec: Number.isFinite(sec) ? Math.round(sec) : 0, mb });
  };

  return (
    <div className="grid-main">
      <Card title="Mening videolarim">
        <div className="reels">
          {list.map((r) => (
            <article className="reel" key={r.id}>
              <div className="thumb">
                <Icon name="play" size={36} />
                <span className="dur">0:{String(r.durationSec).padStart(2, "0")}</span>
              </div>
              <div className="meta">
                <b>{r.title}</b>
                <ModerationBadge status={r.moderation} />
                <span className="xs muted">
                  {r.moderation === "tasdiqlangan" ? `${compact(r.views)} koʻrish · ${compact(r.likes)} layk` : "Tekshiruvdan keyin lentaga chiqadi"} · {date(r.date)}
                </span>
                <span className="xs muted">{r.tags.map((t) => `#${t}`).join(" ")}</span>
              </div>
            </article>
          ))}
        </div>
      </Card>

      <Card title="Yangi video yuklash">
        <form
          className="stack"
          onSubmit={(e) => {
            e.preventDefault();
            if (!file) return setError("Video tanlang");
            setList([
              {
                id: `r${Date.now()}`, doctorId: "d1", title, tags: tags.split(/[,#\s]+/).filter(Boolean),
                moderation: "kutilmoqda", views: 0, likes: 0, durationSec: file.sec || 45, date: TODAY, complaints: 0,
              },
              ...list,
            ]);
            setFile(null);
            setTitle("");
            setTags("");
          }}
        >
          <label className="dropzone" style={{ cursor: "pointer" }}>
            <Icon name="upload" size={28} />
            <b style={{ color: "var(--fg)" }}>{file ? file.name : "MP4 videoni tanlang"}</b>
            <span className="xs">{file ? `${file.sec ? `${file.sec} s · ` : ""}${file.mb.toFixed(1)} MB` : `${MAX_SEC} s gacha, ${MAX_MB} MB gacha, vertikal`}</span>
            <input type="file" accept="video/mp4" hidden onChange={(e) => pick(e.target.files?.[0])} />
          </label>
          {error && <span style={{ color: "var(--danger)", fontWeight: 600, fontSize: 14 }}>{error}</span>}
          <div className="field">
            <label htmlFor="rt">Sarlavha</label>
            <input id="rt" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={90} required />
          </div>
          <div className="field">
            <label htmlFor="rtags">Teglar</label>
            <input id="rtags" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="jarrohlik, chok, parvarish" />
          </div>
          <p className="hint">Isbotlanmagan davolash usullari va dori reklamasi taqiqlanadi. Bemorlar shikoyat qila oladi.</p>
          <button className="btn" disabled={!file}>Moderatsiyaga yuborish</button>
        </form>
      </Card>
    </div>
  );
}
