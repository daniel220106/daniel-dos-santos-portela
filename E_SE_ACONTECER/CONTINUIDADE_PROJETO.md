# CONTINUIDADE DO PROJETO: E SE ACONTECER?

Atualizado em 28/11/2026, às ~02:30 UTC, no fim da sessão `session_0176vtWdHsDHoiEjZ5iFUeLW`.
Branch de trabalho: **`claude/dreamy-faraday-3yay8l`**, no repositório `daniel220106/daniel-dos-santos-portela`.
**Leia este arquivo e o `CLAUDE.md` antes de fazer qualquer coisa.**


> **ATUALIZAÇÃO (28/11, ~02h30 UTC): o VÍDEO 3 ESTÁ PRONTO E AUDITADO.**
> - Arquivos: `VIDEO_03/EXPORTACAO/E_SE_ACONTECER_VIDEO_03_youtube_1080p.mp4` (768 MB, fora do Git) e `E_SE_ACONTECER_VIDEO_03_720p.mp4` (55 MB, no Git). Duração 16:58, -14,6 LUFS, pico -1,3 dBFS, sincronia A/V 0,014 s, decodificação integral sem erros.
> - Thumbnail: `VIDEO_03/EXPORTACAO/thumbnail/E_SE_ACONTECER_VIDEO_03_thumbnail.jpg` ("SEM LUZ" + termômetro 50°C; gerada por `projeto/video03/thumb_video03.html`). Título: **50°C no Rio: 5 Dias Para Sobreviver** (/yt-package 100/100).
> - Legenda `VIDEO_03/LEGENDAS/video03_pt-BR.srt` (316 blocos); descrição `VIDEO_03/EXPORTACAO/video03_descricao_youtube.txt` (capítulos conferidos com a linha do tempo).
> - 1ª auditoria (`VIDEO_03/TESTES/auditoria_final/`): 3 falas do Caio com pronúncia ruim ("Dorme, vó.", "Claro, Seu Valdir. Suor.", "Ela tá bem?"). Regravadas com `scripts/regravar_fala.py` (cabe no mesmo espaço; a linha do tempo não muda), quadros das 3 falas re-renderizados para a boca acompanhar, áudio remixado. Versão anterior em `EXPORTACAO/versao_anterior/`.
> - 2ª auditoria (`VIDEO_03/TESTES/auditoria_final2/`): precisão 95,2%; os alertas restantes foram conferidos na faixa só de vozes e são falsos (números por extenso, nomes, trilha atrapalhando o tom). Os 270 quadros foram revistos: imagem bate com a fala.
> - **Não publicado.** Publicação no YouTube só com pedido explícito do usuário.
> - Vídeo 2 / identidade no YouTube: o usuário está fazendo num chat do app Claude no PC, com `MENSAGEM_PARA_CHAT_DO_PC.md`. Os arquivos para baixar estão no GitHub (branch acima). Nada foi feito no YouTube por esta sessão.

---

## 1. Situação dos vídeos (sem misturar)

| | Vídeo 1 | Vídeo 2 | Vídeo 3 |
|---|---|---|---|
| Tema | Brasil 30 dias sem energia (apagão) | Enchente em São Paulo, 24 h para escapar | **NOVO vídeo**: onda de calor de 50 °C no Rio, 5 dias |
| Pastas | `exports/`, `projeto/video01/`, `roteiro/`, `legendas/` | `VIDEO_02/`, `projeto/video02/` | `VIDEO_03/`, `projeto/video03/` |
| Situação | **PUBLICADO** pelo usuário. O arquivo publicado ainda tem as cartelas antigas ("ÚLTIMO DIA", "EPISÓDIO 01") e a fala "próximo episódio do Último Dia". | **PRONTO PARA PUBLICAR**, com a identidade nova. Não se sabe se o usuário publicou a versão antiga. | **PRONTO E AUDITADO** (28/11), não publicado. |
| Arquivo final | `exports/E_SE_ACONTECER_VIDEO_01_youtube_1080p.mp4` (fora do Git) e `..._720p.mp4` (no Git) | `VIDEO_02/EXPORTACAO/E_SE_ACONTECER_VIDEO_02_youtube_1080p.mp4` (641 MB, **fora do Git**) e `E_SE_ACONTECER_VIDEO_02_720p.mp4` (74 MB, **no Git**) | — |
| Thumbnail | `exports/thumbnail/E_SE_ACONTECER_VIDEO_01_thumbnail.jpg` ("TUDO APAGOU") | `VIDEO_02/EXPORTACAO/thumbnail/E_SE_ACONTECER_VIDEO_02_thumbnail.jpg` | `VIDEO_03/EXPORTACAO/thumbnail/E_SE_ACONTECER_VIDEO_03_thumbnail.jpg` ("SEM LUZ") |
| Pacote de publicação | `exports/video01_descricao_youtube.txt` | `VIDEO_02/EXPORTACAO/PUBLICACAO_VIDEO_02.md` (título, descrição, hashtags, tags, configurações) | `scripts/video03_metadados.py` gera o SRT e a descrição depois das vozes |

O Vídeo 3 **não** é uma modificação do Vídeo 2. São projetos separados, cada um com suas pastas.

## 2. Identidade (resumo; a regra completa está no `CLAUDE.md`)

- O canal é **E SE ACONTECER?**. Nunca "ÚLTIMO DIA".
- Os vídeos são **Vídeo 1, 2, 3**. Nunca "episódio" nem "EP01".
- Capa e perfil novos: `assets/identidade/capa.png` (2560x1440) e `perfil.png` (800x800). As versões antigas estão em `assets/identidade/versao_anterior/`.
- Imagens da auditoria de identidade: `auditoria_identidade/`.
- A sessão foi renomeada para "E SE ACONTECER? — produção de vídeos do YouTube".

## 3. Vídeo 3: estado exato

**Roteiro final aprovado:** `VIDEO_03/ROTEIRO/cap00..cap10` (a cópia fiel está em `VIDEO_03/ROTEIRO_VERSOES/v2_final_aprovada/`; a 1ª versão está em `v1_primeira_versao/`).
- São 270 falas, com duração estimada de cerca de 17:00. O estimador `scripts/estimar_duracao.py` errou o Vídeo 2 por apenas 2 s.
- Correções obrigatórias já aplicadas e testadas:
  - continuidade: "três dias antes", "dois dias depois", "desde quinta";
  - golpe de calor: confusão mental → ligar 192 na hora e resfriar ao mesmo tempo; a pele pode estar seca ou suada; nada para beber a quem está confuso;
  - insulina: na prateleira e não na porta; sem contato com o gelo;
  - sem a "regra dos 7 segundos".
- Estudo das referências: `VIDEO_03/ESTUDO_REFERENCIAS.md`. Auditoria de retenção do roteiro: `VIDEO_03/AUDITORIA_RETENCAO.md`. Pesquisa: `pesquisa/2026-11-27_pesquisa_concorrentes.md`.

**Elenco de vozes:** `VIDEO_03/PROJETO/elenco_video03.json`. Referências CML-TTS (CC BY 4.0) em `VIDEO_03/VOZES/referencias/`.
- Narrador: Piper faber a 1,2x. Personagens: Chatterbox a 1,15x (Ademar 1,08x, Nena 1,12x).
- Trocas feitas depois da amostra:
  - Nena → ref 11995 (186 Hz; a anterior soava masculina);
  - Tião → ref 4067 (138 Hz);
  - feirante e homem → ref 5739.
- Amostras em `VIDEO_03/TESTES/*.mp3`.

**Geração das vozes (EM ANDAMENTO quando esta sessão terminou):**

| Trecho | Situação |
|---|---|
| cap00_abertura | OK, 27,3 s, 97,0% |
| cap01_o_asfalto | OK, 125,1 s, 96,5% |
| cap02_a_rede | OK, 107,2 s, 98,1% |
| cap03_cade_a_vo | OK, 79,6 s, 94,9% |
| cap04_a_reuniao | OK, 90,0 s, 97,8% |
| cap05_o_mar | gerando (16/29 às 21:45) |
| cap06 a cap10 | pendentes |

- **Comando:** `sh E_SE_ACONTECER/scripts/vozes_video03.sh`. O registro fica em `E_SE_ACONTECER/logs/video03_vozes.log`.
- **Cache por fala:** `VIDEO_03/AUDIO/cache_falas/*.npz`. Cada fala pronta fica salva e nunca é gerada de novo.
- **Salvamento automático:** `scripts/salvar_progresso_vozes.sh` grava no Git, a cada 10 min, o cache, os `.json` e o log, até aparecer `VOZES_COMPLETAS`. Os commits se chamam "Vídeo 3: progresso das vozes salvo automaticamente (N falas em cache)".
- Os `.wav` dos trechos **não** vão para o Git (são grandes). Eles são remontados a partir do cache em segundos.

**Como continuar numa sessão nova, sem repetir nada:**
1. `git fetch origin claude/dreamy-faraday-3yay8l && git checkout claude/dreamy-faraday-3yay8l && git pull`.
2. Veja se a sessão antiga ainda está gerando. Se o último commit "progresso das vozes salvo automaticamente" tiver **menos de 15 min**, ela ainda está viva: **não** inicie outra geração; espere e faça `git pull` de novo. Se `logs/video03_vozes.log` contiver `VOZES_COMPLETAS`, as vozes terminaram.
3. Se a geração parou no meio (sem commits novos há mais de 15 min e sem `VOZES_COMPLETAS`):
   - prepare o ambiente (seção 6);
   - rode `sh E_SE_ACONTECER/scripts/vozes_video03.sh`, que reaproveita o cache e só gera as falas que faltam;
   - mantenha o salvamento rodando: `nohup sh E_SE_ACONTECER/scripts/salvar_progresso_vozes.sh &`.
4. Se a sessão nova estiver num servidor novo, os `.wav` não existirão. O mesmo comando os remonta a partir do cache, sem gerar nada de novo.

## 4. Próximas ações do Vídeo 3, na ordem

1. Terminar as vozes. Depois, revisar o log: falas abaixo de 90% → escutar/transcrever e, se for erro real, refazer com `dialogo.py ... --refazer "texto exato"` (só troca se ficar melhor).
2. `python3 scripts/video03_linha_tempo.py` (linha do tempo real; sem `--provisoria`).
3. Rever os quadros com o tempo real (cerca de 5 por capítulo, mais as cartelas) e ajustar a direção em `projeto/video03/video03.js`. Os 75 quadros provisórios já foram revistos e cinco problemas corrigidos.
4. `cd scripts && ~/venv_voz/bin/python video03_som.py` (trilha, efeitos, fita da Lurdes, mix a -14 LUFS).
5. Renderizar sem legenda gravada: `cd scripts && node renderizar.js ../projeto/video03/video.html ../projeto/video03/linha_tempo.json ../render/video03_video_sem_legenda.mp4 --workers 4 --sem-legenda` (cerca de 25 min).
6. Juntar com o áudio e exportar em 1080p (crf 20, AAC 256k) e 720p (crf 27). Use os mesmos comandos do Vídeo 2: veja o histórico ou `VIDEO_02/EXPORTACAO`.
7. `python3 scripts/video03_metadados.py` (SRT e descrição; o script bloqueia "Último Dia" e "episódio").
8. **Auditoria obrigatória do arquivo final:** `~/venv_voz/bin/python scripts/auditoria_video.py <1080p.mp4> projeto/video03/linha_tempo.json VIDEO_03/PROJETO/elenco_video03.json VIDEO_03/LEGENDAS/video03_pt-BR.srt VIDEO_03/TESTES/auditoria_final`.
   - Ela faz a reprodução integral e confere telas pretas, silêncios, volume, cada fala (texto, voz e corte), as legendas e uma folha de contato com um quadro por fala.
   - Conferir a folha de contato fala por fala: a imagem tem de corresponder ao que é dito.
   - Corrigir tudo o que aparecer e só entregar depois disso.
9. Thumbnail do Vídeo 3, testada com a /yt-package. Título sugerido: "50°C no Rio: 5 Dias Para Sobreviver".
10. Commit e push. Entregar ao usuário o 720p, a thumbnail, o SRT e a descrição, com as limitações reais.

**Depois do Vídeo 3** (pedido do usuário; não interromper a produção para isso):
- thumbnail do Vídeo 1;
- confirmar a capa e o perfil, que já estão feitos;
- o Vídeo 1 com as cartelas novas só se o usuário for reenviar.

## 5. Problemas conhecidos e decisões pendentes

- **Arquivos 1080p dos Vídeos 1 e 2 fora do Git** (passam do limite). Numa sessão nova, ou se renderiza de novo a partir do projeto ou se usa o 720p, que está no Git.
- **Vídeo 1 publicado com a identidade antiga** nas cartelas e no áudio ("próximo episódio do Último Dia"). Decisão pendente do usuário: reenviar ou não. Corrigir exigiria renderizar de novo e regravar uma frase com `scripts/refazer_frase.py`.
- **YouTube:** as páginas de vídeo pedem "confirme que você não é um robô". Não contornar. O RSS (`youtube.com/feeds/videos.xml?channel_id=`) e as páginas de canal funcionam. Hosts liberados no ambiente: www.youtube.com, youtube.com, i.ytimg.com e Hugging Face.
- **Vozes femininas:** são poucas referências. Papéis pequenos dividem voz em capítulos diferentes (mulher e enfermeira = 7925; senhora e vizinha = 11995).
- A versão anterior do Vídeo 2 (com "ÚLTIMO DIA") está em `VIDEO_02/EXPORTACAO/versao_anterior/`.
- Backup da renomeação: tag local `backup-antes-identidade-e-se-acontecer` (só neste servidor) e `/home/user/backup_identidade_antiga/` (só neste servidor). A renomeação foi conferida (826/826 arquivos).

## 6. Preparar o ambiente numa sessão nova (só se o servidor for novo)

```
python3 -m venv ~/venv_voz
~/venv_voz/bin/pip install torch==2.6.0 torchaudio==2.6.0 chatterbox-tts==0.1.7 "setuptools<81" faster-whisper==1.2.1 piper-tts==1.8.0 librosa==0.11.0 soundfile pyarrow
# modelo Piper do narrador (o .json já está no Git em VIDEO_03/VOZES/piper/):
curl -L -o E_SE_ACONTECER/VIDEO_03/VOZES/piper/pt_BR-faber-medium.onnx https://huggingface.co/rhasspy/piper-voices/resolve/main/pt/pt_BR/faber/medium/pt_BR-faber-medium.onnx
cp E_SE_ACONTECER/VIDEO_03/VOZES/piper/pt_BR-faber-medium.onnx* E_SE_ACONTECER/VIDEO_02/VOZES/piper/   # se for usar o Vídeo 2
export HF_HUB_DISABLE_XET=1   # os modelos Chatterbox e Whisper baixam sozinhos do Hugging Face na 1ª execução
```

O Chromium e o Playwright já vêm instalados no servidor. Use `node`, a partir de `E_SE_ACONTECER/scripts`, para renderizar.
