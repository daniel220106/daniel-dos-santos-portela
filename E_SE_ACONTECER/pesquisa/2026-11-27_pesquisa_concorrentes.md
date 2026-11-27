# Pesquisa de concorrentes: próximo vídeo (Vídeo 3)

- **Consulta:** 27/11/2026.
- **Fonte:** dados públicos do YouTube, obtidos de três formas:
  - buscas e listagens de canais pelo yt-dlp;
  - feed RSS público de cada canal;
  - página de vídeos do canal.
- **Dados brutos:** em `2026-11-27_dados/`.

## Como os números foram obtidos (e limites)

- **Visualizações exatas e data exata:** vêm do feed RSS do canal (`youtube.com/feeds/videos.xml`). O feed só traz os 15 vídeos mais recentes.
- **Visualizações arredondadas:** vêm da listagem do canal (por exemplo "4,3 mi"). Valem para os vídeos que já saíram do RSS. A data desses vídeos é relativa ("há 3 semanas"), tirada da página de vídeos do canal.
- **"Vezes a mediana":** é a visualização do vídeo dividida pela mediana dos últimos vídeos longos do mesmo canal. Até 60 vídeos, contagens arredondadas. É o método da skill /yt-viral.
- **O que não foi possível analisar:**
  - os primeiros 30 segundos, os diálogos e o ritmo interno;
  - curtidas e comentários;
  - o selo "conteúdo alterado ou sintético".

  Motivo: a página de cada vídeo devolveu o bloqueio anti-robô do Google para este servidor. Não tentei contornar.
- **IA × animação tradicional:** nenhum caso foi confirmado.
  - As descrições dos canais dizem apenas "original animated survival series" (One Year Inside) e "Animated survival stories" (Headlamp Guy). Nenhuma declara IA.
  - Fato observável: as thumbnails de seis canais diferentes têm estilo quase idêntico. É sempre o mesmo boneco simples de rosto branco sobre cenários pintados muito detalhados. Isso **não prova** nada sobre o método de produção.

## O que os dados mostram

1. **É uma onda muito recente.** Quase todos os canais de "sobrevivência animada" encontrados publicaram tudo entre outubro e novembro de 2026. São canais de 700 a 41 mil inscritos com vídeos de 100 mil a 4 milhões de visualizações em poucas semanas.
2. **A premissa é sempre a mesma:** uma pessoa comum, presa num lugar ou num clima extremo, com o tempo contado ("100 horas", "5 dias", "1 ano", "Dia 1 ao Dia 100", "10 anos").
3. **O título é curto e cabe na thumbnail:** um número grande (o tempo ou a temperatura) mais o lugar ou a situação.
4. **As thumbnails seguem o mesmo padrão:**
   - um personagem só, com expressão de preocupação, em primeiro plano;
   - o cenário extremo atrás dele (cidade inundada, cidade congelada, porão em chamas);
   - um número enorme no canto ("1 YEAR", "-100°C", "DAY 365", "10 YEARS").
5. **As séries viram "Full Story/Full Movie".** Os canais publicam em partes e depois uma compilação longa, de 30 a 50 minutos. Essas compilações estão entre os maiores sucessos: One Year Inside teve 4,3 mi em 48 min, e Archival Survival Stories teve 344 mil em 49 min, cerca de 60 vezes a sua mediana.
6. **Acima de 10 milhões, dentro do formato,** só apareceram vídeos antigos ou de outro tipo:
   - MrBeast (desafios reais);
   - Minecraft "100 days";
   - What If "What If the Sun Exploded Tomorrow?", 11,4 mi, em 3D;
   - Dr. Plants "Simulating Africa for 100 Days", 80,9 mi, uma simulação.

   Nenhum é animação 2D narrativa recente.

## Vídeos de referência (verificados)

| Vídeo | Canal (inscritos) | Visualizações | Data | Duração | × mediana |
|---|---|---|---|---|---|
| [Trapped In Walmart After Closing 1 Year (Full Story)](https://www.youtube.com/watch?v=3pkkFlH7-pU) | One Year Inside (40,9 mil) | ~4,3 mi (listagem) | há 3 semanas | 48 min | ~73× |
| [Absolute Zero: 100 Hours Survival in a Frozen City](https://www.youtube.com/watch?v=oxj91T7Li34) | Headlamp Guy (21,5 mil) | ~2,1 mi (listagem) | há 4 semanas | 16 min | ~30× |
| [Boiling Point: 5 Days Survival](https://www.youtube.com/watch?v=5FUFaGwY_FM) | Headlamp Guy | ~929 mil (listagem) | há 3 semanas | 14 min | ~13× |
| [What If You Were Stuck in a Bunker With Your Crush?](https://www.youtube.com/watch?v=a4IxwLQNj-k) | Questionverse (15 mil) | 1.301.160 | 07/11/2026 | 21 min | ~8× |
| [What If It Never Stopped Raining for 10 Years?](https://www.youtube.com/watch?v=JzFisAkHx1k) | Your Other Life (11,4 mil) | 1.258.587 | 12/11/2026 | 30 min | ~9× |
| [You Spent 10 Years in a Bunker. You Only Needed 5.](https://www.youtube.com/watch?v=f5SN1UFS6VA) | Your Other Life | 937.657 | 02/11/2026 | 21 min | ~7× |
| [Zombie Apartment Survival 1 Year](https://www.youtube.com/watch?v=TsADgaT6ucE) | Beanie Survives (9,9 mil) | 549.880 | 11/10/2026 | 17 min | ~62× |
| [What If It Was -100°C for 10 Years?](https://www.youtube.com/watch?v=cXqWcScqpqc) | Your Other Life | 470.798 | 18/11/2026 | 36 min | ~3× |
| [Zombie Outbreak Survival Day 1 To Day 100 (Full Movie)](https://www.youtube.com/watch?v=H_oXRJEemtw) | Archival Survival Stories (3,3 mil) | 344.459 | 21/10/2026 | 49 min | ~60× |
| [Blackout Survival 1 Year: 30 Days In Total Darkness, Ep.1](https://www.youtube.com/watch?v=o8UUNZYjH_Y) | Skilly Survives (708) | 109.698 | 07/11/2026 | 9 min | ~7× |

**Descartados:**
- **Zumbis** (Beanie Survives, Archival, Stick Survival Log): fogem da linha realista do canal.
- **"Crush"** (Hypo Room, Questionverse, Possiblo): romance, outro público.
- **Spds,** "The Storm That Almost Ended The World", 8,1 mi: é de 2 anos atrás e é documental.

## Três oportunidades

### 1. Calor extremo no Rio
- **Referências:**
  - *Boiling Point: 5 Days Survival*: ~929 mil, há 3 semanas;
  - *Absolute Zero: 100 Hours Survival in a Frozen City*: ~2,1 mi, há 4 semanas.

  Ambos são do Headlamp Guy. São dois sucessos seguidos com a mesma fórmula: temperatura extrema mais um tempo contado.
- **Por que funcionou:**
  - o número na thumbnail ("173°F", "-100°C") é a promessa inteira;
  - o tempo curto e contado (100 horas, 5 dias) dá urgência;
  - um personagem só, num lugar fechado, tentando aguentar.
- **Adaptação para o Brasil:**
  - **Premissa:** uma onda de calor histórica no Rio de Janeiro, no auge do verão.
  - **Personagens originais:** uma família num apartamento da Zona Norte.
  - **O que dá errado:** a energia cai por sobrecarga dos ar-condicionados, a água falta e um idoso passa mal.
  - **Estrutura:** contador "Hora 1 → Dia 5".
  - **Diálogos:** humor carioca.
  - **Serviço:** sinais de insolação, hidratação e onde buscar ajuda.
  - **Momento:** o verão começa em 21/12, e o tema é atual de dezembro a fevereiro.
- **Título:** "50°C NO RIO: 5 DIAS PARA SOBREVIVER" ou "E SE FIZESSE 50°C NO RIO DE JANEIRO?". É um cenário hipotético, acima do recorde real, e fica claro que é simulação.
- **Thumbnail:**
  - um personagem suado com uma toalha molhada na cabeça, num apartamento escuro;
  - pela janela, o céu laranja e a silhueta de morros e prédios do Rio. Sem o Cristo Redentor, cuja imagem tem restrições de uso comercial;
  - "50°C" enorme no canto.
- **Produção:** alta viabilidade.
  - Reaproveita o apartamento, a cidade e os personagens do motor.
  - Novo: efeito de calor (ondulação), céu laranja, fila na farmácia ou no posto de saúde.
  - Duração sugerida: 15 a 20 min.

### 2. Um ano sem chuva no Brasil (seca)
- **Referência:** *What If It Never Stopped Raining for 10 Years?*, 1.258.587 visualizações, 12/11/2026, cerca de 9 vezes a mediana do canal. Também *What If It Was -100°C for 10 Years?*, 470.798.
- **Por que funcionou:**
  - o clima extremo dura anos;
  - a mudança é mostrada aos poucos;
  - a cidade vai se transformando;
  - a thumbnail traz uma cidade irreconhecível e "10 YEARS".
- **Adaptação para o Brasil:** é o inverso, a seca.
  - O Brasil depende de hidrelétricas, então a falta de chuva leva a racionamento de água, apagões e alta dos alimentos.
  - O público já lembra da crise hídrica de São Paulo.
  - Personagens originais numa cidade do interior e na capital.
  - Estrutura "Dia 1 → Dia 365".
- **Título:** "E SE NUNCA MAIS CHOVESSE NO BRASIL?" ou "1 ANO SEM CHUVA NO BRASIL".
- **Thumbnail:** um personagem com um galão vazio diante de uma represa seca e rachada, com "365 DIAS".
- **Produção:** alta.
  - Cenários de cidade reaproveitados.
  - Novos: represa seca, caminhão-pipa e filas.
  - Risco: fica parecido com o Vídeo 1, por causa dos apagões.

### 3. Preso num shopping por 30 dias
- **Referência:** *Trapped In Walmart After Closing 1 Year (Full Story)*, cerca de 4,3 mi, há 3 semanas, cerca de 73 vezes a mediana. É o maior desvio encontrado. O mesmo canal fez a continuação "After Walmart", que teve 420 mil e 113 mil nas partes 1 e 3.
- **Por que funcionou:**
  - a fantasia de ter uma loja só para você;
  - depois a solidão e o perigo;
  - um formato de série com compilação longa.
- **Adaptação para o Brasil:**
  - Um grupo de funcionários e clientes fica preso num shopping genérico, sem marcas reais, durante 30 dias de uma emergência na cidade.
  - Personagens originais, com tensão de convivência e reviravoltas.
- **Título:** "PRESOS NUM SHOPPING POR 30 DIAS".
- **Thumbnail:** um personagem acampado entre carrinhos, com o shopping escuro e "DIA 30".
- **Produção:** média.
  - Exige um cenário grande e novo: lojas, praça de alimentação e escadas rolantes.
  - Foge um pouco da linha "desastre realista".

## Recomendação: oportunidade 1 (calor extremo no Rio)

1. **A fórmula foi validada duas vezes.** É o mesmo canal com dois vídeos de temperatura extrema muito acima da média: cerca de 30 e 13 vezes a mediana.
2. **É a mais brasileira e mais atual.** O verão começa em dezembro, e ondas de calor são notícia todo ano. É o tema que o público já sente na pele.
3. **Combina com a identidade do canal:** um desastre plausível, uma família comum, serviço público (insolação, hidratação) e o selo de simulação.
4. **Tem o melhor custo de produção:** reaproveita o motor, o apartamento e a cidade. O novo é só o efeito de calor e alguns cenários.
5. **Continua a série de forma coerente:** apagão (Vídeo 1), enchente (Vídeo 2), calor (Vídeo 3). Sem repetir premissa.

**Próximo passo:** com a ideia aprovada, faço o roteiro completo. Para analisar os primeiros 30 segundos da referência, preciso que você assista e me conte, ou me mande uma gravação de tela. Daqui a página do vídeo está bloqueada.
