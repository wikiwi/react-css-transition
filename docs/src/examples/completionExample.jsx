import * as React from "react";
import { CSSTransition, transit } from "react-css-transition";

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

class InlineExample extends React.Component {

  constructor(props) {
    super(props);
    this.state = {active: false, count: 0};
  }

  onClick = () => this.setState({active: !this.state.active});
  onTransitionComplete = () => this.setState({count: this.state.count + 1});

  render() {
    return (
      <div>
        <CSSTransition
          {...styles}
          onTransitionComplete={this.onTransitionComplete}
          active={this.state.active}
          />
        <p><code>onTransitionComplete calls: {this.state.count}</code></p>
        <Button onClick={this.onClick}>Trigger</Button>
      </div>
    );
  }
}

export default InlineExample;
