import { assert } from "chai";

import { transit } from "./transit";
import {
  reducer, StateID, StateIDList, ActionID, ActionProps, TransitionState, getState,
  getDelay, transitionNames, hasTransition,
  defaultNewState, activeNewState, appearNewState,
  defaultState, activeState,
  appearInitState, enterInitState, leaveInitState,
  appearPrepareState, enterPrepareState, leavePrepareState,
  appearTriggeredState, enterTriggeredState, leaveTriggeredState,
  appearStartedState, enterStartedState, leaveStartedState,
} from "./reducer";

describe("reducer.ts", () => {
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
        const className = "foo";
        assert.deepEqual(
          getState(id, name, { [name + "Style"]: style, [name + "ClassName"]: className }), {
            id,
            style,
            className,
            inTransition: false,
          });
      });
    });
    it("should return transition state", () => {
      transitionNames.forEach((name) => {
        const id = StateID.EnterStarted;
        const style = { top: transit("5px", 120) };
        const styleProcessed = { top: "5px", transition: "top 120ms ease 0ms" };
        const className = "foo";
        assert.deepEqual(
          getState(id, name, { [name + "Style"]: style, [name + "ClassName"]: className }), {
            id,
            style: styleProcessed,
            className,
            inTransition: true,
          });
      });
    });
    it("should return transition init state", () => {
      transitionNames.forEach((name) => {
        const id = StateID.EnterInit;
        const inTransition = false;
        const style = { top: 0 };
        const className = "foo";
        const cases = [
          {
            props: {
              [name + "InitStyle"]: style,
              [name + "Style"]: {},
            },
            out: { id, style, inTransition, className: "" },
          },
          {
            props: {
              [name + "InitStyle"]: style,
              [name + "Style"]: {},
              [name + "InitClassName"]: className,
            },
            out: { id, style, inTransition, className },
          },
          {
            props: {
              [name + "InitStyle"]: style,
              [name + "ClassName"]: "bar",
              [name + "InitClassName"]: className,
            },
            out: { id, style, inTransition, className },
          },
          {
            props: {
              [name + "ClassName"]: "bar",
              [name + "InitClassName"]: className,
            },
            out: { id, style: {}, inTransition, className },
          },
        ];
        cases.forEach((c, idx) => {
          assert.deepEqual(getState(id, name, c.props, { mode: "init" }), c.out,
            `Case ${name} ${idx} unexpected state.`);
        });
      });
    });
  });
  it("should return transition init fallback state", () => {
    transitionNames.forEach((name) => {
      const fallbackName = name === "leave" ? "active" : "default";
      const id = StateID.EnterInit;
      const inTransition = false;
      const style = { top: 0 };
      const className = "foo";
      const cases = [
        {
          props: {
            [fallbackName + "Style"]: style,
            [name + "Style"]: {},
          },
          out: { id, style, inTransition, className: "" },
        },
        {
          props: {
            [fallbackName + "Style"]: style,
            [name + "ClassName"]: "",
          },
          out: { id, style, inTransition, className: "" },
        },
        {
          props: {
            [fallbackName + "ClassName"]: className,
            [name + "ClassName"]: "",
          },
          out: { id, className, inTransition, style: {} },
        },
        {
          props: {
            [fallbackName + "ClassName"]: className,
            [name + "Style"]: {},
          },
          out: { id, className, inTransition, style: {} },
        },
      ];
      cases.forEach((c, idx) => {
        assert.deepEqual(getState(id, name, c.props, { mode: "init" }), c.out,
          `Case ${name} ${idx} unexpected state.`);
      });
    });
  });
  it("should return transition prepare state", () => {
    transitionNames.forEach((name) => {
      const id = StateID.EnterPrepare;
      const inTransition = false;
      const style = { top: 0 };
      const transition = "opacity 200ms";
      const styleWithTransition = { ...style, transition };
      const className = "foo";
      const cases = [
        {
          props: {
            [name + "InitStyle"]: style,
            [name + "Style"]: { transition },
          },
          out: { id, style: styleWithTransition, inTransition, className: "" },
        },
        {
          props: {
            [name + "InitStyle"]: style,
            [name + "Style"]: { transition },
            [name + "InitClassName"]: className,
          },
          out: { id, style: styleWithTransition, inTransition, className },
        },
        {
          props: {
            [name + "InitStyle"]: style,
            [name + "ClassName"]: "bar",
            [name + "InitClassName"]: className,
          },
          out: { id, style, inTransition, className },
        },
        {
          props: {
            [name + "ClassName"]: "bar",
            [name + "InitClassName"]: className,
          },
          out: { id, style: {}, inTransition, className },
        },
      ];
      cases.forEach((c, idx) => {
        assert.deepEqual(getState(id, name, c.props, { mode: "prepare" }), c.out,
          `Case ${name} ${idx} unexpected state.`);
      });
    });
  });
});
it("should fallback appear to enter", () => {
  const id = StateID.AppearNew;
  const style = { left: "0px" };
  const className = "foo";
  const inTransition = true;
  const cases = [
    {
      props: {
        enterStyle: style,
      },
      out: { id, style, inTransition, className: "" },
    },
    {
      props: {
        enterClassName: className,
      },
      out: { id, className, inTransition, style: {} },
    },
    {
      props: {
        enterStyle: style,
        enterClassName: className,
      },
      out: { id, style, inTransition, className },
    },
  ];
  cases.forEach((c, idx) => {
    assert.deepEqual(getState(id, "appear", c.props), c.out,
      `Case ${name} ${idx} unexpected state.`);
  });
});
it("should fallback appearInit to enterInit", () => {
  const id = StateID.AppearNew;
  const style = { left: "0px" };
  const className = "foo";
  const inTransition = false;
  const cases = [
    {
      props: {
        enterInitStyle: style,
      },
      out: { id, style, inTransition, className: "" },
    },
    {
      props: {
        enterInitClassName: className,
      },
      out: { id, className, inTransition, style: {} },
    },
    {
      props: {
        enterInitStyle: style,
        enterInitClassName: className,
      },
      out: { id, style, inTransition, className },
    },
  ];
  cases.forEach((c, idx) => {
    assert.deepEqual(getState(id, "appear", c.props, { mode: "init" }), c.out,
      `Case ${name} ${idx} unexpected state.`);
  });
});
describe("states", () => {
  describe(
    "defaultNewState",
    testState(StateID.DefaultNew, "defaultStyle", (props) => defaultNewState(props)),
  );
  describe(
    "activeNewState",
    testState(StateID.ActiveNew, "activeStyle", (props) => activeNewState(props)),
  );
  describe(
    "appearNewState",
    testState(StateID.AppearNew, "appearInitStyle", (props) => appearNewState(props)),
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
    "appearInitState",
    testState(StateID.AppearInit, "appearInitStyle", (props) => appearInitState(props)),
  );
  describe(
    "enterInitState",
    testState(StateID.EnterInit, "enterInitStyle", (props) => enterInitState(props)),
  );
  describe(
    "leaveInitState",
    testState(StateID.LeaveInit, "leaveInitStyle", (props) => leaveInitState(props)),
  );
  describe(
    "appearPrepareState",
    testState(StateID.AppearPrepare, "appearInitStyle", (props) => appearPrepareState(props)),
  );
  describe(
    "enterPrepareState",
    testState(StateID.EnterPrepare, "enterInitStyle", (props) => enterPrepareState(props)),
  );
  describe(
    "leavePrepareState",
    testState(StateID.LeavePrepare, "leaveInitStyle", (props) => leavePrepareState(props)),
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
  describe("New", () => {
    const actionID = ActionID.New;

    it("should fail when state is already initialized", () => {
      assert.throw(() => reducer(StateID.Active, { kind: actionID, props: {} }));
    });
    it("should become DefaultNew", () => {
      const {state, pending} = reducer(StateID.EntryPoint, { kind: actionID, props: { active: false } });
      assert.isUndefined(pending);
      assert.strictEqual(state.id, StateID.DefaultNew);
    });
    it("should become ActiveNew", () => {
      const {state, pending} = reducer(StateID.EntryPoint, { kind: actionID, props: { active: true } });
      assert.isUndefined(pending);
      assert.strictEqual(state.id, StateID.ActiveNew);
    });
    it("should become AppearNew", () => {
      const {state, pending} = reducer(StateID.EntryPoint, {
        kind: actionID,
        props: {
          active: true, transitionAppear: true,
        },
      });
      assert.isUndefined(pending);
      assert.strictEqual(state.id, StateID.AppearNew);
    });
  });
  describe("Mount", () => {
    const actionID = ActionID.Mount;
    it("should become AppearInit", () => {
      const {state, pending} = reducer(StateID.AppearNew, {
        kind: actionID,
        props: {
          appearStyle: {},
        },
      });
      assert.strictEqual(pending, ActionID.TransitionPrepare);
      assert.strictEqual(state.id, StateID.AppearInit);
    });

    it("should do nothing", () => {
      assert.isNull(reducer(StateID.Active, { kind: actionID, props: {} }));
    });
  });
  describe("TransitionInit", () => {
    const actionID = ActionID.TransitionInit;
    const validOrigin = [
      StateID.Active, StateID.ActiveNew, StateID.Default, StateID.DefaultNew, StateID.AppearNew,
    ];

    it("should fail on invalid state transitions", () => {
      StateIDList
        .filter((id) => validOrigin.indexOf(id) < 0)
        .forEach((id) => assert.throw(() => reducer(id, { kind: actionID, props: {} })));
    });
    it("should transit to enter init state", () => {
      [StateID.Default, StateID.DefaultNew].forEach((id) => {
        const {state, pending} = reducer(id, { kind: actionID, props: { enterStyle: {} } });
        assert.strictEqual(pending, ActionID.TransitionPrepare);
        assert.strictEqual(state.id, StateID.EnterInit);
      });
    });
    it("should transit to leave init state", () => {
      [StateID.Active, StateID.ActiveNew].forEach((id) => {
        const {state, pending} = reducer(id, { kind: actionID, props: { leaveStyle: {} } });
        assert.strictEqual(pending, ActionID.TransitionPrepare);
        assert.strictEqual(state.id, StateID.LeaveInit);
      });
    });
    it("should transit to appear init state", () => {
      const id = StateID.AppearNew;
      const {state, pending} = reducer(id, { kind: actionID, props: { appearStyle: {} } });
      assert.strictEqual(pending, ActionID.TransitionPrepare);
      assert.strictEqual(state.id, StateID.AppearInit);
    });
    it("should skip to active and complete", () => {
      [StateID.Default, StateID.DefaultNew, StateID.AppearNew].forEach((id) => {
        const {state, pending, completed} = reducer(id, { kind: actionID, props: {} });
        assert.isUndefined(pending);
        assert.strictEqual(state.id, StateID.Active);
        assert.isTrue(completed);
      });
    });
    it("should skip to default and complete", () => {
      [StateID.Active, StateID.ActiveNew].forEach((id) => {
        const {state, pending, completed} = reducer(id, { kind: actionID, props: {} });
        assert.isUndefined(pending);
        assert.strictEqual(state.id, StateID.Default);
        assert.isTrue(completed);
      });
    });
  });
  describe("TransitionStart", () => {
    const actionID = ActionID.TransitionStart;

    it("should not fail on invalid state transitions", () => {
      StateIDList
        .filter((id) => [StateID.EnterTriggered, StateID.LeaveTriggered, StateID.AppearTriggered].indexOf(id) < 0)
        .forEach((id) => assert.isNull(reducer(id, { kind: actionID, props: {} })));
    });
    it("should transit to enter started state", () => {
      const {state, pending} = reducer(StateID.EnterTriggered, { kind: actionID, props: {} });
      assert.isUndefined(pending);
      assert.strictEqual(state.id, StateID.EnterStarted);
    });
    it("should transit to leave started state", () => {
      const {state, pending} = reducer(StateID.LeaveTriggered, { kind: actionID, props: {} });
      assert.isUndefined(pending);
      assert.strictEqual(state.id, StateID.LeaveStarted);
    });
    it("should transit to appear started state", () => {
      const {state, pending} =
        reducer(StateID.AppearTriggered, { kind: actionID, props: {} });
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
        .forEach((id) => assert.throw(() => reducer(id, { kind: actionID, props: {} })));
    });
    it("should transit to active state", () => {
      const origin = [
        StateID.AppearTriggered, StateID.AppearStarted,
        StateID.EnterTriggered, StateID.EnterStarted,
      ];
      origin.forEach((id) => {
        const {state, pending} = reducer(id, { kind: actionID, props: {} });
        assert.isUndefined(pending);
        assert.strictEqual(state.id, StateID.Active);
      });
    });
    it("should transit to default state", () => {
      [StateID.LeaveTriggered, StateID.LeaveStarted].forEach((id) => {
        const {state, pending} = reducer(id, { kind: actionID, props: {} });
        assert.isUndefined(pending);
        assert.strictEqual(state.id, StateID.Default);
      });
    });
    it("should complete", () => {
      validOrigin.forEach((id) => {
        const result = reducer(id, { kind: actionID, props: {} });
        assert.isTrue(result.completed);
      });
    });
  });
  describe("Timeout", () => {
    const actionID = ActionID.Timeout;
    const validOrigin = [
      StateID.AppearTriggered, StateID.AppearStarted,
      StateID.EnterTriggered, StateID.EnterStarted,
      StateID.LeaveTriggered, StateID.LeaveStarted,
    ];

    it("should fail on invalid state transitions", () => {
      StateIDList
        .filter((id) => validOrigin.indexOf(id) < 0)
        .forEach((id) => assert.throw(() => reducer(id, { kind: actionID, props: {} })));
    });
    it("should transit to active state", () => {
      const origin = [
        StateID.AppearTriggered, StateID.AppearStarted,
        StateID.EnterTriggered, StateID.EnterStarted,
      ];
      origin.forEach((id) => {
        const {state, pending} = reducer(id, { kind: actionID, props: {} });
        assert.isUndefined(pending);
        assert.strictEqual(state.id, StateID.Active);
      });
    });
    it("should transit to default state", () => {
      [StateID.LeaveTriggered, StateID.LeaveStarted].forEach((id) => {
        const {state, pending} = reducer(id, { kind: actionID, props: {} });
        assert.isUndefined(pending);
        assert.strictEqual(state.id, StateID.Default);
      });
    });
    it("should complete", () => {
      validOrigin.forEach((id) => {
        const result = reducer(id, { kind: actionID, props: {} });
        assert.isTrue(result.completed);
      });
    });
  });

  describe("TransitionTrigger", () => {
    const actionID = ActionID.TransitionTrigger;
    it("should transit to enter init state", () => {
      [StateID.Default, StateID.DefaultNew].forEach((id) => {
        const {state, pending} = reducer(id, { kind: actionID, props: { enterStyle: {} } });
        assert.strictEqual(pending, ActionID.TransitionPrepare);
        assert.strictEqual(state.id, StateID.EnterInit);
      });
    });
    it("should transit to leave init state", () => {
      [StateID.Active, StateID.ActiveNew].forEach((id) => {
        const {state, pending} = reducer(id, { kind: actionID, props: { leaveStyle: {} } });
        assert.strictEqual(pending, ActionID.TransitionPrepare);
        assert.strictEqual(state.id, StateID.LeaveInit);
      });
    });
    it("should transit to appear init state", () => {
      const id = StateID.AppearNew;
      const {state, pending} = reducer(id, { kind: actionID, props: { appearStyle: {} } });
      assert.strictEqual(pending, ActionID.TransitionPrepare);
      assert.strictEqual(state.id, StateID.AppearInit);
    });
    it("should transit to enter triggered state", () => {
      const id = StateID.EnterPrepare;
      const {state, pending} = reducer(id, { kind: actionID, props: { active: true } });
      assert.isUndefined(pending);
      assert.strictEqual(state.id, StateID.EnterTriggered);
    });
    it("should transit to leave triggered state", () => {
      const id = StateID.LeavePrepare;
      const {state, pending} = reducer(id, { kind: actionID, props: { active: false } });
      assert.isUndefined(pending);
      assert.strictEqual(state.id, StateID.LeaveTriggered);
    });
    it("should transit to appear triggered state", () => {
      const id = StateID.AppearPrepare;
      const {state, pending} = reducer(id, { kind: actionID, props: { active: true } });
      assert.isUndefined(pending);
      assert.strictEqual(state.id, StateID.AppearTriggered);
    });
    it("should interrupt enter init and triggered", () => {
      [StateID.EnterInit, StateID.EnterPrepare, StateID.EnterTriggered].forEach((id) => {
        const props = { active: false };
        const {state, pending, completed} = reducer(id, { kind: actionID, props });
        assert.isUndefined(pending);
        assert.strictEqual(state.id, StateID.Default);
        assert.isTrue(completed);
      });
    });
    it("should interrupt leave init and triggered", () => {
      [StateID.LeaveInit, StateID.LeavePrepare, StateID.LeaveTriggered].forEach((id) => {
        const props = { active: true };
        const {state, pending, completed} = reducer(id, { kind: actionID, props });
        assert.isUndefined(pending);
        assert.strictEqual(state.id, StateID.Active);
        assert.isTrue(completed);
      });
    });
    it("should interrupt appear init and triggered", () => {
      [StateID.AppearInit, StateID.AppearPrepare, StateID.AppearTriggered].forEach((id) => {
        const props = { active: false };
        const {state, pending, completed} = reducer(id, { kind: actionID, props });
        assert.isUndefined(pending);
        assert.strictEqual(state.id, StateID.Default);
        assert.isTrue(completed);
      });
    });
    it("should interrupt enter started", () => {
      const id = StateID.EnterStarted;
      const {state, pending} = reducer(id, { kind: actionID, props: {} });
      assert.isUndefined(pending);
      assert.strictEqual(state.id, StateID.LeaveStarted);
    });
    it("should interrupt leave started", () => {
      const id = StateID.LeaveStarted;
      const {state, pending} = reducer(id, { kind: actionID, props: {} });
      assert.isUndefined(pending);
      assert.strictEqual(state.id, StateID.EnterStarted);
    });
    it("should interrupt appear started", () => {
      const id = StateID.AppearStarted;
      const {state, pending} = reducer(id, { kind: actionID, props: {} });
      assert.isUndefined(pending);
      assert.strictEqual(state.id, StateID.LeaveStarted);
    });
  });
});

function testState(id: StateID, styleName: string, state: (props: ActionProps) => TransitionState) {
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
    } else {
      it("should return transition style", () => {
        const style = { top: transit("5px", 120) };
        const styleProcessed = { top: "5px", transition: "top 120ms ease 0ms" };
        assert.deepEqual(state({ ...extraProps, [styleName]: style }).style, styleProcessed);
      });
      it("should return transition style with extra delay", () => {
        const style = { top: transit("5px", 120, "ease", 10) };
        const styleProcessed = { top: "5px", transition: "top 120ms ease 30ms" };
        assert.deepEqual(state({ ...extraProps, [styleName]: style, transitionDelay: 20 }).style, styleProcessed);
      });
    }
  };
};
