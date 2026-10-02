"use client";

import { Icon } from "@/components/Icon";
import { getDoctor } from "@/lib/api";
import { useStore } from "../store";
import { AppBar, Stars, dayLabel } from "../ui";

export default function Page() {
  const { s, set } = useStore();
  const orders = s.orders.filter((o) => o.handedOver);
  const visits = s.appointments.filter((a) => a.status === "yakunlandi");
  return (
    <div className="m-stack">
      <AppBar title="Baholash" back="/mobile/profil" />
      <div className="m-note"><Icon name="star" size={16} />Qabul va yetkazib berishdan keyin 1–5 baho qoʻying — bu shifokor va kuryer reytingiga taʼsir qiladi.</div>
      <span className="m-label">Qabullar</span>
      {visits.length ? visits.map((a) => (
        <div key={a.id} className="m-card">
          <div className="m-row"><span className="m-grow"><b>{getDoctor(a.doctorId)?.fullName}</b><small>{dayLabel(a.date)}, {a.time}</small></span></div>
          <Stars value={a.rating ?? 0} onChange={(v) => set((x) => ({ ...x, appointments: x.appointments.map((y) => (y.id === a.id ? { ...y, rating: v } : y)) }))} />
        </div>
      )) : <div className="m-empty">Yakunlangan qabul yoʻq</div>}
      <span className="m-label">Yetkazib berishlar</span>
      {orders.length ? orders.map((o) => (
        <div key={o.id} className="m-card">
          <div className="m-row"><span className="m-grow"><b>{o.pharmacyName}</b><small>Buyurtma {o.id}</small></span></div>
          <Stars value={o.rating ?? 0} onChange={(v) => set((x) => ({ ...x, orders: x.orders.map((y) => (y.id === o.id ? { ...y, rating: v } : y)) }))} />
        </div>
      )) : <div className="m-empty">Yetkazilgan buyurtma yoʻq</div>}
    </div>
  );
}
