import Link from "next/link";

export function LogoMark() {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true">
      <rect width="40" height="40" rx="11" fill="#1B2A4A" />
      <circle cx="20" cy="20" r="13" fill="none" stroke="#2EC4D1" strokeWidth="2.6" />
      <path d="M5 21h8l3-7 4 13 3-9 2 3h10" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="logo" aria-label="MEDIS bosh sahifa">
      <LogoMark />
      medis
    </Link>
  );
}
