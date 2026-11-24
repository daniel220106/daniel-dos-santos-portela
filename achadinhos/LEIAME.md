# Máquina de vídeos de achadinhos

1. Crie uma pasta em `produtos/<nome>` com o print do anúncio da Shopee e um `config.json` (copie o de `produtos/t800`).
2. Ajuste recortes, textos e preço no `config.json`.
3. Rode: `python3 fazer_video.py produtos/<nome>`

Regras: não divulgar produto falsificado (com marca de outra empresa), não reaproveitar vídeo de outros criadores
e não prometer função que o anúncio não garante.

## Narração por IA
Cada cena pode ter `"fala"`, e o config pode ter `"voz"`: `pf_dora` (feminina), `pm_alex` ou `pm_santa` (masculinas).
Precisa do Kokoro: `pip install kokoro-onnx soundfile` e os arquivos `kokoro-v1.0.int8.onnx` e `voices-v1.0.bin`
(release model-files-v1.0 do repositório thewh1teagle/kokoro-onnx no GitHub) dentro da pasta `modelos/`.
