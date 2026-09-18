import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHero } from '@/components/PageHero'
import { Section } from '@/components/ui'
import { contacts, requisites } from '@/content/company'

export const metadata: Metadata = {
  title: { absolute: 'Политика использования файлов cookie' },
  description:
    'Какие файлы cookie использует сайт ООО «АРММАКС-СТРОЙ», зачем они нужны и как отказаться от аналитических.',
  alternates: { canonical: '/politika-cookie' },
  robots: { index: false, follow: true },
}

/**
 * Нужна, раз на сайте есть баннер о cookie: ссылаться из баннера некуда,
 * если страницы нет. Текст типовой — перед запуском его должен посмотреть
 * юрист заказчика, как и политику по персональным данным.
 */
export default function CookiePolicyPage() {
  return (
    <>
      <PageHero
        title="Политика использования файлов cookie"
        breadcrumbs={[{ name: 'Политика cookie', url: '/politika-cookie' }]}
      />

      <Section>
        <div className="max-w-3xl space-y-10 text-[15px] leading-relaxed">
          <section>
            <h2 className="mb-5 text-xl">1. Что такое cookie</h2>
            <p>
              Cookie — небольшие файлы, которые сайт сохраняет в браузере посетителя. Они позволяют
              запомнить выбор человека и собрать обезличенную статистику посещений. Оператор
              сайта — {requisites.legalName}.
            </p>
          </section>

          <section>
            <h2 className="mb-5 text-xl">2. Какие cookie использует сайт</h2>
            <p>
              <strong className="font-semibold">Необходимые.</strong> Без них сайт не работает.
              Сюда относится запись вашего решения по этому уведомлению: она хранится в браузере,
              чтобы не спрашивать вас при каждом заходе, и никуда не передаётся.
            </p>
            <p className="mt-4">
              <strong className="font-semibold">Аналитические.</strong> Их ставит Яндекс.Метрика,
              чтобы посчитать посещаемость: сколько человек заходит, с каких страниц уходит, какими
              устройствами пользуется. Данные обезличены — по ним нельзя установить личность.
              Эти cookie подключаются только после вашего согласия.
            </p>
            <p className="mt-4">
              Рекламных cookie и передачи данных рекламным сетям на сайте нет.
            </p>
          </section>

          <section>
            <h2 className="mb-5 text-xl">3. Как отказаться</h2>
            <p>
              В уведомлении внизу экрана выберите «Только необходимые» — аналитические cookie
              подключены не будут, а сайт продолжит работать как обычно.
            </p>
            <p className="mt-4">
              Если решение уже принято и вы хотите его изменить, очистите данные сайта в настройках
              браузера: уведомление появится снова. Там же можно запретить cookie полностью —
              сайт останется доступен, но браузер перестанет запоминать ваш выбор и будет
              показывать уведомление при каждом заходе.
            </p>
          </section>

          <section>
            <h2 className="mb-5 text-xl">4. Персональные данные</h2>
            <p>
              Данные, которые вы отправляете через форму заявки — имя, телефон, текст сообщения, —
              обрабатываются отдельно. Порядок описан в{' '}
              <Link
                href="/politika-konfidencialnosti"
                className="text-brand-500 underline underline-offset-4 transition-colors hover:text-accent-500"
              >
                политике обработки персональных данных
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="mb-5 text-xl">5. Вопросы</h2>
            <p>
              По вопросам об использовании cookie пишите на{' '}
              <a
                href={`mailto:${contacts.email}`}
                className="text-brand-500 underline underline-offset-4 transition-colors hover:text-accent-500"
              >
                {contacts.email}
              </a>{' '}
              или звоните {contacts.phonePrimary.display}.
            </p>
          </section>
        </div>
      </Section>
    </>
  )
}
