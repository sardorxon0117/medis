"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";
import { ApprovalBadge, Card } from "@/components/ui";
import { useToast } from "@/components/useToast";
import { initials, som } from "@/lib/format";
import { findInMedId } from "@/lib/registry";
import type { Doctor } from "@/lib/types";

interface Invite {
  name: string;
  phone: string;
  specialty: string;
  license: string;
}

export function DoctorsManager({ initial }: { initial: Doctor[] }) {
  const [list, setList] = useState(initial);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [query, setQuery] = useState("");
  // shifokor maʼlumoti va litsenziyasi MED-ID dan olinadi — klinika qoʻlda kiritmaydi
  const hit = findInMedId(query);
  const already = hit ? invites.some((i) => i.license === hit[1].licenseNo) : false;
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
              if (!hit || already) return;
              const [, d] = hit;
              setInvites([{ name: d.fullName, phone: d.phone, specialty: d.specialty, license: d.licenseNo }, ...invites]);
              toast.show(`${d.fullName} ga taklif yuborildi (SMS va MEDIS ilovasi)`);
              setQuery("");
            }}
          >
            <div className="field">
              <label htmlFor="inv-q">Telefon yoki JSHSHIR</label>
              <input id="inv-q" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Demo: 95 120 30 40" />
              <span className="hint">Shifokor MED-ID dan qidiriladi: mutaxassislik va litsenziya avtomatik keladi.</span>
            </div>
            {query.replace(/\D/g, "").length >= 7 && (hit ? (
              <div className="card" style={{ background: "var(--ok-soft)", borderColor: "transparent", padding: 14 }}>
                <div className="row small" style={{ color: "var(--ok)" }}><Icon name="shield" size={16} /><b>MED-ID da topildi</b></div>
                <b>{hit[1].fullName}</b>
                <span className="small">{hit[1].specialty} · {hit[1].category}</span>
                <span className="small mono">Litsenziya {hit[1].licenseNo} · {hit[1].licenseUntil.split("-").reverse().join(".")} gacha</span>
              </div>
            ) : <span className="small" style={{ color: "var(--danger)" }}>MED-ID da bunday tibbiy xodim topilmadi</span>)}
            <button className="btn" disabled={!hit || already}><Icon name="plus" size={16} />{already ? "Taklif yuborilgan" : "Taklif yuborish"}</button>
          </form>
        </Card>
        <Card title="Kutilayotgan takliflar">
          {invites.length ? invites.map((i) => (
            <div key={i.license} className="spread small" style={{ padding: "8px 0", borderBottom: "1px solid var(--line)" }}>
              <span><b>{i.name}</b><div className="xs muted">{i.specialty} · {i.license} · {i.phone}</div></span>
              <button className="btn ghost xs" onClick={() => setInvites(invites.filter((x) => x !== i))}>Bekor qilish</button>
            </div>
          )) : <span className="muted small">Taklif yoʻq</span>}
        </Card>
      </div>
      {toast.node}
    </div>
  );
}
