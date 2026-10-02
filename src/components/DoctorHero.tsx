// Muqova uchun chizilgan shifokor illyustratsiyasi (MEDIS ranglarida) va atrofida suzuvchi 3D kartochkalar
export function DoctorHero() {
  return (
    <div className="dr-hero" aria-label="Planshetda bemor pulsini kuzatayotgan shifokor illyustratsiyasi" role="img">
      <svg viewBox="0 0 520 640" className="dr-svg" aria-hidden="true">
        <defs>
          <radialGradient id="dr-bg" cx="0.5" cy="0.45" r="0.55">
            <stop offset="0" stopColor="#2ec4d1" stopOpacity="0.55" />
            <stop offset="0.7" stopColor="#0b8e9b" stopOpacity="0.18" />
            <stop offset="1" stopColor="#0b8e9b" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="dr-coat" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="1" stopColor="#d9e5e9" />
          </linearGradient>
          <linearGradient id="dr-coat-side" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#c9d7dc" />
            <stop offset="0.35" stopColor="#f4f8f9" stopOpacity="0" />
            <stop offset="0.65" stopColor="#f4f8f9" stopOpacity="0" />
            <stop offset="1" stopColor="#c9d7dc" />
          </linearGradient>
          <linearGradient id="dr-skin" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#e7b08c" />
            <stop offset="1" stopColor="#d79a74" />
          </linearGradient>
          <linearGradient id="dr-scrub" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#12a7b4" />
            <stop offset="1" stopColor="#0a7a86" />
          </linearGradient>
          <linearGradient id="dr-tab" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#24324f" />
            <stop offset="1" stopColor="#0d1526" />
          </linearGradient>
        </defs>

        <circle cx="262" cy="330" r="250" fill="url(#dr-bg)" />
        <circle cx="262" cy="330" r="205" fill="none" stroke="#2ec4d1" strokeOpacity="0.35" strokeWidth="2" strokeDasharray="4 10" className="dr-orbit" />

        {/* tana va xalat */}
        <path d="M60 640 C70 528 130 462 206 438 L262 476 L318 438 C394 462 454 528 464 640 Z" fill="url(#dr-coat)" />
        <path d="M60 640 C70 528 130 462 206 438 L262 476 L318 438 C394 462 454 528 464 640 Z" fill="url(#dr-coat-side)" />
        <path d="M214 432 L262 512 L310 432 Z" fill="url(#dr-scrub)" />
        <path d="M206 438 L262 512 L236 572 L168 476 Z" fill="#eef4f6" stroke="#cddbe0" strokeWidth="2" strokeLinejoin="round" />
        <path d="M318 438 L262 512 L288 572 L356 476 Z" fill="#eef4f6" stroke="#cddbe0" strokeWidth="2" strokeLinejoin="round" />
        <path d="M262 512 L262 640" stroke="#cddbe0" strokeWidth="2" />
        {[560, 600].map((y) => <circle key={y} cx="276" cy={y} r="5" fill="#cddbe0" />)}

        {/* boʻyin */}
        <path d="M236 380 L236 430 Q262 452 288 430 L288 380 Z" fill="#cf9069" />
        <path d="M216 430 Q262 466 308 430" fill="none" stroke="#0a7a86" strokeWidth="9" strokeLinecap="round" />

        {/* MEDIS nishoni */}
        <g transform="translate(322 486) rotate(-4)">
          <rect width="84" height="30" rx="9" fill="#ffffff" stroke="#c9dde3" strokeWidth="2" />
          <image href="/brand/medis-mark.png" x="7" y="5" width="23" height="20" />
          <text x="34" y="20.5" fontFamily="var(--font-poppins), sans-serif" fontWeight="700" fontSize="13" fill="#1b2a4a">medis</text>
        </g>

        {/* stetoskop */}
        <path d="M222 432 C210 482 214 526 244 546 C268 562 296 552 304 526" fill="none" stroke="#1b2a4a" strokeWidth="7" strokeLinecap="round" />
        <path d="M304 526 C310 560 318 584 330 600" fill="none" stroke="#1b2a4a" strokeWidth="7" strokeLinecap="round" />
        <path d="M302 432 C306 458 306 490 304 526" fill="none" stroke="#1b2a4a" strokeWidth="7" strokeLinecap="round" />
        <circle cx="332" cy="612" r="16" fill="#d6dee3" stroke="#1b2a4a" strokeWidth="5" />
        <circle cx="332" cy="612" r="7" fill="#8fa3b0" />

        {/* bosh (boʻyin qisqa koʻrinishi uchun pastroqda) */}
        <g transform="translate(0 40)">
        <ellipse cx="196" cy="292" rx="12" ry="18" fill="#d79a74" />
        <ellipse cx="328" cy="292" rx="12" ry="18" fill="#d79a74" />
        <ellipse cx="262" cy="284" rx="67" ry="80" fill="url(#dr-skin)" />
        {/* soch */}
        <circle cx="262" cy="196" r="30" fill="#2a1c19" />
        <path d="M193 292 C182 206 232 186 262 188 C312 188 344 222 331 296 C324 252 300 232 262 232 C222 232 200 252 193 292 Z" fill="#2a1c19" />
        <path d="M200 246 C214 222 246 214 276 220" fill="none" stroke="#45302b" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
        {/* yuz */}
        <path d="M226 268 q13 -9 26 0" fill="none" stroke="#2a1c19" strokeWidth="4.5" strokeLinecap="round" />
        <path d="M272 268 q13 -9 26 0" fill="none" stroke="#2a1c19" strokeWidth="4.5" strokeLinecap="round" />
        <ellipse cx="239" cy="287" rx="5.5" ry="6.5" fill="#1d1412" />
        <ellipse cx="285" cy="287" rx="5.5" ry="6.5" fill="#1d1412" />
        <circle cx="241" cy="285" r="1.8" fill="#ffffff" />
        <circle cx="287" cy="285" r="1.8" fill="#ffffff" />
        <path d="M262 294 q-7 18 3 22" fill="none" stroke="#b97a57" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M243 326 q19 15 38 0" fill="none" stroke="#8a3f35" strokeWidth="4.5" strokeLinecap="round" />
        <circle cx="226" cy="312" r="10" fill="#f0846f" opacity="0.28" />
        <circle cx="298" cy="312" r="10" fill="#f0846f" opacity="0.28" />
        </g>

        {/* qoʻl va planshet */}
        <path d="M76 640 C84 588 114 556 152 548 L178 600 L150 640 Z" fill="url(#dr-coat)" stroke="#cddbe0" strokeWidth="2" />
        <g transform="rotate(-9 190 540)">
          <rect x="104" y="470" width="176" height="124" rx="16" fill="url(#dr-tab)" />
          <rect x="114" y="480" width="156" height="104" rx="10" fill="#0a1120" />
          <text x="126" y="506" fontFamily="var(--font-nunito), sans-serif" fontWeight="800" fontSize="11" fill="#8fb3bf" letterSpacing="1">PULS</text>
          <text x="126" y="540" fontFamily="var(--font-poppins), sans-serif" fontWeight="700" fontSize="30" fill="#ffffff">72</text>
          <path d="M122 566 H170 L178 552 L188 578 L198 544 L208 570 L214 566 H262" fill="none" stroke="#2ec4d1" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" className="dr-ecg" />
          <circle cx="252" cy="500" r="6" fill="#6fd6a1" />
        </g>
        <ellipse cx="118" cy="566" rx="20" ry="26" fill="url(#dr-skin)" transform="rotate(-20 118 566)" />
        <ellipse cx="276" cy="548" rx="16" ry="22" fill="url(#dr-skin)" transform="rotate(25 276 548)" />
      </svg>

      <div className="dr-chip c1"><span className="dr-ic heart">❤</span><div><b>72</b><small>puls · zarba/daq</small></div></div>
      <div className="dr-chip c2"><span className="dr-ic">O₂</span><div><b>98%</b><small>SpO₂ · meʼyorda</small></div></div>
      <div className="dr-chip c3"><span className="dr-ic ok">✓</span><div><b>Retsept yuborildi</b><small>bemor ilovasida</small></div></div>
    </div>
  );
}
