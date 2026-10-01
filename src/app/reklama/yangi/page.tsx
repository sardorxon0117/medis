import type { Metadata } from "next";
import { PageHead } from "@/components/ui";
import { pricing } from "@/lib/mock-data";
import { AdForm } from "./AdForm";

export const metadata: Metadata = { title: "Yangi reklama" };

export default function Page() {
  return (
    <>
      <PageHead title="Yangi reklama" sub="Har bir reklama moderatsiyadan oʻtadi. Isbotlanmagan “moʻjiza dori” reklamasi taqiqlanadi." />
      <AdForm cpm={pricing.adCpm} />
    </>
  );
}
