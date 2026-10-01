"use client";

import { useState } from "react";
import { LineChart } from "@/components/Charts";
import { Icon } from "@/components/Icon";
import { Badge, Card, StateBadge } from "@/components/ui";
import { useToast } from "@/components/useToast";
import type { PatientState } from "@/lib/api";
import { date, initials, time } from "@/lib/format";
import type { DoseLog, MonitoringPlan, Patient, Prescription, PrescriptionItem, Survey, Thresholds, VitalReading } from "@/lib/types";

interface Props {
  patient: Patient & { age: number };
  plan?: MonitoringPlan & { day: number };
  state?: PatientState;
  reasons: string[];
  vitals: VitalReading[];
  surveys: Survey[];
  prescriptions: (Omit<Prescription, "items"> & { items: (PrescriptionItem & { form: string })[] })[];
  dose: { name: string; logs: DoseLog[] }[];
}

const TABS = ["Koʻrsatkichlar", "Soʻrovnoma", "Dori ichish", "Retseptlar", "Chegaralar va reja"] as const;
type Tab = (typeof TABS)[number];

const woundLabel = { yaxshi: ["ok", "Yaxshi"], qizargan: ["danger", "Qizargan"], suyuqlik_bor: ["danger", "Suyuqlik bor"] } as const;

export function PatientDetail({ patient, plan, state, reasons, vitals, surveys, prescriptions, dose }: Props) {
  const [tab, setTab] = useState<Tab>("Koʻrsatkichlar");
  const [range, setRange] = useState<7 | 30>(7);
  const [limits, setLimits] = useState<Thresholds | undefined>(plan?.thresholds);
  const [planActive, setPlanActive] = useState(plan?.active ?? false);
  const toast = useToast();
  const last = vitals[vitals.length - 1];
  const shown = vitals.slice(-range);
  const series = (key: "temp" | "pulse" | "spo2") => shown.map((v) => ({ label: date(v.time), value: v[key] }));

  return (
    <>
      <section className="card">
        <div className="spread" style={{ alignItems: "flex-start" }}>
          <div className="row" style={{ alignItems: "flex-start" }}>
            <span className="avatar lg">{initials(patient.fullName)}</span>
            <div className="stack-sm">
              <div className="row wrap-row">
                <h1 style={{ fontSize: 26 }}>{patient.fullName}</h1>
                {state ? <StateBadge state={state} /> : null}
              </div>
              <div className="muted">
                {patient.age} yosh · {patient.gender} · qon guruhi <b>{patient.bloodGroup}</b> · JSHSHIR <span className="mono">{patient.pinfl}</span>
              </div>
              {plan ? <div className="small">{plan.surgery} · <b>{plan.day}-kun</b> / {plan.days} kunlik nazorat <span className="req">SH-04</span></div> : null}
              <div className="row wrap-row small">
                <span className="muted">Allergiya:</span>
                {patient.allergies.length ? patient.allergies.map((a) => <Badge key={a} tone="danger" plain>{a}</Badge>) : <span>yoʻq</span>}
              </div>
            </div>
          </div>
          <div className="row wrap-row">
            <a className="btn ghost sm" href={`tel:${patient.phone.replace(/\s/g, "")}`}><Icon name="phone" size={16} />Qoʻngʻiroq</a>
            <button className="btn ghost sm" onClick={() => toast.show("Bemorga qabulga chaqiruv yuborildi")}><Icon name="calendar" size={16} />Qabulga chaqirish</button>
            <button className="btn danger sm" onClick={() => toast.show(`Tez yordam chaqirildi: ${patient.address.street} ${patient.address.house}`)}><Icon name="siren" size={16} />Tez yordam</button>
          </div>
        </div>
        {reasons.length ? (
          <div className="alert-row xavf" style={{ paddingBottom: 0 }}>
            <span className="bar" />
            <div className="small"><b>Chegaradan tashqari:</b> {reasons.join(", ")} · {date(last.time)}, {time(last.time)}</div>
          </div>
        ) : null}
      </section>

      <div className="vitals">
        <div className={`vital${limits && last.temp > limits.tempMax ? " alert" : ""}`}><small>Harorat</small><b>{last.temp.toFixed(1).replace(".", ",")} °C</b></div>
        <div className={`vital${limits && (last.pulse > limits.pulseMax || last.pulse < limits.pulseMin) ? " alert" : ""}`}><small>Puls</small><b>{last.pulse}</b></div>
        <div className={`vital${limits && last.spo2 < limits.spo2Min ? " alert" : ""}`}><small>SpO₂</small><b>{last.spo2}%</b></div>
        <div className="vital"><small>Bosim</small><b>{last.pressure}</b></div>
      </div>

      <div className="tabs" role="tablist">
        {TABS.map((t) => (
          <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>

      {tab === "Koʻrsatkichlar" && (
        <>
          <div className="spread">
            <span className="muted small">Manba: {last.source === "healthkit" ? "Apple HealthKit" : "Google Health Connect"} · har kuni 09:00</span>
            <div className="seg" role="group" aria-label="Davr">
              <button aria-pressed={range === 7} onClick={() => setRange(7)}>7 kun</button>
              <button aria-pressed={range === 30} onClick={() => setRange(30)}>30 kun</button>
            </div>
          </div>
          <div className="grid-2">
            <Card title="Harorat, °C"><LineChart label="Harorat" data={series("temp")} limit={limits?.tempMax} unit=" °C" decimals={1} /></Card>
            <Card title="SpO₂, %"><LineChart label="SpO2" data={series("spo2")} limit={limits?.spo2Min} limitDir="below" unit="%" /></Card>
            <Card title="Puls, zarba/daq"><LineChart label="Puls" data={series("pulse")} limit={limits?.pulseMax} /></Card>
            <Card title="Tibbiy karta" req="B-03">
              <dl className="kv">
                <dt>Tashxislar</dt><dd>{patient.diagnoses.join("; ")}</dd>
                <dt>Qon guruhi</dt><dd>{patient.bloodGroup}</dd>
                <dt>Manzil</dt><dd>{patient.address.street} {patient.address.house}{patient.address.apartment ? `, ${patient.address.apartment}-xonadon` : ""}</dd>
                <dt>Moʻljal</dt><dd>{patient.address.landmark}</dd>
                <dt>Telefon</dt><dd className="mono">{patient.phone}</dd>
                <dt>MED-ID rozilik</dt><dd>{patient.medIdConsent ? "Berilgan" : "Yoʻq"}</dd>
              </dl>
            </Card>
          </div>
        </>
      )}

      {tab === "Soʻrovnoma" && (
        <Card title="Kunlik holat soʻrovnomasi" req="B-06" flush>
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Sana</th><th className="num">Ogʻriq (0–10)</th><th className="num">Harorat</th><th>Chok holati</th><th>Rasm</th></tr></thead>
              <tbody>
                {[...surveys].reverse().map((s) => (
                  <tr key={s.date}>
                    <td>{date(s.date)}</td>
                    <td className="num mono" style={{ color: limits && s.pain > limits.painMax ? "var(--danger)" : undefined }}>{s.pain}</td>
                    <td className="num mono">{s.temp.toFixed(1).replace(".", ",")} °C</td>
                    <td><Badge tone={woundLabel[s.wound][0]}>{woundLabel[s.wound][1]}</Badge></td>
                    <td>{s.photo ? <button className="btn ghost xs" onClick={() => toast.show("Chok rasmi himoyalangan saqlovdan yuklanmoqda…")}><Icon name="eye" size={14} />Koʻrish</button> : <span className="muted">—</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {tab === "Dori ichish" && (
        <Card title="Dori ichish tarixi (oxirgi 4 kun)" req="B-05">
          <div className="stack">
            {dose.length ? dose.map((d) => {
              const taken = d.logs.filter((l) => l.status === "ichildi").length;
              return (
                <div className="dose-grid" key={d.name}>
                  <div className="spread small"><b>{d.name}</b><span className="muted">{taken}/{d.logs.length} ichildi</span></div>
                  <div className="cells">
                    {d.logs.map((l) => (
                      <span key={l.scheduledAt} className={`cell${l.status === "otkazildi" ? " miss" : ""}`} title={`${date(l.scheduledAt)} ${time(l.scheduledAt)} — ${l.status === "ichildi" ? "ichildi" : "oʻtkazildi"}`} />
                    ))}
                  </div>
                </div>
              );
            }) : <div className="empty">Faol retsept yoʻq</div>}
            <div className="row small muted"><span className="dose-grid"><span className="cell" style={{ display: "inline-block" }} /></span>ichildi <span className="dose-grid"><span className="cell miss" style={{ display: "inline-block" }} /></span>oʻtkazildi · 2 marta ketma-ket oʻtkazilsa signal keladi</div>
          </div>
        </Card>
      )}

      {tab === "Retseptlar" && (
        <div className="stack">
          {prescriptions.map((rx) => (
            <Card key={rx.id} title={<>Retsept <span className="mono">{rx.id}</span></>} action={<Badge tone={rx.status === "faol" ? "ok" : ""}>{rx.status === "faol" ? "Faol" : "Yakunlangan"} · {date(rx.date)}</Badge>}>
              <div className="table-wrap">
                <table className="table">
                  <thead><tr><th>Dori (MNN)</th><th>Doza</th><th>Vaqtlar</th><th className="num">Kun</th><th>Izoh</th></tr></thead>
                  <tbody>
                    {rx.items.map((i) => (
                      <tr key={i.id}>
                        <td><b>{i.mnn}</b><div className="xs muted">{i.form}</div></td>
                        <td>{i.dose}</td>
                        <td className="mono small">{i.times.join(", ")}</td>
                        <td className="num">{i.days}</td>
                        <td className="muted small">{i.note ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab === "Chegaralar va reja" && (
        <div className="grid-2">
          {limits ? (
            <Card title="Meʼyor chegaralari" req="SH-05">
              <form
                className="stack"
                onSubmit={(e) => {
                  e.preventDefault();
                  toast.show("Chegaralar saqlandi — yangi oʻlchovlar shu boʻyicha baholanadi");
                }}
              >
                <div className="form-grid">
                  {([
                    ["tempMax", "Harorat yuqori, °C", 0.1],
                    ["spo2Min", "SpO₂ quyi, %", 1],
                    ["pulseMin", "Puls quyi", 1],
                    ["pulseMax", "Puls yuqori", 1],
                    ["painMax", "Ogʻriq yuqori (0–10)", 1],
                  ] as const).map(([key, label, step]) => (
                    <div className="field" key={key}>
                      <label htmlFor={key}>{label}</label>
                      <input id={key} type="number" step={step} value={limits[key]} onChange={(e) => setLimits({ ...limits, [key]: Number(e.target.value) })} />
                    </div>
                  ))}
                </div>
                <p className="hint">Chegaradan oshsa: shifokorga push + SMS, 30 soniya ichida.</p>
                <button className="btn">Saqlash</button>
              </form>
            </Card>
          ) : null}
          <Card title="Nazorat rejasi" req="SH-07">
            {plan ? (
              <div className="stack">
                <dl className="kv">
                  <dt>Operatsiya</dt><dd>{plan.surgery}</dd>
                  <dt>Boshlangan</dt><dd>{date(plan.startDate)}</dd>
                  <dt>Muddat</dt><dd>{plan.days} kun</dd>
                  <dt>Holat</dt><dd>{planActive ? <Badge tone="ok">Faol</Badge> : <Badge>Tugatilgan</Badge>}</dd>
                </dl>
                <div className="progress" aria-label="Reja bajarilishi"><span style={{ width: `${Math.min(100, (plan.day / plan.days) * 100)}%` }} /></div>
                <div className="row wrap-row">
                  <button className="btn ghost sm" onClick={() => toast.show("Reja 7 kunga uzaytirildi")} disabled={!planActive}>+7 kun uzaytirish</button>
                  <button className="btn ghost sm" onClick={() => { setPlanActive(false); toast.show("Nazorat rejasi tugatildi"); }} disabled={!planActive}>Rejani tugatish</button>
                </div>
              </div>
            ) : (
              <div className="stack">
                <p className="muted">Bemor hozir nazoratda emas.</p>
                <div className="seg" role="group" aria-label="Muddat">
                  {[7, 14, 30].map((d) => <button key={d} aria-pressed={d === 14}>{d} kun</button>)}
                </div>
                <button className="btn" onClick={() => toast.show("Bemor 14 kunlik nazoratga olindi")}>Nazoratga olish</button>
              </div>
            )}
          </Card>
        </div>
      )}
      {toast.node}
    </>
  );
}
