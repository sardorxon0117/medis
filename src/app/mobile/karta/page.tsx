"use client";

import { Icon } from "@/components/Icon";
import { age } from "@/lib/format";
import { patient } from "../store";
import { AppBar } from "../ui";

// MED-ID dan olingan va qoʻlda qoʻshilgan maʼlumotlar (B-03)
const labs = [
  { name: "Umumiy qon tahlili", date: "29-sen", note: "Leykotsitlar 11,2 — biroz yuqori", flag: true },
  { name: "C-reaktiv oqsil (CRP)", date: "29-sen", note: "18 mg/l", flag: true },
  { name: "Qonda qand miqdori", date: "26-sen", note: "5,1 mmol/l — meʼyorda", flag: false },
];

export default function Page() {
  const rows: [string, string][] = [
    ["Yosh", `${age(patient.birthDate)} yosh`],
    ["Jins", patient.gender],
    ["Qon guruhi", patient.bloodGroup],
    ["JSHSHIR", patient.pinfl],
  ];
  return (
    <div className="m-stack">
      <AppBar title="Tibbiy karta" back="/mobile/profil" />
      <div className="m-note"><Icon name="shield" size={16} />Maʼlumotlar MED-ID dan olindi. Yangi tahlil natijasini PDF sifatida qoʻshishingiz mumkin.</div>
      <div className="m-card">
        {rows.map(([k, v]) => <div key={k} className="m-row" style={{ justifyContent: "space-between" }}><span className="m-muted">{k}</span><b>{v}</b></div>)}
      </div>
      <span className="m-label">Allergiyalar</span>
      <div className="m-row" style={{ flexWrap: "wrap" }}>{patient.allergies.length ? patient.allergies.map((a) => <span key={a} className="m-badge red">{a}</span>) : <span className="m-muted">Yoʻq</span>}</div>
      <span className="m-label">Tashxislar</span>
      <div className="m-card">{patient.diagnoses.map((d) => <b key={d}>{d}</b>)}</div>
      <span className="m-label">Operatsiyalar tarixi</span>
      <div className="m-card"><div className="m-row"><span className="m-ic"><Icon name="activity" size={18} /></span><span className="m-grow"><b>Appendektomiya</b><small>27-sentabr 2026 · Toshkent shahar 1-son klinik shifoxonasi</small></span></div></div>
      <span className="m-label">Tahlil natijalari</span>
      {labs.map((l) => (
        <div key={l.name} className="m-menu">
          <span className={`m-ic ${l.flag ? "amber" : ""}`}><Icon name="file" size={18} /></span>
          <span className="m-grow"><b>{l.name}</b><small>{l.date} · {l.note}</small></span>
        </div>
      ))}
      <label className="m-btn ghost block" style={{ cursor: "pointer" }}><Icon name="upload" size={18} />Tahlil natijasini yuklash (PDF)<input type="file" accept=".pdf,image/*" hidden /></label>
    </div>
  );
}
