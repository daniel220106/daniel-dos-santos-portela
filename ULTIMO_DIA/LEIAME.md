# ÚLTIMO DIA — linha de produção

## Voz (etapa 4 — teste)
Motor: **Chatterbox Multilingual** (Resemble AI, licença MIT: uso comercial permitido, roda local, gratuito).
Timbre de referência: narradores reais do LibriVox via dataset CML-TTS (licença CC-BY 4.0), em `audio/referencias/`.
O áudio gerado tem marca d'água inaudível (Perth) do próprio Chatterbox.

- Voz A: `ref_8655.wav` (grave, ~95 Hz, gravação mais limpa)
- Voz B: `ref_12707.wav` (médio-grave, ~115 Hz)

Amostras: `audio/testes/amostra_60s_voz_A.mp3` e `amostra_60s_voz_B.mp3` (texto em `roteiro/amostra_60s_capitulo1.txt`).
Verificação automática com Whisper: 99% de acerto (única diferença: "vinte e nove" transcrito como "29"), sem leitura de pontuação, -16 LUFS.

### Instalação (Linux, CPU)
```
python3 -m venv ~/venv_voz
~/venv_voz/bin/pip install torch==2.6.0 torchaudio==2.6.0 chatterbox-tts "setuptools<81" faster-whisper pyarrow
```
### Uso
```
cd scripts
~/venv_voz/bin/python narrar.py texto.txt saida.wav --voz ../audio/referencias/ref_8655.wav
~/venv_voz/bin/python verificar_voz.py saida.wav texto.txt
```
Velocidade em CPU de 4 núcleos: ~6x o tempo real (25 min de narração ≈ 2,5 h).

### Avaliadas e descartadas
- Piper (faber) e Kokoro: usadas antes, soam robóticas.
- Edge TTS (Microsoft): bloqueada pela rede deste ambiente e com licença comercial incerta.
- XTTS-v2 / F5-TTS pt-BR: licenças não comerciais.

**Voz aprovada: B** (`ref_12707.wav`), registrada em `projeto/config_canal.json`.

## Animação (etapa 5 — teste de abertura)
Motor próprio em canvas 2D (`projeto/motor/motor.js`): personagens articulados (rig com tronco, cabeça, braços e
pernas, piscar, expressão, ciclo de caminhada), luz por cena, câmera (zoom, travelling, tremor de mão), parallax,
partículas, grão de filme, vinheta, selo SIMULAÇÃO, cartelas e legendas sincronizadas com a narração.
Fichas visuais fixas dos personagens em `VISUAIS` (motor.js). Cenas do episódio em `projeto/ep01/abertura.js`.
Trilha e efeitos sintetizados por código (`scripts/som.py`), sem direitos de terceiros. Fontes Oswald e Inter (licença OFL).

```
cd scripts
node renderizar.js ../projeto/ep01/abertura.html ../audio/narracao/ep01_abertura_teste.json ../render/ep01_abertura_video.mp4
~/venv_voz/bin/python ep01_abertura_som.py
```
Resultado: `exports/ULTIMO_DIA_EP01_teste_abertura.mp4` (75 s, 1920x1080, H.264, AAC 48 kHz, -14 LUFS).
