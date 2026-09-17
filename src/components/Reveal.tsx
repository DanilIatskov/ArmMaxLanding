'use client'

import { useCallback, useState, type ReactNode } from 'react'

/**
 * Появление блока при первом попадании в кадр.
 * Бриф просит анимацию «умеренно, для акцентов» — поэтому только один раз
 * и только сдвиг с прозрачностью, без параллаксов.
 *
 * Наблюдатель навешивается в ref-колбэке, а не в эффекте: в React 19 колбэк
 * умеет возвращать функцию очистки, и лишнего прохода рендера не случается.
 */
export function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const [shown, setShown] = useState(false)

  const ref = useCallback((node: HTMLDivElement | null) => {
    if (!node) return

    // Если IntersectionObserver недоступен, показываем сразу: контент важнее эффекта.
    if (typeof IntersectionObserver === 'undefined') {
      setShown(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          observer.disconnect()
        }
      },
      { rootMargin: '0px 0px -12% 0px' },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`reveal ${shown ? 'reveal-in' : ''} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}
