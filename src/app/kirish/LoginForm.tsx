"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
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

type Step = "phone" | "code" | "totp" | "register" | "pending";

export function LoginForm({ initialRole }: { initialRole: PanelKey }) {
  const router = useRouter();
  const [role, setRole] = useState<PanelKey>(initialRole);
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("90 123 45 67");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const finish = () => router.push(`/${role}`);

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

  const roleLabel = roles.find((r) => r.key === role)!.label;

  return (
    <div className="auth">
      <div className="auth-side">
        <Logo />
        <div>
          <h1>Bemorlaringiz uyda ham nazoratingizda</h1>
          <p>Retsept, signal va navbat — bitta panelda. Maʼlumotlar Oʻzbekiston hududidagi serverlarda shifrlangan holda saqlanadi.</p>
        </div>
        <div className="auth-foot muted small">TLS 1.2+ · AES-256 · Rollarga asoslangan kirish</div>
      </div>

      <div className="auth-main">
        <div className="auth-card">
          {step !== "pending" && (
            <>
              <h2>{step === "register" ? "Roʻyxatdan oʻtish" : "Panelga kirish"}</h2>
              <div className="role-pick" role="radiogroup" aria-label="Rol">
                {roles.map((r) => (
                  <button
                    key={r.key}
                    type="button"
                    role="radio"
                    aria-checked={role === r.key}
                    onClick={() => {
                      setRole(r.key);
                      if (step !== "register") setStep("phone");
                    }}
                  >
                    <Icon name={r.icon} size={18} />
                    {r.label}
                  </button>
                ))}
              </div>
            </>
          )}

          {step === "phone" && (
            <form className="stack" onSubmit={submitPhone}>
              <div className="field">
                <label htmlFor="phone">Telefon raqami</label>
                <div className="phone-input">
                  <span>+998</span>
                  <input id="phone" inputMode="tel" autoComplete="tel-national" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                {error ? <span className="err">{error}</span> : null}
              </div>
              <button className="btn">SMS kod olish</button>
              {role !== "admin" && (
                <p className="small muted center">
                  Hisobingiz yoʻqmi?{" "}
                  <button type="button" className="linklike" onClick={() => setStep("register")}>Roʻyxatdan oʻting</button>
                </p>
              )}
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

          {step === "register" && <RegisterForm role={role} onDone={() => setStep("pending")} onBack={() => setStep("phone")} />}

          {step === "pending" && (
            <div className="stack center">
              <span className="pending-ic"><Icon name="clock" size={30} /></span>
              <h2>Arizangiz tekshirilmoqda</h2>
              <p className="muted">
                Litsenziya va hujjatlaringizni platforma administratori tekshiradi (odatda 1 ish kuni). Tasdiqlangach SMS keladi.
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

function RegisterForm({ role, onDone, onBack }: { role: PanelKey; onDone: () => void; onBack: () => void }) {
  const fields: Record<PanelKey, { id: string; label: string; type?: string; full?: boolean; options?: string[] }[]> = {
    shifokor: [
      { id: "fio", label: "F.I.Sh.", full: true },
      { id: "spec", label: "Mutaxassislik", options: ["Umumiy jarroh", "Travmatolog-ortoped", "Kardiolog", "Ginekolog", "Nevrolog", "Urolog", "Terapevt"] },
      { id: "clinic", label: "Klinika" },
      { id: "tel", label: "Telefon", type: "tel" },
      { id: "lic", label: "Litsenziya raqami" },
      { id: "file", label: "Litsenziya fayli (PDF, JPG)", type: "file", full: true },
    ],
    klinika: [
      { id: "name", label: "Klinika nomi", full: true },
      { id: "type", label: "Turi", options: ["Davlat", "Xususiy"] },
      { id: "lic", label: "Litsenziya raqami" },
      { id: "addr", label: "Manzil", full: true },
      { id: "hours", label: "Ish vaqti" },
      { id: "tel", label: "Telefon", type: "tel" },
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
      { id: "tel", label: "Telefon", type: "tel" },
      { id: "email", label: "Email", type: "email" },
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
      <button type="button" className="btn ghost" onClick={onBack}>Menda hisob bor</button>
    </form>
  );
}
