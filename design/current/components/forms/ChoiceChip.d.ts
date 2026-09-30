/** A tappable option tile — the intake's answer to a radio group. */
export interface ChoiceChipProps {
  label?: React.ReactNode;
  selected?: boolean;
  onSelect?: () => void;
  /** `radio` for one-of-many (default), `checkbox` where several may be on. */
  role?: 'radio' | 'checkbox';
  style?: React.CSSProperties;
}
export declare function ChoiceChip(props: ChoiceChipProps): JSX.Element;
