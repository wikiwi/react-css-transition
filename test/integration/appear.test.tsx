import * as React from "react";
import { CSSProperties } from "react";
import { ReactWrapper, mount } from "enzyme";
import { assert } from "chai";
import { SinonSpy, spy } from "sinon";

import { createTestDiv, runInFrame } from "../utils";
import { CSSTransitionProps, CSSTransition, transit } from "../../src";

describe("appear integration test", () => {
  describe("<CSSTransition>", () => {
    const activeStyle: CSSProperties = { width: "100px" };
    const defaultStyle: CSSProperties = { width: "50px" };
    const appearStyle: CSSProperties = { width: transit("100px", 150, "ease", 25) };
    const leaveStyle: CSSProperties = { width: transit("50px", 150, "ease", 25) };
    const appearStyleProcessed: CSSProperties = { width: "100px", transition: "width 150ms ease 25ms" };
    let onTransitionComplete: SinonSpy;
    let getWrapper: (props?: CSSTransitionProps) => ReactWrapper<any, {}>;

    before(() => {
      const render = (props?: CSSTransitionProps) => (
        <CSSTransition {...props}>
          <span>dummy</span>
        </CSSTransition>
      );
      getWrapper = (props?: CSSTransitionProps) => mount(render(props), { attachTo: createTestDiv() });
    });

    describe("transition appear", () => {
      let wrapper: ReactWrapper<any, {}>;
      let target: ReactWrapper<any, {}>;

      before(() => {
        onTransitionComplete = spy();
        wrapper = getWrapper({
          activeStyle, appearStyle, leaveStyle, defaultStyle,
          onTransitionComplete,
          active: true,
          transitionAppear: true,
        });
        target = wrapper.find("div");
      });

      after(() => {
        wrapper.detach();
      });

      it("should start with default style", () => {
        const style = target.props().style;
        assert.deepEqual(style, defaultStyle);
      });

      describe("after mount", () => {
        before((done) => runInFrame(1, () => done()));

        it("should automatically trigger transition", () => {
          const style = target.props().style;
          assert.deepEqual(style, appearStyleProcessed);
        });

        describe("when transition starts", () => {
          before((done) => setTimeout(() => done(), 100));

          it("should ignore", () => {
            const style = target.props().style;
            assert.deepEqual(style, appearStyleProcessed);
          });

          it("should not call onTransitionComplete yet", () => {
            assert.isTrue(onTransitionComplete.notCalled);
          });
        });

        describe("when transition ends", () => {
          before((done) => setTimeout(() => done(), 100));

          it("should become default", () => {
            const style = target.props().style;
            assert.deepEqual(style, activeStyle);
          });

          it("should call onTransitionComplete", () => {
            assert.isTrue(onTransitionComplete.calledOnce);
          });
        });
      });
    });

    describe("transition appear interrupted", () => {
      let wrapper: ReactWrapper<any, {}>;
      let target: ReactWrapper<any, {}>;

      before(() => {
        onTransitionComplete = spy();
        wrapper = getWrapper({
          activeStyle, appearStyle, leaveStyle, defaultStyle,
          onTransitionComplete,
          active: true,
          transitionAppear: true,
        });
        target = wrapper.find("div");
      });

      after(() => {
        wrapper.detach();
      });

      it("should start with default style", () => {
        const style = target.props().style;
        assert.deepEqual(style, defaultStyle);
      });

      describe("after mount", () => {
        it("should not call onTransitionComplete yet", () => {
          assert.isTrue(onTransitionComplete.notCalled);
        });

        describe("when transition was interrupted", () => {
          before(() => {
            wrapper.setProps({ active: false });
          });

          it("should remain in default", () => {
            const style = target.props().style;
            assert.deepEqual(style, defaultStyle);
          });

          it("should continue to remain in default", (done) => {
            setTimeout(() => {
              const style = target.props().style;
              assert.deepEqual(style, defaultStyle);
              done();
            }, 100);
          });

          it("should call onTransitionComplete", () => {
            assert.isTrue(onTransitionComplete.calledOnce);
          });
        });
      });
    });

  });
});
