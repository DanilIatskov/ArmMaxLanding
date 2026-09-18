'use client'

import Script from 'next/script'
import { useCookieConsent } from '@/lib/cookie-consent'

/**
 * Яндекс.Метрика.
 *
 * Два условия, и оба обязательны: в окружении есть номер счётчика,
 * и человек согласился на аналитические cookie. Без второго условия баннер
 * был бы бутафорией — кнопка «Принимаю» ни на что бы не влияла, а счётчик
 * грузился бы всё равно.
 *
 * Счётчик подключается только когда номер задан, поэтому на препроде
 * и в разработке статистика не пачкается.
 */
export function YandexMetrika() {
  const id = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID
  const consent = useCookieConsent()

  if (!id || consent !== 'accepted') return null

  return (
    <>
      <Script id="yandex-metrika" strategy="afterInteractive">
        {`
          (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
          m[i].l=1*new Date();
          for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
          k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
          (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
          ym(${Number(id)}, "init", { clickmap:true, trackLinks:true, accurateTrackBounce:true, webvisor:true });
        `}
      </Script>
      <noscript>
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element -- официальный пиксель Метрики для noscript, next/image здесь неприменим */}
          <img
            src={`https://mc.yandex.ru/watch/${Number(id)}`}
            style={{ position: 'absolute', left: '-9999px' }}
            alt=""
          />
        </div>
      </noscript>
    </>
  )
}
