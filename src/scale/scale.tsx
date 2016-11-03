/*
 * Copyright (C) 2016 Chi Vinh Le and contributors.
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import * as React from "react";

import { CommonAttributes, CSSTransition, CSSTransitionProps } from "../csstransition";
import { transit } from "../transit";

export interface CSSTransitionScaleAttributes extends
  CommonAttributes {
  transitionDuration?: number;
  defaultScaleX?: string;
  defaultScaleY?: string;
  defaultScaleZ?: string;
  activeScaleX?: string;
  activeScaleY?: string;
  activeScaleZ?: string;
}
export interface CSSTransitionScaleProps extends
  CSSTransitionScaleAttributes,
  React.ClassAttributes<CSSTransitionScale> { }

function getRestAttributes(props: CSSTransitionScaleProps): React.HTMLAttributes<HTMLElement> {
  const rest = Object.assign({}, props);
  delete rest.transitionDuration;
  delete rest.defaultScaleX;
  delete rest.defaultScaleY;
  delete rest.defaultScaleZ;
  delete rest.activeScaleX;
  delete rest.activeScaleY;
  delete rest.activeScaleZ;
  return rest;
}

export class CSSTransitionScale extends React.PureComponent<CSSTransitionScaleProps, {}> {
  static defaultProps = {
    transitionDuration: 500,
    defaultScaleX: 0,
    defaultScaleY: 0,
    defaultScaleZ: 0,
    activeScaleX: 1,
    activeScaleY: 1,
    activeScaleZ: 1,
  };

  constructor(props: CSSTransitionScaleProps) {
    super(props);
  }

  private getDefaultTransform() {
    const {  defaultScaleX, defaultScaleY, defaultScaleZ } = this.props;
    return `scale3d(${defaultScaleX}, ${defaultScaleY}, ${defaultScaleZ})`;
  }

  private getActiveTransform() {
    const {  activeScaleX, activeScaleY, activeScaleZ } = this.props;
    return `scale3d(${activeScaleX}, ${activeScaleY}, ${activeScaleZ})`;
  }

  render(): React.ReactElement<any> {
    const { transitionDuration } = this.props;
    const restAttributes = getRestAttributes(this.props);
    const defaultTransform = this.getDefaultTransform();
    const activeTransform = this.getActiveTransform();
    const params = { timing: "cubic-bezier(0.23, 1, 0.32, 1)" };

    const transitionProps: CSSTransitionProps = {
      defaultStyle: { transform: defaultTransform },
      enterStyle: { transform: transit(activeTransform, transitionDuration, params) },
      activeStyle: { transform: activeTransform },
      leaveStyle: { transform: transit(defaultTransform, transitionDuration, params) },
    };

    return (
      <CSSTransition {...restAttributes} {...transitionProps} />
    );
  }
}
