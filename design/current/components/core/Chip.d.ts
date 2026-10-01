/** A small squared-off tag: the tool names under a job, or an answer echoed back. */
export interface ChipProps {
  /** `sec` petrol tint (tools, capabilities) · `quiet` paper fill with a control border (answers echoed back). */
  tone?: 'sec' | 'quiet';
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Chip(props: ChipProps): JSX.Element;
