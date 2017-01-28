import * as React from "react";
import { CSSTransition, transit } from "react-css-transition";

import { prefix } from '../theme';
import Circle from "./circle";

const styles = prefix({
  container: {
    display: "inline-block",
    cursor: "pointer",
    borderRadius: "10px",
    border: "2px solid rgba(19, 106, 138, 0.5)",
    width: "50px",
    padding: "1px",
    overflow: "none",
    touchAction: "manipulation",
    WebkitTapHighlightColor: "rgba(0, 0, 0, 0)",
  },
  circle: {
    boxShadow: "1px 1px 5px 0px rgba(0,0,0,0.25)",
    borderRadius: "50%",
    background: "#dc7d16",
    height: "20px",
    width: "20px",
  },
  transition: {
    style: {
      pointerEvents: "none",
    },
    defaultStyle: {
      transform: "translate(0, 0)",
    },
    enterStyle: {
      transform: transit("translate(30px, 0)", 200, "ease-in-out"),
    },
    leaveStyle: {
      transform: transit("translate(0, 0)", 200, "ease-in-out"),
    },
    activeStyle: {
      transform: "translate(30px, 0)",
    },
  },
});

export default class Toggle extends React.Component {
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
      <div style={styles.container} onClick={this.handleClick}>
        <CSSTransition {...styles.transition} active={this.state.active}>
          <div style={styles.circle} />
        </CSSTransition>
      </div>
    );
  }
}

