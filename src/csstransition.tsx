/*
 * Copyright (C) 2016 Chi Vinh Le and contributors.
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import * as objectAssign from "object-assign";
import * as React from "react";

import { TransitionObserver, TransitionObserverProps } from "./transitionobserver";

enum State {
  Active,
  TransitToDefaultRunning,
  TransitToDefaultStarted,
  TransitToActiveAppearing,
  TransitToActiveRunning,
  TransitToActiveStarted,
  Default
}

enum Action {
  InitActive,
  InitDefault,
  TransitionAppear,
  TransitionSkip,
  TransitionRun,
  TransitionStart,
  TransitionEnd
}

const TICK = 17;

export interface CommonAttributes extends
  React.HTMLAttributes<HTMLElement> {
  active?: boolean;
  transitionAppear?: boolean;
  transitionDelay?: number;
  onTransitionComplete?: () => void;
  component?: string | React.ComponentClass<any>;
  children?: React.ReactNode;
  // TODO:
  skipTransition?: boolean;
}

export interface CSSTransitionAttributes extends
  CommonAttributes {
  defaultStyle?: React.CSSProperties;
  activeStyle?: React.CSSProperties;
  enterStyle?: React.CSSProperties;
  leaveStyle?: React.CSSProperties;

  // TODO:
  prepareForTransition?: boolean;
  enterInitStyle?: React.CSSProperties;
  leaveInitStyle?: React.CSSProperties;
}

export interface CSSTransitionProps extends
  CSSTransitionAttributes,
  React.ClassAttributes<CSSTransition> {
  vendorPrefixer?: (styles: any) => any;
}

interface CSSTransitionState {
  id?: State;
  style?: React.CSSProperties;
}

function getRest(props: CSSTransitionProps): React.HTMLAttributes<HTMLElement> {
  const rest = objectAssign({}, props);
  delete rest.active;
  delete rest.transitionAppear;
  delete rest.transitionDelay;
  delete rest.onTransitionComplete;
  delete rest.component;
  delete rest.skipTransition;
  delete rest.defaultStyle;
  delete rest.activeStyle;
  delete rest.enterStyle;
  delete rest.leaveStyle;
  delete rest.prepareForTransition;
  delete rest.enterInitStyle;
  delete rest.leaveInitStyle;
  delete rest.vendorPrefixer;
  delete rest.style;
  return rest;
}

export class CSSTransition extends React.Component<CSSTransitionProps, CSSTransitionState> {
  // Better support for default Props when this lands: https://github.com/Microsoft/TypeScript/issues/11233.
  public static defaultProps: CSSTransitionProps = {
    component: "div",
    activeStyle: undefined,
    enterStyle: undefined,
    leaveStyle: undefined,
  };

  private appearTimer: NodeJS.Timer;

  private get needWorkaround(): boolean { return true; }

  constructor(props: CSSTransitionProps) {
    super(props);
    let stateAction = Action.InitDefault;
    if (!props.transitionAppear && props.active) {
      stateAction = Action.InitActive;
    }
    this.dispatch(stateAction, props);
  }

  public dispatch(action: Action, props = this.props, state = this.state): void {
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
        if (state.id !== State.Default) {
          throw new Error("invalid state transition");
        }
        this.appearTimer = setTimeout(() => {
          this.dispatch(Action.TransitionRun, props);
        }, TICK);
        return this.setState(transitToActiveAppearingState(props));
      case Action.TransitionRun:
        switch (state.id) {
          case State.TransitToActiveAppearing:
            clearTimeout(this.appearTimer);
          case State.Active:
          case State.TransitToActiveStarted:
            return this.setState(transitToDefaultRunningState(props));
          case State.Default:
          case State.TransitToDefaultStarted:
            return this.setState(transitToActiveRunningState(props));
          case State.TransitToActiveRunning:
            if (props.onTransitionComplete) { props.onTransitionComplete(); }
            return this.setState(defaultState(props));
          case State.TransitToDefaultRunning:
            if (props.onTransitionComplete) { props.onTransitionComplete(); }
            return this.setState(activeState(props));
          default:
            throw new Error("invalid state transition");
        }
      case Action.TransitionStart:
        switch (state.id) {
          case State.TransitToActiveRunning:
            return this.setState(transitToActiveStartedState(props));
          case State.TransitToDefaultRunning:
            return this.setState(transitToDefaultStartedState(props));
          default:
            // We don't error out, because the workaround for transitionstart
            // could happen after transitionend.
            return;
        }
      case Action.TransitionEnd:
        switch (state.id) {
          case State.TransitToActiveRunning:
          case State.TransitToActiveStarted:
            if (props.onTransitionComplete) { props.onTransitionComplete(); }
            return this.setState(activeState(props));
          case State.TransitToDefaultRunning:
          case State.TransitToDefaultStarted:
            if (props.onTransitionComplete) { props.onTransitionComplete(); }
            return this.setState(defaultState(props));
          default:
            throw new Error("invalid state transition");
        }
      default:
    }
    throw new Error("unexpected error");
  }

  public componentDidMount(): void {
    if (this.props.transitionAppear && this.props.active) {
      this.dispatch(Action.TransitionAppear);
    }
  }

  public componentWillReceiveProps(nextProps: CSSTransitionProps): void {
    const { active } = this.props;
    if (active === nextProps.active) { return; }
    this.dispatch(Action.TransitionRun, nextProps);
  }

  public render(): React.ReactElement<any> {
    const { children } = this.props;
    const { style } = this.state;
    const Wrapper = this.props.component;

    const props: TransitionObserverProps = {
      style: objectAssign({}, style, this.state.style),
      onTransitionStart: this.handleTransitionStart,
      onTransitionComplete: this.handleTransitionComplete,
    };
    const rest = getRest(this.props);

    const inner = Wrapper ? <Wrapper children={children} /> : children;
    return (
      <TransitionObserver {...props} {...rest} >
        {inner}
      </TransitionObserver>
    );
  }

  private handleTransitionComplete = () => this.dispatch(Action.TransitionEnd);
  private handleTransitionStart = () => this.dispatch(Action.TransitionStart);
}

const activeState = (props: CSSTransitionProps) => ({
  id: State.Active,
  style: props.activeStyle,
});

const defaultState = (props: CSSTransitionProps) => ({
  id: State.Default,
  style: props.defaultStyle,
});

const transitToActiveAppearingState = (props: CSSTransitionProps) => ({
  id: State.TransitToActiveAppearing,
  style: props.defaultStyle,
});

const transitToActiveRunningState = (props: CSSTransitionProps) => ({
  id: State.TransitToActiveRunning,
  style: props.enterStyle,
});

const transitToActiveStartedState = (props: CSSTransitionProps) => ({
  id: State.TransitToActiveStarted,
  style: props.enterStyle,
});

const transitToDefaultRunningState = (props: CSSTransitionProps) => ({
  id: State.TransitToDefaultRunning,
  style: props.leaveStyle,
});

const transitToDefaultStartedState = (props: CSSTransitionProps) => ({
  id: State.TransitToDefaultStarted,
  style: props.leaveStyle,
});
