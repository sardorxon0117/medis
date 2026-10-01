import type { Metadata } from "next";
import { QueueBoard } from "@/components/QueueBoard";
import { PageHead } from "@/components/ui";
import { getPatient } from "@/lib/api";
import { CURRENT, TODAY, appointments } from "@/lib/mock-data";

export const metadata: Metadata = { title: "Navbat" };

export default function Page() {
  const mine = appointments
    .filter((a) => a.doctorId === CURRENT.doctorId)
    .sort((a, b) => a.time.localeCompare(b.time))
    .map((a) => ({ id: a.id, time: a.time, patient: getPatient(a.patientId)!.fullName, reason: a.reason, status: a.status }));
  return (
    <>
      <PageHead title="Navbat" sub="Bugungi va haftalik qabullar. Bemor holatini qabul davomida belgilang." req="SH-09" />
      <QueueBoard today={mine.filter((a) => a.time.startsWith(TODAY))} week={mine} todayIso={TODAY} />
    </>
  );
}
