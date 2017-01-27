import { assert } from "chai";

import convertToCSSPrefix from "./convertToCSSPrefix";

describe("convertToCSSPrefix", () => {
  it("should convert webkit prefixes", () => {
    assert.strictEqual(
      convertToCSSPrefix("WebkitTransform"),
      "-webkit-transform",
    );
  });

  it("should convert opera prefixes", () => {
    assert.strictEqual(
      convertToCSSPrefix("OTransform"),
      "-o-transform",
    );
  });

  it("should convert microsoft prefixes", () => {
    assert.strictEqual(
      convertToCSSPrefix("msTransform"),
      "-ms-transform",
    );
  });

  it("should convert mozilla prefixes", () => {
    assert.strictEqual(
      convertToCSSPrefix("MozTransform"),
      "-moz-transform",
    );
  });
});
