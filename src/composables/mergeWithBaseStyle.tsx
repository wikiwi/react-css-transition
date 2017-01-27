import { combine, withProps } from "reassemble";
import { HTMLAttributes } from "react";

import { WithTransitionStateProps } from "./withTransitionState";

const mergeClasses = (...classes: string[]) => classes.filter((s) => s).join(" ");

type StyleProps = Pick<HTMLAttributes<any>, "style" | "className">;

export const mergeWithBaseStyle = combine(
  withProps<StyleProps & WithTransitionStateProps, StyleProps>(
    ({ transitionState, style, className }) => ({
      style: { ...style, ...transitionState.style },
      className: mergeClasses(className, transitionState.className),
    })),
);
