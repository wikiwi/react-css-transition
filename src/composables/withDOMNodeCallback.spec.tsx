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
