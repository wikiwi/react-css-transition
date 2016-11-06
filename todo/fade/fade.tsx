/*
 * Copyright (C) 2016 Chi Vinh Le and contributors.
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import * as React from "react";

import { CommonAttributes, CSSTransition, CSSTransitionProps } from "../csstransition";
import { transit } from "../transit";

export interface CSSTransitionFadeAttributes extends
  CommonAttributes {
  transitionDuration?: number;
  defaultOpacity?: number;
  activeOpacity?: number;
}

export interface CSSTransitionFadeProps extends
  CSSTransitionFadeAttributes,
  React.ClassAttributes<CSSTransitionFade> { }

function getRestAttributes(props: CSSTransitionFadeProps): React.HTMLAttributes<HTMLElement> {
  const rest = Object.assign({}, props);
  delete rest.transitionDuration;
  delete rest.defaultOpacity;
  delete rest.activeOpacity;
  return rest;
}

export class CSSTransitionFade extends React.PureComponent<CSSTransitionFadeProps, {}> {
  static defaultProps = {
    transitionDuration: 500,
    defaultOpacity: 0,
    activeOpacity: 1,
  };

  constructor(props: CSSTransitionFadeProps) {
    super(props);
  }

  render(): React.ReactElement<any> {
    const {
      transitionDuration,
      defaultOpacity,
      activeOpacity,
    } = this.props;

    const restAttributes = getRestAttributes(this.props);
    const params = { timing: "cubic-bezier(0.23, 1, 0.32, 1)" };
    const transitionProps: CSSTransitionProps = {
      defaultStyle: { opacity: defaultOpacity },
      enterStyle: { opacity: transit(activeOpacity, transitionDuration, params) },
      activeStyle: { opacity: activeOpacity },
      leaveStyle: { opacity: transit(defaultOpacity, transitionDuration, params) },
    };

    return (
      <CSSTransition {...restAttributes} {...transitionProps} />
    );
  }
}
