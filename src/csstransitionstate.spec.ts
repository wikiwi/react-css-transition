/**
 * @license
 * Copyright (C) 2016-present Chi Vinh Le and contributors.
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import { assert } from "chai";
import { spy } from "sinon";

import { CSSTransitionProps } from "./csstransition";
import { transit } from "./transit";
import {
  reduce, StateID, StateIDList, ActionID, CSSTransitionState,
  initDefaultState, initActiveState,
  defaultState, activeState,
  transitToActivePendingState, transitToDefaultPendingState,
  transitToActiveTriggeredState, transitToDefaultTriggeredState,
  transitToActiveStartedState, transitToDefaultStartedState,
} from "./csstransitionstate";

describe("csstransitionstate.ts", () => {
  describe("states", () => {
    describe(
      "initDefaultState",
      testState(StateID.DefaultInit, "defaultStyle", (props) => initDefaultState(props)),
    );
    describe(
      "initActiveState",
      testState(StateID.ActiveInit, "activeStyle", (props) => initActiveState(props)),
    );
    describe(
      "defaultState",
      testState(StateID.Default, "defaultStyle", (props) => defaultState(props)),
    );
    describe(
      "activeState",
      testState(StateID.Active, "activeStyle", (props) => activeState(props)),
    );
    describe(
      "transitToActivePendingState",
      testState(StateID.TransitToActivePending, "defaultStyle", (props) => transitToActivePendingState(props)),
    );
    describe(
      "transitToDefaultPendingState",
      testState(StateID.TransitToDefaultPending, "activeStyle", (props) => transitToDefaultPendingState(props)),
    );
    describe(
      "transitToActiveTriggeredState",
      testState(StateID.TransitToActiveTriggered, "enterStyle", (props) => transitToActiveTriggeredState(props)),
    );
    describe(
      "transitToDefaultTriggeredState",
      testState(StateID.TransitToDefaultTriggered, "leaveStyle", (props) => transitToDefaultTriggeredState(props)),
    );
    describe(
      "transitToActiveStartedState",
      testState(StateID.TransitToActiveStarted, "enterStyle", (props) => transitToActiveStartedState(props)),
    );
    describe(
      "transitToDefaultStartedState",
      testState(StateID.TransitToDefaultStarted, "leaveStyle", (props) => transitToDefaultStartedState(props)),
    );
  });
  describe("actions", () => {
    describe("ActionInit", () => {
      const actionID = ActionID.Init;

      it("should fail when state is already initialized", () => {
        assert.throw(() => reduce({}, actionID, {}));
      });
      it("should become DefaultInit", () => {
        const {state, pending} = reduce(undefined, actionID, {});
        assert.isUndefined(pending);
        assert.strictEqual(state.id, StateID.DefaultInit);
      });
      it("should become ActiveInit", () => {
        const {state, pending} = reduce(undefined, actionID, { active: true });
        assert.isUndefined(pending);
        assert.strictEqual(state.id, StateID.ActiveInit);
      });
    });
    describe("TransitionInit", () => {
      const actionID = ActionID.TransitionInit;

      it("should fail on invalid state transitions", () => {
        StateIDList
          .filter((id) => [StateID.Active, StateID.ActiveInit, StateID.Default, StateID.DefaultInit].indexOf(id) < 0)
          .forEach((id) => assert.throw(() => reduce({ id }, actionID, {})));
      });
      it("should transit to active pending transition state", () => {
        [StateID.Default, StateID.DefaultInit].forEach((id) => {
          const {state, pending} = reduce({ id }, actionID, {});
          assert.strictEqual(pending, ActionID.TransitionTrigger);
          assert.strictEqual(state.id, StateID.TransitToActivePending);
        });
      });
      it("should transit to default pending transition state", () => {
        [StateID.Active, StateID.ActiveInit].forEach((id) => {
          const {state, pending} = reduce({ id }, actionID, {});
          assert.strictEqual(pending, ActionID.TransitionTrigger);
          assert.strictEqual(state.id, StateID.TransitToDefaultPending);
        });
      });
    });
    describe("TransitionStart", () => {
      const actionID = ActionID.TransitionStart;

      it("should not fail on invalid state transitions", () => {
        StateIDList
          .filter((id) => [StateID.TransitToActiveTriggered, StateID.TransitToDefaultTriggered].indexOf(id) < 0)
          .forEach((id) => assert.isNull(reduce({ id }, actionID, {})));
      });
      it("should transit to active started transition state", () => {
        const {state, pending} = reduce({ id: StateID.TransitToActiveTriggered }, actionID, {});
        assert.isUndefined(pending);
        assert.strictEqual(state.id, StateID.TransitToActiveStarted);
      });
      it("should transit to active started transition state", () => {
        const {state, pending} = reduce({ id: StateID.TransitToDefaultTriggered }, actionID, {});
        assert.isUndefined(pending);
        assert.strictEqual(state.id, StateID.TransitToDefaultStarted);
      });
    });
    describe("TransitionComplete", () => {
      const actionID = ActionID.TransitionComplete;
      const validOrigin = [
        StateID.TransitToActiveTriggered, StateID.TransitToActiveStarted,
        StateID.TransitToDefaultTriggered, StateID.TransitToDefaultStarted,
      ];

      it("should fail on invalid state transitions", () => {
        StateIDList
          .filter((id) => validOrigin.indexOf(id) < 0)
          .forEach((id) => assert.throw(() => reduce({ id }, actionID, {})));
      });
      it("should transit to active state", () => {
        [StateID.TransitToActiveTriggered, StateID.TransitToActiveStarted].forEach((id) => {
          const {state, pending} = reduce({ id }, actionID, {});
          assert.isUndefined(pending);
          assert.strictEqual(state.id, StateID.Active);
        });
      });
      it("should transit to default state", () => {
        [StateID.TransitToDefaultTriggered, StateID.TransitToDefaultStarted].forEach((id) => {
          const {state, pending} = reduce({ id }, actionID, {});
          assert.isUndefined(pending);
          assert.strictEqual(state.id, StateID.Default);
        });
      });
      it("should call onTransitionComplete", () => {
        validOrigin.forEach((id) => {
          const props = { onTransitionComplete: spy() };
          reduce({ id }, actionID, props);
          assert.isTrue(props.onTransitionComplete.calledOnce);
        });
      });
    });
    describe("TransitionTrigger", () => {
      const actionID = ActionID.TransitionTrigger;

      it("should transit to active pending transition state", () => {
        [StateID.Default, StateID.DefaultInit].forEach((id) => {
          const {state, pending} = reduce({ id }, actionID, {});
          assert.strictEqual(pending, ActionID.TransitionTrigger);
          assert.strictEqual(state.id, StateID.TransitToActivePending);
        });
      });
      it("should transit to default pending transition state", () => {
        [StateID.Active, StateID.ActiveInit].forEach((id) => {
          const {state, pending} = reduce({ id }, actionID, {});
          assert.strictEqual(pending, ActionID.TransitionTrigger);
          assert.strictEqual(state.id, StateID.TransitToDefaultPending);
        });
      });
      it("should transit to active triggered state", () => {
        const id = StateID.TransitToActivePending;
        const {state, pending} = reduce({ id }, actionID, { active: true });
        assert.isUndefined(pending);
        assert.strictEqual(state.id, StateID.TransitToActiveTriggered);
      });
      it("should transit to default triggered transition state", () => {
        const id = StateID.TransitToDefaultPending;
        const {state, pending} = reduce({ id }, actionID, { active: false });
        assert.isUndefined(pending);
        assert.strictEqual(state.id, StateID.TransitToDefaultTriggered);
      });
      it("should interrupt pending and triggered active transition", () => {
        [StateID.TransitToActivePending, StateID.TransitToActiveTriggered].forEach((id) => {
          const props = { active: false, onTransitionComplete: spy() };
          const {state, pending} = reduce({ id }, actionID, props);
          assert.isUndefined(pending);
          assert.strictEqual(state.id, StateID.Default);
          assert.isTrue(props.onTransitionComplete.calledOnce);
        });
      });
      it("should interrupt pending and triggered default transition", () => {
        [StateID.TransitToDefaultPending, StateID.TransitToDefaultTriggered].forEach((id) => {
          const props = { active: true, onTransitionComplete: spy() };
          const {state, pending} = reduce({ id }, actionID, props);
          assert.isUndefined(pending);
          assert.strictEqual(state.id, StateID.Active);
          assert.isTrue(props.onTransitionComplete.calledOnce);
        });
      });
      it("should interrupt started active transition", () => {
        const id = StateID.TransitToActiveStarted;
        const {state, pending} = reduce({ id }, actionID, { active: false });
        assert.isUndefined(pending);
        assert.strictEqual(state.id, StateID.TransitToDefaultTriggered);
      });
      it("should interrupt started default transition", () => {
        const id = StateID.TransitToDefaultStarted;
        const {state, pending} = reduce({ id }, actionID, { active: true });
        assert.isUndefined(pending);
        assert.strictEqual(state.id, StateID.TransitToActiveTriggered);
      });
    });
  });
});

function testState(id: StateID, styleName: string, state: (props: CSSTransitionProps) => CSSTransitionState) {
  return () => {
    it("should return id", () => {
      assert.strictEqual(state({}).id, id);
    });
    if (["enterStyle", "leaveStyle"].indexOf(styleName) < 0) {
      it("should return style", () => {
        const style = { top: "0px" };
        assert.deepEqual(state({ [styleName]: style }).style, style);
      });
      it("should return combined style", () => {
        const style = { top: "0px" };
        const baseStyle = { left: "0px" };
        assert.deepEqual(state({ style: baseStyle, [styleName]: style }).style, { ...baseStyle, ...style });
      });
    } else {
      it("should return transition style", () => {
        const style = { top: transit("5px", 120) };
        const styleProcessed = { top: "5px", transition: "top 120ms ease 0ms" };
        assert.deepEqual(state({ [styleName]: style }).style, styleProcessed);
      });

      it("should return combined style", () => {
        const style = { top: transit("5px", 120) };
        const styleProcessed = { top: "5px", transition: "top 120ms ease 0ms" };
        const baseStyle = { left: "0px" };
        assert.deepEqual(state({ style: baseStyle, [styleName]: style }).style, { ...baseStyle, ...styleProcessed });
      });

      it("should return transition style with extra delay", () => {
        const style = { top: transit("5px", 120, "ease", 10) };
        const styleProcessed = { top: "5px", transition: "top 120ms ease 30ms" };
        assert.deepEqual(state({ [styleName]: style, transitionDelay: 20 }).style, styleProcessed);
      });
    }
  };
};
