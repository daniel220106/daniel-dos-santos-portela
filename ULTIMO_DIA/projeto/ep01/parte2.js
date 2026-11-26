// EP01 — PARTE 2: capítulos 5 a 8
'use strict';
Object.assign(CAPITULOS, { 5: { dia: 'DIA 7', titulo: 'DONA CIDA' }, 6: { dia: 'DIA 10', titulo: 'CALOR E LIXO' }, 7: { dia: 'DIA 13', titulo: 'A COMIDA ACABA' }, 8: { dia: 'DIA 16', titulo: 'A NOITE' } });

// ---------- apartamento de Dona Cida ----------
function apCida(c, t, {paula = 0, bengala = 1, fala = 0, expr = 'preocupado'} = {}) {
  c.fillStyle = vgrad(c, 0, H, [[0, '#2e2622'], [0.76, '#251f1b'], [0.77, '#3a2c22'], [1, '#2a2019']]); c.fillRect(-500, -300, W + 1000, H + 600);
  c.fillStyle = 'rgba(255,255,255,0.03)'; for (let i = 0; i < 30; i++) c.fillRect(-200 + i * 80, 0, 30, 820);
  c.fillStyle = '#7a8a96'; c.fillRect(1400, 180, 300, 380); for (let i = 0; i < 6; i++) { c.fillStyle = 'rgba(90,60,70,0.85)'; c.fillRect(1400, 180, 70, 380); c.fillRect(1630, 180, 70, 380); }
  c.strokeStyle = '#1a1410'; c.lineWidth = 14; c.strokeRect(1400, 180, 300, 380);
  c.fillStyle = '#3a2a20'; c.fillRect(240, 260, 180, 140); c.fillStyle = '#c9b48a'; c.fillRect(255, 275, 150, 110); // retrato
  c.fillStyle = '#5a3a3a'; rr(c, 620, 520, 420, 300, 40); c.fill(); rr(c, 600, 420, 120, 400, 40); c.fill(); // poltrona
  desenharPessoa(c, { x: 820, y: 640, s: 1, dir: 1, tronco: -0.12, pernaF: [1.45, -1.45], pernaT: [1.35, -1.4], pePlano: true, bracoF: [0.6, 1.0], bracoT: [0.5, 1.1], cabeca: { giro: 0.4, incl: 0.12 + 0.03 * Math.sin(t * 0.8) }, expr, boca: falar(t, fala, 4) * 0.7, piscar: piscar(t, 5), luz: LUZ.diaD }, 'cida');
  c.fillStyle = '#6a4a4a'; rr(c, 960, 500, 90, 320, 30); c.fill();
  if (bengala) { c.strokeStyle = '#5a3a20'; c.lineWidth = 10; c.beginPath(); c.moveTo(1090, 880); c.lineTo(1060, 560); c.quadraticCurveTo(1055, 520, 1090, 525); c.stroke(); }
  mesa(c, 1250, 720, 280, '#4a3a2c'); garrafa(c, 1200, 720, 0.7, 0.05); c.fillStyle = '#e8e8ea'; rr(c, 1270, 690, 70, 28, 6); c.fill();
  if (paula) desenharPessoa(c, { x: 1120, y: 760, s: 1, dir: -1, tronco: 0.35, pernaF: [1.6, -2.2], pernaT: [0.3, -2.4], pePlano: true, bracoF: [1.4, 0.4], bracoT: [1.2, 0.6], cabeca: { giro: 0.5, incl: 0.1 }, boca: falar(t, paula > 1, 2), piscar: piscar(t, 2), luz: LUZ.dia }, 'paula');
}
function insulina(c, t, {doses = 3} = {}) {
  c.fillStyle = '#1e1814'; c.fillRect(0, 0, W, H);
  c.save(); camera(c, 1.0 + t * 0.02, 960, 560); c.fillStyle = '#4a3a2c'; c.fillRect(0, 620, W, 500);
  for (let i = 0; i < 3; i++) { const vazia = i >= doses; c.save(); c.translate(620 + i * 340, 600); c.rotate(-0.08 + i * 0.05);
    c.fillStyle = vazia ? 'rgba(200,200,205,0.35)' : '#e8e8ea'; rr(c, -40, -320, 80, 320, 30); c.fill(); c.fillStyle = vazia ? 'rgba(80,120,180,0.25)' : '#3a6ab0'; rr(c, -40, -380, 80, 70, 16); c.fill();
    c.fillStyle = vazia ? 'rgba(230,200,120,0.1)' : 'rgba(230,200,120,0.7)'; c.fillRect(-20, -260, 40, 180); c.restore(); }
  c.restore();
}
function escadaGrupo(c, t, d, {andar = 7, para = 0, checa = 0} = {}) {
  const u = para ? 0.55 : 0.85 - clamp(t / Math.max(d, 1)) * 0.6, [fx, fy] = noDegrau(u);
  c.save(); camera(c, 1.0, fx + 60, fy - 300); escada(c, t, andar);
  const anda = para ? null : caminhada(t * 0.55, 0.5), seg = [0.35, 0.5];
  const p = (du, vis, ext = {}) => { const [x, y] = noDegrau(u + du); desenharPessoa(c, { x, y: y - 268 * 0.95, s: 0.95, dir: -1, ...(anda || {}), bob: 0, tronco: 0.12, bracoF: seg, bracoT: seg, cabeca: { giro: 0.4, incl: 0.1 }, piscar: piscar(t, du * 9), luz: LUZ.dia, ...ext }, vis); };
  p(0.15, 'morador7', { silhueta: 'rgba(20,20,22,0.35)' });
  p(0.13, 'lucas', { dia: 7, expr: 'preocupado' });
  cadeiraMadeira(c, fx + 30, fy - 120, 1);
  desenharPessoa(c, { x: fx + 20, y: fy - 140, s: 0.95, dir: -1, tronco: -0.15, pernaF: [1.4, -1.5], pernaT: [1.3, -1.5], pePlano: true, bracoF: [0.7, 1.1], bracoT: [0.6, 1.0], cabeca: { giro: 0.3, incl: 0.15 }, expr: 'preocupado', piscar: piscar(t, 3), luz: LUZ.dia }, 'cida');
  p(-0.13, 'jorge', { silhueta: 'rgba(20,20,22,0.25)' }); p(-0.15, 'pedestre1');
  const [px, py] = noDegrau(u + 0.3 - checa * 0.12);
  desenharPessoa(c, { x: px, y: py - 260, s: 0.93, dir: -1, bracoF: checa ? [1.3, 0.5] : [0.9, 0.9 + 0.2 * Math.sin(t * 2)], cabeca: { giro: 0.5, incl: 0.12 }, boca: falar(t, 1, 6), luz: LUZ.dia }, 'paula');
  c.restore();
}
function vaoEscada(c, t) { // vista de cima do vão da escada (vertigem)
  c.fillStyle = '#0c0d0e'; c.fillRect(0, 0, W, H);
  c.save(); c.translate(960, 540); c.rotate(t * 0.04); c.scale(1 + t * 0.03, 1 + t * 0.03);
  for (let i = 0; i < 10; i++) { const s = Math.pow(0.8, i); c.strokeStyle = `rgba(160,160,150,${0.6 * s})`; c.lineWidth = 14 * s; c.strokeRect(-640 * s, -380 * s, 1280 * s, 760 * s); c.fillStyle = `rgba(60,60,58,${0.5 * s})`; c.fillRect(-640 * s, -380 * s, 1280 * s, 120 * s); c.font = `700 ${60 * s}px Oswald`; c.fillStyle = `rgba(200,190,160,${0.5 * s})`; c.fillText(String(9 - i), -600 * s, -300 * s); }
  c.restore();
}
function unidadeInterna(c, t) {
  c.fillStyle = vgrad(c, 0, H, [[0, '#cfd6d4'], [0.75, '#bcc4c2'], [0.76, '#8a9290'], [1, '#7a8280']]); c.fillRect(0, 0, W, H);
  c.save(); camera(c, 1.05 + t * 0.015, 960, 560);
  c.fillStyle = '#8a9aa0'; c.fillRect(500, 700, 900, 40); c.fillStyle = '#e8ece8'; rr(c, 480, 640, 940, 70, 12); c.fill(); c.fillStyle = '#f4f4f2'; rr(c, 500, 600, 220, 60, 24); c.fill();
  desenharPessoa(c, { x: 820, y: 640, s: 0.95, dir: 1, tronco: -1.35, semPernas: true, bracoF: [0.2, 0.2], cabeca: { giro: 0.3, incl: 0.2 }, piscar: Math.min(1, 0.6 + 0.4 * piscar(t)), luz: LUZ.acesa }, 'cida');
  c.fillStyle = '#c8d0d8'; rr(c, 800, 600, 640, 90, 30); c.fill();
  c.strokeStyle = '#888'; c.lineWidth = 8; c.beginPath(); c.moveTo(1480, 900); c.lineTo(1480, 250); c.lineTo(1560, 250); c.stroke();
  c.fillStyle = 'rgba(200,230,240,0.8)'; rr(c, 1440, 260, 80, 120, 14); c.fill(); c.strokeStyle = 'rgba(200,230,240,0.8)'; c.lineWidth = 3; c.beginPath(); c.moveTo(1480, 380); c.quadraticCurveTo(1450, 600, 1000, 650); c.stroke();
  const g = (t * 1.2) % 1; c.fillStyle = 'rgba(200,230,255,0.9)'; c.beginPath(); c.arc(1480, 390 + g * 30, 4, 0, 7); c.fill();
  desenharPessoa(c, { x: 1620, y: 684, s: 1, dir: -1, bracoF: [1.0, 0.6], cabeca: { giro: 0.5, incl: 0.1 }, luz: LUZ.acesa }, 'paula');
  c.restore(); rotulo(c, t, 'UNIDADE DE SAÚDE  ·  SORO');
}
function salaoCida(c, t, {jorge = 1, deitada = 1, fala = 0, extra = null} = {}) {
  c.save(); camera(c, 1.05 + t * 0.01, 1100, 560); salao(c, t);
  if (deitada) { desenharPessoa(c, { x: 1460, y: 690, s: 0.9, dir: -1, tronco: -0.4, pernaF: [1.5, -0.1], pernaT: [1.5, -0.1], bracoF: [0.4, 0.8], cabeca: { giro: 0.3 }, piscar: piscar(t, 6), luz: LUZ.diaD }, 'cida');
    c.fillStyle = '#6a4a6a'; rr(c, 1450, 690, 300, 60, 14); c.fill(); }
  if (jorge) desenharPessoa(c, { x: 820, y: 684, s: 1, dir: 1, bracoF: [0.8, 0.9 + 0.1 * Math.sin(t * 2)], cabeca: { giro: 0.4 }, boca: falar(t, fala, 1), piscar: piscar(t, 1), luz: LUZ.dia }, 'jorge');
  if (extra) extra(c, t);
  c.restore();
}
function quartoNoite(c, t, {dia = 7} = {}) {
  c.save(); camera(c, 1.25 + t * 0.01, 900, 640); quarto(c, t);
  desenharPessoa(c, { x: 980, y: 760, s: 1, dir: 1, dia, tronco: -1.45, semPernas: true, cabeca: { giro: -0.3, incl: 0.15 }, piscar: (t % 4.3) < 0.15 ? 1 : 0, olhar: -0.5, luz: LUZ.noite });
  cobertor(c, t); escuridao(c, 0.62, [{ x: 300, y: 370, r: 900, forca: 0.7 }], '2,4,14');
  c.restore();
}
function escreverParede(c, t, d, info, {fase = 'escreve'} = {}) {
  c.save(); camera(c, fase !== 'escreve' && fase !== 'perto' ? 1.35 + t * 0.01 : 1.0, fase !== 'escreve' && fase !== 'perto' ? 640 : 900, fase !== 'escreve' && fase !== 'perto' ? 460 : 540);
  const cab = fase === 'escreve' ? clamp(t / Math.max(d - 0.5, 1)) : 1, nomes = fase === 'cheia' ? 1 : fase === 'lista' ? clamp(t / Math.max(d - 1, 1)) : 0;
  hall(c, t, { nomes, cabecalho: cab });
  if (fase === 'escreve' || fase === 'perto') desenharPessoa(c, { x: 1120, y: 684, s: 1, dir: -1, dia: 8, bracoF: [1.5 + 0.06 * Math.sin(t * 9), 0.2], cabeca: { giro: 0.7, incl: 0.05 }, piscar: piscar(t), luz: LUZ.dia, objeto: (k, x, y) => { k.fillStyle = '#111'; k.fillRect(x - 3, y - 30, 6, 40); } });
  c.restore();
}
ROTEIRO[5] = [
  seq(['f0', (c, t) => { c.save(); camera(c, 1.0, PORTA_X(93), 520); corredor(c, t); const pa = Math.min(t, 2.4); desenharPessoa(c, { x: PORTA_X(92) + pa * 200, y: 590, s: 0.88, dir: 1, dia: 7, ...caminhada(t * 0.7, t < 2.4 ? 0.7 : 0), bob: 0, tronco: 0.12, bracoF: [0.05, 0.05], bracoT: [-0.05, 0.05], objeto: segBalde('#2f5f8a'), objetoT: segBalde('#8a2f2f'), cabeca: { giro: t > 2.4 ? 1.0 : 0.5, incl: 0.05 }, luz: LUZ.dia }); c.restore(); }],
      ['f1', (c, t, d, i) => { c.save(); camera(c, 2.4, PORTA_X(94) + 85, 560); corredor(c, t); c.restore(); [0, tf(i, 2) - tf(i, 1)].forEach(p => { const k = clamp((t - p) / 0.8); if (k > 0 && k < 1) { c.strokeStyle = `rgba(255,255,255,${0.4 * (1 - k)})`; c.lineWidth = 4; c.beginPath(); c.arc(960, 560, 80 + k * 300, 0, 7); c.stroke(); } }); }],
      ['f3', (c, t) => { c.save(); camera(c, 1.25, PORTA_X(94), 520); corredor(c, t); desenharPessoa(c, { x: PORTA_X(94) - 160, y: 590, s: 0.9, dir: 1, dia: 7, tronco: 0.1, bracoF: [0.05, 0.05], bracoT: [-0.05, 0.05], objeto: segBalde('#2f5f8a'), objetoT: segBalde('#8a2f2f'), cabeca: { giro: 0.8 }, expr: 'preocupado', luz: LUZ.dia }); c.restore(); }],
      ['f4', (c, t) => { c.save(); camera(c, 2.2, PORTA_X(94) - 10, 330); corredor(c, t); desenharPessoa(c, { x: PORTA_X(94) - 60, y: 590, s: 0.9, dir: 1, dia: 7, tronco: 0.2, bracoF: [1.3, 0.8], cabeca: { giro: -0.6, incl: 0.25 }, expr: 'preocupado', piscar: piscar(t), luz: LUZ.dia }); c.restore(); }]),
  seq(['f0', (c, t) => { c.save(); camera(c, 1.15 + t * 0.01, 960, 560); apCida(c, t); c.restore(); rotulo(c, t, 'DONA CIDA  ·  74 ANOS'); }], ['f1', (c, t) => insulina(c, t, { doses: 3 })],
      ['f2', (c, t) => { c.save(); camera(c, 2.0, 980, 760); apCida(c, t); c.restore(); }], ['f3', (c, t) => { c.save(); camera(c, 2.3, 1240, 640); apCida(c, t); c.restore(); }],
      ['f4', (c, t) => { c.fillStyle = '#0a0b0d'; c.fillRect(0, 0, W, H); textoGrande(c, t, ['INSULINA FORA DA GELADEIRA'], { tam: 80, y: 420, sub: 'Dura algumas semanas, se não esquentar demais.' }); }],
      ['f5', (c, t) => insulina(c, t, { doses: t > 1.0 ? 1 : 2 })]),
  seq(['f0', (c, t, d) => escadaDescendo(c, t * 1.6, d, { dia: 7, lanterna: 0 })], ['f1', (c, t) => { c.save(); camera(c, 1.25, 960, 580); apCida(c, t, { paula: 2 }); c.restore(); }],
      ['f2', (c, t) => { c.save(); camera(c, 1.0 + t * 0.02, 960, 540); unidadeSaude(c, t); c.restore(); }], ['f3', vaoEscada],
      ['f4', (c, t) => { c.fillStyle = '#1c1713'; c.fillRect(0, 0, W, H); c.save(); camera(c, 1.0 + t * 0.03, 960, 600); cadeiraMadeira(c, 960, 640, 3); c.restore(); }],
      ['f5', (c, t, d) => escadaGrupo(c, t, d, { andar: 9, para: 1 })]),
  seq(['f0', (c, t, d) => escadaGrupo(c, t, d, { andar: 7, para: 1 })], ['f2', (c, t, d) => escadaGrupo(c, t, d, { andar: 7, para: 1, checa: 1 })], ['f3', (c, t, d) => escadaGrupo(c, t, d, { andar: 4 })],
      ['f4', (c, t) => { c.fillStyle = '#08090b'; c.fillRect(0, 0, W, H); c.save(); c.translate(960, 480); c.strokeStyle = PAL.texto; c.lineWidth = 8; c.beginPath(); c.arc(0, 0, 200, 0, 7); c.stroke(); const a = t * 3; c.beginPath(); c.moveTo(0, 0); c.lineTo(Math.sin(a) * 170, -Math.cos(a) * 170); c.moveTo(0, 0); c.lineTo(Math.sin(a / 12) * 110, -Math.cos(a / 12) * 110); c.stroke(); c.restore(); textoGrande(c, t, ['QUASE UMA HORA'], { y: 820, tam: 70 }); }],
      ['f5', unidadeInterna], ['f7', (c, t) => salaoCida(c, t, { fala: 1 })]),
  seq(['f0', (c, t) => quartoNoite(c, t)], ['f1', (c, t, d, i) => { batePorta(c, t, d, i, { dia: 3, batidas: [0.3] }); c.save(); c.globalCompositeOperation = 'saturation'; c.fillStyle = '#000'; c.fillRect(0, 0, W, H); c.restore(); c.fillStyle = 'rgba(40,30,20,0.35)'; c.fillRect(0, 0, W, H); }],
      ['f2', (c, t, d, i) => escreverParede(c, t, d, i)], ['f3', (c, t, d, i) => escreverParede(c, t, d, i, { fase: 'perto' })], ['f4', (c, t, d, i) => escreverParede(c, t, d, i, { fase: 'lista' })]),
];

// ================= CAP 6 — DIA 10 — CALOR E LIXO =================
function calorCidade(c, t) {
  c.save(); camera(c, 1.0 + t * 0.015, 960, 540);
  c.fillStyle = vgrad(c, -200, 800, [[0, '#c98a4a'], [1, '#e8b070']]); c.fillRect(-400, -300, W + 800, 1500);
  c.fillStyle = 'rgba(255,240,200,0.6)'; c.beginPath(); c.arc(1500, 200, 90, 0, 7); c.fill();
  skyline(c, 41, 820, 520, '#8a5a3a'); skyline(c, 42, 900, 380, '#5a3a2a');
  c.fillStyle = '#3a2a22'; c.fillRect(-400, 900, W + 800, 400);
  c.fillStyle = '#222'; c.fillRect(420, 380, 14, 620); c.fillStyle = '#111'; rr(c, 300, 300, 260, 130, 10); c.fill();
  c.font = '700 96px Oswald'; c.fillStyle = '#ff5a2a'; c.fillText('34°C', 335, 400);
  c.restore();
  c.save(); c.globalAlpha = 0.18; for (let y = 0; y < H; y += 8) { const dx = Math.sin(y * 0.05 + t * 6) * 4; c.drawImage(c.canvas, 0, y, W, 8, dx, y, W, 8); } c.restore();
}
function salaCalor(c, t, {deitado = 0, dia = 10} = {}) {
  c.save(); camera(c, 1.1 + t * 0.01, 960, 600); sala(c, t, { tv: true });
  if (deitado) desenharPessoa(c, { x: 900, y: 905, s: 1, dir: 1, dia, tronco: -1.52, pernaF: [-1.5, 0.1], pernaT: [-1.4, 0.15], bracoF: [-0.6, 0.4], bracoT: [0.3, 0.2], cabeca: { giro: 0.0, incl: 0.1 }, piscar: Math.min(1, 0.5 + piscar(t)), boca: 0.2, luz: LUZ.calor });
  else { sofa(c); desenharPessoa(c, { x: 640, y: 690, s: 1, dir: 1, dia, tronco: -0.15, pernaF: [1.5, -1.45], pernaT: [1.42, -1.4], pePlano: true, bracoF: [2.2, 1.3 + 0.35 * Math.sin(t * 9)], bracoT: [0.5, 0.4], cabeca: { giro: 0.2, incl: -0.1 }, boca: 0.25, expr: 'preocupado', luz: LUZ.calor, objeto: (k, x, y, a) => { k.save(); k.translate(x, y); k.rotate(-a); k.fillStyle = '#e8e0cc'; k.fillRect(-10, -60, 90, 70); k.restore(); } }); sofaBraco(c); }
  c.restore(); c.fillStyle = 'rgba(200,90,20,0.16)'; c.fillRect(0, 0, W, H);
  particulas(c, t, 20, 4, { area: [0, 0, W, H], cor: 'rgba(255,200,140,0.4)', tam: [1, 2], vel: [-5, 5, -10, -2] });
}
function lixoCalcada(c, t, d, {pilha = 1, ratos = 0, caminhao = 0} = {}) {
  c.save(); camera(c, 1.0 + t * 0.012, 960, 560);
  ceuNublado(c, t, -300, 400); c.fillStyle = '#6f6d69'; c.fillRect(-300, 0, W + 600, 760); for (let i = 0; i < 8; i++) { c.fillStyle = '#1e2329'; c.fillRect(100 + i * 240, 120, 140, 110); c.fillRect(100 + i * 240, 330, 140, 110); }
  c.fillStyle = '#3a3936'; c.fillRect(-300, 520, W + 600, 240); c.fillStyle = '#26282b'; c.fillRect(800, 560, 220, 200);
  c.fillStyle = '#4a4b4c'; c.fillRect(-300, 760, W + 600, 160); c.fillStyle = '#2b2c2e'; c.fillRect(-300, 920, W + 600, 400);
  if (caminhao) { c.save(); c.translate(1300, 1040); c.fillStyle = '#5a7a4a'; c.fillRect(-380, -320, 440, 280); c.fillStyle = '#e8e4d8'; rr(c, 60, -260, 170, 220, 14); c.fill(); c.fillStyle = '#111'; [-300, -80, 150].forEach(x => { c.beginPath(); c.arc(x, -30, 40, 0, 7); c.fill(); }); c.restore(); placa(c, 1100, 640, 'SEM COMBUSTÍVEL', { tam: 40, fundo: '#f3e9c8', cor: '#8e1b1b' }); }
  const r = rng(12), n = Math.floor(6 + 34 * pilha);
  for (let i = 0; i < n; i++) { const x = 250 + r() * 560, y = 870 - Math.floor(i / 8) * 40 - r() * 20; c.fillStyle = r() < 0.7 ? '#141416' : '#3a3a40'; c.beginPath(); c.ellipse(x, y, 50 + r() * 20, 36 + r() * 10, r() - 0.5, 0, 7); c.fill(); c.fillStyle = 'rgba(255,255,255,0.06)'; c.beginPath(); c.ellipse(x - 15, y - 12, 12, 8, 0, 0, 7); c.fill(); }
  particulas(c, t, 25 * pilha, 9, { area: [200, 600, 700, 300], cor: '#0a0a0a', tam: [1.5, 3], vel: [-60, 60, -40, 40], brilho: 1 });
  if (ratos) for (let k = 0; k < 2; k++) { const x = ((t * 260 + k * 700) % 1600) - 100, y = 900 + k * 20; c.fillStyle = '#2a2420'; c.beginPath(); c.ellipse(x, y, 30, 14, 0, 0, 7); c.fill(); c.beginPath(); c.ellipse(x + 30, y - 4, 13, 10, 0, 0, 7); c.fill(); c.strokeStyle = '#2a2420'; c.lineWidth = 3; c.beginPath(); c.moveTo(x - 28, y); c.quadraticCurveTo(x - 60, y - 20, x - 80, y + 4); c.stroke(); }
  c.restore();
}
function hallConversa(c, t, quem = 'paula', {dia = 10, fala = 1} = {}) {
  c.save(); camera(c, 1.2, 1150, 520); hall(c, t, { nomes: 1, cabecalho: 1 });
  desenharPessoa(c, { x: 1350, y: 684, s: 1, dir: -1, bracoF: [0.8, 1.0 + 0.2 * Math.sin(t * 2.5)], cabeca: { giro: 0.4 }, boca: falar(t, fala, 3), piscar: piscar(t, 3), luz: LUZ.diaD }, quem);
  desenharPessoa(c, { x: 1000, y: 684, s: 1, dir: 1, dia, cabeca: { giro: 0.5 }, expr: 'preocupado', piscar: piscar(t, 1), luz: LUZ.dia });
  c.restore();
}
function copoAgua(c, t) {
  c.fillStyle = '#0d0f12'; c.fillRect(0, 0, W, H);
  c.save(); camera(c, 1.0 + t * 0.03, 960, 560);
  c.fillStyle = 'rgba(200,210,210,0.25)'; c.beginPath(); c.moveTo(760, 260); c.lineTo(1160, 260); c.lineTo(1110, 880); c.lineTo(810, 880); c.fill();
  c.fillStyle = 'rgba(150,150,100,0.45)'; c.beginPath(); c.moveTo(780, 400); c.lineTo(1140, 400); c.lineTo(1110, 880); c.lineTo(810, 880); c.fill();
  const r = rng(3); for (let i = 0; i < 24; i++) { const x = 830 + r() * 260, y = 430 + r() * 420 + Math.sin(t + i) * 8; c.fillStyle = 'rgba(120,180,80,0.55)'; c.beginPath(); c.arc(x, y, 5 + r() * 6, 0, 7); c.fill(); }
  c.restore(); textoGrande(c, t, ['ÁGUA CONTAMINADA'], { y: 120, tam: 70 });
}
function reuniao(c, t, {foco = 'jorge', voto = 0, noite = 1, zoom = 1, cx = 960, cy = 560, levanta = 0} = {}) {
  c.save(); camera(c, zoom + t * 0.01, cx, cy); garagem(c, t);
  const sent = (x, vis, ext = {}) => { cadeirasPlastico(c, [x], 760); desenharPessoa(c, { x, y: 740, s: 0.85, dir: 1, tronco: -0.05, pernaF: [1.5, -1.45], pernaT: [1.4, -1.4], pePlano: true, bracoF: voto ? [3.0, 0.1] : [0.3, 1.25], bracoT: [0.25, 1.3], cabeca: { giro: 0.6 }, piscar: piscar(t, x), luz: noite ? LUZ.vela : LUZ.dia, ...ext }, vis); };
  [[240, 'pedestre2'], [430, 'mae'], [620, 'paula'], [810, 'lucas']].forEach(([x, v]) => sent(x, v, v === 'lucas' ? { dia: 13 } : {}));
  if (levanta) desenharPessoa(c, { x: 1000, y: 650, s: 0.88, dir: 1, bracoF: [1.2 + 0.3 * Math.sin(t * 4), 0.6], bracoT: [0.3, 0.4], cabeca: { giro: 0.3 }, boca: falar(t, foco === 'morador7', 8), expr: 'preocupado', luz: noite ? LUZ.vela : LUZ.dia }, 'morador7');
  else sent(1000, 'morador7', {});
  sent(1180, 'cida', { boca: falar(t, foco === 'cida', 2) * 0.7, cabeca: { giro: 0.4, incl: 0.05 } });
  desenharPessoa(c, { x: 1500, y: 684 - 40, s: 0.95, dir: -1, bracoF: [0.9 + (foco === 'jorge' ? 0.3 * Math.sin(t * 2) : 0), 1.0], bracoT: [0.6, 0.9], cabeca: { giro: 0.4 }, boca: falar(t, foco === 'jorge', 1), piscar: piscar(t, 4), luz: noite ? LUZ.velaE : LUZ.dia, objeto: (k, x, y) => { k.fillStyle = '#e8e0cc'; k.fillRect(x - 20, y - 30, 40, 50); } }, 'jorge');
  if (noite) { [[520, 860], [1320, 860], [1680, 860]].forEach(([x, y]) => { c.fillStyle = '#2a2420'; c.fillRect(x - 40, y, 80, 20); vela(c, x, y, t + x); }); escuridao(c, 0.86, [fonteVela(520, 860, t, 700), fonteVela(1320, 860, t + 1, 700), fonteVela(1680, 860, t + 2, 600)]); }
  c.restore();
}
function garagemHigiene(c, t, {dia = 10} = {}) {
  c.save(); camera(c, 1.15, 1000, 560); garagem(c, t);
  c.fillStyle = '#2a4a6a'; c.fillRect(1180, 600, 260, 300); c.fillStyle = '#1a2a3a'; c.fillRect(1190, 610, 240, 280); // cabine improvisada (lona)
  for (let i = 0; i < 3; i++) balde(c, 1520 + i * 90, 820, 1, ['#2f5f8a', '#8a2f2f', '#c9a43a'][i]);
  c.fillStyle = '#e8e4d8'; rr(c, 900, 380, 200, 260, 4); c.fill(); c.font = '700 22px Oswald'; c.fillStyle = '#222'; c.fillText('ESCALA DE LIMPEZA', 912, 410); for (let i = 0; i < 6; i++) { c.fillStyle = '#555'; c.fillRect(915, 440 + i * 30, 160, 3); }
  c.fillStyle = '#e8d06a'; rr(c, 1500, 720, 60, 30, 6); c.fill();
  desenharPessoa(c, { x: 760, y: 684, s: 1, dir: 1, dia, tronco: 0.35, bracoF: [1.3, 0.3], bracoT: [1.0, 0.5], cabeca: { giro: 0.7, incl: 0.15 }, piscar: piscar(t), luz: LUZ.dia, objeto: segBalde('#2f5f8a') });
  c.restore();
}
function lixeiras(c, t) { c.save(); camera(c, 1.1, 960, 560); garagem(c, t); [['ORGÂNICO', '#6a4a2a', 700], ['RECICLÁVEL', '#2a5a8a', 1000], ['REJEITO', '#4a4a4a', 1300]].forEach(([n, cor, x]) => { c.fillStyle = cor; rr(c, x - 110, 600, 220, 300, 12); c.fill(); c.fillStyle = shade(cor.replace('#', '#'), 0.7); c.fillRect(x - 120, 590, 240, 30); placa(c, x, 700, n, { tam: 26 }); }); c.restore(); }
ROTEIRO[6] = [
  seq(['f0', calorCidade], ['f1', (c, t) => { c.save(); camera(c, 1.2, 960, 300); ceuNublado(c, t, -1200, 900); predioPrincipal(c, t); c.restore(); c.fillStyle = 'rgba(230,120,40,0.28)'; c.fillRect(0, 0, W, H); }], ['f2', (c, t) => salaCalor(c, t)], ['f3', (c, t) => salaCalor(c, t, { deitado: 1 })]),
  seq(['f0', (c, t, d) => lixoCalcada(c, t, d, { pilha: 0.1, caminhao: 1 })], ['f2', (c, t, d) => lixoCalcada(c, t, d, { pilha: 0.3 + 0.5 * clamp(t / d) })], ['f4', (c, t, d) => lixoCalcada(c, t, d, { pilha: 1, ratos: 1 })]),
  seq(['f0', (c, t) => hallConversa(c, t, 'paula')], ['f1', copoAgua], ['f2', (c, t) => reuniao(c, t, { foco: 'jorge' })], ['f3', (c, t) => reuniao(c, t, { foco: 'jorge', zoom: 1.5, cx: 700, cy: 520 })]),
  seq(['f0', (c, t, d) => { fogao(c, t, d, { chama: 2 }); c.save(); camera(c, 1, 960, 560); for (let i = 0; i < 3; i++) garrafa(c, 1250 + i * 110, 560, 1.3); c.restore(); }], ['f1', lixeiras], ['f2', (c, t) => garagemHigiene(c, t)]),
  seq(['f0', (c, t) => lucasRadioMesa(c, t, { dia: 10, noite: 1 })], ['f1', (c, t) => { c.save(); camera(c, 1.0 + t * 0.02, 960, 560); rodovia(c, t); c.restore(); rotulo(c, t, 'RODOVIAS  ·  CAMINHÕES SEM COMBUSTÍVEL'); }], ['f2', (c, t) => despensa(c, t, { qtd: 0.3 })]),
];

// ================= CAP 7 — DIA 13 — A COMIDA ACABA =================
function mapaCaminhoes(c, t, d, info) {
  c.fillStyle = '#07080a'; c.fillRect(0, 0, W, H);
  const para = t > tf(info, 3) - tf(info, 2);
  const sp = [980, 640], origens = [[300, 200], [1700, 180], [200, 900], [1750, 820], [960, 80], [1500, 1000]];
  origens.forEach(([x, y], i) => { c.strokeStyle = 'rgba(200,200,200,0.2)'; c.lineWidth = 3; c.setLineDash([12, 12]); c.beginPath(); c.moveTo(x, y); c.lineTo(sp[0], sp[1]); c.stroke(); c.setLineDash([]);
    const k = para ? 0.55 : ((t * 0.35 + i * 0.17) % 1); const px = lerp(x, sp[0], k), py = lerp(y, sp[1], k);
    c.save(); c.translate(px, py); c.fillStyle = para ? '#8e1b1b' : PAL.laranja; c.fillRect(-26, -14, 52, 28); c.restore(); if (para) placa(c, px, py - 50, 'PARADO', { tam: 22, fundo: '#8e1b1b', cor: '#fff' }); });
  c.fillStyle = PAL.texto; c.beginPath(); c.arc(sp[0], sp[1], 18, 0, 7); c.fill(); c.font = '700 44px Oswald'; c.fillText('SÃO PAULO', sp[0] + 30, sp[1] + 14);
}
function postoTanque(c, t) {
  c.fillStyle = '#1a1814'; c.fillRect(0, 0, W, H);
  c.fillStyle = '#6a6760'; c.fillRect(0, 0, W, 420); c.fillStyle = '#3a2e22'; c.fillRect(0, 420, W, 660);
  c.fillStyle = '#c9c4b8'; rr(c, 860, 200, 200, 220, 10); c.fill(); c.fillStyle = '#0a0c0e'; rr(c, 890, 240, 140, 60, 6); c.fill();
  c.fillStyle = '#4a5560'; rr(c, 500, 640, 920, 280, 140); c.fill(); c.fillStyle = 'rgba(220,150,40,0.6)'; rr(c, 520, 700, 880, 200, 100); c.fill();
  c.strokeStyle = '#777'; c.lineWidth = 16; c.beginPath(); c.moveTo(960, 420); c.lineTo(960, 660); c.stroke();
  c.fillStyle = '#8e1b1b'; rr(c, 920, 500, 80, 60, 8); c.fill(); c.font = '600 28px Inter'; c.fillStyle = PAL.texto; c.fillText('BOMBA ELÉTRICA: PARADA', 1020, 540); c.fillText('COMBUSTÍVEL NO TANQUE', 1440, 800);
}
function defesaCivil(c, t) {
  c.save(); camera(c, 1.05 + t * 0.012, 960, 540); posto(c, t);
  [[300, 960], [1600, 960], [500, 960], [1400, 960]].forEach(([x, y]) => { c.fillStyle = '#e07a20'; c.beginPath(); c.moveTo(x - 24, y); c.lineTo(x, y - 70); c.lineTo(x + 24, y); c.fill(); c.fillStyle = '#fff'; c.fillRect(x - 12, y - 40, 24, 8); });
  c.fillStyle = '#c9a43a'; c.fillRect(-200, 920, 2400, 10);
  c.fillStyle = '#5a5e62'; rr(c, 880, 780, 90, 120, 8); c.fill(); c.strokeStyle = '#333'; c.lineWidth = 8; c.beginPath(); c.moveTo(925, 780); c.lineTo(925, 700); c.lineTo(1000 + 40 * Math.sin(t * 3), 690); c.stroke();
  desenharPessoa(c, { x: 1060, y: 660, s: 0.85, dir: -1, tronco: 0.2, bracoF: [1.3 + 0.35 * Math.sin(t * 3), 0.4], bracoT: [1.2 + 0.35 * Math.sin(t * 3), 0.5], cabeca: { giro: 0.4, incl: 0.15 }, luz: LUZ.rua }, 'defesa');
  desenharPessoa(c, { x: 760, y: 660, s: 0.85, dir: 1, bracoF: [0.9, 1.0], cabeca: { giro: 0.5 }, boca: falar(t, 1, 3), luz: LUZ.rua, objeto: (k, x, y) => { k.fillStyle = '#e8e4d8'; k.fillRect(x - 18, y - 28, 36, 46); } }, 'defesa');
  c.fillStyle = '#e8e4d8'; rr(c, 1250, 820, 120, 90, 6); c.fill(); c.fillStyle = '#c62a24'; c.fillRect(1250, 840, 120, 14);
  c.restore(); rotulo(c, t, 'DEFESA CIVIL  ·  OPERAÇÃO SUPERVISIONADA');
}
function ambulancia(c, t) {
  c.save(); camera(c, 1.0, 960, 540); unidadeSaude(c, t);
  c.save(); c.translate(820 + Math.max(0, 2 - t) * 300, 940); c.fillStyle = '#f0f0ec'; rr(c, -300, -280, 600, 250, 16); c.fill(); c.fillStyle = '#c62a24'; c.fillRect(-300, -140, 600, 24);
  const on = Math.floor(t * 4) % 2; c.fillStyle = on ? '#ff3a2a' : '#3a5aff'; c.fillRect(-60, -300, 120, 20); c.fillStyle = '#111'; [-200, 200].forEach(x => { c.beginPath(); c.arc(x, -30, 38, 0, 7); c.fill(); }); c.restore();
  c.restore();
}
function ginasioFila(c, t, {soldados = 1, lucas = 0} = {}) {
  c.save(); camera(c, 1.0 + t * 0.01, 960, 540); ginasio(c, t);
  fila(c, t, 780, 960, 16, 64, 0.48, 51, -1);
  if (soldados) { desenharPessoa(c, { x: 1080, y: 960 - 276 * 0.5, s: 0.5, dir: -1, bracoF: [1.3, 0.3], bracoT: [1.2, 0.4], cabeca: { giro: 0.4 }, luz: LUZ.rua, objeto: (k, x, y) => { k.fillStyle = '#b08a5a'; k.fillRect(x - 40, y - 50, 80, 60); } }, 'soldado');
    desenharPessoa(c, { x: 1260, y: 960 - 276 * 0.5, s: 0.5, dir: -1, bracoF: [0.2, 0.3], cabeca: { giro: 0.5 }, luz: LUZ.rua }, 'soldado'); }
  if (lucas) { const w = caminhada(t * 0.8); desenharPessoa(c, { x: 1100 + t * 110, y: 1000 - 276 * 0.55 + w.bob * 0.5, s: 0.55, dir: 1, dia: 19, ...w, bob: 0, bracoF: [1.0, 0.8], bracoT: [0.9, 0.9], cabeca: { giro: 0.5 }, luz: LUZ.rua, objeto: (k, x, y) => { k.fillStyle = '#b08a5a'; k.fillRect(x - 10, y - 70, 110, 80); } }); }
  c.restore();
}
function caderno(c, t, {linhas = ['Lucas: arroz 2 kg, feijão 1 kg, sardinha 3', 'Paula: macarrão 2, óleo 1', 'Família Souza: arroz 5 kg', 'Seu Jorge: feijão 2 kg, latas 4'], total = null} = {}) {
  c.fillStyle = '#16120e'; c.fillRect(0, 0, W, H);
  c.save(); camera(c, 1.0 + t * 0.02, 960, 540, -0.03);
  c.fillStyle = '#efe9da'; rr(c, 360, 120, 1200, 860, 10); c.fill(); for (let i = 0; i < 14; i++) { c.fillStyle = 'rgba(80,110,160,0.35)'; c.fillRect(380, 220 + i * 54, 1160, 2); } c.fillStyle = 'rgba(180,40,40,0.4)'; c.fillRect(470, 120, 3, 860);
  manuscrito(c, 500, 180, 'DESPENSA COLETIVA', 1, { tam: 40, cor: '#7a1a14' });
  linhas.forEach((l, i) => manuscrito(c, 500, 255 + i * 54, l, clamp(t * 1.2 - i * 0.6), { tam: 30 }));
  if (total) manuscrito(c, 500, 255 + (linhas.length + 1) * 54, total, clamp(t * 1.2 - linhas.length * 0.6 - 0.5), { tam: 36, cor: '#7a1a14' });
  c.restore();
}
ROTEIRO[7] = [
  seq(['f0', (c, t) => { c.save(); camera(c, 1.0 + t * 0.015, 960, 540); fachada(c, t, 'MERCADO DO BAIRRO', { cor: '#8a7a64', letreiro: '#2a5a3a', grade: 0.75 }); placa(c, 960, 560, 'FECHADO', { tam: 64, fundo: '#f3e9c8', cor: '#8e1b1b' }); c.restore(); }],
      ['f1', (c, t) => { c.save(); camera(c, 1.05, 700 + t * 70, 540); prateleiras(c, t, { cheio: 0 }); c.restore(); c.save(); c.globalAlpha = 0.5; c.fillStyle = '#555'; for (let x = 0; x < W; x += 40) c.fillRect(x, 0, 8, H); c.restore(); }],
      ['f2', mapaCaminhoes], ['f4', (c, t) => { c.save(); camera(c, 1.0 + t * 0.02, 960, 520); cidadeNoite(c, t, { acender: 0, seed: 230 }); c.restore(); rotulo(c, t, 'SÃO PAULO  ·  MILHÕES DE PESSOAS'); }]),
  seq(['f0', postoTanque], ['f2', defesaCivil], ['f3', ambulancia]),
  seq(['f0', (c, t) => { ginasioFila(c, t); rotulo(c, t, 'DISTRIBUIÇÃO DE ALIMENTOS'); }], ['f1', (c, t) => { c.save(); camera(c, 0.8, 700 + t * 50, 560); ceuNublado(c, t, -300, 420); skyline(c, 61, 560, 480, '#6a6f74'); c.fillStyle = '#3e3f40'; c.fillRect(-1000, 760, 4000, 600); fila(c, t, -400, 900, 40, 60, 0.42, 77, 1); c.restore(); }],
      ['f2', (c, t) => reuniao(c, t, { foco: 'jorge', noite: 0 })], ['f3', (c, t) => reuniao(c, t, { foco: 'jorge', noite: 0, zoom: 1.4, cx: 1400, cy: 460 })]),
  seq(['f0', (c, t) => reuniao(c, t, { foco: 'morador7', noite: 0, levanta: 1 })], ['f1', (c, t) => reuniao(c, t, { foco: 'morador7', noite: 0, levanta: 1, zoom: 1.4, cx: 1000, cy: 420 })], ['f2', (c, t) => reuniao(c, t, { foco: '', noite: 0, levanta: 1, zoom: 1.2, cx: 500, cy: 560 })],
      ['f3', (c, t) => reuniao(c, t, { foco: 'cida', noite: 0, zoom: 1.45, cx: 1180, cy: 480 })], ['f5', (c, t) => reuniao(c, t, { foco: '', noite: 0, zoom: 1.0 + t * 0.03 })]),
  seq(['f0', (c, t) => reuniao(c, t, { foco: '', noite: 0, voto: t > 0.4 })], ['f1', (c, t) => { c.save(); camera(c, 1.0, PORTA_X(91), 520); corredor(c, t); const w = caminhada(t * 0.8); desenharPessoa(c, { x: PORTA_X(91) + 180 + t * 200, y: 590 + w.bob, s: 0.88, dir: 1, dia: 13, ...w, bob: 0, bracoT: [0.1, 0.1], objetoT: (k, x, y) => { k.fillStyle = '#d8d2c0'; rr(k, x - 40, y - 10, 80, 100, 10); k.fill(); }, cabeca: { giro: 0.5 }, luz: LUZ.dia }); c.restore(); }],
      ['f2', (c, t, d) => despensa(c, t, { itens: ['ARROZ', 'FEIJÃO', 'SARDINHA', 'MACARRÃO', 'LATAS', 'ÓLEO'], qtd: 0.4 + 0.5 * clamp(t / d), titulo: 'DESPENSA COLETIVA' })],
      ['f3', (c, t) => caderno(c, t)], ['f5', (c, t) => { c.fillStyle = '#060607'; c.fillRect(0, 0, W, H); textoGrande(c, t, ['POUCO MAIS DE', 'DUAS SEMANAS'], { tam: 130, y: 380 }); }],
      ['f6', (c, t) => { c.save(); camera(c, 1.0 + t * 0.05, 960, 560); portaria(c, t, { noite: 0 }); c.restore(); }]),
];

// ================= CAP 8 — DIA 16 — A NOITE =================
function espelho(c, t) {
  c.fillStyle = '#0b0c0e'; c.fillRect(0, 0, W, H);
  c.save(); camera(c, 1.05, 960, 560);
  c.fillStyle = '#222'; c.fillRect(560, 120, 800, 700); c.fillStyle = '#2a3036'; c.fillRect(580, 140, 760, 660);
  desenharPessoa(c, { x: 960, y: 1080, s: 1.9, dir: -1, dia: 16, semPernas: true, bracoF: [0.4, 0.6], cabeca: { giro: -0.2, incl: 0.06 }, expr: 'preocupado', piscar: piscar(t), luz: LUZ.vela });
  c.fillStyle = 'rgba(255,255,255,0.05)'; c.beginPath(); c.moveTo(600, 140); c.lineTo(800, 140); c.lineTo(600, 500); c.fill();
  vela(c, 1450, 980, t, 1.3); escuridao(c, 0.8, [fonteVela(1450, 980, t, 1100)]);
  c.restore();
}
function cinto(c, t) {
  c.fillStyle = '#0f0d0b'; c.fillRect(0, 0, W, H);
  c.save(); camera(c, 1.0 + t * 0.02, 960, 540);
  c.fillStyle = shade(VISUAIS.lucas.calca, 0.8); c.fillRect(300, 420, 1320, 700); c.fillStyle = shade(VISUAIS.lucas.camiseta, 0.75); c.fillRect(300, 0, 1320, 440);
  c.fillStyle = '#2a1a10'; c.fillRect(300, 430, 1320, 60); c.fillStyle = '#b8a070'; rr(c, 900, 420, 120, 80, 10); c.fill(); c.fillStyle = '#2a1a10'; rr(c, 920, 440, 80, 40, 6); c.fill();
  c.strokeStyle = 'rgba(0,0,0,0.4)'; c.lineWidth = 6; for (let i = 0; i < 6; i++) { c.beginPath(); c.moveTo(500 + i * 150, 500); c.quadraticCurveTo(540 + i * 150, 600, 480 + i * 150, 700); c.stroke(); }
  const puxa = sstep(0.3, 1.5, t); c.fillStyle = VISUAIS.lucas.pele; c.beginPath(); c.ellipse(1150 + puxa * 80, 460, 90, 60, 0, 0, 7); c.fill();
  c.restore();
}
function maosBolhas(c, t) {
  c.fillStyle = '#0f0d0b'; c.fillRect(0, 0, W, H);
  c.save(); camera(c, 1.0 + t * 0.02, 960, 560);
  [[700, -0.3], [1220, 0.3]].forEach(([x, a]) => { c.save(); c.translate(x, 620); c.rotate(a); c.fillStyle = VISUAIS.lucas.pele; c.beginPath(); c.ellipse(0, 0, 190, 230, 0, 0, 7); c.fill();
    for (let i = 0; i < 4; i++) { rr(c, -150 + i * 78, -400, 64, 220, 30); c.fill(); } c.fillStyle = VISUAIS.lucas.peleSombra; c.beginPath(); c.ellipse(0, 40, 120, 140, 0, 0, 7); c.globalAlpha = 0.4; c.fill(); c.globalAlpha = 1;
    [[-60, -120], [20, -140], [90, -110], [-20, 60]].forEach(([bx, by]) => { c.fillStyle = 'rgba(255,230,200,0.85)'; c.beginPath(); c.ellipse(bx, by, 22, 16, 0, 0, 7); c.fill(); c.strokeStyle = 'rgba(180,70,50,0.7)'; c.lineWidth = 3; c.stroke(); }); c.restore(); });
  c.restore(); c.fillStyle = 'rgba(40,20,0,0.25)'; c.fillRect(0, 0, W, H);
}
function boatos(c, t, d) {
  c.fillStyle = '#060607'; c.fillRect(0, 0, W, H);
  const r = rng(4), frases = ['LOJAS ARROMBADAS?', 'BRIGA NA FILA DO GINÁSIO?', 'FALTA ÁGUA EM TODA A CIDADE?', 'EXÉRCITO VAI EMBORA?', 'ENERGIA SÓ NO ANO QUE VEM?', 'SAQUES NO CENTRO?'];
  frases.forEach((f, i) => { const a = sstep(i * 0.45, i * 0.45 + 0.4, t) * (0.35 + 0.65 * Math.abs(noise1(t * 2 + i))); c.save(); c.globalAlpha = a; c.font = `700 ${50 + r() * 40}px Oswald`; c.fillStyle = i % 2 ? '#c62a24' : PAL.texto; c.fillText(f, 120 + r() * 900, 160 + i * 140 + noise1(t + i) * 10); c.restore(); });
}
function sussurros(c, t) {
  c.save(); camera(c, 1.0, 960, 560); c.fillStyle = '#0b0c10'; c.fillRect(-300, -300, W + 600, H + 600);
  const vis = ['pedestre1', 'mae', 'morador7', 'pedestre2', 'jorge'];
  vis.forEach((v, i) => desenharPessoa(c, { x: 260 + i * 340, y: 684, s: 1, dir: i % 2 ? -1 : 1, tronco: 0.15, bracoF: [1.4, 1.5], cabeca: { giro: 0.6, incl: 0.1 }, boca: falar(t, Math.floor(t * 1.2) % 5 === i, i), silhueta: 'rgba(10,12,18,0.9)' }, v));
  c.restore(); escuridao(c, 0.4, [{ x: 960, y: 400, r: 900 }]);
}
function portariaVigilia(c, t, d, {chegada = 0, abre = 0, foco = null, dia = 16} = {}) {
  const z = foco === 'dupla' ? 1.7 : foco === 'jorge' ? 2.0 : 1.0, cx = foco === 'dupla' ? 560 : foco === 'jorge' ? 380 : 960, cy = foco ? 700 : 560;
  c.save(); camera(c, z + t * 0.01, cx, cy); portaria(c, t, { noite: 1, aberto: abre, parte: 'fundo' });
  if (chegada) { const k = easeOut(clamp(t / 2.5)) * (chegada > 1 ? 1 : 0.6), x = 1150 - 0 * k;
    const lx = lerp(1800, 1050, chegada > 1 ? 1 : k);
    desenharPessoa(c, { x: lx, y: 520, s: 0.85, dir: -1, bracoF: [1.3, 0.2], bracoT: [0.6, 0.8], cabeca: { giro: 0.4, incl: 0.1 }, expr: 'preocupado', luz: LUZ.lanterna, objeto: (k2, x2, y2) => { k2.fillStyle = '#333'; rr(k2, x2 - 10, y2 - 20, 50, 26, 8); k2.fill(); } }, 'mae');
    desenharPessoa(c, { x: lx + 110, y: 640, s: 0.85, dir: -1, bracoF: [1.0, 0.6], cabeca: { giro: 0.6, incl: -0.05 }, expr: 'preocupado', luz: LUZ.lanterna }, 'crianca1');
    desenharPessoa(c, { x: lx + 190, y: 650, s: 0.85, dir: -1, bracoF: [1.2, 0.8], cabeca: { giro: 0.7 }, expr: 'preocupado', luz: LUZ.lanterna }, 'crianca2'); }
  portaria(c, t, { noite: 1, aberto: abre, parte: 'grade' }); // grade por cima
  const sen = (x, vis, ext) => desenharPessoa(c, { x, y: 760, s: 1, dir: 1, tronco: 0.05, pernaF: [1.5, -1.45], pernaT: [1.4, -1.4], pePlano: true, bracoF: [0.3, 1.25], bracoT: [0.25, 1.3], cabeca: { giro: 0.6 }, piscar: piscar(t, x), luz: LUZ.lanterna, ...ext }, vis);
  if (abre) desenharPessoa(c, { x: 1250 + abre * 260, y: 684, s: 1, dir: 1, dia, bracoF: [1.4, 0.2], cabeca: { giro: 0.7 }, luz: LUZ.lanterna });
  else sen(520, 'lucas', { dia, cabeca: { giro: chegada ? 0.9 : 0.4, incl: 0.05 }, expr: chegada ? 'preocupado' : '' });
  sen(260, 'jorge', { boca: foco === 'jorge' ? 0 : 0, cabeca: { giro: 0.5, incl: 0.06 } });
  c.fillStyle = '#2a211a'; c.fillRect(-100, 820, 900, 30); c.fillStyle = '#3a3a3e'; rr(c, 380, 760, 70, 60, 8); c.fill(); c.fillStyle = '#5a4a3a'; rr(c, 660, 740, 36, 80, 6); c.fill();
  const lant = [{ x: 415, y: 760, r: 520 }]; if (chegada) lant.push({ x: lerp(1800, 1050, chegada > 1 ? 1 : easeOut(clamp(t / 2.5)) * 0.6) - 40, y: 480, r: 460 });
  escuridao(c, 0.9, lant);
  c.restore();
}
ROTEIRO[8] = [
  seq(['f0', (c, t) => { c.save(); camera(c, 1.0 + t * 0.02, 960, 520); cidadeNoite(c, t, { acender: 0, seed: 240 }); c.restore(); c.fillStyle = 'rgba(0,0,0,0.3)'; c.fillRect(0, 0, W, H); }], ['f1', espelho], ['f2', cinto], ['f3', maosBolhas]),
  seq(['f0', (c, t, d) => radioClose(c, t, d, { ligado: 1, onda: 2 })], ['f1', boatos], ['f3', sussurros]),
  seq(['f0', (c, t) => { c.save(); camera(c, 2.4 + t * 0.03, 1430, 560); portaria(c, t, { noite: 1 }); c.restore(); escuridao(c, 0.5, [{ x: 960, y: 560, r: 700 }]); }],
      ['f1', (c, t) => caderno(c, t, { linhas: ['VIGÍLIA', '22h às 0h  Paula e Cláudio', '0h às 2h  Joaquim e Rita', '2h às 4h  Lucas e Seu Jorge', '4h às 6h  Marli e Pedro'] })],
      ['f3', (c, t, d) => portariaVigilia(c, t, d)], ['f4', (c, t, d) => portariaVigilia(c, t, d, { foco: 'dupla' })]),
  seq(['f0', (c, t, d) => portariaVigilia(c, t, d, { chegada: 1 })], ['f2', (c, t, d) => portariaVigilia(c, t, d, { chegada: 2 })], ['f5', (c, t, d) => { c.save(); camera(c, 2.2, 1250, 500); portaria(c, t, { noite: 1, parte: 'fundo' });
    desenharPessoa(c, { x: 1150, y: 640, s: 0.85, dir: -1, bracoF: [0.9, 0.9], cabeca: { giro: 0.3, incl: 0.15 }, expr: 'preocupado', piscar: piscar(t), luz: LUZ.lanterna }, 'mae');
    desenharPessoa(c, { x: 1260, y: 760, s: 0.85, dir: -1, bracoF: [1.1, 0.8], cabeca: { giro: 0.4, incl: 0.1 }, expr: 'preocupado', piscar: piscar(t, 2), luz: LUZ.lanterna }, 'crianca1');
    desenharPessoa(c, { x: 1340, y: 770, s: 0.85, dir: -1, bracoF: [1.4, 0.6], cabeca: { giro: 0.7 }, expr: 'preocupado', piscar: piscar(t, 4), luz: LUZ.lanterna }, 'crianca2');
    portaria(c, t, { noite: 1, parte: 'grade' }); escuridao(c, 0.7, [{ x: 1200, y: 560, r: 600 }]); c.restore(); }]),
  seq(['f0', (c, t, d) => portariaVigilia(c, t, d, { foco: 'dupla', chegada: 2 })], ['f1', (c, t) => { despensa(c, t, { itens: ['ARROZ', 'FEIJÃO', 'SARDINHA', 'MACARRÃO', 'LATAS', 'ÓLEO'], qtd: 0.25 }); escuridao(c, 0.6, [{ x: 960, y: 500, r: 800 }]); }],
      ['f3', (c, t, d) => portariaVigilia(c, t, d, { foco: 'jorge', chegada: 2 })], ['f5', (c, t, d) => portariaVigilia(c, t, d, { chegada: 2, abre: easeIO(clamp((t - 1.2) / 1.6)) })]),
];
