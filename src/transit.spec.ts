import { assert } from "chai";
import { CSSProperties } from "react";

import { transit, resolveTransit } from "./transit";
import pick from "./utils/pick";

describe("transit.ts", () => {
  describe("transit", () => {
    it("should parse shorthand order", () => {
      const obj = transit("100px", 50, "linear", 30);
      assert.isArray(obj);
      assert.lengthOf(obj, 1);
      assert.strictEqual(obj[0], "100px");
      assert.deepEqual(obj.transitParams, { duration: 50, timing: "linear", delay: 30 });
    });

    it("should use defaults", () => {
      const obj = transit("100px", 30);
      assert.isArray(obj);
      assert.lengthOf(obj, 1);
      assert.strictEqual(obj[0], "100px");
      assert.deepEqual(obj.transitParams, { duration: 30, timing: "ease", delay: 0 });
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

      it("should set WebkitTransition", () => {
        assert.strictEqual((result as any).WebkitTransition, "width 50ms ease 20ms");
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

      it("should set WebkitTransition", () => {
        assert.strictEqual((result as any).WebkitTransition,
          "width 120ms ease 30ms, background 100ms linear 20ms");
      });

      it("should leave other properties untouched", () => {
        assert.strictEqual(result.height, "25px");
      });
    });

    describe("when processing style with multiple transition and vendor prefixes", () => {
      let style: CSSProperties;
      let result: CSSProperties;

      before(() => {
        style = {
          top: transit("50px", 50),
          WebkitTransform: transit("scale(1.0)", 50),
          MozTransform: transit("scale(1.0)", 50),
          transform: transit("scale(1.0)", 50),
        };
        result = resolveTransit(style);
      });

      it("should turn TransitionConfig to value", () => {
        assert.deepEqual(pick(result, ...Object.keys(style)), {
          top: "50px",
          WebkitTransform: "scale(1.0)",
          MozTransform: "scale(1.0)",
          transform: "scale(1.0)",
        });
      });

      it("should set transition with css prefix", () => {
        assert.strictEqual(result.transition,
          ["top", "-webkit-transform", "-moz-transform", "transform"].
            map((p) => `${p} 50ms ease 0ms`).
            join(", "),
        );
      });

      it("should set WebkitTransition", () => {
        assert.strictEqual((result as any).WebkitTransition,
          ["top", "-webkit-transform"].
            map((p) => `${p} 50ms ease 0ms`).
            join(", "),
        );
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
