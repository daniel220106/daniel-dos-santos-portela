// Gera capa e foto de perfil do canal a partir de projeto/identidade/identidade.html
// Uso: node gerar_identidade.js ["NOME DO CANAL"]
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
(async () => {
  const nome = process.argv[2] || 'ÚLTIMO DIA';
  const out = path.resolve(__dirname, '../assets/identidade');
  const b = await chromium.launch({ args: ['--allow-file-access-from-files'] }); const p = await b.newPage();
  p.on('pageerror', e => { console.error(e); process.exit(1); });
  await p.goto('file://' + path.resolve(__dirname, '../projeto/identidade/identidade.html') + '?nome=' + encodeURIComponent(nome));
  await p.evaluate(() => window.gerar());
  for (const id of ['capa', 'perfil']) {
    const d = await p.evaluate(i => document.getElementById(i).toDataURL('image/png'), id);
    fs.writeFileSync(`${out}/${id}.png`, Buffer.from(d.split(',')[1], 'base64')); console.log('OK', `${out}/${id}.png`);
  }
  await b.close();
})();
