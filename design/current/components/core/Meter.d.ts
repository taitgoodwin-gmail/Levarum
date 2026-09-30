/** The hours-back bar. The site's signature motion: fills from zero on scroll-in. */
export interface MeterProps {
  /** Percent 0–100. The scale is fixed site-wide: 4 hours a week = 100. */
  value?: number;
  /** `sm` 6px (inside compact rows) · `md` 10px (default) · `lg` 12px (the lead job). */
  height?: 'sm' | 'md' | 'lg';
  /** Use the paler fill — marks the smallest item in a set. */
  quiet?: boolean;
  /** Set false to render at final width with no scroll-in fill. */
  animate?: boolean;
  style?: React.CSSProperties;
}
export declare function Meter(props: MeterProps): JSX.Element;
