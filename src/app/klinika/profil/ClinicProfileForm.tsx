"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";
import { ApprovalBadge, Card } from "@/components/ui";
import { useToast } from "@/components/useToast";
import type { Clinic } from "@/lib/types";

export function ClinicProfileForm({ clinic }: { clinic: Clinic }) {
  const [services, setServices] = useState(clinic.services);
  const [svc, setSvc] = useState("");
  const toast = useToast();

  return (
    <div className="grid-main">
      <Card title="Asosiy maʼlumotlar" action={<ApprovalBadge status={clinic.approval} />}>
        <form className="stack" onSubmit={(e) => { e.preventDefault(); toast.show("Klinika profili saqlandi"); }}>
          <div className="form-grid">
            <div className="field full"><label htmlFor="c-name">Nomi <span className="muted xs">· reyestrdan</span></label><input id="c-name" defaultValue={clinic.name} readOnly /></div>
            <div className="field">
              <label htmlFor="c-type">Turi <span className="muted xs">· reyestrdan</span></label>
              <input id="c-type" defaultValue={clinic.type === "davlat" ? "Davlat" : "Xususiy"} readOnly />
            </div>
            <div className="field"><label htmlFor="c-hours">Ish vaqti</label><input id="c-hours" defaultValue={clinic.workHours} /></div>
            <div className="field full"><label htmlFor="c-addr">Manzil</label><input id="c-addr" defaultValue={clinic.address} /></div>
            <div className="field full"><label htmlFor="c-lic">Litsenziya <span className="muted xs">· litsenziyalar reyestridan</span></label><input id="c-lic" defaultValue={`${clinic.license} — amalda`} readOnly /></div>
            <div className="field full">
              <span className="label-txt">Xizmatlar</span>
              <div className="chips">
                {services.map((s) => (
                  <button type="button" key={s} className="chip" aria-pressed="true" onClick={() => setServices(services.filter((x) => x !== s))} title="Olib tashlash">
                    {s} ×
                  </button>
                ))}
              </div>
              <div className="row">
                <input className="input" value={svc} onChange={(e) => setSvc(e.target.value)} placeholder="Yangi xizmat" aria-label="Yangi xizmat" />
                <button type="button" className="btn ghost sm" onClick={() => { if (svc.trim()) { setServices([...services, svc.trim()]); setSvc(""); } }}>Qoʻshish</button>
              </div>
            </div>
          </div>
          <button className="btn">Saqlash</button>
        </form>
      </Card>

      <Card title="Xaritadagi joylashuv">
        <div className="stack">
          <svg viewBox="0 0 320 220" style={{ width: "100%", borderRadius: 12, background: "var(--surface-2)" }} role="img" aria-label="Xarita namunasi">
            <g stroke="var(--line)" strokeWidth="10" fill="none">
              <path d="M0 70h320M0 160h320M90 0v220M230 0v220" />
            </g>
            <g stroke="var(--line)" strokeWidth="4" fill="none"><path d="M0 120 C80 100 160 140 320 110" /></g>
            <circle cx="160" cy="112" r="26" fill="var(--teal)" opacity="0.15" />
            <path d="M160 82c-10 0-17 7-17 17 0 13 17 27 17 27s17-14 17-27c0-10-7-17-17-17z" fill="var(--teal)" />
            <circle cx="160" cy="99" r="6" fill="var(--surface)" />
          </svg>
          <div className="row small"><Icon name="pin" size={16} /><span className="mono">{clinic.lat.toFixed(3)}, {clinic.lng.toFixed(3)}</span></div>
          <p className="hint">Ishlab chiqishda Yandex Maps yoki Google Maps SDK ulanadi; nuqtani surib aniqlashtirish mumkin boʻladi.</p>
        </div>
      </Card>
      {toast.node}
    </div>
  );
}
