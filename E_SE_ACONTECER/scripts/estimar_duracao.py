#!/usr/bin/env python3
"""Estima a duração de um roteiro (pasta com capNN_*.txt no formato do dialogo.py) antes de gerar as vozes.
Calibra a velocidade de fala com os tempos reais de um vídeo já produzido.
Uso: python3 estimar_duracao.py ../VIDEO_03/ROTEIRO [--calibrar ../VIDEO_02/AUDIO]"""
import glob, json, os, re, sys

pasta = sys.argv[1]
calib = sys.argv[sys.argv.index('--calibrar') + 1] if '--calibrar' in sys.argv else os.path.join(os.path.dirname(__file__), '../VIDEO_02/AUDIO')
GAP = {'normal': 0.18, 'rapido': 0.06, 'narracao': 0.45, 'interrompe': -0.28}  # mesmos intervalos do dialogo.py
CARTELA, ENTRADA, SAIDA, TITULO, FIM = 3.0, 1.4, 1.1, 4.4, 8.0          # mesmos blocos da linha do tempo do Vídeo 2

def ler(arq):
    itens = []
    for ln in open(arq, encoding='utf-8'):
        ln = ln.strip()
        if not ln or ln.startswith('#'): continue
        m = re.match(r'^\[pausa\s+([\d.]+)\]$', ln, re.I)
        if m: itens.append({'pausa': float(m.group(1))}); continue
        if ln.startswith('['): continue
        m = re.match(r'^([A-ZÀ-Ú ]+?)\s*(?:\[([a-z]+)\])?\s*(?:,[^:]*)?:\s*(.+)$', ln)
        if m: itens.append({'p': m.group(1).strip().lower(), 'modo': m.group(2), 't': m.group(3)})
    return itens

nc = ns = pc = ps = 0
for j in glob.glob(f'{calib}/cap*_*.json'):
    if j.endswith('_verificacao.json'): continue
    for f in json.load(open(j, encoding='utf-8')):
        d, c = f['fim'] - f['inicio'], len(f['texto'])
        if f['personagem'] == 'narrador': nc += c; ns += d
        else: pc += c; ps += d
vn, vp = nc / ns, pc / ps
print(f'velocidade calibrada: narrador {vn:.1f} car/s, personagens {vp:.1f} car/s')

t_total, n_total, marcas = 1.0, 0, []
for a in sorted(glob.glob(f'{pasta}/cap[0-9][0-9]_*.txt')):
    cap = int(os.path.basename(a)[3:5]); itens = ler(a); t = 0.0; n = 0
    if cap >= 1: t_total += CARTELA + ENTRADA
    inicio = t_total
    for k, x in enumerate(itens):
        if 'pausa' in x: t += x['pausa']; continue
        n += 1; narr = x['p'] == 'narrador'
        modo = x['modo'] if x['modo'] in GAP else ('narracao' if narr or (k and itens[k - 1].get('p') == 'narrador') else 'normal')
        if k: t += GAP[modo]
        t += len(x['t']) / (vn if narr else vp)
    t_total += t + SAIDA; n_total += n
    if cap == 0: t_total += TITULO
    marcas.append((os.path.basename(a), n, inicio, t))
    print(f'{os.path.basename(a):28} {n:3d} falas   começa {int(inicio // 60)}:{int(inicio % 60):02d}   fala {t:5.1f}s')
t_total += FIM
print(f'TOTAL estimado: {int(t_total // 60)}:{int(t_total % 60):02d} ({n_total} falas)')
