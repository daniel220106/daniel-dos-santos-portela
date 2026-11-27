// VIDEO_01 — PARTE 3: capítulos 9 a 12
'use strict';
Object.assign(CAPITULOS, { 9: { dia: 'DIA 19', titulo: 'A DECISÃO' }, 10: { dia: 'DIA 23', titulo: 'COMUNIDADE' }, 11: { dia: 'DIA 27', titulo: 'O BOATO' }, 12: { dia: 'DIA 30', titulo: 'A LUZ VOLTA' } });

function bicicleta(c, x, y, s = 1, giro = 0) {
  c.save(); c.translate(x, y); c.scale(s, s); c.strokeStyle = '#1a1a1c'; c.lineWidth = 7;
  [-130, 130].forEach(wx => { c.beginPath(); c.arc(wx, 0, 80, 0, 7); c.stroke(); c.save(); c.translate(wx, 0); c.rotate(giro); for (let i = 0; i < 6; i++) { c.lineWidth = 2; c.beginPath(); c.moveTo(0, 0); c.lineTo(Math.cos(i) * 78, Math.sin(i) * 78); c.stroke(); } c.restore(); });
  c.strokeStyle = '#8e1b1b'; c.lineWidth = 9; c.beginPath(); c.moveTo(-130, 0); c.lineTo(-20, 0); c.lineTo(80, -110); c.lineTo(-60, -110); c.lineTo(-20, 0); c.moveTo(-60, -110); c.lineTo(-80, -140); c.moveTo(80, -110); c.lineTo(130, 0); c.moveTo(80, -110); c.lineTo(70, -160); c.stroke();
  c.fillStyle = '#111'; rr(c, -110, -152, 60, 14, 6); c.fill(); c.strokeStyle = '#222'; c.lineWidth = 6; c.beginPath(); c.moveTo(50, -165); c.lineTo(100, -170); c.stroke();
  c.restore();
}
function ciclista(c, t, x, y, s = 1) {
  const ped = t * 5;
  bicicleta(c, x, y, s, ped);
  desenharPessoa(c, { x: x - 70 * s, y: y - 160 * s, s: s * 0.95, dir: 1, tronco: 0.55, pernaF: [0.9 + 0.5 * Math.sin(ped), -1.2 - 0.4 * Math.cos(ped)], pernaT: [0.9 - 0.5 * Math.sin(ped), -1.2 + 0.4 * Math.cos(ped)], bracoF: [1.0, -0.2], bracoT: [0.95, -0.2], cabeca: { giro: 0.7, incl: -0.3 }, luz: LUZ.rua,
    objetoT: (k, px, py) => {} }, 'morador7');
}
function mapaInterior(c, t) {
  c.fillStyle = '#07080a'; c.fillRect(0, 0, W, H);
  const sp = [1300, 680], mae = [560, 380];
  c.strokeStyle = 'rgba(200,200,200,0.2)'; c.lineWidth = 3; c.beginPath(); c.moveTo(1700, 900); c.lineTo(1500, 200); c.lineTo(900, 120); c.lineTo(250, 380); c.lineTo(400, 860); c.lineTo(1100, 1000); c.closePath(); c.stroke();
  const k = sstep(0.5, 2.0, t); c.strokeStyle = PAL.laranja; c.lineWidth = 4; c.setLineDash([16, 12]); c.beginPath(); c.moveTo(sp[0], sp[1]); c.lineTo(lerp(sp[0], mae[0], k), lerp(sp[1], mae[1], k)); c.stroke(); c.setLineDash([]);
  c.fillStyle = PAL.texto; c.beginPath(); c.arc(sp[0], sp[1], 14, 0, 7); c.fill(); c.font = '700 40px Oswald'; c.fillText('SÃO PAULO', sp[0] + 26, sp[1] + 12);
  const on = Math.floor(t * 1.5) % 2 === 0; c.fillStyle = on ? '#ffd28a' : '#4a3a20'; c.beginPath(); c.arc(mae[0], mae[1], 16, 0, 7); c.fill();
  if (on) { c.fillStyle = rgrad(c, mae[0], mae[1], 0, 90, [[0, 'rgba(255,210,140,0.5)'], [1, 'rgba(0,0,0,0)']]); c.fillRect(mae[0] - 90, mae[1] - 90, 180, 180); }
  c.fillStyle = PAL.texto; c.fillText('CIDADE DA MÃE', mae[0] - 120, mae[1] - 40);
  c.globalAlpha = k; c.font = '700 64px Oswald'; c.fillText('200 KM', 860, 600); c.globalAlpha = 1;
}
function rota3dias(c, t) {
  c.fillStyle = '#0a0b0d'; c.fillRect(0, 0, W, H);
  c.strokeStyle = 'rgba(232,121,43,0.8)'; c.lineWidth = 6; c.beginPath(); c.moveTo(200, 700); c.bezierCurveTo(600, 400, 1000, 900, 1720, 450); c.stroke();
  ['DIA 1', 'DIA 2', 'DIA 3'].forEach((d, i) => { const a = sstep(0.4 + i * 0.6, 0.8 + i * 0.6, t); c.globalAlpha = a; const x = 500 + i * 450, y = [560, 640, 590][i]; c.fillStyle = PAL.texto; c.beginPath(); c.arc(x, y, 14, 0, 7); c.fill(); c.font = '700 48px Oswald'; c.fillText(d, x - 50, y - 40); c.font = '400 26px Inter'; c.fillText(['calor', 'água', 'estrada'][i], x - 40, y + 60); });
  c.globalAlpha = 1; ciclista(c, t, lerp(200, 1700, clamp(t / 5)), 900, 0.5);
}
function balanca(c, t) {
  c.fillStyle = '#08090b'; c.fillRect(0, 0, W, H);
  const a = Math.sin(t * 1.3) * 0.12; c.save(); c.translate(960, 380); c.strokeStyle = PAL.texto; c.lineWidth = 8;
  c.beginPath(); c.moveTo(0, -40); c.lineTo(0, 520); c.stroke(); c.rotate(a); c.beginPath(); c.moveTo(-500, 0); c.lineTo(500, 0); c.stroke();
  [[-500, 'IR ATÉ A MÃE'], [500, 'FICAR E AJUDAR']].forEach(([x, txt]) => { c.save(); c.translate(x, 0); c.rotate(-a); c.beginPath(); c.moveTo(0, 0); c.lineTo(-120, 200); c.moveTo(0, 0); c.lineTo(120, 200); c.stroke(); c.fillStyle = PAL.vermelho; c.fillRect(-140, 200, 280, 20); c.font = '700 44px Oswald'; c.fillStyle = PAL.texto; c.textAlign = 'center'; c.fillText(txt, 0, 290); c.restore(); });
  c.restore();
}
function carta(c, t, d) {
  c.fillStyle = '#0c0a08'; c.fillRect(0, 0, W, H);
  c.save(); camera(c, 1.0 + t * 0.012, 960, 560, -0.02); mesa(c, 960, 880, 1900, '#3a2a1d');
  c.fillStyle = '#efe7d2'; rr(c, 440, 140, 960, 760, 4); c.fill();
  const linhas = ['Mãe,', 'estou bem. Não se preocupe.', 'Conheci os vizinhos. Estamos nos ajudando,', 'cuidando do prédio juntos.', 'Assim que tudo passar, vou te encontrar.', 'Com amor,', 'Lucas'];
  const prog = clamp(t / Math.max(d - 1, 1)) * linhas.length;
  linhas.forEach((l, i) => manuscrito(c, 520, 230 + i * 80, l, prog - i, { tam: 38 }));
  const li = Math.min(linhas.length - 1, Math.floor(prog)), lx = 520 + c.measureText ? 520 + (linhas[li].length * clamp(prog - li)) * 17 : 600;
  c.fillStyle = VISUAIS.lucas.pele; c.beginPath(); c.ellipse(lx + 60, 260 + li * 80, 80, 50, -0.3, 0, 7); c.fill(); c.fillStyle = '#1a1a1a'; c.save(); c.translate(lx, 230 + li * 80); c.rotate(-0.7); c.fillRect(-3, -10, 6, 110); c.restore();
  vela(c, 1600, 880, t, 1.5); escuridao(c, 0.75, [fonteVela(1600, 880, t, 1400)]);
  c.restore();
}
function frenteDoPredio(c, t, {ciclistaX = null, lucas = 1, dia = 19} = {}) {
  c.save(); camera(c, 1.0, 960, 540); ceuNublado(c, t, -300, 500);
  c.fillStyle = '#6f6d69'; c.fillRect(200, -300, 1300, 1000); for (let i = 0; i < 5; i++) for (let j = 0; j < 3; j++) { c.fillStyle = '#1e2329'; c.fillRect(260 + i * 240, -200 + j * 220, 150, 120); }
  c.fillStyle = '#2c2f34'; c.fillRect(200, 520, 1300, 240); for (let i = 0; i < 26; i++) c.fillRect(220 + i * 50, 520, 10, 240);
  c.fillStyle = '#4a4b4c'; c.fillRect(-400, 760, W + 800, 120); c.fillStyle = '#2b2c2e'; c.fillRect(-400, 880, W + 800, 400);
  if (lucas) desenharPessoa(c, { x: 820, y: 760 - 276 * 0.75 + 40, s: 0.75, dir: 1, dia, bracoF: [1.3, 0.3], cabeca: { giro: 0.6 }, luz: LUZ.rua, objeto: (k, x, y) => { k.fillStyle = '#efe7d2'; k.fillRect(x - 10, y - 20, 50, 34); } });
  if (ciclistaX !== null) ciclista(c, t, ciclistaX, 900, 0.75);
  c.restore();
}
ROTEIRO[9] = [
  seq(['f0', (c, t) => lucasRadioMesa(c, t, { dia: 19 })], ['f1', mapaInterior], ['f4', (c, t) => { c.save(); camera(c, 1.25, 1150, 420); sala(c, t, { tv: false }); c.save(); c.beginPath(); c.rect(1260, 160, 520, 600); c.clip(); ceuNublado(c, t, 160, 760); skyline(c, 31, 780, 420, '#56606a'); c.restore();
    desenharPessoa(c, { x: 1100, y: 684, s: 1, dir: 1, dia: 19, bracoF: [1.2, 1.2], bracoT: [1.0, 1.3], cabeca: { giro: 0.3, incl: 0.25 }, expr: 'preocupado', piscar: piscar(t), luz: LUZ.diaD, objeto: (k, x, y) => { k.fillStyle = '#5a3a22'; k.fillRect(x - 40, y - 60, 90, 70); k.fillStyle = '#c9b48a'; k.fillRect(x - 32, y - 52, 74, 54); } }); c.restore(); }]),
  seq(['f0', (c, t) => { c.save(); camera(c, 1.15, 960, 560); garagem(c, t); bicicleta(c, 1000, 880, 0.9); desenharPessoa(c, { x: 1250, y: 684, s: 1, dir: -1, bracoF: [1.2, 0.4], cabeca: { giro: 0.4 }, boca: falar(t, 1, 3), luz: LUZ.dia }, 'pedestre1'); desenharPessoa(c, { x: 700, y: 684, s: 1, dir: 1, dia: 19, cabeca: { giro: 0.6 }, piscar: piscar(t), luz: LUZ.dia }); c.restore(); }],
      ['f1', rota3dias], ['f3', (c, t) => { c.save(); camera(c, 1.2 + t * 0.015, 960, 600); garagem(c, t); bicicleta(c, 1250, 880, 0.9); desenharPessoa(c, { x: 640, y: 905, s: 1, dir: 1, dia: 19, tronco: 0.15, pernaF: [1.4, -1.6], pernaT: [1.3, -1.7], pePlano: true, bracoF: [1.2, 1.1], bracoT: [1.1, 1.2], cabeca: { giro: 0.7, incl: 0.05 }, piscar: piscar(t), luz: LUZ.dia }); c.restore(); }]),
  seq(['f0', (c, t) => { c.fillStyle = '#060607'; c.fillRect(0, 0, W, H); textoGrande(c, t, ['MAS EXISTIA', 'OUTRA QUESTÃO'], { tam: 110, y: 400 }); }], ['f1', (c, t, d) => despensa(c, t, { itens: ['ARROZ', 'FEIJÃO', 'SARDINHA', 'MACARRÃO', 'LATAS', 'ÓLEO'], qtd: 0.45 - 0.25 * clamp(t / d) })], ['f2', balanca], ['f3', (c, t, d, i) => escadaBaldes(c, t, d, i, { inicio: 5, dia: 19 })]),
  seq(['f0', (c, t, d) => lucasJanelaNoite(c, t, d, { dia: 19 })], ['f1', carta]),
  seq(['f0', (c, t) => frenteDoPredio(c, t, { ciclistaX: 1250 })], ['f1', (c, t) => frenteDoPredio(c, t, { ciclistaX: 1250 + t * 300, lucas: 1 })], ['f2', (c, t) => ginasioFila(c, t, { lucas: 1 })]),
];

// ================= CAP 10 — DIA 23 — COMUNIDADE =================
function cozinhaColetiva(c, t, {zoom = 1, cx = 960, cy = 560, jantar = 0} = {}) {
  c.save(); camera(c, zoom + t * 0.008, cx, cy); garagem(c, t, { cozinha: 1 });
  const cozinheiro = (x, vis, ext = {}) => desenharPessoa(c, { x, y: 684, s: 1, dir: 1, tronco: 0.12, bracoF: [1.2, 0.8 + 0.25 * Math.sin(t * 3 + x)], bracoT: [0.6, 0.8], cabeca: { giro: 0.6, incl: 0.12 }, piscar: piscar(t, x), boca: falar(t, Math.sin(t * 0.7 + x) > 0.6, x), luz: LUZ.dia, ...ext }, vis);
  cozinheiro(330, 'mae'); cozinheiro(730, 'paula'); cozinheiro(1130, 'jorge');
  desenharPessoa(c, { x: 1700, y: 790, s: 0.9, dir: -1, ...caminhada(t * 1.4), bob: 0, cabeca: { giro: 0.5 }, luz: LUZ.dia }, 'crianca1');
  if (jantar) { escuridao(c, 0.7, [fonteVela(500, 900, t, 900), fonteVela(1200, 900, t + 2, 900)]); }
  c.restore();
}
function trocas(c, t) {
  c.fillStyle = '#1b1814'; c.fillRect(0, 0, W, H);
  c.save(); camera(c, 1.0 + t * 0.02, 960, 560); c.fillStyle = '#4a3a2c'; c.fillRect(0, 560, W, 600);
  const k = easeIO(clamp((t - 0.5) / 1.5));
  c.save(); c.translate(lerp(560, 1260, k), 560); for (let i = 0; i < 4; i++) { c.fillStyle = '#c9a43a'; rr(c, i * 50, -110, 36, 100, 6); c.fill(); } c.restore();
  c.save(); c.translate(lerp(1360, 560, k), 560); c.fillStyle = '#e8e0c8'; rr(c, 0, -200, 180, 200, 10); c.fill(); c.font = '700 34px Oswald'; c.fillStyle = '#7a3a2a'; c.fillText('ARROZ', 30, -100); c.restore();
  c.fillStyle = VISUAIS.lucas.pele; c.beginPath(); c.ellipse(lerp(560, 1260, k) - 40, 600, 90, 60, 0, 0, 7); c.fill(); c.fillStyle = VISUAIS.mae.pele; c.beginPath(); c.ellipse(lerp(1360, 560, k) + 220, 600, 90, 60, 0, 0, 7); c.fill();
  c.restore(); textoGrande(c, t, ['TROCAS'], { y: 140, tam: 80 });
}
function consertoTorneira(c, t) {
  c.save(); camera(c, 1.3, 400, 640); cozinha(c, t);
  c.fillStyle = '#2b2520'; c.fillRect(100, 640, 400, 320); c.fillStyle = '#111'; c.fillRect(140, 660, 320, 280);
  desenharPessoa(c, { x: 560, y: 905, s: 1, dir: -1, dia: 23, tronco: 0.9, pernaF: [1.5, -2.0], pernaT: [0.6, -2.2], pePlano: true, bracoF: [1.5 + 0.2 * Math.sin(t * 4), 0.4], bracoT: [1.3, 0.6], cabeca: { giro: 0.6, incl: 0.1 }, piscar: piscar(t), luz: LUZ.dia,
    objeto: (k, x, y, a) => { k.save(); k.translate(x, y); k.rotate(-a + 1.2 + 0.4 * Math.sin(t * 4)); k.fillStyle = '#9aa0a6'; k.fillRect(-6, -10, 12, 110); k.beginPath(); k.arc(0, 100, 18, 0, 7); k.fill(); k.restore(); } });
  c.restore();
}
function lajeChuva(c, t, d, {foco = null, chuva = 1} = {}) {
  const z = foco === 'jorge' ? 1.8 : foco === 'paula' ? 1.8 : 1.0, cx = foco === 'jorge' ? 1300 : foco === 'paula' ? 520 : 960, cy = foco ? 520 : 560;
  c.save(); camera(c, z + t * 0.01, cx, cy); laje(c, t, { chuva });
  c.fillStyle = '#2a5a8a'; c.beginPath(); c.moveTo(1000, 640); c.lineTo(1420, 560); c.lineTo(1420, 600); c.lineTo(1080, 700); c.fill(); // lona
  c.strokeStyle = '#7a7a7a'; c.lineWidth = 16; c.beginPath(); c.moveTo(1420, 600); c.lineTo(1420, 760); c.stroke();
  [[300, '#2f5f8a'], [460, '#8a2f2f'], [620, '#c9a43a'], [900, '#2f5f8a'], [1480, '#6a6a6a']].forEach(([x, cor]) => balde(c, x, 700, 1, cor));
  const p = (x, vis, ext = {}) => desenharPessoa(c, { x, y: 470, s: 0.95, dir: 1, piscar: piscar(t, x), luz: LUZ.dia, cabeca: { giro: 0.3, incl: -0.15 }, ...ext }, vis);
  p(200, 'mae', { bracoF: [2.6, 0.3], bracoT: [2.4, 0.3] }); p(560, 'paula', { dir: 1, bracoF: [1.2 + 0.3 * Math.sin(t * 2.5), 0.4], boca: falar(t, foco === 'paula', 2) }); p(780, 'lucas', { dia: 23, bracoF: [0.4, 0.3], cabeca: { giro: 0.2, incl: -0.3 } });
  p(1250, 'jorge', { dir: 1, tronco: 0.3, bracoF: [1.3, 0.3], bracoT: [1.2, 0.4], cabeca: { giro: 0.6, incl: 0.1 }, boca: falar(t, foco === 'jorge', 1) });
  desenharPessoa(c, { x: 360, y: 560, s: 0.9, dir: 1, ...caminhada(t * 1.5), bob: 0, cabeca: { giro: 0.3, incl: -0.2 }, luz: LUZ.dia }, 'crianca2');
  c.restore(); if (chuva) chuvaFx(c, t, chuva);
}
function filtro(c, t) {
  c.fillStyle = '#16130f'; c.fillRect(0, 0, W, H);
  c.save(); camera(c, 1.0 + t * 0.02, 960, 560);
  balde(c, 700, 420, 0, '#2f5f8a'); c.save(); c.scale(2.4, 2.4); c.restore();
  c.fillStyle = '#d8d2c0'; c.beginPath(); c.ellipse(700, 480, 220, 40, 0, 0, 7); c.fill(); c.fillStyle = 'rgba(150,190,220,0.6)'; c.fillRect(690, 260, 20, 200);
  c.restore(); fogao(c, t, 2, { chama: 2 }); c.save(); c.globalAlpha = 0.6; c.fillStyle = '#16130f'; c.fillRect(0, 0, 900, H); c.restore();
  c.save(); camera(c, 1, 960, 560); c.fillStyle = '#4a5560'; rr(c, 200, 300, 380, 420, 20); c.fill(); c.fillStyle = '#efe9da'; c.beginPath(); c.ellipse(390, 310, 210, 40, 0, 0, 7); c.fill(); c.fillStyle = 'rgba(150,190,220,0.6)'; c.fillRect(380, 100, 20, 200 + 20 * Math.sin(t * 6)); c.restore();
  textoGrande(c, t, ['FILTRAR E FERVER'], { y: 140, tam: 70 });
}
function salaoSal(c, t) {
  c.save(); camera(c, 1.15 + t * 0.01, 960, 560); salao(c, t, { cama: 0 }); mesa(c, 960, 720, 900, '#5a4232');
  for (let i = 0; i < 5; i++) { c.fillStyle = 'rgba(220,230,220,0.6)'; rr(c, 620 + i * 140, 600, 90, 120, 10); c.fill(); c.fillStyle = ['#6a8a3a', '#c84a2a', '#e0b23a', '#6a8a3a', '#8a3a6a'][i]; c.fillRect(630 + i * 140, 650, 70, 64); c.fillStyle = '#eee'; c.fillRect(630 + i * 140, 630, 70, 20); }
  desenharPessoa(c, { x: 560, y: 700, s: 1, dir: 1, tronco: 0.1, pernaF: [1.5, -1.45], pernaT: [1.4, -1.4], pePlano: true, bracoF: [1.4, 0.5 + 0.2 * Math.sin(t * 3)], bracoT: [1.2, 0.6], cabeca: { giro: 0.6, incl: 0.1 }, boca: falar(t, 1, 2) * 0.8, piscar: piscar(t, 2), luz: LUZ.dia }, 'cida');
  desenharPessoa(c, { x: 1360, y: 684, s: 1, dir: -1, bracoF: [0.4, 1.4], bracoT: [0.3, 1.5], cabeca: { giro: 0.5, incl: 0.1 }, piscar: piscar(t, 4), luz: LUZ.diaD }, 'mae');
  desenharPessoa(c, { x: 1180, y: 760, s: 0.9, dir: -1, bracoF: [1.0, 0.5], cabeca: { giro: 0.6, incl: 0.15 }, piscar: piscar(t, 6), luz: LUZ.diaD }, 'crianca1');
  c.restore();
}
function criancasEscada(c, t, d) {
  c.save(); camera(c, 1.0, 900, 560); escada(c, t, 5 + Math.floor(t / 1.4) % 4);
  [0, 0.12].forEach((o, i) => { const u = ((t * 0.55 + o) % 1), [fx, fy] = noDegrau(u), w = caminhada(t * 2.2 + i * 0.5);
    desenharPessoa(c, { x: fx, y: fy - 270 * 0.85 * 0.53 - 20, s: 0.85, dir: 1, ...w, bob: 0, tronco: 0.15, bracoF: i ? w.bracoF : [1.4, 0.3], cabeca: { giro: 0.4, incl: -0.05 }, boca: 0.4, luz: LUZ.dia, objeto: i ? null : (k, x, y) => { k.fillStyle = '#efe7d2'; k.fillRect(x - 8, y - 30, 34, 26); } }, i ? 'crianca2' : 'crianca1'); });
  c.restore(); rotulo(c, t, 'O CORREIO DO PRÉDIO');
}
function retratos(c, t) {
  c.fillStyle = '#0a0b0d'; c.fillRect(0, 0, W, H);
  const elenco = [['jorge', 'SEU JORGE'], ['paula', 'PAULA'], ['cida', 'DONA CIDA'], ['mae', 'VIZINHA'], ['crianca1', ''], ['morador7', '']];
  elenco.forEach(([v, n], i) => { const a = sstep(i * 0.3, i * 0.3 + 0.4, t); if (a <= 0) return; c.save(); c.globalAlpha = a; const x = 220 + i * 300;
    c.save(); c.beginPath(); rr(c, x - 130, 260, 260, 400, 12); c.clip(); c.fillStyle = '#1e2126'; c.fillRect(x - 130, 260, 260, 400);
    desenharPessoa(c, { x, y: 940, s: v.startsWith('crianca') ? 2.0 : 1.4, dir: i % 2 ? -1 : 1, semPernas: true, cabeca: { giro: -0.3 }, piscar: piscar(t, i), luz: LUZ.acesa }, v); c.restore();
    c.font = '600 26px Inter'; c.fillStyle = PAL.texto; c.textAlign = 'center'; c.fillText(n, x, 710); c.restore(); });
  textoGrande(c, t, ['AGORA ELE CONHECIA TODOS'], { y: 140, tam: 64 });
}
ROTEIRO[10] = [
  seq(['f0', (c, t) => cozinhaColetiva(c, t)], ['f1', (c, t) => cozinhaColetiva(c, t, { zoom: 1.7, cx: 1600, cy: 450 })], ['f3', (c, t) => cozinhaColetiva(c, t, { zoom: 1.4, cx: 760, cy: 480 })]),
  seq(['f0', (c, t) => { c.fillStyle = '#060607'; c.fillRect(0, 0, W, H); c.save(); c.globalAlpha = 1 - sstep(0.5, 2.5, t); textoGrande(c, 1, ['R$'], { tam: 300, y: 500, cor: '#3a3a3a' }); c.restore(); c.strokeStyle = PAL.vermelhoVivo; c.lineWidth = 14; const k = sstep(0.3, 1.0, t); c.beginPath(); c.moveTo(780, 360); c.lineTo(780 + 360 * k, 360 + 300 * k); c.stroke(); }], ['f1', trocas], ['f2', consertoTorneira],
      ['f3', (c, t) => { c.save(); camera(c, 1.0, 900 + t * 100, 520); corredor(c, t, { portaAberta: '95' }); const w = caminhada(t * 0.9); desenharPessoa(c, { x: 700 + t * 280, y: 590 + w.bob, s: 0.88, dir: 1, dia: 23, ...w, bob: 0, bracoT: [0.1, 0.1], objetoT: (k, x, y) => { k.fillStyle = '#8e1b1b'; rr(k, x - 40, y, 90, 50, 6); k.fill(); }, cabeca: { giro: 0.5 }, luz: LUZ.dia });
        desenharPessoa(c, { x: PORTA_X(95) + 85, y: 590, s: 0.86, dir: -1, bracoF: [1.6, 0.3], cabeca: { giro: 0.3 }, boca: falar(t, 1), luz: LUZ.dia }, 'pedestre2'); c.restore(); }]),
  seq(['f0', (c, t, d) => { c.save(); camera(c, 1.0 + t * 0.02, 960, 500); laje(c, t, { chuva: sstep(0.5, d, t) }); c.restore(); chuvaFx(c, t, sstep(1, d, t)); }], ['f1', (c, t, d) => lajeChuva(c, t, d)], ['f2', (c, t, d) => lajeChuva(c, t, d, { foco: 'jorge' })], ['f3', (c, t, d) => lajeChuva(c, t, d, { foco: 'paula' })], ['f4', filtro]),
  seq(['f0', salaoSal], ['f2', criancasEscada]),
  seq(['f0', (c, t, d, i) => escreverParede(c, t, d, i, { fase: 'cheia' })], ['f1', retratos], ['f3', (c, t) => despensa(c, t, { itens: ['ARROZ', 'FEIJÃO', 'SARDINHA', 'MACARRÃO', 'LATAS', 'ÓLEO'], qtd: 0.2, titulo: 'COMIDA PARA ~1 SEMANA' })], ['f4', (c, t) => cozinhaColetiva(c, t, { jantar: 1 })]),
];

// ================= CAP 11 — DIA 27 — O BOATO =================
function relogio(c, t, horas, {texto = null} = {}) {
  c.fillStyle = '#08090b'; c.fillRect(0, 0, W, H);
  c.save(); c.translate(960, 470); c.fillStyle = '#e8e4d8'; c.beginPath(); c.arc(0, 0, 260, 0, 7); c.fill(); c.strokeStyle = '#1a1a1a'; c.lineWidth = 14; c.stroke();
  for (let i = 0; i < 12; i++) { c.save(); c.rotate(i * Math.PI / 6); c.fillStyle = '#1a1a1a'; c.fillRect(-4, -240, 8, 30); c.restore(); }
  const h = horas % 12; c.strokeStyle = '#1a1a1a'; c.lineWidth = 14; c.lineCap = 'round'; c.beginPath(); c.moveTo(0, 0); c.lineTo(Math.sin(h / 6 * Math.PI) * 140, -Math.cos(h / 6 * Math.PI) * 140); c.stroke();
  c.lineWidth = 8; c.beginPath(); c.moveTo(0, 0); c.lineTo(Math.sin(t * 0.8) * 210, -Math.cos(t * 0.8) * 210); c.stroke(); c.restore();
  escuridao(c, 0.55, [{ x: 960, y: 470, r: 700 }]);
  if (texto) textoGrande(c, 1, [texto], { y: 880, tam: 80 });
}
function lajeEspera(c, t, {velas = 1} = {}) {
  c.save(); camera(c, 1.0 + t * 0.01, 960, 520); laje(c, t, { noite: 1 });
  ['mae', 'paula', 'lucas', 'jorge', 'pedestre1', 'pedestre2'].forEach((v, i) => desenharPessoa(c, { x: 260 + i * 260, y: 470, s: 0.95, dir: 1, dia: 27, cabeca: { giro: 0.9, incl: -0.05 }, silhueta: 'rgba(6,8,14,0.92)', bracoF: [0.2, 0.4] }, v));
  desenharPessoa(c, { x: 500, y: 570, s: 0.9, dir: 1, silhueta: 'rgba(6,8,14,0.92)', cabeca: { giro: 0.9 } }, 'crianca2');
  if (velas) { vela(c, 700, 740, t, 0.8 * velas); escuridao(c, 0.5, [fonteVela(700, 740, t, 500 * velas)]); }
  c.restore();
}
function torneiraJardim(c, t) {
  c.fillStyle = '#20281e'; c.fillRect(0, 0, W, H);
  c.save(); camera(c, 1.0 + t * 0.02, 960, 540); c.fillStyle = '#5a5a52'; c.fillRect(0, 0, W, 760); c.fillStyle = '#2e3a26'; c.fillRect(0, 760, W, 400);
  for (let i = 0; i < 40; i++) { c.strokeStyle = '#3e5a2e'; c.lineWidth = 6; c.beginPath(); c.moveTo(i * 50, 1080); c.lineTo(i * 50 + 10, 760 + Math.sin(i) * 30); c.stroke(); }
  c.fillStyle = '#9aa0a5'; c.fillRect(840, 300, 60, 140); rr(c, 840, 300, 260, 60, 20); c.fill(); rr(c, 1040, 340, 60, 80, 14); c.fill(); c.fillStyle = '#8e1b1b'; rr(c, 790, 260, 160, 40, 16); c.fill();
  const g = (t * 0.9) % 1; c.fillStyle = 'rgba(170,210,240,0.9)'; c.beginPath(); c.ellipse(1070, 430 + g * g * 420, 10, 14, 0, 0, 7); c.fill();
  if (g > 0.9) { c.strokeStyle = 'rgba(170,210,240,0.6)'; c.lineWidth = 3; c.beginPath(); c.ellipse(1070, 860, 40, 8, 0, 0, 7); c.stroke(); }
  c.restore();
}
function discussao(c, t) {
  c.save(); camera(c, 1.2, 960, 520); salao(c, t, { cama: 0 }); mesa(c, 960, 720, 600, '#5a4232'); c.fillStyle = '#d8c040'; rr(c, 930, 610, 70, 110, 8); c.fill();
  desenharPessoa(c, { x: 640, y: 684, s: 1, dir: 1, bracoF: [1.4 + 0.3 * Math.sin(t * 5), 0.3], cabeca: { giro: 0.5 }, boca: falar(t, Math.sin(t * 1.3) > 0, 8), expr: 'preocupado', luz: LUZ.dia }, 'morador7');
  desenharPessoa(c, { x: 1280, y: 684, s: 1, dir: -1, bracoF: [1.3 + 0.3 * Math.sin(t * 4 + 1), 0.4], cabeca: { giro: 0.5 }, boca: falar(t, Math.sin(t * 1.3) <= 0, 2), expr: 'preocupado', luz: LUZ.diaD }, 'pedestre2');
  desenharPessoa(c, { x: 1500, y: 684, s: 1, dir: -1, bracoF: [0.6, 1.2], cabeca: { giro: 0.4 }, expr: 'preocupado', luz: LUZ.diaD }, 'mae');
  c.restore();
}
function choroPortaria(c, t, d, {cida = 0, junto = 0, perto = 0} = {}) {
  const z = perto ? 2.1 : 1.3, cx = perto ? 560 : 760, cy = perto ? 520 : 600;
  c.save(); camera(c, z + t * 0.01, cx, cy); portaria(c, t, { noite: 1 });
  const solu = junto ? 0 : 0.04 * Math.sin(t * 7);
  desenharPessoa(c, { x: 520, y: 760, s: 1, dir: 1, dia: 27, tronco: junto ? 0.2 : 0.55 + solu, pernaF: [1.5, -1.6], pernaT: [1.4, -1.6], pePlano: true, bracoF: junto ? [0.3, 1.25] : [1.6, 2.0], bracoT: junto ? [0.25, 1.3] : [1.5, 2.1], cabeca: { giro: junto ? -0.2 : 0.4, incl: junto ? 0.15 : 0.45 }, expr: 'preocupado', piscar: junto ? piscar(t) : 1, luz: LUZ.vela });
  let vx = 760;
  if (cida) { const k = junto ? 1 : easeOut(clamp(t / 3)); vx = lerp(1300, 790, k);
    if (junto) desenharPessoa(c, { x: 790, y: 760, s: 1, dir: -1, tronco: 0.05, pernaF: [1.5, -1.45], pernaT: [1.4, -1.4], pePlano: true, bracoF: [0.35, 1.2], bracoT: [0.3, 1.25], cabeca: { giro: 0.4, incl: 0.1 }, boca: falar(t, perto, 3) * 0.7, piscar: piscar(t, 3), luz: LUZ.velaE }, 'cida');
    else desenharPessoa(c, { x: vx, y: 684 - 20, s: 1, dir: -1, ...caminhada(t * 0.5, 0.4 * (1 - k)), bob: 0, bracoF: [1.3, 0.6], cabeca: { giro: 0.5, incl: 0.1 }, piscar: piscar(t, 3), luz: LUZ.velaE }, 'cida');
    vela(c, junto ? 700 : vx - 110, junto ? 760 : 560, t, 0.9); }
  c.fillStyle = '#2a211a'; c.fillRect(-100, 820, 900, 30);
  escuridao(c, 0.9, cida ? [fonteVela(junto ? 700 : vx - 110, junto ? 760 : 560, t, 650)] : [{ x: 520, y: 500, r: 380, forca: 0.6 }]);
  c.restore();
}
ROTEIRO[11] = [
  seq(['f0', (c, t) => { c.save(); camera(c, 1.0, 900, 560); escada(c, t, 3 + Math.floor(t / 1.0) % 6); const u = (t * 0.9) % 1, [fx, fy] = noDegrau(u), w = caminhada(t * 2.2); desenharPessoa(c, { x: fx, y: fy - 262 + w.bob, s: 0.95, dir: 1, ...w, bob: 0, tronco: 0.25, cabeca: { giro: 0.3, incl: -0.2 }, boca: 0.6 + 0.4 * Math.sin(t * 9), luz: LUZ.dia }, 'pedestre1'); c.restore(); }],
      ['f1', (c, t) => { c.save(); camera(c, 0.9, 1300, 520); corredor(c, t, { portaAberta: null }); ['92', '93', '95', '96'].forEach((n, i) => { const x = PORTA_X(+n) + 85; if (t > i * 0.4) desenharPessoa(c, { x: x + 40, y: 590, s: 0.86, dir: i % 2 ? -1 : 1, cabeca: { giro: 0.2 }, boca: falar(t, 1, i), bracoF: [0.9, 1.0], luz: LUZ.dia }, ['mae', 'paula', 'pedestre2', 'jorge'][i]); }); c.restore(); }]),
  seq(['f0', (c, t) => { c.save(); camera(c, 1.0, 1060, 560); cozinha(c, t); geladeiraAberta(c, t, 0); desenharPessoa(c, { x: 920, y: 684, s: 1, dir: 1, tronco: 0.2, bracoF: [1.4 + 0.3 * Math.sin(t * 5), 0.3], cabeca: { giro: 0.7 }, luz: LUZ.dia }, 'mae'); c.restore(); }],
      ['f1', (c, t) => { c.fillStyle = '#1b1814'; c.fillRect(0, 0, W, H); c.save(); camera(c, 1.0 + t * 0.02, 960, 540); c.fillStyle = '#4a3a2c'; c.fillRect(0, 600, W, 500); for (let i = 0; i < 6; i++) { c.fillStyle = '#111'; rr(c, 260 + i * 240, 300, 150, 300, 20); c.fill(); c.fillStyle = '#1e2a3a'; rr(c, 272 + i * 240, 312, 126, 276, 12); c.fill(); c.strokeStyle = '#ddd'; c.lineWidth = 6; c.beginPath(); c.moveTo(335 + i * 240, 600); c.quadraticCurveTo(335 + i * 240, 700, 300 + i * 240, 760); c.stroke(); } c.restore(); }],
      ['f2', (c, t) => { c.save(); camera(c, 1.3, 960, 560); salao(c, t, { cama: 0 }); [700, 900].forEach((x, i) => desenharPessoa(c, { x, y: 790 - Math.abs(Math.sin(t * 5 + i)) * 40, s: 0.9, dir: i ? -1 : 1, bracoF: [2.8, 0.2], bracoT: [2.6, 0.3], cabeca: { giro: 0.3, incl: -0.2 }, boca: 0.5, luz: LUZ.dia }, i ? 'crianca2' : 'crianca1')); c.restore(); }],
      ['f3', (c, t) => { c.save(); camera(c, 2.4, 300, 470); portaria(c, t, { noite: 0 }); desenharPessoa(c, { x: 300, y: 760, s: 1, dir: 1, tronco: 0.05, pernaF: [1.5, -1.45], pernaT: [1.4, -1.4], pePlano: true, bracoF: [0.3, 1.25], cabeca: { giro: 0.3 }, boca: 0.15, piscar: piscar(t), luz: LUZ.dia }, 'jorge'); c.restore(); }]),
  seq(['f0', (c, t) => relogio(c, t, 8, { texto: '20:00' })], ['f1', (c, t) => lajeEspera(c, t)], ['f2', (c, t) => relogio(c, t, 9, { texto: '21:00' })], ['f3', (c, t) => lajeEspera(c, t, { velas: 0.8 })], ['f4', (c, t) => relogio(c, t, 10, { texto: '22:00' })],
      ['f5', (c, t) => { c.fillStyle = '#050505'; c.fillRect(0, 0, W, H); c.save(); camera(c, 2.2, 960, 560); [800, 960, 1120].forEach((x, i) => vela(c, x, 800, t + i, 2.0 - i * 0.4 - t * 0.05)); escuridao(c, 0.6, [fonteVela(960, 800, t, 700)]); c.restore(); }],
      ['f6', (c, t) => relogio(c, t, 12, { texto: 'MEIA-NOITE' })], ['f7', (c, t) => lajeEspera(c, t, { velas: 0.3 })], ['f9', (c, t, d) => radioClose(c, t, d, { ligado: 1, onda: 2 })], ['f10', torneiraJardim]),
  seq(['f0', discussao], ['f2', (c, t) => { c.save(); camera(c, 1.1, 960, 560); portaria(c, t, { noite: 0, aberto: 0.6 }); const w = caminhada(t * 0.8); desenharPessoa(c, { x: 900 + t * 140, y: 600 + w.bob, s: 0.9, dir: 1, ...w, bob: 0, bracoT: [0.1, 0.1], objetoT: (k, x, y) => { k.fillStyle = '#d8d2c0'; rr(k, x - 40, y - 10, 80, 100, 10); k.fill(); }, cabeca: { giro: 0.6 }, luz: LUZ.rua }, 'morador7'); c.restore(); }]),
  seq(['f0', (c, t, d) => choroPortaria(c, t, d)], ['f1', (c, t, d) => choroPortaria(c, t, d, { cida: 1 })], ['f2', (c, t, d) => choroPortaria(c, t, d, { cida: 1, junto: 1 })], ['f3', (c, t, d) => choroPortaria(c, t, d, { cida: 1, junto: 1, perto: 1 })]),
];

// ================= CAP 12 — DIA 30 — A LUZ VOLTA =================
function cozinhaLuz(c, t, d, info, {acende = 0} = {}) {
  const flick = acende ? (t < 0.6 ? (Math.floor(t * 14) % 2) : 1) : 0;
  c.save(); camera(c, 1.0 + t * 0.01, 960, 520); cozinha(c, t);
  if (acende) geladeiraAberta(c, t, 0, 1);
  c.fillStyle = flick ? '#fff6dc' : '#444'; c.beginPath(); c.arc(700, 100, 26, 0, 7); c.fill(); c.fillStyle = '#222'; c.fillRect(696, -100, 8, 175);
  desenharPessoa(c, { x: 760, y: 684, s: 1, dir: 1, dia: 30, cabeca: { giro: acende ? -0.4 : 0.6, incl: acende ? -0.15 : 0 }, boca: acende ? 0.4 : 0, piscar: piscar(t), luz: flick ? LUZ.acesa : LUZ.noite });
  if (flick) { c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = rgrad(c, 700, 100, 0, 1200, [[0, 'rgba(255,230,170,0.35)'], [1, 'rgba(0,0,0,0)']]); c.fillRect(-500, -500, W + 1000, H + 1000); c.restore(); }
  else escuridao(c, 0.85, [{ x: 1500, y: 300, r: 300, forca: 0.3 }]);
  c.restore();
}
function predioAcende(c, t) {
  c.save(); camera(c, 1.15, 960, 180); c.fillStyle = vgrad(c, -1400, 900, [[0, '#04060d'], [1, '#141b2b']]); c.fillRect(-800, -1500, W + 1600, 2600);
  skyline(c, 71, 930, 640, '#070910'); const P = predioPrincipal(c, t);
  const r = rng(5); for (let k = 1; k <= 14; k++) for (let j = 0; j < 4; j++) { const on = t > 0.3 + r() * 2.0; if (on) { const x = P.x + 30 + j * 120, y = P.chao - k * P.hA + 18; c.fillStyle = '#ffd890'; c.fillRect(x, y, 80, 62); c.fillStyle = 'rgba(255,210,140,0.2)'; c.fillRect(x - 20, y - 20, 120, 102); if (r() < 0.3) desenharPessoa(c, { x: x + 40, y: y + 120, s: 0.2, dir: 1, silhueta: 'rgba(30,20,10,0.9)', bracoF: [3.0, 0.1 * Math.sin(t * 8)], bracoT: [2.8, 0.1] }); } }
  c.restore(); c.fillStyle = 'rgba(0,0,0,0.25)'; c.fillRect(0, 0, W, H);
}
function lajeCidadeAcende(c, t, d, {lucas = 1} = {}) {
  c.save(); camera(c, 1.0 + t * 0.008, 960, 520);
  c.fillStyle = vgrad(c, -200, 760, [[0, '#03050b'], [1, '#101726']]); c.fillRect(-800, -400, W + 1600, 1600);
  particulas(c, t, 140, 12, { area: [-400, -300, W + 800, 900], cor: '#e6ecff', tam: [0.5, 1.6], vel: [0, 0, 0, 0], brilho: 0.7 });
  [[300, 0.2], [301, 0.45], [302, 0.7]].forEach(([s, k], i) => { c.save(); c.beginPath(); c.rect(-800 + i * 900, -400, 900, 1600); c.clip(); skyline(c, s, 760 + i * 10, 460 - i * 60, '#05070c', { janelas: 0.35, apagar: 1 - sstep(k * d, k * d + 1.6, t), corJanela: '#ffd28a' }); c.restore(); });
  c.fillStyle = '#121316'; c.fillRect(-800, 760, W + 1600, 600);
  if (lucas) desenharPessoa(c, { x: 760, y: 760 - 276 * 1.1 + 60, s: 1.1, dir: 1, dia: 30, cabeca: { giro: 1.1 }, silhueta: 'rgba(8,8,12,0.95)', bracoF: [0.2, 0.3] });
  c.restore();
}
function celularMensagens(c, t, d, info) {
  const fundo = buf('fundoLaje'), fc = fundo.getContext('2d'); fc.setTransform(1, 0, 0, 1, 0, 0); fc.save(); lajeCidadeAcende(fc, 10, 10, { lucas: 0 }); fc.restore();
  c.filter = 'blur(12px)'; c.drawImage(fundo, 0, 0); c.filter = 'none';
  const [hx, hy, hr] = handheld(t, 3);
  c.save(); camera(c, 1.02, 960 + hx, 560 + hy, hr);
  maoCelular(c, t, (k, x, y, w, h) => {
    k.fillStyle = '#e8e4dc'; k.font = '600 24px Inter'; k.fillText('19:04', x + 36, y + 30); iconeSinal(k, x + w - 120, y + 12, 1, '#fff', false);
    const n = Math.min(7, Math.floor(t * 4)); const msgs = ['Trabalho', 'Banco', 'Grupo da família', 'Prefeitura', 'Operadora', 'Grupo do prédio', 'Mãe'];
    for (let i = 0; i < n; i++) { const yy = y + 90 + i * 92; k.fillStyle = i === 6 ? '#1f6f5a' : '#263040'; rr(k, x + 20, yy, w - 40, 80, 14); k.fill(); k.fillStyle = '#f0ece4'; k.font = '600 22px Inter'; k.fillText(msgs[i], x + 40, yy + 32); k.font = '400 18px Inter'; k.fillStyle = 'rgba(240,236,228,0.7)'; k.fillText(i === 6 ? 'Mensagem de voz  0:42' : 'Novas mensagens', x + 40, yy + 60); }
    const toca = t > tf(info, 3);
    if (toca) { k.fillStyle = 'rgba(31,111,90,0.95)'; rr(k, x + 20, y + h - 220, w - 40, 160, 20); k.fill(); k.fillStyle = '#fff'; k.beginPath(); k.moveTo(x + 50, y + h - 170); k.lineTo(x + 50, y + h - 110); k.lineTo(x + 90, y + h - 140); k.fill();
      for (let i = 0; i < 26; i++) { const a = 8 + 30 * Math.abs(Math.sin(i * 1.7 + t * 6) * noise1(i + t * 2)); k.fillRect(x + 110 + i * 9, y + h - 140 - a / 2, 5, a); } k.font = '600 20px Inter'; k.fillText('Mãe', x + 50, y + h - 75); }
  }, { toque: [tf(info, 3) + 0.1] });
  c.restore();
}
function diasSeguintes(c, t, tipo) {
  if (tipo === 'mercado') { c.save(); camera(c, 1.0 + t * 0.015, 960, 540); fachada(c, t, 'MERCADO DO BAIRRO', { cor: '#8a7a64', letreiro: '#2a5a3a', vitrine: '#f0e2b8' }); c.fillStyle = 'rgba(255,240,200,0.15)'; c.fillRect(300, 420, 1320, 440); fila(c, t, 1500, 960, 6, 90, 0.48, 9, 1); placa(c, 960, 560, 'ABERTO', { tam: 64, fundo: '#2a5a3a', cor: '#fff' }); c.restore(); }
  if (tipo === 'onibus') { c.save(); camera(c, 1.0, 900 + t * 40, 520); ceuNublado(c, t, -100, 500); skyline(c, 61, 560, 480, '#6a6f74'); c.fillStyle = '#2b2c2e'; c.fillRect(-400, 680, 3400, 500); onibus(c, ((t * 260) % 2600) - 300, 900, 1, 3); for (let i = 0; i < 6; i++) carro(c, ((i * 500 + t * 330) % 2800) - 300, 1060, 1, ['#59595e', '#7a2a24', '#d0ccc4'][i % 3], 1);
    c.fillStyle = '#1d1f21'; c.fillRect(1640, 300, 26, 900); c.fillStyle = '#16181a'; rr(c, 1590, 250, 110, 290, 14); c.fill(); ['#2a1414', '#2a2414', '#2aff6a'].forEach((col, i) => { c.fillStyle = col; c.beginPath(); c.arc(1645, 300 + i * 90, 34, 0, 7); c.fill(); }); c.restore(); }
  if (tipo === 'banco') { c.save(); camera(c, 1.0 + t * 0.012, 960, 540); fachada(c, t, 'BANCO', { cor: '#5a6a7a', letreiro: '#1a2a4a', vitrine: '#e8e0c8' }); fila(c, t, 1400, 960, 7, 80, 0.48, 14, 1); c.fillStyle = '#2a2c30'; rr(c, 1680, 460, 180, 360, 8); c.fill(); c.fillStyle = '#3a8ad0'; c.fillRect(1700, 500, 140, 110); c.restore(); }
}
function elevador(c, t) {
  c.save(); camera(c, 1.1, 960, 520); corredor(c, t);
  const ab = sstep(0.3, 1.3, t); c.fillStyle = '#d8d0b8'; c.fillRect(760, 280, 400, 560); c.fillStyle = '#b8b2a0'; c.fillRect(760 + 200 * ab, 300, 200 * (1 - ab), 540); c.fillRect(960, 300, 200 * (1 - ab), 540);
  c.font = '700 40px Oswald'; c.fillStyle = '#c62a24'; c.fillText('9', 945, 260);
  if (ab > 0.5) { const k = clamp((t - 1.2) / 2.5); desenharPessoa(c, { x: 900 + k * 220, y: 600, s: 0.88, dir: 1, ...caminhada(t * 0.5, 0.4), bob: 0, bracoF: [0.8, 0.5], cabeca: { giro: 0.2, incl: 0.05 }, boca: falar(t, t > 2.5, 3) * 0.6, luz: LUZ.acesa }, 'cida'); desenharPessoa(c, { x: 1200 + k * 160, y: 590, s: 0.88, dir: -1, dia: 30, cabeca: { giro: 0.4 }, piscar: piscar(t), luz: LUZ.acesa }); }
  c.restore(); c.fillStyle = 'rgba(255,220,160,0.08)'; c.fillRect(0, 0, W, H);
}
function kit(c, t) {
  c.fillStyle = '#1b1814'; c.fillRect(0, 0, W, H);
  c.save(); camera(c, 1.0 + t * 0.015, 960, 540); c.fillStyle = '#4a3a2c'; c.fillRect(300, 200, 1320, 700); c.fillStyle = '#1a140f'; c.fillRect(320, 220, 1280, 660); c.fillStyle = '#6a5240'; c.fillRect(320, 560, 1280, 18); c.fillRect(320, 860, 1280, 20);
  const itens = [() => { for (let i = 0; i < 4; i++) galao(c, 420 + i * 90, 560, 1.0); }, () => { for (let i = 0; i < 8; i++) { c.fillStyle = '#c9a43a'; rr(c, 820 + i * 34, 490, 26, 70, 5); c.fill(); } }, () => radio(c, 1350, 500, 0.5), () => { for (let i = 0; i < 5; i++) vela(c, 440 + i * 50, 860, 0, 1.4); }, () => { for (let i = 0; i < 6; i++) { c.fillStyle = ['#e8e0c8', '#7a3a2a', '#d8b040'][i % 3]; rr(c, 800 + i * 110, 720, 90, 140, 8); c.fill(); } }];
  const rot = ['ÁGUA', 'PILHAS', 'RÁDIO', 'VELAS', 'COMIDA PARA 2 SEMANAS'];
  itens.forEach((f, i) => { const a = sstep(0.2 + i * 0.35, 0.5 + i * 0.35, t); if (a > 0) { c.save(); c.globalAlpha = a; f(); c.restore(); } });
  c.restore(); textoGrande(c, t, ['SEMPRE PREPARADO'], { y: 110, tam: 64 });
}
function perguntaFinal(c, t, tipo) {
  c.fillStyle = '#050506'; c.fillRect(0, 0, W, H);
  if (tipo === 'internet') { const g = sstep(0.8, 2.5, t); c.save(); c.translate(960, 420); c.globalAlpha = 1 - g * 0.85;
    for (let i = 1; i <= 3; i++) { c.strokeStyle = PAL.texto; c.lineWidth = 22; c.lineCap = 'round'; c.beginPath(); c.arc((noise1(t * 20 + i) * 30) * g, 120, i * 80, Math.PI * 1.25, Math.PI * 1.75); c.stroke(); } c.fillStyle = PAL.texto; c.beginPath(); c.arc(0, 120, 22, 0, 7); c.fill(); c.restore();
    if (g > 0) for (let i = 0; i < 12; i++) { c.fillStyle = `rgba(198,42,36,${0.5 * g})`; c.fillRect(hash(i + Math.floor(t * 12)) * W, hash(i * 7 + Math.floor(t * 12)) * 700, 200 * hash(i * 3), 6); }
    textoGrande(c, t, ['E SE A INTERNET', 'DESAPARECESSE PARA SEMPRE?'], { y: 700, tam: 76 }); }
  if (tipo === 'escolha') { textoGrande(c, t, ['VOCÊ FICARIA NA CIDADE', 'OU IRIA EMBORA?'], { y: 380, tam: 96, sub: 'Deixe sua resposta nos comentários' });
    c.save(); c.globalAlpha = sstep(1.2, 1.8, t); c.fillStyle = PAL.vermelhoVivo; rr(c, 900, 760, 120, 90, 18); c.fill(); c.beginPath(); c.moveTo(930, 845); c.lineTo(920, 885); c.lineTo(970, 845); c.fill(); c.fillStyle = '#fff'; [930, 960, 990].forEach(x => { c.beginPath(); c.arc(x, 805, 9, 0, 7); c.fill(); }); c.restore(); }
}
ROTEIRO[12] = [
  seq(['f0', (c, t, d, i) => cozinhaLuz(c, t, d, i)], ['f2', (c, t, d, i) => { c.save(); camera(c, 1.6, 1240, 500); cozinha(c, t); geladeiraAberta(c, t, 0, 1); c.restore(); }], ['f3', (c, t, d, i) => cozinhaLuz(c, t, d, i, { acende: 1 })],
      ['f4', (c, t, d) => rostoLucas(c, t, d, { dia: 30, expr: '', luz: LUZ.acesa, fundo: '#2a2418', giro: -0.3, incl: -0.05 })], ['f5', predioAcende]),
  seq(['f0', (c, t, d) => { c.save(); camera(c, 1.0, 900, 560); escada(c, t, 14); const u = (t * 0.6) % 1, [fx, fy] = noDegrau(u), w = caminhada(t * 2.0); desenharPessoa(c, { x: fx, y: fy - 262 + w.bob, s: 0.95, dir: 1, dia: 30, ...w, bob: 0, tronco: 0.25, cabeca: { giro: 0.4, incl: -0.2 }, luz: LUZ.acesa }); c.restore(); c.fillStyle = 'rgba(255,220,160,0.08)'; c.fillRect(0, 0, W, H); }],
      ['f1', (c, t, d) => lajeCidadeAcende(c, t, d)]),
  seq(['f0', celularMensagens], ['f5', (c, t, d) => { lajeCidadeAcende(c, 20, 20, { lucas: 0 }); c.save(); camera(c, 1.0, 960, 520); desenharPessoa(c, { x: 900, y: 790, s: 1.3, dir: 1, dia: 30, tronco: 0.1, pernaF: [1.5, -1.5], pernaT: [1.4, -1.5], pePlano: true, bracoF: [1.9, 2.3], cabeca: { giro: 1.0, incl: 0.1 }, silhueta: 'rgba(8,8,12,0.95)' }); c.restore(); }]),
  seq(['f0', (c, t) => diasSeguintes(c, t, 'mercado')], ['f0+2.2', (c, t) => diasSeguintes(c, t, 'onibus')], ['f0+4.4', (c, t) => diasSeguintes(c, t, 'banco')], ['f1', elevador], ['f2', kit], ['f3', (c, t, d, i) => escreverParede(c, t, d, i, { fase: 'cheia' })]),
  seq(['f0', (c, t) => { c.save(); camera(c, 1.1 - t * 0.02, 960, 520); cidadeNoite(c, t, { acender: 1, seed: 250 }); c.restore(); }], ['f1', (c, t) => { c.fillStyle = '#050506'; c.fillRect(0, 0, W, H); textoGrande(c, t, ['MAS FICA', 'UMA PERGUNTA'], { tam: 110, y: 400 }); }],
      ['f2', (c, t) => perguntaFinal(c, t, 'internet')], ['f4', (c, t) => perguntaFinal(c, t, 'escolha')]),
];
