#!/bin/sh
cd "${0%/*}"
sleep 3s
git fetch --all
git reset --hard origin/master
npm i
