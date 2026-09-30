import type * as React from 'react';
/** A fully-rounded status or context pill in tracked caps. */
export interface PillProps {
  /** The four admin workflow states, or `sec` for a neutral petrol pill (ADMIN, OWNER-RUN BUSINESSES · ANYWHERE IN THE US). */
  tone?: 'new' | 'contacted' | 'booked' | 'done' | 'sec';
  /** Prepend the small round marker used on the hero context pill. */
  dot?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Pill(props: PillProps): React.JSX.Element;
