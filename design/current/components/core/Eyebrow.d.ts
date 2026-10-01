/** The tracked-caps micro-label above a heading or inside a card. */
export interface EyebrowProps {
  /** `sec` petrol (default) · `quiet` ink-quiet · `accent` rust · `inverse` on a dark band. */
  tone?: 'sec' | 'quiet' | 'accent' | 'inverse';
  /** 0.08em tracking instead of 0.06em — for page-level eyebrows above an h1. */
  wide?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Eyebrow(props: EyebrowProps): JSX.Element;
