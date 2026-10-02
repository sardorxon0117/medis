"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/components/Icon";
import { getDrug } from "@/lib/api";
import { pharmacies, pricing, stock } from "@/lib/mock-data";
import { activeRx, useStore } from "../store";
import { AppBar, money } from "../ui";

// tugma bosilgan vaqt (hodisa ichida chaqiriladi)
const stamp = () => Date.now();

const PAY = ["Click", "Payme", "Uzcard", "Humo", "Naqd (kuryerga)"];

// Retseptdagi har bir dori uchun aptekadagi eng arzon mos pozitsiya (B-09)
function offers() {
  return pharmacies
    .filter((p) => p.approval === "tasdiqlangan")
    .map((p) => {
      const lines = activeRx.items.map((it) => {
        const opts = stock.filter((s) => s.pharmacyId === p.id && s.mnn === it.mnn && s.qty > 0).sort((a, b) => a.price - b.price);
        return { mnn: it.mnn, pick: opts[0] };
      });
      const available = lines.filter((l) => l.pick);
      const km = p.distanceKm ?? 3;
      const delivery = Math.min(pricing.deliveryMax, Math.max(pricing.deliveryMin, Math.round((pricing.deliveryMin + (km - 1) * 2000) / 1000) * 1000));
      return { p, lines, full: available.length === lines.length, total: available.reduce((s, l) => s + l.pick!.price, 0), delivery, km };
    })
    .sort((a, b) => Number(b.full) - Number(a.full) || a.total - b.total);
}

export default function Page() {
  const router = useRouter();
  const { s, set } = useStore();
  const list = offers();
  const [sel, setSel] = useState(list.find((o) => o.full)?.p.id ?? list[0].p.id);
  const [pay, setPay] = useState(PAY[0]);
  const o = list.find((x) => x.p.id === sel)!;
  const home = s.addresses.find((a) => a.primary) ?? s.addresses[0];
  const usedRx = s.orders.some((x) => x.items.some((i) => getDrug(i.mnn)?.prescriptionOnly));

  const order = () => {
    const at = stamp();
    const id = `M-${String(at).slice(-5)}`;
    set((x) => ({
      ...x,
      orders: [{
        id, pharmacyId: o.p.id, pharmacyName: o.p.name,
        items: o.lines.filter((l) => l.pick).map((l) => ({ mnn: l.mnn, tradeName: l.pick!.tradeName, price: l.pick!.price, qty: 1 })),
        total: o.total, delivery: o.delivery, service: pricing.serviceFee, payment: pay, createdAt: at, handedOver: false,
      }, ...x.orders],
    }));
    router.push(`/mobile/buyurtmalar/${id}`);
  };

  return (
    <div className="m-stack">
      <AppBar title="Onlayn apteka" />
      <div className="m-note"><Icon name="rx" size={16} />Retsept {activeRx.id.toUpperCase()} boʻyicha {activeRx.items.length} ta dori. Retseptli dori faqat amaldagi elektron retsept bilan beriladi.</div>
      {usedRx && <div className="m-warn"><Icon name="lock" size={16} />Bu retsept boʻyicha retseptli dori allaqachon buyurtma qilingan — retsept qayta ishlatilmaydi.</div>}

      <span className="m-label">Yaqin aptekalar · narx boʻyicha</span>
      {list.map((x) => (
        <button key={x.p.id} type="button" className="m-card" onClick={() => setSel(x.p.id)} style={{ textAlign: "left", cursor: "pointer", font: "inherit", color: "inherit", outline: sel === x.p.id ? "2px solid var(--teal)" : "none" }}>
          <div className="m-row">
            <span className="m-ic"><Icon name="pill" size={20} /></span>
            <span className="m-grow"><b>{x.p.name}</b><small>{x.km.toString().replace(".", ",")} km · {x.p.workHours}</small></span>
            <b>{money(x.total)}</b>
          </div>
          {x.lines.map((l) => (
            <div key={l.mnn} className="m-row" style={{ justifyContent: "space-between", fontSize: 14 }}>
              <span className="m-muted">{l.pick ? l.pick.tradeName : l.mnn}</span>
              {l.pick ? <span>{money(l.pick.price)}</span> : <span className="m-badge red">yoʻq</span>}
            </div>
          ))}
          {!x.full && <span className="m-badge warn" style={{ justifySelf: "start" }}>Hamma dori mavjud emas</span>}
        </button>
      ))}

      <span className="m-label">Yetkazish</span>
      <div className="m-card">
        <div className="m-row"><Icon name="pin" size={18} /><span className="m-grow"><b>{home.label}: {home.street} {home.house}{home.apt ? `, ${home.apt}` : ""}</b><small>{home.landmark}</small></span></div>
        <div className="m-row" style={{ justifyContent: "space-between" }}><span className="m-muted">Dorilar</span><span>{money(o.total)}</span></div>
        <div className="m-row" style={{ justifyContent: "space-between" }}><span className="m-muted">Yetkazish ({o.km.toString().replace(".", ",")} km)</span><span>{money(o.delivery)}</span></div>
        <div className="m-row" style={{ justifyContent: "space-between" }}><span className="m-muted">Servis</span><span>{money(pricing.serviceFee)}</span></div>
        <div className="m-row" style={{ justifyContent: "space-between", fontSize: 18 }}><b>Jami</b><b>{money(o.total + o.delivery + pricing.serviceFee)}</b></div>
      </div>
      <div className="m-chips">{PAY.map((p) => <button key={p} type="button" className="m-chip" aria-pressed={pay === p} onClick={() => setPay(p)}>{p}</button>)}</div>
      <button className="m-btn block" onClick={order} disabled={!o.total}>{pay.startsWith("Naqd") ? "Buyurtma berish" : `${pay} orqali toʻlash`}</button>
    </div>
  );
}
