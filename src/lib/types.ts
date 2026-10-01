// TZ 9-boʻlim: maʼlumotlar modeli. Backend shu turlar asosida API qaytaradi.

export type Role = "bemor" | "shifokor" | "klinika" | "apteka" | "kuryer" | "reklama" | "admin";

export type ApprovalStatus = "tekshirilmoqda" | "tasdiqlangan" | "rad_etilgan";

export interface User {
  id: string;
  phone: string;
  role: Role;
  lang: "uz" | "uz-cyrl" | "ru";
  status: "faol" | "bloklangan";
  createdAt: string;
}

export interface Address {
  id: string;
  patientId: string;
  lat: number;
  lng: number;
  street: string;
  house: string;
  apartment?: string;
  landmark?: string;
  primary: boolean;
}

export interface Patient {
  id: string;
  userId: string;
  pinfl: string; // JSHSHIR
  fullName: string;
  birthDate: string;
  gender: "erkak" | "ayol";
  bloodGroup: string;
  allergies: string[];
  diagnoses: string[];
  medIdConsent: boolean;
  phone: string;
  address: Address;
}

export interface Clinic {
  id: string;
  name: string;
  type: "davlat" | "xususiy";
  address: string;
  lat: number;
  lng: number;
  workHours: string;
  services: string[];
  license: string;
  proUntil?: string;
  approval: ApprovalStatus;
}

export interface Doctor {
  id: string;
  userId: string;
  fullName: string;
  specialty: string;
  licenseNo: string;
  approval: ApprovalStatus;
  experienceYears: number;
  clinicIds: string[];
  premiumUntil?: string;
  rating: number;
  reviews: number;
  price: number;
  education: string;
  phone: string;
  slotMinutes: number;
  schedule: { day: string; from: string; to: string }[];
}

export interface Drug {
  mnn: string; // xalqaro nom
  form: string;
  prescriptionOnly: boolean;
}

export interface PrescriptionItem {
  id: string;
  mnn: string;
  dose: string;
  times: string[]; // "08:00"
  days: number;
  note?: string;
}

export interface Prescription {
  id: string;
  doctorId: string;
  patientId: string;
  date: string;
  status: "faol" | "yakunlangan" | "ishlatilgan";
  dmedId?: string;
  items: PrescriptionItem[];
}

export interface DoseLog {
  itemId: string;
  scheduledAt: string;
  status: "ichildi" | "otkazildi";
}

export interface Thresholds {
  tempMax: number;
  pulseMin: number;
  pulseMax: number;
  spo2Min: number;
  painMax: number;
}

export interface MonitoringPlan {
  id: string;
  patientId: string;
  doctorId: string;
  surgery: string;
  startDate: string;
  days: 7 | 14 | 30;
  thresholds: Thresholds;
  active: boolean;
}

export interface VitalReading {
  patientId: string;
  time: string;
  pulse: number;
  temp: number;
  spo2: number;
  pressure: string;
  source: "bilaguzuk" | "health_connect" | "healthkit" | "qolda";
}

export interface Survey {
  patientId: string;
  date: string;
  pain: number;
  temp: number;
  wound: "yaxshi" | "qizargan" | "suyuqlik_bor";
  photo?: boolean;
}

export type AlertLevel = "diqqat" | "xavf";

export interface Alert {
  id: string;
  planId: string;
  patientId: string;
  level: AlertLevel;
  reason: string;
  time: string;
  status: "yangi" | "korildi" | "hal_qilindi";
  seenBy?: string;
}

export interface SosEvent {
  id: string;
  patientId: string;
  source: "tugma" | "bilaguzuk" | "shifokor";
  time: string;
  lat: number;
  lng: number;
  address: string;
  status: "bekor_qilindi" | "yuborildi" | "yetib_keldi";
  ambulanceReply?: string;
  seenBy: string[];
  durationSec?: number;
}

export type AppointmentStatus = "kutilmoqda" | "keldi" | "qabul_qilindi" | "kelmadi";

export interface Appointment {
  id: string;
  clinicId: string;
  doctorId: string;
  patientId: string;
  time: string;
  status: AppointmentStatus;
  reason: string;
}

export interface Pharmacy {
  id: string;
  name: string;
  license: string;
  address: string;
  workHours: string;
  approval: ApprovalStatus;
}

export interface PharmacyStock {
  pharmacyId: string;
  mnn: string;
  tradeName: string;
  price: number;
  qty: number;
}

export type OrderStatus = "yangi" | "qabul_qilindi" | "yigildi" | "yolda" | "yetkazildi" | "rad_etildi";

export interface Order {
  id: string;
  patientId: string;
  pharmacyId: string;
  courierId?: string;
  prescriptionId?: string;
  items: { mnn: string; tradeName: string; qty: number; price: number; prescriptionOnly: boolean }[];
  total: number;
  deliveryFee: number;
  status: OrderStatus;
  createdAt: string;
  payment: "onlayn" | "naqd";
}

export interface Courier {
  id: string;
  userId: string;
  fullName: string;
  transport: "piyoda" | "velosiped" | "skuter" | "avtomobil";
  approval: ApprovalStatus;
  phone: string;
}

export interface Payment {
  id: string;
  type: "yetkazish" | "nazorat" | "premium" | "pro" | "reklama";
  amount: number;
  provider: "Click" | "Payme" | "Uzcard" | "Humo" | "Naqd";
  status: "toʻlandi" | "kutilmoqda" | "qaytarildi";
  platformShare: number;
  date: string;
  payer: string;
}

export interface Reel {
  id: string;
  doctorId: string;
  title: string;
  tags: string[];
  moderation: "kutilmoqda" | "tasdiqlangan" | "rad_etilgan";
  views: number;
  likes: number;
  durationSec: number;
  date: string;
  complaints: number;
}

export type AdCategory = "klinika" | "apteka" | "sport" | "sugʻurta";

export interface Ad {
  id: string;
  advertiser: string;
  title: string;
  category: AdCategory;
  budget: number;
  spent: number;
  views: number;
  clicks: number;
  moderation: "kutilmoqda" | "tasdiqlangan" | "rad_etilgan";
  status: "faol" | "toʻxtatilgan" | "yakunlangan";
  media: "video" | "rasm";
}

export interface AuditLog {
  id: string;
  who: string;
  action: string;
  object: string;
  time: string;
  ip: string;
}

export interface Pricing {
  deliveryMin: number;
  deliveryMax: number;
  serviceFee: number;
  deliveryShare: number; // %
  monitoring: number;
  monitoringShare: number; // %
  doctorPremium: number;
  clinicPro: number;
  adCpm: number;
}
