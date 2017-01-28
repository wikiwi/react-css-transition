import * as React from "react";

import { prefix } from "../theme";

const style = prefix({
  boxShadow: "1px 1px 5px 0px rgba(0,0,0,0.25)",
  borderRadius: "50%",
  marginBottom: "32px",
  background: "#dc7d16",
  height: "20px",
  width: "20px",
  marginRight: "8px",
});

const Circle = () => <div style={ style } />;

export default Circle;
