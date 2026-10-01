// Maʼlumotga kirish qatlami. Hozir mock-data dan oʻqiydi; backend (NestJS/FastAPI) tayyor boʻlganda
// shu funksiyalar ichida fetch() ga almashtiriladi, sahifalar oʻzgarmaydi.
import * as db from "./mock-data";
import type { AlertLevel, MonitoringPlan, Patient, Thresholds, VitalReading } from "./types";

export type PatientState = "barqaror" | "diqqat" | "xavf";

export const getPatient = (id: string) => db.patients.find((p) => p.id === id);
export const getDoctor = (id: string) => db.doctors.find((d) => d.id === id);
export const getClinic = (id: string) => db.clinics.find((c) => c.id === id);
export const getPharmacy = (id: string) => db.pharmacies.find((p) => p.id === id);
export const getCourier = (id: string) => db.couriers.find((c) => c.id === id);
export const getDrug = (mnn: string) => db.drugs.find((d) => d.mnn === mnn);

export function vitalsOf(patientId: string, days = 30): VitalReading[] {
  return db.vitals.filter((v) => v.patientId === patientId).slice(-days);
}

export function latestVital(patientId: string) {
  const list = vitalsOf(patientId, 1);
  return list[list.length - 1];
}

export function planDay(plan: MonitoringPlan) {
  const start = new Date(`${plan.startDate}T00:00:00Z`).getTime();
  const today = new Date(`${db.TODAY}T00:00:00Z`).getTime();
  return Math.floor((today - start) / 86400000) + 1;
}

// Me'yor chegaralari (SH-05) boʻyicha holatni hisoblash
export function evaluate(v: VitalReading | undefined, lim: Thresholds): { state: PatientState; reasons: string[] } {
  if (!v) return { state: "barqaror", reasons: [] };
  const t1 = (n: number) => n.toFixed(1).replace(".", ",");
  const danger: string[] = [];
  const warn: string[] = [];
  if (v.temp > lim.tempMax) danger.push(`Harorat ${t1(v.temp)} °C`);
  else if (v.temp > lim.tempMax - 0.5) warn.push(`Harorat ${t1(v.temp)} °C`);
  if (v.spo2 < lim.spo2Min) danger.push(`SpO₂ ${v.spo2}%`);
  else if (v.spo2 < lim.spo2Min + 2) warn.push(`SpO₂ ${v.spo2}%`);
  if (v.pulse > lim.pulseMax || v.pulse < lim.pulseMin) danger.push(`Puls ${v.pulse}`);
  else if (v.pulse > lim.pulseMax - 15) warn.push(`Puls ${v.pulse}`);
  if (danger.length) return { state: "xavf", reasons: danger };
  if (warn.length) return { state: "diqqat", reasons: warn };
  return { state: "barqaror", reasons: [] };
}

export interface MonitoredPatient {
  patient: Patient;
  plan: MonitoringPlan;
  day: number;
  vital: VitalReading | undefined;
  state: PatientState;
  reasons: string[];
  adherence: number; // %
}

export function monitoredPatients(doctorId: string): MonitoredPatient[] {
  const order: Record<PatientState, number> = { xavf: 0, diqqat: 1, barqaror: 2 };
  return db.plans
    .filter((pl) => pl.doctorId === doctorId && pl.active)
    .map((plan) => {
      const patient = getPatient(plan.patientId)!;
      const vital = latestVital(plan.patientId);
      const { state, reasons } = evaluate(vital, plan.thresholds);
      return { patient, plan, day: planDay(plan), vital, state, reasons, adherence: adherenceOf(plan.patientId) };
    })
    .sort((a, b) => order[a.state] - order[b.state]);
}

export function prescriptionsOf(patientId: string) {
  return db.prescriptions.filter((rx) => rx.patientId === patientId);
}

export function doseLogsOf(patientId: string) {
  const itemIds = new Set(prescriptionsOf(patientId).flatMap((rx) => rx.items.map((i) => i.id)));
  return db.doseLogs.filter((l) => itemIds.has(l.itemId));
}

export function adherenceOf(patientId: string) {
  const logs = doseLogsOf(patientId);
  if (!logs.length) return 100;
  return Math.round((logs.filter((l) => l.status === "ichildi").length / logs.length) * 100);
}

export function surveysOf(patientId: string) {
  return db.surveys.filter((s) => s.patientId === patientId);
}

export function alertsOf(doctorId: string) {
  const planIds = new Set(db.plans.filter((p) => p.doctorId === doctorId).map((p) => p.id));
  return db.alerts.filter((a) => planIds.has(a.planId));
}

export const levelLabel: Record<AlertLevel, string> = { diqqat: "Diqqat", xavf: "Xavf" };
