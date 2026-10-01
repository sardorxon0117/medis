import type { Metadata } from "next";
import { PageHead } from "@/components/ui";
import { getClinic } from "@/lib/api";
import { clinics, couriers, doctors, pharmacies } from "@/lib/mock-data";
import { ApprovalQueue, type Applicant } from "./ApprovalQueue";

export const metadata: Metadata = { title: "Tasdiqlash" };

const transport = { piyoda: "Piyoda", velosiped: "Velosiped", skuter: "Skuter", avtomobil: "Avtomobil" } as const;

export default function Page() {
  const list: Applicant[] = [
    ...doctors.map((d) => ({
      id: d.id, kind: "Shifokor" as const, name: d.fullName, status: d.approval,
      details: [["Mutaxassislik", d.specialty], ["Litsenziya", d.licenseNo], ["Tajriba", `${d.experienceYears} yil`], ["Klinika", d.clinicIds.map((c) => getClinic(c)?.name).join(", ") || "—"], ["Telefon", d.phone]] as [string, string][],
    })),
    ...clinics.map((c) => ({
      id: c.id, kind: "Klinika" as const, name: c.name, status: c.approval,
      details: [["Turi", c.type], ["Litsenziya", c.license], ["Manzil", c.address], ["Ish vaqti", c.workHours]] as [string, string][],
    })),
    ...pharmacies.map((p) => ({
      id: p.id, kind: "Apteka" as const, name: p.name, status: p.approval,
      details: [["Litsenziya", p.license], ["Manzil", p.address], ["Ish vaqti", p.workHours]] as [string, string][],
    })),
    ...couriers.map((k) => ({
      id: k.id, kind: "Kuryer" as const, name: k.fullName, status: k.approval,
      details: [["Transport", transport[k.transport]], ["Telefon", k.phone], ["Pasport", "AD 1234567"]] as [string, string][],
    })),
  ];
  return (
    <>
      <PageHead title="Tasdiqlash" sub="Shifokor, klinika, apteka va kuryerlar hujjatlari tekshirilgandan keyin faollashadi." req="4.8" />
      <ApprovalQueue initial={list} />
    </>
  );
}
