"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import { Icon, type IconName } from "@/components/Icon";
import { Sk, SkeletonGate } from "@/components/Skeleton";
import { getDoctor } from "@/lib/api";
import { MobileStore, patient, useStore } from "./store";

const TABS: { href: string; label: string; icon: IconName }[] = [
  { href: "/mobile", label: "Bosh", icon: "home" },
  { href: "/mobile/retseptlar", label: "Retsept", icon: "rx" },
  { href: "/mobile/navbat", label: "Navbat", icon: "calendar" },
  { href: "/mobile/apteka", label: "Apteka", icon: "cart" },
  { href: "/mobile/profil", label: "Profil", icon: "user" },
];

// serverda false, brauzerda gidratsiyadan keyin true — localStorage ga bogʻliq qismlar faqat shundan keyin chiziladi
const noop = () => () => {};
const useHydrated = () => useSyncExternalStore(noop, () => true, () => false);

export function MobileShell({ children }: { children: ReactNode }) {
  return (
    <MobileStore>
      <Shell>{children}</Shell>
    </MobileStore>
  );
}

function Shell({ children }: { children: ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const { s } = useStore();
  const hydrated = useHydrated();
  const auth = path === "/mobile/kirish";

  // kirmagan foydalanuvchi — kirish sahifasiga
  useEffect(() => {
    if (!s.loggedIn && !auth) router.replace("/mobile/kirish");
  }, [s.loggedIn, auth, router]);

  const active = (href: string) => (href === "/mobile" ? path === href : path.startsWith(href));
  const fullscreen = path === "/mobile/reels";

  return (
    <div className={`m-root${hydrated && s.largeFont ? " m-lg" : ""}`}>
      <div className={`m-frame${fullscreen ? " m-dark" : ""}`}>
        <div className="m-page">
          <SkeletonGate key={path} fallback={<MobileSkeleton />} delay={500}>{children}</SkeletonGate>
        </div>
        {hydrated && !auth && s.loggedIn && <Sos raised={path === "/mobile/chat" || path === "/mobile/reels"} />}
        {!auth && (
          <nav className="m-tabs" aria-label="Asosiy menyu">
            {TABS.map((t) => (
              <Link key={t.href} href={t.href} aria-current={active(t.href) ? "page" : undefined}>
                <Icon name={t.icon} size={22} />
                {t.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </div>
  );
}

function MobileSkeleton() {
  return (
    <div className="m-sk">
      <div className="m-sk-bar"><Sk w={28} h={28} r={10} /><Sk w="45%" h={18} /></div>
      <Sk h={150} r={22} />
      <Sk w="35%" h={12} />
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="m-sk-row"><Sk w={44} h={44} r={14} /><div style={{ flex: 1, display: "grid", gap: 8 }}><Sk w="60%" h={13} /><Sk w="35%" h={11} /></div></div>
      ))}
    </div>
  );
}

// SOS (B-08): 10 soniyalik bekor qilish taymeri, keyin 103, shifokor va yaqinlarga xabar
type SosState = { phase: "idle" } | { phase: "count"; left: number } | { phase: "sent"; shown: number };

// raised: pastda yozish maydoni boʻlgan sahifalarda tugma uning ustiga tushmasligi uchun yuqoriroq
function Sos({ raised }: { raised: boolean }) {
  const { s, set } = useStore();
  const [st, setSt] = useState<SosState>({ phase: "idle" });
  const doctor = getDoctor("d1")!.fullName;
  const home = s.addresses.find((a) => a.primary) ?? s.addresses[0];

  useEffect(() => {
    if (st.phase === "count") {
      const t = setTimeout(() => {
        if (st.left <= 1) {
          setSt({ phase: "sent", shown: 0 });
          set((x) => ({ ...x, sosLog: [{ at: Date.now(), source: "tugma", cancelled: false }, ...x.sosLog] }));
        } else setSt({ phase: "count", left: st.left - 1 });
      }, 1000);
      return () => clearTimeout(t);
    }
    if (st.phase === "sent" && st.shown < 4) {
      const t = setTimeout(() => setSt({ phase: "sent", shown: st.shown + 1 }), 550);
      return () => clearTimeout(t);
    }
  }, [st, set]);

  const notify = s.family.filter((f) => f.getSos);
  const lines = [
    `103 ga yuborildi: ${home.street} ${home.house}${home.apt ? `, ${home.apt}-xonadon` : ""} (${home.landmark})`,
    `Tashxis (${patient.diagnoses[0]}) va oxirgi koʻrsatkichlar ilova qilindi`,
    `Shifokor ${doctor} xabardor qilindi`,
    notify.length ? `SMS: ${notify.map((f) => f.name).join(", ")}` : "Yaqinlar roʻyxati boʻsh",
  ];

  return (
    <>
      {st.phase === "idle" && (
        <button className={`m-sos${raised ? " raised" : ""}`} onClick={() => setSt({ phase: "count", left: 10 })} aria-label="SOS — tez yordam chaqirish">SOS</button>
      )}
      {st.phase === "count" && (
        <div className="m-overlay" role="alertdialog" aria-label="SOS taymeri">
          <span className="m-ov-label">SOS tugmasi bosildi</span>
          <div className="m-count" style={{ "--p": `${st.left * 10}` } as React.CSSProperties}><span>{st.left}</span></div>
          <p>{st.left} soniyadan keyin tez yordam chaqiriladi</p>
          <button
            className="m-ov-btn"
            onClick={() => {
              setSt({ phase: "idle" });
              set((x) => ({ ...x, sosLog: [{ at: Date.now(), source: "tugma", cancelled: true }, ...x.sosLog] }));
            }}
          >
            Bekor qilish
          </button>
        </div>
      )}
      {st.phase === "sent" && (
        <div className="m-overlay sent" role="alertdialog" aria-label="Yordam yoʻlda">
          <span className="m-ov-ic"><Icon name="siren" size={34} /></span>
          <b className="m-ov-title">Yordam yoʻlda</b>
          <ul className="m-ov-list">{lines.slice(0, st.shown).map((x) => <li key={x}><Icon name="check" size={16} />{x}</li>)}</ul>
          <a className="m-ov-btn call" href="tel:103"><Icon name="phone" size={16} />103 ga qoʻngʻiroq</a>
          <p className="m-ov-note">Internet boʻlmasa ilova avtomatik 103 ga qoʻngʻiroqni ochadi.</p>
          <button className="m-ov-link" onClick={() => setSt({ phase: "idle" })}>Yopish</button>
        </div>
      )}
    </>
  );
}
