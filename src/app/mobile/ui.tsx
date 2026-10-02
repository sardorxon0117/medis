"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { Icon, type IconName } from "@/components/Icon";

export function AppBar({ title, back, action }: { title: string; back?: string | true; action?: ReactNode }) {
  const router = useRouter();
  return (
    <header className="m-bar">
      {back ? (
        typeof back === "string" ? (
          <Link href={back} className="m-icon" aria-label="Orqaga"><Icon name="back" size={22} /></Link>
        ) : (
          <button className="m-icon" aria-label="Orqaga" onClick={() => router.back()}><Icon name="back" size={22} /></button>
        )
      ) : null}
      <h1>{title}</h1>
      <span className="m-bar-act">{action}</span>
    </header>
  );
}

export function MenuLink({ href, icon, title, sub, badge }: { href: string; icon: IconName; title: string; sub?: string; badge?: ReactNode }) {
  return (
    <Link href={href} className="m-menu">
      <span className="m-ic"><Icon name={icon} size={20} /></span>
      <span className="m-grow"><b>{title}</b>{sub ? <small>{sub}</small> : null}</span>
      {badge}
      <Icon name="chevron" size={18} className="m-chev" />
    </Link>
  );
}

export function Stars({ value, onChange, size = 30 }: { value: number; onChange?: (v: number) => void; size?: number }) {
  return (
    <div className="m-stars" role={onChange ? "radiogroup" : undefined} aria-label="Baho">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" disabled={!onChange} aria-label={`${n} baho`} aria-pressed={n <= value} onClick={() => onChange?.(n)} style={{ fontSize: size }}>
          ★
        </button>
      ))}
    </div>
  );
}

export function money(n: number) {
  return `${String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} soʻm`;
}

const MONTHS = ["yan", "fev", "mar", "apr", "may", "iyun", "iyul", "avg", "sen", "okt", "noy", "dek"];
export function dayLabel(iso: string) {
  const [, m, d] = iso.split("-").map(Number);
  return `${d}-${MONTHS[m - 1]}`;
}
