#!/usr/bin/env python3
"""Biblioteca de trilha e efeitos sonoros sintetizados (100% originais, sem direitos de terceiros).
Tudo em 48 kHz estéreo. Usada pelos scripts de cada episódio."""
import numpy as np, soundfile as sf
SR = 48000
rs = np.random.default_rng(1)


def silencio(seg): return np.zeros((int(seg * SR), 2), np.float32)
def t_(seg): return np.arange(int(seg * SR)) / SR
def env_adsr(n, a=0.01, r=0.3):
    e = np.ones(n); na, nr = int(a * SR), int(r * SR)
    if na: e[:na] = np.linspace(0, 1, na)
    if nr: e[-nr:] *= np.linspace(1, 0, nr)
    return e
def lp(x, fc):  # passa-baixa 2 polos
    from scipy.signal import lfilter
    a = np.exp(-2 * np.pi * fc / SR)
    return lfilter([1 - a], [1, -a], lfilter([1 - a], [1, -a], x, axis=0), axis=0)
def hp(x, fc): return x - lp(x, fc)
def bp(x, lo, hi): return lp(hp(x, lo), hi)
def ruido(seg, cor='rosa'):
    n = int(seg * SR); w = rs.standard_normal(n)
    if cor == 'rosa':
        f = np.fft.rfft(w); k = np.arange(len(f)); k[0] = 1; f /= np.sqrt(k); w = np.fft.irfft(f, n)
    elif cor == 'marrom':
        w = np.cumsum(w); w -= lp(w, 2)
    return (w / (np.abs(w).max() + 1e-9)).astype(np.float32)
def estereo(m, pan=0.0, largura=0.0):
    l = m * np.sqrt((1 - pan) / 2) * 1.414; r = m * np.sqrt((1 + pan) / 2) * 1.414
    if largura:
        d = int(largura * 0.02 * SR); r = np.concatenate([np.zeros(d), r[:len(r) - d]])
    return np.stack([l, r], 1).astype(np.float32)


class Pista:
    def __init__(s, dur): s.x = silencio(dur)
    def add(s, som, em, ganho=1.0):
        i = int(em * SR)
        if i < 0: som, i = som[-i:], 0  # começa antes do zero: corta o início
        if i >= len(s.x) or len(som) == 0: return
        n = min(len(som), len(s.x) - i); s.x[i:i + n] += som[:n] * ganho
    def salvar(s, arq): sf.write(arq, np.clip(s.x, -1, 1), SR, subtype='PCM_24')


# ---------- efeitos ----------
def impacto(dur=3.0):  # "boom" grave cinematográfico
    t = t_(dur); f = 55 * np.exp(-t * 1.2) + 28
    tom = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 1.4)
    rd = lp(ruido(dur, 'marrom'), 300) * np.exp(-t * 3)
    return estereo(0.9 * tom + 0.5 * rd, 0, 0.5)
def riser(dur=2.0):
    t = t_(dur); r = bp(ruido(dur), 400, 4000) * (t / dur) ** 2
    tom = np.sin(2 * np.pi * np.cumsum(200 + 600 * (t / dur) ** 2) / SR) * (t / dur) ** 3 * 0.15
    return estereo(r * 0.5 + tom, 0, 0.6)
def desligar(dur=1.6):  # energia caindo: zumbido 60 Hz que desce e some, com "tunc"
    t = t_(dur); f = 120 * np.exp(-t * 1.8)
    z = (np.sin(2 * np.pi * np.cumsum(f) / SR) + 0.4 * np.sin(4 * np.pi * np.cumsum(f) / SR)) * np.exp(-t * 2.2)
    tunc = lp(ruido(dur, 'marrom'), 180) * np.exp(-t * 18)
    return estereo(0.4 * z + 0.8 * tunc)
def zumbido_geladeira(dur):
    t = t_(dur); z = 0.5 * np.sin(2 * np.pi * 60 * t) + 0.3 * np.sin(2 * np.pi * 120 * t) + 0.1 * np.sin(2 * np.pi * 180 * t)
    return estereo(z * 0.08 + bp(ruido(dur), 100, 600) * 0.02)
def clique(forte=1.0):
    d = 0.06; t = t_(d); c = hp(ruido(d, 'branco'), 2000) * np.exp(-t * 180)
    return estereo(c * 0.5 * forte)
def porta_geladeira():
    d = 0.9; t = t_(d)
    pop = lp(ruido(d, 'marrom'), 400) * np.exp(-t * 25) * 0.9
    sel = bp(ruido(d), 800, 3000) * np.exp(-((t - 0.05) / 0.04) ** 2) * 0.3
    return estereo(pop + sel)
def passo(forte=1.0, seed=0):
    d = 0.25; t = t_(d); g = np.random.default_rng(seed)
    th = lp(ruido(d, 'marrom'), 220 + g.random() * 80) * np.exp(-t * 35)
    ra = bp(ruido(d), 1500, 5000) * np.exp(-t * 60) * 0.12
    return estereo((th + ra) * 0.55 * forte, g.random() * 0.2 - 0.1)
def buzina(dur=0.6, f=420, pan=0.0):
    t = t_(dur); s = np.sign(np.sin(2 * np.pi * f * t)) + np.sign(np.sin(2 * np.pi * f * 1.26 * t))
    s = lp(s, 2500) * env_adsr(len(t), 0.02, 0.08)
    return estereo(s * 0.06, pan)
def cidade_ambiente(dur, intens=1.0):  # ruído urbano distante
    base = lp(ruido(dur), 500) * 0.25 + bp(ruido(dur), 300, 1200) * 0.05
    mod = 0.7 + 0.3 * np.sin(2 * np.pi * 0.07 * t_(dur))
    return estereo(base * mod * intens, 0, 1)
def vento(dur, intens=1.0):
    t = t_(dur); n = bp(ruido(dur), 200, 1400)
    mod = 0.5 + 0.5 * np.sin(2 * np.pi * 0.11 * t + 1) * np.sin(2 * np.pi * 0.05 * t)
    return estereo(n * mod * 0.3 * intens, 0, 1)
def multidao(dur, intens=1.0):
    n = bp(ruido(dur), 250, 2200); m = 0.6 + 0.4 * np.abs(np.sin(2 * np.pi * 0.5 * t_(dur) * (1 + 0.3 * np.sin(t_(dur)))))
    return estereo(n * m * 0.12 * intens, 0, 1)
def faisca(dur=1.2):
    t = t_(dur); cr = hp(ruido(dur, 'branco'), 1500) * (rs.random(len(t)) < 0.02) * 3
    cr = lp(cr, 7000) * np.exp(-t * 3)
    zap = np.sin(2 * np.pi * np.cumsum(900 * np.exp(-t * 4) + 80) / SR) * np.exp(-t * 6) * 0.3
    return estereo(cr + zap, 0, 0.4)
def queda_energia(dur=3.0):  # zumbido elétrico grande que desce (falha em cascata)
    t = t_(dur); f = 60 * np.exp(-t * 0.9) + 15
    z = np.sin(2 * np.pi * np.cumsum(f) / SR) + 0.6 * np.sign(np.sin(2 * np.pi * np.cumsum(f * 2) / SR))
    return estereo(lp(z, 900) * np.exp(-t * 0.9) * 0.35, 0, 0.5)
def batida_coracao():
    d = 0.7; t = t_(d)
    b = lambda o: np.sin(2 * np.pi * 50 * (t - o)) * np.exp(-np.clip(t - o, 0, None) * 22) * (t >= o)
    return estereo((b(0) + 0.7 * b(0.22)) * 0.6)


# ---------- trilha ----------
def nota(f, dur, vel=1.0, tipo='piano'):
    t = t_(dur)
    if tipo == 'piano':
        s = sum(np.sin(2 * np.pi * f * k * t) / k ** 1.6 * np.exp(-t * (1.5 + k * 0.6)) for k in range(1, 7))
        s *= env_adsr(len(t), 0.004, 0.2)
    else:
        s = np.sin(2 * np.pi * f * t)
    return s * vel
def pad(freqs, dur, brilho=900, a=2.0, r=2.0):
    t = t_(dur); s = np.zeros(len(t))
    for f in freqs:
        for d in (-0.12, 0.0, 0.11):  # serra desafinada
            ff = f * 2 ** (d / 12); s += ((t * ff) % 1.0 * 2 - 1) * 0.3
    s = lp(s, brilho) * env_adsr(len(t), a, r) * (0.85 + 0.15 * np.sin(2 * np.pi * 0.2 * t))
    return s / len(freqs)
def hz(n): return 440 * 2 ** ((n - 69) / 12)
