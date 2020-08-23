import { Endpoints } from "@octokit/types";
export interface PaginatingEndpoints {
    /**
     * @see https://developer.github.com/v3/apps/#list-installations-for-the-authenticated-app
     */
    "GET /app/installations": {
        parameters: Endpoints["GET /app/installations"]["parameters"];
        response: Endpoints["GET /app/installations"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/oauth_authorizations/#list-your-grants
     */
    "GET /applications/grants": {
        parameters: Endpoints["GET /applications/grants"]["parameters"];
        response: Endpoints["GET /applications/grants"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/oauth_authorizations/#list-your-authorizations
     */
    "GET /authorizations": {
        parameters: Endpoints["GET /authorizations"]["parameters"];
        response: Endpoints["GET /authorizations"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/gists/#list-gists-for-the-authenticated-user
     */
    "GET /gists": {
        parameters: Endpoints["GET /gists"]["parameters"];
        response: Endpoints["GET /gists"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/gists/comments/#list-gist-comments
     */
    "GET /gists/:gist_id/comments": {
        parameters: Endpoints["GET /gists/:gist_id/comments"]["parameters"];
        response: Endpoints["GET /gists/:gist_id/comments"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/gists/#list-gist-commits
     */
    "GET /gists/:gist_id/commits": {
        parameters: Endpoints["GET /gists/:gist_id/commits"]["parameters"];
        response: Endpoints["GET /gists/:gist_id/commits"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/gists/#list-gist-forks
     */
    "GET /gists/:gist_id/forks": {
        parameters: Endpoints["GET /gists/:gist_id/forks"]["parameters"];
        response: Endpoints["GET /gists/:gist_id/forks"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/gists/#list-public-gists
     */
    "GET /gists/public": {
        parameters: Endpoints["GET /gists/public"]["parameters"];
        response: Endpoints["GET /gists/public"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/gists/#list-starred-gists
     */
    "GET /gists/starred": {
        parameters: Endpoints["GET /gists/starred"]["parameters"];
        response: Endpoints["GET /gists/starred"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/apps/installations/#list-repositories-accessible-to-the-app-installation
     */
    "GET /installation/repositories": {
        parameters: Endpoints["GET /installation/repositories"]["parameters"];
        response: Endpoints["GET /installation/repositories"]["response"] & {
            data: Endpoints["GET /installation/repositories"]["response"]["data"]["repositories"];
        };
    };
    /**
     * @see https://developer.github.com/v3/issues/#list-issues-assigned-to-the-authenticated-user
     */
    "GET /issues": {
        parameters: Endpoints["GET /issues"]["parameters"];
        response: Endpoints["GET /issues"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/apps/marketplace/#list-plans
     */
    "GET /marketplace_listing/plans": {
        parameters: Endpoints["GET /marketplace_listing/plans"]["parameters"];
        response: Endpoints["GET /marketplace_listing/plans"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/apps/marketplace/#list-accounts-for-a-plan
     */
    "GET /marketplace_listing/plans/:plan_id/accounts": {
        parameters: Endpoints["GET /marketplace_listing/plans/:plan_id/accounts"]["parameters"];
        response: Endpoints["GET /marketplace_listing/plans/:plan_id/accounts"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/apps/marketplace/#list-plans-stubbed
     */
    "GET /marketplace_listing/stubbed/plans": {
        parameters: Endpoints["GET /marketplace_listing/stubbed/plans"]["parameters"];
        response: Endpoints["GET /marketplace_listing/stubbed/plans"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/apps/marketplace/#list-accounts-for-a-plan-stubbed
     */
    "GET /marketplace_listing/stubbed/plans/:plan_id/accounts": {
        parameters: Endpoints["GET /marketplace_listing/stubbed/plans/:plan_id/accounts"]["parameters"];
        response: Endpoints["GET /marketplace_listing/stubbed/plans/:plan_id/accounts"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/activity/notifications/#list-notifications-for-the-authenticated-user
     */
    "GET /notifications": {
        parameters: Endpoints["GET /notifications"]["parameters"];
        response: Endpoints["GET /notifications"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/orgs/#list-organizations
     */
    "GET /organizations": {
        parameters: Endpoints["GET /organizations"]["parameters"];
        response: Endpoints["GET /organizations"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/actions/self-hosted-runners/#list-self-hosted-runners-for-an-organization
     */
    "GET /orgs/:org/actions/runners": {
        parameters: Endpoints["GET /orgs/:org/actions/runners"]["parameters"];
        response: Endpoints["GET /orgs/:org/actions/runners"]["response"] & {
            data: Endpoints["GET /orgs/:org/actions/runners"]["response"]["data"]["runners"];
        };
    };
    /**
     * @see https://developer.github.com/v3/actions/self-hosted-runners/#list-runner-applications-for-an-organization
     */
    "GET /orgs/:org/actions/runners/downloads": {
        parameters: Endpoints["GET /orgs/:org/actions/runners/downloads"]["parameters"];
        response: Endpoints["GET /orgs/:org/actions/runners/downloads"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/actions/secrets/#list-organization-secrets
     */
    "GET /orgs/:org/actions/secrets": {
        parameters: Endpoints["GET /orgs/:org/actions/secrets"]["parameters"];
        response: Endpoints["GET /orgs/:org/actions/secrets"]["response"] & {
            data: Endpoints["GET /orgs/:org/actions/secrets"]["response"]["data"]["secrets"];
        };
    };
    /**
     * @see https://developer.github.com/v3/actions/secrets/#list-selected-repositories-for-an-organization-secret
     */
    "GET /orgs/:org/actions/secrets/:secret_name/repositories": {
        parameters: Endpoints["GET /orgs/:org/actions/secrets/:secret_name/repositories"]["parameters"];
        response: Endpoints["GET /orgs/:org/actions/secrets/:secret_name/repositories"]["response"] & {
            data: Endpoints["GET /orgs/:org/actions/secrets/:secret_name/repositories"]["response"]["data"]["repositories"];
        };
    };
    /**
     * @see https://developer.github.com/v3/orgs/blocking/#list-users-blocked-by-an-organization
     */
    "GET /orgs/:org/blocks": {
        parameters: Endpoints["GET /orgs/:org/blocks"]["parameters"];
        response: Endpoints["GET /orgs/:org/blocks"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/orgs/#list-saml-sso-authorizations-for-an-organization
     */
    "GET /orgs/:org/credential-authorizations": {
        parameters: Endpoints["GET /orgs/:org/credential-authorizations"]["parameters"];
        response: Endpoints["GET /orgs/:org/credential-authorizations"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/orgs/hooks/#list-organization-webhooks
     */
    "GET /orgs/:org/hooks": {
        parameters: Endpoints["GET /orgs/:org/hooks"]["parameters"];
        response: Endpoints["GET /orgs/:org/hooks"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/orgs/#list-app-installations-for-an-organization
     */
    "GET /orgs/:org/installations": {
        parameters: Endpoints["GET /orgs/:org/installations"]["parameters"];
        response: Endpoints["GET /orgs/:org/installations"]["response"] & {
            data: Endpoints["GET /orgs/:org/installations"]["response"]["data"]["installations"];
        };
    };
    /**
     * @see https://developer.github.com/v3/orgs/members/#list-pending-organization-invitations
     */
    "GET /orgs/:org/invitations": {
        parameters: Endpoints["GET /orgs/:org/invitations"]["parameters"];
        response: Endpoints["GET /orgs/:org/invitations"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/orgs/members/#list-organization-invitation-teams
     */
    "GET /orgs/:org/invitations/:invitation_id/teams": {
        parameters: Endpoints["GET /orgs/:org/invitations/:invitation_id/teams"]["parameters"];
        response: Endpoints["GET /orgs/:org/invitations/:invitation_id/teams"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/issues/#list-organization-issues-assigned-to-the-authenticated-user
     */
    "GET /orgs/:org/issues": {
        parameters: Endpoints["GET /orgs/:org/issues"]["parameters"];
        response: Endpoints["GET /orgs/:org/issues"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/orgs/members/#list-organization-members
     */
    "GET /orgs/:org/members": {
        parameters: Endpoints["GET /orgs/:org/members"]["parameters"];
        response: Endpoints["GET /orgs/:org/members"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/migrations/orgs/#list-organization-migrations
     */
    "GET /orgs/:org/migrations": {
        parameters: Endpoints["GET /orgs/:org/migrations"]["parameters"];
        response: Endpoints["GET /orgs/:org/migrations"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/migrations/orgs/#list-repositories-in-an-organization-migration
     */
    "GET /orgs/:org/migrations/:migration_id/repositories": {
        parameters: Endpoints["GET /orgs/:org/migrations/:migration_id/repositories"]["parameters"];
        response: Endpoints["GET /orgs/:org/migrations/:migration_id/repositories"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/orgs/outside_collaborators/#list-outside-collaborators-for-an-organization
     */
    "GET /orgs/:org/outside_collaborators": {
        parameters: Endpoints["GET /orgs/:org/outside_collaborators"]["parameters"];
        response: Endpoints["GET /orgs/:org/outside_collaborators"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/projects/#list-organization-projects
     */
    "GET /orgs/:org/projects": {
        parameters: Endpoints["GET /orgs/:org/projects"]["parameters"];
        response: Endpoints["GET /orgs/:org/projects"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/orgs/members/#list-public-organization-members
     */
    "GET /orgs/:org/public_members": {
        parameters: Endpoints["GET /orgs/:org/public_members"]["parameters"];
        response: Endpoints["GET /orgs/:org/public_members"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/repos/#list-organization-repositories
     */
    "GET /orgs/:org/repos": {
        parameters: Endpoints["GET /orgs/:org/repos"]["parameters"];
        response: Endpoints["GET /orgs/:org/repos"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/teams/team_sync/#list-idp-groups-for-an-organization
     */
    "GET /orgs/:org/team-sync/groups": {
        parameters: Endpoints["GET /orgs/:org/team-sync/groups"]["parameters"];
        response: Endpoints["GET /orgs/:org/team-sync/groups"]["response"] & {
            data: Endpoints["GET /orgs/:org/team-sync/groups"]["response"]["data"]["groups"];
        };
    };
    /**
     * @see https://developer.github.com/v3/teams/#list-teams
     */
    "GET /orgs/:org/teams": {
        parameters: Endpoints["GET /orgs/:org/teams"]["parameters"];
        response: Endpoints["GET /orgs/:org/teams"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/teams/discussions/#list-discussions
     */
    "GET /orgs/:org/teams/:team_slug/discussions": {
        parameters: Endpoints["GET /orgs/:org/teams/:team_slug/discussions"]["parameters"];
        response: Endpoints["GET /orgs/:org/teams/:team_slug/discussions"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/teams/discussion_comments/#list-discussion-comments
     */
    "GET /orgs/:org/teams/:team_slug/discussions/:discussion_number/comments": {
        parameters: Endpoints["GET /orgs/:org/teams/:team_slug/discussions/:discussion_number/comments"]["parameters"];
        response: Endpoints["GET /orgs/:org/teams/:team_slug/discussions/:discussion_number/comments"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/reactions/#list-reactions-for-a-team-discussion-comment
     */
    "GET /orgs/:org/teams/:team_slug/discussions/:discussion_number/comments/:comment_number/reactions": {
        parameters: Endpoints["GET /orgs/:org/teams/:team_slug/discussions/:discussion_number/comments/:comment_number/reactions"]["parameters"];
        response: Endpoints["GET /orgs/:org/teams/:team_slug/discussions/:discussion_number/comments/:comment_number/reactions"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/reactions/#list-reactions-for-a-team-discussion
     */
    "GET /orgs/:org/teams/:team_slug/discussions/:discussion_number/reactions": {
        parameters: Endpoints["GET /orgs/:org/teams/:team_slug/discussions/:discussion_number/reactions"]["parameters"];
        response: Endpoints["GET /orgs/:org/teams/:team_slug/discussions/:discussion_number/reactions"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/teams/members/#list-pending-team-invitations
     */
    "GET /orgs/:org/teams/:team_slug/invitations": {
        parameters: Endpoints["GET /orgs/:org/teams/:team_slug/invitations"]["parameters"];
        response: Endpoints["GET /orgs/:org/teams/:team_slug/invitations"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/teams/members/#list-team-members
     */
    "GET /orgs/:org/teams/:team_slug/members": {
        parameters: Endpoints["GET /orgs/:org/teams/:team_slug/members"]["parameters"];
        response: Endpoints["GET /orgs/:org/teams/:team_slug/members"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/teams/#list-team-projects
     */
    "GET /orgs/:org/teams/:team_slug/projects": {
        parameters: Endpoints["GET /orgs/:org/teams/:team_slug/projects"]["parameters"];
        response: Endpoints["GET /orgs/:org/teams/:team_slug/projects"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/teams/#list-team-repositories
     */
    "GET /orgs/:org/teams/:team_slug/repos": {
        parameters: Endpoints["GET /orgs/:org/teams/:team_slug/repos"]["parameters"];
        response: Endpoints["GET /orgs/:org/teams/:team_slug/repos"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/teams/team_sync/#list-idp-groups-for-a-team
     */
    "GET /orgs/:org/teams/:team_slug/team-sync/group-mappings": {
        parameters: Endpoints["GET /orgs/:org/teams/:team_slug/team-sync/group-mappings"]["parameters"];
        response: Endpoints["GET /orgs/:org/teams/:team_slug/team-sync/group-mappings"]["response"] & {
            data: Endpoints["GET /orgs/:org/teams/:team_slug/team-sync/group-mappings"]["response"]["data"]["groups"];
        };
    };
    /**
     * @see https://developer.github.com/v3/teams/#list-child-teams
     */
    "GET /orgs/:org/teams/:team_slug/teams": {
        parameters: Endpoints["GET /orgs/:org/teams/:team_slug/teams"]["parameters"];
        response: Endpoints["GET /orgs/:org/teams/:team_slug/teams"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/projects/collaborators/#list-project-collaborators
     */
    "GET /projects/:project_id/collaborators": {
        parameters: Endpoints["GET /projects/:project_id/collaborators"]["parameters"];
        response: Endpoints["GET /projects/:project_id/collaborators"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/projects/columns/#list-project-columns
     */
    "GET /projects/:project_id/columns": {
        parameters: Endpoints["GET /projects/:project_id/columns"]["parameters"];
        response: Endpoints["GET /projects/:project_id/columns"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/projects/cards/#list-project-cards
     */
    "GET /projects/columns/:column_id/cards": {
        parameters: Endpoints["GET /projects/columns/:column_id/cards"]["parameters"];
        response: Endpoints["GET /projects/columns/:column_id/cards"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/actions/artifacts/#list-artifacts-for-a-repository
     */
    "GET /repos/:owner/:repo/actions/artifacts": {
        parameters: Endpoints["GET /repos/:owner/:repo/actions/artifacts"]["parameters"];
        response: Endpoints["GET /repos/:owner/:repo/actions/artifacts"]["response"] & {
            data: Endpoints["GET /repos/:owner/:repo/actions/artifacts"]["response"]["data"]["artifacts"];
        };
    };
    /**
     * @see https://developer.github.com/v3/actions/self-hosted-runners/#list-self-hosted-runners-for-a-repository
     */
    "GET /repos/:owner/:repo/actions/runners": {
        parameters: Endpoints["GET /repos/:owner/:repo/actions/runners"]["parameters"];
        response: Endpoints["GET /repos/:owner/:repo/actions/runners"]["response"] & {
            data: Endpoints["GET /repos/:owner/:repo/actions/runners"]["response"]["data"]["runners"];
        };
    };
    /**
     * @see https://developer.github.com/v3/actions/self-hosted-runners/#list-runner-applications-for-a-repository
     */
    "GET /repos/:owner/:repo/actions/runners/downloads": {
        parameters: Endpoints["GET /repos/:owner/:repo/actions/runners/downloads"]["parameters"];
        response: Endpoints["GET /repos/:owner/:repo/actions/runners/downloads"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/actions/workflow-runs/#list-workflow-runs-for-a-repository
     */
    "GET /repos/:owner/:repo/actions/runs": {
        parameters: Endpoints["GET /repos/:owner/:repo/actions/runs"]["parameters"];
        response: Endpoints["GET /repos/:owner/:repo/actions/runs"]["response"] & {
            data: Endpoints["GET /repos/:owner/:repo/actions/runs"]["response"]["data"]["workflow_runs"];
        };
    };
    /**
     * @see https://developer.github.com/v3/actions/artifacts/#list-workflow-run-artifacts
     */
    "GET /repos/:owner/:repo/actions/runs/:run_id/artifacts": {
        parameters: Endpoints["GET /repos/:owner/:repo/actions/runs/:run_id/artifacts"]["parameters"];
        response: Endpoints["GET /repos/:owner/:repo/actions/runs/:run_id/artifacts"]["response"] & {
            data: Endpoints["GET /repos/:owner/:repo/actions/runs/:run_id/artifacts"]["response"]["data"]["artifacts"];
        };
    };
    /**
     * @see https://developer.github.com/v3/actions/workflow-jobs/#list-jobs-for-a-workflow-run
     */
    "GET /repos/:owner/:repo/actions/runs/:run_id/jobs": {
        parameters: Endpoints["GET /repos/:owner/:repo/actions/runs/:run_id/jobs"]["parameters"];
        response: Endpoints["GET /repos/:owner/:repo/actions/runs/:run_id/jobs"]["response"] & {
            data: Endpoints["GET /repos/:owner/:repo/actions/runs/:run_id/jobs"]["response"]["data"]["jobs"];
        };
    };
    /**
     * @see https://developer.github.com/v3/actions/secrets/#list-repository-secrets
     */
    "GET /repos/:owner/:repo/actions/secrets": {
        parameters: Endpoints["GET /repos/:owner/:repo/actions/secrets"]["parameters"];
        response: Endpoints["GET /repos/:owner/:repo/actions/secrets"]["response"] & {
            data: Endpoints["GET /repos/:owner/:repo/actions/secrets"]["response"]["data"]["secrets"];
        };
    };
    /**
     * @see https://developer.github.com/v3/actions/workflows/#list-repository-workflows
     */
    "GET /repos/:owner/:repo/actions/workflows": {
        parameters: Endpoints["GET /repos/:owner/:repo/actions/workflows"]["parameters"];
        response: Endpoints["GET /repos/:owner/:repo/actions/workflows"]["response"] & {
            data: Endpoints["GET /repos/:owner/:repo/actions/workflows"]["response"]["data"]["workflows"];
        };
    };
    /**
     * @see https://developer.github.com/v3/actions/workflow-runs/#list-workflow-runs
     */
    "GET /repos/:owner/:repo/actions/workflows/:workflow_id/runs": {
        parameters: Endpoints["GET /repos/:owner/:repo/actions/workflows/:workflow_id/runs"]["parameters"];
        response: Endpoints["GET /repos/:owner/:repo/actions/workflows/:workflow_id/runs"]["response"] & {
            data: Endpoints["GET /repos/:owner/:repo/actions/workflows/:workflow_id/runs"]["response"]["data"]["workflow_runs"];
        };
    };
    /**
     * @see https://developer.github.com/v3/issues/assignees/#list-assignees
     */
    "GET /repos/:owner/:repo/assignees": {
        parameters: Endpoints["GET /repos/:owner/:repo/assignees"]["parameters"];
        response: Endpoints["GET /repos/:owner/:repo/assignees"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/repos/branches/#list-branches
     */
    "GET /repos/:owner/:repo/branches": {
        parameters: Endpoints["GET /repos/:owner/:repo/branches"]["parameters"];
        response: Endpoints["GET /repos/:owner/:repo/branches"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/checks/runs/#list-check-run-annotations
     */
    "GET /repos/:owner/:repo/check-runs/:check_run_id/annotations": {
        parameters: Endpoints["GET /repos/:owner/:repo/check-runs/:check_run_id/annotations"]["parameters"];
        response: Endpoints["GET /repos/:owner/:repo/check-runs/:check_run_id/annotations"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/checks/runs/#list-check-runs-in-a-check-suite
     */
    "GET /repos/:owner/:repo/check-suites/:check_suite_id/check-runs": {
        parameters: Endpoints["GET /repos/:owner/:repo/check-suites/:check_suite_id/check-runs"]["parameters"];
        response: Endpoints["GET /repos/:owner/:repo/check-suites/:check_suite_id/check-runs"]["response"] & {
            data: Endpoints["GET /repos/:owner/:repo/check-suites/:check_suite_id/check-runs"]["response"]["data"]["check_runs"];
        };
    };
    /**
     * @see https://developer.github.com/v3/code-scanning/#list-code-scanning-alerts-for-a-repository
     */
    "GET /repos/:owner/:repo/code-scanning/alerts": {
        parameters: Endpoints["GET /repos/:owner/:repo/code-scanning/alerts"]["parameters"];
        response: Endpoints["GET /repos/:owner/:repo/code-scanning/alerts"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/repos/collaborators/#list-repository-collaborators
     */
    "GET /repos/:owner/:repo/collaborators": {
        parameters: Endpoints["GET /repos/:owner/:repo/collaborators"]["parameters"];
        response: Endpoints["GET /repos/:owner/:repo/collaborators"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/repos/comments/#list-commit-comments-for-a-repository
     */
    "GET /repos/:owner/:repo/comments": {
        parameters: Endpoints["GET /repos/:owner/:repo/comments"]["parameters"];
        response: Endpoints["GET /repos/:owner/:repo/comments"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/reactions/#list-reactions-for-a-commit-comment
     */
    "GET /repos/:owner/:repo/comments/:comment_id/reactions": {
        parameters: Endpoints["GET /repos/:owner/:repo/comments/:comment_id/reactions"]["parameters"];
        response: Endpoints["GET /repos/:owner/:repo/comments/:comment_id/reactions"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/repos/commits/#list-commits
     */
    "GET /repos/:owner/:repo/commits": {
        parameters: Endpoints["GET /repos/:owner/:repo/commits"]["parameters"];
        response: Endpoints["GET /repos/:owner/:repo/commits"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/repos/commits/#list-branches-for-head-commit
     */
    "GET /repos/:owner/:repo/commits/:commit_sha/branches-where-head": {
        parameters: Endpoints["GET /repos/:owner/:repo/commits/:commit_sha/branches-where-head"]["parameters"];
        response: Endpoints["GET /repos/:owner/:repo/commits/:commit_sha/branches-where-head"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/repos/comments/#list-commit-comments
     */
    "GET /repos/:owner/:repo/commits/:commit_sha/comments": {
        parameters: Endpoints["GET /repos/:owner/:repo/commits/:commit_sha/comments"]["parameters"];
        response: Endpoints["GET /repos/:owner/:repo/commits/:commit_sha/comments"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/repos/commits/#list-pull-requests-associated-with-a-commit
     */
    "GET /repos/:owner/:repo/commits/:commit_sha/pulls": {
        parameters: Endpoints["GET /repos/:owner/:repo/commits/:commit_sha/pulls"]["parameters"];
        response: Endpoints["GET /repos/:owner/:repo/commits/:commit_sha/pulls"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/checks/runs/#list-check-runs-for-a-git-reference
     */
    "GET /repos/:owner/:repo/commits/:ref/check-runs": {
        parameters: Endpoints["GET /repos/:owner/:repo/commits/:ref/check-runs"]["parameters"];
        response: Endpoints["GET /repos/:owner/:repo/commits/:ref/check-runs"]["response"] & {
            data: Endpoints["GET /repos/:owner/:repo/commits/:ref/check-runs"]["response"]["data"]["check_runs"];
        };
    };
    /**
     * @see https://developer.github.com/v3/checks/suites/#list-check-suites-for-a-git-reference
     */
    "GET /repos/:owner/:repo/commits/:ref/check-suites": {
        parameters: Endpoints["GET /repos/:owner/:repo/commits/:ref/check-suites"]["parameters"];
        response: Endpoints["GET /repos/:owner/:repo/commits/:ref/check-suites"]["response"] & {
            data: Endpoints["GET /repos/:owner/:repo/commits/:ref/check-suites"]["response"]["data"]["check_suites"];
        };
    };
    /**
     * @see https://developer.github.com/v3/repos/statuses/#list-commit-statuses-for-a-reference
     */
    "GET /repos/:owner/:repo/commits/:ref/statuses": {
        parameters: Endpoints["GET /repos/:owner/:repo/commits/:ref/statuses"]["parameters"];
        response: Endpoints["GET /repos/:owner/:repo/commits/:ref/statuses"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/repos/#list-repository-contributors
     */
    "GET /repos/:owner/:repo/contributors": {
        parameters: Endpoints["GET /repos/:owner/:repo/contributors"]["parameters"];
        response: Endpoints["GET /repos/:owner/:repo/contributors"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/repos/deployments/#list-deployments
     */
    "GET /repos/:owner/:repo/deployments": {
        parameters: Endpoints["GET /repos/:owner/:repo/deployments"]["parameters"];
        response: Endpoints["GET /repos/:owner/:repo/deployments"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/repos/deployments/#list-deployment-statuses
     */
    "GET /repos/:owner/:repo/deployments/:deployment_id/statuses": {
        parameters: Endpoints["GET /repos/:owner/:repo/deployments/:deployment_id/statuses"]["parameters"];
        response: Endpoints["GET /repos/:owner/:repo/deployments/:deployment_id/statuses"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/repos/forks/#list-forks
     */
    "GET /repos/:owner/:repo/forks": {
        parameters: Endpoints["GET /repos/:owner/:repo/forks"]["parameters"];
        response: Endpoints["GET /repos/:owner/:repo/forks"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/git/refs/#list-matching-references
     */
    "GET /repos/:owner/:repo/git/matching-refs/:ref": {
        parameters: Endpoints["GET /repos/:owner/:repo/git/matching-refs/:ref"]["parameters"];
        response: Endpoints["GET /repos/:owner/:repo/git/matching-refs/:ref"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/repos/hooks/#list-repository-webhooks
     */
    "GET /repos/:owner/:repo/hooks": {
        parameters: Endpoints["GET /repos/:owner/:repo/hooks"]["parameters"];
        response: Endpoints["GET /repos/:owner/:repo/hooks"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/repos/invitations/#list-repository-invitations
     */
    "GET /repos/:owner/:repo/invitations": {
        parameters: Endpoints["GET /repos/:owner/:repo/invitations"]["parameters"];
        response: Endpoints["GET /repos/:owner/:repo/invitations"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/issues/#list-repository-issues
     */
    "GET /repos/:owner/:repo/issues": {
        parameters: Endpoints["GET /repos/:owner/:repo/issues"]["parameters"];
        response: Endpoints["GET /repos/:owner/:repo/issues"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/issues/comments/#list-issue-comments
     */
    "GET /repos/:owner/:repo/issues/:issue_number/comments": {
        parameters: Endpoints["GET /repos/:owner/:repo/issues/:issue_number/comments"]["parameters"];
        response: Endpoints["GET /repos/:owner/:repo/issues/:issue_number/comments"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/issues/events/#list-issue-events
     */
    "GET /repos/:owner/:repo/issues/:issue_number/events": {
        parameters: Endpoints["GET /repos/:owner/:repo/issues/:issue_number/events"]["parameters"];
        response: Endpoints["GET /repos/:owner/:repo/issues/:issue_number/events"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/issues/labels/#list-labels-for-an-issue
     */
    "GET /repos/:owner/:repo/issues/:issue_number/labels": {
        parameters: Endpoints["GET /repos/:owner/:repo/issues/:issue_number/labels"]["parameters"];
        response: Endpoints["GET /repos/:owner/:repo/issues/:issue_number/labels"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/reactions/#list-reactions-for-an-issue
     */
    "GET /repos/:owner/:repo/issues/:issue_number/reactions": {
        parameters: Endpoints["GET /repos/:owner/:repo/issues/:issue_number/reactions"]["parameters"];
        response: Endpoints["GET /repos/:owner/:repo/issues/:issue_number/reactions"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/issues/timeline/#list-timeline-events-for-an-issue
     */
    "GET /repos/:owner/:repo/issues/:issue_number/timeline": {
        parameters: Endpoints["GET /repos/:owner/:repo/issues/:issue_number/timeline"]["parameters"];
        response: Endpoints["GET /repos/:owner/:repo/issues/:issue_number/timeline"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/issues/comments/#list-issue-comments-for-a-repository
     */
    "GET /repos/:owner/:repo/issues/comments": {
        parameters: Endpoints["GET /repos/:owner/:repo/issues/comments"]["parameters"];
        response: Endpoints["GET /repos/:owner/:repo/issues/comments"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/reactions/#list-reactions-for-an-issue-comment
     */
    "GET /repos/:owner/:repo/issues/comments/:comment_id/reactions": {
        parameters: Endpoints["GET /repos/:owner/:repo/issues/comments/:comment_id/reactions"]["parameters"];
        response: Endpoints["GET /repos/:owner/:repo/issues/comments/:comment_id/reactions"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/issues/events/#list-issue-events-for-a-repository
     */
    "GET /repos/:owner/:repo/issues/events": {
        parameters: Endpoints["GET /repos/:owner/:repo/issues/events"]["parameters"];
        response: Endpoints["GET /repos/:owner/:repo/issues/events"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/repos/keys/#list-deploy-keys
     */
    "GET /repos/:owner/:repo/keys": {
        parameters: Endpoints["GET /repos/:owner/:repo/keys"]["parameters"];
        response: Endpoints["GET /repos/:owner/:repo/keys"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/issues/labels/#list-labels-for-a-repository
     */
    "GET /repos/:owner/:repo/labels": {
        parameters: Endpoints["GET /repos/:owner/:repo/labels"]["parameters"];
        response: Endpoints["GET /repos/:owner/:repo/labels"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/repos/#list-repository-languages
     */
    "GET /repos/:owner/:repo/languages": {
        parameters: Endpoints["GET /repos/:owner/:repo/languages"]["parameters"];
        response: Endpoints["GET /repos/:owner/:repo/languages"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/issues/milestones/#list-milestones
     */
    "GET /repos/:owner/:repo/milestones": {
        parameters: Endpoints["GET /repos/:owner/:repo/milestones"]["parameters"];
        response: Endpoints["GET /repos/:owner/:repo/milestones"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/issues/labels/#list-labels-for-issues-in-a-milestone
     */
    "GET /repos/:owner/:repo/milestones/:milestone_number/labels": {
        parameters: Endpoints["GET /repos/:owner/:repo/milestones/:milestone_number/labels"]["parameters"];
        response: Endpoints["GET /repos/:owner/:repo/milestones/:milestone_number/labels"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/activity/notifications/#list-repository-notifications-for-the-authenticated-user
     */
    "GET /repos/:owner/:repo/notifications": {
        parameters: Endpoints["GET /repos/:owner/:repo/notifications"]["parameters"];
        response: Endpoints["GET /repos/:owner/:repo/notifications"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/repos/pages/#list-github-pages-builds
     */
    "GET /repos/:owner/:repo/pages/builds": {
        parameters: Endpoints["GET /repos/:owner/:repo/pages/builds"]["parameters"];
        response: Endpoints["GET /repos/:owner/:repo/pages/builds"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/projects/#list-repository-projects
     */
    "GET /repos/:owner/:repo/projects": {
        parameters: Endpoints["GET /repos/:owner/:repo/projects"]["parameters"];
        response: Endpoints["GET /repos/:owner/:repo/projects"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/pulls/#list-pull-requests
     */
    "GET /repos/:owner/:repo/pulls": {
        parameters: Endpoints["GET /repos/:owner/:repo/pulls"]["parameters"];
        response: Endpoints["GET /repos/:owner/:repo/pulls"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/pulls/comments/#list-review-comments-on-a-pull-request
     */
    "GET /repos/:owner/:repo/pulls/:pull_number/comments": {
        parameters: Endpoints["GET /repos/:owner/:repo/pulls/:pull_number/comments"]["parameters"];
        response: Endpoints["GET /repos/:owner/:repo/pulls/:pull_number/comments"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/pulls/#list-commits-on-a-pull-request
     */
    "GET /repos/:owner/:repo/pulls/:pull_number/commits": {
        parameters: Endpoints["GET /repos/:owner/:repo/pulls/:pull_number/commits"]["parameters"];
        response: Endpoints["GET /repos/:owner/:repo/pulls/:pull_number/commits"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/pulls/#list-pull-requests-files
     */
    "GET /repos/:owner/:repo/pulls/:pull_number/files": {
        parameters: Endpoints["GET /repos/:owner/:repo/pulls/:pull_number/files"]["parameters"];
        response: Endpoints["GET /repos/:owner/:repo/pulls/:pull_number/files"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/pulls/review_requests/#list-requested-reviewers-for-a-pull-request
     */
    "GET /repos/:owner/:repo/pulls/:pull_number/requested_reviewers": {
        parameters: Endpoints["GET /repos/:owner/:repo/pulls/:pull_number/requested_reviewers"]["parameters"];
        response: Endpoints["GET /repos/:owner/:repo/pulls/:pull_number/requested_reviewers"]["response"] & {
            data: Endpoints["GET /repos/:owner/:repo/pulls/:pull_number/requested_reviewers"]["response"]["data"]["users"];
        };
    };
    /**
     * @see https://developer.github.com/v3/pulls/reviews/#list-reviews-for-a-pull-request
     */
    "GET /repos/:owner/:repo/pulls/:pull_number/reviews": {
        parameters: Endpoints["GET /repos/:owner/:repo/pulls/:pull_number/reviews"]["parameters"];
        response: Endpoints["GET /repos/:owner/:repo/pulls/:pull_number/reviews"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/pulls/reviews/#list-comments-for-a-pull-request-review
     */
    "GET /repos/:owner/:repo/pulls/:pull_number/reviews/:review_id/comments": {
        parameters: Endpoints["GET /repos/:owner/:repo/pulls/:pull_number/reviews/:review_id/comments"]["parameters"];
        response: Endpoints["GET /repos/:owner/:repo/pulls/:pull_number/reviews/:review_id/comments"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/pulls/comments/#list-review-comments-in-a-repository
     */
    "GET /repos/:owner/:repo/pulls/comments": {
        parameters: Endpoints["GET /repos/:owner/:repo/pulls/comments"]["parameters"];
        response: Endpoints["GET /repos/:owner/:repo/pulls/comments"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/reactions/#list-reactions-for-a-pull-request-review-comment
     */
    "GET /repos/:owner/:repo/pulls/comments/:comment_id/reactions": {
        parameters: Endpoints["GET /repos/:owner/:repo/pulls/comments/:comment_id/reactions"]["parameters"];
        response: Endpoints["GET /repos/:owner/:repo/pulls/comments/:comment_id/reactions"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/repos/releases/#list-releases
     */
    "GET /repos/:owner/:repo/releases": {
        parameters: Endpoints["GET /repos/:owner/:repo/releases"]["parameters"];
        response: Endpoints["GET /repos/:owner/:repo/releases"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/repos/releases/#list-release-assets
     */
    "GET /repos/:owner/:repo/releases/:release_id/assets": {
        parameters: Endpoints["GET /repos/:owner/:repo/releases/:release_id/assets"]["parameters"];
        response: Endpoints["GET /repos/:owner/:repo/releases/:release_id/assets"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/activity/starring/#list-stargazers
     */
    "GET /repos/:owner/:repo/stargazers": {
        parameters: Endpoints["GET /repos/:owner/:repo/stargazers"]["parameters"];
        response: Endpoints["GET /repos/:owner/:repo/stargazers"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/activity/watching/#list-watchers
     */
    "GET /repos/:owner/:repo/subscribers": {
        parameters: Endpoints["GET /repos/:owner/:repo/subscribers"]["parameters"];
        response: Endpoints["GET /repos/:owner/:repo/subscribers"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/repos/#list-repository-tags
     */
    "GET /repos/:owner/:repo/tags": {
        parameters: Endpoints["GET /repos/:owner/:repo/tags"]["parameters"];
        response: Endpoints["GET /repos/:owner/:repo/tags"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/repos/#list-repository-teams
     */
    "GET /repos/:owner/:repo/teams": {
        parameters: Endpoints["GET /repos/:owner/:repo/teams"]["parameters"];
        response: Endpoints["GET /repos/:owner/:repo/teams"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/repos/#list-public-repositories
     */
    "GET /repositories": {
        parameters: Endpoints["GET /repositories"]["parameters"];
        response: Endpoints["GET /repositories"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/enterprise-admin/scim/#list-provisioned-scim groups-for-an-enterprise
     */
    "GET /scim/v2/enterprises/:enterprise/Groups": {
        parameters: Endpoints["GET /scim/v2/enterprises/:enterprise/Groups"]["parameters"];
        response: Endpoints["GET /scim/v2/enterprises/:enterprise/Groups"]["response"] & {
            data: Endpoints["GET /scim/v2/enterprises/:enterprise/Groups"]["response"]["data"]["schemas"];
        };
    };
    /**
     * @see https://developer.github.com/v3/enterprise-admin/scim/#list-scim-provisioned-identities-for-an-enterprise
     */
    "GET /scim/v2/enterprises/:enterprise/Users": {
        parameters: Endpoints["GET /scim/v2/enterprises/:enterprise/Users"]["parameters"];
        response: Endpoints["GET /scim/v2/enterprises/:enterprise/Users"]["response"] & {
            data: Endpoints["GET /scim/v2/enterprises/:enterprise/Users"]["response"]["data"]["schemas"];
        };
    };
    /**
     * @see https://developer.github.com/v3/scim/#list-scim-provisioned-identities
     */
    "GET /scim/v2/organizations/:org/Users": {
        parameters: Endpoints["GET /scim/v2/organizations/:org/Users"]["parameters"];
        response: Endpoints["GET /scim/v2/organizations/:org/Users"]["response"] & {
            data: Endpoints["GET /scim/v2/organizations/:org/Users"]["response"]["data"]["schemas"];
        };
    };
    /**
     * @see https://developer.github.com/v3/search/#search-code
     */
    "GET /search/code": {
        parameters: Endpoints["GET /search/code"]["parameters"];
        response: Endpoints["GET /search/code"]["response"] & {
            data: Endpoints["GET /search/code"]["response"]["data"]["items"];
        };
    };
    /**
     * @see https://developer.github.com/v3/search/#search-commits
     */
    "GET /search/commits": {
        parameters: Endpoints["GET /search/commits"]["parameters"];
        response: Endpoints["GET /search/commits"]["response"] & {
            data: Endpoints["GET /search/commits"]["response"]["data"]["items"];
        };
    };
    /**
     * @see https://developer.github.com/v3/search/#search-issues-and-pull-requests
     */
    "GET /search/issues": {
        parameters: Endpoints["GET /search/issues"]["parameters"];
        response: Endpoints["GET /search/issues"]["response"] & {
            data: Endpoints["GET /search/issues"]["response"]["data"]["items"];
        };
    };
    /**
     * @see https://developer.github.com/v3/search/#search-labels
     */
    "GET /search/labels": {
        parameters: Endpoints["GET /search/labels"]["parameters"];
        response: Endpoints["GET /search/labels"]["response"] & {
            data: Endpoints["GET /search/labels"]["response"]["data"]["items"];
        };
    };
    /**
     * @see https://developer.github.com/v3/search/#search-repositories
     */
    "GET /search/repositories": {
        parameters: Endpoints["GET /search/repositories"]["parameters"];
        response: Endpoints["GET /search/repositories"]["response"] & {
            data: Endpoints["GET /search/repositories"]["response"]["data"]["items"];
        };
    };
    /**
     * @see https://developer.github.com/v3/search/#search-topics
     */
    "GET /search/topics": {
        parameters: Endpoints["GET /search/topics"]["parameters"];
        response: Endpoints["GET /search/topics"]["response"] & {
            data: Endpoints["GET /search/topics"]["response"]["data"]["items"];
        };
    };
    /**
     * @see https://developer.github.com/v3/search/#search-users
     */
    "GET /search/users": {
        parameters: Endpoints["GET /search/users"]["parameters"];
        response: Endpoints["GET /search/users"]["response"] & {
            data: Endpoints["GET /search/users"]["response"]["data"]["items"];
        };
    };
    /**
     * @see https://developer.github.com/v3/teams/discussions/#list-discussions-legacy
     */
    "GET /teams/:team_id/discussions": {
        parameters: Endpoints["GET /teams/:team_id/discussions"]["parameters"];
        response: Endpoints["GET /teams/:team_id/discussions"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/teams/discussion_comments/#list-discussion-comments-legacy
     */
    "GET /teams/:team_id/discussions/:discussion_number/comments": {
        parameters: Endpoints["GET /teams/:team_id/discussions/:discussion_number/comments"]["parameters"];
        response: Endpoints["GET /teams/:team_id/discussions/:discussion_number/comments"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/reactions/#list-reactions-for-a-team-discussion-comment-legacy
     */
    "GET /teams/:team_id/discussions/:discussion_number/comments/:comment_number/reactions": {
        parameters: Endpoints["GET /teams/:team_id/discussions/:discussion_number/comments/:comment_number/reactions"]["parameters"];
        response: Endpoints["GET /teams/:team_id/discussions/:discussion_number/comments/:comment_number/reactions"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/reactions/#list-reactions-for-a-team-discussion-legacy
     */
    "GET /teams/:team_id/discussions/:discussion_number/reactions": {
        parameters: Endpoints["GET /teams/:team_id/discussions/:discussion_number/reactions"]["parameters"];
        response: Endpoints["GET /teams/:team_id/discussions/:discussion_number/reactions"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/teams/members/#list-pending-team-invitations-legacy
     */
    "GET /teams/:team_id/invitations": {
        parameters: Endpoints["GET /teams/:team_id/invitations"]["parameters"];
        response: Endpoints["GET /teams/:team_id/invitations"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/teams/members/#list-team-members-legacy
     */
    "GET /teams/:team_id/members": {
        parameters: Endpoints["GET /teams/:team_id/members"]["parameters"];
        response: Endpoints["GET /teams/:team_id/members"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/teams/#list-team-projects-legacy
     */
    "GET /teams/:team_id/projects": {
        parameters: Endpoints["GET /teams/:team_id/projects"]["parameters"];
        response: Endpoints["GET /teams/:team_id/projects"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/teams/#list-team-repositories-legacy
     */
    "GET /teams/:team_id/repos": {
        parameters: Endpoints["GET /teams/:team_id/repos"]["parameters"];
        response: Endpoints["GET /teams/:team_id/repos"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/teams/team_sync/#list-idp-groups-for-a-team-legacy
     */
    "GET /teams/:team_id/team-sync/group-mappings": {
        parameters: Endpoints["GET /teams/:team_id/team-sync/group-mappings"]["parameters"];
        response: Endpoints["GET /teams/:team_id/team-sync/group-mappings"]["response"] & {
            data: Endpoints["GET /teams/:team_id/team-sync/group-mappings"]["response"]["data"]["groups"];
        };
    };
    /**
     * @see https://developer.github.com/v3/teams/#list-child-teams-legacy
     */
    "GET /teams/:team_id/teams": {
        parameters: Endpoints["GET /teams/:team_id/teams"]["parameters"];
        response: Endpoints["GET /teams/:team_id/teams"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/users/blocking/#list-users-blocked-by-the-authenticated-user
     */
    "GET /user/blocks": {
        parameters: Endpoints["GET /user/blocks"]["parameters"];
        response: Endpoints["GET /user/blocks"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/users/emails/#list-email-addresses-for-the-authenticated-user
     */
    "GET /user/emails": {
        parameters: Endpoints["GET /user/emails"]["parameters"];
        response: Endpoints["GET /user/emails"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/users/followers/#list-followers-of-the-authenticated-user
     */
    "GET /user/followers": {
        parameters: Endpoints["GET /user/followers"]["parameters"];
        response: Endpoints["GET /user/followers"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/users/followers/#list-the-people-the-authenticated-user-follows
     */
    "GET /user/following": {
        parameters: Endpoints["GET /user/following"]["parameters"];
        response: Endpoints["GET /user/following"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/users/gpg_keys/#list-gpg-keys-for-the-authenticated-user
     */
    "GET /user/gpg_keys": {
        parameters: Endpoints["GET /user/gpg_keys"]["parameters"];
        response: Endpoints["GET /user/gpg_keys"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/apps/installations/#list-app-installations-accessible-to-the-user-access-token
     */
    "GET /user/installations": {
        parameters: Endpoints["GET /user/installations"]["parameters"];
        response: Endpoints["GET /user/installations"]["response"] & {
            data: Endpoints["GET /user/installations"]["response"]["data"]["installations"];
        };
    };
    /**
     * @see https://developer.github.com/v3/apps/installations/#list-repositories-accessible-to-the-user-access-token
     */
    "GET /user/installations/:installation_id/repositories": {
        parameters: Endpoints["GET /user/installations/:installation_id/repositories"]["parameters"];
        response: Endpoints["GET /user/installations/:installation_id/repositories"]["response"] & {
            data: Endpoints["GET /user/installations/:installation_id/repositories"]["response"]["data"]["repositories"];
        };
    };
    /**
     * @see https://developer.github.com/v3/issues/#list-user-account-issues-assigned-to-the-authenticated-user
     */
    "GET /user/issues": {
        parameters: Endpoints["GET /user/issues"]["parameters"];
        response: Endpoints["GET /user/issues"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/users/keys/#list-public-ssh-keys-for-the-authenticated-user
     */
    "GET /user/keys": {
        parameters: Endpoints["GET /user/keys"]["parameters"];
        response: Endpoints["GET /user/keys"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/apps/marketplace/#list-subscriptions-for-the-authenticated-user
     */
    "GET /user/marketplace_purchases": {
        parameters: Endpoints["GET /user/marketplace_purchases"]["parameters"];
        response: Endpoints["GET /user/marketplace_purchases"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/apps/marketplace/#list-subscriptions-for-the-authenticated-user-stubbed
     */
    "GET /user/marketplace_purchases/stubbed": {
        parameters: Endpoints["GET /user/marketplace_purchases/stubbed"]["parameters"];
        response: Endpoints["GET /user/marketplace_purchases/stubbed"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/orgs/members/#list-organization-memberships-for-the-authenticated-user
     */
    "GET /user/memberships/orgs": {
        parameters: Endpoints["GET /user/memberships/orgs"]["parameters"];
        response: Endpoints["GET /user/memberships/orgs"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/migrations/users/#list-user-migrations
     */
    "GET /user/migrations": {
        parameters: Endpoints["GET /user/migrations"]["parameters"];
        response: Endpoints["GET /user/migrations"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/migrations/users/#list-repositories-for-a-user-migration
     */
    "GET /user/migrations/:migration_id/repositories": {
        parameters: Endpoints["GET /user/migrations/:migration_id/repositories"]["parameters"];
        response: Endpoints["GET /user/migrations/:migration_id/repositories"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/orgs/#list-organizations-for-the-authenticated-user
     */
    "GET /user/orgs": {
        parameters: Endpoints["GET /user/orgs"]["parameters"];
        response: Endpoints["GET /user/orgs"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/users/emails/#list-public-email-addresses-for-the-authenticated-user
     */
    "GET /user/public_emails": {
        parameters: Endpoints["GET /user/public_emails"]["parameters"];
        response: Endpoints["GET /user/public_emails"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/repos/invitations/#list-repository-invitations-for-the-authenticated-user
     */
    "GET /user/repository_invitations": {
        parameters: Endpoints["GET /user/repository_invitations"]["parameters"];
        response: Endpoints["GET /user/repository_invitations"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/activity/starring/#list-repositories-starred-by-the-authenticated-user
     */
    "GET /user/starred": {
        parameters: Endpoints["GET /user/starred"]["parameters"];
        response: Endpoints["GET /user/starred"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/activity/watching/#list-repositories-watched-by-the-authenticated-user
     */
    "GET /user/subscriptions": {
        parameters: Endpoints["GET /user/subscriptions"]["parameters"];
        response: Endpoints["GET /user/subscriptions"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/teams/#list-teams-for-the-authenticated-user
     */
    "GET /user/teams": {
        parameters: Endpoints["GET /user/teams"]["parameters"];
        response: Endpoints["GET /user/teams"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/users/#list-users
     */
    "GET /users": {
        parameters: Endpoints["GET /users"]["parameters"];
        response: Endpoints["GET /users"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/users/followers/#list-followers-of-a-user
     */
    "GET /users/:username/followers": {
        parameters: Endpoints["GET /users/:username/followers"]["parameters"];
        response: Endpoints["GET /users/:username/followers"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/users/followers/#list-the-people-a-user-follows
     */
    "GET /users/:username/following": {
        parameters: Endpoints["GET /users/:username/following"]["parameters"];
        response: Endpoints["GET /users/:username/following"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/gists/#list-gists-for-a-user
     */
    "GET /users/:username/gists": {
        parameters: Endpoints["GET /users/:username/gists"]["parameters"];
        response: Endpoints["GET /users/:username/gists"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/users/gpg_keys/#list-gpg-keys-for-a-user
     */
    "GET /users/:username/gpg_keys": {
        parameters: Endpoints["GET /users/:username/gpg_keys"]["parameters"];
        response: Endpoints["GET /users/:username/gpg_keys"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/users/keys/#list-public-keys-for-a-user
     */
    "GET /users/:username/keys": {
        parameters: Endpoints["GET /users/:username/keys"]["parameters"];
        response: Endpoints["GET /users/:username/keys"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/orgs/#list-organizations-for-a-user
     */
    "GET /users/:username/orgs": {
        parameters: Endpoints["GET /users/:username/orgs"]["parameters"];
        response: Endpoints["GET /users/:username/orgs"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/projects/#list-user-projects
     */
    "GET /users/:username/projects": {
        parameters: Endpoints["GET /users/:username/projects"]["parameters"];
        response: Endpoints["GET /users/:username/projects"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/activity/starring/#list-repositories-starred-by-a-user
     */
    "GET /users/:username/starred": {
        parameters: Endpoints["GET /users/:username/starred"]["parameters"];
        response: Endpoints["GET /users/:username/starred"]["response"];
    };
    /**
     * @see https://developer.github.com/v3/activity/watching/#list-repositories-watched-by-a-user
     */
    "GET /users/:username/subscriptions": {
        parameters: Endpoints["GET /users/:username/subscriptions"]["parameters"];
        response: Endpoints["GET /users/:username/subscriptions"]["response"];
    };
}
