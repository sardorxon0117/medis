import type { Metadata } from "next";
import { PageHead } from "@/components/ui";
import { getCourier, getPatient } from "@/lib/api";
import { CURRENT, orders, prescriptions, stock } from "@/lib/mock-data";
import { OrdersBoard, type PharmacyOrder } from "./OrdersBoard";

export const metadata: Metadata = { title: "Buyurtmalar" };

export default function Page() {
  // Apteka tashxisni koʻrmaydi: faqat dori roʻyxati, yetkazish manzili va retsept holati uzatiladi
  const list: PharmacyOrder[] = orders
    .filter((o) => o.pharmacyId === CURRENT.pharmacyId)
    .map((o) => {
      const p = getPatient(o.patientId)!;
      const rx = prescriptions.find((r) => r.id === o.prescriptionId);
      return {
        id: o.id,
        createdAt: o.createdAt,
        status: o.status,
        payment: o.payment,
        total: o.total,
        deliveryFee: o.deliveryFee,
        address: `${p.address.street} ${p.address.house}${p.address.apartment ? `, ${p.address.apartment}-xonadon` : ""}`,
        landmark: p.address.landmark ?? "",
        recipient: p.fullName.split(" ")[0],
        courier: o.courierId ? getCourier(o.courierId)?.fullName : undefined,
        rx: rx ? { id: rx.id, valid: rx.status === "faol", date: rx.date, mnns: rx.items.map((i) => i.mnn) } : undefined,
        items: o.items.map((i) => ({ ...i, inStock: stock.find((s) => s.pharmacyId === o.pharmacyId && s.mnn === i.mnn)?.qty ?? 0 })),
      };
    });

  return (
    <>
      <PageHead title="Buyurtmalar" sub="Yangi buyurtma kelganda ovozli signal chiqadi. Retseptli dori faqat amaldagi elektron retsept bilan beriladi." req="A-03 · A-04" />
      <OrdersBoard initial={list} />
    </>
  );
}
