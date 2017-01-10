/**
 * @license
 * Copyright (C) 2016-present Chi Vinh Le and contributors.
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import removeVendorPrefix from "./removeVendorPrefix";

export function matchTransitionProperty(subject: string, property: string): boolean {
  const sub = removeVendorPrefix(subject);
  const prop = removeVendorPrefix(property);
  if (sub.length < prop.length) {
    return false;
  } else if (sub.length === prop.length) {
    return sub === prop;
  }
  return sub.substr(0, prop.length) === prop;
}

export default matchTransitionProperty;
