import Link from "next/link";

export default function NotFound() {
  return (
    <main className="wrap" style={{ minHeight: "70dvh", display: "grid", placeItems: "center", textAlign: "center" }}>
      <div className="stack" style={{ justifyItems: "center" }}>
        <span className="eyebrow">404</span>
        <h1>Sahifa topilmadi</h1>
        <p className="muted">Manzil notoʻgʻri yoki sahifa olib tashlangan.</p>
        <Link href="/" className="btn">Bosh sahifaga</Link>
      </div>
    </main>
  );
}
