"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/components/Icon";
import { getClinic } from "@/lib/api";
import { appointments, doctors } from "@/lib/mock-data";
import { todayKey, useNow, useStore } from "../../../store";
import { AppBar, dayLabel, money } from "../../../ui";

const WD = ["Yakshanba", "Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba"];
const SHORT = ["Yak", "Du", "Se", "Chor", "Pay", "Ju", "Sha"];

function slotsFor(from: string, to: string, step: number) {
  const m = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3));
  const out: string[] = [];
  for (let x = m(from); x + step <= m(to); x += step) out.push(`${String(Math.floor(x / 60)).padStart(2, "0")}:${String(x % 60).padStart(2, "0")}`);
  return out;
}

export function Booking({ id }: { id: string }) {
  const router = useRouter();
  const { s, set } = useStore();
  const now = useNow();
  const d = doctors.find((x) => x.id === id)!;
  const [clinic, setClinic] = useState(d.clinicIds[0]);
  const base = new Date(`${todayKey(now)}T00:00:00`);
  const days = Array.from({ length: 10 }, (_, i) => {
    const x = new Date(base);
    x.setDate(base.getDate() + i + 1);
    const iso = `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`;
    return { iso, wd: x.getDay(), sch: d.schedule.find((w) => w.day === WD[x.getDay()]) };
  }).filter((x) => x.sch);
  const [day, setDay] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const cur = days.find((x) => x.iso === (day ?? days[0]?.iso));
  const taken = new Set([
    ...appointments.filter((a) => a.doctorId === id && a.time.startsWith(cur?.iso ?? "")).map((a) => a.time.slice(11, 16)),
    ...s.appointments.filter((a) => a.doctorId === id && a.date === cur?.iso && a.status === "kutilmoqda").map((a) => a.time),
  ]);
  const slots = cur?.sch ? slotsFor(cur.sch.from, cur.sch.to, d.slotMinutes) : [];

  return (
    <div className="m-stack">
      <AppBar title="Navbatga yozilish" back={`/mobile/shifokorlar/${id}`} />
      <div className="m-card"><b>{d.fullName}</b><span className="m-muted">{d.specialty} · {money(d.price)} · {d.slotMinutes} daqiqa</span></div>
      {d.clinicIds.length > 1 && (
        <>
          <span className="m-label">Klinika</span>
          <div className="m-chips">{d.clinicIds.map((c) => <button key={c} className="m-chip" aria-pressed={clinic === c} onClick={() => setClinic(c)}>{getClinic(c)?.name}</button>)}</div>
        </>
      )}
      <span className="m-label">Kun</span>
      <div className="m-chips">
        {days.map((x) => (
          <button key={x.iso} className="m-chip" aria-pressed={cur?.iso === x.iso} onClick={() => { setDay(x.iso); setTime(null); }}>
            {SHORT[x.wd]}, {dayLabel(x.iso)}
          </button>
        ))}
      </div>
      <span className="m-label">Boʻsh vaqt</span>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
        {slots.map((t) => (
          <button key={t} className="m-chip" disabled={taken.has(t)} aria-pressed={time === t} onClick={() => setTime(t)} style={{ textAlign: "center", opacity: taken.has(t) ? 0.35 : 1, fontFamily: "var(--f-mono)" }}>{t}</button>
        ))}
      </div>
      <button
        className="m-btn block"
        disabled={!cur || !time}
        onClick={() => {
          set((x) => ({ ...x, appointments: [...x.appointments, { id: `ma-${cur!.iso}-${time}-${id}`, doctorId: id, clinicId: clinic, date: cur!.iso, time: time!, reason: "Konsultatsiya", status: "kutilmoqda" }] }));
          router.push("/mobile/navbat");
        }}
      >
        <Icon name="check" size={18} />{cur && time ? `${dayLabel(cur.iso)}, ${time} — tasdiqlash` : "Vaqtni tanlang"}
      </button>
    </div>
  );
}
