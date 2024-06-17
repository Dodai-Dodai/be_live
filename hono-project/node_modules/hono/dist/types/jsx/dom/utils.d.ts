import type { JSXNode, Props } from '../base';
export declare const setInternalTagFlag: (fn: Function) => Function;
export declare const newJSXNode: (obj: {
    tag: string | Function;
    props?: Props;
    key?: string;
}) => JSXNode;
