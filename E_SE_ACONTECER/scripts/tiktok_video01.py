#!/usr/bin/env python3
"""Versão curta e vertical (9:16) do VIDEO_01 para TikTok/Reels/Shorts.

Reaproveita a narração e a animação do vídeo longo: escolhe frases-chave, recorta áudio e vídeo
nos mesmos tempos, monta na vertical (vídeo no centro, fundo desfocado), grava legendas grandes e
uma trilha nova. Rodar com o Python do venv (usa soundfile/numpy):
  /home/user/venv_voz/bin/python tiktok_video01.py
"""
import json, os, subprocess, sys
import numpy as np, soundfile as sf
sys.path.insert(0, '.')
from som import Pista, estereo, pad, nota, hz, SR

R = '..'
TMP = f'{R}/render/tiktok_video01'; os.makedirs(TMP, exist_ok=True)
VIDEO = f'{R}/exports/E_SE_ACONTECER_VIDEO_01_sem_legenda.mp4'
NARR = f'{R}/audio/narracao/video01_narracao_completa.wav'
SAIDA = f'{R}/exports/E_SE_ACONTECER_VIDEO_01_tiktok.mp4'
FOLGA_A, FOLGA_D = 0.06, 0.24  # antes/depois de cada frase

# frases escolhidas (índices de linha_tempo.json) e o rótulo de dia que aparece quando cada trecho começa
SEL = [(0, None), (1, None), (2, None), (3, None), (4, None),
       (6, 'DIA 1'), (42, None), (43, None),
       (44, 'DIA 2'), (47, None), (59, None), (63, None), (64, None),
       (108, 'DIA 5'), (113, None), (135, None), (136, None),
       (138, 'DIA 7'), (141, None), (143, None), (145, None), (159, None),
       (193, 'DIA 13'), (201, None), (202, None),
       (229, 'DIA 16'), (230, None), (231, None), (241, None),
       (264, 'DIA 23'), (265, None), (284, None),
       (285, 'DIA 27'), (286, None), (300, None), (301, None),
       (317, 'DIA 30'), (319, None), (320, None), (322, None), (330, None), (331, None),
       (337, None), ('chamada', None), (340, None), (341, None)]

L = json.load(open(f'{R}/projeto/video01/linha_tempo.json', encoding='utf-8'))
F = L['frases']
narr, sr = sf.read(NARR, dtype='float32'); assert sr == SR
cta, sr2 = sf.read(f'{R}/audio/narracao/tiktok_video01_chamada.wav', dtype='float32'); assert sr2 == SR
cta_txt = json.load(open(f'{R}/audio/narracao/tiktok_video01_chamada.json', encoding='utf-8'))

# ---------- trechos: (início no vídeo original, duração, texto, rótulo, áudio) ----------
trechos = []
for idx, rot in SEL:
    if idx == 'chamada':  # imagem: cidade acendendo (cap 12); áudio: frase nova
        d = len(cta) / SR + 0.35
        trechos.append(dict(v0=1304.0, d=d, texto=cta_txt[0]['texto'], rot=None, aud=np.concatenate([cta, np.zeros((int(0.35 * SR), 2), np.float32)]), cta=True, fala=(0.0, cta_txt[0]['fim'])))
        continue
    f = F[idx]
    a, b = max(0.0, f['inicio'] - FOLGA_A), f['fim'] + FOLGA_D
    trechos.append(dict(v0=a, d=b - a, texto=f['texto'], rot=rot, aud=narr[int(a * SR):int(b * SR)], fala=(f['inicio'] - a, f['fim'] - a)))
DUR = sum(t['d'] for t in trechos)
print(f'{len(trechos)} trechos, {DUR:.1f}s')

# ---------- áudio: narração colada + trilha contínua com ducking ----------
voz = np.concatenate([t['aud'] if t['aud'].ndim == 2 else estereo(t['aud']) for t in trechos])
sf.write(f'{TMP}/voz.wav', voz, SR, subtype='PCM_24')
mus = Pista(DUR + 1)
acordes = [[38, 45, 53], [34, 41, 50], [31, 38, 46], [33, 40, 48]]
seg = 8.0; k = 0; t = 0.0
fim_tenso = DUR - 32
while t < fim_tenso:
    mus.add(estereo(pad([hz(n) for n in acordes[k % 4]], seg + 2, 750, 1.5, 2), 0, 0.8), t, 0.5); t += seg; k += 1
mus.add(estereo(pad([hz(n) for n in [50, 57, 62, 66, 69]], DUR - fim_tenso + 1, 1800, 3, 3), 0, 1), fim_tenso, 0.55)
mot, tt, k = [62, 65, 64, 57, 62, 69, 67, 65], 1.0, 0
while tt < DUR - 1:
    mus.add(estereo(nota(hz(mot[k % 8]), 2.6, 0.13), (k % 2) * 0.4 - 0.2, 0.3), tt); tt += 2.2; k += 1
mus.salvar(f'{TMP}/trilha.wav')

# ---------- vídeo: recortes do vídeo, na ordem ----------
lista = []
for i, t in enumerate(trechos):
    arq = f"{TMP}/v_{t['v0']:.3f}_{t['d']:.3f}.mp4"
    if not os.path.exists(arq):
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-ss', f"{t['v0']:.3f}", '-i', VIDEO, '-t', f"{t['d']:.3f}", '-an',
                        '-vf', 'fps=30', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '16', arq], check=True)
    lista.append(f"file '{os.path.abspath(arq)}'")
open(f'{TMP}/lista.txt', 'w').write('\n'.join(lista))
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', f'{TMP}/lista.txt', '-c', 'copy', f'{TMP}/seq.mp4'], check=True)

# ---------- legendas e textos (ASS, 1080x1920) ----------
def ts(s):
    h, m = int(s // 3600), int(s % 3600 // 60); return f'{h}:{m:02d}:{s % 60:05.2f}'

def pedacos(texto, maxc=24):
    """Quebra a frase em blocos curtos (estilo TikTok), sem deixar palavra sozinha."""
    pal, out, at = texto.split(), [], ''
    for w in pal:
        c = (at + ' ' + w).strip()
        if at and len(c) > maxc: out.append(at); at = w
        else: at = c
    out.append(at)
    if len(out) > 1 and len(out[-1].split()) == 1: a = out[-2].split(); out[-2] = ' '.join(a[:-1]); out[-1] = a[-1] + ' ' + out[-1]
    curtas = {'o', 'a', 'os', 'as', 'de', 'do', 'da', 'dos', 'das', 'e', 'em', 'no', 'na', 'um', 'uma', 'com', 'sem', 'que', 'para', 'por', 'se', 'ao', 'à'}
    for k in range(len(out) - 1):  # não terminar bloco em palavra curta: passa para o próximo
        a = out[k].split()
        while len(a) > 1 and a[-1].lower().strip(',') in curtas: out[k + 1] = a.pop() + ' ' + out[k + 1]
        out[k] = ' '.join(a)
    return [o for o in out if o]

ass = ["[Script Info]", "ScriptType: v4.00+", "PlayResX: 1080", "PlayResY: 1920", "WrapStyle: 0", "",
       "[V4+ Styles]",
       "Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding",
       "Style: Leg,Inter Black,76,&H00FFFFFF,&H00FFFFFF,&H00000000,&H96000000,0,0,0,0,100,100,0,0,1,7,3,8,70,70,1310,1",
       "Style: Titulo,Inter Black,66,&H00FFFFFF,&H00FFFFFF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,0,4,8,70,70,250,1",
       "Style: Selo,Inter Bold,34,&H00F2EFE9,&H00FFFFFF,&H00000000,&H00000000,0,0,0,0,100,100,2,0,1,0,2,8,70,70,505,1",
       "Style: Dia,Inter Black,52,&H00FFFFFF,&H00FFFFFF,&H002430C6,&H002430C6,0,0,0,0,100,100,1,0,3,14,0,7,40,70,668,1",
       "Style: Chamada,Inter Black,58,&H0065C8F2,&H00FFFFFF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,6,3,8,70,70,1310,1",
       "", "[Events]", "Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text"]
ass.append(f"Dialogue: 1,{ts(0)},{ts(DUR)},Titulo,,0,0,0,,E SE O BRASIL FICASSE\\N{{\\c&H2430C6&}}30 DIAS SEM ENERGIA?")
ass.append(f"Dialogue: 1,{ts(0)},{ts(DUR)},Selo,,0,0,0,,{{\\c&H2430C6&}}●{{\\c&HE9EFF2&}} SIMULAÇÃO · CENÁRIO HIPOTÉTICO")
t0 = 0.0
for t in trechos:
    if t['rot']: ass.append(f"Dialogue: 2,{ts(t0 + 0.05)},{ts(t0 + min(3.2, t['d'] + 2))},Dia,,0,0,0,,{{\\fad(120,200)}} {t['rot']} ")
    a, b = t0 + t['fala'][0], t0 + t['fala'][1]
    ps = pedacos(t['texto']); tot = sum(len(p) for p in ps); x = a
    estilo = 'Chamada' if t.get('cta') else 'Leg'
    for p in ps:
        y = x + (b - a) * len(p) / tot
        ass.append(f"Dialogue: 3,{ts(x)},{ts(y + (0.12 if p is ps[-1] else 0))},{estilo},,0,0,0,,{{\\fscx92\\fscy92\\t(0,90,\\fscx100\\fscy100)}}{p.upper()}")
        x = y
    t0 += t['d']
open(f'{TMP}/legendas.ass', 'w', encoding='utf-8').write('\n'.join(ass) + '\n')

# ---------- composição vertical + mix final ----------
filtro = (
    "[0:v]split=2[a][b];"
    "[a]scale=-2:1920,crop=1080:1920,boxblur=28:2,eq=brightness=-0.22:saturation=0.8[fundo];"
    "[b]scale=1080:608[frente];"
    "[fundo][frente]overlay=0:640,ass=" + f'{TMP}/legendas.ass' + ",format=yuv420p[v];"
    "[1:a]asplit=2[voz][sc];[2:a]volume=0.55[m];[m][sc]sidechaincompress=threshold=0.03:ratio=6:attack=20:release=400[duck];"
    "[voz][duck]amix=inputs=2:normalize=0:duration=first,loudnorm=I=-14:TP=-1.5:LRA=11[aud]")
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', f'{TMP}/seq.mp4', '-i', f'{TMP}/voz.wav', '-i', f'{TMP}/trilha.wav',
                '-filter_complex', filtro, '-map', '[v]', '-map', '[aud]', '-c:v', 'libx264', '-preset', 'medium', '-crf', '20',
                '-r', '30', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-movflags', '+faststart', '-shortest', SAIDA], check=True)
print('OK', SAIDA, f'{DUR:.1f}s')
