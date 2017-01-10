/**
 * @license
 * Copyright (C) 2016-present Chi Vinh Le and contributors.
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import * as React from "react";
import { assert } from "chai";
import { shallow } from "enzyme";
import { assemble } from "react-assemble";

import { withTransitionInfo } from "./withTransitionInfo";
import { Component } from "../../test/component";

describe("withTransitionInfo", () => {
  it("should pass transitionInfo for ongoing transition", () => {
    const input = {
      style: {
        transition: "height 2ms 2s linear, width ease 10s 10ms",
      },
    };
    const output = {
      ...input,
      transitionInfo: {
        firstProperty: "width",
        firstPropertyDelay: 10,
        lastProperty: "width",
        inTransition: true,
      },
    };
    const composable = withTransitionInfo;
    const Assembly = assemble<any, any>(composable)(Component);
    const wrapper = shallow(<Assembly {...input} />);
    assert.deepEqual(wrapper.props(), output);
  });

  it("should pass transitionInfo for absent transition", () => {
    const input = {
      style: {},
    };
    const output = {
      ...input,
      transitionInfo: {
        inTransition: false,
      },
    };
    const composable = withTransitionInfo;
    const Assembly = assemble<any, any>(composable)(Component);
    const wrapper = shallow(<Assembly {...input} />);
    assert.deepEqual(wrapper.props(), output);
  });
});
