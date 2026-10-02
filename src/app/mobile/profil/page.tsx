"use client";

import { useRouter } from "next/navigation";
import { Icon } from "@/components/Icon";
import { initials } from "@/lib/format";
import { patient, useStore } from "../store";
import { AppBar, MenuLink } from "../ui";

export default function Page() {
  const router = useRouter();
  const { s, set, reset } = useStore();
  const toggle = (k: "largeFont" | "notifications" | "consentDoctor") => set((x) => ({ ...x, [k]: !x[k] }));
  return (
    <div className="m-stack">
      <AppBar title="Profil" />
      <div className="m-card">
        <div className="m-row">
          <span className="avatar lg">{initials(patient.fullName)}</span>
          <span className="m-grow"><b style={{ fontSize: 18 }}>{patient.fullName}</b><small>JSHSHIR {patient.pinfl}</small><small>{patient.phone}</small></span>
        </div>
        <span className="m-badge ok" style={{ justifySelf: "start" }}><Icon name="shield" size={13} />OneID orqali tasdiqlangan</span>
      </div>

      <span className="m-label">Sogʻligʻim</span>
      <MenuLink href="/mobile/karta" icon="file" title="Tibbiy karta" sub="Tashxislar, allergiya, tahlillar" />
      <MenuLink href="/mobile/sorovnoma" icon="thermo" title="Holat soʻrovnomasi" sub="Kunlik ogʻriq, harorat, chok" />
      <MenuLink href="/mobile/bilaguzuk" icon="activity" title="Bilaguzuk" sub={s.device.connected ? `${s.device.name} · ulangan` : "Ulanmagan"} />
      <MenuLink href="/mobile/chat" icon="chat" title="Shifokor bilan chat" />

      <span className="m-label">Xizmatlar</span>
      <MenuLink href="/mobile/shifokorlar" icon="search" title="Shifokor qidirish" />
      <MenuLink href="/mobile/reels" icon="video" title="Reels" sub="Shifokorlardan foydali videolar" />
      <MenuLink href="/mobile/baholash" icon="star" title="Baholash" />

      <span className="m-label">Hisob</span>
      <MenuLink href="/mobile/manzillar" icon="pin" title="Manzillar" sub={`${s.addresses.length} ta manzil`} />
      <MenuLink href="/mobile/yaqinlar" icon="users" title="Yaqinlar" sub={`${s.family.length} kishi`} />

      <span className="m-label">Sozlamalar</span>
      <div className="m-card">
        <div className="m-row"><span className="m-grow"><b>Katta shrift</b><small>Keksalar uchun oddiy va yirik interfeys</small></span><button role="switch" aria-checked={s.largeFont} className="m-switch" onClick={() => toggle("largeFont")} aria-label="Katta shrift" /></div>
        <div className="m-row"><span className="m-grow"><b>Bildirishnomalar</b><small>Dori eslatmasi va navbat</small></span><button role="switch" aria-checked={s.notifications} className="m-switch" onClick={() => toggle("notifications")} aria-label="Bildirishnomalar" /></div>
        <div className="m-row"><span className="m-grow"><b>Shifokorga ruxsat</b><small>{s.consentDoctor ? "Shifokoringiz maʼlumotlaringizni koʻradi" : "Ruxsat qaytarib olingan"}</small></span><button role="switch" aria-checked={s.consentDoctor} className="m-switch" onClick={() => toggle("consentDoctor")} aria-label="Shifokorga ruxsat" /></div>
      </div>
      {!s.consentDoctor && <div className="m-warn"><Icon name="lock" size={16} />Shifokor endi kartangizni ocha olmaydi — nazorat va signallar toʻxtaydi.</div>}

      <button className="m-btn ghost block" onClick={() => { set((x) => ({ ...x, loggedIn: false })); router.replace("/mobile/kirish"); }}><Icon name="logout" size={18} />Chiqish</button>
      <button className="m-btn ghost block" onClick={() => reset()} style={{ fontSize: 13 }}>Demo maʼlumotlarni tiklash</button>
      <p className="m-muted" style={{ textAlign: "center", fontSize: 12 }}>Tez yordam: 103 · MEDIS +998 (97) 797 79 67</p>
    </div>
  );
}
