"use client";

import Link from "next/link";
import { Icon } from "@/components/Icon";
import { getDoctor } from "@/lib/api";
import { prescriptions } from "@/lib/mock-data";
import { patient } from "../store";
import { AppBar, dayLabel } from "../ui";

export default function Page() {
  const list = prescriptions.filter((r) => r.patientId === patient.id).sort((a, b) => b.date.localeCompare(a.date));
  return (
    <div className="m-stack">
      <AppBar title="Retseptlar" />
      {list.map((rx) => (
        <Link key={rx.id} href={`/mobile/retseptlar/${rx.id}`} className="m-card" style={{ textDecoration: "none", color: "inherit" }}>
          <div className="m-row">
            <span className="m-ic"><Icon name="rx" size={20} /></span>
            <span className="m-grow"><b>{getDoctor(rx.doctorId)?.fullName}</b><small>{dayLabel(rx.date)} · {rx.items.length} ta dori</small></span>
            <span className={`m-badge ${rx.status === "faol" ? "ok" : ""}`}>{rx.status === "faol" ? "Faol" : "Yakunlangan"}</span>
          </div>
          {rx.items.map((i) => (
            <div key={i.id} className="m-row" style={{ justifyContent: "space-between" }}>
              <span style={{ fontWeight: 700 }}>{i.mnn}</span>
              <div className="m-times">{i.times.map((t) => <span key={t}>{t}</span>)}</div>
            </div>
          ))}
        </Link>
      ))}
    </div>
  );
}
