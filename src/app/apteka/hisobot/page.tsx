import type { Metadata } from "next";
import { BarChart } from "@/components/Charts";
import { Card, PageHead, Stat } from "@/components/ui";
import { pharmacySales } from "@/lib/mock-data";
import { compact, date, num, som } from "@/lib/format";

export const metadata: Metadata = { title: "Hisobot" };

export default function Page() {
  const revenue = pharmacySales.reduce((s, d) => s + d.revenue, 0);
  const count = pharmacySales.reduce((s, d) => s + d.orders, 0);
  const today = pharmacySales[pharmacySales.length - 1];
  return (
    <>
      <PageHead title="Sotuvlar hisoboti" sub="Kunlik va oylik sotuvlar. MEDIS aptekadan komissiya olmaydi." req="A-05">
        <button className="btn ghost sm">Excel ga yuklab olish</button>
      </PageHead>
      <div className="stats">
        <Stat label="Bugungi tushum" value={compact(today.revenue)} hint={`${today.orders} ta buyurtma`} />
        <Stat label="14 kunlik tushum" value={compact(revenue)} hint={som(revenue)} />
        <Stat label="Buyurtmalar" value={num(count)} hint="14 kun" />
        <Stat label="Oʻrtacha chek" value={compact(Math.round(revenue / count))} hint="soʻm" />
      </div>
      <div className="grid-2">
        <Card title="Kunlik tushum"><BarChart label="Kunlik tushum" money data={pharmacySales.map((d) => ({ label: date(d.date), value: d.revenue }))} /></Card>
        <Card title="Kunlik buyurtmalar"><BarChart label="Kunlik buyurtmalar" data={pharmacySales.map((d) => ({ label: date(d.date), value: d.orders }))} /></Card>
      </div>
    </>
  );
}
