/*
 * Copyright (C) 2016 Chi Vinh Le and contributors.
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import * as React from "react";
import { mount } from "enzyme";
import { assert } from "chai";
import { createDOM, DOM } from "./dom";
import { Remove } from "../src";

describe("integration test", () => {
  let dom: DOM;

  before(() => {
    dom = createDOM(`<html>
      <span id="test1">test1</span>
      <span id="test2">test2</span>
      <span id="test3">test3</span>
      </html>`);
  });

  after(() => {
    dom.destroy();
  });

  it("should have test elements", () => {
    assert.isNotNull(document.getElementById("test1"),
      "missing element with id 'test1'");
    assert.isNotNull(document.getElementById("test2"),
      "missing element with id 'test2'");
    assert.isNotNull(document.getElementById("test3"),
      "missing element with id 'test3'");
  });

  it("should delete an element on mount", () => {
    mount(<Remove id="test1" />);
    assert.isNull(document.getElementById("test1"),
      "element 'test1' was not deleted");
    assert.isNotNull(document.getElementById("test2"),
      "missing element with id 'test2'");
    assert.isNotNull(document.getElementById("test3"),
      "missing element with id 'test3'");
  });

  it("should delete multiple elements on mount", () => {
    mount(<Remove id={["test2", "test3"]} />);
    assert.isNull(document.getElementById("test2"),
      "element 'test2' was not deleted");
    assert.isNull(document.getElementById("test3"),
      "element 'test3' was not deleted");
  });
});
