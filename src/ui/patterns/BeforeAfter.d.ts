import type * as React from 'react';
/**
 * The today / once-it-is-set-up pair. Dashed grey rule vs solid petrol rule.
 */
export interface BeforeAfterProps {
  /** Uppercased automatically. Vary it per card: `TODAY`, `A ROOFER TODAY`, `A BATHROOM FITTER TODAY`. */
  beforeLabel?: React.ReactNode;
  /** `ONCE IT IS SET UP`, `THE SAME CALL, SET UP`, `THE SAME WEEK, SET UP`. */
  afterLabel?: React.ReactNode;
  /** A named Tuesday going wrong — concrete, one scene, present tense. */
  before?: React.ReactNode;
  /** The same scene going right. Same length, no exclamation. */
  after?: React.ReactNode;
  /** Stack them (default) or sit them side by side. */
  direction?: 'column' | 'row';
  style?: React.CSSProperties;
}
export declare function BeforeAfter(props: BeforeAfterProps): React.JSX.Element;
