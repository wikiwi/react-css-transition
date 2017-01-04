/**
 * @license
 * Copyright (C) 2016-present Chi Vinh Le and contributors.
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import * as React from "react";

import { assert } from "chai";
import { ShallowWrapper, shallow } from "enzyme";
import { SinonSpy, spy } from "sinon";

import { createCSSTransition, CSSTransitionProps } from "./csstransition";
import { reduce, ActionID, CSSTransitionState } from "./csstransitionstate";
import { runInFrame } from "./utils";

describe("csstransition.tsx", () => {
  describe("<CSSTransition>", () => {
    let getWrapper: (props?: CSSTransitionProps, reducer?: typeof reduce) =>
      ShallowWrapper<CSSTransitionProps, CSSTransitionState>;

    before(() => {
      getWrapper = (props?, reducer: any = () => ({ state: {} })) => {
        const CSSTransitionGroup = createCSSTransition(reducer);
        return shallow(<CSSTransitionGroup {...props} />);
      };
    });

    describe("action dispatch", () => {
      let wrapper: ShallowWrapper<CSSTransitionProps, CSSTransitionState>;

      describe("constructor", () => {
        const state = { id: 1, style: {} };
        let reducer: SinonSpy;
        before(() => {
          reducer = spy(() => ({ state }));
          wrapper = getWrapper({ children: <span /> }, reducer);
        });

        it("should dispatch Init", () => {
          assert.isTrue(reducer.calledOnce);
          assert.isTrue(reducer.calledWith(undefined, ActionID.Init));
        });

        it("should set state", () => {
          assert.deepEqual(wrapper.state(), state);
        });
      });

      describe("componentDidMount", () => {
        const initialState = { id: 0, style: {} };
        const state = { id: 1, style: {} };
        let reducer: SinonSpy;
        before(() => {
          reducer = spy(createReducer({ state: initialState }, { state }));
          wrapper = getWrapper({ transitionAppear: true, active: true, children: <span /> }, reducer);
          reducer.reset();
          (wrapper.instance() as any).componentDidMount();
        });

        it("should dispatch ActionID.Mount", () => {
          assert.isTrue(reducer.calledOnce);
          assert.isTrue(reducer.calledWith(initialState, ActionID.Mount));
        });

        it("should set state", () => {
          assert.deepEqual(wrapper.state(), state);
        });
      });

      describe("componentWillReceiveProps", () => {
        const initialState = { id: 0, style: {} };
        const state = { id: 1, style: {} };
        let reducer: SinonSpy;
        before(() => {
          reducer = spy(createReducer({ state: initialState }, { state }));
          wrapper = getWrapper({ children: <span /> }, reducer);
          reducer.reset();
          wrapper.setProps({ active: true });
        });

        it("should dispatch ActionID.TransitionTrigger", () => {
          assert.isTrue(reducer.calledOnce);
          assert.isTrue(reducer.calledWith(initialState, ActionID.TransitionTrigger));
        });

        it("should set state", () => {
          assert.deepEqual(wrapper.state(), state);
        });
      });

      describe("onTransitionStart", () => {
        const initialState = { id: 0, style: {} };
        const state = { id: 1, style: {} };
        let reducer: SinonSpy;
        before(() => {
          reducer = spy(createReducer({ state: initialState }, { state }));
          wrapper = getWrapper({ children: <span /> }, reducer);
          reducer.reset();
          wrapper.find("TransitionObserver").simulate("transitionBegin");
        });

        it("should dispatch ActionID.TransitionStart", () => {
          assert.isTrue(reducer.calledOnce);
          assert.isTrue(reducer.calledWith(initialState, ActionID.TransitionStart));
        });

        it("should set state", () => {
          assert.deepEqual(wrapper.state(), state);
        });
      });

      describe("onTransitionComplete", () => {
        const initialState = { id: 0, style: {} };
        const state = { id: 1, style: {} };
        let reducer: SinonSpy;
        before(() => {
          reducer = spy(createReducer({ state: initialState }, { state }));
          wrapper = getWrapper({ children: <span /> }, reducer);
          reducer.reset();
          wrapper.find("TransitionObserver").simulate("transitionComplete");
        });

        it("should dispatch ActionID.TransitionComplete", () => {
          assert.isTrue(reducer.calledOnce);
          assert.isTrue(reducer.calledWith(initialState, ActionID.TransitionComplete));
        });

        it("should set state", () => {
          assert.deepEqual(wrapper.state(), state);
        });
      });

      describe("pending action", () => {
        const initialState = { id: 0, style: {} };
        const pendingState = { id: 1, style: {} };
        const pending = ActionID.TransitionStart;
        const state = { id: 2, style: {} };
        let reducer: SinonSpy;
        before(() => {
          reducer = spy(createReducer({ state: initialState }, { state: pendingState, pending }, { state }));
          wrapper = getWrapper({ children: <span /> }, reducer);
          reducer.reset();
          wrapper.setProps({ active: true });
        });

        it("should dispatch ActionID.TransitionTrigger", () => {
          assert.isTrue(reducer.calledOnce);
          assert.isTrue(reducer.calledWith(initialState, ActionID.TransitionTrigger));
          reducer.reset();
        });

        it("should dispatch ActionID.TransitionStart in 2nd frame", (done) => {
          runInFrame(1, () => {
            assert.isTrue(reducer.calledOnce);
            assert.isTrue(reducer.calledWith(pendingState, ActionID.TransitionStart));
            done();
          });
        });

        it("should set state", () => {
          assert.deepEqual(wrapper.state(), state);
        });
      });

      describe("interrupt pending action when state changed", () => {
        const initialState = { id: 0, style: {} };
        const pendingState = { id: 1, style: {} };
        const pending = ActionID.TransitionStart;
        const state = { id: 2, style: {} };
        let reducer: SinonSpy;
        before(() => {
          reducer = spy(createReducer({ state: initialState }, { state: pendingState, pending }, { state }));
          wrapper = getWrapper({ children: <span /> }, reducer);
          wrapper.setProps({ active: true });
          wrapper.setProps({ active: false });
        });

        it("should have changed state thrice", () => {
          assert.isTrue(reducer.calledThrice);
          reducer.reset();
        });

        it("should dispatch any furthor actions", (done) => {
          runInFrame(1, () => {
            assert.isFalse(reducer.called);
            done();
          });
        });
      });

      describe("interrupt pending action on unmount", () => {
        const initialState = { id: 0, style: {} };
        const pendingState = { id: 1, style: {} };
        const pending = ActionID.TransitionStart;
        let reducer: SinonSpy;
        before(() => {
          reducer = spy(createReducer({ state: initialState }, { state: pendingState, pending }));
          wrapper = getWrapper({ children: <span /> }, reducer);
          wrapper.setProps({ active: true });
          wrapper.unmount();
        });

        it("should have changed state twice", () => {
          assert.isTrue(reducer.calledTwice);
          reducer.reset();
        });

        it("should dispatch any furthor actions", (done) => {
          runInFrame(1, () => {
            assert.isFalse(reducer.called);
            done();
          });
        });
      });

      describe("render", () => {
        it("should pass onTransitionBegin and onTransitionComplete", () => {
          wrapper = getWrapper({ children: <span /> });
          const { onTransitionBegin, onTransitionComplete } = (wrapper.find("TransitionObserver").props() as any);
          assert.isFunction(onTransitionBegin);
          assert.isFunction(onTransitionComplete);
        });

        it("should pass style to TransitionObserver", () => {
          const state = { style: {} };
          wrapper = getWrapper({ children: <span /> });
          wrapper.setState(state);
          const { style } = (wrapper.find("TransitionObserver").props() as any);
          assert.strictEqual(style, state.style);
        });

        it("should wrap child in div per default", () => {
          wrapper = getWrapper({ children: <span /> });
          assert.isTrue(wrapper.find("span").parent().is("div"));
        });

        it("should wrap child in custom element", () => {
          wrapper = getWrapper({ component: "p", children: <span /> });
          assert.isTrue(wrapper.find("span").parent().is("p"));
        });

        it("should not wrap child", () => {
          wrapper = getWrapper({ component: null, children: <span /> });
          assert.isTrue(wrapper.find("span").parent().is("TransitionObserver"));
        });

        it("should pass down unknown props", () => {
          wrapper = getWrapper({ id: "abc", children: <span /> });
          const { id } = wrapper.find("TransitionObserver").props();
          assert.strictEqual(id, "abc");
        });
      });
    });
  });
});

function createReducer(...states: Array<{ state: CSSTransitionState, pending?: ActionID }>) {
  let index = 0;
  return () => {
    return states[index++];
  };
}
