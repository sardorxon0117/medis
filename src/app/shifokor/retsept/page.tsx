import type { Metadata } from "next";
import { Icon } from "@/components/Icon";
import { Card, PageHead } from "@/components/ui";
import { getDoctor, monitoredPatients } from "@/lib/api";
import { CURRENT, drugs } from "@/lib/mock-data";
import { RxForm } from "./RxForm";

export const metadata: Metadata = { title: "Elektron retsept" };

export default async function Page(props: PageProps<"/shifokor/retsept">) {
  const { bemor } = await props.searchParams;
  const doctor = getDoctor(CURRENT.doctorId)!;

  // TZ 2-boʻlim: litsenziya tasdiqlanmaguncha retsept yozish yopiq
  if (doctor.approval !== "tasdiqlangan") {
    return (
      <>
        <PageHead title="Elektron retsept" req="SH-06" />
        <Card>
          <div className="empty stack" style={{ justifyItems: "center" }}>
            <Icon name="lock" size={36} />
            <b>Litsenziyangiz tekshirilmoqda</b>
            <p>Administrator tasdiqlagandan keyin retsept yozish ochiladi.</p>
          </div>
        </Card>
      </>
    );
  }

  const patients = monitoredPatients(CURRENT.doctorId).map((m) => ({
    id: m.patient.id,
    name: m.patient.fullName,
    allergies: m.patient.allergies,
  }));

  return (
    <>
      <PageHead title="Elektron retsept" sub="Dori DARMON reyestridagi MNN roʻyxatidan tanlanadi. Bemor uni 10 soniya ichida ilovada koʻradi." req="SH-06" />
      <RxForm patients={patients} drugs={drugs} initialPatient={typeof bemor === "string" ? bemor : patients[0]?.id} doctorName={doctor.fullName} />
    </>
  );
}
