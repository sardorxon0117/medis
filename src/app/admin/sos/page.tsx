import type { Metadata } from "next";
import { Badge, Card, PageHead, Stat } from "@/components/ui";
import { getPatient } from "@/lib/api";
import { sosEvents } from "@/lib/mock-data";
import { dateTime } from "@/lib/format";
import { SOS_SOURCE, SOS_STATUS } from "./labels";
import { CsvButton } from "@/components/Actions";

export const metadata: Metadata = { title: "SOS jurnali" };

export default function Page() {
  const sent = sosEvents.filter((e) => e.status !== "bekor_qilindi");
  return (
    <>
      <PageHead title="SOS jurnali" sub="Har bir SOS hodisasi yoziladi: vaqt, manba, manzil, kim koʻrdi, natija. Tez yordamga yetkazish talabi — 5 soniyadan kam." req="4.6">
        <CsvButton filename="medis-sos-jurnali.csv" rows={[["ID", "Vaqt", "Bemor", "Manba", "Manzil", "Kim koʻrdi", "103 javobi", "Natija"], ...sosEvents.map((e) => [e.id, e.time, getPatient(e.patientId)?.fullName ?? "", SOS_SOURCE[e.source], e.address, e.seenBy.join(", "), e.ambulanceReply ?? "", SOS_STATUS[e.status][1]])]}>CSV eksport</CsvButton>
      </PageHead>
      <div className="stats">
        <Stat label="Jami hodisalar" value={sosEvents.length} hint="30 kun" />
        <Stat label="Tez yordamga yuborilgan" value={sent.length} />
        <Stat label="Bekor qilingan" value={sosEvents.length - sent.length} hint="10 soniyalik taymer ichida" />
        <Stat label="Oʻrtacha yetkazish" value="1,8 s" hint="talab: < 5 s" />
      </div>
      <Card flush>
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>ID</th><th>Vaqt</th><th>Bemor</th><th>Manba</th><th>Manzil</th><th>Kim koʻrdi</th><th>103 javobi</th><th>Natija</th></tr></thead>
            <tbody>
              {sosEvents.map((e) => (
                <tr key={e.id}>
                  <td className="mono small">{e.id}</td>
                  <td className="small">{dateTime(e.time)}</td>
                  <td><b>{getPatient(e.patientId)?.fullName}</b></td>
                  <td>{SOS_SOURCE[e.source]}</td>
                  <td className="small">{e.address}<div className="xs muted mono">{e.lat}, {e.lng}</div></td>
                  <td className="small">{e.seenBy.length ? e.seenBy.join(", ") : <span className="muted">—</span>}</td>
                  <td className="small">{e.ambulanceReply ?? <span className="muted">—</span>}</td>
                  <td><Badge tone={SOS_STATUS[e.status][0]}>{SOS_STATUS[e.status][1]}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
