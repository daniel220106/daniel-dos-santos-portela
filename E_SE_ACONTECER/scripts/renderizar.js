// Renderiza uma página de animação (window.render(t)) em vídeo ou quadros de teste.
// node renderizar.js pagina.html narracao.json saida.mp4 [--fps 30] [--workers 4] [--quadros 5,12.3,...]
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const args = process.argv.slice(2);
const opt = (n, d) => { const i = args.indexOf('--' + n); return i >= 0 ? args[i + 1] : d; };
const [pagina, dadosArq, saida] = args;
const FPS = +opt('fps', 30), WORKERS = +opt('workers', 4);
const dados = JSON.parse(fs.readFileSync(dadosArq, 'utf8'));

async function abrir(browser) {
  const p = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  p.on('pageerror', e => console.error('ERRO NA PÁGINA:', e.message));
  await p.goto('file://' + path.resolve(pagina));
  await p.evaluate(async d => { await document.fonts.ready; await Promise.all([...document.fonts].map(f => f.load())); window.prepararVideo(d); window.SEM_LEGENDA = d.semLegenda; }, { ...dados, semLegenda: args.includes('--sem-legenda') });
  return p;
}
async function quadro(p, t, arq) {
  await p.evaluate(t => window.render(t), t);
  await p.locator('#tela').screenshot({ path: arq, type: 'jpeg', quality: 93 });
}
(async () => {
  const browser = await chromium.launch({ args: ['--disable-gpu-vsync'] });
  const q = opt('quadros');
  if (q) {
    const p = await abrir(browser); fs.mkdirSync(saida, { recursive: true });
    for (const t of q.split(',').map(Number)) await quadro(p, t, path.join(saida, `q_${t.toFixed(2)}.jpg`));
    await browser.close(); return;
  }
  const p0 = await abrir(browser); const dur = await p0.evaluate(() => window.DURACAO); await p0.close();
  const N = Math.round(dur * FPS), tmp = saida + '_quadros'; fs.mkdirSync(tmp, { recursive: true });
  let feitos = 0; const t0 = Date.now();
  await Promise.all([...Array(WORKERS).keys()].map(async w => {
    const p = await abrir(browser);
    for (let i = w; i < N; i += WORKERS) {
      const arq = path.join(tmp, `f${String(i).padStart(6, '0')}.jpg`);
      if (!fs.existsSync(arq)) await quadro(p, i / FPS, arq);
      if (++feitos % 150 === 0) console.log(`${feitos}/${N} quadros (${((Date.now() - t0) / 1000).toFixed(0)}s)`);
    }
  }));
  await browser.close();
  const r = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(tmp, 'f%06d.jpg'),
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', saida], { stdio: 'inherit' });
  if (r.status === 0) { fs.rmSync(tmp, { recursive: true }); console.log('OK', saida); } else process.exit(1);
})();
