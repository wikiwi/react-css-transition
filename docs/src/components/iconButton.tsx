import * as React from "react";
import { StatelessComponent, HTMLAttributes } from "react";
import { assemble } from "reassemble";

import { preventMouseFocus } from "../composables";
import classes from "./iconButton.css";

const enhance = assemble<HTMLAttributes<any>, HTMLAttributes<any>>(
  preventMouseFocus,
);

export const IconButtonInner: StatelessComponent<HTMLAttributes<any>> =
  (props) => React.createElement(props.href ? "a" : "button", { className: classes.root, ...props });

export const IconButton = enhance(IconButtonInner);
