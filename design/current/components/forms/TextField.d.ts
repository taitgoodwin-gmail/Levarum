/**
 * A single-line text field (or textarea) with its question-style label.
 */
export interface TextFieldProps {
  /** Write it as the question a person would ask: "What kind of business is this?" */
  label?: React.ReactNode;
  id?: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'url';
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  /** Only where a real person hesitates. */
  helper?: React.ReactNode;
  /** Phrase it as a question, not a scold: "That does not look like an email yet. Mind checking it?" */
  error?: React.ReactNode;
  disabled?: boolean;
  /** Render a 120px textarea instead. */
  textarea?: boolean;
  style?: React.CSSProperties;
}
export declare function TextField(props: TextFieldProps): JSX.Element;
