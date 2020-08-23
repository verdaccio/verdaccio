import { Octokit as Core } from "@octokit/core";
import { requestLog } from "@octokit/plugin-request-log";
import { paginateRest } from "@octokit/plugin-paginate-rest";
import { restEndpointMethods } from "@octokit/plugin-rest-endpoint-methods";
import { VERSION } from "./version";
export const Octokit = Core
    // TODO: this really should be
    //
    //     .plugin([requestLog, paginateRest, restEndpointMethods])
    //
    // but for mystical reasons, using the line above does set the resulting the
    // `octokit` instance type correctly. Neither `octokit.paginate()` nor all the
    // endpoint methods such as `octokit.repos.get() are set
    .plugin(requestLog)
    .plugin([paginateRest, restEndpointMethods])
    .defaults({
    userAgent: `octokit-rest.js/${VERSION}`
});
