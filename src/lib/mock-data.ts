// Vaqtinchalik demo maʼlumotlar. Backend tayyor boʻlganda src/lib/api.ts shu manbani almashtiradi.
import type {
  Ad, Alert, Appointment, AuditLog, Clinic, Courier, Doctor, DoseLog, Drug, MonitoringPlan,
  Order, Patient, Payment, Pharmacy, PharmacyStock, Prescription, Pricing, Reel, SosEvent,
  Survey, VitalReading,
} from "./types";

export const TODAY = "2026-10-02";

// ---------- klinikalar va shifokorlar ----------

export const clinics: Clinic[] = [
  {
    id: "c1", name: "Toshkent shahar 1-son klinik shifoxonasi", type: "davlat",
    address: "Toshkent, Olmazor t., Qorasaroy koʻch. 1", lat: 41.336, lng: 69.215,
    workHours: "08:00–18:00", services: ["Jarrohlik", "Travmatologiya", "Kardiologiya", "Laboratoriya"],
    license: "L-000412", approval: "tasdiqlangan",
  },
  {
    id: "c2", name: "Shifo Med klinikasi", type: "xususiy",
    address: "Toshkent, Yunusobod t., Amir Temur koʻch. 108", lat: 41.366, lng: 69.288,
    workHours: "09:00–20:00", services: ["Jarrohlik", "Ginekologiya", "UZI", "Fizioterapiya"],
    license: "L-002981", proUntil: "2026-12-01", approval: "tasdiqlangan",
  },
  {
    id: "c3", name: "MedLine diagnostika markazi", type: "xususiy",
    address: "Toshkent, Chilonzor t., Bunyodkor shoh koʻch. 12", lat: 41.285, lng: 69.204,
    workHours: "08:00–21:00", services: ["MRT", "KT", "Laboratoriya"],
    license: "L-003310", approval: "tekshirilmoqda",
  },
];

const week = (from: string, to: string) =>
  ["Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma"].map((day) => ({ day, from, to }));

export const doctors: Doctor[] = [
  {
    id: "d1", userId: "u-d1", fullName: "Aziza Karimova", specialty: "Umumiy jarroh",
    licenseNo: "SH-118204", approval: "tasdiqlangan", experienceYears: 12, clinicIds: ["c1", "c2"],
    premiumUntil: "2026-11-14", rating: 4.9, reviews: 312, price: 150000,
    education: "Toshkent tibbiyot akademiyasi, 2012", phone: "+998 90 123 45 67", slotMinutes: 20,
    schedule: week("09:00", "15:00"),
  },
  {
    id: "d2", userId: "u-d2", fullName: "Bobur Rahimov", specialty: "Travmatolog-ortoped",
    licenseNo: "SH-120551", approval: "tasdiqlangan", experienceYears: 9, clinicIds: ["c1"],
    rating: 4.7, reviews: 188, price: 120000, education: "Samarqand davlat tibbiyot universiteti, 2015",
    phone: "+998 93 555 12 00", slotMinutes: 30, schedule: week("08:00", "14:00"),
  },
  {
    id: "d3", userId: "u-d3", fullName: "Nodira Usmonova", specialty: "Ginekolog",
    licenseNo: "SH-131904", approval: "tasdiqlangan", experienceYears: 15, clinicIds: ["c2"],
    rating: 4.8, reviews: 401, price: 180000, education: "Toshkent pediatriya tibbiyot instituti, 2009",
    phone: "+998 97 410 22 33", slotMinutes: 30, schedule: week("10:00", "18:00"),
  },
  {
    id: "d4", userId: "u-d4", fullName: "Jasur Toshmatov", specialty: "Kardiolog",
    licenseNo: "SH-140023", approval: "tasdiqlangan", experienceYears: 7, clinicIds: ["c2"],
    rating: 4.6, reviews: 97, price: 140000, education: "Toshkent tibbiyot akademiyasi, 2017",
    phone: "+998 99 870 45 10", slotMinutes: 20, schedule: week("09:00", "17:00"),
  },
  {
    id: "d5", userId: "u-d5", fullName: "Sardor Aliyev", specialty: "Urolog",
    licenseNo: "SH-152117", approval: "tekshirilmoqda", experienceYears: 5, clinicIds: ["c2"],
    rating: 0, reviews: 0, price: 130000, education: "Andijon davlat tibbiyot instituti, 2019",
    phone: "+998 91 300 77 88", slotMinutes: 20, schedule: week("09:00", "13:00"),
  },
  {
    id: "d6", userId: "u-d6", fullName: "Malika Yoqubova", specialty: "Nevrolog",
    licenseNo: "SH-153002", approval: "tekshirilmoqda", experienceYears: 11, clinicIds: [],
    rating: 0, reviews: 0, price: 160000, education: "Buxoro davlat tibbiyot instituti, 2013",
    phone: "+998 94 222 10 01", slotMinutes: 30, schedule: [],
  },
];

// ---------- bemorlar ----------

const addr = (id: string, street: string, house: string, apt: string, landmark: string, lat: number, lng: number) => ({
  id: `a-${id}`, patientId: id, lat, lng, street, house, apartment: apt, landmark, primary: true,
});

export const patients: Patient[] = [
  {
    id: "p1", userId: "u-p1", pinfl: "31204785610023", fullName: "Rustam Qodirov", birthDate: "1968-04-12",
    gender: "erkak", bloodGroup: "A(II) Rh+", allergies: ["Penitsillin"], diagnoses: ["Oʻtkir appenditsit"],
    medIdConsent: true, phone: "+998 90 311 22 44",
    address: addr("p1", "Qatortol koʻch.", "14", "37", "Chilonzor bozori yonida", 41.293, 69.212),
  },
  {
    id: "p2", userId: "u-p2", pinfl: "42506891230011", fullName: "Dilfuza Ergasheva", birthDate: "1979-09-03",
    gender: "ayol", bloodGroup: "O(I) Rh+", allergies: [], diagnoses: ["Xolesistit, laparoskopik xolesistektomiya"],
    medIdConsent: true, phone: "+998 93 402 18 90",
    address: addr("p2", "Bodomzor yoʻli", "5A", "12", "Bodomzor metrosi", 41.338, 69.284),
  },
  {
    id: "p3", userId: "u-p3", pinfl: "31511654780045", fullName: "Anvar Saidov", birthDate: "1955-01-21",
    gender: "erkak", bloodGroup: "B(III) Rh−", allergies: ["Aspirin", "Yod"], diagnoses: ["Chov churrasi", "Gipertoniya II"],
    medIdConsent: true, phone: "+998 97 118 60 70",
    address: addr("p3", "Navoiy koʻch.", "48", "3", "Eski shahar, choyxona roʻparasi", 41.321, 69.241),
  },
  {
    id: "p4", userId: "u-p4", pinfl: "41808992340067", fullName: "Gulnora Mirzayeva", birthDate: "1988-07-30",
    gender: "ayol", bloodGroup: "A(II) Rh−", allergies: [], diagnoses: ["Tizza boʻgʻimi artroskopiyasi"],
    medIdConsent: true, phone: "+998 99 640 33 21",
    address: addr("p4", "Mustaqillik shoh koʻch.", "88", "61", "Hamid Olimjon metrosi", 41.317, 69.296),
  },
  {
    id: "p5", userId: "u-p5", pinfl: "30907751120098", fullName: "Shuhrat Nazarov", birthDate: "1972-11-02",
    gender: "erkak", bloodGroup: "AB(IV) Rh+", allergies: ["Sefalosporinlar"], diagnoses: ["Oshqozon yarasi perforatsiyasi"],
    medIdConsent: true, phone: "+998 91 777 45 12",
    address: addr("p5", "Farhod koʻch.", "3", "", "Xususiy uy, yashil darvoza", 41.272, 69.188),
  },
  {
    id: "p6", userId: "u-p6", pinfl: "42203004560013", fullName: "Zarina Abdullayeva", birthDate: "1994-03-15",
    gender: "ayol", bloodGroup: "O(I) Rh−", allergies: [], diagnoses: ["Kesar kesish operatsiyasi"],
    medIdConsent: true, phone: "+998 90 908 70 60",
    address: addr("p6", "Yunusobod 4-mavze", "22", "9", "86-maktab orqasida", 41.364, 69.282),
  },
  {
    id: "p7", userId: "u-p7", pinfl: "31010663450072", fullName: "Otabek Yusupov", birthDate: "1966-10-10",
    gender: "erkak", bloodGroup: "A(II) Rh+", allergies: [], diagnoses: ["Son suyagi sinishi, osteosintez"],
    medIdConsent: false, phone: "+998 94 555 08 08",
    address: addr("p7", "Sebzor koʻch.", "71", "15", "Sebzor maktabi", 41.33, 69.25),
  },
];

// ---------- nazorat rejalari, koʻrsatkichlar ----------

const defaultThresholds = { tempMax: 38, pulseMin: 50, pulseMax: 110, spo2Min: 93, painMax: 7 };

export const plans: MonitoringPlan[] = [
  { id: "m1", patientId: "p1", doctorId: "d1", surgery: "Appendektomiya", startDate: "2026-09-27", days: 14, thresholds: defaultThresholds, active: true },
  { id: "m2", patientId: "p2", doctorId: "d1", surgery: "Laparoskopik xolesistektomiya", startDate: "2026-09-24", days: 14, thresholds: defaultThresholds, active: true },
  { id: "m3", patientId: "p3", doctorId: "d1", surgery: "Gernioplastika", startDate: "2026-09-29", days: 7, thresholds: { ...defaultThresholds, pulseMax: 100 }, active: true },
  { id: "m4", patientId: "p4", doctorId: "d1", surgery: "Tizza artroskopiyasi", startDate: "2026-09-12", days: 30, thresholds: defaultThresholds, active: true },
  { id: "m5", patientId: "p5", doctorId: "d1", surgery: "Yara perforatsiyasini tikish", startDate: "2026-09-30", days: 30, thresholds: { ...defaultThresholds, tempMax: 37.8 }, active: true },
  { id: "m6", patientId: "p6", doctorId: "d1", surgery: "Kesar kesish", startDate: "2026-09-20", days: 14, thresholds: defaultThresholds, active: true },
];

// deterministik tasodifiy sonlar (SSR va brauzerda bir xil boʻlishi uchun)
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function isoDay(offset: number) {
  const d = new Date(`${TODAY}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - offset);
  return d.toISOString().slice(0, 10);
}

// har bemorning oxirgi kunlardagi trendi: [harorat siljishi, puls siljishi, spo2 siljishi]
const trend: Record<string, [number, number, number]> = {
  p1: [0.9, 22, -2], // xavf: harorat koʻtarilmoqda
  p2: [0, 0, 0],
  p3: [0.2, 12, -1], // diqqat
  p4: [0, -2, 0],
  p5: [0.6, 8, -4], // xavf: SpO2 tushmoqda
  p6: [0, 0, 0],
  p7: [0, 0, 0],
};

export const vitals: VitalReading[] = patients.flatMap((p, pi) => {
  const rnd = seeded(pi + 7);
  const [dt, dp, ds] = trend[p.id];
  return Array.from({ length: 30 }, (_, i) => {
    const daysAgo = 29 - i;
    const k = daysAgo < 4 ? (4 - daysAgo) / 4 : 0; // oxirgi 4 kunda trend kuchayadi
    return {
      patientId: p.id,
      time: `${isoDay(daysAgo)}T09:00:00`,
      pulse: Math.round(72 + rnd() * 10 + dp * k),
      temp: Math.round((36.5 + rnd() * 0.5 + dt * k + (k ? 0.15 : 0) * Math.sign(dt)) * 10) / 10,
      spo2: Math.round(97 + rnd() * 2 + ds * k),
      pressure: `${Math.round(118 + rnd() * 14)}/${Math.round(74 + rnd() * 10)}`,
      source: pi % 2 ? "healthkit" : "health_connect",
    } satisfies VitalReading;
  });
});

// bugungi oʻlchovlar signallar bilan mos boʻlishi uchun aniq qiymatlar
const todayOverrides: Record<string, Partial<VitalReading>> = {
  p1: { temp: 38.6, pulse: 98, spo2: 96 },
  p5: { temp: 37.4, pulse: 88, spo2: 92 },
  p3: { temp: 36.9, pulse: 96, spo2: 96 },
};
for (const v of vitals) {
  const o = todayOverrides[v.patientId];
  if (o && v.time.startsWith(TODAY)) Object.assign(v, o);
}

export const surveys: Survey[] = plans.flatMap((plan, pi) => {
  const rnd = seeded(pi + 31);
  const [dt] = trend[plan.patientId];
  return Array.from({ length: 7 }, (_, i) => {
    const daysAgo = 6 - i;
    const worsening = dt > 0.5 && daysAgo < 3;
    return {
      patientId: plan.patientId,
      date: isoDay(daysAgo),
      pain: Math.min(10, Math.round(2 + rnd() * 2 + (worsening ? 3 + (2 - daysAgo) : 0))),
      temp: Math.round((36.6 + rnd() * 0.4 + (worsening ? dt : 0)) * 10) / 10,
      wound: worsening && daysAgo === 0 ? "qizargan" : "yaxshi",
      photo: i % 2 === 0,
    } satisfies Survey;
  });
});

// ---------- signallar ----------

export const alerts: Alert[] = [
  { id: "al1", planId: "m1", patientId: "p1", level: "xavf", reason: "Harorat 38,6 °C (chegara 38 °C)", time: "2026-10-02T08:42:00", status: "yangi" },
  { id: "al2", planId: "m5", patientId: "p5", level: "xavf", reason: "SpO₂ 92% (chegara 93%)", time: "2026-10-02T07:15:00", status: "yangi" },
  { id: "al3", planId: "m3", patientId: "p3", level: "diqqat", reason: "Puls 96 zarba/daq, 3 kun ketma-ket oʻsmoqda", time: "2026-10-02T06:30:00", status: "yangi" },
  { id: "al4", planId: "m2", patientId: "p2", level: "diqqat", reason: "Dori 2 marta oʻtkazib yuborildi (Omeprazol)", time: "2026-10-01T21:05:00", status: "korildi", seenBy: "Aziza Karimova" },
  { id: "al5", planId: "m6", patientId: "p6", level: "diqqat", reason: "Ogʻriq 7/10 (soʻrovnoma)", time: "2026-09-30T19:20:00", status: "hal_qilindi", seenBy: "Aziza Karimova" },
];

// ---------- dorilar (DARMON reyestridan namuna) ----------

export const drugs: Drug[] = [
  { mnn: "Paracetamol", form: "tabletka 500 mg", prescriptionOnly: false },
  { mnn: "Ibuprofen", form: "tabletka 400 mg", prescriptionOnly: false },
  { mnn: "Ketorolac", form: "tabletka 10 mg", prescriptionOnly: true },
  { mnn: "Amoxicillin + Clavulanic acid", form: "tabletka 875/125 mg", prescriptionOnly: true },
  { mnn: "Ceftriaxone", form: "kukun, inyeksiya 1 g", prescriptionOnly: true },
  { mnn: "Ciprofloxacin", form: "tabletka 500 mg", prescriptionOnly: true },
  { mnn: "Metronidazole", form: "tabletka 250 mg", prescriptionOnly: true },
  { mnn: "Omeprazole", form: "kapsula 20 mg", prescriptionOnly: false },
  { mnn: "Pantoprazole", form: "tabletka 40 mg", prescriptionOnly: false },
  { mnn: "Enoxaparin sodium", form: "inyeksiya 40 mg/0,4 ml", prescriptionOnly: true },
  { mnn: "Tramadol", form: "kapsula 50 mg", prescriptionOnly: true },
  { mnn: "Diclofenac", form: "tabletka 50 mg", prescriptionOnly: false },
  { mnn: "Amlodipine", form: "tabletka 5 mg", prescriptionOnly: true },
  { mnn: "Metformin", form: "tabletka 850 mg", prescriptionOnly: true },
  { mnn: "Drotaverine", form: "tabletka 40 mg", prescriptionOnly: false },
];

// ---------- retseptlar va dori ichish tarixi ----------

export const prescriptions: Prescription[] = [
  {
    id: "rx-1001", doctorId: "d1", patientId: "p1", date: "2026-09-28", status: "faol", dmedId: undefined,
    items: [
      { id: "i1", mnn: "Amoxicillin + Clavulanic acid", dose: "1 tabletka", times: ["08:00", "20:00"], days: 7, note: "Ovqatdan keyin" },
      { id: "i2", mnn: "Paracetamol", dose: "1 tabletka", times: ["08:00", "14:00", "20:00"], days: 5, note: "Ogʻriq yoki harorat boʻlsa" },
    ],
  },
  {
    id: "rx-1002", doctorId: "d1", patientId: "p2", date: "2026-09-25", status: "faol",
    items: [
      { id: "i3", mnn: "Omeprazole", dose: "1 kapsula", times: ["07:30"], days: 14, note: "Nonushtadan 30 daqiqa oldin" },
      { id: "i4", mnn: "Drotaverine", dose: "1 tabletka", times: ["09:00", "21:00"], days: 5 },
    ],
  },
  {
    id: "rx-1003", doctorId: "d1", patientId: "p5", date: "2026-10-01", status: "faol",
    items: [
      { id: "i5", mnn: "Pantoprazole", dose: "1 tabletka", times: ["08:00"], days: 30 },
      { id: "i6", mnn: "Metronidazole", dose: "2 tabletka", times: ["08:00", "16:00", "00:00"], days: 7, note: "Spirtli ichimlik mumkin emas" },
    ],
  },
  {
    id: "rx-0950", doctorId: "d1", patientId: "p4", date: "2026-09-13", status: "yakunlangan",
    items: [{ id: "i7", mnn: "Enoxaparin sodium", dose: "1 inyeksiya", times: ["20:00"], days: 10 }],
  },
];

export const doseLogs: DoseLog[] = prescriptions
  .filter((rx) => rx.status === "faol")
  .flatMap((rx, ri) => {
    const rnd = seeded(ri + 101);
    return rx.items.flatMap((item) =>
      Array.from({ length: 4 }, (_, d) =>
        item.times.map((t) => ({
          itemId: item.id,
          scheduledAt: `${isoDay(3 - d)}T${t}:00`,
          status: (rx.patientId === "p2" && item.id === "i3" && d >= 2) || rnd() < 0.08 ? "otkazildi" : "ichildi",
        }) satisfies DoseLog),
      ).flat(),
    );
  });

// ---------- navbat ----------

export const appointments: Appointment[] = [
  { id: "ap1", clinicId: "c1", doctorId: "d1", patientId: "p4", time: "2026-10-02T09:00:00", status: "qabul_qilindi", reason: "Nazorat koʻrigi" },
  { id: "ap2", clinicId: "c1", doctorId: "d1", patientId: "p6", time: "2026-10-02T09:20:00", status: "kelmadi", reason: "Chokni olish" },
  { id: "ap3", clinicId: "c1", doctorId: "d1", patientId: "p2", time: "2026-10-02T10:00:00", status: "keldi", reason: "Operatsiyadan keyingi koʻrik" },
  { id: "ap4", clinicId: "c1", doctorId: "d1", patientId: "p7", time: "2026-10-02T11:20:00", status: "kutilmoqda", reason: "Birlamchi konsultatsiya" },
  { id: "ap5", clinicId: "c2", doctorId: "d1", patientId: "p3", time: "2026-10-02T13:40:00", status: "kutilmoqda", reason: "Bogʻlamni almashtirish" },
  { id: "ap6", clinicId: "c2", doctorId: "d3", patientId: "p6", time: "2026-10-02T10:30:00", status: "keldi", reason: "Ginekologik koʻrik" },
  { id: "ap7", clinicId: "c2", doctorId: "d4", patientId: "p3", time: "2026-10-02T11:00:00", status: "kutilmoqda", reason: "EKG va bosim nazorati" },
  { id: "ap8", clinicId: "c2", doctorId: "d4", patientId: "p5", time: "2026-10-02T14:20:00", status: "kutilmoqda", reason: "Konsultatsiya" },
  { id: "ap9", clinicId: "c2", doctorId: "d3", patientId: "p2", time: "2026-10-02T15:00:00", status: "kutilmoqda", reason: "Takroriy qabul" },
  { id: "ap10", clinicId: "c1", doctorId: "d1", patientId: "p1", time: "2026-10-03T09:00:00", status: "kutilmoqda", reason: "Nazorat koʻrigi" },
  { id: "ap11", clinicId: "c1", doctorId: "d1", patientId: "p5", time: "2026-10-05T10:00:00", status: "kutilmoqda", reason: "Chok holati" },
  { id: "ap12", clinicId: "c2", doctorId: "d1", patientId: "p4", time: "2026-10-06T14:00:00", status: "kutilmoqda", reason: "Reabilitatsiya rejasi" },
  { id: "ap13", clinicId: "c1", doctorId: "d1", patientId: "p3", time: "2026-10-07T09:40:00", status: "kutilmoqda", reason: "Yakuniy koʻrik" },
];

// ---------- aptekalar ----------

export const pharmacies: Pharmacy[] = [
  { id: "ph1", name: "Dorixona Plus", license: "D-55120", address: "Chilonzor t., Bunyodkor 7", workHours: "24/7", approval: "tasdiqlangan", distanceKm: 1.2 },
  { id: "ph2", name: "Grand Pharm", license: "D-44871", address: "Yunusobod t., Amir Temur 92", workHours: "08:00–23:00", approval: "tasdiqlangan", distanceKm: 4.6 },
  { id: "ph4", name: "Arzon Apteka", license: "D-58302", address: "Chilonzor t., Qatortol 22", workHours: "08:00–22:00", approval: "tasdiqlangan", distanceKm: 2.3 },
  { id: "ph3", name: "Oxy-Med apteka", license: "D-60214", address: "Sergeli t., Yangi Sergeli 3", workHours: "08:00–22:00", approval: "tekshirilmoqda" },
];

export const stock: PharmacyStock[] = [
  { pharmacyId: "ph1", mnn: "Paracetamol", tradeName: "Paratsetamol-Nobel 500 mg №20", price: 6500, qty: 140 },
  { pharmacyId: "ph1", mnn: "Ibuprofen", tradeName: "Nurofen 400 mg №12", price: 38000, qty: 46 },
  { pharmacyId: "ph1", mnn: "Ketorolac", tradeName: "Ketanov 10 mg №20", price: 29000, qty: 18 },
  { pharmacyId: "ph1", mnn: "Amoxicillin + Clavulanic acid", tradeName: "Amoksiklav 875/125 №14", price: 89000, qty: 22 },
  { pharmacyId: "ph1", mnn: "Ceftriaxone", tradeName: "Seftriakson 1 g flakon", price: 9800, qty: 300 },
  { pharmacyId: "ph1", mnn: "Omeprazole", tradeName: "Omez 20 mg №30", price: 41000, qty: 3 },
  { pharmacyId: "ph1", mnn: "Pantoprazole", tradeName: "Nolpaza 40 mg №28", price: 96000, qty: 15 },
  { pharmacyId: "ph1", mnn: "Metronidazole", tradeName: "Metronidazol 250 mg №20", price: 7200, qty: 0 },
  { pharmacyId: "ph1", mnn: "Enoxaparin sodium", tradeName: "Kleksan 40 mg №10", price: 412000, qty: 6 },
  { pharmacyId: "ph1", mnn: "Drotaverine", tradeName: "No-shpa 40 mg №24", price: 32000, qty: 64 },
  { pharmacyId: "ph1", mnn: "Diclofenac", tradeName: "Diklofenak 50 mg №20", price: 8900, qty: 80 },
  // narx solishtirish uchun boshqa aptekalar (B-09)
  { pharmacyId: "ph2", mnn: "Paracetamol", tradeName: "Panadol 500 mg №12", price: 21000, qty: 60 },
  { pharmacyId: "ph2", mnn: "Amoxicillin + Clavulanic acid", tradeName: "Augmentin 875/125 №14", price: 118000, qty: 12 },
  { pharmacyId: "ph2", mnn: "Omeprazole", tradeName: "Omez 20 mg №30", price: 39500, qty: 25 },
  { pharmacyId: "ph2", mnn: "Pantoprazole", tradeName: "Nolpaza 40 mg №28", price: 92000, qty: 9 },
  { pharmacyId: "ph2", mnn: "Metronidazole", tradeName: "Trixopol 250 mg №20", price: 9500, qty: 30 },
  { pharmacyId: "ph4", mnn: "Paracetamol", tradeName: "Paratsetamol 500 mg №10", price: 3900, qty: 200 },
  { pharmacyId: "ph4", mnn: "Amoxicillin + Clavulanic acid", tradeName: "Amoksiklav 875/125 №14", price: 84500, qty: 7 },
  { pharmacyId: "ph4", mnn: "Drotaverine", tradeName: "Drotaverin 40 mg №20", price: 9800, qty: 40 },
  { pharmacyId: "ph4", mnn: "Ibuprofen", tradeName: "Ibuprofen 400 mg №20", price: 14500, qty: 55 },
];

export const couriers: Courier[] = [
  { id: "k1", userId: "u-k1", fullName: "Islom Ismoilov", transport: "skuter", approval: "tasdiqlangan", phone: "+998 90 444 21 21" },
  { id: "k2", userId: "u-k2", fullName: "Davron Hakimov", transport: "avtomobil", approval: "tasdiqlangan", phone: "+998 93 111 90 90" },
  { id: "k3", userId: "u-k3", fullName: "Sherzod Qosimov", transport: "velosiped", approval: "tekshirilmoqda", phone: "+998 95 600 40 40" },
];

export const orders: Order[] = [
  {
    id: "o-5521", patientId: "p1", pharmacyId: "ph1", prescriptionId: "rx-1001", status: "yangi", createdAt: "2026-10-02T09:12:00", payment: "onlayn",
    items: [
      { mnn: "Amoxicillin + Clavulanic acid", tradeName: "Amoksiklav 875/125 №14", qty: 1, price: 89000, prescriptionOnly: true },
      { mnn: "Paracetamol", tradeName: "Paratsetamol-Nobel 500 mg №20", qty: 1, price: 6500, prescriptionOnly: false },
    ],
    total: 95500, deliveryFee: 15000,
  },
  {
    id: "o-5520", patientId: "p5", pharmacyId: "ph1", prescriptionId: "rx-1003", status: "yangi", createdAt: "2026-10-02T08:55:00", payment: "naqd",
    items: [
      { mnn: "Pantoprazole", tradeName: "Nolpaza 40 mg №28", qty: 1, price: 96000, prescriptionOnly: false },
      { mnn: "Metronidazole", tradeName: "Metronidazol 250 mg №20", qty: 2, price: 7200, prescriptionOnly: true },
    ],
    total: 110400, deliveryFee: 18000,
  },
  {
    id: "o-5517", patientId: "p2", pharmacyId: "ph1", prescriptionId: "rx-1002", status: "yigildi", createdAt: "2026-10-02T08:10:00", payment: "onlayn", courierId: "k1",
    items: [{ mnn: "Omeprazole", tradeName: "Omez 20 mg №30", qty: 1, price: 41000, prescriptionOnly: false }],
    total: 41000, deliveryFee: 12000,
  },
  {
    id: "o-5512", patientId: "p6", pharmacyId: "ph1", status: "yolda", createdAt: "2026-10-02T07:40:00", payment: "onlayn", courierId: "k2",
    items: [{ mnn: "Ibuprofen", tradeName: "Nurofen 400 mg №12", qty: 1, price: 38000, prescriptionOnly: false }],
    total: 38000, deliveryFee: 14000,
  },
  {
    id: "o-5498", patientId: "p4", pharmacyId: "ph1", status: "yetkazildi", createdAt: "2026-10-01T17:22:00", payment: "naqd", courierId: "k1",
    items: [{ mnn: "Diclofenac", tradeName: "Diklofenak 50 mg №20", qty: 2, price: 8900, prescriptionOnly: false }],
    total: 17800, deliveryFee: 12000,
  },
  {
    id: "o-5490", patientId: "p3", pharmacyId: "ph1", status: "yetkazildi", createdAt: "2026-10-01T12:05:00", payment: "onlayn", courierId: "k2",
    items: [{ mnn: "Drotaverine", tradeName: "No-shpa 40 mg №24", qty: 1, price: 32000, prescriptionOnly: false }],
    total: 32000, deliveryFee: 16000,
  },
];

// kunlik sotuv (A-05), oxirgi 14 kun
export const pharmacySales = Array.from({ length: 14 }, (_, i) => {
  const rnd = seeded(i + 500);
  return { date: isoDay(13 - i), orders: Math.round(9 + rnd() * 14), revenue: Math.round((900 + rnd() * 1400) * 1000) };
});

// ---------- kontent va reklama ----------

export const reels: Reel[] = [
  { id: "r1", doctorId: "d1", title: "Operatsiyadan keyin chokni qanday parvarish qilish kerak", tags: ["jarrohlik", "chok"], moderation: "tasdiqlangan", views: 48210, likes: 3920, durationSec: 54, date: "2026-09-21", complaints: 0 },
  { id: "r2", doctorId: "d1", title: "Appenditsitning 5 ta belgisi", tags: ["appenditsit", "shoshilinch"], moderation: "tasdiqlangan", views: 112480, likes: 8811, durationSec: 47, date: "2026-09-08", complaints: 1 },
  { id: "r3", doctorId: "d1", title: "Antibiotikni nega oxirigacha ichish kerak", tags: ["dori", "antibiotik"], moderation: "kutilmoqda", views: 0, likes: 0, durationSec: 58, date: "2026-10-01", complaints: 0 },
  { id: "r4", doctorId: "d4", title: "Qon bosimini uyda toʻgʻri oʻlchash", tags: ["kardiologiya"], moderation: "kutilmoqda", views: 0, likes: 0, durationSec: 41, date: "2026-10-01", complaints: 0 },
  { id: "r5", doctorId: "d3", title: "Homiladorlikda vitaminlar: afsona va haqiqat", tags: ["ginekologiya"], moderation: "tasdiqlangan", views: 76003, likes: 5400, durationSec: 59, date: "2026-09-15", complaints: 4 },
];

export const ads: Ad[] = [
  { id: "ad1", advertiser: "FitLife sport zali", title: "Birinchi oy 50% chegirma", category: "sport", budget: 3000000, spent: 1845000, views: 123000, clicks: 2210, moderation: "tasdiqlangan", status: "faol", media: "video" },
  { id: "ad2", advertiser: "FitLife sport zali", title: "Reabilitatsiya mashgʻulotlari", category: "sport", budget: 1500000, spent: 1500000, views: 100000, clicks: 1630, moderation: "tasdiqlangan", status: "yakunlangan", media: "rasm" },
  { id: "ad3", advertiser: "FitLife sport zali", title: "Yangi filial: Sergeli", category: "sport", budget: 2000000, spent: 0, views: 0, clicks: 0, moderation: "kutilmoqda", status: "toʻxtatilgan", media: "video" },
  { id: "ad4", advertiser: "Gross Sugʻurta", title: "Tibbiy sugʻurta oyiga 49 000 soʻm", category: "sugʻurta", budget: 10000000, spent: 4200000, views: 280000, clicks: 3900, moderation: "tasdiqlangan", status: "faol", media: "video" },
  { id: "ad5", advertiser: "Vita Detox", title: "7 kunda barcha kasalliklardan xalos", category: "apteka", budget: 5000000, spent: 0, views: 0, clicks: 0, moderation: "kutilmoqda", status: "toʻxtatilgan", media: "video" },
];

export const adDaily = Array.from({ length: 14 }, (_, i) => {
  const rnd = seeded(i + 900);
  return { date: isoDay(13 - i), views: Math.round(6000 + rnd() * 5000), clicks: Math.round(90 + rnd() * 90) };
});

// ---------- SOS jurnali ----------

export const sosEvents: SosEvent[] = [
  { id: "sos-311", patientId: "p5", source: "bilaguzuk", time: "2026-10-02T07:14:22", lat: 41.272, lng: 69.188, address: "Farhod koʻch. 3, xususiy uy", status: "bekor_qilindi", seenBy: ["Aziza Karimova"], durationSec: 6 },
  { id: "sos-309", patientId: "p3", source: "tugma", time: "2026-09-30T23:41:05", lat: 41.321, lng: 69.241, address: "Navoiy koʻch. 48, 3-xonadon", status: "yetib_keldi", ambulanceReply: "Brigada №14, 11 daqiqada yetib keldi", seenBy: ["Aziza Karimova", "Yaqin: Dilshod Saidov"], durationSec: 10 },
  { id: "sos-302", patientId: "p1", source: "shifokor", time: "2026-09-28T16:02:48", lat: 41.293, lng: 69.212, address: "Qatortol koʻch. 14, 37-xonadon", status: "yetib_keldi", ambulanceReply: "Brigada №7, 9 daqiqada", seenBy: ["Aziza Karimova"], durationSec: 0 },
  { id: "sos-297", patientId: "p6", source: "tugma", time: "2026-09-26T11:10:10", lat: 41.364, lng: 69.282, address: "Yunusobod 4-mavze 22, 9-xonadon", status: "bekor_qilindi", seenBy: [], durationSec: 4 },
];

// ---------- toʻlovlar, audit ----------

export const payments: Payment[] = [
  { id: "pay-9012", type: "yetkazish", amount: 18000, provider: "Click", status: "toʻlandi", platformShare: 6750, date: "2026-10-02T09:13:00", payer: "Rustam Qodirov" },
  { id: "pay-9011", type: "nazorat", amount: 49000, provider: "Payme", status: "toʻlandi", platformShare: 34300, date: "2026-10-02T08:30:00", payer: "Shuhrat Nazarov" },
  { id: "pay-9010", type: "premium", amount: 29000, provider: "Uzcard", status: "toʻlandi", platformShare: 29000, date: "2026-10-01T19:02:00", payer: "Aziza Karimova" },
  { id: "pay-9009", type: "reklama", amount: 3000000, provider: "Click", status: "toʻlandi", platformShare: 3000000, date: "2026-10-01T15:45:00", payer: "FitLife sport zali" },
  { id: "pay-9008", type: "yetkazish", amount: 15000, provider: "Naqd", status: "kutilmoqda", platformShare: 5250, date: "2026-10-01T17:22:00", payer: "Gulnora Mirzayeva" },
  { id: "pay-9007", type: "pro", amount: 300000, provider: "Humo", status: "toʻlandi", platformShare: 300000, date: "2026-10-01T10:00:00", payer: "Shifo Med klinikasi" },
  { id: "pay-9006", type: "yetkazish", amount: 19000, provider: "Payme", status: "qaytarildi", platformShare: 0, date: "2026-09-30T13:12:00", payer: "Anvar Saidov" },
  { id: "pay-8990", type: "reklama", amount: 1500000, provider: "Payme", status: "toʻlandi", platformShare: 1500000, date: "2026-09-10T12:00:00", payer: "FitLife sport zali" },
];

export const auditLogs: AuditLog[] = [
  { id: "au1", who: "Aziza Karimova (shifokor)", action: "Bemor kartasini ochdi", object: "Patient p1", time: "2026-10-02T08:44:10", ip: "10.12.4.21" },
  { id: "au2", who: "Aziza Karimova (shifokor)", action: "Signalni koʻrdi", object: "Alert al4", time: "2026-10-01T21:15:00", ip: "10.12.4.21" },
  { id: "au3", who: "Dorixona Plus (apteka)", action: "Retseptni tekshirdi", object: "Prescription rx-1002", time: "2026-10-02T08:12:44", ip: "84.54.70.3" },
  { id: "au4", who: "admin@medis.uz", action: "Shifokorni tasdiqladi", object: "Doctor d4", time: "2026-09-29T11:00:00", ip: "10.0.0.5" },
  { id: "au5", who: "Bobur Rahimov (shifokor)", action: "Ruxsatsiz bemor kartasiga urinish — rad etildi", object: "Patient p2", time: "2026-09-29T09:31:02", ip: "213.230.80.14" },
];

export const pricing: Pricing = {
  deliveryMin: 12000, deliveryMax: 20000, serviceFee: 3000, deliveryShare: 25,
  monitoring: 49000, monitoringShare: 70, doctorPremium: 29000, clinicPro: 300000, adCpm: 15000,
};

// joriy foydalanuvchilar (demo sessiya)
export const CURRENT = { doctorId: "d1", clinicId: "c2", pharmacyId: "ph1", advertiser: "FitLife sport zali" };
