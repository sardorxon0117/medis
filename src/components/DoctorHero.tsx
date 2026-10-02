import Image from "next/image";

// Muqova: shifokor surati (public/brand/nurse.png, fonsiz) va atrofida suzuvchi 3D kartochkalar
export function DoctorHero() {
  return (
    <div className="dr-hero">
      <svg viewBox="0 0 520 640" className="dr-back" aria-hidden="true">
        <defs>
          <radialGradient id="dr-bg" cx="0.5" cy="0.45" r="0.55">
            <stop offset="0" stopColor="#2ec4d1" stopOpacity="0.55" />
            <stop offset="0.7" stopColor="#0b8e9b" stopOpacity="0.18" />
            <stop offset="1" stopColor="#0b8e9b" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="262" cy="330" r="250" fill="url(#dr-bg)" />
        <circle cx="262" cy="330" r="205" fill="none" stroke="#2ec4d1" strokeOpacity="0.35" strokeWidth="2" strokeDasharray="4 10" className="dr-orbit" />
      </svg>

      <Image src="/brand/nurse.png" alt="Stetoskop taqqan, jilmayib turgan shifokor" width={450} height={554} priority className="dr-photo" />

      <div className="dr-chip c1"><span className="dr-ic heart">❤</span><div><b>72</b><small>puls · zarba/daq</small></div></div>
      <div className="dr-chip c2"><span className="dr-ic">O₂</span><div><b>98%</b><small>SpO₂ · meʼyorda</small></div></div>
      <div className="dr-chip c3"><span className="dr-ic ok">✓</span><div><b>Retsept yuborildi</b><small>bemor ilovasida</small></div></div>
    </div>
  );
}
