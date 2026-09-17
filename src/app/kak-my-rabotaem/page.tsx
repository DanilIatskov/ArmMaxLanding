import type { Metadata } from 'next'
import { PageHero } from '@/components/PageHero'
import { ButtonLink, Section } from '@/components/ui'
import { BreadcrumbsJsonLd } from '@/components/JsonLd'
import { stages } from '@/content/process'

export const metadata: Metadata = {
  title: 'Как мы работаем — этапы от идеи до ввода в эксплуатацию',
  description:
    'Пять этапов работы АРММАКС-СТРОЙ: разбор задачи, участок и технические условия, проектирование, строительство, ввод в эксплуатацию. Одна компания ведёт объект целиком.',
  alternates: { canonical: '/kak-my-rabotaem' },
}

export default function ProcessPage() {
  return (
    <>
      <BreadcrumbsJsonLd items={[{ name: 'Как мы работаем', url: '/kak-my-rabotaem' }]} />
      <PageHero
        eyebrow="Процесс"
        title="От замысла заказчика до перерезания ленточки"
        lead="Схема, по которой мы ведём объект. У каждого этапа есть результат на руках — документ, по которому видно, что работа сделана."
        breadcrumbs={[{ name: 'Как мы работаем', url: '/kak-my-rabotaem' }]}
      />

      <Section>
        <ol className="space-y-px overflow-hidden rounded-card bg-line">
          {stages.map((stage) => (
            <li key={stage.n} className="invert-hover group grid gap-5 bg-surface p-8 md:grid-cols-12 md:gap-10 lg:p-12">
              <span className="font-condensed text-[clamp(2rem,3.5vw,3rem)] leading-none font-light tracking-[-0.02em] text-brand-600 transition-colors group-hover:text-accent-400 md:col-span-2">
                {stage.n}
              </span>
              <div className="md:col-span-6">
                <h2 className="text-xl leading-snug">{stage.title}</h2>
                <p className="mt-4 text-[15px] leading-relaxed">{stage.text}</p>
              </div>
              <div className="md:col-span-4">
                <p className="text-xs font-semibold tracking-[0.16em] text-body-soft uppercase">
                  Результат этапа
                </p>
                <p className="mt-3 border-l-2 border-accent-500 pl-4 text-[15px] leading-relaxed">
                  {stage.outcome}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section tone="muted">
        <div className="max-w-2xl">
          <h2 className="rule-accent text-2xl">Зачем это одному подрядчику</h2>
          <p className="mt-8 text-lg leading-relaxed">
            Когда этапы раздают разным компаниям, каждая отвечает за свой кусок — и никто за стык.
            Проектировщик не знает, какую точку подключения согласовали. Строитель узнаёт о коллизии
            на площадке. Надзор возвращает документы, которых никто не собирал.
          </p>
          <p className="mt-6 text-lg leading-relaxed">
            Мы держим весь путь у себя, поэтому решение на раннем этапе принимается с оглядкой
            на поздний.
          </p>
          <div className="mt-10">
            <ButtonLink href="/kontakty#zayavka">Обсудить объект</ButtonLink>
          </div>
        </div>
      </Section>
    </>
  )
}
