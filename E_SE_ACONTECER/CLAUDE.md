# E SE ACONTECER? — regras do canal

Canal de simulações animadas em 2D (pt-BR) sobre cenários hipotéticos: desastres, sobrevivência e situações extremas.
Estas regras valem para roteiros, vídeos, thumbnails, títulos, descrições, legendas, arte do canal, nomes de arquivos e estratégia.

## Identidade

1. O nome do canal é sempre **E SE ACONTECER?**: em maiúsculas, com ponto de interrogação.
   - Nunca use "ÚLTIMO DIA" como nome do canal. Esse nome está descontinuado.
2. Os conteúdos se chamam **Vídeo 1, Vídeo 2, Vídeo 3…**
   - Nunca use "episódio", "EP01", "EP02", etc., nem na tela, nem em textos, nem em nomes de arquivos.
3. A numeração é para organização interna. Não coloque "Vídeo N" obrigatoriamente no título público.
4. Não confunda o nome do canal com o tema de um vídeo.
   - O canal é E SE ACONTECER?.
   - Cada vídeo tem a sua história: o apagão (Vídeo 1), a enchente em São Paulo (Vídeo 2)…
5. Todo vídeo deixa claro que é **SIMULAÇÃO fictícia**:
   - selo na tela o tempo todo;
   - aviso na abertura e no fim;
   - aviso na descrição, recomendando seguir a Defesa Civil.
   - Nunca crie alertas ou notícias falsas que pareçam reais.

## Nomes de pastas e arquivos

- `E_SE_ACONTECER/` é a raiz do projeto.
- `VIDEO_02/` é a pasta de produção do Vídeo 2. Os próximos seguem o mesmo padrão: `VIDEO_03/`, `VIDEO_04/`…
- No código, use `video01`, `video02`, … (por exemplo `projeto/video02/`, `scripts/video02_som.py`).
- Exportações finais: `E_SE_ACONTECER_VIDEO_0N_<variante>.mp4`.
- Versões substituídas não são apagadas: vão para `EXPORTACAO/versao_anterior/`.

## Processo obrigatório antes de cada novo vídeo

Não invente temas sem pesquisa. Antes de qualquer roteiro:

1. Pesquise canais internacionais de animação 2D, IA, cenários hipotéticos, sobrevivência e desastres.
2. Encontre vídeos recentes muito acima da média do próprio canal.
   - Priorize os que passaram de 100 mil visualizações.
   - Destaque os que passaram de 1 milhão e de 10 milhões.
3. Analise:
   - título e thumbnail;
   - os primeiros 30 segundos;
   - estrutura, duração, ritmo, diálogos e reviravoltas.
4. Informe o link, as visualizações e a data de cada referência.
   - Só use números que você realmente viu. Diga de onde vieram e quando foram consultados.
   - Não diga que um vídeo é feito com IA ou com animação tradicional sem evidência.
5. Apresente **três oportunidades**, cada uma com:
   - a referência e o seu link;
   - visualizações e data;
   - por que funcionou;
   - como adaptar para o Brasil;
   - sugestão de título e conceito de thumbnail;
   - potencial de produção.

   Depois recomende uma.
6. **Não comece o roteiro completo sem aprovação do usuário.**

Use a estrutura que funcionou, mas crie uma história original, com personagens e diálogos próprios.
Nunca copie, traduza ou apenas troque o idioma de um vídeo de referência.

## Qualidade e honestidade

- Nunca diga que algo está pronto sem ter produzido e verificado o arquivo de verdade: ffprobe, quadros de conferência e Whisper.
- Não invente resultados, números ou fontes. Informe as limitações.
- Sem serviços pagos, períodos de teste ou APIs com cobrança.
- Sem música protegida.
- Créditos CC BY das vozes de referência (CML-TTS) na descrição.
- Segurança nas cenas:
  - ninguém atravessa água corrente nem dirige em rua alagada;
  - ninguém entra em garagem inundada nem toca em fio caído.

## Ferramentas

- **Skills de YouTube** em `../.claude/skills/yt-*`: `/yt-script`, `/yt-package`, `/yt-viral`, `/yt-retention`, `/yt-shorts`, `/yt-audit` etc.
  - Os avaliadores `hookscore.py` e `title.py` foram calibrados em inglês. Use como guia, não como nota definitiva.
- **Perfil de voz do canal:** `VOZ_DO_CANAL.md` (cópia em `~/.claude/youtube/voice.md`, lida pelas skills).
- **Linha de produção:** veja `LEIAME.md`.

## Continuidade

**Comece sempre por `CONTINUIDADE_PROJETO.md`.** Ele traz:
- o estado de cada vídeo;
- o que está rodando;
- as próximas ações, na ordem;
- os problemas conhecidos.

Atualize esse arquivo ao fim de cada etapa importante. Antes de iniciar qualquer geração ou renderização, confira se outra sessão já não está fazendo a mesma coisa: veja os commits "salvo automaticamente".

## Preferências de produção (decididas com o usuário)

- **Vozes**
  - Narrador: Piper `pt_BR-faber-medium` a **1,2x**.
  - Personagens: Chatterbox Multilingual a **1,15x**. O usuário pediu vozes mais rápidas.
  - Referências: CML-TTS (CC BY 4.0), com crédito obrigatório na descrição.
  - Cada personagem tem voz própria. Confira o tom (f0) de cada voz antes de gerar tudo. Uma voz feminina abaixo de ~165 Hz pode soar masculina.
  - Toda fala é conferida pelo Whisper e aparada. O cache por fala fica em `VIDEO_0N/AUDIO/cache_falas` e precisa ir para o Git durante gerações longas.
  - A narração nunca lê indicações de cena.
- **Roteiro**
  - Formato do `scripts/dialogo.py`.
  - Diálogos naturais, humor nos personagens e não no desastre, tensão crescente e laços abertos.
  - Informação de segurança dentro da ação, nunca como aula.
  - Faça auditoria de retenção antes de produzir.
  - Fatos de saúde e segurança conferidos em fonte oficial ou médica.
- **Imagem**
  - Motor 2D próprio (`projeto/motor/`).
  - Mude de plano com frequência: aberto, close, a dois, inserts.
  - Faça folhas de quadros de revisão e corrija antes de renderizar.
  - Cartelas com a identidade E SE ACONTECER? e o selo SIMULAÇÃO sempre visível.
- **Som:** trilha original sintetizada por clima de capítulo, efeitos sincronizados às falas e mix a **-14 LUFS**. Sem música protegida.
- **Entrega**
  - 1080p para o YouTube (H.264 + AAC 48 kHz) e 720p para enviar ao usuário, com até ~100 MB.
  - Legenda em **SRT separado** (CC do YouTube), não gravada na imagem.
  - Descrição com capítulos, aviso de simulação, orientações e créditos.
  - Thumbnail em 1280x720, testada com a `/yt-package`: no máximo 3 palavras, sem repetir o título.
- **Duração:** 15 a 20 min no vídeo longo, com qualidade antes de quantidade. TikTok vertical de 2 a 3 min.
- **Qualidade antes de velocidade.** Não pule etapas. Só diga que está pronto depois da auditoria do **arquivo final** (`scripts/auditoria_video.py`), incluindo a conferência quadro a quadro de imagem e fala.
- **Nada de PR, publicação no YouTube ou ação externa** sem pedido explícito do usuário.
