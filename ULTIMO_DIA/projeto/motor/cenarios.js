// ÚLTIMO DIA — cenários, objetos, luz e tomadas reutilizáveis entre episódios.
'use strict';
const LUZ = {
  dia: { lado: -1, brilho: 'rgba(170,195,230,0.22)', sombra: 'rgba(4,8,20,0.55)', geral: 'rgba(18,30,52,0.15)' },
  diaD: { lado: 1, brilho: 'rgba(170,195,230,0.22)', sombra: 'rgba(4,8,20,0.55)', geral: 'rgba(18,30,52,0.15)' },
  rua: { lado: -1, brilho: 'rgba(200,205,210,0.2)', sombra: 'rgba(0,0,0,0.4)' },
  calor: { lado: -1, brilho: 'rgba(255,170,90,0.28)', sombra: 'rgba(30,10,0,0.5)', geral: 'rgba(120,60,10,0.12)' },
  vela: { lado: 1, brilho: 'rgba(255,170,80,0.35)', sombra: 'rgba(0,0,0,0.75)', geral: 'rgba(40,15,0,0.25)' },
  velaE: { lado: -1, brilho: 'rgba(255,170,80,0.35)', sombra: 'rgba(0,0,0,0.75)', geral: 'rgba(40,15,0,0.25)' },
  noite: { lado: -1, brilho: 'rgba(90,120,170,0.18)', sombra: 'rgba(0,0,8,0.8)', geral: 'rgba(5,10,30,0.45)' },
  lanterna: { lado: 1, brilho: 'rgba(230,230,210,0.35)', sombra: 'rgba(0,0,5,0.8)', geral: 'rgba(5,8,20,0.3)' },
  acesa: { lado: -1, brilho: 'rgba(255,230,180,0.3)', sombra: 'rgba(0,0,0,0.35)', geral: 'rgba(60,40,10,0.05)' },
};
const falar = (t, on = 1, seed = 0) => on ? clamp(0.25 + 0.75 * Math.abs(Math.sin(t * 10.5 + seed) * noise1(t * 3 + seed))) * 1.0 : 0;
const piscar = (t, seed = 0) => ((t + seed * 1.37) % 3.7) < 0.12 ? 1 : 0;

// ---------- luz: escuridão com fontes de luz (vela, lanterna, janela) ----------
function escuridao(c, alpha, fontes = [], cor = '2,3,10') {
  const b = buf('escuro'), k = b.getContext('2d');
  k.setTransform(1, 0, 0, 1, 0, 0); k.clearRect(0, 0, W, H);
  k.fillStyle = `rgba(${cor},${alpha})`; k.fillRect(0, 0, W, H);
  k.setTransform(c.getTransform());
  k.globalCompositeOperation = 'destination-out';
  for (const f of fontes) { k.fillStyle = rgrad(k, f.x, f.y, 0, f.r, [[0, `rgba(0,0,0,${f.forca ?? 1})`], [1, 'rgba(0,0,0,0)']]); k.fillRect(f.x - f.r, f.y - f.r, f.r * 2, f.r * 2); }
  k.globalCompositeOperation = 'source-over';
  c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.drawImage(b, 0, 0); c.restore();
  c.save(); c.globalCompositeOperation = 'lighter';
  for (const f of fontes) if (f.cor) { c.fillStyle = rgrad(c, f.x, f.y, 0, f.r * 0.7, [[0, f.cor], [1, 'rgba(0,0,0,0)']]); c.fillRect(f.x - f.r, f.y - f.r, f.r * 2, f.r * 2); }
  c.restore();
}
const tremula = (t, s = 0) => 1 + 0.06 * noise1(t * 9 + s) + 0.03 * noise1(t * 23 + s);
function vela(c, x, y, t, s = 1) {
  c.save(); c.translate(x, y); c.scale(s, s);
  c.fillStyle = '#e8e0cc'; rr(c, -9, -60, 18, 60, 3); c.fill();
  c.fillStyle = '#ffcf6a'; c.beginPath(); c.ellipse(noise1(t * 7) * 1.5, -72, 5, 12 * tremula(t), 0, 0, 7); c.fill();
  c.fillStyle = '#fff3c8'; c.beginPath(); c.ellipse(0, -69, 2, 5, 0, 0, 7); c.fill();
  c.restore();
}
const fonteVela = (x, y, t, r = 520) => ({ x, y: y - 70, r: r * tremula(t), cor: 'rgba(255,150,60,0.35)' });

// ---------- textos de tela ----------
function rotulo(c, t, txt, x = 90, y = 980, dur = 99) {
  const a = sstep(0.3, 0.9, t) * (1 - sstep(dur - 0.5, dur, t)); if (a <= 0) return;
  c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = a; c.font = '400 34px Oswald'; c.fillStyle = PAL.texto; c.fillText(txt, x, y);
  c.fillStyle = PAL.vermelhoVivo; c.fillRect(x, y + 18, 110 * a, 4); c.restore();
}
function textoGrande(c, t, linhas, {y = 470, tam = 120, cor = PAL.texto, sub = null} = {}) {
  c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.textAlign = 'center'; c.textBaseline = 'middle';
  linhas.forEach((l, i) => { const a = sstep(0.15 + i * 0.35, 0.7 + i * 0.35, t); c.globalAlpha = a; c.font = `700 ${tam}px Oswald`; c.fillStyle = cor; c.fillText(l, W / 2, y + i * tam * 1.1 + (1 - a) * 20); });
  if (sub) { c.globalAlpha = sstep(0.8, 1.4, t); c.font = '400 40px Oswald'; c.fillStyle = 'rgba(242,239,233,0.8)'; c.fillText(sub, W / 2, y + linhas.length * tam * 1.1 + 20); }
  c.restore();
}
function placa(c, x, y, txt, {tam = 34, fundo = '#efe9da', cor = '#1a1a1a', ang = 0, fonte = '700', larg = null} = {}) {
  c.save(); c.translate(x, y); c.rotate(ang); c.font = `${fonte} ${tam}px Oswald`;
  const w = larg || c.measureText(txt).width + tam; c.fillStyle = fundo; rr(c, -w / 2, -tam * 0.85, w, tam * 1.7, 4); c.fill();
  c.fillStyle = cor; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(txt, 0, 2); c.restore();
}
function manuscrito(c, x, y, txt, prog, {tam = 30, cor = '#1c2a4a', ang = 0} = {}) {
  const n = Math.floor(txt.length * clamp(prog)); if (n <= 0) return;
  c.save(); c.translate(x, y); c.rotate(ang); c.font = `italic 400 ${tam}px Inter`; c.fillStyle = cor; c.textBaseline = 'middle'; c.fillText(txt.slice(0, n), 0, 0); c.restore();
}

// ---------- objetos ----------
function balde(c, x, y, cheio = 1, cor = '#2f5f8a') {
  c.save(); c.translate(x, y);
  c.strokeStyle = '#999'; c.lineWidth = 3; c.beginPath(); c.arc(0, 22, 30, Math.PI * 1.1, Math.PI * 1.9); c.stroke();
  c.fillStyle = cor; c.beginPath(); c.moveTo(-32, 20); c.lineTo(32, 20); c.lineTo(25, 86); c.lineTo(-25, 86); c.fill();
  c.fillStyle = 'rgba(255,255,255,0.12)'; c.fillRect(-30, 24, 60, 6);
  if (cheio) { c.fillStyle = 'rgba(140,190,230,0.5)'; c.beginPath(); c.ellipse(0, 22, 31, 6, 0, 0, 7); c.fill(); }
  c.restore();
}
const segBalde = (cor) => (k, x, y) => balde(k, x - 2, y - 14, 1, cor);
function galao(c, x, y, s = 1) { c.save(); c.translate(x, y); c.scale(s, s); c.fillStyle = 'rgba(200,220,235,0.75)'; rr(c, -30, -90, 60, 90, 10); c.fill(); c.fillStyle = '#2a6aa0'; c.fillRect(-12, -104, 24, 16); c.fillStyle = 'rgba(80,140,200,0.4)'; c.fillRect(-28, -60, 56, 58); c.restore(); }
function garrafa(c, x, y, s = 1, nivel = 1) { c.save(); c.translate(x, y); c.scale(s, s); c.fillStyle = 'rgba(210,225,235,0.6)'; rr(c, -18, -110, 36, 110, 8); c.fill(); c.fillRect(-7, -130, 14, 22); c.fillStyle = '#2a6aa0'; c.fillRect(-8, -138, 16, 10); c.fillStyle = 'rgba(90,150,210,0.45)'; c.fillRect(-16, -110 * nivel + 2, 32, 110 * nivel - 4); c.restore(); }
function radio(c, x, y, s = 1, ligado = 0, t = 0) {
  c.save(); c.translate(x, y); c.scale(s, s);
  c.fillStyle = '#5a3a22'; rr(c, -160, -110, 320, 200, 18); c.fill();
  c.fillStyle = '#3a2516'; rr(c, -150, -100, 300, 180, 14); c.fill();
  c.fillStyle = '#c9b48a'; for (let i = 0; i < 9; i++) for (let j = 0; j < 6; j++) { c.beginPath(); c.arc(-120 + i * 13, -60 + j * 16, 3.5, 0, 7); c.fill(); }
  c.fillStyle = ligado ? '#f2d38a' : '#bba67a'; rr(c, 10, -70, 120, 40, 4); c.fill();
  c.strokeStyle = '#3a2516'; c.lineWidth = 2; for (let i = 0; i < 10; i++) { c.beginPath(); c.moveTo(18 + i * 11, -70); c.lineTo(18 + i * 11, -58); c.stroke(); }
  c.strokeStyle = '#a0201a'; c.lineWidth = 3; const ag = 30 + 80 * (0.5 + 0.5 * Math.sin(t * 0.8)) * (ligado ? 0.3 : 1); c.beginPath(); c.moveTo(10 + ag, -72); c.lineTo(10 + ag, -28); c.stroke();
  [40, 105].forEach(kx => { c.fillStyle = '#20140c'; c.beginPath(); c.arc(kx, 30, 22, 0, 7); c.fill(); c.fillStyle = '#7a6a50'; c.beginPath(); c.arc(kx, 30, 8, 0, 7); c.fill(); });
  c.strokeStyle = '#999'; c.lineWidth = 4; c.beginPath(); c.moveTo(120, -110); c.lineTo(190, -260); c.stroke();
  if (ligado) { c.fillStyle = rgrad(c, 70, -50, 0, 120, [[0, 'rgba(255,210,120,0.35)'], [1, 'rgba(255,210,120,0)']]); c.fillRect(-60, -170, 260, 240); }
  c.restore();
}
function cadeiraMadeira(c, x, y, s = 1) { c.save(); c.translate(x, y); c.scale(s, s); c.fillStyle = '#6a4528'; c.fillRect(-60, -10, 120, 16); c.fillRect(-56, 0, 12, 110); c.fillRect(44, 0, 12, 110); c.fillRect(-60, -170, 14, 170); c.fillRect(-60, -170, 30, 14); c.fillStyle = '#7d5532'; c.fillRect(-60, -80, 120, 12); c.restore(); }
function mesa(c, x, y, w = 520, cor = '#3a2a1d') { c.fillStyle = cor; c.fillRect(x - w / 2, y, w, 22); c.fillStyle = shade(cor, 0.7); c.fillRect(x - w / 2 + 20, y + 22, 16, 200); c.fillRect(x + w / 2 - 36, y + 22, 16, 200); }
function janelaNoite(c, x, y, w, h, t, estrelas = 1) {
  c.save(); c.beginPath(); c.rect(x, y, w, h); c.clip();
  c.fillStyle = vgrad(c, y, y + h, [[0, '#070b16'], [1, '#141a28']]); c.fillRect(x, y, w, h);
  if (estrelas) particulas(c, t, 40, 8, { area: [x, y, w, h * 0.6], cor: '#dfe6ff', tam: [0.6, 1.6], vel: [0, 0, 0, 0], brilho: 0.8 });
  skyline(c, 90, y + h + 10, h * 0.55, '#05070c');
  c.restore(); c.strokeStyle = '#08090b'; c.lineWidth = 18; c.strokeRect(x, y, w, h);
}

// ---------- ambientes ----------
function cozinha(c, t, {geladeira = 'fechada', podre = 0} = {}) {
  c.fillStyle = vgrad(c, 0, H, [[0, '#20262b'], [1, '#15191d']]); c.fillRect(-400, -300, W + 800, H + 600);
  for (let i = 0; i < 18; i++) for (let j = 0; j < 6; j++) { c.strokeStyle = 'rgba(255,255,255,0.035)'; c.lineWidth = 2; c.strokeRect(-200 + i * 70, 330 + j * 70, 70, 70); }
  c.fillStyle = '#2b2520'; c.fillRect(-300, 630, 1100, 330); c.fillStyle = '#3c3833'; c.fillRect(-300, 610, 1110, 26);
  // pia e torneira
  c.fillStyle = '#6d7276'; rr(c, 120, 596, 260, 22, 6); c.fill(); c.fillStyle = '#8a8f93'; c.fillRect(240, 520, 14, 80); c.fillRect(240, 520, 70, 14);
  // fogão
  c.fillStyle = '#d2cec6'; c.fillRect(480, 600, 240, 360); c.fillStyle = '#1a1a1a'; c.fillRect(480, 600, 240, 18);
  c.fillStyle = '#222'; rr(c, 510, 690, 180, 120, 8); c.fill();
  c.fillStyle = '#18140f'; c.fillRect(-400, 960, W + 800, 400);
  // geladeira simples
  c.fillStyle = vgrad(c, 230, 960, [[0, '#9b9a95'], [1, '#6f6e6a']]); c.fillRect(1050, 230, 380, 730);
  c.fillStyle = 'rgba(0,0,0,0.25)'; c.fillRect(1050, 480, 380, 6); c.fillStyle = '#4b4a47'; rr(c, 1068, 300, 14, 160, 6); c.fill(); rr(c, 1068, 520, 14, 200, 6); c.fill();
}
function geladeiraAberta(c, t, podre = 0, acesa = 0) {
  const fx = 1050, fy = 230, fw = 380, fh = 730;
  c.fillStyle = acesa ? '#e8ecef' : '#0c0f12'; c.fillRect(fx, fy, fw, fh);
  c.fillStyle = acesa ? 'rgba(255,255,255,0.9)' : vgrad(c, fy, fy + fh, [[0, '#1a1f24'], [1, '#0c0f12']]); c.fillRect(fx + 12, fy + 12, fw - 24, fh - 24);
  for (let s = 1; s < 5; s++) { c.fillStyle = 'rgba(150,170,190,0.4)'; c.fillRect(fx + 12, fy + s * 140, fw - 24, 5); }
  const itens = [[1110, 330, 40, 90, '#2d3a2a'], [1170, 350, 70, 70, '#3a2f22'], [1300, 470, 90, 70, '#6a2a2a'], [1120, 600, 60, 110, '#d8d8d0'], [1250, 610, 120, 60, '#7a3030']];
  itens.forEach(([x, y, w, h, col], i) => { c.fillStyle = podre ? (i % 2 ? '#4a5a2a' : '#5a4a2a') : col; rr(c, x, y, w, h, 8); c.fill(); });
  if (podre) { particulas(c, t, 14, 33, { area: [fx - 100, fy, fw + 200, 500], cor: '#111', tam: [2, 3.5], vel: [-60, 60, -40, 40], brilho: 1 });
    c.fillStyle = `rgba(120,140,40,${0.12 * podre})`; c.fillRect(fx - 200, fy - 100, fw + 400, fh + 200); }
  c.fillStyle = '#2a2d31'; c.beginPath(); c.moveTo(fx + fw, fy); c.lineTo(fx + fw + 170, fy - 30); c.lineTo(fx + fw + 170, fy + fh + 30); c.lineTo(fx + fw, fy + fh); c.fill();
  if (acesa) { c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = rgrad(c, fx + fw / 2, fy + 300, 0, 700, [[0, 'rgba(220,235,255,0.35)'], [1, 'rgba(0,0,0,0)']]); c.fillRect(fx - 700, fy - 400, 1800, 1500); c.restore(); }
}
function corredor(c, t, {portaAberta = null, luzFim = 1} = {}) {
  c.fillStyle = vgrad(c, 0, H, [[0, '#262b29'], [0.78, '#1d2120'], [0.79, '#3a3631'], [1, '#2a2622']]); c.fillRect(-600, -200, 4400, 1500);
  c.fillStyle = '#151816'; c.fillRect(-600, 836, 4400, 16);
  ['91', '92', '93', '94', '95', '96', '97'].forEach((n, i) => {
    const dx = 200 + i * 400;
    c.fillStyle = n === portaAberta ? '#0b0b0c' : '#3a2a1f'; c.fillRect(dx, 330, 170, 510); c.strokeStyle = '#1e1611'; c.lineWidth = 10; c.strokeRect(dx, 330, 170, 510);
    c.fillStyle = '#b39a6a'; c.beginPath(); c.arc(dx + 145, 590, 8, 0, 7); c.fill();
    c.fillStyle = '#c8bfae'; c.font = '600 30px Inter'; c.textAlign = 'center'; c.fillText(n, dx + 85, 380); c.textAlign = 'left';
  });
  for (let i = 0; i < 6; i++) { c.fillStyle = '#c9c6bd'; rr(c, 380 + i * 560, 200, 90, 30, 4); c.fill(); }
}
const PORTA_X = n => 200 + (n - 91) * 400; // x da porta do apartamento 9n
function escada(c, t, andar = 9, {lanterna = null, janela = 1} = {}) {
  c.fillStyle = vgrad(c, 0, H, [[0, '#2a2c2b'], [1, '#1b1c1b']]); c.fillRect(-600, -400, W + 1200, H + 800);
  if (janela) { c.fillStyle = '#7c8a96'; c.fillRect(1500, 160, 160, 200); c.strokeStyle = '#111'; c.lineWidth = 10; c.strokeRect(1500, 160, 160, 200); c.fillStyle = 'rgba(150,170,190,0.08)'; c.beginPath(); c.moveTo(1500, 160); c.lineTo(1660, 360); c.lineTo(900, 1000); c.lineTo(500, 1000); c.fill(); }
  c.font = '700 260px Oswald'; c.fillStyle = 'rgba(200,190,160,0.16)'; c.textAlign = 'center'; c.fillText(String(andar), 560, 480); c.textAlign = 'left';
  c.font = '600 32px Inter'; c.fillStyle = 'rgba(200,190,160,0.22)'; c.fillText('ANDAR', 490, 530);
  // lance de escada: de (300,980) a (1500,500)
  c.fillStyle = '#3d3e3c';
  c.beginPath(); c.moveTo(-200, 980); c.lineTo(300, 980); for (let i = 0; i < 14; i++) { const x = 300 + i * 86, y = 980 - i * 34; c.lineTo(x, y - 34); c.lineTo(x + 86, y - 34); } c.lineTo(2200, 504); c.lineTo(2200, 1400); c.lineTo(-200, 1400); c.fill();
  c.fillStyle = 'rgba(255,255,255,0.06)'; for (let i = 0; i < 14; i++) c.fillRect(300 + i * 86, 980 - (i + 1) * 34, 86, 4);
  c.strokeStyle = '#6a6c6a'; c.lineWidth = 7; c.beginPath(); c.moveTo(250, 880); c.lineTo(1520, 380); c.stroke();
  for (let i = 0; i < 8; i++) { c.lineWidth = 4; c.beginPath(); const x = 300 + i * 170; c.moveTo(x, 860 - i * 67); c.lineTo(x, 980 - i * 67 - 34); c.stroke(); }
  if (lanterna) escuridao(c, 0.82, [lanterna]);
}
const noDegrau = u => [300 + u * 1204, 980 - u * 476]; // posição (pés) ao longo do lance, u de 0 a 1
function garagem(c, t, {noite = 0, cozinha = 0} = {}) {
  c.fillStyle = vgrad(c, 0, H, [[0, '#2b2c2c'], [0.7, '#252626'], [0.71, '#3a3a38'], [1, '#2c2c2a']]); c.fillRect(-600, -300, W + 1200, H + 600);
  for (let i = 0; i < 5; i++) { const x = -100 + i * 520; c.fillStyle = '#3c3d3c'; c.fillRect(x, 0, 90, 770); c.fillStyle = '#c9a43a'; c.fillRect(x, 640, 90, 30); c.fillStyle = '#1e1e1e'; for (let k = 0; k < 3; k++) c.fillRect(x, 646 + k * 8, 90, 3); }
  for (let i = 0; i < 9; i++) { c.fillStyle = 'rgba(230,220,180,0.25)'; c.fillRect(-300 + i * 300, 860, 8, 220); }
  c.fillStyle = '#1b1c1c'; c.fillRect(-600, 0, W + 1200, 60);
  if (cozinha) {
    [[420, '#d2cec6'], [820, '#c9c4bb'], [1220, '#d6d0c4']].forEach(([x, cor], i) => {
      c.fillStyle = cor; c.fillRect(x, 620, 200, 260); c.fillStyle = '#1a1a1a'; c.fillRect(x, 620, 200, 14);
      c.fillStyle = '#6d7276'; rr(c, x + 40, 560, 120, 64, 10); c.fill();
      c.fillStyle = '#3a6ab0'; c.globalAlpha = 0.8; c.beginPath(); c.ellipse(x + 100, 626, 50, 6 * tremula(t, i), 0, 0, 7); c.fill(); c.globalAlpha = 1;
      particulas(c, t, 10, 40 + i, { area: [x + 30, 360, 140, 200], cor: 'rgba(230,230,230,0.25)', tam: [8, 20], vel: [-10, 10, -60, -30], brilho: 0.6 });
      c.fillStyle = '#7a5a3a'; c.fillRect(x + 60, 880, 80, 90); // botijão
      c.fillStyle = '#9a3a2a'; rr(c, x + 70, 860, 60, 30, 8); c.fill();
    });
    c.fillStyle = '#e9e4d6'; rr(c, 1520, 300, 260, 300, 6); c.fill();
    c.font = '700 30px Oswald'; c.fillStyle = '#222'; c.fillText('ESCALAS', 1580, 345);
    c.font = '400 20px Inter'; ['Cozinha', 'Água', 'Limpeza', 'Portão', 'Despensa'].forEach((l, i) => { c.fillText(l, 1545, 390 + i * 40); c.fillStyle = '#555'; c.fillRect(1660, 382 + i * 40, 90, 3); c.fillStyle = '#222'; });
  }
}
function cadeirasPlastico(c, xs, y) { xs.forEach(x => { c.fillStyle = '#d8d4c8'; c.fillRect(x - 40, y, 80, 12); c.fillRect(x - 36, y, 8, 80); c.fillRect(x + 28, y, 8, 80); c.fillRect(x - 40, y - 100, 10, 100); }); }
function hall(c, t, {nomes = 0, cabecalho = 1, noite = 0} = {}) {
  c.fillStyle = vgrad(c, 0, H, [[0, '#2c2a26'], [0.8, '#24221f'], [0.81, '#4a4640'], [1, '#3a3631']]); c.fillRect(-600, -300, W + 1200, H + 600);
  // parede da lista
  c.fillStyle = '#d9d3c2'; c.fillRect(260, 180, 760, 560); c.strokeStyle = '#8a8270'; c.lineWidth = 4; c.strokeRect(260, 180, 760, 560);
  manuscrito(c, 300, 240, 'QUEM PRECISA DE AJUDA,', cabecalho, { tam: 34, cor: '#7a1a14' });
  manuscrito(c, 300, 290, 'COLOQUE O NOME AQUI', cabecalho, { tam: 34, cor: '#7a1a14' });
  const lista = ['Dona Cida, 94', 'Sr. Osvaldo, 72', 'Marli, 61', 'Família Souza, 53', 'Joaquim, 104', 'Ana e bebê, 33', 'Seu Pedro, 81', 'Rita, 42', 'Dona Lurdes, 112', 'Cláudio, 23', 'Neide, 64'];
  lista.forEach((n, i) => manuscrito(c, i < 6 ? 310 : 660, 360 + (i % 6) * 58, (i + 1) + '. ' + n, clamp(nomes * 11 - i), { tam: 27, ang: (i % 3 - 1) * 0.015 }));
  // caixas de correio e porta de vidro
  c.fillStyle = '#5a5248'; c.fillRect(1180, 300, 300, 300); c.strokeStyle = '#3a342c'; c.lineWidth = 3; for (let i = 0; i < 5; i++) for (let j = 0; j < 5; j++) c.strokeRect(1180 + i * 60, 300 + j * 60, 60, 60);
  c.fillStyle = '#121518'; c.fillRect(1600, 120, 380, 720); c.fillStyle = 'rgba(140,160,180,0.15)'; c.fillRect(1620, 140, 160, 680); c.fillRect(1800, 140, 160, 680);
}
function portaria(c, t, {noite = 1, aberto = 0, parte = 'tudo'} = {}) {
  // vista de dentro para o portão; parte: 'fundo' (sem grade), 'grade' (só grade e mesa) ou 'tudo'
  if (parte !== 'grade') {
  c.fillStyle = noite ? '#0b0d12' : '#8d959c'; c.fillRect(-600, -300, W + 1200, H + 600);
  skyline(c, 140, 700, 380, noite ? '#05060a' : '#5d6369');
  c.fillStyle = noite ? '#15161a' : '#3d3e40'; c.fillRect(-600, 700, W + 1200, 500);
  }
  if (parte === 'fundo') return;
  // portão de grades (abre para a direita)
  const ox = 600 + aberto * 560;
  c.fillStyle = '#26282c'; c.fillRect(560, 250, 40, 600); c.fillRect(1380, 250, 40, 600);
  c.save(); c.translate(ox, 0); c.fillStyle = '#2c2f34'; c.fillRect(0, 280, 780, 18); c.fillRect(0, 820, 780, 18);
  for (let i = 0; i < 16; i++) c.fillRect(i * 50 + 10, 280, 12, 556); c.restore();
  c.fillStyle = '#1e2024'; c.fillRect(1400, 520, 60, 80); c.fillStyle = '#300'; c.beginPath(); c.arc(1430, 545, 7, 0, 7); c.fill(); // fechadura elétrica sem luz
  // mesa da portaria em primeiro plano
  c.fillStyle = '#2a211a'; c.fillRect(-100, 900, 800, 40); c.fillRect(0, 940, 30, 200);
}
function salao(c, t, {cama = 1} = {}) {
  c.fillStyle = vgrad(c, 0, H, [[0, '#3a3230'], [0.78, '#302926'], [0.79, '#6a5c4c'], [1, '#4c4236']]); c.fillRect(-600, -300, W + 1200, H + 600);
  for (let i = 0; i < 6; i++) { c.strokeStyle = 'rgba(255,220,160,0.15)'; c.lineWidth = 2; c.beginPath(); c.moveTo(-100 + i * 420, 120); c.quadraticCurveTo(110 + i * 420, 200, 320 + i * 420, 120); c.stroke(); }
  c.fillStyle = '#6a7a8a'; c.fillRect(120, 200, 300, 380); c.strokeStyle = '#1a1a1a'; c.lineWidth = 14; c.strokeRect(120, 200, 300, 380);
  if (cama) { c.fillStyle = '#4a4a52'; c.fillRect(1180, 760, 560, 50); c.fillStyle = '#c8c2b4'; rr(c, 1170, 700, 580, 70, 12); c.fill(); c.fillStyle = '#e0dbd0'; rr(c, 1190, 660, 160, 60, 24); c.fill(); c.fillStyle = '#6a4a6a'; rr(c, 1380, 690, 360, 60, 14); c.fill(); }
}
function laje(c, t, {noite = 0, chuva = 0} = {}) {
  if (noite) { c.fillStyle = vgrad(c, -300, 700, [[0, '#04060d'], [1, '#121827']]); c.fillRect(-800, -400, W + 1600, 1200); particulas(c, t, 120, 3, { area: [-400, -300, W + 800, 800], cor: '#dfe6ff', tam: [0.6, 1.8], vel: [0, 0, 0, 0], brilho: 0.8 }); }
  else ceuNublado(c, t, -400, 720);
  if (chuva) { c.fillStyle = `rgba(30,35,45,${0.5 * chuva})`; c.fillRect(-800, -400, W + 1600, 1200); }
  skyline(c, 160, 740, 420, noite ? '#060810' : '#646b72', { janelas: noite ? 0.0 : 0 });
  c.fillStyle = noite ? '#1a1b1e' : '#6c6a64'; c.fillRect(-800, 740, W + 1600, 600);
  c.fillStyle = noite ? '#111' : '#55534d'; c.fillRect(-800, 730, W + 1600, 18);
  c.fillStyle = noite ? '#16171a' : '#4c4b47'; c.fillRect(1420, 380, 380, 360); c.fillStyle = noite ? '#101114' : '#3d3c39'; c.fillRect(1420, 380, 380, 40); // caixa d'água
}
function chuvaFx(c, t, intens = 1, seed = 7) {
  const r = rng(seed); c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.strokeStyle = `rgba(200,215,230,${0.35 * intens})`; c.lineWidth = 1.6;
  for (let i = 0; i < 420 * intens; i++) { const x = (r() * W * 1.2 + t * 220) % (W * 1.2) - 100, y = (r() * H + t * (1300 + r() * 300)) % (H + 60) - 30; c.beginPath(); c.moveTo(x, y); c.lineTo(x - 7, y + 32); c.stroke(); }
  c.restore();
}
function fachada(c, t, nome, {cor = '#7a6a54', grade = 0, letreiro = '#8e1b1b', vitrine = '#1a1e22'} = {}) {
  ceuNublado(c, t, -300, 300);
  c.fillStyle = '#5f6266'; c.fillRect(-600, -300, W + 1200, 600); skyline(c, 150, 300, 300, '#6d7278');
  c.fillStyle = cor; c.fillRect(200, 220, 1520, 640);
  c.fillStyle = letreiro; c.fillRect(260, 250, 1400, 120); c.font = '700 84px Oswald'; c.fillStyle = '#f1ead8'; c.textAlign = 'center'; c.fillText(nome, 960, 342); c.textAlign = 'left';
  c.fillStyle = vitrine; c.fillRect(300, 420, 1320, 440);
  if (grade) { c.fillStyle = '#6e7174'; c.fillRect(300, 420, 1320, 440 * grade); c.strokeStyle = '#575a5d'; c.lineWidth = 3; for (let y = 430; y < 420 + 440 * grade; y += 22) { c.beginPath(); c.moveTo(300, y); c.lineTo(1620, y); c.stroke(); } }
  c.fillStyle = '#3e3f40'; c.fillRect(-600, 860, W + 1200, 400); c.fillStyle = '#4c4d4e'; c.fillRect(-600, 860, W + 1200, 16);
}
function prateleiras(c, t, {cheio = 0.08, cor = '#c8c2b0'} = {}) {
  c.fillStyle = '#2a2c2e'; c.fillRect(-600, -300, W + 1200, H + 600);
  const r = rng(5);
  for (let col = 0; col < 3; col++) { const x0 = -100 + col * 760; c.fillStyle = '#4a4c4e'; c.fillRect(x0, 120, 700, 800);
    for (let s = 0; s < 5; s++) { const y = 260 + s * 150; c.fillStyle = cor; c.fillRect(x0 + 10, y, 680, 14);
      for (let k = 0; k < 14; k++) if (r() < cheio) { c.fillStyle = ['#a03a2a', '#d8b040', '#3a6a9a', '#6a8a3a', '#e8e0c8'][Math.floor(r() * 5)]; c.fillRect(x0 + 20 + k * 48, y - 70, 40, 70); } } }
  c.fillStyle = '#3a3c3e'; c.fillRect(-600, 920, W + 1200, 400);
}
function rodovia(c, t) {
  ceuNublado(c, t, -200, 560);
  c.fillStyle = '#6b6a58'; c.beginPath(); c.moveTo(-400, 560); for (let x = -400; x < 2400; x += 100) c.lineTo(x, 540 - 30 * Math.sin(x * 0.003)); c.lineTo(2400, 1300); c.lineTo(-400, 1300); c.fill();
  c.fillStyle = '#3a3b3c'; c.beginPath(); c.moveTo(-400, 1100); c.lineTo(860, 560); c.lineTo(1000, 560); c.lineTo(2400, 1100); c.fill();
  for (let i = 0; i < 9; i++) { const k = Math.pow(0.78, i), x = 930 - 560 * k * 0.25, y = 560 + 540 * k; caminhao(c, lerp(930, 520, k), y, k * 0.9, i); caminhao(c, lerp(930, 1340, k), y, k * 0.9, i + 20, -1); }
}
function caminhao(c, x, y, s, seed, dir = 1) {
  const r = rng(seed + 3); c.save(); c.translate(x, y); c.scale(s * dir, s);
  c.fillStyle = ['#c8c4b8', '#8a2a20', '#2a4a6a', '#d8d2c0'][Math.floor(r() * 4)]; c.fillRect(-260, -260, 380, 220);
  c.fillStyle = ['#b03a2a', '#e8e4d8', '#3a5a3a'][Math.floor(r() * 3)]; rr(c, 120, -200, 130, 160, 14); c.fill(); c.fillStyle = '#1a2028'; c.fillRect(170, -185, 70, 60);
  c.fillStyle = '#111'; [-200, -60, 190].forEach(wx => { c.beginPath(); c.arc(wx, -30, 34, 0, 7); c.fill(); }); c.restore();
}
function cidadeNoite(c, t, {acender = 0, seed = 200} = {}) {
  c.fillStyle = vgrad(c, -200, 760, [[0, '#03050b'], [1, '#101726']]); c.fillRect(-800, -400, W + 1600, 1600);
  particulas(c, t, 160, 12, { area: [-400, -300, W + 800, 900], cor: '#e6ecff', tam: [0.5, 1.7], vel: [0, 0, 0, 0], brilho: 0.85 * (1 - acender * 0.7) });
  skyline(c, seed, 820, 520, '#05070c', { janelas: 0.35, apagar: 1 - acender, corJanela: '#ffd28a' });
  skyline(c, seed + 1, 900, 360, '#030408', { janelas: 0.3, apagar: 1 - acender, corJanela: '#ffc879' });
  if (acender > 0) { c.fillStyle = vgrad(c, 400, 900, [[0, 'rgba(255,160,70,0)'], [1, `rgba(255,160,70,${0.25 * acender})`]]); c.fillRect(-800, 400, W + 1600, 600); }
  c.fillStyle = '#020305'; c.fillRect(-800, 900, W + 1600, 500);
}
function unidadeSaude(c, t) {
  ceuNublado(c, t, -300, 500);
  skyline(c, 170, 520, 300, '#6a7076');
  c.fillStyle = '#d8d6cf'; c.fillRect(300, 260, 1300, 600); c.fillStyle = '#2a6a5a'; c.fillRect(300, 260, 1300, 70);
  c.font = '700 54px Oswald'; c.fillStyle = '#fff'; c.fillText('UNIDADE DE SAÚDE', 360, 315);
  for (let i = 0; i < 6; i++) { c.fillStyle = '#ffe3a6'; c.fillRect(360 + i * 200, 400, 140, 110); c.fillStyle = 'rgba(255,220,150,0.25)'; c.fillRect(350 + i * 200, 390, 160, 130); }
  c.fillStyle = '#3a4a3a'; rr(c, 1640, 680, 260, 180, 10); c.fill(); c.fillStyle = '#c9a43a'; c.fillRect(1660, 700, 80, 20);
  particulas(c, t, 12, 7, { area: [1680, 560, 80, 120], cor: 'rgba(200,200,200,0.3)', tam: [6, 14], vel: [-6, 6, -40, -20] });
  c.fillStyle = '#3e3f40'; c.fillRect(-600, 860, W + 1200, 400);
}
function ginasio(c, t) {
  ceuNublado(c, t, -300, 420);
  c.fillStyle = '#8a8476'; c.beginPath(); c.moveTo(200, 420); c.quadraticCurveTo(960, 150, 1720, 420); c.lineTo(1720, 860); c.lineTo(200, 860); c.fill();
  c.fillStyle = '#5a4a3a'; c.fillRect(780, 560, 360, 300); c.font = '700 50px Oswald'; c.fillStyle = '#efe9da'; c.textAlign = 'center'; c.fillText('GINÁSIO MUNICIPAL', 960, 500); c.textAlign = 'left';
  c.fillStyle = '#3e3f40'; c.fillRect(-600, 860, W + 1200, 400);
  // caminhão verde-oliva
  c.save(); c.translate(1500, 900); c.fillStyle = '#4f5a3a'; c.fillRect(-300, -300, 420, 260); c.fillStyle = '#3f4a2a'; rr(c, 120, -220, 150, 180, 12); c.fill(); c.fillStyle = '#111'; [-230, -70, 200].forEach(x => { c.beginPath(); c.arc(x, -30, 38, 0, 7); c.fill(); }); c.restore();
  for (let i = 0; i < 6; i++) { c.fillStyle = '#b08a5a'; c.fillRect(1180 + (i % 3) * 70, 780 - Math.floor(i / 3) * 60, 64, 56); }
}

// ---------- pessoas em fila / multidão ----------
function fila(c, t, x0, y, n, passo = 70, s = 0.42, seed = 1, dir = 1, extra = {}) {
  const r = rng(seed), vis = ['pedestre1', 'pedestre2', 'mae', 'morador7', 'pedestre1'];
  for (let i = n - 1; i >= 0; i--) {
    const v = vis[Math.floor(r() * vis.length)], ph = r();
    desenharPessoa(c, { x: x0 + i * passo * dir, y: y + r() * 8, s: s * lerp(0.92, 1.06, r()), dir, cabeca: { giro: 0.6, incl: Math.sin(t * 0.5 + ph * 6) * 0.04 }, bracoF: [0.1 + 0.05 * Math.sin(t + ph * 6), 0.3], objeto: r() < 0.6 ? segBalde(['#2f5f8a', '#8a2f2f', '#c9a43a'][i % 3]) : null, piscar: piscar(t, i), ...extra }, v);
  }
}

// ---------- telas de celular ----------
function maoCelular(c, t, conteudo, {x = 960, y = 560, toque = []} = {}) {
  c.save();
  c.fillStyle = VISUAIS.lucas.peleSombra; for (let i = 0; i < 3; i++) { rr(c, x - 225, y - 40 + i * 70, 60, 46, 22); c.fill(); }
  celularTela(c, x, y, 400, 820, conteudo);
  const tq = toque.reduce((s, p) => s + Math.max(0, 1 - Math.abs(t - p) / 0.22), 0);
  c.fillStyle = rgrad(c, x + 120, y + 460, 0, 300, [[0, VISUAIS.lucas.pele], [1, VISUAIS.lucas.peleSombra]]);
  c.beginPath(); c.ellipse(x + 120, y + 470, 220, 150, -0.35, 0, 7); c.fill();
  c.save(); c.translate(x + 150, y + 330 - tq * 26); c.rotate(-0.6); c.fillStyle = VISUAIS.lucas.pele; rr(c, -34, -120, 68, 170, 34); c.fill(); c.fillStyle = 'rgba(255,255,255,0.12)'; rr(c, -18, -110, 30, 40, 14); c.fill(); c.restore();
  c.restore();
}
