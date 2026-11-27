#!/usr/bin/env python3
"""Vídeo 3 — linha do tempo: abertura, título, 9 capítulos (cartela + cena) e encerramento (sem cartela) + cartela final.
Uso:  python3 video03_linha_tempo.py              (lê VIDEO_03/AUDIO/capNN_*.json gerados pelo dialogo.py)
      python3 video03_linha_tempo.py --provisoria  (sem áudio: tempos estimados a partir do roteiro, para revisar a direção)
Saída: projeto/video03/linha_tempo.json"""
import glob, json, os, re, sys
B = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
CAPS = {1: ('DIA 1', '11:40', '39°C', 'O ASFALTO'), 2: ('DIA 2', '14:10', '44°C', 'A REDE NÃO AGUENTA'), 3: ('DIA 2', '15:40', '44°C', 'CADÊ A VÓ?'),
        4: ('DIA 2', '21:00', '38°C', 'A REUNIÃO'), 5: ('DIA 3', '05:30', '33°C', 'O MAR'), 6: ('DIA 3', '13:00', '50°C', 'CINQUENTA'),
        7: ('DIA 3', '18:05', '47°C', 'O RÁDIO DO 302'), 8: ('DIA 4', '02:40', '41°C', 'A MADRUGADA'), 9: ('DIA 5', '16:00', '37°C', 'A CHUVA')}
CARTELA, TITULO, FIM, ENTRADA, SAIDA = 3.0, 4.4, 8.0, 1.4, 1.1
PROV = '--provisoria' in sys.argv
GAP = {'normal': 0.18, 'rapido': 0.06, 'narracao': 0.45, 'interrompe': -0.28}
VN, VP = 19.7, 15.1  # caracteres por segundo (calibrados no Vídeo 2)

def provisorio(arq):
    """Falas com tempos estimados (mesmo formato do json do dialogo.py), para revisar a direção sem áudio."""
    itens, t, out = [], 0.0, []
    for ln in open(arq, encoding='utf-8'):
        ln = ln.strip()
        if not ln or ln.startswith('#'): continue
        m = re.match(r'^\[pausa\s+([\d.]+)\]$', ln, re.I)
        if m: itens.append({'pausa': float(m.group(1))}); continue
        if ln.startswith('['): continue
        m = re.match(r'^([A-ZÀ-Ú ]+?)\s*(?:\[([a-z]+)\])?\s*(?:,[^:]*)?:\s*(.+)$', ln)
        if m: itens.append({'personagem': m.group(1).strip().lower().replace(' ', '_'), 'modo': m.group(2), 'texto': m.group(3)})
    for k, x in enumerate(itens):
        if 'pausa' in x: t += x['pausa']; continue
        narr = x['personagem'] == 'narrador'
        modo = x['modo'] if x['modo'] in GAP else ('narracao' if narr or (k and itens[k - 1].get('personagem') == 'narrador') else 'normal')
        if k: t += GAP[modo]
        d = len(x['texto']) / (VN if narr else VP)
        boca = [round(0.5 + 0.5 * abs(((i * 7) % 11) / 11 - 0.5), 2) for i in range(int(d * 30))]
        out.append({'personagem': x['personagem'], 'texto': x['texto'], 'modo': x['modo'], 'inicio': round(t, 3), 'fim': round(t + d, 3), 'boca': boca}); t += d
    return out

if PROV:
    arqs = sorted(glob.glob(f'{B}/VIDEO_03/ROTEIRO/cap[0-9][0-9]_*.txt')); ler = provisorio
else:
    arqs = sorted(a for a in glob.glob(f'{B}/VIDEO_03/AUDIO/cap[0-9][0-9]_*.json') if not a.endswith('_verificacao.json'))
    ler = lambda a: json.load(open(a, encoding='utf-8'))
assert len(arqs) == 11, f'faltam trechos: {len(arqs)}/11'
blocos, falas, audios, t = [], [], [], 0.0
for a in arqs:
    cap = int(os.path.basename(a)[3:5]); F = ler(a)
    if cap in CAPS:
        dia, hora, temp, tit = CAPS[cap]
        blocos.append({'tipo': 'cartela', 'cap': cap, 'a': round(t, 3), 'b': round(t + CARTELA, 3), 'dia': dia, 'hora': hora, 'temp': temp, 'titulo': tit}); t += CARTELA
    ent = 1.0 if cap == 0 else (ENTRADA if cap in CAPS else 0.8)
    off = t + ent
    for k, f in enumerate(F):
        falas.append({**f, 'cap': cap, 'k': k, 'inicio': round(f['inicio'] + off, 3), 'fim': round(f['fim'] + off, 3)})
    fim = off + F[-1]['fim'] + SAIDA
    blocos.append({'tipo': 'cap', 'cap': cap, 'a': round(t, 3), 'b': round(fim, 3)})
    if not PROV: audios.append({'arq': os.path.relpath(a[:-5] + '.wav', B), 'inicio': round(off, 3)})
    t = fim
    if cap == 0:
        blocos.append({'tipo': 'titulo', 'a': round(t, 3), 'b': round(t + TITULO, 3)}); t += TITULO
blocos.append({'tipo': 'fim', 'a': round(t, 3), 'b': round(t + FIM, 3)}); t += FIM
L = {'video': 'video03', 'provisoria': PROV, 'duracao': round(t, 3), 'blocos': blocos, 'falas': falas, 'audios': audios}
json.dump(L, open(f'{B}/projeto/video03/linha_tempo.json', 'w', encoding='utf-8'), ensure_ascii=False)
print(f'{"PROVISÓRIA " if PROV else ""}duração: {int(t // 60)}:{int(t % 60):02d} ({t:.1f}s), {len(falas)} falas')
