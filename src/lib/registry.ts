// Davlat tizimlaridan keladigan maʼlumotlar (demo).
// Haqiqiy integratsiyada: OneID — shaxs, MED-ID/DMED — tibbiy xodim va litsenziya,
// litsenziyalar reyestri va soliq tizimi — shaxs nomidagi tashkilotlar (TZ 5-boʻlim).

export interface Identity {
  fullName: string;
  pinfl: string;
  birthDate: string;
  phone: string;
}

export interface MedIdDoctor {
  specialty: string;
  category: string;
  licenseNo: string;
  licenseUntil: string;
  education: string;
  workplaces: { clinicId: string; name: string; position: string }[];
}

export interface RegistryOrg {
  id: string; // MEDIS dagi id (ulangan boʻlsa) yoki reyestr id
  name: string;
  kind: "klinika" | "apteka" | "kompaniya";
  type?: "davlat" | "xususiy";
  inn: string; // STIR
  license?: string;
  licenseUntil?: string;
  address: string;
  connected: boolean; // MEDIS ga allaqachon ulanganmi
}

export const IDENTITIES = {
  shifokor: { fullName: "Karimova Aziza Rustamovna", pinfl: "42103876540017", birthDate: "1987-03-21", phone: "+998 90 123 45 67" },
  klinika: { fullName: "Usmonov Javohir Bahodirovich", pinfl: "31508824560031", birthDate: "1982-08-15", phone: "+998 93 210 44 05" },
  apteka: { fullName: "Tursunova Malika Odilovna", pinfl: "42711905670022", birthDate: "1990-11-27", phone: "+998 97 555 18 80" },
  reklama: { fullName: "Rahimov Dilshod Anvarovich", pinfl: "31902885430011", birthDate: "1988-02-19", phone: "+998 99 404 70 70" },
  admin: { fullName: "Ergashev Bekzod Sobirovich", pinfl: "30605915670042", birthDate: "1991-05-06", phone: "+998 95 300 12 12" },
} satisfies Record<string, Identity>;

// MED-ID: tibbiy xodim yozuvi (JSHSHIR boʻyicha)
export const MEDID: Record<string, MedIdDoctor & { fullName: string; phone: string }> = {
  "42103876540017": {
    fullName: "Karimova Aziza Rustamovna", phone: "+998 90 123 45 67",
    specialty: "Umumiy jarroh", category: "Oliy toifa", licenseNo: "SH-118204", licenseUntil: "2029-05-14",
    education: "Toshkent tibbiyot akademiyasi, 2012",
    workplaces: [
      { clinicId: "c1", name: "Toshkent shahar 1-son klinik shifoxonasi", position: "Jarroh" },
      { clinicId: "c2", name: "Shifo Med klinikasi", position: "Jarroh (oʻrindosh)" },
    ],
  },
  "52009914560021": {
    fullName: "Xolmatov Ulugʻbek Erkinovich", phone: "+998 95 120 30 40",
    specialty: "Terapevt", category: "Birinchi toifa", licenseNo: "SH-160233", licenseUntil: "2028-11-02",
    education: "Toshkent tibbiyot akademiyasi, 2016",
    workplaces: [{ clinicId: "c2", name: "Shifo Med klinikasi", position: "Terapevt" }],
  },
};

// Litsenziyalar reyestri / soliq tizimi: shaxs (JSHSHIR) nomidagi tashkilotlar
export const ORGS_BY_OWNER: Record<string, RegistryOrg[]> = {
  "31508824560031": [
    { id: "c2", name: "Shifo Med klinikasi", kind: "klinika", type: "xususiy", inn: "305882104", license: "L-002981", licenseUntil: "2030-03-01", address: "Toshkent, Yunusobod t., Amir Temur koʻch. 108", connected: true },
    { id: "c3", name: "MedLine diagnostika markazi", kind: "klinika", type: "xususiy", inn: "307441902", license: "L-003310", licenseUntil: "2029-07-15", address: "Toshkent, Chilonzor t., Bunyodkor shoh koʻch. 12", connected: true },
    { id: "r-cl-9", name: "Usmonov Stomatologiya", kind: "klinika", type: "xususiy", inn: "309112876", license: "L-004127", licenseUntil: "2031-01-20", address: "Toshkent, Mirzo Ulugʻbek t., Buyuk Ipak yoʻli 77", connected: false },
  ],
  "42711905670022": [
    { id: "ph1", name: "Dorixona Plus", kind: "apteka", inn: "306550221", license: "D-55120", licenseUntil: "2029-09-30", address: "Chilonzor t., Bunyodkor 7", connected: true },
    { id: "r-ph-7", name: "Malika Farm", kind: "apteka", inn: "310047755", license: "D-61190", licenseUntil: "2031-06-05", address: "Sergeli t., Yangi Sergeli 14", connected: false },
  ],
  "31902885430011": [
    { id: "adv-1", name: "FitLife sport zali", kind: "kompaniya", inn: "305123456", address: "Toshkent, Yakkasaroy t., Shota Rustaveli 40", connected: true },
    { id: "r-co-3", name: "FitLife Kids MChJ", kind: "kompaniya", inn: "311208431", address: "Toshkent, Yunusobod t., 19-mavze", connected: false },
  ],
};

// Klinika shifokorni taklif qilganda MED-ID dan qidirish (telefon yoki JSHSHIR boʻyicha)
export function findInMedId(query: string) {
  const q = query.replace(/\D/g, "");
  if (q.length < 7) return null;
  return Object.entries(MEDID).find(([pinfl, d]) => pinfl === q || d.phone.replace(/\D/g, "").endsWith(q.slice(-9))) ?? null;
}
