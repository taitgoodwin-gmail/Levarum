/**
 * A big numeral with its unit. Time is the only unit in this product.
 */
export interface HoursFigureProps {
  /** The numeral — normally hours, sometimes a percentage or a count. */
  value?: React.ReactNode;
  /** `h` in compact rows; a two-line phrase like `hours<br/>a week` with `block`. */
  unit?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Set the unit in display type at heading weight instead of quiet ink. */
  block?: boolean;
  style?: React.CSSProperties;
}
export declare function HoursFigure(props: HoursFigureProps): JSX.Element;
