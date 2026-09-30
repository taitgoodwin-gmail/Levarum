import type * as React from 'react';
/** An inline validation or failure message. Always `role="alert"`. */
export interface AlertProps {
  /**
   * `sec` petrol tint — form validation.
   * `accent` rust tint — sign-in failure.
   * `failure` the dark card used inside a dark band when a send does not go through.
   */
  tone?: 'sec' | 'accent' | 'failure';
  /** `failure` only: the headline, e.g. "That did not go through." */
  title?: React.ReactNode;
  children?: React.ReactNode;
  /** `failure` only: recovery buttons. */
  actions?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Alert(props: AlertProps): React.JSX.Element;
