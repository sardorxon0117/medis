import { notFound } from "next/navigation";
import { prescriptions } from "@/lib/mock-data";
import { RxDetail } from "./RxDetail";

export function generateStaticParams() {
  return prescriptions.filter((r) => r.patientId === "p1").map((r) => ({ id: r.id }));
}

export default async function Page(props: PageProps<"/mobile/retseptlar/[id]">) {
  const { id } = await props.params;
  if (!prescriptions.some((r) => r.id === id && r.patientId === "p1")) notFound();
  return <RxDetail id={id} />;
}
