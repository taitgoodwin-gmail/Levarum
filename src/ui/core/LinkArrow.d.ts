import type * as React from 'react';
/** An onward link: a phrase in display type with a trailing text arrow. */
export interface LinkArrowProps {
  href?: string;
  /** The label WITHOUT the arrow — the component appends ` →`. */
  children?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  /** Starts ink-quiet and warms to petrol on hover, for footer-adjacent links. */
  quiet?: boolean;
  style?: React.CSSProperties;
}
export declare function LinkArrow(props: LinkArrowProps): React.JSX.Element;
