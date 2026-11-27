#!/bin/sh
# Gera as vozes de todos os capítulos do EP02 (retoma de onde parou: pula capítulos já gerados)
cd "$(dirname "$0")/../EP02/AUDIO"
for r in ../ROTEIRO/cap*.txt; do
  n=$(basename "$r" .txt)
  [ -f "$n.wav" ] && [ "$n.wav" -nt "$r" ] && continue
  echo "== $n"
  /home/user/venv_voz/bin/python ../../scripts/dialogo.py "$r" "$n.wav" --elenco ../PROJETO/elenco_aprovado.json --tentativas 6 2>&1 | grep -E "^\[|^OK|Traceback|Error"
done
echo VOZES_COMPLETAS
