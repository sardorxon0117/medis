import type { Metadata } from "next";
import { Icon } from "@/components/Icon";
import { ApprovalBadge, Badge, Card, PageHead } from "@/components/ui";
import { getClinic, getDoctor } from "@/lib/api";
import { CURRENT, pricing } from "@/lib/mock-data";
import { date, initials, som } from "@/lib/format";
import { ProfileForm } from "./ProfileForm";

export const metadata: Metadata = { title: "Profil" };

export default function Page() {
  const d = getDoctor(CURRENT.doctorId)!;
  return (
    <>
      <PageHead title="Profil" sub="Bemorlar qidiruvda koʻradigan maʼlumot" req="SH-11" />
      <div className="grid-main">
        <div className="stack">
          <Card>
            <div className="row" style={{ alignItems: "flex-start" }}>
              <span className="avatar lg">{initials(d.fullName)}</span>
              <div className="stack-sm grow">
                <div className="row wrap-row">
                  <h2 style={{ fontSize: 22 }}>{d.fullName}</h2>
                  {d.premiumUntil ? <Badge tone="teal" plain><Icon name="check" size={14} />Tasdiqlangan</Badge> : null}
                </div>
                <span className="muted">{d.specialty} · {d.experienceYears} yil tajriba</span>
                <div className="row wrap-row small">
                  <span><Icon name="star" size={14} /> <b>{d.rating}</b> ({d.reviews} sharh)</span>
                  <span className="muted">Litsenziya <span className="mono">{d.licenseNo}</span></span>
                  <ApprovalBadge status={d.approval} />
                </div>
                <span className="small muted">{d.clinicIds.map((id) => getClinic(id)?.name).join(" · ")}</span>
              </div>
            </div>
          </Card>
          <ProfileForm doctor={d} />
        </div>

        <Card title="Premium" req="SH-12">
          <div className="stack">
            <div><span style={{ fontFamily: "var(--f-display)", fontSize: 28, fontWeight: 700 }}>{som(pricing.doctorPremium)}</span><span className="muted"> /oy</span></div>
            <ul className="stack-sm" style={{ margin: 0, paddingLeft: 18 }}>
              <li>Profilda tasdiqlangan belgi</li>
              <li>Qidiruv natijalarida yuqorida</li>
              <li>Kengaytirilgan statistika: profil va reels koʻrishlari</li>
            </ul>
            {d.premiumUntil ? (
              <>
                <Badge tone="ok">Faol · {date(d.premiumUntil)} gacha</Badge>
                <button className="btn ghost">Uzaytirish</button>
              </>
            ) : (
              <button className="btn">Premiumga oʻtish</button>
            )}
            <p className="hint">Toʻlov: Click, Payme, Uzcard, Humo. Oddiy hisob bepul qoladi.</p>
          </div>
        </Card>
      </div>
    </>
  );
}
