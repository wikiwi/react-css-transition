/**
 * @license
 * Copyright (C) 2016 Chi Vinh Le and contributors.
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

/* tslint:disable: variable-name */

import * as rewire from "rewire";
import { assert } from "chai";

import * as transitModule from "./transit";
import { TransitionConfig } from "./transit";

const rewireModule = rewire("./transit");
const { transit } = rewireModule as any as typeof transitModule;

describe("transit.ts", () => {
  let warning: string;
  let resetRewire: Function;

  beforeEach(() => {
    resetRewire = rewireModule.__set__("warning", (condition: any, message: string) => {
      if (!condition) {
        warning = message;
      }
    });
  });

  afterEach(() => {
    resetRewire();
    warning = undefined;
  });

  describe("transit", () => {
    it("should parse parameter object", () => {
      const params = { duration: 50, timing: "linear", delay: 30 };
      const config = transit("100px", params) as TransitionConfig;
      assert.strictEqual(config.value, "100px");
      assert.deepEqual(config.params, params);
    });

    it("should parse shorthand order", () => {
      const config = transit("100px", 50, "linear", 30) as TransitionConfig;
      assert.strictEqual(config.value, "100px");
      assert.deepEqual(config.params, { duration: 50, timing: "linear", delay: 30 });
    });

    it("should use defaults", () => {
      const params = { duration: 30 };
      const config = transit("100px", params) as TransitionConfig;
      assert.strictEqual(config.value, "100px");
      assert.deepEqual(config.params, { duration: 30, timing: "ease", delay: 0 });
    });

    describe("when providing duration of invalid type", () => {
      it("should log warning", () => {
        for (const val of [undefined, "invalid"]) {
          transit("100px", val as any);
          assert.strictEqual(warning, "[react-css-transition] Invalid parameter '%s'.");
          warning = undefined;
        }
      });
    });
  });
});
