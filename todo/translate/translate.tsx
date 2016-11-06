/*
 * Copyright (C) 2016 Chi Vinh Le and contributors.
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import * as React from "react";

import { CommonAttributes, CSSTransition, CSSTransitionProps } from "../csstransition";
import { transit } from "../transit";

export interface CSSTransitionTranslateAttributes extends
  CommonAttributes {
  transitionDuration?: number;
  defaultTranslateX?: string;
  defaultTranslateY?: string;
  defaultTranslateZ?: string;
  activeTranslateX?: string;
  activeTranslateY?: string;
  activeTranslateZ?: string;
}
export interface CSSTransitionTranslateProps extends
  CSSTransitionTranslateAttributes,
  React.ClassAttributes<CSSTransitionTranslate> { }

function getRestAttributes(props: CSSTransitionTranslateProps): React.HTMLAttributes<HTMLElement> {
  const rest = Object.assign({}, props);
  delete rest.transitionDuration;
  delete rest.defaultTranslateX;
  delete rest.defaultTranslateY;
  delete rest.defaultTranslateZ;
  delete rest.activeTranslateX;
  delete rest.activeTranslateY;
  delete rest.activeTranslateZ;
  return rest;
}

export class CSSTransitionTranslate extends React.PureComponent<CSSTransitionTranslateProps, {}> {
  static defaultProps = {
    transitionDuration: 500,
    defaultTranslateX: 0,
    defaultTranslateY: 0,
    defaultTranslateZ: 0,
    activeTranslateX: 0,
    activeTranslateY: 0,
    activeTranslateZ: 0,
  };

  constructor(props: CSSTransitionTranslateProps) {
    super(props);
  }

  private getDefaultTransform() {
    const {  defaultTranslateX, defaultTranslateY, defaultTranslateZ } = this.props;
    return `translate3d(${defaultTranslateX}, ${defaultTranslateY}, ${defaultTranslateZ})`;
  }

  private getActiveTransform() {
    const {  activeTranslateX, activeTranslateY, activeTranslateZ } = this.props;
    return `translate3d(${activeTranslateX}, ${activeTranslateY}, ${activeTranslateZ})`;
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
