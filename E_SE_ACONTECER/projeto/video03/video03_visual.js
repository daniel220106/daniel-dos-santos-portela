// E SE ACONTECER? — Vídeo 3 ("50°C no Rio: 5 dias para sobreviver"): elenco, a cachorra Pipoca, objetos e efeitos de calor.
// Carregar depois de motor.js, video02_visual.js, video01/abertura.js, motor/cenarios.js e video02/cenarios02.js.

// ---------- elenco (fichas visuais fixas) ----------
Object.assign(VISUAIS, {
  caio: { pele: '#7a4e34', peleSombra: '#57361f', cabelo: '#100b08', camiseta: '#2b8a6e', camisetaSombra: '#1f6651', calca: '#2c3d5c', calcaSombra: '#1f2b42', tenis: '#ecebe6', sola: '#3a3a3a', barba: 0.3, cabeloTipo: 'curto', altura: 1.02, largura: 1.0 },
  nena: { pele: '#6e4530', peleSombra: '#4f301f', cabelo: '#e4e0da', camiseta: '#3a6fa6', camisetaSombra: '#2a5280', calca: '#3a6fa6', calcaSombra: '#2a5280', tenis: '#5a4a3a', sola: '#2a2018', barba: 0, cabeloTipo: 'coque', oculos: true, vestido: '#3a6fa6', altura: 0.86, largura: 1.06 },
  duda: { pele: '#7a4e34', peleSombra: '#57361f', cabelo: '#120c09', camiseta: '#e8c22e', camisetaSombra: '#b8961c', calca: '#3a5a8a', calcaSombra: '#2a4266', tenis: '#f2f2f2', sola: '#555', barba: 0, cabeloTipo: 'rabo', cabecaEsc: 1.22, altura: 0.68, largura: 0.8 },
  sonia: { pele: '#7a4e34', peleSombra: '#57361f', cabelo: '#1a120d', camiseta: '#8fc3d1', camisetaSombra: '#6a9fae', calca: '#8fc3d1', calcaSombra: '#6a9fae', tenis: '#f2f2f2', sola: '#888', barba: 0, cabeloTipo: 'coque', altura: 0.95, largura: 0.96 },
  valdir: { pele: '#c99a78', peleSombra: '#9a6f52', cabelo: '#6a625a', camiseta: '#ebe8e1', camisetaSombra: '#c8c4bb', calca: '#4a5664', calcaSombra: '#343d48', tenis: '#2a2a2a', sola: '#111', barba: 0, cabeloTipo: 'careca', bigode: '#5a524a', altura: 0.98, largura: 1.2 },
  tiao: { pele: '#4f321f', peleSombra: '#382314', cabelo: '#2a2420', camiseta: '#e9e4d8', camisetaSombra: '#c4bfb2', calca: '#5a4a38', calcaSombra: '#3f3426', tenis: '#3a3a3a', sola: '#1a1a1a', barba: 0.35, cabeloTipo: 'curto', bone: '#c0392b', altura: 1.0, largura: 1.1 },
  ademar: { pele: '#c08a64', peleSombra: '#8d6044', cabelo: '#e2ded8', camiseta: '#7a5a3a', camisetaSombra: '#5a4128', calca: '#4a4038', calcaSombra: '#332c26', tenis: '#2a2118', sola: '#111', barba: 0, cabeloTipo: 'careca', oculos: true, mangaLonga: true, altura: 0.9, largura: 0.95 },
  zica: { pele: '#a9724f', peleSombra: '#7d4f35', cabelo: '#24160e', camiseta: '#b04a7a', camisetaSombra: '#863759', calca: '#2f3440', calcaSombra: '#20242d', tenis: '#ddd', sola: '#444', barba: 0, cabeloTipo: 'longo', altura: 0.93, largura: 0.92 },
  cliente3: { pele: '#d0a080', peleSombra: '#a07455', cabelo: '#3a2a1a', camiseta: '#e05a3a', camisetaSombra: '#b04428', calca: '#3a3a3f', calcaSombra: '#26262a', tenis: '#eee', sola: '#444', barba: 0.2, cabeloTipo: 'curto', altura: 1.0, largura: 1.05 },
  feirante3: { pele: '#8a5a3c', peleSombra: '#64402a', cabelo: '#1c1410', camiseta: '#d8d0b0', camisetaSombra: '#b0a888', calca: '#3a4a3a', calcaSombra: '#2a352a', tenis: '#333', sola: '#111', barba: 0.4, cabeloTipo: 'curto', bone: '#2f6f3a', altura: 0.97, largura: 1.12 },
  homem3: { pele: '#7a5038', peleSombra: '#553624', cabelo: '#141010', camiseta: '#4a5a7a', camisetaSombra: '#35415a', calca: '#3a3a3f', calcaSombra: '#26262a', tenis: '#bbb', sola: '#333', barba: 0.3, cabeloTipo: 'curto', bone: '#2a2a2a', altura: 1.0, largura: 1.05 },
  mulher3: { pele: '#c08a64', peleSombra: '#8d6044', cabelo: '#4a2a1a', camiseta: '#d07a2a', camisetaSombra: '#a55e1c', calca: '#2f3a5a', calcaSombra: '#202840', tenis: '#ddd', sola: '#444', barba: 0, cabeloTipo: 'rabo', altura: 0.94, largura: 0.98 },
  senhora3: { pele: '#d3a383', peleSombra: '#a5795c', cabelo: '#9a958e', camiseta: '#5a8a6a', camisetaSombra: '#41654d', calca: '#5a8a6a', calcaSombra: '#41654d', tenis: '#4a3a2a', sola: '#222', barba: 0, cabeloTipo: 'chanel', vestido: '#5a8a6a', altura: 0.9, largura: 1.05 },
  vizinha3: { pele: '#8a5a3c', peleSombra: '#64402a', cabelo: '#17110e', camiseta: '#7a6aa8', camisetaSombra: '#5a4d80', calca: '#2a2f3a', calcaSombra: '#1c2028', tenis: '#ddd', sola: '#444', barba: 0, cabeloTipo: 'longo', altura: 0.94, largura: 0.96 },
  enfermeira3: { pele: '#d3a383', peleSombra: '#a5795c', cabelo: '#3a2416', camiseta: '#5aa88f', camisetaSombra: '#41806b', calca: '#5aa88f', calcaSombra: '#41806b', tenis: '#f2f2f2', sola: '#888', barba: 0, cabeloTipo: 'rabo', altura: 0.94, largura: 0.94 },
  socorrista: { pele: '#a9724f', peleSombra: '#7d4f35', cabelo: '#1b1411', camiseta: '#e86a1a', camisetaSombra: '#b8520f', calca: '#2a3340', calcaSombra: '#1d232d', tenis: '#1a1a1a', sola: '#111', barba: 0.2, cabeloTipo: 'curto', altura: 1.0, largura: 1.05 },
  morador3: { pele: '#d0a080', peleSombra: '#a07455', cabelo: '#4a3a2a', camiseta: '#3a5a4a', camisetaSombra: '#2a4236', calca: '#4a4a4a', calcaSombra: '#333', tenis: '#222', sola: '#111', barba: 0.35, cabeloTipo: 'curto', altura: 1.02, largura: 1.08 },
});
Object.assign(VIS_DE, { caio: 'caio', nena: 'nena', duda: 'duda', sonia: 'sonia', valdir: 'valdir', tiao: 'tiao', ademar: 'ademar', zica: 'zica',
  cliente: 'cliente3', feirante: 'feirante3', morador: 'morador3', homem: 'homem3', mulher: 'mulher3', senhora: 'senhora3', vizinha: 'vizinha3', enfermeira: 'enfermeira3', socorrista: 'socorrista' });
Object.assign(SEED, { caio: 1, nena: 5, duda: 3, sonia: 2, valdir: 6, tiao: 4, ademar: 7, zica: 8, cliente: 9, feirante: 10, morador: 11, homem: 12, mulher: 13, senhora: 14, vizinha: 15, enfermeira: 16, socorrista: 17 });

const FICHAS_VIDEO_03 = {
  caio: { nome: 'CAIO', idade: '26 anos', vis: 'caio', traco: 'Entregador de aplicativo. Bem-humorado, teimoso, "carioca não sente calor".', exprs: ['', 'sorriso', 'surpreso', 'preocupado', 'duvida', 'riso'] },
  nena: { nome: 'VÓ NENA', idade: '79 anos', vis: 'nena', traco: 'Avó do Caio e da Duda. Teimosa, engraçada, cuida de todo mundo menos dela.', exprs: ['', 'firme', 'sorriso', 'duvida', 'preocupado', 'riso'] },
  duda: { nome: 'DUDA', idade: '11 anos', vis: 'duda', traco: 'Irmã do Caio. Organizada, rápida e atenta.', exprs: ['', 'surpreso', 'preocupado', 'duvida', 'sorriso', 'riso'] },
  sonia: { nome: 'SÔNIA', idade: '48 anos', vis: 'sonia', traco: 'Mãe. Técnica de enfermagem presa no plantão. Orienta pelo telefone.', exprs: ['', 'firme', 'preocupado', 'sorriso', 'duvida', 'surpreso'] },
  valdir: { nome: 'SEU VALDIR', idade: '63 anos', vis: 'valdir', traco: 'Síndico. Ranzinza, dono do gerador. Mora sozinho.', exprs: ['', 'firme', 'duvida', 'preocupado', 'surpreso', 'sorriso'] },
  tiao: { nome: 'TIÃO', idade: '55 anos', vis: 'tiao', traco: 'Ambulante do isopor. Conselho de graça, gelo pra emergência.', exprs: ['', 'sorriso', 'riso', 'firme', 'surpreso', 'duvida'] },
  ademar: { nome: 'SEU ADEMAR', idade: '81 anos', vis: 'ademar', traco: 'Viúvo do 302. Às 18h, o rádio toca a fita da Dona Lurdes.', exprs: ['', 'sorriso', 'preocupado', 'duvida', 'surpreso', 'firme'] },
};

// expressão automática por personagem e pela pontuação da fala
exprAuto = function (nome, T, repouso = '') {
  const f = falaAtual(nome, T);
  if (!f) return repouso;
  const t = f.texto, excl = /!$/.test(t), perg = /\?$/.test(t);
  const M = { caio: ['surpreso', 'duvida', ''], nena: ['firme', 'duvida', 'firme'], duda: ['surpreso', 'duvida', ''], sonia: ['firme', 'preocupado', 'firme'],
    valdir: ['firme', 'duvida', ''], tiao: ['riso', 'duvida', 'sorriso'], ademar: ['surpreso', 'duvida', ''], zica: ['firme', 'preocupado', 'preocupado'] }[nome] || ['surpreso', 'duvida', ''];
  return excl ? M[0] : (perg ? M[1] : M[2]);
};

// ---------- luzes ----------
const LUZ_SOL = { lado: 1, brilho: 'rgba(255,214,150,0.24)', sombra: 'rgba(70,30,8,0.30)', geral: 'rgba(255,150,50,0.05)' };
const LUZ_CASA = { lado: 1, brilho: 'rgba(255,200,140,0.16)', sombra: 'rgba(40,20,10,0.32)', geral: 'rgba(255,120,40,0.06)' };
const LUZ_VELA = { lado: 1, brilho: 'rgba(255,170,80,0.30)', sombra: 'rgba(5,3,2,0.62)', geral: 'rgba(40,18,5,0.35)' };
const LUZ_AMANHECER = { lado: -1, brilho: 'rgba(255,170,150,0.24)', sombra: 'rgba(40,20,40,0.30)', geral: 'rgba(255,120,120,0.05)' };
const LUZ_CELULAR = { lado: 1, brilho: 'rgba(150,190,255,0.32)', sombra: 'rgba(0,0,12,0.48)', geral: 'rgba(10,16,44,0.22)' };
const LUZ_HOSP = { lado: -1, brilho: 'rgba(230,245,255,0.16)', sombra: 'rgba(20,30,40,0.22)', geral: 'rgba(180,220,230,0.04)' };

// ---------- efeitos de calor ----------
// ondulação do ar quente: desloca faixas horizontais da imagem já desenhada (pós-processo em coordenadas de tela)
function ondasCalor(c, T, { y0 = 560, y1 = H, amp = 5, intens = 1 } = {}) {
  c.save(); c.setTransform(1, 0, 0, 1, 0, 0);
  const h = 6;
  for (let y = y0; y < y1; y += h) {
    const k = (y - y0) / (y1 - y0);
    const dx = Math.sin(y * 0.09 + T * 7.5) * amp * intens * (0.4 + k) + noise1(y * 0.05 + T * 3) * amp * 0.5 * intens;
    c.drawImage(c.canvas, 0, y, W, h, dx, y, W, h);
  }
  c.restore();
}
// névoa quente sobre a cena inteira (céu branco, sol estourado)
function nevoaCalor(c, intens = 1, cor = '255,190,120') {
  c.save(); c.setTransform(1, 0, 0, 1, 0, 0);
  c.fillStyle = vgrad(c, 0, H, [[0, `rgba(${cor},${0.22 * intens})`], [0.5, `rgba(${cor},${0.07 * intens})`], [1, `rgba(${cor},${0.12 * intens})`]]); c.fillRect(0, 0, W, H);
  c.globalCompositeOperation = 'lighter'; c.fillStyle = rgrad(c, W * 0.82, -60, 0, 900, [[0, `rgba(255,236,200,${0.35 * intens})`], [1, 'rgba(255,236,200,0)']]); c.fillRect(0, 0, W, H);
  c.restore();
}
// gotas de suor na testa (desenhar por cima do ator, na posição da cabeça)
function suor(c, T, x, y, s = 1, n = 3) {
  for (let i = 0; i < n; i++) { const f = ((T * 0.4 + i * 0.37) % 1); c.fillStyle = `rgba(210,235,255,${0.75 * (1 - f)})`; c.beginPath(); c.ellipse(x + (i - 1) * 16 * s, y + f * 40 * s, 4 * s, 6 * s, 0, 0, 7); c.fill(); }
}

// ---------- a Pipoca (vira-lata caramelo) ----------
// o: {x, y (chão), s, dir, pose: 'pe'|'andando'|'deitada'|'sentada', fase, ofega 0..1, abana (velocidade do rabo), olhar}
function desenharCachorro(c, T, o = {}) {
  const s = o.s ?? 1, d = o.dir ?? 1, pose = o.pose || 'pe', of = o.ofega ?? 0, ab = o.abana ?? 1;
  const CAR = '#c8873a', CLARO = '#ecc28a', ESC = '#8f5a24';
  c.save(); c.translate(o.x ?? 960, o.y ?? 900); c.scale(s * d, s);
  const resp = Math.sin(T * (of > 0.3 ? 14 : 3)) * (of > 0.3 ? 2.2 : 0.8);
  const deitada = pose === 'deitada', sentada = pose === 'sentada';
  const yC = deitada ? -34 : (sentada ? -70 : -92);
  // pernas
  c.strokeStyle = CAR; c.lineCap = 'round'; c.lineWidth = 15;
  const f = o.fase ?? 0, an = pose === 'andando';
  const pern = (px, fase, escura) => { c.strokeStyle = escura ? ESC : CAR; const a = an ? Math.sin((f + fase) * Math.PI * 2) * 0.45 : 0; c.beginPath(); c.moveTo(px, yC + 14); c.lineTo(px + Math.sin(a) * 50, -6); c.stroke(); };
  if (!deitada) { pern(-48, 0.5, true); pern(40, 0, true); if (!sentada) { pern(-36, 0, false); } pern(52, 0.5, false); }
  else { c.strokeStyle = CAR; c.beginPath(); c.moveTo(40, -12); c.lineTo(96, -8); c.moveTo(30, -10); c.lineTo(86, -2); c.stroke(); }
  // rabo abanando
  const ra = Math.sin(T * 9 * ab) * 0.6 * Math.min(1, ab);
  c.strokeStyle = CAR; c.lineWidth = 11; c.beginPath(); c.moveTo(-66, yC - 4); c.quadraticCurveTo(-96, yC - 30 + ra * 20, -104 + ra * 18, yC - 62 + Math.abs(ra) * 10); c.stroke();
  // corpo
  c.fillStyle = CAR; c.beginPath(); c.ellipse(-6, yC + resp * 0.5, 78, sentada ? 40 : 34, sentada ? -0.5 : 0, 0, 7); c.fill();
  c.fillStyle = CLARO; c.beginPath(); c.ellipse(4, yC + 14 + resp * 0.5, 54, 15, sentada ? -0.5 : 0, 0, 7); c.fill();
  // cabeça
  const hx = sentada ? 52 : 70, hy = (deitada ? -44 : yC - 30) + (deitada ? 0 : resp * 0.3);
  c.fillStyle = CAR; c.beginPath(); c.ellipse(hx, hy, 34, 30, 0, 0, 7); c.fill();
  c.fillStyle = CLARO; c.beginPath(); c.ellipse(hx + 30, hy + 10, 22, 15, 0.1, 0, 7); c.fill(); // focinho
  c.fillStyle = '#2a1a10'; c.beginPath(); c.ellipse(hx + 50, hy + 4, 8, 6, 0, 0, 7); c.fill(); // nariz
  // orelhas: uma em pé, uma caída (charme de vira-lata)
  c.fillStyle = ESC; c.beginPath(); c.moveTo(hx - 18, hy - 22); c.lineTo(hx - 6, hy - 58); c.lineTo(hx + 8, hy - 24); c.fill();
  c.beginPath(); c.moveTo(hx + 6, hy - 24); c.quadraticCurveTo(hx + 30, hy - 30, hx + 26, hy - 4); c.lineTo(hx + 12, hy - 14); c.fill();
  // olho
  const pisca = piscaT(T, 21) > 0.5;
  c.fillStyle = '#1a120c'; if (pisca) c.fillRect(hx + 6, hy - 6, 12, 2.5); else { c.beginPath(); c.arc(hx + 12, hy - 6, 5, 0, 7); c.fill(); c.fillStyle = 'rgba(255,255,255,0.8)'; c.beginPath(); c.arc(hx + 14, hy - 8, 1.6, 0, 7); c.fill(); }
  // boca e língua (ofegando)
  if (of > 0.05) {
    const lg = 10 + of * 16 + Math.max(0, resp) * 2;
    c.fillStyle = '#5a1e1e'; c.beginPath(); c.ellipse(hx + 34, hy + 20, 12, 5 + of * 4, 0.1, 0, 7); c.fill();
    c.fillStyle = '#e8707a'; rr(c, hx + 28, hy + 20, 12, lg, 6); c.fill();
    if (of > 0.6) { c.fillStyle = 'rgba(220,240,255,0.7)'; c.beginPath(); c.ellipse(hx + 34, hy + 22 + lg + ((T * 1.5) % 1) * 30, 3, 5, 0, 0, 7); c.fill(); } // baba
  } else { c.strokeStyle = '#3a2416'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(hx + 36, hy + 18); c.quadraticCurveTo(hx + 28, hy + 24, hx + 20, hy + 18); c.stroke(); }
  // coleira
  c.strokeStyle = '#c0392b'; c.lineWidth = 7; c.beginPath(); c.arc(hx - 10, hy + 6, 24, 1.2, 2.6); c.stroke();
  c.restore();
}
// Pipoca no colo de alguém (objeto de mão)
function pipocaNoColo(T) { return (c, x, y) => { c.save(); desenharCachorro(c, T, { x: x - 10, y: y + 58, s: 0.55, dir: 1, pose: 'deitada', ofega: 0.2, abana: 0.6 }); c.restore(); }; }

// ---------- objetos ----------
function moto(c, x, y, s = 1, dir = 1, { cor = '#c0392b', bau = '#e8b22e', rodaGira = 0 } = {}) {
  c.save(); c.translate(x, y); c.scale(s * dir, s);
  const roda = (rx) => { c.fillStyle = '#1a1a1c'; c.beginPath(); c.arc(rx, -46, 46, 0, 7); c.fill(); c.fillStyle = '#7a7a80'; c.beginPath(); c.arc(rx, -46, 18, 0, 7); c.fill();
    c.strokeStyle = '#4a4a50'; c.lineWidth = 3; for (let i = 0; i < 5; i++) { const a = rodaGira + i * 1.256; c.beginPath(); c.moveTo(rx, -46); c.lineTo(rx + Math.cos(a) * 40, -46 + Math.sin(a) * 40); c.stroke(); } };
  roda(-120); roda(130);
  c.fillStyle = '#2a2a2e'; c.beginPath(); c.moveTo(-120, -46); c.lineTo(-20, -110); c.lineTo(110, -120); c.lineTo(130, -46); c.lineTo(100, -70); c.lineTo(-40, -70); c.fill();
  c.fillStyle = cor; c.beginPath(); c.moveTo(-60, -120); c.quadraticCurveTo(10, -160, 90, -128); c.lineTo(110, -100); c.lineTo(-40, -96); c.fill(); // tanque
  c.fillStyle = '#1a1a1c'; rr(c, -110, -134, 120, 22, 8); c.fill(); // banco
  c.strokeStyle = '#3a3a40'; c.lineWidth = 8; c.beginPath(); c.moveTo(118, -120); c.lineTo(140, -190); c.lineTo(110, -200); c.stroke(); // guidão
  c.fillStyle = '#f2e6b0'; c.beginPath(); c.arc(150, -150, 12, 0, 7); c.fill(); // farol
  if (bau) { c.fillStyle = bau; rr(c, -200, -230, 110, 100, 8); c.fill(); c.fillStyle = 'rgba(0,0,0,0.18)'; c.fillRect(-200, -190, 110, 6); } // baú de entrega
  c.restore();
}
function capacete(c, x, y, s = 1, dir = 1, cor = '#1f3a5a') { c.save(); c.translate(x, y); c.scale(s * dir, s); c.fillStyle = cor; c.beginPath(); c.ellipse(4, -6, 60, 58, 0, Math.PI * 0.95, Math.PI * 2.15); c.fill(); c.fillStyle = 'rgba(30,40,50,0.75)'; rr(c, 20, -20, 46, 26, 10); c.fill(); c.restore(); }
function isopor(c, x, y, s = 1, { cor = '#f2f2ee', tampa = '#3a7fbf', aberto = 0 } = {}) {
  c.save(); c.translate(x, y); c.scale(s, s);
  c.fillStyle = cor; rr(c, -90, -110, 180, 110, 10); c.fill(); c.fillStyle = 'rgba(0,0,0,0.08)'; c.fillRect(-90, -40, 180, 6);
  c.fillStyle = tampa; c.save(); c.translate(-90, -110); c.rotate(-aberto * 1.2); rr(c, 0, -20, 184, 24, 8); c.fill(); c.restore();
  c.fillStyle = '#2a2a2e'; c.fillRect(-100, -86, 12, 30); c.fillRect(88, -86, 12, 30); c.restore();
}
function gerador(c, x, y, s = 1, ligado = 0, T = 0) {
  c.save(); c.translate(x, y); c.scale(s, s);
  const vib = ligado ? Math.sin(T * 60) * 1.5 : 0; c.translate(vib, 0);
  c.strokeStyle = '#1a1a1c'; c.lineWidth = 10; c.strokeRect(-110, -150, 220, 150);
  c.fillStyle = '#d63a2a'; rr(c, -96, -138, 192, 70, 10); c.fill(); // tanque
  c.fillStyle = '#3a3a40'; rr(c, -80, -66, 160, 60, 8); c.fill(); // motor
  c.fillStyle = '#e8b22e'; c.fillRect(-60, -126, 80, 10);
  c.fillStyle = '#6a6a70'; c.fillRect(96, -60, 40, 14); // escapamento
  c.restore();
  if (ligado) for (let i = 0; i < 8; i++) { const f = (T * 0.5 + i / 8) % 1; c.fillStyle = `rgba(90,90,96,${0.35 * (1 - f)})`; c.beginPath(); c.arc(x + (140 + f * 260) * s, y - (54 + f * 180 + Math.sin(T + i) * 20) * s, (14 + f * 70) * s, 0, 7); c.fill(); }
}
function kombi(c, x, y, s = 1, dir = 1, cor = '#e8e4d8', cor2 = '#3a7fbf') {
  c.save(); c.translate(x, y); c.scale(s * dir, s);
  c.fillStyle = cor2; rr(c, -230, -230, 460, 120, 40); c.fill(); c.fillStyle = cor; rr(c, -230, -130, 460, 96, 18); c.fill();
  c.fillStyle = 'rgba(40,60,80,0.75)'; for (let i = 0; i < 3; i++) rr(c, -190 + i * 120, -210, 100, 60, 10), c.fill(); rr(c, 150, -210, 64, 70, 12); c.fill();
  c.fillStyle = '#1a1a1c'; [[-140], [140]].forEach(([rx]) => { c.beginPath(); c.arc(rx, -34, 40, 0, 7); c.fill(); c.fillStyle = '#9a9aa0'; c.beginPath(); c.arc(rx, -34, 14, 0, 7); c.fill(); c.fillStyle = '#1a1a1c'; });
  c.restore();
}
function ambulancia(c, x, y, s = 1, dir = 1, T = 0, sirene = 1) {
  c.save(); c.translate(x, y); c.scale(s * dir, s);
  c.fillStyle = '#f4f4f2'; rr(c, -260, -280, 400, 250, 14); c.fill(); rr(c, 130, -200, 140, 170, 20); c.fill();
  c.fillStyle = '#c62a24'; c.fillRect(-260, -150, 530, 30);
  c.fillStyle = 'rgba(40,60,80,0.7)'; rr(c, 160, -186, 86, 64, 10); c.fill();
  c.fillStyle = '#c62a24'; c.fillRect(-90, -250, 20, 70); c.fillRect(-115, -225, 70, 20); // cruz
  c.fillStyle = '#1a1a1c'; [-170, 170].forEach(rx => { c.beginPath(); c.arc(rx, -30, 44, 0, 7); c.fill(); });
  const on = sirene && Math.sin(T * 14) > 0;
  c.fillStyle = on ? '#3a7fff' : '#c62a24'; rr(c, -40, -300, 90, 22, 8); c.fill();
  c.restore();
  if (sirene) { c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = rgrad(c, x, y - 290 * s, 0, 420 * s, [[0, on ? 'rgba(60,120,255,0.35)' : 'rgba(255,40,40,0.35)'], [1, 'rgba(0,0,0,0)']]); c.fillRect(x - 500 * s, y - 700 * s, 1000 * s, 900 * s); c.restore(); }
}
function caminhaoPipa(c, x, y, s = 1, dir = 1) {
  c.save(); c.translate(x, y); c.scale(s * dir, s);
  c.fillStyle = '#e9e6df'; rr(c, 230, -260, 170, 210, 18); c.fill(); c.fillStyle = 'rgba(40,60,80,0.7)'; rr(c, 260, -240, 110, 70, 10); c.fill();
  c.fillStyle = '#2f6fb0'; rr(c, -320, -250, 540, 190, 90); c.fill(); c.fillStyle = 'rgba(255,255,255,0.2)'; rr(c, -300, -236, 500, 30, 15); c.fill();
  c.fillStyle = '#f2efe9'; c.font = '700 64px Oswald'; c.textAlign = 'center'; c.save(); if (dir < 0) { c.scale(-1, 1); c.fillText('ÁGUA', 50, -130); } else c.fillText('ÁGUA', -50, -130); c.restore(); c.textAlign = 'left';
  c.fillStyle = '#2a2a2e'; c.fillRect(-330, -70, 740, 24);
  c.fillStyle = '#1a1a1c'; [-220, 80, 320].forEach(rx => { c.beginPath(); c.arc(rx, -30, 46, 0, 7); c.fill(); });
  c.fillStyle = '#6a6a70'; c.fillRect(-350, -110, 30, 50); // torneira
  c.restore();
}
function termometroRua(c, x, y, valor, T = 0, s = 1) {
  c.save(); c.translate(x, y); c.scale(s, s);
  c.fillStyle = '#3a3a40'; c.fillRect(-10, 0, 20, 360);
  c.fillStyle = '#111214'; rr(c, -170, -150, 340, 160, 12); c.fill(); c.strokeStyle = '#4a4a50'; c.lineWidth = 6; c.stroke();
  c.fillStyle = Math.sin(T * 3) > -0.6 ? '#ff4a2a' : '#c0301c'; c.font = '700 112px Oswald'; c.textAlign = 'center'; c.textBaseline = 'middle';
  c.shadowColor = 'rgba(255,60,20,0.8)'; c.shadowBlur = 24; c.fillText(valor, 0, -68); c.shadowBlur = 0; c.textAlign = 'left'; c.textBaseline = 'alphabetic';
  c.restore();
}
function leque(cor = '#c0392b', T = 0) { return (c, x, y) => { c.save(); c.translate(x, y); c.rotate(Math.sin(T * 9) * 0.35 - 0.6); c.fillStyle = cor; c.beginPath(); c.moveTo(0, 0); c.arc(0, 0, 54, -2.2, -0.9); c.fill(); c.strokeStyle = 'rgba(0,0,0,0.25)'; c.lineWidth = 2; for (let a = -2.1; a < -0.9; a += 0.2) { c.beginPath(); c.moveTo(0, 0); c.lineTo(Math.cos(a) * 52, Math.sin(a) * 52); c.stroke(); } c.restore(); }; }
function papelaoAbano(T, fase = 0) { return (c, x, y) => { c.save(); c.translate(x, y); c.rotate(Math.sin(T * 8 + fase) * 0.5); c.fillStyle = '#b08a5a'; rr(c, -8, -70, 60, 80, 4); c.fill(); c.restore(); }; }
function bebeColo() { return (c, x, y) => { c.fillStyle = '#f2efe9'; c.beginPath(); c.ellipse(x + 10, y - 6, 34, 22, -0.3, 0, 7); c.fill(); c.fillStyle = '#c08a64'; c.beginPath(); c.arc(x + 36, y - 22, 16, 0, 7); c.fill(); }; }
function garrafaMao(nivel = 1) { return (c, x, y, a) => { c.save(); c.translate(x, y); c.rotate(-a + Math.PI / 2); garrafa(c, 0, 50, 0.55, nivel); c.restore(); }; }
function galaoMao() { return (c, x, y) => galao(c, x, y + 92, 0.9); }
function baldeMao(cor = '#2f5f8a') { return (c, x, y) => balde(c, x - 2, y - 14, 1, cor); }
function panoMolhado(cor = '#e8f0f4') { return (c, x, y, a) => { c.save(); c.translate(x, y); c.rotate(-a); c.fillStyle = cor; rr(c, -18, -6, 36, 42, 6); c.fill(); c.fillStyle = 'rgba(120,170,220,0.35)'; c.fillRect(-18, 18, 36, 18); c.restore(); }; }
function velaMao(T) { return (c, x, y) => vela(c, x, y + 10, T, 0.6); }
function chaves() { return (c, x, y) => { c.strokeStyle = '#c8b070'; c.lineWidth = 4; c.beginPath(); c.arc(x, y, 14, 0, 7); c.stroke(); for (let i = 0; i < 5; i++) { c.save(); c.translate(x, y + 10); c.rotate(-0.6 + i * 0.3); c.fillStyle = '#c8b070'; c.fillRect(-2, 0, 5, 34); c.restore(); } }; }
function insulinaCaixa(c, x, y, s = 1) { c.save(); c.translate(x, y); c.scale(s, s); c.fillStyle = '#f4f4f2'; rr(c, -40, -26, 80, 26, 4); c.fill(); c.fillStyle = '#3a7fbf'; c.fillRect(-40, -20, 80, 6); c.fillStyle = '#c62a24'; c.fillRect(-34, -10, 18, 6); c.restore(); }

// ---------- ator (versão do Vídeo 3): igual ao do Vídeo 2, com olhos fechados, sentar sem cadeira e suor ----------
// o: {..., olhosFechados, sentadoBanco (sem cadeira dobrável, pernas dobradas), suor}
ator = function (c, T, nome, o = {}) {
  const boca = fala(nome, T), fal = boca > 0.02 || falando(nome, T), sd = SEED[nome] || 1;
  const vis = VIS_DE[nome] || nome, V = VISUAIS[vis];
  const g = gesto(T, fal, sd);
  let P = { x: o.x ?? 960, y: o.y ?? 690, s: o.s ?? 1, dir: o.dir ?? 1, boca, piscar: o.olhosFechados ? 1 : piscaT(T, sd), expr: o.expr ?? exprAuto(nome, T, o.repouso ?? ''),
    cabeca: { giro: o.giro ?? 0.05, incl: o.incl ?? 0 }, olhar: o.olhar ?? 0.2,
    bracoF: o.bracoF ?? g, bracoT: o.bracoT ?? [-0.05 + (fal ? Math.sin(T * 2.7 + sd) * 0.18 : 0), 0.3],
    objeto: o.objeto, objetoT: o.objetoT, costas: o.costas, luz: o.luz ?? LUZ_CASA, alpha: o.alpha, silhueta: o.silhueta };
  if (o.andar !== undefined) { const cm = caminhada(o.andar, o.intens ?? 1); P = { ...P, ...cm, y: P.y + cm.bob, bracoF: o.bracoF ?? cm.bracoF, bracoT: o.bracoT ?? cm.bracoT }; }
  if (o.sentado) {
    P.pernaF = [1.5, -1.45]; P.pernaT = [1.45, -1.4]; P.pePlano = true;
    const sx = P.x, sy = P.y + 14 * P.s, d = P.dir;
    c.fillStyle = '#5a5e66'; rr(c, sx - 60 * P.s, sy, 120 * P.s, 16 * P.s, 4); c.fill();
    c.strokeStyle = '#3a3d44'; c.lineWidth = 7 * P.s; c.beginPath(); c.moveTo(sx - 50 * P.s * d, sy); c.lineTo(sx - 50 * P.s * d, sy - 120 * P.s);
    c.moveTo(sx - 50 * P.s, sy + 14 * P.s); c.lineTo(sx + 50 * P.s, sy + 140 * P.s); c.moveTo(sx + 50 * P.s, sy + 14 * P.s); c.lineTo(sx - 50 * P.s, sy + 140 * P.s); c.stroke();
  }
  if (o.sentadoBanco) { P.pernaF = [1.5, -1.45]; P.pernaT = [1.45, -1.4]; P.pePlano = true; }
  if (o.sentadoChao) { P.pernaF = [1.5, 0.05]; P.pernaT = [1.45, 0.05]; P.pePlano = true; }
  if (o.andar === undefined) P.cabeca.incl += Math.sin(T * 1.6 + sd) * 0.012;
  if (fal && o.andar === undefined) P.cabeca.giro += Math.sin(T * 2.1 + sd) * 0.04;
  desenharPessoa(c, P, V);
  if (o.suor) { const alt = (V.altura || 1) * P.s; suor(c, T, P.x + 30 * P.dir * P.s, P.y - 300 * alt, P.s, 3); }
};
// personagem deitado (cabeça para o lado `cabeca`: -1 esquerda, 1 direita). x,y = centro do corpo no chão/cama.
function deitado(c, T, nome, x, y, s = 1, { cabeca = -1, ...o } = {}) {
  c.save(); c.translate(x, y); c.rotate(cabeca < 0 ? -Math.PI / 2 : Math.PI / 2);
  ator(c, T, nome, { x: 0, y: 0, s, dir: cabeca < 0 ? 1 : -1, bracoF: [0.1, 0.15], bracoT: [-0.1, 0.15], ...o });
  c.restore();
}
// tela de celular grande (closes): bateria, sinal e textos
function telaCelularGrande(c, T, { bateria = 2, semServico = 1, texto = '', sub = '', cor = '#0e1116' } = {}) {
  c.fillStyle = '#0a0a0c'; c.fillRect(0, 0, W, H);
  c.save(); c.translate(960, 560); c.rotate(-0.03 + Math.sin(T * 1.3) * 0.006);
  c.fillStyle = '#1a1a1e'; rr(c, -300, -520, 600, 1060, 60); c.fill(); c.fillStyle = cor; rr(c, -276, -496, 552, 1012, 44); c.fill();
  c.fillStyle = '#f2efe9'; c.font = '600 34px Inter'; c.fillText(semServico ? 'SEM SERVIÇO' : '', -240, -440);
  const piscaBat = bateria <= 5 && Math.sin(T * 6) > 0; c.strokeStyle = '#f2efe9'; c.lineWidth = 4; c.strokeRect(150, -466, 70, 32); c.fillStyle = piscaBat ? '#e03a2a' : '#f2efe9'; c.fillRect(154, -462, Math.max(4, 62 * bateria / 100), 24);
  c.fillStyle = '#e03a2a'; c.font = '700 34px Inter'; c.fillText(bateria + '%', 70, -440);
  if (texto) { c.fillStyle = '#f2efe9'; c.font = '700 64px Oswald'; c.textAlign = 'center'; c.fillText(texto, 0, -40); c.font = '400 34px Inter'; c.fillStyle = 'rgba(242,239,233,0.8)'; c.fillText(sub, 0, 30); c.textAlign = 'left'; }
  c.restore();
}
// faixa informativa (orientação de segurança) na parte de baixo, acima da legenda
function faixaInfo(c, t, linhas, { dur = 99 } = {}) {
  const a = sstep(0, 0.4, t) * (1 - sstep(dur - 0.4, dur, t)); if (a <= 0) return;
  c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = a;
  const h = 64 + 46 * (linhas.length - 1); c.fillStyle = 'rgba(10,10,12,0.78)'; rr(c, 80, 90, 900, h, 12); c.fill(); c.fillStyle = '#c62a24'; c.fillRect(80, 90, 10, h);
  c.fillStyle = '#f2efe9'; linhas.forEach((l, i) => { c.font = (i === 0 ? '700 38px Oswald' : '600 30px Inter'); c.fillText(l, 112, 140 + i * 46); });
  c.restore();
}
