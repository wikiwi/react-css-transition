/**
 * @license
 * Copyright (C) 2016-present Chi Vinh Le and contributors.
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */
import { assert } from "chai";
import { CSSProperties } from "react";

import { transit, resolveTransit } from "./transit";

describe("transit.ts", () => {
  describe("transit", () => {
    it("should parse shorthand order", () => {
      const config = transit("100px", 50, "linear", 30);
      assert.strictEqual(config.value, "100px");
      assert.deepEqual(config.params, { duration: 50, timing: "linear", delay: 30 });
    });

    it("should use defaults", () => {
      const config = transit("100px", 30);
      assert.strictEqual(config.value, "100px");
      assert.deepEqual(config.params, { duration: 30, timing: "ease", delay: 0 });
    });
  });
  describe("resolveTransit()", () => {
    describe("when processing style with a single transition", () => {
      let style: CSSProperties;
      let result: CSSProperties;

      before(() => {
        style = {
          width: transit("50px", 50, "ease", 20),
          height: "25px",
        };
        result = resolveTransit(style);
      });

      it("should turn TransitionConfig to value", () => {
        assert.strictEqual(result.width, "50px");
      });

      it("should set transition", () => {
        assert.strictEqual(result.transition, "width 50ms ease 20ms");
      });

      it("should leave other properties untouched", () => {
        assert.strictEqual(result.height, "25px");
      });
    });

    describe("when processing style with multiple transitions", () => {
      let style: CSSProperties;
      let result: CSSProperties;

      before(() => {
        style = {
          width: transit("50px", 120, "ease", 30),
          background: transit("red", 100, "linear", 20),
          height: "25px",
        };
        result = resolveTransit(style);
      });

      it("should turn TransitionConfig to value", () => {
        assert.strictEqual(result.width, "50px");
        assert.strictEqual(result.background, "red");
      });

      it("should set transition", () => {
        assert.strictEqual(result.transition,
          "width 120ms ease 30ms, background 100ms linear 20ms");
      });

      it("should leave other properties untouched", () => {
        assert.strictEqual(result.height, "25px");
      });
    });

    describe("when processing style with single transition and vendor prefix", () => {
      let style: CSSProperties;
      let result: CSSProperties;

      before(() => {
        style = {
          WebkitTransform: transit("50px", 50, "ease", 20),
        };
        result = resolveTransit(style);
      });

      it("should turn TransitionConfig to value", () => {
        assert.strictEqual(result["WebkitTransform"], "50px");
      });

      it("should set transition with css prefix", () => {
        assert.strictEqual(result.transition, "-webkit-transform 50ms ease 20ms");
      });
    });

    describe("when processing style with extra delay", () => {
      let style: CSSProperties;
      let result: CSSProperties;

      before(() => {
        style = {
          width: transit("50px", 120, "ease", 30),
          background: transit("red", 100, "linear", 20),
          height: "25px",
        };
        result = resolveTransit(style, 20);
      });

      it("should turn TransitionConfig to value", () => {
        assert.strictEqual(result.width, "50px");
        assert.strictEqual(result.background, "red");
      });

      it("should set transition", () => {
        assert.strictEqual(result.transition,
          "width 120ms ease 50ms, background 100ms linear 40ms");
      });

      it("should leave other properties untouched", () => {
        assert.strictEqual(result.height, "25px");
      });
    });
  });
});
