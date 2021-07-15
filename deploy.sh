#!/usr/bin/env sh

npm install

npm run build

rm -rf /${{ secrets.PROJECT_PATH }}/*

cp -r /var/deployment/lib-vue/dist/. /${{ secrets.PROJECT_PATH }}/