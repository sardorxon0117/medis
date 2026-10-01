"use client";

import { useState } from "react";
import { Card } from "@/components/ui";
import { useToast } from "@/components/useToast";
import type { Doctor } from "@/lib/types";

const DAYS = ["Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba", "Yakshanba"];

interface DaySchedule {
  on: boolean;
  from: string;
  to: string;
}

const minutes = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

function toState(d: Doctor): Record<string, DaySchedule> {
  return Object.fromEntries(
    DAYS.map((day) => {
      const s = d.schedule.find((x) => x.day === day);
      return [day, { on: !!s, from: s?.from ?? "09:00", to: s?.to ?? "17:00" }];
    }),
  );
}

export function ScheduleEditor({ doctors }: { doctors: Doctor[] }) {
  const [docId, setDocId] = useState(doctors[0]?.id);
  const [all, setAll] = useState(() => Object.fromEntries(doctors.map((d) => [d.id, { slot: d.slotMinutes, days: toState(d) }])));
  const toast = useToast();
  const cur = all[docId];
  const doctor = doctors.find((d) => d.id === docId)!;

  const setDay = (day: string, patch: Partial<DaySchedule>) =>
    setAll({ ...all, [docId]: { ...cur, days: { ...cur.days, [day]: { ...cur.days[day], ...patch } } } });

  const slotsPerWeek = DAYS.reduce((s, day) => {
    const d = cur.days[day];
    return d.on ? s + Math.max(0, Math.floor((minutes(d.to) - minutes(d.from)) / cur.slot)) : s;
  }, 0);

  return (
    <div className="grid-main">
      <Card
        title={doctor.fullName}
        action={
          <select className="input" style={{ width: "auto" }} value={docId} onChange={(e) => setDocId(e.target.value)} aria-label="Shifokor">
            {doctors.map((d) => <option key={d.id} value={d.id}>{d.fullName} — {d.specialty}</option>)}
          </select>
        }
      >
        <div className="stack">
          {DAYS.map((day) => {
            const d = cur.days[day];
            const bad = d.on && minutes(d.to) <= minutes(d.from);
            return (
              <div key={day} className="row wrap-row" style={{ minHeight: 44 }}>
                <label className="check" style={{ width: 150 }}>
                  <input type="checkbox" checked={d.on} onChange={(e) => setDay(day, { on: e.target.checked })} />
                  <b>{day}</b>
                </label>
                {d.on ? (
                  <>
                    <input type="time" className="input mono" style={{ width: 120 }} value={d.from} onChange={(e) => setDay(day, { from: e.target.value })} aria-label={`${day} boshlanishi`} />
                    <span className="muted">—</span>
                    <input type="time" className="input mono" style={{ width: 120 }} value={d.to} onChange={(e) => setDay(day, { to: e.target.value })} aria-label={`${day} tugashi`} />
                    {bad && <span className="small" style={{ color: "var(--danger)" }}>Tugash vaqti boshlanishdan keyin boʻlishi kerak</span>}
                  </>
                ) : <span className="muted small">Dam olish kuni</span>}
              </div>
            );
          })}
        </div>
      </Card>

      <Card title="Qabul davomiyligi">
        <div className="stack">
          <div className="seg" role="group" aria-label="Bitta qabul davomiyligi">
            {[15, 20, 30, 45, 60].map((m) => (
              <button key={m} aria-pressed={cur.slot === m} onClick={() => setAll({ ...all, [docId]: { ...cur, slot: m } })}>{m} daq</button>
            ))}
          </div>
          <p className="muted">Haftasiga <b style={{ color: "var(--fg)" }}>{slotsPerWeek}</b> ta boʻsh vaqt bemorlarga ochiladi.</p>
          <button className="btn" onClick={() => toast.show(`${doctor.fullName} jadvali saqlandi`)}>Jadvalni saqlash</button>
          <p className="hint">Mavjud yozuvlar oʻzgarmaydi. Kesishgan qabullar boʻlsa, bemorlarga SMS orqali xabar beriladi.</p>
        </div>
      </Card>
      {toast.node}
    </div>
  );
}
