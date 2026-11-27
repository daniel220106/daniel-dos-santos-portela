# Passo a passo no YouTube Studio (para o dono do canal)

Claude não tem acesso ao YouTube Studio nesta conta: não há conector do YouTube, computador conectado nem login.
Nada foi excluído, publicado ou alterado no YouTube. Os arquivos abaixo estão prontos e conferidos.

## A. Identidade do canal (Studio → Personalização → Branding)

1. **Foto do perfil:** enviar `assets/identidade/perfil.png` (800x800). Confira o recorte redondo e clique em Publicar.
2. **Imagem do banner:** enviar `assets/identidade/capa.png` (2560x1440). O nome fica dentro da área visível em todos os aparelhos. Clique em Publicar.
3. **Nome do canal:** em Personalização → Informações básicas, confira se está "E SE ACONTECER?".

## B. Vídeo 2: substituir a versão antiga

1. **Studio → Conteúdo:** encontre o Vídeo 2 antigo, sobre a enchente em São Paulo, com o título em maiúsculas "E SE UMA ENCHENTE GIGANTE...". Confirme pela miniatura e pela duração (~15:30) que é ele.
2. **Anote antes de excluir:** link, título, data, visualizações, curtidas, comentários (e os principais), tempo de exibição e retenção média (aba Análises). Faça print.
3. **Exclua o vídeo antigo** (⋮ → Excluir para sempre). Atenção: visualizações e comentários **não passam** para o novo vídeo. Se preferir não perder as métricas, a alternativa é deixá-lo como **Não listado**, em vez de excluir.
4. **Criar → Enviar vídeos:** `VIDEO_02/EXPORTACAO/E_SE_ACONTECER_VIDEO_02_720p.mp4` (ou o 1080p, se estiver disponível).
5. **Título:** `São Paulo Alagada: 24 Horas Para Escapar`
6. **Descrição:** colar `VIDEO_02/EXPORTACAO/video02_descricao_youtube.txt` inteiro. A 1ª linha já é o título novo, e o arquivo traz capítulos, aviso de simulação, orientações, créditos e hashtags.
7. **Miniatura:** `VIDEO_02/EXPORTACAO/thumbnail/E_SE_ACONTECER_VIDEO_02_thumbnail.jpg`
8. **Público:** "Não, não é conteúdo para crianças".
9. **Mostrar mais:**
   - **Conteúdo alterado ou sintético** → **Sim**, por causa das vozes sintéticas.
   - Tags, se quiser: estão em `VIDEO_02/EXPORTACAO/PUBLICACAO_VIDEO_02.md`.
   - Idioma do vídeo: **Português (Brasil)**.
   - Categoria: Entretenimento.
10. **Legendas:** Adicionar idioma Português (Brasil) → Enviar arquivo → "Com sincronização" → `VIDEO_02/LEGENDAS/video02_pt-BR.srt`.
11. **Tela final:** adicionar o elemento "Vídeo" → escolher o Vídeo 1 ("O Brasil ficou 30 dias sem energia...") nos últimos 8 s. O vídeo tem uma cartela final de 8 s pensada para isso.
12. **Revisar** título, descrição, miniatura, legenda e configurações. Depois, **Publicar**, ou agendar conferindo a **hora**.
13. Copie o link novo e, se quiser, coloque-o num comentário fixado do Vídeo 1.

## C. Vídeo 1 (não alterar o vídeo)

- **Miniatura nova (opcional e autorizada):** Studio → Conteúdo → Vídeo 1 → Detalhes → Miniatura → enviar `exports/thumbnail/E_SE_ACONTECER_VIDEO_01_thumbnail.jpg`. Isso troca só a imagem, não o vídeo.
- As cartelas e a fala com o nome antigo **continuam no vídeo publicado**. Mudar isso exigiria enviar o vídeo de novo, o que não foi autorizado.
- Na descrição do Vídeo 1 (editável sem reenviar), troque `#ÚltimoDia` por `#ESeAcontecer` e "Próximo episódio" por "Próximo vídeo". O texto corrigido está em `exports/video01_descricao_youtube.txt`.
