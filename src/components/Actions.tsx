"use client";

import type { ReactNode } from "react";
import { useToast } from "./useToast";

// Server sahifalardagi tugmalar uchun kichik mijoz komponentlari (backend ulanguncha natija toast bilan koʻrsatiladi)

export function ActionButton({ message, className = "btn", children }: { message: string; className?: string; children: ReactNode }) {
  const toast = useToast();
  return (
    <>
      <button type="button" className={className} onClick={() => toast.show(message)}>{children}</button>
      {toast.node}
    </>
  );
}

export function SaveForm({ message, className = "stack", children }: { message: string; className?: string; children: ReactNode }) {
  const toast = useToast();
  return (
    <form className={className} onSubmit={(e) => { e.preventDefault(); toast.show(message); }}>
      {children}
      {toast.node}
    </form>
  );
}

// Excel ochadigan CSV: UTF-8 BOM va nuqta-vergul ajratgich (lotin/kirill harflari buzilmasligi uchun)
export function CsvButton({ filename, rows, className = "btn ghost sm", children }: { filename: string; rows: (string | number)[][]; className?: string; children: ReactNode }) {
  const download = () => {
    const esc = (v: string | number) => {
      const t = String(v);
      return /[;"\n]/.test(t) ? `"${t.replace(/"/g, '""')}"` : t;
    };
    const csv = "﻿" + rows.map((r) => r.map(esc).join(";")).join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };
  return <button type="button" className={className} onClick={download}>{children}</button>;
}
