"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Icon, type IconName } from "./Icon";
import type { PanelKey } from "@/lib/nav";
import { CURRENT, ads, clinics, doctors, drugs, orders, patients, payments, pharmacies, plans, stock } from "@/lib/mock-data";

interface Hit {
  label: string;
  sub: string;
  href: string;
  icon: IconName;
}

// Har bir panel faqat oʻz rolidagi maʼlumotni qidiradi (TZ 2-boʻlim: rol faqat oʻziga tegishlisini koʻradi)
function buildIndex(panel: PanelKey): Hit[] {
  const name = (id: string) => patients.find((p) => p.id === id)?.fullName ?? id;
  switch (panel) {
    case "shifokor":
      return [
        ...plans.filter((p) => p.doctorId === CURRENT.doctorId).map((p) => ({ label: name(p.patientId), sub: p.surgery, href: `/shifokor/bemorlar/${p.patientId}`, icon: "user" as const })),
        ...drugs.map((d) => ({ label: d.mnn, sub: `${d.form} · retsept yozish`, href: `/shifokor/retsept`, icon: "pill" as const })),
      ];
    case "klinika":
      return doctors.filter((d) => d.clinicIds.includes(CURRENT.clinicId)).map((d) => ({ label: d.fullName, sub: d.specialty, href: "/klinika/shifokorlar", icon: "stethoscope" as const }));
    case "apteka":
      return [
        ...orders.filter((o) => o.pharmacyId === CURRENT.pharmacyId).map((o) => ({ label: o.id, sub: o.items.map((i) => i.tradeName).join(", "), href: "/apteka", icon: "box" as const })),
        ...stock.filter((s) => s.pharmacyId === CURRENT.pharmacyId).map((s) => ({ label: s.tradeName, sub: `${s.mnn} · qoldiq ${s.qty}`, href: "/apteka/katalog", icon: "pill" as const })),
      ];
    case "reklama":
      return ads.filter((a) => a.advertiser === CURRENT.advertiser).map((a) => ({ label: a.title, sub: a.category, href: "/reklama", icon: "megaphone" as const }));
    case "admin":
      return [
        ...[...doctors, ...clinics, ...pharmacies].map((x) => ({ label: "fullName" in x ? x.fullName : x.name, sub: x.approval === "tekshirilmoqda" ? "tasdiq kutmoqda" : "tasdiqlangan", href: "/admin/tasdiqlash", icon: "shield" as const })),
        ...payments.map((p) => ({ label: p.id, sub: `${p.payer} · ${p.provider}`, href: "/admin/tolovlar", icon: "wallet" as const })),
      ];
  }
}

export function PanelSearch({ panel }: { panel: PanelKey }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const index = useMemo(() => buildIndex(panel), [panel]);
  const query = q.trim().toLowerCase();
  const hits = query ? index.filter((h) => `${h.label} ${h.sub}`.toLowerCase().includes(query)).slice(0, 7) : [];

  return (
    <div className="search psearch">
      <input
        className="input"
        aria-label="Qidiruv"
        placeholder="Qidirish…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") setQ("");
          if (e.key === "Enter" && hits[0]) { router.push(hits[0].href); setQ(""); }
        }}
      />
      {query && (
        <div className="psearch-list" role="listbox">
          {hits.length ? hits.map((h) => (
            <Link key={`${h.href}-${h.label}`} href={h.href} className="psearch-item" onClick={() => setQ("")}>
              <Icon name={h.icon} size={18} />
              <span><b>{h.label}</b><small>{h.sub}</small></span>
            </Link>
          )) : <div className="psearch-empty">Hech narsa topilmadi</div>}
        </div>
      )}
    </div>
  );
}
