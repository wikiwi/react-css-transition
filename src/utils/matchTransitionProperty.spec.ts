import { assert } from "chai";

import matchTransitionProperty from "./matchTransitionProperty";

describe("matchTransitionProperty", () => {
  it("should match properties", () => {
    assert.isTrue(
      matchTransitionProperty("background-color", "background"),
    );
    assert.isTrue(
      matchTransitionProperty("background", "background"),
    );
    assert.isFalse(
      matchTransitionProperty("background", "background-color"),
    );
    assert.isFalse(
      matchTransitionProperty("background", "width"),
    );
  });

  it("should ignore prefixed properties", () => {
    assert.isTrue(
      matchTransitionProperty("-webkit-background-color", "background"),
    );
    assert.isTrue(
      matchTransitionProperty("background", "-ms-background"),
    );
    assert.isFalse(
      matchTransitionProperty("-o-background", "-moz-background-color"),
    );
  });

  it("should handle all", () => {
    assert.isTrue(
      matchTransitionProperty("-webkit-background-color", "all"),
    );
  });
});
