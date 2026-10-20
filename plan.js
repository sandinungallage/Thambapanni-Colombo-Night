/* 3D ground plan. Used only by ground-plan.html (needs site.js and three.js loaded first). */
const Plan = (function () {
  const ZONES = [
    { id: '01', name: 'Main Stage', desc: 'The main concert stage. 2forty2 and the artists performed here from 7:00 PM.', focus: [-48, 0, -22], lab: [-48, 15, -24] },
    { id: '02', name: 'VVIP Area', desc: 'Table seating closest to the stage, sold per person or as a 6 pack.', focus: [-34, 0, -1], lab: [-34, 5, -1] },
    { id: '03', name: 'VIP Area', desc: 'Seated blocks beside and behind the VVIP tables.', focus: [2, 0, -1], lab: [2, 5, -1] },
    { id: '04', name: 'Beer Shop', desc: 'The bar, set back from the stage next to the wash rooms.', focus: [22, 0, -30], lab: [22, 9, -30] },
    { id: '05', name: 'Wash Rooms', desc: 'Wash rooms, beside the beer shop.', focus: [37, 0, -30], lab: [37, 9, -30] },
    { id: '06', name: 'Food Stalls', desc: 'Two covered stalls on a raised platform near the front of the venue.', focus: [-28, 0, 27], lab: [-28, 12, 27] },
    { id: '07', name: 'Standing Area', desc: 'Open floor around both stages for standing ticket holders.', focus: [30, 0, 0], lab: [30, 3, -6] },
    { id: '08', name: 'Heritage Moves Stage', desc: 'Home of the free-entrance dance and culture showcase, from 5:00 PM.', focus: [38, 0, 20], lab: [38, 6, 20] },
    { id: '09', name: 'Entrance', desc: 'Main entrance from Bauddhaloka Mawatha. Doors opened at 6:30 PM.', focus: [60, 0, 27], lab: [64, 11, 27] }
  ];
  let ok = false, started = false, running = false, raf = 0;
  let renderer, scene, camera, wrap, canvas;
  let az = 0.28, pol = 1.0, rad = 150, tgt, base = { az: .28, pol: 1.0, rad: 150 };
  let spin = !reduceMotion, selected = null, hover = null, dragging = false, lastInput = 0, anim = null;
  const pins = {}; let sparks, sparkData, bulbsA, bulbsB, arrows = [];

  const GOLD = 0xc9a96a;
  function build() {
    const T = THREE;
    scene = new T.Scene(); scene.fog = new T.Fog(0x0a0908, 190, 360);
    camera = new T.PerspectiveCamera(38, 1.6, 1, 800);
    tgt = new T.Vector3(0, 0, 4);
    scene.add(new T.AmbientLight(0xffe9c9, .55));
    scene.add(new T.HemisphereLight(0xfff0d6, 0x1a120a, .45));
    const sun = new T.DirectionalLight(0xffe1b0, .95); sun.position.set(-50, 90, 70); scene.add(sun);

    ZONES.forEach(z => { z.mats = []; z.lines = []; z.glow = 0; z.group = new T.Group(); scene.add(z.group);
      z.lineMat = new T.LineBasicMaterial({ color: 0x8d7545, transparent: true, opacity: .55 }); z.lines.push(z.lineMat); });
    const Z = id => ZONES.find(z => z.id === id);
    const M = (z, color, rough) => { const m = new T.MeshStandardMaterial({ color, roughness: rough == null ? .8 : rough, metalness: .1 }); z.mats.push(m); return m; };
    const box = (z, w, h, d, x, y, zz, color, edge) => {
      const m = new T.Mesh(new T.BoxGeometry(w, h, d), M(z, color)); m.position.set(x, y, zz); z.group.add(m);
      if (edge !== false) m.add(new T.LineSegments(new T.EdgesGeometry(m.geometry), z.lineMat));
      return m;
    };
    const inst = (z, w, h, d, color, pts) => {
      const im = new T.InstancedMesh(new T.BoxGeometry(w, h, d), M(z, color), pts.length); const o = new T.Object3D();
      pts.forEach((p, i) => { o.position.set(p[0], p[1], p[2]); o.updateMatrix(); im.setMatrixAt(i, o.matrix); }); z.group.add(im); return im;
    };

    // ground slab + grid
    const slab = new T.Mesh(new T.BoxGeometry(140, 1.4, 90), new T.MeshStandardMaterial({ color: 0x16120e, roughness: .95 }));
    slab.position.y = -.8; scene.add(slab);
    slab.add(new T.LineSegments(new T.EdgesGeometry(slab.geometry), new T.LineBasicMaterial({ color: GOLD, transparent: true, opacity: .8 })));
    const grid = new T.GridHelper(140, 28, 0x3a3123, 0x241e16); grid.scale.z = 90 / 140; grid.position.y = .02; scene.add(grid);

    // 01 main stage
    let z = Z('01'); const sx = -48, sz = -24;
    box(z, 28, 3, 17, sx, 1.5, sz, 0x1b1815);
    const wallTex = (() => { const c = document.createElement('canvas'); c.width = 256; c.height = 96; const g = c.getContext('2d');
      g.fillStyle = '#1a130a'; g.fillRect(0, 0, 256, 96);
      for (let i = 0; i < 26; i++) { const h = 20 + ((i * 37) % 60), w = 6 + (i % 3) * 3; g.fillStyle = ['#c9a96a', '#8d7545', '#e0c58a', '#6b4f2a'][i % 4]; g.fillRect(i * 10, 96 - h, w, h); }
      return new T.CanvasTexture(c); })();
    const led = new T.Mesh(new T.PlaneGeometry(22, 8), new T.MeshBasicMaterial({ map: wallTex })); led.position.set(sx, 7.2, sz - 7.5); z.group.add(led);
    [[-13, -8], [13, -8], [-13, 8], [13, 8]].forEach(p => box(z, .9, 13, .9, sx + p[0], 6.5, sz + p[1], 0x2a251d, false));
    const roof = box(z, 29, .9, 18, sx, 13.4, sz, 0x100e0c); roof.rotation.x = -.05;
    box(z, 3.2, 8, 3.2, sx - 17, 4, sz + 2, 0x141210); box(z, 3.2, 8, 3.2, sx + 17, 4, sz + 2, 0x141210);

    // 02 VVIP tables
    z = Z('02'); const tp = [], bp = [];
    [-9, -3.5, 2, 7.5].forEach(rz => [-46, -40, -34, -28, -22].forEach(rx => { tp.push([rx, 1.4, rz]); bp.push([rx, .4, rz - 1.7], [rx, .4, rz + 1.7]); }));
    inst(z, 4.6, .35, 2.4, 0x6b4a28, tp); inst(z, 4.4, .8, .7, 0x3a2c1c, bp);
    tp.forEach(p => { const b = new T.Mesh(new T.BoxGeometry(1, 1.3, 1), M(z, 0x2a1f14)); b.position.set(p[0], .65, p[2]); z.group.add(b); });

    // 03 VIP seating
    z = Z('03'); const cp = [];
    [[-6, -6], [11, -6], [-6, 4], [11, 4]].forEach(b => { for (let r = 0; r < 3; r++) for (let c = 0; c < 9; c++) cp.push([b[0] - 7 + c * 1.7, .55, b[1] + r * 2]); });
    inst(z, 1.2, 1.1, 1.2, 0x4a3d2a, cp);
    box(z, 40, .15, 18, 2, .08, -1, 0x1c1812, true);

    // 04 beer shop, 05 wash rooms
    z = Z('04'); box(z, 10, 5, 7, 22, 2.5, -30, 0x3a3226); box(z, 11, .7, 8, 22, 5.3, -30, 0xb5632f);
    z = Z('05'); box(z, 11, 5, 8, 37, 2.5, -30, 0x2a2620); box(z, 12, .7, 9, 37, 5.3, -30, 0x14120f); box(z, 3, 3.6, .3, 37, 1.8, -25.9, 0x090807, false);

    // 06 food stalls
    z = Z('06'); box(z, 28, 1, 14, -28, .5, 27, 0x1a1612);
    [[-34, 0xd1a64a], [-22, 0xb5532f]].forEach(s => {
      box(z, 9, 2.6, 5, s[0], 2.3, 27, 0x3a3226);
      const tent = new T.Mesh(new T.ConeGeometry(7.5, 4.5, 4), M(z, s[1])); tent.rotation.y = Math.PI / 4; tent.position.set(s[0], 8.2, 27); z.group.add(tent);
      tent.add(new T.LineSegments(new T.EdgesGeometry(tent.geometry), z.lineMat));
      [[-4, -2.4], [4, -2.4], [-4, 2.4], [4, 2.4]].forEach(p => box(z, .3, 5.2, .3, s[0] + p[0], 4.1, 27 + p[1], 0x8d7545, false));
    });

    // 07 standing area
    z = Z('07'); box(z, 48, .12, 54, 42, .06, 2, 0x241d14); box(z, 30, .12, 22, 3, .06, 27, 0x241d14);

    // 08 heritage stage
    z = Z('08'); box(z, 20, 1.4, 20, 38, .7, 20, 0x2a251d);
    const tex = (() => { const c = document.createElement('canvas'); c.width = c.height = 512; const g = c.getContext('2d');
      g.fillStyle = '#1b1712'; g.fillRect(0, 0, 512, 512); g.strokeStyle = '#8d7545'; g.lineWidth = 6; g.strokeRect(18, 18, 476, 476);
      g.fillStyle = '#c9a96a'; g.textAlign = 'center'; g.font = '700 72px Georgia, serif'; g.fillText('HERITAGE', 256, 210); g.fillText('MOVES', 256, 290);
      g.font = '400 40px Georgia, serif'; g.fillText('S T A G E', 256, 370); return new T.CanvasTexture(c); })();
    const top = new T.Mesh(new T.PlaneGeometry(19.2, 19.2), new T.MeshBasicMaterial({ map: tex })); top.rotation.x = -Math.PI / 2; top.position.set(38, 1.42, 20); z.group.add(top);

    // 09 entrance
    z = Z('09'); box(z, 1.1, 9, 1.1, 66, 4.5, 20, 0x2a251d); box(z, 1.1, 9, 1.1, 66, 4.5, 34, 0x2a251d); box(z, 1.6, 1.4, 16, 66, 9.4, 27, 0x8d7545);
    [0, 1, 2].forEach(i => { const a = new T.Mesh(new T.ConeGeometry(2.2, 4.4, 3), M(z, GOLD)); a.rotation.z = Math.PI / 2; a.rotation.x = Math.PI / 2; a.position.set(58 - i * 7, .4, 27); a.scale.set(1, 1, .35); a.userData.base = 58 - i * 7; z.group.add(a); arrows.push(a); });

    // string lights over standing area
    const dot = (() => { const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d'); const r = g.createRadialGradient(32, 32, 0, 32, 32, 32);
      r.addColorStop(0, 'rgba(255,236,190,1)'); r.addColorStop(.35, 'rgba(255,200,120,.65)'); r.addColorStop(1, 'rgba(255,190,100,0)'); g.fillStyle = r; g.fillRect(0, 0, 64, 64); return new T.CanvasTexture(c); })();
    const pa = [], pb = [];
    [-8, 8, 30].forEach((lz) => { for (let i = 0; i <= 30; i++) { const t = i / 30, x = 20 + t * 44, y = 14 - Math.sin(Math.PI * t) * 2.4; (i % 2 ? pa : pb).push(x, y, lz); } });
    [20, 64].forEach(px => [-8, 8, 30].forEach(pz => { const p = new T.Mesh(new T.CylinderGeometry(.18, .18, 14, 6), new T.MeshBasicMaterial({ color: 0x3a3123 })); p.position.set(px, 7, pz); scene.add(p); }));
    const bm = () => new T.PointsMaterial({ size: 3.2, map: dot, transparent: true, depthWrite: false, blending: T.AdditiveBlending, sizeAttenuation: true });
    const mk = a => { const g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(a, 3)); return new T.Points(g, bm()); };
    bulbsA = mk(pa); bulbsB = mk(pb); scene.add(bulbsA, bulbsB);

    // sparks above the Heritage stage
    const N = 70, sp = new Float32Array(N * 3); sparkData = [];
    for (let i = 0; i < N; i++) sparkData.push({ x: 38 + (Math.random() - .5) * 8, y: Math.random() * 9, z: 20 + (Math.random() - .5) * 8, v: .04 + Math.random() * .08, d: Math.random() * 6 });
    const sg = new T.BufferGeometry(); sg.setAttribute('position', new T.BufferAttribute(sp, 3));
    sparks = new T.Points(sg, new T.PointsMaterial({ size: 1.6, map: dot, color: 0xff9a3c, transparent: true, depthWrite: false, blending: T.AdditiveBlending }));
    scene.add(sparks);
  }

  function buildUi() {
    const pinsEl = $('#pins');
    pinsEl.innerHTML = ZONES.map(z => '<button class="pin" type="button" data-id="' + z.id + '" aria-label="' + esc(z.name) + '">' + z.id + '</button>').join('');
    $$('.pin', pinsEl).forEach(b => { pins[b.dataset.id] = b;
      b.addEventListener('click', () => select(b.dataset.id));
      b.addEventListener('pointerenter', () => { hover = b.dataset.id; }); b.addEventListener('pointerleave', () => { hover = null; }); });
    $('#legend').innerHTML = ZONES.map(z => '<li><button type="button" data-id="' + z.id + '"><i>' + z.id + '</i><span>' + esc(z.name) + '</span></button></li>').join('');
    $$('#legend button').forEach(b => { b.addEventListener('click', () => { select(b.dataset.id); }); b.addEventListener('pointerenter', () => { hover = b.dataset.id; }); b.addEventListener('pointerleave', () => { hover = null; }); });
    now();
  }
  function now() {
    const z = ZONES.find(q => q.id === selected);
    $('#now').innerHTML = z ? '<p class="label">Zone ' + z.id + '</p><h3>' + esc(z.name) + '</h3><p>' + esc(z.desc) + '</p>'
      : '<p class="label">Explore</p><h3>Tap a number</h3><p class="muted">Select a zone on the plan or from the list to see what it is and fly the camera to it.</p>';
    $$('#legend button').forEach(b => b.classList.toggle('on', b.dataset.id === selected));
    Object.keys(pins).forEach(k => pins[k].classList.toggle('on', k === selected));
  }

  const fitRad = () => { const a = camera.aspect; return 150 * Math.max(1, 1.5 / a); };
  function tween(to, dur) {
    if (reduceMotion) { az = to.az; pol = to.pol; rad = to.rad; tgt.set(to.x, 0, to.z); anim = null; return; }
    anim = { t: performance.now(), dur: dur || 1000, from: { az, pol, rad, x: tgt.x, z: tgt.z }, to };
  }
  function select(id) {
    selected = id; spin = false; $('#t-spin').setAttribute('aria-pressed', 'false'); now();
    const z = ZONES.find(q => q.id === id);
    const big = id === '07' || id === '03' || id === '02';
    tween({ az: az, pol: .95, rad: fitRad() * (big ? .62 : .4), x: z.focus[0], z: z.focus[2] });
  }
  function reset() { selected = null; now(); tween({ az: base.az, pol: base.pol, rad: fitRad(), x: 0, z: 4 }); }
  const norm = a => { while (a > Math.PI) a -= Math.PI * 2; while (a < -Math.PI) a += Math.PI * 2; return a; };

  function resize() {
    if (!ok) return;
    const w = wrap.clientWidth, h = wrap.clientHeight; if (!w || !h) return;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
    if (!selected && !anim) rad = fitRad();
  }
  function frame(now_) {
    if (!running) return;
    raf = requestAnimationFrame(frame);
    const t = now_ / 1000;
    if (anim) {
      let k = Math.min(1, (now_ - anim.t) / anim.dur); const e = k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
      az = anim.from.az + norm(anim.to.az - anim.from.az) * e; pol = anim.from.pol + (anim.to.pol - anim.from.pol) * e; rad = anim.from.rad + (anim.to.rad - anim.from.rad) * e;
      tgt.set(anim.from.x + (anim.to.x - anim.from.x) * e, 0, anim.from.z + (anim.to.z - anim.from.z) * e); if (k >= 1) anim = null;
    } else if (spin && !dragging && performance.now() - lastInput > 2500) az += .0022;
    const sp = Math.sin(pol);
    camera.position.set(tgt.x + rad * sp * Math.sin(az), tgt.y + rad * Math.cos(pol), tgt.z + rad * sp * Math.cos(az)); camera.lookAt(tgt);
    ZONES.forEach(z => { const target = (selected === z.id || hover === z.id) ? 1 : 0; z.glow += (target - z.glow) * .12; const g = z.glow;
      z.mats.forEach(m => m.emissive.setRGB(.5 * g, .38 * g, .14 * g)); z.lineMat.color.setRGB(.55 + .33 * g, .46 + .33 * g, .27 + .3 * g); z.lineMat.opacity = .55 + .45 * g; });
    bulbsA.material.opacity = .65 + .35 * Math.sin(t * 2.1); bulbsB.material.opacity = .65 + .35 * Math.sin(t * 2.1 + 2.4);
    const pos = sparks.geometry.attributes.position;
    sparkData.forEach((s, i) => { s.y += s.v; if (s.y > 10) { s.y = 1.6; s.x = 38 + (Math.random() - .5) * 8; s.z = 20 + (Math.random() - .5) * 8; } pos.setXYZ(i, s.x + Math.sin(t + s.d) * .5, s.y, s.z); }); pos.needsUpdate = true;
    arrows.forEach(a => { a.position.x = a.userData.base - ((t * 6) % 7); });
    renderer.render(scene, camera);
    const w = wrap.clientWidth, h = wrap.clientHeight, v = new THREE.Vector3();
    ZONES.forEach(z => { v.set(z.lab[0], z.lab[1], z.lab[2]).project(camera); const p = pins[z.id]; if (v.z > 1 || v.z < -1) { p.style.display = 'none'; return; }
      p.style.display = ''; p.style.transform = 'translate(' + ((v.x * .5 + .5) * w).toFixed(1) + 'px,' + ((-v.y * .5 + .5) * h).toFixed(1) + 'px)'; });
  }

  function bindInput() {
    let px = 0, py = 0;
    wrap.addEventListener('pointerdown', e => { if (e.target.closest('button')) return; dragging = true; px = e.clientX; py = e.clientY; wrap.classList.add('drag'); anim = null; });
    window.addEventListener('pointermove', e => { if (!dragging) return; const dx = e.clientX - px, dy = e.clientY - py; px = e.clientX; py = e.clientY;
      az -= dx * .006; if (e.pointerType === 'mouse') pol = Math.min(1.4, Math.max(.2, pol - dy * .005)); lastInput = performance.now(); });
    const end = () => { dragging = false; wrap.classList.remove('drag'); lastInput = performance.now(); };
    window.addEventListener('pointerup', end); window.addEventListener('pointercancel', end);
    $('#t-spin').addEventListener('click', e => { spin = !spin; e.currentTarget.setAttribute('aria-pressed', String(spin)); });
    $('#t-top').addEventListener('click', () => { selected = null; now(); spin = false; $('#t-spin').setAttribute('aria-pressed', 'false'); tween({ az: az, pol: .16, rad: fitRad() * .92, x: 0, z: 2 }); });
    $('#t-reset').addEventListener('click', reset);
    $('#t-in').addEventListener('click', () => { anim = null; rad = Math.max(35, rad * .8); });
    $('#t-out').addEventListener('click', () => { anim = null; rad = Math.min(320, rad * 1.25); });
  }

  function init() {
    wrap = $('#plan-stage'); canvas = $('#plan-canvas');
    try {
      if (typeof THREE === 'undefined') throw new Error('no three');
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2)); renderer.setClearColor(0x000000, 0);
      build(); ok = true;
    } catch (e) {
      ok = false; wrap.hidden = true; $('#plan-fallback').hidden = false;
    }
    if (ok) { buildUi(); bindInput(); if ('ResizeObserver' in window) new ResizeObserver(resize).observe(wrap); window.addEventListener('resize', resize); }
    else { $('#now').innerHTML = '<p class="label">Zones</p><p class="muted">01 Main Stage, 02 VVIP Area, 03 VIP Area, 04 Beer Shop, 05 Wash Rooms, 06 Food Stalls, 07 Standing Area, 08 Heritage Moves Stage, 09 Entrance.</p>'; }
  }
  function start() {
    if (!started) { started = true; init(); }
    if (!ok || running) return;
    running = true; resize(); rad = fitRad(); base.rad = rad; raf = requestAnimationFrame(frame);
  }
  function stop() { running = false; cancelAnimationFrame(raf); }
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); else start(); });
  return { start, stop };
})();

Plan.start();
