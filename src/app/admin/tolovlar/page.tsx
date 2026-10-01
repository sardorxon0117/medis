import type { Metadata } from "next";
import { PageHead, Stat } from "@/components/ui";
import { payments } from "@/lib/mock-data";
import { som } from "@/lib/format";
import { PaymentsTable } from "./PaymentsTable";

export const metadata: Metadata = { title: "Toʻlovlar" };

export default function Page() {
  const paid = payments.filter((p) => p.status === "toʻlandi");
  const turnover = paid.reduce((s, p) => s + p.amount, 0);
  const share = paid.reduce((s, p) => s + p.platformShare, 0);
  return (
    <>
      <PageHead title="Toʻlovlar" sub="Onlayn (Click, Payme, Uzcard, Humo) va naqd toʻlovlar. Shifokor va kuryerlarga toʻlov — har hafta." req="6">
        <button className="btn ghost sm">Moliyaviy hisobot (XLSX)</button>
      </PageHead>
      <div className="stats">
        <Stat label="Aylanma" value={som(turnover)} />
        <Stat label="Platforma ulushi" value={som(share)} />
        <Stat label="Hamkorlarga toʻlanadi" value={som(turnover - share)} hint="Keyingi toʻlov: dushanba, 6-okt" />
        <Stat label="Kutilayotgan (naqd)" value={payments.filter((p) => p.status === "kutilmoqda").length} />
      </div>
      <PaymentsTable initial={payments} />
    </>
  );
}
