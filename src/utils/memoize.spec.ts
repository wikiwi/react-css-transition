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
