// E SE ACONTECER? — Vídeo 2: apartamento do Lucas, quarto do Rafael e rua na chuva (aprovados no teste do Cap. 1)

function caneca() { return (c, x, y) => { c.fillStyle = '#e8e2d8'; rr(c, x - 12, y - 30, 26, 32, 4); c.fill(); c.strokeStyle = '#e8e2d8'; c.lineWidth = 5; c.beginPath(); c.arc(x + 15, y - 14, 8, -1.2, 1.2); c.stroke(); }; }

function vapor(c, T, x, y, n = 5) {
  for (let i = 0; i < n; i++) {
    const f = ((T * 0.35 + i / n) % 1);
    c.fillStyle = `rgba(235,235,240,${0.18 * Math.sin(f * Math.PI)})`;
    c.beginPath(); c.arc(x + Math.sin(T * 1.7 + i * 2) * 10 * f, y - f * 120, 8 + f * 16, 0, 7); c.fill();
  }
}

function telaTV(c, x, y, w, h, T, modo) {
  c.save(); c.beginPath(); c.rect(x, y, w, h); c.clip();
  if (modo === 'apagada') { c.fillStyle = '#070809'; c.fillRect(x, y, w, h); c.restore(); return; }
  if (modo === 'alerta') {
    c.fillStyle = '#1a0a0a'; c.fillRect(x, y, w, h);
    const pis = 0.55 + 0.45 * Math.sin(T * 6);
    c.fillStyle = `rgba(198,42,36,${0.8 * pis + 0.2})`; c.fillRect(x, y + h * 0.18, w, h * 0.34);
    c.fillStyle = '#fff'; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.font = `700 ${h * 0.12}px Oswald`; c.fillText('ALERTA DE CHUVA INTENSA', x + w / 2, y + h * 0.35);
    c.fillStyle = '#f2efe9'; c.font = `600 ${h * 0.065}px Inter`; c.fillText('Risco de alagamentos em várias regiões', x + w / 2, y + h * 0.64);
    c.fillStyle = '#e0b23a'; c.font = `700 ${h * 0.065}px Inter`; c.fillText('SIMULAÇÃO FICTÍCIA', x + w / 2, y + h * 0.82);
  } else { // previsão do tempo: mapa com nuvens andando
    c.fillStyle = '#123a5a'; c.fillRect(x, y, w, h);
    c.fillStyle = '#2f6a4a'; c.beginPath(); c.moveTo(x + w * 0.15, y + h * 0.2); c.lineTo(x + w * 0.7, y + h * 0.15); c.lineTo(x + w * 0.85, y + h * 0.6); c.lineTo(x + w * 0.5, y + h * 0.9); c.lineTo(x + w * 0.1, y + h * 0.7); c.fill();
    for (let i = 0; i < 5; i++) { const cx = x + ((i * 0.27 + T * 0.03) % 1.2 - 0.1) * w, cy = y + h * (0.3 + 0.1 * (i % 3)); c.fillStyle = 'rgba(220,225,235,0.75)'; c.beginPath(); c.arc(cx, cy, h * 0.08, 0, 7); c.arc(cx + h * 0.08, cy - h * 0.03, h * 0.1, 0, 7); c.arc(cx + h * 0.18, cy, h * 0.07, 0, 7); c.fill(); }
    c.fillStyle = 'rgba(0,0,0,0.6)'; c.fillRect(x, y + h * 0.8, w, h * 0.2);
    c.fillStyle = '#fff'; c.textAlign = 'left'; c.textBaseline = 'middle'; c.font = `700 ${h * 0.08}px Oswald`; c.fillText('PREVISÃO  ·  CHUVA FORTE', x + w * 0.04, y + h * 0.9);
  }
  c.fillStyle = 'rgba(255,255,255,0.05)'; c.beginPath(); c.moveTo(x, y); c.lineTo(x + w * 0.35, y); c.lineTo(x + w * 0.1, y + h); c.lineTo(x, y + h); c.fill();
  c.restore();
}

function janelaChuva(c, x, y, w, h, T, intens = 1) {
  c.save(); c.beginPath(); c.rect(x, y, w, h); c.clip();
  const r = raioEm(T);
  c.fillStyle = vgrad(c, y, y + h, [[0, '#6f7882'], [1, '#9aa2a8']]); c.fillRect(x, y, w, h);
  skyline(c, 21, y + h * 0.95, h * 0.55, '#7a828a', { x0: x - 40, x1: x + w + 40, larg: [40, 110] });
  skyline(c, 22, y + h * 1.02, h * 0.38, '#5d656d', { x0: x - 40, x1: x + w + 40, larg: [50, 120], janelas: 0.25, corJanela: '#e8d9a8' });
  if (r) { c.fillStyle = `rgba(230,235,255,${0.55 * r})`; c.fillRect(x, y, w, h); }
  const rr_ = rng(3); c.strokeStyle = `rgba(225,232,240,${0.5 * intens})`; c.lineWidth = 1.4;
  for (let i = 0; i < 90 * intens; i++) { const px = x + (rr_() * w + T * 60) % w, py = y + (rr_() * h + T * (700 + rr_() * 200)) % h; c.beginPath(); c.moveTo(px, py); c.lineTo(px - 4, py + 18); c.stroke(); }
  for (let i = 0; i < 40; i++) { const px = x + rr_() * w, py = y + ((rr_() * h + T * (8 + rr_() * 25)) % h); c.fillStyle = 'rgba(235,240,245,0.35)'; c.beginPath(); c.ellipse(px, py, 3, 4.5, 0, 0, 7); c.fill(); }
  c.restore();
  c.strokeStyle = '#e9e5de'; c.lineWidth = 14; c.strokeRect(x, y, w, h); c.lineWidth = 8; c.beginPath(); c.moveTo(x + w / 2, y); c.lineTo(x + w / 2, y + h); c.stroke();
  c.fillStyle = '#d9d4cc'; c.fillRect(x - 20, y + h + 6, w + 40, 16);
}

function porta(c, x, y, w, h, abre) {
  c.fillStyle = '#2b2a2e'; c.fillRect(x, y, w, h); // corredor escuro
  c.fillStyle = vgrad(c, y, y + h, [[0, '#4a4844'], [1, '#33312e']]); c.fillRect(x + 10, y + 10, w - 20, h - 10);
  c.fillStyle = '#e2b25a'; c.globalAlpha = 0.25; c.fillRect(x + 10, y + 10, w - 20, 30); c.globalAlpha = 1;
  const fw = w * (1 - abre * 0.82); // folha abrindo para dentro (dobradiça à direita)
  c.fillStyle = '#7a5a40'; c.fillRect(x + w - fw, y, fw, h);
  c.fillStyle = '#6a4c36'; c.fillRect(x + w - fw + fw * 0.12, y + 40, fw * 0.76, h * 0.38); c.fillRect(x + w - fw + fw * 0.12, y + h * 0.5, fw * 0.76, h * 0.42);
  c.fillStyle = '#d8c690'; c.beginPath(); c.arc(x + w - fw + 22, y + h * 0.52, 8, 0, 7); c.fill();
  c.strokeStyle = '#e9e5de'; c.lineWidth = 12; c.strokeRect(x - 6, y - 6, w + 12, h + 6);
}

function apartamento(c, T, { porta: ab = 0, tv = 'previsao', chuva = 1, semLuz = 0 } = {}) {
  if (semLuz) tv = 'apagada';
  c.fillStyle = vgrad(c, -200, 940, [[0, '#6b6f75'], [1, '#575a60']]); c.fillRect(-600, -400, W + 1200, 1340);
  c.fillStyle = vgrad(c, 940, 1300, [[0, '#6a5240'], [1, '#4a382b']]); c.fillRect(-600, 940, W + 1200, 600);
  c.fillStyle = '#3d3f44'; c.fillRect(-600, 926, W + 1200, 16);
  janelaChuva(c, 90, 190, 480, 440, T, chuva);
  // armários e bancada
  c.fillStyle = '#ddd7ce'; c.fillRect(640, 170, 600, 200); c.strokeStyle = '#bdb6aa'; c.lineWidth = 3; for (let i = 1; i < 4; i++) { c.beginPath(); c.moveTo(640 + i * 150, 170); c.lineTo(640 + i * 150, 370); c.stroke(); }
  c.fillStyle = '#cfc7ba'; c.fillRect(620, 690, 640, 240); c.fillStyle = '#34363b'; c.fillRect(605, 664, 670, 30);
  for (let i = 0; i < 4; i++) { c.strokeStyle = '#b3aa9c'; c.strokeRect(632 + i * 157, 705, 145, 210); c.fillStyle = '#8f877a'; c.fillRect(690 + i * 157, 720, 30, 6); }
  // cafeteira
  c.fillStyle = '#1e1f23'; rr(c, 1080, 540, 110, 126, 10); c.fill(); c.fillStyle = '#2a2c31'; c.fillRect(1094, 600, 82, 56);
  c.fillStyle = 'rgba(90,50,25,0.85)'; c.fillRect(1100, 628, 70, 26); c.fillStyle = 'rgba(200,220,240,0.25)'; c.fillRect(1100, 604, 70, 50);
  c.fillStyle = '#c62a24'; c.beginPath(); c.arc(1174, 556, 5, 0, 7); c.fill();
  vapor(c, T, 1135, 600);
  // luminária acesa
  c.fillStyle = '#2a2a2e'; c.fillRect(938, -400, 4, 520); c.fillStyle = '#e9c27a'; c.beginPath(); c.moveTo(900, 120); c.lineTo(980, 120); c.lineTo(964, 92); c.lineTo(916, 92); c.fill();
  if (!semLuz) { c.fillStyle = rgrad(c, 940, 160, 0, 520, [[0, 'rgba(255,220,160,0.16)'], [1, 'rgba(255,220,160,0)']]); c.fillRect(400, 100, 1100, 900); }
  porta(c, 1300, 300, 190, 626, ab);
  // TV na parede
  c.fillStyle = '#0d0e10'; rr(c, 1530, 300, 330, 200, 6); c.fill();
  telaTV(c, 1540, 310, 310, 180, T, tv);
  if (semLuz) { c.fillStyle = 'rgba(10,14,26,0.38)'; c.fillRect(-600, -400, W + 1200, 1800); c.fillStyle = rgrad(c, 330, 410, 0, 700, [[0, 'rgba(170,190,215,0.16)'], [1, 'rgba(170,190,215,0)']]); c.fillRect(-600, -400, W + 1200, 1800); }
  const r = raioEm(T); if (r) { c.fillStyle = `rgba(200,215,255,${0.12 * r})`; c.fillRect(-600, -400, W + 1200, 1800); }
}

function quartoRafael(c, T) {
  c.fillStyle = vgrad(c, 0, H, [[0, '#4d4a5a'], [1, '#3a3746']]); c.fillRect(-400, -300, W + 800, H + 600);
  janelaChuva(c, 1180, 160, 420, 360, T, 0.8);
  c.fillStyle = '#c9a86a'; c.fillRect(250, 200, 160, 220); c.fillStyle = '#a3854f'; c.fillRect(262, 212, 136, 196); // pôster
  c.fillStyle = '#2b2a33'; c.fillRect(-400, 860, W + 800, 400);
  c.fillStyle = '#6b4a35'; rr(c, 180, 600, 1100, 300, 20); c.fill(); // cama
  c.fillStyle = '#e9e3d8'; rr(c, 200, 560, 260, 110, 40); c.fill(); // travesseiro
}

function rafaelNaCama(c, T, { senta = 0, expr = '', olhar = 0 } = {}) {
  quartoRafael(c, T);
  const boca = fala('rafael', T);
  c.save(); c.translate(lerp(610, 640, senta), lerp(628, 640, senta)); c.rotate(lerp(-Math.PI / 2, -0.25, senta));
  desenharPessoa(c, { x: 0, y: 0, s: 1, dir: 1, expr: expr || (boca > 0 ? 'sorriso' : ''), boca, piscar: piscaT(T, 4), cabeca: { giro: lerp(-0.2, 0.15, senta), incl: lerp(-0.25, 0, senta) },
    bracoF: [lerp(1.55, 1.3, senta) + Math.sin(T * 2.4) * 0.06 * (boca > 0), lerp(0.75, 0.9, senta)], bracoT: [lerp(0.15, 0.5, senta), 0.4],
    pernaF: [lerp(0.02, 1.45, senta), 0.04], pernaT: [lerp(-0.02, 1.45, senta), 0.04], objeto: celularMao(), luz: LUZ_CHUVA }, 'rafael');
  c.restore();
  // cobertor da cintura para baixo
  const x0 = lerp(640, 600, senta);
  c.fillStyle = '#3f6f8f'; c.beginPath(); c.moveTo(x0, 615); c.quadraticCurveTo(1000, lerp(590, 600, senta), 1270, 620); c.lineTo(1270, 900); c.lineTo(x0 - 30, 900); c.fill();
  c.fillStyle = '#365f7a'; c.fillRect(x0 - 30, 860, 1300 - x0, 40);
}

function lucasCozinha(c, T, { expr = '', giro = 0.05, tel = true, servir = 0 } = {}) {
  const boca = fala('lucas', T), g = gesto(T, boca > 0.02, 1);
  desenharPessoa(c, { x: 900, y: 688, s: 1, dir: 1, expr, boca, piscar: piscaT(T, 1), olhar: 0.3,
    cabeca: { giro, incl: tel ? 0.12 : 0 },
    bracoF: tel ? [1.15 + Math.sin(T * 1.3) * 0.03 + (boca > 0.02 ? Math.sin(T * 3.3) * 0.06 : 0), 0.95 + Math.sin(T * 0.9) * 0.05] : g, bracoT: servir ? [lerp(0.1, 1.2, servir), 0.5] : [-0.1 + (boca > 0.02 ? Math.sin(T * 2.7) * 0.25 : 0), 0.35],
    objeto: tel ? celularMao() : null, objetoT: servir ? caneca() : null, luz: LUZ_CHUVA }, 'lucas');
}

function marinaPorta(c, T, { x = 1395, expr = 'firme', aponta = 0 } = {}) {
  const boca = fala('marina', T), g = gesto(T, boca > 0.02, 3);
  desenharPessoa(c, { x, y: 698, s: 1, dir: -1, expr, boca, piscar: piscaT(T, 2), cabeca: { giro: 0.05 },
    bracoF: [lerp(0.9, 1.55, aponta), lerp(1.0, 0.45, aponta)], bracoT: [0.05 + (boca > 0.02 ? Math.sin(T * 2.6) * 0.2 : 0), 0.3], objeto: celularMao('#c9c4bb'), luz: LUZ_CHUVA }, 'marina');
}

function ruaChuva(c, T, { agua = 0 } = {}) {
  c.fillStyle = vgrad(c, 0, H, [[0, '#59636d'], [0.55, '#86909a'], [0.56, '#3f4247'], [1, '#2d2f33']]); c.fillRect(-400, -300, W + 800, H + 600);
  skyline(c, 31, 610, 420, '#6c757e', { larg: [80, 200] });
  skyline(c, 32, 620, 300, '#4c535a', { larg: [90, 220], janelas: 0.3, corJanela: '#e6d49a' });
  c.fillStyle = '#4a4c50'; c.fillRect(-400, 600, W + 800, 60); // calçada
  c.fillStyle = '#2c2e32'; c.fillRect(-400, 660, W + 800, 420); // rua
  c.fillStyle = `rgba(120,135,150,${0.35 + 0.4 * agua})`; c.fillRect(-400, 660 + 260 * (1 - agua), W + 800, 420 * agua + 30); // água acumulando
  for (let i = 0; i < 6; i++) { const x = ((i * 420 + T * (140 + i * 15)) % (W + 600)) - 300, y = 760 + (i % 2) * 120; // carros devagar, faróis
    c.fillStyle = ['#8a2d2a', '#d8d4cc', '#2f4a6a'][i % 3]; rr(c, x, y - 60, 230, 70, 18); c.fill(); rr(c, x + 40, y - 105, 140, 55, 16); c.fill();
    c.fillStyle = '#16181c'; c.beginPath(); c.arc(x + 50, y + 10, 22, 0, 7); c.arc(x + 180, y + 10, 22, 0, 7); c.fill();
    c.fillStyle = 'rgba(255,240,200,0.9)'; c.beginPath(); c.arc(x + 224, y - 35, 8, 0, 7); c.fill();
    c.fillStyle = rgrad(c, x + 300, y - 30, 0, 160, [[0, 'rgba(255,240,200,0.25)'], [1, 'rgba(255,240,200,0)']]); c.fillRect(x + 140, y - 190, 330, 320); }
  for (let i = 0; i < 4; i++) { const x = ((i * 520 + T * 60) % (W + 400)) - 200; desenharPessoa(c, { x, y: 480, s: 0.45, dir: 1, ...caminhada(T * 1.2 + i * 0.3, 0.8), luz: LUZ.rua, objeto: (k, hx, hy) => { k.fillStyle = ['#c62a24', '#1d1f24', '#2f6fb0', '#d9a623'][i]; k.beginPath(); k.arc(hx, hy - 150, 95, Math.PI, 0); k.fill(); k.fillRect(hx - 3, hy - 150, 6, 150); } }, ['pedestre1', 'pedestre2', 'mae', 'morador7'][i]); }
  chuvaFx(c, T, 1.2, 9);
  const r = raioEm(T); if (r) { c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.fillStyle = `rgba(230,235,255,${0.35 * r})`; c.fillRect(0, 0, W, H); c.restore(); }
}
