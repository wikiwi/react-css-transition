/**
 * @license
 * Copyright (C) 2016-present Chi Vinh Le and contributors.
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import * as React from "react";
import { EventHandler, MouseEvent, ComponentClass, StatelessComponent } from "react";
import { CSSTransition, CSSTransitionProps, transit } from "react-css-transition";
import { assemble, withState, withHandlers } from "reassemble";
import CodeIcon from "react-icons/md/code";

import { timing } from "../theme";

import { SyntaxHighlighter } from "./syntaxHighlighter";
import { IconButton } from "./iconButton";
import classes from "./demo.css";

export type DemoProps = {
  title: string,
  source: string,
  component: ComponentClass<any> | StatelessComponent<any>,
};

type DemoInnerProps = DemoProps & {
  onClick: React.EventHandler<React.MouseEvent<any>>,
  active: boolean,
};

const openClose: CSSTransitionProps = {
  defaultStyle: {
    height: "0px",
  },
  enterStyle: {
    height: transit("300px", 500, timing.easeInOut),
  },
  leaveStyle: {
    height: transit("0px", 500, timing.easeInOut),
  },
  activeStyle: {
    height: "300px",
  },
};

const enhance = assemble<DemoInnerProps, DemoProps>(
  withState("active", "setActive", false),
  withHandlers({
    onClick: (props) => (event) => props.setActive(!props.active),
  }),
);

const DemoInner: StatelessComponent<DemoInnerProps> =
  ({title, source, component: Component, onClick, active}) => (
    <section className={classes.root}>
      <div className={classes.bar}>
        <h3>{title}</h3>
        <span className={classes.flex} />
        <IconButton title="View Source" onClick={onClick}><CodeIcon /></IconButton>
      </div>
      <CSSTransition {...openClose} className={classes.source} active={active}>
        <SyntaxHighlighter language="js">
          {source}
        </SyntaxHighlighter>
      </CSSTransition>
      <div className={classes.main}>
        <Component />
      </div>
    </section>
  );

export const Demo = enhance(DemoInner);
