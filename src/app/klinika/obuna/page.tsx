import type { Metadata } from "next";
import { Badge, Card, PageHead } from "@/components/ui";
import { getClinic } from "@/lib/api";
import { CURRENT, pricing } from "@/lib/mock-data";
import { date, som } from "@/lib/format";

export const metadata: Metadata = { title: "Pro obuna" };

const features: [string, boolean, boolean][] = [
  ["Klinika profili va xaritada koʻrinish", true, true],
  ["Shifokorlar, jadval va umumiy navbat", true, true],
  ["Bemorlar uchun bepul navbat", true, true],
  ["Kengaytirilgan statistika va eksport", false, true],
  ["Qidiruvda klinika yuqorida", false, true],
  ["Reels lentasida klinika sahifasi", false, true],
  ["Shaxsiy menejer va oʻqitish", false, true],
];

export default function Page() {
  const clinic = getClinic(CURRENT.clinicId)!;
  const isPrivate = clinic.type === "xususiy";
  return (
    <>
      <PageHead title="Klinika Pro" sub="Faqat xususiy klinikalar uchun. Davlat klinikalari barcha funksiyalardan bepul foydalanadi." req="K-06" />
      <div className="grid-main">
        <Card title="Tariflarni solishtirish" flush>
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Imkoniyat</th><th>Bepul</th><th>Pro</th></tr></thead>
              <tbody>
                {features.map(([f, free, pro]) => (
                  <tr key={f}>
                    <td>{f}</td>
                    <td>{free ? "✓" : <span className="muted">—</span>}</td>
                    <td style={{ color: "var(--teal)", fontWeight: 700 }}>{pro ? "✓" : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <Card title="Joriy obuna">
          <div className="stack">
            <div><span style={{ fontFamily: "var(--f-display)", fontSize: 28, fontWeight: 700 }}>{som(pricing.clinicPro)}</span><span className="muted"> /oy</span></div>
            {!isPrivate ? (
              <Badge tone="ok">Davlat klinikasi — bepul</Badge>
            ) : clinic.proUntil ? (
              <>
                <Badge tone="teal">Pro faol · {date(clinic.proUntil)} gacha</Badge>
                <button className="btn">Uzaytirish</button>
                <button className="btn ghost">Avtomatik toʻlovni oʻchirish</button>
              </>
            ) : (
              <button className="btn">Pro ga oʻtish</button>
            )}
            <p className="hint">Toʻlov Click, Payme, Uzcard yoki Humo orqali. Elektron chek emailga yuboriladi.</p>
          </div>
        </Card>
      </div>
    </>
  );
}
