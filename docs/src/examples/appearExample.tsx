import * as React from "react";
import { CSSTransition, transit } from "react-css-transition";
import { assemble, withState, withHandlers } from "reassemble";

import { prefix } from "../theme";
import { Button } from "../components";

const styles = prefix({
  style: {
    display: "inline-box",
    boxShadow: "1px 1px 5px 0px rgba(0,0,0,0.25)",
    borderRadius: "50%",
    background: "#dc7d16",
    height: "20px",
    width: "20px",
    marginRight: "8px",
  },
  defaultStyle: {
    opacity: 0,
  },
  enterStyle: {
    opacity: transit(1.0, 500, "ease-in-out"),
  },
  leaveStyle: {
    opacity: transit(0, 500, "ease-in-out"),
  },
  activeStyle: {
    opacity: 1,
  },
});

// This example uses reassemble to handle internal state.
const enhance = assemble(
  withState("count", "setCount", 1),
  withHandlers({
    onClickMount: ({count, setCount}) => () => setCount(count < 6 ? count + 1 : 6),
    onClickUnmount: ({count, setCount}) => () => setCount(count > 0 ? count - 1 : 0),
  }),
);

export const AppearExample = enhance(
  ({active, onClickMount, onClickUnmount, count}) => (
    <div>
      <div style={prefix({ display: "flex", marginBottom: "32px", height: "20px" })}>
        {
          Array(count).fill("").map((_, idx) =>
            <CSSTransition
              {...styles}
              key={idx}
              active={true}
              transitionAppear
              />,
          )
        }
      </div>
      <Button style={{ marginRight: "16px" }} onClick={onClickMount}>Mount</Button>
      <Button onClick={onClickUnmount}>Unmount</Button>
    </div >
  ),
);
