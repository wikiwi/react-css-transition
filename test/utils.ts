/**
 * @license
 * Copyright (C) 2016-present Chi Vinh Le and contributors.
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

export { runInFrame } from "../src/utils";

export function createTestDiv() {
  const element = document.createElement("div");
  document.body.appendChild(element);
  return element;
}
