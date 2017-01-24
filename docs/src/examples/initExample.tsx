import * as React from "react";
import { CSSTransition, transit } from "react-css-transition";
import { assemble, withState, withHandlers } from "reassemble";

import { Button } from "../components";
import { prefix } from "../theme";

// Note that in this example only when the component is transitioning
// the transform style is applied. Otherwise it returns to
// absolute positioning.

const styles = prefix({
  style: {
    position: "absolute",
    boxShadow: "1px 1px 5px 0px rgba(0,0,0,0.25)",
    borderRadius: "50%",
    background: "#dc7d16",
    height: "20px",
    width: "20px",
  },
  defaultStyle: {
    left: "0px",
  },
  enterInitStyle: {
    transform: "translate(0, 0)",
  },
  enterStyle: {
    transform: transit("translate(175px, 0)", 500, "ease-in-out"),
  },
  leaveStyle: {
    transform: transit("translate(0, 0)", 500, "ease-in-out"),
  },
  leaveInitStyle: {
    transform: "translate(175px, 0)",
  },
  activeStyle: {
    left: "175px",
  },
});

// This example uses reassemble to handle internal state.
const enhance = assemble(
  withState("active", "setActive", false),
  withHandlers({
    onClick: ({active, setActive}) => () => setActive(!active),
  }),
);

export const InitExample = enhance(
  ({active, onClick}) => (
    <div>
      <div style={{ position: "relative", height: "52px" }}>
        <CSSTransition
          {...styles}
          active={active}
          />
      </div>
      <Button onClick={onClick}>Trigger</Button>
    </div>
  ),
);
