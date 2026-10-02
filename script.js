/* Galgah Drinks: scripts */
"use strict";

/* ---------- Signature ice cream section ---------- */
(() => {
  const section = document.getElementById("signature");
  document.documentElement.classList.add("sig-js");

  // drips: [x, y, w, h] from the menu background, plus shine lines and falling drops
  const drips = [[0, 0, 42, 215], [56, 10, 38, 125], [110, 10, 46, 178], [174, 10, 34, 98], [224, 10, 44, 152], [288, 10, 36, 112], [340, 10, 42, 76]];
  const shine = { 0: [120, 185], 1: [70, 108], 2: [100, 160], 4: [90, 134], 5: [70, 96] };
  const dripSvg =
    `<rect class="shade" x="0" y="7" width="400" height="52"/><rect class="body" width="400" height="52"/>` +
    drips.map(([x, y, w, h], k) => {
      const cx = x + w / 2, s = shine[k];
      return `<g class="d" style="--k:${k}">` +
        `<rect class="shade" x="${x}" y="${y + 7}" width="${w}" height="${h}" rx="${w / 2}"/>` +
        `<rect class="body" x="${x}" y="${y}" width="${w}" height="${h}" rx="${w / 2}"/>` +
        (s ? `<line class="shine" x1="${cx}" y1="${s[0]}" x2="${cx}" y2="${s[1]}"/>` : "") + `</g>`;
    }).join("") +
    `<circle class="drop" cx="21" cy="208" r="9" style="--k:0"/><circle class="drop" cx="133" cy="182" r="8" style="--k:1"/><circle class="drop" cx="246" cy="158" r="7" style="--k:2"/>`;
  section.querySelectorAll(".drips").forEach((svg) => { svg.innerHTML = dripSvg; });

  // confetti triangles, positioned as on the printed menu (percent of a 956 x 957 area)
  const tris = [[120, 250, 15, "#C9DDC4"], [250, 290, -35, "#F3C4A6"], [66, 318, 40, "#F3C4A6"], [470, 72, 20, "#C9DDC4"],
    [560, 36, -30, "#F3C4A6"], [700, 232, 10, "#F3C4A6"], [880, 262, -10, "#C9DDC4"], [906, 330, 25, "#F2CCD6"],
    [40, 430, -30, "#C9DDC4"], [922, 470, 60, "#F3C4A6"], [34, 592, 10, "#F3C4A6"], [150, 600, 35, "#BFDCD0"],
    [478, 592, -15, "#C9DDC4"], [782, 588, 30, "#F2CCD6"], [930, 612, -40, "#C9DDC4"], [58, 730, 50, "#C9DDC4"],
    [918, 762, 20, "#F3C4A6"], [44, 890, -20, "#F3C4A6"], [190, 912, 35, "#C9DDC4"], [790, 912, -25, "#F3C4A6"], [918, 898, 15, "#BFDCD0"]];
  document.getElementById("confetti").innerHTML = tris.map(([x, y, r, c], k) =>
    `<svg viewBox="-26 -28 52 48" style="left:${(x / 956 * 100).toFixed(1)}%;top:${(y / 957 * 100).toFixed(1)}%;--r:${r}deg;--t:${6 + (k % 5) * 1.3}s;--dl:${-k * .7}s">` +
    `<polygon points="0,-20 18,12 -18,12" fill="${c}" stroke="${c}" stroke-width="12" stroke-linejoin="round"/></svg>`
  ).join("");

  // wordmark letters hop in one by one
  const word = document.getElementById("sig-word");
  word.innerHTML = [...word.textContent].map((ch, k) => `<span class="ch" style="--k:${k}">${ch}</span>`).join("");

  const targets = [section, ...section.querySelectorAll(".flavor"), document.getElementById("topping")];
  const show = (el) => el.classList.add("in");
  const reset = (el) => el.classList.remove("in");

  // play on the way down, reset once scrolled back above the start so it replays next time
  if (!("IntersectionObserver" in window)) { targets.forEach(show); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) show(e.target);
      else if (e.boundingClientRect.top > 0) reset(e.target);
    });
  }, { rootMargin: "0px 0px -15% 0px" });
  targets.forEach(el => io.observe(el));
})();

/* ---------- Drinks carousel (first screen) ---------- */
(() => {
  const drinks = [
    {
      key: "strawberry", img: "img/cup-strawberry.webp", sy: .742,
      name: ["Strawberry", "Milk"],
      desc: "Susu stroberi dingin dengan potongan stroberi dan es batu di atasnya.",
      notes: ["Stroberi", "Es batu"],
      wall: "#F7CED4", deep: "#5A1330", accent: "#D8365E",
      splash: ["#E4466C", "#FFFFFF", "#F59AB0"]
    },
    {
      key: "matcha", img: "img/cup-matcha.webp", sy: .81,
      name: ["Matcha", "Latte"],
      desc: "Kami mengocok matcha dengan susu sampai berbusa, lalu menaburkan bubuk matcha di atasnya.",
      notes: ["Matcha", "Susu"],
      wall: "#E3E8C6", deep: "#34401A", accent: "#5B7520",
      splash: ["#7A9A2E", "#FFFFFF", "#B6CC6E"]
    },
    {
      key: "thaitea", img: "img/cup-thaitea.webp", sy: .775,
      name: ["Thai", "Tea"],
      desc: "Teh Thailand oranye yang manis dan wangi. Kami menuangnya bersama susu ke gelas penuh es.",
      notes: ["Teh Thailand", "Susu"],
      wall: "#FCDDB6", deep: "#5A2404", accent: "#B4470C",
      splash: ["#E8741E", "#FFFFFF", "#FFD19C"]
    },
    {
      key: "oreo", img: "img/cup-oreo.webp", sy: .752,
      name: ["Oreo", "Milk"],
      desc: "Kami memblender susu dengan remahan Oreo sampai kental, lalu menaruh satu keping utuh di atasnya.",
      notes: ["Oreo", "Blended"],
      wall: "#EAE3DC", deep: "#2B2220", accent: "#4A3A36",
      splash: ["#2A2224", "#FFFFFF", "#8C8184"]
    },
    {
      key: "biscuit", img: "img/cup-biscuit.webp", sy: .745,
      name: ["Marie", "Regal"],
      desc: "Susu dingin yang diblender dengan biskuit Marie Regal sampai lembut, lalu ditaburi remahannya di atas.",
      notes: ["Marie Regal", "Susu"],
      wall: "#F1DFC2", deep: "#4A2C10", accent: "#9A5A14",
      splash: ["#D9A55C", "#FFFFFF", "#F1DFC2"]
    },
    {
      key: "honey", img: "img/cup-honey.webp", sy: .742,
      name: ["Honey", "Salt"],
      desc: "Susu dingin berbusa dengan lilitan madu di dinding gelas dan sejumput garam. Manis dan gurih.",
      notes: ["Madu", "Garam"],
      wall: "#F7E3B0", deep: "#4A3205", accent: "#96600A",
      splash: ["#E3A21A", "#FFFFFF", "#F9D777"]
    }
  ];

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (id) => document.getElementById(id);
  const stage = $("top");
  const cup = $("cup"), nameEl = $("name"), descEl = $("desc"), notesEl = $("notes"),
        idxEl = $("idx"), chipsEl = $("chips"), tilt = $("tilt"), zone = $("cupzone");
  let current = 0, busy = false, timer = null, paused = false, focusPaused = false;
  const halted = () => paused || focusPaused || reduce;
  const DURATION = 5200;

  drinks.forEach((d, i) => {
    const b = document.createElement("button");
    b.className = "chip"; b.setAttribute("role", "tab"); b.id = "chip-" + d.key;
    b.setAttribute("aria-label", d.name.join(" "));
    b.setAttribute("aria-controls", "panel");
    b.type = "button";
    b.innerHTML = `<img src="${d.img}" alt=""><span>${d.name.join(" ")}</span><i class="prog"></i>`;
    b.addEventListener("click", () => { go(i, i > current ? 1 : -1).then(restart); });
    chipsEl.appendChild(b);
  });

  function setText(d) {
    nameEl.innerHTML = d.name.map(line =>
      `<span class="line">${[...line].map(ch => `<span class="ch">${ch}</span>`).join("")}</span>`
    ).join("");
    nameEl.setAttribute("aria-label", d.name.join(" "));
    descEl.textContent = d.desc;
    notesEl.innerHTML = d.notes.map(n => `<li>${n}</li>`).join("");
    const two = (n) => String(n).padStart(2, "0");
    idxEl.textContent = `Menu ${two(drinks.indexOf(d) + 1)} / ${two(drinks.length)}`;
  }

  function setScene(d) {
    stage.style.setProperty("--wall", d.wall);
    stage.style.setProperty("--deep", d.deep);
    stage.style.setProperty("--accent", d.accent);
    placeCup();
    document.querySelectorAll(".bg").forEach(el => el.classList.toggle("on", el.id === "bg-" + d.key));
    [...chipsEl.children].forEach((c, i) => {
      c.setAttribute("aria-selected", i === current ? "true" : "false");
      c.tabIndex = i === current ? 0 : -1;
    });
    $("panel").setAttribute("aria-labelledby", "chip-" + d.key);
  }

  function animateLetters() {
    if (reduce) return;
    nameEl.querySelectorAll(".ch").forEach((ch, i) => {
      ch.animate(
        [{ transform: "translateY(110%) rotate(8deg)" }, { transform: "translateY(0) rotate(0)" }],
        { duration: 620, delay: 40 + i * 32, easing: "cubic-bezier(.34,1.56,.64,1)", fill: "backwards" }
      );
    });
    [descEl, notesEl].forEach((el, k) => el.animate(
      [{ opacity: 0, transform: "translateY(14px)" }, { opacity: 1, transform: "none" }],
      { duration: 500, delay: 260 + k * 90, easing: "ease-out", fill: "backwards" }
    ));
  }

  let pending = null;
  async function go(i, dir = 1) {
    i = (i + drinks.length) % drinks.length;
    if (busy) { pending = { i, dir }; return; }
    if (i === current) return;
    busy = true;
    const d = drinks[i];
    if (!reduce) {
      await cup.animate(
        [{ transform: "none", opacity: 1 },
         { transform: `translate(${-60 * dir}px, -50px) rotate(${-14 * dir}deg) scale(.8)`, opacity: 0 }],
        { duration: 340, easing: "cubic-bezier(.55,0,.8,.4)", fill: "forwards" }
      ).finished;
    }
    current = i;
    setScene(d);
    setText(d);
    cup.src = d.img;
    cup.alt = d.name.join(" ") + " Galgah";
    animateLetters();
    if (!reduce) {
      cup.getAnimations().forEach(a => a.cancel());
      const drop = cup.animate(
        [{ transform: `translate(${50 * dir}px, -140%) rotate(${16 * dir}deg) scale(.9)`, opacity: 0, offset: 0 },
         { transform: "translate(0, 0) rotate(0) scale(1.04, .94)", opacity: 1, offset: .62 },
         { transform: "translate(0, -18px) rotate(-2deg) scale(.98, 1.03)", offset: .8 },
         { transform: "none", opacity: 1, offset: 1 }],
        { duration: 820, easing: "cubic-bezier(.3,.7,.4,1)" }
      );
      setTimeout(() => splash(d), 820 * .6);
      await drop.finished;
    }
    busy = false;
    if (pending) { const q = pending; pending = null; return go(q.i, q.dir); }
  }

  function progressBar() {
    [...chipsEl.querySelectorAll(".prog")].forEach((p, i) => {
      p.getAnimations().forEach(a => a.cancel());
      p.style.width = "0";
      if (i === current && !halted()) {
        p.animate([{ width: "0%" }, { width: "100%" }], { duration: DURATION, easing: "linear", fill: "forwards" });
      }
    });
  }
  function restart() {
    clearTimeout(timer);
    progressBar();
    if (halted()) return;
    timer = setTimeout(() => { go(current + 1, 1).then(restart); }, DURATION);
  }

  $("prev").addEventListener("click", () => { go(current - 1, -1).then(restart); });
  $("next").addEventListener("click", () => { go(current + 1, 1).then(restart); });

  const panel = $("panel");
  // announce slide changes only when the visitor is driving, never during auto-rotation
  const syncPause = () => panel.setAttribute("aria-live", halted() ? "polite" : "off");
  // rotation also stops while keyboard focus is inside the carousel
  stage.addEventListener("focusin", (e) => { if (!focusPaused && e.target.matches(":focus-visible")) { focusPaused = true; syncPause(); restart(); } });
  stage.addEventListener("focusout", (e) => {
    if (stage.contains(e.relatedTarget)) return;
    focusPaused = false; syncPause(); restart();
  });

  // tabs: arrow keys move between flavours, Home / End jump to the ends
  chipsEl.addEventListener("keydown", (e) => {
    const n = drinks.length;
    const map = { ArrowRight: current + 1, ArrowDown: current + 1, ArrowLeft: current - 1, ArrowUp: current - 1, Home: 0, End: n - 1 };
    if (!(e.key in map)) return;
    e.preventDefault(); e.stopPropagation();
    const i = (map[e.key] + n) % n;
    chipsEl.children[i].tabIndex = 0;
    chipsEl.children[i].focus();
    go(i, map[e.key] >= current ? 1 : -1).then(restart);
  });
  // page-level shortcut, only when nothing interactive has focus
  document.addEventListener("keydown", (e) => {
    if (e.target !== document.body && e.target !== document.documentElement) return;
    if (e.key === "ArrowRight") { go(current + 1, 1).then(restart); }
    if (e.key === "ArrowLeft") { go(current - 1, -1).then(restart); }
  });
  zone.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") { paused = true; restart(); } });
  zone.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse") { paused = false; restart(); tilt.style.transform = ""; } });
  zone.addEventListener("pointermove", (e) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = zone.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    tilt.style.transform = `rotateY(${x * 18}deg) rotateX(${-y * 12}deg)`;
  });

  // swipe anywhere on the stage (touch), tap the cup for a splash
  let sx = null;
  stage.addEventListener("pointerdown", (e) => { if (e.pointerType !== "mouse") sx = e.clientX; });
  stage.addEventListener("pointerup", (e) => {
    if (sx === null) return;
    const dx = e.clientX - sx; sx = null;
    if (Math.abs(dx) > 40) { const dir = dx < 0 ? 1 : -1; go(current + dir, dir).then(restart); }
  });
  stage.addEventListener("pointercancel", () => { sx = null; });
  cup.addEventListener("click", () => splash(drinks[current]));

  // ---------- canvas: splash on landing ----------
  const cv = $("fx"), ctx = cv.getContext("2d");
  let W = 0, H = 0, drops = [], looping = false;
  // photos are 825 x 1024; cover the stage and keep each photo's shadow under the cup
  const PW = 825, PH = 1024;
  const narrow = window.matchMedia("(max-width: 900px), (max-aspect-ratio: 1/1)");
  let scene = { sw: 260, cupH: 360 };
  function layout() {
    const s = Math.max(W / PW, H / PH);
    const iw = PW * s, ih = PH * s, ox = (W - iw) / 2;
    const target = H * (narrow.matches ? .76 : .8);
    drinks.forEach(d => {
      const oy = Math.min(0, Math.max(H - ih, target - d.sy * ih));
      d.shadowY = oy + d.sy * ih;
      const el = $("bg-" + d.key);
      el.style.backgroundSize = `${iw}px ${ih}px`;
      el.style.backgroundPosition = `${ox}px ${oy}px`;
    });
    scene.sw = .32 * iw;
    scene.cupH = Math.min(H * (narrow.matches ? .4 : .52), scene.sw * 1.3);
    stage.style.setProperty("--cupH", scene.cupH + "px");
    stage.style.setProperty("--cw", scene.cupH * .42 + "px");
    placeCup();
  }
  function placeCup() {
    const d = drinks[current];
    if (d.shadowY == null) return;
    stage.style.setProperty("--cupB", (H - d.shadowY + scene.cupH * .07) + "px");
  }
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = stage.clientWidth; H = stage.clientHeight;
    stage.style.setProperty("--H", H + "px");
    layout();
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function splash(d) {
    if (reduce) return;
    const zr = zone.getBoundingClientRect(), sr = stage.getBoundingClientRect();
    const cx = zr.left - sr.left + zr.width / 2;
    const base = zr.bottom - sr.top;
    const rim = zr.top - sr.top + zr.height * .12;
    for (let k = 0; k < 34; k++) {
      const ang = Math.PI + Math.random() * Math.PI, sp = 3 + Math.random() * 7;
      drops.push({ x: cx + (Math.random() - .5) * zr.width * .5, y: base, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp - 2,
                   r: 3 + Math.random() * 6, life: 1, c: d.splash[k % d.splash.length] });
    }
    for (let k = 0; k < 5; k++) {
      drops.push({ x: cx + (Math.random() - .5) * 60, y: rim, vx: (Math.random() - .5) * 8, vy: -4 - Math.random() * 5,
                   r: 9 + Math.random() * 7, life: 1, c: "ice", rot: Math.random() * 6, vr: (Math.random() - .5) * .2 });
    }
    if (!looping) { looping = true; requestAnimationFrame(tick); }
  }
  function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }
  function tick() {
    ctx.clearRect(0, 0, W, H);
    for (let i = drops.length - 1; i >= 0; i--) {
      const p = drops[i];
      p.vy += .32; p.x += p.vx; p.y += p.vy; p.life -= .014;
      if (p.life <= 0 || p.y > H + 30) { drops.splice(i, 1); continue; }
      ctx.globalAlpha = Math.max(0, Math.min(1, p.life * 1.4));
      if (p.c === "ice") {
        p.rot += p.vr;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.fillStyle = "rgba(255,255,255,.55)"; ctx.strokeStyle = "rgba(255,255,255,.95)"; ctx.lineWidth = 1.5;
        roundRect(-p.r, -p.r, p.r * 2, p.r * 2, 4); ctx.fill(); ctx.stroke();
        ctx.fillStyle = "rgba(255,255,255,.9)"; roundRect(-p.r * .6, -p.r * .6, p.r * .5, p.r * .5, 2); ctx.fill();
        ctx.restore();
      } else {
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, p.r, p.r * (1 + Math.min(.6, Math.abs(p.vy) * .05)), Math.atan2(p.vy, p.vx) + Math.PI / 2, 0, Math.PI * 2);
        ctx.fillStyle = p.c; ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
    if (drops.length) requestAnimationFrame(tick); else { looping = false; ctx.clearRect(0, 0, W, H); }
  }

  // ---------- init ----------
  setScene(drinks[0]);
  setText(drinks[0]);
  resize();
  new ResizeObserver(resize).observe(stage);
  if (!reduce) {
    animateLetters();
    setTimeout(() => splash(drinks[0]), 500);
  }
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) { clearTimeout(timer); } else { restart(); }
  });
  syncPause();
  restart();
})();
