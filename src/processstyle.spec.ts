/**
 * @license
 * Copyright (C) 2016 Chi Vinh Le and contributors.
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import { assert } from "chai";

import { ProcessResult, processStyle } from "./processstyle";
import { transit } from "./transit";

describe("processstyle.ts", () => {
  describe("processStyle()", () => {
    describe("when processing style with a single transition", () => {
      let style: React.CSSProperties;
      let result: ProcessResult;

      before(() => {
        style = {
          width: transit("50px", 50, "ease", 20),
          height: "25px",
        };
        result = processStyle(style);
      });

      it("should turn TransitionConfig to value", () => {
        assert.strictEqual(result.style.width, "50px");
      });

      it("should set transition", () => {
        assert.strictEqual(result.style.transition, "width 50ms ease 20ms");
      });

      it("should leave other properties untouched", () => {
        assert.strictEqual(result.style.height, "25px");
      });

      it("should return first property to transition", () => {
        assert.strictEqual(result.firstProperty, "width");
      });

      it("should return first property's transition delay", () => {
        assert.strictEqual(result.firstPropertyDelay, 20);
      });

      it("should return last property to transition", () => {
        assert.strictEqual(result.lastProperty, "width");
      });
    });

    describe("when processing style with multiple transitions", () => {
      let style: React.CSSProperties;
      let result: ProcessResult;

      before(() => {
        style = {
          width: transit("50px", 120, "ease", 30),
          background: transit("red", 100, "linear", 20),
          height: "25px",
        };
        result = processStyle(style);
      });

      it("should turn TransitionConfig to value", () => {
        assert.strictEqual(result.style.width, "50px");
        assert.strictEqual(result.style.background, "red");
      });

      it("should set transition", () => {
        assert.strictEqual(result.style.transition,
          "width 120ms ease 30ms, background 100ms linear 20ms");
      });

      it("should leave other properties untouched", () => {
        assert.strictEqual(result.style.height, "25px");
      });

      it("should return first property to transition", () => {
        assert.strictEqual(result.firstProperty, "background");
      });

      it("should return first property's transition delay", () => {
        assert.strictEqual(result.firstPropertyDelay, 20);
      });

      it("should return last property to transition", () => {
        assert.strictEqual(result.lastProperty, "width");
      });
    });

    describe("when processing style with single transition and vendor prefix", () => {
      let style: React.CSSProperties;
      let result: ProcessResult;

      before(() => {
        style = {
          WebkitTransform: transit("50px", 50, "ease", 20),
        };
        result = processStyle(style);
      });

      it("should turn TransitionConfig to value", () => {
        assert.strictEqual(result.style["WebkitTransform"], "50px");
      });

      it("should set transition with css prefix", () => {
        assert.strictEqual(result.style.transition, "-webkit-transform 50ms ease 20ms");
      });
    });
  });
});
