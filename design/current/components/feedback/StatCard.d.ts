/** A count tile: big numeral over a tracked-caps label, tinted by status. */
export interface StatCardProps {
  value?: React.ReactNode;
  /** Rendered uppercase — pass it as written words, e.g. `Contacted`. */
  label?: React.ReactNode;
  tone?: 'new' | 'contacted' | 'booked' | 'done' | 'sec';
  style?: React.CSSProperties;
}
export declare function StatCard(props: StatCardProps): JSX.Element;
