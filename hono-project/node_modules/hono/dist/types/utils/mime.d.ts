/**
 * @module
 * MIME utility.
 */
export declare const getMimeType: (filename: string, mimes?: Record<string, string>) => string | undefined;
export declare const getExtension: (mimeType: string) => string | undefined;
export { baseMimes as mimes };
declare const baseMimes: Record<string, string>;
