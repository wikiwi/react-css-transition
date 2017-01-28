import * as React from "react";
import { CSSTransition } from "react-css-transition";

import { Button } from "../components";

/*
  CSS defined using CSS-Modules.

  .className: {
    boxShadow: "1px 1px 5px 0px rgba(0,0,0,0.25)",
    borderRadius: "50%",
    marginBottom: "32px",
    background: "#dc7d16",
    height: "20px",
    width: "20px",
  },
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
  }

  onClick = () => this.setState({active: !this.state.active});

  render() {
    return (
      <div>
        <CSSTransition
          {...classes}
          active={this.state.active}
          />
        <Button onClick={this.onClick}>Trigger</Button>
      </div>
    );
  }
}

export default ClassExample;
