/*
 * Copyright (C) 2016 Chi Vinh Le and contributors.
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import * as React from "react";

import { assert } from "chai";
import { ShallowWrapper, shallow } from "enzyme";
import { SinonSpy, spy } from "sinon";

import { CSSTransition, CSSTransitionProps } from "./csstransition";
import { transit } from "./transit";

describe("csstransition.tsx", () => {

  describe("<CSSTransition>", () => {
    const activeStyle: React.CSSProperties = { width: "100px" };
    const defaultStyle: React.CSSProperties = { width: "50px" };
    const enterStyle: React.CSSProperties = { width: transit("100px", { duration: 50 }) };
    const leaveStyle: React.CSSProperties = { width: transit("50px", { duration: 50 }) };
    let onTransitionComplete: SinonSpy;
    let getWrapper: (props?: CSSTransitionProps) => ShallowWrapper<any, {}>;
    let wrapper: ShallowWrapper<any, {}>;

    before(() => {
      getWrapper = (props?) => shallow(<CSSTransition {...props}>dummy</CSSTransition>);
    });

    it("should render a TransitionObserver", () => {
      assert.strictEqual((getWrapper().type() as any).name, "TransitionObserver");
    });

    it("should pass down unknown props", () => {
      const { id } = getWrapper({ id: "abc" }).props();
      assert.strictEqual(id, "abc");
    });

    describe("transition default -> active", () => {
      before(() => {
        onTransitionComplete = spy();
        wrapper = getWrapper({ activeStyle, enterStyle, leaveStyle, defaultStyle, onTransitionComplete });
      });

      it("should start with default style", () => {
        const style = wrapper.props().style;
        assert.deepEqual(style, defaultStyle);
      });

      describe("when transition was triggered", () => {
        before(() => {
          wrapper.setProps({ active: true });
        });

        it("should begin transition", () => {
          const style = wrapper.props().style;
          assert.deepEqual(style, enterStyle);
        });

        describe("when transition starts", () => {
          before(() => {
            wrapper.simulate("transitionStart");
          });

          it("should ignore", () => {
            const style = wrapper.props().style;
            assert.deepEqual(style, enterStyle);
          });

          it("should not call onTransitionComplete yet", () => {
            assert.isTrue(onTransitionComplete.notCalled);
          });
        });

        describe("when transition ends", () => {
          before(() => {
            wrapper.simulate("transitionComplete");
          });

          it("should become active", () => {
            const style = wrapper.props().style;
            assert.deepEqual(style, activeStyle);
          });

          it("should call onTransitionComplete", () => {
            assert.isTrue(onTransitionComplete.calledOnce);
          });
        });
      });
    });

    describe("transition active -> default", () => {
      before(() => {
        onTransitionComplete = spy();
        wrapper = getWrapper({
          activeStyle, enterStyle, leaveStyle, defaultStyle,
          onTransitionComplete,
          active: true,
        });
      });

      it("should start with active style", () => {
        const style = wrapper.props().style;
        assert.deepEqual(style, activeStyle);
      });

      describe("when transition was triggered", () => {
        before(() => {
          wrapper.setProps({ active: false });
        });

        it("should begin transition", () => {
          const style = wrapper.props().style;
          assert.deepEqual(style, leaveStyle);
        });

        describe("when transition starts", () => {
          before(() => {
            wrapper.simulate("transitionStart");
          });

          it("should ignore", () => {
            const style = wrapper.props().style;
            assert.deepEqual(style, leaveStyle);
          });

          it("should not call onTransitionComplete yet", () => {
            assert.isTrue(onTransitionComplete.notCalled);
          });
        });

        describe("when transition ends", () => {
          before(() => {
            wrapper.simulate("transitionComplete");
          });

          it("should become default", () => {
            const style = wrapper.props().style;
            assert.deepEqual(style, defaultStyle);
          });

          it("should call onTransitionComplete", () => {
            assert.isTrue(onTransitionComplete.calledOnce);
          });
        });
      });
    });

    describe("transition default -> active interrupted before start", () => {
      before(() => {
        onTransitionComplete = spy();
        wrapper = getWrapper({
          activeStyle, enterStyle, leaveStyle, defaultStyle,
          onTransitionComplete,
          active: false,
        });
      });

      it("should start with default style", () => {
        const style = wrapper.props().style;
        assert.deepEqual(style, defaultStyle);
      });

      describe("when transition was triggered", () => {
        before(() => {
          wrapper.setProps({ active: true });
        });

        it("should begin transition", () => {
          const style = wrapper.props().style;
          assert.deepEqual(style, enterStyle);
        });

        it("should not call onTransitionComplete yet", () => {
          assert.isTrue(onTransitionComplete.notCalled);
        });

        describe("when transition was reverted", () => {
          before(() => {
            wrapper.setProps({ active: false });
          });

          it("should become default", () => {
            const style = wrapper.props().style;
            assert.deepEqual(style, defaultStyle);
          });

          it("should call onTransitionComplete", () => {
            assert.isTrue(onTransitionComplete.calledOnce);
          });
        });
      });
    });

    describe("transition active -> default interrupted before start", () => {
      before(() => {
        onTransitionComplete = spy();
        wrapper = getWrapper({
          activeStyle, enterStyle, leaveStyle, defaultStyle,
          onTransitionComplete,
          active: true,
        });
      });

      it("should start with default style", () => {
        const style = wrapper.props().style;
        assert.deepEqual(style, activeStyle);
      });

      describe("when transition was triggered", () => {
        before(() => {
          wrapper.setProps({ active: false });
        });

        it("should begin transition", () => {
          const style = wrapper.props().style;
          assert.deepEqual(style, leaveStyle);
        });

        it("should not call onTransitionComplete yet", () => {
          assert.isTrue(onTransitionComplete.notCalled);
        });

        describe("when transition was reverted", () => {
          before(() => {
            wrapper.setProps({ active: true });
          });

          it("should become active", () => {
            const style = wrapper.props().style;
            assert.deepEqual(style, activeStyle);
          });

          it("should call onTransitionComplete", () => {
            assert.isTrue(onTransitionComplete.calledOnce);
          });
        });
      });
    });

    describe("transition default -> active interrupted after start", () => {
      before(() => {
        onTransitionComplete = spy();
        wrapper = getWrapper({
          activeStyle, enterStyle, leaveStyle, defaultStyle,
          onTransitionComplete,
          active: false,
        });
      });

      it("should start with default style", () => {
        const style = wrapper.props().style;
        assert.deepEqual(style, defaultStyle);
      });

      describe("when transition was triggered", () => {
        before(() => {
          wrapper.setProps({ active: true });
        });

        it("should begin transition", () => {
          const style = wrapper.props().style;
          assert.deepEqual(style, enterStyle);
        });

        describe("when transition starts", () => {
          before(() => {
            wrapper.simulate("transitionStart");
          });

          it("should ignore", () => {
            const style = wrapper.props().style;
            assert.deepEqual(style, enterStyle);
          });
        });

        describe("when transition was reverted", () => {
          before(() => {
            wrapper.setProps({ active: false });
          });

          it("should start a reverse transition", () => {
            const style = wrapper.props().style;
            assert.deepEqual(style, leaveStyle);
          });

          describe("when transition starts", () => {
            before(() => {
              wrapper.simulate("transitionStart");
            });

            it("should ignore", () => {
              const style = wrapper.props().style;
              assert.deepEqual(style, leaveStyle);
            });

            it("should not call onTransitionComplete yet", () => {
              assert.isTrue(onTransitionComplete.notCalled);
            });
          });

          describe("when transition ends", () => {
            before(() => {
              wrapper.simulate("transitionComplete");
            });

            it("should become default", () => {
              const style = wrapper.props().style;
              assert.deepEqual(style, defaultStyle);
            });

            it("should call onTransitionComplete", () => {
              assert.isTrue(onTransitionComplete.calledOnce);
            });
          });
        });
      });
    });

    describe("transition active -> default interrupted after start", () => {
      before(() => {
        onTransitionComplete = spy();
        wrapper = getWrapper({
          activeStyle, enterStyle, leaveStyle, defaultStyle,
          onTransitionComplete,
          active: true,
        });
      });

      it("should start with active style", () => {
        const style = wrapper.props().style;
        assert.deepEqual(style, activeStyle);
      });

      describe("when transition was triggered", () => {
        before(() => {
          wrapper.setProps({ active: false });
        });

        it("should begin transition", () => {
          const style = wrapper.props().style;
          assert.deepEqual(style, leaveStyle);
        });

        describe("when transition starts", () => {
          before(() => {
            wrapper.simulate("transitionStart");
          });

          it("should ignore", () => {
            const style = wrapper.props().style;
            assert.deepEqual(style, leaveStyle);
          });
        });

        describe("when transition was reverted", () => {
          before(() => {
            wrapper.setProps({ active: true });
          });

          it("should start a reverse transition", () => {
            const style = wrapper.props().style;
            assert.deepEqual(style, enterStyle);
          });

          describe("when transition starts", () => {
            before(() => {
              wrapper.simulate("transitionStart");
            });

            it("should ignore", () => {
              const style = wrapper.props().style;
              assert.deepEqual(style, enterStyle);
            });

            it("should not call onTransitionComplete yet", () => {
              assert.isTrue(onTransitionComplete.notCalled);
            });
          });

          describe("when transition ends", () => {
            before(() => {
              wrapper.simulate("transitionComplete");
            });

            it("should become active", () => {
              const style = wrapper.props().style;
              assert.deepEqual(style, activeStyle);
            });

            it("should call onTransitionComplete", () => {
              assert.isTrue(onTransitionComplete.calledOnce);
            });
          });
        });
      });
    });

    describe("transition appear", () => {
      before(() => {
        onTransitionComplete = spy();
        wrapper = getWrapper({
          activeStyle, enterStyle, leaveStyle, defaultStyle,
          onTransitionComplete,
          active: true,
          transitionAppear: true,
        });
      });

      it("should start with default style", () => {
        const style = wrapper.props().style;
        assert.deepEqual(style, defaultStyle);
      });

      describe("after mount", () => {
        before(() => {
          (wrapper.instance() as any).componentDidMount();
        });

        it("should automatically trigger transition", (done) => {
          setTimeout(() => {
            const style = wrapper.update().props().style;
            assert.deepEqual(style, enterStyle);
            done();
          }, 50);
        });

        describe("when transition starts", () => {
          before(() => {
            wrapper.simulate("transitionStart");
          });

          it("should ignore", () => {
            const style = wrapper.props().style;
            assert.deepEqual(style, enterStyle);
          });

          it("should not call onTransitionComplete yet", () => {
            assert.isTrue(onTransitionComplete.notCalled);
          });
        });

        describe("when transition ends", () => {
          before(() => {
            wrapper.simulate("transitionComplete");
          });

          it("should become default", () => {
            const style = wrapper.props().style;
            assert.deepEqual(style, activeStyle);
          });

          it("should call onTransitionComplete", () => {
            assert.isTrue(onTransitionComplete.calledOnce);
          });
        });
      });
    });

    describe("transition appear interrupted", () => {
      before(() => {
        onTransitionComplete = spy();
        wrapper = getWrapper({
          activeStyle, enterStyle, leaveStyle, defaultStyle,
          onTransitionComplete,
          active: true,
          transitionAppear: true,
        });
      });

      it("should start with default style", () => {
        const style = wrapper.props().style;
        assert.deepEqual(style, defaultStyle);
      });

      describe("after mount", () => {
        before(() => {
          (wrapper.instance() as any).componentDidMount();
        });

        it("should not call onTransitionComplete yet", () => {
          assert.isTrue(onTransitionComplete.notCalled);
        });

        describe("when transition was interrupted", () => {
          before(() => {
            wrapper.setProps({ active: false });
          });

          it("should remain in default", () => {
            const style = wrapper.props().style;
            assert.deepEqual(style, defaultStyle);
          });

          it("should continue to remain in default after TICK", (done) => {
            setTimeout(() => {
              const style = wrapper.update().props().style;
              assert.deepEqual(style, defaultStyle);
              done();
            }, 50);
          });

          it("should call onTransitionComplete", () => {
            assert.isTrue(onTransitionComplete.calledOnce);
          });
        });
      });
    });
  });
});
