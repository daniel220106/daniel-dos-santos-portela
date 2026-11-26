#!/usr/bin/env python3
"""Transcreve o áudio com Whisper e compara com o texto: detecta erro de pronúncia, palavras puladas
ou leitura de pontuação ("ponto", "vírgula"). Uso: python verificar_voz.py audio.wav texto.txt"""
import os, re, sys, difflib
os.environ.setdefault("HF_HUB_DISABLE_XET", "1")
from faster_whisper import WhisperModel
norm = lambda s: re.sub(r"[^a-zà-ú ]", " ", s.lower()).split()
m = WhisperModel(os.environ.get("WHISPER", "medium"), device="cpu", compute_type="int8")
import librosa
audio, _ = librosa.load(sys.argv[1], sr=16000)
segs, _ = m.transcribe(audio, language="pt", beam_size=5)
ouvido = " ".join(s.text for s in segs)
ref, hyp = norm(open(sys.argv[2], encoding="utf-8").read()), norm(ouvido)
sm = difflib.SequenceMatcher(a=ref, b=hyp)
erros = [(ref[i1:i2], hyp[j1:j2]) for op, i1, i2, j1, j2 in sm.get_opcodes() if op != "equal"]
print("OUVIDO:", ouvido.strip())
print(f"PRECISAO: {100*sm.ratio():.1f}%  diferenças: {len(erros)}")
for r, h in erros: print("  texto:", " ".join(r), " | ouvido:", " ".join(h))
for p in ("ponto", "vírgula", "virgula", "reticências"):
    if hyp.count(p) > ref.count(p): print("ALERTA: leu pontuação:", p)
