/**
 * @license
 * Copyright (C) 2016-present Chi Vinh Le and contributors.
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import { assert } from "chai";

import parseComputedTransition from "./parseComputedTransition";

describe("parseComputedTransition", () => {
  it("should return first and last property", () => {
    const cases = [
      [
        {
          transitionProperty: "height, width",
          transitionDuration: "2ms, 10s",
          transitionDelay: "2s, 10ms",
          transitionTimingFunction: "linear, ease",
        },
        [
          { property: "width", duration: 10000, delay: 10 },
          { property: "width", duration: 10000, delay: 10 },
        ],
      ],
      [
        {
          transitionProperty: "height, width",
          transitionDuration: "3s, 1s",
          transitionDelay: "2s, 10ms",
          transitionTimingFunction: "linear, ease",
        },
        [
          { property: "width", duration: 1000, delay: 10 },
          { property: "height", duration: 3000, delay: 2000 },
        ],
      ],
    ];
    cases.forEach((c) => assert.deepEqual(parseComputedTransition(c[0]), c[1]));
  });
});
