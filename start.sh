#!/bin/sh
cd "${0%/*}"
sleep 5s
./update.sh
npm list -g pm2 || npm install -g pm2
pm2 start ./index.js --name masomenos-dmx -e ./logs/error.log -o ./logs/out.log