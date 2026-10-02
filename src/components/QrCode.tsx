import { useId } from "react";
import { QR_ROWS } from "@/lib/qr-medis";

// Chiroyli QR: kvadrat modullar oʻrniga dumaloq nuqtalar, yumaloq “koʻzlar”, gradient va markazda MEDIS belgisi.
// Xatoga chidamlilik H boʻlgani uchun markaz (logotip) yopilsa ham skaner oʻqiydi.
// tone="white": qorongʻi fon ustida oq (teskari) QR — zamonaviy telefon kameralari oʻqiydi.
const N = QR_ROWS.length;
const Q = 3; // atrofdagi boʻsh hoshiya (modul)
const LOGO = 7; // markazda boʻshatiladigan maydon (modul)

const inFinder = (x: number, y: number) =>
  (x < 7 && y < 7) || (x >= N - 7 && y < 7) || (x < 7 && y >= N - 7);
const inLogo = (x: number, y: number) => {
  const a = (N - LOGO) / 2;
  return x >= a && x < a + LOGO && y >= a && y < a + LOGO;
};

export function QrCode({ size = 240, tone = "color", label = "medis.tayyorr.uz sahifasini ochuvchi QR kod" }: { size?: number; tone?: "color" | "white"; label?: string }) {
  const white = tone === "white";
  const id = useId().replace(/:/g, "");
  const total = N + Q * 2;
  const dots: [number, number][] = [];
  QR_ROWS.forEach((row, y) => {
    for (let x = 0; x < N; x++) if (row[x] === "1" && !inFinder(x, y) && !inLogo(x, y)) dots.push([x, y]);
  });
  const eyes: [number, number][] = [[0, 0], [N - 7, 0], [0, N - 7]];
  const c = (N - LOGO) / 2 + Q;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${total} ${total}`} role="img" aria-label={label} className="qr">
      <defs>
        <linearGradient id={`g${id}`} x1="0" y1="0" x2={total} y2={total} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#0b8e9b" />
          <stop offset="0.55" stopColor="#1d5f8a" />
          <stop offset="1" stopColor="#1b2a4a" />
        </linearGradient>
      </defs>
      {/* oq QR uchun bir tekis toʻq plita: orqadagi nur kontrastni buzmasin */}
      <rect width={total} height={total} rx={4} fill={white ? "#0d1729" : "#ffffff"} />
      {/* chegara plita bilan bir xil shaklda (CSS border-radius bilan farq qilmasligi uchun SVG ichida) */}
      {white && <rect x={0.06} y={0.06} width={total - 0.12} height={total - 0.12} rx={3.94} fill="none" stroke="rgba(46,196,209,0.35)" strokeWidth={0.12} />}
      <g fill={white ? "#f6f8fa" : `url(#g${id})`}>
        {dots.map(([x, y]) => <circle key={`${x}-${y}`} cx={x + Q + 0.5} cy={y + Q + 0.5} r={white ? 0.47 : 0.43} />)}
        {eyes.map(([x, y]) => (
          <g key={`e${x}-${y}`}>
            <path fillRule="evenodd" d={`M${x + Q + 2.4} ${y + Q}h2.2a2.4 2.4 0 0 1 2.4 2.4v2.2a2.4 2.4 0 0 1-2.4 2.4h-2.2a2.4 2.4 0 0 1-2.4-2.4v-2.2a2.4 2.4 0 0 1 2.4-2.4zM${x + Q + 2.4} ${y + Q + 1}a1.4 1.4 0 0 0-1.4 1.4v2.2a1.4 1.4 0 0 0 1.4 1.4h2.2a1.4 1.4 0 0 0 1.4-1.4v-2.2a1.4 1.4 0 0 0-1.4-1.4z`} />
            <rect x={x + Q + 2} y={y + Q + 2} width={3} height={3} rx={1.2} fill={white ? "#f6f8fa" : "#0b8e9b"} />
          </g>
        ))}
      </g>
      {!white && <rect x={c + 0.4} y={c + 0.4} width={LOGO - 0.8} height={LOGO - 0.8} rx={1.8} fill="#ffffff" />}
      <image href="/brand/medis-mark.png" x={c + 1.1} y={c + 1.35} width={LOGO - 2.2} height={(LOGO - 2.2) * (269 / 314)} />
    </svg>
  );
}
