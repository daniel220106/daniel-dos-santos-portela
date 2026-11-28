#!/usr/bin/env python3
"""Regrava uma fala já montada SEM mudar a linha do tempo (o vídeo renderizado continua valendo).
Gera várias tentativas novas (novas sementes), confere com o Whisper e só aceita uma que caiba no espaço
até a próxima fala. Substitui o trecho no capNN.wav (mesmo volume do trecho antigo) e no cache.
Uso: ~/venv_voz/bin/python regravar_fala.py VIDEO_03/AUDIO/cap04_a_reuniao "Dorme, vó." [--tentativas 12]"""
import argparse, hashlib, json, os, sys
import numpy as np, soundfile as sf, librosa
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from dialogo import ChatterboxMultilingualTTS, WhisperModel, torch, aparar, limpar, tratar, semelhanca, ler_roteiro, SR_OUT

ap = argparse.ArgumentParser(); ap.add_argument('cap'); ap.add_argument('texto'); ap.add_argument('--tentativas', type=int, default=12)
ap.add_argument('--elenco', default='VIDEO_03/PROJETO/elenco_video03.json'); ap.add_argument('--roteiro_dir', default='VIDEO_03/ROTEIRO')
a = ap.parse_args()
nome_cap = os.path.basename(a.cap)
F = json.load(open(a.cap + '.json', encoding='utf-8'))
k = next(i for i, f in enumerate(F) if f['texto'] == a.texto)
f = F[k]; prox = F[k + 1]['inicio'] if k + 1 < len(F) else f['fim'] + 0.6
limite = prox - f['inicio'] - 0.12
el = json.load(open(a.elenco, encoding='utf-8')); p = el[f['personagem']]; base = os.path.dirname(os.path.abspath(a.elenco))
it = next(i for i in ler_roteiro(os.path.join(a.roteiro_dir, nome_cap + '.txt')) if 'texto' in i and limpar(i['texto']) == a.texto)
tel = it.get('modo') == 'telefone'
chave = hashlib.sha1(json.dumps([f['personagem'], p, a.texto, tel], sort_keys=True, ensure_ascii=False).encode()).hexdigest()[:16]
arq_cache = os.path.join(os.path.dirname(a.cap), 'cache_falas', chave + '.npz'); assert os.path.exists(arq_cache), arq_cache

torch.set_num_threads(os.cpu_count() or 4)
m = ChatterboxMultilingualTTS.from_pretrained(torch.device('cpu')); wm = WhisperModel('medium', device='cpu', compute_type='int8')
m.prepare_conditionals(os.path.join(base, p['voz']), exaggeration=p.get('exaggeration', 0.5))
ouv = lambda y, sr: ' '.join(s.text for s in wm.transcribe(librosa.resample(y, orig_sr=sr, target_sr=16000), language='pt', beam_size=5)[0]).strip()
melhor = None
for t in range(200, 200 + a.tentativas):
    torch.manual_seed(p.get('seed', 7) + 101 * t + k)
    w = aparar(m.generate(a.texto, language_id='pt', exaggeration=p.get('exaggeration', 0.5), cfg_weight=p.get('cfg', 0.4), temperature=p.get('temp', 0.75))[0].numpy(), m.sr)
    aud = tratar(w, m.sr, tel, p.get('velocidade', 1.0)); dur = len(aud) / SR_OUT
    # confere duas vezes (beam diferente não existe no faster-whisper sem custo; usa o áudio final tratado)
    o = ouv(aud, SR_OUT); s = semelhanca(a.texto, o)
    cabe = dur <= limite
    print(f'tentativa {t}: {s:.0%} {dur:.2f}s (limite {limite:.2f}s) {"" if cabe else "NÃO CABE "}→ {o}', flush=True)
    if cabe and (melhor is None or s > melhor[0]): melhor = (s, aud, o)
    if cabe and s >= 0.99: break
if melhor is None or melhor[0] < 0.95: sys.exit(f'nenhuma tentativa boa o bastante (melhor: {melhor and melhor[0]:.0%}); nada foi alterado')
s, aud, o = melhor; dur_antes = f["fim"] - f["inicio"]
y, sr = sf.read(a.cap + '.wav', dtype='float32'); assert sr == SR_OUT
i0, i1 = int(f['inicio'] * sr), int(f['fim'] * sr)
alvo = np.sqrt(np.mean(y[i0:i1] ** 2)); g = alvo / (np.sqrt(np.mean(aud ** 2)) + 1e-9)
pan = p.get('pan', 0.0); ch = np.array([np.sqrt(0.5 - pan / 2), np.sqrt(0.5 + pan / 2)]) * np.sqrt(2)
fim_novo = f['inicio'] + len(aud) / sr
y[i0:max(i1, int(fim_novo * sr))] = 0  # o trecho antigo só tinha esta fala (falas seguintes começam depois de `prox`)
y[i0:i0 + len(aud)] += (aud * g)[:, None] * ch[None, :] if y.ndim == 2 else aud * g
sf.write(a.cap + '.wav', y, sr, subtype='PCM_16' if sf.info(a.cap + '.wav').subtype == 'PCM_16' else sf.info(a.cap + '.wav').subtype)
np.savez(arq_cache, audio=aud, ouvido=o, sem=s)
F[k]['fim'] = round(fim_novo, 3)
n = SR_OUT // 30; env = np.sqrt(np.mean(aud[:len(aud) // n * n].reshape(-1, n) ** 2, axis=1)); F[k]['boca'] = [round(float(x), 2) for x in np.clip(env / (env.max() + 1e-9), 0, 1)]
json.dump(F, open(a.cap + '.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
V = json.load(open(a.cap + '_verificacao.json', encoding='utf-8'))
for v in V:
    if v['texto'] == a.texto and v['personagem'] == f['personagem']: v['ouvido'], v['semelhanca'] = o, round(s, 3)
json.dump(V, open(a.cap + '_verificacao.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(f'OK trocada: {s:.0%} "{o}" ({len(aud)/sr:.2f}s; antes {dur_antes:.2f}s); próximas falas no mesmo lugar')
