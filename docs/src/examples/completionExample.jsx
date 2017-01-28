import * as React from "react";
import { CSSTransition, transit } from "react-css-transition";

import { prefix } from "../theme";
import { Button } from "../components";
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

class CompletionExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = {active: false, count: 0};
    this.handleClick = this.handleClick.bind(this);
    this.handleTransitionComplete = this.handleTransitionComplete.bind(this);
  }

  handleClick() {
    this.setState({active: !this.state.active});
  }

  handleTransitionComplete() {
    this.setState({count: this.state.count + 1});
  }

  render() {
    return (
      <div>
        <CSSTransition
          {...styles}
          onTransitionComplete={this.handleTransitionComplete}
          active={this.state.active}
          >
          <Circle />
        </CSSTransition>
        <p><code>onTransitionComplete calls: {this.state.count}</code></p>
        <Button onClick={this.handleClick}>Trigger</Button>
      </div>
    );
  }
}

export default CompletionExample;
