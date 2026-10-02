"use client";

import Link from "next/link";
import { Icon } from "@/components/Icon";
import { getDoctor, getDrug } from "@/lib/api";
import { prescriptions } from "@/lib/mock-data";
import { AppBar, dayLabel } from "../../ui";

export function RxDetail({ id }: { id: string }) {
  const rx = prescriptions.find((r) => r.id === id)!;
  const doctor = getDoctor(rx.doctorId)!;
  return (
    <div className="m-stack">
      <AppBar title={`Retsept ${rx.id.toUpperCase()}`} back="/mobile/retseptlar" />
      <div className="m-card">
        <div className="m-row"><span className="m-ic"><Icon name="stethoscope" size={20} /></span><span className="m-grow"><b>{doctor.fullName}</b><small>{doctor.specialty} · {dayLabel(rx.date)}</small></span></div>
        <span className={`m-badge ${rx.status === "faol" ? "ok" : ""}`} style={{ justifySelf: "start" }}>{rx.status === "faol" ? "Faol — aptekada ishlatilishi mumkin" : "Yakunlangan"}</span>
      </div>
      {rx.items.map((i) => {
        const drug = getDrug(i.mnn);
        return (
          <div key={i.id} className="m-card">
            <div className="m-row"><b style={{ fontSize: 18, flex: 1 }}>{i.mnn}</b>{drug?.prescriptionOnly ? <span className="m-badge teal">Retseptli</span> : null}</div>
            <span className="m-muted">{drug?.form}</span>
            <div className="m-row" style={{ gap: 14, flexWrap: "wrap" }}>
              <span><small className="m-muted">Doza</small><br /><b>{i.dose}</b></span>
              <span><small className="m-muted">Necha kun</small><br /><b>{i.days} kun</b></span>
              <span><small className="m-muted">Kuniga</small><br /><b>{i.times.length} mahal</b></span>
            </div>
            <div className="m-times">{i.times.map((t) => <span key={t}>{t}</span>)}</div>
            {i.note ? <div className="m-note"><Icon name="bell" size={16} />{i.note}</div> : null}
          </div>
        );
      })}
      {rx.status === "faol" && <Link href="/mobile/apteka" className="m-btn block"><Icon name="cart" size={18} />Dorilarni buyurtma qilish</Link>}
    </div>
  );
}
