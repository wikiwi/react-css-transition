/**
 * @license
 * Copyright (C) 2016 Chi Vinh Le and contributors.
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import * as React from "react";
import { CSSProperties } from "react";
import { ReactWrapper, mount } from "enzyme";
import { assert } from "chai";
import { SinonSpy, spy } from "sinon";

import { createTestDiv } from "../utils";
import { CSSTransitionProps, CSSTransition, transit } from "../../src";

const TICK = 17;

describe("basic integration test", () => {
  describe("<CSSTransition>", () => {
    const activeStyle: CSSProperties = { width: "100px" };
    const defaultStyle: CSSProperties = { width: "50px" };
    const enterStyle: CSSProperties = { width: transit("100px", 150, "ease", 25) };
    const leaveStyle: CSSProperties = { width: transit("50px", 150, "ease", 25) };
    const enterStyleProcessed: CSSProperties = { width: "100px", transition: "width 150ms ease 25ms" };
    const leaveStyleProcessed: CSSProperties = { width: "50px", transition: "width 150ms ease 25ms" };
    let onTransitionComplete: SinonSpy;
    let getWrapper: (props?: CSSTransitionProps) => ReactWrapper<any, {}>;
    let getWrapperAttached: (props?: CSSTransitionProps) => ReactWrapper<any, {}>;

    before(() => {
      const render = (props?: CSSTransitionProps) => (
        <CSSTransition {...props}>
          <span>dummy</span>
        </CSSTransition>
      );
      getWrapper = (props?: CSSTransitionProps) => mount(render(props));
      getWrapperAttached = (props?: CSSTransitionProps) => mount(render(props), { attachTo: createTestDiv() });
    });

    it("should render dummy text", () => {
      assert.strictEqual(getWrapper().text(), "dummy");
    });

    it("should render div", () => {
      assert.lengthOf(getWrapper().find("div"), 1);
    });

    it("should pass down unknown props", () => {
      const wrapper = getWrapper({ id: "abc" });
      const div = wrapper.find("#abc");
      assert.lengthOf(div, 1);
      assert.strictEqual(div.type(), "div");
    });

    describe("transition default -> active", () => {
      let wrapper: ReactWrapper<any, {}>;
      let target: ReactWrapper<any, {}>;

      before(() => {
        onTransitionComplete = spy();
        wrapper = getWrapperAttached({
          activeStyle,
          enterStyle,
          leaveStyle,
          defaultStyle,
          onTransitionComplete,
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

      describe("when transition was triggered", () => {
        before((done) => {
          // Trigger after a small delay to allow component
          // to be properly mounted into DOM.
          setTimeout(() => {
            wrapper.setProps({ active: true });
            done();
          }, TICK);
        });

        it("should begin transition", () => {
          const style = target.props().style;
          assert.deepEqual(style, enterStyleProcessed);
        });

        describe("when transition starts", () => {
          before((done) => {
            setTimeout(() => {
              done();
            }, 100);
          });

          it("should ignore", () => {
            const style = target.props().style;
            assert.deepEqual(style, enterStyleProcessed);
          });

          it("should not call onTransitionComplete yet", () => {
            assert.isTrue(onTransitionComplete.notCalled);
          });
        });

        describe("when transition ends", () => {
          before((done) => {
            setTimeout(() => {
              done();
            }, 100);
          });

          it("should become active", () => {
            const style = target.props().style;
            assert.deepEqual(style, activeStyle);
          });

          it("should call onTransitionComplete", () => {
            assert.isTrue(onTransitionComplete.calledOnce);
          });
        });
      });
    });

    describe("transition active -> default", () => {
      let wrapper: ReactWrapper<any, {}>;
      let target: ReactWrapper<any, {}>;

      before(() => {
        onTransitionComplete = spy();
        wrapper = getWrapperAttached({
          activeStyle, enterStyle, leaveStyle, defaultStyle, onTransitionComplete,
          active: true,
        });
        target = wrapper.find("div");
      });

      after(() => {
        wrapper.detach();
      });

      it("should start with active style", () => {
        const style = target.props().style;
        assert.deepEqual(style, activeStyle);
      });

      describe("when transition was triggered", () => {
        before((done) => {
          // Trigger after a small delay to allow component
          // to be properly mounted into DOM.
          setTimeout(() => {
            wrapper.setProps({ active: false });
            done();
          }, TICK);
        });

        it("should begin transition", () => {
          const style = target.props().style;
          assert.deepEqual(style, leaveStyleProcessed);
        });

        describe("when transition starts", () => {
          before((done) => {
            setTimeout(() => {
              done();
            }, 100);
          });

          it("should ignore", () => {
            const style = target.props().style;
            assert.deepEqual(style, leaveStyleProcessed);
          });

          it("should not call onTransitionComplete yet", () => {
            assert.isTrue(onTransitionComplete.notCalled);
          });
        });

        describe("when transition ends", () => {
          before((done) => {
            setTimeout(() => {
              done();
            }, 100);
          });

          it("should become default", () => {
            const style = target.props().style;
            assert.deepEqual(style, defaultStyle);
          });

          it("should call onTransitionComplete", () => {
            assert.isTrue(onTransitionComplete.calledOnce);
          });
        });
      });
    });

    describe("transition default -> active interrupted before start", () => {
      let wrapper: ReactWrapper<any, {}>;
      let target: ReactWrapper<any, {}>;

      before(() => {
        onTransitionComplete = spy();
        wrapper = getWrapperAttached({
          activeStyle, enterStyle, leaveStyle, defaultStyle,
          onTransitionComplete,
          active: false,
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

      describe("when transition was triggered", () => {
        before(() => {
          wrapper.setProps({ active: true });
        });

        it("should begin transition", () => {
          const style = target.props().style;
          assert.deepEqual(style, enterStyleProcessed);
        });

        it("should not call onTransitionComplete yet", () => {
          assert.isTrue(onTransitionComplete.notCalled);
        });

        describe("when transition was reverted", () => {
          before(() => {
            wrapper.setProps({ active: false });
          });

          it("should become default", () => {
            const style = target.props().style;
            assert.deepEqual(style, defaultStyle);
          });

          it("should call onTransitionComplete", () => {
            assert.isTrue(onTransitionComplete.calledOnce);
          });
        });
      });
    });

    describe("transition active -> default interrupted before start", () => {
      let wrapper: ReactWrapper<any, {}>;
      let target: ReactWrapper<any, {}>;

      before(() => {
        onTransitionComplete = spy();
        wrapper = getWrapperAttached({
          activeStyle, enterStyle, leaveStyle, defaultStyle,
          onTransitionComplete,
          active: true,
        });
        target = wrapper.find("div");
      });

      after(() => {
        wrapper.detach();
      });

      it("should start with default style", () => {
        const style = target.props().style;
        assert.deepEqual(style, activeStyle);
      });

      describe("when transition was triggered", () => {
        before(() => {
          wrapper.setProps({ active: false });
        });

        it("should begin transition", () => {
          const style = target.props().style;
          assert.deepEqual(style, leaveStyleProcessed);
        });

        it("should not call onTransitionComplete yet", () => {
          assert.isTrue(onTransitionComplete.notCalled);
        });

        describe("when transition was reverted", () => {
          before(() => {
            wrapper.setProps({ active: true });
          });

          it("should become active", () => {
            const style = target.props().style;
            assert.deepEqual(style, activeStyle);
          });

          it("should call onTransitionComplete", () => {
            assert.isTrue(onTransitionComplete.calledOnce);
          });
        });
      });
    });

    describe("transition default -> active interrupted after start", () => {
      let wrapper: ReactWrapper<any, {}>;
      let target: ReactWrapper<any, {}>;

      before(() => {
        onTransitionComplete = spy();
        wrapper = getWrapperAttached({
          activeStyle, enterStyle, leaveStyle, defaultStyle,
          onTransitionComplete,
          active: false,
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

      describe("when transition was triggered", () => {
        before((done) => {
          // Trigger after a small delay to allow component
          // to be properly mounted into DOM.
          setTimeout(() => {
            wrapper.setProps({ active: true });
            done();
          }, TICK);
        });

        it("should begin transition", () => {
          const style = target.props().style;
          assert.deepEqual(style, enterStyleProcessed);
        });

        describe("when transition starts", () => {
          before((done) => {
            setTimeout(() => {
              done();
            }, 100);
          });

          it("should ignore", () => {
            const style = target.props().style;
            assert.deepEqual(style, enterStyleProcessed);
          });
        });

        describe("when transition was reverted", () => {
          before(() => {
            wrapper.setProps({ active: false });
          });

          it("should start a reverse transition", () => {
            const style = target.props().style;
            assert.deepEqual(style, leaveStyleProcessed);
          });

          describe("when transition starts", () => {
            before((done) => {
              setTimeout(() => {
                done();
              }, 100);
            });

            it("should ignore", () => {
              const style = target.props().style;
              assert.deepEqual(style, leaveStyleProcessed);
            });

            it("should not call onTransitionComplete yet", () => {
              assert.isTrue(onTransitionComplete.notCalled);
            });
          });

          describe("when transition ends", () => {
            before((done) => {
              setTimeout(() => {
                done();
              }, 100);
            });

            it("should become default", () => {
              const style = target.props().style;
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
      let wrapper: ReactWrapper<any, {}>;
      let target: ReactWrapper<any, {}>;

      before(() => {
        onTransitionComplete = spy();
        wrapper = getWrapperAttached({
          activeStyle, enterStyle, leaveStyle, defaultStyle,
          onTransitionComplete,
          active: true,
        });
        target = wrapper.find("div");
      });

      after(() => {
        wrapper.detach();
      });

      it("should start with active style", () => {
        const style = target.props().style;
        assert.deepEqual(style, activeStyle);
      });

      describe("when transition was triggered", () => {
        before((done) => {
          // Trigger after a small delay to allow component
          // to be properly mounted into DOM.
          setTimeout(() => {
            wrapper.setProps({ active: false });
            done();
          }, TICK);
        });

        it("should begin transition", () => {
          const style = target.props().style;
          assert.deepEqual(style, leaveStyleProcessed);
        });

        describe("when transition starts", () => {
          before((done) => {
            setTimeout(() => {
              done();
            }, 100);
          });

          it("should ignore", () => {
            const style = target.props().style;
            assert.deepEqual(style, leaveStyleProcessed);
          });
        });

        describe("when transition was reverted", () => {
          before(() => {
            wrapper.setProps({ active: true });
          });

          it("should start a reverse transition", () => {
            const style = target.props().style;
            assert.deepEqual(style, enterStyleProcessed);
          });

          describe("when transition starts", () => {
            before((done) => {
              setTimeout(() => {
                done();
              }, 100);
            });

            it("should ignore", () => {
              const style = target.props().style;
              assert.deepEqual(style, enterStyleProcessed);
            });

            it("should not call onTransitionComplete yet", () => {
              assert.isTrue(onTransitionComplete.notCalled);
            });
          });

          describe("when transition ends", () => {
            before((done) => {
              setTimeout(() => {
                done();
              }, 100);
            });

            it("should become active", () => {
              const style = target.props().style;
              assert.deepEqual(style, activeStyle);
            });

            it("should call onTransitionComplete", () => {
              assert.isTrue(onTransitionComplete.calledOnce);
            });
          });
        });
      });
    });
  });
});
