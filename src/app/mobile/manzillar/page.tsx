"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";
import { patient, useStore } from "../store";
import { AppBar } from "../ui";

type Geo = { lat: number; lng: number } | null;

export default function Page() {
  const { s, set } = useStore();
  const [adding, setAdding] = useState(false);
  const [geo, setGeo] = useState<Geo>(null);
  const [geoMsg, setGeoMsg] = useState("");

  const locate = () => {
    if (!navigator.geolocation) return setGeoMsg("Qurilmada GPS mavjud emas — manzilni qoʻlda kiriting");
    setGeoMsg("Aniqlanmoqda…");
    navigator.geolocation.getCurrentPosition(
      (p) => { setGeo({ lat: +p.coords.latitude.toFixed(5), lng: +p.coords.longitude.toFixed(5) }); setGeoMsg(""); },
      () => setGeoMsg("Ruxsat berilmadi — manzilni qoʻlda kiriting"),
      { timeout: 8000 },
    );
  };

  return (
    <div className="m-stack">
      <AppBar title="Manzillar" back="/mobile/profil" />
      <div className="m-note"><Icon name="siren" size={16} />Asosiy manzil SOS va dori yetkazishda ishlatiladi. Uy raqami va moʻljalni aniq yozing.</div>
      {s.addresses.map((a) => (
        <div key={a.id} className="m-card">
          <div className="m-row">
            <span className="m-ic"><Icon name={a.label === "Uy" ? "home" : "building"} size={20} /></span>
            <span className="m-grow"><b>{a.label} {a.primary ? <span className="m-badge teal">Asosiy</span> : null}</b><small>{a.street} {a.house}{a.apt ? `, ${a.apt}-xonadon` : ""} · {a.landmark}</small></span>
          </div>
          <div className="m-row">
            {!a.primary && <button className="m-btn ghost" style={{ flex: 1 }} onClick={() => set((x) => ({ ...x, addresses: x.addresses.map((y) => ({ ...y, primary: y.id === a.id })) }))}>Asosiy qilish</button>}
            {!a.primary && <button className="m-btn ghost" onClick={() => set((x) => ({ ...x, addresses: x.addresses.filter((y) => y.id !== a.id) }))}>Oʻchirish</button>}
          </div>
        </div>
      ))}
      <div className="m-card">
        <span className="m-label" style={{ margin: 0 }}>MED-ID dagi manzil (taklif)</span>
        <span>{patient.address.street} {patient.address.house}</span>
        <span className="m-muted" style={{ fontSize: 13 }}>Roʻyxatdagi manzil — haqiqiy yashash joyingiz boshqacha boʻlsa, yangisini qoʻshing.</span>
      </div>
      {adding ? (
        <form
          className="m-card"
          onSubmit={(e) => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            const g = geo ?? { lat: 41.3, lng: 69.24 };
            set((x) => ({ ...x, addresses: [...x.addresses, { id: `a${x.addresses.length + 1}-${String(f.get("house"))}`, label: String(f.get("label")), street: String(f.get("street")), house: String(f.get("house")), apt: String(f.get("apt")), landmark: String(f.get("landmark")), lat: g.lat, lng: g.lng, primary: false }] }));
            setAdding(false);
            setGeo(null);
          }}
        >
          <button type="button" className="m-btn ghost block" onClick={locate}><Icon name="gps" size={18} />GPS orqali aniqlash</button>
          {geo ? <span className="m-badge ok" style={{ justifySelf: "start" }}>{geo.lat}, {geo.lng}</span> : geoMsg ? <span className="m-muted" style={{ fontSize: 13 }}>{geoMsg}</span> : null}
          <label className="m-field"><span>Nomi</span><select name="label" className="m-input"><option>Uy</option><option>Ish</option><option>Ota-onam uyi</option></select></label>
          <label className="m-field"><span>Koʻcha</span><input name="street" className="m-input" required /></label>
          <div className="m-row">
            <label className="m-field" style={{ flex: 1 }}><span>Uy</span><input name="house" className="m-input" required /></label>
            <label className="m-field" style={{ flex: 1 }}><span>Xonadon</span><input name="apt" className="m-input" /></label>
          </div>
          <label className="m-field"><span>Moʻljal</span><input name="landmark" className="m-input" placeholder="Masalan: maktab roʻparasi" /></label>
          <div className="m-row"><button className="m-btn" style={{ flex: 1 }}>Saqlash</button><button type="button" className="m-btn ghost" onClick={() => setAdding(false)}>Bekor</button></div>
        </form>
      ) : (
        <button className="m-btn block ghost" onClick={() => setAdding(true)}><Icon name="plus" size={18} />Manzil qoʻshish</button>
      )}
    </div>
  );
}
