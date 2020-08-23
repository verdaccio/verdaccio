const Endpoints = {
    actions: {
        addSelectedRepoToOrgSecret: [
            "PUT /orgs/{org}/actions/secrets/{secret_name}/repositories/{repository_id}",
        ],
        cancelWorkflowRun: [
            "POST /repos/{owner}/{repo}/actions/runs/{run_id}/cancel",
        ],
        createOrUpdateOrgSecret: ["PUT /orgs/{org}/actions/secrets/{secret_name}"],
        createOrUpdateRepoSecret: [
            "PUT /repos/{owner}/{repo}/actions/secrets/{secret_name}",
            {},
            { renamedParameters: { name: "secret_name" } },
        ],
        createOrUpdateSecretForRepo: [
            "PUT /repos/{owner}/{repo}/actions/secrets/{secret_name}",
            {},
            {
                renamed: ["actions", "createOrUpdateRepoSecret"],
                renamedParameters: { name: "secret_name" },
            },
        ],
        createRegistrationToken: [
            "POST /repos/{owner}/{repo}/actions/runners/registration-token",
            {},
            { renamed: ["actions", "createRegistrationTokenForRepo"] },
        ],
        createRegistrationTokenForOrg: [
            "POST /orgs/{org}/actions/runners/registration-token",
        ],
        createRegistrationTokenForRepo: [
            "POST /repos/{owner}/{repo}/actions/runners/registration-token",
        ],
        createRemoveToken: [
            "POST /repos/{owner}/{repo}/actions/runners/remove-token",
            {},
            { renamed: ["actions", "createRemoveTokenForRepo"] },
        ],
        createRemoveTokenForOrg: ["POST /orgs/{org}/actions/runners/remove-token"],
        createRemoveTokenForRepo: [
            "POST /repos/{owner}/{repo}/actions/runners/remove-token",
        ],
        deleteArtifact: [
            "DELETE /repos/{owner}/{repo}/actions/artifacts/{artifact_id}",
        ],
        deleteOrgSecret: ["DELETE /orgs/{org}/actions/secrets/{secret_name}"],
        deleteRepoSecret: [
            "DELETE /repos/{owner}/{repo}/actions/secrets/{secret_name}",
            {},
            { renamedParameters: { name: "secret_name" } },
        ],
        deleteSecretFromRepo: [
            "DELETE /repos/{owner}/{repo}/actions/secrets/{secret_name}",
            {},
            {
                renamed: ["actions", "deleteRepoSecret"],
                renamedParameters: { name: "secret_name" },
            },
        ],
        deleteSelfHostedRunnerFromOrg: [
            "DELETE /orgs/{org}/actions/runners/{runner_id}",
        ],
        deleteSelfHostedRunnerFromRepo: [
            "DELETE /repos/{owner}/{repo}/actions/runners/{runner_id}",
        ],
        deleteWorkflowRunLogs: [
            "DELETE /repos/{owner}/{repo}/actions/runs/{run_id}/logs",
        ],
        downloadArtifact: [
            "GET /repos/{owner}/{repo}/actions/artifacts/{artifact_id}/{archive_format}",
        ],
        downloadJobLogsForWorkflowRun: [
            "GET /repos/{owner}/{repo}/actions/jobs/{job_id}/logs",
        ],
        downloadWorkflowJobLogs: [
            "GET /repos/{owner}/{repo}/actions/jobs/{job_id}/logs",
            {},
            { renamed: ["actions", "downloadJobLogsForWorkflowRun"] },
        ],
        downloadWorkflowRunLogs: [
            "GET /repos/{owner}/{repo}/actions/runs/{run_id}/logs",
        ],
        getArtifact: ["GET /repos/{owner}/{repo}/actions/artifacts/{artifact_id}"],
        getJobForWorkflowRun: ["GET /repos/{owner}/{repo}/actions/jobs/{job_id}"],
        getOrgPublicKey: ["GET /orgs/{org}/actions/secrets/public-key"],
        getOrgSecret: ["GET /orgs/{org}/actions/secrets/{secret_name}"],
        getPublicKey: [
            "GET /repos/{owner}/{repo}/actions/secrets/public-key",
            {},
            { renamed: ["actions", "getRepoPublicKey"] },
        ],
        getRepoPublicKey: ["GET /repos/{owner}/{repo}/actions/secrets/public-key"],
        getRepoSecret: [
            "GET /repos/{owner}/{repo}/actions/secrets/{secret_name}",
            {},
            { renamedParameters: { name: "secret_name" } },
        ],
        getSecret: [
            "GET /repos/{owner}/{repo}/actions/secrets/{secret_name}",
            {},
            {
                renamed: ["actions", "getRepoSecret"],
                renamedParameters: { name: "secret_name" },
            },
        ],
        getSelfHostedRunner: [
            "GET /repos/{owner}/{repo}/actions/runners/{runner_id}",
            {},
            { renamed: ["actions", "getSelfHostedRunnerForRepo"] },
        ],
        getSelfHostedRunnerForOrg: ["GET /orgs/{org}/actions/runners/{runner_id}"],
        getSelfHostedRunnerForRepo: [
            "GET /repos/{owner}/{repo}/actions/runners/{runner_id}",
        ],
        getWorkflow: ["GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}"],
        getWorkflowJob: [
            "GET /repos/{owner}/{repo}/actions/jobs/{job_id}",
            {},
            { renamed: ["actions", "getJobForWorkflowRun"] },
        ],
        getWorkflowRun: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}"],
        getWorkflowRunUsage: [
            "GET /repos/{owner}/{repo}/actions/runs/{run_id}/timing",
        ],
        getWorkflowUsage: [
            "GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/timing",
        ],
        listArtifactsForRepo: ["GET /repos/{owner}/{repo}/actions/artifacts"],
        listDownloadsForSelfHostedRunnerApplication: [
            "GET /repos/{owner}/{repo}/actions/runners/downloads",
            {},
            { renamed: ["actions", "listRunnerApplicationsForRepo"] },
        ],
        listJobsForWorkflowRun: [
            "GET /repos/{owner}/{repo}/actions/runs/{run_id}/jobs",
        ],
        listOrgSecrets: ["GET /orgs/{org}/actions/secrets"],
        listRepoSecrets: ["GET /repos/{owner}/{repo}/actions/secrets"],
        listRepoWorkflowRuns: [
            "GET /repos/{owner}/{repo}/actions/runs",
            {},
            { renamed: ["actions", "listWorkflowRunsForRepo"] },
        ],
        listRepoWorkflows: ["GET /repos/{owner}/{repo}/actions/workflows"],
        listRunnerApplicationsForOrg: ["GET /orgs/{org}/actions/runners/downloads"],
        listRunnerApplicationsForRepo: [
            "GET /repos/{owner}/{repo}/actions/runners/downloads",
        ],
        listSecretsForRepo: [
            "GET /repos/{owner}/{repo}/actions/secrets",
            {},
            { renamed: ["actions", "listRepoSecrets"] },
        ],
        listSelectedReposForOrgSecret: [
            "GET /orgs/{org}/actions/secrets/{secret_name}/repositories",
        ],
        listSelfHostedRunnersForOrg: ["GET /orgs/{org}/actions/runners"],
        listSelfHostedRunnersForRepo: ["GET /repos/{owner}/{repo}/actions/runners"],
        listWorkflowJobLogs: [
            "GET /repos/{owner}/{repo}/actions/jobs/{job_id}/logs",
            {},
            { renamed: ["actions", "downloadWorkflowJobLogs"] },
        ],
        listWorkflowRunArtifacts: [
            "GET /repos/{owner}/{repo}/actions/runs/{run_id}/artifacts",
        ],
        listWorkflowRunLogs: [
            "GET /repos/{owner}/{repo}/actions/runs/{run_id}/logs",
            {},
            { renamed: ["actions", "downloadWorkflowRunLogs"] },
        ],
        listWorkflowRuns: [
            "GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs",
        ],
        listWorkflowRunsForRepo: ["GET /repos/{owner}/{repo}/actions/runs"],
        reRunWorkflow: ["POST /repos/{owner}/{repo}/actions/runs/{run_id}/rerun"],
        removeSelectedRepoFromOrgSecret: [
            "DELETE /orgs/{org}/actions/secrets/{secret_name}/repositories/{repository_id}",
        ],
        removeSelfHostedRunner: [
            "DELETE /repos/{owner}/{repo}/actions/runners/{runner_id}",
            {},
            { renamed: ["actions", "deleteSelfHostedRunnerFromRepo"] },
        ],
        setSelectedReposForOrgSecret: [
            "PUT /orgs/{org}/actions/secrets/{secret_name}/repositories",
        ],
    },
    activity: {
        checkRepoIsStarredByAuthenticatedUser: ["GET /user/starred/{owner}/{repo}"],
        checkStarringRepo: [
            "GET /user/starred/{owner}/{repo}",
            {},
            { renamed: ["activity", "checkRepoIsStarredByAuthenticatedUser"] },
        ],
        deleteRepoSubscription: ["DELETE /repos/{owner}/{repo}/subscription"],
        deleteThreadSubscription: [
            "DELETE /notifications/threads/{thread_id}/subscription",
        ],
        getFeeds: ["GET /feeds"],
        getRepoSubscription: ["GET /repos/{owner}/{repo}/subscription"],
        getThread: ["GET /notifications/threads/{thread_id}"],
        getThreadSubscription: [
            "PUT /notifications",
            {},
            { renamed: ["activity", "getThreadSubscriptionForAuthenticatedUser"] },
        ],
        getThreadSubscriptionForAuthenticatedUser: [
            "GET /notifications/threads/{thread_id}/subscription",
        ],
        listEventsForAuthenticatedUser: ["GET /users/{username}/events"],
        listEventsForOrg: [
            "GET /users/{username}/events/orgs/{org}",
            {},
            { renamed: ["activity", "listOrgEventsForAuthenticatedUser"] },
        ],
        listEventsForUser: [
            "GET /users/{username}/events",
            {},
            { renamed: ["activity", "listEventsForAuthenticatedUser"] },
        ],
        listFeeds: ["GET /feeds", {}, { renamed: ["activity", "getFeeds"] }],
        listNotifications: [
            "GET /notifications",
            {},
            { renamed: ["activity", "listNotificationsForAuthenticatedUser"] },
        ],
        listNotificationsForAuthenticatedUser: ["GET /notifications"],
        listNotificationsForRepo: [
            "GET /repos/{owner}/{repo}/notifications",
            {},
            { renamed: ["activity", "listRepoNotificationsForAuthenticatedUser"] },
        ],
        listOrgEventsForAuthenticatedUser: [
            "GET /users/{username}/events/orgs/{org}",
        ],
        listPublicEvents: ["GET /events"],
        listPublicEventsForOrg: [
            "GET /orgs/{org}/events",
            {},
            { renamed: ["activity", "listPublicOrgEvents"] },
        ],
        listPublicEventsForRepoNetwork: ["GET /networks/{owner}/{repo}/events"],
        listPublicEventsForUser: ["GET /users/{username}/events/public"],
        listPublicOrgEvents: ["GET /orgs/{org}/events"],
        listReceivedEventsForUser: ["GET /users/{username}/received_events"],
        listReceivedPublicEventsForUser: [
            "GET /users/{username}/received_events/public",
        ],
        listRepoEvents: ["GET /repos/{owner}/{repo}/events"],
        listRepoNotificationsForAuthenticatedUser: [
            "GET /repos/{owner}/{repo}/notifications",
        ],
        listReposStarredByAuthenticatedUser: ["GET /user/starred"],
        listReposStarredByUser: ["GET /users/{username}/starred"],
        listReposWatchedByUser: ["GET /users/{username}/subscriptions"],
        listStargazersForRepo: ["GET /repos/{owner}/{repo}/stargazers"],
        listWatchedReposForAuthenticatedUser: ["GET /user/subscriptions"],
        listWatchersForRepo: ["GET /repos/{owner}/{repo}/subscribers"],
        markAsRead: [
            "PUT /notifications",
            {},
            { renamed: ["activity", "markNotificationsAsRead"] },
        ],
        markNotificationsAsRead: ["PUT /notifications"],
        markNotificationsAsReadForRepo: [
            "PUT /repos/{owner}/{repo}/notifications",
            {},
            { renamed: ["activity", "markRepoNotificationsAsRead"] },
        ],
        markRepoNotificationsAsRead: ["PUT /repos/{owner}/{repo}/notifications"],
        markThreadAsRead: ["PATCH /notifications/threads/{thread_id}"],
        setRepoSubscription: ["PUT /repos/{owner}/{repo}/subscription"],
        setThreadSubscription: [
            "PUT /notifications/threads/{thread_id}/subscription",
        ],
        starRepo: [
            "PUT /user/starred/{owner}/{repo}",
            {},
            { renamed: ["activity", "starRepoForAuthenticatedUser"] },
        ],
        starRepoForAuthenticatedUser: ["PUT /user/starred/{owner}/{repo}"],
        unstarRepo: [
            "DELETE /user/starred/{owner}/{repo}",
            {},
            { renamed: ["activity", "unstarRepoForAuthenticatedUser"] },
        ],
        unstarRepoForAuthenticatedUser: ["DELETE /user/starred/{owner}/{repo}"],
    },
    apps: {
        addRepoToInstallation: [
            "PUT /user/installations/{installation_id}/repositories/{repository_id}",
            { mediaType: { previews: ["machine-man"] } },
        ],
        checkAccountIsAssociatedWithAny: [
            "GET /marketplace_listing/accounts/{account_id}",
            {},
            { renamed: ["apps", "getSubscriptionPlanForAccount"] },
        ],
        checkAccountIsAssociatedWithAnyStubbed: [
            "GET /marketplace_listing/stubbed/accounts/{account_id}",
            {},
            { renamed: ["apps", "getSubscriptionPlanForAccountStubbed"] },
        ],
        checkToken: ["POST /applications/{client_id}/token"],
        createContentAttachment: [
            "POST /content_references/{content_reference_id}/attachments",
            { mediaType: { previews: ["corsair"] } },
        ],
        createFromManifest: ["POST /app-manifests/{code}/conversions"],
        createInstallationAccessToken: [
            "POST /app/installations/{installation_id}/access_tokens",
            { mediaType: { previews: ["machine-man"] } },
        ],
        createInstallationToken: [
            "POST /app/installations/{installation_id}/access_tokens",
            { mediaType: { previews: ["machine-man"] } },
            { renamed: ["apps", "createInstallationAccessToken"] },
        ],
        deleteAuthorization: ["DELETE /applications/{client_id}/grant"],
        deleteInstallation: [
            "DELETE /app/installations/{installation_id}",
            { mediaType: { previews: ["machine-man"] } },
        ],
        deleteToken: ["DELETE /applications/{client_id}/token"],
        getAuthenticated: [
            "GET /app",
            { mediaType: { previews: ["machine-man"] } },
        ],
        getBySlug: [
            "GET /apps/{app_slug}",
            { mediaType: { previews: ["machine-man"] } },
        ],
        getInstallation: [
            "GET /app/installations/{installation_id}",
            { mediaType: { previews: ["machine-man"] } },
        ],
        getOrgInstallation: [
            "GET /orgs/{org}/installation",
            { mediaType: { previews: ["machine-man"] } },
        ],
        getRepoInstallation: [
            "GET /repos/{owner}/{repo}/installation",
            { mediaType: { previews: ["machine-man"] } },
        ],
        getSubscriptionPlanForAccount: [
            "GET /marketplace_listing/accounts/{account_id}",
        ],
        getSubscriptionPlanForAccountStubbed: [
            "GET /marketplace_listing/stubbed/accounts/{account_id}",
        ],
        getUserInstallation: [
            "GET /users/{username}/installation",
            { mediaType: { previews: ["machine-man"] } },
        ],
        listAccountsForPlan: ["GET /marketplace_listing/plans/{plan_id}/accounts"],
        listAccountsForPlanStubbed: [
            "GET /marketplace_listing/stubbed/plans/{plan_id}/accounts",
        ],
        listAccountsUserOrOrgOnPlan: [
            "GET /marketplace_listing/plans/{plan_id}/accounts",
            {},
            { renamed: ["apps", "listAccountsForPlan"] },
        ],
        listAccountsUserOrOrgOnPlanStubbed: [
            "GET /marketplace_listing/stubbed/plans/{plan_id}/accounts",
            {},
            { renamed: ["apps", "listAccountsForPlanStubbed"] },
        ],
        listInstallationReposForAuthenticatedUser: [
            "GET /user/installations/{installation_id}/repositories",
            { mediaType: { previews: ["machine-man"] } },
        ],
        listInstallations: [
            "GET /app/installations",
            { mediaType: { previews: ["machine-man"] } },
        ],
        listInstallationsForAuthenticatedUser: [
            "GET /user/installations",
            { mediaType: { previews: ["machine-man"] } },
        ],
        listMarketplacePurchasesForAuthenticatedUser: [
            "GET /user/marketplace_purchases",
            {},
            { renamed: ["apps", "listSubscriptionsForAuthenticatedUser"] },
        ],
        listMarketplacePurchasesForAuthenticatedUserStubbed: [
            "GET /user/marketplace_purchases/stubbed",
            {},
            { renamed: ["apps", "listSubscriptionsForAuthenticatedUserStubbed"] },
        ],
        listPlans: ["GET /marketplace_listing/plans"],
        listPlansStubbed: ["GET /marketplace_listing/stubbed/plans"],
        listRepos: [
            "GET /installation/repositories",
            { mediaType: { previews: ["machine-man"] } },
            { renamed: ["apps", "listReposAccessibleToInstallation"] },
        ],
        listReposAccessibleToInstallation: [
            "GET /installation/repositories",
            { mediaType: { previews: ["machine-man"] } },
        ],
        listSubscriptionsForAuthenticatedUser: ["GET /user/marketplace_purchases"],
        listSubscriptionsForAuthenticatedUserStubbed: [
            "GET /user/marketplace_purchases/stubbed",
        ],
        removeRepoFromInstallation: [
            "DELETE /user/installations/{installation_id}/repositories/{repository_id}",
            { mediaType: { previews: ["machine-man"] } },
        ],
        resetToken: ["PATCH /applications/{client_id}/token"],
        revokeInstallationAccessToken: ["DELETE /installation/token"],
        revokeInstallationToken: [
            "DELETE /installation/token",
            {},
            { renamed: ["apps", "revokeInstallationAccessToken"] },
        ],
        suspendInstallation: ["PUT /app/installations/{installation_id}/suspended"],
        unsuspendInstallation: [
            "DELETE /app/installations/{installation_id}/suspended",
        ],
    },
    checks: {
        create: [
            "POST /repos/{owner}/{repo}/check-runs",
            { mediaType: { previews: ["antiope"] } },
        ],
        createSuite: [
            "POST /repos/{owner}/{repo}/check-suites",
            { mediaType: { previews: ["antiope"] } },
        ],
        get: [
            "GET /repos/{owner}/{repo}/check-runs/{check_run_id}",
            { mediaType: { previews: ["antiope"] } },
        ],
        getSuite: [
            "GET /repos/{owner}/{repo}/check-suites/{check_suite_id}",
            { mediaType: { previews: ["antiope"] } },
        ],
        listAnnotations: [
            "GET /repos/{owner}/{repo}/check-runs/{check_run_id}/annotations",
            { mediaType: { previews: ["antiope"] } },
        ],
        listForRef: [
            "GET /repos/{owner}/{repo}/commits/{ref}/check-runs",
            { mediaType: { previews: ["antiope"] } },
        ],
        listForSuite: [
            "GET /repos/{owner}/{repo}/check-suites/{check_suite_id}/check-runs",
            { mediaType: { previews: ["antiope"] } },
        ],
        listSuitesForRef: [
            "GET /repos/{owner}/{repo}/commits/{ref}/check-suites",
            { mediaType: { previews: ["antiope"] } },
        ],
        rerequestSuite: [
            "POST /repos/{owner}/{repo}/check-suites/{check_suite_id}/rerequest",
            { mediaType: { previews: ["antiope"] } },
        ],
        setSuitesPreferences: [
            "PATCH /repos/{owner}/{repo}/check-suites/preferences",
            { mediaType: { previews: ["antiope"] } },
        ],
        update: [
            "PATCH /repos/{owner}/{repo}/check-runs/{check_run_id}",
            { mediaType: { previews: ["antiope"] } },
        ],
    },
    codeScanning: {
        getAlert: ["GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_id}"],
        listAlertsForRepo: ["GET /repos/{owner}/{repo}/code-scanning/alerts"],
    },
    codesOfConduct: {
        getAllCodesOfConduct: [
            "GET /codes_of_conduct",
            { mediaType: { previews: ["scarlet-witch"] } },
        ],
        getConductCode: [
            "GET /codes_of_conduct/{key}",
            { mediaType: { previews: ["scarlet-witch"] } },
        ],
        getForRepo: [
            "GET /repos/{owner}/{repo}/community/code_of_conduct",
            { mediaType: { previews: ["scarlet-witch"] } },
        ],
        listConductCodes: [
            "GET /codes_of_conduct",
            { mediaType: { previews: ["scarlet-witch"] } },
            { renamed: ["codesOfConduct", "getAllCodesOfConduct"] },
        ],
    },
    emojis: { get: ["GET /emojis"] },
    gists: {
        checkIsStarred: ["GET /gists/{gist_id}/star"],
        create: ["POST /gists"],
        createComment: ["POST /gists/{gist_id}/comments"],
        delete: ["DELETE /gists/{gist_id}"],
        deleteComment: ["DELETE /gists/{gist_id}/comments/{comment_id}"],
        fork: ["POST /gists/{gist_id}/forks"],
        get: ["GET /gists/{gist_id}"],
        getComment: ["GET /gists/{gist_id}/comments/{comment_id}"],
        getRevision: ["GET /gists/{gist_id}/{sha}"],
        list: ["GET /gists"],
        listComments: ["GET /gists/{gist_id}/comments"],
        listCommits: ["GET /gists/{gist_id}/commits"],
        listForUser: ["GET /users/{username}/gists"],
        listForks: ["GET /gists/{gist_id}/forks"],
        listPublic: ["GET /gists/public"],
        listPublicForUser: [
            "GET /users/{username}/gists",
            {},
            { renamed: ["gists", "listForUser"] },
        ],
        listStarred: ["GET /gists/starred"],
        star: ["PUT /gists/{gist_id}/star"],
        unstar: ["DELETE /gists/{gist_id}/star"],
        update: ["PATCH /gists/{gist_id}"],
        updateComment: ["PATCH /gists/{gist_id}/comments/{comment_id}"],
    },
    git: {
        createBlob: ["POST /repos/{owner}/{repo}/git/blobs"],
        createCommit: ["POST /repos/{owner}/{repo}/git/commits"],
        createRef: ["POST /repos/{owner}/{repo}/git/refs"],
        createTag: ["POST /repos/{owner}/{repo}/git/tags"],
        createTree: ["POST /repos/{owner}/{repo}/git/trees"],
        deleteRef: ["DELETE /repos/{owner}/{repo}/git/refs/{ref}"],
        getBlob: ["GET /repos/{owner}/{repo}/git/blobs/{file_sha}"],
        getCommit: ["GET /repos/{owner}/{repo}/git/commits/{commit_sha}"],
        getRef: ["GET /repos/{owner}/{repo}/git/ref/{ref}"],
        getTag: ["GET /repos/{owner}/{repo}/git/tags/{tag_sha}"],
        getTree: ["GET /repos/{owner}/{repo}/git/trees/{tree_sha}"],
        listMatchingRefs: ["GET /repos/{owner}/{repo}/git/matching-refs/{ref}"],
        updateRef: ["PATCH /repos/{owner}/{repo}/git/refs/{ref}"],
    },
    gitignore: {
        getAllTemplates: ["GET /gitignore/templates"],
        getTemplate: ["GET /gitignore/templates/{name}"],
        listTemplates: [
            "GET /gitignore/templates",
            {},
            { renamed: ["gitignore", "getAllTemplates"] },
        ],
    },
    interactions: {
        addOrUpdateRestrictionsForOrg: [
            "PUT /orgs/{org}/interaction-limits",
            { mediaType: { previews: ["sombra"] } },
            { renamed: ["interactions", "setRestrictionsForOrg"] },
        ],
        addOrUpdateRestrictionsForRepo: [
            "PUT /repos/{owner}/{repo}/interaction-limits",
            { mediaType: { previews: ["sombra"] } },
            { renamed: ["interactions", "setRestrictionsForRepo"] },
        ],
        getRestrictionsForOrg: [
            "GET /orgs/{org}/interaction-limits",
            { mediaType: { previews: ["sombra"] } },
        ],
        getRestrictionsForRepo: [
            "GET /repos/{owner}/{repo}/interaction-limits",
            { mediaType: { previews: ["sombra"] } },
        ],
        removeRestrictionsForOrg: [
            "DELETE /orgs/{org}/interaction-limits",
            { mediaType: { previews: ["sombra"] } },
        ],
        removeRestrictionsForRepo: [
            "DELETE /repos/{owner}/{repo}/interaction-limits",
            { mediaType: { previews: ["sombra"] } },
        ],
        setRestrictionsForOrg: [
            "PUT /orgs/{org}/interaction-limits",
            { mediaType: { previews: ["sombra"] } },
        ],
        setRestrictionsForRepo: [
            "PUT /repos/{owner}/{repo}/interaction-limits",
            { mediaType: { previews: ["sombra"] } },
        ],
    },
    issues: {
        addAssignees: [
            "POST /repos/{owner}/{repo}/issues/{issue_number}/assignees",
        ],
        addLabels: ["POST /repos/{owner}/{repo}/issues/{issue_number}/labels"],
        checkAssignee: [
            "GET /repos/{owner}/{repo}/assignees/{assignee}",
            {},
            { renamed: ["issues", "checkUserCanBeAssigned"] },
        ],
        checkUserCanBeAssigned: ["GET /repos/{owner}/{repo}/assignees/{assignee}"],
        create: ["POST /repos/{owner}/{repo}/issues"],
        createComment: [
            "POST /repos/{owner}/{repo}/issues/{issue_number}/comments",
        ],
        createLabel: ["POST /repos/{owner}/{repo}/labels"],
        createMilestone: ["POST /repos/{owner}/{repo}/milestones"],
        deleteComment: [
            "DELETE /repos/{owner}/{repo}/issues/comments/{comment_id}",
        ],
        deleteLabel: ["DELETE /repos/{owner}/{repo}/labels/{name}"],
        deleteMilestone: [
            "DELETE /repos/{owner}/{repo}/milestones/{milestone_number}",
        ],
        get: ["GET /repos/{owner}/{repo}/issues/{issue_number}"],
        getComment: ["GET /repos/{owner}/{repo}/issues/comments/{comment_id}"],
        getEvent: ["GET /repos/{owner}/{repo}/issues/events/{event_id}"],
        getLabel: ["GET /repos/{owner}/{repo}/labels/{name}"],
        getMilestone: ["GET /repos/{owner}/{repo}/milestones/{milestone_number}"],
        list: ["GET /issues"],
        listAssignees: ["GET /repos/{owner}/{repo}/assignees"],
        listComments: ["GET /repos/{owner}/{repo}/issues/{issue_number}/comments"],
        listCommentsForRepo: ["GET /repos/{owner}/{repo}/issues/comments"],
        listEvents: ["GET /repos/{owner}/{repo}/issues/{issue_number}/events"],
        listEventsForRepo: ["GET /repos/{owner}/{repo}/issues/events"],
        listEventsForTimeline: [
            "GET /repos/{owner}/{repo}/issues/{issue_number}/timeline",
            { mediaType: { previews: ["mockingbird"] } },
        ],
        listForAuthenticatedUser: ["GET /user/issues"],
        listForOrg: ["GET /orgs/{org}/issues"],
        listForRepo: ["GET /repos/{owner}/{repo}/issues"],
        listLabelsForMilestone: [
            "GET /repos/{owner}/{repo}/milestones/{milestone_number}/labels",
        ],
        listLabelsForRepo: ["GET /repos/{owner}/{repo}/labels"],
        listLabelsOnIssue: [
            "GET /repos/{owner}/{repo}/issues/{issue_number}/labels",
        ],
        listMilestones: ["GET /repos/{owner}/{repo}/milestones"],
        listMilestonesForRepo: [
            "GET /repos/{owner}/{repo}/milestones",
            {},
            { renamed: ["issues", "listMilestones"] },
        ],
        lock: ["PUT /repos/{owner}/{repo}/issues/{issue_number}/lock"],
        removeAllLabels: [
            "DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels",
        ],
        removeAssignees: [
            "DELETE /repos/{owner}/{repo}/issues/{issue_number}/assignees",
        ],
        removeLabel: [
            "DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels/{name}",
        ],
        removeLabels: [
            "DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels",
            {},
            { renamed: ["issues", "removeAllLabels"] },
        ],
        replaceAllLabels: [
            "PUT /repos/{owner}/{repo}/issues/{issue_number}/labels",
            {},
            { renamed: ["issues", "setLabels"] },
        ],
        replaceLabels: [
            "PUT /repos/{owner}/{repo}/issues/{issue_number}/labels",
            {},
            { renamed: ["issues", "replaceAllLabels"] },
        ],
        setLabels: ["PUT /repos/{owner}/{repo}/issues/{issue_number}/labels"],
        unlock: ["DELETE /repos/{owner}/{repo}/issues/{issue_number}/lock"],
        update: ["PATCH /repos/{owner}/{repo}/issues/{issue_number}"],
        updateComment: ["PATCH /repos/{owner}/{repo}/issues/comments/{comment_id}"],
        updateLabel: ["PATCH /repos/{owner}/{repo}/labels/{name}"],
        updateMilestone: [
            "PATCH /repos/{owner}/{repo}/milestones/{milestone_number}",
        ],
    },
    licenses: {
        get: ["GET /licenses/{license}"],
        getAllCommonlyUsed: ["GET /licenses"],
        getForRepo: ["GET /repos/{owner}/{repo}/license"],
        listCommonlyUsed: [
            "GET /licenses",
            {},
            { renamed: ["licenses", "getAllCommonlyUsed"] },
        ],
    },
    markdown: {
        render: ["POST /markdown"],
        renderRaw: [
            "POST /markdown/raw",
            { headers: { "content-type": "text/plain; charset=utf-8" } },
        ],
    },
    meta: { get: ["GET /meta"] },
    migrations: {
        cancelImport: ["DELETE /repos/{owner}/{repo}/import"],
        deleteArchiveForAuthenticatedUser: [
            "DELETE /user/migrations/{migration_id}/archive",
            { mediaType: { previews: ["wyandotte"] } },
        ],
        deleteArchiveForOrg: [
            "DELETE /orgs/{org}/migrations/{migration_id}/archive",
            { mediaType: { previews: ["wyandotte"] } },
        ],
        downloadArchiveForOrg: [
            "GET /orgs/{org}/migrations/{migration_id}/archive",
            { mediaType: { previews: ["wyandotte"] } },
        ],
        getArchiveForAuthenticatedUser: [
            "GET /user/migrations/{migration_id}/archive",
            { mediaType: { previews: ["wyandotte"] } },
        ],
        getCommitAuthors: ["GET /repos/{owner}/{repo}/import/authors"],
        getImportProgress: [
            "GET /repos/{owner}/{repo}/import",
            {},
            { renamed: ["migrations", "getImportStatus"] },
        ],
        getImportStatus: ["GET /repos/{owner}/{repo}/import"],
        getLargeFiles: ["GET /repos/{owner}/{repo}/import/large_files"],
        getStatusForAuthenticatedUser: [
            "GET /user/migrations/{migration_id}",
            { mediaType: { previews: ["wyandotte"] } },
        ],
        getStatusForOrg: [
            "GET /orgs/{org}/migrations/{migration_id}",
            { mediaType: { previews: ["wyandotte"] } },
        ],
        listForAuthenticatedUser: [
            "GET /user/migrations",
            { mediaType: { previews: ["wyandotte"] } },
        ],
        listForOrg: [
            "GET /orgs/{org}/migrations",
            { mediaType: { previews: ["wyandotte"] } },
        ],
        listReposForOrg: [
            "GET /orgs/{org}/migrations/{migration_id}/repositories",
            { mediaType: { previews: ["wyandotte"] } },
        ],
        listReposForUser: [
            "GET /user/{migration_id}/repositories",
            { mediaType: { previews: ["wyandotte"] } },
        ],
        mapCommitAuthor: ["PATCH /repos/{owner}/{repo}/import/authors/{author_id}"],
        setLfsPreference: ["PATCH /repos/{owner}/{repo}/import/lfs"],
        startForAuthenticatedUser: ["POST /user/migrations"],
        startForOrg: ["POST /orgs/{org}/migrations"],
        startImport: ["PUT /repos/{owner}/{repo}/import"],
        unlockRepoForAuthenticatedUser: [
            "DELETE /user/migrations/{migration_id}/repos/{repo_name}/lock",
            { mediaType: { previews: ["wyandotte"] } },
        ],
        unlockRepoForOrg: [
            "DELETE /orgs/{org}/migrations/{migration_id}/repos/{repo_name}/lock",
            { mediaType: { previews: ["wyandotte"] } },
        ],
        updateImport: ["PATCH /repos/{owner}/{repo}/import"],
    },
    orgs: {
        addOrUpdateMembership: [
            "PUT /orgs/{org}/memberships/{username}",
            {},
            { renamed: ["orgs", "setMembershipForUser"] },
        ],
        blockUser: ["PUT /orgs/{org}/blocks/{username}"],
        checkBlockedUser: ["GET /orgs/{org}/blocks/{username}"],
        checkMembership: [
            "GET /orgs/{org}/members/{username}",
            {},
            { renamed: ["orgs", "checkMembershipForUser"] },
        ],
        checkMembershipForUser: ["GET /orgs/{org}/members/{username}"],
        checkPublicMembership: [
            "GET /orgs/{org}/public_members/{username}",
            {},
            { renamed: ["orgs", "checkPublicMembershipForUser"] },
        ],
        checkPublicMembershipForUser: ["GET /orgs/{org}/public_members/{username}"],
        concealMembership: [
            "DELETE /orgs/{org}/public_members/{username}",
            {},
            { renamed: ["orgs", "removePublicMembershipForAuthenticatedUser"] },
        ],
        convertMemberToOutsideCollaborator: [
            "PUT /orgs/{org}/outside_collaborators/{username}",
        ],
        createHook: [
            "POST /orgs/{org}/hooks",
            {},
            { renamed: ["orgs", "createWebhook"] },
        ],
        createInvitation: ["POST /orgs/{org}/invitations"],
        createWebhook: ["POST /orgs/{org}/hooks"],
        deleteHook: [
            "DELETE /orgs/{org}/hooks/{hook_id}",
            {},
            { renamed: ["orgs", "deleteWebhook"] },
        ],
        deleteWebhook: ["DELETE /orgs/{org}/hooks/{hook_id}"],
        get: ["GET /orgs/{org}"],
        getHook: [
            "GET /orgs/{org}/hooks/{hook_id}",
            {},
            { renamed: ["orgs", "getWebhook"] },
        ],
        getMembership: [
            "GET /orgs/{org}/memberships/{username}",
            {},
            { renamed: ["orgs", "getMembershipForUser"] },
        ],
        getMembershipForAuthenticatedUser: ["GET /user/memberships/orgs/{org}"],
        getMembershipForUser: ["GET /orgs/{org}/memberships/{username}"],
        getWebhook: ["GET /orgs/{org}/hooks/{hook_id}"],
        list: ["GET /organizations"],
        listAppInstallations: [
            "GET /orgs/{org}/installations",
            { mediaType: { previews: ["machine-man"] } },
        ],
        listBlockedUsers: ["GET /orgs/{org}/blocks"],
        listForAuthenticatedUser: ["GET /user/orgs"],
        listForUser: ["GET /users/{username}/orgs"],
        listHooks: [
            "GET /orgs/{org}/hooks",
            {},
            { renamed: ["orgs", "listWebhooks"] },
        ],
        listInstallations: [
            "GET /orgs/{org}/installations",
            { mediaType: { previews: ["machine-man"] } },
            { renamed: ["orgs", "listAppInstallations"] },
        ],
        listInvitationTeams: ["GET /orgs/{org}/invitations/{invitation_id}/teams"],
        listMembers: ["GET /orgs/{org}/members"],
        listMemberships: [
            "GET /user/memberships/orgs",
            {},
            { renamed: ["orgs", "listMembershipsForAuthenticatedUser"] },
        ],
        listMembershipsForAuthenticatedUser: ["GET /user/memberships/orgs"],
        listOutsideCollaborators: ["GET /orgs/{org}/outside_collaborators"],
        listPendingInvitations: ["GET /orgs/{org}/invitations"],
        listPublicMembers: ["GET /orgs/{org}/public_members"],
        listWebhooks: ["GET /orgs/{org}/hooks"],
        pingHook: [
            "POST /orgs/{org}/hooks/{hook_id}/pings",
            {},
            { renamed: ["orgs", "pingWebhook"] },
        ],
        pingWebhook: ["POST /orgs/{org}/hooks/{hook_id}/pings"],
        publicizeMembership: [
            "PUT /orgs/{org}/public_members/{username}",
            {},
            { renamed: ["orgs", "setPublicMembershipForAuthenticatedUser"] },
        ],
        removeMember: ["DELETE /orgs/{org}/members/{username}"],
        removeMembership: [
            "DELETE /orgs/{org}/memberships/{username}",
            {},
            { renamed: ["orgs", "removeMembershipForUser"] },
        ],
        removeMembershipForUser: ["DELETE /orgs/{org}/memberships/{username}"],
        removeOutsideCollaborator: [
            "DELETE /orgs/{org}/outside_collaborators/{username}",
        ],
        removePublicMembershipForAuthenticatedUser: [
            "DELETE /orgs/{org}/public_members/{username}",
        ],
        setMembershipForUser: ["PUT /orgs/{org}/memberships/{username}"],
        setPublicMembershipForAuthenticatedUser: [
            "PUT /orgs/{org}/public_members/{username}",
        ],
        unblockUser: ["DELETE /orgs/{org}/blocks/{username}"],
        update: ["PATCH /orgs/{org}"],
        updateHook: [
            "PATCH /orgs/{org}/hooks/{hook_id}",
            {},
            { renamed: ["orgs", "updateWebhook"] },
        ],
        updateMembership: [
            "PATCH /user/memberships/orgs/{org}",
            {},
            { renamed: ["orgs", "updateMembershipForAuthenticatedUser"] },
        ],
        updateMembershipForAuthenticatedUser: [
            "PATCH /user/memberships/orgs/{org}",
        ],
        updateWebhook: ["PATCH /orgs/{org}/hooks/{hook_id}"],
    },
    projects: {
        addCollaborator: [
            "PUT /projects/{project_id}/collaborators/{username}",
            { mediaType: { previews: ["inertia"] } },
        ],
        createCard: [
            "POST /projects/columns/{column_id}/cards",
            { mediaType: { previews: ["inertia"] } },
        ],
        createColumn: [
            "POST /projects/{project_id}/columns",
            { mediaType: { previews: ["inertia"] } },
        ],
        createForAuthenticatedUser: [
            "POST /user/projects",
            { mediaType: { previews: ["inertia"] } },
        ],
        createForOrg: [
            "POST /orgs/{org}/projects",
            { mediaType: { previews: ["inertia"] } },
        ],
        createForRepo: [
            "POST /repos/{owner}/{repo}/projects",
            { mediaType: { previews: ["inertia"] } },
        ],
        delete: [
            "DELETE /projects/{project_id}",
            { mediaType: { previews: ["inertia"] } },
        ],
        deleteCard: [
            "DELETE /projects/columns/cards/{card_id}",
            { mediaType: { previews: ["inertia"] } },
        ],
        deleteColumn: [
            "DELETE /projects/columns/{column_id}",
            { mediaType: { previews: ["inertia"] } },
        ],
        get: [
            "GET /projects/{project_id}",
            { mediaType: { previews: ["inertia"] } },
        ],
        getCard: [
            "GET /projects/columns/cards/{card_id}",
            { mediaType: { previews: ["inertia"] } },
        ],
        getColumn: [
            "GET /projects/columns/{column_id}",
            { mediaType: { previews: ["inertia"] } },
        ],
        getPermissionForUser: [
            "GET /projects/{project_id}/collaborators/{username}/permission",
            { mediaType: { previews: ["inertia"] } },
        ],
        listCards: [
            "GET /projects/columns/{column_id}/cards",
            { mediaType: { previews: ["inertia"] } },
        ],
        listCollaborators: [
            "GET /projects/{project_id}/collaborators",
            { mediaType: { previews: ["inertia"] } },
        ],
        listColumns: [
            "GET /projects/{project_id}/columns",
            { mediaType: { previews: ["inertia"] } },
        ],
        listForOrg: [
            "GET /orgs/{org}/projects",
            { mediaType: { previews: ["inertia"] } },
        ],
        listForRepo: [
            "GET /repos/{owner}/{repo}/projects",
            { mediaType: { previews: ["inertia"] } },
        ],
        listForUser: [
            "GET /users/{username}/projects",
            { mediaType: { previews: ["inertia"] } },
        ],
        moveCard: [
            "POST /projects/columns/cards/{card_id}/moves",
            { mediaType: { previews: ["inertia"] } },
        ],
        moveColumn: [
            "POST /projects/columns/{column_id}/moves",
            { mediaType: { previews: ["inertia"] } },
        ],
        removeCollaborator: [
            "DELETE /projects/{project_id}/collaborators/{username}",
            { mediaType: { previews: ["inertia"] } },
        ],
        reviewUserPermissionLevel: [
            "GET /projects/{project_id}/collaborators/{username}/permission",
            { mediaType: { previews: ["inertia"] } },
            { renamed: ["projects", "getPermissionForUser"] },
        ],
        update: [
            "PATCH /projects/{project_id}",
            { mediaType: { previews: ["inertia"] } },
        ],
        updateCard: [
            "PATCH /projects/columns/cards/{card_id}",
            { mediaType: { previews: ["inertia"] } },
        ],
        updateColumn: [
            "PATCH /projects/columns/{column_id}",
            { mediaType: { previews: ["inertia"] } },
        ],
    },
    pulls: {
        checkIfMerged: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/merge"],
        create: ["POST /repos/{owner}/{repo}/pulls"],
        createComment: [
            "POST /repos/{owner}/{repo}/pulls/{pull_number}/comments",
            {},
            { renamed: ["pulls", "createReviewComment"] },
        ],
        createReplyForReviewComment: [
            "POST /repos/{owner}/{repo}/pulls/{pull_number}/comments/{comment_id}/replies",
        ],
        createReview: ["POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews"],
        createReviewComment: [
            "POST /repos/{owner}/{repo}/pulls/{pull_number}/comments",
        ],
        createReviewCommentReply: [
            "POST /repos/{owner}/{repo}/pulls/{pull_number}/comments/{comment_id}/replies",
            {},
            { renamed: ["pulls", "createReplyForReviewComment"] },
        ],
        createReviewRequest: [
            "POST /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers",
            {},
            { renamed: ["pulls", "requestReviewers"] },
        ],
        deleteComment: [
            "DELETE /repos/{owner}/{repo}/pulls/comments/{comment_id}",
            {},
            { renamed: ["pulls", "deleteReviewComment"] },
        ],
        deletePendingReview: [
            "DELETE /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}",
        ],
        deleteReviewComment: [
            "DELETE /repos/{owner}/{repo}/pulls/comments/{comment_id}",
        ],
        deleteReviewRequest: [
            "DELETE /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers",
            {},
            { renamed: ["pulls", "removeRequestedReviewers"] },
        ],
        dismissReview: [
            "PUT /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/dismissals",
        ],
        get: ["GET /repos/{owner}/{repo}/pulls/{pull_number}"],
        getComment: [
            "GET /repos/{owner}/{repo}/pulls/comments/{comment_id}",
            {},
            { renamed: ["pulls", "getReviewComment"] },
        ],
        getCommentsForReview: [
            "GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/comments",
            {},
            { renamed: ["pulls", "listCommentsForReview"] },
        ],
        getReview: [
            "GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}",
        ],
        getReviewComment: ["GET /repos/{owner}/{repo}/pulls/comments/{comment_id}"],
        list: ["GET /repos/{owner}/{repo}/pulls"],
        listComments: [
            "GET /repos/{owner}/{repo}/pulls/{pull_number}/comments",
            {},
            { renamed: ["pulls", "listReviewComments"] },
        ],
        listCommentsForRepo: [
            "GET /repos/{owner}/{repo}/pulls/comments",
            {},
            { renamed: ["pulls", "listReviewCommentsForRepo"] },
        ],
        listCommentsForReview: [
            "GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/comments",
        ],
        listCommits: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/commits"],
        listFiles: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/files"],
        listRequestedReviewers: [
            "GET /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers",
        ],
        listReviewComments: [
            "GET /repos/{owner}/{repo}/pulls/{pull_number}/comments",
        ],
        listReviewCommentsForRepo: ["GET /repos/{owner}/{repo}/pulls/comments"],
        listReviewRequests: [
            "GET /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers",
            {},
            { renamed: ["pulls", "listRequestedReviewers"] },
        ],
        listReviews: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews"],
        merge: ["PUT /repos/{owner}/{repo}/pulls/{pull_number}/merge"],
        removeRequestedReviewers: [
            "DELETE /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers",
        ],
        requestReviewers: [
            "POST /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers",
        ],
        submitReview: [
            "POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/events",
        ],
        update: ["PATCH /repos/{owner}/{repo}/pulls/{pull_number}"],
        updateBranch: [
            "PUT /repos/{owner}/{repo}/pulls/{pull_number}/update-branch",
            { mediaType: { previews: ["lydian"] } },
        ],
        updateComment: [
            "PATCH /repos/{owner}/{repo}/pulls/comments/{comment_id}",
            {},
            { renamed: ["pulls", "updateReviewComment"] },
        ],
        updateReview: [
            "PUT /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}",
        ],
        updateReviewComment: [
            "PATCH /repos/{owner}/{repo}/pulls/comments/{comment_id}",
        ],
    },
    rateLimit: { get: ["GET /rate_limit"] },
    reactions: {
        createForCommitComment: [
            "POST /repos/{owner}/{repo}/comments/{comment_id}/reactions",
            { mediaType: { previews: ["squirrel-girl"] } },
        ],
        createForIssue: [
            "POST /repos/{owner}/{repo}/issues/{issue_number}/reactions",
            { mediaType: { previews: ["squirrel-girl"] } },
        ],
        createForIssueComment: [
            "POST /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions",
            { mediaType: { previews: ["squirrel-girl"] } },
        ],
        createForPullRequestReviewComment: [
            "POST /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions",
            { mediaType: { previews: ["squirrel-girl"] } },
        ],
        createForTeamDiscussionCommentInOrg: [
            "POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions",
            { mediaType: { previews: ["squirrel-girl"] } },
        ],
        createForTeamDiscussionInOrg: [
            "POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions",
            { mediaType: { previews: ["squirrel-girl"] } },
        ],
        delete: [
            "DELETE /reactions/{reaction_id}",
            { mediaType: { previews: ["squirrel-girl"] } },
            { renamed: ["reactions", "deleteLegacy"] },
        ],
        deleteForCommitComment: [
            "DELETE /repos/{owner}/{repo}/comments/{comment_id}/reactions/{reaction_id}",
            { mediaType: { previews: ["squirrel-girl"] } },
        ],
        deleteForIssue: [
            "DELETE /repos/{owner}/{repo}/issues/{issue_number}/reactions/{reaction_id}",
            { mediaType: { previews: ["squirrel-girl"] } },
        ],
        deleteForIssueComment: [
            "DELETE /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions/{reaction_id}",
            { mediaType: { previews: ["squirrel-girl"] } },
        ],
        deleteForPullRequestComment: [
            "DELETE /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions/{reaction_id}",
            { mediaType: { previews: ["squirrel-girl"] } },
        ],
        deleteForTeamDiscussion: [
            "DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions/{reaction_id}",
            { mediaType: { previews: ["squirrel-girl"] } },
        ],
        deleteForTeamDiscussionComment: [
            "DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions/{reaction_id}",
            { mediaType: { previews: ["squirrel-girl"] } },
        ],
        deleteLegacy: [
            "DELETE /reactions/{reaction_id}",
            { mediaType: { previews: ["squirrel-girl"] } },
            {
                deprecated: "octokit.reactions.deleteLegacy() is deprecated, see https://developer.github.com/v3/reactions/#delete-a-reaction-legacy",
            },
        ],
        listForCommitComment: [
            "GET /repos/{owner}/{repo}/comments/{comment_id}/reactions",
            { mediaType: { previews: ["squirrel-girl"] } },
        ],
        listForIssue: [
            "GET /repos/{owner}/{repo}/issues/{issue_number}/reactions",
            { mediaType: { previews: ["squirrel-girl"] } },
        ],
        listForIssueComment: [
            "GET /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions",
            { mediaType: { previews: ["squirrel-girl"] } },
        ],
        listForPullRequestReviewComment: [
            "GET /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions",
            { mediaType: { previews: ["squirrel-girl"] } },
        ],
        listForTeamDiscussionCommentInOrg: [
            "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions",
            { mediaType: { previews: ["squirrel-girl"] } },
        ],
        listForTeamDiscussionInOrg: [
            "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions",
            { mediaType: { previews: ["squirrel-girl"] } },
        ],
    },
    repos: {
        acceptInvitation: ["PATCH /user/repository_invitations/{invitation_id}"],
        addAppAccessRestrictions: [
            "POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps",
            {},
            { mapToData: "apps" },
        ],
        addCollaborator: ["PUT /repos/{owner}/{repo}/collaborators/{username}"],
        addDeployKey: [
            "POST /repos/{owner}/{repo}/keys",
            {},
            { renamed: ["repos", "createDeployKey"] },
        ],
        addProtectedBranchAdminEnforcement: [
            "POST /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins",
            {},
            { renamed: ["repos", "setAdminBranchProtection"] },
        ],
        addProtectedBranchAppRestrictions: [
            "POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps",
            {},
            { mapToData: "apps", renamed: ["repos", "addAppAccessRestrictions"] },
        ],
        addProtectedBranchRequiredSignatures: [
            "POST /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures",
            { mediaType: { previews: ["zzzax"] } },
            { renamed: ["repos", "createCommitSignatureProtection"] },
        ],
        addProtectedBranchRequiredStatusChecksContexts: [
            "POST /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts",
            {},
            { mapToData: "contexts", renamed: ["repos", "addStatusCheckContexts"] },
        ],
        addProtectedBranchTeamRestrictions: [
            "POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams",
            {},
            { mapToData: "teams", renamed: ["repos", "addTeamAccessRestrictions"] },
        ],
        addProtectedBranchUserRestrictions: [
            "POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users",
            {},
            { mapToData: "users", renamed: ["repos", "addUserAccessRestrictions"] },
        ],
        addStatusCheckContexts: [
            "POST /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts",
            {},
            { mapToData: "contexts" },
        ],
        addTeamAccessRestrictions: [
            "POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams",
            {},
            { mapToData: "teams" },
        ],
        addUserAccessRestrictions: [
            "POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users",
            {},
            { mapToData: "users" },
        ],
        checkCollaborator: ["GET /repos/{owner}/{repo}/collaborators/{username}"],
        checkVulnerabilityAlerts: [
            "GET /repos/{owner}/{repo}/vulnerability-alerts",
            { mediaType: { previews: ["dorian"] } },
        ],
        compareCommits: ["GET /repos/{owner}/{repo}/compare/{base}...{head}"],
        createCommitComment: [
            "POST /repos/{owner}/{repo}/commits/{commit_sha}/comments",
        ],
        createCommitSignatureProtection: [
            "POST /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures",
            { mediaType: { previews: ["zzzax"] } },
        ],
        createCommitStatus: ["POST /repos/{owner}/{repo}/statuses/{sha}"],
        createDeployKey: ["POST /repos/{owner}/{repo}/keys"],
        createDeployment: ["POST /repos/{owner}/{repo}/deployments"],
        createDeploymentStatus: [
            "POST /repos/{owner}/{repo}/deployments/{deployment_id}/statuses",
        ],
        createDispatchEvent: ["POST /repos/{owner}/{repo}/dispatches"],
        createForAuthenticatedUser: ["POST /user/repos"],
        createFork: ["POST /repos/{owner}/{repo}/forks"],
        createHook: [
            "POST /repos/{owner}/{repo}/hooks",
            {},
            { renamed: ["repos", "createWebhook"] },
        ],
        createInOrg: ["POST /orgs/{org}/repos"],
        createOrUpdateFile: [
            "PUT /repos/{owner}/{repo}/contents/{path}",
            {},
            { renamed: ["repos", "createOrUpdateFileContents"] },
        ],
        createOrUpdateFileContents: ["PUT /repos/{owner}/{repo}/contents/{path}"],
        createPagesSite: [
            "POST /repos/{owner}/{repo}/pages",
            { mediaType: { previews: ["switcheroo"] } },
        ],
        createRelease: ["POST /repos/{owner}/{repo}/releases"],
        createStatus: [
            "POST /repos/{owner}/{repo}/statuses/{sha}",
            {},
            { renamed: ["repos", "createCommitStatus"] },
        ],
        createUsingTemplate: [
            "POST /repos/{template_owner}/{template_repo}/generate",
            { mediaType: { previews: ["baptiste"] } },
        ],
        createWebhook: ["POST /repos/{owner}/{repo}/hooks"],
        declineInvitation: ["DELETE /user/repository_invitations/{invitation_id}"],
        delete: ["DELETE /repos/{owner}/{repo}"],
        deleteAccessRestrictions: [
            "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions",
        ],
        deleteAdminBranchProtection: [
            "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins",
        ],
        deleteBranchProtection: [
            "DELETE /repos/{owner}/{repo}/branches/{branch}/protection",
        ],
        deleteCommitComment: ["DELETE /repos/{owner}/{repo}/comments/{comment_id}"],
        deleteCommitSignatureProtection: [
            "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures",
            { mediaType: { previews: ["zzzax"] } },
        ],
        deleteDeployKey: ["DELETE /repos/{owner}/{repo}/keys/{key_id}"],
        deleteDeployment: [
            "DELETE /repos/{owner}/{repo}/deployments/{deployment_id}",
        ],
        deleteDownload: ["DELETE /repos/{owner}/{repo}/downloads/{download_id}"],
        deleteFile: ["DELETE /repos/{owner}/{repo}/contents/{path}"],
        deleteHook: [
            "DELETE /repos/{owner}/{repo}/hooks/{hook_id}",
            {},
            { renamed: ["repos", "deleteWebhook"] },
        ],
        deleteInvitation: [
            "DELETE /repos/{owner}/{repo}/invitations/{invitation_id}",
        ],
        deletePagesSite: [
            "DELETE /repos/{owner}/{repo}/pages",
            { mediaType: { previews: ["switcheroo"] } },
        ],
        deletePullRequestReviewProtection: [
            "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews",
        ],
        deleteRelease: ["DELETE /repos/{owner}/{repo}/releases/{release_id}"],
        deleteReleaseAsset: [
            "DELETE /repos/{owner}/{repo}/releases/assets/{asset_id}",
        ],
        deleteWebhook: ["DELETE /repos/{owner}/{repo}/hooks/{hook_id}"],
        disableAutomatedSecurityFixes: [
            "DELETE /repos/{owner}/{repo}/automated-security-fixes",
            { mediaType: { previews: ["london"] } },
        ],
        disablePagesSite: [
            "DELETE /repos/{owner}/{repo}/pages",
            { mediaType: { previews: ["switcheroo"] } },
            { renamed: ["repos", "deletePagesSite"] },
        ],
        disableVulnerabilityAlerts: [
            "DELETE /repos/{owner}/{repo}/vulnerability-alerts",
            { mediaType: { previews: ["dorian"] } },
        ],
        downloadArchive: ["GET /repos/{owner}/{repo}/{archive_format}/{ref}"],
        enableAutomatedSecurityFixes: [
            "PUT /repos/{owner}/{repo}/automated-security-fixes",
            { mediaType: { previews: ["london"] } },
        ],
        enablePagesSite: [
            "POST /repos/{owner}/{repo}/pages",
            { mediaType: { previews: ["switcheroo"] } },
            { renamed: ["repos", "createPagesSite"] },
        ],
        enableVulnerabilityAlerts: [
            "PUT /repos/{owner}/{repo}/vulnerability-alerts",
            { mediaType: { previews: ["dorian"] } },
        ],
        get: ["GET /repos/{owner}/{repo}"],
        getAccessRestrictions: [
            "GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions",
        ],
        getAdminBranchProtection: [
            "GET /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins",
        ],
        getAllStatusCheckContexts: [
            "GET /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts",
        ],
        getAllTopics: [
            "GET /repos/{owner}/{repo}/topics",
            { mediaType: { previews: ["mercy"] } },
        ],
        getAppsWithAccessToProtectedBranch: [
            "GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps",
        ],
        getArchiveLink: [
            "GET /repos/{owner}/{repo}/{archive_format}/{ref}",
            {},
            { renamed: ["repos", "downloadArchive"] },
        ],
        getBranch: ["GET /repos/{owner}/{repo}/branches/{branch}"],
        getBranchProtection: [
            "GET /repos/{owner}/{repo}/branches/{branch}/protection",
        ],
        getClones: ["GET /repos/{owner}/{repo}/traffic/clones"],
        getCodeFrequencyStats: ["GET /repos/{owner}/{repo}/stats/code_frequency"],
        getCollaboratorPermissionLevel: [
            "GET /repos/{owner}/{repo}/collaborators/{username}/permission",
        ],
        getCombinedStatusForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/status"],
        getCommit: ["GET /repos/{owner}/{repo}/commits/{ref}"],
        getCommitActivityStats: ["GET /repos/{owner}/{repo}/stats/commit_activity"],
        getCommitComment: ["GET /repos/{owner}/{repo}/comments/{comment_id}"],
        getCommitSignatureProtection: [
            "GET /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures",
            { mediaType: { previews: ["zzzax"] } },
        ],
        getCommunityProfileMetrics: ["GET /repos/{owner}/{repo}/community/profile"],
        getContent: ["GET /repos/{owner}/{repo}/contents/{path}"],
        getContents: [
            "GET /repos/{owner}/{repo}/contents/{path}",
            {},
            { renamed: ["repos", "getContent"] },
        ],
        getContributorsStats: ["GET /repos/{owner}/{repo}/stats/contributors"],
        getDeployKey: ["GET /repos/{owner}/{repo}/keys/{key_id}"],
        getDeployment: ["GET /repos/{owner}/{repo}/deployments/{deployment_id}"],
        getDeploymentStatus: [
            "GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses/{status_id}",
        ],
        getDownload: ["GET /repos/{owner}/{repo}/downloads/{download_id}"],
        getHook: [
            "GET /repos/{owner}/{repo}/hooks/{hook_id}",
            {},
            { renamed: ["repos", "getWebhook"] },
        ],
        getLatestPagesBuild: ["GET /repos/{owner}/{repo}/pages/builds/latest"],
        getLatestRelease: ["GET /repos/{owner}/{repo}/releases/latest"],
        getPages: ["GET /repos/{owner}/{repo}/pages"],
        getPagesBuild: ["GET /repos/{owner}/{repo}/pages/builds/{build_id}"],
        getParticipationStats: ["GET /repos/{owner}/{repo}/stats/participation"],
        getProtectedBranchAdminEnforcement: [
            "GET /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins",
            {},
            { renamed: ["repos", "getAdminBranchProtection"] },
        ],
        getProtectedBranchPullRequestReviewEnforcement: [
            "GET /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews",
            {},
            { renamed: ["repos", "getPullRequestReviewProtection"] },
        ],
        getProtectedBranchRequiredSignatures: [
            "GET /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures",
            { mediaType: { previews: ["zzzax"] } },
            { renamed: ["repos", "getCommitSignatureProtection"] },
        ],
        getProtectedBranchRequiredStatusChecks: [
            "GET /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks",
            {},
            { renamed: ["repos", "getStatusChecksProtection"] },
        ],
        getProtectedBranchRestrictions: [
            "GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions",
            {},
            { renamed: ["repos", "getAccessRestrictions"] },
        ],
        getPullRequestReviewProtection: [
            "GET /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews",
        ],
        getPunchCardStats: ["GET /repos/{owner}/{repo}/stats/punch_card"],
        getReadme: ["GET /repos/{owner}/{repo}/readme"],
        getRelease: ["GET /repos/{owner}/{repo}/releases/{release_id}"],
        getReleaseAsset: ["GET /repos/{owner}/{repo}/releases/assets/{asset_id}"],
        getReleaseByTag: ["GET /repos/{owner}/{repo}/releases/tags/{tag}"],
        getStatusChecksProtection: [
            "GET /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks",
        ],
        getTeamsWithAccessToProtectedBranch: [
            "GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams",
        ],
        getTopPaths: ["GET /repos/{owner}/{repo}/traffic/popular/paths"],
        getTopReferrers: ["GET /repos/{owner}/{repo}/traffic/popular/referrers"],
        getUsersWithAccessToProtectedBranch: [
            "GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users",
        ],
        getViews: ["GET /repos/{owner}/{repo}/traffic/views"],
        getWebhook: ["GET /repos/{owner}/{repo}/hooks/{hook_id}"],
        list: [
            "GET /user/repos",
            {},
            { renamed: ["repos", "listForAuthenticatedUser"] },
        ],
        listAssetsForRelease: [
            "GET /repos/{owner}/{repo}/releases/{release_id}/assets",
            {},
            { renamed: ["repos", "listReleaseAssets"] },
        ],
        listBranches: ["GET /repos/{owner}/{repo}/branches"],
        listBranchesForHeadCommit: [
            "GET /repos/{owner}/{repo}/commits/{commit_sha}/branches-where-head",
            { mediaType: { previews: ["groot"] } },
        ],
        listCollaborators: ["GET /repos/{owner}/{repo}/collaborators"],
        listCommentsForCommit: [
            "GET /repos/{owner}/{repo}/commits/{commit_sha}/comments",
        ],
        listCommitComments: [
            "GET /repos/{owner}/{repo}/comments",
            {},
            { renamed: ["repos", "listCommitCommentsForRepo"] },
        ],
        listCommitCommentsForRepo: ["GET /repos/{owner}/{repo}/comments"],
        listCommitStatusesForRef: [
            "GET /repos/{owner}/{repo}/commits/{ref}/statuses",
        ],
        listCommits: ["GET /repos/{owner}/{repo}/commits"],
        listContributors: ["GET /repos/{owner}/{repo}/contributors"],
        listDeployKeys: ["GET /repos/{owner}/{repo}/keys"],
        listDeploymentStatuses: [
            "GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses",
        ],
        listDeployments: ["GET /repos/{owner}/{repo}/deployments"],
        listDownloads: ["GET /repos/{owner}/{repo}/downloads"],
        listForAuthenticatedUser: ["GET /user/repos"],
        listForOrg: ["GET /orgs/{org}/repos"],
        listForUser: ["GET /users/{username}/repos"],
        listForks: ["GET /repos/{owner}/{repo}/forks"],
        listHooks: [
            "GET /repos/{owner}/{repo}/hooks",
            {},
            { renamed: ["repos", "listWebhooks"] },
        ],
        listInvitations: ["GET /repos/{owner}/{repo}/invitations"],
        listInvitationsForAuthenticatedUser: ["GET /user/repository_invitations"],
        listLanguages: ["GET /repos/{owner}/{repo}/languages"],
        listPagesBuilds: ["GET /repos/{owner}/{repo}/pages/builds"],
        listProtectedBranchRequiredStatusChecksContexts: [
            "GET /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts",
            {},
            { renamed: ["repos", "getAllStatusCheckContexts"] },
        ],
        listPublic: ["GET /repositories"],
        listPullRequestsAssociatedWithCommit: [
            "GET /repos/{owner}/{repo}/commits/{commit_sha}/pulls",
            { mediaType: { previews: ["groot"] } },
        ],
        listReleaseAssets: [
            "GET /repos/{owner}/{repo}/releases/{release_id}/assets",
        ],
        listReleases: ["GET /repos/{owner}/{repo}/releases"],
        listStatusesForRef: [
            "GET /repos/{owner}/{repo}/commits/{ref}/statuses",
            {},
            { renamed: ["repos", "listCommitStatusesForRef"] },
        ],
        listTags: ["GET /repos/{owner}/{repo}/tags"],
        listTeams: ["GET /repos/{owner}/{repo}/teams"],
        listTopics: [
            "GET /repos/{owner}/{repo}/topics",
            { mediaType: { previews: ["mercy"] } },
            { renamed: ["repos", "getAllTopics"] },
        ],
        listWebhooks: ["GET /repos/{owner}/{repo}/hooks"],
        merge: ["POST /repos/{owner}/{repo}/merges"],
        pingHook: [
            "POST /repos/{owner}/{repo}/hooks/{hook_id}/pings",
            {},
            { renamed: ["repos", "pingWebhook"] },
        ],
        pingWebhook: ["POST /repos/{owner}/{repo}/hooks/{hook_id}/pings"],
        removeAppAccessRestrictions: [
            "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps",
            {},
            { mapToData: "apps" },
        ],
        removeBranchProtection: [
            "DELETE /repos/{owner}/{repo}/branches/{branch}/protection",
            {},
            { renamed: ["repos", "deleteBranchProtection"] },
        ],
        removeCollaborator: [
            "DELETE /repos/{owner}/{repo}/collaborators/{username}",
        ],
        removeDeployKey: [
            "DELETE /repos/{owner}/{repo}/keys/{key_id}",
            {},
            { renamed: ["repos", "deleteDeployKey"] },
        ],
        removeProtectedBranchAdminEnforcement: [
            "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins",
            {},
            { renamed: ["repos", "deleteAdminBranchProtection"] },
        ],
        removeProtectedBranchAppRestrictions: [
            "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps",
            {},
            { mapToData: "apps", renamed: ["repos", "removeAppAccessRestrictions"] },
        ],
        removeProtectedBranchPullRequestReviewEnforcement: [
            "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews",
            {},
            { renamed: ["repos", "deletePullRequestReviewProtection"] },
        ],
        removeProtectedBranchRequiredSignatures: [
            "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures",
            { mediaType: { previews: ["zzzax"] } },
            { renamed: ["repos", "deleteCommitSignatureProtection"] },
        ],
        removeProtectedBranchRequiredStatusChecks: [
            "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks",
            {},
            { renamed: ["repos", "removeStatusChecksProtection"] },
        ],
        removeProtectedBranchRequiredStatusChecksContexts: [
            "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts",
            {},
            {
                mapToData: "contexts",
                renamed: ["repos", "removeStatusCheckContexts"],
            },
        ],
        removeProtectedBranchRestrictions: [
            "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions",
            {},
            { renamed: ["repos", "deleteAccessRestrictions"] },
        ],
        removeProtectedBranchTeamRestrictions: [
            "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams",
            {},
            {
                mapToData: "teams",
                renamed: ["repos", "removeTeamAccessRestrictions"],
            },
        ],
        removeProtectedBranchUserRestrictions: [
            "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users",
            {},
            {
                mapToData: "users",
                renamed: ["repos", "removeUserAccessRestrictions"],
            },
        ],
        removeStatusCheckContexts: [
            "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts",
            {},
            { mapToData: "contexts" },
        ],
        removeStatusCheckProtection: [
            "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks",
        ],
        removeTeamAccessRestrictions: [
            "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams",
            {},
            { mapToData: "teams" },
        ],
        removeUserAccessRestrictions: [
            "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users",
            {},
            { mapToData: "users" },
        ],
        replaceAllTopics: [
            "PUT /repos/{owner}/{repo}/topics",
            { mediaType: { previews: ["mercy"] } },
        ],
        replaceProtectedBranchAppRestrictions: [
            "PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps",
            {},
            { mapToData: "apps", renamed: ["repos", "setAppAccessRestrictions"] },
        ],
        replaceProtectedBranchRequiredStatusChecksContexts: [
            "PUT /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts",
            {},
            { mapToData: "contexts", renamed: ["repos", "setStatusCheckContexts"] },
        ],
        replaceProtectedBranchTeamRestrictions: [
            "PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams",
            {},
            { mapToData: "teams", renamed: ["repos", "setTeamAccessRestrictions"] },
        ],
        replaceProtectedBranchUserRestrictions: [
            "PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users",
            {},
            { mapToData: "users", renamed: ["repos", "setUserAccessRestrictions"] },
        ],
        replaceTopics: [
            "PUT /repos/{owner}/{repo}/topics",
            { mediaType: { previews: ["mercy"] } },
            { renamed: ["repos", "replaceAllTopics"] },
        ],
        requestPageBuild: [
            "POST /repos/{owner}/{repo}/pages/builds",
            {},
            { renamed: ["repos", "requestPagesBuild"] },
        ],
        requestPagesBuild: ["POST /repos/{owner}/{repo}/pages/builds"],
        retrieveCommunityProfileMetrics: [
            "GET /repos/{owner}/{repo}/community/profile",
            {},
            { renamed: ["repos", "getCommunityProfileMetrics"] },
        ],
        setAdminBranchProtection: [
            "POST /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins",
        ],
        setAppAccessRestrictions: [
            "PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps",
            {},
            { mapToData: "apps" },
        ],
        setStatusCheckContexts: [
            "PUT /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts",
            {},
            { mapToData: "contexts" },
        ],
        setTeamAccessRestrictions: [
            "PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams",
            {},
            { mapToData: "teams" },
        ],
        setUserAccessRestrictions: [
            "PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users",
            {},
            { mapToData: "users" },
        ],
        testPushHook: [
            "POST /repos/{owner}/{repo}/hooks/{hook_id}/tests",
            {},
            { renamed: ["repos", "testPushWebhook"] },
        ],
        testPushWebhook: ["POST /repos/{owner}/{repo}/hooks/{hook_id}/tests"],
        transfer: ["POST /repos/{owner}/{repo}/transfer"],
        update: ["PATCH /repos/{owner}/{repo}"],
        updateBranchProtection: [
            "PUT /repos/{owner}/{repo}/branches/{branch}/protection",
        ],
        updateCommitComment: ["PATCH /repos/{owner}/{repo}/comments/{comment_id}"],
        updateHook: [
            "PATCH /repos/{owner}/{repo}/hooks/{hook_id}",
            {},
            { renamed: ["repos", "updateWebhook"] },
        ],
        updateInformationAboutPagesSite: ["PUT /repos/{owner}/{repo}/pages"],
        updateInvitation: [
            "PATCH /repos/{owner}/{repo}/invitations/{invitation_id}",
        ],
        updateProtectedBranchPullRequestReviewEnforcement: [
            "PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews",
            {},
            { renamed: ["repos", "updatePullRequestReviewProtection"] },
        ],
        updateProtectedBranchRequiredStatusChecks: [
            "PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks",
            {},
            { renamed: ["repos", "updateStatusChecksProtection"] },
        ],
        updatePullRequestReviewProtection: [
            "PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews",
        ],
        updateRelease: ["PATCH /repos/{owner}/{repo}/releases/{release_id}"],
        updateReleaseAsset: [
            "PATCH /repos/{owner}/{repo}/releases/assets/{asset_id}",
        ],
        updateStatusCheckPotection: [
            "PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks",
        ],
        updateWebhook: ["PATCH /repos/{owner}/{repo}/hooks/{hook_id}"],
        uploadReleaseAsset: [
            "POST /repos/{owner}/{repo}/releases/{release_id}/assets{?name,label}",
            { baseUrl: "https://uploads.github.com" },
        ],
    },
    search: {
        code: ["GET /search/code"],
        commits: ["GET /search/commits", { mediaType: { previews: ["cloak"] } }],
        issuesAndPullRequests: ["GET /search/issues"],
        labels: ["GET /search/labels"],
        repos: ["GET /search/repositories"],
        topics: ["GET /search/topics"],
        users: ["GET /search/users"],
    },
    teams: {
        addOrUpdateMembershipForUserInOrg: [
            "PUT /orgs/{org}/teams/{team_slug}/memberships/{username}",
        ],
        addOrUpdateMembershipInOrg: [
            "PUT /orgs/{org}/teams/{team_slug}/memberships/{username}",
            {},
            { renamed: ["teams", "addOrUpdateMembershipForUserInOrg"] },
        ],
        addOrUpdateProjectInOrg: [
            "PUT /orgs/{org}/teams/{team_slug}/projects/{project_id}",
            { mediaType: { previews: ["inertia"] } },
            { renamed: ["teams", "addOrUpdateProjectPermissionsInOrg"] },
        ],
        addOrUpdateProjectPermissionsInOrg: [
            "PUT /orgs/{org}/teams/{team_slug}/projects/{project_id}",
            { mediaType: { previews: ["inertia"] } },
        ],
        addOrUpdateRepoInOrg: [
            "PUT /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}",
            {},
            { renamed: ["teams", "addOrUpdateRepoPermissionsInOrg"] },
        ],
        addOrUpdateRepoPermissionsInOrg: [
            "PUT /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}",
        ],
        checkManagesRepoInOrg: [
            "GET /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}",
            {},
            { renamed: ["teams", "checkPermissionsForRepoInOrg"] },
        ],
        checkPermissionsForProjectInOrg: [
            "GET /orgs/{org}/teams/{team_slug}/projects/{project_id}",
            { mediaType: { previews: ["inertia"] } },
        ],
        checkPermissionsForRepoInOrg: [
            "GET /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}",
        ],
        create: ["POST /orgs/{org}/teams"],
        createDiscussionCommentInOrg: [
            "POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments",
        ],
        createDiscussionInOrg: ["POST /orgs/{org}/teams/{team_slug}/discussions"],
        deleteDiscussionCommentInOrg: [
            "DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}",
        ],
        deleteDiscussionInOrg: [
            "DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}",
        ],
        deleteInOrg: ["DELETE /orgs/{org}/teams/{team_slug}"],
        getByName: ["GET /orgs/{org}/teams/{team_slug}"],
        getDiscussionCommentInOrg: [
            "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}",
        ],
        getDiscussionInOrg: [
            "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}",
        ],
        getMembershipForUserInOrg: [
            "GET /orgs/{org}/teams/{team_slug}/memberships/{username}",
        ],
        getMembershipInOrg: [
            "GET /orgs/{org}/teams/{team_slug}/memberships/{username}",
            {},
            { renamed: ["teams", "getMembershipForUserInOrg"] },
        ],
        list: ["GET /orgs/{org}/teams"],
        listChildInOrg: ["GET /orgs/{org}/teams/{team_slug}/teams"],
        listDiscussionCommentsInOrg: [
            "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments",
        ],
        listDiscussionsInOrg: ["GET /orgs/{org}/teams/{team_slug}/discussions"],
        listForAuthenticatedUser: ["GET /user/teams"],
        listMembersInOrg: ["GET /orgs/{org}/teams/{team_slug}/members"],
        listPendingInvitationsInOrg: [
            "GET /orgs/{org}/teams/{team_slug}/invitations",
        ],
        listProjectsInOrg: [
            "GET /orgs/{org}/teams/{team_slug}/projects",
            { mediaType: { previews: ["inertia"] } },
        ],
        listReposInOrg: ["GET /orgs/{org}/teams/{team_slug}/repos"],
        removeMembershipForUserInOrg: [
            "DELETE /orgs/{org}/teams/{team_slug}/memberships/{username}",
        ],
        removeMembershipInOrg: [
            "DELETE /orgs/{org}/teams/{team_slug}/memberships/{username}",
            {},
            { renamed: ["teams", "removeMembershipForUserInOrg"] },
        ],
        removeProjectInOrg: [
            "DELETE /orgs/{org}/teams/{team_slug}/projects/{project_id}",
        ],
        removeRepoInOrg: [
            "DELETE /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}",
        ],
        reviewProjectInOrg: [
            "GET /orgs/{org}/teams/{team_slug}/projects/{project_id}",
            { mediaType: { previews: ["inertia"] } },
            { renamed: ["teams", "checkPermissionsForProjectInOrg"] },
        ],
        updateDiscussionCommentInOrg: [
            "PATCH /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}",
        ],
        updateDiscussionInOrg: [
            "PATCH /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}",
        ],
        updateInOrg: ["PATCH /orgs/{org}/teams/{team_slug}"],
    },
    users: {
        addEmailForAuthenticated: ["POST /user/emails"],
        addEmails: [
            "POST /user/emails",
            {},
            { renamed: ["users", "addEmailsForAuthenticated"] },
        ],
        block: ["PUT /user/blocks/{username}"],
        checkBlocked: ["GET /user/blocks/{username}"],
        checkFollowing: [
            "GET /user/following/{username}",
            {},
            { renamed: ["users", "checkPersonIsFollowedByAuthenticated"] },
        ],
        checkFollowingForUser: ["GET /users/{username}/following/{target_user}"],
        checkPersonIsFollowedByAuthenticated: ["GET /user/following/{username}"],
        createGpgKey: [
            "POST /user/gpg_keys",
            {},
            { renamed: ["users", "createGpgKeyForAuthenticated"] },
        ],
        createGpgKeyForAuthenticated: ["POST /user/gpg_keys"],
        createPublicKey: [
            "POST /user/keys",
            {},
            { renamed: ["users", "createPublicSshKeyForAuthenticated"] },
        ],
        createPublicSshKeyForAuthenticated: ["POST /user/keys"],
        deleteEmailForAuthenticated: ["DELETE /user/emails"],
        deleteEmails: [
            "DELETE /user/emails",
            {},
            { renamed: ["users", "deleteEmailsForAuthenticated"] },
        ],
        deleteGpgKey: [
            "DELETE /user/gpg_keys/{gpg_key_id}",
            {},
            { renamed: ["users", "deleteGpgKeyForAuthenticated"] },
        ],
        deleteGpgKeyForAuthenticated: ["DELETE /user/gpg_keys/{gpg_key_id}"],
        deletePublicKey: [
            "DELETE /user/keys/{key_id}",
            {},
            { renamed: ["users", "deletePublicSshKeyForAuthenticated"] },
        ],
        deletePublicSshKeyForAuthenticated: ["DELETE /user/keys/{key_id}"],
        follow: ["PUT /user/following/{username}"],
        getAuthenticated: ["GET /user"],
        getByUsername: ["GET /users/{username}"],
        getContextForUser: ["GET /users/{username}/hovercard"],
        getGpgKey: [
            "GET /user/gpg_keys/{gpg_key_id}",
            {},
            { renamed: ["users", "getGpgKeyForAuthenticated"] },
        ],
        getGpgKeyForAuthenticated: ["GET /user/gpg_keys/{gpg_key_id}"],
        getPublicKey: [
            "GET /user/keys/{key_id}",
            {},
            { renamed: ["users", "getPublicSshKeyForAuthenticated"] },
        ],
        getPublicSshKeyForAuthenticated: ["GET /user/keys/{key_id}"],
        list: ["GET /users"],
        listBlocked: [
            "GET /user/blocks",
            {},
            { renamed: ["users", "listBlockedByAuthenticated"] },
        ],
        listBlockedByAuthenticated: ["GET /user/blocks"],
        listEmails: [
            "GET /user/emails",
            {},
            { renamed: ["users", "listEmailsForAuthenticated"] },
        ],
        listEmailsForAuthenticated: ["GET /user/emails"],
        listFollowedByAuthenticated: ["GET /user/following"],
        listFollowersForAuthenticatedUser: ["GET /user/followers"],
        listFollowersForUser: ["GET /users/{username}/followers"],
        listFollowingForAuthenticatedUser: [
            "GET /user/following",
            {},
            { renamed: ["users", "listFollowedByAuthenticated"] },
        ],
        listFollowingForUser: ["GET /users/{username}/following"],
        listGpgKeys: [
            "GET /user/gpg_keys",
            {},
            { renamed: ["users", "listGpgKeysForAuthenticated"] },
        ],
        listGpgKeysForAuthenticated: ["GET /user/gpg_keys"],
        listGpgKeysForUser: ["GET /users/{username}/gpg_keys"],
        listPublicEmails: [
            "GET /user/public_emails",
            {},
            { renamed: ["users", "listPublicEmailsForAuthenticatedUser"] },
        ],
        listPublicEmailsForAuthenticated: ["GET /user/public_emails"],
        listPublicKeys: [
            "GET /user/keys",
            {},
            { renamed: ["users", "listPublicSshKeysForAuthenticated"] },
        ],
        listPublicKeysForUser: ["GET /users/{username}/keys"],
        listPublicSshKeysForAuthenticated: ["GET /user/keys"],
        setPrimaryEmailVisibilityForAuthenticated: ["PATCH /user/email/visibility"],
        togglePrimaryEmailVisibility: [
            "PATCH /user/email/visibility",
            {},
            { renamed: ["users", "setPrimaryEmailVisibilityForAuthenticated"] },
        ],
        unblock: ["DELETE /user/blocks/{username}"],
        unfollow: ["DELETE /user/following/{username}"],
        updateAuthenticated: ["PATCH /user"],
    },
};

const VERSION = "3.17.0";

function endpointsToMethods(octokit, endpointsMap) {
    const newMethods = {};
    for (const [scope, endpoints] of Object.entries(endpointsMap)) {
        for (const [methodName, endpoint] of Object.entries(endpoints)) {
            const [route, defaults, decorations] = endpoint;
            const [method, url] = route.split(/ /);
            const endpointDefaults = Object.assign({ method, url }, defaults);
            if (!newMethods[scope]) {
                newMethods[scope] = {};
            }
            const scopeMethods = newMethods[scope];
            if (decorations) {
                scopeMethods[methodName] = decorate(octokit, scope, methodName, endpointDefaults, decorations);
                continue;
            }
            scopeMethods[methodName] = octokit.request.defaults(endpointDefaults);
        }
    }
    return newMethods;
}
function decorate(octokit, scope, methodName, defaults, decorations) {
    const requestWithDefaults = octokit.request.defaults(defaults);
    function withDecorations(...args) {
        // @ts-ignore https://github.com/microsoft/TypeScript/issues/25488
        let options = requestWithDefaults.endpoint.merge(...args);
        // There are currently no other decorations than `.mapToData`
        if (decorations.mapToData) {
            options = Object.assign({}, options, {
                data: options[decorations.mapToData],
                [decorations.mapToData]: undefined,
            });
            return requestWithDefaults(options);
        }
        // NOTE: there are currently no deprecations. But we keep the code
        //       below for future reference
        if (decorations.renamed) {
            const [newScope, newMethodName] = decorations.renamed;
            octokit.log.warn(`octokit.${scope}.${methodName}() has been renamed to octokit.${newScope}.${newMethodName}()`);
        }
        if (decorations.deprecated) {
            octokit.log.warn(decorations.deprecated);
        }
        if (decorations.renamedParameters) {
            // @ts-ignore https://github.com/microsoft/TypeScript/issues/25488
            const options = requestWithDefaults.endpoint.merge(...args);
            for (const [name, alias] of Object.entries(decorations.renamedParameters)) {
                // There is currently no deprecated parameter that is optional,
                // so we never hit the else branch below at this point.
                /* istanbul ignore else */
                if (name in options) {
                    octokit.log.warn(`"${name}" parameter is deprecated for "octokit.${scope}.${methodName}()". Use "${alias}" instead`);
                    if (!(alias in options)) {
                        options[alias] = options[name];
                    }
                    delete options[name];
                }
            }
            return requestWithDefaults(options);
        }
        // @ts-ignore https://github.com/microsoft/TypeScript/issues/25488
        return requestWithDefaults(...args);
    }
    return Object.assign(withDecorations, requestWithDefaults);
}

/**
 * This plugin is a 1:1 copy of internal @octokit/rest plugins. The primary
 * goal is to rebuild @octokit/rest on top of @octokit/core. Once that is
 * done, we will remove the registerEndpoints methods and return the methods
 * directly as with the other plugins. At that point we will also remove the
 * legacy workarounds and deprecations.
 *
 * See the plan at
 * https://github.com/octokit/plugin-rest-endpoint-methods.js/pull/1
 */
function restEndpointMethods(octokit) {
    return endpointsToMethods(octokit, Endpoints);
}
restEndpointMethods.VERSION = VERSION;

export { restEndpointMethods };
//# sourceMappingURL=index.js.map
