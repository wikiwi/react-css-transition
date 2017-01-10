/**
 * @license
 * Copyright (C) 2016-present Chi Vinh Le and contributors.
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import * as React from "react";
import * as shallowEqual from "fbjs/lib/shallowEqual";
import { CSSProperties, ComponentClass, ReactNode, StatelessComponent, HTMLAttributes } from "react";
import {
  assemble, combine,
  withState, withHandlers, omitProps, defaultProps, withProps,
  onDidMount, onWillUnmount, onWillReceiveProps,
} from "react-assemble";

import { ActionID, reduce } from "./csstransitionstate";
import { TransitionObserver } from "./transitionobserver";
import { runInFrame } from "./utils";

export type CSSTransitionDelay = number | { appear?: number; enter?: number; leave?: number };
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

export interface CSSTransitionInnerProps
  extends HTMLAttributes<any> {
  style?: CSSProperties;
  onTransitionBegin: any;
  onTransitionComplete: any;
}

const withDefaultProps = defaultProps<CSSTransitionProps>({
  component: "div",
});

const withTransitionState = combine(
  withState<any, any>("style", "setStyle", (props: any) => reduce(undefined, ActionID.Init, props).state.style),
  withHandlers<any, any>((initialProps: any) => {
    let stateID = reduce(undefined, ActionID.Init, initialProps).state.id;
    let cancelPending: () => void = null;
    const cancelPendingIfExistant = () => {
      if (cancelPending) {
        cancelPending();
        cancelPending = null;
      }
    };
    return {
      cancelPendingIfExistant: () => cancelPendingIfExistant;
      dispatch: (props: any) => (action: ActionID) => {
        const result = reduce({ id: stateID }, action, props);
        if (!result) { return; }
        const {state, pending} = result;
        stateID = state.id;
        cancelPendingIfExistant();
        let callback: any = undefined;
        if (pending) {
          callback = () => {
            cancelPending = () => runInFrame(1, () => props.dispatch(pending));
          };
        }
        if (!shallowEqual(props.style, result.state.style)) {
          props.setStyle(result.state.style, callback);
        } else {
          callback();
        }
      },
    };
  }),
  withHandlers<any, any>({
    onTransitionBegin: ({dispatch}) => () => dispatch(ActionID.TransitionBegin),
    onTransitionComplete: ({dispatch}) => () => dispatch(ActionID.TransitionComplete),
  }),
  onDidMount(({dispatch}) => {
    dispatch(ActionID.Mount);
  }),
  onWillUnmount(({cancelPendingIfExistant}) => {
    cancelPendingIfExistant();
  }),
  onWillReceiveProps(({active: prevActive}, {active: nextActive, dispatch}) => {
    if (prevActive === nextActive) { return; }
    dispatch(ActionID.TransitionTrigger, nextProps);
  }),
  omitProps<any>("setStyle", "dispatch", "cancelPendingIfExistant"),
);

const withChildrenWrapper = withProps<any, any>(({component, children}: any) => {
  const Wrapper = component;
  return {
    children: Wrapper ? <Wrapper children={children} /> : children,
  };
});

const enhance = assemble<CSSTransitionInnerProps, CSSTransitionProps>(
  withDefaultProps,
  withTransitionState,
  withChildrenWrapper,
);

export const CSSTransitionInner: StatelessComponent<CSSTransitionInnerProps> =
  ({style, onTransitionBegin, onTransitionComplete, children, ...rest }) =>
    <TransitionObserver
      {...rest}
      onTransitionBegin={onTransitionBegin}
      onTransitionComplete={onTransitionComplete}
      style={style}
      >
      {children}
    </TransitionObserver>;

export const CSSTransition = enhance(CSSTransitionInner);
