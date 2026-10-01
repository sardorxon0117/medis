"use client";

import { useState } from "react";
import { Badge, Card } from "@/components/ui";
import { useToast } from "@/components/useToast";
import { dateTime, som } from "@/lib/format";
import type { Payment } from "@/lib/types";

const typeLabel: Record<Payment["type"], string> = {
  yetkazish: "Dori yetkazish", nazorat: "Nazorat paketi", premium: "Shifokor Premium", pro: "Klinika Pro", reklama: "Reklama",
};
const statusTone = { "toʻlandi": "ok", kutilmoqda: "warn", qaytarildi: "" } as const;

export function PaymentsTable({ initial }: { initial: Payment[] }) {
  const [rows, setRows] = useState(initial);
  const toast = useToast();
  return (
    <Card flush>
      <div className="table-wrap">
        <table className="table">
          <thead><tr><th>ID</th><th>Sana</th><th>Toʻlovchi</th><th>Xizmat</th><th>Provayder</th><th className="num">Summa</th><th className="num">Ulush</th><th>Holat</th><th /></tr></thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id}>
                <td className="mono small">{p.id}</td>
                <td className="small">{dateTime(p.date)}</td>
                <td>{p.payer}</td>
                <td>{typeLabel[p.type]}</td>
                <td>{p.provider}</td>
                <td className="num">{som(p.amount)}</td>
                <td className="num muted">{som(p.platformShare)}</td>
                <td><Badge tone={statusTone[p.status]}>{p.status}</Badge></td>
                <td>
                  {p.status === "toʻlandi" && p.provider !== "Naqd" && (
                    <button
                      className="btn ghost xs"
                      onClick={() => {
                        if (!confirm(`${p.id} (${som(p.amount)}) qaytarilsinmi?`)) return;
                        setRows((r) => r.map((x) => (x.id === p.id ? { ...x, status: "qaytarildi", platformShare: 0 } : x)));
                        toast.show(`${som(p.amount)} ${p.provider} orqali qaytarildi`);
                      }}
                    >
                      Qaytarish
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {toast.node}
    </Card>
  );
}
