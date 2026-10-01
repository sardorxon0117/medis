import type { Metadata } from "next";
import { PageHead } from "@/components/ui";
import { CURRENT, drugs, stock } from "@/lib/mock-data";
import { Catalog } from "./Catalog";

export const metadata: Metadata = { title: "Dorilar katalogi" };

export default function Page() {
  const rows = stock
    .filter((s) => s.pharmacyId === CURRENT.pharmacyId)
    .map((s) => ({ ...s, prescriptionOnly: drugs.find((d) => d.mnn === s.mnn)?.prescriptionOnly ?? false }));
  return (
    <>
      <PageHead title="Dorilar katalogi" sub="Narx va qoldiq qoʻlda, Excel/CSV fayl orqali yoki apteka dasturi bilan integratsiya orqali yangilanadi." req="A-02" />
      <Catalog initial={rows} mnnList={drugs.map((d) => d.mnn)} />
    </>
  );
}
