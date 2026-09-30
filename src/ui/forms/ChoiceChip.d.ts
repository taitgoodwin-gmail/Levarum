import type * as React from 'react';
/** A tappable option tile — the intake's answer to a radio group. */
export interface ChoiceChipProps {
  label?: React.ReactNode;
  selected?: boolean;
  onSelect?: () => void;
  /** Native grouped radio inputs. */
  name: string;
  value?: string;
  style?: React.CSSProperties;
}
export declare function ChoiceChip(props: ChoiceChipProps): React.JSX.Element;
