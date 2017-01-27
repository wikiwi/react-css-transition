import * as React from "react";
import { assert } from "chai";
import { shallow } from "enzyme";
import { assemble } from "reassemble";

import { mergeWithBaseStyle } from "./mergeWithBaseStyle";
import { Component } from "../../test/component";

describe("mergeWithBaseStyle", () => {
  const composable = mergeWithBaseStyle;
  const Assembly = assemble<any, any>(composable)(Component);

  it("should merge base style with transition style", () => {
    const input = {
      style: { top: 0, left: 2 },
      transitionState: { style: { left: 10 } },
    };
    const output = {
      ...input,
      style: { top: 0, left: 10 },
      className: "",
    };
    const wrapper = shallow(<Assembly {...input} />);
    assert.deepEqual(wrapper.props(), output);
  });

  it("should merge base className with transition className", () => {
    const input = {
      className: "baseClass",
      transitionState: { className: "transitionClass" },
    };
    const output = {
      ...input,
      style: {},
      className: "baseClass transitionClass",
    };
    const wrapper = shallow(<Assembly {...input} />);
    assert.deepEqual(wrapper.props(), output);
  });

  it("should merge both", () => {
    const input = {
      style: { top: 0, left: 2 },
      className: "baseClass",
      transitionState: { style: { left: 10 }, className: "transitionClass" },
    };
    const output = {
      ...input,
      style: { top: 0, left: 10 },
      className: "baseClass transitionClass",
    };
    const wrapper = shallow(<Assembly {...input} />);
    assert.deepEqual(wrapper.props(), output);
  });
});
