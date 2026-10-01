import type { Metadata } from "next";
import { PageHead } from "@/components/ui";
import { pricing } from "@/lib/mock-data";
import { PricingForm } from "./PricingForm";

export const metadata: Metadata = { title: "Narx va sozlamalar" };

export default function Page() {
  return (
    <>
      <PageHead title="Narx va sozlamalar" sub="Barcha narxlar shu yerdan oʻzgartiriladi; ilova va panellarda darhol yangilanadi." req="6 · 4.8" />
      <PricingForm initial={pricing} />
    </>
  );
}
