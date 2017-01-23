/**
 * @license
 * Copyright (C) 2016-present Chi Vinh Le and contributors.
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import * as React from "react";
import { assert } from "chai";
import { mount } from "enzyme";
import { assemble } from "reassemble";

import { withDOMNodeCallback } from "./withDOMNodeCallback";

class Component extends React.Component<any, any> {
  public render(): any {
    return <span ref={this.props.onDOMNodeRef} />;
  }
}

describe("withDOMNodeCallback", () => {
  const composable = withDOMNodeCallback;
  const Assembly = assemble<any, any>(composable)(Component);

  it("should provide callback", () => {
    const wrapper = mount(<Assembly />);
    assert.strictEqual(wrapper.find(Component).props().getDOMNode().nodeName, "SPAN");
  });
});
