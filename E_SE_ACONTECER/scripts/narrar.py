#!/usr/bin/env python3
"""Gera narração em português brasileiro com Chatterbox Multilingual (licença MIT, roda local, sem custo).

Uso:
  python narrar.py texto.txt saida.wav --voz ../audio/referencias/ref_8655.wav

O texto deve conter SOMENTE a narração (sem títulos, cenas ou instruções).
Parágrafos separados por linha em branco recebem uma pausa maior.
Gera um WAV final em 48 kHz estéreo com loudness de -16 LUFS e um .json com o tempo de cada frase
(usado depois para legendas e sincronização das cenas).
"""
import argparse, json, os, re, subprocess, sys, tempfile, time

os.environ.setdefault("HF_HUB_DISABLE_XET", "1")
import numpy as np
import torch, torchaudio

_load = torch.load
torch.load = lambda *a, **k: _load(*a, **{**k, "map_location": "cpu"})  # pesos salvos em CUDA -> CPU
from chatterbox.mtl_tts import ChatterboxMultilingualTTS

PAUSA_FRASE = 0.42
PAUSA_VIRGULA_LONGA = 0.30
PAUSA_PARAGRAFO = 0.95


def limpar(txt):
    txt = txt.replace("…", ".").replace("...", ".")
    txt = re.sub(r"[\"“”«»()\[\]]", "", txt)
    txt = re.sub(r"\s*[—–]\s*", ", ", txt)
    txt = txt.replace(":", ",").replace(";", ",")
    txt = re.sub(r"\s+", " ", txt).strip()
    return txt


def frases(paragrafo, limite=230):
    partes = re.findall(r"[^.!?]+[.!?]+|[^.!?]+$", paragrafo)
    partes = [p.strip() for p in partes if p.strip()]
    out = []
    for p in partes:
        if len(p) <= limite:
            out.append(p)
            continue
        # frase longa: quebra nas vírgulas
        buf = ""
        for pedaco in re.split(r"(?<=,)\s+", p):
            if buf and len(buf) + len(pedaco) > limite:
                out.append(buf.strip())
                buf = ""
            buf += " " + pedaco
        if buf.strip():
            out.append(buf.strip())
    return out


def aparar(w, sr, top_db=40):
    a = np.abs(w)
    lim = a.max() * (10 ** (-top_db / 20))
    idx = np.where(a > lim)[0]
    if len(idx) == 0:
        return w
    ini = max(idx[0] - int(0.02 * sr), 0)
    fim = min(idx[-1] + int(0.08 * sr), len(w))
    return w[ini:fim]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("texto")
    ap.add_argument("saida")
    ap.add_argument("--voz", required=True)
    ap.add_argument("--exaggeration", type=float, default=0.45)
    ap.add_argument("--cfg", type=float, default=0.4)
    ap.add_argument("--temp", type=float, default=0.7)
    ap.add_argument("--seed", type=int, default=7)
    a = ap.parse_args()

    torch.set_num_threads(os.cpu_count() or 4)
    torch.manual_seed(a.seed)
    m = ChatterboxMultilingualTTS.from_pretrained(torch.device("cpu"))
    m.prepare_conditionals(a.voz, exaggeration=a.exaggeration)
    sr = m.sr

    paragrafos = [limpar(p) for p in re.split(r"\n\s*\n", open(a.texto, encoding="utf-8").read()) if p.strip()]
    pedacos, tempos, t = [], [], 0.0
    t0 = time.time()
    for pi, par in enumerate(paragrafos):
        fs = frases(par)
        for fi, f in enumerate(fs):
            melhor = None
            for tentativa in range(3):
                w = m.generate(f, language_id="pt", audio_prompt_path=None, exaggeration=a.exaggeration,
                               cfg_weight=a.cfg, temperature=a.temp)[0].numpy()
                w = aparar(w, sr)
                dur = len(w) / sr
                cps = len(f) / max(dur, 0.1)  # caracteres por segundo: fala natural ~ 11 a 17
                ok = 9 <= cps <= 19
                if melhor is None or abs(cps - 14) < abs(melhor[1] - 14):
                    melhor = (w, cps)
                if ok:
                    break
                print(f"  refazendo (cps={cps:.1f}): {f[:50]}", file=sys.stderr)
            w = melhor[0]
            tempos.append({"texto": f, "inicio": round(t, 3), "fim": round(t + len(w) / sr, 3), "paragrafo": pi})
            pedacos.append(w)
            t += len(w) / sr
            ultima = fi == len(fs) - 1
            pausa = PAUSA_PARAGRAFO if ultima else (PAUSA_VIRGULA_LONGA if f.endswith(",") else PAUSA_FRASE)
            pedacos.append(np.zeros(int(pausa * sr), dtype=np.float32))
            t += pausa
            print(f"[{len(tempos)}] {t:7.1f}s  {f[:70]}", flush=True)

    audio = np.concatenate(pedacos).astype(np.float32)
    with tempfile.TemporaryDirectory() as td:
        bruto = os.path.join(td, "bruto.wav")
        torchaudio.save(bruto, torch.from_numpy(audio).unsqueeze(0), sr)
        # tratamento: corta graves inúteis, de-esser leve, compressão suave, loudness de YouTube
        filtro = ("highpass=f=70,lowpass=f=11500,"
                  "deesser=i=0.3,"
                  "acompressor=threshold=-20dB:ratio=2.5:attack=8:release=120:makeup=2,"
                  "loudnorm=I=-16:TP=-1.5:LRA=9")
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", bruto, "-af", filtro,
                        "-ar", "48000", "-ac", "2", a.saida], check=True)
    json.dump(tempos, open(os.path.splitext(a.saida)[0] + ".json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"OK {a.saida}: {t:.1f}s de áudio em {time.time()-t0:.0f}s")


if __name__ == "__main__":
    main()
