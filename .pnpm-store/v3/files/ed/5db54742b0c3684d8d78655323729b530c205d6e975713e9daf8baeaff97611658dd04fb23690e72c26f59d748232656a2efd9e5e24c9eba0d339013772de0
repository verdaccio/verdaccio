import { Octokit as Octokit$1 } from '@octokit/core';
import { requestLog } from '@octokit/plugin-request-log';
import { paginateRest } from '@octokit/plugin-paginate-rest';
import { restEndpointMethods } from '@octokit/plugin-rest-endpoint-methods';

const VERSION = "17.0.0";

const Octokit = Octokit$1
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

export { Octokit };
//# sourceMappingURL=index.js.map
