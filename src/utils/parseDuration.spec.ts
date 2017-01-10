/**
 * @license
 * Copyright (C) 2016-present Chi Vinh Le and contributors.
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import { assert } from "chai";

import parseDuration from "./parseDuration";

describe("parseDuration", () => {
  describe("valid input", () => {
    it("should return duration", () => {
      assert.strictEqual(parseDuration("2ms"), 2);
      assert.strictEqual(parseDuration("3s"), 3000);
    });
  });
  describe("invalid input", () => {
    it("should return NaN ", () => {
      assert.isTrue(isNaN(parseDuration("awd")));
    });
  });
});
