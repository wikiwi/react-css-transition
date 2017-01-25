/**
 * @license
 * Copyright (C) 2016-present Chi Vinh Le and contributors.
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import * as React from "react";

import { assert } from "chai";
import { ShallowWrapper, shallow } from "enzyme";
import { SinonSpy, spy } from "sinon";

import {
  CSSTransitionGroup, CSSTransitionGroupProps,
  CSSTransitionGroupChild, CSSTransitionGroupChildProps,
} from "./csstransitiongroup";

const Element = (_props: any): any => { return null; };

describe("csstransitiongroup.tsx", () => {
  describe("<CSSTransitionGroup>", () => {
    let getWrapper: (props?: CSSTransitionGroupProps) => ShallowWrapper<CSSTransitionGroupProps, {}>;

    before(() => {
      getWrapper = (props?) => shallow(
        <CSSTransitionGroup {...props} />,
      );
    });

    it("should pass down unknown props", () => {
      const wrapper = getWrapper(
        { id: "abc", children: <span key="child" /> },
      );
      const { id } = wrapper.find("ReactTransitionGroup").props();
      assert.strictEqual(id, "abc");
    });

    it("should wrap children in CSSTransitionGroupChild", () => {
      const wrapper = getWrapper(
        { id: "abc", children: [<span />, <span />] },
      );
      assert.lengthOf(wrapper.find("CSSTransitionGroupChild"), 2);
    });

    it("should pass transitionAppear to CSSTransitionGroupChild", () => {
      const wrapper = getWrapper(
        { transitionAppear: true, id: "abc", children: [<span />] },
      );
      assert.isTrue((wrapper.find("CSSTransitionGroupChild").props() as any).transitionAppear);
    });

    it("should set mounted=false on CSSTransitionGroupChild", () => {
      const wrapper = getWrapper(
        { id: "abc", children: [<span />] },
      );
      assert.isFalse((wrapper.find("CSSTransitionGroupChild").props() as any).mounted);
    });

    it("should set mounted=true on added CSSTransitionGroupChild", () => {
      const wrapper = getWrapper(
        { id: "abc", children: [] },
      );
      (wrapper.instance() as any).componentDidMount();
      wrapper.setProps({ children: [<span />] });
      assert.isTrue((wrapper.find("CSSTransitionGroupChild").props() as any).mounted);
    });
  });

  describe("<CSSTransitionGroupChild>", () => {
    let getWrapper: (props?: CSSTransitionGroupChildProps) => ShallowWrapper<CSSTransitionGroupChildProps, {}>;

    before(() => {
      getWrapper = (props?) => shallow(
        <CSSTransitionGroupChild {...props} />,
      );
    });

    it("should pass transitionAppear to child", () => {
      const wrapper = getWrapper(
        { transitionAppear: true, children: <Element /> },
      );
      assert.isTrue((wrapper.find(Element).props() as any).transitionAppear);
    });

    it("should pass transitionAppear=true when mounted=true", () => {
      const wrapper = getWrapper(
        { mounted: true, children: <Element /> },
      );
      assert.isTrue((wrapper.find(Element).props() as any).transitionAppear);
    });

    it("should set transitionAppear=false when mounted=false", () => {
      const wrapper = getWrapper(
        { mounted: false, children: <Element /> },
      );
      assert.isFalse((wrapper.find(Element).props() as any).transitionAppear);
    });

    it("should set active=true", () => {
      const wrapper = getWrapper(
        { children: <Element /> },
      );
      assert.isTrue((wrapper.find(Element).props() as any).active);
    });

    it("should inmediately call callback on componentWillAppear()", () => {
      const wrapper = getWrapper(
        { children: <Element /> },
      );
      const done = spy();
      (wrapper.instance() as any).componentWillAppear(done);
      assert.isTrue(done.calledOnce);
    });

    it("should inmediately call callback on componentWillEnter()", () => {
      const wrapper = getWrapper(
        { children: <Element /> },
      );
      const done = spy();
      (wrapper.instance() as any).componentWillEnter(done);
      assert.isTrue(done.calledOnce);
    });

    describe("onComponentWillLeave", () => {
      let onTransitionComplete: SinonSpy;
      let done: SinonSpy;
      let wrapper: ShallowWrapper<CSSTransitionGroupChildProps, {}>;

      before(() => {
        onTransitionComplete = spy();
        done = spy();
        wrapper = getWrapper(
          {
            children: <Element onTransitionComplete={onTransitionComplete} />,
          },
        );
        (wrapper.instance() as any).componentWillLeave(done);
      });

      it("should set active=false", () => {
        assert.isFalse((wrapper.find(Element).props() as any).active);
      });

      it("should not inmediately call callback", () => {
        assert.isFalse(done.calledOnce);
      });

      it("should call callback after transition completed", () => {
        wrapper.simulate("transitionComplete");
        assert.isTrue(done.calledOnce);
      });

      it("should call user onTransitionComplete", () => {
        assert.isTrue(onTransitionComplete.calledOnce);
      });
    });

    describe("revert leaving", () => {
      let onTransitionComplete: SinonSpy;
      let leaveDone: SinonSpy;
      let enterDone: SinonSpy;
      let wrapper: ShallowWrapper<CSSTransitionGroupChildProps, {}>;

      before(() => {
        onTransitionComplete = spy();
        leaveDone = spy();
        enterDone = spy();
        wrapper = getWrapper(
          {
            children: <Element onTransitionComplete={onTransitionComplete} />,
          },
        );
        (wrapper.instance() as any).componentWillLeave(leaveDone);
        (wrapper.instance() as any).componentWillEnter(enterDone);
      });

      it("should set active=true", () => {
        assert.isTrue((wrapper.find(Element).props() as any).active);
      });

      it("should inmediately call enter done callback", () => {
        assert.isTrue(enterDone.calledOnce);
      });

      it("should not call leave done callback", () => {
        wrapper.simulate("transitionComplete");
        assert.isTrue(leaveDone.notCalled);
      });
    });
  });
});
