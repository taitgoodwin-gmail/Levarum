/**
 * One job in a Game Plan: what to hand off, its bar, and the hours it returns.
 */
export interface OpportunityRowProps {
  /** Named as the outcome, not the feature: "Get invoices out and followed up without you". */
  title?: React.ReactNode;
  /** The range in words beneath the bar, e.g. "3 to 5 hours a week". */
  hoursText?: React.ReactNode;
  /** The numeral to the right. */
  figure?: React.ReactNode;
  /** Meter percent on the site-wide scale — 4 h/week = 100. */
  percent?: number;
  /** Pale fill, for the smallest item in the set. */
  quiet?: boolean;
  style?: React.CSSProperties;
}
export declare function OpportunityRow(props: OpportunityRowProps): JSX.Element;
