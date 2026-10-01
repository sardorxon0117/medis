"use client";

import { useState } from "react";
import { Card } from "@/components/ui";
import { useToast } from "@/components/useToast";
import { som } from "@/lib/format";
import type { Pricing } from "@/lib/types";

const FIELDS: { key: keyof Pricing; label: string; suffix: string; group: string }[] = [
  { key: "deliveryMin", label: "Yetkazish (min)", suffix: "soʻm", group: "Dori yetkazib berish" },
  { key: "deliveryMax", label: "Yetkazish (max)", suffix: "soʻm", group: "Dori yetkazib berish" },
  { key: "serviceFee", label: "Servis toʻlovi", suffix: "soʻm", group: "Dori yetkazib berish" },
  { key: "deliveryShare", label: "Platforma ulushi", suffix: "%", group: "Dori yetkazib berish" },
  { key: "monitoring", label: "Nazorat paketi", suffix: "soʻm/oy", group: "Obunalar" },
  { key: "monitoringShare", label: "Nazoratdan platforma ulushi", suffix: "%", group: "Obunalar" },
  { key: "doctorPremium", label: "Shifokor Premium", suffix: "soʻm/oy", group: "Obunalar" },
  { key: "clinicPro", label: "Xususiy klinika Pro", suffix: "soʻm/oy", group: "Obunalar" },
  { key: "adCpm", label: "1 000 koʻrish narxi", suffix: "soʻm", group: "Reklama" },
];

export function PricingForm({ initial }: { initial: Pricing }) {
  const [p, setP] = useState(initial);
  const [adEvery, setAdEvery] = useState(4);
  const toast = useToast();
  const groups = Array.from(new Set(FIELDS.map((f) => f.group)));
  const invalid = p.deliveryMin > p.deliveryMax || p.deliveryShare > 100 || p.monitoringShare > 100;
  const avgDelivery = (p.deliveryMin + p.deliveryMax) / 2;

  return (
    <form
      className="grid-main"
      onSubmit={(e) => {
        e.preventDefault();
        toast.show("Narxlar saqlandi va audit jurnaliga yozildi");
      }}
    >
      <div className="stack">
        {groups.map((g) => (
          <Card key={g} title={g}>
            <div className="form-grid">
              {FIELDS.filter((f) => f.group === g).map((f) => (
                <div className="field" key={f.key}>
                  <label htmlFor={f.key}>{f.label}, {f.suffix}</label>
                  <input id={f.key} type="number" min={0} step={f.suffix === "%" ? 1 : 1000} value={p[f.key]} onChange={(e) => setP({ ...p, [f.key]: Number(e.target.value) })} />
                </div>
              ))}
              {g === "Reklama" && (
                <div className="field">
                  <label htmlFor="adEvery">Reklama chastotasi</label>
                  <select id="adEvery" value={adEvery} onChange={(e) => setAdEvery(Number(e.target.value))}>
                    {[3, 4, 5, 6, 8].map((n) => <option key={n} value={n}>Har {n} ta videodan keyin</option>)}
                  </select>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
      <Card title="Hisob-kitob namunasi">
        <div className="stack">
          <dl className="kv">
            <dt>Oʻrtacha yetkazish</dt><dd>{som(avgDelivery)} + {som(p.serviceFee)}</dd>
            <dt>Platformaga</dt><dd>{som(avgDelivery * (p.deliveryShare / 100) + p.serviceFee)}</dd>
            <dt>Kuryerga</dt><dd>{som(avgDelivery * (1 - p.deliveryShare / 100))}</dd>
            <dt>Nazorat paketi</dt><dd>{som(p.monitoring)}</dd>
            <dt>Shifokor/klinikaga</dt><dd>{som(p.monitoring * (1 - p.monitoringShare / 100))}</dd>
          </dl>
          {invalid && <span className="small" style={{ color: "var(--danger)", fontWeight: 600 }}>Minimal narx maksimaldan katta yoki ulush 100% dan oshgan</span>}
          <button className="btn" disabled={invalid}>Saqlash</button>
          <p className="hint">Oʻzgarish yangi buyurtma va obunalarga qoʻllanadi; faol obunalar muddati tugaguncha eski narxda qoladi.</p>
        </div>
      </Card>
      {toast.node}
    </form>
  );
}
