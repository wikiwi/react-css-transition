/**
 * @license
 * Copyright (C) 2016-present Chi Vinh Le and contributors.
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import { assert } from "chai";

import memoize from "./memoize";

describe("memoize", () => {
  it("should memoize", () => {
    const cb = ({no}: any) => {
      return { no };
    };
    const memoized = memoize(cb, ({key}: any) => key);
    const a = memoized({ key: "a", no: 1 });
    const b = memoized({ key: "b", no: 2 });
    assert.deepEqual(a, { no: 1 });
    assert.deepEqual(b, { no: 2 });
    const a2 = memoized({ key: "a", no: 3 });
    assert.strictEqual(a, a2);
  });
});
