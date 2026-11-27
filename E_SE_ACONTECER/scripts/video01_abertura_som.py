#!/usr/bin/env python3
"""Trilha + efeitos + mixagem do teste de abertura do VIDEO_01. Gera audio final 48 kHz estéreo."""
import subprocess, sys, numpy as np
sys.path.insert(0, '.')
from som import *
DUR = 75.0
fx, mus = Pista(DUR), Pista(DUR)
rng_ = np.random.default_rng(3)

# ---- efeitos ----
fx.add(impacto(3.5), 0.12, 0.9); fx.add(riser(1.6), 1.15, 0.6)
fx.add(zumbido_geladeira(2.75), 0.0, 0.6); fx.add(cidade_ambiente(2.75, 0.6), 0, 0.5)
fx.add(desligar(), 2.72, 1.0)
fx.add(estereo(lp(ruido(16), 300) * 0.05), 3.0)  # silêncio do apartamento (room tone)
fx.add(vento(16, 0.25), 3.0)
fx.add(porta_geladeira(), 7.75, 0.9)
for tt in (12.45, 13.25): fx.add(clique(0.5), tt)
for tt in (16.3, 17.0, 17.7): fx.add(clique(0.9), tt)
fx.add(cidade_ambiente(6.4, 0.5), 19.7); fx.add(vento(6.4, 0.6), 19.7)
for tt in (21.4, 24.1): fx.add(buzina(0.5, 380 + rng_.random() * 80, -0.4), tt, 0.35)
for i in range(9): fx.add(clique(0.35), 26.15 + i * 0.12)
fx.add(desligar(0.9), 28.75, 0.5)
fx.add(impacto(1.6), 29.85, 0.35); fx.add(impacto(1.6), 31.0, 0.35)
fx.add(estereo(lp(ruido(7.5), 250) * 0.04), 32.0)
for k in range(6): fx.add(passo(0.9, k), 32.25 + k * 0.556)
for k in range(3): fx.add(passo(1.0, 10 + k), 35.45 + k * 0.5)
fx.add(vento(2.3, 0.8), 37.2); fx.add(cidade_ambiente(2.3, 0.5), 37.2)
fx.add(cidade_ambiente(15, 1.0), 39.3); fx.add(multidao(15, 0.8), 39.3)
for k in range(7): fx.add(buzina(0.3 + rng_.random() * 0.6, 340 + rng_.random() * 160, rng_.random() * 1.6 - 0.8), 39.8 + k * 1.15 + rng_.random() * 0.5, 0.3)
fx.add(vento(10, 0.5), 54.2)
zz = estereo(bp(ruido(1.5), 100, 900) * np.linspace(0, 1, int(1.5 * SR)) * 0.25)
fx.add(zz, 54.3); fx.add(faisca(), 55.65, 1.0); fx.add(impacto(3.5), 55.65, 0.9); fx.add(queda_energia(3.2), 55.75, 0.9)
fx.add(impacto(3.0), 60.6, 0.5)
fx.add(vento(5, 0.9), 64.6)
for k in range(4): fx.add(batida_coracao(), 65.4 + k * 1.05, 0.7)
fx.add(impacto(4.5), 69.7, 1.0)

# ---- trilha (ré menor, ambiente sombrio) ----
acordes = [(0.0, 15.0, [38, 45, 53]), (15.0, 11.0, [34, 41, 50]), (26.0, 13.0, [31, 38, 46, 50]), (39.0, 15.5, [38, 45, 53]),
           (54.3, 10.5, [33, 40, 45, 52]), (64.6, 10.4, [38, 45, 50, 53])]
for ini, d, ns in acordes:
    mus.add(estereo(pad([hz(n) for n in ns], d + 1.5, 700 if ini < 54 else 1100, 1.5, 2.0), 0, 0.8), ini, 0.55)
motivo = [62, 65, 64, 57, 62, 69, 67, 65]
k = 0; tt = 4.0
while tt < 53:
    mus.add(estereo(nota(hz(motivo[k % len(motivo)]), 3.0, 0.16), (k % 2) * 0.4 - 0.2, 0.3), tt); k += 1; tt += 2.6
for b in np.arange(54.3, 64.6, 0.6):  # pulso de tensão
    mus.add(estereo(nota(hz(38), 0.5, 0.35, 'seno') * np.exp(-t_(0.5) * 8)), b)
for i, n in enumerate([62, 65, 69, 74]): mus.add(estereo(nota(hz(n), 5.0, 0.18), 0.1 * i, 0.4), 69.8 + i * 0.35)
fx.salvar('../audio/testes/video01_abertura_efeitos.wav'); mus.salvar('../audio/testes/video01_abertura_trilha.wav')

# ---- mixagem: narração com atraso, trilha abaixa sob a voz (sidechain), loudness -14 LUFS ----
filtro = ("[0:a]adelay=3000|3000,apad,asplit=2[voz][sc];"
          "[1:a]volume=0.55[m];[m][sc]sidechaincompress=threshold=0.03:ratio=6:attack=20:release=400[mduck];"
          "[2:a]volume=0.9[e];"
          "[voz][mduck][e]amix=inputs=3:normalize=0:duration=longest,atrim=0:75,"
          "loudnorm=I=-14:TP=-1.5:LRA=11[out]")
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', '../audio/narracao/video01_abertura_teste.wav',
                '-i', '../audio/testes/video01_abertura_trilha.wav', '-i', '../audio/testes/video01_abertura_efeitos.wav',
                '-filter_complex', filtro, '-map', '[out]', '-ar', '48000', '-ac', '2', '../audio/testes/video01_abertura_mix.wav'], check=True)
print('OK mix')
