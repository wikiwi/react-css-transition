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
  DefaultNew,
  ActiveNew,
  AppearNew,
  Default,
  Active,
  AppearInit,
  AppearPrepare,
  AppearTriggered,
  AppearStarted,
  EnterInit,
  EnterPrepare,
  EnterTriggered,
  EnterStarted,
  LeaveInit,
  LeavePrepare,
  LeaveTriggered,
  LeaveStarted,
}

export const StateIDList = [
  StateID.ActiveNew, StateID.DefaultNew, StateID.AppearNew,
  StateID.Active, StateID.Default,
  StateID.AppearInit, StateID.AppearTriggered, StateID.AppearStarted,
  StateID.EnterInit, StateID.EnterTriggered, StateID.EnterStarted,
  StateID.LeaveInit, StateID.LeaveTriggered, StateID.LeaveStarted,
  StateID.AppearPrepare, StateID.EnterPrepare, StateID.LeavePrepare,
];

export enum ActionID {
  New,
  Mount,
  TransitionInit,
  TransitionPrepare,
  TransitionTrigger,
  TransitionStart,
  TransitionComplete,
  Timeout,
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

export type GetStateParams = { mode?: "init" | "prepare" };

export function getState(id: StateID, name: string, props: any, params: GetStateParams = {}): TransitionState {
  if (name === "appear" && !props.appearStyle && !props.appearClassName) {
    return getState(id, "enter", props, params);
  }
  let style: any;
  let className: string;
  let inTransition = false;
  if (params.mode === "init" || params.mode === "prepare") {
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
    // Setting transition before starting one fixes issues on IE & Edge...
    if (params.mode === "prepare" && style !== undefined) {
      const tmp = resolveTransit(props[name + "Style"], getDelay(name, props.transitionDelay));
      if (tmp.transition) {
        style = { ...style, transition: tmp.transition };
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

export function stateFunc(id: StateID, name: string, params: GetStateParams = {}) {
  return (props: Action["props"]) => getState(id, name, props, params);
}

export const activeNewState = stateFunc(StateID.ActiveNew, "active");
export const defaultNewState = stateFunc(StateID.DefaultNew, "default");
export const appearNewState = stateFunc(StateID.AppearNew, "appear", { mode: "init" });
export const activeState = stateFunc(StateID.Active, "active");
export const defaultState = stateFunc(StateID.Default, "default");
export const appearInitState = stateFunc(StateID.AppearInit, "appear", { mode: "init" });
export const enterInitState = stateFunc(StateID.EnterInit, "enter", { mode: "init" });
export const leaveInitState = stateFunc(StateID.LeaveInit, "leave", { mode: "init" });
export const appearPrepareState = stateFunc(StateID.AppearPrepare, "appear", { mode: "prepare" });
export const enterPrepareState = stateFunc(StateID.EnterPrepare, "enter", { mode: "prepare" });
export const leavePrepareState = stateFunc(StateID.LeavePrepare, "leave", { mode: "prepare" });
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
  let nextState: TransitionState;

  switch (action.kind) {
    case ActionID.New:
      if (stateID !== StateID.EntryPoint) { throw new Error("invalid entrypoint"); }
      if (props.active) {
        if (props.transitionAppear) { return { state: appearNewState(props) }; }
        return { state: activeNewState(props) };
      }
      if (!props.transitionAppear && props.active) { return { state: activeNewState(props) }; }
      return { state: defaultNewState(props) };
    case ActionID.Mount:
      switch (stateID) {
        case StateID.AppearNew:
          return reducer(stateID, { kind: ActionID.TransitionTrigger, props });
        default:
          return null;
      }
    case ActionID.TransitionInit:
      switch (stateID) {
        case StateID.DefaultNew:
        case StateID.Default:
          if (!hasTransition("enter", props)) {
            return { state: activeState(props), completed: true };
          }
          nextState = enterInitState(props);
          break;
        case StateID.ActiveNew:
        case StateID.Active:
          if (!hasTransition("leave", props)) {
            return { state: defaultState(props), completed: true };
          }
          nextState = leaveInitState(props);
          break;
        case StateID.AppearNew:
          if (!hasTransition("appear", props)) {
            return { state: activeState(props), completed: true };
          }
          nextState = appearInitState(props);
          break;
        default:
          throw new Error(`invalid state transition from ${StateID[stateID]}`);
      };
      return { state: nextState, pending: ActionID.TransitionPrepare };
    case ActionID.TransitionPrepare:
      switch (stateID) {
        case StateID.EnterInit:
          if (!props.active) { return { state: defaultState(props), completed: true }; }
          nextState = enterPrepareState(props);
          break;
        case StateID.LeaveInit:
          if (props.active) { return { state: activeState(props), completed: true }; }
          nextState = leavePrepareState(props);
          break;
        case StateID.AppearInit:
          if (!props.active) { return { state: defaultState(props), completed: true }; }
          nextState = appearPrepareState(props);
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
        case StateID.AppearTriggered:
        case StateID.AppearStarted:
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
        case StateID.ActiveNew:
        case StateID.Active:
        case StateID.DefaultNew:
        case StateID.Default:
        case StateID.AppearNew:
          return reducer(stateID, { kind: ActionID.TransitionInit, props });
        case StateID.EnterInit:
          return { state: defaultState(props), completed: true };
        case StateID.LeaveInit:
          return { state: activeState(props), completed: true };
        case StateID.AppearInit:
          return { state: defaultState(props), completed: true };
        case StateID.EnterPrepare:
          if (props.active) { return { state: enterTriggeredState(props) }; }
          return { state: defaultState(props), completed: true };
        case StateID.LeavePrepare:
          if (!props.active) { return { state: leaveTriggeredState(props) }; }
          return { state: activeState(props), completed: true };
        case StateID.AppearPrepare:
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
    case ActionID.Timeout:
      switch (stateID) {
        case StateID.AppearTriggered:
        case StateID.AppearStarted:
        case StateID.EnterTriggered:
        case StateID.EnterStarted:
          return { state: activeState(props), completed: true };
        case StateID.LeaveTriggered:
        case StateID.LeaveStarted:
          return { state: defaultState(props), completed: true };
        default:
          throw new Error(`invalid state transition from ${StateID[stateID]}`);
      }
    default:
  }
  throw new Error("unexpected error");
};
