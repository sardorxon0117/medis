"use client";

import { createContext, useCallback, useContext, useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import { appointments as seedAppointments, patients, prescriptions, surveys as seedSurveys } from "@/lib/mock-data";

// Bemor ilovasi holati. Backend ulanguncha brauzerda (localStorage) saqlanadi.

export const PATIENT_ID = "p1";
export const patient = patients.find((p) => p.id === PATIENT_ID)!;
export const activeRx = prescriptions.find((r) => r.patientId === PATIENT_ID && r.status === "faol")!;

export type DoseMark = "ichildi" | "otkazildi";

export interface MOrder {
  id: string;
  pharmacyId: string;
  pharmacyName: string;
  items: { mnn: string; tradeName: string; price: number; qty: number }[];
  total: number;
  delivery: number;
  service: number;
  payment: string;
  createdAt: number;
  handedOver: boolean;
  rating?: number;
}

export interface MAppointment {
  id: string;
  doctorId: string;
  clinicId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  reason: string;
  status: "kutilmoqda" | "bekor" | "yakunlandi";
  rating?: number;
}

export interface MAddress { id: string; label: string; street: string; house: string; apt: string; landmark: string; lat: number; lng: number; primary: boolean }
export interface MFamily { id: string; name: string; relation: string; phone: string; seeStatus: boolean; getSos: boolean }
export interface MMessage { from: "me" | "doc"; text: string; at: number }
export interface MSurvey { date: string; pain: number; temp: number; wound: "yaxshi" | "qizargan" | "suyuqlik_bor"; photo?: boolean }

export interface MState {
  v: 1;
  loggedIn: boolean;
  consentDoctor: boolean;
  largeFont: boolean;
  notifications: boolean;
  doses: Record<string, DoseMark>; // `${sana}|${itemId}|${vaqt}`
  surveys: MSurvey[];
  orders: MOrder[];
  appointments: MAppointment[];
  addresses: MAddress[];
  family: MFamily[];
  chat: MMessage[];
  likes: string[];
  saved: string[];
  device: { connected: boolean; source: "Health Connect" | "Apple HealthKit" | "Bluetooth" | null; name: string };
  sosLog: { at: number; source: "tugma" | "bilaguzuk"; cancelled: boolean }[];
}

const KEY = "medis-mobile-v1";

const initial: MState = {
  v: 1,
  loggedIn: false,
  consentDoctor: true,
  largeFont: false,
  notifications: true,
  doses: {},
  surveys: seedSurveys.filter((s) => s.patientId === PATIENT_ID).map(({ date, pain, temp, wound, photo }) => ({ date, pain, temp, wound, photo })),
  orders: [],
  appointments: seedAppointments
    .filter((a) => a.patientId === PATIENT_ID)
    .map((a): MAppointment => ({ id: a.id, doctorId: a.doctorId, clinicId: a.clinicId, date: a.time.slice(0, 10), time: a.time.slice(11, 16), reason: a.reason, status: "kutilmoqda" }))
    .concat([{ id: "past-1", doctorId: "d1", clinicId: "c1", date: "2026-09-30", time: "10:00", reason: "Operatsiyadan keyingi koʻrik", status: "yakunlandi" as const }]),
  addresses: [
    { id: "home", label: "Uy", street: patient.address.street, house: patient.address.house, apt: patient.address.apartment ?? "", landmark: patient.address.landmark ?? "", lat: patient.address.lat, lng: patient.address.lng, primary: true },
    { id: "work", label: "Ish", street: "Bunyodkor shoh koʻch.", house: "41", apt: "", landmark: "Chilonzor metrosi", lat: 41.281, lng: 69.204, primary: false },
  ],
  family: [{ id: "f1", name: "Dilshod Qodirov", relation: "Oʻgʻli", phone: "+998 90 555 11 22", seeStatus: true, getSos: true }],
  chat: [
    { from: "doc", text: "Assalomu alaykum, Rustam aka. Bugun haroratingiz biroz koʻtarilibdi. Paracetamolni jadval boʻyicha iching va kechqurun yana oʻlchang.", at: 0 },
  ],
  likes: [],
  saved: [],
  device: { connected: true, source: "Health Connect", name: "MEDIS Band" },
  sosLog: [],
};

function load(): MState {
  if (typeof window === "undefined") return initial;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return initial;
    const data = JSON.parse(raw) as MState;
    return data.v === 1 ? { ...initial, ...data } : initial;
  } catch {
    return initial;
  }
}

interface Ctx {
  s: MState;
  set: (fn: (s: MState) => MState) => void;
  reset: () => void;
}

const StoreCtx = createContext<Ctx | null>(null);

export function MobileStore({ children }: { children: ReactNode }) {
  // birinchi render skeleton bilan qoplanadi (MobileShell), shuning uchun server va brauzer holati farqi koʻrinmaydi
  const [s, setS] = useState<MState>(load);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(s));
    } catch {
      /* saqlash bloklangan boʻlsa ham ilova ishlayveradi */
    }
  }, [s]);

  const set = useCallback((fn: (s: MState) => MState) => setS(fn), []);
  const reset = useCallback(() => setS({ ...initial, loggedIn: true }), []);
  return <StoreCtx.Provider value={{ s, set, reset }}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error("useStore MobileStore ichida ishlatilishi kerak");
  return ctx;
}

// Joriy vaqt (30 soniyada yangilanadi) — render ichida Date.now() chaqirmaslik uchun
const subscribeClock = (cb: () => void) => {
  const t = setInterval(cb, 1000);
  return () => clearInterval(t);
};
const clockSnapshot = () => Math.floor(Date.now() / 1000) * 1000;
export function useNow() {
  return useSyncExternalStore(subscribeClock, clockSnapshot, () => 0);
}

export function todayKey(now: number) {
  const d = new Date(now || Date.UTC(2026, 9, 2));
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function hhmm(now: number) {
  const d = new Date(now);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export function todaysDoses(now: number, marks: Record<string, DoseMark>) {
  const day = todayKey(now);
  const cur = hhmm(now);
  return activeRx.items
    .flatMap((it) => it.times.map((t) => ({ key: `${day}|${it.id}|${t}`, time: t, item: it })))
    .sort((a, b) => a.time.localeCompare(b.time))
    .map((d) => ({ ...d, mark: marks[d.key] as DoseMark | undefined, due: d.time <= cur }));
}
