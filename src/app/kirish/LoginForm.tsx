"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon, type IconName } from "@/components/Icon";
import { Logo } from "@/components/Logo";
import type { PanelKey } from "@/lib/nav";
import "./kirish.css";

const roles: { key: PanelKey; label: string; icon: IconName }[] = [
  { key: "shifokor", label: "Shifokor", icon: "stethoscope" },
  { key: "klinika", label: "Klinika", icon: "building" },
  { key: "apteka", label: "Apteka", icon: "pill" },
  { key: "reklama", label: "Reklama beruvchi", icon: "megaphone" },
  { key: "admin", label: "Admin", icon: "shield" },
];

// ikki bosqichli autentifikatsiya talab qilinadigan rollar (TZ 7.1)
const TWO_FACTOR: PanelKey[] = ["shifokor", "admin"];

// OneID (MED-ID) qaytaradigan shaxs maʼlumotlari — demo; haqiqiy integratsiyada OAuth javobidan keladi
interface Identity {
  fullName: string;
  pinfl: string;
  birthDate: string;
  phone: string;
}
const DEMO_ID: Record<PanelKey, Identity> = {
  shifokor: { fullName: "Karimova Aziza Rustamovna", pinfl: "42103876540017", birthDate: "1987-03-21", phone: "+998 90 123 45 67" },
  klinika: { fullName: "Usmonov Javohir Bahodirovich", pinfl: "31508824560031", birthDate: "1982-08-15", phone: "+998 93 210 44 05" },
  apteka: { fullName: "Tursunova Malika Odilovna", pinfl: "42711905670022", birthDate: "1990-11-27", phone: "+998 97 555 18 80" },
  reklama: { fullName: "Rahimov Dilshod Anvarovich", pinfl: "31902885430011", birthDate: "1988-02-19", phone: "+998 99 404 70 70" },
  admin: { fullName: "Ergashev Bekzod Sobirovich", pinfl: "30605915670042", birthDate: "1991-05-06", phone: "+998 95 300 12 12" },
};

type Mode = "login" | "register";
type Step = "start" | "redirect" | "consent" | "phone" | "code" | "totp" | "register" | "pending";

export function LoginForm({ initialRole }: { initialRole: PanelKey }) {
  const router = useRouter();
  const [role, setRole] = useState<PanelKey>(initialRole);
  const [mode, setMode] = useState<Mode>("login");
  const [step, setStep] = useState<Step>("start");
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [phone, setPhone] = useState("90 123 45 67");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const finish = () => router.push(`/${role}`);
  const roleLabel = roles.find((r) => r.key === role)!.label;

  // OneID ga yoʻnaltirishni imitatsiya qilamiz (haqiqiy integratsiyada — id.egov.uz OAuth)
  useEffect(() => {
    if (step !== "redirect") return;
    const t = setTimeout(() => setStep("consent"), 1300);
    return () => clearTimeout(t);
  }, [step]);

  const startOneId = (m: Mode) => {
    setMode(m);
    setError("");
    setStep("redirect");
  };

  const afterIdentity = () => {
    setIdentity(DEMO_ID[role]);
    setCode("");
    if (mode === "register") setStep("register");
    else if (TWO_FACTOR.includes(role)) setStep("totp");
    else finish();
  };

  const submitPhone = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.replace(/\D/g, "").length !== 9) return setError("Telefon raqamini toʻliq kiriting");
    setError("");
    setStep("code");
  };

  const submitCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) return setError("6 xonali kodni kiriting");
    setError("");
    setCode("");
    if (TWO_FACTOR.includes(role)) setStep("totp");
    else finish();
  };

  const submitTotp = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) return setError("Autentifikator ilovasidagi 6 xonali kodni kiriting");
    finish();
  };

  const title =
    step === "register" ? "Roʻyxatdan oʻtish" :
    step === "redirect" || step === "consent" ? "OneID orqali tasdiqlash" :
    "Panelga kirish";

  return (
    <div className="auth">
      <div className="auth-side">
        <Logo />
        <div>
          <h1>Bemorlaringiz uyda ham nazoratingizda</h1>
          <p>Shaxsingiz OneID (MED-ID) orqali tasdiqlanadi. Maʼlumotlar Oʻzbekiston hududidagi serverlarda shifrlangan holda saqlanadi.</p>
        </div>
        <div className="auth-foot muted small">OneID · TLS 1.2+ · AES-256 · Rollarga asoslangan kirish</div>
      </div>

      <div className="auth-main">
        <div className="auth-card">
          {step !== "pending" && (
            <>
              <h2>{title}</h2>
              {(step === "start" || step === "phone") && (
                <div className="role-pick" role="radiogroup" aria-label="Rol">
                  {roles.map((r) => (
                    <button key={r.key} type="button" role="radio" aria-checked={role === r.key} onClick={() => setRole(r.key)}>
                      <Icon name={r.icon} size={18} />
                      {r.label}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          {step === "start" && (
            <div className="stack">
              <button className="btn oneid" onClick={() => startOneId("login")}>
                <span className="oneid-mark" aria-hidden="true">ID</span>
                OneID orqali kirish
              </button>
              {role !== "admin" && (
                <button className="btn ghost" onClick={() => startOneId("register")}>
                  OneID orqali roʻyxatdan oʻtish
                </button>
              )}
              <p className="hint center">
                F.I.Sh., JSHSHIR va telefon raqamingiz OneID (MED-ID) dan olinadi — qoʻlda kiritish shart emas.
              </p>
              <div className="divider"><span>yoki</span></div>
              <button type="button" className="linklike center-self" onClick={() => setStep("phone")}>
                OneID ishlamasa: telefon raqami orqali kirish
              </button>
            </div>
          )}

          {step === "redirect" && (
            <div className="stack center">
              <span className="spinner" aria-hidden="true" />
              <p className="muted">OneID tizimiga yoʻnaltirilmoqda…</p>
              <p className="xs muted mono">id.egov.uz</p>
            </div>
          )}

          {step === "consent" && (
            <div className="stack">
              <div className="consent">
                <div className="row"><span className="oneid-mark" aria-hidden="true">ID</span><b>OneID — yagona identifikatsiya tizimi</b></div>
                <p className="small"><b>MEDIS</b> quyidagi maʼlumotlaringizdan foydalanishga ruxsat soʻramoqda:</p>
                <ul className="small">
                  <li>F.I.Sh. va tugʻilgan sana</li>
                  <li>JSHSHIR (shaxsiy identifikatsiya raqami)</li>
                  <li>Telefon raqami</li>
                  {mode === "register" && role === "shifokor" ? <li>MED-ID: tibbiy xodim maʼlumotlari</li> : null}
                </ul>
                <p className="xs muted">Ruxsatni istalgan vaqtda profil sozlamalarida qaytarib olishingiz mumkin.</p>
              </div>
              <button className="btn" onClick={afterIdentity}>Ruxsat berish</button>
              <button className="btn ghost" onClick={() => setStep("start")}>Bekor qilish</button>
            </div>
          )}

          {step === "phone" && (
            <form className="stack" onSubmit={submitPhone}>
              <div className="field">
                <label htmlFor="phone">Telefon raqami</label>
                <div className="phone-input">
                  <span>+998</span>
                  <input id="phone" inputMode="tel" autoComplete="tel-national" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                {error ? <span className="err">{error}</span> : <span className="hint">Faqat oldin OneID orqali roʻyxatdan oʻtgan hisoblar uchun</span>}
              </div>
              <button className="btn">SMS kod olish</button>
              <button type="button" className="btn ghost" onClick={() => setStep("start")}>← OneID ga qaytish</button>
            </form>
          )}

          {step === "code" && (
            <form className="stack" onSubmit={submitCode}>
              <p className="muted">+998 {phone} raqamiga 6 xonali kod yuborildi.</p>
              <div className="field">
                <label htmlFor="code">SMS kod</label>
                <input id="code" className="code-input mono" inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} autoFocus />
                {error ? <span className="err">{error}</span> : <span className="hint">Demo: istalgan 6 ta raqam</span>}
              </div>
              <button className="btn">Tasdiqlash</button>
              <button type="button" className="btn ghost" onClick={() => setStep("phone")}>Raqamni oʻzgartirish</button>
            </form>
          )}

          {step === "totp" && (
            <form className="stack" onSubmit={submitTotp}>
              {identity ? <IdentityCard id={identity} /> : null}
              <div className="row"><Icon name="lock" /><b>Ikki bosqichli tekshiruv</b></div>
              <p className="muted small">{roleLabel} hisobi uchun autentifikator ilovasidagi kod talab qilinadi.</p>
              <div className="field">
                <label htmlFor="totp">Autentifikator kodi</label>
                <input id="totp" className="code-input mono" inputMode="numeric" maxLength={6} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} autoFocus />
                {error ? <span className="err">{error}</span> : <span className="hint">Demo: istalgan 6 ta raqam</span>}
              </div>
              <button className="btn">{roleLabel} paneliga kirish</button>
            </form>
          )}

          {step === "register" && identity && <RegisterForm role={role} identity={identity} onDone={() => setStep("pending")} onBack={() => setStep("start")} />}

          {step === "pending" && (
            <div className="stack center">
              <span className="pending-ic"><Icon name="clock" size={30} /></span>
              <h2>Arizangiz tekshirilmoqda</h2>
              <p className="muted">
                Shaxsingiz OneID orqali tasdiqlandi. Endi litsenziya va hujjatlaringizni platforma administratori tekshiradi (odatda 1 ish kuni). Tasdiqlangach SMS keladi.
                {role === "shifokor" ? " Tasdiqlanmaguncha retsept yozish yopiq boʻladi." : ""}
              </p>
              <button className="btn" onClick={finish}>Demo panelni koʻrish</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function IdentityCard({ id }: { id: Identity }) {
  return (
    <div className="identity">
      <div className="row"><Icon name="shield" size={18} /><b>OneID orqali tasdiqlangan</b></div>
      <dl className="kv small">
        <dt>F.I.Sh.</dt><dd>{id.fullName}</dd>
        <dt>JSHSHIR</dt><dd className="mono">{id.pinfl}</dd>
        <dt>Tugʻilgan sana</dt><dd className="mono">{id.birthDate.split("-").reverse().join(".")}</dd>
        <dt>Telefon</dt><dd className="mono">{id.phone}</dd>
      </dl>
    </div>
  );
}

function RegisterForm({ role, identity, onDone, onBack }: { role: PanelKey; identity: Identity; onDone: () => void; onBack: () => void }) {
  // shaxs maʼlumotlari (F.I.Sh., JSHSHIR, telefon) OneID dan keladi — bu yerda faqat rolga xos maydonlar
  const fields: Record<PanelKey, { id: string; label: string; type?: string; full?: boolean; options?: string[] }[]> = {
    shifokor: [
      { id: "spec", label: "Mutaxassislik", options: ["Umumiy jarroh", "Travmatolog-ortoped", "Kardiolog", "Ginekolog", "Nevrolog", "Urolog", "Terapevt"] },
      { id: "clinic", label: "Klinika" },
      { id: "lic", label: "Litsenziya raqami", full: true },
      { id: "file", label: "Litsenziya fayli (PDF, JPG)", type: "file", full: true },
    ],
    klinika: [
      { id: "name", label: "Klinika nomi", full: true },
      { id: "type", label: "Turi", options: ["Davlat", "Xususiy"] },
      { id: "lic", label: "Litsenziya raqami" },
      { id: "addr", label: "Manzil", full: true },
      { id: "hours", label: "Ish vaqti" },
      { id: "file", label: "Litsenziya fayli", type: "file", full: true },
    ],
    apteka: [
      { id: "name", label: "Apteka nomi", full: true },
      { id: "lic", label: "Litsenziya raqami" },
      { id: "hours", label: "Ish vaqti" },
      { id: "addr", label: "Manzil", full: true },
      { id: "file", label: "Litsenziya fayli", type: "file", full: true },
    ],
    reklama: [
      { id: "name", label: "Kompaniya nomi", full: true },
      { id: "inn", label: "STIR (INN)" },
      { id: "cat", label: "Faoliyat sohasi", options: ["Klinika", "Apteka tarmogʻi", "Sport", "Sugʻurta"] },
      { id: "email", label: "Email", type: "email", full: true },
    ],
    admin: [],
  };

  return (
    <form
      className="stack"
      onSubmit={(e) => {
        e.preventDefault();
        onDone();
      }}
    >
      <IdentityCard id={identity} />
      <div className="form-grid">
        {fields[role].map((f) => (
          <div className={`field${f.full ? " full" : ""}`} key={f.id}>
            <label htmlFor={`r-${f.id}`}>{f.label}</label>
            {f.options ? (
              <select id={`r-${f.id}`}>{f.options.map((o) => <option key={o}>{o}</option>)}</select>
            ) : (
              <input id={`r-${f.id}`} type={f.type ?? "text"} required={f.type !== "file"} />
            )}
          </div>
        ))}
      </div>
      {role === "apteka" || role === "klinika" ? <p className="hint">Ulanish bepul. Davlat klinikalari uchun barcha funksiyalar bepul.</p> : null}
      <label className="check">
        <input type="checkbox" required />
        <span>Shaxsga doir maʼlumotlarni qayta ishlash shartlariga roziman</span>
      </label>
      <button className="btn">Arizani yuborish</button>
      <button type="button" className="btn ghost" onClick={onBack}>Bekor qilish</button>
    </form>
  );
}
