"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";
import { Badge } from "@/components/ui";
import type { Drug } from "@/lib/types";

interface Item {
  key: number;
  mnn: string;
  dose: string;
  times: string[];
  days: number;
  note: string;
}

// allergiya → oʻzaro reaksiya beradigan MNN lar (soddalashtirilgan; asl roʻyxat DARMON dan keladi)
const CROSS: Record<string, string[]> = {
  Penitsillin: ["Amoxicillin + Clavulanic acid"],
  Sefalosporinlar: ["Ceftriaxone"],
  Aspirin: ["Ibuprofen", "Diclofenac", "Ketorolac"],
};

const PRESETS: Record<string, string[]> = {
  "1 mahal": ["08:00"],
  "2 mahal": ["08:00", "20:00"],
  "3 mahal": ["08:00", "14:00", "20:00"],
};

let nextKey = 1;
const blank = (): Item => ({ key: nextKey++, mnn: "", dose: "1 tabletka", times: ["08:00", "20:00"], days: 7, note: "" });

export function RxForm({
  patients, drugs, initialPatient, doctorName,
}: {
  patients: { id: string; name: string; allergies: string[] }[];
  drugs: Drug[];
  initialPatient?: string;
  doctorName: string;
}) {
  const [patientId, setPatientId] = useState(initialPatient ?? "");
  // birinchi qatorning kaliti doimiy: input id lari server va brauzerda bir xil boʻlishi kerak
  const [items, setItems] = useState<Item[]>(() => [{ key: 0, mnn: "Paracetamol", dose: "1 tabletka", times: ["08:00", "14:00", "20:00"], days: 5, note: "Ovqatdan keyin" }]);
  const [sent, setSent] = useState<string | null>(null);
  const patient = patients.find((p) => p.id === patientId);

  const set = (key: number, patch: Partial<Item>) => setItems((list) => list.map((i) => (i.key === key ? { ...i, ...patch } : i)));
  const warnings = (mnn: string) =>
    (patient?.allergies ?? []).filter((a) => CROSS[a]?.includes(mnn)).map((a) => `Bemorda “${a}” allergiyasi bor`);
  const valid = patient && items.length > 0 && items.every((i) => drugs.some((d) => d.mnn === i.mnn) && i.times.length && i.days > 0);
  const hasAllergy = items.some((i) => warnings(i.mnn).length);

  if (sent) {
    return (
      <section className="card">
        <div className="empty stack" style={{ justifyItems: "center", color: "var(--fg)" }}>
          <span className="avatar lg" style={{ background: "var(--ok-soft)", color: "var(--ok)" }}><Icon name="check" size={32} /></span>
          <h2>Retsept {sent} yuborildi</h2>
          <p className="muted">{patient?.name} ilovasida retsept va eslatmalar paydo boʻldi. Dorilarni yaqin aptekadan buyurtma qilishi mumkin.</p>
          <button className="btn" onClick={() => { setSent(null); setItems([blank()]); }}>Yangi retsept</button>
        </div>
      </section>
    );
  }

  return (
    <div className="grid-main">
      <form
        className="card stack"
        onSubmit={(e) => {
          e.preventDefault();
          if (valid) setSent(`RX-${1004 + Math.floor(Math.random() * 90)}`);
        }}
      >
        <div className="field">
          <label htmlFor="patient">Bemor</label>
          <select id="patient" value={patientId} onChange={(e) => setPatientId(e.target.value)} required>
            <option value="" disabled>Bemorni tanlang</option>
            {patients.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          {patient?.allergies.length ? <span className="hint">Allergiya: <b style={{ color: "var(--danger)" }}>{patient.allergies.join(", ")}</b></span> : null}
        </div>

        <datalist id="mnn-list">
          {drugs.map((d) => <option key={d.mnn} value={d.mnn}>{d.form}{d.prescriptionOnly ? " · retseptli" : ""}</option>)}
        </datalist>

        {items.map((item, idx) => {
          const drug = drugs.find((d) => d.mnn === item.mnn);
          const warn = warnings(item.mnn);
          return (
            <fieldset key={item.key} className="card" style={{ background: "var(--bg)", margin: 0 }}>
              <div className="spread" style={{ marginBottom: 12 }}>
                <b>{idx + 1}-dori</b>
                {items.length > 1 && <button type="button" className="btn ghost xs" onClick={() => setItems(items.filter((i) => i.key !== item.key))}><Icon name="x" size={14} />Olib tashlash</button>}
              </div>
              <div className="form-grid">
                <div className="field full">
                  <label htmlFor={`mnn-${item.key}`}>Dori (xalqaro nomi, MNN)</label>
                  <input id={`mnn-${item.key}`} list="mnn-list" value={item.mnn} onChange={(e) => set(item.key, { mnn: e.target.value })} placeholder="Masalan: Paracetamol" required />
                  {drug ? <span className="hint">{drug.form}{drug.prescriptionOnly ? " · faqat retsept bilan sotiladi" : ""}</span> : item.mnn ? <span className="hint" style={{ color: "var(--danger)" }}>Reyestrda topilmadi</span> : null}
                  {warn.map((w) => <span key={w} className="hint" style={{ color: "var(--danger)", fontWeight: 700 }}>⚠ {w}</span>)}
                </div>
                <div className="field">
                  <label htmlFor={`dose-${item.key}`}>Doza</label>
                  <input id={`dose-${item.key}`} value={item.dose} onChange={(e) => set(item.key, { dose: e.target.value })} required />
                </div>
                <div className="field">
                  <label htmlFor={`days-${item.key}`}>Necha kun</label>
                  <input id={`days-${item.key}`} type="number" min={1} max={90} value={item.days} onChange={(e) => set(item.key, { days: Number(e.target.value) })} required />
                </div>
                <div className="field full">
                  <span className="label-txt">Qabul vaqtlari</span>
                  <div className="row wrap-row">
                    <div className="chips">
                      {Object.entries(PRESETS).map(([label, times]) => (
                        <button type="button" key={label} className="chip" aria-pressed={item.times.join() === times.join()} onClick={() => set(item.key, { times })}>{label}</button>
                      ))}
                    </div>
                  </div>
                  <div className="row wrap-row">
                    {item.times.map((t, ti) => (
                      <input
                        key={ti}
                        type="time"
                        className="input mono"
                        style={{ width: 120 }}
                        value={t}
                        aria-label={`${ti + 1}-qabul vaqti`}
                        onChange={(e) => set(item.key, { times: item.times.map((x, xi) => (xi === ti ? e.target.value : x)) })}
                      />
                    ))}
                    {item.times.length < 6 && <button type="button" className="btn ghost xs" onClick={() => set(item.key, { times: [...item.times, "12:00"] })}>+ vaqt</button>}
                    {item.times.length > 1 && <button type="button" className="btn ghost xs" onClick={() => set(item.key, { times: item.times.slice(0, -1) })}>− vaqt</button>}
                  </div>
                </div>
                <div className="field full">
                  <label htmlFor={`note-${item.key}`}>Izoh bemorga</label>
                  <input id={`note-${item.key}`} value={item.note} onChange={(e) => set(item.key, { note: e.target.value })} placeholder="Masalan: ovqatdan keyin, koʻp suv bilan" />
                </div>
              </div>
            </fieldset>
          );
        })}

        <button type="button" className="btn ghost" onClick={() => setItems([...items, blank()])}>+ Yana dori qoʻshish</button>
        {hasAllergy && <p className="hint" style={{ color: "var(--danger)" }}>Allergiya ogohlantirishi bor. Davom etsangiz, sabab audit jurnaliga yoziladi.</p>}
        <button className={`btn${hasAllergy ? " danger" : ""}`} disabled={!valid}>{hasAllergy ? "Ogohlantirishga qaramay yuborish" : "Retseptni yuborish"}</button>
      </form>

      <div className="stack" style={{ position: "sticky", top: 90 }}>
        <span className="label-txt center" style={{ display: "block" }}>Bemor koʻrinishi</span>
        <div className="phone" aria-label="Bemor ilovasida koʻrinishi">
          <div className="notch" />
          <div className="stack-sm">
            <span className="xs muted">Yangi retsept · {doctorName}</span>
            <b>{patient?.name ?? "Bemor"}</b>
            {items.filter((i) => i.mnn).map((i) => (
              <div className="rx-item" key={i.key}>
                <div className="spread"><b>{i.mnn}</b>{drugs.find((d) => d.mnn === i.mnn)?.prescriptionOnly ? <Badge tone="teal" plain>Rx</Badge> : null}</div>
                <span className="small">{i.dose} · {i.days} kun</span>
                <div className="times">{i.times.map((t, ti) => <span key={ti}>{t}</span>)}</div>
                {i.note ? <span className="xs muted">{i.note}</span> : null}
              </div>
            ))}
            <div className="btn sm" style={{ marginTop: 6 }}>Dorilarni buyurtma qilish</div>
          </div>
        </div>
      </div>
    </div>
  );
}
