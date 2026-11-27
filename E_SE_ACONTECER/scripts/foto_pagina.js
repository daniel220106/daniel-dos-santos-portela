// Tira uma "foto" do canvas de uma página de teste: node foto_pagina.js pagina.html saida.png [argumento]
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
(async () => {
  const [pag, saida, arg] = process.argv.slice(2);
  const b = await chromium.launch({ args: ['--allow-file-access-from-files'] }); const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  const erros = []; p.on('pageerror', e => erros.push(String(e))); p.on('console', m => { if (m.type() === 'error') erros.push(m.text()); });
  await p.goto('file://' + path.resolve(pag));
  try { await p.evaluate(a => window.desenhar(isNaN(+a) ? a : +a), arg ?? '0'); } catch (e) { erros.push(String(e)); }
  const d = await p.evaluate(() => document.getElementById('tela').toDataURL('image/jpeg', 0.85));
  fs.writeFileSync(saida, Buffer.from(d.split(',')[1], 'base64')); if (erros.length) console.log('ERROS:\n' + erros.join('\n')); else console.log('ok', saida);
  await b.close();
})();
