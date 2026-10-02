"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/Icon";
import { Watch } from "@/components/Watch";
import { useStore, type MState } from "../store";
import { AppBar } from "../ui";

const SOURCES: { k: NonNullable<MState["device"]["source"]>; d: string }[] = [
  { k: "Health Connect", d: "Android soat va bilaguzuklar (Samsung, Xiaomi, Huawei…)" },
  { k: "Apple HealthKit", d: "Apple Watch va iPhone" },
  { k: "Bluetooth", d: "MEDIS bilaguzugi — toʻgʻridan-toʻgʻri ulanish" },
];

export default function Page() {
  const { s, set } = useStore();
  const [pairing, setPairing] = useState<MState["device"]["source"]>(null);

  useEffect(() => {
    if (!pairing) return;
    const t = setTimeout(() => {
      set((x) => ({ ...x, device: { connected: true, source: pairing, name: pairing === "Bluetooth" ? "MEDIS Band" : `${pairing} qurilmasi` } }));
      setPairing(null);
    }, 1800);
    return () => clearTimeout(t);
  }, [pairing, set]);

  return (
    <div className="m-stack">
      <AppBar title="Bilaguzuk" back="/mobile" />
      {s.device.connected ? (
        <>
          <div style={{ width: 230, margin: "0 auto" }}><Watch /></div>
          <div className="m-card">
            <div className="m-row"><span className="m-ic"><Icon name="check" size={20} /></span><span className="m-grow"><b>{s.device.name}</b><small>{s.device.source} orqali ulangan · har daqiqada sinxron</small></span></div>
            <div className="m-note"><Icon name="shield" size={16} />Chegaradan oshsa — shifokoringizga signal. SpO₂ 90% dan past yoki yiqilish boʻlsa — 10 soniyalik taymerdan keyin avtomatik SOS.</div>
            <button className="m-btn ghost block" onClick={() => set((x) => ({ ...x, device: { connected: false, source: null, name: "" } }))}>Uzish</button>
          </div>
        </>
      ) : (
        <>
          <div className="m-note"><Icon name="activity" size={16} />Puls, harorat, SpO₂, qadam va uyquni avtomatik yuborish uchun qurilmani ulang.</div>
          {SOURCES.map((x) => (
            <button key={x.k} className="m-menu" style={{ textAlign: "left", cursor: "pointer", font: "inherit" }} onClick={() => setPairing(x.k)} disabled={!!pairing}>
              <span className="m-ic"><Icon name={x.k === "Bluetooth" ? "bluetooth" : "activity"} size={20} /></span>
              <span className="m-grow"><b>{x.k}</b><small>{pairing === x.k ? "Ulanmoqda…" : x.d}</small></span>
              {pairing === x.k ? <span className="m-spinner" style={{ width: 22, height: 22, borderWidth: 3, margin: 0 }} /> : <Icon name="chevron" size={18} className="m-chev" />}
            </button>
          ))}
        </>
      )}
      <div className="m-card">
        <b>MEDIS bilaguzugi</b>
        <span className="m-muted" style={{ fontSize: 14 }}>Aqlli soat ishlab chiqaruvchisi bilan hamkorlikda chiqarilgan “MEDIS × hamkor” modeli — ilovamizga moslab yaratilgan, qutidan chiqarib taqsangiz bas. Klinikangiz yoki MEDIS orqali buyurtma qiling.</span>
      </div>
    </div>
  );
}
