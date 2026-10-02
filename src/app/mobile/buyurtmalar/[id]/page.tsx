"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Icon } from "@/components/Icon";
import { couriers } from "@/lib/mock-data";
import { useNow, useStore } from "../../store";
import { AppBar, Stars, money } from "../../ui";

// Holat buyurtma berilgan vaqtdan hisoblanadi (demo tezlashtirilgan): qabul → yigʻildi → yoʻlda → yetib keldi
const STEPS = [
  { at: 0, label: "Apteka qabul qildi" },
  { at: 8, label: "Dorilar yigʻildi" },
  { at: 16, label: "Kuryer yoʻlda" },
  { at: 46, label: "Kuryer yetib keldi" },
];

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const { s, set } = useStore();
  const now = useNow();
  const o = s.orders.find((x) => x.id === id);
  if (!o) {
    return (
      <div className="m-stack">
        <AppBar title="Buyurtma" back="/mobile/apteka" />
        <div className="m-empty"><Icon name="box" size={34} />Buyurtma topilmadi<Link href="/mobile/apteka" className="m-btn">Aptekaga</Link></div>
      </div>
    );
  }
  const sec = now ? Math.max(0, (now - o.createdAt) / 1000) : 0;
  const step = o.handedOver ? 4 : STEPS.filter((x) => sec >= x.at).length - 1;
  const progress = Math.min(1, Math.max(0, (sec - 16) / 30)); // kuryer yoʻlda 30 s
  const eta = step < 2 ? 25 : Math.max(1, Math.ceil((1 - progress) * 18));
  const courier = couriers[0];
  const code = String(1000 + (Number(o.id.replace(/\D/g, "")) % 9000));
  // kuryer nuqtasi yoʻl boʻylab
  const path: [number, number][] = [[60, 250], [60, 170], [160, 170], [160, 90], [300, 90], [300, 50]];
  const seg = path.length - 1;
  const t = (step >= 2 ? progress : 0) * seg;
  const i = Math.min(seg - 1, Math.floor(t));
  const f = t - i;
  const cx = path[i][0] + (path[i + 1][0] - path[i][0]) * f;
  const cy = path[i][1] + (path[i + 1][1] - path[i][1]) * f;

  return (
    <div className="m-stack">
      <AppBar title={`Buyurtma ${o.id}`} back="/mobile" />
      <div className="m-map" aria-label="Kuryer xaritada">
        <svg viewBox="0 0 360 270">
          <rect width="360" height="270" fill="#e4efe9" />
          <path d="M0 130h360M0 210h360M110 0v270M230 0v270M0 40h360" stroke="#fff" strokeWidth="14" />
          <rect x="250" y="140" width="90" height="56" rx="8" fill="#cfe6d8" />
          <rect x="20" y="60" width="70" height="50" rx="8" fill="#d6e3f0" />
          <polyline points={path.map((p) => p.join(",")).join(" ")} fill="none" stroke="#0b8e9b" strokeWidth="5" strokeLinejoin="round" strokeDasharray="10 8" />
          <circle cx="60" cy="250" r="10" fill="#1b2a4a" /><text x="76" y="255" fontSize="12" fontWeight="700" fill="#1b2a4a">{o.pharmacyName}</text>
          <circle cx="300" cy="50" r="11" fill="#d9443a" /><text x="230" y="30" fontSize="12" fontWeight="700" fill="#1b2a4a">Uyingiz</text>
          {step >= 2 && step < 4 ? <g><circle cx={cx} cy={cy} r="16" fill="#0b8e9b" opacity="0.25" /><circle cx={cx} cy={cy} r="9" fill="#0b8e9b" stroke="#fff" strokeWidth="3" /></g> : null}
        </svg>
      </div>

      {step < 4 ? (
        <div className="m-hero">
          <span className="m-label">{STEPS[Math.max(0, step)].label}</span>
          <b className="big">{step === 3 ? "Kodni kuryerga ayting" : `~${eta} daqiqa`}</b>
          {step >= 2 && <span>{courier.fullName} · {courier.transport}</span>}
          {step === 3 && (
            <>
              <b style={{ fontFamily: "var(--f-mono)", fontSize: 40, letterSpacing: "0.3em" }}>{code}</b>
              <button className="m-btn white" onClick={() => set((x) => ({ ...x, orders: x.orders.map((y) => (y.id === o.id ? { ...y, handedOver: true } : y)) }))}>Dorilarni oldim</button>
            </>
          )}
          {step >= 2 && step < 3 && <a className="m-btn glass" href={`tel:${courier.phone.replace(/\s/g, "")}`}><Icon name="phone" size={16} />Kuryerga qoʻngʻiroq</a>}
        </div>
      ) : (
        <div className="m-hero ok">
          <span className="m-label">Yetkazildi</span>
          <b className="big">Xizmatni baholang</b>
          <Stars value={o.rating ?? 0} onChange={(v) => set((x) => ({ ...x, orders: x.orders.map((y) => (y.id === o.id ? { ...y, rating: v } : y)) }))} />
          {o.rating ? <span>Rahmat! Bahoyingiz kuryer va aptekaga yetkazildi.</span> : null}
        </div>
      )}

      <div className="m-card">
        {STEPS.map((x, k) => (
          <div key={x.label} className="m-row" style={{ opacity: k <= step ? 1 : 0.4 }}>
            <span className={`m-ic ${k <= step ? "" : ""}`} style={{ width: 30, height: 30, borderRadius: 10 }}>{k <= step ? <Icon name="check" size={16} /> : k + 1}</span>
            <span>{x.label}</span>
          </div>
        ))}
      </div>
      <div className="m-card">
        {o.items.map((i) => <div key={i.tradeName} className="m-row" style={{ justifyContent: "space-between", fontSize: 14 }}><span>{i.tradeName}</span><span>{money(i.price)}</span></div>)}
        <div className="m-row" style={{ justifyContent: "space-between" }}><b>Jami ({o.payment})</b><b>{money(o.total + o.delivery + o.service)}</b></div>
        <span className="m-muted" style={{ fontSize: 12 }}>Elektron chek SMS orqali yuborildi.</span>
      </div>
    </div>
  );
}
