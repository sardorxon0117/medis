# MEDIS — veb-panellar

Texnik topshiriq (TZ) asosidagi veb qism: landing, kirish va 5 ta veb-panel.
Stek: Next.js 16 (App Router) + React 19 + TypeScript. Hozircha demo maʼlumotlar bilan ishlaydi.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Sahifalar

| Yoʻl | TZ talablari |
|---|---|
| `/` | Landing: muammolar, rollar, SOS, narxlar, yoʻl xaritasi |
| `/kirish` | OneID (MED-ID) orqali kirish va roʻyxatdan oʻtish (shaxs maʼlumotlari OneID dan), shifokor/admin uchun 2FA, zaxira: SMS kod (SH-01, A-01, K-01) |
| `/shifokor/*` | SH-02 … SH-12: bosh panel, bemorlar, bemor kartasi, chegaralar, nazorat rejasi, signallar, elektron retsept, navbat, reels, profil, Premium |
| `/klinika/*` | K-01 … K-06: statistika, umumiy navbat, shifokorlar, jadval, profil, Pro |
| `/apteka/*` | A-01 … A-05: buyurtmalar va retsept tekshiruvi, katalog (CSV import), hisobot, profil |
| `/reklama/*` | Kampaniyalar, yangi reklama (taqiqlangan iboralar tekshiruvi), balans |
| `/admin/*` | Tasdiqlash, moderatsiya, SOS jurnali, toʻlovlar, narx sozlamalari, audit jurnali |
| `/mobile/*` | Bemor ilovasi (B-01…B-16): OneID kirish, bosh sahifa va dori eslatmalari, retseptlar, tibbiy karta, soʻrovnoma, bilaguzuk, SOS, apteka va yetkazishni kuzatish, navbat, shifokor qidirish, reels, yaqinlar, chat, baholash, manzillar, profil |
| `/bemor` | Bemor ilovasining qisqa taqdimot demosi |
| `/taqdimot` | Animatsiyali startup taqdimoti |

## Tuzilma

- `src/lib/types.ts` — TZ 9-boʻlimdagi maʼlumotlar modeli
- `src/lib/mock-data.ts` — demo maʼlumotlar (bugungi sana: 2026-10-02)
- `src/lib/api.ts` — maʼlumotga kirish qatlami; backend tayyor boʻlganda shu yerda `fetch()` ga almashtiriladi
- `src/components/` — panel karkasi, grafiklar, navbat doskasi, UI elementlari

## Hali qilinmagan

- Backend (NestJS/FastAPI), haqiqiy autentifikatsiya va saqlash — oʻzgarishlar sahifa yangilanganda yoʻqoladi
- OneID OAuth (hozir demo oynasi), xarita SDK, toʻlov provayderlari, SMS/push integratsiyalari
- Til almashtirgich hozircha faqat koʻrinishda (tarjimalar yoʻq)
- Kuryer mobil ilovasi; bemor ilovasi hozircha mobil-veb (`/mobile`), holat brauzerda (localStorage) saqlanadi
