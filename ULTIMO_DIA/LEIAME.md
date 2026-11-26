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
