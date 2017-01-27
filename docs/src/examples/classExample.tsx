import * as React from "react";
import { CSSTransition } from "react-css-transition";
import { assemble, withState, withHandlers } from "reassemble";

import { Button } from "../components";

/*
  CSS defined using CSS-Modules.

  .className: {
    boxShadow: "1px 1px 5px 0px rgba(0,0,0,0.25)",
    borderRadius: "50%",
    marginBottom: "32px",
    background: "#dc7d16",
    height: "20px",
    width: "20px",
  },
  .defaultClassName: {
    transform: "translate(0, 0)",
  },
  .enterClassName: {
    transform: "translate(200px, 0)",
    transition: "transform 500ms ease-in-out",
  },
  .leaveClassName: {
    transform: "translate(0, 0)",
    transition: "transform 500ms ease-in-out",
  },
  .activeClassName: {
    transform: "translate(200px, 0)",
  },
 */

import classes from "./classExample.css";

// This example uses reassemble to handle internal state.
// See: https://github.com/wikiwi/reassemble.
const enhance = assemble(
  withState("active", "setActive", false),
  withHandlers({
    onClick: ({active, setActive}) => () => setActive(!active),
  }),
);

export const ClassExample = enhance(
  ({active, onClick}) => (
    <div>
      <CSSTransition
        {...classes}
        active={active}
        />
      <Button onClick={onClick}>Trigger</Button>
    </div>
  ));
