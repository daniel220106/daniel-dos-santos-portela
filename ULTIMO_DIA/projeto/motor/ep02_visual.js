// ÚLTIMO DIA — EP02: personagens novos, expressões e utilidades de diálogo.
// Carregar DEPOIS de motor.js. Substitui desenharCabeca por uma versão com mais expressões
// (o comportamento antigo — '' e 'preocupado' — continua igual).

// ---------- fichas visuais (cores e proporções fixas) ----------
Object.assign(VISUAIS, {
  rafael: { pele: '#8d5a3b', peleSombra: '#643e28', cabelo: '#120d0a', camiseta: '#d9a623', camisetaSombra: '#a87e15', calca: '#3d4a5c', calcaSombra: '#2a3442', tenis: '#c8402e', sola: '#2a2a2a', barba: 0.5, barbaTipo: 'cavanhaque', cabeloTipo: 'cacheado', altura: 1.03, largura: 1.08 },
  marina: { pele: '#d3a383', peleSombra: '#a5795c', cabelo: '#5a2e1a', camiseta: '#2f6f6a', camisetaSombra: '#21504c', calca: '#1f2733', calcaSombra: '#141a23', tenis: '#e8e6e0', sola: '#777', barba: 0, cabeloTipo: 'chanel', altura: 0.96, largura: 0.92 },
  pedro: { pele: '#c08a64', peleSombra: '#8d6044', cabelo: '#2b1d14', camiseta: '#e07a35', camisetaSombra: '#b05a22', calca: '#2f4a6a', calcaSombra: '#203348', tenis: '#f0f0f0', sola: '#3a3a3a', barba: 0, cabeloTipo: 'curto', bone: '#2f6fb0', cabecaEsc: 1.22, altura: 0.7, largura: 0.82 },
});
// Lucas e Dona Cida mantêm as fichas do EP01 (VISUAIS.lucas / VISUAIS.cida).

const FICHAS_EP02 = {
  lucas: { nome: 'LUCAS', idade: '29 anos', vis: 'lucas', traco: 'Curioso, impulsivo e bem-humorado. Protagonista.', exprs: ['', 'sorriso', 'surpreso', 'preocupado', 'duvida', 'riso'] },
  rafael: { nome: 'RAFAEL', idade: '31 anos', vis: 'rafael', traco: 'Brincalhão, descontraído e um pouco impulsivo.', exprs: ['', 'riso', 'sorriso', 'assustado', 'duvida', 'preocupado'] },
  marina: { nome: 'MARINA', idade: '28 anos', vis: 'marina', traco: 'Prática, organizada e firme nas decisões.', exprs: ['', 'firme', 'preocupado', 'surpreso', 'duvida', 'sorriso'] },
  cida: { nome: 'DONA CIDA', idade: '68 anos', vis: 'cida', traco: 'Moradora antiga. Experiente, direta e observadora.', exprs: ['', 'firme', 'preocupado', 'sorriso', 'duvida', 'surpreso'] },
  pedro: { nome: 'PEDRO', idade: '12 anos', vis: 'pedro', traco: 'Curioso, esperto e cheio de perguntas.', exprs: ['', 'riso', 'surpreso', 'duvida', 'sorriso', 'preocupado'] },
};

// ---------- cabeça com expressões ----------
desenharCabeca = function (c, vis, giro, P) {
  const cx = 10, cy = -262;
  const fx = cx + 24 + 14 * giro;
  const ex = P.expr || '';
  // cabelo de trás
  c.fillStyle = vis.cabelo;
  if (vis.cabeloTipo === 'longo') { c.beginPath(); c.ellipse(cx - 20, cy + 10, 40, 70, 0.1, 0, 7); c.fill(); }
  if (vis.cabeloTipo === 'rabo') { c.beginPath(); c.ellipse(cx - 52, cy - 4, 14, 40, 0.5, 0, 7); c.fill(); }
  if (vis.cabeloTipo === 'coque') { c.beginPath(); c.arc(cx - 36, cy - 44, 22, 0, 7); c.fill(); }
  if (vis.cabeloTipo === 'chanel') { c.beginPath(); c.ellipse(cx - 12, cy + 2, 54, 58, 0.05, 0, 7); c.fill(); c.fillRect(cx - 62, cy, 52, 44); }
  // cabeça
  c.fillStyle = vis.pele;
  c.beginPath(); c.ellipse(cx, cy, 45, 55, 0, 0, 7); c.fill();
  c.beginPath(); c.ellipse(cx + 14 + 8 * giro, cy + 30, 33, 28, 0, 0, 7); c.fill();
  c.save(); c.beginPath(); c.ellipse(cx, cy, 45, 55, 0, 0, 7); c.clip();
  c.fillStyle = vis.peleSombra; c.globalAlpha = 0.45; c.fillRect(cx - 60, cy - 60, 40 - 10 * giro, 130); c.globalAlpha = 1;
  if (vis.barba && vis.barbaTipo !== 'cavanhaque') { c.fillStyle = `rgba(25,18,14,${vis.barba})`; c.beginPath(); c.ellipse(fx - 4, cy + 36, 34, 20, 0, 0, 7); c.fill(); }
  c.restore();
  if (vis.barbaTipo === 'cavanhaque') { // bigode fino + cavanhaque abaixo da boca (não cobre a boca)
    c.fillStyle = `rgba(18,13,10,${vis.barba})`;
    c.beginPath(); c.ellipse(fx + 6, cy + 54, 15, 9, 0, 0, 7); c.fill();
    c.beginPath(); c.ellipse(fx + 7, cy + 28, 13, 3.5, 0, 0, 7); c.fill();
  }
  if (giro > -1.2) {
    c.fillStyle = vis.pele; c.beginPath(); c.ellipse(fx - 40, cy + 4, 8, 13, 0.1, 0, 7); c.fill();
    c.fillStyle = vis.peleSombra; c.beginPath(); c.ellipse(fx - 39, cy + 5, 4, 7, 0.1, 0, 7); c.fill();
  }
  // olhos
  const abre = ex === 'surpreso' || ex === 'assustado' ? 1.3 : (ex === 'sorriso' || ex === 'riso' ? 0.72 : (ex === 'firme' ? 0.85 : 1));
  const pisc = clamp(1 - (P.piscar || 0)), ey = cy - 2;
  const olho = (x, esc) => {
    c.save(); c.translate(x, ey); c.scale(esc, 1);
    c.fillStyle = '#ece6dd'; c.beginPath(); c.ellipse(0, 0, 7.5, 4.8 * pisc * abre + 0.01, 0, 0, 7); c.fill();
    if (pisc > 0.15) { c.fillStyle = '#2a1a12'; c.beginPath(); c.arc(2 + (P.olhar || 0) * 2, 0, (ex === 'assustado' ? 3.0 : 3.8) * Math.min(1, pisc * 1.4), 0, 7); c.fill(); }
    c.strokeStyle = vis.peleSombra; c.lineWidth = 2; c.beginPath(); c.ellipse(0, -1, 8, 5 * Math.max(1, abre * 0.9), 0, Math.PI * 1.05, Math.PI * 1.95); c.stroke();
    c.restore();
  };
  olho(fx + 8, 1);
  if (giro < 0.65) olho(fx - 18, 0.8 - giro * 0.3);
  // sobrancelhas: [sobe tudo, ponta interna, ponta externa, só a da frente sobe]
  const SB = { preocupado: [0, -3, 1, 0], surpreso: [-7, 0, 0, 0], assustado: [-7, -3, 1, 0], firme: [1, 4, -2, 0], duvida: [0, 0, 0, -7], sorriso: [-2, 0, 0, 0], riso: [-3, 0, 0, 0] }[ex] || [0, 0, 0, 0];
  c.strokeStyle = vis.cabelo === '#cfcac3' ? '#9d978f' : vis.cabelo; c.lineWidth = 4;
  c.beginPath(); c.moveTo(fx + 1, ey - 12 + SB[0] + SB[1] + SB[3]); c.lineTo(fx + 16, ey - 13 + SB[0] + SB[2] + SB[3]); c.stroke();
  if (giro < 0.65) { c.beginPath(); c.moveTo(fx - 26, ey - 12 + SB[0] + SB[2]); c.lineTo(fx - 12, ey - 12 + SB[0] + SB[1]); c.stroke(); }
  // nariz
  c.strokeStyle = vis.peleSombra; c.lineWidth = 3;
  c.beginPath(); c.moveTo(fx + 6, ey + 2); c.quadraticCurveTo(fx + 22, ey + 18, fx + 8, ey + 22); c.stroke();
  // boca
  const boca = P.boca || 0, mx = fx + 6, my = ey + 37;
  c.lineWidth = 3; c.strokeStyle = '#6b3a2a';
  if (boca > 0.05) {
    c.fillStyle = '#4a2219';
    if (ex === 'riso' || ex === 'sorriso') { c.beginPath(); c.ellipse(mx, my - 1, 11, 2.5 + boca * 6, 0, 0, Math.PI); c.lineTo(mx - 11, my - 1); c.fill(); }
    else if (ex === 'surpreso' || ex === 'assustado') { c.beginPath(); c.ellipse(mx, my, 6, 3 + boca * 6, 0, 0, 7); c.fill(); }
    else { c.beginPath(); c.ellipse(mx, my, 8, 2 + boca * 5, 0, 0, 7); c.fill(); }
  } else if (ex === 'sorriso') { c.beginPath(); c.moveTo(mx - 11, my - 3); c.quadraticCurveTo(mx, my + 6, mx + 11, my - 4); c.stroke(); }
  else if (ex === 'riso') { c.fillStyle = '#4a2219'; c.beginPath(); c.moveTo(mx - 12, my - 3); c.quadraticCurveTo(mx, my + 11, mx + 12, my - 4); c.closePath(); c.fill(); c.fillStyle = '#efe9e2'; c.fillRect(mx - 9, my - 3, 18, 3); }
  else if (ex === 'surpreso' || ex === 'assustado') { c.fillStyle = '#4a2219'; c.beginPath(); c.ellipse(mx, my, 4.5, 5.5, 0, 0, 7); c.fill(); }
  else if (ex === 'firme') { c.beginPath(); c.moveTo(mx - 9, my); c.lineTo(mx + 9, my); c.stroke(); }
  else if (ex === 'duvida') { c.beginPath(); c.moveTo(mx - 9, my + 1); c.quadraticCurveTo(mx + 2, my - 1, mx + 10, my - 4); c.stroke(); }
  else { const pr = ex === 'preocupado' ? 1 : 0; c.beginPath(); c.moveTo(fx - 4, ey + 37 + pr); c.quadraticCurveTo(fx + 6, ey + 35 + pr * 2, fx + 15, ey + 37 + pr); c.stroke(); }
  if (vis.bigode) { c.fillStyle = vis.bigode; c.beginPath(); c.ellipse(fx + 8, ey + 29, 13, 5, 0, 0, 7); c.fill(); }
  if (vis.oculos) { c.strokeStyle = '#2a2420'; c.lineWidth = 2.5; c.beginPath(); c.arc(fx + 8, ey, 11, 0, 7); c.moveTo(fx - 7, ey); c.arc(fx - 18, ey, 10, 0, 7); c.moveTo(fx - 3, ey); c.lineTo(fx - 8, ey); c.stroke(); }
  // cabelo da frente
  c.fillStyle = vis.cabelo;
  if (vis.cabeloTipo === 'quepe') { c.beginPath(); c.ellipse(cx - 2, cy - 38, 50, 26, 0, Math.PI, Math.PI * 2.02); c.fill(); c.fillRect(cx - 50, cy - 40, 100, 10); c.fillRect(cx + 20, cy - 34, 48, 8); return; }
  if (vis.cabeloTipo === 'careca') { c.save(); c.beginPath(); c.ellipse(cx, cy, 48, 58, 0, 0, 7); c.clip(); c.beginPath(); c.moveTo(cx - 60, cy - 24); c.lineTo(fx - 30, cy - 18); c.lineTo(fx - 30, cy + 8); c.lineTo(cx - 60, cy + 30); c.fill(); c.restore(); return; }
  if (vis.cabeloTipo === 'cacheado') {
    const r = rng(5);
    for (let i = 0; i < 14; i++) { const a = Math.PI * (1.08 + i / 14 * 0.86), rr_ = 12 + r() * 5; c.beginPath(); c.arc(cx - 2 + Math.cos(a) * 46, cy - 14 + Math.sin(a) * 50, rr_, 0, 7); c.fill(); }
    c.beginPath(); c.ellipse(cx - 6, cy - 46, 50, 22, 0, 0, 7); c.fill();
    c.beginPath(); c.moveTo(cx - 58, cy - 36); c.lineTo(fx - 30, cy - 36); c.lineTo(fx - 34, cy - 4); c.lineTo(cx - 58, cy + 22); c.fill();
  } else {
    c.save(); c.beginPath(); c.ellipse(cx, cy, 48, 58, 0, 0, 7); c.clip();
    c.beginPath(); c.ellipse(cx - 4, cy - 34, 52, 30, -0.05, 0, 7); c.fill();
    c.beginPath(); c.moveTo(cx - 60, cy - 30); c.lineTo(fx - 26, cy - 30); c.lineTo(fx - 30, cy + 2); c.lineTo(cx - 60, cy + 30); c.fill();
    if (vis.cabeloTipo === 'chanel') { c.beginPath(); c.moveTo(fx - 30, cy - 46); c.quadraticCurveTo(fx + 10, cy - 46, fx + 22, cy - 24); c.lineTo(fx - 8, cy - 26); c.fill(); }
    c.restore();
    c.beginPath(); c.ellipse(cx - 2, cy - 42, 50, 22, -0.08, Math.PI, Math.PI * 2.02); c.fill();
  }
  if (vis.bone) { // boné com aba para o lado do rosto
    c.fillStyle = vis.bone; c.beginPath(); c.ellipse(cx - 2, cy - 36, 52, 30, 0, Math.PI, Math.PI * 2.02); c.fill(); c.fillRect(cx - 54, cy - 38, 106, 9);
    c.fillStyle = shade(vis.bone, 0.75); c.beginPath(); c.ellipse(fx + 26, cy - 32, 34, 7, 0.06, 0, 7); c.fill();
    c.fillStyle = '#f2efe9'; c.beginPath(); c.arc(cx - 2, cy - 62, 5, 0, 7); c.fill();
  }
};

// ---------- mochila (gancho P.costas) ----------
function mochila(cor = '#3a4a3a') {
  return (c) => { c.fillStyle = cor; rr(c, -82, -176, 48, 120, 14); c.fill(); c.fillStyle = shade(cor, 0.75); rr(c, -86, -120, 22, 52, 8); c.fill();
    c.strokeStyle = shade(cor, 0.6); c.lineWidth = 9; c.beginPath(); c.moveTo(-40, -180); c.quadraticCurveTo(-10, -150, -24, -60); c.stroke(); };
}

// ---------- fala: boca pelo volume da voz, olhar para quem fala ----------
// FALAS = linhas do .json do dialogo.py com 'boca' (envelope a 30 quadros/s) e tempo global somado por 'deslocamento'
function bocaDe(falas, personagem, T, desloc = 0) {
  for (const f of falas) {
    if (f.personagem !== personagem) continue;
    const a = f.inicio + desloc, b = f.fim + desloc;
    if (T >= a && T < b) { const i = Math.floor((T - a) * 30); return clamp((f.boca[i] || 0) * 1.25); }
  }
  return 0;
}
function quemFala(falas, T, desloc = 0) {
  for (const f of falas) if (T >= f.inicio + desloc && T < f.fim + desloc) return f.personagem;
  return null;
}
// gesto automático enquanto fala: braço da frente sobe e desce suave
function gesto(T, falando, seed = 1) {
  const k = falando ? 1 : 0;
  return [lerp(0.08, -0.35 + 0.25 * Math.sin(T * 2.3 + seed), k), lerp(0.22, 0.9 + 0.3 * Math.sin(T * 3.1 + seed * 2), k)];
}
