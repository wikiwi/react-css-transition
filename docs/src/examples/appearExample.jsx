import * as React from 'react';
import { CSSTransition, transit } from 'react-css-transition';

import { prefix } from '../theme';
import { Button } from '../components';
import Circle from "./circle";

const styles = prefix({
  defaultStyle: {
    opacity: 0,
  },
  enterStyle: {
    opacity: transit(1.0, 500, 'ease-in-out'),
  },
  leaveStyle: {
    opacity: transit(0, 500, 'ease-in-out'),
  },
  activeStyle: {
    opacity: 1,
  },
});

class AppearExample extends React.Component {
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
      <div style={prefix({ display: 'flex', marginBottom: '32px', height: '20px' })}>
        {
          Array(this.state.mounted).fill('').map((_, idx) =>
            <CSSTransition {...styles} key={idx} active={true} transitionAppear>
              <Circle />
            </CSSTransition>
          )
        }
      </div>
      <Button style={{ marginRight: '16px' }} onClick={this.handleClickMount}>Mount</Button>
      <Button onClick={this.handleClickUnmount}>Unmount</Button>
    </div>
    );
  }
}

export default AppearExample;
