"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";
import { Badge, Card } from "@/components/ui";
import { useToast } from "@/components/useToast";
import type { PharmacyStock } from "@/lib/types";

type Row = PharmacyStock & { prescriptionOnly: boolean };

const LOW = 5;

// CSV: MNN;savdo nomi;narx;qoldiq (Excel dan "CSV" sifatida saqlangan fayl)
function parseCsv(text: string, pharmacyId: string, rxSet: Set<string>): Row[] {
  return text
    .split(/\r?\n/)
    .map((l) => l.split(/[;,\t]/).map((c) => c.trim()))
    .filter((c) => c.length >= 4 && !Number.isNaN(Number(c[2])))
    .map(([mnn, tradeName, price, qty]) => ({ pharmacyId, mnn, tradeName, price: Number(price), qty: Number(qty), prescriptionOnly: rxSet.has(mnn) }));
}

export function Catalog({ initial, mnnList }: { initial: Row[]; mnnList: string[] }) {
  const [rows, setRows] = useState(initial);
  const [q, setQ] = useState("");
  const [onlyLow, setOnlyLow] = useState(false);
  const toast = useToast();
  const rxSet = new Set(initial.filter((r) => r.prescriptionOnly).map((r) => r.mnn));

  const update = (tradeName: string, patch: Partial<Row>) => setRows((list) => list.map((r) => (r.tradeName === tradeName ? { ...r, ...patch } : r)));
  const shown = rows.filter(
    (r) => (!onlyLow || r.qty <= LOW) && `${r.mnn} ${r.tradeName}`.toLowerCase().includes(q.trim().toLowerCase()),
  );

  return (
    <>
      <div className="spread">
        <div className="row wrap-row">
          <input className="input" style={{ width: 260 }} placeholder="Dori yoki MNN qidirish" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Dori qidirish" />
          <label className="check"><input type="checkbox" checked={onlyLow} onChange={(e) => setOnlyLow(e.target.checked)} />Kam qolganlar ({rows.filter((r) => r.qty <= LOW).length})</label>
        </div>
        <div className="row wrap-row">
          <label className="btn ghost sm" style={{ cursor: "pointer" }}>
            <Icon name="upload" size={16} />Excel / CSV yuklash
            <input
              type="file"
              accept=".csv,.txt"
              hidden
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                const parsed = parseCsv(await f.text(), initial[0]?.pharmacyId ?? "", rxSet);
                if (!parsed.length) return toast.show("Faylda mos qator topilmadi. Format: MNN;nom;narx;qoldiq");
                setRows((list) => {
                  const map = new Map(list.map((r) => [r.tradeName, r]));
                  parsed.forEach((p) => map.set(p.tradeName, { ...map.get(p.tradeName), ...p }));
                  return Array.from(map.values());
                });
                toast.show(`${parsed.length} ta pozitsiya yangilandi`);
                e.target.value = "";
              }}
            />
          </label>
          <button className="btn sm" onClick={() => toast.show("Katalog saqlandi, bemorlar uchun narxlar yangilandi")}>Saqlash</button>
        </div>
      </div>

      <Card flush>
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Savdo nomi</th><th>MNN</th><th className="num">Narx, soʻm</th><th className="num">Qoldiq</th></tr></thead>
            <tbody>
              {shown.map((r) => (
                <tr key={r.tradeName}>
                  <td><b>{r.tradeName}</b> {r.prescriptionOnly ? <Badge tone="teal" plain>Retseptli</Badge> : null}</td>
                  <td className="muted small">{r.mnn}</td>
                  <td className="num">
                    <input className="input mono" style={{ width: 120, minHeight: 34, padding: "4px 8px", textAlign: "right" }} type="number" step={100} value={r.price} onChange={(e) => update(r.tradeName, { price: Number(e.target.value) })} aria-label={`${r.tradeName} narxi`} />
                  </td>
                  <td className="num">
                    <input
                      className="input mono"
                      style={{ width: 90, minHeight: 34, padding: "4px 8px", textAlign: "right", color: r.qty <= LOW ? "var(--danger)" : undefined }}
                      type="number"
                      min={0}
                      value={r.qty}
                      onChange={(e) => update(r.tradeName, { qty: Number(e.target.value) })}
                      aria-label={`${r.tradeName} qoldigʻi`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!shown.length && <div className="empty">Topilmadi</div>}
        </div>
      </Card>
      <p className="hint">
        MNN nomlari DARMON reyestriga mos boʻlishi kerak ({mnnList.length} ta dori roʻyxatda). API integratsiyasi: 1C, Apteka-Soft — soʻrov orqali ulanadi.
      </p>
      {toast.node}
    </>
  );
}
