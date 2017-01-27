export { runInFrame } from "../src/utils/runInFrame";

export function createTestDiv() {
  const element = document.createElement("div");
  document.body.appendChild(element);
  return element;
}
