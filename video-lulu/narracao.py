"""Gera a narração com Piper (voz neural pt-BR) e calcula a linha do tempo."""
import json, os, subprocess, sys, wave
from roteiro import FALAS

VOICE = sys.argv[1]  # caminho do .onnx
OUT = "build/voz"
os.makedirs(OUT, exist_ok=True)

timeline, t = [], 0.6  # pequeno respiro no início
for fid, texto, pausa in FALAS:
    raw = f"{OUT}/{fid}_raw.wav"
    fin = f"{OUT}/{fid}.wav"
    subprocess.run(["piper", "-m", VOICE, "-c", VOICE + ".json", "-f", raw,
                    "--length_scale", "1.08", "--sentence_silence", "0.15"],
                   input=texto.encode(), check=True, capture_output=True)
    # voz um pouco mais aguda/animada (sem mudar velocidade) e 48 kHz
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", raw, "-af",
                    "asetrate=16000*1.10,atempo=1/1.10,aresample=48000,"
                    "highpass=f=90,acompressor=threshold=-18dB:ratio=3,loudnorm=I=-16:TP=-1.5",
                    "-ac", "1", fin], check=True)
    with wave.open(fin) as w:
        dur = w.getnframes() / w.getframerate()
    timeline.append({"id": fid, "texto": texto, "ini": round(t, 3), "dur": round(dur, 3)})
    t += dur + pausa

json.dump({"total": round(t + 0.8, 3), "falas": timeline}, open("build/timeline.json", "w"),
          ensure_ascii=False, indent=1)
for f in timeline:
    print(f"{f['ini']:6.2f}s +{f['dur']:.2f}  {f['texto']}")
print("total", round(t + 0.8, 2))
