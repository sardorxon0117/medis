import type { Metadata } from "next";
import { PageHead } from "@/components/ui";
import { monitoredPatients } from "@/lib/api";
import { CURRENT } from "@/lib/mock-data";
import { PatientTable } from "./PatientTable";

export const metadata: Metadata = { title: "Bemorlar" };

export default function Page() {
  const rows = monitoredPatients(CURRENT.doctorId).map((m) => ({
    id: m.patient.id,
    name: m.patient.fullName,
    surgery: m.plan.surgery,
    day: m.day,
    total: m.plan.days,
    temp: m.vital?.temp,
    pulse: m.vital?.pulse,
    spo2: m.vital?.spo2,
    adherence: m.adherence,
    state: m.state,
  }));
  return (
    <>
      <PageHead title="Nazoratdagi bemorlar" sub="Holat har bir bemor uchun oʻrnatilgan meʼyor chegaralari boʻyicha hisoblanadi" req="SH-03" />
      <PatientTable rows={rows} />
    </>
  );
}
