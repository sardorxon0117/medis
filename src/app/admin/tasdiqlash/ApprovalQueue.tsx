"use client";

import { Fragment, useState } from "react";
import { Icon } from "@/components/Icon";
import { ApprovalBadge, Card } from "@/components/ui";
import { useToast } from "@/components/useToast";
import type { ApprovalStatus } from "@/lib/types";

export interface Applicant {
  id: string;
  kind: "Shifokor" | "Klinika" | "Apteka" | "Kuryer";
  name: string;
  status: ApprovalStatus;
  details: [string, string][];
}

const KINDS = ["Barchasi", "Shifokor", "Klinika", "Apteka", "Kuryer"] as const;

export function ApprovalQueue({ initial }: { initial: Applicant[] }) {
  const [list, setList] = useState(initial);
  const [kind, setKind] = useState<(typeof KINDS)[number]>("Barchasi");
  const [status, setStatus] = useState<ApprovalStatus>("tekshirilmoqda");
  const [rejecting, setRejecting] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const toast = useToast();

  const shown = list.filter((a) => (kind === "Barchasi" || a.kind === kind) && a.status === status);
  const decide = (a: Applicant, s: ApprovalStatus, msg: string) => {
    setList((l) => l.map((x) => (x.id === a.id ? { ...x, status: s } : x)));
    setRejecting(null);
    setReason("");
    toast.show(msg);
  };

  return (
    <>
      <div className="spread">
        <div className="seg" role="group" aria-label="Turi">
          {KINDS.map((k) => (
            <button key={k} aria-pressed={kind === k} onClick={() => setKind(k)}>
              {k} ({list.filter((a) => (k === "Barchasi" || a.kind === k) && a.status === "tekshirilmoqda").length})
            </button>
          ))}
        </div>
        <select className="input" style={{ width: "auto" }} value={status} onChange={(e) => setStatus(e.target.value as ApprovalStatus)} aria-label="Holat">
          <option value="tekshirilmoqda">Tekshirilmoqda</option>
          <option value="tasdiqlangan">Tasdiqlangan</option>
          <option value="rad_etilgan">Rad etilgan</option>
        </select>
      </div>

      <div className="grid-2">
        {shown.map((a) => (
          <Card key={a.id} title={<>{a.name} <span className="xs muted">· {a.kind}</span></>} action={<ApprovalBadge status={a.status} />}>
            <div className="stack">
              <dl className="kv">{a.details.map(([k, v]) => <Fragment key={k}><dt>{k}</dt><dd>{v}</dd></Fragment>)}</dl>
              <button className="btn ghost sm" style={{ justifySelf: "start" }} onClick={() => toast.show("Hujjat himoyalangan saqlovdan ochilmoqda…")}><Icon name="file" size={16} />Litsenziya / hujjatni koʻrish</button>
              {a.status === "tekshirilmoqda" && (rejecting === a.id ? (
                <form className="stack-sm" onSubmit={(e) => { e.preventDefault(); decide(a, "rad_etilgan", `${a.name} rad etildi, sabab SMS orqali yuborildi`); }}>
                  <label className="label-txt" htmlFor={`why-${a.id}`}>Rad etish sababi</label>
                  <textarea id={`why-${a.id}`} className="input" value={reason} onChange={(e) => setReason(e.target.value)} required placeholder="Masalan: litsenziya muddati tugagan" />
                  <div className="row"><button className="btn danger sm">Rad etish</button><button type="button" className="btn ghost sm" onClick={() => setRejecting(null)}>Bekor</button></div>
                </form>
              ) : (
                <div className="row">
                  <button className="btn ok sm" onClick={() => decide(a, "tasdiqlangan", `${a.name} tasdiqlandi`)}><Icon name="check" size={16} />Tasdiqlash</button>
                  <button className="btn ghost sm" onClick={() => setRejecting(a.id)}>Rad etish</button>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
      {!shown.length && <Card><div className="empty">Bu boʻlimda ariza yoʻq</div></Card>}
      {toast.node}
    </>
  );
}
