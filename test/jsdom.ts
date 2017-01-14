/**
 * @license
 * Copyright (C) 2016-2017 Chi Vinh Le and contributors.
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import { jsdom } from "jsdom";

declare var global: any;

function clock(start?: any): any {
  if (!start) { return process.hrtime(); }
  const end = process.hrtime(start);
  return Math.round((end[0] * 1000) + (end[1] / 1000000));
}

const start = clock();
global.document = jsdom("");
global.window = document.defaultView;
global.navigator = { userAgent: "node.js" };
// Setup a fake version of performance.now.
global.performance = { now: () => clock(start) };

const exposedProperties = ["document", "window", "navigator"];
Object.keys(window).forEach((property) => {
  if (typeof global[property] === "undefined") {
    exposedProperties.push(property);
    global[property] = (window as any)[property];
  }
});
