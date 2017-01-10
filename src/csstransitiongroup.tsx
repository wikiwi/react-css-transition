/**
 * @license
 * Copyright (C) 2016-present Chi Vinh Le and contributors.
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import * as React from "react";
import {
  Component, Children, ReactElement, HTMLAttributes,
  ComponentClass, StatelessComponent, cloneElement,
} from "react";
import * as ReactTransitionGroup from "react-addons-transition-group";

import { CSSTransitionProps } from "./csstransition";

export interface CSSTransitionGroupProps extends
  HTMLAttributes<any> {
  transitionAppear?: boolean;
  component?: string | ComponentClass<any> | StatelessComponent<any>;
  children?: ReactElement<CSSTransitionProps> | Array<ReactElement<CSSTransitionProps>>;
}

export class CSSTransitionGroup extends Component<CSSTransitionGroupProps, {}> {
  private mounted = false;
  public componentDidMount = () => this.mounted = true;

  public render() {
    const { transitionAppear, children, ...rest } = this.props as any;
    return (
      <ReactTransitionGroup {...rest}>
        {Children.map(children, (child, index) =>
          <CSSTransitionGroupChild
            transitionAppear={transitionAppear}
            mounted={this.mounted}
            key={index}>
            {child}
          </CSSTransitionGroupChild>,
        )}
      </ReactTransitionGroup>);
  }
}

export interface CSSTransitionGroupChildProps {
  transitionAppear?: boolean;
  mounted?: boolean;
  children?: ReactElement<any>;
}

export class CSSTransitionGroupChild extends Component<CSSTransitionGroupChildProps, CSSTransitionProps> {
  public static defaultProps: any = {
    transitionAppear: false,
  };
  private leaveDone: () => void;

  constructor(props: any) {
    super(props);
    this.state = {
      active: true,
      transitionAppear: props.mounted || props.transitionAppear,
    };
  }

  public componentWillAppear(done: () => void) {
    done();
  }

  public componentWillEnter(done: () => void) {
    done();
  }

  public componentWillLeave(done: () => void) {
    this.setState({ active: false });
    this.leaveDone = done;
  }

  public render() {
    const { props: {children}, state: { active, transitionAppear}, onTransitionComplete } = this;
    return cloneElement(
      Children.only(children),
      { active, transitionAppear, onTransitionComplete },
    );
  }

  private onTransitionComplete = () => {
    const child = Children.only(this.props.children);
    if (child.props.onTransitionComplete) { child.props.onTransitionComplete(); }
    if (this.leaveDone) { this.leaveDone(); }
  }
}
