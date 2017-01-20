/**
 * @license
 * Copyright (C) 2016-present Chi Vinh Le and contributors.
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

/* tslint:disable: variable-name no-switch-case-fall-through */

import { CSSProperties } from "react";

import { CSSTransitionProps, CSSTransitionDelay } from "./csstransition";
import { resolveTransit } from "./transit";

export interface TransitionState {
  id?: StateID;
  style?: CSSProperties;
  className?: string;
  inTransition?: boolean;
}

export enum StateID {
  EntryPoint,
  DefaultInit,
  ActiveInit,
  AppearInit,
  Default,
  Active,
  AppearPending,
  AppearTriggered,
  AppearStarted,
  EnterPending,
  EnterTriggered,
  EnterStarted,
  LeavePending,
  LeaveTriggered,
  LeaveStarted,
}

export const StateIDList = [
  StateID.ActiveInit, StateID.DefaultInit, StateID.AppearInit,
  StateID.Active, StateID.Default,
  StateID.AppearPending, StateID.AppearTriggered, StateID.AppearStarted,
  StateID.EnterPending, StateID.EnterTriggered, StateID.EnterStarted,
  StateID.LeavePending, StateID.LeaveTriggered, StateID.LeaveStarted,
];

export enum ActionID {
  Init,
  Mount,
  TransitionInit,
  TransitionTrigger,
  TransitionStart,
  TransitionComplete,
}

export type ActionPropKeys =
  "active"
  | "transitionAppear"
  | "transitionDelay"
  | "defaultStyle"
  | "activeStyle"
  | "appearStyle"
  | "enterStyle"
  | "leaveStyle"
  | "appearInitStyle"
  | "enterInitStyle"
  | "leaveInitStyle"
  | "defaultClassName"
  | "activeClassName"
  | "appearClassName"
  | "enterClassName"
  | "leaveClassName"
  | "appearInitClassName"
  | "enterInitClassName"
  | "leaveInitClassName";

export const actionPropKeys: ActionPropKeys[] = [
  "active",
  "transitionAppear",
  "transitionDelay",
  "defaultStyle",
  "activeStyle",
  "appearStyle",
  "enterStyle",
  "leaveStyle",
  "appearInitStyle",
  "enterInitStyle",
  "leaveInitStyle",
  "defaultClassName",
  "activeClassName",
  "appearClassName",
  "enterClassName",
  "leaveClassName",
  "appearInitClassName",
  "enterInitClassName",
  "leaveInitClassName",
];

export type ActionProps = {[P in ActionPropKeys]?: CSSTransitionProps[P]};

export type Action = {
  kind: ActionID;
  props: ActionProps;
};

export const transitionNames = ["enter", "leave", "appear"];

export function hasTransition(name: string, props: any): boolean {
  const result = props[name + "Style"] !== undefined || props[name + "ClassName"] !== undefined;
  return !result && name === "appear"
    ? hasTransition("enter", props)
    : result;
}

export function getDelay(name: string, delay: CSSTransitionDelay): number {
  if (!delay) { return 0; }
  if (typeof delay === "number") {
    return delay as number;
  }
  return (delay as any)[name] ? (delay as any)[name] : 0;
}

export function getState(id: StateID, name: string, props: any, params: { init?: boolean } = {}): TransitionState {
  if (name === "appear" && !props.appearStyle && !props.appearClassName) {
    return getState(id, "enter", props, params);
  }
  let style: any;
  let className: string;
  let inTransition = false;
  if (params.init) {
    style = props[name + "InitStyle"];
    className = props[name + "InitClassName"];
    if (style === undefined && className === undefined) {
      if (name === "enter" || name === "appear") {
        style = props.defaultStyle;
        className = props.defaultClassName;
      } else if (name === "leave") {
        style = props.activeStyle;
        className = props.activeClassName;
      }
    }
  } else {
    style = props[name + "Style"];
    className = props[name + "ClassName"];
    if (["enter", "appear", "leave"].indexOf(name) >= 0) {
      inTransition = true;
      style = resolveTransit(style, getDelay(name, props.transitionDelay));
    }
  }

  style = style || {};
  className = className || "";

  return {
    id,
    style,
    className,
    inTransition,
  };
}

export function stateFunc(id: StateID, name: string, params: { init?: boolean } = {}) {
  return (props: Action["props"]) => getState(id, name, props, params);
}

export const activeInitState = stateFunc(StateID.ActiveInit, "active");
export const defaultInitState = stateFunc(StateID.DefaultInit, "default");
export const appearInitState = stateFunc(StateID.AppearInit, "appear", { init: true });
export const activeState = stateFunc(StateID.Active, "active");
export const defaultState = stateFunc(StateID.Default, "default");
export const appearPendingState = stateFunc(StateID.AppearPending, "appear", { init: true });
export const enterPendingState = stateFunc(StateID.EnterPending, "enter", { init: true });
export const leavePendingState = stateFunc(StateID.LeavePending, "leave", { init: true });
export const appearTriggeredState = stateFunc(StateID.AppearTriggered, "appear");
export const enterTriggeredState = stateFunc(StateID.EnterTriggered, "enter");
export const leaveTriggeredState = stateFunc(StateID.LeaveTriggered, "leave");
export const appearStartedState = stateFunc(StateID.AppearStarted, "appear");
export const enterStartedState = stateFunc(StateID.EnterStarted, "enter");
export const leaveStartedState = stateFunc(StateID.LeaveStarted, "leave");

export type Reducer = (stateID: StateID, action: Action) =>
  { state: TransitionState, pending?: ActionID, completed?: boolean };

export const reducer: Reducer = (stateID, action) => {
  const props = action.props;
  switch (action.kind) {
    case ActionID.Init:
      if (stateID !== StateID.EntryPoint) { throw new Error("invalid entrypoint"); }
      if (props.active) {
        if (props.transitionAppear) { return { state: appearInitState(props) }; }
        return { state: activeInitState(props) };
      }
      if (!props.transitionAppear && props.active) { return { state: activeInitState(props) }; }
      return { state: defaultInitState(props) };
    case ActionID.Mount:
      switch (stateID) {
        case StateID.AppearInit:
          return reducer(stateID, { kind: ActionID.TransitionTrigger, props });
        default:
          return null;
      }
    case ActionID.TransitionInit:
      let nextState: TransitionState;
      switch (stateID) {
        case StateID.DefaultInit:
        case StateID.Default:
          if (!hasTransition("enter", props)) {
            return { state: activeState(props), completed: true };
          }
          nextState = enterPendingState(props);
          break;
        case StateID.ActiveInit:
        case StateID.Active:
          if (!hasTransition("leave", props)) {
            return { state: defaultState(props), completed: true };
          }
          nextState = leavePendingState(props);
          break;
        case StateID.AppearInit:
          if (!hasTransition("appear", props)) {
            return { state: activeState(props), completed: true };
          }
          nextState = appearPendingState(props);
          break;
        default:
          throw new Error(`invalid state transition from ${StateID[stateID]}`);
      };
      return { state: nextState, pending: ActionID.TransitionTrigger };
    case ActionID.TransitionStart:
      switch (stateID) {
        case StateID.EnterTriggered:
          return { state: enterStartedState(props) };
        case StateID.LeaveTriggered:
          return { state: leaveStartedState(props) };
        case StateID.AppearTriggered:
          return { state: appearStartedState(props) };
        default:
          // We don't error out, because the workaround for transitionstart
          // could happen after transitionend.
          return null;
      }
    case ActionID.TransitionComplete:
      switch (stateID) {
        case StateID.AppearStarted:
        case StateID.AppearTriggered:
        case StateID.EnterTriggered:
        case StateID.EnterStarted:
          return { state: activeState(props), completed: true };
        case StateID.LeaveTriggered:
        case StateID.LeaveStarted:
          return { state: defaultState(props), completed: true };
        default:
          throw new Error(`invalid state transition from ${StateID[stateID]}`);
      }
    case ActionID.TransitionTrigger:
      switch (stateID) {
        case StateID.ActiveInit:
        case StateID.Active:
        case StateID.DefaultInit:
        case StateID.Default:
        case StateID.AppearInit:
          return reducer(stateID, { kind: ActionID.TransitionInit, props });
        case StateID.EnterPending:
          if (props.active) { return { state: enterTriggeredState(props) }; }
          return { state: defaultState(props), completed: true };
        case StateID.LeavePending:
          if (!props.active) { return { state: leaveTriggeredState(props) }; }
          return { state: activeState(props), completed: true };
        case StateID.AppearPending:
          if (props.active) { return { state: appearTriggeredState(props) }; }
          return { state: defaultState(props), completed: true };
        case StateID.EnterTriggered:
          return { state: defaultState(props), completed: true };
        case StateID.LeaveTriggered:
          return { state: activeState(props), completed: true };
        case StateID.AppearTriggered:
          return { state: defaultState(props), completed: true };
        case StateID.AppearStarted:
        case StateID.EnterStarted:
          return { state: leaveStartedState(props) };
        case StateID.LeaveStarted:
          return { state: enterStartedState(props) };
        default:
          throw new Error(`invalid state transition from ${StateID[stateID as any]}`);
      }
    default:
  }
  throw new Error("unexpected error");
};
