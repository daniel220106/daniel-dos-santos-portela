#!/usr/bin/env python3
"""Vídeo 3 — legenda .srt (para enviar ao YouTube como legenda/CC) e descrição com capítulos, a partir de projeto/video03/linha_tempo.json."""
import json, os, re
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
L = json.load(open(f'{B}/projeto/video03/linha_tempo.json', encoding='utf-8'))
assert not L.get('provisoria'), 'linha do tempo provisória: gere as vozes e rode video03_linha_tempo.py'
os.makedirs(f'{B}/VIDEO_03/LEGENDAS', exist_ok=True); os.makedirs(f'{B}/VIDEO_03/EXPORTACAO', exist_ok=True)

# na legenda, números falados por extenso aparecem em algarismos (a voz fala por extenso para pronunciar certo)
NA_TELA = {'trezentos e dois': '302', 'cento e noventa e dois': '192'}
def tela(t):
    for x, y in NA_TELA.items(): t = t.replace(x, y)
    return t
with open(f'{B}/VIDEO_03/LEGENDAS/video03_pt-BR.srt', 'w', encoding='utf-8') as f:
    i = 0
    for fr in L['falas']:
        pedacos = dividir(tela(fr['texto']), BLOCO)
        total, t0 = sum(len(x) for x in pedacos), fr['inicio']
        for k, x in enumerate(pedacos):
            t1 = fr['fim'] if k == len(pedacos) - 1 else t0 + (fr['fim'] - fr['inicio']) * len(x) / total
            i += 1; f.write(f"{i}\n{ts(t0)} --> {ts(t1 + (0.1 if k == len(pedacos) - 1 else 0))}\n{duas_linhas(x)}\n\n"); t0 = t1
print('legenda:', i, 'blocos')

caps = ['0:00 Dia 4, 02:40: a madrugada']
for b in L['blocos']:
    if b['tipo'] == 'cartela': caps.append(f"{ts(b['a'], False)} {b['dia'].title()}, {b['hora']}, {b['temp']}: {b['titulo'].capitalize()}")
enc = next(b for b in L['blocos'] if b['tipo'] == 'cap' and b['cap'] == 10); caps.append(f"{ts(enc['a'], False)} Encerramento")
desc = f"""50°C no Rio: 5 Dias Para Sobreviver

E se uma onda de calor nunca vista parasse sobre o Rio de Janeiro e não fosse embora? Acompanhe o Caio, a Vó Nena, a Duda e a cachorra Pipoca em cinco dias num prédio sem elevador da Zona Norte: a luz cai, a água acaba, um vizinho some e uma decisão na madrugada muda tudo.

⚠️ SIMULAÇÃO: este vídeo é um cenário hipotético e fictício. O Rio de Janeiro nunca registrou 50 °C no termômetro; a maior temperatura já medida no Brasil foi 44,8 °C (Araçuaí, MG, 2023, Inmet). Não é notícia nem previsão e não substitui orientação médica ou da Defesa Civil.

CAPÍTULOS
{chr(10).join(caps)}

O que a história mostra (orientações gerais de segurança):
• Exaustão pelo calor (tontura, dor de cabeça, enjoo, fraqueza): pare, vá para a sombra, beba água e esfrie o corpo.
• Confusão mental, fala sem sentido ou desmaio no calor podem ser golpe de calor: é emergência. Ligue 192 (SAMU) na hora e comece a resfriar a pessoa enquanto o socorro chega. A pele pode estar seca ou suada. Não dê nada para beber a quem está confuso.
• Idosos sentem menos sede e às vezes não percebem o superaquecimento: ofereça água e confira quem mora sozinho.
• Evite o sol forte entre 10h e 16h.
• Insulina: na geladeira, nas prateleiras (não na porta). Sem energia, num isopor com gelo, sem encostar no gelo; se congelar, não use. Na dúvida, pergunte ao seu médico ou farmacêutico.
• Gerador portátil: só ao ar livre, longe de portas e janelas. Nunca dentro de casa ou na garagem (monóxido de carbono).
• Cachorro ofegando muito, babando e fraco: sombra, água fresca (não gelada), patas e barriga molhadas, e procure um veterinário.

E você? No segundo dia, a Vó Nena saiu no sol das duas da tarde para levar comida a um vizinho que mora sozinho. Ela estava certa ou errada? Conte nos comentários.

Créditos: história, personagens e animação originais do canal E SE ACONTECER?. Vozes sintetizadas com Piper TTS e Chatterbox (código aberto), a partir de referências do conjunto CML-TTS (licença CC BY 4.0). Trilha, efeitos e a fita da Dona Lurdes gerados por síntese própria.

#ESeAcontecer #Simulação #OndaDeCalor #RioDeJaneiro #Sobrevivência
"""
assert not re.search(r'(?i)ltimo dia|epis[oó]dio', desc), 'identidade antiga na descrição'
open(f'{B}/VIDEO_03/EXPORTACAO/video03_descricao_youtube.txt', 'w', encoding='utf-8').write(desc)
print(desc[:400])
