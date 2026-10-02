"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

// Taqdimot uchun haqiqiy 3D obyektlar (WebGL, three.js). Geometriya kodda yasaladi — tashqi model fayllari yoʻq.
export type SceneKind = "heart" | "pills" | "pillsCorners" | "watch";

type Built = { group: THREE.Group; tick: (t: number) => void; dispose?: () => void };

function heart(): Built {
  const s = new THREE.Shape();
  s.moveTo(0, -1.15);
  s.bezierCurveTo(-0.35, -0.8, -1.25, -0.2, -1.25, 0.45);
  s.bezierCurveTo(-1.25, 1.05, -0.75, 1.3, -0.45, 1.3);
  s.bezierCurveTo(-0.15, 1.3, 0, 1.1, 0, 0.9);
  s.bezierCurveTo(0, 1.1, 0.15, 1.3, 0.45, 1.3);
  s.bezierCurveTo(0.75, 1.3, 1.25, 1.05, 1.25, 0.45);
  s.bezierCurveTo(1.25, -0.2, 0.35, -0.8, 0, -1.15);
  const geo = new THREE.ExtrudeGeometry(s, { depth: 0.55, bevelEnabled: true, bevelThickness: 0.28, bevelSize: 0.22, bevelSegments: 12, curveSegments: 48 });
  geo.center();
  const mat = new THREE.MeshPhysicalMaterial({ color: "#e5484d", roughness: 0.22, metalness: 0.05, clearcoat: 1, clearcoatRoughness: 0.08, sheen: 0.4 });
  const mesh = new THREE.Mesh(geo, mat);
  // atrofida aylanuvchi teal halqa (EKG orbitasi)
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.95, 0.035, 16, 160), new THREE.MeshStandardMaterial({ color: "#2ec4d1", emissive: "#2ec4d1", emissiveIntensity: 0.6, roughness: 0.3 }));
  ring.rotation.x = Math.PI / 2.6;
  const dots = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const d = new THREE.Mesh(new THREE.SphereGeometry(0.11, 24, 24), new THREE.MeshStandardMaterial({ color: "#ffffff", emissive: "#2ec4d1", emissiveIntensity: 0.8 }));
    d.userData.phase = (i / 3) * Math.PI * 2;
    dots.add(d);
  }
  const group = new THREE.Group();
  group.add(mesh, ring, dots);
  return {
    group,
    tick: (t) => {
      mesh.rotation.y = Math.sin(t * 0.6) * 0.6;
      mesh.rotation.x = Math.sin(t * 0.4) * 0.12;
      const beat = t % 1.1;
      const k = beat < 0.12 ? 1 + beat * 0.9 : beat < 0.3 ? 1.11 - (beat - 0.12) * 0.6 : 1;
      mesh.scale.setScalar(k);
      ring.rotation.z = t * 0.5;
      dots.children.forEach((d) => {
        const a = t * 1.2 + d.userData.phase;
        d.position.set(Math.cos(a) * 1.95, Math.sin(a) * 1.95 * Math.cos(Math.PI / 2.6), Math.sin(a) * 1.95 * Math.sin(Math.PI / 2.6));
      });
    },
  };
}

function capsule(a: string, b: string) {
  const g = new THREE.Group();
  const r = 0.32;
  const h = 0.62;
  const matA = new THREE.MeshPhysicalMaterial({ color: a, roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.1 });
  const matB = new THREE.MeshPhysicalMaterial({ color: b, roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.1 });
  const top = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 48), matA);
  top.position.y = h / 2;
  const topCap = new THREE.Mesh(new THREE.SphereGeometry(r, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2), matA);
  topCap.position.y = h;
  const bot = new THREE.Mesh(new THREE.CylinderGeometry(r * 1.02, r * 1.02, h, 48), matB);
  bot.position.y = -h / 2;
  const botCap = new THREE.Mesh(new THREE.SphereGeometry(r * 1.02, 48, 24, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), matB);
  botCap.position.y = -h;
  g.add(top, topCap, bot, botCap);
  return g;
}

// Kapsulalar matnga tegmasligi uchun slayd turiga qarab joylashadi (16:9 kadrda koʻrinadigan kenglik ≈ ±4.2)
const PILL_LAYOUTS: Record<"side" | "corners", [string, string, number, number, number, number][]> = {
  // matn chapda va yuqorida — kapsulalar oʻng tomonda va pastda
  side: [
    ["#0b8e9b", "#f4f8f9", 3.9, 1.9, -1.2, 0.85],
    ["#d9443a", "#f4f8f9", 2.5, 2.4, -2.6, 0.62],
    ["#f0b429", "#f4f8f9", 4.0, -0.3, 0.1, 1.0],
    ["#0b8e9b", "#1b2a4a", 3.2, -2.1, -0.8, 0.82],
    ["#d9443a", "#f4f8f9", -3.6, -2.15, -0.6, 0.85],
    ["#6a4fc4", "#f4f8f9", -1.2, -2.5, -2.4, 0.62],
  ],
  // matn markazda — kapsulalar faqat toʻrt burchakda
  corners: [
    ["#d9443a", "#f4f8f9", -4.0, 2.0, -0.8, 0.9],
    ["#0b8e9b", "#f4f8f9", 4.0, 2.0, -1.0, 0.85],
    ["#f0b429", "#f4f8f9", 4.1, -2.0, 0.0, 0.95],
    ["#0b8e9b", "#1b2a4a", -4.0, -2.0, -0.4, 0.85],
    ["#6a4fc4", "#f4f8f9", -3.0, 2.6, -2.8, 0.55],
    ["#d9443a", "#f4f8f9", 3.0, -2.7, -2.8, 0.55],
  ],
};

function pills(layout: "side" | "corners"): Built {
  const group = new THREE.Group();
  const spec = PILL_LAYOUTS[layout];
  const items = spec.map(([a, b, x, y, z, s], i) => {
    const c = capsule(a, b);
    c.position.set(x, y, z);
    c.scale.setScalar(s);
    c.rotation.set(i * 0.7, i * 1.1, i * 0.5);
    c.userData = { x, y, sp: 0.4 + i * 0.07, ph: i };
    group.add(c);
    return c;
  });
  return {
    group,
    tick: (t) => {
      items.forEach((c) => {
        const u = c.userData as { x: number; y: number; sp: number; ph: number };
        c.rotation.x += 0.004 * u.sp * 3;
        c.rotation.z += 0.003 * u.sp * 3;
        c.position.y = u.y + Math.sin(t * u.sp + u.ph) * 0.25;
      });
    },
  };
}

function watch(): Built {
  const group = new THREE.Group();
  const metal = new THREE.MeshPhysicalMaterial({ color: "#2b3446", metalness: 0.85, roughness: 0.28, clearcoat: 1, clearcoatRoughness: 0.15 });
  const strapMat = new THREE.MeshPhysicalMaterial({ color: "#0e9aa7", roughness: 0.55, sheen: 0.6, sheenColor: new THREE.Color("#7ee6ee") });
  const body = new THREE.Mesh(new RoundedBoxGeometry(2.3, 2.8, 0.62, 8, 0.42), metal);
  const glass = new THREE.Mesh(new RoundedBoxGeometry(2.04, 2.54, 0.08, 6, 0.32), new THREE.MeshPhysicalMaterial({ color: "#05080e", roughness: 0.05, metalness: 0, clearcoat: 1 }));
  glass.position.z = 0.3;

  // ekran: canvas tekstura (MEDIS logotipi, puls, SpO2, EKG)
  const cv = document.createElement("canvas");
  cv.width = 512;
  cv.height = 640;
  const ctx = cv.getContext("2d")!;
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 2.25), new THREE.MeshBasicMaterial({ map: tex, transparent: true }));
  screen.position.z = 0.345;
  const css = getComputedStyle(document.documentElement);
  const display = css.getPropertyValue("--font-poppins").trim() || "sans-serif";
  const logo = new Image();
  logo.src = "/brand/medis-mark.png";
  let pulse = 72;
  const draw = (t: number) => {
    ctx.clearRect(0, 0, 512, 640);
    const g = ctx.createRadialGradient(256, 200, 20, 256, 300, 420);
    g.addColorStop(0, "#123a4a");
    g.addColorStop(1, "#03070d");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.roundRect(0, 0, 512, 640, 90);
    ctx.fill();
    if (logo.complete) ctx.drawImage(logo, 120, 52, 70, 60);
    ctx.fillStyle = "#e8f6f8";
    ctx.font = `600 40px ${display}`;
    ctx.fillText("medis", 202, 98);
    // yurak
    const k = 1 + Math.max(0, Math.sin(t * 7)) * 0.12;
    ctx.save();
    ctx.translate(140, 210);
    ctx.scale(k, k);
    ctx.fillStyle = "#ff5a6e";
    ctx.beginPath();
    ctx.moveTo(0, 30);
    ctx.bezierCurveTo(-46, 0, -40, -38, -12, -38);
    ctx.bezierCurveTo(-2, -38, 0, -28, 0, -24);
    ctx.bezierCurveTo(0, -28, 2, -38, 12, -38);
    ctx.bezierCurveTo(40, -38, 46, 0, 0, 30);
    ctx.fill();
    ctx.restore();
    ctx.fillStyle = "#ffffff";
    ctx.font = `700 120px ${display}`;
    ctx.fillText(String(pulse), 200, 250);
    ctx.fillStyle = "#8fb3bf";
    ctx.font = `700 24px ${display}`;
    ctx.fillText("PULS · ZARBA/DAQ", 150, 292);
    ctx.fillStyle = "#0d2230";
    ctx.beginPath(); ctx.roundRect(60, 320, 180, 110, 26); ctx.fill();
    ctx.beginPath(); ctx.roundRect(272, 320, 180, 110, 26); ctx.fill();
    ctx.font = `700 48px ${display}`;
    ctx.fillStyle = "#2ec4d1"; ctx.fillText("98%", 92, 385);
    ctx.fillStyle = "#f0c36b"; ctx.fillText("36,6°", 290, 385);
    ctx.font = `700 20px ${display}`;
    ctx.fillStyle = "#8fb3bf"; ctx.fillText("SpO₂", 122, 415); ctx.fillText("HARORAT", 312, 415);
    // EKG chizigʻi harakatlanadi
    ctx.strokeStyle = "#2ec4d1";
    ctx.lineWidth = 6;
    ctx.lineJoin = "round";
    ctx.beginPath();
    const off = (t * 160) % 512;
    for (let x = 0; x <= 400; x += 4) {
      const p = (x + off) % 200;
      const y = p > 80 && p < 92 ? -30 : p >= 92 && p < 104 ? 46 : p >= 104 && p < 116 ? -62 : p >= 116 && p < 128 ? 22 : 0;
      if (x === 0) ctx.moveTo(56 + x, 510 + y); else ctx.lineTo(56 + x, 510 + y);
    }
    ctx.stroke();
    ctx.fillStyle = "#6fd6a1";
    ctx.font = `800 24px ${display}`;
    ctx.fillText("SHIFOKOR NAZORATIDA", 110, 598);
    tex.needsUpdate = true;
  };

  const strapTop = new THREE.Mesh(new RoundedBoxGeometry(1.55, 2.3, 0.26, 6, 0.12), strapMat);
  strapTop.position.set(0, 2.4, -0.12);
  strapTop.rotation.x = -0.18;
  const strapBot = strapTop.clone();
  strapBot.position.set(0, -2.4, -0.12);
  strapBot.rotation.x = 0.18;
  const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.22, 32), metal);
  crown.rotation.z = Math.PI / 2;
  crown.position.set(1.2, 0.45, 0);
  const btn = new THREE.Mesh(new RoundedBoxGeometry(0.12, 0.5, 0.2, 4, 0.05), metal);
  btn.position.set(1.17, -0.35, 0);
  group.add(strapTop, strapBot, body, glass, screen, crown, btn);
  group.scale.setScalar(0.92);

  let last = -1;
  return {
    group,
    tick: (t) => {
      group.rotation.y = Math.sin(t * 0.45) * 0.55;
      group.rotation.x = Math.sin(t * 0.3) * 0.12 - 0.05;
      group.position.y = Math.sin(t * 0.8) * 0.08;
      if (Math.floor(t * 0.6) !== last) {
        last = Math.floor(t * 0.6);
        pulse = 70 + ((last * 7) % 7);
      }
      draw(t);
    },
    dispose: () => tex.dispose(),
  };
}

const BUILDERS: Record<SceneKind, () => Built> = { heart, pills: () => pills("side"), pillsCorners: () => pills("corners"), watch };
const CAMERA_Z: Record<SceneKind, number> = { heart: 6.2, pills: 7.5, pillsCorners: 7.5, watch: 8.2 };

export function Scene3D({ kind, className = "" }: { kind: SceneKind; className?: string }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 0, CAMERA_Z[kind]);
    scene.add(new THREE.HemisphereLight("#dff6f8", "#0b1424", 1.1));
    const key = new THREE.DirectionalLight("#ffffff", 2.4);
    key.position.set(3, 4, 5);
    const rim = new THREE.DirectionalLight("#2ec4d1", 2.2);
    rim.position.set(-4, -1, -3);
    scene.add(key, rim);

    const built = BUILDERS[kind]();
    scene.add(built.group);

    // oʻlcham: taqdimot kanvasi CSS bilan masshtablanadi — piksel zichligini shunga moslaymiz
    const resize = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      const scale = el.getBoundingClientRect().width / Math.max(1, w);
      renderer.setPixelRatio(Math.min(2.5, window.devicePixelRatio * scale));
      renderer.setSize(w, h, false);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      camera.aspect = w / Math.max(1, h);
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    let raf = 0;
    const start = performance.now();
    const loop = () => {
      const t = (performance.now() - start) / 1000;
      built.tick(reduce ? 1.2 : t);
      renderer.render(scene, camera);
      if (!reduce) raf = requestAnimationFrame(loop);
    };
    loop();
    if (reduce) setTimeout(loop, 300); // logotip rasmi yuklangach qayta chizish

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      built.dispose?.();
      scene.traverse((o) => {
        if (o instanceof THREE.Mesh) {
          o.geometry.dispose();
          (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => m.dispose());
        }
      });
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, [kind]);

  return <div ref={host} className={`scene3d ${className}`} aria-hidden="true" />;
}
