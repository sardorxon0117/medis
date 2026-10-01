import type { Metadata } from "next";
import { PageHead } from "@/components/ui";
import { CURRENT, doctors } from "@/lib/mock-data";
import { ScheduleEditor } from "./ScheduleEditor";

export const metadata: Metadata = { title: "Ish jadvali" };

export default function Page() {
  return (
    <>
      <PageHead title="Ish jadvali" sub="Har bir shifokor uchun qabul vaqtlari va bitta qabul davomiyligi. Boʻsh vaqtlar bemor ilovasida shu asosda chiqadi." req="K-03" />
      <ScheduleEditor doctors={doctors.filter((d) => d.clinicIds.includes(CURRENT.clinicId) && d.approval === "tasdiqlangan")} />
    </>
  );
}
