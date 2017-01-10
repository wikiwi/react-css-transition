/**
 * @license
 * Copyright (C) 2016-present Chi Vinh Le and contributors.
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import { withProps } from "react-assemble";

import parseTransition from "../utils/parseTransition";

export const withTransitionInfo =
  withProps<any, any>(({style}: any) => {
    if (style.transition) {
      const [{delay: firstPropertyDelay, property: firstProperty}, {property: lastProperty}] =
        parseTransition(style.transition);
      return {
        transitionInfo: {
          firstPropertyDelay,
          firstProperty,
          lastProperty,
          inTransition: true,
        },
      };
    }
    return { transitionInfo: { inTransition: false } };
  });
