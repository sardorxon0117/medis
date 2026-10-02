"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";
import { useStore, type MFamily } from "../store";
import { AppBar } from "../ui";

export default function Page() {
  const { s, set } = useStore();
  const [adding, setAdding] = useState(false);
  const upd = (id: string, patch: Partial<MFamily>) => set((x) => ({ ...x, family: x.family.map((f) => (f.id === id ? { ...f, ...patch } : f)) }));

  return (
    <div className="m-stack">
      <AppBar title="Yaqinlar" back="/mobile/profil" />
      <div className="m-note"><Icon name="users" size={16} />Yaqinlaringiz holatingizni koʻradi va SOS boʻlganda SMS oladi. Ruxsatlarni istalgan vaqtda oʻzgartirasiz.</div>
      {s.family.map((f) => (
        <div key={f.id} className="m-card">
          <div className="m-row"><span className="m-ic"><Icon name="user" size={20} /></span><span className="m-grow"><b>{f.name}</b><small>{f.relation} · {f.phone}</small></span>
            <button className="m-icon" aria-label="Oʻchirish" onClick={() => set((x) => ({ ...x, family: x.family.filter((y) => y.id !== f.id) }))}><Icon name="x" size={18} /></button>
          </div>
          <div className="m-row"><span className="m-grow">Holatimni koʻradi</span><button role="switch" aria-checked={f.seeStatus} className="m-switch" onClick={() => upd(f.id, { seeStatus: !f.seeStatus })} aria-label="Holatimni koʻradi" /></div>
          <div className="m-row"><span className="m-grow">SOS xabarini oladi</span><button role="switch" aria-checked={f.getSos} className="m-switch" onClick={() => upd(f.id, { getSos: !f.getSos })} aria-label="SOS xabarini oladi" /></div>
        </div>
      ))}
      {adding ? (
        <form
          className="m-card"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            set((x) => ({ ...x, family: [...x.family, { id: `f${x.family.length + 1}-${String(fd.get("phone")).slice(-4)}`, name: String(fd.get("name")), relation: String(fd.get("rel")), phone: String(fd.get("phone")), seeStatus: true, getSos: true }] }));
            setAdding(false);
          }}
        >
          <label className="m-field"><span>Ism</span><input name="name" className="m-input" required /></label>
          <label className="m-field"><span>Kim boʻladi</span><select name="rel" className="m-input"><option>Oʻgʻli</option><option>Qizi</option><option>Turmush oʻrtogʻi</option><option>Aka-uka / opa-singil</option><option>Boshqa</option></select></label>
          <label className="m-field"><span>Telefon</span><input name="phone" type="tel" className="m-input" placeholder="+998 __ ___ __ __" required /></label>
          <div className="m-row"><button className="m-btn" style={{ flex: 1 }}>Qoʻshish</button><button type="button" className="m-btn ghost" onClick={() => setAdding(false)}>Bekor</button></div>
        </form>
      ) : (
        <button className="m-btn block ghost" onClick={() => setAdding(true)}><Icon name="plus" size={18} />Yaqin qoʻshish</button>
      )}
    </div>
  );
}
