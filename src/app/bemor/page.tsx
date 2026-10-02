import type { Metadata } from "next";
import { getDoctor, getPatient } from "@/lib/api";
import { prescriptions } from "@/lib/mock-data";
import { PatientApp } from "./PatientApp";
import "./bemor.css";

export const metadata: Metadata = { title: "Bemor ilovasi (demo)" };

export default function Page() {
  const patient = getPatient("p1")!;
  const rx = prescriptions.find((r) => r.id === "rx-1001")!;
  return (
    <PatientApp
      patient={{
        firstName: patient.fullName.split(" ")[0],
        address: `${patient.address.street} ${patient.address.house}, ${patient.address.apartment}-xonadon`,
        landmark: patient.address.landmark ?? "",
        diagnosis: patient.diagnoses[0],
        bloodGroup: patient.bloodGroup,
        allergies: patient.allergies,
      }}
      doctor={getDoctor(rx.doctorId)!.fullName}
      items={rx.items.map((i) => ({ id: i.id, mnn: i.mnn, dose: i.dose, times: i.times, days: i.days, note: i.note ?? "" }))}
    />
  );
}
