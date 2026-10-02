"use client";

import { useEffect, useState } from "react";

// MEDIS bilaguzugi illyustratsiyasi: tayyor aqlli soat + MEDIS ilovasi (ekranda jonli koʻrsatkichlar)
export function Watch({ className = "", alert = false }: { className?: string; alert?: boolean }) {
  const [v, setV] = useState({ pulse: 72, spo2: 98, temp: 36.6 });

  useEffect(() => {
    const t = setInterval(() => {
      setV((p) => ({
        pulse: Math.max(66, Math.min(80, p.pulse + Math.round(Math.random() * 4 - 2))),
        spo2: Math.random() < 0.8 ? 98 : 97,
        temp: Math.round((36.5 + Math.random() * 0.3) * 10) / 10,
      }));
    }, 1600);
    return () => clearInterval(t);
  }, []);

  const pulse = alert ? 124 : v.pulse;
  const spo2 = alert ? 89 : v.spo2;

  return (
    <svg className={`watch ${className}${alert ? " is-alert" : ""}`} viewBox="0 0 400 660" role="img" aria-label="MEDIS logotipli aqlli bilaguzuk: puls, SpO₂ va harorat koʻrsatkichlari">
      <defs>
        <linearGradient id="w-band" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#0a6f7a" />
          <stop offset="0.5" stopColor="#12a3b0" />
          <stop offset="1" stopColor="#0a6f7a" />
        </linearGradient>
        <linearGradient id="w-case" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4a5568" />
          <stop offset="0.45" stopColor="#1f2737" />
          <stop offset="1" stopColor="#0d121b" />
        </linearGradient>
        <radialGradient id="w-glow" cx="0.5" cy="0.35" r="0.7">
          <stop offset="0" stopColor="#123a4a" />
          <stop offset="1" stopColor="#03070d" />
        </radialGradient>
        <linearGradient id="w-shine" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.16" />
          <stop offset="0.4" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* tasma */}
      <path d="M128 0h144l-8 150H136z" fill="url(#w-band)" />
      <path d="M136 510h128l8 150H128z" fill="url(#w-band)" />
      {[560, 590, 620].map((y) => <circle key={y} cx="200" cy={y} r="6" fill="#06505a" />)}
      <path d="M150 20v110M250 20v110M150 530v110M250 530v110" stroke="#ffffff" strokeOpacity="0.08" strokeWidth="3" />

      {/* korpus */}
      <rect x="62" y="118" width="276" height="424" rx="86" fill="url(#w-case)" />
      <rect x="62" y="118" width="276" height="424" rx="86" fill="none" stroke="#6b7a90" strokeOpacity="0.5" strokeWidth="2" />
      <rect x="336" y="250" width="16" height="64" rx="7" fill="#2b3446" stroke="#6b7a90" strokeOpacity="0.5" />
      <rect x="338" y="340" width="10" height="44" rx="5" fill="#2b3446" />

      {/* ekran */}
      <rect x="84" y="140" width="232" height="380" rx="66" fill="url(#w-glow)" />

      {/* MEDIS logotipi */}
      <image href="/brand/medis-mark.png" x="148" y="168" width="44" height="38" />
      <text x="198" y="196" fill="#e8f6f8" fontFamily="var(--font-poppins), sans-serif" fontWeight="600" fontSize="24">medis</text>

      {/* puls */}
      <g className="w-heart" style={{ transformOrigin: "136px 262px" }}>
        <path d="M136 280c-16-11-28-20-28-33 0-8 6-14 14-14 6 0 11 3 14 8 3-5 8-8 14-8 8 0 14 6 14 14 0 13-12 22-28 33z" fill={alert ? "#ff6b5f" : "#ff5a6e"} />
      </g>
      <text x="172" y="284" fill="#ffffff" fontFamily="var(--font-poppins), sans-serif" fontWeight="700" fontSize="62">{pulse}</text>
      <text x="200" y="308" textAnchor="middle" fill="#8fb3bf" fontFamily="var(--font-nunito), sans-serif" fontWeight="700" fontSize="13" letterSpacing="1.5">PULS · ZARBA/DAQ</text>

      {/* SpO2 va harorat */}
      <rect x="104" y="326" width="92" height="66" rx="18" fill="#0d2230" />
      <text x="150" y="358" textAnchor="middle" fill={alert ? "#ff8a7f" : "#2ec4d1"} fontFamily="var(--font-poppins), sans-serif" fontWeight="700" fontSize="26">{spo2}%</text>
      <text x="150" y="380" textAnchor="middle" fill="#8fb3bf" fontFamily="var(--font-nunito), sans-serif" fontWeight="700" fontSize="13">SpO₂</text>
      <rect x="204" y="326" width="92" height="66" rx="18" fill="#0d2230" />
      <text x="250" y="358" textAnchor="middle" fill="#f0c36b" fontFamily="var(--font-poppins), sans-serif" fontWeight="700" fontSize="26">{v.temp.toFixed(1).replace(".", ",")}°</text>
      <text x="250" y="380" textAnchor="middle" fill="#8fb3bf" fontFamily="var(--font-nunito), sans-serif" fontWeight="700" fontSize="13">HARORAT</text>

      {/* EKG */}
      <path className="w-ecg" d="M100 446 H160 L170 428 L182 470 L194 410 L206 458 L214 446 H300" fill="none" stroke={alert ? "#ff6b5f" : "#2ec4d1"} strokeWidth="3.5" strokeLinejoin="round" strokeLinecap="round" />
      <text x="200" y="496" textAnchor="middle" fill={alert ? "#ff8a7f" : "#6fd6a1"} fontFamily="var(--font-nunito), sans-serif" fontWeight="800" fontSize="14" letterSpacing="1.5">
        {alert ? "XAVF · SOS 10 s" : "SHIFOKOR NAZORATIDA"}
      </text>

      {/* oyna yaltirashi */}
      <rect x="84" y="140" width="232" height="380" rx="66" fill="url(#w-shine)" pointerEvents="none" />
    </svg>
  );
}
