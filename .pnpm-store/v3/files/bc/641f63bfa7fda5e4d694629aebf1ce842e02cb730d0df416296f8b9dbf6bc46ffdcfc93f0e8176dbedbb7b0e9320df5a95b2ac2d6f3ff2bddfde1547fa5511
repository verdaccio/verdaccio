import { Octokit } from "@octokit/core";
import { RequestInterface, OctokitResponse, RequestParameters, Route } from "./types";
export declare function iterator(octokit: Octokit, route: Route | RequestInterface, parameters?: RequestParameters): {
    [Symbol.asyncIterator]: () => {
        next(): Promise<{
            done: boolean;
        }> | Promise<{
            value: OctokitResponse<any>;
        }>;
    };
};
