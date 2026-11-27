#!/usr/bin/env python3
"""Gera legendas .srt e a descrição do YouTube (com capítulos) a partir da linha do tempo."""
import json, sys
ep = sys.argv[1]; L = json.load(open(f'../projeto/{ep}/linha_tempo.json', encoding='utf-8'))
def ts(s, srt=True):
    h, m, x = int(s // 3600), int(s % 3600 // 60), s % 60
    return f'{h:02d}:{m:02d}:{int(x):02d},{int((x % 1) * 1000):03d}' if srt else (f'{h}:{m:02d}:{int(x):02d}' if h else f'{m}:{int(x):02d}')
LINHA, BLOCO = 42, 84  # padrão de legenda: até 2 linhas de ~42 caracteres

def dividir(texto, maximo):
    """Divide em pedaços <= maximo, preferindo cortar depois de vírgula e equilibrando os tamanhos."""
    if len(texto) <= maximo: return [texto]
    n = -(-len(texto) // maximo)
    alvo = len(texto) / n
    pal, pedacos, atual = texto.split(), [], ''
    for k, w in enumerate(pal):
        cand = (atual + ' ' + w).strip()
        resto = ' '.join(pal[k:])
        if atual and (len(cand) > maximo or (len(atual) >= alvo * 0.7 and atual.endswith(',') and len(resto) > 12)):
            pedacos.append(atual); atual = w
        else: atual = cand
    pedacos.append(atual)
    if len(pedacos) > 1 and len(pedacos[-1].split()) == 1:  # sem palavra órfã
        a = pedacos[-2].split(); pedacos[-2] = ' '.join(a[:-1]); pedacos[-1] = a[-1] + ' ' + pedacos[-1]
    return pedacos

def duas_linhas(t):
    if len(t) <= LINHA: return t
    pal = t.split(); melhor = None
    for k in range(1, len(pal)):
        a, b = ' '.join(pal[:k]), ' '.join(pal[k:])
        custo = abs(len(a) - len(b)) + (0 if a.endswith(',') else 6) + (99 if max(len(a), len(b)) > LINHA + 4 else 0)
        if melhor is None or custo < melhor[0]: melhor = (custo, a + '\n' + b)
    return melhor[1]

with open(f'../legendas/{ep}_pt-BR.srt', 'w', encoding='utf-8') as f:
    i = 0
    for fr in L['frases']:
        pedacos = dividir(fr['texto'], BLOCO)
        total, t0 = sum(len(x) for x in pedacos), fr['inicio']
        for k, x in enumerate(pedacos):
            t1 = fr['fim'] if k == len(pedacos) - 1 else t0 + (fr['fim'] - fr['inicio']) * len(x) / total
            i += 1; f.write(f"{i}\n{ts(t0)} --> {ts(t1 + (0.1 if k == len(pedacos) - 1 else 0))}\n{duas_linhas(x)}\n\n"); t0 = t1
caps = {1: 'Dia 1, O apagão', 2: 'Dia 2, A água para', 3: 'Dia 3, Silêncio', 4: 'Dia 5, A geladeira', 5: 'Dia 7, Dona Cida', 6: 'Dia 10, Calor e lixo',
        7: 'Dia 13, A comida acaba', 8: 'Dia 16, A noite', 9: 'Dia 19, A decisão', 10: 'Dia 23, Comunidade', 11: 'Dia 27, O boato', 12: 'Dia 30, A luz volta'}
linhas = ['0:00 Introdução'] + [f"{ts(b['a'], False)} {caps[b['cap']]}" for b in L['blocos'] if b['tipo'] == 'cartela']
desc = f"""O BRASIL FICOU 30 DIAS SEM ENERGIA ELÉTRICA. O QUE ACONTECEU?

E se, amanhã de manhã, o Brasil acordasse sem energia elétrica, por trinta dias? Acompanhe Lucas, um morador comum da zona leste de São Paulo, e descubra como um prédio inteiro aprendeu a sobreviver junto.

⚠️ SIMULAÇÃO: este vídeo é um cenário hipotético e fictício. Não é notícia nem previsão.

CAPÍTULOS
""" + '\n'.join(linhas) + """

E você, diante de uma situação dessas, ficaria na cidade ou iria embora? Conte nos comentários.

Próximo vídeo: e se a internet desaparecesse para sempre?

#ÚltimoDia #Simulação #Apagão #Sobrevivência
"""
open(f'../exports/{ep}_descricao_youtube.txt', 'w', encoding='utf-8').write(desc)
print(desc)
