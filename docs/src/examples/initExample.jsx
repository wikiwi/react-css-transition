import * as React from "react";
import { CSSTransition, transit } from "react-css-transition";

import { Button } from "../components";
import { prefix } from "../theme";

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

class InitExample extends React.Component {

  constructor(props) {
    super(props);
    this.state = {active: false};
  }

  onClick = () => this.setState({active: !this.state.active});

  render() {
    return (
      <div>
      <div style={{ position: "relative", height: "52px" }}>
        <CSSTransition
          {...styles}
          active={this.state.active}
          />
      </div>
        <Button onClick={this.onClick}>Trigger</Button>
      </div>
    );
  }
}

export default InitExample;
