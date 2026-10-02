"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon } from "@/components/Icon";
import { patient, useStore } from "../store";

type Step = "start" | "redirect" | "consent" | "sms" | "code";

export default function Page() {
  const router = useRouter();
  const { set } = useStore();
  const [step, setStep] = useState<Step>("start");
  const [agree, setAgree] = useState({ medid: true, doctor: true, terms: false });
  const [code, setCode] = useState("");

  useEffect(() => {
    if (step !== "redirect") return;
    const t = setTimeout(() => setStep("consent"), 1300);
    return () => clearTimeout(t);
  }, [step]);

  const done = () => {
    set((s) => ({ ...s, loggedIn: true, consentDoctor: agree.doctor }));
    router.replace("/mobile");
  };

  return (
    <div className="m-auth">
      <div className="m-auth-logo">
        <Image src="/brand/medis-mark.png" alt="" width={314} height={269} priority />
        <span className="logo-word" style={{ height: 30, color: "var(--fg)" }} aria-hidden="true" />
      </div>

      {step === "start" && (
        <>
          <div className="m-stack" style={{ gap: 6 }}>
            <h1 style={{ fontSize: 28 }}>Shifoxonadan keyin ham shifokor nazoratida</h1>
            <p className="m-muted">Retsept, dori eslatmasi, bilaguzuk va SOS — bitta ilovada.</p>
          </div>
          <button className="m-btn block m-oneid" onClick={() => setStep("redirect")}>
            <span className="m-oneid-mark">ID</span>OneID orqali kirish
          </button>
          <p className="m-muted" style={{ textAlign: "center" }}>Shaxsingiz OneID (MED-ID) orqali tasdiqlanadi — maʼlumotlarni qoʻlda kiritish shart emas.</p>
          <button className="m-btn ghost block" onClick={() => setStep("sms")}>Telefon raqami orqali (zaxira)</button>
        </>
      )}

      {step === "redirect" && (
        <div className="m-stack" style={{ textAlign: "center" }}>
          <span className="m-spinner" />
          <p className="m-muted">OneID tizimiga yoʻnaltirilmoqda…</p>
        </div>
      )}

      {step === "consent" && (
        <div className="m-stack">
          <div className="m-card">
            <div className="m-row" style={{ color: "var(--ok)" }}><Icon name="shield" size={18} /><b>OneID orqali tasdiqlandi</b></div>
            <span><b>{patient.fullName}</b></span>
            <span className="m-muted">JSHSHIR {patient.pinfl} · {patient.phone}</span>
          </div>
          <span className="m-label">Rozilik</span>
          {([
            ["medid", "MED-ID dan tashxislar, tahlillar va operatsiyalar tarixini olish"],
            ["doctor", "Davolovchi shifokorim maʼlumotlarimni koʻrishi (istalgan vaqtda qaytarib olaman)"],
            ["terms", "Shaxsga doir maʼlumotlarni qayta ishlash shartlariga roziman"],
          ] as const).map(([k, t]) => (
            <label key={k} className="m-menu" style={{ cursor: "pointer" }}>
              <input type="checkbox" checked={agree[k]} onChange={(e) => setAgree({ ...agree, [k]: e.target.checked })} style={{ width: 22, height: 22, accentColor: "var(--teal)" }} />
              <span className="m-grow" style={{ fontSize: 14 }}>{t}</span>
            </label>
          ))}
          <button className="m-btn block" disabled={!agree.terms} onClick={done}>Davom etish</button>
        </div>
      )}

      {step === "sms" && (
        <form className="m-stack" onSubmit={(e) => { e.preventDefault(); setStep("code"); }}>
          <label className="m-field"><span>Telefon raqami</span><input className="m-input" inputMode="tel" defaultValue="+998 90 311 22 44" /></label>
          <button className="m-btn block">SMS kod olish</button>
          <button type="button" className="m-btn ghost block" onClick={() => setStep("start")}>← OneID ga qaytish</button>
        </form>
      )}

      {step === "code" && (
        <form className="m-stack" onSubmit={(e) => { e.preventDefault(); if (code.length === 6) setStep("redirect"); }}>
          <label className="m-field">
            <span>SMS kod</span>
            <input className="m-input" inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} style={{ fontSize: 24, letterSpacing: "0.4em", textAlign: "center" }} autoFocus />
            <small className="m-muted">Demo: istalgan 6 ta raqam. Keyin shaxs MED-ID orqali tasdiqlanadi.</small>
          </label>
          <button className="m-btn block" disabled={code.length !== 6}>Tasdiqlash</button>
        </form>
      )}
    </div>
  );
}
