import type { Metadata } from "next";
import { BarChart } from "@/components/Charts";
import { Badge, Card, PageHead, Stat } from "@/components/ui";
import { getClinic } from "@/lib/api";
import { CURRENT, TODAY, alerts, appointments, doctors, plans } from "@/lib/mock-data";
import { date } from "@/lib/format";

export const metadata: Metadata = { title: "Klinika statistikasi" };

// oxirgi 14 kundagi qabullar (demo)
const daily = Array.from({ length: 14 }, (_, i) => {
  const d = new Date(`${TODAY}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - 13 + i);
  const wd = d.getUTCDay();
  return { label: date(d.toISOString()), value: wd === 0 ? 0 : 22 + ((i * 7) % 13) + (wd === 6 ? -10 : 0) };
});

export default function Page() {
  const clinic = getClinic(CURRENT.clinicId)!;
  const staff = doctors.filter((d) => d.clinicIds.includes(clinic.id));
  const staffIds = new Set(staff.map((d) => d.id));
  const todayAppts = appointments.filter((a) => a.clinicId === clinic.id && a.time.startsWith(TODAY));
  const monitored = plans.filter((p) => staffIds.has(p.doctorId) && p.active);
  const sig = alerts.filter((a) => monitored.some((p) => p.id === a.planId));
  const total = daily.reduce((s, d) => s + d.value, 0);

  return (
    <>
      <PageHead title={clinic.name} sub={`${clinic.type === "xususiy" ? "Xususiy" : "Davlat"} klinika · ${clinic.address}`} req="K-05">
        {clinic.proUntil ? <Badge tone="teal">Pro faol</Badge> : null}
      </PageHead>
      <div className="stats">
        <Stat label="Bugungi qabullar" value={todayAppts.length} hint={`${todayAppts.filter((a) => a.status === "qabul_qilindi").length} ta yakunlandi`} />
        <Stat label="Kelmagan bemorlar" value={todayAppts.filter((a) => a.status === "kelmadi").length} hint="bugun" />
        <Stat label="Nazoratdagi bemorlar" value={monitored.length} hint={`${staff.length} ta shifokorda`} />
        <Stat label="Signallar" value={sig.length} hint={`${sig.filter((a) => a.status === "yangi").length} ta javobsiz`} tone={sig.some((a) => a.status === "yangi") ? "danger" : undefined} />
      </div>
      <div className="grid-main">
        <Card title="Qabullar, oxirgi 14 kun" action={<span className="muted small">jami {total}</span>}>
          <BarChart label="Kunlik qabullar soni" data={daily} />
        </Card>
        <Card title="Shifokorlar yuklamasi" flush>
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Shifokor</th><th className="num">Bugun</th><th className="num">Nazoratda</th></tr></thead>
              <tbody>
                {staff.map((d) => (
                  <tr key={d.id}>
                    <td><b>{d.fullName}</b><div className="xs muted">{d.specialty}</div></td>
                    <td className="num mono">{todayAppts.filter((a) => a.doctorId === d.id).length}</td>
                    <td className="num mono">{monitored.filter((p) => p.doctorId === d.id).length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </>
  );
}
