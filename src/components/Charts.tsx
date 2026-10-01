"use client";

import { useState } from "react";
import { compact, num } from "@/lib/format";

export interface Point {
  label: string;
  value: number;
}

const W = 640;
const PAD = { l: 40, r: 14, t: 14, b: 26 };

function scale(values: number[], limit?: number) {
  const all = limit === undefined ? values : [...values, limit];
  let min = Math.min(...all);
  let max = Math.max(...all);
  const pad = (max - min) * 0.15 || 1;
  min -= pad;
  max += pad;
  return { min, max };
}

// Chiziqli grafik: chegara chizigʻi (SH-05) va hover maslahati bilan
export function LineChart({
  data, height = 200, limit, limitDir = "above", unit = "", decimals = 0, label,
}: {
  data: Point[];
  height?: number;
  limit?: number;
  limitDir?: "above" | "below";
  unit?: string;
  decimals?: number;
  label: string;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const { min, max } = scale(data.map((d) => d.value), limit);
  const iw = W - PAD.l - PAD.r;
  const ih = height - PAD.t - PAD.b;
  const x = (i: number) => PAD.l + (data.length === 1 ? iw / 2 : (i / (data.length - 1)) * iw);
  const y = (v: number) => PAD.t + (1 - (v - min) / (max - min)) * ih;
  const bad = (v: number) => limit !== undefined && (limitDir === "above" ? v > limit : v < limit);
  const line = data.map((d, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(d.value).toFixed(1)}`).join("");
  const area = `${line}L${x(data.length - 1)},${PAD.t + ih}L${x(0)},${PAD.t + ih}Z`;
  const ticks = [0, 0.5, 1].map((k) => min + (max - min) * k);
  const step = Math.ceil(data.length / 7);
  const fmt = (v: number) => v.toFixed(decimals).replace(".", ",");
  const h = hover ?? data.length - 1;

  return (
    <div className="chart">
      <svg
        viewBox={`0 0 ${W} ${height}`}
        role="img"
        aria-label={label}
        onMouseLeave={() => setHover(null)}
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          const px = ((e.clientX - r.left) / r.width) * W;
          const i = Math.round(((px - PAD.l) / iw) * (data.length - 1));
          setHover(Math.max(0, Math.min(data.length - 1, i)));
        }}
      >
        <g className="grid axis">
          {ticks.map((t) => (
            <g key={t}>
              <line x1={PAD.l} x2={W - PAD.r} y1={y(t)} y2={y(t)} />
              <text x={PAD.l - 8} y={y(t) + 4} textAnchor="end">{fmt(t)}</text>
            </g>
          ))}
          {data.map((d, i) =>
            i % step === 0 || i === data.length - 1 ? (
              <text key={d.label} x={x(i)} y={height - 6} textAnchor="middle">{d.label}</text>
            ) : null,
          )}
        </g>
        {limit !== undefined ? (
          <g>
            <line className="limit" x1={PAD.l} x2={W - PAD.r} y1={y(limit)} y2={y(limit)} />
            <text className="limit-txt" x={W - PAD.r} y={y(limit) - 5} textAnchor="end">chegara {fmt(limit)}{unit}</text>
          </g>
        ) : null}
        <path className="area" d={area} />
        <path className="line" d={line} />
        {hover !== null ? <line className="hover-line" x1={x(hover)} x2={x(hover)} y1={PAD.t} y2={PAD.t + ih} /> : null}
        {data.map((d, i) =>
          bad(d.value) || i === h ? (
            <circle key={d.label} className={`dot${bad(d.value) ? " bad" : ""}`} cx={x(i)} cy={y(d.value)} r={i === h ? 5 : 3.5} />
          ) : null,
        )}
      </svg>
      <div className="chart-tip">
        {data[h].label}: <b>{fmt(data[h].value)}{unit}</b>
        {bad(data[h].value) ? <span style={{ color: "var(--danger)", fontWeight: 700 }}> · chegaradan tashqari</span> : null}
      </div>
    </div>
  );
}

// money: oʻq yorligʻida qisqa (mln), maslahatda toʻliq soʻm
export function BarChart({ data, height = 200, label, money }: { data: Point[]; height?: number; label: string; money?: boolean }) {
  const axis = (v: number) => (money ? compact(v) : num(v));
  const full = (v: number) => (money ? `${num(v)} soʻm` : num(v));
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(...data.map((d) => d.value)) * 1.1 || 1;
  const iw = W - PAD.l - PAD.r;
  const ih = height - PAD.t - PAD.b;
  const bw = iw / data.length;
  const step = Math.ceil(data.length / 7);
  const h = hover ?? data.length - 1;
  return (
    <div className="chart">
      <svg viewBox={`0 0 ${W} ${height}`} role="img" aria-label={label} onMouseLeave={() => setHover(null)}>
        <g className="grid axis">
          {[0, 0.5, 1].map((k) => (
            <g key={k}>
              <line x1={PAD.l} x2={W - PAD.r} y1={PAD.t + ih * (1 - k)} y2={PAD.t + ih * (1 - k)} />
              <text x={PAD.l - 8} y={PAD.t + ih * (1 - k) + 4} textAnchor="end">{k ? axis(Math.round(max * k)) : 0}</text>
            </g>
          ))}
          {data.map((d, i) =>
            i % step === 0 || i === data.length - 1 ? (
              <text key={d.label} x={PAD.l + bw * i + bw / 2} y={height - 6} textAnchor="middle">{d.label}</text>
            ) : null,
          )}
        </g>
        {data.map((d, i) => {
          const bh = (d.value / max) * ih;
          return (
            <rect
              key={d.label}
              className={`bar${i === h ? "" : " dim"}`}
              x={PAD.l + bw * i + bw * 0.18}
              width={bw * 0.64}
              y={PAD.t + ih - bh}
              height={bh}
              rx={3}
              onMouseEnter={() => setHover(i)}
            />
          );
        })}
      </svg>
      <div className="chart-tip">
        {data[h].label}: <b>{full(data[h].value)}</b>
      </div>
    </div>
  );
}
