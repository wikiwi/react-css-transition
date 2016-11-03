/**
 * @license
 * Copyright (C) 2016 Chi Vinh Le and contributors.
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import * as React from "react";

import { assert } from "chai";
import { ShallowWrapper, shallow } from "enzyme";
import { SinonSpy, spy } from "sinon";

import { transit } from "./transit";
import { TransitionObserver, TransitionObserverProps } from "./transitionobserver";

const isWorkaround = (wrapper: ShallowWrapper<any, {}>) => wrapper.key() === "workaround";
const isChild = (wrapper: ShallowWrapper<any, {}>) => wrapper.key() === "child";

describe("transitionobserver.tsx", () => {

  describe("<TransitionObserver>", () => {
    let getWrapper: (props?: TransitionObserverProps) => ShallowWrapper<TransitionObserverProps, {}>;

    before(() => {
      getWrapper = (props?) => shallow(
        <TransitionObserver {...props}>
          <span key="child">dummy</span>
        </TransitionObserver>
      );
    });

    it("should pass down unknown props", () => {
      const { id } = getWrapper({ style: {}, id: "abc" }).findWhere(isChild).props();
      assert.strictEqual(id, "abc");
    });

    describe("child", () => {
      let onTransitionComplete: SinonSpy;
      let wrapper: ShallowWrapper<TransitionObserverProps, {}>;

      before(() => {
        onTransitionComplete = spy();
        wrapper = getWrapper({
          style: { width: "20px", height: "10px" },
          onTransitionComplete,
        });
      });

      it("should have style", () => {
        const style = wrapper.findWhere(isChild).props().style;
        assert.deepEqual(style, { width: "20px", height: "10px" });
      });

      describe("during a transition", () => {
        before(() => {
          wrapper.setProps({
            style: {
              width: transit("50px", { duration: 50 }),
              height: transit("20px", { duration: 30 }),
            },
          });
        });

        it("should perform transition", () => {
          const style = wrapper.findWhere(isChild).props().style;
          assert.deepEqual(style, {
            width: "50px",
            height: "20px",
            transition: "width 50ms ease 0ms, height 30ms ease 0ms",
          });
        });

        describe("when intermediate transition ends", () => {
          before(() => {
            wrapper.findWhere(isChild).simulate("transitionEnd", { propertyName: "height" });
          });

          it("should ignore", () => {
            assert.isFalse(onTransitionComplete.called);
          });
        });

        describe("when transition from another origin ends", () => {
          before(() => {
            wrapper.findWhere(isChild).simulate("transitionEnd", {
              propertyName: "width",
              target: {},
              currentTarget: {},
            });
          });

          it("should ignore", () => {
            assert.isFalse(onTransitionComplete.called);
          });
        });

        describe("when transition ends", () => {
          before(() => {
            wrapper.findWhere(isChild).simulate("transitionEnd", { propertyName: "width" });
          });
          it("should call onTransitionComplete", () => {
            assert.isTrue(onTransitionComplete.calledOnce);
          });

          /* TODO:
          it("should ignore another transitionend", () => {
            wrapper.findWhere(isChild).simulate("transitionEnd", { propertyName: "width" });
            assert.isTrue(onTransitionComplete.calledOnce);
          });
         */
        });
      });
    });

    describe("workaround", () => {
      let onTransitionBegin: SinonSpy;
      let wrapper: ShallowWrapper<TransitionObserverProps, {}>;
      before(() => {
        onTransitionBegin = spy();
        wrapper = getWrapper({
          style: { width: "20px", height: "10px" },
          onTransitionBegin,
        });
      });

      it("should render workaround before child", () => {
        assert.strictEqual(getWrapper().childAt(0).key(), "workaround");
        assert.strictEqual(getWrapper().childAt(1).text(), "dummy");
      });

      it("should have default style", () => {
        const style = wrapper.findWhere(isWorkaround).props().style;
        assert.deepEqual(style, { transform: "scale(0.99)" });
      });

      describe("during a transition", () => {
        before(() => {
          wrapper.setProps({
            style: {
              width: transit("50px", { duration: 50, delay: 40 }),
              height: transit("20px", { duration: 30, delay: 30 }),
            },
          });
        });

        it("should perform a second transition", () => {
          const style = wrapper.findWhere(isWorkaround).props().style;
          assert.deepEqual(style, { transform: "scale(1.0)", transition: "transform 1ms linear 30ms" });
        });

        describe("when second transition ends", () => {
          before(() => {
            wrapper.findWhere(isWorkaround).simulate("transitionEnd", { propertyName: "transform" });
          });

          it("should call onTransitionBegin", () => {
            assert.isTrue(onTransitionBegin.calledOnce);
          });
        });
      });
    });
  });
});
