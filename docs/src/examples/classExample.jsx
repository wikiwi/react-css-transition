import * as React from "react";
import { CSSTransition } from "react-css-transition";

import { Button } from "../components";
import Circle from "./circle";

/*
  CSS defined using CSS-Modules.

  .defaultClassName: {
    transform: "translate(0, 0)",
  },
  .enterClassName: {
    transform: "translate(200px, 0)",
    transition: "transform 500ms ease-in-out",
  },
  .leaveClassName: {
    transform: "translate(0, 0)",
    transition: "transform 500ms ease-in-out",
  },
  .activeClassName: {
    transform: "translate(200px, 0)",
  },
 */

import classes from "./classExample.css";

class ClassExample extends React.Component {
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
        <CSSTransition {...classes} active={this.state.active}>
          <Circle />
        </CSSTransition>
        <Button onClick={this.handleClick}>Trigger</Button>
      </div>
    );
  }
}

export default ClassExample;
