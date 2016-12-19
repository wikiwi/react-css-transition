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

describe("style integration test", () => {
  describe("<CSSTransition>", () => {
    const style: CSSProperties = { height: "20px" };

    const activeStyle: CSSProperties = { width: "100px" };
    const defaultStyle: CSSProperties = { width: "50px" };
    const enterStyle: CSSProperties = { width: transit("100px", 150, "ease", 25) };
    const leaveStyle: CSSProperties = { width: transit("50px", 150, "ease", 25) };
    const enterStyleProcessed: CSSProperties = { width: "100px", transition: "width 150ms ease 25ms" };
    const leaveStyleProcessed: CSSProperties = { width: "50px", transition: "width 150ms ease 25ms" };
    let getWrapper: (props?: CSSTransitionProps) => ReactWrapper<any, {}>;

    before(() => {
      const render = (props?: CSSTransitionProps) => (
        <CSSTransition {...props}>
          <span>dummy</span>
        </CSSTransition>
      );
      getWrapper = (props?: CSSTransitionProps) => mount(render(props), { attachTo: createTestDiv() });
    });

    describe("transition default -> active", () => {
      let wrapper: ReactWrapper<any, {}>;
      let target: ReactWrapper<any, {}>;

      before(() => {
        wrapper = getWrapper({
          style,
          activeStyle,
          enterStyle,
          leaveStyle,
          defaultStyle,
        });
        target = wrapper.find("div");
      });

      after(() => {
        wrapper.detach();
      });

      it("should start with default style", () => {
        assert.deepEqual(target.props().style, { ...style, ...defaultStyle });
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

        it("should begin transition", () => {
          assert.deepEqual(target.props().style, { ...style, ...enterStyleProcessed });
        });

        describe("when transition ends", () => {
          before((done) => {
            setTimeout(() => {
              done();
            }, 200);
          });

          it("should become active", () => {
            assert.deepEqual(target.props().style, { ...style, ...activeStyle });
          });
        });
      });
    });

    describe("transition active -> default", () => {
      let wrapper: ReactWrapper<any, {}>;
      let target: ReactWrapper<any, {}>;

      before(() => {
        wrapper = getWrapper({
          style,
          activeStyle,
          enterStyle,
          leaveStyle,
          defaultStyle,
          active: true,
        });
        target = wrapper.find("div");
      });

      after(() => {
        wrapper.detach();
      });

      it("should start with active style", () => {
        assert.deepEqual(target.props().style, { ...style, ...activeStyle });
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

        it("should begin transition", () => {
          assert.deepEqual(target.props().style, { ...style, ...leaveStyleProcessed });
        });

        describe("when transition ends", () => {
          before((done) => {
            setTimeout(() => {
              done();
            }, 200);
          });

          it("should become default", () => {
            assert.deepEqual(target.props().style, { ...style, ...defaultStyle });
          });
        });
      });
    });
  });
});
