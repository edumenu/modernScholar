/**
 * Pretext font strings matching the project's loaded fonts.
 *
 * Noto Serif  → --font-heading (weights 400, 700)
 * Poppins     → --font-sans   (weights 400, 500, 600, 700)
 *
 * Tailwind size → px (at 16px root):
 *   text-4xl  = 2.25rem = 36px
 *   text-5xl  = 3rem    = 48px
 *   text-3xl  = 1.875rem = 30px
 *   text-sm   = 0.875rem = 14px
 */
export const PRETEXT_FONTS = {
  /** Hero h1 at md+ (text-[3rem] / text-5xl = 48px, bold) */
  heroHeadline: "700 48px 'Noto Serif'",
  /** Hero h1 at base (text-4xl = 36px, bold) */
  heroHeadlineSm: "700 36px 'Noto Serif'",
  /** Section headings (text-3xl = 30px, medium weight) */
  sectionHeading: "500 30px 'Noto Serif'",
  /** Card titles (text-lg = 18px, medium weight) */
  cardTitle: "500 18px Poppins",
  /** Small body text (text-sm = 14px) */
  bodySmall: "400 14px Poppins",
  /** Default body text (16px) */
  body: "400 16px Poppins",
} as const;

/** System fallback fonts for CLS prevention (measure before web fonts load) */
export const PRETEXT_FALLBACK_FONTS = {
  heroHeadline: "700 48px serif",
  heroHeadlineSm: "700 36px serif",
  sectionHeading: "500 30px serif",
  cardTitle: "500 18px sans-serif",
  bodySmall: "400 14px sans-serif",
  body: "400 16px sans-serif",
} as const;
