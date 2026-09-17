import Image from 'next/image'
import type { BuildObject } from '@/content/objects'

/**
 * Карточка объекта. Пока фотографии нет, на её месте серая заглушка
 * с подписью: так сразу видно, что кадр не потерялся, а ещё не пришёл.
 *
 * Поля живут на самой карточке, а не на блоках внутри: иначе снимок уходит
 * в край и склеивается с соседним — между колонками только волосяная линия.
 */
export function ObjectCard({ object }: { object: BuildObject }) {
  return (
    <article className="invert-hover group flex h-full flex-col bg-surface p-7 lg:p-8">
      <div className="relative aspect-[4/3] overflow-hidden">
        {object.image ? (
          <Image
            src={object.image}
            alt={object.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-surface-sunken transition-colors duration-300 group-hover:bg-white/10">
            <span className="eyebrow text-body-soft">Здесь будет фото объекта</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col pt-7">
        <p className="eyebrow text-body-soft">
          {object.city} · {object.year}
        </p>

        <h3 className="mt-4 text-xl leading-snug transition-colors group-hover:text-brand-500">
          {object.title}
        </h3>

        <p className="mt-4 flex-1 text-[15px] leading-relaxed">{object.scope}</p>

        {/* На инверсии border-line (#dfe4ee) читается почти как белая линия
            и перетягивает внимание с заголовка — гасим до той же прозрачной
            белой, что разделяет блоки в футере и тёмной форме. */}
        <dl className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-t border-line pt-5 text-sm transition-colors duration-300 group-hover:border-white/15">
          <div className="flex gap-2">
            <dt className="text-body-soft">Тип</dt>
            <dd className="text-ink-900">{object.type}</dd>
          </div>
          {object.area && (
            <div className="flex gap-2">
              <dt className="text-body-soft">Объём</dt>
              <dd className="text-ink-900">{object.area}</dd>
            </div>
          )}
        </dl>
      </div>
    </article>
  )
}
