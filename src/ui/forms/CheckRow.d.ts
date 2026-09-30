import type * as React from 'react';
/** A full-width multi-select row with a rust tick box — the intake's pain-point picker. */
export interface CheckRowProps {
  /** A full sentence in the user's words: "Chasing invoices and payments". */
  label?: React.ReactNode;
  checked?: boolean;
  onToggle?: () => void;
  style?: React.CSSProperties;
}
export declare function CheckRow(props: CheckRowProps): React.JSX.Element;
