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
