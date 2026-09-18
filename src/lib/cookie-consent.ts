'use client'

import { useSyncExternalStore } from 'react'

/**
 * Согласие на аналитические cookie.
 *
 * Решение живёт в localStorage браузера: своего пользователя у сайта нет,
 * а сервер про выбор знать не должен — иначе для хранения этого выбора
 * понадобилось бы своё же согласие.
 *
 * Любое обращение к хранилищу обёрнуто: в приватном окне и при запрете
 * данных сайта оно бросает исключение. Не смогли прочитать — считаем,
 * что согласия нет, и счётчик не запускаем. Молчание не согласие.
 */

const KEY = 'armmaks-cookie-consent'
const EVENT = 'armmaks:cookie-consent'

export type Consent = 'accepted' | 'declined' | null

/**
 * На сервере и в момент гидратации ответа ещё нет: localStorage там
 * недоступен. Отдельное значение вместо null — чтобы баннер не мигал
 * у тех, кто уже выбрал: «нет согласия» и «пока не знаем» это разное.
 */
export type ConsentState = Consent | 'unknown'

function read(): Consent {
  try {
    const value = localStorage.getItem(KEY)
    return value === 'accepted' || value === 'declined' ? value : null
  } catch {
    return null
  }
}

export function writeConsent(value: Exclude<Consent, null>) {
  try {
    localStorage.setItem(KEY, value)
  } catch {
    // Записать не вышло — баннер вернётся в следующий раз. Неприятно,
    // но безопаснее, чем считать несохранённое согласие полученным.
  }
  window.dispatchEvent(new CustomEvent(EVENT, { detail: value }))
}

function subscribe(onChange: () => void) {
  // 'storage' приходит из других вкладок, свой CustomEvent — из этой:
  // собственные записи в localStorage событие 'storage' не порождают.
  window.addEventListener(EVENT, onChange)
  window.addEventListener('storage', onChange)
  return () => {
    window.removeEventListener(EVENT, onChange)
    window.removeEventListener('storage', onChange)
  }
}

/**
 * Хранилище внешнее по отношению к React, поэтому подписка через
 * useSyncExternalStore, а не через чтение в эффекте: тот сначала отрисовал
 * бы состояние по умолчанию и только потом поправил его.
 */
export function useCookieConsent(): ConsentState {
  return useSyncExternalStore<ConsentState>(subscribe, read, () => 'unknown')
}
