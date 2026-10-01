import type * as React from 'react';
/** The keyboard skip link. First element in the body on every page. */
export interface SkipLinkProps {
  /** Target id, matching the `<main>` element. */
  href?: string;
  children?: React.ReactNode;
}
export declare function SkipLink(props: SkipLinkProps): React.JSX.Element;
