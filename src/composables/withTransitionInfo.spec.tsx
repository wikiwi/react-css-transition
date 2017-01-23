/**
 * @license
 * Copyright (C) 2016-present Chi Vinh Le and contributors.
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import * as React from "react";
import { assert } from "chai";
import { shallow, mount } from "enzyme";
import { assemble } from "reassemble";

import { withTransitionInfo } from "./withTransitionInfo";
import { Component } from "../../test/component";

function addCSS(css: string): HTMLElement {
  const head = document.getElementsByTagName("head")[0];
  const s = document.createElement("style");
  s.setAttribute("type", "text/css");
  s.appendChild(document.createTextNode(css));
  head.appendChild(s);
  return s;
}

const css =
  `
.transition {
  transition-property: height, width;
  transition-duration: 2ms, 10s;
  transition-delay: 2s, 10ms;
  transition-timing-function: linear, ease;
}
`;

describe("withTransitionInfo", () => {
  const composable = withTransitionInfo;
  const Assembly = assemble<any, any>(composable)(Component);

  describe("style based", () => {
    it("should pass transitionInfo for ongoing transition", () => {
      const input = {
        style: {
          transition: "height 2ms 2s linear, width ease 10s 10ms",
        },
        transitionState: {
          inTransition: true,
        },
      };
      const output = {
        ...input,
        transitionInfo: {
          firstProperty: "width",
          firstPropertyDelay: 10,
          lastProperty: "width",
        },
      };
      const wrapper = shallow(<Assembly {...input} />);
      assert.deepEqual(wrapper.props(), output);
    });
  });

  describe("class based", () => {
    let div: HTMLElement;
    let style: HTMLElement;

    before(() => {
      style = addCSS(css);
      div = document.createElement("div");
      document.body.appendChild(div);
    });

    after(() => {
      div.parentNode.removeChild(div);
      style.parentNode.removeChild(style);
    });

    it("should pass transitionInfo for ongoing transition", () => {
      const input = {
        className: "transition",
        getDOMNode: () => div,
        transitionState: {
          inTransition: true,
        },
      };
      const output = {
        ...input,
        transitionInfo: {
          firstProperty: "width",
          firstPropertyDelay: 10,
          lastProperty: "width",
        },
      };
      const wrapper = mount(<Assembly {...input} />);
      assert.deepEqual(wrapper.find(Component).props(), output);
    });
  });

  it("should pass empty transitionInfo for absent transition", () => {
    const input = {
      style: {},
      transitionState: {
        inTransition: false,
      },
    };
    const output = {
      ...input,
      transitionInfo: {},
    };
    const wrapper = shallow(<Assembly {...input} />);
    assert.deepEqual(wrapper.props(), output);
  });
});
