"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/Icon";
import { getClinic } from "@/lib/api";
import { doctors } from "@/lib/mock-data";
import { initials } from "@/lib/format";
import { AppBar, money } from "../ui";

// demo masofa (km) — haqiqiy ilovada GPS va klinika koordinatalaridan hisoblanadi
const KM: Record<string, number> = { c1: 2.4, c2: 6.1, c3: 4.0 };
const SORTS = [["rating", "Reyting"], ["distance", "Yaqinroq"], ["price", "Arzonroq"]] as const;

export default function Page() {
  const list = doctors.filter((d) => d.approval === "tasdiqlangan");
  const specs = Array.from(new Set(list.map((d) => d.specialty)));
  const [q, setQ] = useState("");
  const [spec, setSpec] = useState<string | null>(null);
  const [sort, setSort] = useState<(typeof SORTS)[number][0]>("rating");
  const km = (id: string) => Math.min(...doctors.find((d) => d.id === id)!.clinicIds.map((c) => KM[c] ?? 5));
  const shown = list
    .filter((d) => (!spec || d.specialty === spec) && `${d.fullName} ${d.specialty} ${d.clinicIds.map((c) => getClinic(c)?.name).join(" ")}`.toLowerCase().includes(q.trim().toLowerCase()))
    .sort((a, b) => (sort === "rating" ? b.rating - a.rating : sort === "price" ? a.price - b.price : km(a.id) - km(b.id)))
    .sort((a, b) => Number(!!b.premiumUntil) - Number(!!a.premiumUntil)); // Premium shifokorlar qidiruvda yuqorida (SH-12)

  return (
    <div className="m-stack">
      <AppBar title="Shifokorlar" back="/mobile" />
      <input className="m-input" placeholder="Ism, mutaxassislik yoki klinika" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Shifokor qidirish" />
      <div className="m-chips">
        <button className="m-chip" aria-pressed={!spec} onClick={() => setSpec(null)}>Barchasi</button>
        {specs.map((x) => <button key={x} className="m-chip" aria-pressed={spec === x} onClick={() => setSpec(x)}>{x}</button>)}
      </div>
      <div className="m-chips">{SORTS.map(([k, l]) => <button key={k} className="m-chip" aria-pressed={sort === k} onClick={() => setSort(k)}>{l}</button>)}</div>
      {shown.map((d) => (
        <Link key={d.id} href={`/mobile/shifokorlar/${d.id}`} className="m-card" style={{ textDecoration: "none", color: "inherit" }}>
          <div className="m-row">
            <span className="avatar">{initials(d.fullName)}</span>
            <span className="m-grow">
              <b>{d.fullName} {d.premiumUntil ? <span className="m-badge teal">✓ Tasdiqlangan</span> : null}</b>
              <small>{d.specialty} · {d.experienceYears} yil tajriba</small>
            </span>
          </div>
          <div className="m-row" style={{ justifyContent: "space-between", fontSize: 14 }}>
            <span>★ <b>{d.rating}</b> <span className="m-muted">({d.reviews})</span></span>
            <span className="m-muted">{km(d.id).toString().replace(".", ",")} km</span>
            <b>{money(d.price)}</b>
          </div>
        </Link>
      ))}
      {!shown.length && <div className="m-empty"><Icon name="search" size={30} />Shifokor topilmadi</div>}
    </div>
  );
}
