#!/usr/bin/env python3
"""Gera o mesmo diálogo de teste com Piper e Kokoro, para comparação com o Chatterbox.
Uso: ~/venv_comp/bin/python comparar_tts.py roteiro.txt pasta_saida
"""
import os, re, sys, json, urllib.request
import numpy as np, soundfile as sf

rot, out = sys.argv[1], sys.argv[2]
falas = []
for ln in open(rot, encoding='utf-8'):
    ln = ln.strip()
    if not ln or ln.startswith('#') or ln.startswith('['): continue
    m = re.match(r'^([A-ZÀ-Ú ]+?)\s*(?:\[[a-z]+\])?\s*:\s*(.+)$', ln)
    falas.append((m.group(1).strip().lower().replace(' ', '_'), m.group(2)))


def montar(pedacos, sr, arq):
    gap = np.zeros(int(0.28 * sr), np.float32)
    sf.write(arq, np.concatenate([x for p in pedacos for x in (p, gap)]), sr); print('OK', arq)


# ---- Piper (vozes pt_BR oficiais: todas masculinas) ----
try:
    from piper import PiperVoice
    PV = {'narrador': 'faber', 'lucas': 'cadu', 'rafael': 'jeff', 'marina': 'faber', 'dona_cida': 'cadu', 'pedro': 'jeff'}
    vozes = {}
    for v in set(PV.values()):
        base = f'{out}/pt_BR-{v}-medium'
        for ext in ('.onnx', '.onnx.json'):
            if not os.path.exists(base + ext):
                urllib.request.urlretrieve(f'https://huggingface.co/rhasspy/piper-voices/resolve/main/pt/pt_BR/{v}/medium/pt_BR-{v}-medium{ext}', base + ext)
        vozes[v] = PiperVoice.load(base + '.onnx')
    ped = []
    for p, t in falas:
        v = vozes[PV[p]]
        ped.append(np.concatenate([c.audio_float_array for c in v.synthesize(t)]))
    montar(ped, vozes['faber'].config.sample_rate, f'{out}/teste_vozes_piper.wav')
except Exception as e:
    print('Piper falhou:', repr(e))

# ---- Kokoro (pt-br: pf_dora feminina, pm_alex e pm_santa masculinas) ----
try:
    from kokoro import KPipeline
    kp = KPipeline(lang_code='p')
    KV = {'narrador': 'pm_santa', 'lucas': 'pm_alex', 'rafael': 'pm_santa', 'marina': 'pf_dora', 'dona_cida': 'pf_dora', 'pedro': 'pf_dora'}
    ped = []
    for p, t in falas:
        ped.append(np.concatenate([np.asarray(a) for _, _, a in kp(t, voice=KV[p])]))
    montar(ped, 24000, f'{out}/teste_vozes_kokoro.wav')
except Exception as e:
    print('Kokoro falhou:', repr(e))
