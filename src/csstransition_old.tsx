/*
 * Copyright (C) 2016 Chi Vinh Le and contributors.
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import * as React from "react";

import { TransitionConfig } from "./transit";
import * as objectAssign from "object-assign";

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

interface CSSTransitionProps extends
  CSSTransitionAttributes,
  React.ClassAttributes<CSSTransition> {
  vendorPrefixer?: (styles: any) => any;
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

interface CSSTransitionState {
  defaultStyle?: React.CSSProperties;
  activeStyle?: React.CSSProperties;
  enterStyle?: React.CSSProperties;
  leaveStyle?: React.CSSProperties;
  enterLastProperty?: string;
  leaveLastProperty?: string;
  enterFirstProperty?: string;
  leaveFirstProperty?: string;
  enterFirstPropertyDelay?: number;
  leaveFirstPropertyDelay?: number;
  transitionActivated?: boolean;
  transitionStarted?: boolean;
  needWorkaround?: boolean;
  active?: boolean;
}

export class CSSTransition extends React.PureComponent<CSSTransitionProps, CSSTransitionState> {
  // Better support for default Props when this lands: https://github.com/Microsoft/TypeScript/issues/11233.
  public static defaultProps: CSSTransitionProps = {
    component: "div",
    activeStyle: undefined,
    enterStyle: undefined,
    leaveStyle: undefined,
  };

  private ref: HTMLElement;
  private appearTimer: NodeJS.Timer;

  constructor(props: CSSTransitionProps) {
    super(props);
    this.state = { active: props.transitionAppear ? false : props.active, needWorkaround: true };
  }

  public componentWillMount(): void {
    this.computeTransition(this.props);
  }

  public componentDidMount(): void {
    if (this.props.transitionAppear && this.props.active) {
      this.appearTimer = setTimeout(() => {
        this.setActiveState(true, this.props);
      }, TICK);
    }
  }

  public componentWillReceiveProps(nextProps: CSSTransitionProps): void {
    const {
      defaultStyle,
      enterStyle,
      activeStyle,
      leaveStyle,
      transitionDelay,
      active,
    } = this.props;

    if (!this.compareStyles(defaultStyle, nextProps.defaultStyle) ||
      !this.compareStyles(enterStyle, nextProps.enterStyle) ||
      !this.compareStyles(activeStyle, nextProps.activeStyle) ||
      !this.compareStyles(leaveStyle, nextProps.leaveStyle) ||
      transitionDelay !== nextProps.transitionDelay
    ) {
      this.computeTransition(nextProps);
    }
    if (active === nextProps.active) {
      return;
    }

    if (!nextProps.active) {
      // In case appear timer is still running, stop it.
      clearTimeout(this.appearTimer);
      // When appear did not yet happen, we already reached the desired state.
      if (nextProps.active === this.state.active) {
        if (nextProps.onTransitionComplete) {
          nextProps.onTransitionComplete();
        }
        return;
      }
    }

    this.setActiveState(nextProps.active, nextProps);
  }

  public render(): React.ReactElement<any> {
    const { component, children } = this.props;
    const { active, defaultStyle, enterStyle, leaveStyle, activeStyle, transitionActivated, needWorkaround } = this.state;
    let style: React.CSSProperties;
    if (transitionActivated) {
      if (active) {
        style = objectAssign({}, enterStyle);
      } else {
        style = objectAssign({}, leaveStyle);
      }
    } else if (active) {
      style = objectAssign({}, activeStyle);
    } else {
      style = objectAssign({}, defaultStyle);
    }
    const restProps = getRestProps(this.props);
    objectAssign(restProps, {
      onTransitionEnd: this.handleTransitionEnd,
      style: objectAssign({}, this.props.style, style),
      ref: this.handleRef,
    });

    let workaround: React.ReactElement<any> = null;
    if (needWorkaround) {
      workaround = this.renderWorkaround();
    }

    if (component) {
      // TODO: typing issues.
      return React.createElement(component as any, restProps, workaround, children);
    }

    const child = React.Children.only(children);
    return React.cloneElement(child, restProps, workaround, child.props.children);
  }

  private compareStyles(styleA: any, styleB: any): boolean {
    let keysA = Object.keys(styleA);
    let keysB = Object.keys(styleB);
    if (keysA.length !== keysB.length) {
      return false;
    }
    for (let key of keysA) {
      if (keysB.indexOf(key) === -1) {
        return false;
      }
      const a = styleA[key];
      const b = styleB[key];
      if (a && a["isEqualTo"]) {
        if (!a["isEqualTo"](b)) {
          return false;
        }
      } else {
        if (a !== b) {
          return false;
        }
      }
    }
    return true;
  }

  private setActiveState(b: boolean, props: CSSTransitionProps): void {
    this.setState({ active: b });
    this.startTransition(props);
  }

  private processTransitionStyle(style: React.CSSProperties, globalDelay: number): any {
    let transition = "";
    let processedStyle = objectAssign({}, style);
    let lastPropertyToFinish: string;
    let lastPropertyDuration = -1;
    let firstPropertyDelay = 9999999999;
    let firstPropertyToStart: string;

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
          firstPropertyToStart = property;
        }
        if (duration > lastPropertyDuration) {
          lastPropertyDuration = duration;
          lastPropertyToFinish = property;
        }
      }
    }
    if (transition) {
      processedStyle["transition"] = transition;
    }
    return {
      style: processedStyle,
      lastProperty: lastPropertyToFinish,
      firstPropertyDelay: firstPropertyDelay + globalDelay,
      firstProperty: firstPropertyToStart,
    };
  }

  private computeTransition(props: CSSTransitionProps): void {
    const delay = props.transitionDelay ? props.transitionDelay : 0;
    let defaultStyle = objectAssign({}, props.defaultStyle);
    let activeStyle = objectAssign({}, props.activeStyle);
    let processedEnter = this.processTransitionStyle(props.enterStyle, delay);
    let processedLeave = this.processTransitionStyle(props.leaveStyle, delay);
    let enterStyle = processedEnter.style;
    let leaveStyle = processedLeave.style;
    let enterLastProperty = processedEnter.lastProperty;
    let leaveLastProperty = processedLeave.lastProperty;
    let enterFirstProperty = processedEnter.firstProperty;
    let leaveFirstProperty = processedLeave.firstProperty;
    let enterFirstPropertyDelay = processedEnter.firstPropertyDelay;
    let leaveFirstPropertyDelay = processedLeave.firstPropertyDelay;

    defaultStyle = this.props.vendorPrefixer(defaultStyle);
    enterStyle = this.props.vendorPrefixer(enterStyle);
    activeStyle = this.props.vendorPrefixer(activeStyle);
    leaveStyle = this.props.vendorPrefixer(leaveStyle);

    let nextState: CSSTransitionState = {
      defaultStyle, activeStyle, enterStyle,
      leaveStyle,
      enterLastProperty, leaveLastProperty,
      enterFirstProperty, enterFirstPropertyDelay,
      leaveFirstProperty, leaveFirstPropertyDelay,
    };
    this.setState(nextState);
  }

  private startTransition(props: CSSTransitionProps): void {
    const { onTransitionComplete } = props;
    const { transitionActivated, transitionStarted } = this.state;

    const needTransition = !transitionActivated || transitionStarted;
    this.setState({
      transitionActivated: needTransition,
    });

    if (!needTransition && onTransitionComplete) {
      onTransitionComplete();
    }
  }

  private handleTransitionEnd = (e: React.TransitionEvent) => {
    const { onTransitionComplete, onTransitionEnd } = this.props;
    const { active, enterLastProperty, leaveLastProperty } = this.state;

    if (onTransitionEnd) {
      onTransitionEnd(e);
    }

    if (e.target !== e.currentTarget) {
      return;
    }

    let lastPropertyToFinish: string;
    if (active) {
      lastPropertyToFinish = enterLastProperty;
    } else {
      lastPropertyToFinish = leaveLastProperty;
    }
    if (removeVendorPrefix(e.propertyName) !== lastPropertyToFinish) {
      return;
    }

    this.setState({ transitionActivated: false, transitionStarted: false });
    if (onTransitionComplete) {
      onTransitionComplete();
    }
  }

  private handleTransitionStart = (e: React.TransitionEvent) => {
    if (e.target !== e.currentTarget) {
      return;
    }
    let firstPropertyToStart: string;
    if (this.state.needWorkaround) {
      firstPropertyToStart = "transform";
    } else if (this.state.active) {
      firstPropertyToStart = this.state.enterFirstProperty;
    } else {
      firstPropertyToStart = this.state.leaveFirstProperty;
    }
    if (removeVendorPrefix(e.propertyName) !== firstPropertyToStart) {
      return;
    }

    const { transitionActivated, transitionStarted } = this.state;
    if (!transitionActivated || transitionStarted) {
      return;
    }
    this.setState({ transitionStarted: true });
  }

  private renderWorkaround(): React.ReactElement<any> {
    const { active, transitionActivated, enterFirstProperty, enterFirstPropertyDelay,
      leaveFirstProperty, leaveFirstPropertyDelay } = this.state;

    // No transitions needed.
    if (!enterFirstProperty && !leaveFirstProperty) {
      return null;
    }

    let style: React.CSSProperties;
    if (transitionActivated) {
      if (active) {
        style = enterFirstProperty ? {
          transition: `transform 1ms linear ${enterFirstPropertyDelay}ms`,
          transform: "scale(1.0)",
        } : undefined;
      } else {
        style = leaveFirstProperty ? {
          transition: `transform 1ms linear ${leaveFirstPropertyDelay}ms`,
          transform: "scale(0.99)",
        } : undefined;
      }
    } else if (active) {
      style = { transform: "scale(1.0)" };
    } else {
      style = { transform: "scale(0.99)" };
    }
    objectAssign(style, { position: "absolute", visibility: "hidden" });
    const workaroundProps = {
      onTransitionEnd: this.handleTransitionStart,
      style,
      key: "workaround",
    };
    return <span {...workaroundProps } />;
  }

  private handleRef = (ref: HTMLElement) => {
    this.ref = ref;
  }
}

function removeVendorPrefix(val: string): string {
  return val.replace(/^-(webkit|moz|ms|o)-/, "");
}
