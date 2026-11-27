# VIDEO_02 — Relatório das Etapas 1 (diagnóstico) e 2 (vozes)

## 1. Ambiente de produção

A produção roda num **ambiente na nuvem** (não no seu PC):

| Item | Situação |
|---|---|
| Sistema | Ubuntu 24.04 LTS (x86_64) |
| Processador | Intel Xeon 2,1 GHz, 4 núcleos |
| Memória | 15 GB |
| Placa de vídeo | **nenhuma** (só CPU) |
| Disco livre | ~38 GB |
| Python / FFmpeg / Git / Node | 3.13 / 6.1 (H.264, AAC, legendas) / 2.43 / 22 |
| Navegador para renderizar | Chromium + Playwright |

### Já instalado e funcionando (do VIDEO_01)
- **Chatterbox Multilingual** (voz, licença MIT) + **faster-whisper** (conferência automática das falas).
- **Motor de animação 2D próprio** (canvas + Chromium): personagens com esqueleto, caminhada, piscar, expressões, câmera, luz, partículas, chuva. Renderiza ~22 quadros/s; um episódio de 25 min leva ~35 min.
- Scripts de narração, legendas, mixagem, linha do tempo e exportação.

### Instalado agora
- `espeak-ng`, **Piper 1.8** e **Kokoro 0.9.4** (para a comparação de vozes).
- **`scripts/dialogo.py`**: gera diálogos com várias vozes. Cada fala é gerada separadamente, conferida pelo Whisper (refeita se sair errada), aparada no fim da última palavra, tratada e nivelada; depois monta a conversa com o ritmo certo (respostas rápidas, interrupções, pausas).

### Limitações reais
- **Sem placa de vídeo**: geradores de vídeo por IA (Wan, LTX, Stable Video) e de imagem (SDXL, Flux) ficam inviáveis ou levam minutos por imagem, com personagens inconsistentes. Por isso a animação continua no **motor próprio**, que garante personagens iguais em todas as cenas.
- **Sincronização labial**: dá para fazer a boca abrir e fechar pelo volume da fala (cada fala tem tempo de início e fim no `.json`). Não é leitura de sílabas.

## 2. Comparação de vozes (mesmo diálogo de teste)

| | **Chatterbox** (escolhido) | Piper | Kokoro |
|---|---|---|---|
| Vozes em português do Brasil | qualquer uma (clona a partir de uma gravação de referência) | 4, **todas masculinas** | 3 (1 feminina, 2 masculinas) |
| 5 personagens com vozes diferentes | ✅ sim | ❌ não (sem voz feminina) | ❌ não (Marina, Dona Cida e Pedro teriam a mesma voz) |
| Expressividade | alta, ajustável por personagem | baixa (tom de leitura) | média |
| Clareza no Whisper | 99% | 94,4% | 99,1% |
| Velocidade (CPU) | lenta (~6× o tempo real) | muito rápida | rápida |
| Licença para canal monetizado | ✅ MIT | varia por voz | ✅ Apache 2.0 |

Descartadas por licença: **XTTS-v2** (licença não comercial), **F5-TTS em português** (não comercial). **Edge TTS** é serviço da Microsoft (bloqueado aqui e com termos de uso restritos).

Opção paga (**não contratada**): **ElevenLabs** é hoje a melhor para diálogos com vários personagens; uso comercial exige plano pago (a partir de ~US$ 5–22/mês).

### Elenco de vozes (Chatterbox)
Referências: leitores de audiolivros do LibriVox (dataset CML-TTS, licença **CC-BY 4.0**, que pede crédito na descrição).

| Personagem | Referência | Tom (Hz) | Ajuste |
|---|---|---|---|
| Narrador | 12707 (a **voz B** aprovada no VIDEO_01) | 125 | um pouco mais expressiva que no VIDEO_01 |
| Lucas | 5417 | 130 | natural |
| Rafael | 12287 | 121 | mais expressivo e solto |
| Marina | 7925 | 187 | firme |
| Dona Cida | 11995 | 180 | calma, sem caricatura |
| Pedro | 3050 | 229 | expressivo |

**Pedro:** não existe voz de criança livre para uso comercial. Usei uma voz feminina mais aguda, como a dublagem brasileira costuma fazer com meninos de 12 anos. É o ponto mais limitado do elenco.

### Resultado do teste
- 28 falas, 6 vozes, 63,7 s, **precisão média de 99,4%** no Whisper.
- Ajustes feitos depois do primeiro teste: o "Pedro!" da Marina vinha com sobras de som depois da palavra; agora cada fala é aparada no fim da última palavra.
- Ponto para você conferir ouvindo: em "Ah. Então **tenho** uma notícia ruim", o Whisper entende "tem" (o Piper teve o mesmo problema, então pode ser só a fala rápida).

Arquivos em `VIDEO_02/TESTES/`.
