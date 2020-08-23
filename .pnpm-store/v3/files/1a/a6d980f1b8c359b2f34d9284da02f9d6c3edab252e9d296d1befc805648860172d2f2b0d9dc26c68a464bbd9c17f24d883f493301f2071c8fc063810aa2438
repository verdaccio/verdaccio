import { GraphqlError } from "./error";
const NON_VARIABLE_OPTIONS = [
    "method",
    "baseUrl",
    "url",
    "headers",
    "request",
    "query",
    "mediaType",
];
export function graphql(request, query, options) {
    options =
        typeof query === "string"
            ? (options = Object.assign({ query }, options))
            : (options = query);
    const requestOptions = Object.keys(options).reduce((result, key) => {
        if (NON_VARIABLE_OPTIONS.includes(key)) {
            result[key] = options[key];
            return result;
        }
        if (!result.variables) {
            result.variables = {};
        }
        result.variables[key] = options[key];
        return result;
    }, {});
    return request(requestOptions).then((response) => {
        if (response.data.errors) {
            const headers = {};
            for (const key of Object.keys(response.headers)) {
                headers[key] = response.headers[key];
            }
            throw new GraphqlError(requestOptions, {
                headers,
                data: response.data,
            });
        }
        return response.data.data;
    });
}
