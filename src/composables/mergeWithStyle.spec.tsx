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

import { mergeWithStyle } from "./mergeWithStyle";
import { Component } from "../../test/component";

describe("mergeWithStyle", () => {
  it("should merge style with transitionStyle", () => {
    const input = {
      style: { top: 0, left: 2 },
      transitionStyle: { left: 10 },
    };
    const output = {
      style: { top: 0, left: 10 },
    };
    const composable = mergeWithStyle;
    const Assembly = assemble<any, any>(composable)(Component);
    const wrapper = shallow(<Assembly {...input} />);
    assert.deepEqual(wrapper.props(), output);
  });
});
