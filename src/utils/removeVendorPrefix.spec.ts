import { assert } from "chai";

import removeVendorPrefix from "./removeVendorPrefix";

describe("removeVendorPrefix", () => {
  it("should remove webkit prefixes", () => {
    assert.strictEqual(
      removeVendorPrefix("-webkit-transform"),
      "transform",
    );
  });

  it("should remove mircosoft prefixes", () => {
    assert.strictEqual(
      removeVendorPrefix("-ms-transform"),
      "transform",
    );
  });

  it("should remove opera prefixes", () => {
    assert.strictEqual(
      removeVendorPrefix("-o-transform"),
      "transform",
    );
  });

  it("should remove mozilla prefixes", () => {
    assert.strictEqual(
      removeVendorPrefix("-moz-transform"),
      "transform",
    );
  });
});
