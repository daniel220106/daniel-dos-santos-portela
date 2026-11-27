#!/usr/bin/env python3
"""Auditoria do arquivo final de um vídeo (não do código): áudio, imagem, legendas, continuidade.
Uso: ~/venv_voz/bin/python auditoria_video.py VIDEO.mp4 linha_tempo.json elenco.json legenda.srt saida_dir

1. Reprodução integral: decodifica o arquivo inteiro (vídeo e áudio) e registra qualquer erro; duração, fps e sincronia A/V.
2. Telas pretas e silêncios longos (blackdetect / silencedetect) fora das cartelas e pausas previstas.
3. Volume integrado (LUFS) e pico; clipping.
4. Cada fala: recorta o áudio FINAL no tempo da linha do tempo, transcreve (Whisper) e compara com o texto do roteiro;
   mede o tom (f0) e compara com o tom de referência do personagem (detecta fala atribuída à voz errada);
   mede velocidade (caracteres/s) e se a fala termina cortada (energia alta nos últimos 60 ms).
5. Legendas: cada bloco do SRT dentro de uma fala, sem sobreposição, legível (<= 2 linhas, <= 46 caracteres por linha, >= 0,8 s).
6. Folha de contato com um quadro do meio de cada fala + texto, para conferir imagem x fala.
Saída: relatório .md e .json em saida_dir."""
import json, os, re, subprocess, sys, difflib, unicodedata
import numpy as np, soundfile as sf, librosa

VID, LT, EL, SRT, OUT = sys.argv[1:6]
os.makedirs(OUT, exist_ok=True)
L = json.load(open(LT, encoding='utf-8')); E = json.load(open(EL, encoding='utf-8'))
rel = {'arquivo': VID, 'problemas': []}
def prob(tipo, msg, t=None): rel['problemas'].append({'tipo': tipo, 'msg': msg, 't': t}); print('PROBLEMA', tipo, t, msg)
def run(cmd): return subprocess.run(cmd, capture_output=True, text=True)

# 1. reprodução integral
r = run(['ffmpeg', '-v', 'error', '-i', VID, '-f', 'null', '-'])
rel['decodificacao_erros'] = r.stderr.strip().splitlines()[:20]
if r.stderr.strip(): prob('decodificacao', f'{len(r.stderr.strip().splitlines())} mensagens de erro ao decodificar')
pr = json.loads(run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration,size:stream=codec_type,codec_name,width,height,r_frame_rate,sample_rate,channels,duration,nb_frames', '-of', 'json', VID]).stdout)
rel['ffprobe'] = pr
sv = [s for s in pr['streams'] if s['codec_type'] == 'video'][0]; sa = [s for s in pr['streams'] if s['codec_type'] == 'audio'][0]
dv, da = float(sv['duration']), float(sa['duration'])
rel['duracao'] = float(pr['format']['duration']); rel['sincronia_av_s'] = round(abs(dv - da), 3)
if abs(dv - da) > 0.1: prob('sincronia', f'vídeo {dv:.2f}s x áudio {da:.2f}s')
if abs(rel['duracao'] - L['duracao']) > 0.5: prob('duracao', f"arquivo {rel['duracao']:.1f}s x linha do tempo {L['duracao']:.1f}s")

# 2. telas pretas e silêncios
cart = [(b['a'], b['b']) for b in L['blocos'] if b['tipo'] in ('cartela', 'titulo', 'fim')]
dentro = lambda a, b: any(a >= x - 0.6 and b <= y + 0.6 for x, y in cart)
bd = run(['ffmpeg', '-i', VID, '-vf', 'blackdetect=d=0.6:pix_th=0.06', '-an', '-f', 'null', '-']).stderr
for a, b in re.findall(r'black_start:([\d.]+) black_end:([\d.]+)', bd):
    a, b = float(a), float(b)
    if not dentro(a, b): prob('tela_preta', f'{b - a:.1f}s de tela preta', round(a, 2))
sd = run(['ffmpeg', '-i', VID, '-af', 'silencedetect=n=-45dB:d=2.5', '-vn', '-f', 'null', '-']).stderr
for a, b in re.findall(r'silence_start: ([\d.]+)[\s\S]*?silence_end: ([\d.]+)', sd):
    prob('silencio', f'{float(b) - float(a):.1f}s de silêncio', round(float(a), 2))

# 3. volume
eb = run(['ffmpeg', '-i', VID, '-af', 'ebur128=peak=true', '-vn', '-f', 'null', '-']).stderr
I = re.findall(r'I:\s+(-?[\d.]+) LUFS', eb); P = re.findall(r'Peak:\s+(-?[\d.]+) dBFS', eb)
rel['lufs'] = float(I[-1]) if I else None; rel['pico_dbfs'] = float(P[-1]) if P else None
if rel['lufs'] is not None and not -15.5 <= rel['lufs'] <= -13: prob('volume', f"{rel['lufs']} LUFS (alvo -14)")
if rel['pico_dbfs'] is not None and rel['pico_dbfs'] > -0.5: prob('clipping', f"pico {rel['pico_dbfs']} dBFS")

# 4. falas no áudio final
wav = os.path.join(OUT, '_final.wav'); run(['ffmpeg', '-y', '-v', 'error', '-i', VID, '-ac', '1', '-ar', '16000', wav])
y, sr = sf.read(wav, dtype='float32')
from faster_whisper import WhisperModel
wm = WhisperModel('medium', device='cpu', compute_type='int8')
def norm(s):
    s = unicodedata.normalize('NFKD', s.lower()); s = ''.join(c for c in s if not unicodedata.combining(c))
    return re.sub(r'[^a-z0-9 ]', ' ', s).split()
NUM = {'1': 'um', '2': 'dois', '4': 'quatro', '5': 'cinco', '8': 'oito', '12': 'doze', '15': 'quinze', '24': 'vinte e quatro', '30': 'trinta', '40': 'quarenta', '50': 'cinquenta', '52': 'cinquenta e dois', '79': 'setenta e nove', '81': 'oitenta e um', '192': 'um nove dois'}
def sem(a, b):
    b2 = ' '.join(NUM.get(w, w) for w in norm(b)); return difflib.SequenceMatcher(None, norm(a), b2.split()).ratio()
f0_ref = {}
def f0_med(seg):
    if len(seg) < sr * 0.25: return None
    f0, v, _ = librosa.pyin(seg, fmin=70, fmax=420, sr=sr); f = f0[v]
    return float(np.nanmedian(f)) if len(f) > 5 else None
falas = []
for i, f in enumerate(L['falas']):
    a, b = f['inicio'], f['fim']; seg = y[int(max(0, a - 0.05) * sr):int((b + 0.1) * sr)]
    txt = ' '.join(s.text for s in wm.transcribe(seg, language='pt', beam_size=5)[0]).strip()
    s = sem(f['texto'], txt); fm = f0_med(y[int(a * sr):int(b * sr)])
    cauda = y[int((b - 0.06) * sr):int(b * sr)]; corpo = y[int(a * sr):int(b * sr)]
    corte = bool(len(cauda) and len(corpo) and np.sqrt(np.mean(cauda ** 2)) > 0.6 * np.sqrt(np.mean(corpo ** 2)) and f['personagem'] != 'narrador')
    cps = len(f['texto']) / max(0.1, b - a)
    falas.append({'i': i, 'cap': f['cap'], 'k': f['k'], 'personagem': f['personagem'], 'texto': f['texto'], 'ouvido': txt, 'sem': round(s, 3), 'f0': fm, 'cps': round(cps, 1), 'corte': corte, 'inicio': a})
# tom de referência por personagem = mediana das falas dele (mais robusto que a referência original)
from collections import defaultdict
porp = defaultdict(list)
for x in falas:
    if x['f0']: porp[x['personagem']].append(x['f0'])
ref = {p: float(np.median(v)) for p, v in porp.items()}; rel['tom_por_personagem_hz'] = {p: round(v) for p, v in ref.items()}
for x in falas:
    if x['sem'] < 0.75: prob('fala', f"{x['personagem']}: \"{x['texto']}\" → ouvido \"{x['ouvido']}\" ({x['sem']:.0%})", round(x['inicio'], 2))
    if x['f0'] and x['personagem'] in ref and abs(np.log2(x['f0'] / ref[x['personagem']])) > 0.55:
        prob('voz_trocada?', f"{x['personagem']} com tom {x['f0']:.0f} Hz (o dele é ~{ref[x['personagem']]:.0f} Hz): \"{x['texto'][:50]}\"", round(x['inicio'], 2))
    if x['corte']: prob('cortada?', f"{x['personagem']}: \"{x['texto'][-40:]}\" termina com energia alta", round(x['inicio'], 2))
    if not 5 <= x['cps'] <= 24: prob('velocidade', f"{x['personagem']} {x['cps']} car/s: \"{x['texto'][:50]}\"", round(x['inicio'], 2))
rel['falas'] = falas; rel['precisao_media'] = round(float(np.mean([x['sem'] for x in falas])), 3)

# 5. legendas
blocos = []
for m in re.finditer(r'\d+\n(\d\d):(\d\d):(\d\d),(\d+) --> (\d\d):(\d\d):(\d\d),(\d+)\n(.+?)(?:\n\n|\Z)', open(SRT, encoding='utf-8').read(), re.S):
    g = m.groups(); a = int(g[0]) * 3600 + int(g[1]) * 60 + int(g[2]) + int(g[3]) / 1000; b = int(g[4]) * 3600 + int(g[5]) * 60 + int(g[6]) + int(g[7]) / 1000
    blocos.append((a, b, g[8].strip()))
rel['legenda_blocos'] = len(blocos)
for j, (a, b, t) in enumerate(blocos):
    ls = t.split('\n')
    if len(ls) > 2 or max(len(l) for l in ls) > 46: prob('legenda', f'bloco {j + 1} longo: {t!r}', round(a, 2))
    if b - a < 0.8 and len(t) > 12: prob('legenda', f'bloco {j + 1} rápido demais ({b - a:.2f}s): {t!r}', round(a, 2))
    if j and a < blocos[j - 1][1] - 0.05: prob('legenda', f'bloco {j + 1} sobrepõe o anterior', round(a, 2))
    if not any(f['inicio'] - 0.3 <= a and b <= f['fim'] + 0.3 for f in L['falas']): prob('legenda', f'bloco {j + 1} fora de qualquer fala: {t!r}', round(a, 2))

# 6. folha de contato: um quadro do meio de cada fala
fd = os.path.join(OUT, 'quadros'); os.makedirs(fd, exist_ok=True)
for x in falas:
    f = L['falas'][x['i']]; t = (f['inicio'] + f['fim']) / 2
    run(['ffmpeg', '-y', '-v', 'error', '-ss', f'{t:.2f}', '-i', VID, '-frames:v', '1', '-vf', 'scale=480:270', os.path.join(fd, f"{x['i']:03d}.jpg")])
json.dump(rel, open(os.path.join(OUT, 'auditoria.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
with open(os.path.join(OUT, 'auditoria.md'), 'w', encoding='utf-8') as f:
    f.write(f"# Auditoria do arquivo final\n\n- Arquivo: `{VID}`\n- Duração: {rel['duracao']:.2f} s · sincronia A/V: {rel['sincronia_av_s']} s\n- Volume: {rel['lufs']} LUFS · pico {rel['pico_dbfs']} dBFS\n")
    f.write(f"- Decodificação integral: {'sem erros' if not rel['decodificacao_erros'] else str(len(rel['decodificacao_erros'])) + ' erros'}\n- Falas: {len(falas)} · precisão média no áudio final: {rel['precisao_media']:.1%}\n- Legenda: {len(blocos)} blocos\n")
    f.write(f"- Tom médio por personagem (Hz): {rel['tom_por_personagem_hz']}\n\n## Problemas ({len(rel['problemas'])})\n")
    for p in rel['problemas']: f.write(f"- [{p['tipo']}] {p['t']} s: {p['msg']}\n")
print('FIM', len(rel['problemas']), 'problemas; precisão', rel['precisao_media'])
