/**
 * The site header: logo left, quiet links right, theme switch, one rust CTA.
 */
export interface NavBarProps {
  links?: Array<{ label: string; href: string }>;
  /** Label of the current page — gets 600 weight AND a 2px rust underline. */
  current?: string;
  /** The single rust action, rendered at 44px. */
  cta?: { label: string; href: string };
  /** A `<Pill>` beside the logo, as on the admin header. */
  badge?: React.ReactNode;
  /** Show the light/dark switch. */
  theme?: boolean;
  /** Extra controls before the CTA (e.g. a Sign out button). */
  right?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function NavBar(props: NavBarProps): JSX.Element;
