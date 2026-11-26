#!/usr/bin/env python3
"""EP01 completo: trilha por clima de capítulo, ambientes, efeitos e mixagem final a partir da linha do tempo."""
import json, subprocess, sys, numpy as np
sys.path.insert(0, '.')
from som import *

L = json.load(open('../projeto/ep01/linha_tempo.json', encoding='utf-8'))
DUR = L['duracao'] + 0.5
mus, amb, fx = Pista(DUR), Pista(DUR), Pista(DUR)
blocos = L['blocos']
rng_ = np.random.default_rng(11)
par = {(b['cap'], b['par']): b for b in blocos if b['tipo'] == 'par'}
def fr(cap, p, i, d=0.0):  # tempo global do início da frase i do parágrafo p
    b = par.get((cap, p)); return (b['frases'][min(i, len(b['frases']) - 1)]['inicio'] if b else 0) + d
def ini_cap(cap): return min(b['a'] for b in blocos if b.get('cap') == cap and b['tipo'] == 'par')
def fim_cap(cap): return max(b['b'] for b in blocos if b.get('cap') == cap and b['tipo'] == 'par')

# ---------------- trilha: clima por capítulo ----------------
# (acordes em MIDI, brilho do pad, motivo de piano, pulso)
CLIMA = {
    0: ([[38, 45, 53]], 700, [62, 65, 64, 57], 0),
    1: ([[38, 45, 53], [34, 41, 50]], 700, [62, 65, 64, 57, 62, 69, 67, 65], 0),
    2: ([[38, 45, 53], [34, 41, 50], [31, 38, 46]], 800, [62, 64, 65, 62], 0),
    3: ([[33, 40, 48], [34, 41, 50]], 650, [57, 60, 62, 60], 0),
    4: ([[38, 45, 53], [31, 38, 46]], 800, [62, 65, 64, 62], 0.9),
    5: ([[33, 40, 48, 52], [29, 36, 45, 48], [31, 38, 47, 50]], 1100, [64, 65, 69, 67, 64, 62], 0),
    6: ([[36, 43, 51], [32, 39, 48]], 600, [60, 63, 62, 60], 0.8),
    7: ([[36, 43, 51], [34, 41, 49]], 650, [60, 63, 65, 63], 0.8),
    8: ([[31, 38, 46], [32, 39, 48]], 520, [55, 58, 56, 55], 1.1),
    9: ([[41, 48, 57], [36, 43, 52], [38, 45, 53], [34, 41, 50]], 1100, [65, 69, 72, 70, 69, 67], 0),
    10: ([[41, 48, 57], [34, 41, 50], [36, 43, 52], [41, 48, 57]], 1300, [69, 72, 74, 72, 69, 67, 65, 67], 0),
    11: ([[38, 45, 53], [39, 46, 51], [34, 41, 50]], 700, [62, 61, 62, 58], 0),
    12: ([[38, 45, 54], [43, 50, 59], [45, 52, 57], [38, 45, 54, 57]], 1500, [66, 69, 74, 73, 71, 69, 66, 69], 0),
}
for cap, (acs, br, mot, pulso) in CLIMA.items():
    a, b = ini_cap(cap) - (1.0 if cap else 0), fim_cap(cap) + 0.5
    seg = (b - a) / len(acs)
    for k, ac in enumerate(acs):
        mus.add(estereo(pad([hz(n) for n in ac], seg + 2.0, br, 1.8, 2.2), 0, 0.8), a + k * seg, 0.5)
    tt, k = a + 2.0, 0
    while tt < b - 2:
        mus.add(estereo(nota(hz(mot[k % len(mot)]), 3.2, 0.15), (k % 2) * 0.4 - 0.2, 0.3), tt); k += 1; tt += 2.8 if cap not in (10, 12) else 2.2
    if pulso:
        for p in np.arange(a + 1, b - 1, 1.0 / pulso): mus.add(estereo(nota(hz(31), 0.5, 0.3, 'seno') * np.exp(-t_(0.5) * 8)), p)
# final do cap 12: acorde maior que cresce quando a luz volta
mus.add(estereo(pad([hz(n) for n in [50, 57, 62, 66, 69]], 14, 2200, 4, 4), 0, 1), fr(12, 0, 3), 0.6)

# ---------------- cartelas e logo ----------------
for b in blocos:
    if b['tipo'] == 'cartela': fx.add(riser(1.2), b['a'] - 1.0, 0.35); fx.add(impacto(3.0), b['a'] + 0.05, 0.6)
    if b['tipo'] == 'logo': fx.add(impacto(3.5), b['a'] + 0.1, 0.9); fx.add(desligar(), b['b'] - 0.5, 0.7)
    if b['tipo'] == 'fim': fx.add(impacto(4.5), b['a'] + 0.2, 0.8); mus.add(estereo(pad([hz(n) for n in [38, 45, 50, 53]], b['b'] - b['a'], 900, 1, 3), 0, 1), b['a'], 0.5)

# ---------------- ambientes por cena ----------------
AMB = {'casa': lambda d: estereo(lp(ruido(d), 300) * 0.05) + vento(d, 0.2), 'rua': lambda d: cidade_ambiente(d, 0.9) + multidao(d, 0.4),
       'noite': lambda d: vento(d, 0.35) + estereo(lp(ruido(d), 200) * 0.03), 'escada': lambda d: estereo(lp(ruido(d), 250) * 0.06),
       'chuva': lambda d: estereo(bp(ruido(d), 500, 6000) * 0.25, 0, 1), 'calor': lambda d: cidade_ambiente(d, 0.4) + estereo(bp(ruido(d), 3000, 7000) * 0.015),
       'garagem': lambda d: multidao(d, 0.35) + estereo(lp(ruido(d), 250) * 0.05), 'multidao': lambda d: multidao(d, 1.0) + cidade_ambiente(d, 0.5)}
MAPA = {0: ['noite'], 1: ['casa', 'rua', 'escada', 'rua', 'noite'], 2: ['casa', 'casa', 'multidao', 'escada', 'noite'], 3: ['casa', 'casa', 'casa', 'escada', 'casa'],
        4: ['casa', 'casa', 'casa', 'multidao', 'rua'], 5: ['casa', 'casa', 'escada', 'escada', 'noite'], 6: ['calor', 'rua', 'garagem', 'garagem', 'noite'],
        7: ['rua', 'rua', 'multidao', 'garagem', 'garagem'], 8: ['noite', 'noite', 'noite', 'noite', 'noite'], 9: ['casa', 'garagem', 'casa', 'noite', 'rua'],
        10: ['garagem', 'casa', 'chuva', 'garagem', 'garagem'], 11: ['escada', 'casa', 'noite', 'casa', 'noite'], 12: ['casa', 'noite', 'noite', 'rua', 'noite']}
for (cap, p), b in par.items():
    d = b['b'] - b['a'] + 0.6
    amb.add(AMB[MAPA[cap][min(p, len(MAPA[cap]) - 1)]](d) * np.linspace(1, 1, int(d * SR))[:, None], b['a'] - 0.3, 0.8)

# ---------------- efeitos pontuais sincronizados com a narração ----------------
def passos(t0, n, dt=0.55, f=0.8):
    for k in range(n): fx.add(passo(f, k), t0 + k * dt)
fx.add(desligar(1.2), fr(1, 0, 0) - 0.3, 0.5); fx.add(porta_geladeira(), fr(1, 0, 1, 1.6), 0.8)
for k in (0.9, 1.4): fx.add(clique(0.5), fr(1, 0, 2, k))
for k in (1.2, 1.9, 2.6): fx.add(clique(0.9), fr(1, 0, 4, k))
for k in range(8): fx.add(buzina(0.3 + rng_.random() * 0.5, 340 + rng_.random() * 150, rng_.random() * 1.6 - 0.8), fr(1, 1, 2, 0.4 + k * 0.9), 0.25)
fx.add(faisca(), fr(1, 1, 6, 1.4), 0.9); fx.add(queda_energia(3.0), fr(1, 1, 6, 1.45), 0.7)
passos(fr(1, 2, 5), 10, 0.5); passos(fr(2, 3, 0), 12, 0.65, 1.0); passos(fr(5, 2, 0), 8, 0.4)
fx.add(estereo(bp(ruido(2.5), 800, 5000) * np.linspace(0.3, 0, int(2.5 * SR)) * 0.6), fr(2, 0, 0, 0.2))  # torneira perdendo pressão
for k in range(6): fx.add(clique(0.25), fr(3, 0, 1, 1.2 + k * 0.4))
fx.add(desligar(0.8), fr(3, 0, 4, 0.5), 0.5)
fx.add(estereo(bp(ruido(4), 1000, 6000) * 0.12), fr(3, 2, 1), 0.8)  # chiado do rádio
for k in (0.2, 0.9): fx.add(clique(1.0) * 2, fr(3, 4, 0, k)); fx.add(clique(1.0) * 2, fr(3, 4, 2, k - 0.1))
fx.add(estereo(hp(ruido(0.4, 'branco'), 2000) * np.exp(-t_(0.4) * 8) * 0.4), fr(4, 2, 2, 0.4))  # fósforo
fx.add(estereo(bp(ruido(5), 200, 900) * 0.08), fr(4, 2, 2, 0.9))  # chama do gás
for k in (0.0, 0.6): fx.add(clique(0.8) * 2, fr(5, 0, 1, k)); fx.add(clique(0.8) * 2, fr(5, 0, 2, k))
for k in range(4): fx.add(batida_coracao(), fr(8, 3, 0, k * 1.0), 0.6)
fx.add(estereo(lp(ruido(1.5), 600) * np.exp(-t_(1.5) * 2) * 0.5), fr(8, 4, 5, 1.2), 0.8)  # portão abrindo
for k in range(20): fx.add(clique(0.15), fr(11, 2, 0) + k * 1.0)  # tique-taque
fx.add(impacto(2.0), fr(10, 2, 0), 0.4)
fx.add(estereo(lp(ruido(0.3, 'marrom'), 300) * np.exp(-t_(0.3) * 20)), fr(12, 0, 0, 0.3), 1.0)  # estalo
fx.add(zumbido_geladeira(10), fr(12, 0, 1), 0.8)
fx.add(multidao(8, 1.6), fr(12, 0, 5), 0.9)
for k in range(5): fx.add(estereo(bp(ruido(0.35), 150, 400) * 0.4), fr(12, 2, 0, k * 0.7))  # vibração do celular

mus.salvar('../audio/testes/ep01_trilha.wav'); amb.salvar('../audio/testes/ep01_ambiente.wav'); fx.salvar('../audio/testes/ep01_efeitos.wav')

# ---------------- narração montada ----------------
voz = Pista(DUR)
import soundfile as sf
for a in L['audios']:
    y, sr = sf.read(f"../audio/narracao/ep01/cap{a['cap']:02d}.wav", dtype='float32'); assert sr == SR
    voz.add(y if y.ndim == 2 else estereo(y), a['inicio'])
voz.salvar('../audio/narracao/ep01_narracao_completa.wav')

filtro = ("[0:a]asplit=2[voz][sc];[1:a]volume=0.5[m];[2:a]volume=0.7[a];[m][a]amix=inputs=2:normalize=0[fundo];"
          "[fundo][sc]sidechaincompress=threshold=0.03:ratio=6:attack=20:release=450[duck];[3:a]volume=0.85[e];"
          "[voz][duck][e]amix=inputs=3:normalize=0:duration=first,loudnorm=I=-14:TP=-1.5:LRA=11[out]")
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', '../audio/narracao/ep01_narracao_completa.wav', '-i', '../audio/testes/ep01_trilha.wav',
                '-i', '../audio/testes/ep01_ambiente.wav', '-i', '../audio/testes/ep01_efeitos.wav', '-filter_complex', filtro, '-map', '[out]',
                '-ar', '48000', '-ac', '2', '../audio/ep01_mix_final.wav'], check=True)
print('OK mix final', DUR)
