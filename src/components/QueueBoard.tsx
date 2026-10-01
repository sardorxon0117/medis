"use client";

import { useState } from "react";
import { ApptBadge } from "./ui";
import { useToast } from "./useToast";
import { time } from "@/lib/format";
import type { AppointmentStatus } from "@/lib/types";

export interface QueueRow {
  id: string;
  time: string;
  patient: string;
  doctor?: string;
  reason: string;
  status: AppointmentStatus;
}

const STATUSES: { key: AppointmentStatus; label: string }[] = [
  { key: "kutilmoqda", label: "Kutilmoqda" },
  { key: "keldi", label: "Keldi" },
  { key: "qabul_qilindi", label: "Qabul qilindi" },
  { key: "kelmadi", label: "Kelmadi" },
];

const WEEKDAYS = ["Yak", "Dush", "Sesh", "Chor", "Pay", "Jum", "Shan"];

export function QueueBoard({ today, week, showDoctor, todayIso }: { today: QueueRow[]; week: QueueRow[]; showDoctor?: boolean; todayIso: string }) {
  const [rows, setRows] = useState(today);
  const [view, setView] = useState<"bugun" | "hafta">("bugun");
  const [doctor, setDoctor] = useState("all");
  const toast = useToast();
  const doctors = Array.from(new Set(today.map((r) => r.doctor).filter(Boolean))) as string[];
  const shown = rows.filter((r) => doctor === "all" || r.doctor === doctor);

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(`${todayIso}T00:00:00Z`);
    d.setUTCDate(d.getUTCDate() + i);
    return { iso: d.toISOString().slice(0, 10), label: `${WEEKDAYS[d.getUTCDay()]}, ${d.getUTCDate()}` };
  });

  return (
    <>
      <div className="spread">
        <div className="seg" role="group" aria-label="Koʻrinish">
          <button aria-pressed={view === "bugun"} onClick={() => setView("bugun")}>Bugun</button>
          <button aria-pressed={view === "hafta"} onClick={() => setView("hafta")}>Hafta</button>
        </div>
        {showDoctor && view === "bugun" && (
          <select className="input" style={{ width: "auto" }} value={doctor} onChange={(e) => setDoctor(e.target.value)} aria-label="Shifokor">
            <option value="all">Barcha shifokorlar</option>
            {doctors.map((d) => <option key={d}>{d}</option>)}
          </select>
        )}
      </div>

      {view === "bugun" ? (
        <section className="card flush">
          <div className="card-head" style={{ paddingBottom: 12 }}>
            <div className="row wrap-row small">
              {STATUSES.map((s) => (
                <span key={s.key} className="muted">{s.label}: <b style={{ color: "var(--fg)" }}>{shown.filter((r) => r.status === s.key).length}</b></span>
              ))}
            </div>
          </div>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr><th>Vaqt</th><th>Bemor</th>{showDoctor && <th>Shifokor</th>}<th>Sabab</th><th>Holat</th><th>Oʻzgartirish</th></tr>
              </thead>
              <tbody>
                {shown.map((r) => (
                  <tr key={r.id}>
                    <td className="mono">{time(r.time)}</td>
                    <td><b>{r.patient}</b></td>
                    {showDoctor && <td>{r.doctor}</td>}
                    <td className="muted small">{r.reason}</td>
                    <td><ApptBadge status={r.status} /></td>
                    <td>
                      <select
                        className="input"
                        style={{ minHeight: 34, padding: "4px 8px", width: "auto" }}
                        value={r.status}
                        aria-label={`${r.patient} holati`}
                        onChange={(e) => {
                          const status = e.target.value as AppointmentStatus;
                          setRows((list) => list.map((x) => (x.id === r.id ? { ...x, status } : x)));
                          toast.show(`${r.patient}: ${STATUSES.find((s) => s.key === status)?.label}`);
                        }}
                      >
                        {STATUSES.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : (
        <div className="week">
          {days.map((d) => {
            const list = week.filter((r) => r.time.startsWith(d.iso)).sort((a, b) => a.time.localeCompare(b.time));
            return (
              <div key={d.iso} className={`day${d.iso === todayIso ? " today" : ""}`}>
                <b className="small">{d.label}</b>
                {list.map((r) => (
                  <div key={r.id} className="slot">
                    <b>{time(r.time)}</b> {r.patient}
                    {showDoctor ? <div className="xs muted">{r.doctor}</div> : null}
                  </div>
                ))}
                {!list.length && <span className="xs muted">Boʻsh</span>}
              </div>
            );
          })}
        </div>
      )}
      {toast.node}
    </>
  );
}
