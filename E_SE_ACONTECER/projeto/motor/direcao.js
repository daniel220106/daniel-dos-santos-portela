// Utilidades de direção compartilhadas (tiradas do Vídeo 2): Q, tom, fixo, palcos e cobertura automática de diálogo.
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
  palco.fundo(c, T); if (palco.antes) palco.antes(c, T);
  const nomes = Object.keys(palco.atores).sort((a, b) => (palco.atores[a].z || 0) - (palco.atores[b].z || 0));
  for (const n of nomes) { const o = palco.atores[n]; if (o.mostrar && !o.mostrar(T)) continue; const oo = typeof o.din === 'function' ? { ...o, ...o.din(T) } : o; ator(c, T, n, { luz: palco.luz, ...oo, y: oo.y ?? yChao(palco.chao, n, oo.s ?? 1) }); }
  if (palco.depois) palco.depois(c, T);
}
function cabecaDe(palco, n) { const o = palco.atores[n], s = o.s ?? 1, alt = (VISUAIS[VIS_DE[n] || n] || {}).altura || 1; return [o.x + 30 * (o.dir ?? 1) * s, (o.y ?? yChao(palco.chao, n, s)) - 262 * alt * s]; }
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
