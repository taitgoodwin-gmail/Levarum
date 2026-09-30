/**
 * The Levarum lockup: the dome-on-bar mark plus the wordmark.
 */
export interface LogoProps {
  /** Lockup shape. `lift` is the default nav/footer lockup. */
  shape?: 'lift' | 'tile' | 'badge' | 'rule' | 'word' | 'stack';
  /** Mark colour — any CSS colour, normally a `--lv-brand-*` token. */
  color?: string;
  /** Wordmark colour when it differs from the mark (two-tone lockup). */
  wordColor?: string;
  /** Mark size in px. 30 in navs, 26 in footers. */
  size?: number;
  /** Run the `lvLift` dome entrance on mount. */
  animate?: boolean;
  href?: string;
  /** Render as an anchor (default) or a plain element. */
  as?: 'a' | 'div' | 'span';
  style?: React.CSSProperties;
}
export declare function Logo(props: LogoProps): JSX.Element;
