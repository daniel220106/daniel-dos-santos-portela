// E SE ACONTECER? — Vídeo 1 — teste de abertura (Capítulo 1, Dia 1)
'use strict';
const O = 3.0; // atraso da narração em relação ao início do vídeo
const LUZ_MANHA = { lado: -1, brilho: 'rgba(170,195,230,0.22)', sombra: 'rgba(4,8,20,0.55)', geral: 'rgba(18,30,52,0.18)' };

// ---------- elementos de cenário reutilizáveis ----------
function skyline(c, seed, base, alt, cor, {janelas = 0, apagar = 0, x0 = -300, x1 = W + 300, larg = [70, 190], corJanela = '#f2b765'} = {}) {
  const r = rng(seed); let x = x0;
  while (x < x1) {
    const w = lerp(larg[0], larg[1], r()), h = alt * lerp(0.35, 1, r());
    c.fillStyle = cor; c.fillRect(x, base - h, w + 1, h + 400);
    if (r() < 0.35) c.fillRect(x + w * 0.3, base - h - 26, w * 0.15, 26);
    if (janelas) {
      const cols = Math.floor(w / 22), rows = Math.floor(h / 30);
      for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
        const q = r();
        if (q < janelas) {
          const limiar = r();
          const a = clamp((limiar - apagar) * 4);
          if (a > 0) { c.globalAlpha = a * (0.55 + 0.45 * q / janelas); c.fillStyle = corJanela; c.fillRect(x + 6 + i * 22, base - h + 10 + j * 30, 9, 13); c.globalAlpha = 1; }
        }
      }
    }
    x += w + lerp(-10, 14, r());
  }
}
function ceuNublado(c, t, y0 = 0, y1 = H) {
  c.fillStyle = vgrad(c, y0, y1, [[0, '#5d6977'], [0.6, '#8f979c'], [1, '#a9aca6']]); c.fillRect(-500, y0 - 1500, W + 1000, y1 - y0 + 1500);
  const r = rng(5);
  for (let i = 0; i < 14; i++) {
    const x = ((r() * 2600 + t * (8 + r() * 10)) % 2600) - 400, y = y0 + r() * (y1 - y0) * 0.55;
    c.fillStyle = `rgba(${r() < 0.5 ? '70,78,90' : '160,166,170'},${0.12 + r() * 0.12})`;
    c.beginPath(); c.ellipse(x, y, 260 + r() * 300, 40 + r() * 40, 0, 0, 7); c.fill();
  }
}
function carro(c, x, y, s, cor, dir = 1, freio = 0) {
  c.save(); c.translate(x, y); c.scale(s * dir, s);
  c.fillStyle = 'rgba(0,0,0,0.35)'; c.beginPath(); c.ellipse(0, 6, 120, 10, 0, 0, 7); c.fill();
  c.fillStyle = cor; rr(c, -115, -52, 230, 44, 12); c.fill();
  c.beginPath(); c.moveTo(-70, -50); c.lineTo(-45, -88); c.lineTo(45, -88); c.lineTo(78, -50); c.fill();
  c.fillStyle = '#1a2028'; c.beginPath(); c.moveTo(-60, -52); c.lineTo(-40, -82); c.lineTo(-4, -82); c.lineTo(-4, -52); c.fill();
  c.beginPath(); c.moveTo(4, -52); c.lineTo(4, -82); c.lineTo(40, -82); c.lineTo(66, -52); c.fill();
  c.fillStyle = 'rgba(255,255,255,0.08)'; c.fillRect(-110, -48, 220, 6);
  c.fillStyle = '#111'; [-70, 72].forEach(wx => { c.beginPath(); c.arc(wx, -8, 22, 0, 7); c.fill(); });
  c.fillStyle = '#555'; [-70, 72].forEach(wx => { c.beginPath(); c.arc(wx, -8, 9, 0, 7); c.fill(); });
  c.fillStyle = freio > 0 ? `rgba(255,40,30,${0.5 + 0.5 * freio})` : '#5a1612'; rr(c, -117, -46, 8, 14, 3); c.fill();
  if (freio > 0) { c.fillStyle = rgrad(c, -117, -40, 0, 40, [[0, `rgba(255,40,30,${0.35 * freio})`], [1, 'rgba(255,40,30,0)']]); c.fillRect(-160, -80, 80, 80); }
  c.fillStyle = '#c9c4b0'; rr(c, 108, -46, 8, 12, 3); c.fill();
  c.restore();
}
function onibus(c, x, y, s, seed) {
  const r = rng(seed);
  c.save(); c.translate(x, y); c.scale(s, s);
  c.fillStyle = 'rgba(0,0,0,0.35)'; c.beginPath(); c.ellipse(0, 6, 300, 12, 0, 0, 7); c.fill();
  c.fillStyle = '#d8d6d0'; rr(c, -290, -250, 580, 240, 18); c.fill();
  c.fillStyle = '#7d1d1d'; c.fillRect(-290, -78, 580, 26);
  c.fillStyle = '#1b222b'; for (let i = 0; i < 7; i++) { rr(c, -270 + i * 76, -220, 66, 100, 6); c.fill(); }
  // passageiros
  for (let i = 0; i < 7; i++) if (r() < 0.8) {
    c.fillStyle = 'rgba(8,10,14,0.85)'; c.beginPath(); c.arc(-237 + i * 76 + (r() - 0.5) * 20, -168, 13, 0, 7); c.fill(); rr(c, -255 + i * 76, -156, 36, 40, 10); c.fill();
  }
  c.fillStyle = '#20262d'; rr(c, 200, -220, 60, 205, 4); c.fill();
  c.fillStyle = '#111'; [-190, 190].forEach(wx => { c.beginPath(); c.arc(wx, -8, 32, 0, 7); c.fill(); });
  c.fillStyle = '#444'; [-190, 190].forEach(wx => { c.beginPath(); c.arc(wx, -8, 13, 0, 7); c.fill(); });
  c.fillStyle = '#111'; rr(c, -240, -244, 220, 20, 3); c.fill();
  c.restore();
}
function poste(c, x, yChao, h) {
  c.fillStyle = '#2b2d30'; c.fillRect(x - 9, yChao - h, 18, h);
  c.fillRect(x - 70, yChao - h + 30, 140, 10);
  c.fillStyle = '#3c3f44'; [-55, 0, 55].forEach(d => { c.fillRect(x + d - 4, yChao - h + 16, 8, 16); });
}
function fios(c, pts, sag = 40, cor = 'rgba(20,20,22,0.8)', larg = 2.5) {
  c.strokeStyle = cor; c.lineWidth = larg;
  for (let i = 0; i < pts.length - 1; i++) {
    const [a, b] = [pts[i], pts[i + 1]];
    c.beginPath(); c.moveTo(a[0], a[1]); c.quadraticCurveTo((a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + sag, b[0], b[1]); c.stroke();
  }
}
function celularTela(c, x, y, w, h, desenhaConteudo, brilho = 1) {
  c.save();
  c.fillStyle = '#0c0d10'; rr(c, x - w / 2 - 14, y - h / 2 - 14, w + 28, h + 28, 46); c.fill();
  c.strokeStyle = '#2b2e33'; c.lineWidth = 3; c.stroke();
  c.save(); rr(c, x - w / 2, y - h / 2, w, h, 34); c.clip();
  c.fillStyle = vgrad(c, y - h / 2, y + h / 2, [[0, '#18263a'], [1, '#0b111b']]); c.fillRect(x - w / 2, y - h / 2, w, h);
  c.globalAlpha = brilho; desenhaConteudo(c, x - w / 2, y - h / 2, w, h); c.globalAlpha = 1;
  c.restore();
  c.fillStyle = '#000'; rr(c, x - 50, y - h / 2 + 12, 100, 26, 13); c.fill();
  c.restore();
}
function iconeSinal(c, x, y, s, cor = '#e8e4dc', semSinal = true) {
  c.save(); c.translate(x, y); c.scale(s, s);
  for (let i = 0; i < 4; i++) { c.fillStyle = 'rgba(232,228,220,0.25)'; rr(c, i * 10, 20 - i * 6 - 6, 7, i * 6 + 6, 2); c.fill(); }
  if (semSinal) { c.strokeStyle = PAL.vermelhoVivo; c.lineWidth = 4; c.beginPath(); c.moveTo(30, -4); c.lineTo(46, 12); c.moveTo(46, -4); c.lineTo(30, 12); c.stroke(); }
  c.restore();
}

// ---------- ambientes ----------
function quarto(c, t) {
  // parede
  c.fillStyle = vgrad(c, 0, H, [[0, '#1f252d'], [1, '#14181e']]); c.fillRect(-200, -200, W + 400, H + 400);
  // janela com persiana (esquerda)
  c.fillStyle = '#8fa3b8'; c.fillRect(120, 160, 360, 420);
  for (let i = 0; i < 18; i++) { c.fillStyle = i % 2 ? '#2d3540' : '#3a4553'; c.fillRect(120, 160 + i * 23.3, 360, 15); }
  c.strokeStyle = '#11151a'; c.lineWidth = 18; c.strokeRect(120, 160, 360, 420);
  // faixas de luz na parede
  c.save(); c.globalCompositeOperation = 'screen';
  for (let i = 0; i < 9; i++) {
    c.fillStyle = 'rgba(150,175,205,0.07)';
    c.beginPath(); const y = 120 + i * 46; c.moveTo(700, y); c.lineTo(1600, y + 160); c.lineTo(1600, y + 184); c.lineTo(700, y + 18); c.fill();
  }
  c.fillStyle = rgrad(c, 300, 370, 0, 700, [[0, 'rgba(130,160,200,0.18)'], [1, 'rgba(0,0,0,0)']]); c.fillRect(-200, -200, 1400, 1400);
  c.restore();
  particulas(c, t, 50, 3, { area: [200, 150, 900, 600], cor: 'rgba(200,215,235,0.6)', tam: [0.8, 2.2], vel: [-4, 6, -6, 3], brilho: 0.55 });
  // criado-mudo + relógio desligado
  c.fillStyle = '#2a2019'; c.fillRect(1560, 690, 220, 270);
  c.fillStyle = '#20180f'; c.fillRect(1560, 690, 220, 18);
  c.fillStyle = '#121315'; rr(c, 1600, 630, 140, 64, 8); c.fill();
  c.fillStyle = '#060707'; rr(c, 1612, 642, 116, 40, 4); c.fill();
  c.fillStyle = 'rgba(255,255,255,0.05)'; c.fillRect(1614, 644, 112, 8);
  // cama
  c.fillStyle = '#251c16'; c.fillRect(560, 560, 40, 420); // cabeceira
  c.fillStyle = '#2b2119'; c.fillRect(560, 820, 1000, 160);
  c.fillStyle = '#c9ccd0'; rr(c, 590, 770, 960, 70, 16); c.fill();
  c.fillStyle = '#d7d9dc'; rr(c, 610, 715, 200, 70, 30); c.fill(); // travesseiro
  c.fillStyle = 'rgba(0,0,0,0.25)'; c.fillRect(590, 820, 960, 20);
}
function cobertor(c, t) {
  c.fillStyle = '#5b2526';
  c.beginPath(); c.moveTo(920, 790); c.bezierCurveTo(1000, 700, 1200, 740, 1300, 735); c.bezierCurveTo(1420, 730, 1540, 740, 1560, 760);
  c.lineTo(1560, 900); c.lineTo(900, 900); c.closePath(); c.fill();
  c.strokeStyle = 'rgba(0,0,0,0.25)'; c.lineWidth = 5;
  c.beginPath(); c.moveTo(1050, 760); c.quadraticCurveTo(1150, 800, 1250, 770); c.stroke();
  c.beginPath(); c.moveTo(1300, 760); c.quadraticCurveTo(1380, 810, 1480, 775); c.stroke();
  c.fillStyle = 'rgba(160,185,220,0.08)'; c.fillRect(900, 700, 660, 70);
}
function sala(c, t, {tv = true, janelaX = null} = {}) {
  c.fillStyle = vgrad(c, 0, H, [[0, '#232931'], [0.75, '#1a1e24'], [0.76, '#2a2420'], [1, '#1d1915']]); c.fillRect(-400, -200, W + 800, H + 400);
  // rodapé
  c.fillStyle = '#121418'; c.fillRect(-400, 812, W + 800, 14);
  // quadro
  c.fillStyle = '#15181c'; c.fillRect(260, 250, 230, 160); c.fillStyle = '#3a3f46'; c.fillRect(272, 262, 206, 136);
  c.fillStyle = '#5a4a3a'; c.beginPath(); c.moveTo(272, 398); c.lineTo(350, 320); c.lineTo(420, 370); c.lineTo(478, 330); c.lineTo(478, 398); c.fill();
  if (tv) {
    c.fillStyle = '#1b1612'; c.fillRect(1280, 640, 560, 180);
    c.fillStyle = '#0b0c0e'; rr(c, 1330, 300, 470, 280, 6); c.fill();
    c.fillStyle = vgrad(c, 310, 570, [[0, '#14171b'], [1, '#07080a']]); c.fillRect(1340, 310, 450, 260);
    c.fillStyle = 'rgba(170,190,220,0.07)'; c.beginPath(); c.moveTo(1340, 310); c.lineTo(1520, 310); c.lineTo(1400, 570); c.lineTo(1340, 570); c.fill();
    c.fillStyle = '#0b0c0e'; c.fillRect(1545, 580, 40, 60);
  }
}
function sofa(c) {
  c.fillStyle = '#3b3430'; rr(c, 300, 600, 680, 240, 30); c.fill();
  c.fillStyle = '#463e39'; rr(c, 300, 440, 120, 380, 30); c.fill();
  c.fillStyle = '#4c433d'; rr(c, 380, 640, 560, 70, 20); c.fill();
}
function sofaBraco(c) { c.fillStyle = '#4f4640'; rr(c, 900, 560, 110, 280, 30); c.fill(); }

function predioPrincipal(c, t, {janelasAcesas = 0, lucasNaJanela = 0} = {}) {
  const x = 700, w = 520, andares = 14, hA = 108, chao = 940;
  c.fillStyle = '#6f6d69'; c.fillRect(x, chao - andares * hA - 40, w, andares * hA + 40);
  c.fillStyle = '#5e5c58'; c.fillRect(x + w - 70, chao - andares * hA - 40, 70, andares * hA + 40);
  c.fillStyle = '#4a4946'; c.fillRect(x - 10, chao - andares * hA - 70, w + 20, 34);
  c.fillStyle = '#3d3c3a'; c.fillRect(x + 160, chao - andares * hA - 160, 140, 100); // caixa d'água
  for (let k = 1; k <= andares; k++) {
    const y = chao - k * hA;
    c.fillStyle = '#585653'; c.fillRect(x - 14, y + hA - 14, w + 28, 12); // laje/sacada
    for (let j = 0; j < 4; j++) {
      const jx = x + 30 + j * 120;
      c.fillStyle = '#1e2329'; c.fillRect(jx, y + 18, 80, 62);
      c.fillStyle = 'rgba(160,175,190,0.18)'; c.fillRect(jx, y + 18, 80, 14);
      c.strokeStyle = '#3f3e3c'; c.lineWidth = 4; c.strokeRect(jx, y + 18, 80, 62);
      if (k === 9 && j === 1 && lucasNaJanela > 0) {
        c.save(); c.beginPath(); c.rect(jx, y + 18, 80, 62); c.clip();
        desenharPessoa(c, { x: jx + 42, y: y + 125, s: 0.22, dir: -1, silhueta: 'rgba(10,12,16,0.95)', alpha: lucasNaJanela, bracoF: [1.2, 0.6] });
        c.restore();
      }
    }
  }
  c.fillStyle = '#3a3936'; c.fillRect(x, chao - hA, w, hA);
  c.fillStyle = '#26282b'; c.fillRect(x + 200, chao - 90, 120, 90);
  return { x, w, hA, chao };
}

// ---------- cenas ----------
const CENAS = [];
const cena = (a, b, fn, extra = {}) => CENAS.push({ a, b, fn, ...extra });

// 0 — ABERTURA: identidade do canal
cena(0, 3.0, (c, t) => {
  c.fillStyle = vgrad(c, 0, H, [[0, '#050506'], [0.62, '#1c0907'], [0.8, '#5c1a10'], [1, '#160605']]); c.fillRect(0, 0, W, H);
  c.fillStyle = rgrad(c, W / 2, 930, 0, 900, [[0, 'rgba(232,121,43,0.45)'], [1, 'rgba(232,121,43,0)']]); c.fillRect(0, 0, W, H);
  c.save(); camera(c, 1.04 - t * 0.012, W / 2, H / 2 + t * 4);
  skyline(c, 11, 1080, 380, '#120708', { janelas: 0.25, apagar: sstep(1.6, 2.6, t), corJanela: '#f0a45a' });
  skyline(c, 12, 1110, 260, '#080405', { janelas: 0.15, apagar: sstep(1.4, 2.4, t), corJanela: '#f0a45a' });
  c.restore();
  particulas(c, t, 70, 9, { area: [0, 300, W, 800], cor: 'rgba(255,140,60,0.9)', tam: [1, 2.6], vel: [-10, 20, -60, -25], brilho: 0.7 });
  const a = sstep(0.25, 1.0, t);
  c.save(); c.globalAlpha = a; c.textAlign = 'center'; c.textBaseline = 'middle';
  const z = 1.08 - 0.08 * easeOut(t / 2);
  c.translate(W / 2, 470); c.scale(z, z);
  c.shadowColor = 'rgba(0,0,0,0.8)'; c.shadowBlur = 40;
  c.font = '700 168px Oswald'; c.fillStyle = PAL.texto; c.fillText('E SE ACONTECER?', 0, 0);
  c.shadowBlur = 0;
  c.fillStyle = PAL.vermelhoVivo; c.fillRect(-300 * sstep(0.6, 1.4, t), 104, 600 * sstep(0.6, 1.4, t), 8);
  c.globalAlpha = a * sstep(1.0, 1.6, t); c.font = '400 34px Oswald'; c.fillStyle = 'rgba(242,239,233,0.85)';
  c.fillText('SIMULAÇÃO', 0, 170);
  c.restore();
}, { saiPreto: 0.35 });

// 1 — quarto: Lucas acorda (narração 0–3.2)
cena(3.0, 6.2, (c, t) => {
  const [hx, hy, hr] = handheld(t, 2);
  c.save(); camera(c, 1.05 + t * 0.018, 1000 + hx, 600 + hy, hr);
  quarto(c, t);
  const sobe = easeIO(clamp((t - 0.9) / 1.5));
  desenharPessoa(c, {
    x: 980, y: 760, s: 1, dir: 1, tronco: lerp(-1.48, -0.12, sobe), semPernas: true,
    cabeca: { giro: lerp(0.2, -0.7, sstep(2.4, 3.0, t)), incl: lerp(0.15, 0, sobe) },
    bracoF: [lerp(0.1, -0.35, sobe), lerp(0.2, 0.5, sobe)], bracoT: [lerp(0.05, -0.5, sobe), 0.3],
    piscar: t < 0.35 ? 1 : (Math.abs(t - 1.9) < 0.07 ? 1 : 0), expr: t > 2.2 ? 'preocupado' : '', luz: LUZ_MANHA
  });
  cobertor(c, t);
  c.restore();
}, { preto: 0.6 });

// 2 — geladeira calada (narração 3.2–8.5)
cena(6.2, 11.45, (c, t) => {
  const push = easeIO(clamp((t - 2.6) / 2.6));
  const [hx, hy, hr] = handheld(t + 10, 2.5);
  c.save(); camera(c, 1.0 + push * 0.22, 1060 + push * 80 + hx, 560 + hy, hr);
  // cozinha
  c.fillStyle = vgrad(c, 0, H, [[0, '#20262b'], [1, '#15191d']]); c.fillRect(-300, -300, W + 600, H + 600);
  for (let i = 0; i < 16; i++) for (let j = 0; j < 6; j++) { c.strokeStyle = 'rgba(255,255,255,0.035)'; c.lineWidth = 2; c.strokeRect(-100 + i * 70, 330 + j * 70, 70, 70); }
  c.fillStyle = '#2b2520'; c.fillRect(-200, 630, 1000, 330); c.fillStyle = '#3c3833'; c.fillRect(-200, 610, 1010, 26);
  c.fillStyle = 'rgba(160,185,220,0.12)'; c.fillRect(-200, 610, 1010, 6);
  c.fillStyle = '#18140f'; c.fillRect(-300, 960, W + 600, 300);
  // geladeira
  const fx = 1050, fy = 230, fw = 380, fh = 730;
  const abre = easeIO(clamp((t - 1.55) / 1.1)) * 1.2;
  c.fillStyle = '#0a0c0e'; c.fillRect(fx, fy, fw, fh); // interior escuro
  c.save(); c.beginPath(); c.rect(fx + 12, fy + 12, fw - 24, fh - 24); c.clip();
  c.fillStyle = vgrad(c, fy, fy + fh, [[0, '#1a1f24'], [1, '#0c0f12']]); c.fillRect(fx, fy, fw, fh);
  for (let s = 1; s < 5; s++) { c.fillStyle = 'rgba(150,170,190,0.22)'; c.fillRect(fx + 12, fy + s * 140, fw - 24, 5); }
  [[1110, 330, 40, 90, '#2d3a2a'], [1170, 350, 70, 70, '#3a2f22'], [1300, 470, 90, 70, '#4a3c2a'], [1120, 600, 60, 110, '#2a3442'], [1250, 610, 120, 60, '#3a2626']].forEach(([x, y, w, h, col]) => { c.fillStyle = col; rr(c, x, y, w, h, 8); c.fill(); });
  c.fillStyle = '#2a2d30'; rr(c, fx + fw / 2 - 30, fy + 22, 60, 16, 6); c.fill(); // lâmpada apagada
  c.restore();
  // porta abrindo (dobradiça à direita)
  const pw = fw * Math.cos(abre);
  c.fillStyle = vgrad(c, fy, fy + fh, [[0, '#9b9a95'], [1, '#6f6e6a']]); c.fillRect(fx + fw - pw, fy, pw, fh);
  c.fillStyle = 'rgba(0,0,0,0.25)'; c.fillRect(fx + fw - pw, fy + 250, pw, 6);
  if (pw > 30) { c.fillStyle = '#4b4a47'; rr(c, fx + fw - pw + 18 * Math.cos(abre), fy + 300, 14, 160, 6); c.fill(); }
  if (abre > 0.02) { // face interna da porta
    const iw = fw * Math.sin(abre) * 0.45;
    c.fillStyle = '#2a2d31'; c.beginPath(); c.moveTo(fx + fw, fy); c.lineTo(fx + fw + iw, fy - 30 * Math.sin(abre)); c.lineTo(fx + fw + iw, fy + fh + 30 * Math.sin(abre)); c.lineTo(fx + fw, fy + fh); c.fill();
  }
  c.fillStyle = '#050607'; rr(c, fx + fw - pw + 0.62 * pw, fy + 60, 0.22 * pw, 40, 4); c.fill(); // painel apagado
  // Lucas
  const alcanca = sstep(0.6, 1.4, t) * (1 - sstep(2.0, 2.6, t));
  desenharPessoa(c, {
    x: 870, y: 684, s: 1, dir: 1, tronco: 0.04 + sstep(2.6, 3.4, t) * 0.12,
    cabeca: { giro: 0.75, incl: sstep(2.6, 3.4, t) * 0.12 }, expr: t > 2.6 ? 'preocupado' : '',
    bracoF: [lerp(0.05, 1.42, alcanca), lerp(0.2, 0.12, alcanca)], bracoT: [-0.05, 0.25],
    piscar: Math.abs(t - 3.9) < 0.07 ? 1 : 0, luz: { ...LUZ_MANHA, lado: -1 }
  });
  c.restore();
});

// 3 — celular sem sinal (narração 8.5–12.1)
cena(11.45, 15.1, (c, t) => {
  const fundo = buf('fundoQuarto'), fc = fundo.getContext('2d');
  fc.setTransform(1, 0, 0, 1, 0, 0); fc.save(); camera(fc, 1.3, 1100, 600); quarto(fc, t); fc.restore();
  c.filter = 'blur(14px)'; c.drawImage(fundo, 0, 0); c.filter = 'none';
  c.fillStyle = 'rgba(5,8,14,0.35)'; c.fillRect(0, 0, W, H);
  const zoom = 1 + sstep(2.1, 3.3, t) * 0.55;
  const [hx, hy, hr] = handheld(t + 20, 5);
  c.save(); camera(c, zoom, 960 + sstep(2.1, 3.3, t) * -150 + hx, 560 - sstep(2.1, 3.3, t) * 270 + hy, hr - 0.06);
  // mão de trás (dedos na lateral esquerda)
  c.fillStyle = VISUAIS.lucas.peleSombra;
  for (let i = 0; i < 3; i++) { rr(c, 735, 520 + i * 70, 60, 46, 22); c.fill(); }
  celularTela(c, 960, 560, 400, 820, (k, x, y, w, h) => {
    k.fillStyle = '#e8e4dc'; k.font = '600 26px Inter'; k.textBaseline = 'middle';
    k.fillText('07:12', x + 36, y + 26);
    k.font = '400 22px Inter'; k.fillText('Sem serviço', x + 36, y + 66);
    iconeSinal(k, x + w - 120, y + 16, 1);
    k.fillStyle = 'rgba(232,228,220,0.8)'; rr(k, x + w - 56, y + 18, 34, 16, 4); k.fill();
    k.textAlign = 'center'; k.font = '600 44px Inter'; k.fillStyle = '#f0ece4'; k.fillText('Sem sinal', x + w / 2, y + h / 2 - 10);
    k.font = '400 24px Inter'; k.fillStyle = 'rgba(240,236,228,0.6)'; k.fillText('Nenhuma rede disponível', x + w / 2, y + h / 2 + 40);
    iconeSinal(k, x + w / 2 - 50, y + h / 2 - 150, 2.2);
    // toque
    [1.0, 1.8].forEach(tt => { const p = clamp((t - tt) / 0.5); if (p > 0 && p < 1) { k.strokeStyle = `rgba(255,255,255,${0.5 * (1 - p)})`; k.lineWidth = 3; k.beginPath(); k.arc(x + w / 2 + 40, y + h / 2 + 160, 20 + p * 50, 0, 7); k.stroke(); } });
  });
  // polegar
  const toque = Math.max(0, 1 - Math.abs(t - 1.0) / 0.25) + Math.max(0, 1 - Math.abs(t - 1.8) / 0.25);
  c.fillStyle = VISUAIS.lucas.pele;
  c.save(); c.translate(1120, 900 - toque * 20); c.rotate(-0.55); rr(c, -40, -150, 78, 200, 38); c.fill(); c.restore();
  c.fillStyle = rgrad(c, 1100, 950, 0, 320, [[0, VISUAIS.lucas.pele], [1, VISUAIS.lucas.peleSombra]]);
  c.beginPath(); c.ellipse(1080, 1020, 230, 160, -0.3, 0, 7); c.fill();
  c.fillStyle = 'rgba(80,120,190,0.18)'; c.beginPath(); c.ellipse(1080, 900, 200, 120, -0.3, 0, 7); c.fill(); // brilho da tela
  c.restore();
});

// 4 — televisão não liga (narração 12.2–16.8)
cena(15.1, 19.8, (c, t) => {
  const [hx, hy, hr] = handheld(t + 30, 2);
  c.save(); camera(c, 1.02 + t * 0.01, 1000 - t * 10 + hx, 560 + hy, hr);
  sala(c, t);
  sofa(c);
  const aponta = sstep(0.3, 0.9, t) * (1 - sstep(3.4, 4.0, t));
  const press = [1.2, 1.9, 2.6].reduce((s, p) => s + Math.max(0, 1 - Math.abs(t - p) / 0.12), 0);
  desenharPessoa(c, {
    x: 640, y: 690, s: 1, dir: 1, tronco: -0.1 + aponta * 0.08 - sstep(3.4, 4.2, t) * 0.04,
    pernaF: [1.5, -1.45], pernaT: [1.42, -1.4], pePlano: true,
    bracoF: [lerp(0.4, 1.25, aponta) - press * 0.08, lerp(0.6, 0.15, aponta)], bracoT: [0.3, 0.5],
    cabeca: { giro: 0.7, incl: sstep(3.4, 4.2, t) * 0.18 }, expr: t > 2.8 ? 'preocupado' : '',
    piscar: Math.abs(t - 2.2) < 0.07 ? 1 : 0, luz: { ...LUZ_MANHA, lado: 1 },
    objeto: (k, x, y, ang) => { k.save(); k.translate(x, y); k.rotate(-ang + Math.PI / 2); k.fillStyle = '#16171a'; rr(k, -8, -12, 62, 22, 6); k.fill(); if (press > 0.3) { k.fillStyle = '#ff3a2a'; k.beginPath(); k.arc(50, -1, 3, 0, 7); k.fill(); } k.restore(); }
  });
  sofaBraco(c);
  c.restore();
});

// 5 — exterior: o prédio na zona leste (narração 17.0–22.7)
cena(19.8, 26.0, (c, t) => {
  const p = easeIO(clamp(t / 5.6));
  const cy = lerp(640, -40, p), z = lerp(1.0, 1.55, p);
  c.save(); camera(c, z, 960, cy);
  ceuNublado(c, t, -1200, 900);
  c.save(); c.translate(0, (cy - 640) * 0.5); skyline(c, 21, 930, 520, '#8a9096'); c.restore();
  c.save(); c.translate(0, (cy - 640) * 0.25); skyline(c, 22, 940, 700, '#6f757b', { janelas: 0 }); c.restore();
  predioPrincipal(c, t, { lucasNaJanela: sstep(3.2, 4.0, t) });
  c.fillStyle = '#2c2e30'; c.fillRect(-500, 940, W + 1000, 300);
  c.fillStyle = '#4a4b4c'; c.fillRect(-500, 930, W + 1000, 14);
  carro(c, 420, 1010, 0.9, '#6b2626', 1); carro(c, 1450, 1010, 0.9, '#9aa0a6', -1);
  c.restore();
  // primeiro plano com parallax: poste e fios
  c.save(); camera(c, z, 960 + (cy - 640) * -0.05, cy * 1.25 - 160);
  poste(c, 1700, 1300, 1200); poste(c, 200, 1300, 1150);
  fios(c, [[130, 130], [1630, 130], [2300, 150]], 60); fios(c, [[130, 156], [1630, 156], [2300, 170]], 70); fios(c, [[260, 140], [1760, 140]], 50);
  c.restore();
  // rótulos
  const a1 = sstep(0.4, 1.0, t) * (1 - sstep(3.0, 3.5, t));
  c.save(); c.globalAlpha = a1; c.font = '400 34px Oswald'; c.fillStyle = PAL.texto; c.fillText('ZONA LESTE  ·  SÃO PAULO', 90, 980); c.fillStyle = PAL.vermelhoVivo; c.fillRect(90, 1000, 120, 4); c.restore();
  const a2 = sstep(3.6, 4.2, t);
  if (a2 > 0) {
    c.save(); c.globalAlpha = a2; c.strokeStyle = PAL.texto; c.lineWidth = 3;
    c.beginPath(); c.moveTo(1180, 460); c.lineTo(1180 + 200 * a2, 360); c.lineTo(1420 * a2 + 180 * (1 - a2), 360); c.stroke();
    c.font = '700 48px Oswald'; c.fillStyle = PAL.texto; c.fillText('9º ANDAR', 1400, 345); c.restore();
  }
});

// 6 — tudo pelo celular (narração 23.1–26.2)
cena(26.0, 29.25, (c, t) => {
  c.fillStyle = rgrad(c, W / 2, H / 2, 0, 1100, [[0, '#1d1214'], [1, '#050506']]); c.fillRect(0, 0, W, H);
  c.save(); camera(c, 0.95 + t * 0.04, 960, 540, 0.03 - t * 0.012);
  const fim = sstep(2.75, 3.1, t);
  celularTela(c, 960, 540, 380, 780, (k, x, y, w, h) => {
    const nomes = ['Banco', 'Mercado', 'Transporte', 'Mensagens', 'Entregas', 'Mapas', 'Trabalho', 'Música', 'Notícias'];
    const cores = ['#2f6f5e', '#b5562b', '#335a8a', '#3f8a4a', '#9a3a3a', '#5a5f9a', '#6a5a3a', '#8a3a6a', '#4a4f57'];
    nomes.forEach((n, i) => {
      const ap = easeOut(clamp((t - 0.15 - i * 0.12) / 0.35));
      const ix = x + 60 + (i % 3) * 110, iy = y + 120 + Math.floor(i / 3) * 150;
      k.save(); k.translate(ix + 40, iy + 40); k.scale(ap, ap);
      k.fillStyle = cores[i]; rr(k, -40, -40, 80, 80, 20); k.fill();
      k.fillStyle = 'rgba(255,255,255,0.85)'; k.beginPath(); k.arc(0, 0, 16, 0, 7); k.fill();
      k.restore();
      k.globalAlpha = ap; k.fillStyle = '#ddd'; k.font = '400 17px Inter'; k.textAlign = 'center'; k.fillText(n, ix + 40, iy + 104); k.globalAlpha = 1;
    });
    if (fim > 0) { k.fillStyle = `rgba(0,0,0,${fim})`; k.fillRect(x, y, w, h); }
  }, 1);
  c.restore();
  c.fillStyle = rgrad(c, 960, 540, 0, 700, [[0, `rgba(70,110,180,${0.12 * (1 - fim)})`], [1, 'rgba(0,0,0,0)']]); c.fillRect(0, 0, W, H);
});

// 7 — sem gerador, sem energia solar (narração 26.4–29.0)
cena(29.25, 32.0, (c, t) => {
  c.fillStyle = vgrad(c, 0, H, [[0, '#0c0d10'], [1, '#16110f']]); c.fillRect(0, 0, W, H);
  c.save(); camera(c, 1 + t * 0.03, 960, 540);
  const item = (x, ap, xis, desenho, rotulo) => {
    c.save(); c.globalAlpha = ap; c.translate(x, 500 + (1 - ap) * 30);
    desenho(c);
    c.font = '700 46px Oswald'; c.fillStyle = PAL.texto; c.textAlign = 'center'; c.fillText(rotulo, 0, 230);
    if (xis > 0) {
      c.strokeStyle = PAL.vermelhoVivo; c.lineWidth = 16; c.lineCap = 'round';
      c.beginPath(); c.moveTo(-150, -150); c.lineTo(-150 + 300 * clamp(xis * 2), -150 + 300 * clamp(xis * 2)); c.stroke();
      if (xis > 0.5) { c.beginPath(); c.moveTo(150, -150); c.lineTo(150 - 300 * clamp(xis * 2 - 1), -150 + 300 * clamp(xis * 2 - 1)); c.stroke(); }
    }
    c.restore();
  };
  item(620, sstep(0.05, 0.4, t), clamp((t - 0.55) / 0.4), k => {
    k.fillStyle = '#5a5f66'; rr(k, -140, -90, 280, 170, 14); k.fill();
    k.fillStyle = '#3b3f45'; rr(k, -110, -60, 150, 110, 8); k.fill();
    k.fillStyle = '#8e1b1b'; rr(k, 60, -60, 50, 50, 6); k.fill();
    k.fillStyle = '#2a2c30'; k.fillRect(-100, -130, 18, 40); [-90, 90].forEach(wx => { k.beginPath(); k.arc(wx, 95, 26, 0, 7); k.fill(); });
  }, 'GERADOR');
  item(1300, sstep(1.2, 1.55, t), clamp((t - 1.7) / 0.4), k => {
    k.save(); k.transform(1, 0, -0.35, 1, 0, 0);
    k.fillStyle = '#1f3552'; k.fillRect(-120, -110, 260, 170);
    k.strokeStyle = '#8aa4c4'; k.lineWidth = 3; for (let i = 0; i <= 4; i++) { k.beginPath(); k.moveTo(-120 + i * 65, -110); k.lineTo(-120 + i * 65, 60); k.stroke(); } for (let j = 0; j <= 3; j++) { k.beginPath(); k.moveTo(-120, -110 + j * 56.6); k.lineTo(140, -110 + j * 56.6); k.stroke(); }
    k.restore(); k.fillStyle = '#4a4f57'; k.fillRect(-10, 60, 20, 60); k.fillRect(-70, 116, 140, 12);
  }, 'ENERGIA SOLAR');
  c.restore();
});

// 8 — corredor: dois vizinhos pelo nome (narração 29.0–31.5)
cena(32.0, 35.3, (c, t) => {
  const lx = 500 + t * 300, camX = 760 + t * 300;
  c.save(); camera(c, 1.0, camX, 540);
  c.fillStyle = vgrad(c, 0, H, [[0, '#262b29'], [0.78, '#1d2120'], [0.79, '#3a3631'], [1, '#2a2622']]); c.fillRect(-200, -100, 3600, 1300);
  for (let i = 0; i < 40; i++) { c.fillStyle = 'rgba(0,0,0,0.12)'; c.fillRect(-200 + i * 90, 852, 3, 300); }
  c.fillStyle = '#151816'; c.fillRect(-200, 836, 3600, 16);
  const nums = ['91', '92', '93', '94', '95', '96', '97'];
  nums.forEach((n, i) => {
    const dx = 200 + i * 400;
    c.fillStyle = '#3a2a1f'; c.fillRect(dx, 330, 170, 510); c.strokeStyle = '#1e1611'; c.lineWidth = 10; c.strokeRect(dx, 330, 170, 510);
    c.fillStyle = '#b39a6a'; c.beginPath(); c.arc(dx + 145, 590, 8, 0, 7); c.fill();
    c.fillStyle = '#c8bfae'; c.font = '600 30px Inter'; c.textAlign = 'center'; c.fillText(n, dx + 85, 380);
    if (n === '92' || n === '96') {
      const g = sstep(1.0, 1.6, t);
      c.save(); c.globalAlpha = g; c.shadowColor = 'rgba(232,121,43,0.9)'; c.shadowBlur = 40; c.strokeStyle = 'rgba(232,121,43,0.85)'; c.lineWidth = 5; c.strokeRect(dx - 6, 324, 182, 522); c.restore();
    }
  });
  // luminária de emergência apagada
  for (let i = 0; i < 6; i++) { c.fillStyle = '#c9c6bd'; rr(c, 380 + i * 560, 200, 90, 30, 4); c.fill(); c.fillStyle = '#5a1a16'; c.beginPath(); c.arc(425 + i * 560, 215, 5, 0, 7); c.fill(); }
  const w = caminhada(t * 0.9 + 0.1);
  desenharPessoa(c, { x: lx, y: 590 + w.bob, s: 0.88, dir: 1, ...w, bob: 0, cabeca: { giro: 0.55, incl: 0.04 }, luz: { lado: 1, brilho: 'rgba(160,185,210,0.18)', sombra: 'rgba(0,0,0,0.55)', geral: 'rgba(10,18,20,0.25)' } });
  c.restore();
  // primeiro plano: pilar desfocado
  c.save(); c.filter = 'blur(10px)'; c.fillStyle = '#0a0c0c'; c.fillRect(((1400 - t * 520) % 2600 + 2600) % 2600 - 400, 0, 150, H); c.restore();
  c.fillStyle = hgrad(c, 0, W, [[0, 'rgba(0,0,0,0.5)'], [0.5, 'rgba(0,0,0,0)'], [1, 'rgba(120,150,180,0.12)']]); c.fillRect(0, 0, W, H);
});

// 9 — Lucas vai até a janela (narração 32.4–34.3)
cena(35.3, 37.25, (c, t) => {
  c.save(); camera(c, 1.0 + t * 0.03, 1000 + t * 30, 540);
  sala(c, t, { tv: false });
  // janela grande
  c.save(); c.beginPath(); c.rect(1260, 160, 520, 600); c.clip();
  ceuNublado(c, t, 160, 760); skyline(c, 31, 780, 420, '#56606a'); skyline(c, 32, 800, 300, '#3d444b');
  c.restore();
  c.strokeStyle = '#121417'; c.lineWidth = 22; c.strokeRect(1260, 160, 520, 600); c.lineWidth = 12; c.beginPath(); c.moveTo(1520, 160); c.lineTo(1520, 760); c.stroke();
  c.fillStyle = 'rgba(150,175,205,0.10)'; c.beginPath(); c.moveTo(1260, 760); c.lineTo(1780, 760); c.lineTo(1500, 980); c.lineTo(900, 980); c.fill();
  const anda = clamp(t / 1.35), x = lerp(620, 1130, easeOut(anda));
  const w = caminhada(t * 1.0 + 0.1, 1 - sstep(1.1, 1.4, t));
  const mao = sstep(1.35, 1.9, t);
  desenharPessoa(c, { x, y: 684 + w.bob, s: 1, dir: 1, ...w, bob: 0, bracoF: [lerp(w.bracoF[0], 1.25, mao), lerp(w.bracoF[1], 0.5, mao)], cabeca: { giro: 0.8 }, luz: { lado: 1, brilho: 'rgba(180,200,225,0.32)', sombra: 'rgba(0,0,0,0.55)', geral: 'rgba(15,22,35,0.2)' } });
  c.restore();
});

// 10 — o prédio inteiro apagado (narração 34.3–36.1)
cena(37.25, 39.4, (c, t) => {
  c.save(); camera(c, 1.0 + t * 0.05, 960, 520);
  ceuNublado(c, t, -100, 700);
  // prédio em frente, todo apagado
  c.fillStyle = '#5b5955'; c.fillRect(260, 60, 1400, 1100);
  for (let k = 0; k < 9; k++) for (let j = 0; j < 9; j++) {
    const x = 300 + j * 152, y = 90 + k * 118;
    c.fillStyle = '#1a1e23'; c.fillRect(x, y, 110, 78);
    c.fillStyle = 'rgba(170,185,200,0.15)'; c.fillRect(x, y, 110, 12);
    if ((k * 7 + j * 3) % 11 === 0) desenharPessoa(c, { x: x + 55, y: y + 140, s: 0.17, dir: (j % 2 ? 1 : -1), silhueta: 'rgba(8,9,12,0.9)', bracoF: [0.9, 0.6] });
  }
  c.restore();
  // moldura da janela e Lucas de costas (silhueta)
  c.fillStyle = '#0a0b0d'; c.fillRect(0, 0, W, 50); c.fillRect(0, 1000, W, 80); c.fillRect(0, 0, 60, H); c.fillRect(1860, 0, 60, H); c.fillRect(950, 0, 22, H);
  desenharPessoa(c, { x: 330, y: 1060, s: 1.9, dir: 1, silhueta: 'rgba(9,10,13,0.97)', cabeca: { giro: 1.2 }, bracoF: [0.95, 0.75] });
  c.fillStyle = 'rgba(160,185,210,0.06)'; c.fillRect(0, 0, W, H);
});

// 11 — rua: semáforos apagados (narração 36.5–43.5)
cena(39.4, 47.2, (c, t) => {
  const camX = 900 + t * 26;
  c.save(); camera(c, 1.0 + t * 0.01, camX, 520);
  ceuNublado(c, t, -100, 520);
  skyline(c, 41, 560, 500, '#6d7378'); skyline(c, 42, 600, 380, '#55595d');
  c.fillStyle = '#3a3b3c'; c.fillRect(-400, 600, 3200, 80); // calçada de trás
  c.fillStyle = '#2b2c2e'; c.fillRect(-400, 680, 3200, 300);
  for (let i = 0; i < 30; i++) { c.fillStyle = '#c9c2a8'; c.fillRect(-400 + i * 140, 822, 70, 6); }
  c.fillStyle = '#3e3f40'; c.fillRect(-400, 975, 3200, 140);
  // faixa de pedestres
  for (let i = 0; i < 8; i++) { c.fillStyle = 'rgba(220,220,210,0.55)'; c.fillRect(1180, 690 + i * 36, 220, 20); }
  // carros parados / anda-e-para
  const cores = ['#7a2a24', '#a4a8ad', '#2f3a4a', '#d0ccc4', '#3d4a3a', '#59595e', '#8a6a3a', '#26282b'];
  for (let i = 0; i < 12; i++) {
    const anda = Math.max(0, Math.sin(t * 0.8 + i)) * 6 * t;
    const x = -300 + i * 250 + (i * 37 % 60) + (i % 3 === 0 ? anda : 0);
    if (x > 1120 && x < 1460) continue;
    carro(c, x, 790, 0.85, cores[i % 8], 1, (i % 3 === 0 && Math.sin(t * 0.8 + i) < 0) ? 1 : 0.6);
  }
  for (let i = 0; i < 12; i++) {
    const x = 2600 - i * 245 - (i * 53 % 70);
    if (x > 1100 && x < 1480) continue;
    carro(c, x, 950, 0.95, cores[(i + 3) % 8], -1, 0.7);
  }
  // pedestres atravessando entre os carros
  [[0, 1, VISUAIS.pedestre1], [1.3, -1, VISUAIS.pedestre2], [3.0, 1, VISUAIS.lucas === null ? VISUAIS.pedestre1 : VISUAIS.pedestre1]].forEach(([d, dir, vis], i) => {
    const x = 1210 + i * 60 + (dir > 0 ? 1 : -1) * ((t - d) * 70) + (dir < 0 ? 160 : 0);
    const w = caminhada(t * 0.95 + i * 0.3);
    if (t > d) desenharPessoa(c, { x, y: 760 + i * 60 + w.bob * 0.4, s: 0.42, dir, ...w, bob: 0, luz: { lado: -1, brilho: 'rgba(180,190,200,0.2)', sombra: 'rgba(0,0,0,0.4)' } }, vis);
  });
  c.restore();
  // semáforo apagado em primeiro plano
  c.save(); camera(c, 1.0, camX * 1.35 - 380, 520);
  c.fillStyle = '#1d1f21'; c.fillRect(1640, 300, 26, 900); c.fillRect(1500, 300, 160, 20);
  c.fillStyle = '#16181a'; rr(c, 1440, 250, 110, 290, 14); c.fill();
  ['#2a1414', '#2a2414', '#142a18'].forEach((col, i) => { c.fillStyle = col; c.beginPath(); c.arc(1495, 300 + i * 90, 34, 0, 7); c.fill(); c.fillStyle = 'rgba(255,255,255,0.06)'; c.beginPath(); c.arc(1485, 290 + i * 90, 12, 0, 7); c.fill(); });
  c.restore();
});

// 12 — metrô e trens parados (narração 44.4–47.4)
cena(47.2, 50.6, (c, t) => {
  const desce = easeIO(sstep(1.7, 2.6, t));
  c.save(); camera(c, 1.05, 960 + t * 20, lerp(380, 820, desce));
  ceuNublado(c, t, -300, 700);
  skyline(c, 51, 720, 600, '#707479'); skyline(c, 52, 760, 420, '#5c6064');
  // viaduto e metrô parado
  c.fillStyle = '#7d7a74'; c.fillRect(-300, 470, 2600, 60); for (let i = 0; i < 7; i++) c.fillRect(-100 + i * 380, 530, 60, 600);
  c.fillStyle = '#b9bcbf'; rr(c, 100, 330, 1700, 140, 30); c.fill();
  c.fillStyle = PAL.vermelho; c.fillRect(100, 430, 1700, 14);
  for (let i = 0; i < 20; i++) { c.fillStyle = '#20262d'; rr(c, 140 + i * 82, 360, 60, 56, 6); c.fill(); if (i % 3 !== 1) { c.fillStyle = 'rgba(5,6,8,0.85)'; c.beginPath(); c.arc(170 + i * 82, 388, 11, 0, 7); c.fill(); c.fillRect(158 + i * 82, 398, 24, 18); } }
  // nível do chão: trem na plataforma
  c.fillStyle = '#4c4b48'; c.fillRect(-300, 1000, 2600, 400);
  c.fillStyle = '#5d5b57'; c.fillRect(-300, 1010, 2600, 40);
  c.fillStyle = '#9aa0a6'; rr(c, -100, 830, 2200, 170, 16); c.fill();
  c.fillStyle = '#2a4b7a'; c.fillRect(-100, 950, 2200, 16);
  for (let i = 0; i < 24; i++) { c.fillStyle = '#1c2229'; rr(c, -60 + i * 92, 860, 66, 70, 6); c.fill(); }
  const r = rng(9);
  for (let i = 0; i < 26; i++) { const vis = i % 2 ? VISUAIS.pedestre1 : VISUAIS.pedestre2; const ww = caminhada(t * 0.6 + r()); desenharPessoa(c, { x: -50 + i * 90 + r() * 40 + Math.sin(t + i) * 6, y: 1045 + ww.bob * 0.2, s: 0.34, dir: r() < 0.5 ? 1 : -1, ...(i % 4 === 0 ? ww : {}), bob: 0, silhueta: 'rgba(20,22,26,0.7)' }, vis); }
  c.restore();
});

// 13 — ônibus presos no trânsito (narração 47.8–50.6)
cena(50.6, 54.3, (c, t) => {
  const camX = 700 + t * 140;
  c.save(); camera(c, 1.0, camX, 520);
  ceuNublado(c, t, -100, 500);
  skyline(c, 61, 560, 480, '#6a6f74');
  c.fillStyle = '#3a3b3c'; c.fillRect(-400, 560, 3400, 120);
  c.fillStyle = '#2b2c2e'; c.fillRect(-400, 680, 3400, 500);
  for (let i = 0; i < 5; i++) onibus(c, 100 + i * 640, 900, 1, 70 + i);
  for (let i = 0; i < 7; i++) carro(c, -100 + i * 420, 1060, 1.0, ['#59595e', '#7a2a24', '#d0ccc4'][i % 3], 1, 0.7);
  c.restore();
});

// 14 — torres de transmissão: a falha em cascata (narração 51.6–57.3)
cena(54.3, 60.5, (c, t) => {
  c.save(); camera(c, 1.0 + t * 0.025, 960, 540);
  c.fillStyle = vgrad(c, 0, H, [[0, '#3b4450'], [0.55, '#8c8478'], [0.56, '#3a3d33'], [1, '#22241e']]); c.fillRect(-200, -200, W + 400, H + 400);
  c.fillStyle = '#4a4e44'; c.beginPath(); c.moveTo(-200, 600); for (let x = -200; x <= W + 200; x += 80) c.lineTo(x, 590 - 30 * Math.sin(x * 0.004) - 20 * Math.sin(x * 0.011)); c.lineTo(W + 200, 1300); c.lineTo(-200, 1300); c.fill();
  // torres em perspectiva
  const torres = [];
  for (let i = 0; i < 9; i++) { const k = Math.pow(0.72, i); torres.push({ x: 300 + (1 - k) * 1400, y: 980 - (1 - k) * 400, s: k }); }
  const falha = 1.4, dt = 0.32;
  const topos = [];
  torres.slice().reverse().forEach((T, ri) => {
    const i = torres.length - 1 - ri, s = T.s;
    c.save(); c.translate(T.x, T.y); c.scale(s, s);
    c.strokeStyle = '#1b1c1e'; c.lineWidth = 7;
    c.beginPath(); c.moveTo(-90, 0); c.lineTo(-18, -640); c.moveTo(90, 0); c.lineTo(18, -640);
    for (let k = 0; k < 8; k++) { const y1 = -k * 80, y2 = -(k + 1) * 80; const w1 = 90 - k * 9, w2 = 90 - (k + 1) * 9; c.moveTo(-w1, y1); c.lineTo(w2, y2); c.moveTo(w1, y1); c.lineTo(-w2, y2); }
    c.moveTo(-170, -520); c.lineTo(170, -520); c.moveTo(-130, -600); c.lineTo(130, -600); c.stroke();
    c.restore();
    topos[i] = [[T.x - 170 * s, T.y - 520 * s], [T.x + 170 * s, T.y - 520 * s], [T.x, T.y - 600 * s]];
    // luz de sinalização
    const on = t < falha + i * dt;
    if (on) { const bl = 0.6 + 0.4 * Math.sin(t * 6 + i); c.fillStyle = `rgba(255,50,40,${bl})`; c.beginPath(); c.arc(T.x, T.y - 650 * s, 6 * s + 2, 0, 7); c.fill(); c.fillStyle = rgrad(c, T.x, T.y - 650 * s, 0, 40 * s + 10, [[0, `rgba(255,50,40,${0.4 * bl})`], [1, 'rgba(255,50,40,0)']]); c.fillRect(T.x - 60, T.y - 650 * s - 60, 120, 120); }
  });
  // cabos com pulsos de energia que param
  for (let f = 0; f < 3; f++) {
    for (let i = 0; i < torres.length - 1; i++) {
      const a = topos[i][f], b = topos[i + 1][f], sag = 60 * torres[i].s;
      c.strokeStyle = 'rgba(20,20,22,0.9)'; c.lineWidth = 2.5 * torres[i].s + 0.6;
      c.beginPath(); c.moveTo(a[0], a[1]); c.quadraticCurveTo((a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + sag, b[0], b[1]); c.stroke();
      const vivo = 1 - sstep(falha + i * dt - 0.1, falha + i * dt + 0.15, t);
      if (vivo > 0) {
        c.strokeStyle = `rgba(140,200,255,${0.35 * vivo})`; c.lineWidth = 3 * torres[i].s + 1; c.setLineDash([20, 60]); c.lineDashOffset = -t * 300;
        c.beginPath(); c.moveTo(a[0], a[1]); c.quadraticCurveTo((a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + sag, b[0], b[1]); c.stroke(); c.setLineDash([]);
      }
    }
  }
  // faísca e clarão na primeira torre
  const fl = Math.max(0, 1 - Math.abs(t - falha) / 0.25);
  if (t > falha - 0.1 && t < falha + 1.2) {
    const [sx, sy] = topos[0][0];
    const r = rng(Math.floor(t * 30));
    c.strokeStyle = `rgba(200,230,255,${0.9 * (1 - (t - falha) / 1.2)})`; c.lineWidth = 3;
    for (let k = 0; k < 6; k++) { c.beginPath(); c.moveTo(sx, sy); let px = sx, py = sy; for (let j = 0; j < 4; j++) { px += (r() - 0.5) * 90; py += r() * 50; c.lineTo(px, py); } c.stroke(); }
    particulas(c, t - falha, 30, 4, { area: [sx - 150, sy - 50, 300, 400], cor: 'rgba(255,210,120,1)', tam: [1.5, 3], vel: [-60, 60, 40, 160], brilho: clamp(1 - (t - falha) / 1.2) });
  }
  c.restore();
  if (fl > 0) { c.fillStyle = `rgba(220,235,255,${0.55 * fl})`; c.fillRect(0, 0, W, H); }
  c.fillStyle = `rgba(0,0,0,${0.35 * sstep(falha, falha + 3, t)})`; c.fillRect(0, 0, W, H);
});

// 15 — mapa: grande parte do Brasil sem energia (narração 57.7–61.0)
const BRASIL = [[-69.9, 1], [-67, 2], [-64.5, 4], [-62, 4.2], [-60, 5.2], [-57.5, 3.4], [-54.5, 2.3], [-51.6, 4.2], [-50, 1.8], [-49.5, -0.2], [-47.9, -0.6], [-44.5, -2.3], [-41.5, -2.9], [-38.5, -3.7], [-35.3, -5.2], [-34.8, -7.5], [-35.3, -9.6], [-37.1, -11], [-38.5, -13], [-39, -15.5], [-39.7, -19.5], [-41, -22], [-43.2, -23], [-45.5, -23.8], [-48, -25.5], [-48.6, -28.5], [-50.2, -30.9], [-52.5, -33.7], [-53.5, -33.2], [-55.5, -31], [-57.6, -30.2], [-55.7, -27.4], [-54.6, -25.6], [-54.2, -24], [-55.4, -22.4], [-57.8, -22.1], [-58.2, -19.9], [-57.5, -18.2], [-58.4, -16.3], [-60.2, -15.1], [-60.5, -13.7], [-62.2, -13], [-65, -11.9], [-65.4, -9.7], [-68.5, -11], [-70.6, -11], [-70.5, -9.5], [-73, -9.4], [-74, -7.5], [-73, -5], [-70, -4.2], [-69.4, -1.2]];
const proj = ([lo, la]) => [960 + (lo + 52) * 24, 520 - (la + 14) * 24];
const dentro = (p, poly) => { let d = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i], [xj, yj] = poly[j]; if (((yi > p[1]) !== (yj > p[1])) && (p[0] < (xj - xi) * (p[1] - yi) / (yj - yi) + xi)) d = !d; } return d; };
const PONTOS = (() => {
  const r = rng(2024), pts = [];
  while (pts.length < 900) {
    const p = [lerp(-74, -34.8, r()), lerp(-33.7, 5.2, r())];
    if (!dentro(p, BRASIL)) continue;
    const costa = (p[0] > -50 && p[1] < -5) || (p[0] > -42) ? 1 : 0.35; // mais pontos no litoral e sudeste
    if (r() > costa) continue;
    pts.push({ p, d: Math.hypot(p[0] + 47, p[1] + 21), j: r(), isolado: p[0] > -64 && p[0] < -59 && p[1] > 0.5 });
  }
  return pts;
})();
cena(60.5, 64.6, (c, t) => {
  c.fillStyle = '#060708'; c.fillRect(0, 0, W, H);
  c.save(); camera(c, 1.0 + t * 0.03, 960, 540);
  c.beginPath(); BRASIL.forEach((p, i) => { const [x, y] = proj(p); i ? c.lineTo(x, y) : c.moveTo(x, y); }); c.closePath();
  c.fillStyle = '#111316'; c.fill(); c.strokeStyle = 'rgba(200,200,200,0.25)'; c.lineWidth = 2; c.stroke();
  const onda = (t - 0.2) * 10;
  for (const P of PONTOS) {
    const [x, y] = proj(P.p);
    const apagou = !P.isolado && onda > P.d + P.j * 3;
    const fade = P.isolado ? 1 : 1 - clamp((onda - P.d - P.j * 3) / 1.5);
    if (fade > 0) { c.fillStyle = `rgba(240,150,60,${0.85 * fade})`; c.beginPath(); c.arc(x, y, 2.6, 0, 7); c.fill(); c.fillStyle = `rgba(240,150,60,${0.12 * fade})`; c.beginPath(); c.arc(x, y, 9, 0, 7); c.fill(); }
    else if (apagou) { c.fillStyle = 'rgba(120,30,25,0.5)'; c.beginPath(); c.arc(x, y, 1.6, 0, 7); c.fill(); }
  }
  const [ox, oy] = proj([-47, -21]);
  if (onda > 0) { c.strokeStyle = `rgba(198,42,36,${0.6 * (1 - clamp(onda / 40))})`; c.lineWidth = 4; c.beginPath(); c.arc(ox, oy, onda * 24, 0, 7); c.stroke(); }
  c.restore();
  c.save(); c.globalAlpha = sstep(0.4, 1.0, t); c.font = '400 26px Inter'; c.fillStyle = 'rgba(242,239,233,0.7)'; c.fillText('Mapa ilustrativo · cenário hipotético', 90, 980); c.restore();
});

// 16 — Lucas na janela, a cidade cinza (narração 61.9–66.3)
cena(64.6, 69.6, (c, t) => {
  const p = easeIO(clamp(t / 5));
  c.save(); camera(c, lerp(2.6, 0.95, p), lerp(870, 960, p), lerp(-60, 420, p));
  ceuNublado(c, t, -1300, 900);
  skyline(c, 71, 930, 640, '#7b8187'); skyline(c, 72, 940, 520, '#62676c');
  predioPrincipal(c, t, { lucasNaJanela: 1 });
  c.fillStyle = '#2c2e30'; c.fillRect(-800, 940, W + 1600, 400);
  c.restore();
  c.fillStyle = vgrad(c, 0, H, [[0, 'rgba(0,0,0,0.0)'], [1, `rgba(0,0,0,${0.5 * p})`]]); c.fillRect(0, 0, W, H);
}, { saiPreto: 0.5 });

// 17 — cartela final do capítulo
cena(69.6, 75.0, (c, t) => {
  c.fillStyle = '#050506'; c.fillRect(0, 0, W, H);
  c.fillStyle = rgrad(c, W / 2, 620, 0, 800, [[0, `rgba(142,27,27,${0.35 * sstep(0, 1.5, t)})`], [1, 'rgba(0,0,0,0)']]); c.fillRect(0, 0, W, H);
  particulas(c, t, 40, 17, { area: [0, 200, W, 900], cor: 'rgba(255,140,60,0.8)', tam: [1, 2.2], vel: [-8, 8, -40, -15], brilho: 0.5 });
  c.save(); c.textAlign = 'center'; c.textBaseline = 'middle';
  const a = sstep(0.2, 0.9, t);
  c.globalAlpha = a; c.font = '700 240px Oswald'; c.fillStyle = PAL.texto;
  c.save(); c.translate(W / 2, 470); const z = 1.1 - 0.1 * easeOut(t / 2.5); c.scale(z, z); c.fillText('DIA 1', 0, 0); c.restore();
  c.fillStyle = PAL.vermelhoVivo; const bw = 420 * sstep(0.7, 1.4, t); c.fillRect(W / 2 - bw / 2, 610, bw, 8);
  c.globalAlpha = sstep(1.0, 1.6, t); c.font = '400 56px Oswald'; c.fillStyle = 'rgba(242,239,233,0.9)'; c.fillText('O APAGÃO', W / 2, 690);
  c.globalAlpha = sstep(2.0, 2.6, t) * 0.75; c.font = '400 28px Oswald'; c.fillText('E SE ACONTECER?  ·  SIMULAÇÃO', W / 2, 960);
  c.restore();
}, { preto: 0.8, saiPreto: 0.8 });

window.CENAS_ABERTURA = CENAS;
if (!window.EPISODIO) {
window.CENAS = CENAS;
window.DURACAO = 75.0;
window.POS = (ctx, T) => {
  filme(ctx, T, { vinheta: 0.6, grao: 0.07 });
  if (T > 3.2 && T < 69.4) seloSimulacao(ctx, sstep(3.2, 3.8, T) * (1 - sstep(68.8, 69.4, T)));
  if (T > 3.6 && T < 8.6) cartelaDia(ctx, T - 3.6, 5.0, 'DIA 1', 'O APAGÃO');
};
window.prepararVideo = dados => prepararLegendas(dados, O);
}
