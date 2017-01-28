import * as React from "react";
import { CSSTransition, transit } from "react-css-transition";

import { prefix } from "../theme";
import { Button } from "../components";

const styles = prefix({
  style: {
    display: "inline-box",
    boxShadow: "1px 1px 5px 0px rgba(0,0,0,0.25)",
    borderRadius: "50%",
    background: "#dc7d16",
    height: "20px",
    width: "20px",
    marginRight: "8px",
  },
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

class AppearExample extends React.Component {

  constructor(props) {
    super(props);
    this.state = {mounted: 1};
  }

  onClickMount = () => this.setState({mounted: this.state.mounted < 6 ? this.state.mounted + 1 : 6});
  onClickUnmount = () => this.setState({mounted: this.state.mounted > 0 ? this.state.mounted - 1 : 0});

  render() {
    return (
    <div>
      <div style={prefix({ display: "flex", marginBottom: "32px", height: "20px" })}>
        {
          Array(this.state.mounted).fill("").map((_, idx) =>
            <CSSTransition
              {...styles}
              key={idx}
              active={true}
              transitionAppear
              />,
          )
        }
      </div>
      <Button style={{ marginRight: "16px" }} onClick={this.onClickMount}>Mount</Button>
      <Button onClick={this.onClickUnmount}>Unmount</Button>
    </div>
    );
  }
}

export default AppearExample;
