import type { Metadata } from "next";
import { Badge, Card, PageHead, Stat } from "@/components/ui";
import { CURRENT, ads, payments } from "@/lib/mock-data";
import { dateTime, som } from "@/lib/format";

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
          <form className="stack">
            <div className="field"><label htmlFor="top">Summa, soʻm</label><input id="top" type="number" step={100000} defaultValue={1000000} min={100000} /></div>
            <div className="chips">{["Click", "Payme", "Uzcard", "Humo"].map((p, i) => <button type="button" className="chip" aria-pressed={i === 0} key={p}>{p}</button>)}</div>
            <button className="btn" type="button">Toʻlash</button>
            <p className="hint">Yuridik shaxslar uchun hisob-faktura bank orqali.</p>
          </form>
        </Card>
      </div>
    </>
  );
}
