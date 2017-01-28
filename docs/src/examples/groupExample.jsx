import * as React from "react";
import { CSSTransition, CSSTransitionGroup, transit } from "react-css-transition";

import { prefix } from "../theme";
import { Button } from "../components";

const circleStyle = prefix({
  display: "inline-box",
  boxShadow: "1px 1px 5px 0px rgba(0,0,0,0.25)",
  borderRadius: "50%",
  background: "#dc7d16",
  height: "20px",
  width: "20px",
  marginRight: "8px",
});

const Circle = () => <div style={circleStyle} />;

const fadeInOutStyles = prefix({
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

const FadeInOut = (props) => (
  <CSSTransition
    {...props}
    {...fadeInOutStyles}
    />
);

export const FadeInOutGroup = (props) => (
  <CSSTransitionGroup {...props}>
    {React.Children.map(props.children, (child) => <FadeInOut>{child}</FadeInOut>)}
  </CSSTransitionGroup >
);

class GroupExample extends React.Component {

  constructor(props) {
    super(props);
    this.state = {mounted: 1};
  }

  onClickMount = () => this.setState({mounted: this.state.mounted < 6 ? this.state.mounted + 1 : 6});
  onClickUnmount = () => this.setState({mounted: this.state.mounted > 0 ? this.state.mounted - 1 : 0});

  render() {
    return (
    <div>
      <FadeInOutGroup
        style={prefix({ display: "flex", marginBottom: "32px", height: "20px" })}
        >
        {
          Array(this.state.mounted).fill(null).map((_, idx) =>
            <Circle key={idx} />,
          )
        }
      </FadeInOutGroup>
      <Button style={{ marginRight: "16px" }} onClick={this.onClickMount}>Mount</Button>
      <Button onClick={this.onClickUnmount}>Unmount</Button>
    </div >
    );
  }
}

export default GroupExample;
