#!/usr/bin/env python3
"""Divide o roteiro de narração em capítulos (linhas '## CAP n ...') e gera um WAV + JSON por capítulo.
Retoma de onde parou (pula capítulos já gerados). Uso: python narrar_video.py ../roteiro/video01_narracao.txt video01"""
import json, os, re, subprocess, sys
roteiro, ep = sys.argv[1], sys.argv[2]
cfg = json.load(open('../projeto/config_canal.json')); vp = cfg['voz_parametros']
txt = open(roteiro, encoding='utf-8').read()
caps = re.split(r'^## CAP (\d+)[^\n]*\n', txt, flags=re.M)[1:]
os.makedirs('../audio/narracao/' + ep, exist_ok=True)
for num, corpo in zip(caps[::2], caps[1::2]):
    base = f'../audio/narracao/{ep}/cap{int(num):02d}'
    if os.path.exists(base + '.wav') and os.path.exists(base + '.json'): continue
    open(base + '.txt', 'w', encoding='utf-8').write(corpo.strip() + '\n')
    subprocess.run([sys.executable, 'narrar.py', base + '.txt', base + '.wav', '--voz', '../' + cfg['voz_narrador'],
                    '--exaggeration', str(vp['exaggeration']), '--cfg', str(vp['cfg']), '--temp', str(vp['temp']), '--seed', str(vp['seed'])], check=True)
    r = subprocess.run([sys.executable, 'verificar_voz.py', base + '.wav', base + '.txt'], capture_output=True, text=True)
    open(base + '_verificacao.txt', 'w').write(r.stdout); print(f'CAP {num}:', [l for l in r.stdout.splitlines() if 'PRECISAO' in l], flush=True)
print('NARRACAO COMPLETA')
