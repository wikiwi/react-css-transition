/**
 * @license
 * Copyright (C) 2016-present Chi Vinh Le and contributors.
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import * as React from "react";
import {
  CSSProperties, Component, ComponentClass, ReactNode,
  StatelessComponent, ReactElement, HTMLAttributes,
} from "react";

import { ActionID, CSSTransitionState, reduce } from "./csstransitionstate";
import { TransitionObserver } from "./transitionobserver";
import { TransitionDelay, runInFrame } from "./utils";

export type CSSTransitionDelay = TransitionDelay;
export type CSSTransitionEventHandler = () => void;

export interface CSSTransitionProps
  extends HTMLAttributes<any> {
  active?: boolean;
  transitionAppear?: boolean;
  transitionDelay?: CSSTransitionDelay;
  onTransitionComplete?: CSSTransitionEventHandler;
  component?: string | ComponentClass<any> | StatelessComponent<any>;
  children?: ReactNode;
  defaultStyle?: CSSProperties;
  activeStyle?: CSSProperties;
  appearStyle?: CSSProperties;
  enterStyle?: CSSProperties;
  leaveStyle?: CSSProperties;
  appearInitStyle?: CSSProperties;
  enterInitStyle?: CSSProperties;
  leaveInitStyle?: CSSProperties;
  style?: CSSProperties;
}

export class CSSTransition extends Component<CSSTransitionProps, CSSTransitionState> {
  public static defaultProps: any = {
    component: "div",
  };

  private cancelPending: any;

  constructor(props: CSSTransitionProps) {
    super(props);
    this.dispatch(ActionID.Init, props);
  }

  public componentDidMount(): void {
    if (this.props.transitionAppear && this.props.active) {
      this.dispatch(ActionID.TransitionTrigger);
    }
  }

  public componentWillUnmount(): void {
    if (this.cancelPending) { this.cancelPending(); this.cancelPending = null; }
  }

  public componentWillReceiveProps(nextProps: CSSTransitionProps): void {
    if (this.props.active === nextProps.active) { return; }
    this.dispatch(ActionID.TransitionTrigger, nextProps);
  }

  public render(): ReactElement<any> {
    const {
      children,
      component,
      active: _a,
      transitionAppear: _b,
      onTransitionComplete: _c,
      defaultStyle: _d,
      activeStyle: _e,
      appearStyle: _f,
      enterStyle: _g,
      leaveStyle: _h,
      appearInitStyle: _i,
      enterInitStyle: _j,
      leaveInitStyle: _k,
      transitionDelay: _l,
      ...rest,
    } = this.props;

    const { style } = this.state;
    const Wrapper = component;
    const inner = Wrapper ? <Wrapper children={children} /> : children;
    return (
      <TransitionObserver
        {...rest}
        onTransitionBegin={this.handleTransitionBegin}
        onTransitionComplete={this.handleTransitionComplete}
        style={style}
        >
        {inner}
      </TransitionObserver>
    );
  }

  private handleTransitionComplete = () => this.dispatch(ActionID.TransitionComplete);
  private handleTransitionBegin = () => this.dispatch(ActionID.TransitionStart);

  private dispatch(action: ActionID, props = this.props): void {
    const result = reduce(this.state, action, props);
    if (!result) { return; }
    const {state, pending} = result;
    let callback: any = undefined;
    if (this.cancelPending) { this.cancelPending(); this.cancelPending = null; }
    if (pending) { callback = () => { this.cancelPending = runInFrame(1, () => this.dispatch(pending)); }; }
    if (this.state === undefined) {
      this.state = state;
      return;
    }
    this.setState(state, callback);
  }
}
