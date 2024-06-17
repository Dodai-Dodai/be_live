/**
 * @module
 * Pretty JSON Middleware for Hono.
 */
import type { MiddlewareHandler } from '../../types';
type prettyOptions = {
    space: number;
};
/**
 * Pretty JSON Middleware for Hono.
 *
 * @see {@link https://hono.dev/middleware/builtin/pretty-json}
 *
 * @param {prettyOptions} [options] - The options for the pretty JSON middleware.
 * @param {number} [options.space=2] - Number of spaces for indentation.
 * @returns {MiddlewareHandler} The middleware handler function.
 *
 * @example
 * ```ts
 * const app = new Hono()
 *
 * app.use(prettyJSON()) // With options: prettyJSON({ space: 4 })
 * app.get('/', (c) => {
 *   return c.json({ message: 'Hono!' })
 * })
 * ```
 */
export declare const prettyJSON: (options?: prettyOptions) => MiddlewareHandler;
export {};
