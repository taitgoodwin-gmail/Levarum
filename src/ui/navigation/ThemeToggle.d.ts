import type * as React from 'react';
/** The light/dark switch that sits in every nav, just left of the CTA. */
export interface ThemeToggleProps {
  /** Controlled mode. Omit and the component manages `data-theme` on `<html>` itself. */
  theme?: 'light' | 'dark';
  /** Called with the next mode. Providing it suppresses the built-in DOM write. */
  onToggle?: (next: 'light' | 'dark') => void;
  style?: React.CSSProperties;
}
export declare function ThemeToggle(props: ThemeToggleProps): React.JSX.Element;
