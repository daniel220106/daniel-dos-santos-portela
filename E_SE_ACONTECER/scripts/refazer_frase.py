#!/usr/bin/env python3
"""Regera UMA frase de um capítulo já narrado e a substitui no WAV, ajustando os tempos seguintes.
Uso: refazer_frase.py capNN "trecho da frase" palavra_obrigatoria [--tentativas 6]
A frase nova só é aceita se o Whisper ouvir a palavra obrigatória."""
import argparse, json, os, sys, subprocess, tempfile
sys.argv_backup = sys.argv
import numpy as np, librosa, soundfile as sf
from narrar import torch, ChatterboxMultilingualTTS, aparar
from faster_whisper import WhisperModel
ap = argparse.ArgumentParser(); ap.add_argument('cap'); ap.add_argument('trecho'); ap.add_argument('palavra'); ap.add_argument('--tentativas', type=int, default=6)
a = ap.parse_args()
cfg = json.load(open('../projeto/config_canal.json'))
base = f'../audio/narracao/video01/{a.cap}'
fr = json.load(open(base + '.json', encoding='utf-8'))
i = next(k for k, f in enumerate(fr) if a.trecho.lower() in f['texto'].lower())
texto = fr[i]['texto']
y, sr = sf.read(base + '.wav', dtype='float32')
i0, i1 = int(fr[i]['inicio'] * sr), int(fr[i]['fim'] * sr)
rms_ref = np.sqrt(np.mean(y[i0:i1] ** 2))
torch.set_num_threads(os.cpu_count() or 4)
m = ChatterboxMultilingualTTS.from_pretrained(torch.device('cpu'))
m.prepare_conditionals('../' + cfg['voz_narrador'], exaggeration=0.45)
wm = WhisperModel('medium', device='cpu', compute_type='int8')
novo = None
for t in range(a.tentativas):
    torch.manual_seed(100 + t)
    w = aparar(m.generate(texto, language_id='pt', exaggeration=0.45, cfg_weight=0.4, temperature=0.7)[0].numpy(), m.sr)
    cps = len(texto) / (len(w) / m.sr)
    ouvido = ' '.join(s.text for s in wm.transcribe(librosa.resample(w, orig_sr=m.sr, target_sr=16000), language='pt', beam_size=5)[0])
    print(f'tentativa {t}: cps={cps:.1f} -> {ouvido}', flush=True)
    if a.palavra.lower() in ouvido.lower() and 9 <= cps <= 19: novo = w; break
if novo is None: sys.exit('nenhuma tentativa aceita')
with tempfile.TemporaryDirectory() as td:
    sf.write(td + '/b.wav', novo, m.sr)
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', td + '/b.wav', '-af', 'highpass=f=70,lowpass=f=11500,deesser=i=0.3,acompressor=threshold=-20dB:ratio=2.5:attack=8:release=120:makeup=2',
                    '-ar', str(sr), '-ac', '2', td + '/p.wav'], check=True)
    p, _ = sf.read(td + '/p.wav', dtype='float32')
p *= rms_ref / np.sqrt(np.mean(p ** 2))
delta = len(p) / sr - (fr[i]['fim'] - fr[i]['inicio'])
y2 = np.concatenate([y[:i0], p, y[i1:]])
fr[i]['fim'] = round(fr[i]['inicio'] + len(p) / sr, 3)
for f in fr[i + 1:]: f['inicio'] = round(f['inicio'] + delta, 3); f['fim'] = round(f['fim'] + delta, 3)
sf.write(base + '.wav', y2, sr, subtype='PCM_16')
json.dump(fr, open(base + '.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(f'OK frase {i} substituída (delta {delta:+.2f}s)')
