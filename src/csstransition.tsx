import * as React from "react";
import { CSSProperties, ComponentClass, ReactNode, StatelessComponent, HTMLAttributes } from "react";
import { assemble, setDisplayName, omitProps, defaultProps } from "reassemble";

import { reducer } from "./reducer";
import { withTransitionState, WithTransitionStateProps } from "./composables/withTransitionState";
import { mergeWithBaseStyle } from "./composables/mergeWithBaseStyle";
import { withTransitionInfo, WithTransitionInfoProps } from "./composables/withTransitionInfo";
import { withTransitionObserver, WithTransitionObserverProps } from "./composables/withTransitionObserver";
import { withWorkaround } from "./composables/withWorkaround";
import { withDOMNodeCallback, WithDOMNodeCallbackProps } from "./composables/withDOMNodeCallback";
// import { preventPhantomEvents } from "./composables/preventPhantomEvents";

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
  defaultClassName?: string;
  activeClassName?: string;
  appearClassName?: string;
  enterClassName?: string;
  leaveClassName?: string;
  appearInitClassName?: string;
  enterInitClassName?: string;
  leaveInitClassName?: string;
  className?: string;
}

export interface CSSTransitionInnerProps
  extends HTMLAttributes<any> {
  style?: CSSProperties;
  component?: string | ComponentClass<any> | StatelessComponent<any>;
  onTransitionBegin: any;
  onTransitionComplete: any;
  onDOMNodeRef?: (ref: Element) => void;
}

type PropsUnion = CSSTransitionProps
  & WithTransitionInfoProps
  & WithTransitionStateProps
  & WithDOMNodeCallbackProps
  & WithTransitionObserverProps
  & CSSTransitionInnerProps;

const withDefaultProps = defaultProps<Partial<CSSTransitionProps>>({
  component: "div",
});

const mapPropsToInner = omitProps<keyof PropsUnion>(
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
  "defaultClassName",
  "activeClassName",
  "appearClassName",
  "enterClassName",
  "leaveClassName",
  "appearInitClassName",
  "enterInitClassName",
  "leaveInitClassName",
  "transitionDelay",
  "onTransitionComplete",
  "onTransitionBegin",
  "transitionInfo",
  "transitionState",
  "getDOMNode",
);

const enhance = assemble<CSSTransitionInnerProps, CSSTransitionProps>(
  setDisplayName("CSSTransition"),
  withDefaultProps,
  withDOMNodeCallback,
  withTransitionState(reducer),
  mergeWithBaseStyle,
  withTransitionInfo,
  withTransitionObserver,
  withWorkaround,
  // TODO: needs more investigation and probably a different way to do it.
  // preventPhantomEvents,
  mapPropsToInner,
);

export const CSSTransitionInner: StatelessComponent<CSSTransitionInnerProps> =
  ({component: Wrapper, onDOMNodeRef, children, ...rest }) =>
    <Wrapper ref={onDOMNodeRef} {...rest} children={children} />;

export const CSSTransition = enhance(CSSTransitionInner);
