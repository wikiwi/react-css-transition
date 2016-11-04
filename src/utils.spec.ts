/*
 * Copyright (C) 2016 Chi Vinh Le and contributors.
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import { assert } from "chai";

import { removeVendorPrefix } from "./utils";

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
});
