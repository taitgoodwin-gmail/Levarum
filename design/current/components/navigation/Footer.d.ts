/** The page footer: 26px mark, one line of positioning, a flat row of quiet links. */
export interface FooterProps {
  /** One short line of what the company does — "Back-office automation for owner-run businesses." */
  tagline?: React.ReactNode;
  links?: Array<{ label: string; href: string }>;
  /** An optional bordered block above the footer proper — the partner call-out sits here. */
  banner?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Footer(props: FooterProps): JSX.Element;
