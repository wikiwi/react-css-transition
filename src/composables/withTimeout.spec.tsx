import * as React from "react";
import { assert } from "chai";
import { mount } from "enzyme";
import { spy } from "sinon";
import { assemble } from "reassemble";

import { Component } from "../../test/component";
import { withTimeout, timeoutMultiplier } from "./withTimeout";

describe("withTimeout", () => {
  const composable = withTimeout;
  const Assembly = assemble<any, any>(composable)(Component);

  it("shouldn't timeout without a transition", (done) => {
    const props = {
      transitionState: {
        inTransition: false,
      },
      transitionInfo: {
        totalDuration: 20,
      },
      timeout: spy(),
    };
    const timeoutIn = props.transitionInfo.totalDuration * timeoutMultiplier;
    mount(<Assembly {...props} />);
    setTimeout(() => {
      assert.isFalse(props.timeout.called);
      done();
    }, timeoutIn);
  });

  it("shouldn't timeout when transition ends before", (done) => {
    const props = {
      transitionState: {
        inTransition: false,
      },
      transitionInfo: {
        totalDuration: 20,
      },
      timeout: spy(),
    };
    const timeoutIn = props.transitionInfo.totalDuration * timeoutMultiplier;
    const wrapper = mount(<Assembly {...props} />);
    wrapper.setProps({ transitionState: { inTransition: true } });
    setTimeout(() => {
      assert.isFalse(props.timeout.called);
      wrapper.setProps({ transitionState: { inTransition: false } });
      setTimeout(() => {
        assert.isFalse(props.timeout.called);
        done();
      }, timeoutIn - props.transitionInfo.totalDuration);
    }, props.transitionInfo.totalDuration);
  });

  it("should timeout if transition passes time", (done) => {
    const props = {
      transitionState: {
        inTransition: false,
      },
      transitionInfo: {
        totalDuration: 20,
      },
      timeout: spy(),
    };
    const timeoutIn = props.transitionInfo.totalDuration * timeoutMultiplier;
    const wrapper = mount(<Assembly {...props} />);
    wrapper.setProps({ transitionState: { inTransition: true } });
    setTimeout(() => {
      assert.isTrue(props.timeout.called);
      done();
    }, timeoutIn);
  });

  it("should reset timer if transition was interrupted", (done) => {
    const props = {
      transitionState: {
        inTransition: false,
      },
      transitionInfo: {
        totalDuration: 20,
      },
      timeout: spy(),
    };
    const halfPeriod = props.transitionInfo.totalDuration * timeoutMultiplier / 2;
    const wrapper = mount(<Assembly {...props} />);
    wrapper.setProps({ transitionState: { inTransition: true } });
    setTimeout(() => {
      assert.isFalse(props.timeout.called);
      wrapper.setProps({ active: true });

      setTimeout(() => {
        assert.isFalse(props.timeout.called);
        setTimeout(() => {
          assert.isTrue(props.timeout.called);
          done();
        }, halfPeriod);
      }, halfPeriod);
    }, halfPeriod);
  });
});
