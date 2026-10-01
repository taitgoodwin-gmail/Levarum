import type * as React from 'react';
/** The single recommendation block that closes a Game Plan. */
export interface FixFirstCardProps {
  label?: React.ReactNode;
  /** The one named build: "Invoice automation". */
  title?: React.ReactNode;
  /** One sentence of reasoning, always about sequencing, never about price. */
  why?: React.ReactNode;
  /** `outlined` 1.5px ink, no fill (the plan) · `tinted` petrol tint (the home example card). */
  tone?: 'outlined' | 'tinted';
  style?: React.CSSProperties;
}
export declare function FixFirstCard(props: FixFirstCardProps): React.JSX.Element;
