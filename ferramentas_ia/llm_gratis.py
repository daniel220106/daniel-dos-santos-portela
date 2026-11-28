#!/usr/bin/env python3
"""Usa LLMs grátis em ordem de qualidade, trocando de provedor quando a cota acaba.

Uso:
  python3 llm_gratis.py "sua pergunta"            -> resposta (mostra no stderr qual provedor respondeu)
  python3 llm_gratis.py --status                   -> quais provedores estão configurados / pausados
  python3 llm_gratis.py --testar                   -> manda um "oi" para cada provedor e mostra quem responde
No código:  from llm_gratis import perguntar; texto, quem = perguntar("...")

Ordem e modelos: llm_gratis.json (de cima = melhor). Chaves: variáveis de ambiente (GEMINI_API_KEY etc.).
Quando um modelo devolve 429 (cota) fica pausado 1 h (ou o tempo que ele informar); se demorar mais de 60 s, 10 min; se não existir mais (404), 1 dia. As pausas ficam em
~/.cache/llm_gratis_pausas.json e o próximo da lista assume. Só usa biblioteca padrão do Python.
"""
import json, os, sys, time, urllib.request, urllib.error

AQUI = os.path.dirname(os.path.abspath(__file__))
CFG = json.load(open(os.path.join(AQUI, 'llm_gratis.json'), encoding='utf-8'))
PAUSAS = os.path.expanduser('~/.cache/llm_gratis_pausas.json')
# Na nuvem do Claude Code a chave fica salva no ambiente e o proxy a injeta: basta um valor qualquer.
PROXY_INJETA = bool(os.environ.get('HTTPS_PROXY') or os.environ.get('https_proxy')) and os.environ.get('LLM_GRATIS_SEM_PROXY') != '1'

def _pausas():
    try: return json.load(open(PAUSAS))
    except Exception: return {}

def _pausar(chave, seg):
    p = _pausas(); p[chave] = time.time() + seg
    os.makedirs(os.path.dirname(PAUSAS), exist_ok=True); json.dump(p, open(PAUSAS, 'w'))

def _chave(prov):
    if not prov['chave_env']: return None
    v = os.environ.get(prov['chave_env'])
    if v: return v
    return 'injetada-pelo-proxy' if PROXY_INJETA else ''

def _chamar(prov, modelo, msgs, max_tokens, temperatura, timeout):
    corpo = json.dumps({'model': modelo, 'messages': msgs, 'max_tokens': max_tokens, 'temperature': temperatura}).encode()
    cab = {'Content-Type': 'application/json', 'User-Agent': 'llm-gratis/1.0'}
    k = _chave(prov)
    if k: cab['Authorization'] = 'Bearer ' + k
    req = urllib.request.Request(prov['base'].rstrip('/') + '/chat/completions', data=corpo, headers=cab)
    with urllib.request.urlopen(req, timeout=timeout) as r:
        d = json.load(r)
    txt = d['choices'][0]['message'].get('content')
    if not txt or not txt.strip(): raise ValueError('resposta vazia (o modelo gastou os tokens pensando)')
    return txt

def perguntar(pergunta, sistema=None, max_tokens=2048, temperatura=0.7, timeout=60, verbose=True):
    msgs = ([{'role': 'system', 'content': sistema}] if sistema else []) + [{'role': 'user', 'content': pergunta}]
    pausas, erros = _pausas(), []
    for prov in CFG['provedores']:
        if prov['chave_env'] and _chave(prov) == '':
            erros.append(f"{prov['nome']}: sem chave ({prov['chave_env']})"); continue
        for modelo in prov['modelos']:
            id_ = f"{prov['nome']}|{modelo}"
            if pausas.get(id_, 0) > time.time(): erros.append(f'{id_}: pausado (cota)'); continue
            try:
                txt = _chamar(prov, modelo, msgs, max_tokens, temperatura, timeout)
                if verbose: print(f'[respondido por {prov["nome"]} / {modelo}]', file=sys.stderr)
                return txt, f'{prov["nome"]} / {modelo}'
            except urllib.error.HTTPError as e:
                msg = e.read()[:200].decode(errors='replace')
                if e.code == 429:
                    ra = e.headers.get('Retry-After'); _pausar(id_, float(ra) if ra and ra.isdigit() else 3600)
                elif e.code == 404:
                    _pausar(id_, 86400)  # modelo descontinuado/inexistente: tenta de novo só amanhã
                elif e.code in (401, 403) or (e.code == 400 and 'API key' in msg):
                    erros.append(f"{prov['nome']}: chave ausente/inválida ou acesso bloqueado ({e.code})"); break
                erros.append(f'{id_}: HTTP {e.code} {msg}')
            except Exception as e:
                if 'timed out' in str(e) or isinstance(e, TimeoutError): _pausar(id_, 600)  # lento/sobrecarregado: pula por 10 min
                erros.append(f'{id_}: {type(e).__name__} {e}')
    raise RuntimeError('Nenhum provedor grátis respondeu:\n  ' + '\n  '.join(erros))

if __name__ == '__main__':
    a = sys.argv[1:]
    if not a: print(__doc__); sys.exit(1)
    if a[0] == '--status':
        p = _pausas()
        for prov in CFG['provedores']:
            k = 'sem chave necessária' if not prov['chave_env'] else ('chave OK' if os.environ.get(prov['chave_env']) else ('chave via proxy (se salva no ambiente)' if PROXY_INJETA else f"FALTA {prov['chave_env']}"))
            pz = [m for m in prov['modelos'] if p.get(f"{prov['nome']}|{m}", 0) > time.time()]
            print(f"{prov['nome']:24} {k}{'  pausados: ' + ', '.join(pz) if pz else ''}")
    elif a[0] == '--testar':
        for prov in CFG['provedores']:
            m = prov['modelos'][0]
            try: print(f"OK    {prov['nome']} / {m}: {_chamar(prov, m, [{'role': 'user', 'content': 'Responda só: oi'}], 400, 0, 90).strip()[:40]}")
            except urllib.error.HTTPError as e: print(f"FALHA {prov['nome']} / {m}: HTTP {e.code} {e.read()[:120].decode(errors='replace')}")
            except Exception as e: print(f"FALHA {prov['nome']} / {m}: {type(e).__name__} {str(e)[:120]}")
    else:
        print(perguntar(' '.join(a))[0])
