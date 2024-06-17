// src/jsx/dom/jsx-dev-runtime.ts
import { newJSXNode } from "./utils.js";
var jsxDEV = (tag, props, key) => {
  return newJSXNode({
    tag,
    props,
    key
  });
};
var Fragment = (props) => jsxDEV("", props, void 0);
export {
  Fragment,
  jsxDEV
};
