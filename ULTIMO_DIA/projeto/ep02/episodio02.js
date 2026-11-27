// ÚLTIMO DIA — EP02: "E SE UMA ENCHENTE GIGANTE ATINGISSE SÃO PAULO? 24 HORAS PARA ESCAPAR."
// Direção das tomadas. As tomadas trocam no início das falas (tempos reais do áudio).
let BLOCOS = [];

// ---------- utilidades de direção ----------
function Q(cap) {
  const fs = FALAS.filter(f => f.cap === cap), B = BLOCOS.find(b => b.tipo === 'cap' && b.cap === cap);
  return { cap, a: B.a, b: B.b, f: fs, n: fs.length, L: k => fs[Math.min(k, fs.length - 1)].inicio - 0.12, F: k => fs[Math.min(k, fs.length - 1)].fim };
}
function tom(z, x, y, desenha, dz = 0.01, mao = 1.3) {
  return (c, T, t0) => { c.save(); const [hx, hy, hr] = handheld(T, mao); camera(c, z + (T - t0) * dz, x + hx, y + hy, hr); desenha(c, T, t0); c.restore(); };
}
const fixo = desenha => (c, T, t0) => { c.save(); desenha(c, T, t0); c.restore(); };

// palco = { fundo(c,T), chao, atores: { nome: {x, dir, s, ...opções do ator} }, depois(c,T) }
function desenhaPalco(c, T, palco) {
  palco.fundo(c, T);
  const nomes = Object.keys(palco.atores).sort((a, b) => (palco.atores[a].z || 0) - (palco.atores[b].z || 0));
  for (const n of nomes) { const o = palco.atores[n]; if (o.mostrar && !o.mostrar(T)) continue; const oo = typeof o.din === 'function' ? { ...o, ...o.din(T) } : o; ator(c, T, n, { ...oo, y: oo.y ?? yChao(palco.chao, n, oo.s ?? 1) }); }
  if (palco.depois) palco.depois(c, T);
}
function cabecaDe(palco, n) { const o = palco.atores[n], s = o.s ?? 1, alt = (VISUAIS[VIS_DE[n] || n] || {}).altura || 1; return [o.x + 30 * (o.dir ?? 1) * s, yChao(palco.chao, n, s) - 262 * alt * s]; }
function planoAberto(palco) {
  if (palco.aberto) return palco.aberto;
  const xs = Object.values(palco.atores).map(o => o.x); const x0 = Math.min(...xs), x1 = Math.max(...xs);
  return [clamp(1600 / (x1 - x0 + 600), 0.95, 1.45), (x0 + x1) / 2, palco.chao - 360];
}
function tomadaPalco(palco, tipo, quem) {
  return (c, T, t0) => {
    let z, x, y;
    if (tipo === 'aberto' || !palco.atores[quem]) [z, x, y] = planoAberto(palco);
    else if (tipo === 'close') { // close em quem fala, sem cortar a cabeça de quem estiver no quadro
      const [hx, hy] = cabecaDe(palco, quem); z = 2.05; x = hx;
      const topo = Math.min(...Object.keys(palco.atores).map(n => cabecaDe(palco, n)).filter(([cx]) => Math.abs(cx - hx) < 470).map(([, cy]) => cy));
      y = Math.min(hy + 120, topo - 75 + 540 / z); }
    else { // plano a dois: quem fala + o mais próximo
      const o = palco.atores[quem]; let melhor = null;
      for (const [n, p] of Object.entries(palco.atores)) if (n !== quem && (!melhor || Math.abs(p.x - o.x) < Math.abs(melhor.x - o.x))) melhor = p;
      const d = Math.abs((melhor?.x ?? o.x) - o.x); z = clamp(1150 / (d + 460), 1.2, 1.75); x = (o.x + (melhor?.x ?? o.x)) / 2;
      const nm = Object.keys(palco.atores).find(n => palco.atores[n] === melhor) || quem;
      const hy = Math.min(cabecaDe(palco, quem)[1], cabecaDe(palco, nm)[1]); y = hy + 300 / z; // cabeças no terço de cima, sem cortar
    }
    if (tipo !== 'aberto' && palco.atores[quem] && palco.camDy) y += palco.camDy;
    c.save(); const [hx, hy, hr] = handheld(T, 1.2); camera(c, z + (T - t0) * 0.008, x + hx, y + hy, hr);
    desenhaPalco(c, T, palco); c.restore();
  };
}
// cobertura automática de uma conversa (falas k0..k1)
function cobertura(q, k0, k1, palco, { abre = true, ouvinte = null } = {}) {
  const out = []; let i = 0;
  for (let k = k0; k <= k1 && k < q.n; k++) {
    const f = q.f[k], quem = f.personagem, curto = f.fim - f.inicio < 0.8;
    if (out.length && curto) continue;               // não corta em fala curta
    let tipo;
    if (k === k0 && abre) tipo = 'aberto';
    else if (!palco.atores[quem]) { tipo = ouvinte ? 'close' : 'aberto'; out.push([q.L(k), tomadaPalco(palco, tipo, ouvinte)]); i++; continue; }
    else tipo = ['close', 'dois', 'close', 'aberto', 'dois'][i % 5];
    out.push([q.L(k), tomadaPalco(palco, tipo, quem)]); i++;
  }
  return out;
}

// ---------- cenários extras ----------
function hospitalCorredor(c, T) {
  c.fillStyle = vgrad(c, -200, 940, [[0, '#d9e2e0'], [1, '#c0ccca']]); c.fillRect(-600, -400, W + 1200, 1340);
  c.fillStyle = '#3f7f86'; c.fillRect(-600, 600, W + 1200, 18); c.fillStyle = '#9aa6a4'; c.fillRect(-600, 930, W + 1200, 400);
  for (let i = 0; i < 4; i++) { c.fillStyle = '#e9efee'; c.fillRect(-100 + i * 560, 300, 220, 630); c.fillStyle = '#3f7f86'; c.fillRect(-60 + i * 560, 360, 140, 60); }
  c.fillStyle = '#b8c4c2'; rr(c, 1200, 760, 360, 60, 10); c.fill(); // maca
  c.fillStyle = 'rgba(255,255,255,0.12)'; c.fillRect(-600, -400, W + 1200, 300);
}
function portariaPredio(c, T) {
  c.fillStyle = vgrad(c, -200, 940, [[0, '#7c7a74'], [1, '#68665f']]); c.fillRect(-600, -400, W + 1200, 1340);
  c.fillStyle = '#4b4741'; c.fillRect(-600, 940, W + 1200, 400);
  c.fillStyle = '#2a2c30'; c.fillRect(1450, 250, 470, 690); janelaChuvaSimples(c, 1470, 270, 430, 660, T); // porta de vidro
  c.fillStyle = '#b9a785'; c.fillRect(200, 700, 420, 240); c.fillStyle = '#8f7f62'; c.fillRect(190, 690, 440, 20); // balcão da portaria
  c.fillStyle = '#5a7a4a'; c.beginPath(); c.arc(1300, 860, 60, Math.PI, 0); c.fill(); c.fillStyle = '#8a4a2a'; c.fillRect(1260, 860, 80, 80);
  c.fillStyle = 'rgba(70,80,90,0.35)'; c.beginPath(); c.ellipse(1300, 960, 140, 14, 0, 0, 7); c.fill(); // poça da água que o Rafael trouxe
}
function elevadorQuadro(c, T, { escuro = 0 } = {}) {
  c.fillStyle = vgrad(c, -200, 940, [[0, '#7a766e'], [1, '#67635c']]); c.fillRect(-600, -400, W + 1200, 1340);
  c.fillStyle = '#4f4a44'; c.fillRect(-600, 930, W + 1200, 400);
  c.fillStyle = '#9aa0a6'; c.fillRect(380, 260, 420, 670); c.fillStyle = '#7d838a'; c.fillRect(394, 274, 194, 656); c.fillRect(592, 274, 194, 656);
  c.fillStyle = '#c62a24'; c.fillRect(400, 160, 380, 80); c.fillStyle = '#fff'; c.font = '700 30px Inter'; c.textAlign = 'center'; c.fillText('EM ENCHENTE, USE A ESCADA', 590, 210); c.textAlign = 'left';
  c.fillStyle = '#c9c4bb'; rr(c, 1150, 330, 300, 420, 10); c.fill(); c.fillStyle = '#3a3a3a'; for (let i = 0; i < 12; i++) c.fillRect(1190 + (i % 4) * 62, 380 + Math.floor(i / 4) * 110, 34, 70); // quadro de luz
  c.fillStyle = '#e0b23a'; c.beginPath(); c.moveTo(1300, 260); c.lineTo(1340, 320); c.lineTo(1260, 320); c.fill(); c.fillStyle = '#222'; c.font = '700 40px Inter'; c.fillText('!', 1292, 312);
  if (escuro) { c.fillStyle = `rgba(5,7,14,${0.8 * escuro})`; c.fillRect(-600, -400, W + 1200, 1800); }
}
function kitEmergencia(c, T, t) {
  c.fillStyle = '#3a3430'; c.fillRect(0, 0, W, H); c.fillStyle = '#4a423c'; for (let i = 0; i < 10; i++) c.fillRect(0, i * 120, W, 4);
  const itens = [['DOCUMENTOS', '#e6dcc0', 240, 260], ['REMÉDIOS', '#c62a24', 720, 260], ['ÁGUA', '#9ec6e0', 1200, 260], ['LANTERNA', '#2a2a2e', 1600, 260], ['CARREGADOR', '#d9a623', 480, 640], ['ROUPA', '#2f6f6a', 960, 640], ['SACO PLÁSTICO', 'rgba(220,230,240,0.6)', 1440, 640]];
  itens.forEach(([n, cor, x, y], i) => {
    const a = sstep(i * 0.55, i * 0.55 + 0.4, t); if (!a) return;
    c.save(); c.globalAlpha = a; c.translate(x, y + (1 - a) * 30);
    c.fillStyle = cor; rr(c, -110, -90, 220, 180, 18); c.fill(); c.strokeStyle = 'rgba(255,255,255,0.25)'; c.lineWidth = 4; c.stroke();
    c.fillStyle = '#f2efe9'; c.font = '700 30px Oswald'; c.textAlign = 'center'; c.fillText(n, 0, 140); c.restore();
  });
}
function infograficoAgua(c, T, t) {
  c.fillStyle = '#16181c'; c.fillRect(0, 0, W, H);
  const a1 = sstep(0.2, 0.8, t), a2 = sstep(2.2, 2.8, t);
  // pessoa e 15 cm
  c.globalAlpha = a1; desenharPessoa(c, { x: 560, y: 520, s: 1.05, dir: 1, expr: 'assustado', luz: LUZ.rua, tronco: -0.12, bracoF: [0.9, 0.4] }, 'pedestre1');
  aguaSuperficie(c, T, 300, 860, 770, 'rgba(110,98,70,0.9)', 120); c.fillStyle = '#f2efe9'; c.font = '700 64px Oswald'; c.textAlign = 'center'; c.fillText('15 cm', 580, 120); c.font = '600 28px Inter'; c.fillText('de água em movimento podem derrubar um adulto', 580, 165);
  c.globalAlpha = a2; c.fillStyle = '#8a2d2a'; rr(c, 1180, 620, 400, 110, 26); c.fill(); rr(c, 1250, 540, 250, 90, 24); c.fill(); c.fillStyle = '#141519'; c.beginPath(); c.arc(1270, 740, 38, 0, 7); c.arc(1490, 740, 38, 0, 7); c.fill();
  aguaSuperficie(c, T, 1100, 1660, 700, 'rgba(110,98,70,0.9)', 190); c.fillStyle = '#f2efe9'; c.font = '700 64px Oswald'; c.fillText('30 cm', 1380, 120); c.font = '600 28px Inter'; c.fillText('podem arrastar um carro', 1380, 165);
  c.globalAlpha = 1; c.textAlign = 'left';
}
function mapaRota(c, T, t) {
  c.fillStyle = '#1d2430'; c.fillRect(0, 0, W, H);
  c.strokeStyle = '#3a4658'; c.lineWidth = 22; for (let i = 0; i < 7; i++) { c.beginPath(); c.moveTo(0, 120 + i * 150); c.lineTo(W, 160 + i * 150); c.stroke(); c.beginPath(); c.moveTo(160 + i * 280, 0); c.lineTo(120 + i * 280, H); c.stroke(); }
  c.fillStyle = 'rgba(198,42,36,0.28)'; c.beginPath(); c.ellipse(560, 700, 520, 260, -0.2, 0, 7); c.fill();
  c.strokeStyle = '#3f8ad0'; c.lineWidth = 26; c.beginPath(); c.moveTo(0, 820); c.bezierCurveTo(400, 700, 700, 900, 1100, 760); c.stroke(); // córrego
  c.fillStyle = '#f2efe9'; c.beginPath(); c.arc(520, 640, 18, 0, 7); c.fill(); c.font = '700 30px Inter'; c.fillText('PRÉDIO', 470, 610);
  c.fillStyle = '#3d9a5a'; rr(c, 1460, 180, 240, 140, 14); c.fill(); c.fillStyle = '#f2efe9'; c.fillText('ABRIGO (escola)', 1450, 160);
  const p = sstep(0.3, 3.2, t); c.strokeStyle = '#e0b23a'; c.lineWidth = 10; c.setLineDash([26, 18]);
  const pts = [[520, 640], [520, 430], [980, 430], [1000, 270], [1460, 250]]; c.beginPath(); c.moveTo(...pts[0]);
  let tot = 0; for (let i = 1; i < pts.length; i++) tot += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  let rest = tot * p; for (let i = 1; i < pts.length && rest > 0; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]), u = Math.min(1, rest / d); c.lineTo(lerp(pts[i - 1][0], pts[i][0], u), lerp(pts[i - 1][1], pts[i][1], u)); rest -= d; }
  c.stroke(); c.setLineDash([]);
  c.fillStyle = 'rgba(0,0,0,0.6)'; c.fillRect(0, 0, W, 90); c.fillStyle = '#f2efe9'; c.font = '600 30px Inter'; c.fillText('Área de risco (simulação)      Rota indicada, sem ruas alagadas      Abrigo em área mais alta', 60, 56);
}
function telaGrande(conteudo) { return (c, T, t0) => { c.fillStyle = '#0d0e10'; c.fillRect(0, 0, W, H); telaTV(c, 160, 90, 1600, 900, T, conteudo); }; }

// ---------- palcos ----------
const CH = 950;
const AP = (extra = {}, ap = { porta: 1 }) => ({ fundo: (c, T) => apartamento(c, T, ap), chao: CH, atores: extra });
const AP_SL = extra => AP(extra, { porta: 1, semLuz: 1 }); // depois que a energia foi cortada (Cap. 6)
const AP_ESCURO = extra => ({ fundo: (c, T) => { apartamento(c, T, { porta: 1, tv: 'apagada' }); c.fillStyle = 'rgba(4,6,14,0.78)'; c.fillRect(-600, -400, W + 1200, 1800); }, chao: CH, atores: extra,
  depois: (c, T) => { c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = rgrad(c, 860, 560, 0, 700, [[0, 'rgba(255,230,180,0.28)'], [1, 'rgba(255,230,180,0)']]); c.fillRect(-600, -400, W + 1200, 1800); c.restore(); } });
const GRUPO_AP = { dona_cida: { x: 360, dir: 1 }, rafael: { x: 580, dir: 1 }, lucas: { x: 860, dir: 1 }, pedro: { x: 1060, dir: -1, s: 1 }, marina: { x: 1240, dir: -1 } };
const comMochila = g => Object.fromEntries(Object.entries(g).map(([n, o]) => [n, { ...o, costas: mochila(['#3a4a3a', '#4a3a2a', '#2f3a5a', '#3a5a3a', '#5a3a4a'][n.length % 5]) }]));

// ---------- direção por capítulo ----------
const DIR = {};
DIR[0] = q => [
  [q.a, fixo(c => { c.fillStyle = '#000'; c.fillRect(0, 0, W, H); })],
  [q.a + 0.9, tom(1.0, 960, 560, (c, T) => avenidaAlagada(c, T, { agua: 0.2 + 0.25 * sstep(q.a, q.F(7), T) }), 0.012)],
  [q.L(0), tom(1.0, 960, 520, (c, T) => dentroCarro(c, T, { agua: 0.35 }), 0.01, 2.2)],
  [q.L(2), tom(1.55, 960, 700, (c, T) => avenidaAlagada(c, T, { agua: 0.35 + 0.2 * sstep(q.L(2), q.F(7), T) }), 0.02, 2)],
  [q.L(3), tom(1.05, 960, 520, (c, T) => dentroCarro(c, T, { agua: 0.5 }), 0.01, 2.4)],
  [q.L(5), tom(1.7, 700, 420, (c, T) => { apartamento(c, T, { tv: 'alerta', chuva: 1.4 }); ator(c, T, 'lucas', { x: 640, y: yChao(CH, 'lucas'), dir: -1, expr: 'assustado', bracoF: [1.2, 0.9], objeto: celularMao(), luz: LUZ_CHUVA }); }, 0.02, 2.2)],
  [q.L(6), tom(1.1, 960, 520, (c, T) => dentroCarro(c, T, { agua: 0.62 }), 0.01, 2.6)],
  [q.L(7), tom(1.15, 1050, 600, (c, T, t0) => rafaelSaiCarro(c, T, T - q.L(7)), 0.01, 1.6)],
  [q.F(7) + 0.55, fixo(c => { c.fillStyle = '#000'; c.fillRect(0, 0, W, H); })],
  [q.L(8), tom(1.0, 960, 560, (c, T) => fachadaCorrego(c, T, { nivel: 0.15, chuva: 0.8 }), 0.02)],
  [q.L(9), fixo((c, T) => telaAlertaCelular(c, T))],
  [q.L(10), tom(1.0, 960, 560, (c, T) => cidadeAerea(c, T, { noite: 0.35 }), 0.02)],
  [q.L(11), tom(0.92, 960, 600, (c, T) => avenidaAlagada(c, T, { agua: 0.15, rafaelNoCarro: 0 }), 0.015)],
];
// Cap. 1 — 06:30 (tomadas do teste aprovado + corredor)
DIR[1] = q => {
  const C = (z, x, y, dz = 0.012) => (fn) => tom(z, x, y, fn, dz, 1.5);
  return [
    [q.a, tom(1.0, 960, 560, (c, T) => fachadaCorrego(c, T, { nivel: 0.05, chuva: 0.4 }), 0.02)],
    [q.L(1), C(1.0, 980, 560)((c, T) => { apartamento(c, T); lucasCozinha(c, T, { tel: false, expr: 'sorriso', servir: sstep(q.L(1), q.L(1) + 1.5, T) }); })],
    [q.L(2), C(1.0, 980, 560, 0.01)((c, T) => { apartamento(c, T); lucasCozinha(c, T, { expr: fala('lucas', T) ? '' : 'sorriso' }); })],
    [q.L(4), C(2.0, 930, 440, 0.02)((c, T) => { apartamento(c, T); lucasCozinha(c, T, { expr: T < q.L(5) ? 'duvida' : 'sorriso' }); })],
    [q.L(6), C(1.45, 1010, 520)((c, T) => { apartamento(c, T); lucasCozinha(c, T, { expr: 'sorriso', servir: sstep(q.L(6), q.L(6) + 1.2, T) }); })],
    [q.L(8), fixo((c, T) => { c.fillStyle = '#4c4a52'; c.fillRect(0, 0, W, H); celularTela(c, 960, 540, 470, 860, (k, x, y, w, h) => { k.fillStyle = '#1b2230'; k.fillRect(x, y, w, h); k.fillStyle = '#f2efe9'; k.font = '600 30px Inter'; k.fillText('Rafael', x + 90, y + 95); k.fillStyle = '#2f6fb0'; k.beginPath(); k.arc(x + 50, y + 85, 26, 0, 7); k.fill(); k.save(); k.beginPath(); rr(k, x + 30, y + 150, w - 60, 470, 22); k.clip(); k.translate(x + 30, y + 150); k.scale(0.36, 0.36); rafaelNaCama(k, T, { expr: 'riso' }); k.restore(); k.fillStyle = '#2e3b52'; rr(k, x + 30, y + 650, w - 140, 70, 20); k.fill(); k.fillStyle = '#f2efe9'; k.font = '400 28px Inter'; k.fillText('bom dia 👍', x + 56, y + 696); }); })],
    [q.L(9), C(1.15, 760, 560)((c, T) => rafaelNaCama(c, T, { expr: 'sorriso' }))],
    [q.L(10) - 1.4, C(1.0, 980, 560, 0.01)((c, T) => { const t = T - (q.L(10) - 1.4); apartamento(c, T); lucasCozinha(c, T, { giro: lerp(0.05, 0.3, sstep(0.4, 0.9, t)), tel: true }); porta(c, 1300, 300, 190, 626, sstep(0.9, 1.4, t)); if (t > 1.15) marinaPorta(c, T, { expr: 'firme' }); })],
    [q.L(11), C(2.0, 930, 440, 0.015)((c, T) => { apartamento(c, T, { porta: 1 }); lucasCozinha(c, T, { expr: 'duvida', giro: 0.3 }); })],
    [q.L(12), C(1.9, 1340, 450, 0.015)((c, T) => { apartamento(c, T, { porta: 1 }); marinaPorta(c, T, { expr: 'firme', aponta: sstep(q.L(12), q.L(12) + 0.5, T) }); })],
    [q.L(13), C(3.2, 1695, 400, 0.03)((c, T) => apartamento(c, T, { porta: 1, tv: 'alerta' }))],
    [q.L(14), fixo((c, T) => { c.save(); camera(c, 1.1 + (T - q.L(14)) * 0.015, 960, 600); ruaChuva(c, T, { agua: 0.15 + 0.25 * sstep(q.L(14), q.L(15), T) }); c.restore(); })],
    [q.L(15), C(1.4, 1120, 500)((c, T) => { apartamento(c, T, { porta: 1, tv: 'alerta' }); lucasCozinha(c, T, { expr: 'sorriso', giro: 0.3, tel: true }); marinaPorta(c, T, { x: 1250, expr: falando('marina', T) ? 'preocupado' : 'duvida' }); })],
    [q.L(16), C(2.1, 1230, 440, 0.015)((c, T) => { apartamento(c, T, { porta: 1, tv: 'alerta' }); marinaPorta(c, T, { x: 1250, expr: 'preocupado' }); })],
    [q.L(17), C(1.25, 760, 560)((c, T) => rafaelNaCama(c, T, { expr: 'riso' }))],
    [q.L(18), C(1.4, 1120, 500)((c, T) => { apartamento(c, T, { porta: 1, tv: 'alerta' }); lucasCozinha(c, T, { expr: 'riso', giro: 0.05, tel: true }); marinaPorta(c, T, { x: 1250, expr: 'duvida' }); })],
    [q.L(19), C(1.3, 780, 540, 0.02)((c, T, t0) => rafaelNaCama(c, T, { senta: easeOut(clamp((T - t0) / 0.5)), expr: 'surpreso' }))],
    ...cobertura(q, 20, 27, { fundo: corredorDia, chao: CH, atores: {
      dona_cida: { x: 1220, dir: -1, bracoF: [0.45, 1.1], objeto: (k, x, y) => { k.fillStyle = '#3d6b8a'; rr(k, x - 20, y - 10, 50, 40, 8); k.fill(); } },
      marina: { x: 560, dir: 1 },
      pedro: { x: 900, dir: 1, costas: mochila('#2f3a5a'), din: T => (T < q.L(20) + 1.6 ? { x: lerp(200, 900, clamp((T - q.L(20) + 0.6) / 2.2)), andar: T * 1.6 } : {}) } } }),
    [q.L(28), tom(1.05, 960, 560, (c, T) => { corredorDia(c, T); ator(c, T, 'dona_cida', { x: 1220, y: yChao(CH, 'dona_cida'), dir: 1, expr: 'preocupado', giro: 0.4 }); ator(c, T, 'pedro', { x: lerp(900, 180, clamp((T - q.L(28)) / 3)), y: yChao(CH, 'pedro'), dir: -1, andar: T * 1.6, costas: mochila('#2f3a5a') }); }, 0.015)],
  ];
};
DIR[2] = q => {
  const pal = AP({ lucas: { x: 860, dir: 1, bracoF: [1.15, 0.95], objeto: celularMao() }, marina: { x: 1120, dir: -1 } });
  const carro = tom(1.0, 960, 520, (c, T) => dentroCarro(c, T, { agua: 0 }), 0.01, 1.6);
  const out = [[q.a, tom(1.0, 960, 600, (c, T) => ruaChuva(c, T, { agua: 0.25 }), 0.02)],
    [q.L(0) + 3.5, tom(0.95, 960, 600, (c, T) => avenidaAlagada(c, T, { agua: 0.05, rafaelNoCarro: 0 }), 0.015)]];
  out.push(...cobertura(q, 1, 3, pal));
  for (const k of [4, 6, 8, 10, 12]) { out.push([q.L(k), carro]); out.push([q.F(k) + 0.05, tomadaPalco(pal, k % 4 ? 'close' : 'dois', q.f[k + 1]?.personagem)]); }
  out.push([q.L(14), tom(1.3, 520, 470, (c, T) => { apartamento(c, T, { porta: 1 }); ator(c, T, 'lucas', { x: 640, y: yChao(CH, 'lucas'), dir: -1 }); ator(c, T, 'marina', { x: 880, y: yChao(CH, 'marina'), dir: -1, din: undefined }); }, 0.01)]);
  out.push([q.L(16), tom(1.15, 960, 600, (c, T) => ruaChuva(c, T, { agua: 0.3 }), 0.03)]);
  out.push([q.L(17), tom(2.0, 760, 420, (c, T) => { apartamento(c, T, { porta: 1 }); ator(c, T, 'lucas', { x: 640, y: yChao(CH, 'lucas'), dir: -1 }); ator(c, T, 'marina', { x: 880, y: yChao(CH, 'marina'), dir: -1 }); }, 0.01)]);
  out.push([q.L(20), tom(1.1, 960, 600, (c, T) => avenidaAlagada(c, T, { agua: 0.3, rafaelNoCarro: 0 }), 0.02)]);
  out.push([q.L(21), fixo((c, T) => infograficoAgua(c, T, T - q.L(21)))]);
  return out;
};
DIR[3] = q => {
  const pal = AP({ lucas: { x: 860, dir: 1 }, marina: { x: 1180, dir: -1 } });
  const palP = AP({ lucas: { x: 760, dir: 1 }, marina: { x: 1000, dir: -1 }, pedro: { x: 1260, dir: -1, costas: mochila('#2f3a5a') } });
  const sandra = tom(1.5, 1040, 470, (c, T) => { hospitalCorredor(c, T); ator(c, T, 'sandra', { x: 1000, y: yChao(940, 'sandra'), dir: 1, bracoF: [1.15, 0.95], objeto: celularMao(), luz: { lado: -1, brilho: 'rgba(255,255,255,0.1)', sombra: 'rgba(20,30,30,0.25)' } }); }, 0.01);
  const pedroTel = tomadaPalco({ ...palP, atores: { ...palP.atores, pedro: { ...palP.atores.pedro, bracoF: [1.15, 0.95], objeto: celularMao() } } }, 'close', 'pedro');
  const out = [[q.a, fixo((c, T) => telaAlertaCelular(c, T))]];
  out.push(...cobertura(q, 0, 5, pal, { abre: false }));
  out.push([q.L(6) - 0.5, tom(1.0, 1000, 560, (c, T) => { const t = T - (q.L(6) - 0.5); desenhaPalco(c, T, { ...palP, atores: { ...palP.atores, pedro: { ...palP.atores.pedro, x: lerp(1500, 1260, clamp(t / 1)), andar: t < 1 ? t * 1.8 : undefined } } }); }, 0.01)]);
  out.push(...cobertura(q, 7, 14, palP, { abre: false }));
  for (let k = 15; k <= 23; k++) out.push([q.L(k), q.f[k].personagem === 'sandra' ? sandra : pedroTel]);
  out.push([q.L(23), tomadaPalco(palP, 'close', 'marina')]);
  out.push([q.L(24), fixo((c, T) => kitEmergencia(c, T, T - q.L(24)))]);
  out.push(...cobertura(q, 26, 30, AP({ lucas: { x: 860, dir: 1 }, marina: { x: 1180, dir: -1 }, dona_cida: { x: 560, dir: 1 } })));
  return out;
};
DIR[4] = q => {
  const pal = { fundo: (c, T) => rampaGaragem(c, T, { agua: 0.3 + 0.35 * sstep(q.a, q.b, T) }), chao: 930, aberto: [1.0, 960, 600], camDy: 40,
    atores: { dona_cida: { x: 220, dir: 1 }, lucas: { x: 420, dir: 1 }, marina: { x: 600, dir: 1 }, pedro: { x: 510, dir: 1, z: 1, s: 1 }, morador: { x: 820, dir: 1, din: T => (T > q.L(5) + 0.5 ? { dir: -1, expr: 'preocupado' } : {}) } } };
  const out = [[q.a, tom(1.3, 1380, 760, (c, T) => rampaGaragem(c, T, { agua: 0.3 }), 0.02)]];
  out.push(...cobertura(q, 0, 9, pal));
  out.push([q.L(10), tom(1.6, 1420, 800, (c, T) => rampaGaragem(c, T, { agua: 0.6 + 0.08 * Math.sin(T) }), 0.02)]);
  out.push(...cobertura(q, 11, 13, pal, { abre: false }));
  out.push([q.L(14), tom(1.0, 960, 560, (c, T) => elevadorQuadro(c, T), 0.02)]);
  out.push(...cobertura(q, 15, 16, pal, { abre: false }));
  out.push([q.L(17) - 0.3, tom(0.95, 960, 540, (c, T) => { escadaDia(c, T); const u = clamp((T - q.L(17)) / 9, 0, 1);
    [['lucas', 0.18, caixa()], ['marina', 0.08, caixa('#8a6a4a')], ['pedro', 0.28, (k, x, y) => { k.fillStyle = '#c9a86a'; rr(k, x - 30, y - 40, 60, 40, 12); k.fill(); k.fillStyle = '#7a4a5a'; rr(k, x - 26, y - 70, 52, 34, 12); k.fill(); }], ['morador', 0.0, caixa('#9a7a5a')]].forEach(([n, d, obj]) => {
      const [x, y] = noDegrauDia(clamp(u + d, 0, 0.9)); ator(c, T, n, { x, y: y - 258 * ((VISUAIS[VIS_DE[n]] || {}).altura || 1), dir: 1, andar: T * 1.2, intens: 0.6, bracoF: [1.2, 0.6], objeto: obj }); }); }, 0.01)]);
  return out;
};
DIR[5] = q => {
  const palAp = AP({ lucas: { x: 860, dir: 1, bracoF: [1.15, 0.95], objeto: celularMao() }, marina: { x: 1120, dir: -1 }, dona_cida: { x: 560, dir: 1 } });
  const rua = (c, T) => { calcadaChuva(c, T, { desloc: (T - q.a) * 60 }); ator(c, T, 'rafael', { x: 860, y: yChao(900, 'rafael', 0.9), s: 0.9, andar: T * 1.4, bracoF: [1.15, 0.95], objeto: celularMao(), expr: exprAuto('rafael', T, 'sorriso') }); };
  const palPort = { fundo: portariaPredio, chao: 940, atores: { dona_cida: { x: 420, dir: 1 }, marina: { x: 640, dir: 1 }, lucas: { x: 860, dir: 1 }, rafael: { x: 1180, dir: -1, expr: undefined } }, depois: (c, T) => { const r = rng(5); c.fillStyle = 'rgba(200,215,230,0.7)'; for (let i = 0; i < 8; i++) { const ph = (T * 1.5 + r()) % 1; c.beginPath(); c.arc(1150 + r() * 70, 560 + ph * 380, 3, 0, 7); c.fill(); } } };
  const out = [[q.a, tom(0.95, 960, 600, (c, T) => avenidaAlagada(c, T, { agua: 0.25, rafaelNoCarro: 0 }), 0.015)],
    [q.L(0) + 3.6, tom(1.0, 960, 560, (c, T) => cidadeAerea(c, T, { noite: 0.15 }), 0.02)]];
  for (let k = 1; k <= 10; k++) out.push([q.L(k), q.f[k].personagem === 'rafael' ? tom(1.05, 900, 560, rua, 0.008, 2) : tomadaPalco(palAp, k % 3 ? 'close' : 'dois', q.f[k].personagem)]);
  out.push([q.L(11) - 0.2, tom(1.0, 900, 560, (c, T) => desenhaPalco(c, T, palPort), 0.01)]);
  out.push(...cobertura(q, 12, 14, palPort, { abre: false }));
  out.push([q.L(15), tom(1.4, 960, 640, (c, T) => avenidaAlagada(c, T, { agua: 0.3 + 0.3 * sstep(q.L(15), q.F(15), T) }), 0.02, 2)]);
  out.push(...cobertura(q, 16, 20, palPort, { abre: false }));
  out.push([q.L(21), tom(1.1, 1050, 600, (c, T) => rafaelSaiCarro(c, T, 0.6 + (T - q.L(21)) * 0.6), 0.01)]);
  return out;
};
DIR[6] = q => {
  const g = AP(GRUPO_AP, { porta: 1, tv: 'alerta' }), ge = AP_ESCURO({ ...GRUPO_AP, lucas: { ...GRUPO_AP.lucas, bracoF: [1.1, 0.6], objeto: lanternaMao() } });
  const out = [[q.a, fixo(telaGrande('alerta'))]];
  out.push(...cobertura(q, 1, 10, g));
  out.push([q.L(11), tom(1.0, 960, 560, (c, T) => cidadeAerea(c, T, { noite: 0.3 }), 0.02)]);
  out.push(...cobertura(q, 12, 14, g));
  out.push([q.L(15), fixo((c, T) => mapaRota(c, T, T - q.L(15)))]);
  out.push(...cobertura(q, 16, 22, g, { abre: false }));
  out.push([q.L(23) - 0.6, tom(1.0, 860, 590, (c, T) => desenhaPalco(c, T, T < q.L(23) - 0.2 ? g : ge), 0.005)]);
  out.push(...cobertura(q, 24, 29, ge, { abre: false }));
  out.push([q.L(30), tom(1.0, 960, 520, (c, T) => lembrancaCida(c, T), 0.02)]);
  out.push([q.L(31), tomadaPalco(ge, 'close', 'pedro')]);
  out.push([q.L(32), tom(1.25, 960, 420, (c, T) => lembrancaCida(c, T), 0.03)]);
  out.push(...cobertura(q, 33, 36, ge, { abre: false }));
  return out;
};
DIR[7] = q => {
  const pal = AP_SL({ lucas: { x: 640, dir: -1, bracoF: [1.15, 0.95], objeto: celularMao() }, rafael: { x: 1060, dir: -1 }, marina: { x: 1260, dir: -1 } });
  const mae = tom(1.45, 760, 470, (c, T) => { casaMae(c, T); ator(c, T, 'mae', { x: 720, y: yChao(940, 'mae'), dir: 1, bracoF: [1.15, 0.95], objeto: celularMao(), luz: { lado: -1, brilho: 'rgba(255,240,210,0.15)', sombra: 'rgba(40,30,20,0.3)' } }); }, 0.01);
  const out = [];
  for (let k = 0; k <= 12; k++) { const p = q.f[k].personagem; out.push([k === 0 ? q.a : q.L(k), p === 'mae' ? mae : p === 'rafael' ? tomadaPalco(pal, 'dois', 'rafael') : tomadaPalco(pal, k === 0 || k === 12 ? 'aberto' : 'close', 'lucas')]); }
  out.push(...cobertura(q, 13, 16, AP_SL(GRUPO_AP)));
  return out;
};
DIR[8] = q => {
  const g = AP_SL(comMochila(GRUPO_AP));
  const ordem = ['marina', 'pedro', 'dona_cida', 'lucas', 'rafael'];
  const anda = (c, T, { parar = 0, voltar = 0, agua = 0, marq = 0 } = {}) => {
    calcadaChuva(c, T, { aguaFrente: agua, marquise: marq, desloc: parar ? 0 : (T - q.a) * (voltar ? -70 : 70) });
    ordem.forEach((n, i) => { const x = (voltar ? 1180 - i * 170 : 380 + i * 170); ator(c, T, n, { x, y: yChao(900, n, 0.9), s: 0.9, dir: voltar ? -1 : 1, andar: parar ? undefined : T * (n === 'dona_cida' ? 1.0 : 1.3) + i * 0.3, intens: n === 'dona_cida' ? 0.6 : 1, costas: mochila(['#3a4a3a', '#4a3a2a', '#2f3a5a', '#3a5a3a', '#5a3a4a'][i]), objeto: n === 'lucas' ? guardaChuva('#1d1f24') : undefined }); });
  };
  const palAgua = { fundo: (c, T) => calcadaChuva(c, T, { aguaFrente: 1 }), chao: 900, aberto: [0.95, 1000, 600], atores: Object.fromEntries(ordem.map((n, i) => [n, { x: 380 + i * 165, dir: 1, s: 0.9, costas: mochila('#3a4a3a') }])) };
  const palMarq = { fundo: (c, T) => { calcadaChuva(c, T, { marquise: 1 });  }, chao: 900, atores: { dona_cida: { x: 640, dir: 1, s: 0.9, sentado: true, y: 900 - 142, costas: mochila('#2f3a5a') }, lucas: { x: 860, dir: -1, s: 0.9 }, marina: { x: 1040, dir: -1, s: 0.9 }, pedro: { x: 470, dir: 1, s: 0.9 }, rafael: { x: 1200, dir: -1, s: 0.9 } } };
  const out = [];
  out.push(...cobertura(q, 0, 11, g));
  out.push([q.L(12) - 0.8, tom(1.0, 900, 600, (c, T) => anda(c, T), 0.005)]);
  out.push([q.L(14) - 0.4, tom(1.0, 960, 600, (c, T) => desenhaPalco(c, T, palAgua), 0.006)]);
  out.push(...cobertura(q, 15, 18, palAgua, { abre: false }));
  out.push([q.L(19), tom(1.35, 1500, 560, (c, T) => { desenhaPalco(c, T, palAgua); ator(c, T, 'agente', { x: 1660, y: yChao(900, 'agente', 0.8), s: 0.8, dir: -1, bracoF: [2.6 + Math.sin(T * 6) * 0.4, 0.3], expr: 'firme' }); }, 0.01)]);
  out.push(...cobertura(q, 20, 20, palAgua, { abre: true }));
  out.push([q.L(21), tom(1.0, 900, 600, (c, T) => anda(c, T, { voltar: 1 }), 0.005)]);
  out.push([q.L(24) - 0.3, tom(1.0, 840, 580, (c, T) => desenhaPalco(c, T, palMarq), 0.008)]);
  out.push(...cobertura(q, 25, 28, palMarq, { abre: false }));
  out.push([q.L(29), tom(1.0, 960, 560, (c, T) => { cidadeAerea(c, T, { noite: 0.35 }); }, 0.015)]);
  return out;
};
DIR[9] = q => {
  const mesaFrente = (c) => { c.fillStyle = '#e9e6e0'; c.fillRect(1380, 760, 440, 26); c.fillStyle = '#2f6fb0'; c.fillRect(1395, 786, 410, 120); c.fillStyle = '#fff'; c.font = '700 30px Oswald'; c.textAlign = 'center'; c.fillText('VOLUNTÁRIOS', 1600, 856); c.textAlign = 'left'; };
  const pal = { fundo: (c, T) => abrigo(c, T, { noite: 0.4 }), chao: 960, depois: mesaFrente, atores: { voluntaria: { x: 1600, dir: -1, z: -1 }, marina: { x: 1320, dir: 1, costas: mochila('#3a4a3a') }, dona_cida: { x: 1120, dir: 1 }, lucas: { x: 900, dir: 1, costas: mochila('#3a5a3a') }, pedro: { x: 740, dir: 1, costas: mochila('#2f3a5a') }, rafael: { x: 560, dir: 1, costas: mochila('#5a3a4a') } } };
  const palJan = { fundo: (c, T) => abrigo(c, T, { noite: 0.6 }), chao: 960, atores: { pedro: { x: 760, dir: 1, giro: 0.5 }, lucas: { x: 960, dir: -1 }, marina: { x: 1160, dir: -1 }, rafael: { x: 1340, dir: -1 }, dona_cida: { x: 560, dir: 1, sentado: true, y: 960 - 156 } } };
  const palNoite = { fundo: (c, T) => abrigo(c, T, { noite: 0.85 }), chao: 960, atores: { marina: { x: 760, dir: 1, expr: 'preocupado' }, lucas: { x: 960, dir: -1, expr: 'preocupado' }, rafael: { x: 1160, dir: -1, expr: 'preocupado' }, dona_cida: { x: 560, dir: 1, sentado: true, y: 960 - 156 } } };
  const palTomada = { fundo: (c, T) => abrigo(c, T, { noite: 0.85 }), chao: 960, atores: { lucas: { x: 900, dir: 1 }, pedro: { x: 1150, dir: -1 }, extra: undefined } };
  const out = [[q.a, tom(1.0, 960, 560, (c, T) => desenhaPalco(c, T, pal), 0.006)]];
  out.push(...cobertura(q, 0, 11, pal, { abre: false }));
  out.push([q.L(12) - 0.3, tom(1.0, 960, 560, (c, T) => cidadeAerea(c, T, { noite: 0.75 }), 0.02)]);
  out.push(...cobertura(q, 13, 19, palJan));
  out.push([q.L(20), tom(1.0, 960, 560, (c, T) => cidadeAerea(c, T, { noite: 0.85 }), 0.015)]);
  out.push(...cobertura(q, 21, 24, palNoite));
  out.push([q.L(25), tom(1.25, 1070, 500, (c, T) => { abrigo(c, T, { noite: 0.85 }); desenharPessoa(c, { x: 1320, y: yChao(960, 'cida'), dir: -1, luz: LUZ_NOITE, expr: 'sorriso', bracoF: [1.0, 0.6], objeto: celularMao() }, { ...VISUAIS.mae, cabelo: '#bdb8b0', cabeloTipo: 'longo', camiseta: '#8a6a3a', camisetaSombra: '#6a502a', altura: 0.9 }); ator(c, T, 'pedro', { x: 1170, y: yChao(960, 'pedro'), dir: 1, bracoF: [1.2, 0.6], objeto: celularMao(), luz: LUZ_NOITE }); ator(c, T, 'lucas', { x: 860, y: yChao(960, 'lucas'), dir: 1, luz: LUZ_NOITE, expr: exprAuto('lucas', T, 'firme') }); }, 0.008)]);
  out.push(...cobertura(q, 26, 29, { ...palTomada, atores: { lucas: { x: 860, dir: 1, luz: LUZ_NOITE }, pedro: { x: 1170, dir: -1, luz: LUZ_NOITE } } }, { abre: false }));
  out.push([q.L(30), tom(1.0, 960, 560, (c, T) => desenhaPalco(c, T, palNoite), 0.01)]);
  return out;
};
DIR[10] = q => {
  const pal = { fundo: (c, T) => abrigo(c, T, { noite: 0.7 }), chao: 960, atores: { rafael: { x: 520, dir: 1, sentadoChao: true, y: 925 }, pedro: { x: 760, dir: 1, sentadoChao: true, y: 935 }, lucas: { x: 960, dir: -1 }, marina: { x: 1160, dir: -1 }, dona_cida: { x: 1360, dir: -1 } } };
  const palS = { fundo: (c, T) => abrigo(c, T, { noite: 0.7 }), chao: 960, atores: { pedro: { x: 1100, dir: 1, expr: 'riso' }, sandra: { x: 1320, dir: -1, expr: 'sorriso' }, dona_cida: { x: 880, dir: 1, expr: 'sorriso' }, marina: { x: 680, dir: 1, expr: 'sorriso' } } };
  const palMad = { fundo: (c, T) => { abrigo(c, T, { noite: 1 }); c.fillStyle = 'rgba(3,5,14,0.45)'; c.fillRect(-600, -400, W + 1200, 1800); }, chao: 960, atores: { lucas: { x: 780, dir: 1, sentadoChao: true, y: 925, luz: LUZ_NOITE, repouso: 'sorriso' }, rafael: { x: 1120, dir: -1, sentadoChao: true, y: 925, luz: LUZ_NOITE } } };
  const out = [];
  out.push(...cobertura(q, 0, 6, pal));
  out.push([q.L(7) - 0.4, tom(1.0, 1100, 560, (c, T) => { const t = T - (q.L(7) - 0.4); abrigo(c, T, { noite: 0.7 }); ator(c, T, 'sandra', { x: lerp(1750, 1320, clamp(t / 1.2)), y: yChao(960, 'sandra'), dir: -1, andar: t < 1.2 ? t * 1.6 : undefined }); ator(c, T, 'pedro', { x: lerp(800, 1100, clamp((t - 0.3) / 0.9)), y: yChao(960, 'pedro'), dir: 1, andar: t > 0.3 && t < 1.2 ? t * 2 : undefined, expr: 'riso' }); }, 0.01)]);
  out.push(...cobertura(q, 8, 14, palS, { abre: false }));
  out.push([q.L(15) - 0.8, tom(1.25, 950, 640, (c, T) => desenhaPalco(c, T, palMad), 0.006, 0.8)]);
  out.push(...cobertura(q, 16, 24, palMad, { abre: false }));
  out.push([q.L(25), tom(1.0, 960, 560, (c, T) => cidadeAerea(c, T, { noite: 0.5 }), 0.015)]);
  return out;
};
DIR[11] = q => {
  const pal = { fundo: (c, T) => abrigo(c, T, { noite: 0 }), chao: 960, atores: comMochila({ dona_cida: { x: 560, dir: 1 }, rafael: { x: 760, dir: 1 }, lucas: { x: 960, dir: -1 }, pedro: { x: 1120, dir: -1 }, marina: { x: 1300, dir: -1 } }) };
  const palB = { fundo: bairroLama, chao: 930, atores: comMochila({ dona_cida: { x: 400, dir: 1 }, pedro: { x: 560, dir: 1 }, marina: { x: 760, dir: 1 }, lucas: { x: 960, dir: 1 }, rafael: { x: 1160, dir: -1 } }) };
  const palM = { ...palB, atores: { ...palB.atores, morador: { x: 1400, dir: -1, bracoF: [0.4, 0.9], objeto: (k, x, y) => { k.fillStyle = '#8a6a3a'; k.fillRect(x - 3, y - 160, 6, 200); k.fillStyle = '#c9a86a'; k.fillRect(x - 30, y + 30, 60, 14); } } } };
  const out = [[q.a, tom(1.0, 960, 560, (c, T) => cidadeAerea(c, T, { noite: 0, chuva: 0.25 }), 0.015)]];
  out.push(...cobertura(q, 2, 9, pal));
  out.push([q.L(10), tom(1.05, 960, 560, (c, T) => { bairroLama(c, T); for (const [n, x] of [['pedestre1', 600], ['pedestre2', 1100]]) desenharPessoa(c, { x, y: yChao(930, n) , dir: 1, ...caminhada(T * 0.5, 0.2), bracoF: [0.6 + Math.sin(T * 3) * 0.3, 0.4], objeto: (k, hx, hy) => { k.fillStyle = '#8a6a3a'; k.fillRect(hx - 3, hy - 40, 6, 200); } , luz: LUZ.rua }, n); }, 0.02)]);
  out.push(...cobertura(q, 11, 18, palB, { abre: false }));
  out.push([q.L(19), tom(1.0, 900, 560, (c, T) => desenhaPalco(c, T, palB), 0.01)]);
  out.push(...cobertura(q, 20, 25, palM, { abre: false }));
  return out;
};
DIR[12] = q => {
  const pal = { fundo: (c, T) => fachadaCorrego(c, T, { nivel: 0.05, chuva: 0 }), chao: 1000, atores: { marina: { x: 440, dir: 1, s: 0.9 }, lucas: { x: 620, dir: 1, s: 0.9 }, rafael: { x: 820, dir: -1, s: 0.9 }, pedro: { x: 280, dir: 1, s: 0.9 }, dona_cida: { x: 120, dir: 1, s: 0.9 } } };
  const out = [];
  out.push(...cobertura(q, 0, 4, pal));
  out.push([q.L(5), (c, T) => { c.save(); const k = clamp((T - q.L(5)) / 12); camera(c, lerp(1.2, 0.85, easeIO(k)), lerp(560, 960, k), lerp(560, 520, k)); desenhaPalco(c, T, pal); c.restore(); }]);
  out.push([q.L(7), tom(1.0, 960, 560, (c, T) => cidadeAerea(c, T, { noite: 0.05, chuva: 0 }), 0.012)]);
  return out;
};

// ---------- cartelas ----------
function cartelaHora(B) {
  return (c, t, dur) => {
    c.fillStyle = '#050506'; c.fillRect(0, 0, W, H);
    c.fillStyle = rgrad(c, W / 2, 560, 0, 900, [[0, `rgba(142,27,27,${0.3 * sstep(0, 1, t)})`], [1, 'rgba(0,0,0,0)']]); c.fillRect(0, 0, W, H);
    c.textAlign = 'center'; c.textBaseline = 'middle'; const a = sstep(0.1, 0.6, t) * (1 - sstep(dur - 0.4, dur, t));
    c.globalAlpha = a; c.fillStyle = 'rgba(242,239,233,0.7)'; c.font = '400 34px Oswald'; c.fillText(`CAPÍTULO ${B.cap}`, W / 2, 380);
    c.fillStyle = '#f2efe9'; c.font = '700 150px Oswald'; c.fillText(B.hora || B.titulo, W / 2, 520);
    c.fillStyle = '#c62a24'; c.fillRect(W / 2 - 160 * sstep(0.3, 1.0, t), 610, 320 * sstep(0.3, 1.0, t), 7);
    if (B.hora) { c.fillStyle = 'rgba(242,239,233,0.85)'; c.font = '400 46px Oswald'; c.fillText(B.titulo, W / 2, 680); }
    // relógio de 24 h: progresso do dia
    const h = { 1: 6.5, 2: 8, 3: 9.25, 4: 10, 5: 11.5, 6: 13, 7: 14.33, 8: 16, 9: 18.5, 10: 22, 11: 30.5, 12: 31 }[B.cap] || 0;
    const p = clamp((h - 6.5) / 24); c.fillStyle = 'rgba(242,239,233,0.15)'; c.fillRect(W / 2 - 300, 800, 600, 6); c.fillStyle = '#c62a24'; c.fillRect(W / 2 - 300, 800, 600 * p * sstep(0.2, 1.2, t), 6);
    c.fillStyle = 'rgba(242,239,233,0.6)'; c.font = '400 24px Inter'; c.fillText('24 HORAS', W / 2, 840);
    c.globalAlpha = 1; c.textAlign = 'left';
  };
}
function cartelaTitulo(c, t, dur) {
  c.fillStyle = '#050506'; c.fillRect(0, 0, W, H);
  c.save(); camera(c, 1.05 - t * 0.01, 960, 560); c.globalAlpha = 0.45; fachadaCorrego(c, t + 100, { nivel: 0.3, chuva: 1 }); c.restore();
  c.fillStyle = 'rgba(5,5,6,0.55)'; c.fillRect(0, 0, W, H);
  c.textAlign = 'center'; c.textBaseline = 'middle'; const a = sstep(0.15, 0.8, t) * (1 - sstep(dur - 0.4, dur, t));
  c.globalAlpha = a; c.fillStyle = '#f2efe9'; c.font = '700 150px Oswald'; c.fillText('24 HORAS PARA ESCAPAR', W / 2, 500);
  c.fillStyle = '#c62a24'; c.fillRect(W / 2 - 260, 590, 520, 8);
  c.fillStyle = 'rgba(242,239,233,0.85)'; c.font = '400 38px Oswald'; c.fillText('ÚLTIMO DIA  ·  EPISÓDIO 02  ·  SIMULAÇÃO', W / 2, 660);
  c.globalAlpha = 1; c.textAlign = 'left';
}
function cartelaFim(c, t, dur) {
  c.fillStyle = '#050506'; c.fillRect(0, 0, W, H);
  c.fillStyle = rgrad(c, W / 2, 560, 0, 900, [[0, 'rgba(142,27,27,0.32)'], [1, 'rgba(0,0,0,0)']]); c.fillRect(0, 0, W, H);
  c.textAlign = 'center'; c.textBaseline = 'middle';
  c.globalAlpha = sstep(0.2, 0.9, t); c.fillStyle = '#f2efe9'; c.font = '700 120px Oswald'; c.fillText('VOCÊ ESTARIA PREPARADO?', W / 2, 430);
  c.globalAlpha = sstep(1.4, 2.0, t); c.fillStyle = '#c62a24'; c.fillRect(W / 2 - 200, 520, 400, 8);
  c.fillStyle = 'rgba(242,239,233,0.9)'; c.font = '700 64px Oswald'; c.fillText('ÚLTIMO DIA', W / 2, 610);
  c.globalAlpha = sstep(2.4, 3.0, t); c.font = '400 32px Inter'; c.fillStyle = 'rgba(242,239,233,0.75)'; c.fillText('Simulação fictícia. Em uma emergência real, siga sempre a Defesa Civil.', W / 2, 720);
  c.globalAlpha = sstep(3.2, 3.8, t) * (1 - sstep(dur - 0.8, dur, t)); c.font = '700 40px Oswald'; c.fillStyle = '#f2efe9'; c.fillText('CONTE NOS COMENTÁRIOS: VOCÊ SAIRIA OU ESPERARIA?', W / 2, 860);
  c.globalAlpha = 1; c.textAlign = 'left';
}

// ---------- preparação ----------
window.prepararEpisodio = L => {
  BLOCOS = L.blocos; FALAS = L.falas;
  const q0 = FALAS.filter(f => f.cap === 0);
  window.RAIOS = [q0[0].inicio - 0.8, q0[6].inicio + 0.2,
    ...[1, 2, 4, 5, 6, 8].map(cap => { const fs = FALAS.filter(f => f.cap === cap); return fs[Math.floor(fs.length / 2)].inicio + 0.3; })];
  window.CENAS = [];
  for (const B of BLOCOS) {
    if (B.tipo === 'cartela') { window.CENAS.push({ a: B.a, b: B.b, fn: cartelaHora(B), trans: 0.5 }); continue; }
    if (B.tipo === 'titulo') { window.CENAS.push({ a: B.a, b: B.b, fn: cartelaTitulo, trans: 'corte' }); continue; }
    if (B.tipo === 'fim') { window.CENAS.push({ a: B.a, b: B.b, fn: cartelaFim, trans: 0.8, saiPreto: 0.8 }); continue; }
    const q = Q(B.cap); const tom_ = DIR[B.cap](q).filter(x => x).sort((x, y) => x[0] - y[0]);
    tom_.forEach(([a, fn, tr], i) => {
      const a_ = i === 0 ? B.a : Math.max(a, B.a); const b = i + 1 < tom_.length ? Math.max(a_ + 0.05, tom_[i + 1][0]) : B.b;
      if (b <= a_ + 0.04) return;
      window.CENAS.push({ a: a_, b: Math.min(b, B.b), fn: (c, t, d, T) => fn(c, T, a_), trans: i === 0 ? 0.5 : (tr || 'corte') });
    });
  }
  window.CENAS.sort((x, y) => x.a - y.a);
  window.DURACAO = L.duracao;
  const fimEp = BLOCOS.find(b => b.tipo === 'fim').a;
  window.POS = (ctx, T) => {
    filme(ctx, T, { vinheta: 0.45, grao: 0.045 });
    if (T > 1.0 && T < fimEp) seloSimulacao(ctx, sstep(1.0, 1.6, T) * (1 - sstep(fimEp - 0.5, fimEp, T)));
  };
  prepararLegendas(FALAS.map(f => ({ texto: f.texto, inicio: f.inicio, fim: f.fim })), 0);
};
