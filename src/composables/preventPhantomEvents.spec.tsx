import * as React from "react";
import { StatelessComponent } from "react";
import { assert } from "chai";
import { mount, ReactWrapper } from "enzyme";
import { spy, SinonSpy } from "sinon";
import { assemble } from "reassemble";

import { preventPhantomEvents } from "./preventPhantomEvents";
const Component: StatelessComponent<any> = ({onTransitionEnd}) => <span {...{ onTransitionEnd }} />;

describe("preventPhantomEvents", () => {
  const composable = preventPhantomEvents;
  const Assembly = assemble<any, any>(composable)(Component);
  let onTransitionEnd: SinonSpy;
  let wrapper: ReactWrapper<any, any>;

  beforeEach(() => {
    onTransitionEnd = spy();
    wrapper = mount(<Assembly onTransitionEnd={onTransitionEnd} />);
  });

  it("should block onTransitionEnd", () => {
    wrapper.setProps({ active: true });
    const event = { timeStamp: Date.now() };
    wrapper.simulate("transitionEnd", event);
    assert.isTrue(onTransitionEnd.notCalled);
  });

  it("should call onTransitionEnd", () => {
    wrapper.setProps({ active: true });
    const event = { timeStamp: Date.now() + 20 };
    wrapper.simulate("transitionEnd", event);
    assert.isTrue(onTransitionEnd.called);
  });

  it("should block onTransitionEnd comparing precision time", () => {
    wrapper.setProps({ active: true });
    const event = { timeStamp: performance.now() };
    wrapper.simulate("transitionEnd", event);
    assert.isTrue(onTransitionEnd.notCalled);
  });

  it("should call onTransitionEnd comparing precision time", () => {
    wrapper.setProps({ active: true });
    const event = { timeStamp: performance.now() + 20 };
    wrapper.simulate("transitionEnd", event);
    assert.isTrue(onTransitionEnd.called);
  });
});
