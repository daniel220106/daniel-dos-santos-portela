// ÚLTIMO DIA — montagem do episódio a partir da linha do tempo gerada por scripts/montar_linha_tempo.py
'use strict';
window.EPISODIO = true;
const ROTEIRO = {};   // ROTEIRO[cap] = [cena do parágrafo 0, ..., cena do parágrafo 4]
const CAPITULOS = {}; // CAPITULOS[cap] = {dia, titulo}

// Sequência de tomadas dentro de uma cena. Início de cada tomada: número (s), 'f3' (início da frase 3)
// ou 'f3+1.5'. Cada tomada recebe (c, t, duracao, info) e entra com fusão curta.
function seq(...tomadas) {
  return (c, t, dur, T, info) => {
    const st = tomadas.map(([x]) => {
      if (typeof x === 'number') return x;
      const m = /^f(\d+)([+-][\d.]+)?$/.exec(x); const base = info.f && info.f[+m[1]] !== undefined ? info.f[+m[1]] : dur;
      return Math.min(base + (m[2] ? parseFloat(m[2]) : 0), dur);
    });
    let i = st.length - 1; while (i > 0 && t < st[i]) i--;
    const fimDe = k => (k + 1 < st.length ? st[k + 1] : dur) - st[k];
    const F = 0.3;
    if (i > 0 && t - st[i] < F && tomadas[i][2] !== 'corte') {
      tomadas[i - 1][1](c, t - st[i - 1], fimDe(i - 1), info);
      const b = buf('tomada'), k = b.getContext('2d'); k.setTransform(1, 0, 0, 1, 0, 0); k.clearRect(0, 0, W, H);
      k.save(); tomadas[i][1](k, t - st[i], fimDe(i), info); k.restore();
      c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = sstep(0, F, t - st[i]); c.drawImage(b, 0, 0); c.restore();
    } else { c.save(); tomadas[i][1](c, t - st[i], fimDe(i), info); c.restore(); }
  };
}
// tomada a partir de uma cena da abertura (reaproveita animação já aprovada)
const AB = i => (c, t, d) => window.CENAS_ABERTURA[i].fn(c, t, d, 0, {});

function cartelaCapitulo(cap) {
  return (c, t, dur) => {
    const C = CAPITULOS[cap];
    c.fillStyle = '#050506'; c.fillRect(0, 0, W, H);
    c.fillStyle = rgrad(c, W / 2, 560, 0, 900, [[0, `rgba(142,27,27,${0.32 * sstep(0, 1, t)})`], [1, 'rgba(0,0,0,0)']]); c.fillRect(0, 0, W, H);
    particulas(c, t + cap * 10, 35, 17 + cap, { area: [0, 200, W, 900], cor: 'rgba(255,140,60,0.8)', tam: [1, 2.2], vel: [-8, 8, -40, -15], brilho: 0.45 });
    c.save(); c.textAlign = 'center'; c.textBaseline = 'middle';
    const a = sstep(0.1, 0.6, t) * (1 - sstep(dur - 0.45, dur, t));
    c.globalAlpha = a; c.font = '400 34px Oswald'; c.fillStyle = 'rgba(242,239,233,0.6)'; c.fillText(`CAPÍTULO ${cap}`, W / 2, 330);
    c.save(); c.translate(W / 2, 470); const z = 1.08 - 0.08 * easeOut(t / 2); c.scale(z, z); c.font = '700 200px Oswald'; c.fillStyle = PAL.texto; c.fillText(C.dia, 0, 0); c.restore();
    const bw = 380 * sstep(0.4, 1.0, t); c.fillStyle = PAL.vermelhoVivo; c.fillRect(W / 2 - bw / 2, 590, bw, 7);
    c.globalAlpha = a * sstep(0.6, 1.1, t); c.font = '400 58px Oswald'; c.fillStyle = 'rgba(242,239,233,0.92)'; c.fillText(C.titulo, W / 2, 670);
    // barra de progresso dos 30 dias
    const n = parseInt(C.dia.replace(/\D/g, '')) || 0; c.globalAlpha = a * 0.8;
    for (let d = 1; d <= 30; d++) { c.fillStyle = d <= n ? PAL.vermelhoVivo : 'rgba(242,239,233,0.15)'; c.fillRect(W / 2 - 450 + (d - 1) * 30, 800, 24, 6); }
    c.restore();
  };
}

window.prepararEpisodio = L => {
  const cenas = [];
  for (const b of L.blocos) {
    let fn;
    if (b.tipo === 'logo') fn = (c, t, d) => window.CENAS_ABERTURA[0].fn(c, t * 3.0 / d, d);
    else if (b.tipo === 'cartela') fn = cartelaCapitulo(b.cap);
    else if (b.tipo === 'fim') fn = cenaFinal;
    else fn = (ROTEIRO[b.cap] || [])[b.par] || ((c) => { c.fillStyle = '#300'; c.fillRect(0, 0, W, H); });
    const info = { f: (b.frases || []).map(f => f.inicio - b.a), cap: b.cap, dia: CAPITULOS[b.cap] ? parseInt(CAPITULOS[b.cap].dia.replace(/\D/g, '')) || 1 : 1 };
    cenas.push({ a: b.a, b: b.b, fn, info, trans: b.trans, preto: b.preto, saiPreto: b.saiPreto });
  }
  window.CENAS = cenas; window.DURACAO = L.duracao;
  prepararLegendas(L.frases, 0);
  window.POS = (ctx, T) => {
    filme(ctx, T, { vinheta: 0.6, grao: 0.07 });
    const s = L.selo; if (T > s[0] && T < s[1]) seloSimulacao(ctx, sstep(s[0], s[0] + 0.6, T) * (1 - sstep(s[1] - 0.6, s[1], T)));
  };
};

function cenaFinal(c, t, dur) {
  c.fillStyle = '#050506'; c.fillRect(0, 0, W, H);
  c.fillStyle = rgrad(c, W / 2, 900, 0, 900, [[0, 'rgba(232,121,43,0.35)'], [1, 'rgba(0,0,0,0)']]); c.fillRect(0, 0, W, H);
  skyline(c, 11, 1080, 300, '#0d0606', { janelas: 0.2, apagar: 1 - sstep(0.5, 3, t), corJanela: '#f0a45a' });
  c.save(); c.textAlign = 'center'; c.textBaseline = 'middle'; c.globalAlpha = sstep(0.2, 0.9, t) * (1 - sstep(dur - 0.8, dur, t));
  c.font = '700 150px Oswald'; c.fillStyle = PAL.texto; c.fillText('ÚLTIMO DIA', W / 2, 380);
  c.fillStyle = PAL.vermelhoVivo; c.fillRect(W / 2 - 280, 470, 560, 7);
  c.font = '400 40px Oswald'; c.fillStyle = 'rgba(242,239,233,0.85)'; c.fillText('PRÓXIMO EPISÓDIO', W / 2, 570);
  c.font = '700 64px Oswald'; c.fillStyle = PAL.texto; c.fillText('E SE A INTERNET DESAPARECESSE PARA SEMPRE?', W / 2, 650);
  c.font = '400 32px Inter'; c.fillStyle = 'rgba(242,239,233,0.7)'; c.fillText('Inscreva-se e ative as notificações  ·  Novos episódios toda semana', W / 2, 760);
  c.restore();
}
