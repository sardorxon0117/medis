import type { Metadata } from "next";
import { ApprovalBadge, Card, PageHead } from "@/components/ui";
import { getPharmacy } from "@/lib/api";
import { CURRENT } from "@/lib/mock-data";
import { SaveForm } from "@/components/Actions";

export const metadata: Metadata = { title: "Apteka profili" };

export default function Page() {
  const ph = getPharmacy(CURRENT.pharmacyId)!;
  return (
    <>
      <PageHead title="Apteka profili" sub="Ulanish bepul, sotuvdan komissiya olinmaydi." req="A-01" />
      <div className="grid-main">
        <Card title="Maʼlumotlar" action={<ApprovalBadge status={ph.approval} />}>
          <SaveForm message="Apteka profili saqlandi">
            <div className="form-grid">
              <div className="field full"><label htmlFor="ph-name">Apteka nomi</label><input id="ph-name" defaultValue={ph.name} /></div>
              <div className="field"><label htmlFor="ph-lic">Litsenziya</label><input id="ph-lic" defaultValue={ph.license} /></div>
              <div className="field"><label htmlFor="ph-hours">Ish vaqti</label><input id="ph-hours" defaultValue={ph.workHours} /></div>
              <div className="field full"><label htmlFor="ph-addr">Manzil</label><input id="ph-addr" defaultValue={ph.address} /></div>
              <div className="field full"><label htmlFor="ph-file">Litsenziya fayli</label><input id="ph-file" type="file" accept=".pdf,image/*" /></div>
            </div>
            <button className="btn">Saqlash</button>
          </SaveForm>
        </Card>
        <Card title="Yetkazib berish">
          <dl className="kv">
            <dt>Yetkazish</dt><dd>MEDIS kuryerlari</dd>
            <dt>Radius</dt><dd>7 km</dd>
            <dt>Buyurtma signali</dt><dd>Ovoz + push</dd>
            <dt>Toʻlov</dt><dd>Haftalik, bank hisobiga</dd>
          </dl>
        </Card>
      </div>
    </>
  );
}
