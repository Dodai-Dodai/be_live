/**
 * @module
 * Stream utility.
 */
export declare class StreamingApi {
    private writer;
    private encoder;
    private writable;
    private abortSubscribers;
    responseReadable: ReadableStream;
    constructor(writable: WritableStream, _readable: ReadableStream);
    write(input: Uint8Array | string): Promise<StreamingApi>;
    writeln(input: string): Promise<StreamingApi>;
    sleep(ms: number): Promise<unknown>;
    close(): Promise<void>;
    pipe(body: ReadableStream): Promise<void>;
    onAbort(listener: () => void | Promise<void>): void;
}
