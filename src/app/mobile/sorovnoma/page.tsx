"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";
import { useToast } from "@/components/useToast";
import { plans } from "@/lib/mock-data";
import { patient, todayKey, useNow, useStore, type MSurvey } from "../store";
import { AppBar, dayLabel } from "../ui";

const WOUND: { k: MSurvey["wound"]; l: string }[] = [
  { k: "yaxshi", l: "Yaxshi" },
  { k: "qizargan", l: "Qizargan" },
  { k: "suyuqlik_bor", l: "Suyuqlik bor" },
];

export default function Page() {
  const { s, set } = useStore();
  const now = useNow();
  const toast = useToast();
  const plan = plans.find((p) => p.patientId === patient.id)!;
  const day = todayKey(now);
  const doneToday = s.surveys.some((x) => x.date === day);
  const [pain, setPain] = useState(3);
  const [temp, setTemp] = useState("36,8");
  const [wound, setWound] = useState<MSurvey["wound"]>("yaxshi");
  const [photo, setPhoto] = useState<string | null>(null);
  const t = Number(temp.replace(",", "."));

  return (
    <div className="m-stack">
      <AppBar title="Holat soʻrovnomasi" back="/mobile" />
      <div className="m-note"><Icon name="clock" size={16} />Operatsiyadan keyin kuniga 1 marta toʻldiring — javoblar shifokoringizga boradi.</div>
      {doneToday ? (
        <div className="m-hero ok"><b className="big">Bugungi soʻrovnoma yuborildi</b><span>Ertaga yana eslatamiz.</span></div>
      ) : (
        <form
          className="m-stack"
          onSubmit={(e) => {
            e.preventDefault();
            set((x) => ({ ...x, surveys: [...x.surveys, { date: day, pain, temp: t, wound, photo: !!photo }] }));
            const alert = pain > plan.thresholds.painMax || t > plan.thresholds.tempMax || wound !== "yaxshi";
            toast.show(alert ? "Yuborildi. Koʻrsatkich chegaradan oshgan — shifokorga signal ketdi." : "Yuborildi. Rahmat!");
          }}
        >
          <div className="m-card">
            <div className="m-row"><b className="m-grow">Ogʻriq darajasi</b><b style={{ fontSize: 26, color: pain > 6 ? "var(--danger)" : "var(--teal)" }}>{pain}</b></div>
            <input type="range" min={0} max={10} value={pain} onChange={(e) => setPain(Number(e.target.value))} style={{ accentColor: "var(--teal)", width: "100%" }} aria-label="Ogʻriq 0 dan 10 gacha" />
            <div className="m-row" style={{ justifyContent: "space-between" }}><small className="m-muted">0 — ogʻriq yoʻq</small><small className="m-muted">10 — juda kuchli</small></div>
          </div>
          <label className="m-card m-field"><span>Harorat, °C</span><input className="m-input" inputMode="decimal" value={temp} onChange={(e) => setTemp(e.target.value)} /></label>
          <div className="m-card">
            <b>Chok holati</b>
            <div className="m-chips">{WOUND.map((w) => <button type="button" key={w.k} className="m-chip" aria-pressed={wound === w.k} onClick={() => setWound(w.k)}>{w.l}</button>)}</div>
            <label className="m-btn ghost block" style={{ cursor: "pointer" }}>
              <Icon name="camera" size={18} />{photo ? `Rasm: ${photo}` : "Chok rasmini yuklash"}
              <input type="file" accept="image/*" capture="environment" hidden onChange={(e) => setPhoto(e.target.files?.[0]?.name ?? null)} />
            </label>
          </div>
          <button className="m-btn block" disabled={Number.isNaN(t)}>Yuborish</button>
        </form>
      )}
      <span className="m-label">Oldingi javoblar</span>
      {[...s.surveys].reverse().slice(0, 7).map((x) => (
        <div key={x.date} className="m-dose">
          <span className="t">{dayLabel(x.date)}</span>
          <span className="m-grow"><b>Ogʻriq {x.pain}/10 · {x.temp.toFixed(1).replace(".", ",")}°</b><small>Chok: {WOUND.find((w) => w.k === x.wound)?.l}{x.photo ? " · rasm bor" : ""}</small></span>
          {x.pain > plan.thresholds.painMax || x.temp > plan.thresholds.tempMax || x.wound !== "yaxshi" ? <span className="m-badge red">Diqqat</span> : <span className="m-badge ok">Yaxshi</span>}
        </div>
      ))}
      {toast.node}
    </div>
  );
}
