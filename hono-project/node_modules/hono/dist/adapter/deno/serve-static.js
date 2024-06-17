// src/adapter/deno/serve-static.ts
import { serveStatic as baseServeStatic } from "../../middleware/serve-static/index.js";
var { open } = Deno;
var serveStatic = (options) => {
  return async function serveStatic2(c, next) {
    const getContent = async (path) => {
      try {
        const file = await open(path);
        return file ? file.readable : null;
      } catch (e) {
        console.warn(`${e}`);
      }
    };
    const pathResolve = (path) => {
      return `./${path}`;
    };
    return baseServeStatic({
      ...options,
      getContent,
      pathResolve
    })(c, next);
  };
};
export {
  serveStatic
};
