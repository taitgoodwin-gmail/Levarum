import type * as React from 'react';
/**
 * The action control. One primary button per screen region.
 */
export interface ButtonProps extends React.AriaAttributes {
  type?: 'button' | 'submit' | 'reset';
  title?: string;
  id?: string;
  onKeyDown?: React.KeyboardEventHandler<HTMLButtonElement | HTMLAnchorElement>;
  /**
   * `primary` — rust fill, the single action.
   * `ghost` — 1.5px ink outline, used for Back.
   * `quiet` — 1.5px petrol outline with link-coloured label, used for secondary onward actions.
   * `status` — 44px admin workflow button; pair with `active`.
   */
  variant?: 'primary' | 'ghost' | 'quiet' | 'status';
  /** `sm` 44px nav CTA · `md` 56px standard · `lg` padded closing CTA. */
  size?: 'sm' | 'md' | 'lg';
  /** Fill the container — the intake and sign-in pattern. */
  block?: boolean;
  disabled?: boolean;
  /** `status` variant only: marks the current state. */
  active?: boolean;
  /** Renders an anchor instead of a button. */
  href?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent) => void;
}
export declare function Button(props: ButtonProps): React.JSX.Element;
