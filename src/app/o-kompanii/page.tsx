import Image from 'next/image'
import type { Metadata } from 'next'
import { PageHero } from '@/components/PageHero'
import { ButtonLink, Pending, Section } from '@/components/ui'
import { BreadcrumbsJsonLd } from '@/components/JsonLd'
import { advantages, awards, permits } from '@/content/company'

export const metadata: Metadata = {
  title: 'О компании — ООО «АРММАКС-СТРОЙ», Новосибирск',
  description:
    'ООО «АРММАКС-СТРОЙ»: 25 лет в строительстве, объекты капитального строительства в Новосибирске и СФО. Награды Министерства строительства и Госстройнадзора Новосибирской области.',
  alternates: { canonical: '/o-kompanii' },
}

export default function AboutPage() {
  return (
    <>
      <BreadcrumbsJsonLd items={[{ name: 'О компании', url: '/o-kompanii' }]} />
      <PageHero
        eyebrow="О компании"
        title="ООО «АРММАКС-СТРОЙ»"
        lead="Строительная компания из Новосибирска. Ведём объекты капитального строительства целиком — от технических условий до разрешения на ввод."
        breadcrumbs={[{ name: 'О компании', url: '/o-kompanii' }]}
      />

      <Section>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <h2 className="rule-accent text-2xl">Кто мы</h2>
            <div className="mt-10 space-y-6 text-lg leading-relaxed">
              <p>
                За 25 лет в строительстве мы прошли путь от подрядных работ до полного цикла
                по объекту. Сегодня берём объекты капитального строительства от 300 млн рублей
                и ведём их сами: участок, технические условия, проект, стройка, ввод
                в эксплуатацию.
              </p>
              <p>
                Работаем по Сибирскому федеральному округу, офис — в Новосибирске.
              </p>
            </div>
          </div>

          <div className="lg:col-span-5">
            <h2 className="rule-accent text-2xl">Принципы</h2>
            <ul className="mt-10 space-y-8">
              {advantages.map((item) => (
                <li key={item.title}>
                  <h3 className="text-base leading-snug">{item.title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed">{item.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section tone="muted" id="nagrady">
        <h2 className="rule-accent text-2xl">Награды</h2>
        <p className="mt-8 max-w-2xl text-[15px] leading-relaxed">
          2026 год: Министерство строительства Новосибирской области и Инспекция государственного
          строительного надзора Новосибирской области — коллективу компании и руководителю проектов
          Константину Борисовичу Бахтееву.
        </p>

        <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {awards.map((award) => (
            <li key={award.id} className="overflow-hidden rounded-card bg-surface shadow-card">
              <div className="relative aspect-[3/4] bg-surface-sunken">
                <Image
                  src={award.image}
                  alt={`${award.title}: ${award.issuer}, ${award.recipient}, ${award.year}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-base leading-snug">{award.title}</h3>
                <p className="mt-3 text-sm leading-relaxed">{award.issuer}</p>
                <p className="mt-3 text-sm text-body-soft">{award.recipient}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <h2 className="rule-accent text-2xl">Допуски и членство в СРО</h2>
        <p className="mt-8 max-w-2xl text-[15px] leading-relaxed">
          Членство в саморегулируемой организации — то, что проверяют перед заключением договора
          генподряда.
        </p>
        <dl className="mt-10 max-w-2xl space-y-6 border-t border-line pt-8">
          <div className="grid gap-2 sm:grid-cols-2">
            <dt className="text-sm text-body-soft">СРО на строительство</dt>
            <dd>{permits.sroConstruction ?? <Pending what="Номер и выписка" />}</dd>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <dt className="text-sm text-body-soft">СРО на проектирование</dt>
            <dd>{permits.sroDesign ?? <Pending what="Номер и выписка" />}</dd>
          </div>
        </dl>

        <div className="mt-12">
          <ButtonLink href="/rekvizity" variant="outline">
            Реквизиты компании
          </ButtonLink>
        </div>
      </Section>
    </>
  )
}
