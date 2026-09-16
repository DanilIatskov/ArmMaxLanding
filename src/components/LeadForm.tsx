'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from './ui'

type Status = 'idle' | 'sending' | 'ok' | 'error'

/**
 * Превью на GitHub Pages — статика, принимать заявки там физически некому.
 * Молча ронять форму в ошибку нельзя: демо смотрит заказчик.
 */
const staticPreview = process.env.NEXT_PUBLIC_STATIC_PREVIEW === '1'

const field =
  'w-full rounded-card border border-line bg-surface px-4 py-3.5 text-[15px] text-ink-900 transition-colors placeholder:text-body-soft focus:border-brand-500 focus:outline-none'

export function LeadForm({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = Object.fromEntries(new FormData(form))

    setStatus('sending')
    setError(null)

    if (staticPreview) {
      form.reset()
      setStatus('ok')
      return
    }

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => null)
        throw new Error(body?.error ?? 'Не удалось отправить заявку')
      }

      form.reset()
      setStatus('ok')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось отправить заявку')
      setStatus('error')
    }
  }

  if (status === 'ok') {
    return (
      <div className={`rounded-card border p-8 ${tone === 'dark' ? 'border-white/15 bg-white/5' : 'border-line bg-surface-muted'}`}>
        <p className={`text-lg font-semibold ${tone === 'dark' ? 'text-white' : 'text-ink-900'}`}>
          Заявка отправлена
        </p>
        <p className={`mt-3 text-[15px] ${tone === 'dark' ? 'text-white/65' : 'text-body'}`}>
          {staticPreview
            ? 'Это демонстрационная версия сайта — заявка никуда не отправлена.'
            : 'Перезвоним в рабочее время — пн–пт с 9:00 до 18:00.'}
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate={false}>
      {/* Ловушка для ботов: человек это поле не увидит и не заполнит. */}
      <input
        type="text"
        name="company_website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute h-0 w-0 overflow-hidden opacity-0"
      />

      <div>
        <label htmlFor="lead-name" className="sr-only">
          Ваше имя
        </label>
        <input id="lead-name" name="name" required maxLength={120} placeholder="Ваше имя" className={field} />
      </div>

      <div>
        <label htmlFor="lead-phone" className="sr-only">
          Телефон
        </label>
        <input
          id="lead-phone"
          name="phone"
          type="tel"
          required
          inputMode="tel"
          maxLength={30}
          placeholder="+7 (___) ___-__-__"
          className={field}
        />
      </div>

      <div>
        <label htmlFor="lead-message" className="sr-only">
          Комментарий
        </label>
        <textarea
          id="lead-message"
          name="message"
          rows={4}
          maxLength={2000}
          placeholder="Коротко об объекте: что, где, на какой стадии"
          className={`${field} resize-y`}
        />
      </div>

      {/* 152-ФЗ: без явного согласия форму принимать нельзя. */}
      <label className={`flex cursor-pointer gap-3 text-[13px] leading-relaxed ${tone === 'dark' ? 'text-white/60' : 'text-body-soft'}`}>
        <input
          type="checkbox"
          name="consent"
          required
          className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--color-brand-500)]"
        />
        <span>
          Согласен на обработку персональных данных в соответствии с{' '}
          <Link
            href="/politika-konfidencialnosti"
            className={tone === 'dark' ? 'text-accent-400 underline' : 'text-brand-500 underline'}
          >
            политикой обработки персональных данных
          </Link>
          .
        </span>
      </label>

      {error && (
        <p role="alert" className="text-sm text-[#d63b3b]">
          {error}
        </p>
      )}

      <Button
        type="submit"
        disabled={status === 'sending'}
        variant={tone === 'dark' ? 'ghost' : 'primary'}
        className="w-full disabled:opacity-60 sm:w-auto"
      >
        {status === 'sending' ? 'Отправляем…' : 'Отправить заявку'}
      </Button>
    </form>
  )
}
