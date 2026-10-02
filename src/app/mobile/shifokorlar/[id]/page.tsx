import { notFound } from "next/navigation";
import { doctors } from "@/lib/mock-data";
import { DoctorProfile } from "./DoctorProfile";

export function generateStaticParams() {
  return doctors.filter((d) => d.approval === "tasdiqlangan").map((d) => ({ id: d.id }));
}

export default async function Page(props: PageProps<"/mobile/shifokorlar/[id]">) {
  const { id } = await props.params;
  if (!doctors.some((d) => d.id === id && d.approval === "tasdiqlangan")) notFound();
  return <DoctorProfile id={id} />;
}
