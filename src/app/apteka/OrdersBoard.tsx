"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";
import { Badge, OrderBadge } from "@/components/ui";
import { useToast } from "@/components/useToast";
import { dateTime, som } from "@/lib/format";
import type { OrderStatus } from "@/lib/types";

export interface PharmacyOrder {
  id: string;
  createdAt: string;
  status: OrderStatus;
  payment: "onlayn" | "naqd";
  total: number;
  deliveryFee: number;
  address: string;
  landmark: string;
  recipient: string;
  courier?: string;
  rx?: { id: string; valid: boolean; date: string; mnns: string[] };
  items: { mnn: string; tradeName: string; qty: number; price: number; prescriptionOnly: boolean; inStock: number }[];
}

const COLUMNS: { title: string; statuses: OrderStatus[] }[] = [
  { title: "Yangi", statuses: ["yangi"] },
  { title: "Yigʻilmoqda", statuses: ["qabul_qilindi"] },
  { title: "Kuryerni kutmoqda", statuses: ["yigildi"] },
  { title: "Yoʻlda / yakunlangan", statuses: ["yolda", "yetkazildi", "rad_etildi"] },
];

export function OrdersBoard({ initial }: { initial: PharmacyOrder[] }) {
  const [orders, setOrders] = useState(initial);
  const [usedRx, setUsedRx] = useState<string[]>([]);
  const toast = useToast();

  const move = (id: string, status: OrderStatus, msg: string) => {
    setOrders((list) => list.map((o) => (o.id === id ? { ...o, status } : o)));
    toast.show(msg);
  };

  // A-04: retseptli dori uchun retsept amalda va ilgari ishlatilmagan boʻlishi kerak
  const rxProblem = (o: PharmacyOrder) => {
    const needsRx = o.items.some((i) => i.prescriptionOnly);
    if (!needsRx) return null;
    if (!o.rx) return "Retseptli dori uchun elektron retsept yoʻq";
    if (!o.rx.valid) return "Retsept muddati tugagan";
    if (usedRx.includes(o.rx.id)) return "Bu retsept allaqachon ishlatilgan";
    const missing = o.items.filter((i) => i.prescriptionOnly && !o.rx!.mnns.includes(i.mnn));
    if (missing.length) return `${missing.map((i) => i.mnn).join(", ")} retseptda yoʻq`;
    return null;
  };

  return (
    <div className="board">
      {COLUMNS.map((col) => {
        const list = orders.filter((o) => col.statuses.includes(o.status));
        return (
          <section key={col.title} className="board-col">
            <div className="spread"><b>{col.title}</b><span className="badge plain">{list.length}</span></div>
            {list.map((o) => {
              const problem = o.status === "yangi" ? rxProblem(o) : null;
              const short = o.items.filter((i) => i.qty > i.inStock);
              return (
                <article key={o.id} className="card order">
                  <div className="spread">
                    <b className="mono">{o.id}</b>
                    <OrderBadge status={o.status} />
                  </div>
                  <span className="xs muted">{dateTime(o.createdAt)} · {o.payment === "onlayn" ? "Onlayn toʻlangan" : "Naqd (kuryerga)"}</span>
                  <ul className="order-items">
                    {o.items.map((i) => (
                      <li key={i.tradeName}>
                        <span>
                          {i.tradeName} × {i.qty}
                          {i.prescriptionOnly ? <> <Badge tone="teal" plain>Rx</Badge></> : null}
                          {i.qty > i.inStock ? <div className="xs" style={{ color: "var(--danger)" }}>Qoldiq: {i.inStock}</div> : null}
                        </span>
                        <span className="mono small">{som(i.price * i.qty)}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="spread small"><span className="muted">Jami</span><b>{som(o.total)}</b></div>
                  <div className="small"><Icon name="pin" size={14} /> {o.address}<div className="xs muted">{o.landmark} · qabul qiluvchi: {o.recipient}</div></div>
                  {o.rx && o.status === "yangi" && (
                    <div className="xs" style={{ color: problem ? "var(--danger)" : "var(--ok)", fontWeight: 700 }}>
                      {problem ? `⚠ ${problem}` : `✓ Retsept ${o.rx.id} amalda`}
                    </div>
                  )}
                  {!o.rx && problem && <div className="xs" style={{ color: "var(--danger)", fontWeight: 700 }}>⚠ {problem}</div>}
                  {o.courier && o.status !== "yangi" ? <div className="xs muted"><Icon name="truck" size={14} /> Kuryer: {o.courier}</div> : null}

                  {o.status === "yangi" && (
                    <div className="row wrap-row">
                      <button
                        className="btn sm"
                        disabled={!!problem || short.length > 0}
                        onClick={() => {
                          if (o.rx) setUsedRx((u) => [...u, o.rx!.id]);
                          move(o.id, "qabul_qilindi", `${o.id} qabul qilindi${o.rx ? `, retsept ${o.rx.id} ishlatilgan deb belgilandi` : ""}`);
                        }}
                      >
                        Qabul qilish
                      </button>
                      <button className="btn ghost sm" onClick={() => move(o.id, "rad_etildi", `${o.id} rad etildi, bemorga boshqa aptekalar taklif qilinadi`)}>Rad etish</button>
                    </div>
                  )}
                  {o.status === "yangi" && short.length > 0 && <span className="xs muted">Qoldiq yetarli emas — qabul qilib boʻlmaydi</span>}
                  {o.status === "qabul_qilindi" && <button className="btn ok sm" onClick={() => move(o.id, "yigildi", `${o.id} yigʻildi — yaqin kuryerlarga xabar yuborildi`)}>Yigʻildi</button>}
                </article>
              );
            })}
            {!list.length && <div className="empty small">Boʻsh</div>}
          </section>
        );
      })}
      {toast.node}
    </div>
  );
}
