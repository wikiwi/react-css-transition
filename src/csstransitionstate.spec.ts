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
  reduce, StateID, StateIDList, ActionID, CSSTransitionState, getState,
  getDelay, transitionNames, hasTransition,
  defaultInitState, activeInitState, appearInitState,
  defaultState, activeState,
  appearPendingState, enterPendingState, leavePendingState,
  appearTriggeredState, enterTriggeredState, leaveTriggeredState,
  appearStartedState, enterStartedState, leaveStartedState,
} from "./csstransitionstate";

describe("csstransitionstate.ts", () => {
  describe("hasTransition()", () => {
    it("should handle enter", () => {
      assert.isTrue(hasTransition("enter", { enterStyle: {} }));
      assert.isFalse(hasTransition("enter", {}));
    });
    it("should handle leave", () => {
      assert.isTrue(hasTransition("leave", { leaveStyle: {} }));
      assert.isFalse(hasTransition("leave", {}));
    });
    it("should handle appear", () => {
      assert.isTrue(hasTransition("appear", { appearStyle: {} }));
      assert.isTrue(hasTransition("appear", { enterStyle: {} }));
      assert.isFalse(hasTransition("appear", {}));
    });
  });
  describe("getDelay()", () => {
    it("should process number", () => {
      transitionNames.forEach((name) => assert.strictEqual(getDelay(name, 200), 200));
    });

    it("should process object", () => {
      transitionNames.forEach((name) => assert.strictEqual(getDelay(name, { [name]: 100 }), 100));
    });
  });
  describe("getState()", () => {
    it("should return active / default state", () => {
      ["active", "default"].forEach((name) => {
        const id = StateID.Active;
        const style = { left: "0px" };
        assert.deepEqual(
          getState(id, name, { [name + "Style"]: style }), {
            id,
            style,
          });
      });
    });
    it("should return transition state", () => {
      transitionNames.forEach((name) => {
        const id = StateID.EnterStarted;
        const style = { top: transit("5px", 120) };
        const styleProcessed = { top: "5px", transition: "top 120ms ease 0ms" };
        assert.deepEqual(
          getState(id, name, { [name + "Style"]: style }), {
            id,
            style: styleProcessed,
          });
      });
    });
    it("should return transition init state", () => {
      transitionNames.forEach((name) => {
        const id = StateID.EnterStarted;
        const style = { left: "0px" };
        assert.deepEqual(
          getState(id, name, { [name + "InitStyle"]: style, [name + "Style"]: {} }, { init: true }), {
            id,
            style,
          });
      });
    });
    it("should return transition init fallback state", () => {
      transitionNames.forEach((name) => {
        const fallbackName = name === "leave" ? "active" : "default";
        const id = StateID.EnterStarted;
        const style = { left: "0px" };
        assert.deepEqual(
          getState(id, name, { [fallbackName + "Style"]: style, [name + "Style"]: {} }, { init: true }), {
            id,
            style,
          });
      });
    });
    it("should fallback to enter for appear", () => {
      const id = StateID.AppearInit;
      const style = { left: "0px" };
      assert.deepEqual(
        getState(id, "appear", { enterStyle: style }), {
          id,
          style,
        });
    });
    it("should fallback to enterInit for appearInit", () => {
      const id = StateID.AppearInit;
      const style = { left: "0px" };
      assert.deepEqual(
        getState(id, "appear", { enterInitStyle: style }, { init: true }), {
          id,
          style,
        });
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
      testState(StateID.AppearInit, "appearInitStyle", (props) => appearInitState(props)),
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
      testState(StateID.AppearPending, "appearInitStyle", (props) => appearPendingState(props)),
    );
    describe(
      "enterPendingState",
      testState(StateID.EnterPending, "enterInitStyle", (props) => enterPendingState(props)),
    );
    describe(
      "leavePendingState",
      testState(StateID.LeavePending, "leaveInitStyle", (props) => leavePendingState(props)),
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
    describe("Init", () => {
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
    describe("Mount", () => {
      const actionID = ActionID.Mount;
      it("should become AppearPending", () => {
        const id = StateID.AppearInit;
        const {state, pending} = reduce({ id }, actionID, { appearStyle: {} });
        assert.strictEqual(pending, ActionID.TransitionTrigger);
        assert.strictEqual(state.id, StateID.AppearPending);
      });

      it("should do nothing", () => {
        assert.isNull(reduce({ id: StateID.Active }, actionID, {}));
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
          const {state, pending} = reduce({ id }, actionID, { enterStyle: {} });
          assert.strictEqual(pending, ActionID.TransitionTrigger);
          assert.strictEqual(state.id, StateID.EnterPending);
        });
      });
      it("should transit to leave pending state", () => {
        [StateID.Active, StateID.ActiveInit].forEach((id) => {
          const {state, pending} = reduce({ id }, actionID, { leaveStyle: {} });
          assert.strictEqual(pending, ActionID.TransitionTrigger);
          assert.strictEqual(state.id, StateID.LeavePending);
        });
      });
      it("should transit to appear pending state", () => {
        const id = StateID.AppearInit;
        const {state, pending} = reduce({ id }, actionID, { appearStyle: {} });
        assert.strictEqual(pending, ActionID.TransitionTrigger);
        assert.strictEqual(state.id, StateID.AppearPending);
      });
      it("should skip to active and call onTransitionComplete", () => {
        [StateID.Default, StateID.DefaultInit, StateID.AppearInit].forEach((id) => {
          const props = { onTransitionComplete: spy() };
          const {state, pending} = reduce({ id }, actionID, props);
          assert.isUndefined(pending);
          assert.strictEqual(state.id, StateID.Active);
          assert.isTrue(props.onTransitionComplete.calledOnce);
        });
      });
      it("should skip to default and call onTransitionComplete", () => {
        [StateID.Active, StateID.ActiveInit].forEach((id) => {
          const props = { onTransitionComplete: spy() };
          const {state, pending} = reduce({ id }, actionID, props);
          assert.isUndefined(pending);
          assert.strictEqual(state.id, StateID.Default);
          assert.isTrue(props.onTransitionComplete.calledOnce);
        });
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
        const {state, pending} = reduce({ id: StateID.EnterTriggered }, actionID, {});
        assert.isUndefined(pending);
        assert.strictEqual(state.id, StateID.EnterStarted);
      });
      it("should transit to leave started state", () => {
        const {state, pending} = reduce({ id: StateID.LeaveTriggered }, actionID, {});
        assert.isUndefined(pending);
        assert.strictEqual(state.id, StateID.LeaveStarted);
      });
      it("should transit to appear started state", () => {
        const {state, pending} =
          reduce({ id: StateID.AppearTriggered }, actionID, {});
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
          const {state, pending} = reduce({ id }, actionID, {});
          assert.isUndefined(pending);
          assert.strictEqual(state.id, StateID.Active);
        });
      });
      it("should transit to default state", () => {
        [StateID.LeaveTriggered, StateID.LeaveStarted].forEach((id) => {
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

      it("should transit to enter pending state", () => {
        [StateID.Default, StateID.DefaultInit].forEach((id) => {
          const {state, pending} = reduce({ id }, actionID, { enterStyle: {} });
          assert.strictEqual(pending, ActionID.TransitionTrigger);
          assert.strictEqual(state.id, StateID.EnterPending);
        });
      });
      it("should transit to leave pending state", () => {
        [StateID.Active, StateID.ActiveInit].forEach((id) => {
          const {state, pending} = reduce({ id }, actionID, { leaveStyle: {} });
          assert.strictEqual(pending, ActionID.TransitionTrigger);
          assert.strictEqual(state.id, StateID.LeavePending);
        });
      });
      it("should transit to appear pending state", () => {
        const id = StateID.AppearInit;
        const {state, pending} = reduce({ id }, actionID, { appearStyle: {} });
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
        const {state, pending} = reduce({ id }, actionID, {});
        assert.isUndefined(pending);
        assert.strictEqual(state.id, StateID.LeaveStarted);
      });
      it("should interrupt leave started", () => {
        const id = StateID.LeaveStarted;
        const {state, pending} = reduce({ id }, actionID, {});
        assert.isUndefined(pending);
        assert.strictEqual(state.id, StateID.EnterStarted);
      });
      it("should interrupt appear started", () => {
        const id = StateID.AppearStarted;
        const {state, pending} = reduce({ id }, actionID, {});
        assert.isUndefined(pending);
        assert.strictEqual(state.id, StateID.LeaveStarted);
      });
    });
  });
});

function testState(id: StateID, styleName: string, state: (props: CSSTransitionProps) => CSSTransitionState) {
  return () => {
    const extraProps = ["appearStyle", "appearInitStyle"].indexOf(styleName) > -1 ? { appearStyle: {} } : {};
    it("should return id", () => {
      assert.strictEqual(state({}).id, id);
    });
    if (["appearStyle", "enterStyle", "leaveStyle"].indexOf(styleName) < 0) {
      it("should return style", () => {
        const style = { top: "0px" };
        assert.deepEqual(state({ ...extraProps, [styleName]: style }).style, style);
      });
      it("should return combined style", () => {
        const style = { top: "0px" };
        const baseStyle = { left: "0px" };
        assert.deepEqual(
          state({ ...extraProps, style: baseStyle, [styleName]: style }).style,
          { ...baseStyle, ...style },
        );
      });
    } else {
      it("should return transition style", () => {
        const style = { top: transit("5px", 120) };
        const styleProcessed = { top: "5px", transition: "top 120ms ease 0ms" };
        assert.deepEqual(state({ ...extraProps, [styleName]: style }).style, styleProcessed);
      });

      it("should return combined style", () => {
        const style = { top: transit("5px", 120) };
        const styleProcessed = { top: "5px", transition: "top 120ms ease 0ms" };
        const baseStyle = { left: "0px" };
        assert.deepEqual(
          state({ ...extraProps, style: baseStyle, [styleName]: style }).style,
          { ...baseStyle, ...styleProcessed },
        );
      });

      it("should return transition style with extra delay", () => {
        const style = { top: transit("5px", 120, "ease", 10) };
        const styleProcessed = { top: "5px", transition: "top 120ms ease 30ms" };
        assert.deepEqual(state({ ...extraProps, [styleName]: style, transitionDelay: 20 }).style, styleProcessed);
      });
    }
  };
};
