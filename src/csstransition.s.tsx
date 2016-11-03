/*
 * Copyright (C) 2016 Chi Vinh Le and contributors.
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import * as React from "react";

import { assert } from "chai";
import { ShallowWrapper, shallow } from "enzyme";

import { CSSTransition, CSSTransitionProps } from "./csstransition";
import { transit } from "./transit";

describe("csstransition.tsx", () => {

  describe("<CSSTransition>", () => {
    let getWrapper: (props?: CSSTransitionProps) => ShallowWrapper<CSSTransitionProps, {}>;

    before(() => {
      getWrapper = (props?) => shallow(<CSSTransition {...props}>dummy</CSSTransition>);
    });

    describe("workaround", () => {
      it("should render workaround before children", () => {
        assert.strictEqual(getWrapper().childAt(0).key(), "workaround");
        assert.strictEqual(getWrapper().childAt(1).text(), "dummy");
      });

      describe("transition default -> active -> default", () => {
        let wrapper: ShallowWrapper<CSSTransitionProps, {}>;

        before(() => {
          wrapper = getWrapper({
            active: false,
            activeStyle: { width: 100 },
            enterStyle: { width: transit(100, 50) },
            leaveStyle: { width: transit(50, 50) },
            defaultStyle: { width: 50 },
          });
        });

        it("should start with default style", () => {
          const style = wrapper.childAt(0).props().style;
          assert.deepEqual(style, { transform: "scale(0.99)" });
        });

        describe("when transition to active was triggered", () => {
          before(() => {
            wrapper.setProps({ active: true });
          });

          it("should begin transition", () => {
            const style = wrapper.childAt(0).props().style;
            assert.deepEqual(style, { transform: "scale(1.0)", transition: "transform 1ms linear 0ms" });
          });

          describe("when transition ends", () => {
            before(() => {
              wrapper.simulate("transitionEnd", { propertyName: "width" });
              wrapper.childAt(0).simulate("transitionEnd", { propertyName: "transform" });
            });

            it("should become active", () => {
              const style = wrapper.childAt(0).props().style;
              assert.deepEqual(style, { transform: "scale(1.0)" });
            });
          });
        });

        describe("when transition to default was triggered", () => {
          before(() => {
            wrapper.setProps({ active: false });
          });

          it("should begin transition", () => {
            const style = wrapper.childAt(0).props().style;
            assert.deepEqual(style, { transform: "scale(0.99)", transition: "transform 1ms linear 0ms" });
          });

          describe("when transition ends", () => {
            before(() => {
              wrapper.simulate("transitionEnd", { propertyName: "width" });
              wrapper.childAt(0).simulate("transitionEnd", { propertyName: "transform" });
            });

            it("should become active", () => {
              const style = wrapper.childAt(0).props().style;
              assert.deepEqual(style, { transform: "scale(0.99)" });
            });
          });
        });
      });
    });
  });
});
