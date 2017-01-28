import * as React from "react";
import { CSSTransition, CSSTransitionGroup, transit } from "react-css-transition";

import { prefix } from "../theme";
import { Button } from "../components";
import Circle from "./circle";
import classes from "./groupExample.css";

const fadeInOutStyles = prefix({
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

const FadeInOut = (props) => (
  <CSSTransition
    {...props}
    {...fadeInOutStyles}
    />
);

export const FadeInOutGroup = (props) => (
  <CSSTransitionGroup {...props}>
    {React.Children.map(props.children, (child) => <FadeInOut>{child}</FadeInOut>)}
  </CSSTransitionGroup >
);

class GroupExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = {mounted: 1};
    this.handleClickMount = this.handleClickMount.bind(this);
    this.handleClickUnmount = this.handleClickUnmount.bind(this);
  }

  handleClickMount() {
    const mounted = this.state.mounted;
    this.setState({mounted: mounted < 6 ? mounted + 1 : 6});
  }

  handleClickUnmount() {
    const mounted = this.state.mounted;
    this.setState({mounted: mounted > 0 ? mounted - 1 : 0});
  }

  render() {
    return (
    <div>
      <FadeInOutGroup
        style={prefix({ display: "flex", marginBottom: "32px", height: "20px" })}
        >
        {
          Array(this.state.mounted).fill(null).map((_, idx) =>
            <Circle key={idx} />
          )
        }
      </FadeInOutGroup>
      <Button style={{ marginRight: "16px" }} onClick={this.handleClickMount}>Mount</Button>
      <Button onClick={this.handleClickUnmount}>Unmount</Button>
    </div >
    );
  }
}

class TodoList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {items: ['hello', 'world', 'click', 'me']};
    this.handleAdd = this.handleAdd.bind(this);
  }

  handleAdd() {
    const input = prompt('Enter some text');
    if (input) {
      const newItems = this.state.items.concat([input]);
      this.setState({items: newItems});
    }
  }

  handleRemove(i) {
    let newItems = this.state.items.slice();
    newItems.splice(i, 1);
    this.setState({items: newItems});
  }

  render() {
    const items = this.state.items.map((item, i) => (
      <div key={item} onClick={() => this.handleRemove(i)} className={classes.item}>
        {item}
      </div>
    ));

    return (
      <div>
        <FadeInOutGroup className={classes.container}>
          {items}
        </FadeInOutGroup>
        <Button onClick={this.handleAdd}>Add Item</Button>
      </div>
    );
  }
}

export default TodoList;
