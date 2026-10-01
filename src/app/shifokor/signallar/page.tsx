import type { Metadata } from "next";
import { PageHead } from "@/components/ui";
import { alertsOf, getPatient } from "@/lib/api";
import { CURRENT } from "@/lib/mock-data";
import { AlertList } from "./AlertList";

export const metadata: Metadata = { title: "Signallar" };

export default function Page() {
  const alerts = alertsOf(CURRENT.doctorId)
    .sort((a, b) => b.time.localeCompare(a.time))
    .map((a) => {
      const p = getPatient(a.patientId)!;
      return { ...a, patientName: p.fullName, phone: p.phone, address: `${p.address.street} ${p.address.house}` };
    });
  return (
    <>
      <PageHead title="Signallar" sub="Xavf holatida push va SMS keladi. Har bir amal audit jurnaliga yoziladi." req="SH-08" />
      <AlertList initial={alerts} />
    </>
  );
}
