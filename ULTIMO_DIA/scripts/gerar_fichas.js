// Gera as fichas visuais dos personagens: node gerar_fichas.js ep02
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
(async () => {
  const ep = process.argv[2] || 'ep02';
  const out = path.resolve(__dirname, `../${ep.toUpperCase()}/PERSONAGENS`); fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  p.on('pageerror', e => { console.error(e); process.exit(1); });
  await p.goto('file://' + path.resolve(__dirname, `../projeto/${ep}/fichas.html`));
  for (const id of ['lucas', 'rafael', 'marina', 'cida', 'pedro']) {
    await p.evaluate(i => window.gerar(i), id);
    await p.locator('#tela').screenshot({ path: `${out}/ficha_${id}.png` }); console.log('OK', id);
  }
  await b.close();
})();
