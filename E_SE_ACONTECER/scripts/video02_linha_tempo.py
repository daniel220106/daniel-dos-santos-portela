#!/usr/bin/env python3
"""VIDEO_02 — monta a linha do tempo do vídeo a partir dos áudios de cada trecho (VIDEO_02/AUDIO/capNN_*.json).
Abertura, título, 12 capítulos (cartela + cena) e cartela final. Saída: projeto/video02/linha_tempo.json"""
import glob, json, os
B = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
CAPS = {1: ('06:30', 'UMA MANHÃ NORMAL'), 2: ('08:00', 'O PRIMEIRO SINAL'), 3: ('09:15', 'O ALERTA'), 4: ('10:00', 'A GARAGEM'),
        5: ('11:30', 'A CIDADE PARA'), 6: ('13:00', 'AGORA É SÉRIO'), 7: ('14:20', 'A LIGAÇÃO'), 8: ('16:00', 'A DECISÃO'),
        9: ('18:30', 'O QUE SOBROU'), 10: ('22:00', 'A CHUVA DIMINUI'), 11: ('24 HORAS', 'DEPOIS'), 12: ('', 'ENCERRAMENTO')}
CARTELA, TITULO, FIM, ENTRADA, SAIDA = 3.0, 4.4, 8.0, 1.4, 1.1

import sys
DIR_AUDIO = sys.argv[1] if len(sys.argv) > 1 else f'{B}/VIDEO_02/AUDIO'
ARQ_SAIDA = sys.argv[2] if len(sys.argv) > 2 else f'{B}/projeto/video02/linha_tempo.json'
arqs = sorted(glob.glob(f'{DIR_AUDIO}/cap[0-9][0-9]_*.json'))
arqs = [a for a in arqs if not a.endswith('_verificacao.json')]
assert len(arqs) == 13, f'faltam trechos: {len(arqs)}/13'
blocos, falas, audios, t = [], [], [], 0.0
for a in arqs:
    cap = int(os.path.basename(a)[3:5]); F = json.load(open(a, encoding='utf-8'))
    if cap >= 1:
        blocos.append({'tipo': 'cartela', 'cap': cap, 'a': round(t, 3), 'b': round(t + CARTELA, 3), 'hora': CAPS[cap][0], 'titulo': CAPS[cap][1]}); t += CARTELA
    ent = 1.0 if cap == 0 else ENTRADA
    off = t + ent
    for k, f in enumerate(F):
        falas.append({**f, 'cap': cap, 'k': k, 'inicio': round(f['inicio'] + off, 3), 'fim': round(f['fim'] + off, 3)})
    fim = off + F[-1]['fim'] + SAIDA
    blocos.append({'tipo': 'cap', 'cap': cap, 'a': round(t, 3), 'b': round(fim, 3)})
    audios.append({'arq': os.path.relpath(a[:-5] + '.wav', B), 'inicio': round(off, 3)})
    t = fim
    if cap == 0:
        blocos.append({'tipo': 'titulo', 'a': round(t, 3), 'b': round(t + TITULO, 3)}); t += TITULO
blocos.append({'tipo': 'fim', 'a': round(t, 3), 'b': round(t + FIM, 3)}); t += FIM
L = {'video': 'video02', 'duracao': round(t, 3), 'blocos': blocos, 'falas': falas, 'audios': audios}
json.dump(L, open(ARQ_SAIDA, 'w', encoding='utf-8'), ensure_ascii=False)
print(f'duração: {t/60:.1f} min ({t:.1f}s), {len(falas)} falas')
