/**
 * @license
 * Copyright (C) 2016-present Chi Vinh Le and contributors.
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

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
