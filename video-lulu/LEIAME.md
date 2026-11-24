# Lulu, o Polvinho que Perdeu as Cores

Vídeo infantil vertical (1080x1920, 65 s) para Shorts, Reels e TikTok, que ensina as cores de forma interativa.

- `Lulu_Polvinho_Cores.mp4`: vídeo final
- `capa_thumbnail.png`: capa sugerida

Para gerar de novo: `python3 narracao.py <voz-piper.onnx> && python3 audio.py && python3 animacao.py`,
depois junte as partes (`build/partes.txt`) e o `build/audio.wav` com o ffmpeg.
Para trocar as falas, edite o `roteiro.py`.
