import type * as React from 'react';
/** Wizard progress: three dots or three bars, with the step named in text beside them. */
export interface ProgressStepsProps {
  step?: number;
  total?: number;
  /** `dots` 11px circles (default) · `bars` 6px flex-filling bars. */
  form?: 'dots' | 'bars';
  /** Defaults to "Step N of T". The text is required — colour is never the only carrier. */
  label?: React.ReactNode;
  /** Right-hand note, e.g. "About 90 seconds in total". */
  note?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function ProgressSteps(props: ProgressStepsProps): React.JSX.Element;
