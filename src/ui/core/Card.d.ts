import type * as React from 'react';
/**
 * The workhorse surface: 20px radius, hairline border, flat by default.
 */
export interface CardProps {
  /**
   * `standard` — white on paper, 1px hairline. The default.
   * `tinted` — petrol tint with a 1.5px petrol border; callouts like FIX THIS FIRST.
   * `outlined` — no fill, 1.5px ink border; the plan's statement block.
   * `reserved` — 1.5px dashed border, no fill; marks something honestly absent.
   * `dark` — for use inside a dark petrol band; 2px petrol top border.
   * `sunken` — band-coloured fill for summary blocks.
   */
  variant?: 'standard' | 'tinted' | 'outlined' | 'reserved' | 'dark' | 'sunken';
  /** Coloured left border as a RANK marker. `lead` is 4px, `true`/`'yes'` is 3px. Only for genuinely ordered lists. */
  rank?: 'lead' | 'yes' | boolean;
  /** Both shadows are near-invisible; depth normally comes from surface colour. */
  shadow?: 'sm' | 'lg';
  padding?: 'sm' | 'md' | 'lg';
  /** Turn on the hover lift (border → petrol, −2px, soft shadow). Implied by `href`. */
  interactive?: boolean;
  href?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Card(props: CardProps): React.JSX.Element;
