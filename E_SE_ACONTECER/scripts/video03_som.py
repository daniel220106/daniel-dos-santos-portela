#!/usr/bin/env python3
"""Vídeo 3 — trilha por clima de capítulo, ambientes de calor, efeitos sincronizados, a fita da Dona Lurdes (melodia original
sintetizada) e mixagem final (-14 LUFS, ducking sob as vozes).
Uso: ~/venv_voz/bin/python video03_som.py   (lê projeto/video03/linha_tempo.json; grava VIDEO_03/AUDIO/video03_mix_final.wav)"""
import json, subprocess, sys
import numpy as np, soundfile as sf
sys.path.insert(0, '.')
from som import *

B = '..'
L = json.load(open(f'{B}/projeto/video03/linha_tempo.json', encoding='utf-8'))
DUR = L['duracao'] + 0.5
mus, amb, fx, voz = Pista(DUR), Pista(DUR), Pista(DUR), Pista(DUR)
blocos = L['blocos']; F = L['falas']
cap_b = {b['cap']: b for b in blocos if b['tipo'] == 'cap'}
def fala(cap, k): return [f for f in F if f['cap'] == cap][k]
def ini(cap, k, d=0.0): return fala(cap, k)['inicio'] + d
def fim_(cap, k, d=0.0): return fala(cap, k)['fim'] + d
def nfalas(cap): return len([f for f in F if f['cap'] == cap])

# ---------------- sons novos ----------------
def cigarras(dur, intens=1.0, seed=0):  # zumbido agudo pulsante das cigarras no calor
    rng_ = np.random.default_rng(seed); t = t_(dur)
    x = bp(ruido(dur, 'branco'), 4200, 7800) * (0.55 + 0.45 * np.sin(2 * np.pi * (38 + rng_.random() * 6) * t) ** 2)
    x *= 0.6 + 0.4 * np.clip(np.sin(2 * np.pi * t / (5 + rng_.random() * 3)), 0, 1)
    return estereo(x * 0.07 * intens, rng_.random() - 0.5, 0.6)
def grilos(dur, intens=1.0):
    t = t_(dur); x = np.sin(2 * np.pi * 4600 * t) * (np.sin(2 * np.pi * 28 * t) > 0.6) * (np.sin(2 * np.pi * 0.45 * t) > -0.2)
    return estereo(x.astype(np.float32) * 0.02 * intens, 0.3, 0.5)
def zumbido(dur, f=120, intens=1.0):  # transformador/ar-condicionado
    t = t_(dur); x = (np.sin(2 * np.pi * f * t) + 0.5 * np.sin(2 * np.pi * 2 * f * t) + 0.25 * np.sin(2 * np.pi * 3 * f * t)) * 0.05 * intens
    return estereo(x.astype(np.float32))
def ventilador(dur, para=None):  # chiado de pás; se `para`, desacelera e some nesse instante
    x = bp(ruido(dur), 300, 2200) * 0.05; t = t_(dur); m = 0.8 + 0.2 * np.sin(2 * np.pi * 14 * t)
    if para is not None: m = m * np.clip(1 - (t - para) / 1.2, 0, 1)
    return estereo((x * m).astype(np.float32))
def motor_gerador(dur, intens=1.0, abafado=0):
    t = t_(dur); x = (np.sign(np.sin(2 * np.pi * 52 * t)) * 0.4 + np.sin(2 * np.pi * 104 * t) * 0.3) * (0.85 + 0.15 * np.sin(2 * np.pi * 7 * t))
    x = lp(x.astype(np.float32), 300 if abafado else 1400) * 0.12 * intens + bp(ruido(dur), 200, 900) * 0.04 * intens
    return estereo(x.astype(np.float32))
def sirene(dur, intens=1.0):
    t = t_(dur); f = 700 + 280 * np.sin(2 * np.pi * 0.9 * t); x = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.12 * intens
    return estereo(lp(x.astype(np.float32), 3000) * np.clip(t / 2, 0, 1), -0.2, 0.3)
def motor_carro(dur, intens=1.0):
    t = t_(dur); x = lp(np.sign(np.sin(2 * np.pi * 38 * t)).astype(np.float32), 200) * 0.15 * intens + bp(ruido(dur), 60, 400) * 0.05
    return estereo(x)
def trovao(dur=4.0, intens=1.0):
    return estereo(lp(ruido(dur, 'marrom'), 220) * np.exp(-t_(dur) * 0.9) * 0.9 * intens) + impacto(dur) * 0.4 * intens
def chuva_som(dur, intens=1.0):
    return estereo(bp(ruido(dur), 500, 7000) * 0.3 * intens, 0, 1)
def bipe(f=1200, dur=0.12): return estereo(nota(f, dur, 0.4, 'seno'))
def toque_celular(dur=2.0):
    out = np.zeros((int(dur * SR), 2), np.float32)
    for k, n in enumerate([84, 88, 91, 88] * 3):
        i = int(k * 0.16 * SR); s = estereo(nota(hz(n), 0.3, 0.3, 'seno'))
        if i + len(s) <= len(out): out[i:i + len(s)] += s
    return out
def latido():
    t = t_(0.25); f = 520 * np.exp(-t * 6) + 260
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9) * 0.5 + bp(ruido(0.25, 'branco'), 600, 2500) * np.exp(-t * 14) * 0.3
    return estereo(x.astype(np.float32))
def ofego(dur, rapido=1.0):
    t = t_(dur); x = bp(ruido(dur), 700, 3000) * np.clip(np.sin(2 * np.pi * 3.2 * rapido * t), 0, 1) ** 2 * 0.25
    return estereo(x.astype(np.float32), 0.1)
def chiado_panela(dur):
    t = t_(dur); return estereo((hp(ruido(dur, 'branco'), 3000) * 0.08 * (0.7 + 0.3 * np.sin(2 * np.pi * 3 * t))).astype(np.float32), 0.25)
def tique():
    return estereo(hp(ruido(0.03, 'branco'), 2500) * 0.5)
def fita_lurdes(dur, seed=3):
    """Melodia original cantarolada ("lá-lá") com timbre de voz feminina, em fita antiga: chiado, oscilação e banda estreita."""
    mel = [(69, 0.9), (72, 0.45), (74, 0.45), (76, 1.2), (74, 0.6), (72, 0.6), (69, 1.4), (67, 0.6), (69, 0.6), (72, 0.9), (71, 0.45), (69, 1.8), (64, 0.9), (67, 0.9), (69, 2.0)]
    out = np.zeros(int(dur * SR), np.float32); t0 = 0.0
    while t0 < dur:
        for n, d in mel:
            if t0 >= dur: break
            tt = t_(d); f0 = hz(n) * (1 + 0.006 * np.sin(2 * np.pi * 5.5 * tt))
            fase = np.cumsum(f0) / SR; x = 2 * (fase % 1) - 1  # dente de serra (pregas vocais)
            x = 0.55 * bp(x.astype(np.float32), 650, 1000) + 0.35 * bp(x.astype(np.float32), 1050, 1400) + 0.1 * bp(x.astype(np.float32), 2400, 3000)  # formantes de "a"
            x *= env_adsr(len(x), 0.06, 0.18)
            i = int(t0 * SR); j = min(len(out), i + len(x)); out[i:j] += x[:j - i]; t0 += d
        t0 += 1.2
    tt = t_(dur); wow = np.interp(np.arange(len(out)) * (1 + 0.004 * np.sin(2 * np.pi * 0.7 * tt)), np.arange(len(out)), out)
    y = lp(hp(wow.astype(np.float32), 300), 3200) * 2.2 + hp(ruido(dur, 'branco'), 4000) * 0.02
    return estereo(y.astype(np.float32), 0.05)

# ---------------- trilha por clima ----------------
# (acordes MIDI, brilho, dedilhado?, pulso grave por segundo, volume)
CLIMA = {
    0: ([[38, 45, 53], [37, 44, 52]], 600, 0, 1.2, 0.5),             # madrugada: ameaça
    1: ([[50, 57, 62, 66], [47, 54, 59, 62], [45, 52, 57, 61]], 1500, 1, 0, 0.36),  # dia leve, humor
    2: ([[45, 52, 57], [43, 50, 55], [41, 48, 53]], 1000, 1, 0.8, 0.42),  # tensão crescente
    3: ([[41, 48, 53], [43, 50, 55], [40, 47, 52]], 950, 0, 1.0, 0.42),   # busca
    4: ([[38, 45, 50, 53], [36, 43, 48, 52]], 800, 1, 0, 0.32),         # noite de velas
    5: ([[50, 57, 62, 66], [52, 59, 64, 67], [47, 54, 59, 62]], 1700, 1, 0, 0.34),  # amanhecer
    6: ([[38, 45, 53], [36, 43, 51], [41, 48, 53]], 850, 0, 1.6, 0.48),   # 50 °C: pico
    7: ([[41, 48, 57], [43, 50, 59], [38, 45, 53]], 950, 1, 0, 0.34),    # o 302: emoção
    8: ([[38, 45, 53], [36, 43, 51], [38, 45, 50]], 700, 0, 1.8, 0.5),    # madrugada: corrida
    9: ([[43, 50, 55, 59], [45, 52, 57, 61], [48, 55, 60, 64]], 1400, 1, 0, 0.36),  # alívio
    10: ([[50, 57, 62, 66], [47, 54, 59, 62], [43, 50, 55, 59], [45, 52, 57, 61]], 1600, 1, 0, 0.4),
}
for cap, (acs, br, dedi, pulso, vol) in CLIMA.items():
    b = cap_b[cap]; a0, b0 = b['a'] - (0.5 if cap else 0), b['b'] + 0.6
    seg = 6.0; t, k = a0, 0
    while t < b0:
        ac = acs[k % len(acs)]
        mus.add(estereo(pad([hz(n) for n in ac[:3]], seg + 1.5, br, 1.2, 1.6), 0, 0.8), t, vol)
        if dedi:
            for j, n in enumerate([ac[0] + 12, ac[2] + 12, ac[-1] + 12, ac[2] + 12, ac[1] + 12, ac[2] + 12] * 2):
                if t + j * 0.5 < b0 - 0.5: mus.add(estereo(nota(hz(n), 0.9, 0.08), (j % 2) * 0.5 - 0.25, 0.4), t + j * 0.5, vol * 1.5)
        t += seg; k += 1
    if pulso:
        for p in np.arange(a0 + 0.5, b0 - 0.5, 1.0 / pulso): mus.add(estereo(nota(hz(31), 0.45, 0.3, 'seno') * np.exp(-t_(0.45) * 7)), p, 0.75 * vol / 0.45)
# silêncio musical nos momentos de maior tensão (a música "segura a respiração"); aplicado na mixagem
CORTES_MUSICA = [(ini(6, 28) - 3.2, fim_(6, 30) + 0.6), (ini(8, 27) - 0.2, ini(8, 29) - 0.2)]

# ---------------- cartelas, título e fim ----------------
for b in blocos:
    if b['tipo'] == 'cartela': fx.add(riser(1.0), b['a'] - 0.8, 0.3); fx.add(impacto(2.5), b['a'] + 0.05, 0.45); fx.add(clique(0.8) * 1.5, b['a'] + 0.6)
    if b['tipo'] == 'titulo': fx.add(impacto(3.5), b['a'] + 0.05, 0.9)
    if b['tipo'] == 'fim': fx.add(impacto(4.0), b['a'] + 0.2, 0.7); mus.add(estereo(pad([hz(n) for n in [38, 45, 50, 53]], b['b'] - b['a'], 900, 1, 3), 0, 1), b['a'], 0.45)

# ---------------- ambientes por capítulo ----------------
DIA = {1: 1.0, 2: 1.2, 3: 1.2, 6: 1.5}
for cap, k in DIA.items():
    b = cap_b[cap]; d = b['b'] - b['a'] + 1
    amb.add(cigarras(d, k, cap), b['a'] - 0.3, 0.9); amb.add(cidade_ambiente(d, 0.6), b['a'] - 0.3, 0.6)
b = cap_b[5]; amb.add(cidade_ambiente(b['b'] - b['a'], 0.4), b['a'], 0.6); amb.add(estereo(lp(ruido(ini(5, 6) - b['a'], 'rosa'), 600) * 0.08), ini(5, 3) - 0.5, 0.9)  # mar na orla
for cap in (0, 4, 8):
    b = cap_b[cap]; d = b['b'] - b['a'] + 1; amb.add(grilos(d, 1.0), b['a'], 1.0); amb.add(cidade_ambiente(d, 0.25), b['a'], 0.5)
amb.add(motor_gerador(cap_b[4]['b'] - ini(4, 19) + 0.5, 0.5, abafado=1), ini(4, 19) - 0.5, 0.8)  # gerador ao longe na garagem
for a, b_ in [(ini(5, 14) - 0.3, ini(5, 20) - 1.2), (cap_b[9]['a'], ini(9, 11)), (ini(7, 28) - 0.2, ini(7, 29) - 1.0)]:  # hospital / UPA
    amb.add(multidao(b_ - a, 0.25), a, 0.5)
    for tb in np.arange(a + 0.6, b_, 1.4): fx.add(bipe(1250, 0.1), tb, 0.12)
# ventilador e geladeira ligados no Dia 1; param no Dia 2
amb.add(ventilador(ini(1, 26) - ini(1, 14) + 1.0), ini(1, 14) - 1.2, 0.8)
amb.add(chiado_panela(ini(1, 26) - ini(1, 14)), ini(1, 14) - 1.0, 0.7)
amb.add(ventilador(3.0, para=1.0), ini(2, 5) - 1.0, 0.9)
fx.add(desligar(1.2), ini(2, 5) - 0.6, 0.6)

# ---------------- efeitos sincronizados ----------------
# abertura: latido e o ventilador parando
amb.add(ventilador(3.5, para=1.2), cap_b[0]['a'], 0.9)
fx.add(latido(), fim_(0, 10, 0.3), 0.7)
# notificação do bônus e toques de celular
fx.add(estereo(nota(hz(88), 0.3, 0.25), 0.2), ini(1, 2, -0.35), 0.6); fx.add(estereo(nota(hz(93), 0.35, 0.25), 0.2), ini(1, 2, -0.23), 0.6)
fx.add(toque_celular(1.6), ini(1, 7, -1.7), 0.5); fx.add(toque_celular(1.4), ini(2, 25, -1.5), 0.5)
# a fita da Dona Lurdes, às 18h
for a, d, v in [(ini(1, 27, -2.2), 9.0, 0.5), (ini(3, 28, -2.6), 6.0, 0.45)]:
    fx.add(fita_lurdes(d), a, v)
fim_r = fim_(9, 12, 1.7); fx.add(fita_lurdes(4.2), fim_r, 0.5)
# o transformador: zumbido crescente, estouro, faíscas e queda de energia
a_z = ini(2, 1) - 0.3; t_est = ini(2, 3) - 1.1
z = zumbido(t_est - a_z, 120, 1.0) * np.linspace(0.3, 1.4, int((t_est - a_z) * SR))[:, None]; fx.add(z, a_z, 0.8)
fx.add(impacto(3.0), t_est, 1.0); fx.add(faisca(1.4), t_est, 0.9); fx.add(queda_energia(2.5), t_est + 0.1, 0.5)
# o ar-condicionado das janelas antes do estouro
amb.add(zumbido(ini(2, 3) - cap_b[2]['a'], 240, 0.5), cap_b[2]['a'], 0.5)
# tontura do Caio no sinal: coração e som abafado
for k in range(7): fx.add(batida_coracao(), ini(2, 14, 1.0) + k * 0.75, 0.6)
fx.add(estereo(np.sin(2 * np.pi * 6200 * t_(4.0)).astype(np.float32) * 0.015 * np.linspace(0, 1, int(4 * SR))), ini(2, 15) - 0.5, 1.0)  # zumbido no ouvido
# passos e corrida
for t0, n, dt in ((cap_b[3]['a'] + 1.0, 14, 0.32), (ini(8, 4) + 1.0, 12, 0.22)):
    for k in range(n): fx.add(passo(0.9, k), t0 + k * dt)
# batidas na porta do 302
for t0 in (ini(3, 27, -1.1), ini(7, 0, -1.2)):
    for d in (0.0, 0.28, 0.56): fx.add(clique(1.0) * 2.2, t0 + d)
# chaves e a porta abrindo
for i in range(4): fx.add(clique(0.6) * 1.2, ini(7, 3, 2.0) + i * 0.3)
fx.add(estereo(lp(ruido(0.9, 'marrom'), 500) * np.exp(-t_(0.9) * 3) * 0.6), ini(7, 4, -1.2), 0.8)
# o gerador na garagem (Cap. 6): motor alto, depois o portão
g0 = ini(6, 17) - 1.2; amb.add(motor_gerador(ini(6, 24) - g0, 1.0), g0, 0.9)
fx.add(estereo(lp(ruido(1.4, 'marrom'), 900) * 0.5), fim_(6, 21), 0.8)  # portão de enrolar subindo
# a Pipoca ofegando (Cap. 6) e latindo de alegria na chuva (Cap. 9)
amb.add(ofego(ini(6, 16) - ini(6, 13) + 0.5, 1.6), ini(6, 13) - 0.3, 0.9)
for i in range(3): fx.add(latido(), fim_(9, 12, 0.3 + i * 0.4), 0.5)
# relógio no corredor às 18h00, 18h01, 18h02 (silêncio)
for i in range(int(3.2 / 0.5)): fx.add(tique(), ini(6, 28) - 3.2 + i * 0.5, 0.7)
# carro do Valdir (ar-condicionado e motor)
amb.add(motor_carro(ini(7, 28) - ini(7, 20) + 1.0, 0.8), ini(7, 20) - 1.0, 0.7)
# a madrugada: kombi, sirene, ambulância
fx.add(motor_carro(3.0, 1.2), ini(8, 22, -2.6), 0.8)
fx.add(sirene(fim_(8, 30, 1.5) - (fim_(8, 29, 0.3) - 4.0), 1.0), fim_(8, 29, 0.3) - 4.0, 0.7)
fx.add(estereo(lp(ruido(0.6, 'marrom'), 400) * np.exp(-t_(0.6) * 5) * 0.8), fim_(8, 30, 0.4), 0.9)  # portas da ambulância
# a frente fria: trovão, chuva, crianças e aplausos; a luz volta às 21h
tc = ini(9, 11) + 1.0; fx.add(trovao(4.0), tc, 0.9)
amb.add(chuva_som(fim_(9, 12, 1.6) - tc, 1.0), tc + 0.8, 0.9); amb.add(multidao(4.0, 0.8), fim_(9, 11, 0.2), 0.6)
fx.add(estereo((np.sin(2 * np.pi * 120 * t_(1.5)) * np.linspace(0, 0.06, int(1.5 * SR))).astype(np.float32)), fim_(9, 12, 5.9), 0.7)  # zumbido da rede voltando
fx.add(impacto(2.0) * 0.4, fim_(9, 12, 6.3), 0.6)

mus.salvar('/tmp/_v3_mus.wav'); amb.salvar('/tmp/_v3_amb.wav'); fx.salvar('/tmp/_v3_fx.wav')
for a in L['audios']:
    y, sr = sf.read(f"{B}/{a['arq']}", dtype='float32'); assert sr == SR
    voz.add(y if y.ndim == 2 else estereo(y), a['inicio'])
voz.salvar(f'{B}/VIDEO_03/AUDIO/video03_vozes_completas.wav')
corte = '+'.join(f'between(t,{a:.2f},{b:.2f})' for a, b in CORTES_MUSICA)
filtro = (f"[0:a]asplit=2[voz][sc];[1:a]volume='if({corte},0.08,0.55)':eval=frame[m];[2:a]volume=0.8[a];[m][a]amix=inputs=2:normalize=0[fundo];"
          "[fundo][sc]sidechaincompress=threshold=0.03:ratio=6:attack=15:release=350[duck];[3:a]volume=0.9[e];"
          "[voz][duck][e]amix=inputs=3:normalize=0:duration=first,loudnorm=I=-14:TP=-1.5:LRA=11[out]")
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', f'{B}/VIDEO_03/AUDIO/video03_vozes_completas.wav', '-i', '/tmp/_v3_mus.wav', '-i', '/tmp/_v3_amb.wav', '-i', '/tmp/_v3_fx.wav',
                '-filter_complex', filtro, '-map', '[out]', '-ar', '48000', '-ac', '2', f'{B}/VIDEO_03/AUDIO/video03_mix_final.wav'], check=True)
print('OK mix final', round(DUR, 1))
