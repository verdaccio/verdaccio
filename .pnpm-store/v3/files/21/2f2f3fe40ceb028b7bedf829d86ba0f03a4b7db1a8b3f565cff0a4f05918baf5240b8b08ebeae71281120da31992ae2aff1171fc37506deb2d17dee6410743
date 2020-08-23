import * as OctokitTypes from "@octokit/types";
export { EndpointOptions, RequestInterface, OctokitResponse, RequestParameters, Route, } from "@octokit/types";
import { PaginatingEndpoints } from "./generated/paginating-endpoints";
declare type KnownKeys<T> = Extract<{
    [K in keyof T]: string extends K ? never : number extends K ? never : K;
} extends {
    [_ in keyof T]: infer U;
} ? U : never, keyof T>;
declare type KeysMatching<T, V> = {
    [K in keyof T]: T[K] extends V ? K : never;
}[keyof T];
declare type KnownKeysMatching<T, V> = KeysMatching<Pick<T, KnownKeys<T>>, V>;
declare type GetResultsType<T> = T extends {
    data: any[];
} ? T["data"] : T extends {
    data: object;
} ? T["data"][KnownKeysMatching<T["data"], any[]>] : never;
declare type NormalizeResponse<T> = T & {
    data: GetResultsType<T>;
};
export interface MapFunction<T = unknown, R = unknown> {
    (response: OctokitTypes.OctokitResponse<PaginationResults<T>>, done: () => void): R[];
}
export declare type PaginationResults<T = unknown> = T[];
export interface PaginateInterface {
    /**
     * Paginate a request using endpoint options and map each response to a custom array
     *
     * @param {object} endpoint Must set `method` and `url`. Plus URL, query or body parameters, as well as `headers`, `mediaType.{format|previews}`, `request`, or `baseUrl`.
     * @param {function} mapFn Optional method to map each response to a custom array
     */
    <T, R>(options: OctokitTypes.EndpointOptions, mapFn: MapFunction<T, R>): Promise<PaginationResults<R>>;
    /**
     * Paginate a request using endpoint options
     *
     * @param {object} endpoint Must set `method` and `url`. Plus URL, query or body parameters, as well as `headers`, `mediaType.{format|previews}`, `request`, or `baseUrl`.
     */
    <T>(options: OctokitTypes.EndpointOptions): Promise<PaginationResults<T>>;
    /**
     * Paginate a request using a known endpoint route string and map each response to a custom array
     *
     * @param {string} route Request method + URL. Example: `'GET /orgs/:org'`
     * @param {function} mapFn Optional method to map each response to a custom array
     */
    <R extends keyof PaginatingEndpoints, MR extends unknown[]>(route: R, mapFn: (response: PaginatingEndpoints[R]["response"], done: () => void) => MR): Promise<MR>;
    /**
     * Paginate a request using a known endpoint route string and parameters, and map each response to a custom array
     *
     * @param {string} route Request method + URL. Example: `'GET /orgs/:org'`
     * @param {object} parameters URL, query or body parameters, as well as `headers`, `mediaType.{format|previews}`, `request`, or `baseUrl`.
     * @param {function} mapFn Optional method to map each response to a custom array
     */
    <R extends keyof PaginatingEndpoints, MR extends unknown[]>(route: R, parameters: PaginatingEndpoints[R]["parameters"], mapFn: (response: PaginatingEndpoints[R]["response"], done: () => void) => MR): Promise<MR>;
    /**
     * Paginate a request using an known endpoint route string
     *
     * @param {string} route Request method + URL. Example: `'GET /orgs/:org'`
     * @param {object} parameters? URL, query or body parameters, as well as `headers`, `mediaType.{format|previews}`, `request`, or `baseUrl`.
     */
    <R extends keyof PaginatingEndpoints>(route: R, parameters?: PaginatingEndpoints[R]["parameters"]): Promise<PaginatingEndpoints[R]["response"]["data"]>;
    /**
     * Paginate a request using an unknown endpoint route string
     *
     * @param {string} route Request method + URL. Example: `'GET /orgs/:org'`
     * @param {object} parameters? URL, query or body parameters, as well as `headers`, `mediaType.{format|previews}`, `request`, or `baseUrl`.
     */
    <T, R extends OctokitTypes.Route = OctokitTypes.Route>(route: R, parameters?: R extends keyof PaginatingEndpoints ? PaginatingEndpoints[R]["parameters"] : OctokitTypes.RequestParameters): Promise<T[]>;
    /**
     * Paginate a request using an endpoint method and a map function
     *
     * @param {string} request Request method (`octokit.request` or `@octokit/request`)
     * @param {function} mapFn? Optional method to map each response to a custom array
     */
    <R extends OctokitTypes.RequestInterface, MR extends unknown[]>(request: R, mapFn: (response: NormalizeResponse<OctokitTypes.GetResponseTypeFromEndpointMethod<R>>, done: () => void) => MR): Promise<MR>;
    /**
     * Paginate a request using an endpoint method, parameters, and a map function
     *
     * @param {string} request Request method (`octokit.request` or `@octokit/request`)
     * @param {object} parameters URL, query or body parameters, as well as `headers`, `mediaType.{format|previews}`, `request`, or `baseUrl`.
     * @param {function} mapFn? Optional method to map each response to a custom array
     */
    <R extends OctokitTypes.RequestInterface, MR extends unknown[]>(request: R, parameters: Parameters<R>[0], mapFn: (response: NormalizeResponse<OctokitTypes.GetResponseTypeFromEndpointMethod<R>>, done?: () => void) => MR): Promise<MR>;
    /**
     * Paginate a request using an endpoint method and parameters
     *
     * @param {string} request Request method (`octokit.request` or `@octokit/request`)
     * @param {object} parameters? URL, query or body parameters, as well as `headers`, `mediaType.{format|previews}`, `request`, or `baseUrl`.
     */
    <R extends OctokitTypes.RequestInterface>(request: R, parameters?: Parameters<R>[0]): Promise<NormalizeResponse<OctokitTypes.GetResponseTypeFromEndpointMethod<R>>["data"]>;
    iterator: {
        /**
         * Get an async iterator to paginate a request using endpoint options
         *
         * @see {link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of} for await...of
         * @param {object} endpoint Must set `method` and `url`. Plus URL, query or body parameters, as well as `headers`, `mediaType.{format|previews}`, `request`, or `baseUrl`.
         */
        <T>(EndpointOptions: OctokitTypes.EndpointOptions): AsyncIterableIterator<OctokitTypes.OctokitResponse<PaginationResults<T>>>;
        /**
         * Get an async iterator to paginate a request using a known endpoint route string and optional parameters
         *
         * @see {link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of} for await...of
         * @param {string} route Request method + URL. Example: `'GET /orgs/:org'`
         * @param {object} [parameters] URL, query or body parameters, as well as `headers`, `mediaType.{format|previews}`, `request`, or `baseUrl`.
         */
        <R extends keyof PaginatingEndpoints>(route: R, parameters?: PaginatingEndpoints[R]["parameters"]): AsyncIterableIterator<OctokitTypes.OctokitResponse<PaginatingEndpoints[R]["response"]["data"]>>;
        /**
         * Get an async iterator to paginate a request using an unknown endpoint route string and optional parameters
         *
         * @see {link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of} for await...of
         * @param {string} route Request method + URL. Example: `'GET /orgs/:org'`
         * @param {object} [parameters] URL, query or body parameters, as well as `headers`, `mediaType.{format|previews}`, `request`, or `baseUrl`.
         */
        <T, R extends OctokitTypes.Route = OctokitTypes.Route>(route: R, parameters?: R extends keyof PaginatingEndpoints ? PaginatingEndpoints[R]["parameters"] : OctokitTypes.RequestParameters): AsyncIterableIterator<OctokitTypes.OctokitResponse<PaginationResults<T>>>;
        /**
         * Get an async iterator to paginate a request using a request method and optional parameters
         *
         * @see {link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of} for await...of
         * @param {string} request `@octokit/request` or `octokit.request` method
         * @param {object} [parameters] URL, query or body parameters, as well as `headers`, `mediaType.{format|previews}`, `request`, or `baseUrl`.
         */
        <R extends OctokitTypes.RequestInterface>(request: R, parameters?: Parameters<R>[0]): AsyncIterableIterator<NormalizeResponse<OctokitTypes.GetResponseTypeFromEndpointMethod<R>>>;
    };
}
