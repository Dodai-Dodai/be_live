// src/jsx/dom/context.ts
import { DOM_ERROR_HANDLER } from "../constants.js";
import { globalContexts } from "../context.js";
import { Fragment } from "./jsx-runtime.js";
import { setInternalTagFlag } from "./utils.js";
var createContextProviderFunction = (values) => setInternalTagFlag(({ value, children }) => {
  if (!children) {
    return void 0;
  }
  const props = {
    children: [
      {
        tag: setInternalTagFlag(() => {
          values.push(value);
        }),
        props: {}
      }
    ]
  };
  if (Array.isArray(children)) {
    props.children.push(...children.flat());
  } else {
    props.children.push(children);
  }
  props.children.push({
    tag: setInternalTagFlag(() => {
      values.pop();
    }),
    props: {}
  });
  const res = Fragment(props);
  res[DOM_ERROR_HANDLER] = (err) => {
    values.pop();
    throw err;
  };
  return res;
});
var createContext = (defaultValue) => {
  const values = [defaultValue];
  const context = {
    values,
    Provider: createContextProviderFunction(values)
  };
  globalContexts.push(context);
  return context;
};
export {
  createContext,
  createContextProviderFunction
};
