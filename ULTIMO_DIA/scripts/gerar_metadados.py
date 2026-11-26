#!/usr/bin/env python3
"""Gera legendas .srt e a descrição do YouTube (com capítulos) a partir da linha do tempo."""
import json, sys
ep = sys.argv[1]; L = json.load(open(f'../projeto/{ep}/linha_tempo.json', encoding='utf-8'))
def ts(s, srt=True):
    h, m, x = int(s // 3600), int(s % 3600 // 60), s % 60
    return f'{h:02d}:{m:02d}:{int(x):02d},{int((x % 1) * 1000):03d}' if srt else (f'{h}:{m:02d}:{int(x):02d}' if h else f'{m}:{int(x):02d}')
with open(f'../legendas/{ep}_pt-BR.srt', 'w', encoding='utf-8') as f:
    for i, fr in enumerate(L['frases'], 1): f.write(f"{i}\n{ts(fr['inicio'])} --> {ts(fr['fim'] + 0.1)}\n{fr['texto']}\n\n")
caps = {1: 'Dia 1, O apagão', 2: 'Dia 2, A água para', 3: 'Dia 3, Silêncio', 4: 'Dia 5, A geladeira', 5: 'Dia 7, Dona Cida', 6: 'Dia 10, Calor e lixo',
        7: 'Dia 13, A comida acaba', 8: 'Dia 16, A noite', 9: 'Dia 19, A decisão', 10: 'Dia 23, Comunidade', 11: 'Dia 27, O boato', 12: 'Dia 30, A luz volta'}
linhas = ['0:00 Introdução'] + [f"{ts(b['a'], False)} {caps[b['cap']]}" for b in L['blocos'] if b['tipo'] == 'cartela']
desc = f"""O BRASIL FICOU 30 DIAS SEM ENERGIA ELÉTRICA. O QUE ACONTECEU?

E se, amanhã de manhã, o Brasil acordasse sem energia elétrica, por trinta dias? Acompanhe Lucas, um morador comum da zona leste de São Paulo, e descubra como um prédio inteiro aprendeu a sobreviver junto.

⚠️ SIMULAÇÃO: este vídeo é um cenário hipotético e fictício. Não é notícia nem previsão.

CAPÍTULOS
""" + '\n'.join(linhas) + """

E você, diante de uma situação dessas, ficaria na cidade ou iria embora? Conte nos comentários.

Próximo episódio: e se a internet desaparecesse para sempre?

#ÚltimoDia #Simulação #Apagão #Sobrevivência
"""
open(f'../exports/{ep}_descricao_youtube.txt', 'w', encoding='utf-8').write(desc)
print(desc)
