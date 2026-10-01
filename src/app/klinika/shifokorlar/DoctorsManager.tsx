"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";
import { ApprovalBadge, Card } from "@/components/ui";
import { useToast } from "@/components/useToast";
import { initials, som } from "@/lib/format";
import type { Doctor } from "@/lib/types";

interface Invite {
  phone: string;
  specialty: string;
}

export function DoctorsManager({ initial }: { initial: Doctor[] }) {
  const [list, setList] = useState(initial);
  const [invites, setInvites] = useState<Invite[]>([{ phone: "+998 95 120 30 40", specialty: "Terapevt" }]);
  const [phone, setPhone] = useState("");
  const [specialty, setSpecialty] = useState("");
  const toast = useToast();

  return (
    <div className="grid-main">
      <Card title={`Klinika shifokorlari (${list.length})`} flush>
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Shifokor</th><th>Litsenziya</th><th className="num">Narx</th><th>Holat</th><th /></tr></thead>
            <tbody>
              {list.map((d) => (
                <tr key={d.id}>
                  <td>
                    <div className="row">
                      <span className="avatar">{initials(d.fullName)}</span>
                      <div><b>{d.fullName}</b><div className="xs muted">{d.specialty} · {d.experienceYears} yil</div></div>
                    </div>
                  </td>
                  <td className="mono small">{d.licenseNo}</td>
                  <td className="num small">{som(d.price)}</td>
                  <td><ApprovalBadge status={d.approval} /></td>
                  <td className="num">
                    <button
                      className="btn ghost xs"
                      onClick={() => {
                        if (!confirm(`${d.fullName} klinikadan uzilsinmi? Uning nazoratdagi bemorlari saqlanib qoladi.`)) return;
                        setList(list.filter((x) => x.id !== d.id));
                        toast.show(`${d.fullName} klinikadan uzildi`);
                      }}
                    >
                      Uzish
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="stack">
        <Card title="Shifokorni taklif qilish">
          <form
            className="stack"
            onSubmit={(e) => {
              e.preventDefault();
              setInvites([{ phone, specialty }, ...invites]);
              toast.show(`${phone} raqamiga SMS-taklif yuborildi`);
              setPhone("");
              setSpecialty("");
            }}
          >
            <div className="field"><label htmlFor="inv-phone">Telefon raqami</label><input id="inv-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+998 90 000 00 00" required /></div>
            <div className="field"><label htmlFor="inv-spec">Mutaxassislik</label><input id="inv-spec" value={specialty} onChange={(e) => setSpecialty(e.target.value)} required /></div>
            <button className="btn"><Icon name="plus" size={16} />Taklif yuborish</button>
          </form>
        </Card>
        <Card title="Kutilayotgan takliflar">
          {invites.length ? invites.map((i) => (
            <div key={i.phone} className="spread small" style={{ padding: "8px 0", borderBottom: "1px solid var(--line)" }}>
              <span><b className="mono">{i.phone}</b><div className="xs muted">{i.specialty}</div></span>
              <button className="btn ghost xs" onClick={() => setInvites(invites.filter((x) => x !== i))}>Bekor qilish</button>
            </div>
          )) : <span className="muted small">Taklif yoʻq</span>}
        </Card>
      </div>
      {toast.node}
    </div>
  );
}
