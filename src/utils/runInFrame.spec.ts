/**
 * @license
 * Copyright (C) 2016-present Chi Vinh Le and contributors.
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import { assert } from "chai";
import { spy } from "sinon";

import runInFrame from "./runInFrame";

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
