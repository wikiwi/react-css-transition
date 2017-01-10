/**
 * @license
 * Copyright (C) 2016-present Chi Vinh Le and contributors.
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import * as React from "react";
import { CSSProperties, ComponentClass, ReactNode, StatelessComponent, HTMLAttributes } from "react";
import { assemble, setDisplayName, omitProps, defaultProps } from "react-assemble";

import { reducer } from "./reducer";
import { withTransitionState } from "./composables/withTransitionState";
import { mergeWithStyle } from "./composables/mergeWithStyle";
import { withTransitionInfo } from "./composables/withTransitionInfo";
import { withTransitionObserver } from "./composables/withTransitionObserver";
import { withWorkaround } from "./composables/withWorkaround";

export type CSSTransitionDelay = number | { appear?: number; enter?: number; leave?: number };
export type CSSTransitionEventHandler = () => void;

export interface CSSTransitionProps
  extends HTMLAttributes<any> {
  component?: CSSTransitionInnerProps["component"];
  active?: boolean;
  transitionAppear?: boolean;
  transitionDelay?: CSSTransitionDelay;
  onTransitionComplete?: CSSTransitionEventHandler;
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
  component?: string | ComponentClass<any> | StatelessComponent<any>;
  onTransitionBegin: any;
  onTransitionComplete: any;
}

const withDefaultProps = defaultProps<CSSTransitionProps>({
  component: "div",
});

const mapPropsToInner = omitProps<any>(
  "active",
  "transitionAppear",
  "defaultStyle",
  "activeStyle",
  "appearStyle",
  "enterStyle",
  "leaveStyle",
  "appearInitStyle",
  "enterInitStyle",
  "leaveInitStyle",
  "transitionDelay",
  "onTransitionComplete",
  "onTransitionBegin",
  "transitionInfo",
);

const enhance = assemble<CSSTransitionInnerProps, CSSTransitionProps>(
  setDisplayName("CSSTransition"),
  withDefaultProps,
  withTransitionState(reducer),
  mergeWithStyle,
  withTransitionInfo,
  withTransitionObserver,
  withWorkaround,
  mapPropsToInner,
);

export const CSSTransitionInner: StatelessComponent<CSSTransitionInnerProps> =
  ({component: Wrapper, children, ...rest }) => <Wrapper {...rest} children={children} />;

export const CSSTransition = enhance(CSSTransitionInner);
