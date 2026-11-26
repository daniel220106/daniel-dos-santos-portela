// Gera as opções de foto de perfil do canal: node gerar_perfis.js
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
(async () => {
  const out = path.resolve(__dirname, '../assets/identidade/perfis'); fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch({ args: ['--allow-file-access-from-files'] }); const p = await b.newPage();
  p.on('pageerror', e => { console.error(e); process.exit(1); });
  await p.goto('file://' + path.resolve(__dirname, '../projeto/identidade/perfis.html'));
  const ids = await p.evaluate(() => window.gerar());
  for (const [i, id] of ids.entries()) {
    const d = await p.evaluate(x => document.getElementById(x).toDataURL('image/png'), id);
    fs.writeFileSync(`${out}/perfil_${'ABCD'[i]}_${id}.png`, Buffer.from(d.split(',')[1], 'base64')); console.log('OK', id);
  }
  await b.close();
})();
