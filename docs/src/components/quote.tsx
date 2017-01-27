import * as React from "react";
import { StatelessComponent, ReactNode } from "react";

import classes from "./quote.css";

export type QuoteProperties = {
  children?: ReactNode,
  source?: string,
  url?: string,
};

export const Quote: StatelessComponent<QuoteProperties> =
  ({children, source, url}) => (
    <blockquote className={classes.root} {...{ cite: url }}>
      {children}
      <footer><a href={url}>{source}</a></footer>
    </blockquote>
  );
