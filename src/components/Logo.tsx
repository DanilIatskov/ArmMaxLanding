/**
 * Логотип АРММАКС-СТРОЙ — чистое шрифтовое написание, без знака.
 *
 * Набран Roboto Condensed Bold: узкий рубленый гротеск из макета шапки.
 * Узкое начертание позволяет держать крупный кегль в габарите 167×48
 * и собирает слово в плотное пятно, а не в разреженную строку.
 *
 * Гранёная «М» заказчика не потерялась: она стоит фавиконом
 * (`src/app/icon.svg`), где читается лучше надписи. Растровый оригинал
 * лежит в `public/images/brand/` для аватарок и печати.
 */

const SIZES = {
  sm: { name: 'text-[26px]', sub: 'text-[10px] mt-[3px]' },
  md: { name: 'text-[34px]', sub: 'text-[12px] mt-[4px]' },
  lg: { name: 'text-[44px]', sub: 'text-[15px] mt-[6px]' },
} as const

export function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const s = SIZES[size]

  return (
    <span className="inline-flex flex-col font-condensed leading-none font-bold">
      <span className={`${s.name} leading-[0.85] tracking-[-0.01em]`}>АРММАКС</span>
      {/* Разрядка набрана раскладкой букв по ширине, а не letter-spacing:
          так нижняя строка садится точно по краям верхней при любом кегле. */}
      <span className={`${s.sub} flex w-full justify-between leading-none`} aria-hidden>
        {['С', 'Т', 'Р', 'О', 'Й'].map((letter, i) => (
          <span key={i}>{letter}</span>
        ))}
      </span>
      <span className="sr-only">СТРОЙ</span>
    </span>
  )
}
