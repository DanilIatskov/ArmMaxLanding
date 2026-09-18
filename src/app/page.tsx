import type { Metadata } from 'next'
import Image from 'next/image'
import etapyKran from '@/assets/etapy-kran.jpg'
import gory from '@/assets/gory.jpg'
import { Hero } from '@/components/Hero'
import { GlanceGrid } from '@/components/GlanceGrid'
import { SystemTabs } from '@/components/SystemTabs'
import { SectorsGrid } from '@/components/SectorsGrid'
import { ProjectsAccordion } from '@/components/ProjectsAccordion'
import { ClientsMarquee } from '@/components/ClientsMarquee'
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

      <Section tone="muted" className="overflow-hidden">
        {/* Горы уходят в правый верхний угол и растворяются влево и вниз.
            Место справа от заголовка всё равно пустовало, а холодный светлый
            пейзаж задаёт секции тон до того, как человек дойдёт до снимков. */}
        <div className="relative">
          <div
            aria-hidden
            className="pointer-events-none absolute top-[-140px] right-[calc(50%-50vw)] bottom-[-60px] hidden w-[62vw] lg:block"
          >
            <Image src={gory} alt="" fill sizes="62vw" className="object-cover object-right-top" />
            <div className="absolute inset-0 bg-gradient-to-r from-surface-muted from-8% via-surface-muted/55 via-45% to-transparent to-85%" />
            <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-surface-muted to-transparent" />
          </div>

          <Reveal className="relative">
            <SectionHeading
              eyebrow="Наши объекты"
              title="Где работала команда"
              lead="Промышленные и инфраструктурные объекты федерального масштаба. Работы велись в составе ГК «Армакс» — той же командой, что сегодня работает в АРММАКС-СТРОЙ."
            />
          </Reveal>
        </div>
        <ProjectsAccordion formHref="#zayavka" />
        {/* Лента заказчиков идёт справа от ссылки: место там всё равно
            пустовало, а перечень имён подкрепляет список объектов. */}
        <div className="mt-12 flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-10">
          <ArrowLink href="/obekty">Все объекты и заказчики</ArrowLink>
          <ClientsMarquee />
        </div>
      </Section>

      <SectorsGrid />

      <Section tone="muted" className="overflow-hidden">
        {/*
          Кадр занимает правые 60% экрана и живёт только в верхней части блока —
          от края секции до первой линейки списка. Отрицательные top и bottom
          гасят вертикальные поля секции и отступ перед списком, поэтому кадр
          заканчивается ровно на разделителе.

          `right-[calc(50%-50vw)]` выпускает его за контейнер до края окна:
          50% ширины контейнера минус половина окна как раз даёт нужный вынос
          при любой ширине. Слева и снизу кадр гасится градиентами в цвет секции.

          object-cover, а не contain: при contain пропорции не сходились
          и сверху или снизу оставалась пустая полоса, разная на каждой ширине.

          max-width считается от высоты рамки: 446px × (2140/735) ≈ 1298px.
          Пока рамка не шире этого, cover вписывает кадр по высоте и режет
          только левый край с пустым небом — он и так уходит под градиент.
          Без ограничения на широком экране рамка становилась шире пропорций
          кадра, и срезалось уже небо сверху.
        */}
        <div className="relative">
          <div
            aria-hidden
            className="pointer-events-none absolute top-[-120px] right-[calc(50%-50vw)] bottom-[-80px] hidden w-[86vw] max-w-[1298px] lg:block"
          >
            <Image src={etapyKran} alt="" fill sizes="86vw" className="object-cover object-right-bottom" />
            <div className="absolute inset-0 bg-gradient-to-r from-surface-muted from-12% via-surface-muted/50 via-45% to-transparent to-80%" />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-surface-muted to-transparent" />
          </div>

          <Reveal className="relative">
            <SectionHeading
              eyebrow="Как мы работаем"
              title="От замысла заказчика до перерезания ленточки"
              lead="На каждом этапе есть результат, который заказчик получает на руки, — а не обещание, что «всё идёт по плану»."
            />
          </Reveal>
        </div>

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
            lead="Город, тип объекта, объём работ и год."
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
              Готовим материалы по объектам. Скоро здесь появятся карточки с городом, годом
              и объёмом работ.
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

      <div className="bg-ink-900 py-16 md:py-section">
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
