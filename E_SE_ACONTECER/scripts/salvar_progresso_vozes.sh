#!/bin/sh
# Salva no Git, a cada 10 min, o progresso da geração de vozes do Vídeo 3 (cache por fala + tempos), até terminar.
# O cache permite que outra sessão continue sem gerar de novo as falas prontas.
cd "$(dirname "$0")/../.."
while true; do
  git add -f E_SE_ACONTECER/VIDEO_03/AUDIO/cache_falas/*.npz E_SE_ACONTECER/VIDEO_03/AUDIO/*.json E_SE_ACONTECER/logs/video03_vozes.log 2>/dev/null
  if ! git diff --cached --quiet; then
    n=$(ls E_SE_ACONTECER/VIDEO_03/AUDIO/cache_falas | wc -l)
    git commit -q -m "Vídeo 3: progresso das vozes salvo automaticamente ($n falas em cache)" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_0176vtWdHsDHoiEjZ5iFUeLW"
    for i in 1 2 3 4; do git push -q origin claude/dreamy-faraday-3yay8l && break; sleep $((i*5)); done
  fi
  grep -q VOZES_COMPLETAS E_SE_ACONTECER/logs/video03_vozes.log && break
  sleep 600
done
echo SALVAMENTO_FINAL_OK
