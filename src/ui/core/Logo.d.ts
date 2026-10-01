import type * as React from 'react';
/**
 * Reviewed lowercase wordmark. Explicit legacy lockup variants remain compatible.
 */
export interface LogoProps {
  /** Lockup shape. `word` is the default public/admin wordmark. */
  shape?: 'lift' | 'tile' | 'badge' | 'rule' | 'word' | 'stack' | 'joined';
  /** Mark colour — any CSS colour, normally a `--lv-brand-*` token. */
  color?: string;
  /** Wordmark colour when it differs from the mark (two-tone lockup). */
  wordColor?: string;
  /** Wordmark font size, or explicit legacy mark size, in px. */
  size?: number;
  /** Legacy compatibility prop. Current logos do not animate. */
  animate?: boolean;
  href?: string;
  /** Render as an anchor (default) or a plain element. */
  as?: 'a' | 'div' | 'span';
  style?: React.CSSProperties;
}
export declare function Logo(props: LogoProps): React.JSX.Element;
