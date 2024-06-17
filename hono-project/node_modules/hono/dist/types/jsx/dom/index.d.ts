/**
 * @module
 * This module provides APIs for `hono/jsx/dom`.
 */
import { isValidElement, memo, reactAPICompatVersion } from '../base';
import type { Child, DOMAttributes, JSX, JSXNode, Props } from '../base';
import { Children } from '../children';
import { useContext } from '../context';
import { createRef, forwardRef, startTransition, startViewTransition, use, useCallback, useDebugValue, useDeferredValue, useEffect, useId, useImperativeHandle, useInsertionEffect, useLayoutEffect, useMemo, useReducer, useRef, useState, useSyncExternalStore, useTransition, useViewTransition } from '../hooks';
import { ErrorBoundary, Suspense } from './components';
import { createContext } from './context';
import { Fragment } from './jsx-runtime';
import { createPortal, flushSync } from './render';
export { render } from './render';
declare const createElement: (tag: string | ((props: Props) => JSXNode), props: Props | null, ...children: Child[]) => JSXNode;
declare const cloneElement: <T extends JSXNode | JSX.Element>(element: T, props: Props, ...children: Child[]) => T;
export { reactAPICompatVersion as version, createElement as jsx, useState, useEffect, useRef, useCallback, use, startTransition, useTransition, useDeferredValue, startViewTransition, useViewTransition, useMemo, useLayoutEffect, useInsertionEffect, useReducer, useId, useDebugValue, createRef, forwardRef, useImperativeHandle, useSyncExternalStore, Suspense, ErrorBoundary, createContext, useContext, memo, isValidElement, createElement, cloneElement, Children, Fragment, DOMAttributes, flushSync, createPortal, };
declare const _default: {
    version: string;
    useState: {
        <T>(initialState: T | (() => T)): [T, (newState: T | ((currentState: T) => T)) => void];
        <T_1 = undefined>(): [T_1 | undefined, (newState: T_1 | ((currentState: T_1 | undefined) => T_1 | undefined) | undefined) => void];
    };
    useEffect: (effect: () => void | (() => void), deps?: readonly unknown[] | undefined) => void;
    useRef: <T_2>(initialValue: T_2 | null) => import("../hooks").RefObject<T_2>;
    useCallback: <T_3 extends (...args: unknown[]) => unknown>(callback: T_3, deps: readonly unknown[]) => T_3;
    use: <T_4>(promise: Promise<T_4>) => T_4;
    startTransition: (callback: () => void) => void;
    useTransition: () => [boolean, (callback: () => void) => void];
    useDeferredValue: <T_5>(value: T_5) => T_5;
    startViewTransition: (callback: () => void) => void;
    useViewTransition: () => [boolean, (callback: () => void) => void];
    useMemo: <T_6>(factory: () => T_6, deps: readonly unknown[]) => T_6;
    useLayoutEffect: (effect: () => void | (() => void), deps?: readonly unknown[] | undefined) => void;
    useInsertionEffect: (effect: () => void | (() => void), deps?: readonly unknown[] | undefined) => void;
    useReducer: <T_7, A>(reducer: (state: T_7, action: A) => T_7, initialArg: T_7, init?: ((initialState: T_7) => T_7) | undefined) => [T_7, (action: A) => void];
    useId: () => string;
    useDebugValue: (_value: unknown, _formatter?: ((value: unknown) => string) | undefined) => void;
    createRef: <T_8>() => import("../hooks").RefObject<T_8>;
    forwardRef: <T_9, P = {}>(Component: (props: P, ref?: import("../hooks").RefObject<T_9> | undefined) => JSX.Element) => (props: P & {
        ref?: import("../hooks").RefObject<T_9> | undefined;
    }) => JSX.Element;
    useImperativeHandle: <T_10>(ref: import("../hooks").RefObject<T_10>, createHandle: () => T_10, deps: readonly unknown[]) => void;
    useSyncExternalStore: <T_11>(subscribe: (callback: (value: T_11) => void) => () => void, getSnapshot: () => T_11, getServerSnapshot?: (() => T_11) | undefined) => T_11;
    Suspense: import("../base").FC<import("../types").PropsWithChildren<{
        fallback: any;
    }>>;
    ErrorBoundary: import("../base").FC<import("../types").PropsWithChildren<{
        fallback?: Child;
        fallbackRender?: import("../components").FallbackRender | undefined;
        onError?: import("../components").ErrorHandler | undefined;
    }>>;
    createContext: <T_12>(defaultValue: T_12) => import("../context").Context<T_12>;
    useContext: <T_13>(context: import("../context").Context<T_13>) => T_13;
    memo: <T_14>(component: import("../base").FC<T_14>, propsAreEqual?: (prevProps: Readonly<T_14>, nextProps: Readonly<T_14>) => boolean) => import("../base").FC<T_14>;
    isValidElement: (element: unknown) => element is JSXNode;
    createElement: (tag: string | ((props: Props) => JSXNode), props: Props | null, ...children: Child[]) => JSXNode;
    cloneElement: <T_15 extends JSXNode | JSX.Element>(element: T_15, props: Props, ...children: Child[]) => T_15;
    Children: {
        map: (children: Child[], fn: (child: Child, index: number) => Child) => Child[];
        forEach: (children: Child[], fn: (child: Child, index: number) => void) => void;
        count: (children: Child[]) => number;
        only: (_children: Child[]) => Child;
        toArray: (children: Child) => Child[];
    };
    Fragment: (props: Record<string, unknown>) => JSXNode;
    flushSync: (callback: () => void) => void;
    createPortal: (children: Child, container: HTMLElement, key?: string | undefined) => Child;
};
export default _default;
export type { Context } from '../context';
export type * from '../types';
