'use client'

import { useState } from 'react'

/**
 * Карта объектов — виджет Конструктора Яндекс.Карт.
 *
 * Грузится по клику, а не сразу. Причин две.
 *
 * Первая — куки. Виджет ставит свои, а сайт спрашивает согласие на аналитику
 * отдельной строкой; карта, загруженная молча при открытии страницы, делала бы
 * это согласие формальностью.
 *
 * Вторая — вес. Виджет тянет чужой скрипт, тайлы и шрифты — это сотни
 * килобайт ради блока внизу страницы, до которого доходит меньшая часть
 * посетителей. До клика здесь только разметка: подпись и кнопка.
 *
 * Карта живёт в Конструкторе, а не собирается кодом: так метки правятся без
 * выката, прямо в интерфейсе Яндекса. Взамен — ключ API не нужен вовсе.
 */

/** Идентификатор карты в Конструкторе. Меняется вместе с составом меток. */
const MAP_ID = '63d6aba8c940b104174b99795d64fd25b36c9f46464ee074618fa767e497a93f'

const MAP_SRC = `https://yandex.ru/map-widget/v1/?um=constructor%3A${MAP_ID}&source=constructorLink`
const MAP_PAGE = `https://yandex.ru/maps/?um=constructor%3A${MAP_ID}&source=constructorLink`

export function ObjectsMap() {
  const [shown, setShown] = useState(false)

  return (
    <div className="mt-10">
      {shown ? (
        <iframe
          src={MAP_SRC}
          title="Карта объектов АРММАКС-СТРОЙ"
          loading="lazy"
          className="aspect-[21/9] w-full rounded-card border border-line"
          allowFullScreen
        />
      ) : (
        <div className="flex aspect-[21/9] w-full flex-col items-start justify-end rounded-card border border-line bg-surface p-8 lg:p-10">
          <p className="max-w-xl text-[15px] leading-relaxed">
            Метки объектов — от Гыданского полуострова до Амурской области.
            Карту показывает Яндекс: она подгружается по кнопке и ставит свои
            файлы cookie.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-6">
            <button
              type="button"
              onClick={() => setShown(true)}
              className="border border-line-strong px-6 py-3 text-sm transition-colors hover:bg-ink-invert hover:text-white"
            >
              Показать карту
            </button>
            {/* Запасной путь: если виджет не загрузится, карта открывается
                на самих Яндекс.Картах. */}
            <a
              href={MAP_PAGE}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm underline-offset-4 hover:underline"
            >
              Открыть на Яндекс.Картах
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
