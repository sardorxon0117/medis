import type { Metadata } from "next";
import Link from "next/link";
import { Badge, Card, PageHead, Stat } from "@/components/ui";
import { getPatient } from "@/lib/api";
import { ads, clinics, couriers, doctors, patients, payments, pharmacies, reels, sosEvents } from "@/lib/mock-data";
import { dateTime, som } from "@/lib/format";
import { SOS_SOURCE, SOS_STATUS } from "./sos/labels";

export const metadata: Metadata = { title: "Umumiy holat" };

const typeLabel = { yetkazish: "Dori yetkazish", nazorat: "Nazorat paketi", premium: "Shifokor Premium", pro: "Klinika Pro", reklama: "Reklama" } as const;

export default function Page() {
  const pending =
    [...doctors, ...clinics, ...pharmacies, ...couriers].filter((x) => x.approval === "tekshirilmoqda").length;
  const moderation = reels.filter((r) => r.moderation === "kutilmoqda").length + ads.filter((a) => a.moderation === "kutilmoqda").length;
  const paid = payments.filter((p) => p.status === "toʻlandi");
  const share = paid.reduce((s, p) => s + p.platformShare, 0);
  const byType = Object.entries(typeLabel).map(([k, label]) => ({
    label,
    amount: paid.filter((p) => p.type === k).reduce((s, p) => s + p.platformShare, 0),
  }));
  const maxType = Math.max(...byType.map((b) => b.amount));

  return (
    <>
      <PageHead title="Umumiy holat" sub="Platforma boʻyicha qisqacha koʻrinish" />
      <div className="stats">
        <Stat label="Bemorlar" value={patients.length} hint={`${doctors.length} shifokor · ${clinics.length} klinika`} />
        <Stat label="Tasdiq kutmoqda" value={pending} hint={<Link href="/admin/tasdiqlash">Koʻrib chiqish →</Link>} />
        <Stat label="Moderatsiya" value={moderation} hint={<Link href="/admin/moderatsiya">Video va reklama →</Link>} />
        <Stat label="Platforma ulushi" value={som(share)} hint="oxirgi toʻlovlar" />
      </div>
      <div className="grid-main">
        <Card title="Oxirgi SOS hodisalari" action={<Link href="/admin/sos" className="btn ghost sm">Jurnal</Link>} flush>
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Vaqt</th><th>Bemor</th><th>Manba</th><th>Natija</th></tr></thead>
              <tbody>
                {sosEvents.map((e) => (
                  <tr key={e.id}>
                    <td className="small">{dateTime(e.time)}</td>
                    <td>{getPatient(e.patientId)?.fullName}</td>
                    <td>{SOS_SOURCE[e.source]}</td>
                    <td><Badge tone={SOS_STATUS[e.status][0]}>{SOS_STATUS[e.status][1]}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <Card title="Daromad manbalari">
          <div className="stack">
            {byType.map((b) => (
              <div key={b.label} className="stack-sm">
                <div className="spread small"><span>{b.label}</span><b className="mono">{som(b.amount)}</b></div>
                <div className="progress"><span style={{ width: `${maxType ? (b.amount / maxType) * 100 : 0}%` }} /></div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
