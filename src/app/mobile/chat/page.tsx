"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/Icon";
import { getDoctor } from "@/lib/api";
import { activeRx, hhmm, useStore } from "../store";
import { AppBar } from "../ui";

const REPLIES = [
  "Tushunarli. Haroratni kechqurun yana oʻlchab, ilovaga kiriting.",
  "Yaxshi. Chok atrofida qizarish kuchaysa, rasmini soʻrovnoma orqali yuboring.",
  "Ertangi qabulda koʻrishamiz. Savol boʻlsa yozing.",
];
const stamp = () => Date.now();

export default function Page() {
  const { s, set } = useStore();
  const doctor = getDoctor(activeRx.doctorId)!;
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const end = useRef<HTMLDivElement>(null);
  const mine = s.chat.filter((m) => m.from === "me").length;

  useEffect(() => { end.current?.scrollIntoView({ behavior: "smooth" }); }, [s.chat.length, typing]);

  // demo: shifokor 2 soniyadan keyin javob beradi
  useEffect(() => {
    if (!typing) return;
    const t = setTimeout(() => {
      set((x) => ({ ...x, chat: [...x.chat, { from: "doc", text: REPLIES[(mine - 1) % REPLIES.length], at: stamp() }] }));
      setTyping(false);
    }, 2000);
    return () => clearTimeout(t);
  }, [typing, mine, set]);

  return (
    <div>
      <AppBar title={doctor.fullName} back="/mobile" action={<a className="m-icon" href={`tel:${doctor.phone.replace(/\s/g, "")}`} aria-label="Qoʻngʻiroq"><Icon name="phone" size={20} /></a>} />
      <div className="m-note" style={{ marginBottom: 10 }}><Icon name="check" size={16} />Shifokoringiz chatga ruxsat bergan. Shoshilinch holatda SOS tugmasini bosing.</div>
      <div className="m-chat">
        {s.chat.map((m, i) => (
          <div key={i} className={`m-msg ${m.from}`}>{m.text}<small>{m.at ? hhmm(m.at) : "bugun"}</small></div>
        ))}
        {typing && <div className="m-msg doc" style={{ opacity: 0.7 }}>yozmoqda…</div>}
        <div ref={end} />
      </div>
      <form
        className="m-composer"
        onSubmit={(e) => {
          e.preventDefault();
          if (!text.trim()) return;
          set((x) => ({ ...x, chat: [...x.chat, { from: "me", text: text.trim(), at: stamp() }] }));
          setText("");
          setTyping(true);
        }}
      >
        <input className="m-input" placeholder="Xabar yozing…" value={text} onChange={(e) => setText(e.target.value)} aria-label="Xabar" />
        <button className="m-btn" aria-label="Yuborish" style={{ width: 52, padding: 0 }}><Icon name="send" size={20} /></button>
      </form>
    </div>
  );
}
