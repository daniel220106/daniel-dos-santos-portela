// E SE ACONTECER? — Vídeo 3: cenários (Zona Norte do Rio sob calor extremo).
// Coordenadas de mundo em 1920x1080; o chão das cenas de rua fica em y≈930.

// ---------- céu e paisagem ----------
function ceuCalor(c, y1 = 760, { intens = 1, hora = 'dia' } = {}) {
  const P = { dia: [[0, '#f4e4c8'], [0.5, '#f7d9a8'], [1, '#f2c48a']], amanhecer: [[0, '#5a4a7a'], [0.45, '#e0868a'], [1, '#f6b47a']],
    tarde: [[0, '#e8b070'], [0.6, '#f08a4a'], [1, '#c85a3a']], noite: [[0, '#0b0d18'], [0.7, '#1a1a2a'], [1, '#2a1e22']], entardecer: [[0, '#3a4a7a'], [0.5, '#c87a8a'], [1, '#f0a070']],
    nublado: [[0, '#5a6270'], [1, '#7a808a']] }[hora];
  c.fillStyle = vgrad(c, -400, y1, P); c.fillRect(-800, -600, W + 1600, y1 + 600);
  if (hora === 'dia' || hora === 'tarde') { c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = rgrad(c, 1500, 120, 0, 700, [[0, `rgba(255,250,230,${0.9 * intens})`], [0.12, `rgba(255,240,200,${0.5 * intens})`], [1, 'rgba(255,220,160,0)']]); c.fillRect(-800, -600, W + 1600, y1 + 600); c.restore(); }
  if (hora === 'noite') { const r = rng(5); for (let i = 0; i < 90; i++) { c.fillStyle = `rgba(240,236,220,${0.2 + r() * 0.5})`; c.fillRect(-400 + r() * (W + 800), -300 + r() * 700, 2, 2); } }
}
// morros arredondados do Rio, com casinhas nas encostas
function morrosRio(c, base, alt, cor, seed = 3, { casas = 1, luzes = 0 } = {}) {
  const r = rng(seed); const picos = [];
  for (let x = -800; x < W + 900; x += 260 + r() * 260) picos.push([x, alt * (0.45 + r() * 0.55)]);
  c.fillStyle = cor; c.beginPath(); c.moveTo(-800, base);
  picos.forEach(([x, h], i) => { const nx = picos[i + 1] ? picos[i + 1][0] : W + 900; c.quadraticCurveTo(x + (nx - x) * 0.3, base - h * 1.25, (x + nx) / 2, base - h); });
  c.lineTo(W + 900, base); c.closePath(); c.fill();
  if (casas) { const rr2 = rng(seed + 7); for (let i = 0; i < 160 * casas; i++) { const x = -700 + rr2() * (W + 1500), y = base - rr2() * alt * 0.55;
    c.fillStyle = luzes ? (rr2() < 0.5 ? 'rgba(255,200,120,0.8)' : 'rgba(255,220,160,0.5)') : shade(['#d8b48a', '#c98a6a', '#e0d0b0', '#b0a090', '#d0a070'][i % 5], 0.85); c.fillRect(x, y, luzes ? 4 : 14, luzes ? 4 : 10); } }
}
// rua de subúrbio: casas de 2 a 3 andares com laje, aparelhos de ar, fios e postes; o prédio da família em x 1180..1600
function ruaSuburbio(c, T, { hora = 'dia', semLuz = 0, arCond = 1, predio = 1, desloc = 0, calcadaGente = 0 } = {}) {
  ceuCalor(c, 760, { hora });
  const noite = hora === 'noite';
  morrosRio(c, 640, 360, noite ? '#151620' : (hora === 'amanhecer' ? '#5a4a66' : '#9a8a78'), 3, { luzes: noite && !semLuz });
  morrosRio(c, 700, 200, noite ? '#1c1c26' : (hora === 'amanhecer' ? '#6e5a70' : '#b09a82'), 9, { casas: 0.6, luzes: noite && !semLuz });
  c.save(); c.translate(-desloc, 0);
  const r = rng(11);
  const cores = ['#e8c9a0', '#d98c6a', '#b8d0c0', '#e6d6a8', '#c9a0a8', '#a8b8d0', '#e0b080'];
  for (let i = 0; i < 16; i++) {
    const x = -900 + i * 300, w = 260 + r() * 30, h = 260 + Math.floor(r() * 3) * 110;
    if (predio && x > 1000 && x < 1500) continue;
    const cor = noite ? shade(cores[i % 7], 0.3) : cores[i % 7];
    c.fillStyle = cor; c.fillRect(x, 930 - h, w, h);
    c.fillStyle = shade(cor, 0.8); c.fillRect(x - 6, 930 - h - 14, w + 12, 16); // laje
    for (let a = 0; a < Math.floor(h / 110); a++) for (let j = 0; j < 2; j++) {
      const jx = x + 30 + j * 120, jy = 930 - h + 30 + a * 110;
      const acesa = noite && !semLuz && r() < 0.6;
      c.fillStyle = acesa ? '#f2c27a' : (noite ? '#0d0f16' : '#3a4250'); c.fillRect(jx, jy, 80, 56);
      c.fillStyle = noite ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.18)'; c.fillRect(jx, jy, 80, 6);
      if (arCond && r() < 0.5) { c.fillStyle = noite ? '#4a4a50' : '#e8e8e4'; c.fillRect(jx + 86, jy + 8, 40, 28); c.fillStyle = '#9a9aa0'; c.fillRect(jx + 90, jy + 14, 32, 3); c.fillRect(jx + 90, jy + 22, 32, 3);
        if (!noite && !semLuz) { const f = (T * 0.6 + i * 0.3 + a) % 1; c.fillStyle = `rgba(160,200,230,${0.6 * (1 - f)})`; c.fillRect(jx + 104, jy + 38 + f * 60, 3, 6); } }
    }
    c.fillStyle = noite ? '#141418' : '#5a4a40'; c.fillRect(x + w - 70, 930 - 120, 50, 120); // portão
  }
  if (predio) predioFamilia(c, T, { noite, semLuz });
  // postes e fios
  for (let i = 0; i < 6; i++) { const px = -600 + i * 640; poste(c, px, 935, 470); }
  for (let k = 0; k < 4; k++) fios(c, Array.from({ length: 6 }, (_, i) => [-600 + i * 640, 935 - 470 + 22 + k * 12]), 34 + k * 6, noite ? 'rgba(10,10,12,0.9)' : 'rgba(30,26,24,0.85)', 2.2);
  c.restore();
  // calçada e asfalto
  c.fillStyle = noite ? '#24242a' : '#b8aa98'; c.fillRect(-800, 930, W + 1600, 50);
  c.fillStyle = noite ? '#141416' : '#4a4440'; c.fillRect(-800, 980, W + 1600, 500);
  if (!noite) { c.fillStyle = 'rgba(255,255,255,0.08)'; for (let i = 0; i < 12; i++) c.fillRect(-700 + i * 240 - (desloc % 240), 1060, 120, 10); }
}
function predioFamilia(c, T, { noite = 0, semLuz = 0 } = {}) {
  const x = 1060, w = 440, top = 930 - 4 * 130 - 30;
  c.fillStyle = noite ? '#2a2420' : '#d9c4a0'; c.fillRect(x, top, w, 930 - top);
  c.fillStyle = noite ? '#1e1a16' : '#b9a480'; c.fillRect(x - 10, top - 18, w + 20, 22); // laje do 4º andar
  c.fillStyle = noite ? '#141210' : '#8a7a60'; c.fillRect(x + 300, top - 70, 110, 54); // caixa d'água
  for (let a = 0; a < 4; a++) for (let j = 0; j < 3; j++) {
    const jx = x + 30 + j * 140, jy = top + 26 + a * 130, acesa = noite && !semLuz && (a + j) % 2 === 0;
    c.fillStyle = acesa ? '#f2c27a' : (noite ? '#0d0f16' : '#4a5260'); c.fillRect(jx, jy, 100, 70);
    c.fillStyle = noite ? '#2a2420' : '#c4ae88'; c.fillRect(jx - 6, jy + 70, 112, 8);
  }
  c.fillStyle = noite ? '#0d0b09' : '#5a4a3a'; c.fillRect(x + 170, 930 - 130, 100, 130); // porta
  c.fillStyle = noite ? '#3a3020' : '#2a2a2a'; c.font = '700 30px Inter'; c.fillText('14', x + 200, 930 - 140);
}
// ---------- interiores ----------
// apartamento no último andar (sala + cozinha). Janela com morros e sol estourado.
function apCalor(c, T, { semLuz = 0, noite = 0, tv = 'calor', cortina = 0, ventilador = 1, panela = 0, porta = 0 } = {}) {
  c.fillStyle = vgrad(c, -200, 940, noite ? [[0, '#2a2420'], [1, '#1e1a16']] : [[0, '#e6c9a0'], [1, '#d4b088']]); c.fillRect(-600, -400, W + 1200, 1340);
  c.fillStyle = noite ? '#1a1612' : '#bfa07a'; c.fillRect(-600, -400, W + 1200, 120); // teto/laje baixa
  // janela
  const jx = 140, jy = 220, jw = 520, jh = 400;
  c.save(); c.beginPath(); c.rect(jx, jy, jw, jh); c.clip(); c.translate(jx - 200, jy - 160); c.scale(0.55, 0.55);
  ceuCalor(c, 900, { hora: noite ? 'noite' : 'dia' }); morrosRio(c, 760, 420, noite ? '#121420' : '#a89480', 3, { luzes: noite && !semLuz });
  morrosRio(c, 900, 260, noite ? '#181a26' : '#bfa88e', 9, { casas: 0.8, luzes: noite && !semLuz }); c.restore();
  if (!noite) { c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = rgrad(c, jx + jw * 0.7, jy + 40, 0, 500, [[0, 'rgba(255,240,200,0.55)'], [1, 'rgba(255,220,160,0)']]); c.fillRect(jx - 200, jy - 200, jw + 600, jh + 600); c.restore(); }
  c.strokeStyle = noite ? '#3a3228' : '#f2ece0'; c.lineWidth = 14; c.strokeRect(jx, jy, jw, jh); c.lineWidth = 8; c.beginPath(); c.moveTo(jx + jw / 2, jy); c.lineTo(jx + jw / 2, jy + jh); c.stroke();
  if (cortina) { c.fillStyle = noite ? 'rgba(60,40,30,0.95)' : 'rgba(150,70,50,0.92)'; c.fillRect(jx - 20, jy - 20, (jw + 40) * cortina, jh + 40); }
  // cozinha à direita: bancada, fogão com panela, geladeira
  c.fillStyle = noite ? '#2a2622' : '#ece6da'; c.fillRect(1180, 330, 560, 170); c.strokeStyle = noite ? '#1a1612' : '#d0c8b8'; c.lineWidth = 3; for (let i = 0; i < 4; i++) c.strokeRect(1180 + i * 140, 330, 140, 170);
  c.fillStyle = noite ? '#24201c' : '#d8d0c0'; c.fillRect(1180, 700, 560, 240); c.fillStyle = noite ? '#1a1612' : '#9a8a70'; c.fillRect(1170, 690, 580, 18);
  c.fillStyle = noite ? '#2a2a2e' : '#e8e8e8'; rr(c, 1260, 610, 180, 84, 6); c.fill(); c.fillStyle = '#2a2a2e'; c.fillRect(1280, 604, 60, 8); c.fillRect(1360, 604, 60, 8);
  if (panela) { c.fillStyle = '#9a9aa0'; rr(c, 1288, 540, 112, 66, 14); c.fill(); c.fillStyle = '#5a5a60'; c.fillRect(1330, 528, 28, 14); vapor(c, T, 1344, 520, 6); }
  c.fillStyle = noite ? '#2e2e32' : '#f4f4f0'; rr(c, 1780, 380, 160, 560, 10); c.fill(); c.fillStyle = 'rgba(0,0,0,0.15)'; c.fillRect(1780, 560, 160, 6); c.fillStyle = '#8a8a90'; c.fillRect(1796, 420, 8, 90); c.fillRect(1796, 600, 8, 120);
  // TV na parede
  tvParede(c, 760, 300, 320, 190, T, semLuz ? 'apagada' : tv);
  // sofá e mesa
  c.fillStyle = noite ? '#2a1e1a' : '#8a4a3a'; rr(c, 120, 760, 560, 120, 20); c.fill(); rr(c, 100, 700, 600, 90, 24); c.fill();
  c.fillStyle = noite ? '#20160f' : '#6a4a30'; c.fillRect(820, 760, 260, 14); c.fillRect(840, 774, 12, 160); c.fillRect(1048, 774, 12, 160);
  // ventilador de pé
  if (ventilador) { const vx = 720, vy = 560, gira = semLuz ? 0 : T * 18; c.fillStyle = '#d8d8d8'; c.fillRect(vx - 6, vy, 12, 370); c.fillRect(vx - 60, 924, 120, 10);
    c.save(); c.translate(vx, vy); c.fillStyle = 'rgba(200,200,205,0.5)'; for (let i = 0; i < 3; i++) { c.rotate(gira + i * 2.09); c.beginPath(); c.ellipse(0, -40, 20, 44, 0, 0, 7); c.fill(); c.rotate(-gira - i * 2.09); }
    c.strokeStyle = 'rgba(80,80,85,0.7)'; c.lineWidth = 3; c.beginPath(); c.arc(0, 0, 90, 0, 7); c.stroke(); c.restore(); }
  if (porta) porta_(c, 1560, 380, 190, 550);
  c.fillStyle = noite ? '#191512' : '#a8865e'; c.fillRect(-600, 930, W + 1200, 400); // piso
  if (semLuz && !noite) { c.fillStyle = 'rgba(40,20,8,0.22)'; c.fillRect(-600, -400, W + 1200, 1800); }
  if (noite) { c.fillStyle = 'rgba(4,6,14,0.35)'; c.fillRect(-600, -400, W + 1200, 1800); }
}
function porta_(c, x, y, w, h) { c.fillStyle = '#6a4a2e'; c.fillRect(x, y, w, h); c.fillStyle = '#5a3c22'; c.fillRect(x + 20, y + 30, w - 40, h / 2 - 50); c.fillRect(x + 20, y + h / 2 + 10, w - 40, h / 2 - 50); c.fillStyle = '#d8c070'; c.beginPath(); c.arc(x + w - 30, y + h / 2, 9, 0, 7); c.fill(); }
function tvParede(c, x, y, w, h, T, modo = 'calor') {
  c.fillStyle = '#111214'; rr(c, x - 10, y - 10, w + 20, h + 20, 8); c.fill();
  if (modo === 'apagada') { c.fillStyle = '#0a0b0d'; c.fillRect(x, y, w, h); c.fillStyle = 'rgba(255,255,255,0.06)'; c.fillRect(x, y, w * 0.4, h); return; }
  c.save(); c.beginPath(); c.rect(x, y, w, h); c.clip();
  c.fillStyle = '#1a2a3a'; c.fillRect(x, y, w, h);
  // mapa vermelho de calor (forma genérica do litoral)
  c.fillStyle = vgrad(c, y, y + h, [[0, '#f0a030'], [1, '#c02a1a']]); c.beginPath(); c.moveTo(x + w * 0.15, y + h * 0.25);
  c.quadraticCurveTo(x + w * 0.5, y + h * 0.1, x + w * 0.8, y + h * 0.3); c.quadraticCurveTo(x + w * 0.9, y + h * 0.6, x + w * 0.55, y + h * 0.85); c.quadraticCurveTo(x + w * 0.2, y + h * 0.75, x + w * 0.15, y + h * 0.25); c.fill();
  c.fillStyle = 'rgba(255,255,255,0.9)'; c.font = `700 ${h * 0.24}px Oswald`; c.fillText('44°', x + w * 0.42, y + h * 0.58);
  c.fillStyle = 'rgba(0,0,0,0.7)'; c.fillRect(x, y + h * 0.82, w, h * 0.18); c.fillStyle = '#f2efe9'; c.font = `600 ${h * 0.09}px Inter`; c.fillText('PREVISÃO  ·  CALOR EXTREMO  ·  SIMULAÇÃO', x + 8, y + h * 0.94);
  c.restore();
}
function quartoNoite(c, T, { brilhoCelular = 1 } = {}) {
  c.fillStyle = '#0c0b10'; c.fillRect(-600, -400, W + 1200, 1800);
  c.fillStyle = '#161419'; c.fillRect(-600, 930, W + 1200, 400);
  c.fillStyle = '#121016'; c.fillRect(220, 200, 380, 330); c.fillStyle = '#1a1c2a'; c.fillRect(236, 216, 348, 298); // janela
  c.fillStyle = 'rgba(255,150,80,0.12)'; c.fillRect(236, 420, 348, 94);
  c.fillStyle = '#1e1a20'; rr(c, 700, 720, 900, 140, 16); c.fill(); c.fillStyle = '#2a2430'; rr(c, 700, 690, 260, 60, 20); c.fill(); // cama
  c.fillStyle = '#1a171d'; rr(c, -200, 760, 600, 110, 14); c.fill(); // colchão no chão
  if (brilhoCelular) { c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = rgrad(c, 760, 640, 0, 1100, [[0, `rgba(140,180,255,${0.4 * brilhoCelular})`], [1, 'rgba(140,180,255,0)']]); c.fillRect(-600, -400, W + 1200, 1800); c.restore(); }
}
function banheiro(c, T) {
  c.fillStyle = '#cfe0e0'; c.fillRect(-600, -400, W + 1200, 1340);
  c.strokeStyle = 'rgba(120,150,150,0.35)'; c.lineWidth = 3; for (let x = -600; x < W + 600; x += 90) { c.beginPath(); c.moveTo(x, -400); c.lineTo(x, 930); c.stroke(); } for (let y = -400; y < 930; y += 90) { c.beginPath(); c.moveTo(-600, y); c.lineTo(W + 600, y); c.stroke(); }
  c.fillStyle = '#e8eeee'; rr(c, 1300, 640, 300, 290, 30); c.fill(); // vaso/pia
  c.fillStyle = '#b8c8c8'; c.fillRect(-600, 930, W + 1200, 400); c.strokeStyle = 'rgba(80,100,100,0.3)'; for (let x = -600; x < W + 600; x += 120) { c.beginPath(); c.moveTo(x, 930); c.lineTo(x - 80, 1330); c.stroke(); }
}
function corredor302(c, T, { escuro = 0, hora = '18:00', porta302 = 1 } = {}) {
  c.fillStyle = vgrad(c, -200, 940, [[0, '#d8ccb4'], [1, '#c4b698']]); c.fillRect(-600, -400, W + 1200, 1340);
  c.fillStyle = '#9a8a6a'; c.fillRect(-600, 930, W + 1200, 400); c.fillStyle = '#b0a080'; c.fillRect(-600, 600, W + 1200, 12);
  [[160, '301'], [900, '302'], [1640, '303']].forEach(([x, n]) => { porta_(c, x, 380, 200, 550); c.fillStyle = '#2a2a2a'; c.font = '700 34px Inter'; c.fillText(n, x + 72, 360); });
  // relógio de parede
  c.fillStyle = '#f2efe9'; c.beginPath(); c.arc(1350, 250, 64, 0, 7); c.fill(); c.strokeStyle = '#3a3a3a'; c.lineWidth = 6; c.stroke();
  const [hh, mm] = hora.split(':').map(Number); c.lineWidth = 6; c.beginPath(); c.moveTo(1350, 250); c.lineTo(1350 + Math.sin(((hh % 12) + mm / 60) / 12 * 6.283) * 32, 250 - Math.cos(((hh % 12) + mm / 60) / 12 * 6.283) * 32); c.stroke();
  c.lineWidth = 4; c.beginPath(); c.moveTo(1350, 250); c.lineTo(1350 + Math.sin(mm / 60 * 6.283) * 50, 250 - Math.cos(mm / 60 * 6.283) * 50); c.stroke();
  if (escuro) { c.fillStyle = `rgba(6,6,12,${0.7 * escuro})`; c.fillRect(-600, -400, W + 1200, 1800); }
}
// notas musicais saindo da porta do 302 (o rádio tocando)
function notasRadio(c, T, x, y, intens = 1) { for (let i = 0; i < 5; i++) { const f = (T * 0.35 + i / 5) % 1; c.fillStyle = `rgba(60,40,30,${0.7 * Math.sin(f * Math.PI) * intens})`; c.font = '700 44px Inter'; c.fillText(i % 2 ? '♪' : '♫', x + Math.sin(T * 1.3 + i * 2) * 40 + f * 60, y - f * 220); } }
function escadaVelas(c, T) {
  c.fillStyle = '#1a1410'; c.fillRect(-600, -400, W + 1200, 1800);
  c.fillStyle = '#2a2018'; for (let i = 0; i < 10; i++) { c.fillRect(-200 + i * 220, 930 - i * 50, 900, 50); c.fillStyle = i % 2 ? '#2a2018' : '#30251c'; }
  c.fillStyle = '#3a2a1e'; c.fillRect(-600, 930, W + 1200, 400);
  [[380, 860], [960, 780], [1560, 700]].forEach(([x, y]) => vela(c, x, y, T, 1));
  escuridao(c, 0.62, [fonteVela(380, 860, T, 700), fonteVela(960, 780, T, 700), fonteVela(1560, 700, T, 700)], '12,6,2');
}
// ---------- rua e cidade ----------
function posteTransformador(c, T, x, estouro = 0) {
  poste(c, x, 935, 520);
  c.fillStyle = '#5a5a60'; rr(c, x - 50, 935 - 470, 100, 120, 14); c.fill(); c.fillStyle = '#7a7a80'; c.fillRect(x - 40, 935 - 450, 80, 8);
  if (estouro > 0) { const e = estouro;
    c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = rgrad(c, x, 935 - 420, 0, 900 * e, [[0, `rgba(255,255,230,${e})`], [0.2, `rgba(160,200,255,${0.7 * e})`], [1, 'rgba(120,160,255,0)']]); c.fillRect(x - 1200, -400, 2400, 1600); c.restore();
    const r = rng(Math.floor(T * 20)); c.strokeStyle = `rgba(255,230,140,${e})`; c.lineWidth = 3;
    for (let i = 0; i < 26; i++) { const a = r() * 6.28, d = 40 + r() * 260 * e; c.beginPath(); c.moveTo(x, 935 - 420); c.lineTo(x + Math.cos(a) * d, 935 - 420 + Math.sin(a) * d + d * 0.4); c.stroke(); } }
}
function avenidaSinal(c, T, { verde = 0 } = {}) {
  ceuCalor(c, 700, { hora: 'dia' }); morrosRio(c, 640, 300, '#a08c78', 4);
  skyline(c, 31, 720, 380, '#b8a088', { janelas: 0 });
  c.fillStyle = '#b8aa98'; c.fillRect(-800, 900, W + 1600, 60); c.fillStyle = '#3e3a38'; c.fillRect(-800, 960, W + 1600, 520);
  c.fillStyle = 'rgba(255,255,255,0.7)'; for (let i = 0; i < 10; i++) c.fillRect(-400 + i * 200, 1000, 120, 40); // faixa de pedestre
  // árvore com sombra (onde o Tião fica)
  c.fillStyle = 'rgba(40,30,20,0.35)'; c.beginPath(); c.ellipse(260, 950, 300, 40, 0, 0, 7); c.fill();
  c.fillStyle = '#5a3e26'; c.fillRect(240, 560, 40, 390); c.fillStyle = '#4a6a3a'; c.beginPath(); c.arc(260, 520, 190, 0, 7); c.arc(130, 580, 120, 0, 7); c.arc(390, 590, 130, 0, 7); c.fill();
  // semáforo
  c.fillStyle = '#2a2a2e'; c.fillRect(1540, 420, 16, 500); rr(c, 1500, 300, 96, 220, 14); c.fill();
  [['#c62a24', !verde], ['#e0b030', 0], ['#2ac05a', verde]].forEach(([cor, on], i) => { c.fillStyle = on ? cor : shade(cor, 0.3); c.beginPath(); c.arc(1548, 340 + i * 68, 24, 0, 7); c.fill();
    if (on) { c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = rgrad(c, 1548, 340 + i * 68, 0, 90, [[0, 'rgba(255,80,60,0.6)'], [1, 'rgba(0,0,0,0)']]); c.fillRect(1440, 240 + i * 68, 220, 220); c.restore(); } });
  carro(c, 1250, 990, 1.05, '#5a6a8a', 1); carro(c, 1900, 990, 1.05, '#c8c0b0', 1);
}
function feira(c, T) {
  ceuCalor(c, 700); morrosRio(c, 640, 260, '#a89480', 6);
  c.fillStyle = '#b8aa98'; c.fillRect(-800, 900, W + 1600, 600);
  const cores = [['#c62a24', '#f2efe9'], ['#2f6fb0', '#f2efe9'], ['#e8b22e', '#5a4a2a'], ['#2a8a5a', '#f2efe9']];
  for (let i = 0; i < 5; i++) { const x = -300 + i * 470, [a, b] = cores[i % 4];
    c.fillStyle = '#6a5a4a'; c.fillRect(x, 620, 10, 300); c.fillRect(x + 380, 620, 10, 300);
    for (let k = 0; k < 6; k++) { c.fillStyle = k % 2 ? a : b; c.beginPath(); c.moveTo(x - 20 + k * 70, 600 + Math.sin(T + i) * 4 + 20); c.lineTo(x + 50 + k * 70, 600 + 20); c.lineTo(x + 50 + k * 70, 640); c.lineTo(x - 20 + k * 70, 650); c.fill(); }
    c.fillStyle = '#8a6a4a'; c.fillRect(x - 10, 780, 410, 30);
    for (let k = 0; k < 8; k++) { c.fillStyle = ['#e8b22e', '#c62a24', '#5a9a3a', '#e07a2a'][(k + i) % 4]; c.beginPath(); c.arc(x + 20 + k * 48, 770, 18, 0, 7); c.fill(); } }
}
function igrejaFechada(c, T) {
  ceuCalor(c, 700); morrosRio(c, 640, 300, '#a89480', 8);
  c.fillStyle = '#ece6d6'; c.fillRect(560, 340, 800, 600); c.beginPath(); c.moveTo(540, 350); c.lineTo(960, 120); c.lineTo(1380, 350); c.fill();
  c.fillStyle = '#ece6d6'; c.fillRect(900, 40, 120, 200); c.fillStyle = '#5a4a3a'; c.fillRect(950, 0, 20, 60); c.fillRect(930, 20, 60, 16);
  c.fillStyle = '#5a3c22'; c.beginPath(); c.moveTo(860, 940); c.lineTo(860, 680); c.arc(960, 680, 100, Math.PI, 0); c.lineTo(1060, 940); c.fill();
  c.strokeStyle = '#3a3a3a'; c.lineWidth = 6; for (let i = 0; i < 8; i++) { c.beginPath(); c.moveTo(870 + i * 26, 700); c.lineTo(870 + i * 26, 940); c.stroke(); } // grade fechada
  c.fillStyle = '#b8aa98'; c.fillRect(-800, 940, W + 1600, 600);
}
function pontoOnibus(c, T) {
  ruaSuburbio(c, T, { predio: 0, desloc: 900 });
  c.fillStyle = 'rgba(60,70,80,0.85)'; c.fillRect(600, 520, 900, 26); c.fillStyle = '#4a4a50'; c.fillRect(620, 546, 14, 390); c.fillRect(1466, 546, 14, 390);
  c.fillStyle = 'rgba(160,190,210,0.35)'; c.fillRect(640, 560, 820, 250); c.fillStyle = '#6a6a70'; c.fillRect(700, 830, 700, 20);
  c.fillStyle = 'rgba(30,20,10,0.25)'; c.fillRect(600, 900, 900, 30);
}
function orlaAmanhecer(c, T) {
  ceuCalor(c, 620, { hora: 'amanhecer' });
  // morro grande à esquerda, à beira-mar
  c.fillStyle = '#3a3048'; c.beginPath(); c.moveTo(-300, 620); c.quadraticCurveTo(-100, 120, 140, 160); c.quadraticCurveTo(300, 260, 420, 620); c.fill();
  c.fillStyle = vgrad(c, 600, 780, [[0, '#d08a8a'], [1, '#6a5a8a']]); c.fillRect(-800, 600, W + 1600, 180); // mar
  c.fillStyle = 'rgba(255,220,200,0.4)'; for (let i = 0; i < 8; i++) c.fillRect(-200 + ((i * 337 + T * 40) % 2400), 640 + i * 16, 160, 3);
  c.fillStyle = '#e8cfa8'; c.fillRect(-800, 760, W + 1600, 800); // areia
  const r = rng(17); for (let i = 0; i < 70; i++) { const x = -400 + r() * 2700, y = 800 + r() * 220, s = 0.55 + (y - 800) / 400;
    c.fillStyle = ['#c62a24', '#2f6fb0', '#e8b22e', '#2a8a5a', '#b04a7a'][i % 5]; rr(c, x - 60 * s, y - 8 * s, 120 * s, 22 * s, 6); c.fill(); // canga
    c.fillStyle = ['#7a4e34', '#c08a64', '#a9724f', '#5a3a26'][i % 4]; c.beginPath(); c.ellipse(x - 30 * s, y - 2 * s, 18 * s, 12 * s, 0, 0, 7); c.fill(); c.fillStyle = ['#3a5a7a', '#7a3a3a', '#3a6a4a'][i % 3]; rr(c, x - 12 * s, y - 14 * s, 70 * s, 22 * s, 8); c.fill(); }
}
function fabricaGelo(c, T) {
  ceuCalor(c, 700, { hora: 'amanhecer' }); skyline(c, 44, 720, 300, '#6e5a70', { janelas: 0 });
  c.fillStyle = '#d8d8d4'; c.fillRect(300, 380, 1300, 560); c.fillStyle = '#2f6fb0'; c.fillRect(300, 380, 1300, 90);
  c.fillStyle = '#f2efe9'; c.font = '700 70px Oswald'; c.fillText('GELO', 860, 450);
  c.fillStyle = '#5a6a7a'; c.fillRect(760, 600, 400, 340);
  for (let i = 0; i < 6; i++) { c.fillStyle = 'rgba(220,240,255,0.9)'; rr(c, 790 + (i % 3) * 120, 760 + Math.floor(i / 3) * 80, 100, 70, 6); c.fill(); }
  vapor(c, T, 900, 760, 6); vapor(c, T + 1, 1040, 760, 6);
  c.fillStyle = '#b8aa98'; c.fillRect(-800, 940, W + 1600, 600);
}
function emergencia(c, T, { lotada = 1 } = {}) {
  c.fillStyle = vgrad(c, -200, 940, [[0, '#e2ebe9'], [1, '#c8d4d2']]); c.fillRect(-600, -400, W + 1200, 1340);
  c.fillStyle = '#3f7f86'; c.fillRect(-600, 600, W + 1200, 16); c.fillStyle = '#a2aeac'; c.fillRect(-600, 930, W + 1200, 400);
  c.fillStyle = 'rgba(255,255,255,0.5)'; for (let i = 0; i < 5; i++) c.fillRect(-300 + i * 520, -300, 300, 40); // luzes
  for (let i = 0; i < 4 * lotada; i++) { const x = -200 + i * 560; // macas com pacientes idosos
    c.fillStyle = '#c8d0d0'; rr(c, x, 800, 380, 40, 8); c.fill(); c.fillStyle = '#7a8a8a'; c.fillRect(x + 20, 840, 10, 90); c.fillRect(x + 350, 840, 10, 90);
    c.fillStyle = '#f2f2ee'; rr(c, x + 10, 770, 360, 40, 14); c.fill(); c.fillStyle = ['#c99a78', '#8a5a3c', '#d3a383'][i % 3]; c.beginPath(); c.arc(x + 40, 772, 24, 0, 7); c.fill();
    c.fillStyle = '#e4e0da'; c.beginPath(); c.arc(x + 34, 760, 20, Math.PI, 0); c.fill();
    c.strokeStyle = '#9aa6a4'; c.lineWidth = 4; c.beginPath(); c.moveTo(x + 400, 930); c.lineTo(x + 400, 560); c.stroke(); c.fillStyle = 'rgba(210,230,240,0.8)'; rr(c, x + 384, 560, 32, 50, 6); c.fill(); } // soro
}
function enfermaria(c, T, { chuva = 0, entardecer = 0 } = {}) {
  c.fillStyle = vgrad(c, -200, 940, [[0, '#e6ecea'], [1, '#cfd8d6']]); c.fillRect(-600, -400, W + 1200, 1340);
  c.fillStyle = '#a8b4b2'; c.fillRect(-600, 930, W + 1200, 400);
  // janela
  c.save(); c.beginPath(); c.rect(760, 160, 520, 380); c.clip(); c.translate(560, 40); c.scale(0.5, 0.5); ceuCalor(c, 900, { hora: chuva ? 'nublado' : (entardecer ? 'entardecer' : 'dia') }); morrosRio(c, 820, 420, chuva ? '#4a505a' : '#9a8a78', 3); if (chuva) chuvaFx(c, T, 1.2); c.restore();
  c.strokeStyle = '#f2f2ee'; c.lineWidth = 12; c.strokeRect(760, 160, 520, 380);
  [[180, 0], [1340, 1]].forEach(([x]) => { c.fillStyle = '#d0d8d8'; rr(c, x, 780, 520, 50, 10); c.fill(); c.fillStyle = '#f4f4f0'; rr(c, x + 10, 740, 500, 54, 16); c.fill(); c.fillStyle = '#e8eef2'; rr(c, x + 10, 700, 120, 50, 18); c.fill();
    c.fillStyle = '#8a9696'; c.fillRect(x + 20, 830, 12, 100); c.fillRect(x + 490, 830, 12, 100); });
  c.strokeStyle = '#9aa6a4'; c.lineWidth = 4; c.beginPath(); c.moveTo(720, 930); c.lineTo(720, 520); c.stroke(); c.fillStyle = 'rgba(210,230,240,0.85)'; rr(c, 704, 520, 32, 54, 6); c.fill();
}
function filaPipa(c, T) {
  ruaSuburbio(c, T, { predio: 0, desloc: 300, arCond: 1 });
  caminhaoPipa(c, 1450, 990, 1.05, -1);
  fila(c, T, 1050, 990, 14, -88, 0.5, 21, 1);
}
function garagemGerador(c, T, { portao = 0.15, fumaca = 1, ligado = 1 } = {}) {
  c.fillStyle = '#3a3634'; c.fillRect(-600, -400, W + 1200, 1340); c.fillStyle = '#2a2624'; c.fillRect(-600, 930, W + 1200, 400);
  c.fillStyle = 'rgba(0,0,0,0.25)'; for (let i = 0; i < 5; i++) c.fillRect(-300 + i * 520, -400, 30, 1330);
  // portão de enrolar (abertura embaixo)
  const ab = clamp(portao); c.fillStyle = '#5a5a5e'; c.fillRect(1240, 260, 620, 670 * (1 - ab)); c.strokeStyle = 'rgba(0,0,0,0.3)'; c.lineWidth = 3; for (let y = 260; y < 260 + 670 * (1 - ab); y += 24) { c.beginPath(); c.moveTo(1240, y); c.lineTo(1860, y); c.stroke(); }
  if (ab > 0) { c.fillStyle = vgrad(c, 930 - 670 * ab, 930, [[0, '#f6d6a0'], [1, '#e8b880']]); c.fillRect(1240, 260 + 670 * (1 - ab), 620, 670 * ab); }
  gerador(c, 760, 930, 1.1, ligado, T);
  if (fumaca) { c.fillStyle = `rgba(110,110,115,${0.28 * fumaca})`; c.fillRect(-600, -400, W + 1200, 1340); }
}
function apAdemar(c, T, { aberto = 0 } = {}) {
  c.fillStyle = vgrad(c, -200, 940, [[0, '#5a4a3a'], [1, '#4a3c2e']]); c.fillRect(-600, -400, W + 1200, 1340); c.fillStyle = '#3a2e22'; c.fillRect(-600, 930, W + 1200, 400);
  // cortinas pesadas
  c.fillStyle = '#5a2e2a'; c.fillRect(160, 160, 600 * (1 - aberto * 0.8), 560); if (aberto) { c.fillStyle = vgrad(c, 160, 720, [[0, '#f0c890'], [1, '#e0a070']]); c.fillRect(160 + 600 * (1 - aberto * 0.8), 160, 600 * aberto * 0.8, 560); }
  // fotos antigas e estante
  [[900, 280], [1040, 300], [1180, 270]].forEach(([x, y], i) => { c.fillStyle = '#8a6a3a'; c.fillRect(x, y, 100, 120); c.fillStyle = ['#c8b090', '#b8a080', '#d0b898'][i]; c.fillRect(x + 10, y + 10, 80, 100); });
  c.fillStyle = '#4a3220'; c.fillRect(1400, 400, 360, 530); c.fillStyle = '#5a3e28'; for (let i = 0; i < 4; i++) c.fillRect(1410, 420 + i * 130, 340, 12);
  c.fillStyle = '#6a4a2e'; c.fillRect(840, 760, 300, 16); c.fillRect(860, 776, 12, 154); c.fillRect(1108, 776, 12, 154);
  radio(c, 990, 760, 1.1, 0, T);
  if (!aberto) { c.fillStyle = 'rgba(10,6,4,0.45)'; c.fillRect(-600, -400, W + 1200, 1800); }
}
function carroNoite(c, T) {
  c.fillStyle = '#0c0d12'; c.fillRect(-600, -400, W + 1200, 1800);
  // luzes da rua passando pelo vidro de trás
  c.save(); c.beginPath(); c.rect(300, 180, 1320, 420); c.clip(); c.fillStyle = '#141826'; c.fillRect(300, 180, 1320, 420);
  for (let i = 0; i < 6; i++) { const x = 1700 - ((T * 420 + i * 300) % 1700); c.fillStyle = 'rgba(255,190,110,0.5)'; c.beginPath(); c.arc(x, 300 + (i % 2) * 60, 26, 0, 7); c.fill(); }
  c.restore(); c.strokeStyle = '#1e1f26'; c.lineWidth = 40; c.strokeRect(300, 180, 1320, 420);
  c.fillStyle = '#23242c'; rr(c, 120, 640, 1680, 500, 60); c.fill(); // banco de trás
  c.fillStyle = 'rgba(150,200,255,0.06)'; c.fillRect(-600, -400, W + 1200, 1800); // ar-condicionado (luz fria)
}
function upa(c, T) {
  emergencia(c, T, { lotada: 0.5 });
  cadeirasPlastico(c, [150, 260, 370, 480, 590, 700], 820);
  c.fillStyle = 'rgba(0,0,0,0.55)'; c.fillRect(1300, 200, 420, 90); c.fillStyle = '#f2efe9'; c.font = '700 44px Oswald'; c.fillText('PRONTO-ATENDIMENTO', 1320, 260);
}
function calcadaResgate(c, T) {
  ruaSuburbio(c, T, { hora: 'noite', semLuz: 1 });
  c.fillStyle = '#3a5a8a'; rr(c, 760, 900, 420, 50, 12); c.fill(); // colchonete
}
function listaParede(c, T, prog = 1) {
  c.fillStyle = '#d8ccb4'; c.fillRect(-600, -400, W + 1200, 1800);
  c.save(); c.translate(960, 540); c.rotate(-0.02); c.fillStyle = '#fbf8f0'; c.fillRect(-420, -430, 840, 860); c.fillStyle = 'rgba(0,0,0,0.12)'; c.fillRect(-420, 430, 840, 10);
  c.fillStyle = '#c8b070'; c.fillRect(-60, -450, 120, 34);
  c.fillStyle = '#1a1a1a'; c.font = '700 46px Oswald'; c.textAlign = 'center'; c.fillText('QUEM MORA SOZINHO', 0, -340); c.fillText('NESTE PRÉDIO?', 0, -282); c.textAlign = 'left';
  const nomes = ['Seu Ademar — 302', 'Dona Glória — 101', 'Seu Valdir — 201', 'Rosinete — 403', ''];
  nomes.forEach((n, i) => { if (n) manuscrito(c, -360, -180 + i * 110, n, clamp(prog * 5 - i), { tam: 48, cor: ['#1c2a4a', '#3a1c1c', '#1c3a2a', '#2a1c3a'][i % 4] }); c.strokeStyle = 'rgba(80,100,140,0.25)'; c.lineWidth = 2; c.beginPath(); c.moveTo(-380, -165 + i * 110); c.lineTo(380, -165 + i * 110); c.stroke(); });
  c.restore();
}
function rioEntardecer(c, T) {
  ceuCalor(c, 760, { hora: 'entardecer' });
  morrosRio(c, 700, 460, '#3a3a52', 3, { luzes: 1 }); morrosRio(c, 780, 260, '#2a2a3a', 9, { casas: 0.7, luzes: 1 });
  skyline(c, 51, 900, 260, '#22222e', { janelas: 0.35, corJanela: '#f2c27a' });
  c.fillStyle = '#1a1a22'; c.fillRect(-800, 900, W + 1600, 600); c.fillStyle = 'rgba(255,200,140,0.18)'; for (let i = 0; i < 12; i++) c.fillRect(-500 + i * 240, 960, 140, 4); // rua molhada refletindo
}
