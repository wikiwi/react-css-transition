/*
 * Copyright (C) 2016 Chi Vinh Le and contributors.
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import * as objectAssign from "object-assign";
import * as React from "react";

import { processStyle } from "./processstyle";
import { removeVendorPrefix } from "./utils";

export interface TransitionObserverProps {
  style: React.CSSProperties;
  onTransitionStart?: () => void;
  onTransitionComplete?: () => void;
  [index: string]: any;
}

function getRest(props: TransitionObserverProps): any {
  const rest = objectAssign({}, props);
  delete rest.style;
  delete rest.onTransitionStart;
  delete rest.onTransitionComplete;
  return rest;
}

export class TransitionObserver extends React.Component<TransitionObserverProps, {}> {
  constructor(props: any) {
    super(props);
  }

  public render(): React.ReactElement<any> {
    const { children } = this.props;
    const { style, lastProperty, firstPropertyDelay } = processStyle(this.props.style);

    const workaroundProps: React.HTMLProps<HTMLSpanElement> = { key: "workaround" };
    const childProps = getRest(this.props);
    childProps.style = style;

    if (style.transition) {
      if (this.props.onTransitionComplete) {
        childProps.onTransitionEnd = this.handleTransitionEnd.bind(this, lastProperty);
      }
      workaroundProps.onTransitionEnd = this.props.onTransitionStart;
      workaroundProps.style = { transform: "scale(1.0)", transition: `transform 1ms linear ${firstPropertyDelay}ms` };
    } else {
      workaroundProps.style = { transform: "scale(0.99)" };
    }

    const workaround = <span {...workaroundProps } />;

    const child = React.Children.only(children);
    return React.cloneElement(child, childProps, workaround, child.props.children);
  }

  private handleTransitionEnd = (lastProperty: string, e: React.TransitionEvent) => {
    if (e.target !== e.currentTarget ||
      removeVendorPrefix(e.propertyName) !== lastProperty) {
      return;
    }
    this.props.onTransitionComplete();
  }
}
