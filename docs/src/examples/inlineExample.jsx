import * as React from "react";
import { CSSTransition, transit } from "react-css-transition";

import { Button } from "../components";
import { prefix } from "../theme";
import Circle from "./circle";

const styles = prefix({
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
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState({active: !this.state.active});
  }

  render() {
    return (
      <div>
        <CSSTransition {...styles} active={this.state.active}>
          <Circle />
        </CSSTransition>
        <Button onClick={this.handleClick}>Trigger</Button>
      </div>
    );
  }
}

export default InlineExample;
