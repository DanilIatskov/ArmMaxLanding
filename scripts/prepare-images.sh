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
  "images/фото-геодезист.png|src/assets/geodezist-taheometr.jpg"
  "images/фото-бригада.png|src/assets/brigada-chertezhi.jpg"
  "images/каска.png|src/assets/kaska.jpg"
  "images/фон-первый-экран.png|src/assets/hero-stroyka.jpg"
  "images/этап-1-техусловия.png|src/assets/stages/tehnicheskie-usloviya.jpg"
  "images/этап-2-участок.png|src/assets/stages/zemelnyy-uchastok.jpg"
  "images/этап-3-проектирование.png|src/assets/stages/proektirovanie.jpg"
  "images/этап-4-общестрой.png|src/assets/stages/obshchestroy-i-inzheneriya.jpg"
  "images/этап-5-ввод.png|src/assets/stages/vvod-v-ekspluataciyu.jpg"
  "images/объект-складской-комплекс.png|src/assets/objects/proizvodstvenno-skladskoy-kompleks.jpg"
  "images/объект-логистический-центр.png|src/assets/objects/logisticheskiy-centr.jpg"
  "images/объект-административный-корпус.png|src/assets/objects/administrativno-bytovoy-korpus.jpg"
  "images/фон-этапы.png|src/assets/etapy-kran.jpg"

  # Кадры к объектам в блоке «Где работала команда». В карточке видна правая
  # часть, левая уходит под вуаль, поэтому важен не весь кадр, а его правая
  # половина — при замене смотреть именно на неё.
  #
  # Третье поле — предел по ширине. Карточка показывает кадр примерно
  # на 460 точек, 1100 хватает и на ретину. Без обрезки восемь кадров весят
  # пять мегабайт, и на превью GitHub Pages они уезжают целиком: там сборка
  # статическая, оптимизатора картинок нет.
  "images/объект-арктик-спг.png|src/assets/projects/arctic-spg.jpg|1100"
  "images/объект-гыдан.png|src/assets/projects/gydan.jpg|1100"
  "images/объект-музей-транснефть.png|src/assets/projects/muzey-transneft.jpg|1100"
  "images/объект-омский-нпз.png|src/assets/projects/omskiy-npz.jpg|1100"
  "images/объект-куюмба-тайшет.png|src/assets/projects/kuyumba-tayshet.jpg|1100"
  "images/объект-амурский-гпз.png|src/assets/projects/amurskiy-gpz.jpg|1100"
  "images/объект-оп-свободный.png|src/assets/projects/op-svobodnyy.jpg|1100"
  "images/объект-сила-сибири.png|src/assets/projects/sila-sibiri-ks7.jpg|1100"

  # Горы в угол секции «Где работала команда» — уходят под фейд, поэтому
  # важен не сюжет, а общий тон: светлый холодный.
  "images/горы.png|src/assets/gory.jpg|1600"
)

for pair in "${PAIRS[@]}"; do
  IFS='|' read -r src dst maxwidth <<< "$pair"
  if [ ! -f "$src" ]; then
    echo "пропуск: нет $src"
    continue
  fi
  if [ -n "${maxwidth:-}" ]; then
    sips -s format jpeg -s formatOptions 88 -Z "$maxwidth" "$src" --out "$dst" >/dev/null
  else
    sips -s format jpeg -s formatOptions 88 "$src" --out "$dst" >/dev/null
  fi
  printf '%-44s %s\n' "$dst" "$(du -h "$dst" | cut -f1)"
done

# Оптимизатор Next кэширует варианты по пути, а не по содержимому,
# и после подмены файла продолжает отдавать старую картинку.
rm -rf .next/cache/images
echo "кэш оптимизатора очищен"
