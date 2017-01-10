/**
 * @license
 * Copyright (C) 2016-present Chi Vinh Le and contributors.
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

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
    ];
    cases.forEach((c) => assert.deepEqual(parseTransition(c[0] as string), c[1]));
  });
});
