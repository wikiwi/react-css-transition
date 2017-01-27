import * as React from "react";
import { CSSTransition, transit } from "react-css-transition";
import { assemble, withState, withHandlers } from "reassemble";

import { prefix } from "../theme";
import { Button } from "../components";

const styles = prefix({
  style: {
    boxShadow: "1px 1px 5px 0px rgba(0,0,0,0.25)",
    borderRadius: "50%",
    background: "#dc7d16",
    height: "20px",
    width: "20px",
  },
  defaultStyle: {
    transform: "translate(0, 0)",
  },
  enterStyle: {
    transform: transit("translate(175px, 0)", 500, "ease-in-out"),
  },
  leaveStyle: {
    transform: transit("translate(0, 0)", 500, "ease-in-out"),
  },
  activeStyle: {
    transform: "translate(175px, 0)",
  },
});

// This example uses reassemble to handle internal state.
// See: https://github.com/wikiwi/reassemble.
const enhance = assemble(
  withState("active", "setActive", false),
  withState("count", "setCount", 0),
  withHandlers({
    onClick: ({active, setActive}) => () => setActive(!active),
    onTransitionComplete: ({count, setCount}) => () => {
      setCount(count + 1);
    },
  }),
);

export const CompletionExample = enhance(
  ({active, onClick, onTransitionComplete, count}) => (
    <div>
      <CSSTransition
        {...styles}
        onTransitionComplete={onTransitionComplete}
        active={active}
        />
      <p><code>onTransitionComplete calls: {count}</code></p>
      <Button onClick={onClick}>Trigger</Button>
    </div>
  ),
);
