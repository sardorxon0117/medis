"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import { Icon } from "./Icon";
import { Logo } from "./Logo";
import { panels, type PanelKey } from "@/lib/nav";
import { initials } from "@/lib/format";

function writePref(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* saqlash bloklangan boʻlsa ham ishlayveradi */
  }
}

// Mavzu va shrift holati <html> atributlarida saqlanadi (layout dagi skript qoʻyadi); React shu yerdan oʻqiydi
const listeners = new Set<() => void>();
const subscribe = (cb: () => void) => {
  listeners.add(cb);
  const mq = matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener("change", cb);
  return () => {
    listeners.delete(cb);
    mq.removeEventListener("change", cb);
  };
};
const notify = () => listeners.forEach((cb) => cb());
const isDarkNow = () => {
  const t = document.documentElement.dataset.theme;
  return t ? t === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
};
const isLargeNow = () => document.documentElement.dataset.size === "lg";

export function PanelShell({ panel, children }: { panel: PanelKey; children: React.ReactNode }) {
  const cfg = panels[panel];
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const dark = useSyncExternalStore(subscribe, isDarkNow, () => false);
  const large = useSyncExternalStore(subscribe, isLargeNow, () => false);

  const toggleTheme = () => {
    const next = dark ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    writePref("medis-theme", next);
    notify();
  };

  const toggleSize = () => {
    if (large) delete document.documentElement.dataset.size;
    else document.documentElement.dataset.size = "lg";
    writePref("medis-size", large ? "md" : "lg");
    notify();
  };

  const isActive = (href: string) =>
    href === `/${panel}` ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className={`shell${open ? " open" : ""}`}>
      <aside className="side" aria-label="Panel menyusi">
        <Logo href={`/${panel}`} />
        <div className="role-tag">{cfg.title}</div>
        <nav className="nav">
          {cfg.nav.map((item) => (
            <Link key={item.href} href={item.href} aria-current={isActive(item.href) ? "page" : undefined} onClick={() => setOpen(false)}>
              <Icon name={item.icon} />
              {item.label}
              {item.count ? <span className="count">{item.count}</span> : null}
            </Link>
          ))}
        </nav>
        <div className="side-foot">
          <div className="me">
            <span className="avatar">{initials(cfg.user.name)}</span>
            <div>
              <b>{cfg.user.name}</b>
              <span>{cfg.user.sub}</span>
            </div>
          </div>
          <Link href="/kirish">⇄ Boshqa rol bilan kirish</Link>
          <Link href="/">← Bosh sahifa</Link>
        </div>
      </aside>
      <div className="scrim" onClick={() => setOpen(false)} />
      <div className="main">
        <header className="topbar">
          <button className="icon-btn burger" aria-label="Menyuni ochish" onClick={() => setOpen(true)}>
            <Icon name="menu" />
          </button>
          <div className="search">
            <input className="input" aria-label="Qidiruv" placeholder="Qidirish: bemor, retsept, buyurtma…" />
          </div>
          <div className="tools">
            <button className="icon-btn" onClick={toggleSize} aria-pressed={large} title="Katta shrift rejimi" aria-label="Katta shrift rejimi">
              <b style={{ fontSize: 14 }}>A+</b>
            </button>
            <button className="icon-btn" onClick={toggleTheme} aria-label={dark ? "Yorugʻ rejim" : "Qorongʻi rejim"} title="Mavzu">
              <Icon name={dark ? "sun" : "moon"} />
            </button>
            <select className="input" aria-label="Til" defaultValue="uz" style={{ width: "auto", minHeight: 38, padding: "6px 10px" }}>
              <option value="uz">Oʻzbekcha</option>
              <option value="uz-cyrl">Ўзбекча</option>
              <option value="ru">Русский</option>
            </select>
          </div>
        </header>
        <main className="content">{children}</main>
      </div>
    </div>
  );
}
