/**
 * @license
 * Copyright (C) 2016 Chi Vinh Le and contributors.
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import { assert } from "chai";

import { convertToCSSPrefix, removeVendorPrefix, matchTransitionProperty } from "./utils";

describe("utils.ts", () => {
  describe("removeVendorPrefix", () => {
    it("should remove webkit prefixes", () => {
      assert.strictEqual(
        removeVendorPrefix("-webkit-transform"),
        "transform"
      );
    });

    it("should remove mircosoft prefixes", () => {
      assert.strictEqual(
        removeVendorPrefix("-ms-transform"),
        "transform"
      );
    });

    it("should remove opera prefixes", () => {
      assert.strictEqual(
        removeVendorPrefix("-o-transform"),
        "transform"
      );
    });

    it("should remove mozilla prefixes", () => {
      assert.strictEqual(
        removeVendorPrefix("-moz-transform"),
        "transform"
      );
    });
  });

  describe("convertToCSSPrefix", () => {
    it("should convert webkit prefixes", () => {
      assert.strictEqual(
        convertToCSSPrefix("WebkitTransform"),
        "-webkit-transform"
      );
    });

    it("should convert opera prefixes", () => {
      assert.strictEqual(
        convertToCSSPrefix("OTransform"),
        "-o-transform"
      );
    });

    it("should convert microsoft prefixes", () => {
      assert.strictEqual(
        convertToCSSPrefix("msTransform"),
        "-ms-transform"
      );
    });

    it("should convert mozilla prefixes", () => {
      assert.strictEqual(
        convertToCSSPrefix("MozTransform"),
        "-moz-transform"
      );
    });
  });

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
});
