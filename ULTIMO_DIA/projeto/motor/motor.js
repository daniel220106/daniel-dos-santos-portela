// ÚLTIMO DIA — motor de animação 2D (canvas). Reutilizável em todos os episódios.
// Cada episódio define window.CENAS = [{a, b, fn, trans}] e chama MOTOR.iniciar().
'use strict';
const W = 1920, H = 1080;
const PAL = {
  preto: '#07080a', vermelho: '#8e1b1b', vermelhoVivo: '#c62a24', cinza: '#4a4f57',
  laranja: '#e8792b', frio: '#5f7a94', texto: '#f2efe9'
};

// ---------- utilidades ----------
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, t) => a + (b - a) * t;
const sstep = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };
const easeIO = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const easeOut = t => 1 - Math.pow(1 - clamp(t), 3);
function rng(seed) { let s = seed >>> 0 || 1; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
function hash(n) { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
function noise1(x) { const i = Math.floor(x), f = x - i; const u = f * f * (3 - 2 * f); return lerp(hash(i), hash(i + 1), u) * 2 - 1; }

const _bufs = {};
function buf(nome, w = W, h = H) {
  let c = _bufs[nome];
  if (!c) { c = _bufs[nome] = document.createElement('canvas'); }
  if (c.width !== w || c.height !== h) { c.width = w; c.height = h; }
  return c;
}
function rr(c, x, y, w, h, r) { c.beginPath(); c.roundRect(x, y, w, h, r); }
function vgrad(c, y0, y1, stops) { const g = c.createLinearGradient(0, y0, 0, y1); stops.forEach(([o, col]) => g.addColorStop(o, col)); return g; }
function hgrad(c, x0, x1, stops) { const g = c.createLinearGradient(x0, 0, x1, 0); stops.forEach(([o, col]) => g.addColorStop(o, col)); return g; }
function rgrad(c, x, y, r0, r1, stops) { const g = c.createRadialGradient(x, y, r0, x, y, r1); stops.forEach(([o, col]) => g.addColorStop(o, col)); return g; }
function camera(c, zoom, cx, cy, rot = 0) { c.translate(W / 2, H / 2); c.rotate(rot); c.scale(zoom, zoom); c.translate(-cx, -cy); }
// tremor de câmera na mão (suave)
function handheld(t, amp = 4) { return [noise1(t * 0.7) * amp, noise1(t * 0.6 + 40) * amp, noise1(t * 0.4 + 90) * 0.002 * amp]; }

// ---------- personagens ----------
// Visual fixo de cada personagem. NUNCA alterar sem justificativa narrativa.
const VISUAIS = {
  lucas: {
    pele: '#a9724f', peleSombra: '#7d4f35', cabelo: '#1b1411', camiseta: '#3c4149', camisetaSombra: '#2b2f35',
    calca: '#2a3850', calcaSombra: '#1d2739', tenis: '#d6d4cf', sola: '#3a3a3a', barba: 0.22, cabeloTipo: 'curto',
    altura: 1.0, largura: 1.0
  },
  cida: { pele: '#c99a78', peleSombra: '#9a6f52', cabelo: '#cfcac3', camiseta: '#5a3d5c', camisetaSombra: '#40293f', calca: '#3a2a3a', calcaSombra: '#2a1e2a', tenis: '#3a2e28', sola: '#1a1512', barba: 0, cabeloTipo: 'coque', oculos: true, vestido: '#5a3d5c', mangaLonga: true, altura: 0.9, largura: 1.05 },
  paula: { pele: '#8a5a3c', peleSombra: '#64402a', cabelo: '#17110e', camiseta: '#3f7f86', camisetaSombra: '#2d5f65', calca: '#3f7f86', calcaSombra: '#2d5f65', tenis: '#e8e6e0', sola: '#888', barba: 0, cabeloTipo: 'rabo', altura: 0.95, largura: 0.92 },
  jorge: { pele: '#c08866', peleSombra: '#8f6148', cabelo: '#9a958e', camiseta: '#b9a785', camisetaSombra: '#958566', calca: '#5a4634', calcaSombra: '#40322a', tenis: '#2a2118', sola: '#111', barba: 0, cabeloTipo: 'careca', bigode: '#8a857e', altura: 0.98, largura: 1.15 },
  mae: { pele: '#9a6545', peleSombra: '#6f472f', cabelo: '#1c1410', camiseta: '#8a6a3a', camisetaSombra: '#6a502a', calca: '#2f3440', calcaSombra: '#20242d', tenis: '#888', sola: '#333', barba: 0, cabeloTipo: 'longo', altura: 0.95, largura: 0.95 },
  crianca1: { pele: '#9a6545', peleSombra: '#6f472f', cabelo: '#1c1410', camiseta: '#c23b33', camisetaSombra: '#922c26', calca: '#2f3a5a', calcaSombra: '#202840', tenis: '#ddd', sola: '#444', barba: 0, cabeloTipo: 'curto', cabecaEsc: 1.3, altura: 0.55, largura: 0.75 },
  crianca2: { pele: '#9a6545', peleSombra: '#6f472f', cabelo: '#1c1410', camiseta: '#e0b23a', camisetaSombra: '#b08a2a', calca: '#6a3a5a', calcaSombra: '#4a2a40', tenis: '#ddd', sola: '#444', barba: 0, cabeloTipo: 'rabo', cabecaEsc: 1.3, altura: 0.5, largura: 0.72 },
  morador7: { pele: '#d0a080', peleSombra: '#a07455', cabelo: '#4a3a2a', camiseta: '#2f4a3a', camisetaSombra: '#21352a', calca: '#4a4a4a', calcaSombra: '#333', tenis: '#222', sola: '#111', barba: 0.35, cabeloTipo: 'curto', altura: 1.02, largura: 1.08 },
  soldado: { pele: '#a9724f', peleSombra: '#7d4f35', cabelo: '#4a5a3a', camiseta: '#4f5a3a', camisetaSombra: '#3a442a', calca: '#4f5a3a', calcaSombra: '#3a442a', tenis: '#1a1a1a', sola: '#111', barba: 0, cabeloTipo: 'quepe', altura: 1.0, largura: 1.05 },
  defesa: { pele: '#b07a55', peleSombra: '#7d4f35', cabelo: '#e07a20', camiseta: '#e07a20', camisetaSombra: '#b05a10', calca: '#2a3340', calcaSombra: '#1d232d', tenis: '#1a1a1a', sola: '#111', barba: 0, cabeloTipo: 'quepe', altura: 1.0, largura: 1.05 },
  pedestre1: { pele: '#c08a64', peleSombra: '#8d6044', cabelo: '#2b211a', camiseta: '#6b3a2f', camisetaSombra: '#4c2922', calca: '#3a3a3f', calcaSombra: '#26262a', tenis: '#2a2a2a', sola: '#111', barba: 0, cabeloTipo: 'curto', altura: 0.97, largura: 1.05 },
  pedestre2: { pele: '#7a5038', peleSombra: '#553624', cabelo: '#141010', camiseta: '#5d6b52', camisetaSombra: '#434e3b', calca: '#4b4033', calcaSombra: '#352d24', tenis: '#bbb', sola: '#333', barba: 0, cabeloTipo: 'longo', altura: 0.93, largura: 0.95 },
};

// pose: {x,y (quadril), s, dir, tronco, cabeca:{giro,incl}, bracoF:[ombro,cotovelo], bracoT, pernaF:[quadril,joelho], pernaT, piscar, boca, expr, luz}
function caminhada(fase, intens = 1) {
  const s = Math.sin(fase * Math.PI * 2), c2 = Math.cos(fase * Math.PI * 2);
  return {
    pernaF: [0.42 * s * intens, -Math.max(0, -c2) * 0.75 * intens - 0.05],
    pernaT: [-0.42 * s * intens, -Math.max(0, c2) * 0.75 * intens - 0.05],
    bracoF: [-0.35 * s * intens, 0.25 + 0.15 * intens],
    bracoT: [0.35 * s * intens, 0.25 + 0.15 * intens],
    bob: -Math.abs(Math.cos(fase * Math.PI * 2)) * 6 * intens,
  };
}

function desenharPessoa(ctx, P, vis = VISUAIS.lucas) {
  if (typeof vis === 'string') vis = VISUAIS[vis];
  if (P.dia && vis === VISUAIS.lucas) { // evolução física do Lucas ao longo dos dias
    const k = clamp((P.dia - 1) / 29);
    vis = { ...vis, barba: 0.22 + 0.4 * k, largura: 1 - 0.1 * clamp((P.dia - 5) / 11), camiseta: shade(vis.camiseta, 1 - 0.18 * k), calca: shade(vis.calca, 1 - 0.15 * k) };
  }
  const s = P.s || 1, dir = P.dir || 1;
  const ow = Math.ceil(760 * s), oh = Math.ceil(1250 * s), oy = oh * 0.6;
  const oc = buf('pessoa', ow, oh), c = oc.getContext('2d');
  c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, ow, oh);
  c.save(); c.translate(ow / 2, oy); c.scale(s * dir, s);
  c.scale(vis.largura || 1, vis.altura || 1);
  c.lineCap = 'round'; c.lineJoin = 'round';
  const tr = P.tronco || 0;
  const bF = P.bracoF || [0.05, 0.2], bT = P.bracoT || [-0.05, 0.2];
  const pF = P.pernaF || [0.02, -0.03], pT = P.pernaT || [-0.02, -0.03];
  const TL = 192;
  const ombro = [Math.sin(tr) * (TL - 14), -Math.cos(tr) * (TL - 14)];

  function segmento(x, y, a1, a2, L1, L2) {
    const x1 = x + Math.sin(a1) * L1, y1 = y + Math.cos(a1) * L1;
    const x2 = x1 + Math.sin(a1 + a2) * L2, y2 = y1 + Math.cos(a1 + a2) * L2;
    return [x1, y1, x2, y2];
  }
  function perna(p, escuro) {
    if (P.semPernas) return;
    const [x1, y1, x2, y2] = segmento(0, 8, p[0], p[1], 124, 126);
    c.strokeStyle = escuro ? vis.calcaSombra : vis.calca;
    c.lineWidth = 46; c.beginPath(); c.moveTo(0, 8); c.lineTo(x1, y1); c.stroke();
    c.lineWidth = 40; c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke();
    // tênis
    const ang = p[0] + p[1] + (P.pePlano ? -(p[0] + p[1]) : 0);
    c.save(); c.translate(x2, y2 + 6); c.rotate(-ang * 0.5);
    c.fillStyle = vis.sola; rr(c, -24, 8, 74, 10, 5); c.fill();
    c.fillStyle = escuro ? shade(vis.tenis, 0.65) : vis.tenis; rr(c, -24, -10, 70, 22, 11); c.fill();
    c.restore();
  }
  function braco(b, escuro) {
    const ang = tr; // braço acompanha o tronco
    const [x1, y1, x2, y2] = segmento(ombro[0], ombro[1], b[0] + ang, b[1], 96, 92);
    c.strokeStyle = escuro ? vis.peleSombra : vis.pele;
    c.lineWidth = 24; c.beginPath(); c.moveTo(ombro[0], ombro[1]); c.lineTo(x1, y1); c.lineTo(x2, y2); c.stroke();
    // manga
    const mx = lerp(ombro[0], x1, 0.62), my = lerp(ombro[1], y1, 0.62);
    c.strokeStyle = escuro ? vis.camisetaSombra : vis.camiseta;
    c.lineWidth = vis.mangaLonga ? 30 : 36; c.beginPath(); c.moveTo(ombro[0], ombro[1]); c.lineTo(mx, my);
    if (vis.mangaLonga) c.lineTo(lerp(x1, x2, 0.8), lerp(y1, y2, 0.8)); c.stroke();
    // mão
    c.fillStyle = escuro ? vis.peleSombra : vis.pele;
    c.beginPath(); c.ellipse(x2 + Math.sin(b[0] + b[1] + ang) * 8, y2 + Math.cos(b[0] + b[1] + ang) * 8, 13, 15, -(b[0] + b[1] + ang), 0, 7); c.fill();
    if (P.objeto && !escuro) P.objeto(c, x2 + Math.sin(b[0] + b[1] + ang) * 14, y2 + Math.cos(b[0] + b[1] + ang) * 14, b[0] + b[1] + ang);
    if (P.objetoT && escuro) P.objetoT(c, x2 + Math.sin(b[0] + b[1] + ang) * 14, y2 + Math.cos(b[0] + b[1] + ang) * 14, b[0] + b[1] + ang);
  }
  c.translate(0, P.bob || 0);
  braco(bT, true);
  perna(pT, true);
  perna(pF, false);
  if (vis.vestido && !P.semPernas) { // saia/vestido até o joelho
    const kx = Math.sin(pF[0]) * 130, ky = 8 + Math.cos(pF[0]) * 130;
    c.fillStyle = vis.vestido; c.beginPath(); c.moveTo(-44, -10); c.lineTo(44, -10); c.lineTo(kx + 40, ky + 10); c.lineTo(kx - 44, ky + 14); c.fill();
  }
  // tronco
  c.save(); c.rotate(tr);
  c.fillStyle = vis.vestido || vis.calca; rr(c, -40, -18, 80, 40, 14); c.fill();
  c.fillStyle = vis.camiseta;
  c.beginPath(); c.moveTo(-38, -8); c.lineTo(38, -8);
  c.quadraticCurveTo(46, -95, 40, -150); c.quadraticCurveTo(36, -186, 16, -194);
  c.lineTo(-30, -194); c.quadraticCurveTo(-50, -184, -48, -148); c.quadraticCurveTo(-42, -80, -38, -8); c.fill();
  c.fillStyle = vis.camisetaSombra; c.globalAlpha = 0.5;
  c.beginPath(); c.moveTo(-38, -8); c.lineTo(-10, -8); c.quadraticCurveTo(-18, -100, -26, -194); c.lineTo(-30, -194); c.quadraticCurveTo(-50, -184, -48, -148); c.quadraticCurveTo(-42, -80, -38, -8); c.fill();
  c.globalAlpha = 1;
  if (P.costas) P.costas(c, vis); // acessório nas costas (mochila), usado no EP02
  // pescoço e cabeça
  const cab = P.cabeca || {}; const giro = cab.giro ?? 0, incl = cab.incl ?? 0;
  c.fillStyle = vis.peleSombra; rr(c, -8, -222, 26, 36, 8); c.fill();
  c.translate(6, -212); c.rotate(incl); c.translate(-6, 212);
  if (vis.cabecaEsc) { c.translate(6, -212); c.scale(vis.cabecaEsc, vis.cabecaEsc); c.translate(-6, 212); }
  desenharCabeca(c, vis, giro, P);
  c.restore();
  braco(bF, false);
  c.restore();
  // luz/sombra do ambiente aplicada só sobre o personagem
  if (P.luz) {
    c.globalCompositeOperation = 'source-atop';
    const L = P.luz;
    c.fillStyle = hgrad(c, 0, ow, L.lado > 0 ? [[0, L.sombra], [0.55, 'rgba(0,0,0,0)'], [1, L.brilho]] : [[0, L.brilho], [0.45, 'rgba(0,0,0,0)'], [1, L.sombra]]);
    c.fillRect(0, 0, ow, oh);
    if (L.geral) { c.fillStyle = L.geral; c.fillRect(0, 0, ow, oh); }
    c.globalCompositeOperation = 'source-over';
  }
  if (P.silhueta) {
    c.globalCompositeOperation = 'source-atop'; c.fillStyle = P.silhueta; c.fillRect(0, 0, ow, oh); c.globalCompositeOperation = 'source-over';
  }
  ctx.save(); ctx.globalAlpha *= (P.alpha ?? 1);
  ctx.drawImage(oc, P.x - ow / 2, P.y - oy);
  ctx.restore();
}

function shade(hex, f) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.round(((n >> 16) & 255) * f), g = Math.round(((n >> 8) & 255) * f), b = Math.round((n & 255) * f);
  return `rgb(${r},${g},${b})`;
}

function desenharCabeca(c, vis, giro, P) {
  const cx = 10, cy = -262;
  const fx = cx + 24 + 14 * giro; // centro do rosto
  // cabelo de trás
  c.fillStyle = vis.cabelo;
  if (vis.cabeloTipo === 'longo') { c.beginPath(); c.ellipse(cx - 20, cy + 10, 40, 70, 0.1, 0, 7); c.fill(); }
  if (vis.cabeloTipo === 'rabo') { c.beginPath(); c.ellipse(cx - 52, cy - 4, 14, 40, 0.5, 0, 7); c.fill(); }
  if (vis.cabeloTipo === 'coque') { c.beginPath(); c.arc(cx - 36, cy - 44, 22, 0, 7); c.fill(); }
  // cabeça
  c.fillStyle = vis.pele;
  c.beginPath(); c.ellipse(cx, cy, 45, 55, 0, 0, 7); c.fill();
  c.beginPath(); c.ellipse(cx + 14 + 8 * giro, cy + 30, 33, 28, 0, 0, 7); c.fill();
  // sombra lateral da nuca
  c.save(); c.beginPath(); c.ellipse(cx, cy, 45, 55, 0, 0, 7); c.clip();
  c.fillStyle = vis.peleSombra; c.globalAlpha = 0.45; c.fillRect(cx - 60, cy - 60, 40 - 10 * giro, 130); c.globalAlpha = 1;
  // barba por fazer
  if (vis.barba) { c.fillStyle = `rgba(25,18,14,${vis.barba})`; c.beginPath(); c.ellipse(fx - 4, cy + 36, 34, 20, 0, 0, 7); c.fill(); }
  c.restore();
  // orelha
  if (giro > -1.2) {
    c.fillStyle = vis.pele; c.beginPath(); c.ellipse(fx - 40, cy + 4, 8, 13, 0.1, 0, 7); c.fill();
    c.fillStyle = vis.peleSombra; c.beginPath(); c.ellipse(fx - 39, cy + 5, 4, 7, 0.1, 0, 7); c.fill();
  }
  // olhos
  const pisc = clamp(1 - (P.piscar || 0)), ey = cy - 2;
  const olho = (x, esc) => {
    c.save(); c.translate(x, ey); c.scale(esc, 1);
    c.fillStyle = '#ece6dd'; c.beginPath(); c.ellipse(0, 0, 7.5, 4.8 * pisc + 0.01, 0, 0, 7); c.fill();
    if (pisc > 0.15) { c.fillStyle = '#2a1a12'; c.beginPath(); c.arc(2 + (P.olhar || 0) * 2, 0, 3.8 * Math.min(1, pisc * 1.4), 0, 7); c.fill(); }
    c.strokeStyle = vis.peleSombra; c.lineWidth = 2; c.beginPath(); c.ellipse(0, -1, 8, 5, 0, Math.PI * 1.05, Math.PI * 1.95); c.stroke();
    c.restore();
  };
  olho(fx + 8, 1);
  if (giro < 0.65) olho(fx - 18, 0.8 - giro * 0.3);
  // sobrancelhas
  const preoc = P.expr === 'preocupado' ? 1 : 0;
  c.strokeStyle = vis.cabelo; c.lineWidth = 4;
  c.beginPath(); c.moveTo(fx + 1, ey - 12 - preoc * 3); c.lineTo(fx + 16, ey - 13 + preoc * 1); c.stroke();
  if (giro < 0.65) { c.beginPath(); c.moveTo(fx - 26, ey - 12); c.lineTo(fx - 12, ey - 12 - preoc * 3); c.stroke(); }
  // nariz
  c.strokeStyle = vis.peleSombra; c.lineWidth = 3;
  c.beginPath(); c.moveTo(fx + 6, ey + 2); c.quadraticCurveTo(fx + 22, ey + 18, fx + 8, ey + 22); c.stroke();
  // boca
  const boca = P.boca || 0;
  if (boca > 0.05) { c.fillStyle = '#4a2219'; c.beginPath(); c.ellipse(fx + 6, ey + 37, 8, 2 + boca * 5, 0, 0, 7); c.fill(); }
  else { c.strokeStyle = '#6b3a2a'; c.lineWidth = 3; c.beginPath(); c.moveTo(fx - 4, ey + 37 + preoc); c.quadraticCurveTo(fx + 6, ey + 35 + preoc * 2, fx + 15, ey + 37 + preoc); c.stroke(); }
  if (vis.bigode) { c.fillStyle = vis.bigode; c.beginPath(); c.ellipse(fx + 8, ey + 29, 13, 5, 0, 0, 7); c.fill(); }
  if (vis.oculos) { c.strokeStyle = '#2a2420'; c.lineWidth = 2.5; c.beginPath(); c.arc(fx + 8, ey, 11, 0, 7); c.moveTo(fx - 7, ey); c.arc(fx - 18, ey, 10, 0, 7); c.moveTo(fx - 3, ey); c.lineTo(fx - 8, ey); c.stroke(); }
  // cabelo
  c.fillStyle = vis.cabelo;
  if (vis.cabeloTipo === 'quepe') { c.beginPath(); c.ellipse(cx - 2, cy - 38, 50, 26, 0, Math.PI, Math.PI * 2.02); c.fill(); c.fillRect(cx - 50, cy - 40, 100, 10); c.fillRect(cx + 20, cy - 34, 48, 8); return; }
  if (vis.cabeloTipo === 'careca') { c.save(); c.beginPath(); c.ellipse(cx, cy, 48, 58, 0, 0, 7); c.clip(); c.beginPath(); c.moveTo(cx - 60, cy - 24); c.lineTo(fx - 30, cy - 18); c.lineTo(fx - 30, cy + 8); c.lineTo(cx - 60, cy + 30); c.fill(); c.restore(); return; }
  c.save(); c.beginPath(); c.ellipse(cx, cy, 48, 58, 0, 0, 7); c.clip();
  c.beginPath(); c.ellipse(cx - 4, cy - 34, 52, 30, -0.05, 0, 7); c.fill();
  c.beginPath(); c.moveTo(cx - 60, cy - 30); c.lineTo(fx - 26, cy - 30); c.lineTo(fx - 30, cy + 2); c.lineTo(cx - 60, cy + 30); c.fill();
  c.restore();
  c.beginPath(); c.ellipse(cx - 2, cy - 42, 50, 22, -0.08, Math.PI, Math.PI * 2.02); c.fill();
}

// ---------- efeitos ----------
function particulas(c, t, n, seed, {area = [0, 0, W, H], cor = 'rgba(255,240,220,0.5)', tam = [1, 3], vel = [-8, 8, -15, -4], brilho = 1} = {}) {
  const r = rng(seed);
  for (let i = 0; i < n; i++) {
    const x0 = r(), y0 = r(), vx = lerp(vel[0], vel[1], r()), vy = lerp(vel[2], vel[3], r()), sz = lerp(tam[0], tam[1], r()), ph = r() * 7;
    const x = area[0] + ((x0 * area[2] + vx * t + Math.sin(t * 0.7 + ph) * 10) % area[2] + area[2]) % area[2];
    const y = area[1] + ((y0 * area[3] + vy * t) % area[3] + area[3]) % area[3];
    c.globalAlpha = brilho * (0.4 + 0.6 * Math.abs(Math.sin(t * 0.8 + ph)));
    c.fillStyle = cor; c.beginPath(); c.arc(x, y, sz, 0, 7); c.fill();
  }
  c.globalAlpha = 1;
}

const _graos = [];
function filme(c, t, {vinheta = 0.55, grao = 0.06} = {}) {
  if (!_graos.length) for (let k = 0; k < 6; k++) {
    const g = document.createElement('canvas'); g.width = 480; g.height = 270; const gc = g.getContext('2d');
    const im = gc.createImageData(480, 270); const r = rng(77 + k);
    for (let i = 0; i < im.data.length; i += 4) { const v = r() * 255; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255; }
    gc.putImageData(im, 0, 0); _graos.push(g);
  }
  c.save(); c.setTransform(1, 0, 0, 1, 0, 0);
  c.globalCompositeOperation = 'overlay'; c.globalAlpha = grao;
  c.drawImage(_graos[Math.floor(t * 24) % 6], 0, 0, W, H);
  c.globalCompositeOperation = 'source-over'; c.globalAlpha = 1;
  c.fillStyle = rgrad(c, W / 2, H / 2, H * 0.35, H * 1.05, [[0, 'rgba(0,0,0,0)'], [1, `rgba(0,0,0,${vinheta})`]]);
  c.fillRect(0, 0, W, H);
  c.restore();
}

// ---------- interface: selo, cartelas e legendas ----------
function seloSimulacao(c, alpha = 1) {
  c.save(); c.globalAlpha = alpha * 0.92;
  c.font = '600 22px Inter'; const txt = 'SIMULAÇÃO'; const w = c.measureText(txt).width;
  const x = W - 60 - w - 34, y = 48;
  c.fillStyle = 'rgba(10,10,12,0.55)'; rr(c, x, y, w + 34, 40, 4); c.fill();
  c.fillStyle = PAL.vermelhoVivo; c.beginPath(); c.arc(x + 15, y + 20, 5, 0, 7); c.fill();
  c.fillStyle = PAL.texto; c.textBaseline = 'middle'; c.fillText(txt, x + 26, y + 21);
  c.restore();
}

function cartelaDia(c, t, dur, dia, titulo) {
  // cartela discreta no canto inferior esquerdo
  const a = sstep(0, 0.6, t) * (1 - sstep(dur - 0.6, dur, t));
  if (a <= 0) return;
  c.save(); c.globalAlpha = a;
  const x = 90, y = 820, dx = (1 - easeOut(t / 0.8)) * -30;
  c.fillStyle = PAL.vermelhoVivo; c.fillRect(x + dx, y, 6, 92);
  c.fillStyle = PAL.texto; c.font = '700 64px Oswald'; c.textBaseline = 'top'; c.fillText(dia, x + 26 + dx, y - 6);
  c.font = '400 30px Oswald'; c.fillStyle = 'rgba(242,239,233,0.8)'; c.fillText(titulo, x + 28 + dx, y + 60);
  c.restore();
}

let LEGENDAS = [];
function prepararLegendas(frases, atraso, maxC = 44) {
  const out = [];
  for (const f of frases) {
    const pal = f.texto.split(' ');
    // quebra em blocos de até 2 linhas
    const lin = arr => arr.join(' ');
    // número de blocos necessário e divisão equilibrada (sem palavra órfã)
    const nb = Math.ceil(f.texto.length / (maxC * 2 - 6));
    const alvo = f.texto.length / nb, blocos = []; let cur = [];
    for (const p of pal) { cur.push(p); if (blocos.length < nb - 1 && lin(cur).length >= alvo - 4) { blocos.push(cur); cur = []; } }
    if (cur.length) blocos.push(cur);
    const total = blocos.reduce((s, b) => s + lin(b).length, 0);
    let t0 = f.inicio + atraso; const dur = f.fim - f.inicio;
    for (const b of blocos) {
      const d = dur * lin(b).length / total;
      // divide em duas linhas equilibradas
      let linhas = [lin(b)];
      if (lin(b).length > maxC) {
        let melhor = null;
        for (let i = 1; i < b.length; i++) { const l1 = lin(b.slice(0, i)), l2 = lin(b.slice(i)); const sc = Math.max(l1.length, l2.length); if (!melhor || sc < melhor[0]) melhor = [sc, [l1, l2]]; }
        linhas = melhor[1];
      }
      out.push({ a: t0, b: t0 + d + 0.15, linhas }); t0 += d;
    }
  }
  LEGENDAS = out; return out;
}
function desenharLegenda(c, T) {
  const L = LEGENDAS.find(l => T >= l.a && T < l.b);
  if (!L) return;
  const a = sstep(L.a, L.a + 0.12, T) * (1 - sstep(L.b - 0.1, L.b, T));
  c.save(); c.globalAlpha = a; c.font = '600 40px Inter'; c.textAlign = 'center'; c.textBaseline = 'middle';
  const lh = 54, y0 = H - 92 - (L.linhas.length - 1) * lh;
  L.linhas.forEach((l, i) => {
    const w = c.measureText(l).width;
    c.fillStyle = 'rgba(8,8,10,0.62)'; rr(c, W / 2 - w / 2 - 18, y0 + i * lh - 25, w + 36, 50, 6); c.fill();
    c.fillStyle = '#f5f2ec'; c.fillText(l, W / 2, y0 + i * lh + 1);
  });
  c.restore();
}

// ---------- compositor ----------
const MOTOR = {
  render(T) {
    const tela = document.getElementById('tela'), ctx = tela.getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
    const CENAS = window.CENAS;
    for (let i = 0; i < CENAS.length; i++) {
      const S = CENAS[i];
      const tr = S.trans ?? 0.4; // duração do fade de entrada
      const ini = S.a - (S.trans === 'corte' ? 0 : tr / 2);
      const prox = CENAS[i + 1];
      const fimTr = prox ? (prox.trans === 'corte' ? 0 : (prox.trans ?? 0.4) / 2) : 0;
      if (T < ini || T >= S.b + fimTr) continue;
      let alpha = 1;
      if (S.trans !== 'corte' && i > 0) alpha = sstep(S.a - tr / 2, S.a + tr / 2, T);
      if (S.preto) alpha = sstep(S.a, S.a + S.preto, T); // entrada a partir do preto
      if (S.saiPreto) alpha *= 1 - sstep(S.b - S.saiPreto, S.b, T);
      const b = buf('cena' + (i % 2)); const c = b.getContext('2d');
      c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, W, H); c.globalAlpha = 1; c.filter = 'none';
      c.save(); S.fn(c, T - S.a, S.b - S.a, T, S.info || {}); c.restore();
      ctx.globalAlpha = alpha; ctx.drawImage(b, 0, 0); ctx.globalAlpha = 1;
    }
    if (window.POS) window.POS(ctx, T);
    if (!window.SEM_LEGENDA) desenharLegenda(ctx, T);  // sem legenda gravada: usar o .srt no YouTube
  }
};
window.render = T => MOTOR.render(T);
