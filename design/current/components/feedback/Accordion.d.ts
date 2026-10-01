/**
 * The questions list. One row open at a time; the open row becomes a card.
 */
export interface AccordionProps {
  /** Question / answer pairs. Questions are the ones people actually ask, in their words. */
  items?: Array<{ q: React.ReactNode; a: React.ReactNode }>;
  /** Index open on mount; `-1` for all closed. */
  defaultOpen?: number;
  style?: React.CSSProperties;
}
export declare function Accordion(props: AccordionProps): JSX.Element;
