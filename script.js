/* =========================================================
   FOR DAY, WITH LOVE — lógica
   ========================================================= */
(() => {
  "use strict";

  const C = window.FDWL_CONFIG;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const SVGNS = "http://www.w3.org/2000/svg";
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const get = (path) => path.split(".").reduce((o, k) => (o ? o[k] : undefined), C);

  /* ---------------- configuración → página ---------------- */
  function applyConfig() {
    const root = document.documentElement.style;
    Object.entries(C.colors).forEach(([k, v]) => root.setProperty(`--${k}`, v));
    $$("[data-text]").forEach((el) => {
      const v = get(el.dataset.text);
      if (typeof v === "string") el.textContent = v;
    });
  }

  /* ---------------- utilidades de dibujo ---------------- */
  function rng(seed) {
    let s = seed >>> 0 || 1;
    return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  }

  // prepara trazos para animarlos como si se dibujaran a mano
  function prepareDraw(root) {
    $$(".draw", root).forEach((p) => {
      let len = 0;
      try { len = p.getTotalLength(); } catch (e) { len = 0; }
      if (!len) len = 600;
      p.style.transition = "none";
      p.style.strokeDasharray = `${len} ${len}`;
      p.style.strokeDashoffset = reduceMotion ? 0 : len;
      p.dataset.len = len;
    });
  }
  function playDraw(root, base = 0) {
    if (reduceMotion) return;
    // forzar reflow para que la transición arranque desde cero
    void root.getBoundingClientRect();
    $$(".draw", root).forEach((p) => {
      const d = base + Number(p.dataset.delay || 0);
      const dur = Number(p.dataset.dur || 1.6);
      p.style.transition = `stroke-dashoffset ${dur}s cubic-bezier(.45,.05,.25,1) ${d}s`;
      p.style.strokeDashoffset = 0;
    });
  }

  // rama botánica dibujada a mano (SVG)
  function sprig({ w = 150, h = 70, seed = 3, color = "#B69A68", berry = "#C78F91", horizontal = true, delay = 0 } = {}) {
    const r = rng(seed);
    const p0 = horizontal ? [8, h * .62] : [w * .55, h - 4];
    const p3 = horizontal ? [w - 8, h * .38] : [w * .45, 6];
    const p1 = horizontal ? [w * .35, h * .95] : [w * .2, h * .6];
    const p2 = horizontal ? [w * .65, h * .05] : [w * .85, h * .3];
    const bez = (t) => {
      const u = 1 - t;
      return [0, 1].map((i) => u * u * u * p0[i] + 3 * u * u * t * p1[i] + 3 * u * t * t * p2[i] + t * t * t * p3[i]);
    };
    const bezD = (t) => {
      const u = 1 - t;
      return [0, 1].map((i) => 3 * u * u * (p1[i] - p0[i]) + 6 * u * t * (p2[i] - p1[i]) + 3 * t * t * (p3[i] - p2[i]));
    };
    let out = `<path class="draw" data-delay="${delay}" data-dur="1.8" d="M${p0} C${p1} ${p2} ${p3}" fill="none" stroke="${color}" stroke-width="1.2"/>`;
    const n = 9;
    for (let i = 0; i < n; i++) {
      const t = 0.1 + 0.85 * (i / (n - 1));
      const [x, y] = bez(t);
      const [dx, dy] = bezD(t);
      const side = i % 2 ? 1 : -1;
      const a = Math.atan2(dy, dx) + side * (0.75 + r() * 0.3);
      const L = (h * 0.42) * (1 - 0.45 * t) * (0.85 + r() * 0.3);
      const W = L * 0.34;
      const ca = Math.cos(a), sa = Math.sin(a);
      const P = (al, ac) => [(x + al * ca - ac * sa).toFixed(1), (y + al * sa + ac * ca).toFixed(1)];
      const d = `M${P(0, 0)} C${P(L * .3, -W)} ${P(L * .75, -W * .8)} ${P(L, 0)} C${P(L * .75, W * .8)} ${P(L * .3, W)} ${P(0, 0)}`;
      out += `<path class="draw" data-delay="${(delay + 0.5 + i * 0.12).toFixed(2)}" data-dur="1" d="${d}" fill="none" stroke="${color}" stroke-width="1"/>`;
    }
    for (let k = 0; k < 3; k++) {
      const t = 0.3 + k * 0.22;
      const [x, y] = bez(t);
      const yy = y + (k % 2 ? 9 : -9);
      out += `<circle class="bloom" style="transition-delay:${(delay + 1.4 + k * 0.2).toFixed(2)}s" cx="${x.toFixed(1)}" cy="${yy.toFixed(1)}" r="3" fill="${berry}"/>`;
    }
    return `<svg viewBox="0 0 ${w} ${h}" aria-hidden="true">${out}</svg>`;
  }

  function flowerHead(cx, cy, R, color, delay, petals = 5, rot = 0) {
    let s = `<g class="bloom" style="transition-delay:${delay}s">`;
    for (let i = 0; i < petals; i++) {
      const a = rot + (i * 360) / petals;
      s += `<ellipse cx="${cx}" cy="${cy - R * 0.55}" rx="${R * 0.38}" ry="${R * 0.6}" fill="${color}" opacity=".92" transform="rotate(${a} ${cx} ${cy})"/>`;
    }
    s += `<circle cx="${cx}" cy="${cy}" r="${R * 0.22}" fill="#B69A68"/></g>`;
    return s;
  }

  function bouquet() {
    const stems = [
      ["M130 150 C128 115 104 92 86 58", 0], ["M130 150 C132 108 134 70 132 36", 0.2], ["M130 150 C134 118 160 96 178 64", 0.4],
      ["M130 150 C124 126 92 120 62 102", 0.6], ["M130 150 C138 128 172 124 200 108", 0.8]
    ];
    let s = "";
    stems.forEach(([d, del]) => { s += `<path class="draw" data-delay="${del}" data-dur="1.6" d="${d}" fill="none" stroke="#9b8a5e" stroke-width="1.4"/>`; });
    const leaves = [[104, 104, -40], [150, 100, 35], [118, 126, -70], [148, 124, 70], [92, 80, -20]];
    leaves.forEach(([x, y, a], i) => {
      s += `<path class="draw" data-delay="${1 + i * 0.15}" data-dur="1" d="M${x} ${y} q 10 -14 22 -2 q -12 10 -22 2z" fill="none" stroke="#9b8a5e" stroke-width="1" transform="rotate(${a} ${x} ${y})"/>`;
    });
    s += flowerHead(86, 58, 15, "#C78F91", 1.5, 5, 10);
    s += flowerHead(132, 34, 17, "#481D2A", 1.8, 6, 0);
    s += flowerHead(178, 64, 14, "#e9c9c2", 2.0, 5, 30);
    s += flowerHead(62, 102, 11, "#e9c9c2", 2.2, 5, 15);
    s += flowerHead(200, 108, 12, "#C78F91", 2.4, 5, 40);
    return `<svg viewBox="0 0 260 155" aria-hidden="true">${s}</svg>`;
  }

  function cornerFlora() {
    let s = sprig({ w: 130, h: 120, seed: 21, color: "#a88a55", berry: "#C78F91", horizontal: false }).replace(/<\/?svg[^>]*>/g, "");
    s += flowerHead(62, 16, 11, "#C78F91", 1.6, 5, 12);
    return `<svg viewBox="0 0 130 120" aria-hidden="true">${s}</svg>`;
  }

  /* ---------------- ilustraciones de la escena 3 ---------------- */
  const ART = {
    calendar() {
      const days = ["L", "M", "M", "J", "V", "S", "D"];
      let s = `<g transform="rotate(-3 160 130)">
        <rect x="42" y="22" width="236" height="214" rx="4" fill="#000" opacity=".25" transform="translate(6 8)"/>
        <rect x="42" y="22" width="236" height="214" rx="4" fill="#F0E5D2"/>
        <rect x="42" y="22" width="236" height="44" rx="4" fill="#C78F91"/>
        <rect x="42" y="56" width="236" height="10" fill="#C78F91"/>`;
      for (let i = 0; i < 6; i++) s += `<circle cx="${72 + i * 35}" cy="22" r="5" fill="#2b1a1e"/><path d="M${72 + i * 35} 12 v 14" stroke="#B69A68" stroke-width="2.4" stroke-linecap="round"/>`;
      s += `<text x="160" y="52" text-anchor="middle" class="svg-serif" font-size="20" fill="#30131E" letter-spacing="5">MARZO 2026</text>`;
      days.forEach((d, i) => { s += `<text x="${66 + i * 31.5}" y="86" text-anchor="middle" class="svg-serif" font-size="10" fill="#8a6a3e" font-weight="700">${d}</text>`; });
      // marzo 2026 empieza en domingo
      for (let day = 1; day <= 31; day++) {
        const idx = day + 5;
        const col = idx % 7, row = Math.floor(idx / 7);
        const x = 66 + col * 31.5, y = 110 + row * 24;
        s += `<text x="${x}" y="${y}" text-anchor="middle" class="svg-serif" font-size="13" fill="${day === 16 ? "#481D2A" : "#5b4038"}" font-weight="${day === 16 ? 700 : 500}">${day}</text>`;
      }
      // círculo a mano alrededor del 16 (lunes, fila 3)
      s += `<path class="draw" data-delay=".5" data-dur="1.4" d="M80 170 C 70 163, 54 165, 52 175 C 50 186, 66 191, 79 187 C 89 182, 86 168, 70 166" fill="none" stroke="#481D2A" stroke-width="1.8"/>`;
      s += `</g>`;
      s += `<path class="draw" data-delay="1.6" data-dur="1" d="M70 252 C 40 250, 28 228, 44 202" fill="none" stroke="#F0E5D2" stroke-width="1.3"/>
            <path class="draw" data-delay="2.3" data-dur=".4" d="M44 202 l-1 8 M44 202 l6 5" fill="none" stroke="#F0E5D2" stroke-width="1.3"/>
            <text x="76" y="258" class="svg-hand" font-size="20" fill="#F0E5D2" transform="rotate(-3 76 258)">acá empezó todo</text>`;
      s += `<image href="assets/illustrations/flower2.webp" x="238" y="150" width="86" height="100" transform="rotate(14 280 200)"/>`;
      return `<svg viewBox="0 0 320 268" role="img" aria-label="Calendario de marzo de 2026 con el 16 marcado">${s}</svg>`;
    },

    map() {
      let s = `<g transform="rotate(2 160 125)">
        <g opacity=".3" transform="translate(6 9)"><rect x="30" y="20" width="260" height="210" fill="#000"/></g>
        <polygon points="30,20 117,26 117,236 30,230" fill="#efe3cc"/>
        <polygon points="117,26 204,20 204,230 117,236" fill="#e2d3b7"/>
        <polygon points="204,20 290,26 290,236 204,230" fill="#ece0c8"/>
        <path d="M117 26 V236 M204 20 V230" stroke="rgba(90,60,40,.2)"/>`;
      // contorno estilizado (México arriba, Sudamérica abajo)
      s += `<path d="M58 44 C 80 42, 108 40, 128 46 C 126 62, 134 76, 148 82 C 158 78, 166 82, 162 92 C 160 98, 170 104, 176 112 C 184 118, 192 122, 204 124 C 222 128, 244 136, 262 152 C 272 162, 270 174, 258 182 C 248 192, 244 204, 232 214 C 226 222, 220 230, 214 236 C 208 224, 206 206, 204 188 C 202 170, 198 154, 192 142 C 186 136, 176 132, 168 128 C 158 122, 146 114, 132 104 C 116 94, 100 84, 88 72 C 76 62, 64 54, 58 44 Z"
              fill="rgba(199,143,145,.32)" stroke="#6b4a40" stroke-width="1.1" stroke-linejoin="round"/>`;
      s += `<path class="draw" data-delay=".4" data-dur="2.2" d="M96 74 C 150 70, 230 120, 236 200" fill="none" stroke="#481D2A" stroke-width="1.6" stroke-dasharray="0"/>`;
      s += `<g class="map-dot"><circle cx="96" cy="74" r="9" fill="#e7c98f" opacity=".45" class="pulse"/><circle cx="96" cy="74" r="4" fill="#481D2A"/></g>
            <g class="map-dot"><circle cx="236" cy="200" r="9" fill="#e7c98f" opacity=".45" class="pulse"/><circle cx="236" cy="200" r="4" fill="#481D2A"/></g>
            <text x="42" y="96" class="svg-hand" font-size="17" fill="#3a2622">México</text>
            <text x="178" y="226" class="svg-hand" font-size="17" fill="#3a2622">Argentina</text>`;
      // rosa de los vientos
      s += `<g transform="translate(258 58)" opacity=".8"><circle r="16" fill="none" stroke="#8a6a3e" stroke-width=".8"/>
            <path d="M0 -20 L3 0 L0 20 L-3 0Z" fill="#8a6a3e"/><path d="M-20 0 L0 3 L20 0 L0 -3Z" fill="#B69A68"/>
            <text y="-24" text-anchor="middle" class="svg-serif" font-size="8" fill="#8a6a3e" font-weight="700">N</text></g></g>`;
      return `<svg viewBox="0 0 320 250" role="img" aria-label="Mapa ilustrado con una ruta entre México y Argentina">${s}</svg>`;
    },

    constellation() {
      const r = rng(9);
      let edge = "";
      for (let i = 0; i <= 48; i++) {
        const a = (i / 48) * Math.PI * 2;
        const rr = 108 + (r() - 0.5) * 6;
        edge += `${i ? "L" : "M"}${(160 + Math.cos(a) * rr).toFixed(1)} ${(125 + Math.sin(a) * rr).toFixed(1)} `;
      }
      const stars = [[96, 92], [132, 70], [176, 84], [204, 122], [174, 160], [124, 150]];
      let s = `<path d="${edge}Z" fill="#000" opacity=".3" transform="translate(5 8)"/>
               <path d="${edge}Z" fill="#1d1018" stroke="#B69A68" stroke-width=".8" stroke-opacity=".5"/>`;
      for (let i = 0; i < 40; i++) s += `<circle cx="${(70 + r() * 180).toFixed(1)}" cy="${(40 + r() * 170).toFixed(1)}" r="${(r() * 0.9 + 0.3).toFixed(2)}" fill="#F0E5D2" opacity="${(r() * 0.5 + 0.2).toFixed(2)}"/>`;
      let d = `M${stars[0]}`;
      stars.slice(1).forEach((p) => (d += ` L${p}`));
      d += ` L${stars[0]}`;
      s += `<path class="draw" data-delay=".5" data-dur="2.6" d="${d}" fill="none" stroke="#B69A68" stroke-width="1" opacity=".85"/>`;
      stars.forEach(([x, y], i) => {
        s += `<g class="twinkle" style="animation-delay:${(i * 0.4).toFixed(1)}s"><path d="M${x} ${y - 8} Q${x + 1.6} ${y - 1.6} ${x + 8} ${y} Q${x + 1.6} ${y + 1.6} ${x} ${y + 8} Q${x - 1.6} ${y + 1.6} ${x - 8} ${y} Q${x - 1.6} ${y - 1.6} ${x} ${y - 8}Z" fill="#F4E3BC"/></g>`;
      });
      s += `<path d="M232 66 a14 14 0 1 0 10 22 a11 11 0 1 1 -10 -22z" fill="#F0E5D2" opacity=".85"/>
            <text x="160" y="212" text-anchor="middle" class="svg-serif" font-size="15" fill="#B69A68" letter-spacing="6" font-weight="600">VI</text>`;
      return `<svg viewBox="0 0 320 250" role="img" aria-label="Constelación de seis estrellas, una por cada mes">${s}</svg>`;
    },

    stamps() {
      const r = rng(4);
      let s = `<g transform="rotate(-2 160 125)">
        <rect x="26" y="40" width="268" height="176" rx="3" fill="#000" opacity=".3" transform="translate(6 8)"/>
        <rect x="26" y="40" width="268" height="176" rx="3" fill="#ECE0C9"/>
        <path d="M26 40 L160 132 L294 40" fill="none" stroke="rgba(110,80,55,.3)" stroke-width="1"/>
        <path d="M26 216 L132 128 M294 216 L188 128" fill="none" stroke="rgba(110,80,55,.18)"/>`;
      // estampilla 1
      s += `<g transform="rotate(4 230 82)">
              <rect x="200" y="52" width="62" height="74" fill="#C78F91"/>
              <rect x="200" y="52" width="62" height="74" fill="none" stroke="#ECE0C9" stroke-width="5" stroke-dasharray="0 7" stroke-linecap="round"/>
              <circle cx="231" cy="84" r="11" fill="#F0E5D2"/>
              ${Array.from({ length: 12 }, (_, i) => { const a = i * Math.PI / 6; return `<path d="M${(231 + Math.cos(a) * 14).toFixed(1)} ${(84 + Math.sin(a) * 14).toFixed(1)} L${(231 + Math.cos(a) * 19).toFixed(1)} ${(84 + Math.sin(a) * 19).toFixed(1)}" stroke="#F0E5D2" stroke-width="1.6" stroke-linecap="round"/>`; }).join("")}
              <text x="231" y="118" text-anchor="middle" class="svg-serif" font-size="7.5" fill="#30131E" letter-spacing="1.4" font-weight="700">ARGENTINA</text></g>`;
      // estampilla 2
      s += `<g transform="rotate(-7 168 80)">
              <rect x="138" y="48" width="58" height="70" fill="#B69A68"/>
              <rect x="138" y="48" width="58" height="70" fill="none" stroke="#ECE0C9" stroke-width="5" stroke-dasharray="0 7" stroke-linecap="round"/>
              <path d="M167 98 C 160 88, 152 82, 148 72 M167 98 C 166 86, 167 74, 168 62 M167 98 C 174 88, 182 80, 188 72" stroke="#30131E" stroke-width="1.4" fill="none" stroke-linecap="round"/>
              <circle cx="168" cy="60" r="4" fill="#481D2A"/><circle cx="147" cy="70" r="3.2" fill="#481D2A"/><circle cx="189" cy="70" r="3.2" fill="#481D2A"/>
              <text x="167" y="111" text-anchor="middle" class="svg-serif" font-size="7.5" fill="#30131E" letter-spacing="1.6" font-weight="700">MÉXICO</text></g>`;
      // matasellos
      s += `<g opacity=".75"><circle cx="122" cy="84" r="30" fill="none" stroke="#481D2A" stroke-width="1.4"/>
              <circle cx="122" cy="84" r="24" fill="none" stroke="#481D2A" stroke-width=".7"/>
              <text x="122" y="80" text-anchor="middle" class="svg-serif" font-size="9" fill="#481D2A" font-weight="700" letter-spacing="1">16 · NOV</text>
              <text x="122" y="93" text-anchor="middle" class="svg-serif" font-size="9" fill="#481D2A" font-weight="700" letter-spacing="1">2026</text></g>`;
      for (let k = 0; k < 4; k++) s += `<path class="draw" data-delay="${0.4 + k * 0.2}" data-dur="1" d="M152 ${70 + k * 9} q 12 -5 24 0 t 24 0 t 24 0" fill="none" stroke="#481D2A" stroke-width="1.1" opacity=".55"/>`;
      s += `<text x="56" y="176" class="svg-hand" font-size="26" fill="#481D2A">para Day</text>
            <path class="draw" data-delay="1.2" data-dur="1" d="M56 186 C 90 182, 120 184, 150 180" fill="none" stroke="#C78F91" stroke-width="1.6"/></g>`;
      // ocho estrellitas
      for (let i = 0; i < 8; i++) {
        const x = (20 + r() * 280).toFixed(1), y = (r() < 0.5 ? 10 + r() * 24 : 226 + r() * 20).toFixed(1);
        const z = 3 + r() * 3;
        s += `<g class="twinkle" style="animation-delay:${(i * 0.35).toFixed(2)}s"><path d="M${x} ${y - z} L${x} ${+y + z} M${+x - z} ${y} L${+x + z} ${y}" stroke="#F0E5D2" stroke-width="1.1" stroke-linecap="round"/></g>`;
      }
      return `<svg viewBox="0 0 320 250" role="img" aria-label="Sobre con estampillas de Argentina y México, matasellado el 16 de noviembre">${s}</svg>`;
    }
  };

  /* ---------------- pétalos ---------------- */
  function spawnPetals(n = 18, spread = 2600) {
    if (reduceMotion) return;
    const layer = $("#petals");
    for (let i = 0; i < n; i++) {
      setTimeout(() => {
        const img = document.createElement("img");
        img.src = `assets/illustrations/petal${1 + (i % 3)}.webp`;
        img.alt = "";
        img.className = "petal";
        img.style.left = `${Math.random() * 100}vw`;
        img.style.setProperty("--s", `${14 + Math.random() * 16}px`);
        img.style.setProperty("--d", `${6 + Math.random() * 5}s`);
        img.style.setProperty("--dx", `${(Math.random() - 0.5) * 140}px`);
        img.style.setProperty("--r0", `${Math.random() * 360}deg`);
        img.addEventListener("animationend", () => img.remove());
        layer.appendChild(img);
      }, Math.random() * spread);
    }
  }

  /* ---------------- escenas ---------------- */
  const scenes = $$(".scene");
  let current = 0;
  const entered = new Set();
  const nav = $("#nav");
  const navDots = $("#navDots");
  scenes.forEach((s, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.setAttribute("aria-label", s.getAttribute("aria-label"));
    b.addEventListener("click", () => goTo(i));
    navDots.appendChild(b);
  });

  function goTo(n) {
    if (n < 0 || n >= scenes.length || n === current) return;
    const prev = scenes[current];
    prev.classList.remove("is-active");
    onLeave(current);
    current = n;
    scenes[n].classList.add("is-active");
    const sc = $(".scene-scroll", scenes[n]);
    if (sc) sc.scrollTop = 0;
    updateNav();
    onEnter(n);
    try { history.replaceState(null, "", n ? `#escena-${n + 1}` : location.pathname); } catch (e) {}
  }

  function updateNav() {
    nav.classList.toggle("is-visible", current > 0);
    $("#prevBtn").disabled = current === 0;
    $("#nextBtn").disabled = current === scenes.length - 1;
    $$("button", navDots).forEach((b, i) => b.setAttribute("aria-current", i === current ? "true" : "false"));
    updateMini();
  }

  function onEnter(n) {
    const first = !entered.has(n);
    entered.add(n);
    if (n === 1) { loadYouTube(); }
    if (n === 2) { showMoment(momentIndex, true); }
    if (n === 3) { startSky(); distanceIntro(first); }
    if (n === 4 && first) { startLetter(); }
  }
  function onLeave(n) {
    if (n === 3) stopSky();
  }

  $("#prevBtn").addEventListener("click", () => goTo(current - 1));
  $("#nextBtn").addEventListener("click", () => goTo(current + 1));
  document.addEventListener("keydown", (e) => {
    if (current === 0) return;
    if (e.key === "ArrowRight" && current !== 2) goTo(current + 1);
    if (e.key === "ArrowLeft" && current !== 2) goTo(current - 1);
    if (current === 2 && e.key === "ArrowRight") nextMoment(1);
    if (current === 2 && e.key === "ArrowLeft") nextMoment(-1);
  });

  /* ---------------- escena 1 · sobre ---------------- */
  const envelope = $("#envelope");
  let envOpened = false;
  async function openEnvelope() {
    if (envOpened) return;
    envOpened = true;
    envelope.setAttribute("aria-label", "Sobre abierto");
    loadYouTube(); // precarga el reproductor para que esté listo
    envelope.classList.add("is-open");
    await wait(reduceMotion ? 50 : 750);
    envelope.classList.add("is-rising");
    await wait(reduceMotion ? 50 : 1100);
    const scene = $(".scene-invite");
    scene.classList.add("card-out");
    const stage = document.createElement("div");
    stage.className = "card-stage";
    const inner = $(".card-inner", envelope);
    stage.appendChild(inner);
    scene.appendChild(stage);
    const btn = $("#openWorld", stage);
    btn.tabIndex = 0;
    const sp = $(".card-sprig", stage);
    prepareDraw(sp);
    $("svg", sp).classList.add("is-blooming");
    playDraw(sp, 0.4);
    spawnPetals(22);
    setTimeout(() => btn.focus({ preventScroll: true }), 1800);
  }
  /* --- búsqueda: muchos sobres, uno solo es el correcto --- */
  const field = $("#envField");
  const slotCorrect = $("#slotCorrect");
  const hintEl = $("#inviteHint");
  let found = false, wrongCount = 0, slots = [slotCorrect];

  function buildDecoys() {
    const isBig = Math.min(window.innerWidth, window.innerHeight) >= 600;
    const n = isBig ? (C.invitation.decoysTablet || 8) : (C.invitation.decoysPhone || 7);
    const labels = C.invitation.decoyLabels.slice();
    for (let i = 0; i < n; i++) {
      const slot = slotCorrect.cloneNode(true);
      slot.removeAttribute("id");
      $$("[id]", slot).forEach((el) => el.removeAttribute("id"));
      $$(".env-card, defs", slot).forEach((el) => el.remove());
      const env = $(".envelope", slot);
      const label = labels[i % labels.length];
      $(".env-to", env).textContent = label;
      env.setAttribute("aria-label", `Sobre que dice: ${label}`);
      slot.classList.add("is-decoy");
      env.addEventListener("click", () => wrong(slot));
      env.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); wrong(slot); } });
      field.appendChild(slot);
      slots.push(slot);
    }
    // mezclar el orden para que el correcto caiga en cualquier lugar
    for (let i = slots.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [slots[i], slots[j]] = [slots[j], slots[i]]; }
    slots.forEach((sl, i) => {
      sl.dataset.r = ((Math.random() - 0.5) * 26).toFixed(1);
      sl.dataset.jx = (Math.random() - 0.5).toFixed(3);
      sl.dataset.jy = (Math.random() - 0.5).toFixed(3);
      $(".envelope", sl).style.animationDelay = `${(0.5 + i * 0.12).toFixed(2)}s, ${(2.6 + i * 0.37).toFixed(2)}s`;
    });
    layoutEnvelopes();
  }

  function layoutEnvelopes() {
    if (found) return centerCorrect();
    const W = field.clientWidth, H = field.clientHeight;
    if (!W || !H) return;
    const w0 = slotCorrect.offsetWidth, h0 = slotCorrect.offsetHeight;
    const n = slots.length;
    let best = null;
    for (let cols = 2; cols <= 4; cols++) {
      const rows = Math.ceil(n / cols);
      const s = Math.min((W / cols) * 0.88 / w0, (H / rows) * 0.8 / h0, 0.78);
      if (!best || s > best.s) best = { cols, rows, s };
    }
    const { cols, rows, s } = best;
    const cw = W / cols, ch = H / rows;
    slots.forEach((sl, i) => {
      const r = Math.floor(i / cols), c = i % cols;
      const inRow = r === rows - 1 ? n - r * cols : cols;      // centrar la última fila
      const offset = (cols - inRow) * cw / 2;
      const x = offset + c * cw + cw / 2 + Number(sl.dataset.jx) * cw * 0.16;
      const y = r * ch + ch / 2 + Number(sl.dataset.jy) * ch * 0.14;
      sl.style.setProperty("--x", `${x.toFixed(1)}px`);
      sl.style.setProperty("--y", `${y.toFixed(1)}px`);
      sl.style.setProperty("--r", `${sl.dataset.r}deg`);
      sl.style.setProperty("--s", s.toFixed(3));
      sl.style.zIndex = String(10 + i);
    });
  }
  function centerCorrect() {
    slotCorrect.style.setProperty("--x", `${field.clientWidth / 2}px`);
    slotCorrect.style.setProperty("--y", `${field.clientHeight / 2}px`);
    slotCorrect.style.setProperty("--r", "-1.5deg");
    slotCorrect.style.setProperty("--s", "1");
  }

  function wrong(slot) {
    if (found) return;
    wrongCount++;
    const wob = $(".env-wobble", slot);
    wob.classList.remove("nope"); void wob.offsetWidth; wob.classList.add("nope");
    slot.classList.add("is-tried");
    const msgs = C.invitation.wrongMessages;
    const lbl = $(".env-to", slot);
    lbl.textContent = msgs[(wrongCount - 1) % msgs.length];
    lbl.classList.add("is-msg");
    if (navigator.vibrate) { try { navigator.vibrate(30); } catch (e) {} }
    if (wrongCount >= (C.invitation.clueAfter || 3)) {
      hintEl.textContent = C.invitation.clue;
      slotCorrect.classList.add("is-hinted");
    }
  }

  async function chooseCorrect() {
    if (found) return;
    found = true;
    $(".scene-invite").classList.add("is-found");
    slots.forEach((sl) => { if (sl !== slotCorrect) {
      const a = Math.atan2(parseFloat(sl.style.getPropertyValue("--y")) - field.clientHeight / 2, parseFloat(sl.style.getPropertyValue("--x")) - field.clientWidth / 2);
      sl.style.setProperty("--x", `${field.clientWidth / 2 + Math.cos(a) * field.clientWidth}px`);
      sl.style.setProperty("--y", `${field.clientHeight / 2 + Math.sin(a) * field.clientHeight}px`);
      sl.classList.add("is-gone");
    } });
    slotCorrect.classList.remove("is-hinted");
    slotCorrect.style.zIndex = "60";
    centerCorrect();
    spawnPetals(10, 1200);
    await wait(reduceMotion ? 50 : 1300);
    openEnvelope();
  }

  envelope.addEventListener("click", chooseCorrect);
  envelope.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); chooseCorrect(); } });
  window.addEventListener("resize", () => { if (current === 0 && !envOpened) layoutEnvelopes(); });
  $("#openWorld").addEventListener("click", (e) => { e.stopPropagation(); spawnPetals(8, 800); goTo(1); });

  /* ---------------- escena 2 · vinilo + YouTube ---------------- */
  const vinylScene = $(".scene-vinyl");
  const playBtn = $("#playBtn");
  const statusEl = $("#playerStatus");
  const ytNote = $("#ytNote");
  const mini = $("#miniPlayer");
  let player = null, ytReady = false, ytRequested = false, isPlaying = false, quoteShown = false, progressTimer = null, fallbackTimer = null;

  // surcos del disco
  (function grooves() {
    const g = $("#grooves");
    let s = "";
    for (let r = 48, i = 0; r < 122; r += 2.15, i++) {
      const gap = i === 9 || i === 18 || i === 27;
      s += `<circle cx="160" cy="162" r="${r.toFixed(2)}" stroke="${gap ? "#3a3132" : "#272022"}" stroke-width="${gap ? 1.4 : 0.7}" opacity="${gap ? 1 : 0.55 + (i % 3) * 0.15}"/>`;
    }
    g.innerHTML = s;
  })();

  const fmt = (t) => { t = Math.max(0, Math.floor(t || 0)); return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`; };
  const setStatus = (t) => { statusEl.textContent = t; };

  function loadYouTube() {
    if (ytRequested) return;
    ytRequested = true;
    window.onYouTubeIframeAPIReady = createPlayer;
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    tag.async = true;
    tag.onerror = () => ytFailed();
    document.head.appendChild(tag);
    setTimeout(() => { if (!ytReady) ytFailed(true); }, 15000);
  }
  function ytFailed(timeout) {
    if (ytReady) return;
    setStatus(timeout ? "Sin conexión con YouTube" : "No se pudo cargar YouTube");
    ytNote.textContent = "No pude conectar con YouTube. Revisá la conexión y recargá la página.";
    ytNote.classList.add("is-alert");
  }
  function createPlayer() {
    const vars = { playsinline: 1, rel: 0, modestbranding: 1, controls: 1, iv_load_policy: 3 };
    if (location.protocol.startsWith("http")) vars.origin = location.origin;
    player = new YT.Player("ytPlayer", {
      host: "https://www.youtube-nocookie.com",
      videoId: C.music.youtubeId,
      playerVars: vars,
      events: {
        onReady: () => {
          ytReady = true;
          playBtn.disabled = false;
          setStatus("Listo para sonar");
          ytNote.classList.remove("is-alert");
          ytNote.textContent = C.music.fallbackNote;
          if (!isIOS) player.setVolume(Number($("#volume").value));
          const d = player.getDuration();
          if (d) $("#tDur").textContent = fmt(d);
        },
        onStateChange: (e) => {
          const S = YT.PlayerState;
          if (e.data === S.PLAYING) { clearTimeout(fallbackTimer); ytNote.classList.remove("is-alert"); setPlaying(true); setStatus("Sonando"); }
          else if (e.data === S.BUFFERING) { vinylScene.classList.add("is-armed"); setStatus("Cargando…"); }
          else if (e.data === S.PAUSED) { setPlaying(false); setStatus("En pausa"); }
          else if (e.data === S.ENDED) { setPlaying(false); setStatus("Fin del lado A"); vinylScene.classList.remove("is-armed"); updateProgress(); }
          else if (e.data === S.CUED || e.data === -1) { setPlaying(false); }
        },
        onError: (e) => {
          setPlaying(false);
          setStatus("El video no se puede reproducir");
          ytNote.textContent = e.data === 101 || e.data === 150
            ? "El dueño del video no permite reproducirlo fuera de YouTube."
            : "Hubo un problema con el video de YouTube.";
          ytNote.classList.add("is-alert");
        }
      }
    });
  }

  function setPlaying(b) {
    isPlaying = b;
    vinylScene.classList.toggle("is-playing", b);
    if (b) vinylScene.classList.add("is-armed");
    else if (player && player.getPlayerState && player.getPlayerState() !== YT.PlayerState.BUFFERING) vinylScene.classList.remove("is-armed");
    playBtn.setAttribute("aria-label", b ? "Pausar" : "Reproducir");
    $("#speedKnob").style.transform = b ? "translateX(30px)" : "none";
    mini.classList.toggle("is-playing", b);
    mini.setAttribute("aria-label", b ? "Pausar la música" : "Reanudar la música");
    if (b && !quoteShown) { quoteShown = true; $("#songQuote").classList.add("is-shown"); }
    clearInterval(progressTimer);
    if (b) progressTimer = setInterval(updateProgress, 500);
    updateMini();
  }
  function updateProgress() {
    if (!player || !player.getDuration) return;
    const d = player.getDuration() || 0, t = player.getCurrentTime() || 0;
    const pct = d ? (t / d) * 100 : 0;
    $("#progressFill").style.width = `${pct}%`;
    $("#progress").setAttribute("aria-valuenow", Math.round(pct));
    $("#tCur").textContent = fmt(t);
    if (d) $("#tDur").textContent = fmt(d);
  }
  function togglePlay() {
    if (!ytReady || !player) return;
    if (isPlaying) { player.pauseVideo(); return; }
    vinylScene.classList.add("is-armed");   // el brazo baja apenas se toca
    setStatus("Bajando la púa…");
    player.playVideo();
    clearTimeout(fallbackTimer);
    fallbackTimer = setTimeout(() => {
      const st = player.getPlayerState();
      if (st !== YT.PlayerState.PLAYING && st !== YT.PlayerState.BUFFERING) {
        vinylScene.classList.remove("is-armed");
        setStatus("Tocá el video");
        ytNote.textContent = C.music.fallbackNote;
        ytNote.classList.add("is-alert");
        $(".yt-frame").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
      }
    }, 2600);
  }
  playBtn.addEventListener("click", togglePlay);
  $("#turntable").addEventListener("click", togglePlay);
  $("#progress").addEventListener("click", (e) => {
    if (!ytReady || !player.getDuration()) return;
    const r = e.currentTarget.getBoundingClientRect();
    player.seekTo(((e.clientX - r.left) / r.width) * player.getDuration(), true);
    setTimeout(updateProgress, 200);
  });

  const vol = $("#volume");
  vol.value = C.music.startVolume;
  vol.addEventListener("input", () => {
    if (player && ytReady) player.setVolume(Number(vol.value));
    const knob = $(".tt-details line");
    knob.setAttribute("transform", `rotate(${(vol.value - 50) * 2.4} 352 262)`);
  });
  if (isIOS) { $("#volumeRow").hidden = true; $("#iosNote").hidden = false; }

  function updateMini() {
    const show = ytReady && current !== 1 && (isPlaying || (player && player.getPlayerState && player.getPlayerState() === YT.PlayerState.PAUSED));
    mini.hidden = !show;
  }
  mini.addEventListener("click", () => {
    if (!player || !ytReady) return;
    if (isPlaying) player.pauseVideo(); else player.playVideo();
  });

  /* ---------------- escena 3 · momentos ---------------- */
  const momentsEl = $("#moments");
  const momDots = $("#momDots");
  const layouts = ["a", "b", "c", "d"];
  let momentIndex = 0;
  C.story.moments.forEach((m, i) => {
    const el = document.createElement("article");
    el.className = "moment";
    el.dataset.layout = layouts[i % layouts.length];
    el.innerHTML = `<div class="moment-art">${(ART[m.art] || ART.calendar)()}</div>
      <div class="moment-text"><span class="moment-date"></span><h3 class="moment-title"></h3><p class="moment-copy"></p></div>`;
    $(".moment-date", el).textContent = m.date;
    $(".moment-title", el).textContent = m.title;
    $(".moment-copy", el).textContent = m.text;
    momentsEl.appendChild(el);
    const b = document.createElement("button");
    b.type = "button";
    b.setAttribute("aria-label", m.date);
    b.addEventListener("click", () => showMoment(i));
    momDots.appendChild(b);
  });
  const momentEls = $$(".moment", momentsEl);

  function showMoment(i, force) {
    if (i < 0 || i >= momentEls.length) return;
    if (i === momentIndex && !force && momentEls[i].classList.contains("is-active")) return;
    momentEls.forEach((el, k) => {
      el.classList.toggle("is-active", k === i);
      el.classList.toggle("is-before", k < i);
      el.setAttribute("aria-hidden", k === i ? "false" : "true");
    });
    momentIndex = i;
    $$("button", momDots).forEach((b, k) => b.setAttribute("aria-current", k === i ? "true" : "false"));
    $("#momPrev").disabled = i === 0;
    $("#momNext").disabled = i === momentEls.length - 1;
    const art = momentEls[i];
    prepareDraw(art);
    playDraw(art, 0.5);
  }
  function nextMoment(d) {
    const n = momentIndex + d;
    if (n >= momentEls.length) return goTo(3);
    if (n < 0) return goTo(1);
    showMoment(n);
  }
  $("#momPrev").addEventListener("click", () => nextMoment(-1));
  $("#momNext").addEventListener("click", () => nextMoment(1));
  (function swipe(el) {
    let x0 = null, y0 = null;
    el.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
    el.addEventListener("touchend", (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3) {
        const n = momentIndex + (dx < 0 ? 1 : -1);
        if (n >= 0 && n < momentEls.length) showMoment(n);
      }
      x0 = null;
    });
  })(momentsEl);

  /* ---------------- escena 4 · cielo ---------------- */
  const sky = $("#sky");
  const ctx = sky.getContext("2d");
  let stars = [], skyRAF = null, shooting = null;
  function sizeSky() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = sky.clientWidth, h = sky.clientHeight;
    sky.width = w * dpr; sky.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.round((w * h) / 2600);
    stars = Array.from({ length: n }, () => ({
      x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.1 + 0.25,
      p: Math.random() * Math.PI * 2, s: 0.6 + Math.random() * 1.6, gold: Math.random() < 0.18
    }));
  }
  function drawSky(t) {
    const w = sky.clientWidth, h = sky.clientHeight;
    ctx.clearRect(0, 0, w, h);
    for (const st of stars) {
      const a = reduceMotion ? 0.7 : 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(st.p + (t / 1000) * st.s));
      ctx.globalAlpha = a;
      ctx.fillStyle = st.gold ? "#e8c98e" : "#f3e9d8";
      ctx.beginPath(); ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2); ctx.fill();
    }
    if (!reduceMotion) {
      if (!shooting && Math.random() < 0.002) shooting = { x: Math.random() * w * 0.6 + w * 0.3, y: Math.random() * h * 0.3, life: 0 };
      if (shooting) {
        shooting.life += 1;
        const L = shooting.life;
        const x = shooting.x - L * 6, y = shooting.y + L * 3;
        const g = ctx.createLinearGradient(x, y, x + 60, y - 30);
        g.addColorStop(0, "rgba(255,240,210,.9)"); g.addColorStop(1, "rgba(255,240,210,0)");
        ctx.globalAlpha = Math.max(0, 1 - L / 45);
        ctx.strokeStyle = g; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 60, y - 30); ctx.stroke();
        if (L > 45) shooting = null;
      }
    }
    ctx.globalAlpha = 1;
    if (!reduceMotion) skyRAF = requestAnimationFrame(drawSky);
  }
  function startSky() {
    sizeSky();
    cancelAnimationFrame(skyRAF);
    if (reduceMotion) drawSky(0); else skyRAF = requestAnimationFrame(drawSky);
  }
  function stopSky() { cancelAnimationFrame(skyRAF); skyRAF = null; }
  window.addEventListener("resize", () => { if (current === 3) { sizeSky(); if (reduceMotion) drawSky(0); } });

  (function splitWords() {
    const el = $("#distText");
    const words = el.textContent.split(" ");
    el.innerHTML = words.map((w, i) => `<span class="w" style="transition-delay:${(1.2 + i * 0.12).toFixed(2)}s">${w}</span>`).join(" ");
  })();
  function distanceIntro(first) {
    const scene = $(".scene-distance");
    const arc = $("#distArc");
    arc.classList.add("draw");
    arc.dataset.dur = "2.6";
    prepareDraw(scene.querySelector(".dist-svg"));
    playDraw(scene.querySelector(".dist-svg"), 0.6);
    const t = $("#distText");
    t.classList.remove("is-shown");
    void t.offsetWidth;
    t.classList.add("is-shown");
  }
  $("#closerBtn").addEventListener("click", () => {
    const sc = $(".scene-distance");
    const closer = !sc.classList.contains("is-closer");
    sc.classList.toggle("is-closer", closer);
    $("#closerBtn").textContent = closer ? "Juntos" : C.distance.button;
  });

  /* ---------------- escena 5 · carta ---------------- */
  const letterEl = $("#letter");
  const body = $("#letterBody");
  const signOff = Math.max(1, C.letter.signOffLines || 1);
  let typing = null;
  function startLetter() {
    const paras = C.letter.paragraphs;
    const flora = $(".letter-flora");
    prepareDraw(flora);
    $("svg", flora).classList.add("is-blooming");
    playDraw(flora, 0.3);
    if (reduceMotion) { renderAll(); return finishLetter(); }

    let p = 0, c = 0, node = null, userScrolled = false;
    const sc = $(".scene-scroll", scenes[4]);
    sc.addEventListener("touchmove", () => { userScrolled = true; }, { passive: true, once: true });
    sc.addEventListener("wheel", () => { userScrolled = true; }, { passive: true, once: true });
    const caret = document.createElement("span");
    caret.className = "caret";
    const speed = Math.max(8, C.letter.typingSpeed || 28);
    const newPara = () => {
      const el = document.createElement("p");
      if (p >= paras.length - signOff) el.className = "sign-off";
      node = document.createTextNode("");
      el.appendChild(node);
      el.appendChild(caret);
      body.appendChild(el);
      // acompaña la escritura con el scroll, salvo que Day esté leyendo más arriba
      if (!userScrolled && p > 0) el.scrollIntoView({ block: "center", behavior: "smooth" });
    };
    newPara();
    const step = () => {
      const text = paras[p];
      if (c < text.length) {
        const ch = text[c++];
        node.data += ch;
        let d = speed * (0.6 + Math.random() * 0.8);
        if (ch === ",") d = speed * 6;
        if (ch === "." || ch === "…") d = speed * 11;
        typing = setTimeout(step, d);
      } else {
        p++; c = 0;
        if (p >= paras.length) { caret.remove(); return finishLetter(); }
        typing = setTimeout(() => { newPara(); step(); }, speed * 16);
      }
    };
    typing = setTimeout(step, 1200);
  }
  function renderAll() {
    clearTimeout(typing);
    body.innerHTML = "";
    C.letter.paragraphs.forEach((t, i, a) => {
      const el = document.createElement("p");
      if (i >= a.length - signOff) el.className = "sign-off";
      el.textContent = t;
      body.appendChild(el);
    });
  }
  let letterDone = false;
  function finishLetter() {
    if (letterDone) return;
    letterDone = true;
    letterEl.classList.add("is-done");
    setTimeout(() => {
      const fin = $("#finale");
      prepareDraw(fin);
      fin.classList.add("is-shown");
      $(".finale-flowers svg").classList.add("is-blooming");
      playDraw($(".finale-flowers"), 0.2);
      const heart = $(".finale-heart");
      $(".draw", heart).dataset.dur = "2.2";
      playDraw(heart, 1.4);
      if (!reduceMotion) spawnPetals(12, 3000);
      const sc = $(".scene-scroll", scenes[4]);
      setTimeout(() => {
        sc.scrollTo({ top: sc.scrollHeight, behavior: reduceMotion ? "auto" : "smooth" });
      }, 600);
    }, reduceMotion ? 0 : 700);
  }
  letterEl.addEventListener("click", () => { if (!letterDone) { renderAll(); finishLetter(); } });
  $("#restartBtn").addEventListener("click", () => goTo(0));

  /* ---------------- arranque ---------------- */
  function init() {
    applyConfig();
    $(".card-sprig").innerHTML = sprig({ w: 150, h: 70, seed: 5 });
    $(".letter-flora").innerHTML = cornerFlora();
    $(".finale-flowers").innerHTML = bouquet();
    updateNav();
    buildDecoys();
    // enlace directo a una escena (útil para probar): #escena-3
    const m = location.hash.match(/escena-(\d)/);
    if (m) {
      const n = Math.min(scenes.length, Math.max(1, Number(m[1]))) - 1;
      if (n > 0) {
        envOpened = true; found = true;
        slots.forEach((sl) => { if (sl !== slotCorrect) sl.classList.add("is-gone"); });
        centerCorrect();
        const sceneInv = $(".scene-invite");
        sceneInv.classList.add("card-out");
        envelope.classList.add("is-open", "is-rising");
        const stage = document.createElement("div");
        stage.className = "card-stage";
        stage.appendChild($(".card-inner", envelope));
        $("#openWorld", stage).tabIndex = 0;
        sceneInv.appendChild(stage);
        goTo(n);
      }
    }
  }
  init();
})();
