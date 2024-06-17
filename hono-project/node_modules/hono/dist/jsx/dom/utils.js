// src/jsx/dom/utils.ts
import { DOM_INTERNAL_TAG } from "../constants.js";
var setInternalTagFlag = (fn) => {
  ;
  fn[DOM_INTERNAL_TAG] = true;
  return fn;
};
var JSXNodeCompatPrototype = {
  type: {
    get() {
      return this.tag;
    }
  },
  ref: {
    get() {
      return this.props?.ref;
    }
  }
};
var newJSXNode = (obj) => Object.defineProperties(obj, JSXNodeCompatPrototype);
export {
  newJSXNode,
  setInternalTagFlag
};
