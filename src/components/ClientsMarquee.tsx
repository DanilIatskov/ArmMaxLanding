import Image from 'next/image'
import { partners } from '@/content/projects'

/**
 * Лента заказчиков рядом со ссылкой на страницу объектов.
 *
 * Пока у партнёров нет файлов знаков, в ленте едут названия — и это
 * не заглушка на время. Назвать компанию словом в перечне работ
 * и разместить её товарный знак юридически разные вещи: на второе нужно
 * письменное согласие, а у компаний такого масштаба есть регламенты
 * фирменного стиля. Появятся файлы и согласование — достаточно положить
 * их в `logo` в src/content/projects.ts, разметка уже готова.
 *
 * Список дублируется целиком: вторая копия едет следом, и на -50% кадр
 * совпадает с началом, поэтому шва не видно. Копии помечены aria-hidden —
 * читалке экрана хватит одного перечня.
 *
 * По краям маска: лента уезжает в ничто, а не обрывается о край колонки.
 */
export function ClientsMarquee() {
  const row = (hidden: boolean) => (
    <ul
      aria-hidden={hidden || undefined}
      className="marquee-track flex shrink-0 items-center gap-10 pr-10"
    >
      {partners.map((partner) => (
        <li key={partner.id} className="shrink-0">
          {partner.logo ? (
            <Image
              src={partner.logo}
              alt={partner.name}
              height={28}
              className="h-7 w-auto opacity-60"
            />
          ) : (
            <span className="text-sm whitespace-nowrap text-body-soft">{partner.short}</span>
          )}
        </li>
      ))}
    </ul>
  )

  return (
    <div className="marquee relative min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
      <div className="flex w-max">
        {row(false)}
        {row(true)}
      </div>
    </div>
  )
}
