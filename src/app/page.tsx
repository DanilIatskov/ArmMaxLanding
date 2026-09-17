import type { Metadata } from 'next'
import { Hero } from '@/components/Hero'
import { GlanceGrid } from '@/components/GlanceGrid'
import { SystemTabs } from '@/components/SystemTabs'
import { SectorsGrid } from '@/components/SectorsGrid'
import { LeadForm } from '@/components/LeadForm'
import { ArrowLink } from '@/components/ArrowLink'
import { Marker } from '@/components/Marker'
import { Reveal } from '@/components/Reveal'
import { ObjectCard } from '@/components/ObjectCard'
import { Container, Section, SectionHeading } from '@/components/ui'
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
      <GlanceGrid />
      <SystemTabs />

      <Section>
        <Reveal>
          <SectionHeading
            eyebrow="Почему мы"
            title="Что меняется, когда объект ведёт один подрядчик"
          />
        </Reveal>

        <div className="mt-14 grid gap-px bg-line lg:mt-20 lg:grid-cols-2">
          {advantages.map((item, i) => (
            <Reveal key={item.title} delay={i * 80} className="bg-surface">
              <div className="invert-hover h-full p-8 lg:p-12">
                <p className="eyebrow flex items-center gap-3 text-brand-500">
                  <Marker />
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h3 className="mt-6 text-2xl leading-snug">{item.title}</h3>
                <p className="mt-5 text-[15px] leading-relaxed">{item.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <SectorsGrid />

      <Section tone="muted">
        <Reveal>
          <SectionHeading
            eyebrow="Как мы работаем"
            title="От замысла заказчика до перерезания ленточки"
            lead="На каждом этапе есть результат, который заказчик получает на руки, — а не обещание, что «всё идёт по плану»."
          />
        </Reveal>

        {/* Линейка живёт на <li>, нижняя — на самом <ol>. Раньше стояло
            `last:border-b`, но каждый <li> был единственным ребёнком своего
            <Reveal>, поэтому правило срабатывало на всех, и границы соседей
            накладывались друг на друга. Заодно <div> больше не лежит в <ol>. */}
        <ol className="mt-14 border-b border-line-strong lg:mt-20">
          {stages.map((stage, i) => (
            <li key={stage.n} className="invert-hover group -mx-5 border-t border-line-strong px-5 lg:-mx-14 lg:px-14">
              <Reveal delay={i * 60} className="grid gap-4 py-8 md:grid-cols-12 md:gap-10 md:py-10">
                <span className="font-condensed text-[clamp(1.75rem,3vw,2.75rem)] leading-none font-light tracking-[-0.02em] text-brand-600 transition-colors group-hover:text-accent-400 md:col-span-2">
                  {stage.n}
                </span>
                <h3 className="text-xl leading-snug md:col-span-3">{stage.title}</h3>
                <p className="text-[15px] leading-relaxed md:col-span-4">{stage.text}</p>
                <p className="eyebrow flex items-start gap-3 text-body-soft md:col-span-3">
                  <Marker className="mt-px" />
                  <span className="leading-[1.5]">{stage.outcome}</span>
                </p>
              </Reveal>
            </li>
          ))}
        </ol>

        <div className="mt-12">
          <ArrowLink href="/kak-my-rabotaem">Подробнее об этапах</ArrowLink>
        </div>
      </Section>

      <Section>
        <Reveal>
          <SectionHeading
            eyebrow="Объекты"
            title="Что построено"
            lead="Карточки объектов: город, тип, объём работ и год. Раздел ведёт администратор сайта."
          />
        </Reveal>

        {objects.length > 0 ? (
          <>
            <ul className="mt-14 grid gap-px bg-line md:grid-cols-2 lg:mt-20 lg:grid-cols-3">
              {objects.slice(0, 3).map((object, i) => (
                <Reveal key={object.slug} delay={i * 80} className="bg-surface">
                  <li className="h-full">
                    <ObjectCard object={object} />
                  </li>
                </Reveal>
              ))}
            </ul>
          </>
        ) : (
          <div className="mt-12 border border-dashed border-line-strong p-10 lg:p-14">
            <p className="max-w-2xl text-[15px] leading-relaxed">
              Раздел готов к наполнению. Под задачу сайта нужны крупные объекты: название, город,
              год, объём работ и фото с разрешением на публикацию.
            </p>
          </div>
        )}

        <div className="mt-12">
          <ArrowLink href="/obekty">Все объекты</ArrowLink>
        </div>
      </Section>

      <Section tone="muted">
        <Reveal>
          <SectionHeading
            eyebrow="Признание"
            title="Награды 2026 года"
            lead="Министерство строительства и Инспекция госстройнадзора Новосибирской области — то самое ведомство, через которое проходит ввод объектов в эксплуатацию."
          />
        </Reveal>

        <ul className="mt-14 grid gap-px bg-line md:grid-cols-2 lg:mt-20 lg:grid-cols-4">
          {awards.map((award, i) => (
            <Reveal key={award.id} delay={i * 70} className="bg-surface">
              <li className="invert-hover flex h-full flex-col p-8 lg:p-10">
                <p className="eyebrow flex items-center gap-3 text-brand-500">
                  <Marker />
                  {award.year}
                </p>
                <h3 className="mt-6 text-xl leading-snug">{award.title}</h3>
                <p className="mt-4 flex-1 text-[15px] leading-relaxed">{award.issuer}</p>
                <p className="mt-5 text-sm text-body-soft">{award.recipient}</p>
              </li>
            </Reveal>
          ))}
        </ul>

        <div className="mt-12">
          <ArrowLink href="/o-kompanii#nagrady">Посмотреть сканы</ArrowLink>
        </div>
      </Section>

      <div className="bg-ink-950 py-16 md:py-section">
        <Container>
          <div className="grid gap-14 lg:grid-cols-2 lg:gap-24">
            <div>
              <SectionHeading
                tone="dark"
                eyebrow="Связаться"
                title="Расскажите об объекте"
                lead="Ответим в рабочее время и скажем прямо, беремся мы за задачу или нет."
              />

              <dl className="mt-14 grid gap-8 sm:grid-cols-2">
                <div>
                  <dt className="eyebrow text-white/40">Телефон</dt>
                  <dd className="mt-3">
                    <a href={contacts.phonePrimary.href} className="text-2xl font-extrabold tracking-tight text-white">
                      {contacts.phonePrimary.display}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="eyebrow text-white/40">Почта</dt>
                  <dd className="mt-3">
                    <a href={`mailto:${contacts.email}`} className="text-white/80 transition-colors hover:text-accent-400">
                      {contacts.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="eyebrow text-white/40">Офис</dt>
                  <dd className="mt-3 text-white/80">{contacts.office}</dd>
                </div>
                <div>
                  <dt className="eyebrow text-white/40">Часы работы</dt>
                  <dd className="mt-3 text-white/80">{contacts.hours}</dd>
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
