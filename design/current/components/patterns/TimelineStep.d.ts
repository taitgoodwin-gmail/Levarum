/** One station on an automation line: numeral, title, optional tool chip, one sentence. */
export interface TimelineStepProps {
  n?: React.ReactNode;
  /** Two or three words in the present tense: "The call comes in", "Missed", "Text back", "Booked". */
  title?: React.ReactNode;
  /** The tool that does this step — plain text, never a vendor logo. */
  tool?: React.ReactNode;
  children?: React.ReactNode;
  /** Last station: drops the connector rule and the bottom padding. */
  last?: boolean;
  style?: React.CSSProperties;
}
export declare function TimelineStep(props: TimelineStepProps): JSX.Element;
