// src/jsx/dom/render.ts
import { toArray } from "../children.js";
import { DOM_ERROR_HANDLER, DOM_INTERNAL_TAG, DOM_RENDERER, DOM_STASH } from "../constants.js";
import { globalContexts as globalJSXContexts, useContext } from "../context.js";
import { STASH_EFFECT } from "../hooks/index.js";
import { normalizeIntrinsicElementKey, styleObjectForEach } from "../utils.js";
import { createContext } from "./context.js";
import { newJSXNode } from "./utils.js";
var HONO_PORTAL_ELEMENT = "_hp";
var eventAliasMap = {
  Change: "Input",
  DoubleClick: "DblClick"
};
var nameSpaceMap = {
  svg: "2000/svg",
  math: "1998/Math/MathML"
};
var skipProps = /* @__PURE__ */ new Set(["children"]);
var buildDataStack = [];
var nameSpaceContext = void 0;
var isNodeString = (node) => "t" in node;
var getEventSpec = (key) => {
  const match = key.match(/^on([A-Z][a-zA-Z]+?(?:PointerCapture)?)(Capture)?$/);
  if (match) {
    const [, eventName, capture] = match;
    return [(eventAliasMap[eventName] || eventName).toLowerCase(), !!capture];
  }
  return void 0;
};
var toAttributeName = (element, key) => element instanceof SVGElement && /[A-Z]/.test(key) && (key in element.style || key.match(/^(?:o|pai|str|u|ve)/)) ? key.replace(/([A-Z])/g, "-$1").toLowerCase() : key;
var applyProps = (container, attributes, oldAttributes) => {
  attributes ||= {};
  for (let [key, value] of Object.entries(attributes)) {
    if (!skipProps.has(key) && (!oldAttributes || oldAttributes[key] !== value)) {
      key = normalizeIntrinsicElementKey(key);
      const eventSpec = getEventSpec(key);
      if (eventSpec) {
        if (oldAttributes) {
          container.removeEventListener(eventSpec[0], oldAttributes[key], eventSpec[1]);
        }
        if (value != null) {
          if (typeof value !== "function") {
            throw new Error(`Event handler for "${key}" is not a function`);
          }
          container.addEventListener(eventSpec[0], value, eventSpec[1]);
        }
      } else if (key === "dangerouslySetInnerHTML" && value) {
        container.innerHTML = value.__html;
      } else if (key === "ref") {
        if (typeof value === "function") {
          value(container);
        } else if (value && "current" in value) {
          value.current = container;
        }
      } else if (key === "style") {
        const style = container.style;
        if (typeof value === "string") {
          style.cssText = value;
        } else {
          style.cssText = "";
          if (value != null) {
            styleObjectForEach(value, style.setProperty.bind(style));
          }
        }
      } else {
        const nodeName = container.nodeName;
        if (key === "value") {
          if (nodeName === "INPUT" || nodeName === "TEXTAREA" || nodeName === "SELECT") {
            ;
            container.value = value === null || value === void 0 || value === false ? null : value;
            if (nodeName === "TEXTAREA") {
              container.textContent = value;
              continue;
            } else if (nodeName === "SELECT") {
              if (container.selectedIndex === -1) {
                ;
                container.selectedIndex = 0;
              }
              continue;
            }
          }
        } else if (key === "checked" && nodeName === "INPUT" || key === "selected" && nodeName === "OPTION") {
          ;
          container[key] = value;
        }
        const k = toAttributeName(container, key);
        if (value === null || value === void 0 || value === false) {
          container.removeAttribute(k);
        } else if (value === true) {
          container.setAttribute(k, "");
        } else if (typeof value === "string" || typeof value === "number") {
          container.setAttribute(k, value);
        } else {
          container.setAttribute(k, value.toString());
        }
      }
    }
  }
  if (oldAttributes) {
    for (let [key, value] of Object.entries(oldAttributes)) {
      if (!skipProps.has(key) && !(key in attributes)) {
        key = normalizeIntrinsicElementKey(key);
        const eventSpec = getEventSpec(key);
        if (eventSpec) {
          container.removeEventListener(eventSpec[0], value, eventSpec[1]);
        } else if (key === "ref") {
          if (typeof value === "function") {
            value(null);
          } else {
            value.current = null;
          }
        } else {
          container.removeAttribute(toAttributeName(container, key));
        }
      }
    }
  }
};
var invokeTag = (context, node) => {
  if (node.s) {
    const res = node.s;
    node.s = void 0;
    return res;
  }
  node[DOM_STASH][0] = 0;
  buildDataStack.push([context, node]);
  const func = node.tag[DOM_RENDERER] || node.tag;
  try {
    return [
      func.call(null, {
        ...func.defaultProps || {},
        ...node.props
      })
    ];
  } finally {
    buildDataStack.pop();
  }
};
var getNextChildren = (node, container, nextChildren, childrenToRemove, callbacks) => {
  childrenToRemove.push(...node.vR);
  if (typeof node.tag === "function") {
    node[DOM_STASH][1][STASH_EFFECT]?.forEach((data) => callbacks.push(data));
  }
  node.vC.forEach((child) => {
    if (isNodeString(child)) {
      nextChildren.push(child);
    } else {
      if (typeof child.tag === "function" || child.tag === "") {
        child.c = container;
        getNextChildren(child, container, nextChildren, childrenToRemove, callbacks);
      } else {
        nextChildren.push(child);
        childrenToRemove.push(...child.vR);
      }
    }
  });
};
var findInsertBefore = (node) => {
  if (!node) {
    return null;
  } else if (node.tag === HONO_PORTAL_ELEMENT) {
    return findInsertBefore(node.nN);
  } else if (node.e) {
    return node.e;
  }
  if (node.vC) {
    for (let i = 0, len = node.vC.length; i < len; i++) {
      const e = findInsertBefore(node.vC[i]);
      if (e) {
        return e;
      }
    }
  }
  return findInsertBefore(node.nN);
};
var removeNode = (node) => {
  if (!isNodeString(node)) {
    node[DOM_STASH]?.[1][STASH_EFFECT]?.forEach((data) => data[2]?.());
    if (node.e && node.props?.ref) {
      if (typeof node.props.ref === "function") {
        node.props.ref(null);
      } else {
        node.props.ref.current = null;
      }
    }
    node.vC?.forEach(removeNode);
  }
  if (node.tag !== HONO_PORTAL_ELEMENT) {
    node.e?.remove();
  }
  if (typeof node.tag === "function") {
    updateMap.delete(node);
    fallbackUpdateFnArrayMap.delete(node);
  }
};
var apply = (node, container) => {
  node.c = container;
  applyNodeObject(node, container);
};
var applyNode = (node, container) => {
  if (isNodeString(node)) {
    container.textContent = node.t;
  } else {
    applyNodeObject(node, container);
  }
};
var findChildNodeIndex = (childNodes, child) => {
  if (!child) {
    return;
  }
  for (let i = 0, len = childNodes.length; i < len; i++) {
    if (childNodes[i] === child) {
      return i;
    }
  }
  return;
};
var applyNodeObject = (node, container) => {
  const next = [];
  const remove = [];
  const callbacks = [];
  getNextChildren(node, container, next, remove, callbacks);
  const childNodes = container.childNodes;
  let offset = findChildNodeIndex(childNodes, findInsertBefore(node.nN)) ?? findChildNodeIndex(childNodes, next.find((n) => n.tag !== HONO_PORTAL_ELEMENT && n.e)?.e) ?? childNodes.length;
  for (let i = 0, len = next.length; i < len; i++, offset++) {
    const child = next[i];
    let el;
    if (isNodeString(child)) {
      if (child.e && child.d) {
        child.e.textContent = child.t;
      }
      child.d = false;
      el = child.e ||= document.createTextNode(child.t);
    } else {
      el = child.e ||= child.n ? document.createElementNS(child.n, child.tag) : document.createElement(child.tag);
      applyProps(el, child.props, child.pP);
      applyNode(child, el);
    }
    if (child.tag === HONO_PORTAL_ELEMENT) {
      offset--;
    } else if (childNodes[offset] !== el && childNodes[offset - 1] !== child.e) {
      container.insertBefore(el, childNodes[offset] || null);
    }
  }
  remove.forEach(removeNode);
  callbacks.forEach(([, , , , cb]) => cb?.());
  callbacks.forEach(([, cb]) => cb?.());
  requestAnimationFrame(() => {
    callbacks.forEach(([, , , cb]) => cb?.());
  });
};
var fallbackUpdateFnArrayMap = /* @__PURE__ */ new WeakMap();
var build = (context, node, topLevelErrorHandlerNode, children) => {
  let errorHandler;
  children ||= typeof node.tag == "function" ? invokeTag(context, node) : toArray(node.props.children);
  if (children[0]?.tag === "") {
    errorHandler = children[0][DOM_ERROR_HANDLER];
    topLevelErrorHandlerNode ||= node;
  }
  const oldVChildren = node.vC ? [...node.vC] : [];
  const vChildren = [];
  node.vR = [];
  let prevNode;
  try {
    children.flat().forEach((c) => {
      let child = buildNode(c);
      if (child) {
        if (prevNode) {
          prevNode.nN = child;
        }
        prevNode = child;
        if (typeof child.tag === "function" && !child.tag[DOM_INTERNAL_TAG] && globalJSXContexts.length > 0) {
          child[DOM_STASH][2] = globalJSXContexts.map((c2) => [c2, c2.values.at(-1)]);
        }
        let oldChild;
        const i = oldVChildren.findIndex(
          isNodeString(child) ? (c2) => isNodeString(c2) : child.key !== void 0 ? (c2) => c2.key === child.key : (c2) => c2.tag === child.tag
        );
        if (i !== -1) {
          oldChild = oldVChildren[i];
          oldVChildren.splice(i, 1);
        }
        if (oldChild) {
          if (isNodeString(child)) {
            if (oldChild.t !== child.t) {
              ;
              oldChild.t = child.t;
              oldChild.d = true;
            }
            child = oldChild;
          } else if (oldChild.tag !== child.tag) {
            node.vR.push(oldChild);
          } else {
            oldChild.pP = oldChild.props;
            oldChild.props = child.props;
            if (typeof child.tag === "function") {
              oldChild[DOM_STASH][2] = child[DOM_STASH][2] || [];
            }
            child = oldChild;
          }
        } else if (!isNodeString(child) && nameSpaceContext) {
          const ns = useContext(nameSpaceContext);
          if (ns) {
            child.n = ns;
          }
        }
        if (!isNodeString(child)) {
          build(context, child, topLevelErrorHandlerNode);
        }
        vChildren.push(child);
      }
    });
    node.vC = vChildren;
    node.vR.push(...oldVChildren);
  } catch (e) {
    if (errorHandler) {
      const fallbackUpdateFn = () => update([0, false, context[2]], topLevelErrorHandlerNode);
      const fallbackUpdateFnArray = fallbackUpdateFnArrayMap.get(topLevelErrorHandlerNode) || [];
      fallbackUpdateFnArray.push(fallbackUpdateFn);
      fallbackUpdateFnArrayMap.set(topLevelErrorHandlerNode, fallbackUpdateFnArray);
      const fallback = errorHandler(e, () => {
        const fnArray = fallbackUpdateFnArrayMap.get(topLevelErrorHandlerNode);
        if (fnArray) {
          const i = fnArray.indexOf(fallbackUpdateFn);
          if (i !== -1) {
            fnArray.splice(i, 1);
            return fallbackUpdateFn();
          }
        }
      });
      if (fallback) {
        if (context[0] === 1) {
          context[1] = true;
        } else {
          build(context, node, topLevelErrorHandlerNode, [fallback]);
        }
        return;
      }
    }
    throw e;
  }
};
var buildNode = (node) => {
  if (node === void 0 || node === null || typeof node === "boolean") {
    return void 0;
  } else if (typeof node === "string" || typeof node === "number") {
    return { t: node.toString(), d: true };
  } else {
    if ("vR" in node) {
      node = newJSXNode({
        tag: node.tag,
        props: node.props,
        key: node.key
      });
    }
    if (typeof node.tag === "function") {
      ;
      node[DOM_STASH] = [0, []];
    } else {
      const ns = nameSpaceMap[node.tag];
      if (ns) {
        nameSpaceContext ||= createContext("");
        node.props.children = [
          {
            tag: nameSpaceContext.Provider,
            props: {
              value: node.n = `http://www.w3.org/${ns}`,
              children: node.props.children
            }
          }
        ];
      }
    }
    return node;
  }
};
var replaceContainer = (node, from, to) => {
  if (node.c === from) {
    node.c = to;
    node.vC.forEach((child) => replaceContainer(child, from, to));
  }
};
var updateSync = (context, node) => {
  node[DOM_STASH][2]?.forEach(([c, v]) => {
    c.values.push(v);
  });
  build(context, node, void 0);
  node[DOM_STASH][2]?.forEach(([c]) => {
    c.values.pop();
  });
  if (context[0] !== 1 || !context[1]) {
    apply(node, node.c);
  }
};
var updateMap = /* @__PURE__ */ new WeakMap();
var currentUpdateSets = [];
var update = async (context, node) => {
  const existing = updateMap.get(node);
  if (existing) {
    existing[0](void 0);
  }
  let resolve;
  const promise = new Promise((r) => resolve = r);
  updateMap.set(node, [
    resolve,
    () => {
      if (context[2]) {
        context[2](context, node, (context2) => {
          updateSync(context2, node);
        }).then(() => resolve(node));
      } else {
        updateSync(context, node);
        resolve(node);
      }
    }
  ]);
  if (currentUpdateSets.length) {
    ;
    currentUpdateSets.at(-1).add(node);
  } else {
    await Promise.resolve();
    const latest = updateMap.get(node);
    if (latest) {
      updateMap.delete(node);
      latest[1]();
    }
  }
  return promise;
};
var renderNode = (node, container) => {
  const context = [];
  context[4] = true;
  build(context, node, void 0);
  context[4] = false;
  const fragment = document.createDocumentFragment();
  apply(node, fragment);
  replaceContainer(node, fragment, container);
  container.replaceChildren(fragment);
};
var render = (jsxNode, container) => {
  renderNode(buildNode({ tag: "", props: { children: jsxNode } }), container);
};
var flushSync = (callback) => {
  const set = /* @__PURE__ */ new Set();
  currentUpdateSets.push(set);
  callback();
  set.forEach((node) => {
    const latest = updateMap.get(node);
    if (latest) {
      updateMap.delete(node);
      latest[1]();
    }
  });
  currentUpdateSets.pop();
};
var createPortal = (children, container, key) => ({
  tag: HONO_PORTAL_ELEMENT,
  props: {
    children
  },
  key,
  e: container
});
export {
  build,
  buildDataStack,
  buildNode,
  createPortal,
  flushSync,
  render,
  renderNode,
  update
};
