import { PageHero } from '@/components/PageHero'
import { ButtonLink, Section } from '@/components/ui'

export default function NotFound() {
  return (
    <>
      <PageHero
        eyebrow="Ошибка 404"
        title="Страница не найдена"
        lead="Возможно, страницу убрали или в адресе опечатка."
      />

      <Section>
        <div className="flex flex-col gap-4 sm:flex-row">
          <ButtonLink href="/">На главную</ButtonLink>
          <ButtonLink href="/kontakty" variant="outline">
            Контакты
          </ButtonLink>
        </div>
      </Section>
    </>
  )
}
