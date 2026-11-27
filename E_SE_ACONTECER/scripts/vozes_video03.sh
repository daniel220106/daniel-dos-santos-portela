#!/bin/sh
# Gera as vozes de todos os capítulos do VIDEO_03 (retoma de onde parou: pula capítulos já gerados)
export HF_HUB_DISABLE_XET=1
cd "$(dirname "$0")/../VIDEO_03/AUDIO"
for r in ../ROTEIRO/cap*.txt; do
  n=$(basename "$r" .txt)
  [ -f "$n.wav" ] && [ "$n.wav" -nt "$r" ] && continue
  echo "== $n"
  /home/user/venv_voz/bin/python ../../scripts/dialogo.py "$r" "$n.wav" --elenco ../PROJETO/elenco_video03.json --tentativas 6 2>&1 | grep --line-buffered -aE "^\[|^OK|Traceback|Error"
done
echo VOZES_COMPLETAS
