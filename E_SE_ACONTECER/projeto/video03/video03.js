// E SE ACONTECER? — Vídeo 3: "50°C NO RIO: 5 DIAS PARA SOBREVIVER". Direção das tomadas.
// As tomadas trocam no início das falas (tempos reais do áudio, via linha_tempo.json). Usa motor/direcao.js.

const CH = 930;
const QUENTE = (desenha, intens = 1, ondas = 1) => (c, T, t0) => { desenha(c, T, t0); if (ondas) ondasCalor(c, T, { amp: 5 * intens }); nevoaCalor(c, 0.8 * intens); };
const andaX = (t0, T, x0, v) => x0 + (T - t0) * v;

// ---------- palcos ----------
const PALCO = (fundo, atores, extra = {}) => ({ fundo, chao: CH, atores, luz: LUZ_CASA, ...extra });
const QUARTO = () => PALCO((c, T) => quartoNoite(c, T), {
  caio: { x: 470, dir: 1, sentadoChao: 1, y: 860, expr: 'preocupado' },
  duda: { x: 760, dir: -1, expr: 'preocupado', bracoF: [0.9, 0.5] },
  nena: { x: 1300, dir: -1, sentadoBanco: 1, y: 790, giro: -0.3, olhar: -0.6, repouso: '', expr: '' },
}, { luz: LUZ_CELULAR, antes: (c, T) => desenharCachorro(c, T, { x: 1000, y: 935, s: 0.8, dir: -1, pose: 'sentada', ofega: 0.5, abana: 0.2 }) });
const AP = (atores, op = {}, extra = {}) => PALCO((c, T) => apCalor(c, T, op), atores, extra);
const RUA = (atores, op = {}, extra = {}) => PALCO((c, T) => { ruaSuburbio(c, T, op); }, atores, { luz: LUZ_SOL, ...extra });

// ---------- inserts ----------
const insertGarrafa = (op = {}) => fixo((c, T, t0) => { // close na garrafa cheia
  c.fillStyle = op.fundo || '#d9b88e'; c.fillRect(0, 0, W, H); c.fillStyle = op.mesa || '#7a5a3a'; c.fillRect(0, 760, W, 320);
  if (op.panela) { c.fillStyle = '#9a9aa0'; rr(c, 1180, 380, 420, 380, 60); c.fill(); vapor(c, T, 1390, 360, 7); }
  garrafa(c, 820, 790, 3.2, 1); c.fillStyle = 'rgba(255,240,210,0.18)'; c.fillRect(0, 0, W, H);
  if (op.moto) { c.fillStyle = '#2a2a2e'; c.fillRect(0, 700, W, 60); c.fillStyle = '#c0392b'; rr(c, 0, 760, W, 320, 0); c.fill(); }
});
const insertTela = op => fixo((c, T) => telaCelularGrande(c, T, op));
const insertMaoAsfalto = fixo((c, T, t0) => { const t = T - t0;
  c.fillStyle = '#4a4440'; c.fillRect(0, 0, W, H); const r = rng(3); for (let i = 0; i < 400; i++) { c.fillStyle = `rgba(${90 + r() * 60},${80 + r() * 50},${70 + r() * 40},0.5)`; c.fillRect(r() * W, r() * H, 6, 6); }
  const y = 560 - 220 * sstep(0, 0.35, t) + 260 * sstep(0.9, 1.05, t); c.fillStyle = '#7a4e34'; rr(c, 760, y, 420, 240, 110); c.fill(); rr(c, 900, y - 300, 160, 340, 60); c.fill();
  ondasCalor(c, T, { y0: 0, amp: 6 }); });
const insertGeladeira = fixo((c, T) => { c.save(); camera(c, 1.6, 1300, 540); geladeiraAberta(c, T, 0, 1); insulinaCaixa(c, 1300, 560, 1.6); c.restore(); });
const insertMaos = fixo((c, T, t0) => { const t = T - t0, aperta = sstep(2.6, 3.4, t);
  c.fillStyle = '#18161a'; c.fillRect(0, 0, W, H); c.fillStyle = '#3a5a8a'; c.fillRect(0, 640, W, 440);
  c.fillStyle = '#6e4530'; rr(c, 500, 520, 520, 150, 70); c.fill(); // mão da Vó
  c.fillStyle = '#7a4e34'; c.save(); c.translate(1120, 520 - 30 * aperta); c.rotate(0.15 * aperta); rr(c, -360, -40, 420, 140, 66); c.fill(); c.restore(); // mão da Duda
  c.fillStyle = '#6e4530'; for (let i = 0; i < 4; i++) { c.save(); c.translate(980 + i * 30, 560); c.rotate(-0.9 * aperta); rr(c, -14, -10, 28, 90, 14); c.fill(); c.restore(); } // dedos que apertam
  c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = rgrad(c, 900, 500, 0, 800, [[0, 'rgba(120,160,255,0.16)'], [1, 'rgba(0,0,0,0)']]); c.fillRect(0, 0, W, H); c.restore(); });
const relogioCorredor = (h0, m0) => (c, T, t0) => { const m = m0 + Math.min(2, Math.floor((T - t0) / 1.1)); corredor302(c, T, { hora: `${h0}:${String(m).padStart(2, '0')}` }); };
function rioCalorAereo(c, T) { ceuCalor(c, 700, { hora: 'dia', intens: 1.3 }); morrosRio(c, 560, 380, '#b9a48c', 4); skyline(c, 41, 800, 420, '#c9b49a', { janelas: 0 }); morrosRio(c, 860, 160, '#cbb69c', 12, { casas: 1.2 }); }
function aves(c, T, x0, y, n = 7) { for (let i = 0; i < n; i++) { const x = x0 + i * 46, b = Math.sin(T * 3 + i) * 2; c.fillStyle = '#2a2420'; c.beginPath(); c.ellipse(x, y - 14 + b, 14, 10, 0, 0, 7); c.fill(); c.beginPath(); c.arc(x + 12, y - 24 + b, 7, 0, 7); c.fill(); } }

// ---------- direção por capítulo ----------
const DIR = {};
DIR[0] = q => { const P = QUARTO(); return [
  [q.a, tom(1.25, 760, 640, (c, T) => desenhaPalco(c, T, P), 0.01, 0.8)],
  [q.L(2), tomadaPalco(P, 'close', 'duda')],
  [q.L(3), tomadaPalco(P, 'close', 'nena')],
  [q.L(4), tomadaPalco(P, 'dois', 'caio')],
  [q.L(6), tomadaPalco(P, 'close', 'duda')],
  [q.L(7), tomadaPalco(P, 'close', 'caio')],
  [q.L(8), tom(2.3, 1320, 560, (c, T) => desenhaPalco(c, T, P), 0.03, 0.6)],
  [q.L(9) - 0.2, insertTela({ bateria: 2, semServico: 1 })],
  [q.L(9) + 1.2, tomadaPalco(P, 'close', 'caio')],
  [q.L(10), tomadaPalco(P, 'close', 'duda')],
  [q.F(10) + 0.1, tom(1.1, 960, 540, (c, T) => { escada(c, T, 4, { lanterna: null }); escuridao(c, 0.8, [], '2,3,10'); desenharCachorro(c, T, { x: 760, y: 935, s: 0.9, pose: 'pe', ofega: 0.4 }); }, 0.015)],
  [q.L(12), tom(1.0, 1280, 560, (c, T, t0) => { ruaSuburbio(c, T, { hora: 'noite', semLuz: 1 }); c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = rgrad(c, 1280, 370, 0, 260, [[0, 'rgba(255,120,40,0.25)'], [1, 'rgba(0,0,0,0)']]); c.fillRect(0, 0, W, H); c.restore(); }, 0.03)],
]; };

DIR[1] = q => {
  const ENTREGA = RUA({ caio: { x: 720, dir: 1, objeto: (c, x, y) => { c.fillStyle = '#6a2a6a'; rr(c, x - 22, y - 50, 44, 56, 6); c.fill(); } }, cliente: { x: 1020, dir: -1, expr: 'duvida' } }, { desloc: 900 });
  const SALA = AP({ duda: { x: 520, dir: 1, sentadoChao: 1, y: 800, objeto: celularMao() }, nena: { x: 1250, dir: -1, expr: 'firme' } }, { panela: 1 }, { luz: LUZ_CASA });
  const CORR = PALCO(relogioCorredor(18, 0), { duda: { x: 600, dir: 1 }, nena: { x: 1400, dir: -1 } }, { depois: (c, T) => notasRadio(c, T, 1000, 400) });
  const NOITE = AP({ caio: { x: 1450, dir: -1, suor: 1, objetoT: (c, x, y) => capacete(c, x, y + 30, 0.6) }, duda: { x: 600, dir: 1 } }, { noite: 1 });
  return [
    [q.a, QUENTE((c, T, t0) => { ruaSuburbio(c, T, { desloc: (T - t0) * 260 }); moto(c, 760, 990, 1.0, 1, { rodaGira: T * 12 }); ator(c, T, 'caio', { x: 720, y: 760, s: 0.95, dir: 1, sentadoBanco: 1, bracoF: [1.25, 0.1], luz: LUZ_SOL }); capacete(c, 750, 535, 0.95); })],
    [q.L(2), tom(1.7, 900, 600, QUENTE((c, T) => { ruaSuburbio(c, T, { desloc: 400 }); moto(c, 760, 990, 1.0, 1); ator(c, T, 'caio', { x: 720, y: 760, s: 0.95, dir: 1, sentadoBanco: 1, bracoF: [1.25, 0.1], luz: LUZ_SOL, expr: 'sorriso' });
      c.fillStyle = 'rgba(10,10,12,0.85)'; rr(c, 960, 520, 300, 90, 14); c.fill(); c.fillStyle = '#2ac05a'; c.font = '700 30px Inter'; c.fillText('BÔNUS CALOR', 980, 556); c.fillStyle = '#f2efe9'; c.fillText('+R$ 2,00', 980, 594); }, 0.7), 0.01)],
    ...cobertura(q, 3, 6, ENTREGA),
    [q.L(7), tom(1.5, 820, 560, QUENTE((c, T) => { ruaSuburbio(c, T, { desloc: 500 }); moto(c, 760, 990, 1.0, 1); ator(c, T, 'caio', { x: 980, s: 1, dir: -1, y: yChao(CH, 'caio'), objeto: celularMao(), bracoF: [1.15, 0.95], luz: LUZ_SOL }); }, 0.6))],
    [q.L(8) + 0.5, insertGarrafa({ fundo: '#e6c9a0', moto: 1 })],
    [q.L(9), tom(1.9, 1000, 470, QUENTE((c, T) => { ruaSuburbio(c, T, { desloc: 500 }); ator(c, T, 'caio', { x: 980, s: 1, dir: -1, y: yChao(CH, 'caio'), objeto: celularMao(), bracoF: [1.15, 0.95], luz: LUZ_SOL, suor: 1 }); }, 0.6))],
    [q.L(12), tom(1.05, 960, 520, QUENTE((c, T) => rioCalorAereo(c, T), 1.2), 0.02)],
    [q.L(13), tom(2.1, 1000, 460, QUENTE((c, T) => { ruaSuburbio(c, T, { desloc: 500 }); ator(c, T, 'caio', { x: 980, s: 1, dir: -1, y: yChao(CH, 'caio'), suor: 1, expr: 'preocupado', luz: LUZ_SOL }); }, 0.8), 0.02)],
    [q.L(14) - 1.0, tom(1.0, 960, 560, (c, T) => desenhaPalco(c, T, SALA), 0.01)],
    ...cobertura(q, 14, 19, SALA, { abre: false }),
    [q.L(20) - 0.2, tom(1.2, 960, 640, (c, T, t0) => { apCalor(c, T, { panela: 1 }); const t = T - t0, x = t < 1.6 ? 500 + t * 420 : 1170 - (t - 1.6) * 520; desenharCachorro(c, T, { x, y: 935, s: 0.9, dir: t < 1.6 ? 1 : -1, pose: 'andando', fase: T * 2, ofega: 0.6 }); }, 0.005)],
    ...cobertura(q, 21, 23, SALA, { abre: false }),
    [q.L(24), insertGeladeira],
    [q.L(25), tomadaPalco(SALA, 'close', 'nena')],
    [q.L(26) - 0.3, insertGarrafa({ panela: 1 })],
    [q.L(27) - 2.2, tom(1.0, 960, 540, (c, T, t0) => { relogioCorredor(18, 0)(c, T, t0); notasRadio(c, T, 1000, 400, sstep(0.3, 1.2, T - t0)); }, 0.01)],
    ...cobertura(q, 28, 29, CORR, { abre: false }),
    [q.L(30) - 0.8, tom(1.0, 960, 560, (c, T) => desenhaPalco(c, T, NOITE))],
    ...cobertura(q, 31, 32, NOITE, { abre: false }),
    [q.L(33), tom(1.15, 1280, 520, (c, T) => { ruaSuburbio(c, T, { hora: 'noite' }); c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = rgrad(c, 1280, 400, 0, 380, [[0, 'rgba(255,110,40,0.35)'], [1, 'rgba(0,0,0,0)']]); c.fillRect(0, 0, W, H); c.restore();
      ['morador', 'senhora', 'vizinha', 'homem'].forEach((n, i) => ator(c, T, n, { x: 300 + i * 230, y: 860, s: 0.8, dir: i % 2 ? -1 : 1, sentado: 1, luz: LUZ_NOITE, objeto: i === 1 ? leque('#3a7fbf', T) : undefined })); }, 0.02)],
    [q.L(34), fixo((c, T) => { c.fillStyle = '#100d0b'; c.fillRect(0, 0, W, H); tvParede(c, 210, 90, 1500, 880, T, 'calor'); })],
  ]; };

DIR[2] = q => {
  const APS = AP({ duda: { x: 520, dir: 1 }, nena: { x: 1250, dir: -1 } }, { semLuz: 1 });
  const ESC = PALCO((c, T) => escadaDia(c, T), { nena: { x: 1300, dir: -1, y: yChao(CH, 'nena') - 120 }, duda: { x: 1520, dir: -1, y: yChao(CH, 'duda') - 160 }, valdir: { x: 560, dir: 1, objeto: caixa('#c8a070'), bracoF: [1.2, 0.4] } });
  const SINAL = PALCO((c, T) => { avenidaSinal(c, T); isopor(c, 380, 950, 1); }, { caio: { x: 520, dir: 1, sentadoChao: 1, y: 860, suor: 1 }, tiao: { x: 780, dir: -1, expr: 'sorriso' } }, { luz: LUZ_SOL });
  const ENTRA = AP({ caio: { x: 1500, dir: -1, suor: 1 }, duda: { x: 760, dir: 1, expr: 'preocupado' } }, { semLuz: 1 }, { antes: (c, T) => desenharCachorro(c, T, { x: 560, y: 935, s: 0.8, pose: 'deitada', ofega: 0.6 }) });
  const estouro = (t0) => (c, T) => { const t = T - t0; ruaSuburbio(c, T, { semLuz: t > 0.15 ? 1 : 0, arCond: t > 0.15 ? 0 : 1 }); posteTransformador(c, T, 700, t > 0 ? Math.max(0, 1 - t / 0.9) : 0); if (t > 0.15) { c.fillStyle = 'rgba(30,20,10,0.12)'; c.fillRect(-800, -400, W + 1600, 1800); } };
  return [
    [q.a, tom(1.0, 960, 540, QUENTE((c, T) => ruaSuburbio(c, T)))],
    [q.L(1), tom(1.6, 760, 460, QUENTE((c, T) => { ruaSuburbio(c, T); posteTransformador(c, T, 700 + Math.sin(T * 60) * (T % 2 > 1 ? 2 : 0.5), 0); }, 0.7), 0.04)],
    [q.L(2), tom(1.7, 640, 520, (c, T) => desenhaPalco(c, T, AP({ duda: { x: 520, dir: -1, objeto: celularMao(), bracoF: [1.15, 0.95] } })))],
    [q.L(3) - 1.25, tom(1.0, 960, 540, (c, T, t0) => estouro(t0 + 0.15)(c, T), 0.0, 3)],
    [q.L(3), tom(1.7, 640, 520, (c, T) => desenhaPalco(c, T, AP({ duda: { x: 520, dir: -1, objeto: celularMao(), bracoF: [1.15, 0.95], expr: 'surpreso' } }, { semLuz: 1 })))],
    [q.L(4), tom(1.0, 960, 540, (c, T) => ruaSuburbio(c, T, { semLuz: 1, arCond: 0 }), 0.01)],
    ...cobertura(q, 5, 6, APS),
    [q.L(7) - 1.0, tom(1.0, 960, 540, (c, T) => desenhaPalco(c, T, ESC))],
    ...cobertura(q, 8, 13, ESC, { abre: false }),
    [q.L(14), tom(1.0, 960, 560, QUENTE((c, T, t0) => { avenidaSinal(c, T); moto(c, 900, 990, 1.0, 1); ator(c, T, 'caio', { x: 860, y: 760, s: 0.95, dir: 1, sentadoBanco: 1, bracoF: [1.25, 0.1], luz: LUZ_SOL, suor: 1 }); capacete(c, 890, 535, 0.95); }, 1.4))],
    [q.L(15), tom(2.2, 900, 470, QUENTE((c, T) => { avenidaSinal(c, T); ator(c, T, 'caio', { x: 860, y: 760, s: 0.95, dir: 1, sentadoBanco: 1, bracoF: [1.25, 0.1], luz: LUZ_SOL, suor: 1, expr: 'preocupado', incl: Math.sin(T * 1.7) * 0.12 }); }, 2.0), 0.05, 3)],
    ...cobertura(q, 16, 23, SINAL),
    [q.L(24), tom(1.5, 640, 620, QUENTE((c, T) => desenhaPalco(c, T, { ...SINAL, atores: { caio: { ...SINAL.atores.caio, objeto: garrafaMao(0.6), bracoF: [1.9, 1.2] }, tiao: SINAL.atores.tiao } }), 0.6), 0.01)],
    [q.L(24) + 3.4, ((c, T, t0) => { desenhaPalco(c, T, { ...SINAL, atores: { caio: { ...SINAL.atores.caio, objeto: garrafaMao(0.5), bracoF: [1.9, 1.2] }, tiao: SINAL.atores.tiao } }); nevoaCalor(c, 0.6);
      faixaInfo(c, T - t0, ['EXAUSTÃO PELO CALOR', 'Tontura, dor de cabeça, enjoo, fraqueza', 'Pare, sombra, água, esfrie o corpo · Confusão: 192']); })],
    [q.L(25) - 0.6, insertTela({ bateria: 34, semServico: 0, texto: 'VOCÊ ESTÁ OFFLINE', sub: 'chamada: MÃE', cor: '#123024' })],
    [q.L(26), tomadaPalco(SINAL, 'close', 'caio')],
    [q.L(27) - 1.0, tom(1.0, 960, 560, (c, T) => desenhaPalco(c, T, ENTRA))],
    ...cobertura(q, 28, 30, ENTRA, { abre: false }),
  ]; };

DIR[3] = q => {
  const FEIRA = PALCO((c, T) => feira(c, T), { caio: { x: 700, dir: 1, suor: 1 }, duda: { x: 520, dir: 1, objeto: pipocaNoColo(0), bracoF: [0.9, 1.4] }, feirante: { x: 1040, dir: -1 } }, { luz: LUZ_SOL });
  const IGREJA = PALCO((c, T) => igrejaFechada(c, T), { caio: { x: 760, dir: -1, expr: 'preocupado' }, duda: { x: 560, dir: 1, expr: 'preocupado', objeto: pipocaNoColo(0), bracoF: [0.9, 1.4] } }, { luz: LUZ_SOL });
  const PONTO = PALCO((c, T) => pontoOnibus(c, T), { nena: { x: 1000, dir: -1, sentadoBanco: 1, y: 790, suor: 1, objeto: leque('#c0392b', 0) }, caio: { x: 640, dir: 1 }, duda: { x: 1300, dir: -1, objeto: pipocaNoColo(0), bracoF: [0.9, 1.4] } },
    { luz: LUZ_SOL, antes: (c, T) => { [880, 1120].forEach(x => { c.fillStyle = '#e8e4d8'; rr(c, x, 880, 70, 54, 8); c.fill(); }); } });
  const CORR = PALCO(relogioCorredor(18, 0), { caio: { x: 780, dir: 1, objeto: bolsa('#e8e4d8') }, duda: { x: 520, dir: 1 } });
  return [
    [q.a, QUENTE((c, T, t0) => { ruaSuburbio(c, T, { desloc: 1400 + (T - t0) * 160 }); ator(c, T, 'caio', { x: 900, y: yChao(CH, 'caio'), dir: 1, andar: T * 1.6, intens: 1.3, luz: LUZ_SOL, suor: 1 }); ator(c, T, 'duda', { x: 700, y: yChao(CH, 'duda'), dir: 1, andar: T * 1.6 + 0.3, intens: 1.2, luz: LUZ_SOL, objeto: pipocaNoColo(T), bracoF: [0.9, 1.4] }); })],
    [q.L(1), tom(1.9, 760, 600, QUENTE((c, T) => { ruaSuburbio(c, T, { desloc: 1500 }); ator(c, T, 'caio', { x: 860, y: yChao(CH, 'caio'), dir: -1, luz: LUZ_SOL, bracoF: [0.4, 0.2] }); ator(c, T, 'duda', { x: 640, y: yChao(CH, 'duda'), dir: 1, luz: LUZ_SOL, objeto: pipocaNoColo(T), bracoF: [0.9, 1.4] }); }))],
    [q.L(2) - 0.6, insertMaoAsfalto],
    [q.L(3), tom(1.9, 760, 600, QUENTE((c, T) => { ruaSuburbio(c, T, { desloc: 1500 }); ator(c, T, 'caio', { x: 860, y: yChao(CH, 'caio'), dir: -1, luz: LUZ_SOL }); ator(c, T, 'duda', { x: 640, y: yChao(CH, 'duda'), dir: 1, luz: LUZ_SOL, objeto: pipocaNoColo(T), bracoF: [0.9, 1.4], expr: 'surpreso' }); }))],
    [q.L(4), tom(2.6, 660, 640, QUENTE((c, T) => { ruaSuburbio(c, T, { desloc: 1500 }); ator(c, T, 'duda', { x: 640, y: yChao(CH, 'duda'), dir: 1, luz: LUZ_SOL, objeto: pipocaNoColo(T), bracoF: [0.9, 1.4] }); }, 0.5), 0.02)],
    [q.L(5) - 1.0, tom(1.0, 960, 560, QUENTE((c, T) => desenhaPalco(c, T, FEIRA), 0.6))],
    ...cobertura(q, 5, 6, FEIRA, { abre: false }),
    [q.L(7) - 1.2, tom(1.0, 960, 560, QUENTE((c, T) => desenhaPalco(c, T, IGREJA), 0.6))],
    ...cobertura(q, 8, 10, IGREJA, { abre: false }),
    [q.L(11) - 1.0, tom(1.0, 960, 560, QUENTE((c, T) => desenhaPalco(c, T, PONTO), 0.6))],
    ...cobertura(q, 11, 22, PONTO, { abre: false }),
    [q.L(23), tomadaPalco(PONTO, 'dois', 'duda')],
    [q.L(24), tomadaPalco(PONTO, 'close', 'nena')],
    [q.L(26), tom(2.0, 1000, 520, QUENTE((c, T) => desenhaPalco(c, T, { ...PONTO, atores: { ...PONTO.atores, nena: { ...PONTO.atores.nena, objeto: garrafaMao(0.8), bracoF: [2.2, 1.3] } } }), 0.5), 0.02)],
    [q.L(27) - 1.0, tom(1.0, 960, 540, (c, T) => desenhaPalco(c, T, CORR))],
    [q.L(28) - 2.6, tom(1.25, 960, 520, (c, T, t0) => { desenhaPalco(c, T, CORR); notasRadio(c, T, 1000, 400, sstep(0.2, 1.0, T - t0)); }, 0.01)],
    [q.L(28), tom(1.6, 640, 500, (c, T) => { desenhaPalco(c, T, { ...CORR, atores: { ...CORR.atores, duda: { ...CORR.atores.duda, expr: 'sorriso' } } }); notasRadio(c, T, 1000, 400); })],
  ]; };

DIR[4] = q => {
  const REU = PALCO((c, T) => escadaVelas(c, T), {
    zica: { x: 300, dir: 1, sentadoBanco: 1, y: 830, objeto: bebeColo(), bracoF: [1.1, 1.2] }, morador: { x: 560, dir: 1, sentadoBanco: 1, y: 790 },
    caio: { x: 820, dir: 1, sentadoBanco: 1, y: 750 }, nena: { x: 1060, dir: -1, sentadoBanco: 1, y: 730, objeto: leque('#c0392b', 0) }, duda: { x: 1250, dir: -1, sentadoBanco: 1, y: 690 },
    valdir: { x: 1560, dir: -1, expr: 'firme' } }, { luz: LUZ_VELA });
  const APN = AP({ caio: { x: 520, dir: 1, objeto: celularMao(), bracoF: [1.15, 0.95] } }, { noite: 1, semLuz: 1 }, { luz: LUZ_NOITE });
  const APN2 = AP({ duda: { x: 900, dir: 1, objeto: baldeMao(), bracoF: [0.2, 0.3] }, caio: { x: 380, dir: -1, bracoF: [1.6, 0.6] } }, { noite: 1, semLuz: 1 }, { luz: LUZ_NOITE });
  return [
    [q.a, tom(1.0, 960, 560, (c, T) => desenhaPalco(c, T, REU), 0.01)],
    ...cobertura(q, 1, 11, REU, { abre: false }),
    [q.L(12), tom(1.1, 1300, 600, (c, T, t0) => { garagemGerador(c, T, { portao: 1 - 0.85 * sstep(0, 2.2, T - t0), fumaca: 0, ligado: 0 }); ator(c, T, 'valdir', { x: 1500, y: yChao(CH, 'valdir'), dir: -1, bracoF: [2.6, 0.2], luz: LUZ_NOITE }); c.fillStyle = 'rgba(5,6,14,0.45)'; c.fillRect(-800, -400, W + 1600, 1800); }, 0.01)],
    [q.L(13) - 1.0, tom(1.0, 960, 560, (c, T) => desenhaPalco(c, T, APN))],
    [q.L(14), fixo((c, T) => { c.fillStyle = '#1a1612'; c.fillRect(0, 0, W, H); isopor(c, 960, 860, 3, { aberto: 0.7 }); insulinaCaixa(c, 960, 640, 3); c.fillStyle = 'rgba(5,6,14,0.3)'; c.fillRect(0, 0, W, H); })],
    [q.L(15), tomadaPalco(APN, 'close', 'caio')],
    [q.L(16) + 2.2, tom(2.0, 560, 470, (c, T) => desenhaPalco(c, T, { ...APN, atores: { caio: { ...APN.atores.caio, expr: 'preocupado' } } }), 0.02)],
    [q.L(17), tom(1.0, 960, 560, (c, T) => desenhaPalco(c, T, APN2))],
    [q.L(18), tom(1.15, 460, 500, (c, T) => apCalor(c, T, { noite: 1, semLuz: 1, cortina: 0 }), 0.02)],
    [q.L(19), tom(1.45, 1000, 760, (c, T) => { corredor302(c, T, { escuro: 0.75 }); deitado(c, T, 'nena', 560, 880, 0.8, { cabeca: -1, olhosFechados: !falando('nena', T), luz: LUZ_NOITE }); deitado(c, T, 'duda', 980, 900, 0.8, { cabeca: -1, olhosFechados: 1, luz: LUZ_NOITE }); deitado(c, T, 'caio', 1450, 880, 0.8, { cabeca: 1, luz: LUZ_NOITE }); })],
    [q.L(21), tom(1.05, 1280, 520, (c, T) => ruaSuburbio(c, T, { hora: 'noite', semLuz: 1 }), 0.03)],
  ]; };

DIR[5] = q => {
  const ORLA = PALCO((c, T) => orlaAmanhecer(c, T), { senhora: { x: 1100, dir: -1, sentadoChao: 1, y: 880 }, caio: { x: 760, dir: 1, objeto: bolsa('#e8b22e') } }, { luz: LUZ_AMANHECER });
  const GELO = PALCO((c, T) => { fabricaGelo(c, T); isopor(c, 1500, 950, 1, { cor: '#f2f2ee', tampa: '#c0392b' }); fila(c, T, 300, 990, 4, 110, 0.55, 33, 1); }, { tiao: { x: 1300, dir: -1, expr: 'sorriso' }, caio: { x: 1000, dir: 1 } }, { luz: LUZ_AMANHECER });
  const HOSP = PALCO((c, T) => emergencia(c, T), { enfermeira: { x: 700, dir: 1 }, sonia: { x: 1000, dir: -1, expr: 'preocupado' } }, { luz: LUZ_HOSP });
  const APD = AP({ duda: { x: 760, dir: 1, objeto: (c, x, y) => insulinaCaixa(c, x, y, 0.6), bracoF: [1.2, 0.6] }, caio: { x: 1250, dir: -1 } }, { semLuz: 1, cortina: 0.5 },
    { antes: (c, T) => isopor(c, 980, 935, 0.9, { aberto: 0.8 }) });
  return [
    [q.a, (c, T, t0) => { ruaSuburbio(c, T, { hora: 'amanhecer', desloc: (T - t0) * 300 }); moto(c, 820, 990, 1.0, 1, { rodaGira: T * 12 }); ator(c, T, 'caio', { x: 780, y: 760, s: 0.95, dir: 1, sentadoBanco: 1, bracoF: [1.25, 0.1], luz: LUZ_AMANHECER }); capacete(c, 810, 535, 0.95); }],
    [q.L(1), tom(2.0, 860, 500, (c, T) => { ruaSuburbio(c, T, { hora: 'amanhecer', desloc: 800 }); moto(c, 820, 990, 1.0, 1); ator(c, T, 'caio', { x: 780, y: 760, s: 0.95, dir: 1, sentadoBanco: 1, bracoF: [1.25, 0.1], luz: LUZ_AMANHECER, expr: 'sorriso' }); })],
    [q.L(2), (c, T, t0) => { c.save(); camera(c, 1.0, 960, 540); ruaSuburbio(c, T, { hora: 'amanhecer', desloc: 1200 }); c.restore(); faixaInfo(c, T - t0, ['SOL MAIS FORTE: 10h ÀS 16h', 'É o horário em que o calor mais adoece', 'Saia cedo, volte antes das 10h']); }],
    [q.L(3), tom(1.0, 960, 540, (c, T, t0) => { c.translate(-(T - t0) * 18, 0); orlaAmanhecer(c, T); }, 0.0)],
    ...cobertura(q, 4, 5, ORLA),
    [q.L(6) - 1.0, tom(1.0, 960, 560, (c, T) => desenhaPalco(c, T, GELO))],
    ...cobertura(q, 6, 13, GELO, { abre: false }),
    [q.L(14), tom(1.0, 960, 560, (c, T) => emergencia(c, T), 0.02)],
    ...cobertura(q, 15, 18, HOSP),
    [q.L(19) - 0.2, tom(2.3, 1030, 470, (c, T) => desenhaPalco(c, T, HOSP), 0.03, 0.6)],
    [q.F(19) + 0.2, insertTela({ bateria: 18, semServico: 1, texto: 'SEM SINAL', sub: 'Casa · 3 chamadas não completadas', cor: '#141c24' })],
    [q.L(20) - 1.0, tom(1.0, 960, 560, (c, T) => desenhaPalco(c, T, APD))],
    ...cobertura(q, 20, 22, APD, { abre: false }),
    [q.L(23), (c, T, t0) => { c.save(); camera(c, 1.0, 960, 540); apCalor(c, T, { semLuz: 1, cortina: 0.5 + 0.5 * sstep(0, 1.5, T - t0) }); termometroRua(c, 1620, 250, '41°C', T, 0.7); c.restore(); }],
  ]; };

DIR[6] = q => {
  const FILA = PALCO((c, T) => filaPipa(c, T), { duda: { x: 300, dir: 1, objeto: pipocaNoColo(0), bracoF: [0.9, 1.4] }, caio: { x: 560, dir: 1, objeto: galaoMao() }, mulher: { x: 1180, dir: -1, objeto: baldeMao('#c0392b') }, homem: { x: 900, dir: 1 } }, { luz: LUZ_SOL });
  const SOMBRA = PALCO((c, T) => { filaPipa(c, T); c.fillStyle = 'rgba(30,20,10,0.25)'; c.fillRect(-800, -400, W + 1600, 1800); }, { duda: { x: 760, dir: 1, sentadoChao: 1, y: 860 }, caio: { x: 1160, dir: -1, objeto: baldeMao() } },
    { luz: LUZ_SOL, antes: (c, T) => desenharCachorro(c, T, { x: 960, y: 935, s: 0.9, dir: -1, pose: 'deitada', ofega: 1 - 0.6 * sstep(q.L(16) - 1, q.L(16), T), abana: sstep(q.L(16) - 1, q.L(16), T) }) });
  const GAR = PALCO((c, T) => garagemGerador(c, T, { portao: 0.15, fumaca: 1, ligado: 1 }), { caio: { x: 1400, dir: -1, objeto: galaoMao(), expr: 'preocupado' }, duda: { x: 1640, dir: -1, expr: 'preocupado' }, valdir: { x: 420, dir: 1, sentado: 1, y: 760, expr: 'preocupado', olhosFechados: 0 } }, { luz: LUZ_CASA });
  const CALC = RUA({ valdir: { x: 760, dir: 1, sentadoChao: 1, y: 880 }, caio: { x: 1060, dir: -1 }, duda: { x: 1300, dir: -1 } }, { desloc: 300 });
  return [
    [q.a, tom(1.05, 960, 540, QUENTE((c, T) => { ruaSuburbio(c, T, { arCond: 0, semLuz: 1 }); termometroRua(c, 700, 560, '50°C', T); }, 1.6), 0.02)],
    [q.L(1), tom(1.3, 700, 420, QUENTE((c, T) => { ruaSuburbio(c, T, { arCond: 0, semLuz: 1 }); aves(c, T, 520, 495, 8); }, 1.4), 0.02)],
    [q.L(2), tom(1.6, 1360, 380, QUENTE((c, T) => ruaSuburbio(c, T, { arCond: 0, semLuz: 1 }), 1.2), 0.02)],
    [q.L(3) - 1.0, tom(1.0, 960, 560, QUENTE((c, T) => desenhaPalco(c, T, FILA), 0.9))],
    ...cobertura(q, 3, 11, FILA, { abre: false }),
    [q.L(12), tom(1.15, 900, 560, QUENTE((c, T) => { desenhaPalco(c, T, FILA); ator(c, T, 'vizinha', { x: 140, y: yChao(CH, 'vizinha'), dir: 1, objeto: bebeColo(), bracoF: [1.1, 1.2], luz: LUZ_SOL }); }, 0.8), 0.01)],
    [q.L(13), tom(1.0, 960, 560, QUENTE((c, T) => desenhaPalco(c, T, SOMBRA), 0.6))],
    [q.L(13) + 1.2, tom(2.4, 1000, 800, QUENTE((c, T) => desenhaPalco(c, T, SOMBRA), 0.5), 0.02)],
    [q.L(14), tomadaPalco(SOMBRA, 'close', 'caio')],
    [q.L(15), tom(1.3, 960, 640, (c, T, t0) => { desenhaPalco(c, T, { ...SOMBRA, atores: { ...SOMBRA.atores, duda: { x: 860, dir: 1, sentadoChao: 1, y: 860, objeto: baldeMao(), bracoF: [1.0, 0.6] } } }); faixaInfo(c, T - t0, ['CACHORRO COM CALOR', 'Ofegando muito, babando, fraco', 'Sombra, água fresca (não gelada), patas e barriga molhadas']); }, 0.01)],
    [q.L(16), tom(1.9, 900, 720, (c, T) => { desenhaPalco(c, T, { ...SOMBRA, antes: (c2, T2) => desenharCachorro(c2, T2, { x: 960, y: 935, s: 0.9, dir: -1, pose: 'sentada', ofega: 0.3, abana: 1.6 }), atores: { ...SOMBRA.atores, duda: { ...SOMBRA.atores.duda, expr: 'riso' } } }); })],
    [q.L(17) - 1.2, tom(1.0, 960, 560, (c, T) => desenhaPalco(c, T, GAR))],
    ...cobertura(q, 17, 20, GAR, { abre: false }),
    [q.L(21), tomadaPalco(GAR, 'close', 'caio')],
    [q.F(21), tom(1.0, 960, 560, (c, T, t0) => { const t = T - t0; garagemGerador(c, T, { portao: 0.15 + 0.85 * sstep(0, 1.2, t), fumaca: 1 - 0.7 * sstep(0.5, 3, t), ligado: 1 }); }, 0.0, 2)],
    [q.L(22), tom(1.0, 960, 540, (c, T) => { ruaSuburbio(c, T, { desloc: 300 }); gerador(c, 560, 945, 0.8, 1, T); desenhaPalco(c, T, { ...CALC, fundo: () => {} }); })],
    [q.L(23), (c, T, t0) => { c.save(); camera(c, 1.0, 960, 540); ruaSuburbio(c, T, { desloc: 300 }); gerador(c, 560, 945, 0.8, 1, T); desenhaPalco(c, T, { ...CALC, fundo: () => {} }); c.restore();
      faixaInfo(c, T - t0, ['GERADOR: SÓ AO AR LIVRE', 'Nunca em casa, garagem ou lugar fechado', 'Longe de portas e janelas · monóxido de carbono não tem cheiro']); }],
    ...cobertura(q, 24, 27, CALC),
    [q.L(28) - 3.2, tom(1.0, 960, 540, relogioCorredor(18, 0), 0.02)],
    [q.L(28), tom(1.5, 700, 520, (c, T, t0) => desenhaPalco(c, T, PALCO((c2, T2) => corredor302(c2, T2, { hora: '18:02' }), { duda: { x: 600, dir: 1, objeto: galaoMao(), expr: 'preocupado' }, caio: { x: 360, dir: 1, objeto: galaoMao() } })))],
    [q.L(30), tom(2.0, 1000, 560, (c, T) => corredor302(c, T, { hora: '18:02' }), 0.05, 0.5)],
  ]; };

DIR[7] = q => {
  const CORR = PALCO((c, T) => corredor302(c, T, { hora: '18:05' }), { caio: { x: 860, dir: 1, bracoF: [1.6, 0.4] }, duda: { x: 600, dir: 1, expr: 'preocupado' }, nena: { x: 1600, dir: -1, mostrar: T => T > q.L(2) - 0.3 }, valdir: { x: 1360, dir: -1, objeto: chaves(), mostrar: T => T > q.L(3) - 0.3 } });
  const SALA = PALCO((c, T) => apAdemar(c, T, { aberto: sstep(q.L(9), q.L(9) + 1.5, T) }), { caio: { x: 1260, dir: -1 }, duda: { x: 1480, dir: -1, objeto: panoMolhado() }, nena: { x: 1650, dir: -1, expr: 'preocupado' }, valdir: { x: 260, dir: 1, objeto: celularMao(), bracoF: [1.15, 0.95] } },
    { luz: LUZ_CASA, antes: (c, T) => ator(c, T, 'ademar', { x: 960, y: 860, s: 1, dir: 1, sentadoChao: 1, expr: 'preocupado', luz: LUZ_CASA }) });
  const ESCADA = PALCO((c, T) => escadaDia(c, T), { valdir: { x: 600, dir: 1, bracoF: [0.9, 0.4] }, caio: { x: 1160, dir: -1, bracoF: [0.9, 0.4] }, nena: { x: 1500, dir: -1, y: yChao(CH, 'nena') - 130, objeto: (c, x, y) => radio(c, x, y + 30, 0.4, 0, 0), bracoF: [1.0, 1.0] } },
    { antes: (c, T) => ator(c, T, 'ademar', { x: 880, y: 640, dir: 1, sentado: 1 }) });
  const CARRO = PALCO((c, T) => carroNoite(c, T), { ademar: { x: 640, dir: 1, sentadoBanco: 1, y: 760, objeto: panoMolhado(), bracoF: [2.4, 0.4] }, caio: { x: 1000, dir: -1, sentadoBanco: 1, y: 760 }, valdir: { x: 1480, dir: -1, sentadoBanco: 1, y: 720, s: 1.08 } }, { luz: LUZ_NOITE });
  const APN = AP({ duda: { x: 1300, dir: -1, objeto: lanternaMao(1), bracoF: [1.0, 0.5] }, caio: { x: 1600, dir: -1 } }, { noite: 1, semLuz: 1 },
    { luz: LUZ_NOITE, antes: (c, T) => ator(c, T, 'nena', { x: 420, y: 800, dir: 1, sentadoChao: 1, olhosFechados: 1, objeto: (c2, x, y) => radio(c2, x, y + 30, 0.4, 0, 0), luz: LUZ_NOITE }) });
  return [
    [q.a, tom(1.0, 960, 560, (c, T) => desenhaPalco(c, T, CORR))],
    ...cobertura(q, 1, 3, CORR, { abre: false }),
    [q.L(4) - 1.5, tom(1.0, 960, 560, (c, T) => desenhaPalco(c, T, SALA), 0.015)],
    [q.L(5), tom(2.0, 1000, 600, (c, T) => desenhaPalco(c, T, SALA), 0.02)],
    [q.L(6), tomadaPalco(SALA, 'close', 'nena')],
    [q.L(7), tom(2.1, 1000, 600, (c, T) => desenhaPalco(c, T, SALA), 0.02)],
    [q.L(8), tom(1.0, 960, 560, (c, T) => desenhaPalco(c, T, SALA), 0.01)],
    [q.L(9), tomadaPalco(SALA, 'dois', 'caio')],
    ...cobertura(q, 10, 14, SALA, { abre: false }),
    [q.L(15) - 0.2, tom(1.0, 960, 560, (c, T) => desenhaPalco(c, T, ESCADA))],
    [q.L(16), tomadaPalco(ESCADA, 'close', 'nena')],
    [q.L(17), tom(1.9, 900, 420, (c, T) => desenhaPalco(c, T, ESCADA), 0.02)],
    [q.L(18), tom(2.4, 1520, 470, (c, T) => desenhaPalco(c, T, ESCADA), 0.03, 0.6)],
    [q.L(19), tomadaPalco(ESCADA, 'close', 'caio')],
    [q.L(20) - 1.0, tom(1.0, 960, 560, (c, T) => desenhaPalco(c, T, CARRO))],
    ...cobertura(q, 21, 25, CARRO, { abre: false }),
    [q.L(26), tomadaPalco(CARRO, 'close', 'valdir')],
    [q.L(27), tomadaPalco(CARRO, 'close', 'caio')],
    [q.L(28), tom(1.0, 960, 560, (c, T) => { upa(c, T); ator(c, T, 'enfermeira', { x: 1100, y: yChao(CH, 'enfermeira'), dir: -1, luz: LUZ_HOSP }); ator(c, T, 'ademar', { x: 900, y: 760, dir: 1, sentado: 1, luz: LUZ_HOSP }); }, 0.015)],
    [q.L(29) - 1.0, tom(1.0, 960, 560, (c, T) => desenhaPalco(c, T, APN))],
    ...cobertura(q, 30, 32, APN, { abre: false }),
    [q.L(33) - 0.4, insertGarrafa({ fundo: '#2a2420', mesa: '#3a2a1e' })],
  ]; };

DIR[8] = q => {
  const P = QUARTO();
  const PORTA = PALCO((c, T) => corredor302(c, T, { escuro: 0.7 }), { caio: { x: 760, dir: 1, objeto: celularMao(), bracoF: [1.15, 0.95], mostrar: T => true }, valdir: { x: 1100, dir: -1 } }, { luz: LUZ_LANTERNA });
  const CALC = PALCO((c, T) => calcadaResgate(c, T), {
    duda: { x: 700, dir: 1, sentadoChao: 1, y: 880, objeto: panoMolhado(), bracoF: [1.4, 0.4] }, caio: { x: 1260, dir: -1, objeto: celularMao(), bracoF: [1.15, 0.95] },
    vizinha: { x: 1480, dir: -1, objeto: papelaoAbano(0, 1), bracoF: [1.6, 0.6] }, valdir: { x: 1660, dir: -1, objeto: papelaoAbano(0, 2), bracoF: [1.6, 0.6] },
    tiao: { x: 300, dir: 1, mostrar: T => T > q.L(22) - 1.5, din: T => ({ x: 300 + 200 * sstep(q.L(22) - 1.5, q.L(22), T) }) } },
    { luz: LUZ_NOITE, antes: (c, T) => { deitado(c, T, 'nena', 960, 900, 0.85, { cabeca: -1, olhosFechados: !falando('nena', T), luz: LUZ_NOITE }); if (T > q.L(22) - 2.5) kombi(c, -100 + 260 * sstep(q.L(22) - 2.5, q.L(22) - 1, T), 935, 0.9); } });
  return [
    [q.a, tomadaPalco(P, 'close', 'caio')],
    [q.L(1), tomadaPalco(P, 'close', 'duda')],
    [q.L(2), insertTela({ bateria: 2, semServico: 1 })],
    [q.L(3), tomadaPalco(P, 'close', 'duda')],
    [q.L(4), tomadaPalco(P, 'dois', 'caio')],
    [q.F(4) - 1.2, tom(1.1, 960, 560, (c, T, t0) => { escada(c, T, 4); const u = clamp(0.85 - (T - t0) * 0.32, 0.05, 1), [px, py] = noDegrau(u);
      escuridao(c, 0.78, [{ x: px + 60, y: py - 260, r: 620, cor: 'rgba(200,220,255,0.28)' }]); ator(c, T, 'caio', { x: px, y: py - 258 * 1.02, dir: -1, andar: T * 2.4, intens: 1.4, luz: LUZ_LANTERNA, objeto: lanternaMao(1) }); }, 0.0, 3)],
    [q.L(5), tom(1.0, 960, 560, (c, T) => desenhaPalco(c, T, PORTA))],
    [q.L(6), tom(1.9, 820, 470, (c, T, t0) => { desenhaPalco(c, T, PORTA); }, 0.02)],
    [q.L(6) + 0.6, (c, T, t0) => { c.save(); camera(c, 1.9, 820, 470); desenhaPalco(c, T, PORTA); c.restore(); faixaInfo(c, T - t0, ['192 · SAMU', 'Confusão mental no calor é emergência']); }],
    ...cobertura(q, 7, 12, PORTA, { abre: false }),
    [q.L(13), tomadaPalco(PORTA, 'close', 'caio')],
    [q.L(14), tomadaPalco(PORTA, 'close', 'valdir')],
    [q.L(15) - 0.6, tom(1.05, 960, 560, (c, T, t0) => { escada(c, T, 3); const u = clamp(0.7 - (T - t0) * 0.06, 0.1, 1), at = k => noDegrau(clamp(u + k, 0, 1));
      const [dx, dy] = at(-0.18), [cx, cy] = at(-0.04), [vx, vy] = at(0.1), [wx, wy] = at(0.2);
      escuridao(c, 0.72, [{ x: dx + 40, y: dy - 300, r: 720, cor: 'rgba(200,220,255,0.26)' }]);
      desenharCachorro(c, T, { x: dx - 130, y: dy + 30, s: 0.75, dir: -1, pose: 'andando', fase: T * 2 });
      ator(c, T, 'duda', { x: dx, y: dy - 258 * 0.68, dir: -1, objeto: lanternaMao(1), bracoF: [1.2, 0.3], luz: LUZ_LANTERNA });
      ator(c, T, 'caio', { x: cx, y: cy - 258 * 1.02, dir: 1, bracoF: [0.9, 0.4], luz: LUZ_LANTERNA });
      ator(c, T, 'nena', { x: vx, y: vy - 258 * 0.86 - 60, dir: -1, sentado: 1, olhosFechados: 1, luz: LUZ_LANTERNA });
      ator(c, T, 'valdir', { x: wx, y: wy - 258 * 0.98, dir: -1, bracoF: [0.9, 0.4], luz: LUZ_LANTERNA }); }, 0.0)],
    [q.L(16), tom(1.0, 960, 560, (c, T, t0) => { corredor302(c, T, { escuro: 0.6 }); ator(c, T, 'vizinha', { x: 1100, y: yChao(CH, 'vizinha'), dir: -1, objeto: lanternaMao(1), luz: LUZ_LANTERNA }); ator(c, T, 'morador', { x: 1500, y: yChao(CH, 'morador'), dir: -1, objeto: lanternaMao(1), luz: LUZ_LANTERNA, mostrar: () => 1 }); ator(c, T, 'caio', { x: 600, y: yChao(CH, 'caio'), dir: 1, luz: LUZ_LANTERNA }); })],
    [q.L(18) - 1.0, tom(1.0, 960, 560, (c, T) => desenhaPalco(c, T, CALC))],
    ...cobertura(q, 18, 21, CALC, { abre: false }),
    [q.L(22) - 2.5, tom(1.0, 960, 560, (c, T) => desenhaPalco(c, T, CALC))],
    ...cobertura(q, 23, 24, CALC, { abre: false }),
    [q.L(25), tom(1.25, 960, 640, (c, T) => desenhaPalco(c, T, CALC), 0.01)],
    [q.L(25) + 0.3, (c, T, t0) => { c.save(); camera(c, 1.25, 960, 640); desenhaPalco(c, T, CALC); c.restore(); faixaInfo(c, T - t0, ['GOLPE DE CALOR É EMERGÊNCIA', 'Confusão, fala sem sentido ou desmaio · pele seca OU suada', 'Ligue 192 já · lugar fresco · roupa afrouxada', 'Frio no pescoço, axilas e virilha · nada para beber']); }],
    [q.L(27), tom(2.6, 900, 870, (c, T) => desenhaPalco(c, T, CALC), 0.02, 0.5)],
    [q.L(28), insertMaos],
    [q.L(29), tom(3.0, 880, 880, (c, T) => desenhaPalco(c, T, CALC), 0.02, 0.4)],
    [q.F(29) + 0.3, tom(1.0, 960, 560, (c, T, t0) => { desenhaPalco(c, T, CALC); ambulancia(c, 2300 - 700 * sstep(0, 2.2, T - t0), 940, 0.95, -1, T, 1); })],
    [q.L(30) - 0.4, tom(1.45, 1080, 560, (c, T) => { calcadaResgate(c, T); ambulancia(c, 1600, 940, 0.95, -1, T, 1); ator(c, T, 'socorrista', { x: 1380, y: yChao(CH, 'socorrista'), dir: 1, luz: LUZ_NOITE }); ator(c, T, 'duda', { x: 900, y: yChao(CH, 'duda'), dir: 1, expr: 'preocupado', luz: LUZ_NOITE }); }, 0.03)],
    [q.F(30) + 0.3, tom(2.2, 1500, 600, (c, T, t0) => { calcadaResgate(c, T); ambulancia(c, 1600, 940, 0.95, -1, T, 1); c.fillStyle = `rgba(0,0,0,${sstep(0.6, 1.3, T - t0)})`; c.fillRect(-800, -400, W + 1600, 1800); }, 0.0)],
  ]; };

DIR[9] = q => {
  const CORR = PALCO((c, T) => emergencia(c, T, { lotada: 0.3 }), { sonia: { x: 1100, dir: -1, expr: 'sorriso' }, caio: { x: 800, dir: 1 }, duda: { x: 600, dir: 1 } }, { luz: LUZ_HOSP });
  const ENF = PALCO((c, T) => enfermaria(c, T), { caio: { x: 760, dir: -1 }, duda: { x: 960, dir: -1 } },
    { luz: LUZ_HOSP, antes: (c, T) => { deitado(c, T, 'nena', 440, 720, 0.85, { cabeca: -1, luz: LUZ_HOSP, expr: exprAuto('nena', T, 'firme') }); deitado(c, T, 'ademar', 1600, 720, 0.85, { cabeca: 1, luz: LUZ_HOSP, expr: 'sorriso' }); } });
  const LISTA = PALCO((c, T) => corredor302(c, T, { hora: '10:20' }), { valdir: { x: 760, dir: 1 }, nena: { x: 1100, dir: -1, expr: 'sorriso' } });
  return [
    [q.a, tom(1.0, 960, 560, (c, T) => desenhaPalco(c, T, CORR))],
    ...cobertura(q, 1, 4, CORR, { abre: false }),
    [q.L(5) - 1.0, tom(1.0, 960, 560, (c, T) => desenhaPalco(c, T, ENF))],
    [q.L(6), tomadaPalco(ENF, 'close', 'caio')],
    [q.L(7), tom(2.3, 470, 640, (c, T) => desenhaPalco(c, T, ENF), 0.02)],
    [q.F(7) + 0.1, tom(1.8, 900, 470, (c, T) => desenhaPalco(c, T, { ...ENF, atores: { ...ENF.atores, duda: { x: 960, dir: -1, expr: 'riso' } } }))],
    [q.L(8), tom(2.3, 1560, 640, (c, T) => desenhaPalco(c, T, ENF), 0.02)],
    [q.L(9), tom(2.3, 470, 640, (c, T) => desenhaPalco(c, T, ENF), 0.02)],
    [q.L(10), tom(2.3, 1560, 640, (c, T) => desenhaPalco(c, T, ENF), 0.02)],
    [q.L(11), tom(1.6, 1020, 360, (c, T, t0) => { enfermaria(c, T, { chuva: T - t0 > 1.2 ? 1 : 0 }); if (Math.abs(T - t0 - 1.0) < 0.12) { c.fillStyle = 'rgba(230,235,255,0.5)'; c.fillRect(-800, -400, W + 1600, 1800); } }, 0.02)],
    [q.F(11) + 0.1, tom(1.0, 960, 540, (c, T, t0) => { ruaSuburbio(c, T, { hora: 'nublado' }); chuvaFx(c, T, 1.4 * sstep(0, 1.2, T - t0));
      ator(c, T, 'duda', { x: 700, y: yChao(CH, 'duda'), dir: 1, andar: T * 1.6, intens: 1.2, expr: 'riso', luz: LUZ_CHUVA }); desenharPessoa(c, { x: 1000, y: yChao(CH, 'crianca1', 1) + 30, s: 1, dir: -1, ...caminhada(T * 1.7), expr: 'riso', luz: LUZ_CHUVA }, 'crianca1'); desenharPessoa(c, { x: 1200, y: yChao(CH, 'crianca2', 1) + 30, s: 1, dir: 1, ...caminhada(T * 1.5 + 0.4), expr: 'riso', luz: LUZ_CHUVA }, 'crianca2'); }, 0.01)],
    [q.L(12) - 0.2, tom(1.4, 600, 560, (c, T) => { ruaSuburbio(c, T, { hora: 'nublado', desloc: 600 }); chuvaFx(c, T, 1.4); isopor(c, 740, 950, 1, { aberto: 1 }); ator(c, T, 'tiao', { x: 560, y: yChao(CH, 'tiao'), dir: 1, bracoF: [2.2, 0.35], bracoT: [-2.2, 0.35], expr: 'riso', luz: LUZ_CHUVA }); })],
    [q.F(12) + 0.1, tom(1.6, 960, 800, (c, T) => { ruaSuburbio(c, T, { hora: 'nublado' }); chuvaFx(c, T, 1.4); c.fillStyle = 'rgba(120,140,160,0.5)'; c.beginPath(); c.ellipse(960, 960, 300, 40, 0, 0, 7); c.fill(); desenharCachorro(c, T, { x: 960, y: 950, s: 1.1, dir: Math.sin(T * 3) > 0 ? 1 : -1, pose: 'deitada', abana: 2, ofega: 0.3 }); ator(c, T, 'duda', { x: 640, y: yChao(CH, 'duda'), dir: 1, expr: 'riso', bracoF: [1.4, 0.3], luz: LUZ_CHUVA }); })],
    [q.F(12) + 1.7, tom(1.2, 960, 560, (c, T) => { enfermaria(c, T, { entardecer: 1 }); radio(c, 960, 860, 1.0, 1, T); notasRadio(c, T, 930, 760); deitado(c, T, 'ademar', 1600, 720, 0.85, { cabeca: 1, olhosFechados: 1, luz: LUZ_HOSP }); deitado(c, T, 'nena', 440, 720, 0.85, { cabeca: -1, luz: LUZ_HOSP, expr: 'sorriso', bracoF: [1.6, 0.2] }); }, 0.015)],
    [q.F(12) + 5.7, tom(1.0, 960, 540, (c, T, t0) => cidadeNoite(c, T, { acender: sstep(0.2, 2.2, T - t0) }), 0.02)],
    [q.L(13) - 1.2, tom(1.0, 960, 540, (c, T, t0) => listaParede(c, T, sstep(0, 1.2, T - t0)), 0.02)],
    [q.L(13) + 0.6, tom(1.0, 960, 560, (c, T) => desenhaPalco(c, T, LISTA))],
    [q.L(14), tomadaPalco(LISTA, 'close', 'nena')],
    [q.F(14) + 0.2, tom(1.1, 900, 600, (c, T, t0) => { const t = T - t0; ruaSuburbio(c, T, { desloc: 900 }); c.fillStyle = 'rgba(30,20,10,0.18)'; c.fillRect(-800, -400, W + 1600, 1800); moto(c, 800, 990, 1.0, 1);
      ator(c, T, 'caio', { x: 1080, y: yChao(CH, 'caio'), dir: -1, objeto: garrafaMao(Math.max(0, 1 - t / 1.8)), bracoF: t < 1.9 ? [2.3, 1.3] : [3.0, 0.1], expr: t < 1.9 ? '' : 'sorriso', luz: LUZ_SOL }); }, 0.01)],
  ]; };

DIR[10] = q => [
  [q.a, tom(1.0, 960, 540, (c, T) => rioEntardecer(c, T), 0.02)],
  [q.L(2), tom(1.0, 960, 540, (c, T) => listaParede(c, T, 1), 0.02)],
  [q.L(3), tom(1.0, 960, 560, (c, T, t0) => { pontoOnibus(c, T); ator(c, T, 'nena', { x: 1000, y: 790, dir: -1, sentadoBanco: 1, objeto: leque('#c0392b', T), luz: LUZ_SEPIA }); c.fillStyle = 'rgba(110,70,20,0.22)'; c.fillRect(-800, -400, W + 1600, 1800); }, 0.015)],
  [q.L(4), (c, T, t0) => { c.save(); camera(c, 1.0, 960, 560); pontoOnibus(c, T); ator(c, T, 'nena', { x: 1000, y: 790, dir: -1, sentadoBanco: 1, objeto: leque('#c0392b', T), luz: LUZ_SEPIA }); c.restore(); c.fillStyle = 'rgba(5,5,6,0.55)'; c.fillRect(0, 0, W, H);
    const a = sstep(0.2, 0.8, T - t0); c.globalAlpha = a; c.textAlign = 'center'; c.fillStyle = '#f2efe9'; c.font = '700 120px Oswald'; c.fillText('CERTA', 620, 520); c.fillText('ERRADA', 1300, 520); c.fillStyle = '#c62a24'; c.font = '700 80px Oswald'; c.fillText('OU', 960, 520); c.textAlign = 'left'; c.globalAlpha = 1; }],
];

// ---------- cartelas ----------
function cartelaDiaHora(B) {
  return (c, t, dur) => {
    c.fillStyle = '#0a0605'; c.fillRect(0, 0, W, H);
    const k = { '39°C': 0.35, '44°C': 0.6, '38°C': 0.45, '33°C': 0.3, '50°C': 1, '47°C': 0.85, '41°C': 0.7, '37°C': 0.4 }[B.temp] || 0.5;
    c.fillStyle = rgrad(c, W / 2, 620, 0, 1000, [[0, `rgba(${170 + 60 * k},${60 - 30 * k},20,${0.42 * sstep(0, 1, t)})`], [1, 'rgba(0,0,0,0)']]); c.fillRect(0, 0, W, H);
    c.textAlign = 'center'; c.textBaseline = 'middle'; const a = sstep(0.1, 0.6, t) * (1 - sstep(dur - 0.4, dur, t));
    c.globalAlpha = a; c.fillStyle = 'rgba(242,239,233,0.75)'; c.font = '400 40px Oswald'; c.fillText(`${B.dia}  ·  ${B.hora}`, W / 2, 330);
    c.fillStyle = '#f2efe9'; c.font = '700 210px Oswald'; c.fillText(B.temp, W / 2, 500);
    c.fillStyle = '#c62a24'; c.fillRect(W / 2 - 170 * sstep(0.3, 1.0, t), 625, 340 * sstep(0.3, 1.0, t), 8);
    c.fillStyle = 'rgba(242,239,233,0.9)'; c.font = '400 54px Oswald'; c.fillText(B.titulo, W / 2, 700);
    const d = parseInt(B.dia.replace(/\D/g, '')) || 1; // progresso dos 5 dias
    for (let i = 1; i <= 5; i++) { c.fillStyle = i < d ? '#c62a24' : (i === d ? `rgba(198,42,36,${0.5 + 0.5 * Math.sin(t * 5)})` : 'rgba(242,239,233,0.18)'); c.fillRect(W / 2 - 330 + (i - 1) * 134, 820, 120, 8); }
    c.fillStyle = 'rgba(242,239,233,0.55)'; c.font = '400 24px Inter'; c.fillText('5 DIAS', W / 2, 860);
    c.globalAlpha = 1; c.textAlign = 'left'; c.textBaseline = 'alphabetic';
  };
}
function cartelaTitulo(c, t, dur) {
  c.fillStyle = '#060404'; c.fillRect(0, 0, W, H);
  c.save(); camera(c, 1.05 - t * 0.01, 960, 560); c.globalAlpha = 0.5; ruaSuburbio(c, t + 100, { semLuz: 1, arCond: 0 }); termometroRua(c, 700, 560, '50°C', t); c.restore(); nevoaCalor(c, 0.9);
  c.fillStyle = 'rgba(6,4,4,0.5)'; c.fillRect(0, 0, W, H);
  c.textAlign = 'center'; c.textBaseline = 'middle'; const a = sstep(0.15, 0.8, t) * (1 - sstep(dur - 0.4, dur, t));
  c.globalAlpha = a; c.fillStyle = '#f2efe9'; c.font = '700 190px Oswald'; c.fillText('50°C NO RIO', W / 2, 480);
  c.fillStyle = '#c62a24'; c.fillRect(W / 2 - 280, 600, 560, 9);
  c.fillStyle = 'rgba(242,239,233,0.9)'; c.font = '400 46px Oswald'; c.fillText('5 DIAS PARA SOBREVIVER', W / 2, 670);
  c.fillStyle = 'rgba(242,239,233,0.7)'; c.font = '400 34px Oswald'; c.fillText('E SE ACONTECER?  ·  SIMULAÇÃO', W / 2, 760);
  c.globalAlpha = 1; c.textAlign = 'left'; c.textBaseline = 'alphabetic';
}
function cartelaFim(c, t, dur) {
  c.fillStyle = '#060404'; c.fillRect(0, 0, W, H);
  c.fillStyle = rgrad(c, W / 2, 560, 0, 900, [[0, 'rgba(142,27,27,0.32)'], [1, 'rgba(0,0,0,0)']]); c.fillRect(0, 0, W, H);
  c.textAlign = 'center'; c.textBaseline = 'middle';
  c.globalAlpha = sstep(0.2, 0.9, t); c.fillStyle = '#f2efe9'; c.font = '700 120px Oswald'; c.fillText('VOCÊ SABERIA O QUE FAZER?', W / 2, 400);
  c.globalAlpha = sstep(1.2, 1.8, t); c.fillStyle = '#c62a24'; c.fillRect(W / 2 - 200, 490, 400, 8);
  c.fillStyle = 'rgba(242,239,233,0.9)'; c.font = '700 64px Oswald'; c.fillText('E SE ACONTECER?', W / 2, 580);
  c.globalAlpha = sstep(2.2, 2.8, t); c.font = '400 32px Inter'; c.fillStyle = 'rgba(242,239,233,0.8)'; c.fillText('Simulação fictícia. Em uma emergência real: 192 (SAMU) · 193 (Bombeiros)', W / 2, 690);
  c.globalAlpha = sstep(3.2, 3.8, t) * (1 - sstep(dur - 0.8, dur, t)); c.font = '700 42px Oswald'; c.fillStyle = '#f2efe9'; c.fillText('CONTE NOS COMENTÁRIOS: A VÓ NENA ESTAVA CERTA OU ERRADA?', W / 2, 840);
  c.globalAlpha = 1; c.textAlign = 'left'; c.textBaseline = 'alphabetic';
}

// ---------- preparação ----------
window.prepararVideo = L => {
  BLOCOS = L.blocos; FALAS = L.falas;
  window.RAIOS = [];
  window.CENAS = [];
  for (const B of BLOCOS) {
    if (B.tipo === 'cartela') { window.CENAS.push({ a: B.a, b: B.b, fn: cartelaDiaHora(B), trans: 0.5 }); continue; }
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
  const fimV = BLOCOS.find(b => b.tipo === 'fim').a;
  window.POS = (ctx, T) => {
    filme(ctx, T, { vinheta: 0.45, grao: 0.045 });
    if (T > 0.3 && T < fimV) seloSimulacao(ctx, sstep(0.3, 0.9, T) * (1 - sstep(fimV - 0.5, fimV, T)));
    // texto fixo da abertura: dia, hora e temperatura dentro de casa
    const a0 = BLOCOS.find(b => b.tipo === 'cap' && b.cap === 0);
    if (T < a0.a + 6) { const a = sstep(0, 0.3, T) * (1 - sstep(a0.a + 5, a0.a + 6, T)); ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = 'rgba(10,10,12,0.7)'; rr(ctx, 70, 70, 760, 76, 10); ctx.fill(); ctx.fillStyle = '#f2efe9'; ctx.font = '700 44px Oswald'; ctx.fillText('DIA 4  ·  02:40  ·  41°C DENTRO DE CASA', 96, 124); ctx.restore(); }
  };
  prepararLegendas(FALAS.map(f => ({ texto: f.texto, inicio: f.inicio, fim: f.fim })), 0);
};
