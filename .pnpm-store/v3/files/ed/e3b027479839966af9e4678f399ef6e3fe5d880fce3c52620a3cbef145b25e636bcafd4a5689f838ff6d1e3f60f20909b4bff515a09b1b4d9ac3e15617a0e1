import { HookCollection } from "before-after-hook";
import { request } from "@octokit/request";
import { graphql } from "@octokit/graphql";
import { Constructor, OctokitOptions, OctokitPlugin, ReturnTypeOf, UnionToIntersection } from "./types";
export declare class Octokit {
    static VERSION: string;
    static defaults<S extends Constructor<any>>(this: S, defaults: OctokitOptions): {
        new (...args: any[]): {
            [x: string]: any;
        };
    } & S;
    static plugins: OctokitPlugin[];
    /**
     * Attach a plugin (or many) to your Octokit instance.
     *
     * @example
     * const API = Octokit.plugin(plugin1, plugin2, plugin3, ...)
     */
    static plugin<S extends Constructor<any> & {
        plugins: any[];
    }, T1 extends OctokitPlugin | OctokitPlugin[], T2 extends OctokitPlugin[]>(this: S, p1: T1, ...p2: T2): {
        new (...args: any[]): {
            [x: string]: any;
        };
        plugins: any[];
    } & S & Constructor<UnionToIntersection<ReturnTypeOf<T1> & ReturnTypeOf<T2>>>;
    constructor(options?: OctokitOptions);
    request: typeof request;
    graphql: typeof graphql;
    log: {
        debug: (message: string, additionalInfo?: object) => any;
        info: (message: string, additionalInfo?: object) => any;
        warn: (message: string, additionalInfo?: object) => any;
        error: (message: string, additionalInfo?: object) => any;
        [key: string]: any;
    };
    hook: HookCollection;
    auth: (...args: unknown[]) => Promise<unknown>;
    [key: string]: any;
}
