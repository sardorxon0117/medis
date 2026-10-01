"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/Icon";
import { Badge } from "@/components/ui";
import { useToast } from "@/components/useToast";
import { dateTime } from "@/lib/format";
import type { Alert } from "@/lib/types";

type Row = Alert & { patientName: string; phone: string; address: string };

const statusLabel = { yangi: ["danger", "Yangi"], korildi: ["warn", "Koʻrildi"], hal_qilindi: ["ok", "Hal qilindi"] } as const;

export function AlertList({ initial }: { initial: Row[] }) {
  const [rows, setRows] = useState(initial);
  const [onlyNew, setOnlyNew] = useState(false);
  const toast = useToast();

  const update = (id: string, status: Alert["status"], msg: string) => {
    setRows((r) => r.map((a) => (a.id === id ? { ...a, status, seenBy: "Aziza Karimova" } : a)));
    toast.show(msg);
  };

  const shown = onlyNew ? rows.filter((a) => a.status === "yangi") : rows;

  return (
    <section className="card">
      <div className="card-head">
        <div className="seg" role="group" aria-label="Filtr">
          <button aria-pressed={!onlyNew} onClick={() => setOnlyNew(false)}>Barchasi ({rows.length})</button>
          <button aria-pressed={onlyNew} onClick={() => setOnlyNew(true)}>Yangi ({rows.filter((a) => a.status === "yangi").length})</button>
        </div>
      </div>
      {shown.map((a) => (
        <div key={a.id} className={`alert-row ${a.level}`}>
          <span className="bar" />
          <div className="grow">
            <div className="spread">
              <div className="row wrap-row">
                <Link href={`/shifokor/bemorlar/${a.patientId}`} className="rowlink" style={{ fontWeight: 700, color: "var(--fg)" }}>{a.patientName}</Link>
                <Badge tone={a.level === "xavf" ? "danger" : "warn"} plain>{a.level === "xavf" ? "Xavf" : "Diqqat"}</Badge>
              </div>
              <Badge tone={statusLabel[a.status][0]}>{statusLabel[a.status][1]}</Badge>
            </div>
            <div>{a.reason}</div>
            <div className="xs muted">{dateTime(a.time)}{a.seenBy ? ` · koʻrdi: ${a.seenBy}` : ""}</div>
            {a.status !== "hal_qilindi" && (
              <div className="actions">
                {a.status === "yangi" && <button className="btn ghost xs" onClick={() => update(a.id, "korildi", "Signal koʻrildi deb belgilandi")}><Icon name="eye" size={14} />Koʻrdim</button>}
                <a className="btn ghost xs" href={`tel:${a.phone.replace(/\s/g, "")}`}><Icon name="phone" size={14} />Qoʻngʻiroq qilish</a>
                <button className="btn ghost xs" onClick={() => update(a.id, "hal_qilindi", `${a.patientName} qabulga chaqirildi`)}><Icon name="calendar" size={14} />Qabulga chaqirish</button>
                {a.level === "xavf" && (
                  <button className="btn danger xs" onClick={() => update(a.id, "hal_qilindi", `Tez yordam yuborildi: ${a.address}`)}><Icon name="siren" size={14} />Tez yordam</button>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
      {!shown.length && <div className="empty">Yangi signal yoʻq</div>}
      {toast.node}
    </section>
  );
}
