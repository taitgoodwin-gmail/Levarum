import type * as React from 'react';
/** A numeral in a bordered circle. The system's substitute for step icons. */
export interface StepNumberProps {
  n?: React.ReactNode;
  /** 34px for page-level steps, 28px in lists, 26px on timelines. */
  size?: number;
  /** `sec` petrol tint (default) · `ink` outlined only, for lists on white. */
  tone?: 'sec' | 'ink';
  style?: React.CSSProperties;
}
export declare function StepNumber(props: StepNumberProps): React.JSX.Element;
