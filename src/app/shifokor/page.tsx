import Link from "next/link";
import { ApptBadge, Card, PageHead, Stat, StateBadge } from "@/components/ui";
import { alertsOf, getPatient, monitoredPatients } from "@/lib/api";
import { CURRENT, TODAY, appointments } from "@/lib/mock-data";
import { dateTime, time } from "@/lib/format";

export default function DoctorHome() {
  const list = monitoredPatients(CURRENT.doctorId);
  const alerts = alertsOf(CURRENT.doctorId).filter((a) => a.status === "yangi");
  const today = appointments
    .filter((a) => a.doctorId === CURRENT.doctorId && a.time.startsWith(TODAY))
    .sort((a, b) => a.time.localeCompare(b.time));
  const next = today.find((a) => a.status === "kutilmoqda");
  const risky = list.filter((p) => p.state !== "barqaror");

  return (
    <>
      <PageHead title="Xayrli tong, Aziza Karimova" sub="Payshanba, 2-oktabr · bugungi holat" req="SH-02">
        <Link href="/shifokor/retsept" className="btn">+ Retsept yozish</Link>
      </PageHead>

      <div className="stats">
        <Stat label="Nazoratdagi bemorlar" value={list.length} hint={`${risky.length} tasi eʼtibor talab qiladi`} />
        <Stat label="Xavfli signallar" value={alerts.filter((a) => a.level === "xavf").length} hint={`${alerts.length} ta yangi signal`} tone="danger" />
        <Stat label="Bugungi navbat" value={today.length} hint={`${today.filter((a) => a.status === "qabul_qilindi").length} ta qabul qilindi`} />
        <Stat label="Keyingi qabul" value={next ? time(next.time) : "—"} hint={next ? getPatient(next.patientId)?.fullName : "Bugun boshqa qabul yoʻq"} />
      </div>

      <div className="grid-main">
        <Card title="Eʼtibor talab qiladigan bemorlar" action={<Link href="/shifokor/bemorlar" className="btn ghost sm">Barchasi</Link>} flush>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr><th>Bemor</th><th>Operatsiya</th><th>Sabab</th><th>Holat</th></tr>
              </thead>
              <tbody>
                {risky.map((m) => (
                  <tr key={m.patient.id}>
                    <td><Link className="rowlink" href={`/shifokor/bemorlar/${m.patient.id}`}>{m.patient.fullName}</Link><div className="xs muted">{m.day}-kun</div></td>
                    <td>{m.plan.surgery}</td>
                    <td className="small">{m.reasons.join(", ")}</td>
                    <td><StateBadge state={m.state} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card title="Yangi signallar" action={<Link href="/shifokor/signallar" className="btn ghost sm">Ochish</Link>}>
          {alerts.map((a) => (
            <div key={a.id} className={`alert-row ${a.level}`}>
              <span className="bar" />
              <div className="grow">
                <b>{getPatient(a.patientId)?.fullName}</b>
                <div className="small">{a.reason}</div>
                <div className="xs muted">{dateTime(a.time)}</div>
              </div>
            </div>
          ))}
        </Card>
      </div>

      <Card title="Bugungi navbat" action={<Link href="/shifokor/navbat" className="btn ghost sm">Jadval</Link>} flush>
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Vaqt</th><th>Bemor</th><th>Sabab</th><th>Holat</th></tr></thead>
            <tbody>
              {today.map((a) => (
                <tr key={a.id}>
                  <td className="mono">{time(a.time)}</td>
                  <td>{getPatient(a.patientId)?.fullName}</td>
                  <td className="muted">{a.reason}</td>
                  <td><ApptBadge status={a.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
