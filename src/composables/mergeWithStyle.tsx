/**
 * @license
 * Copyright (C) 2016-present Chi Vinh Le and contributors.
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import { combine, withProps, omitProps } from "react-assemble";

export const mergeWithStyle = combine(
  withProps<any, any>(({ transitionStyle, style }: any) => ({ style: { ...style, ...transitionStyle } })),
  omitProps<any>("transitionStyle"),
);
