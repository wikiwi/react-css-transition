import * as React from "react";
import { CSSTransition, transit } from "react-css-transition";

import { Button } from "../components";
import { prefix } from "../theme";

const styles = prefix({
  style: {
    boxShadow: "1px 1px 5px 0px rgba(0,0,0,0.25)",
    borderRadius: "50%",
    marginBottom: "32px",
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

class InlineExample extends React.Component {

  constructor(props) {
    super(props);
    this.state = {active: false};
  }

  onClick = () => this.setState({active: !this.state.active});

  render() {
    return (
      <div>
        <CSSTransition
          {...styles}
          active={this.state.active}
          />
        <Button onClick={this.onClick}>Trigger</Button>
      </div>
    );
  }
}

export default InlineExample;
