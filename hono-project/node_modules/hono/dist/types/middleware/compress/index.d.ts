/**
 * @module
 * Compress Middleware for Hono.
 */
import type { MiddlewareHandler } from '../../types';
declare const ENCODING_TYPES: readonly ["gzip", "deflate"];
interface CompressionOptions {
    encoding?: (typeof ENCODING_TYPES)[number];
}
/**
 * Compress Middleware for Hono.
 *
 * @see {@link https://hono.dev/middleware/builtin/compress}
 *
 * @param {CompressionOptions} [options] - The options for the compress middleware.
 * @param {'gzip' | 'deflate'} [options.encoding] - The compression scheme to allow for response compression. Either 'gzip' or 'deflate'. If not defined, both are allowed and will be used based on the Accept-Encoding header. 'gzip' is prioritized if this option is not provided and the client provides both in the Accept-Encoding header.
 * @returns {MiddlewareHandler} The middleware handler function.
 *
 * @example
 * ```ts
 * const app = new Hono()
 *
 * app.use(compress())
 * ```
 */
export declare const compress: (options?: CompressionOptions) => MiddlewareHandler;
export {};
