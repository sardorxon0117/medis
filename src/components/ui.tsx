import type { ReactNode } from "react";
import type { PatientState } from "@/lib/api";
import type { ApprovalStatus, AppointmentStatus, OrderStatus } from "@/lib/types";

export function PageHead({ title, sub, req, children }: { title: string; sub?: string; req?: string; children?: ReactNode }) {
  return (
    <div className="page-head">
      <div>
        <h1>
          {title}
          {req ? <span className="req">{req}</span> : null}
        </h1>
        {sub ? <p>{sub}</p> : null}
      </div>
      {children ? <div className="row wrap-row">{children}</div> : null}
    </div>
  );
}

export function Stat({ label, value, hint, tone }: { label: string; value: ReactNode; hint?: ReactNode; tone?: "danger" }) {
  return (
    <div className={`stat${tone ? ` ${tone}` : ""}`}>
      <div className="label">{label}</div>
      <div className="value">{value}</div>
      {hint ? <div className="hint">{hint}</div> : null}
    </div>
  );
}

type Tone = "ok" | "warn" | "danger" | "teal" | "";

export function Badge({ tone = "", plain, children }: { tone?: Tone; plain?: boolean; children: ReactNode }) {
  return <span className={`badge ${tone}${plain ? " plain" : ""}`}>{children}</span>;
}

const stateMap: Record<PatientState, [Tone, string]> = {
  barqaror: ["ok", "Barqaror"],
  diqqat: ["warn", "Diqqat"],
  xavf: ["danger", "Xavf"],
};
export const StateBadge = ({ state }: { state: PatientState }) => <Badge tone={stateMap[state][0]}>{stateMap[state][1]}</Badge>;

const apptMap: Record<AppointmentStatus, [Tone, string]> = {
  kutilmoqda: ["", "Kutilmoqda"],
  keldi: ["teal", "Keldi"],
  qabul_qilindi: ["ok", "Qabul qilindi"],
  kelmadi: ["danger", "Kelmadi"],
};
export const ApptBadge = ({ status }: { status: AppointmentStatus }) => <Badge tone={apptMap[status][0]}>{apptMap[status][1]}</Badge>;

const approvalMap: Record<ApprovalStatus, [Tone, string]> = {
  tekshirilmoqda: ["warn", "Tekshirilmoqda"],
  tasdiqlangan: ["ok", "Tasdiqlangan"],
  rad_etilgan: ["danger", "Rad etilgan"],
};
export const ApprovalBadge = ({ status }: { status: ApprovalStatus }) => (
  <Badge tone={approvalMap[status][0]}>{approvalMap[status][1]}</Badge>
);

export const orderLabel: Record<OrderStatus, [Tone, string]> = {
  yangi: ["danger", "Yangi"],
  qabul_qilindi: ["warn", "Yigʻilmoqda"],
  yigildi: ["teal", "Yigʻildi"],
  yolda: ["teal", "Yoʻlda"],
  yetkazildi: ["ok", "Yetkazildi"],
  rad_etildi: ["", "Rad etildi"],
};
export const OrderBadge = ({ status }: { status: OrderStatus }) => <Badge tone={orderLabel[status][0]}>{orderLabel[status][1]}</Badge>;

const modMap: Record<string, [Tone, string]> = {
  kutilmoqda: ["warn", "Moderatsiyada"],
  tasdiqlangan: ["ok", "Tasdiqlangan"],
  rad_etilgan: ["danger", "Rad etilgan"],
};
export const ModerationBadge = ({ status }: { status: string }) => <Badge tone={modMap[status][0]}>{modMap[status][1]}</Badge>;

export function Card({ title, action, children, flush, req }: { title?: ReactNode; action?: ReactNode; children: ReactNode; flush?: boolean; req?: string }) {
  return (
    <section className={`card${flush ? " flush" : ""}`}>
      {title || action ? (
        <div className="card-head">
          {title ? (
            <h2>
              {title}
              {req ? <span className="req">{req}</span> : null}
            </h2>
          ) : <span />}
          {action}
        </div>
      ) : null}
      {children}
    </section>
  );
}
