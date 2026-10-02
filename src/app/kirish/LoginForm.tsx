"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon, type IconName } from "@/components/Icon";
import { Logo } from "@/components/Logo";
import type { PanelKey } from "@/lib/nav";
import { IDENTITIES, MEDID, ORGS_BY_OWNER, type Identity } from "@/lib/registry";
import { clinics, pharmacies } from "@/lib/mock-data";
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

// Shaxs, MED-ID va tashkilotlar maʼlumotlari davlat tizimlaridan keladi (demo: src/lib/registry.ts)
const DEMO_ID: Record<PanelKey, Identity> = IDENTITIES;
const orgsOf = (id: Identity | null) => (id ? ORGS_BY_OWNER[id.pinfl] ?? [] : []);
const ORG_ROLES: PanelKey[] = ["klinika", "apteka", "reklama"];
// MEDIS ga ulangan tashkilot admin tomonidan tasdiqlanganmi (TZ 4.8)
const approved = (id: string) => [...clinics, ...pharmacies].find((x) => x.id === id)?.approval !== "tekshirilmoqda";

type Mode = "login" | "register";
type Step = "start" | "redirect" | "consent" | "phone" | "code" | "totp" | "org" | "register" | "pending";

export function LoginForm({ initialRole }: { initialRole: PanelKey }) {
  const router = useRouter();
  const [role, setRole] = useState<PanelKey>(initialRole);
  const [mode, setMode] = useState<Mode>("login");
  const [step, setStep] = useState<Step>("start");
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [phone, setPhone] = useState("90 123 45 67");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [org, setOrg] = useState<string | null>(null);

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
    const id = DEMO_ID[role];
    setIdentity(id);
    setCode("");
    const ready = orgsOf(id).filter((o) => o.connected && approved(o.id));
    if (mode === "register") setStep("register");
    else if (TWO_FACTOR.includes(role)) setStep("totp");
    else if (ORG_ROLES.includes(role) && ready.length) { setOrg(ready[0].id); setStep("org"); }
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
    step === "org" ? "Qaysi tashkilot paneliga kirasiz?" :
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
                  {role === "shifokor" ? <li>MED-ID: mutaxassislik, litsenziya va ish joyi</li> : null}
                  {ORG_ROLES.includes(role) ? <li>Davlat reyestri: nomingizdagi {role === "reklama" ? "kompaniyalar (STIR)" : role === "klinika" ? "klinikalar va litsenziyalar" : "aptekalar va litsenziyalar"}</li> : null}
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

          {step === "org" && identity && (
            <div className="stack">
              <IdentityCard id={identity} />
              <p className="small muted">Davlat reyestri boʻyicha sizning nomingizdagi tashkilotlar:</p>
              <div className="stack-sm">
                {orgsOf(identity).map((o) => {
                  const ok = o.connected && approved(o.id);
                  return (
                    <label key={o.id} className={`org-pick${org === o.id ? " on" : ""}${ok ? "" : " done"}`} style={ok ? undefined : { opacity: 0.6 }}>
                      <input type="radio" name="org" disabled={!ok} checked={org === o.id} onChange={() => setOrg(o.id)} />
                      <span className="grow"><b>{o.name}</b><small>{o.address}{o.license ? ` · litsenziya ${o.license}` : ""}</small></span>
                      {!o.connected ? <span className="badge">Ulanmagan</span> : !ok ? <span className="badge warn">Admin tasdigʻi kutilmoqda</span> : null}
                    </label>
                  );
                })}
              </div>
              {orgsOf(identity).some((o) => !o.connected) && <p className="hint">Ulanmagan tashkilotni “OneID orqali roʻyxatdan oʻtish” orqali qoʻshing.</p>}
              <button className="btn" onClick={finish}>{roleLabel} paneliga kirish</button>
            </div>
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

          {step === "register" && identity && <RegisterForm role={role} identity={identity} onDone={(instant) => (instant ? finish() : setStep("pending"))} onBack={() => setStep("start")} />}

          {step === "pending" && (
            <div className="stack center">
              <span className="pending-ic"><Icon name="clock" size={30} /></span>
              <h2>Ulanish arizasi yuborildi</h2>
              <p className="muted">
                Shaxsingiz OneID orqali, tashkilot va litsenziya maʼlumotlari davlat reyestridan olindi. Platforma administratori ulanishni tasdiqlaydi (odatda 1 ish kuni), tasdiqlangach SMS keladi.
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

function RegisterForm({ role, identity, onDone, onBack }: { role: PanelKey; identity: Identity; onDone: (instant: boolean) => void; onBack: () => void }) {
  const doc = role === "shifokor" ? MEDID[identity.pinfl] : undefined;
  const orgs = orgsOf(identity);
  const [picked, setPicked] = useState<string[]>(() => orgs.filter((o) => !o.connected).map((o) => o.id));

  return (
    <form
      className="stack"
      onSubmit={(e) => {
        e.preventDefault();
        onDone(role === "shifokor"); // shifokor litsenziyasi MED-ID dan tasdiqlangan — kutish shart emas
      }}
    >
      <IdentityCard id={identity} />

      {role === "shifokor" && (doc ? (
        <div className="identity">
          <div className="row"><Icon name="stethoscope" size={18} /><b>MED-ID: tibbiy xodim maʼlumotlari</b></div>
          <dl className="kv small">
            <dt>Mutaxassislik</dt><dd>{doc.specialty} · {doc.category}</dd>
            <dt>Litsenziya</dt><dd className="mono">{doc.licenseNo} · {doc.licenseUntil.split("-").reverse().join(".")} gacha</dd>
            <dt>Taʼlim</dt><dd>{doc.education}</dd>
            <dt>Ish joyi</dt><dd>{doc.workplaces.map((w) => `${w.name} (${w.position})`).join("; ")}</dd>
          </dl>
          <span className="badge ok" style={{ justifySelf: "start" }}>Litsenziya amalda — retsept yozish ochiq</span>
        </div>
      ) : (
        <div className="alert-row xavf"><span className="bar" /><div className="small">MED-ID da tibbiy xodim yozuvi topilmadi. Ish joyingiz kadrlar boʻlimiga murojaat qiling.</div></div>
      ))}

      {ORG_ROLES.includes(role) && (
        <div className="stack-sm">
          <span className="label-txt">{role === "reklama" ? "Nomingizdagi kompaniyalar (soliq reyestri)" : `Nomingizdagi ${role === "klinika" ? "klinikalar" : "aptekalar"} (litsenziyalar reyestri)`}</span>
          {orgs.length ? orgs.map((o) => (
            <label key={o.id} className={`org-pick${o.connected || picked.includes(o.id) ? " on" : ""}${o.connected ? " done" : ""}`}>
              <input type="checkbox" disabled={o.connected} checked={o.connected || picked.includes(o.id)} onChange={(e) => setPicked(e.target.checked ? [...picked, o.id] : picked.filter((x) => x !== o.id))} />
              <span className="grow">
                <b>{o.name}</b>
                <small>STIR {o.inn}{o.license ? ` · litsenziya ${o.license} (${o.licenseUntil?.split("-").reverse().join(".")} gacha)` : ""}{o.type ? ` · ${o.type}` : ""}</small>
                <small>{o.address}</small>
              </span>
              {o.connected ? (approved(o.id) ? <span className="badge ok">MEDIS ga ulangan</span> : <span className="badge warn">Admin tasdigʻi kutilmoqda</span>) : null}
            </label>
          )) : <p className="hint">Reyestrda nomingizga tashkilot topilmadi.</p>}
          <p className="hint">Nomi, STIR, litsenziya va manzil reyestrdan olinadi — qoʻlda kiritilmaydi. Ish vaqti va xizmatlarni ulangandan keyin panelda sozlaysiz.</p>
        </div>
      )}

      {role === "klinika" || role === "apteka" ? <p className="hint">Ulanish bepul. Davlat klinikalari uchun barcha funksiyalar bepul.</p> : null}
      <label className="check">
        <input type="checkbox" required />
        <span>Shaxsga doir maʼlumotlarni qayta ishlash shartlariga roziman</span>
      </label>
      <button className="btn" disabled={role === "shifokor" ? !doc : !picked.length}>
        {role === "shifokor" ? "Panelga kirish" : `Tanlanganlarni ulash (${picked.length})`}
      </button>
      <button type="button" className="btn ghost" onClick={onBack}>Bekor qilish</button>
    </form>
  );
}
