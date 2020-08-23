import { ResponseHeaders } from '@octokit/types';
import { GraphQlEndpointOptions, GraphQlQueryResponse } from "./types";
export declare class GraphqlError<ResponseData> extends Error {
    request: GraphQlEndpointOptions;
    constructor(request: GraphQlEndpointOptions, response: {
        headers: ResponseHeaders;
        data: Required<GraphQlQueryResponse<ResponseData>>;
    });
}
