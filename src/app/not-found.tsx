import { ButtonLink, Container } from '@/components/ui'

export default function NotFound() {
  return (
    <Container className="py-28 md:py-40">
      <p className="text-sm font-semibold tracking-[0.2em] text-brand-500 uppercase">Ошибка 404</p>
      <h1 className="mt-6 text-3xl md:text-[2.5rem]">Страница не найдена</h1>
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
