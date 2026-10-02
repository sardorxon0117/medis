"use client";

import Link from "next/link";
import { Icon } from "@/components/Icon";
import { getClinic } from "@/lib/api";
import { doctors, reels } from "@/lib/mock-data";
import { initials } from "@/lib/format";
import { AppBar, Stars, money } from "../../ui";

const REVIEWS = [
  { who: "Gulnora M.", stars: 5, text: "Operatsiyadan keyin har kuni holatimni soʻrab turdi, juda eʼtiborli shifokor." },
  { who: "Anvar S.", stars: 5, text: "Hamma narsani tushunarli qilib tushuntirdi, retseptni ilovada koʻrdim." },
  { who: "Jasur T.", stars: 4, text: "Navbat vaqtida qabul qildi, biroz kutishga toʻgʻri keldi." },
];

export function DoctorProfile({ id }: { id: string }) {
  const d = doctors.find((x) => x.id === id)!;
  const vids = reels.filter((r) => r.doctorId === id && r.moderation === "tasdiqlangan");
  return (
    <div className="m-stack">
      <AppBar title="Shifokor" back="/mobile/shifokorlar" />
      <div className="m-card" style={{ justifyItems: "center", textAlign: "center" }}>
        <span className="avatar lg">{initials(d.fullName)}</span>
        <b style={{ fontSize: 20 }}>{d.fullName}</b>
        <span className="m-muted">{d.specialty} · {d.experienceYears} yil tajriba</span>
        <div className="m-row">{d.premiumUntil ? <span className="m-badge teal">✓ Tasdiqlangan</span> : null}<span className="m-badge">Litsenziya {d.licenseNo}</span></div>
        <div className="m-row"><Stars value={Math.round(d.rating)} size={20} /><b>{d.rating}</b><span className="m-muted">({d.reviews} sharh)</span></div>
      </div>
      <div className="m-card">
        <div className="m-row" style={{ justifyContent: "space-between" }}><span className="m-muted">Qabul narxi</span><b>{money(d.price)}</b></div>
        <div className="m-row" style={{ justifyContent: "space-between" }}><span className="m-muted">Ish vaqti</span><b>Du–Ju, {d.schedule[0]?.from}–{d.schedule[0]?.to}</b></div>
        <div className="m-row" style={{ justifyContent: "space-between", alignItems: "flex-start" }}><span className="m-muted">Taʼlim</span><b style={{ textAlign: "right", maxWidth: "60%" }}>{d.education}</b></div>
      </div>
      <span className="m-label">Klinikalar</span>
      {d.clinicIds.map((c) => {
        const cl = getClinic(c)!;
        return <div key={c} className="m-menu"><span className="m-ic"><Icon name="building" size={18} /></span><span className="m-grow"><b>{cl.name}</b><small>{cl.address}</small></span></div>;
      })}
      <Link href={`/mobile/shifokorlar/${d.id}/navbat`} className="m-btn block"><Icon name="calendar" size={18} />Navbatga yozilish</Link>
      {vids.length > 0 && (
        <>
          <span className="m-label">Videolari</span>
          {vids.map((v) => <Link key={v.id} href="/mobile/reels" className="m-menu"><span className="m-ic"><Icon name="play" size={18} /></span><span className="m-grow"><b>{v.title}</b><small>{v.durationSec} s</small></span></Link>)}
        </>
      )}
      <span className="m-label">Sharhlar</span>
      {REVIEWS.map((r) => (
        <div key={r.who} className="m-card"><div className="m-row"><b className="m-grow">{r.who}</b><Stars value={r.stars} size={14} /></div><span style={{ fontSize: 14 }}>{r.text}</span></div>
      ))}
    </div>
  );
}
