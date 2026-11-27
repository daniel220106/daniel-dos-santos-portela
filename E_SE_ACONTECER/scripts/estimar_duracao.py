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

mmss = lambda s: f'{int(s // 60)}:{int(s % 60):02d}'
t_total, n_total = 1.0, 0
soma = {'falas': 0.0, 'intervalos': 0.0, 'pausas e cenas': 0.0, 'cartelas, título, entradas e saídas': 1.0}
print(f"{'trecho':28} {'falas':>5} {'começa':>7} {'voz':>7} {'interv.':>7} {'pausas':>7} {'bloco':>7}")
for a in sorted(glob.glob(f'{pasta}/cap[0-9][0-9]_*.txt')):
    cap = int(os.path.basename(a)[3:5]); itens = ler(a); voz = gaps = pausas = 0.0; n = 0
    extra = (CARTELA + ENTRADA) if cap >= 1 else 0.0
    t_total += extra; inicio = t_total
    for k, x in enumerate(itens):
        if 'pausa' in x: pausas += x['pausa']; continue
        n += 1; narr = x['p'] == 'narrador'
        modo = x['modo'] if x['modo'] in GAP else ('narracao' if narr or (k and itens[k - 1].get('p') == 'narrador') else 'normal')
        if k: gaps += GAP[modo]
        voz += len(x['t']) / (vn if narr else vp)
    extra2 = SAIDA + (TITULO if cap == 0 else 0.0)
    t_total += voz + gaps + pausas + extra2; n_total += n
    soma['falas'] += voz; soma['intervalos'] += gaps; soma['pausas e cenas'] += pausas
    soma['cartelas, título, entradas e saídas'] += extra + extra2
    print(f'{os.path.basename(a):28} {n:5d} {mmss(inicio):>7} {voz:6.1f}s {gaps:6.1f}s {pausas:6.1f}s {voz + gaps + pausas:6.1f}s')
t_total += FIM; soma['cartelas, título, entradas e saídas'] += FIM
print('\ncomposição:')
for k, v in soma.items(): print(f'  {k:38} {v:7.1f}s  ({v / t_total:5.1%})')
print(f'TOTAL estimado: {mmss(t_total)} ({t_total:.1f}s, {n_total} falas)')
