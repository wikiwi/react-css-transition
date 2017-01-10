/**
 * @license
 * Copyright (C) 2016-present Chi Vinh Le and contributors.
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

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
});
