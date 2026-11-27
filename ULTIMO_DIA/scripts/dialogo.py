#!/usr/bin/env python3
"""Gera diálogos com várias vozes (Chatterbox Multilingual, licença MIT, local, sem custo).

Uso:
  ~/venv_voz/bin/python dialogo.py roteiro.txt saida.wav --elenco elenco.json [--tentativas 4]

Formato do roteiro (uma fala por linha):
  LUCAS: Rafael, você viu a quantidade de água lá fora?
  MARINA [interrompe]: Pedro!          -> entra por cima do fim da fala anterior
  RAFAEL [rapido]: Peguei.             -> resposta imediata
  [pausa 0.8]                          -> silêncio
  [Lucas olha pela janela.]            -> indicação visual: NUNCA vai para a voz
  # comentário                         -> ignorado

Cada fala é gerada separadamente com a voz do personagem, conferida pelo Whisper (refeita se uma
palavra sair errada), tratada (filtro, de-esser, compressor), nivelada por volume e montada.
Saída: WAV 48 kHz estéreo e um .json com personagem, texto, início e fim de cada fala.
"""
import argparse, difflib, json, os, re, subprocess, sys, tempfile, unicodedata
os.environ.setdefault('HF_HUB_DISABLE_XET', '1')
import numpy as np, soundfile as sf, librosa
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from narrar import torch, ChatterboxMultilingualTTS, aparar, limpar
from faster_whisper import WhisperModel

SR_OUT = 48000
GAP = {'normal': 0.26, 'rapido': 0.08, 'narracao': 0.55, 'interrompe': -0.28}


def norm(s):
    s = unicodedata.normalize('NFKD', s.lower()); s = ''.join(c for c in s if not unicodedata.combining(c))
    return re.sub(r'[^a-z0-9 ]', ' ', s).split()


NUM = {'1': 'um', '2': 'dois', '3': 'tres', '12': 'doze', '20': 'vinte', '24': 'vinte e quatro', '30': 'trinta', '100': 'cem'}


def semelhanca(ref, ouvido):
    o = ' '.join(NUM.get(w, w) for w in norm(ouvido)).split()
    return difflib.SequenceMatcher(None, norm(ref), o).ratio()


def ler_roteiro(arq):
    itens = []
    for ln in open(arq, encoding='utf-8'):
        ln = ln.strip()
        if not ln or ln.startswith('#'): continue
        m = re.match(r'^\[pausa\s+([\d.]+)\]$', ln, re.I)
        if m: itens.append({'pausa': float(m.group(1))}); continue
        if ln.startswith('['): continue  # indicação de cena: não é fala
        m = re.match(r'^([A-ZÀ-Ú ]+?)\s*(?:\[([a-z]+)\])?\s*(?:,[^:]*)?:\s*(.+)$', ln)
        if not m: sys.exit(f'linha não reconhecida: {ln}')
        nome, modo, texto = m.group(1).strip().lower().replace(' ', '_'), m.group(2), m.group(3)
        texto = re.sub(r'\[[^\]]*\]', '', texto).strip()  # tira indicações dentro da fala
        itens.append({'personagem': nome, 'modo': modo, 'texto': texto})
    return itens


def tratar(w, sr):
    with tempfile.TemporaryDirectory() as td:
        sf.write(f'{td}/a.wav', w, sr)
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', f'{td}/a.wav', '-af',
                        'highpass=f=75,lowpass=f=11500,deesser=i=0.3,acompressor=threshold=-20dB:ratio=2.5:attack=8:release=120:makeup=2',
                        '-ar', str(SR_OUT), '-ac', '1', f'{td}/b.wav'], check=True)
        y, _ = sf.read(f'{td}/b.wav', dtype='float32')
    rms = librosa.feature.rms(y=y, frame_length=2048, hop_length=512)[0]
    ativo = rms[rms > rms.max() * 0.1]
    alvo = 10 ** (-19 / 20)  # mesmo volume para todos os personagens
    return y * (alvo / (np.sqrt(np.mean(ativo ** 2)) + 1e-9))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('roteiro'); ap.add_argument('saida'); ap.add_argument('--elenco', required=True)
    ap.add_argument('--tentativas', type=int, default=4)
    a = ap.parse_args()
    elenco = json.load(open(a.elenco, encoding='utf-8'))
    base = os.path.dirname(os.path.abspath(a.elenco))
    itens = ler_roteiro(a.roteiro)

    torch.set_num_threads(os.cpu_count() or 4)
    m = ChatterboxMultilingualTTS.from_pretrained(torch.device('cpu'))
    wm = WhisperModel('medium', device='cpu', compute_type='int8')
    conds, piper = {}, {}
    for nome in {i['personagem'] for i in itens if 'personagem' in i}:
        if nome not in elenco: sys.exit(f'personagem sem voz no elenco: {nome}')
        p = elenco[nome]
        if p.get('motor') == 'piper':  # Piper: velocidade 1.2 = length_scale 1/1.2
            from piper import PiperVoice, SynthesisConfig
            vel = p.get('velocidade', 1.0)
            # tentativas: velocidade pedida primeiro; se uma palavra curta sair errada, vai desacelerando
            cfgs = [SynthesisConfig(length_scale=1 / v, noise_scale=n, noise_w_scale=0.8)
                    for v, n in [(vel, 0.667), (vel, 0.4), (min(vel, 1.1), 0.5), (1.0, 0.667), (0.9, 0.5), (0.8, 0.4)]]
            piper[nome] = (PiperVoice.load(os.path.join(base, p['voz'])), cfgs)
        else:
            m.prepare_conditionals(os.path.join(base, p['voz']), exaggeration=p.get('exaggeration', 0.5))
            conds[nome] = m.conds

    falas, log = [], []
    for k, it in enumerate(itens):
        if 'pausa' in it: falas.append(it); continue
        p = elenco[it['personagem']]; texto = limpar(it['texto'])
        melhor = None
        for t in range(a.tentativas if it['personagem'] not in piper else len(piper[it['personagem']][1])):
            if it['personagem'] in piper:
                v, cfgs = piper[it['personagem']]; sr = v.config.sample_rate
                w = np.concatenate([c.audio_float_array for c in v.synthesize(texto, syn_config=cfgs[t])])
            else:
                m.conds = conds[it['personagem']]; sr = m.sr
                torch.manual_seed(p.get('seed', 7) + 101 * t + k)
                ex = it.get('exaggeration', p.get('exaggeration', 0.5))
                w = m.generate(texto, language_id='pt', exaggeration=ex, cfg_weight=p.get('cfg', 0.4), temperature=p.get('temp', 0.75))[0].numpy()
            w = aparar(w, sr)
            segs = list(wm.transcribe(librosa.resample(w, orig_sr=sr, target_sr=16000), language='pt', beam_size=5, word_timestamps=True)[0])
            ouvido = ' '.join(s.text for s in segs)
            pal = [x for s in segs for x in (s.words or [])]
            if pal:  # corta sobras do modelo (ruídos/sílabas soltas) depois da última palavra e antes da primeira
                i0, i1 = max(0, int((pal[0].start - 0.10) * sr)), int((pal[-1].end + 0.18) * sr)
                w = w[i0:min(i1, len(w))]
            dur = len(w) / sr; cps = len(texto) / max(dur, 0.1)
            sem = semelhanca(texto, ouvido)
            nota = sem - (0.25 if not 6 <= cps <= (24 if it['personagem'] in piper else 20) else 0) - 0.01 * t  # prefere a 1ª tentativa (velocidade pedida)
            if melhor is None or nota > melhor[0]: melhor = (nota, w, ouvido, sem, cps, sr)
            if sem >= 0.95 and 6 <= cps <= (24 if it['personagem'] in piper else 20): break
        _, w, ouvido, sem, cps, sr = melhor
        print(f"[{k+1}/{len(itens)}] {it['personagem']:9} {sem:5.0%} cps={cps:4.1f}  {texto}  ->  {ouvido.strip()}", flush=True)
        log.append({'personagem': it['personagem'], 'texto': texto, 'ouvido': ouvido.strip(), 'semelhanca': round(sem, 3)})
        falas.append({**it, 'texto': texto, 'audio': tratar(w, sr)})

    # montagem
    pedacos, tempos, t = [], [], 0.0
    pos = []
    for k, f in enumerate(falas):
        if 'pausa' in f: t += f['pausa']; continue
        modo = f.get('modo') or ('narracao' if f['personagem'] == 'narrador' or (k and falas[k-1].get('personagem') == 'narrador') else 'normal')
        if k: t += GAP.get(modo, GAP['normal'])
        t = max(t, 0.0)
        pan = elenco[f['personagem']].get('pan', 0.0)
        pos.append((t, f['audio'], pan))
        tempos.append({'personagem': f['personagem'], 'texto': f['texto'], 'inicio': round(t, 3), 'fim': round(t + len(f['audio']) / SR_OUT, 3)})
        t += len(f['audio']) / SR_OUT
    mix = np.zeros((int((t + 0.5) * SR_OUT), 2), np.float32)
    for t0, y, pan in pos:
        i = int(t0 * SR_OUT); g = np.array([np.sqrt(0.5 - pan / 2), np.sqrt(0.5 + pan / 2)]) * np.sqrt(2)
        mix[i:i + len(y)] += y[:, None] * g[None, :]
    with tempfile.TemporaryDirectory() as td:
        sf.write(f'{td}/m.wav', mix, SR_OUT, subtype='FLOAT')
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', f'{td}/m.wav', '-af', 'loudnorm=I=-16:TP=-1.5:LRA=9',
                        '-ar', str(SR_OUT), '-ac', '2', a.saida], check=True)
    base_saida = os.path.splitext(a.saida)[0]
    json.dump(tempos, open(base_saida + '.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    json.dump(log, open(base_saida + '_verificacao.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(f'OK {a.saida}: {t:.1f}s, precisão média {np.mean([l["semelhanca"] for l in log]):.1%}')


if __name__ == '__main__':
    main()
