"use client";

import Link from "next/link";
import { Icon, type IconName } from "@/components/Icon";
import { getDoctor, latestVital, planDay } from "@/lib/api";
import { plans } from "@/lib/mock-data";
import { activeRx, patient, todaysDoses, useNow, useStore, type DoseMark } from "./store";
import { dayLabel, money } from "./ui";

const plan = plans.find((p) => p.patientId === patient.id)!;
const doctor = getDoctor(activeRx.doctorId)!;

export default function Home() {
  const { s, set } = useStore();
  const now = useNow();
  const doses = todaysDoses(now, s.doses);
  const next = doses.find((d) => !d.mark);
  const taken = doses.filter((d) => d.mark === "ichildi").length;
  const missed = doses.filter((d) => d.mark === "otkazildi").length;
  const v = latestVital(patient.id);
  const upcoming = s.appointments.filter((a) => a.status === "kutilmoqda").sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))[0];
  const activeOrder = s.orders.find((o) => !o.handedOver);
  const mark = (key: string, m: DoseMark) => set((x) => ({ ...x, doses: { ...x.doses, [key]: m } }));
  const hour = now ? new Date(now).getHours() : 9;
  const hello = hour < 11 ? "Xayrli tong" : hour < 18 ? "Xayrli kun" : "Xayrli kech";

  return (
    <div className="m-stack" style={{ paddingTop: 14 }}>
      <div className="m-row">
        <div className="m-grow">
          <span className="m-muted">{hello},</span>
          <b style={{ fontSize: 22, fontFamily: "var(--f-display)" }}>{patient.fullName.split(" ")[0]} aka</b>
        </div>
        <Link href="/mobile/bilaguzuk" className={`m-badge ${s.device.connected ? "ok" : "warn"}`}><Icon name="activity" size={13} />{s.device.connected ? "Bilaguzuk" : "Ulanmagan"}</Link>
      </div>

      <div className="m-hero">
        <div className="m-row" style={{ alignItems: "flex-start" }}>
          <div className="m-grow">
            <span className="m-label">{next ? `${next.due ? "Hozir ichish kerak" : "Keyingi qabul"} · ${next.time}` : "Bugungi dorilar"}</span>
            <b className="big">{next ? next.item.mnn : "Hammasi ichildi"}</b>
            <span style={{ opacity: 0.9 }}>{next ? `${next.item.dose}${next.item.note ? ` · ${next.item.note}` : ""}` : "Barakalla! Shifokoringiz natijani koʻradi."}</span>
          </div>
          <div className="m-ring" style={{ "--p": `${doses.length ? (taken / doses.length) * 100 : 0}` } as React.CSSProperties}><span>{taken}/{doses.length}</span></div>
        </div>
        {next && (
          <div className="m-row" style={{ marginTop: 6 }}>
            <button className="m-btn white" style={{ flex: 1 }} onClick={() => mark(next.key, "ichildi")}><Icon name="check" size={16} />Ichdim</button>
            <button className="m-btn glass" style={{ flex: 1 }} onClick={() => mark(next.key, "otkazildi")}>Oʻtkazib yubordim</button>
          </div>
        )}
      </div>
      {missed >= 2 && <div className="m-warn"><Icon name="bell" size={16} />Bugun {missed} ta doza oʻtkazildi — shifokoringiz {doctor.fullName}ga signal yuborildi.</div>}

      <div className="m-grid4">
        {([
          ["/mobile/sorovnoma", "thermo", "Soʻrovnoma"],
          ["/mobile/chat", "chat", "Shifokor"],
          ["/mobile/shifokorlar", "search", "Qidiruv"],
          ["/mobile/reels", "video", "Reels"],
        ] as [string, IconName, string][]).map(([h, ic, l]) => (
          <Link key={h} href={h} className="m-quick"><span className="m-ic"><Icon name={ic} size={20} /></span>{l}</Link>
        ))}
      </div>

      <span className="m-label">Nazorat · {plan.surgery}</span>
      <div className="m-card">
        <div className="m-row"><span className="m-grow"><b>{planDay(plan)}-kun / {plan.days}</b><small>{doctor.fullName} kuzatmoqda</small></span><Link href="/mobile/bilaguzuk" className="m-badge teal">Batafsil</Link></div>
        <div className="progress"><span style={{ width: `${Math.min(100, (planDay(plan) / plan.days) * 100)}%` }} /></div>
        <div className="m-vitals">
          <div className="m-vital"><small>PULS</small><b>{v.pulse}</b></div>
          <div className="m-vital"><small>HARORAT</small><b style={{ color: v.temp > plan.thresholds.tempMax ? "var(--danger)" : undefined }}>{v.temp.toFixed(1).replace(".", ",")}°</b></div>
          <div className="m-vital"><small>SpO₂</small><b>{v.spo2}%</b></div>
        </div>
      </div>

      <span className="m-label">Bugungi jadval</span>
      {doses.map((d) => (
        <div key={d.key} className={`m-dose ${d.mark ?? ""}`}>
          <span className="t">{d.time}</span>
          <span className="m-grow"><b>{d.item.mnn}</b><small>{d.item.dose}</small></span>
          {d.mark === "ichildi" ? <span className="m-badge ok">✓ ichildi</span> : d.mark === "otkazildi" ? <span className="m-badge red">oʻtkazildi</span> : (
            <button className="m-btn" style={{ padding: "8px 12px", fontSize: 13 }} onClick={() => mark(d.key, "ichildi")}>Ichdim</button>
          )}
        </div>
      ))}

      {upcoming && (
        <>
          <span className="m-label">Yaqin qabul</span>
          <Link href="/mobile/navbat" className="m-menu">
            <span className="m-ic"><Icon name="calendar" size={20} /></span>
            <span className="m-grow"><b>{dayLabel(upcoming.date)}, {upcoming.time}</b><small>{getDoctor(upcoming.doctorId)?.fullName} · {upcoming.reason}</small></span>
            <Icon name="chevron" size={18} className="m-chev" />
          </Link>
        </>
      )}

      {activeOrder && (
        <>
          <span className="m-label">Buyurtma</span>
          <Link href={`/mobile/buyurtmalar/${activeOrder.id}`} className="m-menu">
            <span className="m-ic"><Icon name="truck" size={20} /></span>
            <span className="m-grow"><b>{activeOrder.pharmacyName}</b><small>{money(activeOrder.total + activeOrder.delivery + activeOrder.service)} · kuzatish</small></span>
            <Icon name="chevron" size={18} className="m-chev" />
          </Link>
        </>
      )}
    </div>
  );
}
