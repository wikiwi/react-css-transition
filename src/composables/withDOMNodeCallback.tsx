import { withHandlers } from "reassemble";

import { CSSTransitionInnerProps } from "../csstransition";

export type WithDOMNodeCallbackProps = {
  onDOMNodeRef: CSSTransitionInnerProps["onDOMNodeRef"],
  getDOMNode: () => Element,
};

export const withDOMNodeCallback =
  withHandlers<{}, WithDOMNodeCallbackProps>(() => {
    let ref: Element;
    return {
      onDOMNodeRef: () => (e: Element) => {
        ref = e;
      },
      getDOMNode: () => () => ref,
    };
  });
