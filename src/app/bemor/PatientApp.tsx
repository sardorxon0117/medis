"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "@/components/Icon";
import { Logo } from "@/components/Logo";
import { Watch } from "@/components/Watch";

interface Item {
  id: string;
  mnn: string;
  dose: string;
  times: string[];
  days: number;
  note: string;
}

type DoseState = "ichildi" | "otkazildi" | "kutilmoqda";
type Tab = "bugun" | "retsept" | "bilaguzuk";
type Sos = { phase: "idle" } | { phase: "count"; left: number; source: "tugma" | "bilaguzuk" } | { phase: "sent"; source: "tugma" | "bilaguzuk"; shown: number };

// demo vaqti: 14:00 dozasi "hozir", ertalabkilar ichilgan, kechqurungilar keyin
const NOW = "14:00";

export function PatientApp({
  patient, doctor, items,
}: {
  patient: { firstName: string; address: string; landmark: string; diagnosis: string; bloodGroup: string; allergies: string[] };
  doctor: string;
  items: Item[];
}) {
  const doses = items
    .flatMap((it) => it.times.map((t) => ({ key: `${it.id}-${t}`, time: t, item: it })))
    .sort((a, b) => a.time.localeCompare(b.time));

  const [tab, setTab] = useState<Tab>("bugun");
  const [state, setState] = useState<Record<string, DoseState>>(() =>
    Object.fromEntries(doses.map((d) => [d.key, d.time < NOW ? "ichildi" : "kutilmoqda"])),
  );
  const [sos, setSos] = useState<Sos>({ phase: "idle" });
  const missed = Object.values(state).filter((s) => s === "otkazildi").length;

  // SOS: 10 soniyalik bekor qilish taymeri, keyin xabarlar birin-ketin "yuboriladi"
  useEffect(() => {
    if (sos.phase === "count") {
      const t = setTimeout(() => {
        setSos(sos.left <= 1 ? { phase: "sent", source: sos.source, shown: 0 } : { ...sos, left: sos.left - 1 });
      }, 1000);
      return () => clearTimeout(t);
    }
    if (sos.phase === "sent" && sos.shown < 4) {
      const t = setTimeout(() => setSos({ ...sos, shown: sos.shown + 1 }), 550);
      return () => clearTimeout(t);
    }
  }, [sos]);

  const startSos = (source: "tugma" | "bilaguzuk") => setSos({ phase: "count", left: 10, source });
  const alert = sos.phase !== "idle" && sos.source === "bilaguzuk";
  const next = doses.find((d) => state[d.key] === "kutilmoqda");

  return (
    <div className="pa-page">
      <header className="pa-head wrap">
        <Logo />
        <div className="row"><Link href="/mobile" className="btn sm">Toʻliq ilovani ochish →</Link><Link href="/" className="btn ghost sm">← Bosh sahifa</Link></div>
      </header>

      <main className="pa-main wrap">
        <section className="pa-intro">
          <span className="eyebrow">Bemor mobil ilovasi · demo</span>
          <h1>Bemor uyda nimani koʻradi</h1>
          <p className="muted">Bu MEDIS mobil ilovasining interaktiv namunasi. Tugmalarni bosib koʻring: dori eslatmasi, retsept, bilaguzuk va SOS.</p>
          <ul className="pa-points">
            <li><Icon name="bell" size={18} /><span><b>Eslatma:</b> har qabul vaqtida. 2 marta “Oʻtkazib yubordim” bosilsa, shifokorga signal ketadi.</span></li>
            <li><Icon name="rx" size={18} /><span><b>Retsept:</b> shifokor yozgan dori, doza va vaqt — aniq va tushunarli.</span></li>
            <li><Icon name="activity" size={18} /><span><b>Bilaguzuk:</b> puls, SpO₂, harorat avtomatik shifokorga boradi.</span></li>
            <li><Icon name="siren" size={18} /><span><b>SOS:</b> 10 soniya bekor qilish imkoni, keyin 103, shifokor va yaqinlarga xabar.</span></li>
          </ul>
          <div className="pa-demo">
            <b>Demo boshqaruvi</b>
            <button className="btn danger sm" onClick={() => { setTab("bilaguzuk"); startSos("bilaguzuk"); }} disabled={sos.phase !== "idle"}>
              <Icon name="activity" size={16} />Bilaguzukdan xavf signali (SpO₂ 89%)
            </button>
            <button className="btn ghost sm" onClick={() => { setSos({ phase: "idle" }); setState(Object.fromEntries(doses.map((d) => [d.key, d.time < NOW ? "ichildi" : "kutilmoqda"]))); setTab("bugun"); }}>
              Demoni qaytadan boshlash
            </button>
          </div>
        </section>

        <div className="pa-phone" aria-label="Bemor ilovasi">
          <div className="pa-notch" />
          <div className="pa-screen">
            <div className="pa-status"><span className="mono">{NOW}</span><span className="pa-chip"><Icon name="activity" size={13} />Bilaguzuk ulangan</span></div>

            {tab === "bugun" && (
              <div className="pa-body">
                <p className="pa-hello">Assalomu alaykum, <b>{patient.firstName} aka</b></p>
                {next ? (
                  <div className="pa-next">
                    <span className="pa-label">Hozir ichish kerak · {next.time}</span>
                    <b>{next.item.mnn}</b>
                    <span>{next.item.dose}{next.item.note ? ` · ${next.item.note}` : ""}</span>
                    <div className="pa-row">
                      <button className="pa-btn ok" onClick={() => setState({ ...state, [next.key]: "ichildi" })}><Icon name="check" size={16} />Ichdim</button>
                      <button className="pa-btn" onClick={() => setState({ ...state, [next.key]: "otkazildi" })}>Oʻtkazib yubordim</button>
                    </div>
                  </div>
                ) : (
                  <div className="pa-next done"><b>Bugungi dorilar tugadi</b><span>Barakalla! Shifokoringiz natijani koʻradi.</span></div>
                )}
                {missed >= 2 && <div className="pa-warn"><Icon name="bell" size={16} />2 ta doza oʻtkazildi — shifokoringiz {doctor}ga signal yuborildi.</div>}
                <span className="pa-label">Bugungi jadval</span>
                <ul className="pa-list">
                  {doses.map((d) => (
                    <li key={d.key} className={state[d.key]}>
                      <span className="mono">{d.time}</span>
                      <span className="pa-grow">{d.item.mnn}<small>{d.item.dose}</small></span>
                      <span className="pa-st">{state[d.key] === "ichildi" ? "✓ ichildi" : state[d.key] === "otkazildi" ? "oʻtkazildi" : "kutilmoqda"}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {tab === "retsept" && (
              <div className="pa-body">
                <span className="pa-label">Elektron retsept · {doctor}</span>
                {items.map((it) => (
                  <div key={it.id} className="pa-rx">
                    <b>{it.mnn}</b>
                    <span>{it.dose} · {it.days} kun</span>
                    <div className="pa-times">{it.times.map((t) => <span key={t}>{t}</span>)}</div>
                    {it.note ? <small>{it.note}</small> : null}
                  </div>
                ))}
                <button className="pa-btn wide">Dorilarni yaqin aptekadan buyurtma qilish</button>
                <div className="pa-card small-card"><span className="pa-label">Tibbiy karta</span><span>{patient.diagnosis}</span><span>Qon guruhi: {patient.bloodGroup} · Allergiya: {patient.allergies.join(", ") || "yoʻq"}</span></div>
              </div>
            )}

            {tab === "bilaguzuk" && (
              <div className="pa-body center">
                <div className="pa-watch"><Watch alert={alert} /></div>
                <p className="pa-small">Koʻrsatkichlar har daqiqada shifokor paneliga yuboriladi. Chegaradan oshsa — shifokorga signal, kritik holatda — avtomatik SOS.</p>
              </div>
            )}

            {sos.phase === "idle" && (
              <button className="pa-sos" onClick={() => startSos("tugma")} aria-label="SOS — tez yordam chaqirish">SOS</button>
            )}

            <nav className="pa-tabs">
              {([["bugun", "home", "Bugun"], ["retsept", "rx", "Retsept"], ["bilaguzuk", "activity", "Bilaguzuk"]] as const).map(([k, ic, l]) => (
                <button key={k} aria-pressed={tab === k} onClick={() => setTab(k)}><Icon name={ic} size={20} />{l}</button>
              ))}
            </nav>

            {sos.phase === "count" && (
              <div className="pa-overlay">
                <span className="pa-label light">{sos.source === "bilaguzuk" ? "Bilaguzuk xavfni aniqladi: SpO₂ 89%" : "SOS tugmasi bosildi"}</span>
                <div className="pa-count" style={{ "--p": `${(sos.left / 10) * 100}` } as React.CSSProperties}><span>{sos.left}</span></div>
                <p>{sos.left} soniyadan keyin tez yordam chaqiriladi</p>
                <button className="pa-cancel" onClick={() => setSos({ phase: "idle" })}>Bekor qilish</button>
              </div>
            )}

            {sos.phase === "sent" && (
              <div className="pa-overlay sent">
                <span className="pa-sent-ic"><Icon name="siren" size={34} /></span>
                <b className="pa-sent-title">Yordam yoʻlda</b>
                <ul className="pa-sent-list">
                  {[
                    `103 ga yuborildi: ${patient.address} (${patient.landmark})`,
                    `Tashxis va oxirgi koʻrsatkichlar ilova qilindi`,
                    `Shifokor ${doctor} xabardor qilindi`,
                    `Yaqinlaringizga SMS yuborildi`,
                  ].slice(0, sos.shown).map((x) => <li key={x}><Icon name="check" size={16} />{x}</li>)}
                </ul>
                <a className="pa-cancel call" href="tel:103"><Icon name="phone" size={16} />103 ga qoʻngʻiroq</a>
                <button className="pa-link" onClick={() => setSos({ phase: "idle" })}>Yopish</button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
