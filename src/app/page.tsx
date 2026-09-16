import Link from 'next/link'
import type { Metadata } from 'next'
import { Hero } from '@/components/Hero'
import { LeadForm } from '@/components/LeadForm'
import { ButtonLink, Container, Section, SectionHeading } from '@/components/ui'
import { services } from '@/content/services'
import { stages } from '@/content/process'
import { objects } from '@/content/objects'
import { advantages, awards, contacts } from '@/content/company'

export const metadata: Metadata = {
  alternates: { canonical: '/' },
}

export default function HomePage() {
  return (
    <>
      <Hero />

      <Section>
        <SectionHeading
          eyebrow="Комплекс"
          title="Пять этапов, за которые отвечает одна компания"
          lead="Заказчику не нужно сводить между собой проектировщика, сетевиков, строителей и надзор. Мы закрываем весь путь и не перекладываем стыки на него."
        />

        <ul className="mt-14 grid gap-px overflow-hidden rounded-card bg-line md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <li key={service.slug} className="bg-surface">
              <Link
                href={`/uslugi/${service.slug}`}
                className="group flex h-full flex-col p-8 transition-colors hover:bg-surface-muted lg:p-10"
              >
                <span className="text-sm font-semibold text-brand-500">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-5 text-xl leading-snug transition-colors group-hover:text-brand-500">
                  {service.title}
                </h3>
                <p className="mt-4 flex-1 text-[15px] leading-relaxed">{service.short}</p>
                <span className="mt-7 text-sm font-semibold text-brand-500">Подробнее →</span>
              </Link>
            </li>
          ))}
          <li className="flex flex-col justify-center bg-ink-900 p-8 lg:p-10">
            <p className="text-lg leading-snug font-semibold text-white">
              Работаем с объектами от 300 млн ₽
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-white/60">
              Дачное строительство — не наш профиль. Если объект меньше, честнее сказать об этом сразу.
            </p>
          </li>
        </ul>
      </Section>

      <Section tone="muted">
        <SectionHeading
          eyebrow="Как мы работаем"
          title="От замысла заказчика до перерезания ленточки"
          lead="На каждом этапе есть результат, который заказчик получает на руки, — а не обещание, что «всё идёт по плану»."
        />

        <ol className="mt-14 space-y-px overflow-hidden rounded-card bg-line">
          {stages.map((stage) => (
            <li key={stage.n} className="grid gap-4 bg-surface p-8 md:grid-cols-12 md:gap-8 lg:p-10">
              <span className="text-2xl font-bold text-brand-600 md:col-span-1">{stage.n}</span>
              <h3 className="text-xl leading-snug md:col-span-3">{stage.title}</h3>
              <p className="text-[15px] leading-relaxed md:col-span-5">{stage.text}</p>
              <p className="border-l-2 border-accent-500 pl-4 text-sm leading-relaxed text-body-soft md:col-span-3">
                {stage.outcome}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-12">
          <ButtonLink href="/kak-my-rabotaem" variant="outline">
            Подробнее об этапах
          </ButtonLink>
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="Почему мы" title="Что меняется, когда объект ведёт один подрядчик" />

        <div className="mt-14 grid gap-12 md:grid-cols-2 lg:gap-x-16">
          {advantages.map((item) => (
            <div key={item.title}>
              <h3 className="text-xl leading-snug">{item.title}</h3>
              <p className="mt-4 text-[15px] leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="muted">
        <SectionHeading
          eyebrow="Объекты"
          title="Что построено"
          lead="Карточки объектов: город, тип, объём работ и год. Раздел ведёт администратор сайта."
        />

        {objects.length > 0 ? (
          <ul className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {objects.slice(0, 6).map((object) => (
              <li key={object.slug} className="rounded-card bg-surface shadow-card">
                <div className="aspect-[4/3] bg-surface-sunken" />
                <div className="p-7">
                  <p className="text-sm text-body-soft">
                    {object.city} · {object.year}
                  </p>
                  <h3 className="mt-3 text-lg leading-snug">{object.title}</h3>
                  <p className="mt-3 text-sm">{object.scope}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-12 rounded-card border border-dashed border-line-strong bg-surface p-10">
            <p className="text-[15px] leading-relaxed">
              Раздел готов к наполнению. Под задачу сайта нужны крупные объекты: название, город, год,
              объём работ и фото с разрешением на публикацию.
            </p>
          </div>
        )}

        <div className="mt-12">
          <ButtonLink href="/obekty" variant="outline">
            Все объекты
          </ButtonLink>
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Признание"
          title="Награды 2026 года"
          lead="Министерство строительства и Инспекция госстройнадзора Новосибирской области — то самое ведомство, через которое проходит ввод объектов в эксплуатацию."
        />

        <ul className="mt-14 grid gap-px overflow-hidden rounded-card bg-line md:grid-cols-2">
          {awards.map((award) => (
            <li key={award.id} className="bg-surface p-8 lg:p-10">
              <p className="text-sm font-semibold text-brand-500">{award.year}</p>
              <h3 className="mt-4 text-lg leading-snug">{award.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed">{award.issuer}</p>
              <p className="mt-3 text-sm text-body-soft">{award.recipient}</p>
            </li>
          ))}
        </ul>

        <div className="mt-12">
          <ButtonLink href="/o-kompanii#nagrady" variant="outline">
            Посмотреть сканы
          </ButtonLink>
        </div>
      </Section>

      <div className="bg-ink-900 py-16 md:py-section">
        <Container>
          <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
            <div>
              <SectionHeading
                tone="dark"
                eyebrow="Связаться"
                title="Расскажите об объекте"
                lead="Ответим в рабочее время и скажем прямо, беремся мы за задачу или нет."
              />

              <dl className="mt-12 space-y-6 text-[15px]">
                <div>
                  <dt className="text-sm text-white/45">Телефон</dt>
                  <dd className="mt-2">
                    <a href={contacts.phonePrimary.href} className="text-xl font-semibold text-white">
                      {contacts.phonePrimary.display}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-white/45">Почта</dt>
                  <dd className="mt-2">
                    <a href={`mailto:${contacts.email}`} className="text-white/80 hover:text-accent-400">
                      {contacts.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-white/45">Офис</dt>
                  <dd className="mt-2 text-white/80">{contacts.office}</dd>
                </div>
                <div>
                  <dt className="text-sm text-white/45">Часы работы</dt>
                  <dd className="mt-2 text-white/80">{contacts.hours}</dd>
                </div>
              </dl>
            </div>

            <div id="zayavka" className="scroll-mt-28">
              <LeadForm tone="dark" />
            </div>
          </div>
        </Container>
      </div>
    </>
  )
}
