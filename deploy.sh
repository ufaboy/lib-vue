#!/usr/bin/env sh

# остановить публикацию при ошибках
set -e

# сборка
npm run build

cp -i /var/deployment/lib-vue/dist/. /${{ secrets.PROJECT_PATH }}/