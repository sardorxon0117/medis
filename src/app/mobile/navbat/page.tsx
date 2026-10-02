"use client";

import Link from "next/link";
import { Icon } from "@/components/Icon";
import { getClinic, getDoctor } from "@/lib/api";
import { useStore } from "../store";
import { AppBar, dayLabel } from "../ui";

export default function Page() {
  const { s, set } = useStore();
  const sorted = [...s.appointments].sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));
  const upcoming = sorted.filter((a) => a.status === "kutilmoqda");
  const past = sorted.filter((a) => a.status !== "kutilmoqda");
  return (
    <div className="m-stack">
      <AppBar title="Navbat" action={<Link href="/mobile/shifokorlar" className="m-icon" aria-label="Yangi navbat"><Icon name="plus" size={22} /></Link>} />
      <Link href="/mobile/shifokorlar" className="m-btn block"><Icon name="plus" size={18} />Shifokorga yozilish</Link>
      <div className="m-note"><Icon name="check" size={16} />Navbat bepul. Qabuldan 2 soat oldin eslatma keladi.</div>
      <span className="m-label">Kelgusi qabullar</span>
      {upcoming.length ? upcoming.map((a) => {
        const d = getDoctor(a.doctorId)!;
        return (
          <div key={a.id} className="m-card">
            <div className="m-row">
              <span className="m-ic"><Icon name="calendar" size={20} /></span>
              <span className="m-grow"><b>{dayLabel(a.date)}, {a.time}</b><small>{d.fullName} · {d.specialty}</small></span>
            </div>
            <span className="m-muted" style={{ fontSize: 14 }}><Icon name="pin" size={14} /> {getClinic(a.clinicId)?.name}</span>
            <span className="m-muted" style={{ fontSize: 14 }}>{a.reason}</span>
            <button className="m-btn ghost" onClick={() => set((x) => ({ ...x, appointments: x.appointments.map((y) => (y.id === a.id ? { ...y, status: "bekor" } : y)) }))}>Bekor qilish</button>
          </div>
        );
      }) : <div className="m-empty"><Icon name="calendar" size={30} />Kelgusi qabul yoʻq</div>}
      {past.length > 0 && <span className="m-label">Tarix</span>}
      {past.map((a) => (
        <div key={a.id} className="m-dose">
          <span className="t">{dayLabel(a.date)}</span>
          <span className="m-grow"><b>{getDoctor(a.doctorId)?.fullName}</b><small>{a.time} · {a.reason}</small></span>
          <span className={`m-badge ${a.status === "bekor" ? "" : "ok"}`}>{a.status === "bekor" ? "Bekor qilingan" : "Yakunlandi"}</span>
        </div>
      ))}
    </div>
  );
}
