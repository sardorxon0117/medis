import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/Icon";
import { Card, PageHead } from "@/components/ui";
import { doseLogsOf, evaluate, getDrug, getPatient, planDay, prescriptionsOf, surveysOf, vitalsOf } from "@/lib/api";
import { CURRENT, patients, plans } from "@/lib/mock-data";
import { age } from "@/lib/format";
import { PatientDetail } from "./PatientDetail";

export function generateStaticParams() {
  return patients.map((p) => ({ id: p.id }));
}

export async function generateMetadata(props: PageProps<"/shifokor/bemorlar/[id]">) {
  const { id } = await props.params;
  return { title: getPatient(id)?.fullName ?? "Bemor" };
}

export default async function Page(props: PageProps<"/shifokor/bemorlar/[id]">) {
  const { id } = await props.params;
  const patient = getPatient(id);
  if (!patient) notFound();

  const plan = plans.find((p) => p.patientId === id && p.doctorId === CURRENT.doctorId);

  // TZ 2-boʻlim: shifokor bemor maʼlumotini faqat oʻz bemori boʻlsa yoki bemor ruxsat bergan boʻlsa koʻradi
  if (!plan && !patient.medIdConsent) {
    return (
      <>
        <PageHead title={patient.fullName} sub="Bemor kartasi" req="SH-04" />
        <Card>
          <div className="empty stack" style={{ justifyItems: "center" }}>
            <Icon name="lock" size={36} />
            <b style={{ color: "var(--fg)" }}>Bemor kartasiga kirish uchun ruxsat kerak</b>
            <p>Bu bemor sizning nazoratingizda emas va maʼlumot ulashishga rozilik bermagan. Soʻrov bemor ilovasiga yuboriladi.</p>
            <button className="btn">Ruxsat soʻrash</button>
            <p className="xs">Urinish audit jurnaliga yozildi.</p>
          </div>
        </Card>
      </>
    );
  }

  const rxs = prescriptionsOf(id);
  const logs = doseLogsOf(id);
  const items = rxs.filter((r) => r.status === "faol").flatMap((r) => r.items);
  const vitals = vitalsOf(id, 30);
  const state = plan ? evaluate(vitals[vitals.length - 1], plan.thresholds) : null;

  return (
    <>
      <div className="row xs muted"><Link href="/shifokor/bemorlar">← Bemorlar</Link></div>
      <PatientDetail
        patient={{ ...patient, age: age(patient.birthDate) }}
        plan={plan ? { ...plan, day: planDay(plan) } : undefined}
        state={state?.state}
        reasons={state?.reasons ?? []}
        vitals={vitals}
        surveys={surveysOf(id)}
        prescriptions={rxs.map((rx) => ({ ...rx, items: rx.items.map((i) => ({ ...i, form: getDrug(i.mnn)?.form ?? "" })) }))}
        dose={items.map((item) => ({
          name: item.mnn,
          logs: logs.filter((l) => l.itemId === item.id).sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt)),
        }))}
      />
    </>
  );
}
