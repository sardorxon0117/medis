import type { Metadata } from "next";
import { QueueBoard } from "@/components/QueueBoard";
import { PageHead } from "@/components/ui";
import { getDoctor, getPatient } from "@/lib/api";
import { CURRENT, TODAY, appointments } from "@/lib/mock-data";

export const metadata: Metadata = { title: "Navbat" };

export default function Page() {
  const rows = appointments
    .filter((a) => a.clinicId === CURRENT.clinicId)
    .sort((a, b) => a.time.localeCompare(b.time))
    .map((a) => ({
      id: a.id, time: a.time, patient: getPatient(a.patientId)!.fullName,
      doctor: getDoctor(a.doctorId)!.fullName, reason: a.reason, status: a.status,
    }));
  return (
    <>
      <PageHead title="Umumiy navbat" sub="Barcha shifokorlar navbati bitta ekranda. Navbatga yozilish bemor uchun bepul." req="K-04" />
      <QueueBoard today={rows.filter((r) => r.time.startsWith(TODAY))} week={rows} showDoctor todayIso={TODAY} />
    </>
  );
}
