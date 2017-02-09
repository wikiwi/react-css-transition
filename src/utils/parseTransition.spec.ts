import { assert } from "chai";

import parseTransition from "./parseTransition";

describe("parseTransition", () => {
  it("should return first and last property", () => {
    const cases = [
      [
        "height 2ms 2s linear, width ease 10s 10ms",
        [
          { property: "width", duration: 10000, delay: 10 },
          { property: "width", duration: 10000, delay: 10 },
        ],
      ],
      [
        "height 3s 2s linear, width 1s 10ms",
        [
          { property: "width", duration: 1000, delay: 10 },
          { property: "height", duration: 3000, delay: 2000 },
        ],
      ],
      [
        "transform 100ms cubic-bezier(0.4, 0.0, 0.6, 1) 150ms",
        [
          { property: "transform", duration: 100, delay: 150 },
          { property: "transform", duration: 100, delay: 150 },
        ],
      ],
    ];
    cases.forEach((c) => assert.deepEqual(parseTransition(c[0] as string), c[1]));
  });
});
