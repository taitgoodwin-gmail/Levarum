/** A native select styled to match the text field. */
export interface SelectFieldProps {
  label?: React.ReactNode;
  id?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  /** Plain strings, or `{ value, label }` pairs. */
  options?: Array<string | { value: string; label: string }>;
  disabled?: boolean;
  style?: React.CSSProperties;
}
export declare function SelectField(props: SelectFieldProps): JSX.Element;
