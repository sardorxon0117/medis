"use client";

import Link from "next/link";
import { useState } from "react";
import { StateBadge } from "@/components/ui";
import type { PatientState } from "@/lib/api";

interface Row {
  id: string;
  name: string;
  surgery: string;
  day: number;
  total: number;
  temp?: number;
  pulse?: number;
  spo2?: number;
  adherence: number;
  state: PatientState;
}

const filters: { key: PatientState | "all"; label: string }[] = [
  { key: "all", label: "Barchasi" },
  { key: "xavf", label: "Xavf" },
  { key: "diqqat", label: "Diqqat" },
  { key: "barqaror", label: "Barqaror" },
];

export function PatientTable({ rows }: { rows: Row[] }) {
  const [filter, setFilter] = useState<PatientState | "all">("all");
  const [q, setQ] = useState("");
  const shown = rows.filter(
    (r) => (filter === "all" || r.state === filter) && r.name.toLowerCase().includes(q.trim().toLowerCase()),
  );

  return (
    <section className="card flush">
      <div className="card-head" style={{ paddingBottom: 14 }}>
        <div className="seg" role="group" aria-label="Holat boʻyicha filtr">
          {filters.map((f) => (
            <button key={f.key} aria-pressed={filter === f.key} onClick={() => setFilter(f.key)}>
              {f.label} ({f.key === "all" ? rows.length : rows.filter((r) => r.state === f.key).length})
            </button>
          ))}
        </div>
        <input className="input" style={{ maxWidth: 260 }} placeholder="Ism boʻyicha qidirish" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Ism boʻyicha qidirish" />
      </div>
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Bemor</th><th>Operatsiya</th><th>Kun</th>
              <th className="num">Harorat</th><th className="num">Puls</th><th className="num">SpO₂</th>
              <th className="num">Dori ichish</th><th>Holat</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((r) => (
              <tr key={r.id}>
                <td><Link className="rowlink" href={`/shifokor/bemorlar/${r.id}`}>{r.name}</Link></td>
                <td>{r.surgery}</td>
                <td className="mono">{r.day}/{r.total}</td>
                <td className="num mono">{r.temp?.toFixed(1).replace(".", ",")} °C</td>
                <td className="num mono">{r.pulse}</td>
                <td className="num mono">{r.spo2}%</td>
                <td className="num mono" style={{ color: r.adherence < 85 ? "var(--danger)" : undefined }}>{r.adherence}%</td>
                <td><StateBadge state={r.state} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        {!shown.length && <div className="empty">Bu filtr boʻyicha bemor topilmadi</div>}
      </div>
    </section>
  );
}
