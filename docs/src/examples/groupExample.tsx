import * as React from "react";
import { CSSTransition, CSSTransitionGroup, transit } from "react-css-transition";
import { assemble, withState, withHandlers } from "reassemble";

import { Button } from "../components";
import { prefix } from "../theme";

const circleStyle = {
  display: "inline-box",
  boxShadow: "1px 1px 5px 0px rgba(0,0,0,0.25)",
  borderRadius: "50%",
  background: "#dc7d16",
  height: "20px",
  width: "20px",
  marginRight: "8px",
};

const Circle = () => <div style={circleStyle} />;

const FadeInOut = (props) => (
  <CSSTransition
    {...props}
    defaultStyle={{ opacity: 0 }}
    enterStyle={{ opacity: transit(1.0, 500, "ease-in-out") }}
    leaveStyle={{ opacity: transit(0, 500, "ease-in-out") }}
    activeStyle={{ opacity: 1.0 }}
    />
);

export const FadeInOutGroup = (props) => (
  <CSSTransitionGroup {...props}>
    {React.Children.map(props.children, (child) => <FadeInOut>{child}</FadeInOut>)}
  </CSSTransitionGroup >
);

// This example uses reassemble to handle internal state.
const enhance = assemble(
  withState("count", "setCount", 1),
  withHandlers({
    onClickMount: ({count, setCount}) => () => setCount(count < 6 ? count + 1 : 6),
    onClickUnmount: ({count, setCount}) => () => setCount(count > 0 ? count - 1 : 0),
  }),
);

export const GroupExample = enhance(
  ({active, onClickMount, onClickUnmount, count}) => (
    <div>
      <FadeInOutGroup
        style={prefix({ display: "flex", marginBottom: "32px", height: "20px" })}
        >
        {
          Array(count).fill(null).map((_, idx) =>
            <Circle key={idx} />,
          )
        }
      </FadeInOutGroup>
      <Button style={{ marginRight: "16px" }} onClick={onClickMount}>Mount</Button>
      <Button onClick={onClickUnmount}>Unmount</Button>
    </div >
  ),
);
