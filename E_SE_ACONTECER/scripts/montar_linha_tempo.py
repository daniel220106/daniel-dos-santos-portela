#!/usr/bin/env python3
"""Monta a linha do tempo do vídeo (cenas, cartelas, legendas e posição da narração de cada capítulo).
Uso: python montar_linha_tempo.py video01 [--estimar]   (--estimar: usa tempos estimados se faltar narração)"""
import json, os, re, sys
ep = sys.argv[1]; estimar = '--estimar' in sys.argv
pasta = f'../audio/narracao/{ep}'
roteiro = open(f'../roteiro/{ep}_narracao.txt', encoding='utf-8').read()
caps = re.split(r'^## CAP (\d+)[^\n]*\n', roteiro, flags=re.M)[1:]
sys.path.insert(0, '.')
from narrar import limpar, frases as dividir

def carregar(num, corpo):
    arq = f'{pasta}/cap{num:02d}.json'
    if os.path.exists(arq) and os.path.exists(arq.replace('.json', '.wav')):
        fr = json.load(open(arq, encoding='utf-8'))
        dur = float(os.popen(f'ffprobe -v error -show_entries format=duration -of csv=p=0 {arq[:-5]}.wav').read())
        return fr, dur, True
    if not estimar: sys.exit(f'falta narração do capítulo {num}')
    fr, t = [], 0.0
    for pi, par in enumerate([limpar(p) for p in re.split(r'\n\s*\n', corpo) if p.strip()]):
        fs = dividir(par)
        for fi, f in enumerate(fs):
            d = len(f) / 14.5; fr.append({'texto': f, 'inicio': round(t, 3), 'fim': round(t + d, 3), 'paragrafo': pi}); t += d + (0.95 if fi == len(fs) - 1 else 0.42)
    return fr, t, False

blocos, frases, audios = [], [], []
T = 0.0
CARTELA, LOGO, FIM = 3.2, 3.6, 8.0
for num, corpo in zip(caps[::2], caps[1::2]):
    num = int(num)
    if num > 0:
        blocos.append({'tipo': 'cartela', 'cap': num, 'a': T, 'b': T + CARTELA, 'trans': 0.5}); T += CARTELA
    fr, dur, real = carregar(num, corpo)
    audios.append({'cap': num, 'inicio': round(T, 3), 'dur': dur, 'real': real})
    npar = max(f['paragrafo'] for f in fr) + 1
    ini = [T + min(f['inicio'] for f in fr if f['paragrafo'] == p) for p in range(npar)]; ini[0] = T
    for p in range(npar):
        b = ini[p + 1] if p + 1 < npar else T + dur
        fs = [{**f, 'inicio': round(T + f['inicio'], 3), 'fim': round(T + f['fim'], 3)} for f in fr if f['paragrafo'] == p]
        blocos.append({'tipo': 'par', 'cap': num, 'par': p, 'a': round(ini[p], 3), 'b': round(b, 3), 'frases': fs, 'trans': 0.5 if p == 0 else 0.4})
        frases += fs
    T += dur
    if num == 0:
        blocos.append({'tipo': 'logo', 'cap': 0, 'a': T, 'b': T + LOGO, 'trans': 0.3}); T += LOGO
blocos.append({'tipo': 'fim', 'cap': 99, 'a': T, 'b': T + FIM, 'trans': 0.6, 'saiPreto': 1.0}); T += FIM
linha = {'video': ep, 'duracao': round(T, 3), 'blocos': blocos, 'frases': frases, 'audios': audios,
         'selo': [audios[0]['inicio'] + 0.5, T - FIM]}
json.dump(linha, open(f'../projeto/{ep}/linha_tempo.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(f'duração total: {T/60:.1f} min ({T:.1f}s); capítulos reais: {sum(a["real"] for a in audios)}/{len(audios)}')
