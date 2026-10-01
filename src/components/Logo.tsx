import Image from "next/image";
import Link from "next/link";

// Belgi oʻz rangida (teal) chiqadi; "medis" yozuvi mask orqali currentColor bilan boʻyaladi,
// shuning uchun yorugʻ fonda toʻq koʻk, qorongʻi fonda oq boʻladi
export function Logo({ href = "/", size = 34 }: { href?: string; size?: number }) {
  return (
    <Link href={href} className="logo" aria-label="MEDIS bosh sahifa" style={{ "--logo-h": `${size}px` } as React.CSSProperties}>
      <Image src="/brand/medis-mark.png" alt="" width={314} height={269} priority className="logo-mark" />
      <span className="logo-word" aria-hidden="true" />
    </Link>
  );
}
