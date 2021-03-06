import * as React from "react";
import { assert } from "chai";
import { ShallowWrapper, shallow } from "enzyme";
import { SinonSpy, spy } from "sinon";
import { assemble } from "reassemble";

import { withTransitionState } from "./withTransitionState";
import { StateID, ActionID, Reducer, TransitionState } from "../reducer";
import { Component } from "../../test/component";
import { pick } from "../utils/pick";
import runInFrame from "../utils/runInFrame";

const createReducer = (map: { [no: number]: { state: TransitionState, pending?: ActionID, completed?: boolean } }) =>
  (id: StateID) => map[id];

const pickTransitionState = (state: any) => pick(state, "style", "className", "inTransition", "id");

describe("withTransitionState.tsx", () => {
  let getWrapper: (props?: any, reducer?: Reducer) =>
    ShallowWrapper<any, any>;

  before(() => {
    getWrapper = (props?: any, reducer: any = () => ({ state: {} })) => {
      const Subject = assemble<any, any>(withTransitionState(reducer))(Component);
      return shallow(<Subject {...props} />);
    };
  });

  describe("dispatch", () => {
    let wrapper: ShallowWrapper<any, any>;

    describe("constructor", () => {
      const state: TransitionState = { id: 1, style: {} };
      let reducer: SinonSpy;
      before(() => {
        reducer = spy(() => ({ state }));
        wrapper = getWrapper({ children: <span /> }, reducer);
      });
      it("should dispatch New", () => {
        assert.isTrue(reducer.calledWith(StateID.EntryPoint, { kind: ActionID.New, props: {} }));
      });
      it("should return transitionState", () => {
        assert.deepEqual(wrapper.props().transitionState, pickTransitionState(state));
      });
    });

    describe("componentDidMount", () => {
      const initialState = { id: 1, style: {} };
      const state = { id: 2, style: { top: 0 }, className: "class" };
      let reducer: SinonSpy;
      before(() => {
        reducer = spy(createReducer({ 0: { state: initialState }, 1: { state } }));
        wrapper = getWrapper({ transitionAppear: true, active: true, children: <span /> }, reducer);
        reducer.reset();
        (wrapper.instance() as any).componentDidMount();
      });

      it("should dispatch ActionID.Mount", () => {
        assert.isTrue(reducer.calledWith(initialState.id, {
          kind: ActionID.Mount,
          props: { active: true, transitionAppear: true },
        }));
      });

      it("should return transitionState", () => {
        assert.deepEqual(wrapper.props().transitionState, pickTransitionState(state));
      });
    });

    describe("componentWillReceiveProps", () => {
      const initialState = { id: 1, style: {} };
      const state = { id: 2, style: { top: 0 }, className: "foo" };
      let reducer: SinonSpy;
      before(() => {
        reducer = spy(createReducer({ 0: { state: initialState }, 1: { state } }));
        wrapper = getWrapper({ children: <span /> }, reducer);
        reducer.reset();
        wrapper.setProps({ active: true });
      });

      it("should dispatch ActionID.TransitionTrigger", () => {
        assert.isTrue(reducer.calledWith(initialState.id, {
          kind: ActionID.TransitionTrigger,
          props: { active: true },
        }));
      });

      it("should return transitionState", () => {
        assert.deepEqual(wrapper.props().transitionState, pickTransitionState(state));
      });
    });

    describe("onTransitionBegin", () => {
      const initialState = { id: 1, style: {} };
      const state = { id: 2, style: { top: 0 }, className: "foo" };
      let reducer: SinonSpy;
      before(() => {
        reducer = spy(createReducer({ 0: { state: initialState }, 1: { state } }));
        wrapper = getWrapper({ children: <span /> }, reducer);
        reducer.reset();
        wrapper.simulate("transitionBegin");
      });

      it("should dispatch ActionID.TransitionStart", () => {
        assert.isTrue(reducer.calledWith(initialState.id, { kind: ActionID.TransitionStart, props: {} }));
      });

      it("should return transitionState", () => {
        assert.deepEqual(wrapper.props().transitionState, pickTransitionState(state));
      });
    });

    describe("onTransitionComplete", () => {
      const initialState = { id: 1, style: {} };
      const state = { id: 2, style: { top: 0 }, className: "foo" };
      let reducer: SinonSpy;
      before(() => {
        reducer = spy(createReducer({ 0: { state: initialState }, 1: { state } }));
        wrapper = getWrapper({ children: <span /> }, reducer);
        reducer.reset();
        wrapper.simulate("transitionComplete");
      });

      it("should dispatch ActionID.TransitionComplete", () => {
        assert.isTrue(reducer.calledWith(initialState.id, { kind: ActionID.TransitionComplete, props: {} }));
      });

      it("should return transitionState", () => {
        assert.deepEqual(wrapper.props().transitionState, pickTransitionState(state));
      });
    });

    describe("timeout", () => {
      const initialState = { id: 1, style: {} };
      const state = { id: 2, style: { top: 0 }, className: "foo" };
      let reducer: SinonSpy;
      before(() => {
        reducer = spy(createReducer({ 0: { state: initialState }, 1: { state } }));
        wrapper = getWrapper({ children: <span /> }, reducer);
        reducer.reset();
        wrapper.props().timeout();
      });

      it("should dispatch ActionID.Timeout", () => {
        assert.isTrue(reducer.calledWith(initialState.id, { kind: ActionID.Timeout, props: {} }));
      });

      it("should return transitionState", () => {
        assert.deepEqual(wrapper.props().transitionState, pickTransitionState(state));
      });
    });

    describe("pending action", () => {
      const initialState = { id: 1, style: {} };
      const pendingState = { id: 2, style: { top: 0 }, className: "foo" };
      const pending = ActionID.TransitionStart;
      const state = { id: 2, style: { top: 2 }, className: "bar" };
      let reducer: SinonSpy;
      before(() => {
        reducer = spy(createReducer({ 0: { state: initialState }, 1: { state: pendingState, pending }, 2: { state } }));
        wrapper = getWrapper({ children: <span /> }, reducer);
        reducer.reset();
        wrapper.setProps({ active: true });
      });

      it("should dispatch ActionID.TransitionTrigger", () => {
        assert.isTrue(reducer.calledWith(initialState.id, {
          kind: ActionID.TransitionTrigger,
          props: { active: true },
        }));
        reducer.reset();
      });

      it("should return intermediate transitionState", () => {
        assert.deepEqual(wrapper.props().transitionState, pickTransitionState(pendingState));
      });

      it("should dispatch ActionID.TransitionStart after update in 2nd frame", (done) => {
        (wrapper.instance() as any).componentDidUpdate();
        runInFrame(1, () => {
          assert.isTrue(reducer.calledWith(pendingState.id, {
            kind: ActionID.TransitionStart,
            props: { active: true },
          }));
          done();
        });
      });

      it("should return transitionState", () => {
        assert.deepEqual(wrapper.props().transitionState, pickTransitionState(state));
      });
    });

    describe("interrupt pending action when state changed", () => {
      const initialState = { id: 1, style: {} };
      const pendingState = { id: 2, style: { top: 0 }, className: "foo" };
      const pending = ActionID.TransitionStart;
      const state = { id: 3, style: { top: 2 }, className: "bar" };
      let reducer: SinonSpy;
      before(() => {
        reducer = spy(createReducer({ 0: { state: initialState }, 1: { state: pendingState, pending }, 2: { state } }));
        wrapper = getWrapper({ children: <span /> }, reducer);
        reducer.reset();
        wrapper.setProps({ active: true });
        wrapper.setProps({ active: false });
        reducer.reset();
      });

      it("should return final transitionState", () => {
        assert.deepEqual(wrapper.props().transitionState, pickTransitionState(state));
      });

      it("should not dispatch any further actions", (done) => {
        runInFrame(1, () => {
          assert.isFalse(reducer.called);
          done();
        });
      });
    });

    describe("interrupt pending action on unmount", () => {
      const initialState = { id: 1, style: {} };
      const pendingState = { id: 2, style: {} };
      const pending = ActionID.TransitionStart;
      let reducer: SinonSpy;
      before(() => {
        reducer = spy(createReducer({ 0: { state: initialState }, 1: { state: pendingState, pending } }));
        wrapper = getWrapper({ children: <span /> }, reducer);
        reducer.reset();
        wrapper.setProps({ active: true });
        wrapper.unmount();
      });

      it("should have changed state once", () => {
        assert.isTrue(reducer.calledOnce);
        reducer.reset();
      });

      it("should dispatch any furthor actions", (done) => {
        runInFrame(1, () => {
          assert.isFalse(reducer.called);
          done();
        });
      });
    });

    describe("state transition marked as completed", () => {
      const initialState = { id: 1, style: {} };
      const state = { id: 3, style: { top: 2 } };
      let onTransitionComplete: SinonSpy;
      let reducer: SinonSpy;
      before(() => {
        onTransitionComplete = spy();
        reducer = spy(createReducer({ 0: { state: initialState }, 1: { state, completed: true } }));
        wrapper = getWrapper({ children: <span />, onTransitionComplete }, reducer);
        wrapper.setProps({ active: true });
      });

      it("should call onTransitionComplete", () => {
        assert.isTrue(onTransitionComplete.calledOnce);
      });
    });
  });
});
