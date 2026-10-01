import type { Metadata } from "next";
import { PageHead } from "@/components/ui";
import { getClinic } from "@/lib/api";
import { CURRENT } from "@/lib/mock-data";
import { ClinicProfileForm } from "./ClinicProfileForm";

export const metadata: Metadata = { title: "Klinika profili" };

export default function Page() {
  return (
    <>
      <PageHead title="Klinika profili" sub="Bemorlar shifokor qidirishda va xaritada koʻradigan maʼlumot" req="K-01" />
      <ClinicProfileForm clinic={getClinic(CURRENT.clinicId)!} />
    </>
  );
}
