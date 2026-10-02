"use client";

import { Card } from "@/components/ui";
import { useToast } from "@/components/useToast";
import type { Doctor } from "@/lib/types";

export function ProfileForm({ doctor }: { doctor: Doctor }) {
  const toast = useToast();
  return (
    <Card title="Maʼlumotlarni tahrirlash">
      <form
        className="stack"
        onSubmit={(e) => {
          e.preventDefault();
          toast.show("Profil saqlandi");
        }}
      >
        <div className="form-grid">
          <div className="field"><label htmlFor="pf-name">F.I.Sh. <span className="muted xs">· OneID</span></label><input id="pf-name" defaultValue={doctor.fullName} readOnly /></div>
          <div className="field"><label htmlFor="pf-spec">Mutaxassislik <span className="muted xs">· MED-ID</span></label><input id="pf-spec" defaultValue={doctor.specialty} readOnly /></div>
          <div className="field"><label htmlFor="pf-exp">Tajriba (yil)</label><input id="pf-exp" type="number" defaultValue={doctor.experienceYears} /></div>
          <div className="field"><label htmlFor="pf-price">Qabul narxi, soʻm</label><input id="pf-price" type="number" step={1000} defaultValue={doctor.price} /></div>
          <div className="field full"><label htmlFor="pf-edu">Taʼlim <span className="muted xs">· MED-ID</span></label><input id="pf-edu" defaultValue={doctor.education} readOnly /></div>
          <div className="field full">
            <label htmlFor="pf-hours">Ish vaqti</label>
            <input id="pf-hours" defaultValue={doctor.schedule.length ? `${doctor.schedule[0].day}–${doctor.schedule[doctor.schedule.length - 1].day}, ${doctor.schedule[0].from}–${doctor.schedule[0].to}` : ""} />
          </div>
          <div className="field full"><label htmlFor="pf-cert">Sertifikatlar (PDF, JPG)</label><input id="pf-cert" type="file" multiple accept=".pdf,image/*" /></div>
          <div className="field full"><label htmlFor="pf-photo">Rasm</label><input id="pf-photo" type="file" accept="image/*" /></div>
        </div>
        <button className="btn">Saqlash</button>
      </form>
      {toast.node}
    </Card>
  );
}
