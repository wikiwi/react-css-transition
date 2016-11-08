/**
 * @license
 * Copyright (C) 2016 Chi Vinh Le and contributors.
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

export function removeVendorPrefix(val: string): string {
  return val.replace(/^-(webkit|moz|ms|o)-/, "");
}

export function convertToCSSPrefix(property: string): string {
  return property
    .replace(/^Moz/, "-moz-")
    .replace(/^ms/, "-ms-")
    .replace(/^O/, "-o-")
    .replace(/^Webkit/, "-webkit-")
    .toLowerCase();
}

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
