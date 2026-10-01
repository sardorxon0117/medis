import type { Metadata } from "next";
import { Card, PageHead } from "@/components/ui";
import { auditLogs } from "@/lib/mock-data";
import { dateTime } from "@/lib/format";

export const metadata: Metadata = { title: "Audit jurnali" };

export default function Page() {
  return (
    <>
      <PageHead title="Audit jurnali" sub="Kim qaysi bemor kartasini ochgani va har bir muhim amal yoziladi. Yozuvlar 5 yil saqlanadi va oʻzgartirib boʻlmaydi." req="7.1" />
      <Card flush>
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Vaqt</th><th>Kim</th><th>Amal</th><th>Obyekt</th><th>IP</th></tr></thead>
            <tbody>
              {auditLogs.map((l) => (
                <tr key={l.id}>
                  <td className="small">{dateTime(l.time)}</td>
                  <td>{l.who}</td>
                  <td style={{ color: l.action.includes("rad etildi") ? "var(--danger)" : undefined, fontWeight: l.action.includes("rad etildi") ? 700 : undefined }}>{l.action}</td>
                  <td className="mono small">{l.object}</td>
                  <td className="mono small muted">{l.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
