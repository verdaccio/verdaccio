import * as OctokitTypes from "@octokit/types";
import { Octokit } from ".";
export declare type RequestParameters = OctokitTypes.RequestParameters;
export declare type OctokitOptions = {
    authStrategy?: any;
    auth?: any;
    request?: OctokitTypes.RequestRequestOptions;
    timeZone?: string;
    [option: string]: any;
};
export declare type Constructor<T> = new (...args: any[]) => T;
export declare type ReturnTypeOf<T extends AnyFunction | AnyFunction[]> = T extends AnyFunction ? ReturnType<T> : T extends AnyFunction[] ? UnionToIntersection<ReturnType<T[number]>> : never;
/**
 * @author https://stackoverflow.com/users/2887218/jcalz
 * @see https://stackoverflow.com/a/50375286/10325032
 */
export declare type UnionToIntersection<Union> = (Union extends any ? (argument: Union) => void : never) extends (argument: infer Intersection) => void ? Intersection : never;
declare type AnyFunction = (...args: any) => any;
export declare type OctokitPlugin = (octokit: Octokit, options: OctokitOptions) => {
    [key: string]: any;
} | void;
export {};
