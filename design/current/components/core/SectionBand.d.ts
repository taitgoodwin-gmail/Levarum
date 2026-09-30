/** A full-width page section: a background rung, hairline edges, and the standard container inside. */
export interface SectionBandProps {
  /** The background ladder: 1 = paper, 2/3/4 = petrol mixed into paper at 5/9/14%, `dark` = the petrol-over-ink band. */
  rung?: 1 | 2 | 3 | 4 | 'dark';
  /** Which hairline edges to draw. */
  edges?: 'both' | 'top' | 'bottom' | 'none';
  /** Inner container measure: 1180px page, 820px reading, 760px form. */
  width?: 'page' | 'read' | 'form';
  children?: React.ReactNode;
  style?: React.CSSProperties;
  /** Override the inner container (e.g. `textAlign: 'center'` for a closing CTA). */
  innerStyle?: React.CSSProperties;
}
export declare function SectionBand(props: SectionBandProps): JSX.Element;
