"use client";

import { useState } from "react";

// Aloqa formasi: backend ulanguncha yuborilgan soʻrov shu yerda tasdiqlanadi
export function ContactForm() {
  const [sent, setSent] = useState<string | null>(null);
  if (sent) {
    return (
      <div className="card stack" role="status">
        <h3>Rahmat, {sent}!</h3>
        <p className="muted">Soʻrovingiz qabul qilindi. Bir ish kuni ichida siz bilan bogʻlanamiz.</p>
        <button className="btn ghost" style={{ justifySelf: "start" }} onClick={() => setSent(null)}>Yana yozish</button>
      </div>
    );
  }
  return (
    <form
      className="card form-grid"
      onSubmit={(e) => {
        e.preventDefault();
        const name = new FormData(e.currentTarget).get("name");
        setSent(String(name || "").trim() || "doʻstim");
      }}
    >
      <div className="field"><label htmlFor="c-name">Ismingiz</label><input id="c-name" name="name" required autoComplete="name" /></div>
      <div className="field"><label htmlFor="c-phone">Telefon</label><input id="c-phone" name="phone" type="tel" required placeholder="+998 __ ___ __ __" autoComplete="tel" /></div>
      <div className="field full">
        <label htmlFor="c-who">Siz kimsiz?</label>
        <select id="c-who" name="who">
          <option>Klinika</option><option>Shifokor</option><option>Apteka</option><option>Bemor yoki yaqini</option><option>Investor / hamkor</option>
        </select>
      </div>
      <div className="field full"><label htmlFor="c-msg">Xabar</label><textarea id="c-msg" name="msg" placeholder="Masalan: klinikamizni pilotga ulamoqchimiz" /></div>
      <button className="btn" style={{ gridColumn: "1 / -1" }}>Yuborish</button>
    </form>
  );
}
