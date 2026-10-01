import type { Metadata } from "next";
import Link from "next/link";
import { BarChart } from "@/components/Charts";
import { Badge, Card, ModerationBadge, PageHead, Stat } from "@/components/ui";
import { CURRENT, adDaily, ads } from "@/lib/mock-data";
import { compact, date, num, som } from "@/lib/format";

export const metadata: Metadata = { title: "Kampaniyalar" };

const statusTone = { faol: "ok", "toʻxtatilgan": "", yakunlangan: "" } as const;

export default function Page() {
  const mine = ads.filter((a) => a.advertiser === CURRENT.advertiser);
  const views = mine.reduce((s, a) => s + a.views, 0);
  const clicks = mine.reduce((s, a) => s + a.clicks, 0);
  const spent = mine.reduce((s, a) => s + a.spent, 0);
  return (
    <>
      <PageHead title="Kampaniyalar" sub="Reklama bemor lentasida har 4 ta videodan keyin chiqadi. Faqat sogʻliqqa mos toifalar.">
        <Link href="/reklama/yangi" className="btn">+ Yangi reklama</Link>
      </PageHead>
      <div className="stats">
        <Stat label="Koʻrishlar" value={compact(views)} />
        <Stat label="Bosishlar" value={num(clicks)} hint={`CTR ${((clicks / Math.max(views, 1)) * 100).toFixed(2).replace(".", ",")}%`} />
        <Stat label="Sarflangan" value={compact(spent)} hint="soʻm" />
        <Stat label="1 000 koʻrish" value={compact(15000)} hint="soʻm (CPM)" />
      </div>
      <Card title="Kunlik koʻrishlar, oxirgi 14 kun">
        <BarChart label="Kunlik koʻrishlar" data={adDaily.map((d) => ({ label: date(d.date), value: d.views }))} />
      </Card>
      <Card flush>
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Reklama</th><th>Toifa</th><th>Moderatsiya</th><th>Holat</th><th className="num">Koʻrish</th><th className="num">Byudjet</th><th>Sarflandi</th></tr></thead>
            <tbody>
              {mine.map((a) => (
                <tr key={a.id}>
                  <td><b>{a.title}</b><div className="xs muted">{a.media === "video" ? "Video" : "Rasm"}</div></td>
                  <td>{a.category}</td>
                  <td><ModerationBadge status={a.moderation} /></td>
                  <td><Badge tone={statusTone[a.status]}>{a.status}</Badge></td>
                  <td className="num mono">{num(a.views)}</td>
                  <td className="num small">{som(a.budget)}</td>
                  <td style={{ minWidth: 120 }}>
                    <div className="progress"><span style={{ width: `${(a.spent / a.budget) * 100}%` }} /></div>
                    <span className="xs muted">{Math.round((a.spent / a.budget) * 100)}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
