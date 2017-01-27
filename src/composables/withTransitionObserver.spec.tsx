import * as React from "react";
import { assert } from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import { spy } from "sinon";
import { assemble } from "reassemble";

import { withTransitionObserver } from "./withTransitionObserver";
import { Component } from "../../test/component";

describe("withTransitionObserver", () => {
  const composable = withTransitionObserver;
  const Assembly = assemble<any, any>(composable)(Component);
  const transitionInfo = {
    firstProperty: "width",
    lastProperty: "height",
  };
  const transitionState = {
    inTransition: true,
  };
  let wrapper: ShallowWrapper<any, any>;
  let handlers = {
    onTransitionStart: spy(),
    onTransitionEnd: spy(),
    onTransitionBegin: spy(),
    onTransitionComplete: spy(),
  };

  beforeEach(() => {
    const props = {
      transitionInfo,
      transitionState,
      ...handlers,
    };
    wrapper = shallow(<Assembly {...props} />);
    Object.keys(handlers).forEach((s) => (handlers as any)[s].reset());
  });

  describe("onTransitionBegin", () => {
    it("should not call onTransitionBegin yet", () => {
      assert.isTrue(handlers.onTransitionBegin.notCalled);
    });

    it("should call onTransitionStart", () => {
      const event = {
        target: "descendant",
      };
      wrapper.simulate("transitionStart", event);
      assert.isTrue(handlers.onTransitionStart.calledWith(event));
    });

    it("should not call onTransitionBegin when origin from descendants", () => {
      const event = {
        target: "descendant",
      };
      wrapper.simulate("transitionStart", event);
      assert.isTrue(handlers.onTransitionBegin.notCalled);
    });

    it("should not call onTransitionBegin when propertyName mismatches", () => {
      const event = {
        propertyName: "foo",
      };
      wrapper.simulate("transitionStart", event);
      assert.isTrue(handlers.onTransitionBegin.notCalled);
    });

    it("should call onTransitionBegin", () => {
      const event = {
        propertyName: "width",
      };
      wrapper.simulate("transitionStart", event);
      assert.isTrue(handlers.onTransitionBegin.called);
    });

    it("should not call onTransitionBegin when inTransition=false", () => {
      const event = {
        propertyName: "width",
      };
      wrapper.setProps({ transitionState: { inTransition: false } });
      wrapper.simulate("transitionStart", event);
      assert.isTrue(handlers.onTransitionBegin.notCalled);
    });
  });

  describe("onTransitionComplete", () => {
    it("should not call onTransitionComplete yet", () => {
      assert.isTrue(handlers.onTransitionComplete.notCalled);
    });

    it("should cal onTransitionEnd", () => {
      const event = {
        target: "descendant",
      };
      wrapper.simulate("transitionEnd", event);
      assert.isTrue(handlers.onTransitionEnd.calledWith(event));
    });

    it("should not call onTransitionComplete when origin from descendants", () => {
      const event = {
        target: "descendant",
      };
      wrapper.simulate("transitionEnd", event);
      assert.isTrue(handlers.onTransitionComplete.notCalled);
    });

    it("should not call onTransitionComplete when propertyName mismatches", () => {
      const event = {
        propertyName: "foo",
      };
      wrapper.simulate("transitionEnd", event);
      assert.isTrue(handlers.onTransitionComplete.notCalled);
    });

    it("should call onTransitionComplete", () => {
      const event = {
        propertyName: "height",
      };
      wrapper.simulate("transitionEnd", event);
      assert.isTrue(handlers.onTransitionComplete.called);
    });

    it("should not call onTransitionComplete when inTransition=false", () => {
      const event = {
        propertyName: "height",
      };
      wrapper.setProps({ transitionState: { inTransition: false } });
      wrapper.simulate("transitionEnd", event);
      assert.isTrue(handlers.onTransitionComplete.notCalled);
    });
  });
});
