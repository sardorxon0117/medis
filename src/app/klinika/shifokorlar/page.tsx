import type { Metadata } from "next";
import { PageHead } from "@/components/ui";
import { CURRENT, doctors } from "@/lib/mock-data";
import { DoctorsManager } from "./DoctorsManager";

export const metadata: Metadata = { title: "Shifokorlar" };

export default function Page() {
  return (
    <>
      <PageHead title="Shifokorlar" sub="Shifokorni taklif qiling: u MEDIS da roʻyxatdan oʻtib, litsenziyasi tasdiqlangach klinikaga bogʻlanadi." req="K-02" />
      <DoctorsManager initial={doctors.filter((d) => d.clinicIds.includes(CURRENT.clinicId))} />
    </>
  );
}
