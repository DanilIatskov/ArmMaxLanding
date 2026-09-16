import { ButtonLink, Container } from './ui'
import { company, stats } from '@/content/company'

export function Hero() {
  return (
    <div className="relative overflow-hidden bg-ink-900">
      {/* Фотографий объектов заказчик пока не прислал. Вместо стокового
          строительства — гранёный фон из палитры логотипа: он не врёт
          о компании и не выглядит шаблонно. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(120%_100%_at_85%_0%,#1e2754_0%,#0b1028_55%,#070b1f_100%)]" />
        <svg className="absolute top-0 right-0 h-full w-[60%] opacity-[0.16]" viewBox="0 0 600 600" preserveAspectRatio="xMaxYMid slice">
          <defs>
            <linearGradient id="hero-facet" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#00adef" />
              <stop offset="100%" stopColor="#2e3192" />
            </linearGradient>
          </defs>
          {Array.from({ length: 36 }, (_, i) => {
            const col = i % 6
            const row = Math.floor(i / 6)
            const x = col * 100
            const y = row * 100
            if ((col + row) % 3 === 0) return null
            return (
              <polygon
                key={i}
                points={`${x},${y} ${x + 100},${y} ${x},${y + 100}`}
                fill="url(#hero-facet)"
                opacity={0.35 + ((col * row) % 5) * 0.13}
              />
            )
          })}
        </svg>
      </div>

      <Container className="relative py-20 md:py-28 lg:py-36">
        <p className="mb-6 text-xs font-semibold tracking-[0.22em] text-accent-400 uppercase">
          {company.region}
        </p>

        <h1 className="max-w-4xl text-4xl leading-[1.1] font-bold text-white md:text-5xl lg:text-display">
          Строительство под ключ: от технических условий до ввода в эксплуатацию
        </h1>

        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-white/65">
          Берём объект целиком — участок, ТУ, проект, стройку и сдачу в Госстройнадзоре.
          Заказчик ведёт дела с одним подрядчиком от первой встречи до разрешения на ввод.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <ButtonLink href="/kontakty#zayavka">Связаться</ButtonLink>
          <ButtonLink href="/uslugi" variant="ghost">
            Что входит в комплекс
          </ButtonLink>
        </div>

        <dl className="mt-16 grid grid-cols-2 gap-x-6 gap-y-10 border-t border-white/10 pt-12 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label}>
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <span className="text-3xl font-bold text-white md:text-4xl">{stat.value}</span>
                {stat.unit && <span className="ml-2 text-lg font-medium text-accent-400">{stat.unit}</span>}
                <span className="mt-3 block text-sm leading-snug text-white/55">{stat.label}</span>
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </div>
  )
}
