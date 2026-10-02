import type { Metadata } from "next";
import { Badge, Card, PageHead, Stat } from "@/components/ui";
import { CURRENT, ads, payments } from "@/lib/mock-data";
import { dateTime, som } from "@/lib/format";
import { TopUp } from "./TopUp";

export const metadata: Metadata = { title: "Balans" };

export default function Page() {
  const mine = ads.filter((a) => a.advertiser === CURRENT.advertiser);
  const paid = payments.filter((p) => p.payer === CURRENT.advertiser && p.status === "toʻlandi").reduce((s, p) => s + p.amount, 0);
  const spent = mine.reduce((s, a) => s + a.spent, 0);
  return (
    <>
      <PageHead title="Balans" sub="Byudjet oldindan toʻlanadi, koʻrishlar boʻyicha yechiladi." />
      <div className="stats">
        <Stat label="Qoldiq" value={som(paid - spent)} />
        <Stat label="Jami toʻlangan" value={som(paid)} />
        <Stat label="Sarflangan" value={som(spent)} />
      </div>
      <div className="grid-main">
        <Card title="Toʻlovlar tarixi" flush>
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Sana</th><th>Provayder</th><th className="num">Summa</th><th>Holat</th></tr></thead>
              <tbody>
                {payments.filter((p) => p.payer === CURRENT.advertiser).map((p) => (
                  <tr key={p.id}><td>{dateTime(p.date)}</td><td>{p.provider}</td><td className="num">{som(p.amount)}</td><td><Badge tone="ok">{p.status}</Badge></td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <Card title="Balansni toʻldirish">
          <TopUp />
        </Card>
      </div>
    </>
  );
}
