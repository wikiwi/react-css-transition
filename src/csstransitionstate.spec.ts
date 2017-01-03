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
  getAppearStyle, reduce, StateID, StateIDList, ActionID, CSSTransitionState,
  defaultInitState, activeInitState, appearInitState,
  defaultState, activeState,
  appearPendingState, enterPendingState, leavePendingState,
  appearTriggeredState, enterTriggeredState, leaveTriggeredState,
  appearStartedState, enterStartedState, leaveStartedState,
} from "./csstransitionstate";

describe("csstransitionstate.ts", () => {
  describe("getAppearStyle()", () => {
    it("should return appearStyle", () => {
      const props: any = { appearStyle: {} };
      assert.strictEqual(getAppearStyle(props), props.appearStyle);
    });
    it("should fallback to enterStyle", () => {
      const props: any = { enterStyle: {} };
      assert.strictEqual(getAppearStyle(props), props.enterStyle);
    });
  });
  describe("states", () => {
    describe(
      "defaultInitState",
      testState(StateID.DefaultInit, "defaultStyle", (props) => defaultInitState(props)),
    );
    describe(
      "activeInitState",
      testState(StateID.ActiveInit, "activeStyle", (props) => activeInitState(props)),
    );
    describe(
      "appearInitState",
      testState(StateID.AppearInit, "appearStyle", (props) => appearInitState(props)),
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
      "appearPendingState",
      testState(StateID.AppearPending, "defaultStyle", (props) => appearPendingState(props)),
    );
    describe(
      "enterPendingState",
      testState(StateID.EnterPending, "defaultStyle", (props) => enterPendingState(props)),
    );
    describe(
      "leavePendingState",
      testState(StateID.LeavePending, "activeStyle", (props) => leavePendingState(props)),
    );
    describe(
      "appearTriggeredState",
      testState(StateID.AppearTriggered, "appearStyle", (props) => appearTriggeredState(props)),
    );
    describe(
      "enterTriggeredState",
      testState(StateID.EnterTriggered, "enterStyle", (props) => enterTriggeredState(props)),
    );
    describe(
      "leaveTriggeredState",
      testState(StateID.LeaveTriggered, "leaveStyle", (props) => leaveTriggeredState(props)),
    );
    describe(
      "appearStartedState",
      testState(StateID.AppearStarted, "appearStyle", (props) => appearStartedState(props)),
    );
    describe(
      "enterStartedState",
      testState(StateID.EnterStarted, "enterStyle", (props) => enterStartedState(props)),
    );
    describe(
      "leaveStartedState",
      testState(StateID.LeaveStarted, "leaveStyle", (props) => leaveStartedState(props)),
    );
  });
  describe("actions", () => {
    describe("ActionInit", () => {
      const actionID = ActionID.Init;

      it("should fail when state is already initialized", () => {
        assert.throw(() => reduce({}, actionID, {}));
      });
      it("should become DefaultInit", () => {
        const {state, pending} = reduce(undefined, actionID, { active: false });
        assert.isUndefined(pending);
        assert.strictEqual(state.id, StateID.DefaultInit);
      });
      it("should become ActiveInit", () => {
        const {state, pending} = reduce(undefined, actionID, { active: true });
        assert.isUndefined(pending);
        assert.strictEqual(state.id, StateID.ActiveInit);
      });
      it("should become AppearInit", () => {
        const {state, pending} = reduce(undefined, actionID, { active: true, transitionAppear: true });
        assert.isUndefined(pending);
        assert.strictEqual(state.id, StateID.AppearInit);
      });
    });
    describe("TransitionInit", () => {
      const actionID = ActionID.TransitionInit;
      const validOrigin = [
        StateID.Active, StateID.ActiveInit, StateID.Default, StateID.DefaultInit, StateID.AppearInit,
      ];

      it("should fail on invalid state transitions", () => {
        StateIDList
          .filter((id) => validOrigin.indexOf(id) < 0)
          .forEach((id) => assert.throw(() => reduce({ id }, actionID, {})));
      });
      it("should transit to enter pending state", () => {
        [StateID.Default, StateID.DefaultInit].forEach((id) => {
          const {state, pending} = reduce({ id }, actionID, { active: true });
          assert.strictEqual(pending, ActionID.TransitionTrigger);
          assert.strictEqual(state.id, StateID.EnterPending);
        });
      });
      it("should transit to leave pending state", () => {
        [StateID.Active, StateID.ActiveInit].forEach((id) => {
          const {state, pending} = reduce({ id }, actionID, { active: false });
          assert.strictEqual(pending, ActionID.TransitionTrigger);
          assert.strictEqual(state.id, StateID.LeavePending);
        });
      });
      it("should transit to appear pending state", () => {
        const id = StateID.AppearInit;
        const {state, pending} = reduce({ id }, actionID, { active: true });
        assert.strictEqual(pending, ActionID.TransitionTrigger);
        assert.strictEqual(state.id, StateID.AppearPending);
      });
    });
    describe("TransitionStart", () => {
      const actionID = ActionID.TransitionStart;

      it("should not fail on invalid state transitions", () => {
        StateIDList
          .filter((id) => [StateID.EnterTriggered, StateID.LeaveTriggered, StateID.AppearTriggered].indexOf(id) < 0)
          .forEach((id) => assert.isNull(reduce({ id }, actionID, {})));
      });
      it("should transit to enter started state", () => {
        const {state, pending} = reduce({ id: StateID.EnterTriggered }, actionID, { active: true });
        assert.isUndefined(pending);
        assert.strictEqual(state.id, StateID.EnterStarted);
      });
      it("should transit to leave started state", () => {
        const {state, pending} = reduce({ id: StateID.LeaveTriggered }, actionID, { active: false });
        assert.isUndefined(pending);
        assert.strictEqual(state.id, StateID.LeaveStarted);
      });
      it("should transit to appear started state", () => {
        const {state, pending} =
          reduce({ id: StateID.AppearTriggered }, actionID, { active: true });
        assert.isUndefined(pending);
        assert.strictEqual(state.id, StateID.AppearStarted);
      });
    });
    describe("TransitionComplete", () => {
      const actionID = ActionID.TransitionComplete;
      const validOrigin = [
        StateID.AppearTriggered, StateID.AppearStarted,
        StateID.EnterTriggered, StateID.EnterStarted,
        StateID.LeaveTriggered, StateID.LeaveStarted,
      ];

      it("should fail on invalid state transitions", () => {
        StateIDList
          .filter((id) => validOrigin.indexOf(id) < 0)
          .forEach((id) => assert.throw(() => reduce({ id }, actionID, {})));
      });
      it("should transit to active state", () => {
        const origin = [
          StateID.AppearTriggered, StateID.AppearStarted,
          StateID.EnterTriggered, StateID.EnterStarted,
        ];
        origin.forEach((id) => {
          const {state, pending} = reduce({ id }, actionID, { active: true });
          assert.isUndefined(pending);
          assert.strictEqual(state.id, StateID.Active);
        });
      });
      it("should transit to default state", () => {
        [StateID.LeaveTriggered, StateID.LeaveStarted].forEach((id) => {
          const {state, pending} = reduce({ id }, actionID, { active: false });
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

      it("should transit to enter pending state", () => {
        [StateID.Default, StateID.DefaultInit].forEach((id) => {
          const {state, pending} = reduce({ id }, actionID, { active: true });
          assert.strictEqual(pending, ActionID.TransitionTrigger);
          assert.strictEqual(state.id, StateID.EnterPending);
        });
      });
      it("should transit to leave pending state", () => {
        [StateID.Active, StateID.ActiveInit].forEach((id) => {
          const {state, pending} = reduce({ id }, actionID, { active: false });
          assert.strictEqual(pending, ActionID.TransitionTrigger);
          assert.strictEqual(state.id, StateID.LeavePending);
        });
      });
      it("should transit to appear pending state", () => {
        const id = StateID.AppearInit;
        const {state, pending} = reduce({ id }, actionID, { active: true });
        assert.strictEqual(pending, ActionID.TransitionTrigger);
        assert.strictEqual(state.id, StateID.AppearPending);
      });
      it("should transit to enter triggered state", () => {
        const id = StateID.EnterPending;
        const {state, pending} = reduce({ id }, actionID, { active: true });
        assert.isUndefined(pending);
        assert.strictEqual(state.id, StateID.EnterTriggered);
      });
      it("should transit to leave triggered state", () => {
        const id = StateID.LeavePending;
        const {state, pending} = reduce({ id }, actionID, { active: false });
        assert.isUndefined(pending);
        assert.strictEqual(state.id, StateID.LeaveTriggered);
      });
      it("should transit to appear triggered state", () => {
        const id = StateID.AppearPending;
        const {state, pending} = reduce({ id }, actionID, { active: true });
        assert.isUndefined(pending);
        assert.strictEqual(state.id, StateID.AppearTriggered);
      });
      it("should interrupt enter pending and triggered", () => {
        [StateID.EnterPending, StateID.EnterTriggered].forEach((id) => {
          const props = { active: false, onTransitionComplete: spy() };
          const {state, pending} = reduce({ id }, actionID, props);
          assert.isUndefined(pending);
          assert.strictEqual(state.id, StateID.Default);
          assert.isTrue(props.onTransitionComplete.calledOnce);
        });
      });
      it("should interrupt leave pending and triggered", () => {
        [StateID.LeavePending, StateID.LeaveTriggered].forEach((id) => {
          const props = { active: true, onTransitionComplete: spy() };
          const {state, pending} = reduce({ id }, actionID, props);
          assert.isUndefined(pending);
          assert.strictEqual(state.id, StateID.Active);
          assert.isTrue(props.onTransitionComplete.calledOnce);
        });
      });
      it("should interrupt appear pending and triggered", () => {
        [StateID.AppearPending, StateID.AppearTriggered].forEach((id) => {
          const props = { active: false, onTransitionComplete: spy() };
          const {state, pending} = reduce({ id }, actionID, props);
          assert.isUndefined(pending);
          assert.strictEqual(state.id, StateID.Default);
          assert.isTrue(props.onTransitionComplete.calledOnce);
        });
      });
      it("should interrupt enter started", () => {
        const id = StateID.EnterStarted;
        const {state, pending} = reduce({ id }, actionID, { active: false });
        assert.isUndefined(pending);
        assert.strictEqual(state.id, StateID.LeaveTriggered);
      });
      it("should interrupt leave started", () => {
        const id = StateID.LeaveStarted;
        const {state, pending} = reduce({ id }, actionID, { active: true });
        assert.isUndefined(pending);
        assert.strictEqual(state.id, StateID.EnterTriggered);
      });
      it("should interrupt appear started", () => {
        const id = StateID.AppearStarted;
        const {state, pending} = reduce({ id }, actionID, { active: true });
        assert.isUndefined(pending);
        assert.strictEqual(state.id, StateID.LeaveTriggered);
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
