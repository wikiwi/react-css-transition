/**
 * @license
 * Copyright (C) 2016 Chi Vinh Le and contributors.
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import * as React from "react";
import { CSSProperties } from "react";
import { ReactWrapper, mount } from "enzyme";
import { assert } from "chai";

import { createTestDiv } from "../utils";
import { CSSTransitionProps, CSSTransition, transit } from "../../src";

const TICK = 17;

describe("delay integration test", () => {
  describe("<CSSTransition>", () => {
    const transitionDelay = { enter: 30, leave: 20 };

    const activeStyle: CSSProperties = { width: "100px" };
    const defaultStyle: CSSProperties = { width: "50px" };
    const enterStyle: CSSProperties = { width: transit("100px", 150, "ease", 25) };
    const leaveStyle: CSSProperties = { width: transit("50px", 150, "ease", 25) };
    const enterStyleProcessed: CSSProperties = { width: "100px", transition: "width 150ms ease 55ms" };
    const leaveStyleProcessed: CSSProperties = { width: "50px", transition: "width 150ms ease 45ms" };
    let getWrapper: (props?: CSSTransitionProps) => ReactWrapper<any, {}>;
    let wrapper: ReactWrapper<any, {}>;
    let target: ReactWrapper<any, {}>;

    before(() => {
      const render = (props?: CSSTransitionProps) => (
        <CSSTransition {...props}>
          <span>dummy</span>
        </CSSTransition>
      );
      getWrapper = (props?: CSSTransitionProps) => mount(render(props), { attachTo: createTestDiv() });
    });

    after(() => {
      wrapper.detach();
    });

    describe("transition default -> active", () => {
      before(() => {
        wrapper = getWrapper({
          transitionDelay,
          activeStyle,
          enterStyle,
          leaveStyle,
          defaultStyle,
        });
        target = wrapper.find("div");
      });
      describe("when transition was triggered", () => {
        before((done) => {
          // Trigger after a small delay to allow component
          // to be properly mounted into DOM.
          setTimeout(() => {
            wrapper.setProps({ active: true });
            done();
          }, TICK);
        });

        it("should add extra delay to enterStyle", () => {
          assert.deepEqual(target.props().style, enterStyleProcessed);
        });
      });
    });

    describe("transition active -> default", () => {
      before(() => {
        wrapper = getWrapper({
          transitionDelay,
          activeStyle,
          enterStyle,
          leaveStyle,
          defaultStyle,
          active: true,
        });
        target = wrapper.find("div");
      });
      describe("when transition was triggered", () => {
        before((done) => {
          // Trigger after a small delay to allow component
          // to be properly mounted into DOM.
          setTimeout(() => {
            wrapper.setProps({ active: false });
            done();
          }, TICK);
        });

        it("should add extra delay to leave Style", () => {
          assert.deepEqual(target.props().style, leaveStyleProcessed);
        });
      });
    });
  });
});
