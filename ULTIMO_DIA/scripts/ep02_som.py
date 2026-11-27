#!/usr/bin/env python3
"""EP02 — trilha por clima de capítulo, chuva, efeitos sincronizados e mixagem final (-14 LUFS, ducking sob as vozes).
Uso: ~/venv_voz/bin/python ep02_som.py   (lê projeto/ep02/linha_tempo.json; grava EP02/AUDIO/ep02_mix_final.wav)"""
import json, subprocess, sys, os
import numpy as np, soundfile as sf
sys.path.insert(0, '.')
from som import *

B = '..'
L = json.load(open(f'{B}/projeto/ep02/linha_tempo.json', encoding='utf-8'))
DUR = L['duracao'] + 0.5
mus, amb, fx, voz = Pista(DUR), Pista(DUR), Pista(DUR), Pista(DUR)
blocos = L['blocos']; F = L['falas']
cap_b = {b['cap']: b for b in blocos if b['tipo'] == 'cap'}
def fala(cap, k): return [f for f in F if f['cap'] == cap][k]
def ini(cap, k, d=0.0): return fala(cap, k)['inicio'] + d
def fim_(cap, k, d=0.0): return fala(cap, k)['fim'] + d

# ---------------- trilha por clima ----------------
# (acordes MIDI, brilho, dedilhado?, pulso grave por segundo, volume)
CLIMA = {
    0: ([[38, 45, 53], [36, 43, 51]], 650, 0, 1.4, 0.55),           # impacto e urgência
    1: ([[50, 57, 62, 66], [47, 54, 59, 62], [43, 50, 55, 59], [45, 52, 57, 61]], 1400, 1, 0, 0.4),  # manhã leve
    2: ([[45, 52, 57], [43, 50, 55], [41, 48, 53]], 1000, 1, 0.6, 0.42),
    3: ([[38, 45, 53], [41, 48, 53], [36, 43, 50]], 900, 0, 1.0, 0.45),  # alerta
    4: ([[36, 43, 51], [38, 45, 50]], 750, 0, 1.2, 0.48),            # garagem: tensão
    5: ([[47, 54, 59, 62], [45, 52, 57, 61], [43, 50, 55, 59]], 1300, 1, 0, 0.38),  # humor
    6: ([[38, 45, 53], [34, 41, 50], [33, 40, 48]], 700, 0, 0.8, 0.45),  # agora é sério + lembrança
    7: ([[41, 48, 57], [43, 50, 59], [38, 45, 53]], 950, 1, 0, 0.38),   # ligação: emoção
    8: ([[38, 45, 53], [36, 43, 51], [41, 48, 53]], 900, 0, 1.6, 0.48),  # evacuação: ritmo
    9: ([[43, 50, 55, 59], [45, 52, 57, 61]], 1100, 1, 0, 0.36),     # abrigo: alívio
    10: ([[41, 48, 53, 57], [38, 45, 50, 53]], 800, 1, 0, 0.32),     # noite calma
    11: ([[43, 50, 55, 59], [48, 55, 60, 64], [45, 52, 57, 61]], 1300, 1, 0, 0.36),
    12: ([[50, 57, 62, 66], [47, 54, 59, 62], [43, 50, 55, 59], [45, 52, 57, 61]], 1600, 1, 0, 0.42),  # reflexão final
}
for cap, (acs, br, dedi, pulso, vol) in CLIMA.items():
    b = cap_b[cap]; a0, b0 = b['a'] - (0.5 if cap else 0), b['b'] + 0.6
    seg = 6.0; t, k = a0, 0
    while t < b0:
        ac = acs[k % len(acs)]
        mus.add(estereo(pad([hz(n) for n in ac[:3]], seg + 1.5, br, 1.2, 1.6), 0, 0.8), t, vol)
        if dedi:
            for j, n in enumerate([ac[0] + 12, ac[2] + 12, ac[-1] + 12, ac[2] + 12, ac[1] + 12, ac[2] + 12] * 2):
                if t + j * 0.5 < b0 - 0.5: mus.add(estereo(nota(hz(n), 0.9, 0.08), (j % 2) * 0.5 - 0.25, 0.4), t + j * 0.5, vol * 1.6)
        t += seg; k += 1
    if pulso:
        for p in np.arange(a0 + 0.5, b0 - 0.5, 1.0 / pulso): mus.add(estereo(nota(hz(31), 0.45, 0.3, 'seno') * np.exp(-t_(0.45) * 7)), p, 0.75 * vol / 0.45)
# lembrança da Dona Cida (Cap. 6): pad suave e caixinha
c6 = [f for f in F if f['cap'] == 6]
mus.add(estereo(pad([hz(n) for n in [53, 57, 60, 64]], c6[34]['fim'] - c6[30]['inicio'] + 2, 1800, 1.5, 2), 0, 1), c6[30]['inicio'] - 0.5, 0.35)

# ---------------- cartelas, título e fim ----------------
for b in blocos:
    if b['tipo'] == 'cartela': fx.add(riser(1.0), b['a'] - 0.8, 0.3); fx.add(impacto(2.5), b['a'] + 0.05, 0.45); fx.add(clique(0.8) * 1.5, b['a'] + 0.6)  # tique de relógio
    if b['tipo'] == 'titulo': fx.add(impacto(3.5), b['a'] + 0.05, 0.9)
    if b['tipo'] == 'fim': fx.add(impacto(4.0), b['a'] + 0.2, 0.7); mus.add(estereo(pad([hz(n) for n in [38, 45, 50, 53]], b['b'] - b['a'], 900, 1, 3), 0, 1), b['a'], 0.45)

# ---------------- chuva e ambientes por capítulo ----------------
def chuva(d, forte): return estereo(bp(ruido(d), 500, 7000 if forte else 2400) * (0.3 if forte else 0.14), 0, 1)
INTENS = {0: 1, 1: 0, 2: 0, 3: 0, 4: 1, 5: 0, 6: 0, 7: 0, 8: 1, 9: 0, 10: 0, 11: None, 12: None}
for cap, forte in INTENS.items():
    b = cap_b[cap]; d = b['b'] - b['a'] + 1.0
    if forte is None: amb.add(cidade_ambiente(d, 0.4), b['a'] - 0.3, 0.6); continue
    amb.add(chuva(d, forte), b['a'] - 0.3, 0.9)
    if forte: amb.add(cidade_ambiente(d, 0.7), b['a'] - 0.3, 0.6)
for cap in (9, 10): amb.add(multidao(cap_b[cap]['b'] - cap_b[cap]['a'], 0.25), cap_b[cap]['a'], 0.5)  # abrigo

# ---------------- efeitos sincronizados ----------------
for r in [ini(0, 0, -0.8), ini(0, 6, 0.2)] + [fala(c, len([f for f in F if f['cap'] == c]) // 2)['inicio'] + 0.3 for c in (1, 2, 4, 5, 6, 8)]:
    fx.add(impacto(3.0) * 0.7, r + 0.25, 0.8); fx.add(estereo(lp(ruido(2.5, 'marrom'), 200) * np.exp(-t_(2.5) * 1.5) * 0.8), r + 0.3, 0.7)  # trovões (mesmos tempos dos raios)
for k in range(6): fx.add(buzina(0.3 + 0.2 * (k % 3), 360 + k * 18, (k % 2) * 0.8 - 0.4), ini(0, 0, 0.3 + k * 0.7), 0.18)  # buzinas no trânsito
fx.add(estereo(bp(ruido(2.4), 300, 1800) * np.exp(-t_(2.4) * 0.6) * 0.25), ini(1, 1, 0.2), 0.7)  # cafeteira
fx.add(estereo(nota(hz(88), 0.3, 0.25), 0.2), ini(1, 8, -0.35), 0.6); fx.add(estereo(nota(hz(93), 0.35, 0.25), 0.2), ini(1, 8, -0.23), 0.6)  # notificação
for d in (0.0, 0.28, 0.56): fx.add(clique(1.0) * 2.2, ini(1, 10, -1.4 + d))  # batidas na porta
fx.add(estereo(lp(ruido(0.9, 'marrom'), 500) * np.exp(-t_(0.9) * 3) * 0.6), ini(1, 10, -0.55), 0.8)  # porta
for i in range(3): fx.add(estereo(nota(hz(81), 0.3, 0.3, 'seno')), ini(1, 13, -0.2 + i * 0.35), 0.35)  # bipe da TV
for c, k in ((0, 9), (3, 0)):  # alerta de emergência no celular
    for i in range(4): fx.add(estereo(nota(hz(86), 0.35, 0.35, 'seno') + nota(hz(91), 0.35, 0.2, 'seno')), ini(c, k, -0.3 + i * 0.45), 0.4)
fx.add(estereo(nota(hz(84), 0.4, 0.3)), ini(3, 15, -0.6), 0.5); fx.add(estereo(nota(hz(84), 0.4, 0.3)), ini(3, 15, -0.2), 0.5)  # celular do Pedro
fx.add(estereo(bp(ruido(4.0), 200, 1500) * 0.35), ini(4, 0, -1.0), 0.7)  # água descendo a rampa
fx.add(desligar(1.0), ini(6, 23, -0.5), 0.7)  # a luz acaba
fx.add(estereo(hp(ruido(0.15, 'branco'), 2000) * 0.3), ini(6, 27, 0.6), 0.6)  # clique da lanterna
for t0, n, dt in ((ini(8, 12, -0.8), 10, 0.5), (ini(8, 21, 0.0), 10, 0.5), (ini(10, 7, -0.4), 4, 0.35)):
    for k in range(n): fx.add(passo(0.8, k), t0 + k * dt)
fx.add(estereo(lp(ruido(0.8, 'marrom'), 600) * np.exp(-t_(0.8) * 3) * 0.5), ini(10, 7, -0.6), 0.7)  # porta do abrigo

mus.salvar('/tmp/_ep02_mus.wav'); amb.salvar('/tmp/_ep02_amb.wav'); fx.salvar('/tmp/_ep02_fx.wav')
for a in L['audios']:
    y, sr = sf.read(f"{B}/{a['arq']}", dtype='float32'); assert sr == SR
    voz.add(y if y.ndim == 2 else estereo(y), a['inicio'])
voz.salvar(f'{B}/EP02/AUDIO/ep02_vozes_completas.wav')
filtro = ("[0:a]asplit=2[voz][sc];[1:a]volume=0.55[m];[2:a]volume=0.8[a];[m][a]amix=inputs=2:normalize=0[fundo];"
          "[fundo][sc]sidechaincompress=threshold=0.03:ratio=6:attack=15:release=350[duck];[3:a]volume=0.9[e];"
          "[voz][duck][e]amix=inputs=3:normalize=0:duration=first,loudnorm=I=-14:TP=-1.5:LRA=11[out]")
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', f'{B}/EP02/AUDIO/ep02_vozes_completas.wav', '-i', '/tmp/_ep02_mus.wav', '-i', '/tmp/_ep02_amb.wav', '-i', '/tmp/_ep02_fx.wav',
                '-filter_complex', filtro, '-map', '[out]', '-ar', '48000', '-ac', '2', f'{B}/EP02/AUDIO/ep02_mix_final.wav'], check=True)
print('OK mix final', round(DUR, 1))
