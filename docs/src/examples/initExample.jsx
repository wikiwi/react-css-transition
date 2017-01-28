import * as React from "react";
import { CSSTransition, transit } from "react-css-transition";

import { Button } from "../components";
import { prefix } from "../theme";
import Circle from "./circle";

const styles = prefix({
  style:{
    position: "absolute",
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

class InitExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = {active: false};
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState({active: !this.state.active});
  }

  render() {
    return (
      <div>
        <div style={{ position: "relative", height: "52px" }}>
          <CSSTransition {...styles} active={this.state.active}>
            <Circle />
          </CSSTransition>
        </div>
        <Button onClick={this.handleClick}>Trigger</Button>
      </div>
    );
  }
}

export default InitExample;
