const MONTHS = ["yan", "fev", "mar", "apr", "may", "iyun", "iyul", "avg", "sen", "okt", "noy", "dek"];

// Intl natijasi Node va brauzerda farq qilishi mumkin (gidratsiya xatosi), shuning uchun qoʻlda guruhlaymiz
export function num(n: number) {
  const [int, frac] = String(n).split(".");
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return frac ? `${grouped},${frac}` : grouped;
}

export function som(n: number) {
  return `${num(Math.round(n))} soʻm`;
}

export function compact(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(".", ",")} mln`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(n >= 10_000 ? 0 : 1).replace(".", ",")} ming`;
  return String(n);
}

// ISO satrlarni vaqt mintaqasiz oʻqiymiz, SSR va brauzer bir xil chiqarishi uchun
export function time(iso: string) {
  return iso.slice(11, 16);
}

export function date(iso: string) {
  const [, m, d] = iso.slice(0, 10).split("-").map(Number);
  return `${d}-${MONTHS[m - 1]}`;
}

export function dateTime(iso: string) {
  return `${date(iso)}, ${time(iso)}`;
}

export function age(birth: string, today = "2026-10-02") {
  const [by, bm, bd] = birth.split("-").map(Number);
  const [ty, tm, td] = today.split("-").map(Number);
  return ty - by - (tm < bm || (tm === bm && td < bd) ? 1 : 0);
}

export function initials(name: string) {
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("");
}
