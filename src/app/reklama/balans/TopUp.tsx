"use client";

import { useState } from "react";
import { useToast } from "@/components/useToast";
import { som } from "@/lib/format";

const PROVIDERS = ["Click", "Payme", "Uzcard", "Humo"] as const;

export function TopUp() {
  const [amount, setAmount] = useState(1000000);
  const [provider, setProvider] = useState<(typeof PROVIDERS)[number]>("Click");
  const toast = useToast();
  return (
    <form
      className="stack"
      onSubmit={(e) => {
        e.preventDefault();
        toast.show(`${som(amount)} ${provider} orqali toʻlovga yuborildi — tasdiqlangach balansga tushadi`);
      }}
    >
      <div className="field">
        <label htmlFor="top">Summa, soʻm</label>
        <input id="top" type="number" step={100000} min={100000} value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
      </div>
      <div className="chips" role="group" aria-label="Toʻlov tizimi">
        {PROVIDERS.map((p) => (
          <button type="button" className="chip" aria-pressed={provider === p} key={p} onClick={() => setProvider(p)}>{p}</button>
        ))}
      </div>
      <button className="btn" disabled={amount < 100000}>{som(amount)} toʻlash</button>
      <p className="hint">Yuridik shaxslar uchun hisob-faktura bank orqali.</p>
      {toast.node}
    </form>
  );
}
