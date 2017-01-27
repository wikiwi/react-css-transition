import { HTMLAttributes } from "react";
import { withHandlers } from "reassemble";

export const preventMouseFocus =
  withHandlers<HTMLAttributes<any>, HTMLAttributes<any>>({
    onMouseDown: ({onMouseDown}) => (event: React.MouseEvent<any>) => {
      if (onMouseDown) { onMouseDown(event); }
      event.preventDefault();
    },
  });
