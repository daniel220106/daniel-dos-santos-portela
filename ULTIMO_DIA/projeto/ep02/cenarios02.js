// ÚLTIMO DIA — EP02: cenários, personagens de apoio e o "ator" automático.
// Carregar depois de motor.js, ep02_visual.js, ep01/abertura.js e motor/cenarios.js.

Object.assign(VISUAIS, {
  sandra: { pele: '#7a5038', peleSombra: '#553624', cabelo: '#141010', camiseta: '#ecebe6', camisetaSombra: '#c9c7c0', calca: '#3f7f86', calcaSombra: '#2d5f65', tenis: '#e8e6e0', sola: '#888', barba: 0, cabeloTipo: 'rabo', mangaLonga: true, altura: 0.95, largura: 0.93 },
  voluntaria: { pele: '#c99a78', peleSombra: '#9a6f52', cabelo: '#3a2416', camiseta: '#2f6fb0', camisetaSombra: '#21507f', calca: '#2a2f3a', calcaSombra: '#1c2028', tenis: '#ddd', sola: '#444', barba: 0, cabeloTipo: 'longo', altura: 0.94, largura: 0.95 },
  maeLucas: { pele: '#a9724f', peleSombra: '#7d4f35', cabelo: '#8f8a84', camiseta: '#7a4a5a', camisetaSombra: '#5a3442', calca: '#3a2a3a', calcaSombra: '#2a1e2a', tenis: '#3a2e28', sola: '#1a1512', barba: 0, cabeloTipo: 'coque', vestido: '#7a4a5a', mangaLonga: true, altura: 0.9, largura: 1.02 },
});
const VIS_DE = { lucas: 'lucas', rafael: 'rafael', marina: 'marina', dona_cida: 'cida', pedro: 'pedro', sandra: 'sandra', voluntaria: 'voluntaria', mae: 'maeLucas', morador: 'morador7', agente: 'defesa' };

// ---------- tempo das falas (preenchido pela linha do tempo) ----------
let FALAS = [];                         // todas as falas do episódio, com tempo global
const piscaT = (T, s) => { const p = 2.9 + (s % 3) * 0.8, x = (T + s * 1.37) % p; return x < 0.14 ? Math.sin(x / 0.14 * Math.PI) : 0; };
const fala = (nome, T) => bocaDe(FALAS, nome, T, 0);
const falando = (nome, T) => quemFala(FALAS, T, 0) === nome;
function falaAtual(nome, T) { for (const f of FALAS) if (f.personagem === nome && T >= f.inicio && T < f.fim) return f; return null; }

// expressão automática: pelo personagem e pela pontuação da fala
function exprAuto(nome, T, repouso = '') {
  const f = falaAtual(nome, T);
  if (!f) return repouso;
  const t = f.texto, excl = /!$/.test(t), perg = /\?$/.test(t);
  if (nome === 'rafael') return excl ? 'surpreso' : (perg ? 'duvida' : 'sorriso');
  if (nome === 'marina') return excl ? 'firme' : (perg ? 'duvida' : 'firme');
  if (nome === 'pedro') return excl ? 'riso' : (perg ? 'surpreso' : 'sorriso');
  if (nome === 'dona_cida') return excl ? 'firme' : (perg ? 'duvida' : '');
  if (nome === 'lucas') return excl ? 'surpreso' : (perg ? 'duvida' : '');
  return excl ? 'surpreso' : '';
}
const SEED = { lucas: 1, rafael: 4, marina: 2, dona_cida: 5, pedro: 3, sandra: 6, voluntaria: 7, mae: 8, morador: 9, agente: 10 };
const LUZ_CHUVA = { lado: -1, brilho: 'rgba(190,205,225,0.16)', sombra: 'rgba(10,16,28,0.34)', geral: 'rgba(30,40,60,0.06)' };
const LUZ_NOITE = { lado: 1, brilho: 'rgba(255,214,150,0.18)', sombra: 'rgba(5,8,18,0.55)', geral: 'rgba(10,16,40,0.28)' };
const LUZ_LANTERNA = { lado: 1, brilho: 'rgba(255,236,190,0.35)', sombra: 'rgba(0,0,0,0.75)', geral: 'rgba(5,6,12,0.45)' };
const LUZ_SEPIA = { lado: -1, brilho: 'rgba(255,220,160,0.2)', sombra: 'rgba(40,20,0,0.5)', geral: 'rgba(110,70,20,0.25)' };

// ator: desenha um personagem que fala, pisca, gesticula e reage sozinho
// o: {x, y (quadril), s, dir, expr, repouso, giro, olharPara (x), andar (fase), bracoF, bracoT, objeto, objetoT, costas, luz, sentado}
function ator(c, T, nome, o = {}) {
  const boca = fala(nome, T), fal = boca > 0.02 || falando(nome, T), sd = SEED[nome] || 1;
  const vis = VIS_DE[nome] || nome, V = VISUAIS[vis];
  const g = gesto(T, fal, sd);
  let P = { x: o.x ?? 960, y: o.y ?? 690, s: o.s ?? 1, dir: o.dir ?? 1, boca, piscar: piscaT(T, sd), expr: o.expr ?? exprAuto(nome, T, o.repouso ?? ''),
    cabeca: { giro: o.giro ?? 0.05, incl: o.incl ?? 0 }, olhar: o.olhar ?? 0.2,
    bracoF: o.bracoF ?? g, bracoT: o.bracoT ?? [-0.05 + (fal ? Math.sin(T * 2.7 + sd) * 0.18 : 0), 0.3],
    objeto: o.objeto, objetoT: o.objetoT, costas: o.costas, luz: o.luz ?? LUZ_CHUVA, alpha: o.alpha, silhueta: o.silhueta };
  if (o.andar !== undefined) { const cm = caminhada(o.andar, o.intens ?? 1); P = { ...P, ...cm, y: P.y + cm.bob, bracoF: o.bracoF ?? cm.bracoF, bracoT: o.bracoT ?? cm.bracoT }; }
  if (o.sentado) { // cadeira dobrável embaixo
    P.pernaF = [1.5, -1.45]; P.pernaT = [1.45, -1.4]; P.pePlano = true;
    const sx = P.x, sy = P.y + 14 * P.s, d = P.dir;
    c.fillStyle = '#5a5e66'; rr(c, sx - 60 * P.s, sy, 120 * P.s, 16 * P.s, 4); c.fill();
    c.strokeStyle = '#3a3d44'; c.lineWidth = 7 * P.s; c.beginPath(); c.moveTo(sx - 50 * P.s * d, sy); c.lineTo(sx - 50 * P.s * d, sy - 120 * P.s);
    c.moveTo(sx - 50 * P.s, sy + 14 * P.s); c.lineTo(sx + 50 * P.s, sy + 140 * P.s); c.moveTo(sx + 50 * P.s, sy + 14 * P.s); c.lineTo(sx - 50 * P.s, sy + 140 * P.s); c.stroke();
  }
  if (o.sentadoChao) { P.pernaF = [1.5, 0.05]; P.pernaT = [1.45, 0.05]; P.pePlano = true; }
  // respiração leve
  if (o.andar === undefined) P.cabeca.incl += Math.sin(T * 1.6 + sd) * 0.012;
  if (fal && o.andar === undefined) P.cabeca.giro += Math.sin(T * 2.1 + sd) * 0.04;
  desenharPessoa(c, P, V);
}
const yChao = (chao, nome, s = 1) => chao - 258 * s * ((VISUAIS[VIS_DE[nome] || nome] || {}).altura || 1);

// ---------- objetos ----------
function celularMao(cor = '#15171b') { return (c, x, y, a) => { c.save(); c.translate(x, y); c.rotate(-a + Math.PI / 2); c.fillStyle = cor; rr(c, -12, -22, 24, 44, 5); c.fill(); c.fillStyle = '#3b6fa8'; rr(c, -9, -18, 18, 34, 3); c.fill(); c.restore(); }; }
function lanternaMao(on = 1) { return (c, x, y, a) => { c.save(); c.translate(x, y); c.rotate(-a + Math.PI / 2); c.fillStyle = '#2a2a2e'; rr(c, -8, -26, 16, 40, 4); c.fill(); c.restore();
  if (on) { c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = rgrad(c, x, y, 0, 520, [[0, 'rgba(255,236,190,0.35)'], [1, 'rgba(255,236,190,0)']]); c.beginPath(); c.moveTo(x, y); c.arc(x, y, 520, -0.35 - Math.PI / 2 + Math.PI / 2 - 0.25, 0.25); c.fill(); c.restore(); } }; }
function caixa(cor = '#b08a5a') { return (c, x, y) => { c.fillStyle = cor; rr(c, x - 40, y - 60, 80, 62, 4); c.fill(); c.strokeStyle = 'rgba(0,0,0,0.25)'; c.lineWidth = 3; c.beginPath(); c.moveTo(x - 40, y - 38); c.lineTo(x + 40, y - 38); c.stroke(); }; }
function bolsa(cor = '#6a3a4a') { return (c, x, y) => { c.fillStyle = cor; rr(c, x - 22, y, 44, 40, 8); c.fill(); }; }
function guardaChuva(cor = '#2f6fb0') { return (c, x, y) => { c.fillStyle = cor; c.beginPath(); c.arc(x, y - 150, 100, Math.PI, 0); c.fill(); c.fillStyle = '#222'; c.fillRect(x - 3, y - 150, 6, 152); }; }
function vapor(c, T, x, y, n = 5) { for (let i = 0; i < n; i++) { const f = ((T * 0.35 + i / n) % 1); c.fillStyle = `rgba(235,235,240,${0.18 * Math.sin(f * Math.PI)})`; c.beginPath(); c.arc(x + Math.sin(T * 1.7 + i * 2) * 10 * f, y - f * 120, 8 + f * 16, 0, 7); c.fill(); } }

// ---------- raios (tempos globais definidos pela linha do tempo) ----------
function raioEm(T) { for (const r of (window.RAIOS || [])) { const d = T - r; if (d >= 0 && d < 0.45) return (d < 0.08 ? 1 : 0) + (d > 0.14 && d < 0.22 ? 0.7 : 0) + Math.max(0, 0.3 - d); } return 0; }
function flashRaio(c, T, k = 0.12) { const r = raioEm(T); if (r) { c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.fillStyle = `rgba(210,220,255,${k * r})`; c.fillRect(0, 0, W, H); c.restore(); } }

// ---------- água ----------
function aguaSuperficie(c, T, x0, x1, y, cor = 'rgba(96,104,98,0.92)', funda = 600) {
  c.fillStyle = cor; c.beginPath(); c.moveTo(x0, y);
  for (let x = x0; x <= x1; x += 20) c.lineTo(x, y + Math.sin(x * 0.03 + T * 2.2) * 4 + Math.sin(x * 0.011 - T * 1.3) * 3);
  c.lineTo(x1, y + funda); c.lineTo(x0, y + funda); c.fill();
  c.strokeStyle = 'rgba(220,225,220,0.25)'; c.lineWidth = 2;
  for (let i = 0; i < 14; i++) { const xx = x0 + ((i * 137 + T * 40) % (x1 - x0)); c.beginPath(); c.moveTo(xx, y + 10 + (i % 4) * 14); c.lineTo(xx + 40, y + 10 + (i % 4) * 14); c.stroke(); }
  // respingos da chuva
  const r = rng(77); c.strokeStyle = 'rgba(230,235,240,0.45)';
  for (let i = 0; i < 40; i++) { const xx = x0 + r() * (x1 - x0), ph = (T * 3 + r()) % 1; c.beginPath(); c.ellipse(xx, y + 6 + r() * 40, 4 + ph * 10, 1.5 + ph * 3, 0, 0, 7); c.globalAlpha = 1 - ph; c.stroke(); c.globalAlpha = 1; }
}

// ---------- cenários ----------
function ceuChuva(c, y1 = 700, escuro = 0) {
  c.fillStyle = vgrad(c, -300, y1, [[0, shade('#59636d', 1 - escuro * 0.6)], [1, shade('#8a939b', 1 - escuro * 0.6)]]); c.fillRect(-600, -400, W + 1200, y1 + 400);
}
// avenida com trânsito parado e um carro (do Rafael) com água subindo em volta
function avenidaAlagada(c, T, { agua = 0.3, rafaelNoCarro = 1, portaAberta = 0 } = {}) {
  ceuChuva(c, 640, 0.25);
  skyline(c, 41, 600, 380, '#5f676f', { larg: [90, 220] });
  skyline(c, 42, 640, 260, '#454c53', { larg: [90, 220], janelas: 0.3, corJanela: '#e6d49a' });
  c.fillStyle = '#4a4c50'; c.fillRect(-600, 620, W + 1200, 70); c.fillStyle = '#5c5e62'; c.fillRect(-600, 610, W + 1200, 14); // calçada alta
  c.fillStyle = '#2b2d31'; c.fillRect(-600, 690, W + 1200, 500);
  const carro = (x, y, cor, luz = 1) => { c.fillStyle = cor; rr(c, x, y - 70, 300, 82, 20); c.fill(); rr(c, x + 50, y - 128, 190, 66, 20); c.fill();
    c.fillStyle = 'rgba(150,175,195,0.55)'; rr(c, x + 64, y - 120, 76, 50, 8); c.fill(); rr(c, x + 150, y - 120, 76, 50, 8); c.fill();
    c.fillStyle = '#141519'; c.beginPath(); c.arc(x + 64, y + 14, 28, 0, 7); c.arc(x + 236, y + 14, 28, 0, 7); c.fill();
    if (luz) { c.fillStyle = '#c62a24'; c.fillRect(x + 2, y - 52, 12, 18); c.fillStyle = 'rgba(255,60,50,0.25)'; c.beginPath(); c.arc(x + 8, y - 43, 40, 0, 7); c.fill(); } };
  carro(-180, 830, '#3a4a5a'); carro(1620, 830, '#d8d4cc');
  carro(560, 990, '#2f4a3a'); carro(1290, 990, '#6a6a70');
  // carro do Rafael (vermelho escuro), no centro
  const cx = 760, cy = 830; carro(cx, cy, '#8a2d2a');
  if (rafaelNoCarro) { c.save(); c.beginPath(); rr(c, cx + 150, cy - 120, 76, 50, 8); c.clip(); ator(c, T, 'rafael', { x: cx + 170, y: cy + 150, s: 0.42, dir: 1, luz: LUZ_CHUVA }); c.restore(); }
  if (portaAberta) { c.fillStyle = '#7a2724'; c.save(); c.translate(cx + 150, cy - 70); c.transform(1 - portaAberta * 0.6, -0.1 * portaAberta, 0, 1, 0, 0); rr(c, 0, -58, 90, 130, 10); c.fill(); c.restore(); }
  aguaSuperficie(c, T, -600, W + 600, 900 - agua * 150);
  chuvaFx(c, T, 1.3, 11); flashRaio(c, T, 0.3);
}
// interior do carro: Rafael ao volante, celular no suporte (viva-voz)
function dentroCarro(c, T, { agua = 0.4 } = {}) {
  c.fillStyle = '#1a1c20'; c.fillRect(-400, -300, W + 800, H + 600);
  // para-brisa com chuva e limpador
  c.save(); c.beginPath(); c.moveTo(80, 120); c.lineTo(1840, 120); c.lineTo(1720, 600); c.lineTo(200, 600); c.closePath(); c.clip();
  ceuChuva(c, 700, 0.2); skyline(c, 43, 560, 300, '#4c535a', { larg: [90, 220], janelas: 0.3, corJanela: '#e6d49a' });
  c.fillStyle = '#7a2a28'; rr(c, 1100, 470, 320, 120, 18); c.fill(); c.fillStyle = 'rgba(255,60,50,0.4)'; c.beginPath(); c.arc(1110, 500, 50, 0, 7); c.arc(1410, 500, 50, 0, 7); c.fill(); // carro da frente
  aguaSuperficie(c, T, 0, W, 560 - agua * 60, 'rgba(100,108,102,0.9)');
  const r = rng(9); c.fillStyle = 'rgba(220,230,240,0.45)'; for (let i = 0; i < 160; i++) { const x = 80 + r() * 1760, y = 120 + ((r() * 480 + T * (20 + r() * 40)) % 480); c.beginPath(); c.ellipse(x, y, 3, 5, 0, 0, 7); c.fill(); }
  c.restore();
  const ang = -0.2 - Math.abs(Math.sin(T * 1.6)) * 1.6; // limpador
  c.save(); c.translate(560, 610); c.rotate(ang); c.fillStyle = '#0c0d10'; c.fillRect(0, -5, 620, 10); c.restore();
  c.fillStyle = '#22252a'; c.fillRect(-400, 600, W + 800, 600); // painel
  c.fillStyle = '#111'; rr(c, 1380, 470, 150, 230, 16); c.fill(); c.fillStyle = '#3b6fa8'; rr(c, 1392, 482, 126, 206, 10); c.fill(); // celular no suporte
  c.fillStyle = '#f2efe9'; c.font = '600 20px Inter'; c.textAlign = 'center'; c.fillText('Lucas', 1455, 540); c.fillText('viva-voz', 1455, 570);
  ator(c, T, 'rafael', { x: 760, y: 960, s: 1.35, dir: 1, bracoF: [1.45 + Math.sin(T * 9) * 0.03 * (falando('rafael', T) ? 1 : 0), 0.4], bracoT: [1.3, 0.5], luz: LUZ_CHUVA });
  c.fillStyle = '#0d0e10'; c.beginPath(); c.arc(1080, 820, 170, 0, 7); c.lineWidth = 26; c.strokeStyle = '#0d0e10'; c.stroke(); // volante
  flashRaio(c, T, 0.25);
}
// Rafael saindo do carro para a calçada alta (sem atravessar água)
function rafaelSaiCarro(c, T, t) {
  avenidaAlagada(c, T, { agua: 0.55, rafaelNoCarro: t < 0.6 ? 1 : 0, portaAberta: sstep(0.2, 0.6, t) });
  if (t > 0.6) ator(c, T, 'rafael', { x: lerp(980, 1300, clamp((t - 0.6) / 2.5)), y: yChao(612, 'rafael', 0.55), s: 0.55, andar: t * 1.3, expr: 'assustado', luz: LUZ_CHUVA });
}
// fachada do prédio com o córrego ao lado
function fachadaCorrego(c, T, { nivel = 0.1, noite = 0, chuva = 1 } = {}) {
  ceuChuva(c, 760, noite * 0.8);
  skyline(c, 51, 700, 300, shade('#6a727a', 1 - noite * 0.6), { larg: [80, 180] });
  c.fillStyle = shade('#8e8a82', 1 - noite * 0.6); c.fillRect(620, 160, 560, 720); // prédio
  for (let a = 0; a < 6; a++) for (let j = 0; j < 4; j++) { c.fillStyle = noite ? (rng(a * 7 + j)() < 0.6 ? '#e9c27a' : '#1a1c22') : '#4d5862'; c.fillRect(660 + j * 130, 200 + a * 110, 80, 64); }
  c.fillStyle = '#3d3f44'; c.fillRect(840, 790, 120, 90); // portaria
  c.fillStyle = '#4b6b3a'; c.fillRect(-600, 860, 1300, 40); c.fillStyle = '#4a4c50'; c.fillRect(-600, 880, W + 1200, 40);
  // córrego (canal) à direita, nível subindo
  c.fillStyle = '#5a5850'; c.fillRect(1300, 820, 700, 300);
  c.fillStyle = '#3a3a36'; c.fillRect(1330, 820, 640, 260);
  aguaSuperficie(c, T, 1330, 1970, 1060 - nivel * 230, 'rgba(110,98,70,0.95)', 300);
  c.fillStyle = '#2b2d31'; c.fillRect(-600, 920, 1900, 300);
  if (chuva) chuvaFx(c, T, chuva, 13);
  flashRaio(c, T, 0.25);
}
// corredor do prédio de dia (portas, plantas da Dona Cida, janela no fim)
function corredorDia(c, T, { escuro = 0 } = {}) {
  c.fillStyle = vgrad(c, -200, 940, [[0, '#7a766e'], [1, '#67635c']]); c.fillRect(-600, -400, W + 1200, 1340);
  c.fillStyle = '#4f4a44'; c.fillRect(-600, 930, W + 1200, 400);
  for (let i = 0; i < 4; i++) { const x = -60 + i * 520; c.fillStyle = '#6a4c36'; c.fillRect(x, 330, 200, 600); c.strokeStyle = '#e1ddd4'; c.lineWidth = 10; c.strokeRect(x - 5, 325, 210, 610); c.fillStyle = '#d8c690'; c.beginPath(); c.arc(x + 170, 640, 8, 0, 7); c.fill(); c.fillStyle = '#e1ddd4'; c.font = '600 26px Inter'; c.fillText(String(41 + i), x + 82, 300); }
  // plantas
  for (const x of [1300, 1380]) { c.fillStyle = '#8a4a2a'; c.fillRect(x, 850, 60, 80); c.fillStyle = '#3d6b3a'; for (let k = 0; k < 6; k++) { c.beginPath(); c.ellipse(x + 30 + Math.sin(k * 1.3 + T * 0.8) * 14, 820 - k * 14, 26, 12, k * 0.5 + Math.sin(T) * 0.05, 0, 7); c.fill(); } }
  c.fillStyle = '#e1ddd4'; c.fillRect(1600, 180, 260, 360); janelaChuvaSimples(c, 1615, 195, 230, 330, T);
  c.fillStyle = 'rgba(255,230,180,0.08)'; c.fillRect(-600, -400, W + 1200, 1340);
  if (escuro) { c.fillStyle = `rgba(5,7,14,${0.78 * escuro})`; c.fillRect(-600, -400, W + 1200, 1800); }
}
function janelaChuvaSimples(c, x, y, w, h, T) {
  c.save(); c.beginPath(); c.rect(x, y, w, h); c.clip(); c.fillStyle = vgrad(c, y, y + h, [[0, '#6f7882'], [1, '#9aa2a8']]); c.fillRect(x, y, w, h);
  skyline(c, 23, y + h * 0.98, h * 0.5, '#5d656d', { x0: x - 20, x1: x + w + 20, larg: [30, 80] });
  const r = rng(4); c.strokeStyle = 'rgba(225,232,240,0.5)'; c.lineWidth = 1.4; for (let i = 0; i < 50; i++) { const px = x + (r() * w + T * 60) % w, py = y + (r() * h + T * 800) % h; c.beginPath(); c.moveTo(px, py); c.lineTo(px - 4, py + 16); c.stroke(); }
  c.restore(); c.strokeStyle = '#e9e5de'; c.lineWidth = 10; c.strokeRect(x, y, w, h);
  const ra = raioEm(T); if (ra) { c.fillStyle = `rgba(230,235,255,${0.5 * ra})`; c.fillRect(x, y, w, h); }
}
// topo da rampa da garagem, água entrando pela rua
function rampaGaragem(c, T, { agua = 0.4 } = {}) {
  c.fillStyle = vgrad(c, -200, 940, [[0, '#6a6c70'], [1, '#55575b']]); c.fillRect(-600, -400, W + 1200, 1340);
  c.fillStyle = '#3c3e42'; c.fillRect(-600, 930, 1550, 500); // piso do térreo (até o começo da rampa)
  // parede da garagem com a entrada escura
  c.fillStyle = '#4a4c50'; c.fillRect(1180, 470, 700, 470);
  c.fillStyle = '#141518'; c.fillRect(1250, 560, 560, 380);
  c.fillStyle = '#c62a24'; c.fillRect(1330, 488, 400, 58); c.fillStyle = '#fff'; c.font = '700 40px Oswald'; c.textAlign = 'center'; c.fillText('GARAGEM', 1530, 532); c.textAlign = 'left';
  // rampa descendo em direção à entrada
  c.fillStyle = '#2a2b2f'; c.beginPath(); c.moveTo(950, 930); c.lineTo(1250, 940); c.lineTo(1810, 940); c.lineTo(1810, 1300); c.lineTo(950, 1300); c.fill();
  c.fillStyle = '#e0b23a'; for (let i = 0; i < 5; i++) c.fillRect(980 + i * 150, 950, 80, 12);
  // água vindo da rua e descendo a rampa para dentro da garagem
  const nivel = 940 + 150 - agua * 230;
  c.save(); c.beginPath(); c.rect(950, 560, 900, 800); c.clip();
  aguaSuperficie(c, T, 950, 1850, Math.min(nivel, 1040), 'rgba(110,98,70,0.92)', 500);
  c.fillStyle = `rgba(110,98,70,${0.85})`; c.fillRect(1250, 940 - agua * 160, 560, agua * 160 + 10); // nível dentro da garagem
  c.restore();
  // fluxo escorrendo pela borda da calçada
  c.strokeStyle = 'rgba(200,190,160,0.5)'; c.lineWidth = 3; for (let i = 0; i < 8; i++) { const x = 950 + ((i * 90 + T * 160) % 300); c.beginPath(); c.moveTo(x, 935); c.lineTo(x + 30, 948); c.stroke(); }
}
// escada do prédio (subindo caixas)
function escadaDia(c, T) {
  c.fillStyle = vgrad(c, -200, 1000, [[0, '#7a766e'], [1, '#625e57']]); c.fillRect(-600, -400, W + 1200, 1600);
  c.fillStyle = '#8f8a82'; for (let i = 0; i < 12; i++) c.fillRect(200 + i * 120, 960 - i * 56, 130, 56 * (i + 1) + 300);
  c.strokeStyle = '#3a3a3a'; c.lineWidth = 8; c.beginPath(); c.moveTo(200, 780); c.lineTo(1640, 110); c.stroke();
  c.fillStyle = '#e1ddd4'; c.font = '700 80px Oswald'; c.fillText('1', 1700, 300);
}
const noDegrauDia = u => [200 + u * 1440 + 60, 960 - u * 672 - 4];
// calçada com chuva (caminhada até o abrigo); rua alagada à frente; agente do outro lado
function calcadaChuva(c, T, { aguaFrente = 0, marquise = 0, desloc = 0 } = {}) {
  ceuChuva(c, 620, 0.3);
  c.save(); c.translate(-desloc * 0.4, 0); skyline(c, 61, 600, 380, '#5f676f', { larg: [90, 220], x0: -800, x1: W + 1400 }); c.restore();
  c.save(); c.translate(-desloc, 0);
  for (let i = 0; i < 20; i++) { const x = -2600 + i * 420; c.fillStyle = ['#8e8a82', '#7a7f86', '#9a8e7c'][i % 3]; c.fillRect(x, 200, 400, 700); for (let j = 0; j < 3; j++) for (let k = 0; k < 4; k++) { c.fillStyle = '#4d5862'; c.fillRect(x + 40 + j * 120, 260 + k * 150, 70, 90); } c.fillStyle = '#3d3f44'; c.fillRect(x + 150, 760, 100, 140); }
  if (marquise) { c.fillStyle = '#7a2a28'; c.beginPath(); c.moveTo(500, 560); c.lineTo(1100, 560); c.lineTo(1160, 640); c.lineTo(440, 640); c.fill(); c.fillStyle = '#5a1e1c'; c.fillRect(440, 640, 720, 14); c.fillStyle = '#f2efe9'; c.font = '700 36px Oswald'; c.fillText('PADARIA', 720, 612); }
  c.restore();
  c.fillStyle = '#5c5e62'; c.fillRect(-600, 880, W + 1200, 60); c.fillStyle = '#4a4c50'; c.fillRect(-600, 900, W + 1200, 300);
  c.fillStyle = '#2b2d31'; c.fillRect(-600, 1040, W + 1200, 200);
  if (aguaFrente) { aguaSuperficie(c, T, 1220, W + 800, 858, 'rgba(110,98,70,0.95)', 500);
    for (const x of [1180, 1300]) { c.fillStyle = '#e07a20'; c.beginPath(); c.moveTo(x, 900); c.lineTo(x + 22, 840); c.lineTo(x + 44, 900); c.fill(); c.fillStyle = '#f2efe9'; c.fillRect(x + 12, 868, 20, 8); }
    c.strokeStyle = '#e0b23a'; c.lineWidth = 8; c.setLineDash([22, 14]); c.beginPath(); c.moveTo(1202, 846); c.lineTo(1322, 846); c.stroke(); c.setLineDash([]); }
  chuvaFx(c, T, 1.1, 17);
}
// abrigo: quadra coberta de uma escola
function abrigo(c, T, { noite = 0 } = {}) {
  c.fillStyle = vgrad(c, -300, 940, [[0, shade('#6d7a86', 1 - noite * 0.55)], [1, shade('#56606a', 1 - noite * 0.55)]]); c.fillRect(-600, -400, W + 1200, 1340);
  for (let i = 0; i < 6; i++) { c.fillStyle = noite ? '#141a28' : '#8a95a0'; c.fillRect(-300 + i * 420, 60, 300, 140); janelaChuvaSimples(c, -290 + i * 420, 70, 280, 120, T); }
  c.fillStyle = shade('#a07a4a', 1 - noite * 0.4); c.fillRect(-600, 930, W + 1200, 400);
  c.strokeStyle = 'rgba(255,255,255,0.5)'; c.lineWidth = 6; c.beginPath(); c.ellipse(960, 1050, 260, 70, 0, 0, 7); c.stroke(); c.beginPath(); c.moveTo(960, 930); c.lineTo(960, 1300); c.stroke();
  c.fillStyle = shade('#3a3f48', 1 - noite * 0.3); c.fillRect(-600, 560, 560, 370); for (let i = 0; i < 4; i++) { c.fillStyle = shade('#4a505a', 1 - noite * 0.3); c.fillRect(-600, 600 + i * 80, 560, 20); } // arquibancada
  // colchonetes e cobertores
  const r = rng(12); for (let i = 0; i < 14; i++) { const x = 60 + (i % 7) * 260 + r() * 30, y = 960 + Math.floor(i / 7) * 120; c.fillStyle = ['#2f6fb0', '#3d6b3a', '#7a4a5a', '#c9a86a'][i % 4]; rr(c, x, y, 220, 60, 12); c.fill(); }
  // mesa de cadastro
  c.fillStyle = '#e9e6e0'; c.fillRect(1380, 760, 440, 26); c.fillStyle = '#9a958e'; c.fillRect(1400, 786, 16, 150); c.fillRect(1784, 786, 16, 150);
  c.fillStyle = '#2f6fb0'; c.fillRect(1420, 330, 380, 90); c.fillStyle = '#fff'; c.font = '700 40px Oswald'; c.textAlign = 'center'; c.fillText('ABRIGO · CADASTRO', 1610, 390); c.textAlign = 'left';
  // tomadas para celular
  c.fillStyle = '#e9e6e0'; c.fillRect(1100, 700, 200, 40); for (let i = 0; i < 5; i++) { c.fillStyle = '#333'; c.fillRect(1112 + i * 38, 712, 18, 18); }
  if (noite) { c.fillStyle = `rgba(6,10,24,${0.35 * noite})`; c.fillRect(-600, -400, W + 1200, 1800); c.fillStyle = rgrad(c, 960, 300, 0, 900, [[0, 'rgba(255,214,150,0.12)'], [1, 'rgba(255,214,150,0)']]); c.fillRect(-600, -400, W + 1200, 1800); }
  flashRaio(c, T, 0.12);
}
// bairro na manhã seguinte: lama, marcas na parede, móveis molhados
function bairroLama(c, T) {
  c.fillStyle = vgrad(c, -300, 700, [[0, '#9aa6b0'], [1, '#c2c6c4']]); c.fillRect(-600, -400, W + 1200, 1100);
  skyline(c, 71, 640, 300, '#8a9096', { larg: [80, 200] });
  for (let i = 0; i < 6; i++) { const x = -400 + i * 460; c.fillStyle = ['#b9b2a6', '#a9aeb4', '#c2b49c'][i % 3]; c.fillRect(x, 260, 440, 640); for (let j = 0; j < 3; j++) { c.fillStyle = '#5d6a74'; c.fillRect(x + 50 + j * 130, 330, 80, 100); } c.fillStyle = 'rgba(110,90,60,0.55)'; c.fillRect(x, 780, 440, 120); c.strokeStyle = 'rgba(90,70,45,0.8)'; c.lineWidth = 4; c.beginPath(); c.moveTo(x, 780); c.lineTo(x + 440, 780); c.stroke(); }
  c.fillStyle = '#7a6a50'; c.fillRect(-600, 900, W + 1200, 60); c.fillStyle = '#6a5a42'; c.fillRect(-600, 960, W + 1200, 300); // lama
  for (let i = 0; i < 18; i++) { const r = rng(i + 3); c.fillStyle = 'rgba(80,65,45,0.6)'; c.beginPath(); c.ellipse(r() * W, 930 + r() * 250, 40 + r() * 80, 8 + r() * 10, 0, 0, 7); c.fill(); }
  c.fillStyle = '#5a4a3a'; rr(c, 1500, 820, 260, 90, 12); c.fill(); c.fillStyle = '#4a3a2a'; rr(c, 1500, 760, 60, 150, 10); c.fill(); // sofá molhado na calçada
  c.fillStyle = '#8a8e92'; c.fillRect(1250, 700, 110, 200); // geladeira estragada
}
// lembrança da Dona Cida (sépia): casa térrea com água até a janela, vizinhos ajudando no telhado
function lembrancaCida(c, T) {
  c.fillStyle = vgrad(c, -300, 800, [[0, '#2a2016'], [1, '#4a3a26']]); c.fillRect(-600, -400, W + 1200, 1600);
  c.fillStyle = '#7a6448'; c.fillRect(600, 420, 700, 420); c.fillStyle = '#5a4630'; c.beginPath(); c.moveTo(560, 430); c.lineTo(950, 220); c.lineTo(1340, 430); c.fill();
  c.fillStyle = '#e6c27a'; c.fillRect(700, 520, 140, 110); c.fillRect(1080, 520, 140, 110);
  aguaSuperficie(c, T, -600, W + 600, 610, 'rgba(90,70,40,0.92)', 700);
  for (const [x, nome] of [[820, 'cida'], [960, 'morador7'], [1080, 'pedestre1']]) { const p = { x, y: 330 - (x - 950) * 0.55 + 20, s: 0.55, dir: x < 950 ? 1 : -1, luz: LUZ_SEPIA, bracoF: [1.0, 0.6] }; desenharPessoa(c, p, x === 820 ? { ...VISUAIS.cida, cabelo: '#3a2a1a' } : nome); }
  c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.fillStyle = 'rgba(120,80,30,0.25)'; c.fillRect(0, 0, W, H); c.restore();
  chuvaFx(c, T, 0.9, 19);
}
// cidade vista de longe sob a chuva, com luzes de emergência
function cidadeAerea(c, T, { noite = 0.6, chuva = 1.2 } = {}) {
  ceuChuva(c, 700, noite);
  skyline(c, 81, 760, 520, shade('#4a5058', 1 - noite * 0.5), { larg: [60, 160], janelas: 0.35, corJanela: '#e6d49a' });
  skyline(c, 82, 860, 380, shade('#33383e', 1 - noite * 0.5), { larg: [70, 180], janelas: 0.25, corJanela: '#e6d49a' });
  c.fillStyle = '#26282c'; c.fillRect(-600, 860, W + 1200, 400);
  aguaSuperficie(c, T, -600, W + 600, 900, 'rgba(70,80,86,0.85)', 300);
  for (let i = 0; i < 6; i++) { const x = 200 + i * 300 + Math.sin(i) * 40, on = Math.sin(T * 8 + i * 2) > 0; c.fillStyle = on ? 'rgba(60,120,255,0.9)' : 'rgba(255,60,50,0.9)'; c.beginPath(); c.arc(x, 880, 7, 0, 7); c.fill(); c.fillStyle = on ? 'rgba(60,120,255,0.18)' : 'rgba(255,60,50,0.18)'; c.beginPath(); c.arc(x, 880, 60, 0, 7); c.fill(); }
  if (chuva) chuvaFx(c, T, chuva, 23); flashRaio(c, T, 0.2);
}
// cozinha da mãe do Lucas, no interior (para a ligação)
function casaMae(c, T) {
  c.fillStyle = vgrad(c, -200, 940, [[0, '#d8c8a8'], [1, '#c2b08e']]); c.fillRect(-600, -400, W + 1200, 1340);
  c.fillStyle = '#7a5a3a'; c.fillRect(-600, 930, W + 1200, 400);
  c.fillStyle = '#e9e5de'; c.fillRect(1250, 200, 380, 330); c.fillStyle = vgrad(c, 210, 520, [[0, '#9fb0c0'], [1, '#c6d0d4']]); c.fillRect(1265, 215, 350, 300);
  c.fillStyle = '#5a7a4a'; c.beginPath(); c.arc(1350, 520, 80, Math.PI, 0); c.arc(1500, 520, 100, Math.PI, 0); c.fill();
  c.fillStyle = '#a0784a'; c.fillRect(300, 700, 700, 30); c.fillRect(330, 730, 20, 200); c.fillRect(950, 730, 20, 200); // mesa
  c.fillStyle = '#2a2a2e'; rr(c, 700, 560, 200, 130, 8); c.fill(); c.fillStyle = '#3a5a7a'; rr(c, 712, 572, 176, 106, 4); c.fill(); // TV pequena com o noticiário
}
// tela de alerta no celular (simulação)
function telaAlertaCelular(c, T) {
  c.fillStyle = '#26282d'; c.fillRect(0, 0, W, H);
  celularTela(c, 960, 540, 470, 860, (k, x, y, w, h) => {
    k.fillStyle = '#121418'; k.fillRect(x, y, w, h);
    const p = 0.6 + 0.4 * Math.sin(T * 7); k.fillStyle = `rgba(198,42,36,${p})`; rr(k, x + 24, y + 140, w - 48, 380, 22); k.fill();
    k.fillStyle = '#fff'; k.font = '700 30px Inter'; k.fillText('ALERTA DE EMERGÊNCIA', x + 50, y + 200);
    k.font = '600 22px Inter'; k.fillStyle = '#ffe6a8'; k.fillText('SIMULAÇÃO FICTÍCIA', x + 50, y + 240);
    k.fillStyle = '#fff'; k.font = '400 24px Inter';
    ['Risco elevado de inundação', 'em áreas vulneráveis.', 'Procure locais seguros e', 'acompanhe as orientações', 'oficiais.'].forEach((l, i) => k.fillText(l, x + 50, y + 300 + i * 38));
  });
}
