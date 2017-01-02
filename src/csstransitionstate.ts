/**
 * @license
 * Copyright (C) 2016-present Chi Vinh Le and contributors.
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

/* tslint:disable: variable-name no-switch-case-fall-through */

import { CSSProperties } from "react";

import { CSSTransitionProps } from "./csstransition";
import { resolveTransit } from "./transit";
import { getEnterDelay, getLeaveDelay } from "./utils";

export interface CSSTransitionState {
  id?: StateID;
  style?: CSSProperties;
}

export enum StateID {
  ActiveInit,
  Active,
  PreparedActive,
  TransitToDefaultPending,
  TransitToDefaultTriggered,
  TransitToDefaultStarted,
  TransitToActivePending,
  TransitToActiveTriggered,
  TransitToActiveStarted,
  Default,
  DefaultInit,
}

export const StateIDList = [
  StateID.ActiveInit, StateID.Active, StateID.PreparedActive,
  StateID.DefaultInit, StateID.Default,
  StateID.TransitToDefaultPending, StateID.TransitToDefaultTriggered, StateID.TransitToDefaultStarted,
  StateID.TransitToActivePending, StateID.TransitToActiveTriggered, StateID.TransitToActiveStarted,
];

export enum ActionID {
  Init,
  TransitionInit,
  TransitionSkip,
  TransitionTrigger,
  TransitionStart,
  TransitionComplete,
}

export const initActiveState = (props: CSSTransitionProps) => ({
  id: StateID.ActiveInit,
  style: { ...props.style, ...props.activeStyle },
});

export const initDefaultState = (props: CSSTransitionProps) => ({
  id: StateID.DefaultInit,
  style: { ...props.style, ...props.defaultStyle },
});

export const activeState = (props: CSSTransitionProps) => ({
  id: StateID.Active,
  style: { ...props.style, ...props.activeStyle },
});

export const defaultState = (props: CSSTransitionProps) => ({
  id: StateID.Default,
  style: { ...props.style, ...props.defaultStyle },
});

export const transitToActivePendingState = (props: CSSTransitionProps) => ({
  id: StateID.TransitToActivePending,
  style: { ...props.style, ...props.defaultStyle },
});

export const transitToDefaultPendingState = (props: CSSTransitionProps) => ({
  id: StateID.TransitToDefaultPending,
  style: { ...props.style, ...props.activeStyle },
});

export const transitToActiveTriggeredState = (props: CSSTransitionProps) => ({
  id: StateID.TransitToActiveTriggered,
  style: { ...props.style, ...resolveTransit(props.enterStyle, getEnterDelay(props.transitionDelay)) },
});

export const transitToDefaultTriggeredState = (props: CSSTransitionProps) => ({
  id: StateID.TransitToDefaultTriggered,
  style: { ...props.style, ...resolveTransit(props.leaveStyle, getLeaveDelay(props.transitionDelay)) },
});

export const transitToActiveStartedState = (props: CSSTransitionProps) => ({
  id: StateID.TransitToActiveStarted,
  style: { ...props.style, ...resolveTransit(props.enterStyle, getEnterDelay(props.transitionDelay)) },
});

export const transitToDefaultStartedState = (props: CSSTransitionProps) => ({
  id: StateID.TransitToDefaultStarted,
  style: { ...props.style, ...resolveTransit(props.leaveStyle, getLeaveDelay(props.transitionDelay)) },
});

export function reduce(
  state: CSSTransitionState,
  action: ActionID,
  props: CSSTransitionProps,
): { state: CSSTransitionState, pending?: ActionID } {
  switch (action) {
    case ActionID.Init:
      if (state !== undefined) { throw new Error("invalid state transition"); }
      if (!props.transitionAppear && props.active) { return { state: initActiveState(props) }; }
      return { state: initDefaultState(props) };
    case ActionID.TransitionInit:
      let nextState: CSSTransitionState;
      switch (state.id) {
        case StateID.DefaultInit:
        case StateID.Default:
          nextState = transitToActivePendingState(props);
          break;
        case StateID.ActiveInit:
        case StateID.Active:
          nextState = transitToDefaultPendingState(props);
          break;
        default:
          throw new Error("invalid state transition");
      };
      return { state: nextState, pending: ActionID.TransitionTrigger };
    case ActionID.TransitionStart:
      switch (state.id) {
        case StateID.TransitToActiveTriggered:
          return { state: transitToActiveStartedState(props) };
        case StateID.TransitToDefaultTriggered:
          return { state: transitToDefaultStartedState(props) };
        default:
          // We don't error out, because the workaround for transitionstart
          // could happen after transitionend.
          return null;
      }
    case ActionID.TransitionComplete:
      switch (state.id) {
        case StateID.TransitToActiveTriggered:
        case StateID.TransitToActiveStarted:
          if (props.onTransitionComplete) { props.onTransitionComplete(); }
          return { state: activeState(props) };
        case StateID.TransitToDefaultTriggered:
        case StateID.TransitToDefaultStarted:
          if (props.onTransitionComplete) { props.onTransitionComplete(); }
          return { state: defaultState(props) };
        default:
          throw new Error("invalid state transition");
      }
    case ActionID.TransitionTrigger:
      switch (state.id) {
        case StateID.ActiveInit:
        case StateID.Active:
        case StateID.DefaultInit:
        case StateID.Default:
          return reduce(state, ActionID.TransitionInit, props);
        case StateID.TransitToActivePending:
          if (props.active) { return { state: transitToActiveTriggeredState(props) }; }
          if (props.onTransitionComplete) { props.onTransitionComplete(); }
          return { state: defaultState(props) };
        case StateID.TransitToDefaultPending:
          if (!props.active) { return { state: transitToDefaultTriggeredState(props) }; }
          if (props.onTransitionComplete) { props.onTransitionComplete(); }
          return { state: activeState(props) };
        case StateID.TransitToActiveTriggered:
          if (props.onTransitionComplete) { props.onTransitionComplete(); }
          return { state: defaultState(props) };
        case StateID.TransitToDefaultTriggered:
          if (props.onTransitionComplete) { props.onTransitionComplete(); }
          return { state: activeState(props) };
        case StateID.TransitToActiveStarted:
          return { state: transitToDefaultTriggeredState(props) };
        case StateID.TransitToDefaultStarted:
          return { state: transitToActiveTriggeredState(props) };
        default:
          throw new Error("invalid state transition");
      }
    default:
  }
  throw new Error("unexpected error");
}
