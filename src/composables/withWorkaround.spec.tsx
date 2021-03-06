import * as React from "react";
import { assert } from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import { spy, SinonSpy } from "sinon";
import { assemble } from "reassemble";

import { withWorkaround } from "./withWorkaround";
import { Component } from "../../test/component";

describe("withWorkaround", () => {
  const composable = withWorkaround;
  const Assembly = assemble<any, any>(composable)(Component);

  let onTransitionStart: SinonSpy;
  let wrapper: ShallowWrapper<any, any>;

  before(() => {
    onTransitionStart = spy();
    const props = {
      transitionInfo: {},
      transitionState: {
        inTransition: false,
      },
      onTransitionStart,
      children: <span>dummy</span>,
    };
    wrapper = shallow<any, any>(<Assembly {...props} />);
  });

  it("should render workaround before child", () => {
    assert.strictEqual(wrapper.childAt(0).key(), "workaround");
    assert.strictEqual(wrapper.childAt(1).text(), "dummy");
  });

  it("should have default style", () => {
    const style = wrapper.childAt(0).props().style;
    assert.deepEqual(style, { opacity: 0.9 });
  });

  describe("during a transition", () => {
    before(() => {
      wrapper.setProps({
        transitionInfo: {
          firstProperty: "width",
          firstPropertyDelay: 10,
        },
        transitionState: {
          inTransition: true,
        },
      });
    });

    it("should perform a second transition", () => {
      const style = wrapper.childAt(0).props().style;
      const transition = "opacity 1ms linear 10ms";
      assert.deepEqual(style, { opacity: 1.0, transition, WebkitTransition: transition });
    });

    describe("when second transition ends", () => {
      before(() => {
        wrapper.childAt(0).simulate("transitionEnd", { propertyName: "opacity" });
      });

      it("should call onTransitionStart", () => {
        assert.isTrue(onTransitionStart.calledWith({ propertyName: "width" }));
      });
    });
  });
});
