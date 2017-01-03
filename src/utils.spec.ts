/**
 * @license
 * Copyright (C) 2016-present Chi Vinh Le and contributors.
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import { assert } from "chai";
import { spy } from "sinon";

import {
  convertToCSSPrefix, removeVendorPrefix,
  matchTransitionProperty, parseDuration,
  parseTransition,
  getAppearDelay, getEnterDelay, getLeaveDelay,
  runInFrame,
} from "./utils";

describe("utils.ts", () => {
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

  describe("getAppearDelay", () => {
    it("should process number", () => {
      assert.strictEqual(getAppearDelay(200), 200);
    });

    it("should process object", () => {
      assert.strictEqual(getAppearDelay({ appear: 100 }), 100);
    });

    it("should fallback to enter", () => {
      assert.strictEqual(getAppearDelay({ enter: 100 }), 100);
    });
  });

  describe("getEnterDelay", () => {
    it("should process number", () => {
      assert.strictEqual(getEnterDelay(200), 200);
    });

    it("should process object", () => {
      assert.strictEqual(getEnterDelay({ enter: 100 }), 100);
    });
  });

  describe("getLeaveDelay", () => {
    it("should process number", () => {
      assert.strictEqual(getLeaveDelay(200), 200);
    });

    it("should process object", () => {
      assert.strictEqual(getLeaveDelay({ leave: 100 }), 100);
    });
  });

  describe("runInFrame", () => {
    it("should call callback", (done) => {
      const cb = spy();
      runInFrame(1, cb);
      assert.isTrue(cb.notCalled);
      setTimeout(() => {
        assert.isTrue(cb.called);
        done();
      }, 50);
    });
    it("should cancel", (done) => {
      const cb = spy();
      const cancel = runInFrame(1, cb);
      assert.isTrue(cb.notCalled);
      cancel();
      setTimeout(() => {
        assert.isTrue(cb.notCalled);
        done();
      }, 50);
    });
  });
});
