"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";

// Shimmer chiziq/blok. Oʻlchamni style orqali beramiz.
export function Sk({ w = "100%", h = 14, r = 8, style }: { w?: number | string; h?: number | string; r?: number; style?: CSSProperties }) {
  return <span className="sk" style={{ width: w, height: h, borderRadius: r, ...style }} aria-hidden="true" />;
}

// Sahifa ochilganda qisqa vaqt skeleton koʻrsatadi. Hozir maʼlumot mock — backend ulanganda
// bu kechikish oʻrniga haqiqiy yuklanish (Next.js loading.tsx / Suspense) ishlaydi.
export function SkeletonGate({ fallback, delay = 550, children }: { fallback: ReactNode; delay?: number; children: ReactNode }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return ready ? <div className="sk-in">{children}</div> : <div aria-busy="true" aria-label="Yuklanmoqda">{fallback}</div>;
}

export function PanelSkeleton() {
  return (
    <div className="stack" style={{ gap: 22 }}>
      <div className="stack-sm">
        <Sk w={120} h={12} />
        <Sk w="42%" h={30} r={10} />
        <Sk w="60%" h={14} />
      </div>
      <div className="stats">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="stat stack-sm">
            <Sk w="55%" h={12} />
            <Sk w="40%" h={28} r={10} />
            <Sk w="70%" h={11} />
          </div>
        ))}
      </div>
      <div className="grid-main">
        <div className="card stack">
          <Sk w="35%" h={18} />
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="row">
              <Sk w={38} h={38} r={19} />
              <div className="grow stack-sm"><Sk w="50%" h={13} /><Sk w="30%" h={11} /></div>
              <Sk w={80} h={22} r={11} />
            </div>
          ))}
        </div>
        <div className="card stack">
          <Sk w="45%" h={18} />
          <Sk h={160} r={12} />
          <Sk w="80%" h={12} />
        </div>
      </div>
    </div>
  );
}
