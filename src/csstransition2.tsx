/*
 * Copyright (C) 2016 Chi Vinh Le and contributors.
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import * as objectAssign from "object-assign";
import * as React from "react";

import { defaultProps } from "recompose";
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

enum StateAction {
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
  activeStyle: React.CSSProperties;
  enterStyle: React.CSSProperties;
  leaveStyle: React.CSSProperties;

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
  id: State;
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

const CSSTransition = (props: any) => {
  const { style, workaroundStyle, onTransitionStart, onTransitionEnd, component, children } = props;
  const rest = getRestProps(props);
  objectAssign(rest, {
    onTransitionEnd,
    style,
  });

  let workaround: React.ReactElement<any> = null;
  if (this.needWorkaround) {
    const workaroundProps: React.HTMLProps<HTMLSpanElement> = {
      onTransitionEnd: onTransitionStart,
      style: workaroundStyle,
      key: "workaround",
    };
    workaround = <span {...workaroundProps } />;
  }

  if (component) {
    // TODO: typing issues.
    return React.createElement(component as any, rest, workaround, children);
  }

  const child = React.Children.only(children);
  return React.cloneElement(child, rest, workaround, child.props.children);
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
