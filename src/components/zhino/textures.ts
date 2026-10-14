import * as THREE from "three";

function canvasTex(w: number, h: number, draw: (c: CanvasRenderingContext2D) => void) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  draw(ctx);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

function rand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/** Night city skyline seen through the window. */
export function cityTexture() {
  return canvasTex(1024, 512, (c) => {
    const g = c.createLinearGradient(0, 0, 0, 512);
    g.addColorStop(0, "#070a1c");
    g.addColorStop(0.55, "#22124a");
    g.addColorStop(0.8, "#3b1a6b");
    g.addColorStop(1, "#0c2a44");
    c.fillStyle = g;
    c.fillRect(0, 0, 1024, 512);
    const r = rand(7);
    for (let i = 0; i < 90; i++) {
      c.fillStyle = `rgba(255,255,255,${r() * 0.6})`;
      c.fillRect(r() * 1024, r() * 200, 1.5, 1.5);
    }
    for (let layer = 0; layer < 3; layer++) {
      let x = 0;
      while (x < 1024) {
        const bw = 30 + r() * 70;
        const bh = 80 + r() * (220 - layer * 50) + layer * 40;
        const shade = 12 + layer * 8;
        c.fillStyle = `rgb(${shade},${shade + 2},${shade + 18})`;
        c.fillRect(x, 512 - bh, bw, bh);
        for (let wy = 512 - bh + 8; wy < 500; wy += 10) {
          for (let wx = x + 5; wx < x + bw - 5; wx += 8) {
            if (r() > 0.72) {
              c.fillStyle = r() > 0.5 ? "rgba(0,210,255,0.75)" : "rgba(216,180,254,0.7)";
              c.fillRect(wx, wy, 3, 4);
            }
          }
        }
        x += bw + 2;
      }
    }
  });
}

/** Page texture with diagrams, formulas and glowing lines. */
export function pageTexture(variant: number) {
  return canvasTex(512, 720, (c) => {
    c.fillStyle = "#f3eee6";
    c.fillRect(0, 0, 512, 720);
    c.strokeStyle = "rgba(60,60,90,0.12)";
    for (let y = 60; y < 700; y += 22) {
      c.beginPath();
      c.moveTo(40, y);
      c.lineTo(472, y);
      c.stroke();
    }
    c.lineWidth = 3;
    c.strokeStyle = "#7c3aed";
    c.fillStyle = "#3b2a6b";
    c.font = "bold 34px serif";
    if (variant === 0) {
      c.beginPath();
      c.arc(256, 230, 120, 0, Math.PI * 2);
      c.stroke();
      c.strokeStyle = "#0891b2";
      c.beginPath();
      c.moveTo(136, 230);
      c.lineTo(376, 230);
      c.moveTo(256, 230);
      c.lineTo(340, 145);
      c.stroke();
      c.fillText("sin²θ + cos²θ = 1", 110, 440);
      c.fillText("∫ f(x) dx", 160, 520);
    } else {
      c.beginPath();
      for (let x = 0; x < 432; x++) {
        const y = 230 - Math.sin(x / 40) * 80 * Math.exp(-x / 400);
        if (x === 0) c.moveTo(40 + x, y);
        else c.lineTo(40 + x, y);
      }
      c.stroke();
      c.strokeStyle = "#0891b2";
      for (let i = 0; i < 6; i++) {
        c.beginPath();
        c.arc(140 + i * 45, 480, 16, 0, Math.PI * 2);
        c.stroke();
      }
      c.fillText("F = m·a", 170, 400);
      c.fillText("H₂O  ⇌  H⁺ + OH⁻", 90, 590);
    }
    c.fillStyle = "rgba(60,60,90,0.35)";
    for (let i = 0; i < 5; i++) c.fillRect(60, 620 + i * 14, 300 + ((i * 53) % 90), 4);
  });
}

/** Subtle wooden / composite desk surface. */
export function woodTexture() {
  const tex = canvasTex(512, 512, (c) => {
    c.fillStyle = "#2a1f2e";
    c.fillRect(0, 0, 512, 512);
    const r = rand(3);
    for (let i = 0; i < 160; i++) {
      c.strokeStyle = `rgba(${90 + r() * 40},${60 + r() * 30},${80 + r() * 30},${0.08 + r() * 0.12})`;
      c.lineWidth = 1 + r() * 2;
      c.beginPath();
      const y = r() * 512;
      c.moveTo(0, y);
      c.bezierCurveTo(170, y + r() * 12 - 6, 340, y + r() * 12 - 6, 512, y);
      c.stroke();
    }
  });
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

/** Floor with faint tiled grid. */
export function floorTexture() {
  const tex = canvasTex(512, 512, (c) => {
    c.fillStyle = "#0e1222";
    c.fillRect(0, 0, 512, 512);
    c.strokeStyle = "rgba(168,85,247,0.12)";
    c.lineWidth = 2;
    c.strokeRect(1, 1, 510, 510);
    const r = rand(11);
    for (let i = 0; i < 1500; i++) {
      c.fillStyle = `rgba(255,255,255,${r() * 0.03})`;
      c.fillRect(r() * 512, r() * 512, 2, 2);
    }
  });
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(8, 8);
  return tex;
}

/** Small chest label. */
export function labelTexture(text: string) {
  return canvasTex(256, 64, (c) => {
    c.clearRect(0, 0, 256, 64);
    c.fillStyle = "#c4b5fd";
    c.font = "bold 40px sans-serif";
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillText(text, 128, 34);
  });
}
