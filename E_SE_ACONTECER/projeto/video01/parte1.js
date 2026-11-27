// VIDEO_01 — PARTE 1: abertura (cap 0) e capítulos 1 a 4
'use strict';
Object.assign(CAPITULOS, {
  0: { dia: '', titulo: '' }, 1: { dia: 'DIA 1', titulo: 'O APAGÃO' }, 2: { dia: 'DIA 2', titulo: 'A ÁGUA PARA' },
  3: { dia: 'DIA 3', titulo: 'SILÊNCIO' }, 4: { dia: 'DIA 5', titulo: 'A GELADEIRA' },
});
const L = (x, y, o = {}) => ({ x, y, s: 1, dir: 1, piscar: piscar(o._t || 0), ...o }); // atalho de pose
const tf = (info, i) => (info.f && info.f[i] !== undefined ? info.f[i] : 1e9);

// ---------- ícones simples ----------
function icone(c, tipo, x, y, s = 1, cor = PAL.texto) {
  c.save(); c.translate(x, y); c.scale(s, s); c.strokeStyle = cor; c.fillStyle = cor; c.lineWidth = 8; c.lineCap = 'round';
  if (tipo === 'luz') { c.beginPath(); c.arc(0, -20, 38, Math.PI * 0.8, Math.PI * 2.2); c.lineTo(16, 34); c.lineTo(-16, 34); c.closePath(); c.stroke(); c.fillRect(-16, 42, 32, 8); }
  if (tipo === 'agua') { c.beginPath(); c.moveTo(0, -55); c.quadraticCurveTo(45, 5, 32, 25); c.arc(0, 18, 34, 0.2, Math.PI - 0.2); c.quadraticCurveTo(-45, 5, 0, -55); c.stroke(); }
  if (tipo === 'celular') { rr(c, -28, -52, 56, 104, 10); c.stroke(); c.fillRect(-8, 38, 16, 5); }
  if (tipo === 'internet') { for (let i = 1; i <= 3; i++) { c.beginPath(); c.arc(0, 40, i * 22, Math.PI * 1.25, Math.PI * 1.75); c.stroke(); } c.beginPath(); c.arc(0, 40, 6, 0, 7); c.fill(); }
  if (tipo === 'cartao') { rr(c, -55, -35, 110, 70, 8); c.stroke(); c.fillRect(-55, -18, 110, 12); }
  c.restore();
}
function iconesRiscados(c, t, tipos, tempos) {
  tipos.forEach((tp, i) => {
    const a = sstep(tempos[i], tempos[i] + 0.3, t); if (a <= 0) return;
    const x = W / 2 + (i - (tipos.length - 1) / 2) * 290;
    c.save(); c.globalAlpha = a; icone(c, tp, x, 480, 1.4);
    const k = clamp((t - tempos[i] - 0.25) / 0.3); c.strokeStyle = PAL.vermelhoVivo; c.lineWidth = 10; c.lineCap = 'round';
    c.beginPath(); c.moveTo(x - 80, 400); c.lineTo(x - 80 + 160 * k, 400 + 160 * k); c.stroke(); c.restore();
  });
}

// ================= CAP 0 — GANCHO =================
ROTEIRO[0] = [seq(
  ['f0', (c, t) => { c.save(); camera(c, 1.0 + t * 0.02, 960, 600); cidadeNoite(c, t, { acender: 1 - sstep(0.8, 3.2, t) }); c.restore(); }],
  ['f1', (c, t, d) => { c.fillStyle = '#060607'; c.fillRect(0, 0, W, H); const n = Math.min(30, 1 + Math.floor(29 * easeIO(clamp(t / Math.max(d - 0.4, 0.5))))); textoGrande(c, 1, ['DIA ' + n], { tam: 190 }); c.fillStyle = PAL.vermelhoVivo; c.fillRect(W / 2 - 450, 700, 900 * n / 30, 8); }],
  ['f3', (c, t, d) => { c.fillStyle = '#08080a'; c.fillRect(0, 0, W, H); iconesRiscados(c, t, ['luz', 'agua', 'celular', 'internet', 'cartao'], [0, d * 0.16, d * 0.32, d * 0.48, d * 0.64]); }],
  ['f4', (c, t) => { c.fillStyle = '#060607'; c.fillRect(0, 0, W, H); c.fillStyle = rgrad(c, W / 2, 540, 0, 700, [[0, 'rgba(142,27,27,0.3)'], [1, 'rgba(0,0,0,0)']]); c.fillRect(0, 0, W, H); textoGrande(c, t, ['SIMULAÇÃO'], { tam: 170, sub: 'Cenário hipotético. Não é notícia nem previsão.' }); }],
  ['f5', AB(16)],
)];

// ================= CAP 1 — DIA 1 — O APAGÃO =================
function ligacao(c, t, d, info) {
  c.save(); camera(c, 1.08 + t * 0.008, 980, 520);
  sala(c, t, { tv: false });
  c.save(); c.beginPath(); c.rect(1260, 160, 520, 600); c.clip(); ceuNublado(c, t, 160, 760); skyline(c, 31, 780, 420, '#56606a'); c.restore();
  c.strokeStyle = '#121417'; c.lineWidth = 22; c.strokeRect(1260, 160, 520, 600);
  const caiu = t > tf(info, 1) && t < tf(info, 2) || t > tf(info, 3);
  desenharPessoa(c, L(1000, 684, { dir: 1, _t: t, bracoF: [1.9, 2.3], bracoT: [0.1, 0.3], cabeca: { giro: 0.3, incl: 0.08 }, expr: caiu ? 'preocupado' : '', luz: LUZ.diaD,
    objeto: (k, x, y) => { k.fillStyle = '#111'; rr(k, x - 14, y - 34, 26, 56, 6); k.fill(); } }));
  c.restore();
  // cartão da chamada
  c.save(); c.globalAlpha = sstep(0.2, 0.6, t); c.fillStyle = 'rgba(12,14,18,0.85)'; rr(c, 1370, 120, 430, 150, 14); c.fill();
  c.font = '600 40px Inter'; c.fillStyle = PAL.texto; c.fillText('Mãe', 1410, 180);
  c.font = '400 28px Inter'; c.fillStyle = caiu ? '#e0574f' : 'rgba(242,239,233,0.7)'; c.fillText(caiu ? 'Chamada encerrada' : 'Chamando' + '.'.repeat(1 + Math.floor(t * 2) % 3), 1410, 230); c.restore();
}
function escadaDescendo(c, t, d, {dia = 1, lanterna = 1, carga = null, sobe = 0} = {}) {
  const per = 2.6, k = Math.floor(t / per), u0 = (t % per) / per;
  const andar = sobe ? Math.min(9, 1 + k) : Math.max(1, 9 - k);
  const u = sobe ? u0 : 1 - u0;
  const [fx, fy] = noDegrau(u);
  const s = 0.95, w = caminhada(t * 1.15, 0.8);
  c.save(); camera(c, 1.0, 900 + (fx - 900) * 0.3, 560 + (fy - 740) * 0.3);
  escada(c, t, andar, { janela: !lanterna });
  desenharPessoa(c, { x: fx, y: fy - 270 * s + w.bob, s, dir: sobe ? 1 : -1, ...w, bob: 0, tronco: sobe ? 0.12 : -0.04, dia, cabeca: { giro: 0.6, incl: 0.12 },
    bracoF: carga ? [0.08, 0.05] : (lanterna ? [1.1, 0.3] : w.bracoF), bracoT: carga ? [-0.05, 0.05] : w.bracoT, objeto: carga || null, objetoT: carga || null,
    luz: lanterna ? LUZ.lanterna : LUZ.dia });
  if (lanterna) escuridao(c, 0.86, [{ x: fx + (sobe ? 160 : -160), y: fy - 120, r: 420 }, { x: fx, y: fy - 260, r: 260, forca: 0.6 }]);
  c.restore();
}
function ruaCalcada(c, t, {dia = 1, lucas = 1, vazio = 0} = {}) {
  const camX = 800 + t * 60;
  c.save(); camera(c, 1.0, camX, 540);
  ceuNublado(c, t, -100, 520); skyline(c, 41, 560, 500, '#6d7378'); skyline(c, 42, 600, 380, '#55595d');
  c.fillStyle = '#2b2c2e'; c.fillRect(-400, 600, 3600, 260);
  const cores = ['#7a2a24', '#a4a8ad', '#2f3a4a', '#d0ccc4', '#3d4a3a'];
  for (let i = 0; i < 14; i++) carro(c, -300 + i * 250, 760, 0.8, cores[i % 5], 1, 0.5);
  c.fillStyle = '#4a4b4c'; c.fillRect(-400, 860, 3600, 300);
  for (let i = 0; i < 6; i++) { const v = ['pedestre1', 'pedestre2', 'mae', 'morador7'][i % 4], dir = i % 2 ? 1 : -1, ww = caminhada(t * 0.9 + i * 0.37);
    desenharPessoa(c, { x: (i * 420 + dir * t * 110 + 3600) % 3600 - 300, y: 900 + ww.bob * 0.5 - i % 2 * 10, s: 0.5, dir, ...ww, bob: 0, luz: LUZ.rua }, v); }
  if (lucas) { const ww = caminhada(t * 0.9); desenharPessoa(c, { x: 700 + t * 100, y: 900 - 276 * 0.62 + 140 + ww.bob * 0.6, s: 0.62, dir: 1, dia, ...ww, bob: 0, cabeca: { giro: 0.4 + 0.3 * Math.sin(t * 0.7) }, luz: LUZ.rua }); }
  c.restore();
}
function padaria(c, t, d, info) {
  c.save(); camera(c, 1.0 + t * 0.02, 960, 540); fachada(c, t, 'PADARIA SÃO JORGE', { cor: '#8a6a44', letreiro: '#5a2a14', vitrine: '#2a2622' });
  c.fillStyle = '#d8cfba'; c.fillRect(380, 620, 1160, 240); c.fillStyle = '#c9a46a'; for (let i = 0; i < 10; i++) { c.beginPath(); c.ellipse(450 + i * 110, 600, 40, 20, 0, 0, 7); c.fill(); }
  desenharPessoa(c, { x: 1250, y: 560, s: 0.8, dir: -1, cabeca: { giro: 0.5 }, boca: falar(t, 1), semPernas: true, luz: LUZ.rua }, 'pedestre1');
  desenharPessoa(c, { x: 700, y: 700, s: 0.95, dir: 1, dia: 1, cabeca: { giro: 0.7 }, bracoF: [1.0, 0.6], semPernas: false, luz: LUZ.rua });
  c.restore();
  // maquininha
  const a = sstep(0.3, 0.7, t);
  c.save(); c.globalAlpha = a; c.translate(1500, 330); c.rotate(-0.06); c.fillStyle = '#1b1d20'; rr(c, -120, -150, 240, 330, 24); c.fill();
  c.fillStyle = '#0c1a14'; rr(c, -95, -125, 190, 110, 8); c.fill(); c.font = '600 26px Inter'; c.fillStyle = '#e0574f'; c.textAlign = 'center'; c.fillText('SEM CONEXÃO', 0, -62);
  for (let i = 0; i < 9; i++) { c.fillStyle = '#3a3d42'; rr(c, -84 + (i % 3) * 62, 10 + Math.floor(i / 3) * 48, 50, 36, 6); c.fill(); } c.restore();
  if (t > tf(info, 2) - tf(info, 1)) placa(c, 520, 470, 'SÓ DINHEIRO', { tam: 60, ang: -0.04, fundo: '#f3e9c8', cor: '#8e1b1b' });
}
function posto(c, t) {
  c.save(); camera(c, 1.02 + t * 0.015, 960, 540);
  ceuNublado(c, t, -300, 500); skyline(c, 180, 540, 400, '#6a7076');
  c.fillStyle = '#e4e0d6'; c.fillRect(150, 200, 1620, 90); c.fillStyle = '#8e1b1b'; c.fillRect(150, 270, 1620, 20);
  c.fillStyle = '#d0ccc4'; [420, 940, 1460].forEach(x => c.fillRect(x - 25, 290, 50, 560));
  [600, 1220].forEach(x => { c.fillStyle = '#c9c4b8'; rr(c, x - 80, 520, 160, 330, 10); c.fill(); c.fillStyle = '#0a0c0e'; rr(c, x - 60, 560, 120, 70, 6); c.fill(); c.fillStyle = '#333'; c.fillRect(x + 80, 600, 24, 120); });
  c.fillStyle = '#3e3f40'; c.fillRect(-600, 850, W + 1200, 400);
  placa(c, 910, 640, 'SEM ENERGIA', { tam: 54, fundo: '#f3e9c8', cor: '#8e1b1b' });
  c.fillStyle = '#5a3a2a'; c.fillRect(1530, 655, 110, 14); c.fillRect(1540, 665, 10, 190); c.fillRect(1620, 665, 10, 190);
  desenharPessoa(c, { x: 1580, y: 660, s: 0.75, dir: -1, tronco: -0.05, pernaF: [1.5, -1.45], pernaT: [1.4, -1.4], pePlano: true, cabeca: { giro: 0.3, incl: 0.1 }, luz: LUZ.rua }, 'pedestre2');
  carro(c, 300, 900, 0.9, '#7a2a24', 1); carro(c, 1250, 990, 0.95, '#a4a8ad', -1);
  c.restore();
}
function inventario(c, t, d, info) {
  const f0 = tf(info, 7) - tf(info, 5);
  c.fillStyle = '#2c2018'; c.fillRect(0, 0, W, H);
  c.save(); camera(c, 1.0 + t * 0.012, 960, 540, -0.01);
  for (let i = 0; i < 12; i++) { c.fillStyle = `rgba(0,0,0,${0.08 + (i % 2) * 0.05})`; c.fillRect(0, i * 90, W, 4); }
  const ap = k => easeOut(clamp((t - (tf(info, k) - tf(info, 5))) / 0.4));
  const item = (k, fn, label, lx, ly) => { const a = ap(k); if (a <= 0) return; c.save(); c.globalAlpha = a; c.translate(0, (1 - a) * -20); fn(); c.restore(); c.save(); c.globalAlpha = a; c.font = '600 30px Inter'; c.fillStyle = PAL.texto; c.fillText(label, lx, ly); c.restore(); };
  item(7, () => { for (let i = 0; i < 3; i++) garrafa(c, 300 + i * 90, 460, 1.4); }, '6 L DE ÁGUA', 250, 540);
  item(8, () => { c.fillStyle = '#e8e0c8'; rr(c, 700, 300, 160, 200, 10); c.fill(); c.fillStyle = '#8a3a2a'; rr(c, 880, 330, 130, 170, 10); c.fill(); [0, 1, 2].forEach(i => { c.fillStyle = '#9aa0a6'; c.beginPath(); c.ellipse(1060 + i * 70, 470, 32, 32, 0, 0, 7); c.fill(); }); }, 'COMIDA PARA ~4 DIAS', 720, 560);
  item(9, () => { for (let i = 0; i < 8; i++) { c.fillStyle = '#c9a43a'; rr(c, 300 + i * 40, 700, 28, 70, 5); c.fill(); c.fillStyle = '#222'; c.fillRect(300 + i * 40, 700, 28, 12); } }, '8 PILHAS', 300, 820);
  item(9, () => { c.fillStyle = '#333'; rr(c, 700, 700, 190, 56, 14); c.fill(); c.fillStyle = '#ddd'; c.beginPath(); c.arc(890, 728, 26, 0, 7); c.fill(); }, 'LANTERNA', 700, 820);
  item(9, () => { c.fillStyle = '#e6e6ea'; rr(c, 1000, 690, 120, 80, 10); c.fill(); c.fillStyle = '#b02a2a'; c.fillRect(1040, 700, 40, 60); }, 'REMÉDIOS', 1000, 820);
  item(9, () => { c.fillStyle = '#6a8a7a'; c.save(); c.translate(1300, 720); c.rotate(-0.1); rr(c, 0, 0, 240, 110, 6); c.fill(); c.fillStyle = '#8aa0c0'; rr(c, 30, -30, 240, 110, 6); c.fill(); c.restore(); }, 'R$ 85', 1340, 880);
  c.restore();
  textoGrande(c, t, ['INVENTÁRIO'], { y: 150, tam: 70 });
}
function estrelas(c, t) {
  c.fillStyle = vgrad(c, 0, H, [[0, '#02030a'], [1, '#0d1424']]); c.fillRect(0, 0, W, H);
  c.save(); camera(c, 1.0, 960 + t * 25, 600 - t * 10);
  c.fillStyle = 'rgba(180,190,230,0.06)'; c.save(); c.rotate(-0.5); c.beginPath(); c.ellipse(700, 900, 1300, 160, 0, 0, 7); c.fill(); c.restore();
  particulas(c, t, 500, 21, { area: [-200, -200, W + 600, 1300], cor: '#eef2ff', tam: [0.5, 2.0], vel: [0, 0, 0, 0], brilho: 0.9 });
  c.restore();
  skyline(c, 200, 1080, 260, '#020306');
}
function lucasJanelaNoite(c, t, d, {dia = 1, sorriso = 0, push = 0.02} = {}) {
  c.save(); camera(c, 1.05 + t * push, 1180, 500);
  sala(c, t, { tv: false }); janelaNoite(c, 1260, 160, 520, 600, t);
  desenharPessoa(c, L(1120, 684, { _t: t, dia, bracoF: [0.3, 0.6], cabeca: { giro: 0.85, incl: -0.12 }, luz: LUZ.noite }));
  escuridao(c, 0.4, [{ x: 1520, y: 400, r: 800, forca: 0.7 }, { x: 1120, y: 420, r: 500, forca: 0.5 }], '2,4,14');
  c.restore();
}
ROTEIRO[1] = [
  seq(['f0', AB(1)], ['f1', AB(2)], ['f2', AB(3)], ['f4', AB(4)], ['f6', AB(5)], ['f7', AB(6)], ['f8', AB(7)], ['f8+2.8', AB(8)]),
  seq(['f0', AB(9)], ['f1', AB(10)], ['f2', AB(11)], ['f3', AB(12)], ['f5', AB(13)], ['f6', AB(14)], ['f7', AB(15)]),
  seq(['f0', ligacao], ['f4', (c, t) => { c.save(); camera(c, 1, 600 + t * 120, 540); corredor(c, t); const w = caminhada(t * 0.9); desenharPessoa(c, { x: 1000 - t * 260, y: 590 + w.bob, s: 0.88, dir: -1, ...w, bob: 0, cabeca: { giro: 0.5 }, luz: LUZ.dia }); c.restore(); }],
      ['f5', (c, t, d) => escadaDescendo(c, t, d)]),
  seq(['f0', (c, t) => ruaCalcada(c, t)], ['f1', padaria], ['f3', posto], ['f5', inventario]),
  seq(['f0', (c, t) => { c.save(); camera(c, 1.0 + t * 0.01, 960, 520); cidadeNoite(c, t, { acender: 0 }); c.restore(); }], ['f1', estrelas], ['f2', (c, t, d) => lucasJanelaNoite(c, t, d)],
      ['f4', (c, t) => { c.save(); camera(c, 1.0 + t * 0.06, 960, 520); cidadeNoite(c, t, { acender: 0, seed: 210 }); c.restore(); c.fillStyle = `rgba(0,0,0,${0.5 * sstep(0, 4, t)})`; c.fillRect(0, 0, W, H); }]),
];

// ================= CAP 2 — DIA 2 — A ÁGUA PARA =================
function torneira(c, t, d, info) {
  const fluxo = t < tf(info, 1) ? 1 : t < tf(info, 2) ? 0.5 : t < tf(info, 3) ? 0.15 : Math.max(0, 0.15 - (t - tf(info, 3)) * 0.3);
  c.fillStyle = vgrad(c, 0, H, [[0, '#1d2328'], [1, '#121518']]); c.fillRect(0, 0, W, H);
  c.save(); camera(c, 1.0 + t * 0.01, 960, 540);
  for (let i = 0; i < 9; i++) for (let j = 0; j < 4; j++) { c.strokeStyle = 'rgba(255,255,255,0.04)'; c.lineWidth = 3; c.strokeRect(i * 220, j * 220 - 120, 220, 220); }
  c.fillStyle = '#9aa0a5'; rr(c, 760, 120, 60, 260, 20); c.fill(); rr(c, 760, 120, 420, 70, 30); c.fill(); rr(c, 1120, 160, 70, 120, 20); c.fill();
  c.fillStyle = '#c0c5ca'; rr(c, 600, 160, 200, 40, 16); c.fill();
  if (fluxo > 0.02) { const w = 6 + 40 * fluxo; c.fillStyle = 'rgba(170,210,240,0.55)'; c.fillRect(1155 - w / 2, 280, w, 560); c.fillStyle = 'rgba(255,255,255,0.35)'; c.fillRect(1155 - w / 4, 280, w / 4, 560); }
  else { const g = ((t * 1.3) % 1); c.fillStyle = 'rgba(170,210,240,0.7)'; if (t - tf(info, 3) < 2.5) { c.beginPath(); c.ellipse(1155, 290 + g * g * 560, 7, 10, 0, 0, 7); c.fill(); } }
  c.fillStyle = '#6d7276'; rr(c, 700, 840, 900, 120, 30); c.fill(); c.fillStyle = '#3a3f44'; c.beginPath(); c.ellipse(1150, 860, 300, 40, 0, 0, 7); c.fill();
  c.fillStyle = VISUAIS.lucas.pele; c.beginPath(); c.ellipse(640, 190, 70, 46, -0.2, 0, 7); c.fill();
  c.restore();
}
function chuveiro(c, t) {
  c.fillStyle = vgrad(c, 0, H, [[0, '#2a3036'], [1, '#161a1e']]); c.fillRect(0, 0, W, H);
  for (let i = 0; i < 12; i++) for (let j = 0; j < 7; j++) { c.strokeStyle = 'rgba(255,255,255,0.05)'; c.lineWidth = 3; c.strokeRect(i * 170, j * 170, 170, 170); }
  c.save(); camera(c, 1.0 + t * 0.03, 960, 500);
  c.fillStyle = '#9aa0a5'; c.fillRect(940, 0, 30, 260); rr(c, 820, 240, 270, 70, 30); c.fill();
  c.fillStyle = '#5a6066'; for (let i = 0; i < 12; i++) { c.beginPath(); c.arc(860 + i * 18, 300, 4, 0, 7); c.fill(); }
  const g = clamp((t - 1.0) / 1.2); if (g > 0 && g < 1) { c.fillStyle = 'rgba(170,210,240,0.8)'; c.beginPath(); c.ellipse(955, 310 + g * g * 700, 8, 12, 0, 0, 7); c.fill(); }
  c.restore();
}
function rostoLucas(c, t, d, {dia = 2, expr = 'preocupado', luz = LUZ.dia, fundo = '#1b2026', giro = 0.2, incl = 0} = {}) {
  c.fillStyle = fundo; c.fillRect(0, 0, W, H);
  c.fillStyle = rgrad(c, 400, 300, 0, 1200, [[0, 'rgba(150,170,200,0.15)'], [1, 'rgba(0,0,0,0)']]); c.fillRect(0, 0, W, H);
  desenharPessoa(c, { x: 900 + t * 6, y: 1190, s: 2.6, dir: 1, dia, semPernas: true, cabeca: { giro, incl }, expr, piscar: piscar(t), olhar: Math.sin(t * 0.6) * 0.6, luz });
}
function diagramaAgua(c, t, d, info) {
  c.fillStyle = '#0b0e13'; c.fillRect(0, 0, W, H);
  c.save(); camera(c, 1.0 + t * 0.01, 960, 540);
  const bomba = t < tf(info, 2), nivel = t < tf(info, 3) ? 1 : Math.max(0.05, 1 - (t - tf(info, 3)) / 2.5);
  c.strokeStyle = 'rgba(200,210,220,0.5)'; c.lineWidth = 3; c.strokeRect(700, 160, 520, 760);
  for (let k = 0; k < 10; k++) { c.strokeStyle = 'rgba(200,210,220,0.2)'; c.beginPath(); c.moveTo(700, 920 - k * 70); c.lineTo(1220, 920 - k * 70); c.stroke(); for (let j = 0; j < 5; j++) { c.fillStyle = 'rgba(200,210,220,0.12)'; c.fillRect(720 + j * 100, 900 - k * 70 - 50, 70, 40); } }
  c.fillStyle = '#2a2f36'; c.fillRect(800, 60, 320, 100); c.fillStyle = '#3a8ad0'; c.fillRect(806, 160 - 94 * nivel, 308, 94 * nivel);
  c.strokeStyle = '#3a8ad0'; c.lineWidth = 14; c.beginPath(); c.moveTo(200, 980); c.lineTo(600, 980); c.lineTo(600, 110); c.lineTo(800, 110); c.stroke();
  if (bomba) { c.strokeStyle = 'rgba(200,235,255,0.9)'; c.lineWidth = 6; c.setLineDash([20, 40]); c.lineDashOffset = -t * 160; c.beginPath(); c.moveTo(200, 980); c.lineTo(600, 980); c.lineTo(600, 110); c.lineTo(800, 110); c.stroke(); c.setLineDash([]); }
  c.fillStyle = bomba ? '#3a8a5a' : '#8e1b1b'; rr(c, 540, 900, 120, 90, 10); c.fill(); c.font = '600 26px Inter'; c.fillStyle = PAL.texto; c.textAlign = 'center'; c.fillText('BOMBA', 600, 1030); c.fillText(bomba ? 'LIGADA' : 'PARADA', 600, 1062);
  c.fillText('CAIXA D’ÁGUA', 960, 40); c.font = '400 26px Inter'; c.fillText('50 APARTAMENTOS', 960, 960); c.textAlign = 'left';
  c.restore();
}
function garrafasPia(c, t) { c.save(); camera(c, 1.6 + t * 0.03, 420, 560); cozinha(c, t); for (let i = 0; i < 3; i++) garrafa(c, 160 + i * 70, 600, 1.0, 1); c.restore(); }
function jorgePorta(c, t) {
  c.save(); camera(c, 1.1, PORTA_X(91) + 300, 520); corredor(c, t, { portaAberta: '91' });
  desenharPessoa(c, { x: PORTA_X(91) + 520, y: 590, s: 0.9, dir: -1, bracoF: [1.0, 0.8 + 0.2 * Math.sin(t * 3)], cabeca: { giro: 0.4 }, boca: falar(t, 1, 2), piscar: piscar(t, 2), luz: LUZ.diaD }, 'jorge');
  desenharPessoa(c, { x: PORTA_X(91) + 120, y: 590, s: 0.88, dir: 1, dia: 2, cabeca: { giro: 0.5 }, piscar: piscar(t, 1), luz: LUZ.dia });
  c.restore(); rotulo(c, t, 'SEU JORGE  ·  SÍNDICO', 90, 980);
}
function caminhaoPipa(c, x, y, s = 1) {
  c.save(); c.translate(x, y); c.scale(s, s);
  c.fillStyle = '#d8d6d0'; c.beginPath(); c.ellipse(-120, -170, 300, 110, 0, 0, 7); c.fill(); c.fillStyle = '#2a6aa0'; c.fillRect(-420, -190, 600, 30);
  c.font = '700 40px Oswald'; c.fillStyle = '#1a2a40'; c.fillText('ÁGUA POTÁVEL', -280, -210);
  c.fillStyle = '#e8e4d8'; rr(c, 190, -260, 170, 220, 14); c.fill(); c.fillStyle = '#1a2028'; c.fillRect(250, -240, 90, 70);
  c.fillStyle = '#111'; [-320, -150, 260].forEach(wx => { c.beginPath(); c.arc(wx, -30, 40, 0, 7); c.fill(); });
  c.fillStyle = '#555'; c.fillRect(-440, -110, 40, 26); c.restore();
}
function filaPipa(c, t) {
  c.save(); camera(c, 1.0, 900 + t * 40, 540);
  ceuNublado(c, t, -200, 480); skyline(c, 41, 520, 420, '#6d7378');
  c.fillStyle = '#2b2c2e'; c.fillRect(-600, 520, 3600, 700);
  caminhaoPipa(c, 1500, 820, 1.1);
  fila(c, t, 960, 840, 22, 66, 0.44, 4, -1);
  fila(c, t, 1960, 960, 18, 72, 0.5, 9, 1, { dir: -1 });
  c.restore();
}
function torneiraPipa(c, t, d) {
  c.fillStyle = '#5a5e62'; c.fillRect(0, 0, W, H);
  c.save(); camera(c, 1.0 + t * 0.02, 960, 540);
  c.fillStyle = '#d8d6d0'; c.fillRect(0, 0, W, 420); c.fillStyle = '#2a6aa0'; c.fillRect(0, 360, W, 40);
  c.fillStyle = '#4a4d50'; rr(c, 860, 400, 80, 160, 10); c.fill(); c.fillStyle = 'rgba(170,210,240,0.6)'; c.fillRect(885, 560, 30, 300);
  balde(c, 900, 830, 1, '#8a2f2f'); c.restore();
  placa(c, 1450, 260, '20 LITROS POR PESSOA', { tam: 50, fundo: '#f3e9c8', cor: '#1a2a40', ang: 0.03 });
}
function escadaBaldes(c, t, d, info, {inicio = 1, sentado = 0, dia = 2} = {}) {
  const andar = inicio; const s = 0.95;
  c.save(); camera(c, 1.05, 900, 560);
  escada(c, t, andar, { janela: 1 });
  if (sentado) {
    const [fx, fy] = noDegrau(0.25);
    desenharPessoa(c, { x: fx + 40, y: fy - 150, s, dir: 1, dia, tronco: 0.35 + 0.05 * Math.sin(t * 3.2), pernaF: [1.2, -1.6], pernaT: [1.1, -1.5], pePlano: true, bracoF: [0.4, 0.8], bracoT: [0.3, 0.6], cabeca: { giro: 0.3, incl: 0.25 }, boca: 0.3 + 0.3 * Math.abs(Math.sin(t * 3.2)), expr: 'preocupado', luz: LUZ.dia });
    balde(c, fx + 200, fy - 70, 1); balde(c, fx - 120, fy + 10, 1, '#8a2f2f');
  } else {
    const u = clamp(t / Math.max(d, 1) * 0.9 + 0.05), [fx, fy] = noDegrau(u), w = caminhada(t * 0.75, 0.75);
    const tremor = (andar >= 3 ? 1 : 0) * Math.sin(t * 40) * 0.03;
    desenharPessoa(c, { x: fx, y: fy - 270 * s + w.bob, s, dir: 1, ...w, bob: 0, dia, tronco: 0.16, bracoF: [0.05 + tremor, 0.05], bracoT: [-0.05 - tremor, 0.05], cabeca: { giro: 0.5, incl: 0.1 }, expr: andar >= 3 ? 'preocupado' : '', boca: andar >= 3 ? 0.4 : 0,
      objeto: segBalde('#2f5f8a'), objetoT: segBalde('#8a2f2f'), luz: LUZ.dia });
  }
  c.restore();
}
function mesaTres(c, t, d, info) {
  c.fillStyle = '#0c0a08'; c.fillRect(0, 0, W, H);
  c.save(); camera(c, 1.0 + t * 0.01, 960, 560);
  mesa(c, 960, 700, 1500); vela(c, 960, 700, t, 1.2);
  const rot = ['BEBER', 'COZINHAR', 'HIGIENE'];
  [520, 960, 1400].forEach((x, i) => { const a = sstep(tf(info, i + 1) - 0.1, tf(info, i + 1) + 0.3, t); if (a <= 0) return; c.save(); c.globalAlpha = a; i === 1 ? galao(c, x, 700, 1.3) : garrafa(c, x + (i ? 0 : 0), 700, 1.5, i === 2 ? 0.3 : 1); c.font = '700 40px Oswald'; c.fillStyle = '#f2d9b0'; c.textAlign = 'center'; c.fillText(rot[i], x, 800); c.restore(); });
  escuridao(c, 0.8, [fonteVela(960, 700, t, 900)]);
  c.restore();
}
function gota(c, t) {
  c.fillStyle = '#05070b'; c.fillRect(0, 0, W, H);
  const g = (t * 0.6) % 1.4;
  c.fillStyle = rgrad(c, 960, 540, 0, 500, [[0, 'rgba(60,120,180,0.25)'], [1, 'rgba(0,0,0,0)']]); c.fillRect(0, 0, W, H);
  if (g < 1) { c.fillStyle = 'rgba(160,210,250,0.9)'; c.beginPath(); c.ellipse(960, 100 + g * g * 700, 22, 30, 0, 0, 7); c.fill(); c.fillStyle = 'rgba(255,255,255,0.7)'; c.beginPath(); c.ellipse(952, 90 + g * g * 700, 6, 9, 0, 0, 7); c.fill(); }
  else { const r = (g - 1) * 900; c.strokeStyle = `rgba(160,210,250,${1 - (g - 1) / 0.4})`; c.lineWidth = 3; c.beginPath(); c.ellipse(960, 820, r, r * 0.18, 0, 0, 7); c.stroke(); }
  c.fillStyle = 'rgba(40,70,100,0.5)'; c.fillRect(0, 820, W, 260);
}
ROTEIRO[2] = [
  seq(['f0', torneira], ['f4', chuveiro], ['f6', (c, t, d) => rostoLucas(c, t, d, { dia: 2 })]),
  seq(['f0', diagramaAgua], ['f4', garrafasPia]),
  seq(['f0', jorgePorta], ['f1', filaPipa], ['f3', torneiraPipa], ['f4', (c, t) => { c.save(); camera(c, 1.25, 1400, 600); ceuNublado(c, t, -200, 480); c.fillStyle = '#2b2c2e'; c.fillRect(-600, 520, 3600, 700); caminhaoPipa(c, 1500, 820, 1.1); desenharPessoa(c, { x: 1020, y: 640, s: 0.62, dir: 1, bracoF: [0.6, 0.9 + 0.2 * Math.sin(t * 3)], boca: falar(t, 1, 5), cabeca: { giro: -0.2 }, luz: LUZ.rua }, 'morador7'); fila(c, t, 960, 840, 8, 66, 0.44, 4, -1); c.restore(); }]),
  seq(['f0', (c, t, d, i) => escadaBaldes(c, t, d, i, { inicio: 1 })], ['f2', (c, t, d, i) => escadaBaldes(c, t, d, i, { inicio: 3 })], ['f3', (c, t, d, i) => escadaBaldes(c, t, d, i, { inicio: 6, sentado: 1 })],
      ['f4', (c, t, d, i) => { c.save(); camera(c, 1.15, PORTA_X(91) + 200, 520); corredor(c, t); desenharPessoa(c, { x: PORTA_X(91) - 200 + Math.min(t, 2.2) * 160, y: 590, s: 0.88, dir: 1, dia: 2, ...caminhada(t * 0.7, t < 2.2 ? 0.7 : 0), bob: 0, tronco: 0.14, bracoF: [0.05, 0.05], bracoT: [-0.05, 0.05], objeto: segBalde('#2f5f8a'), objetoT: segBalde('#8a2f2f'), boca: 0.5, expr: 'preocupado', cabeca: { giro: 0.5, incl: 0.15 }, luz: LUZ.dia }); c.fillStyle = 'rgba(80,110,140,0.18)'; c.beginPath(); c.ellipse(PORTA_X(91) - 80 + Math.min(t, 2.2) * 160, 470, 40, 90, 0, 0, 7); c.fill(); c.restore(); }]),
  seq(['f0', mesaTres], ['f4', gota], ['f5', (c, t, d) => lucasJanelaNoite(c, t, d, { dia: 2 })]),
];

// ================= CAP 3 — DIA 3 — SILÊNCIO =================
function celularMensagem(c, t, d, info) {
  const fundo = buf('fundoSala'), fc = fundo.getContext('2d'); fc.setTransform(1, 0, 0, 1, 0, 0); fc.save(); camera(fc, 1.3, 900, 500); sala(fc, t, { tv: true }); fc.restore();
  c.filter = 'blur(14px)'; c.drawImage(fundo, 0, 0); c.filter = 'none'; c.fillStyle = 'rgba(5,8,14,0.45)'; c.fillRect(0, 0, W, H);
  const morre = t > tf(info, 4) + 0.6;
  const msg = 'Estou bem. Me liga quando puder.', prog = clamp((t - tf(info, 1)) / Math.max(tf(info, 4) - tf(info, 1), 1));
  const [hx, hy, hr] = handheld(t, 4);
  c.save(); camera(c, 1.05 + t * 0.01, 960 + hx, 560 + hy, hr - 0.04);
  maoCelular(c, t, (k, x, y, w, h) => {
    if (morre) { k.fillStyle = '#000'; k.fillRect(x, y, w, h); k.fillStyle = 'rgba(255,255,255,0.05)'; k.beginPath(); k.ellipse(x + w * 0.4, y + h * 0.35, 120, 160, 0.3, 0, 7); k.fill(); return; }
    k.fillStyle = '#e8e4dc'; k.font = '600 24px Inter'; k.fillText('Mãe', x + 150, y + 80);
    k.fillStyle = Math.floor(t * 2) % 2 ? '#e0574f' : '#7a2a24'; rr(k, x + w - 64, y + 20, 34, 16, 3); k.fill(); k.font = '600 18px Inter'; k.fillText('1%', x + w - 110, y + 34);
    k.fillStyle = '#1f6f5a'; rr(k, x + 40, y + h - 300, w - 80, 90, 18); k.fill();
    k.fillStyle = '#f0ece4'; k.font = '400 25px Inter'; const txt = msg.slice(0, Math.floor(msg.length * prog));
    k.fillText(txt.slice(0, 18), x + 60, y + h - 262); k.fillText(txt.slice(18), x + 60, y + h - 230);
    if (Math.floor(t * 2.5) % 2) { k.fillRect(x + 60 + k.measureText(txt.length > 18 ? txt.slice(18) : txt).width + 2, y + h - (txt.length > 18 ? 248 : 280), 2, 28); }
    k.fillStyle = '#2a2f36'; rr(k, x + 20, y + h - 180, w - 40, 160, 10); k.fill();
  }, { toque: [1.2, 1.6, 2.0, 2.4, 2.8, 3.2].map(p => tf(info, 1) + p) });
  c.restore();
  if (morre) { c.fillStyle = `rgba(0,0,0,${0.3 * sstep(0, 2, t - tf(info, 4))})`; c.fillRect(0, 0, W, H); }
}
function torreCelular(c, t) {
  c.save(); camera(c, 1.0 + t * 0.02, 960, 540); ceuNublado(c, t, -200, 900); skyline(c, 300, 1100, 500, '#5d6369');
  c.fillStyle = '#4a4b4c'; c.fillRect(600, 700, 800, 500);
  c.strokeStyle = '#2a2b2d'; c.lineWidth = 10; c.beginPath(); c.moveTo(1000, 700); c.lineTo(1000, 120); c.stroke();
  [200, 320, 440].forEach(y => { c.fillStyle = '#d6d4cf'; [-1, 1].forEach(s => rr(c, 1000 + s * 30 - 12, y, 24, 90, 6) || c.fill()); });
  const on = t < 1.6 && Math.floor(t * 2) % 2 === 0; c.fillStyle = on ? '#ff3a2a' : '#3a1a18'; c.beginPath(); c.arc(1000, 110, 12, 0, 7); c.fill();
  if (on) { c.fillStyle = rgrad(c, 1000, 110, 0, 60, [[0, 'rgba(255,60,40,0.5)'], [1, 'rgba(255,60,40,0)']]); c.fillRect(940, 50, 120, 120); }
  c.restore();
}
function salaEscuraSentado(c, t, d, {dia = 3, objeto = 'celular', fala = 0, quem = null} = {}) {
  c.save(); camera(c, 1.05 + t * 0.01, 900, 560); sala(c, t); sofa(c);
  desenharPessoa(c, { x: 640, y: 690, s: 1, dir: 1, dia, tronco: 0.12, pernaF: [1.5, -1.45], pernaT: [1.42, -1.4], pePlano: true, bracoF: [0.9, 0.9], bracoT: [0.7, 1.0], cabeca: { giro: 0.6, incl: 0.25 }, expr: 'preocupado', piscar: piscar(t), luz: LUZ.diaD,
    objeto: objeto === 'celular' ? (k, x, y) => { k.fillStyle = '#0a0a0a'; rr(k, x - 10, y - 30, 22, 44, 5); k.fill(); } : null });
  sofaBraco(c); escuridao(c, 0.5, [{ x: 1500, y: 300, r: 900, forca: 0.6 }]); c.restore();
}
function armario(c, t) {
  c.save(); camera(c, 1.1, 1000, 520); quarto(c, t);
  c.fillStyle = '#3a2b20'; c.fillRect(1100, 160, 600, 820); c.fillStyle = '#120d0a'; c.fillRect(1120, 180, 560, 780);
  c.fillStyle = '#2a1f17'; c.fillRect(1100 + 600 * (1 - sstep(0, 0.8, t) * 0.0), 160, 20, 820);
  for (let i = 0; i < 4; i++) { c.fillStyle = '#4a3a2c'; c.fillRect(1130 + i * 120, 220, 90, 300); }
  c.fillStyle = '#7a5a3a'; const by = 880 - sstep(1.0, 2.0, t) * 120; rr(c, 1300, by, 220, 100, 6); c.fill();
  desenharPessoa(c, { x: 980, y: 684, s: 1, dir: 1, dia: 3, tronco: 0.25 - sstep(1.0, 2.0, t) * 0.2, bracoF: [1.0 + sstep(1.0, 2.0, t) * 0.2, 0.3], bracoT: [0.9, 0.4], cabeca: { giro: 0.7, incl: 0.2 }, luz: LUZ.dia });
  c.restore();
}
function radioClose(c, t, d, {ligado = 0, pilhas = 0, onda = 0} = {}) {
  c.fillStyle = '#0d0a08'; c.fillRect(0, 0, W, H);
  c.save(); camera(c, 1.0 + t * 0.015, 960, 560); mesa(c, 960, 760, 1600, '#3a2a1d');
  radio(c, 960, 640, 2.0, ligado, t);
  if (pilhas) { const p = sstep(0, 1.2, t); c.fillStyle = '#c9a43a'; [0, 1].forEach(i => { rr(c, 1380 + i * 70, 820 - (1 - p) * 120, 50, 120, 8); c.fill(); }); }
  c.restore();
  if (onda) { c.save(); c.strokeStyle = onda > 1 ? 'rgba(255,210,140,0.8)' : 'rgba(220,220,220,0.5)'; c.lineWidth = 3; c.beginPath();
    for (let x = 0; x < W; x += 6) { const a = onda > 1 ? Math.sin(x * 0.02 + t * 8) * 40 * (0.5 + 0.5 * noise1(x * 0.01 + t * 3)) : (hash(x + Math.floor(t * 30) * 997) - 0.5) * 80; c.lineTo(x, 980 + a); } c.stroke(); c.restore(); }
}
function lucasRadioMesa(c, t, {dia = 3, noite = 0} = {}) {
  c.save(); camera(c, 1.1 + t * 0.01, 960, 560); sala(c, t, { tv: false });
  mesa(c, 1150, 720, 640); radio(c, 1250, 650, 0.6, 1, t);
  desenharPessoa(c, { x: 820, y: 700, s: 1, dir: 1, dia, tronco: 0.25, pernaF: [1.5, -1.45], pernaT: [1.4, -1.4], pePlano: true, bracoF: [1.2, 0.8], bracoT: [1.1, 0.9], cabeca: { giro: 0.8, incl: 0.12 }, expr: 'preocupado', piscar: piscar(t), luz: noite ? LUZ.vela : LUZ.diaD });
  if (noite) { vela(c, 1020, 720, t); escuridao(c, 0.85, [fonteVela(1020, 720, t, 800)]); }
  c.restore();
}
function escadaPaula(c, t) {
  c.save(); camera(c, 1.25, 820, 520); escada(c, t, 8);
  const [fx, fy] = noDegrau(0.18), [lx, ly] = noDegrau(0.48);
  desenharPessoa(c, { x: fx, y: fy - 260, s: 0.95, dir: 1, cabeca: { giro: 0.6, incl: -0.08 }, boca: falar(t, 1, 3), piscar: piscar(t, 3), bracoF: [0.5, 0.9 + 0.15 * Math.sin(t * 2)], luz: LUZ.dia, objetoT: (k, x, y) => { k.fillStyle = '#2a3a4a'; rr(k, x - 30, y - 10, 60, 70, 8); k.fill(); } }, 'paula');
  desenharPessoa(c, { x: lx + 40, y: ly - 262, s: 0.95, dir: -1, dia: 3, cabeca: { giro: 0.6, incl: 0.1 }, piscar: piscar(t, 1), luz: LUZ.dia });
  c.restore(); rotulo(c, t, 'PAULA  ·  ENFERMEIRA  ·  8º ANDAR');
}
function batePorta(c, t, d, info, {porta = 94, dia = 3, batidas = []} = {}) {
  const x = PORTA_X(porta);
  c.save(); camera(c, 1.2 + t * 0.01, x + 100, 520); corredor(c, t);
  const b = batidas.reduce((s, p) => s + (t > p && t < p + 0.7 ? Math.abs(Math.sin((t - p) * 14)) : 0), 0);
  desenharPessoa(c, { x: x - 130, y: 590, s: 0.9, dir: 1, dia, bracoF: [1.25, 0.9 - b * 0.4], cabeca: { giro: 0.7, incl: 0.04 }, piscar: piscar(t), luz: LUZ.dia });
  c.restore();
}
ROTEIRO[3] = [
  seq(['f0', celularMensagem]),
  seq(['f0', torreCelular], ['f1', (c, t, d) => salaEscuraSentado(c, t, d)], ['f3', armario], ['f4', (c, t, d) => radioClose(c, t, d)]),
  seq(['f0', (c, t, d) => radioClose(c, t, d, { pilhas: 1 })], ['f1', (c, t, d) => radioClose(c, t, d, { ligado: 1, onda: 1 })], ['f3', (c, t, d) => radioClose(c, t, d, { ligado: 1, onda: 2 })],
      ['f4', (c, t) => lucasRadioMesa(c, t)], ['f5', AB(14)], ['f8', (c, t) => { c.fillStyle = '#060607'; c.fillRect(0, 0, W, H); textoGrande(c, t, ['PREVISÃO:', 'SEMANAS'], { tam: 140, y: 400 }); }]),
  seq(['f0', escadaPaula], ['f2', (c, t) => { c.save(); camera(c, 1.0 + t * 0.02, 960, 540); unidadeSaude(c, t); c.restore(); rotulo(c, t, 'HOSPITAL  ·  GERADOR A DIESEL'); }],
      ['f3', (c, t) => { c.save(); camera(c, 1.6, 900, 380); escada(c, t, 8); const [fx, fy] = noDegrau(0.18), [lx, ly] = noDegrau(0.48);
        desenharPessoa(c, { x: fx, y: fy - 260, s: 0.95, dir: 1, cabeca: { giro: 0.5, incl: -0.1 }, boca: falar(t, 1, 4), expr: 'preocupado', bracoF: [0.9, 1.2], luz: LUZ.dia }, 'paula');
        desenharPessoa(c, { x: lx + 40, y: ly - 262, s: 0.95, dir: -1, dia: 3, cabeca: { giro: 0.6, incl: 0.1 }, piscar: piscar(t, 2), luz: LUZ.dia }); c.restore(); }]),
  seq(['f0', (c, t, d, i) => batePorta(c, t, d, i, { batidas: [0.2, tf(i, 2) + 0.1] })],
      ['f4', (c, t) => { c.save(); camera(c, 1.0, PORTA_X(93), 520); corredor(c, t); const w = caminhada(t * 0.8); desenharPessoa(c, { x: PORTA_X(94) - 150 - t * 230, y: 590 + w.bob, s: 0.88, dir: -1, dia: 3, ...w, bob: 0, cabeca: { giro: 0.5 }, luz: LUZ.dia }); c.restore(); }],
      ['f6', (c, t) => { c.save(); camera(c, 1.3 + t * 0.06, PORTA_X(94) + 85, 560); corredor(c, t); c.restore(); c.fillStyle = 'rgba(10,0,0,0.25)'; c.fillRect(0, 0, W, H); c.fillStyle = `rgba(0,0,0,${0.4 * sstep(0, 4, t)})`; c.fillRect(0, 0, W, H); }]),
];

// ================= CAP 4 — DIA 5 — A GELADEIRA =================
function geladeiraPodre(c, t, d, info) {
  const passo = sstep(tf(info, 1) + 0.5, tf(info, 1) + 1.1, t);
  c.save(); camera(c, 1.0 + t * 0.01, 1060, 560); cozinha(c, t); geladeiraAberta(c, t, 1);
  desenharPessoa(c, { x: 860 - passo * 110, y: 684, s: 1, dir: 1, dia: 5, tronco: -0.1 * passo, bracoF: [lerp(1.3, 1.9, passo), lerp(0.2, 2.3, passo)], cabeca: { giro: 0.7, incl: -0.1 * passo }, expr: 'preocupado', boca: passo * 0.3, luz: LUZ.dia });
  c.restore();
}
function lixoSaco(c, t) {
  c.fillStyle = '#16120e'; c.fillRect(0, 0, W, H);
  c.save(); camera(c, 1.0 + t * 0.02, 960, 560);
  c.fillStyle = '#1a1a1c'; c.beginPath(); c.moveTo(620, 1000); c.quadraticCurveTo(560, 600, 800, 480); c.lineTo(1120, 480); c.quadraticCurveTo(1360, 600, 1300, 1000); c.fill();
  c.fillStyle = 'rgba(255,255,255,0.08)'; c.beginPath(); c.ellipse(800, 650, 60, 140, 0.2, 0, 7); c.fill();
  const amarra = sstep(0.5, 1.6, t); c.fillStyle = '#1a1a1c'; c.beginPath(); c.moveTo(800, 480); c.lineTo(960 - 40 * amarra, 300); c.lineTo(960 + 40 * amarra, 300); c.lineTo(1120, 480); c.fill();
  c.fillStyle = VISUAIS.lucas.pele; c.beginPath(); c.ellipse(900, 300 + amarra * 20, 60, 40, 0.4, 0, 7); c.fill(); c.beginPath(); c.ellipse(1020, 300 + amarra * 20, 60, 40, -0.4, 0, 7); c.fill();
  particulas(c, t, 10, 5, { area: [600, 200, 700, 500], cor: '#0a0a0a', tam: [2, 3], vel: [-50, 50, -30, 30], brilho: 1 });
  c.restore();
}
function mesaCabisbaixo(c, t, {dia = 5} = {}) {
  c.save(); camera(c, 1.15 + t * 0.01, 1640, 520); cozinha(c, t); mesa(c, 1780, 720, 500, '#4a3a2a');
  desenharPessoa(c, { x: 1580, y: 700, s: 1, dir: 1, dia, tronco: 0.45, pernaF: [1.5, -1.45], pernaT: [1.4, -1.4], pePlano: true, bracoF: [1.6, 1.8], bracoT: [1.3, 1.2], cabeca: { giro: 0.5, incl: 0.35 }, expr: 'preocupado', piscar: piscar(t), luz: LUZ.dia });
  c.restore();
}
function despensa(c, t, {itens = ['ARROZ', 'FEIJÃO', 'MACARRÃO', 'LATAS'], qtd = 1, titulo = null} = {}) {
  c.fillStyle = '#1e1a16'; c.fillRect(0, 0, W, H);
  c.save(); camera(c, 1.0 + t * 0.015, 960, 540);
  c.fillStyle = '#4a3a2c'; c.fillRect(260, 120, 1400, 860); c.fillStyle = '#1a140f'; c.fillRect(290, 150, 1340, 800);
  for (let s = 0; s < 3; s++) { c.fillStyle = '#6a5240'; c.fillRect(290, 400 + s * 260, 1340, 18); }
  const cores = { ARROZ: '#e8e0c8', 'FEIJÃO': '#7a3a2a', 'MACARRÃO': '#d8b040', LATAS: '#9aa0a6', SARDINHA: '#5a7a9a', 'ÓLEO': '#d8c040' };
  itens.forEach((n, i) => { const sx = 340 + (i % 4) * 330, sy = 400 + Math.floor(i / 4) * 260, k = Math.max(1, Math.round(4 * qtd));
    for (let j = 0; j < k; j++) { c.fillStyle = cores[n] || '#aaa'; if (n === 'LATAS' || n === 'SARDINHA') { rr(c, sx + j * 60, sy - 80, 50, 80, 8); } else rr(c, sx + j * 62, sy - 150, 56, 150, 6); c.fill(); }
    c.font = '600 26px Inter'; c.fillStyle = PAL.texto; c.fillText(n, sx, sy + 50); });
  c.restore();
  if (titulo) textoGrande(c, t, [titulo], { y: 90, tam: 60 });
}
function fogao(c, t, d, {chama = 0, fosforo = 0} = {}) {
  c.fillStyle = '#121212'; c.fillRect(0, 0, W, H);
  c.save(); camera(c, 1.0 + t * 0.015, 960, 560);
  c.fillStyle = '#d2cec6'; c.fillRect(200, 600, 1520, 500); c.fillStyle = '#1b1b1b'; c.fillRect(200, 560, 1520, 60);
  [560, 1360].forEach(x => { c.fillStyle = '#2a2a2a'; c.beginPath(); c.ellipse(x, 590, 190, 40, 0, 0, 7); c.fill(); c.fillStyle = '#555'; c.beginPath(); c.ellipse(x, 586, 90, 20, 0, 0, 7); c.fill(); });
  if (chama) { for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2; c.fillStyle = `rgba(80,140,255,${0.7 + 0.3 * Math.sin(t * 20 + i)})`; c.beginPath(); c.ellipse(560 + Math.cos(a) * 90, 572 + Math.sin(a) * 20, 8, 22 * tremula(t, i), 0, 0, 7); c.fill(); }
    c.fillStyle = rgrad(c, 560, 560, 0, 300, [[0, 'rgba(80,140,255,0.3)'], [1, 'rgba(0,0,0,0)']]); c.fillRect(200, 300, 800, 500);
    if (chama > 1) { c.fillStyle = '#6a6e72'; rr(c, 380, 380, 360, 190, 16); c.fill(); c.fillStyle = '#3a3e42'; c.fillRect(360, 380, 400, 20); particulas(c, t, 12, 9, { area: [400, 120, 300, 260], cor: 'rgba(220,220,220,0.25)', tam: [10, 24], vel: [-10, 10, -60, -30] }); } }
  if (fosforo) { const p = sstep(0.3, 0.6, t); c.save(); c.translate(780, 450); c.rotate(-0.6); c.fillStyle = '#d8b070'; c.fillRect(0, -6, 260, 12); c.fillStyle = '#8a1a14'; c.beginPath(); c.ellipse(-8, 0, 16, 12, 0, 0, 7); c.fill();
    if (p > 0) { c.fillStyle = `rgba(255,190,80,${p})`; c.beginPath(); c.ellipse(-20, -6, 18, 34 * tremula(t), -0.5, 0, 7); c.fill(); c.fillStyle = rgrad(c, -20, -6, 0, 200, [[0, `rgba(255,160,60,${0.4 * p})`], [1, 'rgba(0,0,0,0)']]); c.fillRect(-220, -206, 400, 400); } c.restore(); }
  c.restore();
}
function mercadoFila(c, t, d, info) {
  c.save(); camera(c, 1.0 + t * 0.01, 960, 540); fachada(c, t, 'MERCADO DO BAIRRO', { cor: '#8a7a64', letreiro: '#2a5a3a' });
  fila(c, t, 1500, 960, 12, 80, 0.48, 31, 1);
  desenharPessoa(c, { x: 1250, y: 830, s: 0.6, dir: 1, bracoF: [0.9, 1.4], cabeca: { giro: 0.6 }, boca: falar(t, 1), luz: LUZ.rua }, 'morador7');
  c.restore();
  [['5 PESSOAS POR VEZ', 2, 420], ['SOMENTE DINHEIRO', 3, 960], ['MÁX. 2 POR PRODUTO', 4, 1500]].forEach(([txt, k, x]) => { const a = sstep(tf(info, k) - 0.2, tf(info, k) + 0.2, t); if (a > 0) { c.save(); c.globalAlpha = a; placa(c, x, 560, txt, { tam: 44, fundo: '#f3e9c8', cor: '#8e1b1b', ang: (k - 3) * 0.02 }); c.restore(); } });
}
function precoArroz(c, t) {
  c.fillStyle = '#2a2c2e'; c.fillRect(0, 0, W, H);
  c.save(); camera(c, 1.0 + t * 0.03, 960, 540); c.fillStyle = '#c8c2b0'; c.fillRect(0, 620, W, 30);
  c.fillStyle = '#f2d23a'; rr(c, 560, 360, 800, 260, 10); c.fill(); c.fillStyle = '#1a1a1a'; c.font = '700 60px Oswald'; c.fillText('ARROZ 5 KG', 610, 440);
  c.font = '400 50px Oswald'; c.fillStyle = '#555'; c.fillText('R$ 29,90', 610, 530); const k = sstep(0.4, 0.9, t); c.strokeStyle = PAL.vermelhoVivo; c.lineWidth = 6; c.beginPath(); c.moveTo(600, 515); c.lineTo(600 + 210 * k, 515); c.stroke();
  c.save(); c.globalAlpha = sstep(0.8, 1.2, t); c.font = '700 110px Oswald'; c.fillStyle = PAL.vermelhoVivo; c.fillText('R$ 59,80', 900, 560); c.restore();
  c.restore();
}
function caixaPagando(c, t) {
  c.save(); camera(c, 1.15, 960, 520); prateleiras(c, t, { cheio: 0.1 });
  c.fillStyle = '#5a5248'; c.fillRect(900, 640, 700, 300); c.fillStyle = '#7a7268'; c.fillRect(880, 620, 740, 30);
  desenharPessoa(c, { x: 1700, y: 560, s: 0.9, dir: -1, semPernas: true, bracoF: [1.0, 0.5], cabeca: { giro: 0.4 }, boca: falar(t, t < 1.5, 7), luz: LUZ.diaD }, 'pedestre2');
  desenharPessoa(c, { x: 700, y: 684, s: 1, dir: 1, dia: 5, bracoF: [1.3, 0.2], cabeca: { giro: 0.7 }, luz: LUZ.dia, objeto: (k, x, y) => { k.fillStyle = '#8aa0c0'; k.save(); k.translate(x, y); k.rotate(-0.3); k.fillRect(0, -14, 60, 28); k.restore(); } });
  [['#e8e0c8', 1000], ['#7a3a2a', 1080], ['#5a7a9a', 1160], ['#efe9da', 1240]].forEach(([cor, x]) => { c.fillStyle = cor; rr(c, x, 560, 64, 70, 6); c.fill(); });
  c.restore();
}
function moedas(c, t) {
  c.fillStyle = '#16120e'; c.fillRect(0, 0, W, H);
  c.save(); camera(c, 1.0 + t * 0.02, 960, 560);
  c.fillStyle = rgrad(c, 960, 640, 0, 600, [[0, VISUAIS.lucas.pele], [1, VISUAIS.lucas.peleSombra]]); c.beginPath(); c.ellipse(960, 700, 420, 260, -0.1, 0, 7); c.fill();
  c.fillStyle = '#8aa0c0'; c.save(); c.translate(900, 620); c.rotate(-0.15); rr(c, -200, -70, 400, 140, 8); c.fill(); c.fillStyle = '#5a708a'; c.font = '700 70px Oswald'; c.fillText('10', -170, 30); c.restore();
  c.fillStyle = '#c9a43a'; c.beginPath(); c.arc(1180, 700, 55, 0, 7); c.fill(); c.fillStyle = '#a0822a'; c.font = '700 40px Oswald'; c.fillText('1', 1170, 715);
  c.restore(); textoGrande(c, t, ['R$ 11'], { y: 170, tam: 110 });
}
function banco(c, t) {
  c.save(); camera(c, 1.0 + t * 0.012, 960, 540); fachada(c, t, 'BANCO', { cor: '#5a6a7a', letreiro: '#1a2a4a', grade: 1 });
  c.fillStyle = '#2a2c30'; rr(c, 1680, 460, 180, 360, 8); c.fill(); c.fillStyle = '#050607'; c.fillRect(1700, 500, 140, 110);
  placa(c, 960, 640, 'FECHADO', { tam: 60, fundo: '#f3e9c8', cor: '#8e1b1b' });
  desenharPessoa(c, { x: 1400, y: 860 - 276 * 0.7, s: 0.7, dir: 1, dia: 5, bracoF: [0.3, 0.5], cabeca: { giro: 0.8, incl: -0.05 }, expr: 'preocupado', luz: LUZ.rua });
  c.restore();
}
ROTEIRO[4] = [
  seq(['f0', (c, t) => { c.save(); camera(c, 1.0, 900, 540); cozinha(c, t); particulas(c, t, 20, 3, { area: [900, 200, 600, 600], cor: 'rgba(130,150,60,0.25)', tam: [10, 30], vel: [-10, 10, -15, -5] }); desenharPessoa(c, { x: 700 + Math.min(t, 1.6) * 100, y: 684, s: 1, dir: 1, dia: 5, ...caminhada(t * 0.8, t < 1.6 ? 0.8 : 0), bob: 0, cabeca: { giro: 0.7, incl: -0.05 }, expr: 'preocupado', luz: LUZ.dia }); c.restore(); }],
      ['f1', geladeiraPodre], ['f2', (c, t) => { c.save(); camera(c, 2.0 + t * 0.03, 1240, 500); cozinha(c, t); geladeiraAberta(c, t, 1); c.restore(); }], ['f5', lixoSaco]),
  seq(['f0', (c, t) => mesaCabisbaixo(c, t)], ['f1', (c, t) => { c.save(); camera(c, 1.0, 1060, 560); cozinha(c, t); geladeiraAberta(c, t, 0); c.restore(); c.fillStyle = 'rgba(120,90,40,0.35)'; c.fillRect(0, 0, W, H); textoGrande(c, t, ['DIA 2'], { y: 120, tam: 60 }); }], ['f3', (c, t) => despensa(c, t, { qtd: 0.5 })]),
  seq(['f0', (c, t, d) => fogao(c, t, d)], ['f1', (c, t) => { c.save(); camera(c, 1.2, 400, 600); cozinha(c, t); c.fillStyle = '#3a2a1d'; c.fillRect(-100, 700, 500, 80); c.fillStyle = '#c84a2a'; rr(c, 120, 700 - sstep(0.3, 1.2, t) * 60, 110, 60, 4); c.fill(); c.restore(); }],
      ['f2', (c, t, d) => fogao(c, t, d, { fosforo: 1, chama: t > 0.9 ? 1 : 0 })], ['f3', (c, t, d) => fogao(c, t, d, { chama: 2 })],
      ['f4', (c, t) => { c.save(); camera(c, 1.1, 700, 540); cozinha(c, t); c.fillStyle = '#6a6e72'; rr(c, 530, 560, 140, 70, 10); c.fill(); desenharPessoa(c, { x: 420, y: 684, s: 1, dir: 1, dia: 5, bracoF: [1.2, 0.6 + 0.2 * Math.sin(t * 2)], cabeca: { giro: 0.7, incl: 0.15 }, luz: LUZ.dia }); c.restore(); }]),
  seq(['f0', mercadoFila], ['f5', (c, t) => { c.save(); camera(c, 1.05, 700 + t * 90, 540); prateleiras(c, t, { cheio: 0.06 }); c.restore(); }], ['f6', precoArroz], ['f7', caixaPagando], ['f8', moedas]),
  seq(['f0', banco], ['f1', (c, t, d) => maoCelular(c, t, (k, x, y, w, h) => { k.fillStyle = '#000'; k.fillRect(x, y, w, h); })], ['f3', (c, t) => { c.fillStyle = '#060607'; c.fillRect(0, 0, W, H); textoGrande(c, t, ['DINHEIRO DIGITAL', 'TAMBÉM DEPENDE', 'DE ELETRICIDADE'], { tam: 100, y: 330 }); }]),
];
