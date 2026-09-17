import { ButtonLink, Container } from '@/components/ui'

export default function NotFound() {
  return (
    <Container className="pt-44 pb-28 md:pt-56 md:pb-40">
      <p className="eyebrow text-brand-500">Ошибка 404</p>
      <h1 className="mt-6 text-[clamp(2rem,5vw,3.5rem)] leading-[1.03]">Страница не найдена</h1>
      <p className="mt-7 max-w-xl text-lg leading-relaxed">
        Возможно, страницу убрали или в адресе опечатка.
      </p>
      <div className="mt-10 flex flex-col gap-4 sm:flex-row">
        <ButtonLink href="/">На главную</ButtonLink>
        <ButtonLink href="/kontakty" variant="outline">
          Контакты
        </ButtonLink>
      </div>
    </Container>
  )
}
