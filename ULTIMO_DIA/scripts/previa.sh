#!/bin/bash
# previa.sh CAPS... : renderiza 1 quadro por frase dos capítulos e monta folhas de contato
EP=ep01; OUT=../render/previa_$EP; rm -rf $OUT; mkdir -p $OUT
T=$(python3 -c "
import json,sys;L=json.load(open('../projeto/$EP/linha_tempo.json'));caps=set(map(int,sys.argv[1:]))
print(','.join(f\"{f['inicio']+1.0:.2f}\" for b in L['blocos'] if b['tipo']=='par' and b['cap'] in caps for f in b['frases']))" "$@")
node renderizar.js ../projeto/$EP/episodio.html ../projeto/$EP/linha_tempo.json $OUT --quadros $T 2>&1 | grep -i erro | sort | uniq -c | head
cd $OUT && ls q_*.jpg | sort -t_ -k2 -n > lista.txt && n=0; while read -r a; do printf "file '%s'\n" "$a"; done < lista.txt > concat.txt
ffmpeg -y -loglevel error -f concat -safe 0 -i concat.txt -vf "scale=480:270,drawtext=text='%{n}':x=8:y=8:fontcolor=yellow:fontsize=22,tile=5x6" -vsync 0 folha_%02d.jpg
ls folha_*.jpg
