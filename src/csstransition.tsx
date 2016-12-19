/**
 * @license
 * Copyright (C) 2016 Chi Vinh Le and contributors.
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

/* tslint:disable: variable-name */

import * as React from "react";
import {
  CSSProperties, Component, ComponentClass, ReactNode,
  StatelessComponent, ReactElement, HTMLAttributes,
} from "react";

import { resolveTransit } from "./transit";
import { TransitionObserver, TransitionObserverProps } from "./transitionobserver";

const TICK = 17;

export interface CSSTransitionProps
  extends HTMLAttributes<any> {
  active?: boolean;
  transitionAppear?: boolean;
  transitionDelay?: number;
  onTransitionComplete?: () => void;
  component?: string | ComponentClass<any> | StatelessComponent<any>;
  children?: ReactNode;
  defaultStyle?: CSSProperties;
  activeStyle?: CSSProperties;
  enterStyle?: CSSProperties;
  leaveStyle?: CSSProperties;
  style?: CSSProperties;
  // TODO:
  // prepareForTransition?: boolean;
  // appearStyle?: CSSProperties;
  // appearInitStyle?: CSSProperty;
  // enterInitStyle?: CSSProperties;
  // leaveInitStyle?: CSSProperties;
}

export interface CSSTransitionState {
  id?: StateID;
  style?: CSSProperties;
}

export enum StateID {
  Active,
  TransitToDefaultRunning,
  TransitToDefaultStarted,
  TransitToActiveAppearing,
  TransitToActiveRunning,
  TransitToActiveStarted,
  Default,
}

enum Action {
  InitActive,
  InitDefault,
  TransitionAppear,
  TransitionSkip,
  TransitionRun,
  TransitionStart,
  TransitionComplete,
}

const activeState = (props: CSSTransitionProps) => ({
  id: StateID.Active,
  style: { ...props.style, ...props.activeStyle },
});

const defaultState = (props: CSSTransitionProps) => ({
  id: StateID.Default,
  style: { ...props.style, ...props.defaultStyle },
});

const transitToActiveAppearingState = (props: CSSTransitionProps) => ({
  id: StateID.TransitToActiveAppearing,
  style: { ...props.style, ...props.defaultStyle },
});

const transitToActiveRunningState = (props: CSSTransitionProps) => ({
  id: StateID.TransitToActiveRunning,
  style: { ...props.style, ...resolveTransit(props.enterStyle, props.transitionDelay) },
});

const transitToActiveStartedState = (props: CSSTransitionProps) => ({
  id: StateID.TransitToActiveStarted,
  style: { ...props.style, ...resolveTransit(props.enterStyle, props.transitionDelay) },
});

const transitToDefaultRunningState = (props: CSSTransitionProps) => ({
  id: StateID.TransitToDefaultRunning,
  style: { ...props.style, ...resolveTransit(props.leaveStyle, props.transitionDelay) },
});

const transitToDefaultStartedState = (props: CSSTransitionProps) => ({
  id: StateID.TransitToDefaultStarted,
  style: { ...props.style, ...resolveTransit(props.leaveStyle, props.transitionDelay) },
});

export class CSSTransition extends Component<CSSTransitionProps, CSSTransitionState> {
  public static defaultProps: any = {
    component: "div",
  };

  private appearTimer: any;

  constructor(props: CSSTransitionProps) {
    super(props);
    let stateAction = Action.InitDefault;
    if (!props.transitionAppear && props.active) {
      stateAction = Action.InitActive;
    }
    this.dispatch(stateAction, props);
  }

  public componentDidMount(): void {
    if (this.props.transitionAppear && this.props.active) {
      this.dispatch(Action.TransitionAppear);
    }
  }

  public componentWillUnmount(): void {
    clearTimeout(this.appearTimer);
  }

  public componentWillReceiveProps(nextProps: CSSTransitionProps): void {
    if (this.props.active === nextProps.active) { return; }
    this.dispatch(Action.TransitionRun, nextProps);
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
      enterStyle: _f,
      leaveStyle: _g,
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

  private handleTransitionComplete = () => this.dispatch(Action.TransitionComplete);
  private handleTransitionBegin = () => this.dispatch(Action.TransitionStart);

  private dispatch(action: Action, props = this.props, state = this.state): void {
    switch (action) {
      case Action.InitActive:
        if (state !== undefined) { throw new Error("invalid state transition"); }
        this.state = activeState(props);
        return;
      case Action.InitDefault:
        if (state !== undefined) { throw new Error("invalid state transition"); }
        this.state = defaultState(props);
        return;
      case Action.TransitionAppear:
        if (state.id !== StateID.Default) {
          throw new Error("invalid state transition");
        }
        this.appearTimer = setTimeout(() => {
          this.dispatch(Action.TransitionRun, props);
        }, TICK);
        return this.setState(transitToActiveAppearingState(props));
      case Action.TransitionRun:
        switch (state.id) {
          case StateID.TransitToActiveAppearing:
            clearTimeout(this.appearTimer);
            if (props.active) {
              return this.setState(transitToActiveRunningState(props));
            }
            if (props.onTransitionComplete) { props.onTransitionComplete(); }
            return this.setState(defaultState(props));
          case StateID.Active:
          case StateID.TransitToActiveStarted:
            return this.setState(transitToDefaultRunningState(props));
          case StateID.Default:
          case StateID.TransitToDefaultStarted:
            return this.setState(transitToActiveRunningState(props));
          case StateID.TransitToActiveRunning:
            if (props.onTransitionComplete) { props.onTransitionComplete(); }
            return this.setState(defaultState(props));
          case StateID.TransitToDefaultRunning:
            if (props.onTransitionComplete) { props.onTransitionComplete(); }
            return this.setState(activeState(props));
          default:
            throw new Error("invalid state transition");
        }
      case Action.TransitionStart:
        switch (state.id) {
          case StateID.TransitToActiveRunning:
            return this.setState(transitToActiveStartedState(props));
          case StateID.TransitToDefaultRunning:
            return this.setState(transitToDefaultStartedState(props));
          default:
            // We don't error out, because the workaround for transitionstart
            // could happen after transitionend.
            return;
        }
      case Action.TransitionComplete:
        switch (state.id) {
          case StateID.TransitToActiveRunning:
          case StateID.TransitToActiveStarted:
            if (props.onTransitionComplete) { props.onTransitionComplete(); }
            return this.setState(activeState(props));
          case StateID.TransitToDefaultRunning:
          case StateID.TransitToDefaultStarted:
            if (props.onTransitionComplete) { props.onTransitionComplete(); }
            return this.setState(defaultState(props));
          default:
            throw new Error("invalid state transition");
        }
      default:
    }
    throw new Error("unexpected error");
  }
}
