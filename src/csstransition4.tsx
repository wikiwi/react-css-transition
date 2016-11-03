/*
 * Copyright (C) 2016 Chi Vinh Le and contributors.
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import * as objectAssign from "object-assign";
import * as React from "react";

import { TransitionConfig } from "./transit";

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
  workaroundStyle?: React.CSSProperties;
  firstProperty?: string;
  lastProperty?: string;
}

function getRestProps(props: CSSTransitionProps): React.HTMLAttributes<HTMLElement> {
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
        this.state = activeState(state, props);
        return;
      case Action.InitDefault:
        if (state !== undefined) { throw new Error("invalid state transition"); }
        this.state = defaultState(state, props);
        return;
      case Action.TransitionAppear:
        if (state.id !== State.Default) {
          throw new Error("invalid state transition");
        }
        this.appearTimer = setTimeout(() => {
          this.dispatch(Action.TransitionRun, props);
        }, TICK);
        return this.setState(transitToActiveAppearingState(state, props));
      case Action.TransitionRun:
        switch (state.id) {
          case State.TransitToActiveAppearing:
            clearTimeout(this.appearTimer);
          case State.Active:
          case State.TransitToActiveStarted:
            return this.setState(transitToDefaultRunningState(state, props));
          case State.Default:
          case State.TransitToDefaultStarted:
            return this.setState(transitToActiveRunningState(state, props));
          case State.TransitToActiveRunning:
            if (props.onTransitionComplete) { props.onTransitionComplete(); }
            return this.setState(defaultState(state, props));
          case State.TransitToDefaultRunning:
            if (props.onTransitionComplete) { props.onTransitionComplete(); }
            return this.setState(activeState(state, props));
          default:
            throw new Error("invalid state transition");
        }
      case Action.TransitionStart:
        switch (state.id) {
          case State.TransitToActiveRunning:
            return this.setState(transitToActiveStartedState(state, props));
          case State.TransitToDefaultRunning:
            return this.setState(transitToDefaultStartedState(state, props));
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
            return this.setState(activeState(state, props));
          case State.TransitToDefaultRunning:
          case State.TransitToDefaultStarted:
            if (props.onTransitionComplete) { props.onTransitionComplete(); }
            return this.setState(defaultState(state, props));
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
    const { component, children } = this.props;
    const { style, workaroundStyle } = this.state;

    const restProps = getRestProps(this.props);
    objectAssign(restProps, {
      onTransitionEnd: this.handleTransitionEnd,
      style: objectAssign({}, this.props.style, style),
    });

    let workaround: React.ReactElement<any> = null;
    if (this.needWorkaround) {
      const workaroundProps: React.HTMLProps<HTMLSpanElement> = {
        onTransitionEnd: this.handleTransitionStart,
        style: workaroundStyle,
        key: "workaround",
      };
      workaround = <span {...workaroundProps } />;
    }

    if (component) {
      return React.createElement(component as any, restProps, workaround, children);
    }

    const child = React.Children.only(children);
    return React.cloneElement(child, restProps, workaround, child.props.children);
  }

  private handleTransitionEnd = (e: React.TransitionEvent) => {
    if (e.target !== e.currentTarget ||
      removeVendorPrefix(e.propertyName) !== this.state.lastProperty) {
      return;
    }
    this.dispatch(Action.TransitionEnd);
  }

  private handleTransitionStart = (e: React.TransitionEvent) => {
    if (e.target !== e.currentTarget ||
      removeVendorPrefix(e.propertyName) !== this.state.firstProperty) {
      return;
    }
    this.dispatch(Action.TransitionStart);
  }
}

const workaroundStyle = {
  active: { transform: "scale(1.0)" },
  default: { transform: "scale(0.99)" },
  enter: (delay?: number) => ({ transform: "scale(1.0)", transition: `transform 1ms linear ${delay}ms` }),
  leave: (delay?: number) => ({ transform: "scale(0.99)", transition: `transform 1ms linear ${delay}ms` }),
};

interface ProcessResult {
  style: React.CSSProperties;
  lastProperty?: string;
  firstProperty?: string;
  firstPropertyDelay?: number;
}

function processTransitionStyle(style: React.CSSProperties, globalDelay = 0): ProcessResult {
  let transition = "";
  let processedStyle = objectAssign({}, style);
  let lastProperty: string;
  let lastPropertyDuration = -1;
  let firstPropertyDelay = 9999999999;
  let firstProperty: string;

  for (const property in style) {
    const value = style[property];
    if (typeof value === "object") {
      const config = value as TransitionConfig;
      if (transition !== "") {
        transition += ", ";
      }
      transition += `${property} ${config.getParameterString(globalDelay)}`;
      processedStyle[property] = config.value;
      const duration = config.getTotalDuration();
      const delay = config.params.delay ? config.params.delay : 0;
      if (delay < firstPropertyDelay) {
        firstPropertyDelay = delay;
        firstProperty = property;
      }
      if (duration > lastPropertyDuration) {
        lastPropertyDuration = duration;
        lastProperty = property;
      }
    }
  }
  if (transition) {
    processedStyle.transition = transition;
  }
  return {
    style: processedStyle,
    lastProperty,
    firstProperty,
    firstPropertyDelay: firstProperty ?
      firstPropertyDelay + globalDelay : undefined,
  };
}

function removeVendorPrefix(val: string): string {
  return val.replace(/^-(webkit|moz|ms|o)-/, "");
}

const activeState = (state: CSSTransitionState, props: CSSTransitionProps) => ({
  id: State.Active,
  style: props.activeStyle,
  workaroundStyle: workaroundStyle.active,
});

const defaultState = (state: CSSTransitionState, props: CSSTransitionProps) => ({
  id: State.Default,
  style: props.defaultStyle,
  workaroundStyle: workaroundStyle.default,
});

const transitToActiveAppearingState = (state: CSSTransitionState, props: CSSTransitionProps) => ({
  id: State.TransitToActiveAppearing,
  style: props.defaultStyle,
  workaroundStyle: workaroundStyle.default,
});

const transitToActiveRunningState = (state: CSSTransitionState, props: CSSTransitionProps) => {
  const { style, lastProperty, firstProperty, firstPropertyDelay } = processTransitionStyle(props.enterStyle);
  return {
    id: State.TransitToActiveRunning,
    style,
    firstProperty,
    lastProperty,
    workaroundStyle: workaroundStyle.enter(firstPropertyDelay),
  };
};

const transitToActiveStartedState = (state: CSSTransitionState, props: CSSTransitionProps) => {
  const { style, lastProperty, firstProperty, firstPropertyDelay } = processTransitionStyle(props.enterStyle);
  return {
    id: State.TransitToActiveStarted,
    style,
    firstProperty,
    lastProperty,
    workaroundStyle: workaroundStyle.enter(firstPropertyDelay),
  };
};

const transitToDefaultRunningState = (state: CSSTransitionState, props: CSSTransitionProps) => {
  const { style, lastProperty, firstProperty, firstPropertyDelay } = processTransitionStyle(props.leaveStyle);
  return {
    id: State.TransitToDefaultRunning,
    style,
    firstProperty,
    lastProperty,
    workaroundStyle: workaroundStyle.leave(firstPropertyDelay),
  };
};

const transitToDefaultStartedState = (state: CSSTransitionState, props: CSSTransitionProps) => {
  const { style, lastProperty, firstProperty, firstPropertyDelay } = processTransitionStyle(props.leaveStyle);
  return {
    id: State.TransitToDefaultStarted,
    style,
    firstProperty,
    lastProperty,
    workaroundStyle: workaroundStyle.leave(firstPropertyDelay),
  };
};
