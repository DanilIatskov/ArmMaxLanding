#!/usr/bin/env bash
# Готовит снимки для сайта: PNG-исходники из images/ → JPEG в src/assets/.
#
# Класть PNG под именем .jpg нельзя: Next отдаст файл как есть, страница
# потяжелеет в несколько раз, а расширение будет врать о содержимом.
#
# Файлы лежат в src/assets (не в public): оттуда они импортируются статически,
# и Next подмешивает в имя хеш содержимого. Поэтому после замены снимка адрес
# меняется сам и старая картинка не может прилететь из кэша браузера.
#
# Запуск: npm run images
set -euo pipefail
cd "$(dirname "$0")/.."

PAIRS=(
  "images/фото-инженер.png|src/assets/inzhener-planshet.jpg"
  "images/фото-команда.png|src/assets/komanda-chertezhi.jpg"
  "images/каска.png|src/assets/kaska.jpg"
  "images/фон-первый-экран.png|src/assets/hero-stroyka.jpg"
  "images/этап-1-техусловия.png|src/assets/stages/tehnicheskie-usloviya.jpg"
  "images/этап-2-участок.png|src/assets/stages/zemelnyy-uchastok.jpg"
  "images/этап-3-проектирование.png|src/assets/stages/proektirovanie.jpg"
  "images/этап-4-общестрой.png|src/assets/stages/obshchestroy-i-inzheneriya.jpg"
  "images/этап-5-ввод.png|src/assets/stages/vvod-v-ekspluataciyu.jpg"
)

for pair in "${PAIRS[@]}"; do
  src="${pair%%|*}"
  dst="${pair##*|}"
  if [ ! -f "$src" ]; then
    echo "пропуск: нет $src"
    continue
  fi
  sips -s format jpeg -s formatOptions 88 "$src" --out "$dst" >/dev/null
  printf '%-44s %s\n' "$dst" "$(du -h "$dst" | cut -f1)"
done

# Оптимизатор Next кэширует варианты по пути, а не по содержимому,
# и после подмены файла продолжает отдавать старую картинку.
rm -rf .next/cache/images
echo "кэш оптимизатора очищен"
