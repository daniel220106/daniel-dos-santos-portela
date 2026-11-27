#!/usr/bin/env python3
"""EP02 — som do teste de animação (Cap. 1): diálogo + chuva + trilha leve de manhã + efeitos, mixagem final.
Uso: ~/venv_voz/bin/python ep02_teste_som.py dialogo.wav dialogo.json saida.wav [--desl 3.6]
Os tempos das tomadas seguem projeto/ep02/teste_cap01.js (fT(k) = início da fala k + desl)."""
import argparse, json, subprocess, sys
import numpy as np, soundfile as sf
sys.path.insert(0, '.')
from som import *

ap = argparse.ArgumentParser(); ap.add_argument('voz'); ap.add_argument('json'); ap.add_argument('saida'); ap.add_argument('--desl', type=float, default=3.6)
a = ap.parse_args()
F = json.load(open(a.json, encoding='utf-8')); D = a.desl
fT = lambda k: F[k]['inicio'] + D
FIM = F[-1]['fim'] + D + 0.9; DUR = FIM + 3.2
mus, amb, fx = Pista(DUR + 1), Pista(DUR + 1), Pista(DUR + 1)

# ---- trilha: manhã leve (Ré maior, dedilhado), tensão a partir do alerta, impacto no título ----
acordes = [[50, 57, 62, 66], [47, 54, 59, 62], [43, 50, 55, 59], [45, 52, 57, 61]]
t, k = 0.4, 0
alerta = fT(11) - 0.3
while t < alerta:
    ac = acordes[k % 4]
    mus.add(estereo(pad([hz(n) for n in ac[:3]], 3.4, 1400, 0.4, 1.2), 0, 0.7), t, 0.28)
    for j, n in enumerate([ac[0] + 12, ac[2] + 12, ac[3] + 12, ac[2] + 12, ac[1] + 12, ac[2] + 12]):  # dedilhado
        mus.add(estereo(nota(hz(n), 0.9, 0.09), (j % 2) * 0.5 - 0.25, 0.4), t + j * 0.5)
    t += 3.0; k += 1
# do alerta em diante: pulso grave e pad menor
mus.add(estereo(pad([hz(n) for n in [38, 45, 53]], FIM - alerta + 1, 700, 1.0, 1.5), 0, 0.8), alerta, 0.45)
for p in np.arange(alerta + 0.5, FIM - 0.5, 0.75): mus.add(estereo(nota(hz(31), 0.45, 0.3, 'seno') * np.exp(-t_(0.45) * 7)), p, 0.8)
mus.add(estereo(pad([hz(n) for n in [38, 45, 50, 53]], DUR - FIM + 1, 900, 0.5, 2.5), 0, 1), FIM, 0.5)

# ---- ambientes: chuva abafada dentro, forte na rua ----
def chuva(d, forte):
    x = bp(ruido(d), 500, 7000 if forte else 2500) * (0.32 if forte else 0.16)
    return estereo(x, 0, 1)
for a0, b0, forte in [(0, fT(0) - 0.25, True), (fT(0) - 0.25, fT(12), False), (fT(12), fT(13), True), (fT(13), FIM, False)]:
    d = b0 - a0 + 0.4; amb.add(chuva(d, forte) * np.linspace(1, 1, int(d * SR))[:, None], a0 - 0.2, 0.9)
    if forte: amb.add(cidade_ambiente(d, 0.6), a0 - 0.2, 0.7)

# ---- efeitos ----
fx.add(estereo(bp(ruido(2.4), 300, 1800) * np.exp(-t_(2.4) * 0.6) * 0.25), fT(0) - 0.2, 0.7)  # cafeteira passando café
fx.add(estereo(nota(hz(88), 0.18, 0.25) + np.pad(nota(hz(93), 0.22, 0.25), (int(0.12 * SR), 0))[:int(0.18 * SR)], 0.2, 0.5), fT(6) - 0.35, 0.6)  # notificação
for i, d in enumerate((0.0, 0.28, 0.56)): fx.add(clique(1.0) * 2.2, fT(8) - 1.2 + d)  # batidas na porta
fx.add(estereo(lp(ruido(0.9, 'marrom'), 500) * np.exp(-t_(0.9) * 3) * 0.6), fT(8) - 0.55, 0.8)  # porta abrindo
for r in (fT(11) - 0.3, fT(14) + 0.4): fx.add(impacto(3.0) * 0.8, r + 0.25, 0.9); fx.add(estereo(lp(ruido(2.5, 'marrom'), 200) * np.exp(-t_(2.5) * 1.5) * 0.8), r + 0.3, 0.8)  # trovão
for i in range(3): fx.add(estereo(nota(hz(81), 0.25, 0.3, 'seno')), fT(11) - 0.2 + i * 0.35, 0.35)  # bipe do alerta na TV
fx.add(impacto(3.5), FIM + 0.15, 0.9)

mus.salvar('/tmp/_mus.wav'); amb.salvar('/tmp/_amb.wav'); fx.salvar('/tmp/_fx.wav')
voz = Pista(DUR + 1); y, sr = sf.read(a.voz, dtype='float32'); voz.add(y if y.ndim == 2 else estereo(y), D); voz.salvar('/tmp/_voz.wav')
filtro = ("[0:a]asplit=2[voz][sc];[1:a]volume=0.55[m];[2:a]volume=0.8[a];[m][a]amix=inputs=2:normalize=0[fundo];"
          "[fundo][sc]sidechaincompress=threshold=0.03:ratio=6:attack=15:release=350[duck];[3:a]volume=0.9[e];"
          "[voz][duck][e]amix=inputs=3:normalize=0:duration=first,atrim=0:" + f"{DUR:.2f}" + ",loudnorm=I=-14:TP=-1.5:LRA=11[out]")
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', '/tmp/_voz.wav', '-i', '/tmp/_mus.wav', '-i', '/tmp/_amb.wav', '-i', '/tmp/_fx.wav',
                '-filter_complex', filtro, '-map', '[out]', '-ar', '48000', '-ac', '2', a.saida], check=True)
print(f'OK {a.saida} {DUR:.1f}s')
