"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
import { Icon, type IconName } from "@/components/Icon";
import { QrCode } from "@/components/QrCode";
import { DoctorHero } from "@/components/DoctorHero";
import { Scene3D } from "@/components/Scene3D";

type Role = "CEO" | "CMO" | "CFO" | "CTO";

interface SlideDef {
  id: string;
  role: Role;
  theme: "dark" | "light" | "alt" | "teal";
  render: () => ReactNode;
}

// animatsiya kechikishi: elementlar ketma-ket chiqishi uchun
const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

// Slaydlar 1600×900 kanvasda chiziladi va ekranga sigʻadigan qilib masshtablanadi — scroll boʻlmaydi
const CANVAS_W = 1600;
const CANVAS_H = 900;
const subscribeResize = (cb: () => void) => {
  window.addEventListener("resize", cb);
  return () => window.removeEventListener("resize", cb);
};
const fitScale = () => Math.min(window.innerWidth / CANVAS_W, window.innerHeight / CANVAS_H);

const subscribeFullscreen = (cb: () => void) => {
  document.addEventListener("fullscreenchange", cb);
  return () => document.removeEventListener("fullscreenchange", cb);
};
const isFullscreen = () => !!document.fullscreenElement;

function toggleFullscreen() {
  if (document.fullscreenElement) document.exitFullscreen();
  else document.documentElement.requestFullscreen?.();
}

function fmt(v: number, decimals: number) {
  const [int, frac] = v.toFixed(decimals).split(".");
  const g = int.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return frac ? `${g},${frac}` : g;
}

// Raqamni 0 dan sanab chiqaradi (slayd ochilganda)
function Count({ to, decimals = 0, prefix = "", suffix = "", dur = 1600, delay = 0 }: { to: number; decimals?: number; prefix?: string; suffix?: string; dur?: number; delay?: number }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = performance.now() + (reduce ? 0 : delay);
    const total = reduce ? 1 : dur;
    let raf = 0;
    const tick = (t: number) => {
      const k = Math.min(1, Math.max(0, (t - start) / total));
      setV(to * (1 - Math.pow(1 - k, 3)));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, dur, delay]);
  return <span className="count">{prefix}{fmt(v, decimals)}{suffix}</span>;
}

function Brand({ light }: { light?: boolean }) {
  return (
    <span className={`p-brand${light ? " light" : ""}`}>
      <Image src="/brand/medis-mark.png" alt="" width={314} height={269} priority />
      <span className="logo-word" aria-hidden="true" />
    </span>
  );
}

function Head({ eyebrow, title, delay = 0 }: { eyebrow: string; title: ReactNode; delay?: number }) {
  return (
    <header className="p-head">
      <span className="p-eyebrow a a-up" style={d(delay)}>{eyebrow}</span>
      <h2 className="a a-up" style={d(delay + 120)}>{title}</h2>
    </header>
  );
}

function Ecg({ className = "" }: { className?: string }) {
  return (
    <svg className={`p-ecg ${className}`} viewBox="0 0 1200 120" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 70 H360 L390 30 L420 110 L450 10 L480 90 L500 70 H760 L785 40 L810 100 L835 20 L860 80 L875 70 H1200" />
    </svg>
  );
}

// Jamoa: rasmlar web/public/team/<rol>-face.jpg (asl suratdan bosh-yelka qirqimi); rasm yoʻq boʻlsa bosh harflar
const TEAM: { role: Role; name: string; job: string; photo: string; color: string }[] = [
  { role: "CEO", name: "Zahro Tursunboyeva", job: "Asoschi · strategiya va hamkorlar", photo: "/team/ceo-face.jpg", color: "#2ec4d1" },
  { role: "CMO", name: "Iqboljon Usmonaliyev", job: "Marketing va brend", photo: "/team/cmo-face.jpg", color: "#9b82f0" },
  { role: "CFO", name: "Zuhra Kuchkorova", job: "Moliya va investitsiya", photo: "/team/cfo-face.jpg", color: "#f0b429" },
  { role: "CTO", name: "Sarvar Fayzullayev", job: "Texnologiya va mahsulot", photo: "/team/cto-face.jpg", color: "#5b9cff" },
];

function TeamPhoto({ src, name, role }: { src: string; name: string; role: Role }) {
  const [failed, setFailed] = useState(false);
  const letters = name.startsWith("[") ? role : name.split(" ").map((w) => w[0]).slice(0, 2).join("");
  return failed ? (
    <span className="team-initials">{letters}</span>
  ) : (
    // eslint-disable-next-line @next/next/no-img-element -- rasm boʻlmasa bosh harflarga qaytish uchun oddiy img
    <img src={src} alt={name.startsWith("[") ? `${role} rasmi` : name} onError={() => setFailed(true)} />
  );
}

const SLIDES: SlideDef[] = [
  {
    id: "cover", role: "CEO", theme: "dark",
    render: () => (
      <div className="p-cover">
        <div className="p-floor" aria-hidden="true" />
        <div className="blob b1" /><div className="blob b2" />
        <DoctorHero />
        <div className="a a-pop" style={d(0)}><Brand light /></div>
        <h1>
          {"Shifoxonadan keyin ham".split(" ").map((w, i) => <span key={i} className="word a a-up" style={d(250 + i * 90)}>{w}&nbsp;</span>)}
          <br />
          {"shifokor nazoratida".split(" ").map((w, i) => <span key={i} className="word accent a a-up" style={d(650 + i * 110)}>{w}&nbsp;</span>)}
        </h1>
        <p className="p-lead a a-fade" style={d(1000)}>Bemor, shifokor, klinika, apteka va kuryerni birlashtiruvchi davolanishdan keyingi nazorat platformasi</p>
        <Ecg className="a a-draw" />
      </div>
    ),
  },
  {
    id: "jamoa", role: "CEO", theme: "dark",
    render: () => (
      <>
        <div className="blob b1" />
        <Head eyebrow="Jamoa" title={<>MEDIS ortidagi <span className="accent">jamoa</span></>} />
        <div className="team-grid">
          {TEAM.map((m, i) => (
            <div key={m.role} className="team-card a a-flip" style={{ ...d(250 + i * 160), "--rc": m.color } as CSSProperties}>
              <div className="team-photo"><TeamPhoto src={m.photo} name={m.name} role={m.role} /></div>
              <span className="team-role">{m.role}</span>
              <h3>{m.name}</h3>
              <p>{m.job}</p>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    id: "muammo", role: "CEO", theme: "light",
    render: () => (
      <>
        <Scene3D kind="pills" className="sc-bg" />
        <Head eyebrow="CEO · Muammo" title="Davolanish shifoxona eshigida uzilib qoladi" />
        <div className="p-stat">
          <div className="ring a a-pop" style={d(200)}>
            <svg viewBox="0 0 200 200" aria-hidden="true">
              <circle cx="100" cy="100" r="86" className="track" />
              <circle cx="100" cy="100" r="86" className="fill" />
            </svg>
            <span className="ring-num"><Count to={50} suffix="%" delay={300} /></span>
          </div>
          <div className="stack-l">
            <p className="p-big a a-right" style={d(500)}>surunkali kasalliklarda bemorlarning faqat yarmi dorini buyurilganidek ichadi</p>
            <p className="p-text a a-right" style={d(700)}>Bu rivojlangan davlatlardagi oʻrtacha koʻrsatkich. Rivojlanayotgan davlatlarda u bundan ham past.</p>
            <p className="p-src a a-fade" style={d(1000)}>Manba: JSST, “Adherence to Long-Term Therapies”, 2003</p>
          </div>
        </div>
      </>
    ),
  },
  {
    id: "ogriqlar", role: "CEO", theme: "light",
    render: () => (
      <>
        <Head eyebrow="CEO · Muammo" title="Bemor uyga qaytgach toʻrt joyda qoqiladi" />
        <div className="p-grid g2">
          {([
            ["rx", "Retsept tushunarsiz", "Qoʻlda yozilgan retseptni bemor oʻqiy olmaydi: doza va vaqt chalkashadi."],
            ["clock", "Dori unutiladi", "Bemor dorini qachon va qanday ichishni bilmaydi yoki esdan chiqaradi."],
            ["activity", "Nazorat yoʻq", "Operatsiyadan keyin shifokor bemor holatini uyda kuzata olmaydi."],
            ["siren", "SOS kech qoladi", "Xavfli holatda tez yordamni aniq manzilga chaqirish qiyin."],
          ] as [IconName, string, string][]).map(([ic, t, x], i) => (
            <div key={t} className="p-card pain a a-up" style={d(250 + i * 130)}>
              <span className="p-ic danger"><Icon name={ic} size={30} /></span>
              <h3>{t}</h3>
              <p>{x}</p>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    id: "yechim", role: "CEO", theme: "dark",
    render: () => (
      <>
        <Head eyebrow="CEO · Yechim" title="MEDIS: retseptdan signalgacha bitta zanjir" />
        <div className="p-chain">
          <div className="chain-line a a-grow" style={d(300)} />
          {([
            ["rx", "Elektron retsept", "Shifokor tizimda yozadi — bemor darhol telefonida aniq koʻradi."],
            ["bell", "Dori eslatmasi", "Har qabul vaqtida eslatma. “Ichdim” tugmasi shifokorga hisobot beradi."],
            ["activity", "Masofaviy nazorat", "Soat yoki bilaguzuk va kunlik soʻrovnoma holatni yetkazadi."],
            ["siren", "Signal va SOS", "Xavf boʻlsa shifokorga signal, bir tugma bilan tez yordam."],
          ] as [IconName, string, string][]).map(([ic, t, x], i) => (
            <div key={t} className="chain-step a a-pop" style={d(450 + i * 260)}>
              <span className="chain-dot"><Icon name={ic} size={30} /></span>
              <b className="chain-n">0{i + 1}</b>
              <h3>{t}</h3>
              <p>{x}</p>
            </div>
          ))}
        </div>
        <p className="p-text a a-fade" style={d(1600)}>Bitta platformada: bemor, shifokor, klinika, apteka va kuryer. Yaqin aptekadan dori buyurtma qilish ham shu yerda.</p>
      </>
    ),
  },
  {
    id: "bilaguzuk", role: "CEO", theme: "dark",
    render: () => (
      <div className="p-band">
        <div className="stack-l">
          <Head eyebrow="CEO · MEDIS bilaguzugi" title={<>Holat <span className="accent">24/7</span> nazoratda</>} />
          <p className="p-text a a-fade" style={d(300)}>Puls, harorat, SpO₂, yiqilish va uyqu — bemor hech narsa bosmasa ham shifokorga yetadi. Xavf boʻlsa — avtomatik SOS.</p>
          <div className="band-flow">
            {([
              ["users", "Hamkorlik", "Aqlli soat ishlab chiqaruvchisi bilan “MEDIS × hamkor” qoʻshma modeli"],
              ["box", "Buyurtma asosida", "Bizning ilovamizga moslab hamkor zavodida chiqariladi — logotip MEDIS"],
              ["star", "Ilova bilan sotamiz", "Qutidan chiqqanda MEDIS ga ulangan: bemor, klinika, sugʻurta"],
            ] as [IconName, string, string][]).map(([ic, t, x], i) => (
              <div key={t} className="band-row a a-left" style={d(450 + i * 200)}>
                <span className="p-ic"><Icon name={ic} size={26} /></span>
                <div><h3>{t}</h3><p>{x}</p></div>
              </div>
            ))}
          </div>
        </div>
        <div className="band-watch a a-pop" style={d(250)}>
          <div className="band-halo" />
          <Scene3D kind="watch" className="sc-watch" />
          <span className="band-cap">MEDIS × hamkor</span>
        </div>
      </div>
    ),
  },
  {
    id: "auditoriya", role: "CEO", theme: "light",
    render: () => (
      <>
        <Head eyebrow="CEO · Maqsadli auditoriya" title="Uch tomon — bitta platforma" />
        <div className="p-grid g3">
          {([
            ["heart", "Bemorlar", "Operatsiyadan yoki shifoxonadan chiqqan, uzoq davolanadigan bemorlar va ularga qaraydigan oila aʼzolari."],
            ["stethoscope", "Shifokor va klinikalar", "Bemorini uyda ham kuzatmoqchi boʻlgan jarrohlar, terapevtlar; davlat va xususiy klinikalar."],
            ["pill", "Apteka va kuryerlar", "Retsept boʻyicha tayyor buyurtma oladigan aptekalar va yetkazib beruvchilar."],
          ] as [IconName, string, string][]).map(([ic, t, x], i) => (
            <div key={t} className="p-card a a-up" style={d(250 + i * 150)}>
              <span className="p-ic"><Icon name={ic} size={30} /></span>
              <h3>{t}</h3>
              <p>{x}</p>
            </div>
          ))}
        </div>
        <p className="p-text a a-fade" style={d(900)}>Birinchi navbatda: Toshkent, operatsiyadan keyingi nazorat. Keyin — surunkali kasalliklar va viloyatlar.</p>
      </>
    ),
  },
  {
    id: "bozor", role: "CEO", theme: "teal",
    render: () => (
      <>
        <div className="blob b3" />
        <Head eyebrow="CEO · Bozor potensiali" title="Katta, raqamli va tez oʻsayotgan bozor" />
        <div className="p-kpis">
          <div className="a a-up" style={d(250)}><b><Count to={38.4} decimals={1} suffix=" mln" delay={300} /></b><span>Oʻzbekiston aholisi</span><small>1-aprel 2026, yillik oʻsish 1,8%</small></div>
          <div className="a a-up" style={d(400)}><b><Count to={94.2} decimals={1} suffix="%" delay={450} /></b><span>aholi internetdan foydalanadi</span><small>2025-yil yanvar–avgust</small></div>
          <div className="a a-up" style={d(550)}><b><Count to={2.14} decimals={2} prefix="$" suffix=" mlrd" delay={600} /></b><span>farmatsevtika bozori</span><small>yillik, +36,4%</small></div>
        </div>
        <p className="p-text a a-fade" style={d(1100)}><Count to={33.3} decimals={1} suffix=" mln" delay={1100} /> mobil internet abonenti — bemorga ilova orqali yetib borish uchun tayyor infratuzilma.</p>
        <p className="p-src a a-fade" style={d(1300)}>Manbalar: stat.uz (2026), Times of Central Asia (2025)</p>
      </>
    ),
  },
  {
    id: "brend", role: "CMO", theme: "dark",
    render: () => (
      <>
        <Head eyebrow="CMO · Brand positioning" title={<>“Shifokoringiz <span className="accent">uyda ham</span> yoningizda”</>} />
        <div className="p-split">
          <div className="stack-l">
            <p className="p-big a a-left" style={d(300)}>Operatsiyadan keyingi bemorlar uchun MEDIS — davolanish uyda uzilib qolmasligini taʼminlaydigan yagona ishonchli platforma.</p>
            <p className="p-text a a-left" style={d(500)}>Biz “yana bir tibbiy ilova” emasmiz: bemorni uning oʻz shifokori ulaydi va kuzatadi.</p>
          </div>
          <div className="stack-m">
            {([["shield", "Ishonch", "Faqat litsenziyasi tekshirilgan shifokorlar"], ["heart", "Gʻamxoʻrlik", "Eslatma, nazorat va SOS — bir joyda"], ["user", "Oddiylik", "Keksalar uchun katta shrift, uch tilda"]] as [IconName, string, string][]).map(([ic, t, x], i) => (
              <div key={t} className="p-value a a-right" style={d(600 + i * 160)}>
                <span className="p-ic"><Icon name={ic} size={26} /></span>
                <div><h3>{t}</h3><p>{x}</p></div>
              </div>
            ))}
          </div>
        </div>
      </>
    ),
  },
  {
    id: "target", role: "CMO", theme: "alt",
    render: () => (
      <>
        <Head eyebrow="CMO · Target audience" title="Biz kimga gapiramiz" />
        <div className="p-grid g3">
          {([
            ["45–70", "Bemor", "Operatsiyadan yoki shifoxonadan yangi chiqqan. Smartfoni bor, lekin texnologiyaga ishonchi past. Shifokorining gapiga quloq soladi.", "“Toʻgʻri davolanyapmanmi?”"],
            ["25–45", "Farzand", "Ota-onasining sogʻligʻi uchun javobgar, koʻpincha boshqa shaharda ishlaydi. Telegram va Instagramda faol.", "“Onam dorisini ichdimi?”"],
            ["20+", "Shifokor", "Kuniga 20+ bemor qabul qiladi, chiqib ketgan bemorini kuzatishga vaqti yoʻq. Obroʻsi va natijasi muhim.", "“Asorat boʻlsa, oʻz vaqtida bilay”"],
          ] as string[][]).map(([age, t, x, q], i) => (
            <div key={t} className="p-card persona a a-flip" style={d(250 + i * 180)}>
              <span className="persona-age">{age}{t === "Shifokor" ? " bemor/kun" : " yosh"}</span>
              <h3>{t}</h3>
              <p>{x}</p>
              <p className="persona-q">{q}</p>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    id: "kanallar", role: "CMO", theme: "light",
    render: () => (
      <>
        <Head eyebrow="CMO · Marketing kanallari" title="Toʻrt kanal, asosiysi — shifokorning tavsiyasi" />
        <div className="p-grid g4">
          {([
            ["stethoscope", "Shifokor va klinika", "Shifokor bemorni qabulda ulaydi; klinikada QR stend va yoʻriqnoma.", "Asosiy"],
            ["video", "Reels: Instagram, TikTok", "Shifokorlarning 60 soniyalik foydali videolari — ishonchli kontent.", ""],
            ["megaphone", "Telegram kanal va bot", "Ota-onasiga qaraydigan farzandlar uchun eslatma va holat xabarlari.", ""],
            ["pill", "Aptekalar va hamkorlar", "Hamkor aptekalarda QR-kod, sugʻurta va sport zallari bilan hamkorlik.", ""],
          ] as [IconName, string, string, string][]).map(([ic, t, x, tag], i) => (
            <div key={t} className={`p-card a a-up${tag ? " main" : ""}`} style={d(250 + i * 140)}>
              {tag ? <span className="p-tag">{tag}</span> : null}
              <span className="p-ic"><Icon name={ic} size={30} /></span>
              <h3>{t}</h3>
              <p>{x}</p>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    id: "launch", role: "CMO", theme: "light",
    render: () => (
      <>
        <Head eyebrow="CMO · Launch strategiya" title="Kichikdan boshlaymiz, isbot bilan kengayamiz" />
        <div className="p-timeline">
          <div className="tl-line a a-grow" style={d(300)} />
          {([
            ["1–4 oy", "Tayyorgarlik", "Ilova va panellar, 2 ta pilot klinika bilan kelishuv, shifokorlarni oʻqitish"],
            ["5–6 oy", "Pilot", "2 klinika, 300 bemor. Maqsad: 70% bemor dorini ilovada belgilaydi"],
            ["7–12 oy", "Toshkent", "20 klinika, reels va reklama, hamkor aptekalar"],
            ["2-yil", "Viloyatlar", "Yirik shaharlar, sugʻurta kompaniyalari bilan hamkorlik"],
          ]).map(([w, t, x], i) => (
            <div key={t} className={`tl-step a a-up${i === 1 ? " now" : ""}`} style={d(450 + i * 220)}>
              <span className="tl-dot" />
              <span className="tl-when">{w}</span>
              <h3>{t}</h3>
              <p>{x}</p>
            </div>
          ))}
        </div>
        <div className="p-note a a-fade" style={d(1500)}>
          <Icon name="check" size={26} />
          <p><b>Har bosqich oldingisining natijasi bilan ochiladi:</b> pilot maqsadlari bajarilmasa, kengaymaymiz.</p>
        </div>
      </>
    ),
  },
  {
    id: "daromad", role: "CFO", theme: "light",
    render: () => (
      <>
        <Head eyebrow="CFO · Revenue model" title="Freemium: asosiy xizmat bepul, qoʻshimcha qiymat pullik" />
        <div className="p-table">
          <div className="tr th a a-fade" style={d(200)}><span>Xizmat</span><span>Narx, soʻm</span><span>Bizning ulush</span><span>Kim toʻlaydi</span></div>
          {[
            ["Dori yetkazib berish", "12 000–20 000 + 3 000 servis", "25% + servis", "Bemor"],
            ["Operatsiyadan keyingi nazorat", "49 000 / oy", "70%", "Bemor"],
            ["Shifokor Premium", "29 000 / oy", "100%", "Shifokor"],
            ["Xususiy klinika Pro", "300 000 / oy", "100%", "Klinika"],
            ["Reels orasidagi reklama", "15 000 / 1 000 koʻrish", "100%", "Reklama beruvchi"],
          ].map((r, i) => (
            <div key={r[0]} className="tr a a-left" style={d(300 + i * 110)}>
              <span><b>{r[0]}</b></span><span className="mono">{r[1]}</span><span className="share">{r[2]}</span><span>{r[3]}</span>
            </div>
          ))}
        </div>
        <p className="p-text a a-fade" style={d(1000)}>Bepul: bemor ilovasi va navbat, shifokor oddiy hisobi, apteka va davlat klinikasi ulanishi.</p>
      </>
    ),
  },
  {
    id: "xarajat", role: "CFO", theme: "alt",
    render: () => (
      <>
        <Head eyebrow="CFO · Investment" title="Xarajatlar va mijoz jalb qilish narxi" />
        <div className="p-grid g3">
          {([
            ["Development cost", 48, " mln", "soʻm, bir martalik", "Websayt va panellarni yaratish"],
            ["Oylik operatsion xarajat", 42, " mln", "soʻm / oy", "Hosting (UZ) 3 · SMS va push 2 · qoʻllab-quvvatlash 5 · jamoa 32"],
            ["Customer acquisition cost", 25000, "", "soʻm / pullik bemor", "Shifokor tavsiyasi orqali — eng arzon kanal"],
          ] as [string, number, string, string, string][]).map(([t, v, s, u, x], i) => (
            <div key={t} className="p-card money a a-up" style={d(250 + i * 150)}>
              <span className="p-eyebrow">{t}</span>
              <b className="money-v"><Count to={v} suffix={s} delay={350 + i * 150} /></b>
              <span className="money-u">{u}</span>
              <p>{x}</p>
            </div>
          ))}
        </div>
        <p className="p-text a a-fade" style={d(1000)}>Marketing byudjeti oyiga 5 mln soʻm + har bir yangi pullik bemor uchun CAC. Prognoz TZ narxlari asosida.</p>
      </>
    ),
  },
  {
    id: "prognoz", role: "CFO", theme: "light",
    render: () => {
      const rev = [8.3, 16.5, 24.8, 33.0, 41.3, 49.5, 57.8, 66.1, 74.3, 82.6, 90.8, 99.1];
      return (
        <>
          <Head eyebrow="CFO · 12 oylik prognoz" title="Ishga tushgach 7-oydan foydaga chiqamiz" />
          <div className="p-split wide">
            <div className="p-chart">
              <p className="chart-cap a a-fade" style={d(200)}>Ishga tushgandan (pilot) keyingi oylar · daromad, mln soʻm · <span className="accent">toʻq — foyda</span>, och — zarar</p>
              <div className="bars">
                <div className="cost-line a a-fade" style={{ ...d(1900), bottom: `calc(26px + (100% - 54px) * ${52 / 110})` }}><span>Oylik xarajat ≈ 52 mln</span></div>
                {rev.map((v, i) => (
                  <div key={i} className="bar-col">
                    <span className="bar-v a a-fade" style={d(500 + i * 110)}>{Math.round(v)}</span>
                    <div className={`bar a a-bar${i >= 6 ? " profit" : ""}`} style={{ ...d(400 + i * 110), height: `calc((100% - 28px) * ${v / 110})` }} />
                    <span className="bar-m">{i + 1}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-kpi-list">
              <div className="a a-right" style={d(700)}><b><Count to={644} suffix=" mln" delay={700} /></b><span>ishga tushgandan keyingi 12 oyda, soʻm</span></div>
              <div className="a a-right" style={d(900)}><b><Count to={7} suffix="-oy" delay={900} dur={900} /></b><span>oylik break-even</span></div>
              <div className="a a-right" style={d(1100)}><b><Count to={13} suffix="-oy" delay={1100} dur={900} /></b><span>barcha xarajat qoplanadi</span></div>
              <div className="a a-right" style={d(1300)}><b><Count to={400} prefix="≈" suffix="%" delay={1300} /></b><span>ROI, 24 oy · 200 mln soʻm investitsiya</span></div>
            </div>
          </div>
          <p className="p-src a a-fade" style={d(1600)}>Taxmin: 12-oyda 1 500 nazoratdagi bemor, 3 000 buyurtma/oy, 60 Premium shifokor, 8 Pro klinika</p>
        </>
      );
    },
  },
  {
    id: "demo", role: "CTO", theme: "dark",
    render: () => (
      <div className="p-demo">
        <div className="stack-l">
          <Head eyebrow="CTO · Live demo" title="Endi — jonli saytda" />
          <p className="p-text a a-left" style={d(250)}>Websaytimiz manzili</p>
          <p className="p-url a a-pop" style={d(400)}>medis.tayyorr.uz</p>
          <p className="p-text a a-fade" style={d(600)}>Telefon kamerasini QR kodga qarating — sayt darhol ochiladi.</p>
          <a href="/" target="_blank" rel="noopener noreferrer" className="p-btn a a-up" style={d(750)}>Saytni ochish <span aria-hidden="true">↗</span></a>
        </div>
        <div className="p-qr-big a a-pop" style={d(450)}>
          <div className="p-qr-glow" />
          <QrCode size={560} tone="white" />
        </div>
      </div>
    ),
  },
  {
    id: "rahmat", role: "CTO", theme: "light",
    render: () => (
      <div className="p-end">
        <Scene3D kind="pillsCorners" className="sc-bg" />
        <div className="end-logo a a-pop" style={d(100)}>
          <span className="pulse-ring" />
          <span className="pulse-ring" style={{ animationDelay: "2.3s" }} />
          <Brand />
        </div>
        <h2 className="a a-up" style={d(450)}>Davolanish shifoxona eshigida tugamasin</h2>
        <p className="p-text a a-fade" style={d(800)}>Rahmat! Savollaringizga tayyormiz · medis.tayyorr.uz · +998 (97) 797 79 67</p>
        <Ecg className="a a-draw dark" />
      </div>
    ),
  },
];

export function Pitch() {
  const [i, setI] = useState(0);
  const [dir, setDir] = useState<"next" | "prev">("next");
  const [idle, setIdle] = useState(false);
  const touch = useRef<number | null>(null);
  const n = SLIDES.length;
  const scale = useSyncExternalStore(subscribeResize, fitScale, () => 1);
  const fullscreen = useSyncExternalStore(subscribeFullscreen, isFullscreen, () => false);

  // sichqoncha 2,5 s qimirlamasa kursor va toʻliq ekran tugmasi yashirinadi
  useEffect(() => {
    let t = setTimeout(() => setIdle(true), 2500);
    const wake = () => {
      setIdle(false);
      clearTimeout(t);
      t = setTimeout(() => setIdle(true), 2500);
    };
    window.addEventListener("mousemove", wake);
    window.addEventListener("touchstart", wake);
    return () => {
      window.removeEventListener("mousemove", wake);
      window.removeEventListener("touchstart", wake);
      clearTimeout(t);
    };
  }, []);

  const go = useCallback((to: number) => {
    const next = Math.max(0, Math.min(n - 1, to));
    setDir(next >= i ? "next" : "prev");
    setI(next);
  }, [i, n]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowRight", "PageDown", " ", "Enter"].includes(e.key)) { e.preventDefault(); setDir("next"); setI((c) => Math.min(n - 1, c + 1)); }
      else if (["ArrowLeft", "PageUp", "Backspace"].includes(e.key)) { e.preventDefault(); setDir("prev"); setI((c) => Math.max(0, c - 1)); }
      else if (e.key === "Home") go(0);
      else if (e.key === "End") go(n - 1);
      else if (e.key.toLowerCase() === "f") toggleFullscreen();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, n]);

  // slayd raqami manzilda (#5): sahifa yangilansa ham shu slaydda qoladi
  useEffect(() => {
    const apply = (hash: string) => {
      const k = Number(hash.slice(1)) - 1;
      if (Number.isInteger(k) && k >= 0 && k < n) setI(k);
    };
    const sync = () => apply(location.hash);
    const initial = location.hash; // keyingi effekt #1 yozishidan oldin oʻqib olamiz
    window.addEventListener("hashchange", sync);
    const t = setTimeout(() => apply(initial), 0);
    return () => { window.removeEventListener("hashchange", sync); clearTimeout(t); };
  }, [n]);

  useEffect(() => {
    history.replaceState(null, "", `#${i + 1}`);
  }, [i]);

  const s = SLIDES[i];

  return (
    <div
      className={`pitch t-${s.theme}${idle ? " idle" : ""}`}
      onTouchStart={(e) => { touch.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        if (touch.current === null) return;
        const dx = e.changedTouches[0].clientX - touch.current;
        if (Math.abs(dx) > 50) go(i + (dx < 0 ? 1 : -1));
        touch.current = null;
      }}
    >
      <div className="p-progress" aria-hidden="true"><span style={{ width: `${((i + 1) / n) * 100}%` }} /></div>

      <button
        className={`p-fs${idle ? " idle" : ""}`}
        onClick={(e) => { toggleFullscreen(); e.currentTarget.blur(); }}
        aria-label={fullscreen ? "Toʻliq ekrandan chiqish" : "Toʻliq ekran"}
        title="Toʻliq ekran (F)"
      >
        <Icon name={fullscreen ? "minimize" : "maximize"} size={16} />
        {fullscreen ? "Chiqish" : "Toʻliq ekran"}
      </button>

      {/* faqat sensorli ekranlarda koʻrinadi (CSS: pointer: coarse) */}
      <div className="p-touch-nav">
        <button onClick={() => go(i - 1)} disabled={i === 0} aria-label="Oldingi slayd">←</button>
        <span className="mono">{i + 1} / {n}</span>
        <button onClick={() => go(i + 1)} disabled={i === n - 1} aria-label="Keyingi slayd">→</button>
      </div>

      <div className="p-stage" style={{ transform: `translate(-50%, -50%) scale(${scale})` }}>
        <section key={s.id} className={`p-slide enter-${dir}`} aria-roledescription="slayd" aria-label={`${i + 1} / ${n}`}>
          <div className="p-inner">{s.render()}</div>
        </section>
      </div>
    </div>
  );
}
