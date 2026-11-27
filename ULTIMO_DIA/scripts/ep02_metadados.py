#!/usr/bin/env python3
"""EP02 — legenda .srt (para enviar ao YouTube como legenda/CC) e descrição com capítulos, a partir de projeto/ep02/linha_tempo.json."""
import json, os
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

B = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
L = json.load(open(f'{B}/projeto/ep02/linha_tempo.json', encoding='utf-8'))
os.makedirs(f'{B}/EP02/LEGENDAS', exist_ok=True)

with open(f'{B}/EP02/LEGENDAS/ep02_pt-BR.srt', 'w', encoding='utf-8') as f:
    i = 0
    for fr in L['falas']:
        pedacos = dividir(fr['texto'], BLOCO)
        total, t0 = sum(len(x) for x in pedacos), fr['inicio']
        for k, x in enumerate(pedacos):
            t1 = fr['fim'] if k == len(pedacos) - 1 else t0 + (fr['fim'] - fr['inicio']) * len(x) / total
            i += 1; f.write(f"{i}\n{ts(t0)} --> {ts(t1 + (0.1 if k == len(pedacos) - 1 else 0))}\n{duas_linhas(x)}\n\n"); t0 = t1
print('legenda:', i, 'blocos')

TIT = {1: '06:30, Uma manhã normal', 2: '08:00, O primeiro sinal', 3: '09:15, O alerta', 4: '10:00, A garagem', 5: '11:30, A cidade para',
       6: '13:00, Agora é sério', 7: '14:20, A ligação', 8: '16:00, A decisão', 9: '18:30, O que sobrou', 10: '22:00, A chuva diminui',
       11: '24 horas depois', 12: 'Encerramento'}
caps = ['0:00 Introdução'] + [f"{ts(b['a'], False)} {TIT[b['cap']]}" for b in L['blocos'] if b['tipo'] == 'cartela']
desc = f"""E SE UMA ENCHENTE GIGANTE ATINGISSE SÃO PAULO? 24 HORAS PARA ESCAPAR.

E se uma chuva extrema transformasse um córrego esquecido da zona leste num risco real em poucas horas? Acompanhe Lucas, Rafael, Marina, Dona Cida e o pequeno Pedro nas 24 horas em que um prédio comum precisou decidir a hora certa de sair.

⚠️ SIMULAÇÃO: este vídeo é um cenário hipotético e fictício. Não é notícia, não é previsão e não substitui orientações oficiais. Em uma emergência real, siga sempre a Defesa Civil (telefone 199) e os alertas oficiais.

CAPÍTULOS
{chr(10).join(caps)}

O que lembrar numa enchente:
• Nunca atravesse água em movimento, a pé ou de carro.
• Não entre em garagens subterrâneas durante alagamentos.
• Desligue a energia no quadro de luz se a água começar a entrar.
• Use a escada, não o elevador.
• Saia antes de escurecer e antes de a água subir.

E você? Sairia imediatamente ou esperaria para ver se a água realmente chegaria? Conte nos comentários.

Créditos: personagens, roteiro e animação originais. Vozes sintetizadas com Piper TTS e Chatterbox (código aberto); referências de voz do conjunto CML-TTS (licença CC BY 4.0). Trilha e efeitos sonoros gerados por síntese própria.

#ÚltimoDia #Simulação #Enchente #SãoPaulo #Sobrevivência
"""
open(f'{B}/EP02/EXPORTACAO/ep02_descricao_youtube.txt', 'w', encoding='utf-8').write(desc)
print(desc)
