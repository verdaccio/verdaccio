import { EndpointInterface, RequestInterface } from "@octokit/types";
import { RestEndpointMethodTypes } from "./parameters-and-response-types";
export declare type RestEndpointMethods = {
    actions: {
        /**
         * Adds a repository to an organization secret when the `visibility` for repository access is set to `selected`. The visibility is set when you [Create or update an organization secret](https://developer.github.com/v3/actions/secrets/#create-or-update-an-organization-secret). You must authenticate using an access token with the `admin:org` scope to use this endpoint. GitHub Apps must have the `secrets` organization permission to use this endpoint.
         */
        addSelectedRepoToOrgSecret: {
            (params?: RestEndpointMethodTypes["actions"]["addSelectedRepoToOrgSecret"]["parameters"]): Promise<RestEndpointMethodTypes["actions"]["addSelectedRepoToOrgSecret"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Cancels a workflow run using its `id`. You must authenticate using an access token with the `repo` scope to use this endpoint. GitHub Apps must have the `actions:write` permission to use this endpoint.
         */
        cancelWorkflowRun: {
            (params?: RestEndpointMethodTypes["actions"]["cancelWorkflowRun"]["parameters"]): Promise<RestEndpointMethodTypes["actions"]["cancelWorkflowRun"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Creates or updates an organization secret with an encrypted value. Encrypt your secret using [LibSodium](https://libsodium.gitbook.io/doc/bindings_for_other_languages). You must authenticate using an access token with the `admin:org` scope to use this endpoint. GitHub Apps must have the `secrets` organization permission to use this endpoint.
         *
         * Encrypt your secret using the [tweetsodium](https://github.com/github/tweetsodium) library.
         *
         *
         *
         * Encrypt your secret using [pynacl](https://pynacl.readthedocs.io/en/stable/public/#nacl-public-sealedbox) with Python 3.
         *
         *
         *
         * Encrypt your secret using the [Sodium.Core](https://www.nuget.org/packages/Sodium.Core/) package.
         *
         *
         *
         * Encrypt your secret using the [rbnacl](https://github.com/RubyCrypto/rbnacl) gem.
         */
        createOrUpdateOrgSecret: {
            (params?: RestEndpointMethodTypes["actions"]["createOrUpdateOrgSecret"]["parameters"]): Promise<RestEndpointMethodTypes["actions"]["createOrUpdateOrgSecret"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Creates or updates a repository secret with an encrypted value. Encrypt your secret using [LibSodium](https://libsodium.gitbook.io/doc/bindings_for_other_languages). You must authenticate using an access token with the `repo` scope to use this endpoint. GitHub Apps must have the `secrets` repository permission to use this endpoint.
         *
         * Encrypt your secret using the [tweetsodium](https://github.com/github/tweetsodium) library.
         *
         *
         *
         * Encrypt your secret using [pynacl](https://pynacl.readthedocs.io/en/stable/public/#nacl-public-sealedbox) with Python 3.
         *
         *
         *
         * Encrypt your secret using the [Sodium.Core](https://www.nuget.org/packages/Sodium.Core/) package.
         *
         *
         *
         * Encrypt your secret using the [rbnacl](https://github.com/RubyCrypto/rbnacl) gem.
         */
        createOrUpdateRepoSecret: {
            (params?: RestEndpointMethodTypes["actions"]["createOrUpdateRepoSecret"]["parameters"]): Promise<RestEndpointMethodTypes["actions"]["createOrUpdateRepoSecret"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Creates or updates a repository secret with an encrypted value. Encrypt your secret using [LibSodium](https://libsodium.gitbook.io/doc/bindings_for_other_languages). You must authenticate using an access token with the `repo` scope to use this endpoint. GitHub Apps must have the `secrets` repository permission to use this endpoint.
         *
         * Encrypt your secret using the [tweetsodium](https://github.com/github/tweetsodium) library.
         *
         *
         *
         * Encrypt your secret using [pynacl](https://pynacl.readthedocs.io/en/stable/public/#nacl-public-sealedbox) with Python 3.
         *
         *
         *
         * Encrypt your secret using the [Sodium.Core](https://www.nuget.org/packages/Sodium.Core/) package.
         *
         *
         *
         * Encrypt your secret using the [rbnacl](https://github.com/RubyCrypto/rbnacl) gem.
         * @deprecated octokit.actions.createOrUpdateSecretForRepo() has been renamed to octokit.actions.createOrUpdateRepoSecret() (2020-05-14)
         */
        createOrUpdateSecretForRepo: {
            (params?: RestEndpointMethodTypes["actions"]["createOrUpdateSecretForRepo"]["parameters"]): Promise<RestEndpointMethodTypes["actions"]["createOrUpdateSecretForRepo"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Returns a token that you can pass to the `config` script. The token expires after one hour. You must authenticate using an access token with the `repo` scope to use this endpoint.
         *
         * Configure your self-hosted runner, replacing TOKEN with the registration token provided by this endpoint.
         * @deprecated octokit.actions.createRegistrationToken() has been renamed to octokit.actions.createRegistrationTokenForRepo() (2020-04-22)
         */
        createRegistrationToken: {
            (params?: RestEndpointMethodTypes["actions"]["createRegistrationToken"]["parameters"]): Promise<RestEndpointMethodTypes["actions"]["createRegistrationToken"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * **Warning:** The self-hosted runners API for organizations is currently in public beta and subject to change.
         *
         * Returns a token that you can pass to the `config` script. The token expires after one hour. You must authenticate using an access token with the `admin:org` scope to use this endpoint.
         *
         * Configure your self-hosted runner, replacing `TOKEN` with the registration token provided by this endpoint.
         */
        createRegistrationTokenForOrg: {
            (params?: RestEndpointMethodTypes["actions"]["createRegistrationTokenForOrg"]["parameters"]): Promise<RestEndpointMethodTypes["actions"]["createRegistrationTokenForOrg"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Returns a token that you can pass to the `config` script. The token expires after one hour. You must authenticate using an access token with the `repo` scope to use this endpoint.
         *
         * Configure your self-hosted runner, replacing TOKEN with the registration token provided by this endpoint.
         */
        createRegistrationTokenForRepo: {
            (params?: RestEndpointMethodTypes["actions"]["createRegistrationTokenForRepo"]["parameters"]): Promise<RestEndpointMethodTypes["actions"]["createRegistrationTokenForRepo"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Returns a token that you can pass to remove a self-hosted runner from a repository. The token expires after one hour. You must authenticate using an access token with the `repo` scope to use this endpoint.
         *
         * Remove your self-hosted runner from a repository, replacing TOKEN with the remove token provided by this endpoint.
         * @deprecated octokit.actions.createRemoveToken() has been renamed to octokit.actions.createRemoveTokenForRepo() (2020-04-22)
         */
        createRemoveToken: {
            (params?: RestEndpointMethodTypes["actions"]["createRemoveToken"]["parameters"]): Promise<RestEndpointMethodTypes["actions"]["createRemoveToken"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * **Warning:** The self-hosted runners API for organizations is currently in public beta and subject to change.
         *
         * Returns a token that you can pass to the `config` script to remove a self-hosted runner from an organization. The token expires after one hour. You must authenticate using an access token with the `admin:org` scope to use this endpoint.
         *
         * To remove your self-hosted runner from an organization, replace `TOKEN` with the remove token provided by this endpoint.
         */
        createRemoveTokenForOrg: {
            (params?: RestEndpointMethodTypes["actions"]["createRemoveTokenForOrg"]["parameters"]): Promise<RestEndpointMethodTypes["actions"]["createRemoveTokenForOrg"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Returns a token that you can pass to remove a self-hosted runner from a repository. The token expires after one hour. You must authenticate using an access token with the `repo` scope to use this endpoint.
         *
         * Remove your self-hosted runner from a repository, replacing TOKEN with the remove token provided by this endpoint.
         */
        createRemoveTokenForRepo: {
            (params?: RestEndpointMethodTypes["actions"]["createRemoveTokenForRepo"]["parameters"]): Promise<RestEndpointMethodTypes["actions"]["createRemoveTokenForRepo"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Deletes an artifact for a workflow run. You must authenticate using an access token with the `repo` scope to use this endpoint. GitHub Apps must have the `actions:write` permission to use this endpoint.
         */
        deleteArtifact: {
            (params?: RestEndpointMethodTypes["actions"]["deleteArtifact"]["parameters"]): Promise<RestEndpointMethodTypes["actions"]["deleteArtifact"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Deletes a secret in an organization using the secret name. You must authenticate using an access token with the `admin:org` scope to use this endpoint. GitHub Apps must have the `secrets` organization permission to use this endpoint.
         */
        deleteOrgSecret: {
            (params?: RestEndpointMethodTypes["actions"]["deleteOrgSecret"]["parameters"]): Promise<RestEndpointMethodTypes["actions"]["deleteOrgSecret"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Deletes a secret in a repository using the secret name. You must authenticate using an access token with the `repo` scope to use this endpoint. GitHub Apps must have the `secrets` repository permission to use this endpoint.
         */
        deleteRepoSecret: {
            (params?: RestEndpointMethodTypes["actions"]["deleteRepoSecret"]["parameters"]): Promise<RestEndpointMethodTypes["actions"]["deleteRepoSecret"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Deletes a secret in a repository using the secret name. You must authenticate using an access token with the `repo` scope to use this endpoint. GitHub Apps must have the `secrets` repository permission to use this endpoint.
         * @deprecated octokit.actions.deleteSecretFromRepo() has been renamed to octokit.actions.deleteRepoSecret() (2020-05-14)
         */
        deleteSecretFromRepo: {
            (params?: RestEndpointMethodTypes["actions"]["deleteSecretFromRepo"]["parameters"]): Promise<RestEndpointMethodTypes["actions"]["deleteSecretFromRepo"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * **Warning:** The self-hosted runners API for organizations is currently in public beta and subject to change.
         *
         * Forces the removal of a self-hosted runner from an organization. You can use this endpoint to completely remove the runner when the machine you were using no longer exists. You must authenticate using an access token with the `admin:org` scope to use this endpoint.
         */
        deleteSelfHostedRunnerFromOrg: {
            (params?: RestEndpointMethodTypes["actions"]["deleteSelfHostedRunnerFromOrg"]["parameters"]): Promise<RestEndpointMethodTypes["actions"]["deleteSelfHostedRunnerFromOrg"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Forces the removal of a self-hosted runner from a repository. You can use this endpoint to completely remove the runner when the machine you were using no longer exists. You must authenticate using an access token with the `repo` scope to use this endpoint.
         */
        deleteSelfHostedRunnerFromRepo: {
            (params?: RestEndpointMethodTypes["actions"]["deleteSelfHostedRunnerFromRepo"]["parameters"]): Promise<RestEndpointMethodTypes["actions"]["deleteSelfHostedRunnerFromRepo"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Deletes all logs for a workflow run. You must authenticate using an access token with the `repo` scope to use this endpoint. GitHub Apps must have the `actions:write` permission to use this endpoint.
         */
        deleteWorkflowRunLogs: {
            (params?: RestEndpointMethodTypes["actions"]["deleteWorkflowRunLogs"]["parameters"]): Promise<RestEndpointMethodTypes["actions"]["deleteWorkflowRunLogs"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Gets a redirect URL to download an archive for a repository. This URL expires after 1 minute. Look for `Location:` in the response header to find the URL for the download. The `:archive_format` must be `zip`. Anyone with read access to the repository can use this endpoint. If the repository is private you must use an access token with the `repo` scope. GitHub Apps must have the `actions:read` permission to use this endpoint.
         *
         * Call this endpoint using the `-v` flag, which enables verbose output and allows you to see the download URL in the header. To download the file into the current working directory, specify the filename using the `-o` flag.
         */
        downloadArtifact: {
            (params?: RestEndpointMethodTypes["actions"]["downloadArtifact"]["parameters"]): Promise<RestEndpointMethodTypes["actions"]["downloadArtifact"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Gets a redirect URL to download a plain text file of logs for a workflow job. This link expires after 1 minute. Look for `Location:` in the response header to find the URL for the download. Anyone with read access to the repository can use this endpoint. If the repository is private you must use an access token with the `repo` scope. GitHub Apps must have the `actions:read` permission to use this endpoint.
         *
         * Call this endpoint using the `-v` flag, which enables verbose output and allows you to see the download URL in the header. To download the file into the current working directory, specify the filename using the `-o` flag.
         */
        downloadJobLogsForWorkflowRun: {
            (params?: RestEndpointMethodTypes["actions"]["downloadJobLogsForWorkflowRun"]["parameters"]): Promise<RestEndpointMethodTypes["actions"]["downloadJobLogsForWorkflowRun"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Gets a redirect URL to download a plain text file of logs for a workflow job. This link expires after 1 minute. Look for `Location:` in the response header to find the URL for the download. Anyone with read access to the repository can use this endpoint. If the repository is private you must use an access token with the `repo` scope. GitHub Apps must have the `actions:read` permission to use this endpoint.
         *
         * Call this endpoint using the `-v` flag, which enables verbose output and allows you to see the download URL in the header. To download the file into the current working directory, specify the filename using the `-o` flag.
         * @deprecated octokit.actions.downloadWorkflowJobLogs() has been renamed to octokit.actions.downloadJobLogsForWorkflowRun() (2020-06-04)
         */
        downloadWorkflowJobLogs: {
            (params?: RestEndpointMethodTypes["actions"]["downloadWorkflowJobLogs"]["parameters"]): Promise<RestEndpointMethodTypes["actions"]["downloadWorkflowJobLogs"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Gets a redirect URL to download an archive of log files for a workflow run. This link expires after 1 minute. Look for `Location:` in the response header to find the URL for the download. Anyone with read access to the repository can use this endpoint. If the repository is private you must use an access token with the `repo` scope. GitHub Apps must have the `actions:read` permission to use this endpoint.
         *
         * Call this endpoint using the `-v` flag, which enables verbose output and allows you to see the download URL in the header. To download the file into the current working directory, specify the filename using the `-o` flag.
         */
        downloadWorkflowRunLogs: {
            (params?: RestEndpointMethodTypes["actions"]["downloadWorkflowRunLogs"]["parameters"]): Promise<RestEndpointMethodTypes["actions"]["downloadWorkflowRunLogs"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Gets a specific artifact for a workflow run. Anyone with read access to the repository can use this endpoint. If the repository is private you must use an access token with the `repo` scope. GitHub Apps must have the `actions:read` permission to use this endpoint.
         */
        getArtifact: {
            (params?: RestEndpointMethodTypes["actions"]["getArtifact"]["parameters"]): Promise<RestEndpointMethodTypes["actions"]["getArtifact"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Gets a specific job in a workflow run. Anyone with read access to the repository can use this endpoint. If the repository is private you must use an access token with the `repo` scope. GitHub Apps must have the `actions:read` permission to use this endpoint.
         */
        getJobForWorkflowRun: {
            (params?: RestEndpointMethodTypes["actions"]["getJobForWorkflowRun"]["parameters"]): Promise<RestEndpointMethodTypes["actions"]["getJobForWorkflowRun"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Gets your public key, which you need to encrypt secrets. You need to encrypt a secret before you can create or update secrets. You must authenticate using an access token with the `admin:org` scope to use this endpoint. GitHub Apps must have the `secrets` organization permission to use this endpoint.
         */
        getOrgPublicKey: {
            (params?: RestEndpointMethodTypes["actions"]["getOrgPublicKey"]["parameters"]): Promise<RestEndpointMethodTypes["actions"]["getOrgPublicKey"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Gets a single organization secret without revealing its encrypted value. You must authenticate using an access token with the `admin:org` scope to use this endpoint. GitHub Apps must have the `secrets` organization permission to use this endpoint.
         */
        getOrgSecret: {
            (params?: RestEndpointMethodTypes["actions"]["getOrgSecret"]["parameters"]): Promise<RestEndpointMethodTypes["actions"]["getOrgSecret"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Gets your public key, which you need to encrypt secrets. You need to encrypt a secret before you can create or update secrets. Anyone with read access to the repository can use this endpoint. If the repository is private you must use an access token with the `repo` scope. GitHub Apps must have the `secrets` repository permission to use this endpoint.
         * @deprecated octokit.actions.getPublicKey() has been renamed to octokit.actions.getRepoPublicKey() (2020-05-14)
         */
        getPublicKey: {
            (params?: RestEndpointMethodTypes["actions"]["getPublicKey"]["parameters"]): Promise<RestEndpointMethodTypes["actions"]["getPublicKey"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Gets your public key, which you need to encrypt secrets. You need to encrypt a secret before you can create or update secrets. Anyone with read access to the repository can use this endpoint. If the repository is private you must use an access token with the `repo` scope. GitHub Apps must have the `secrets` repository permission to use this endpoint.
         */
        getRepoPublicKey: {
            (params?: RestEndpointMethodTypes["actions"]["getRepoPublicKey"]["parameters"]): Promise<RestEndpointMethodTypes["actions"]["getRepoPublicKey"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Gets a single repository secret without revealing its encrypted value. You must authenticate using an access token with the `repo` scope to use this endpoint. GitHub Apps must have the `secrets` repository permission to use this endpoint.
         */
        getRepoSecret: {
            (params?: RestEndpointMethodTypes["actions"]["getRepoSecret"]["parameters"]): Promise<RestEndpointMethodTypes["actions"]["getRepoSecret"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Gets a single repository secret without revealing its encrypted value. You must authenticate using an access token with the `repo` scope to use this endpoint. GitHub Apps must have the `secrets` repository permission to use this endpoint.
         * @deprecated octokit.actions.getSecret() has been renamed to octokit.actions.getRepoSecret() (2020-05-14)
         */
        getSecret: {
            (params?: RestEndpointMethodTypes["actions"]["getSecret"]["parameters"]): Promise<RestEndpointMethodTypes["actions"]["getSecret"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Gets a specific self-hosted runner. You must authenticate using an access token with the `repo` scope to use this endpoint.
         * @deprecated octokit.actions.getSelfHostedRunner() has been renamed to octokit.actions.getSelfHostedRunnerForRepo() (2020-04-22)
         */
        getSelfHostedRunner: {
            (params?: RestEndpointMethodTypes["actions"]["getSelfHostedRunner"]["parameters"]): Promise<RestEndpointMethodTypes["actions"]["getSelfHostedRunner"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * **Warning:** The self-hosted runners API for organizations is currently in public beta and subject to change.
         *
         * Gets a specific self-hosted runner for an organization. You must authenticate using an access token with the `admin:org` scope to use this endpoint.
         */
        getSelfHostedRunnerForOrg: {
            (params?: RestEndpointMethodTypes["actions"]["getSelfHostedRunnerForOrg"]["parameters"]): Promise<RestEndpointMethodTypes["actions"]["getSelfHostedRunnerForOrg"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Gets a specific self-hosted runner. You must authenticate using an access token with the `repo` scope to use this endpoint.
         */
        getSelfHostedRunnerForRepo: {
            (params?: RestEndpointMethodTypes["actions"]["getSelfHostedRunnerForRepo"]["parameters"]): Promise<RestEndpointMethodTypes["actions"]["getSelfHostedRunnerForRepo"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Gets a specific workflow. You can also replace `:workflow_id` with `:workflow_file_name`. For example, you could use `main.yml`. Anyone with read access to the repository can use this endpoint. If the repository is private you must use an access token with the `repo` scope. GitHub Apps must have the `actions:read` permission to use this endpoint.
         */
        getWorkflow: {
            (params?: RestEndpointMethodTypes["actions"]["getWorkflow"]["parameters"]): Promise<RestEndpointMethodTypes["actions"]["getWorkflow"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Gets a specific job in a workflow run. Anyone with read access to the repository can use this endpoint. If the repository is private you must use an access token with the `repo` scope. GitHub Apps must have the `actions:read` permission to use this endpoint.
         * @deprecated octokit.actions.getWorkflowJob() has been renamed to octokit.actions.getJobForWorkflowRun() (2020-06-04)
         */
        getWorkflowJob: {
            (params?: RestEndpointMethodTypes["actions"]["getWorkflowJob"]["parameters"]): Promise<RestEndpointMethodTypes["actions"]["getWorkflowJob"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Gets a specific workflow run. Anyone with read access to the repository can use this endpoint. If the repository is private you must use an access token with the `repo` scope. GitHub Apps must have the `actions:read` permission to use this endpoint.
         */
        getWorkflowRun: {
            (params?: RestEndpointMethodTypes["actions"]["getWorkflowRun"]["parameters"]): Promise<RestEndpointMethodTypes["actions"]["getWorkflowRun"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * **Warning:** This GitHub Actions usage endpoint is currently in public beta and subject to change. For more information, see "[GitHub Actions API workflow usage](https://developer.github.com/changes/2020-05-15-actions-api-workflow-usage)."
         *
         * Gets the number of billable minutes and total run time for a specific workflow run. Billable minutes only apply to workflows in private repositories that use GitHub-hosted runners. Usage is listed for each GitHub-hosted runner operating system in milliseconds. Any job re-runs are also included in the usage. The usage does not include the multiplier for macOS and Windows runners and is not rounded up to the nearest whole minute. For more information, see "[Managing billing for GitHub Actions](https://help.github.com/github/setting-up-and-managing-billing-and-payments-on-github/managing-billing-for-github-actions)" in the GitHub Help documentation.
         *
         * Anyone with read access to the repository can use this endpoint. If the repository is private you must use an access token with the `repo` scope. GitHub Apps must have the `actions:read` permission to use this endpoint.
         */
        getWorkflowRunUsage: {
            (params?: RestEndpointMethodTypes["actions"]["getWorkflowRunUsage"]["parameters"]): Promise<RestEndpointMethodTypes["actions"]["getWorkflowRunUsage"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * **Warning:** This GitHub Actions usage endpoint is currently in public beta and subject to change. For more information, see "[GitHub Actions API workflow usage](https://developer.github.com/changes/2020-05-15-actions-api-workflow-usage)."
         *
         * Gets the number of billable minutes used by a specific workflow during the current billing cycle. Billable minutes only apply to workflows in private repositories that use GitHub-hosted runners. Usage is listed for each GitHub-hosted runner operating system in milliseconds. Any job re-runs are also included in the usage. The usage does not include the multiplier for macOS and Windows runners and is not rounded up to the nearest whole minute. For more information, see "[Managing billing for GitHub Actions](https://help.github.com/github/setting-up-and-managing-billing-and-payments-on-github/managing-billing-for-github-actions)" in the GitHub Help documentation.
         *
         * You can also replace `:workflow_id` with `:workflow_file_name`. For example, you could use `main.yml`. Anyone with read access to the repository can use this endpoint. If the repository is private you must use an access token with the `repo` scope. GitHub Apps must have the `actions:read` permission to use this endpoint.
         */
        getWorkflowUsage: {
            (params?: RestEndpointMethodTypes["actions"]["getWorkflowUsage"]["parameters"]): Promise<RestEndpointMethodTypes["actions"]["getWorkflowUsage"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Lists all artifacts for a repository. Anyone with read access to the repository can use this endpoint. If the repository is private you must use an access token with the `repo` scope. GitHub Apps must have the `actions:read` permission to use this endpoint.
         */
        listArtifactsForRepo: {
            (params?: RestEndpointMethodTypes["actions"]["listArtifactsForRepo"]["parameters"]): Promise<RestEndpointMethodTypes["actions"]["listArtifactsForRepo"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Lists binaries for the runner application that you can download and run. You must authenticate using an access token with the `repo` scope to use this endpoint.
         * @deprecated octokit.actions.listDownloadsForSelfHostedRunnerApplication() has been renamed to octokit.actions.listRunnerApplicationsForRepo() (2020-04-22)
         */
        listDownloadsForSelfHostedRunnerApplication: {
            (params?: RestEndpointMethodTypes["actions"]["listDownloadsForSelfHostedRunnerApplication"]["parameters"]): Promise<RestEndpointMethodTypes["actions"]["listDownloadsForSelfHostedRunnerApplication"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Lists jobs for a workflow run. Anyone with read access to the repository can use this endpoint. If the repository is private you must use an access token with the `repo` scope. GitHub Apps must have the `actions:read` permission to use this endpoint. You can use parameters to narrow the list of results. For more information about using parameters, see [Parameters](https://developer.github.com/v3/#parameters).
         */
        listJobsForWorkflowRun: {
            (params?: RestEndpointMethodTypes["actions"]["listJobsForWorkflowRun"]["parameters"]): Promise<RestEndpointMethodTypes["actions"]["listJobsForWorkflowRun"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Lists all secrets available in an organization without revealing their encrypted values. You must authenticate using an access token with the `admin:org` scope to use this endpoint. GitHub Apps must have the `secrets` organization permission to use this endpoint.
         */
        listOrgSecrets: {
            (params?: RestEndpointMethodTypes["actions"]["listOrgSecrets"]["parameters"]): Promise<RestEndpointMethodTypes["actions"]["listOrgSecrets"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Lists all secrets available in a repository without revealing their encrypted values. You must authenticate using an access token with the `repo` scope to use this endpoint. GitHub Apps must have the `secrets` repository permission to use this endpoint.
         */
        listRepoSecrets: {
            (params?: RestEndpointMethodTypes["actions"]["listRepoSecrets"]["parameters"]): Promise<RestEndpointMethodTypes["actions"]["listRepoSecrets"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Lists all workflow runs for a repository. You can use parameters to narrow the list of results. For more information about using parameters, see [Parameters](https://developer.github.com/v3/#parameters).
         *
         * Anyone with read access to the repository can use this endpoint. If the repository is private you must use an access token with the `repo` scope. GitHub Apps must have the `actions:read` permission to use this endpoint.
         * @deprecated octokit.actions.listRepoWorkflowRuns() has been renamed to octokit.actions.listWorkflowRunsForRepo() (2020-06-04)
         */
        listRepoWorkflowRuns: {
            (params?: RestEndpointMethodTypes["actions"]["listRepoWorkflowRuns"]["parameters"]): Promise<RestEndpointMethodTypes["actions"]["listRepoWorkflowRuns"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Lists the workflows in a repository. Anyone with read access to the repository can use this endpoint. If the repository is private you must use an access token with the `repo` scope. GitHub Apps must have the `actions:read` permission to use this endpoint.
         */
        listRepoWorkflows: {
            (params?: RestEndpointMethodTypes["actions"]["listRepoWorkflows"]["parameters"]): Promise<RestEndpointMethodTypes["actions"]["listRepoWorkflows"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * **Warning:** The self-hosted runners API for organizations is currently in public beta and subject to change.
         *
         * Lists binaries for the runner application that you can download and run. You must authenticate using an access token with the `admin:org` scope to use this endpoint.
         */
        listRunnerApplicationsForOrg: {
            (params?: RestEndpointMethodTypes["actions"]["listRunnerApplicationsForOrg"]["parameters"]): Promise<RestEndpointMethodTypes["actions"]["listRunnerApplicationsForOrg"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Lists binaries for the runner application that you can download and run. You must authenticate using an access token with the `repo` scope to use this endpoint.
         */
        listRunnerApplicationsForRepo: {
            (params?: RestEndpointMethodTypes["actions"]["listRunnerApplicationsForRepo"]["parameters"]): Promise<RestEndpointMethodTypes["actions"]["listRunnerApplicationsForRepo"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Lists all secrets available in a repository without revealing their encrypted values. You must authenticate using an access token with the `repo` scope to use this endpoint. GitHub Apps must have the `secrets` repository permission to use this endpoint.
         * @deprecated octokit.actions.listSecretsForRepo() has been renamed to octokit.actions.listRepoSecrets() (2020-05-14)
         */
        listSecretsForRepo: {
            (params?: RestEndpointMethodTypes["actions"]["listSecretsForRepo"]["parameters"]): Promise<RestEndpointMethodTypes["actions"]["listSecretsForRepo"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Lists all repositories that have been selected when the `visibility` for repository access to a secret is set to `selected`. You must authenticate using an access token with the `admin:org` scope to use this endpoint. GitHub Apps must have the `secrets` organization permission to use this endpoint.
         */
        listSelectedReposForOrgSecret: {
            (params?: RestEndpointMethodTypes["actions"]["listSelectedReposForOrgSecret"]["parameters"]): Promise<RestEndpointMethodTypes["actions"]["listSelectedReposForOrgSecret"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * **Warning:** The self-hosted runners API for organizations is currently in public beta and subject to change.
         *
         * Lists all self-hosted runners for an organization. You must authenticate using an access token with the `admin:org` scope to use this endpoint.
         */
        listSelfHostedRunnersForOrg: {
            (params?: RestEndpointMethodTypes["actions"]["listSelfHostedRunnersForOrg"]["parameters"]): Promise<RestEndpointMethodTypes["actions"]["listSelfHostedRunnersForOrg"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Lists all self-hosted runners for a repository. You must authenticate using an access token with the `repo` scope to use this endpoint.
         */
        listSelfHostedRunnersForRepo: {
            (params?: RestEndpointMethodTypes["actions"]["listSelfHostedRunnersForRepo"]["parameters"]): Promise<RestEndpointMethodTypes["actions"]["listSelfHostedRunnersForRepo"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Gets a redirect URL to download a plain text file of logs for a workflow job. This link expires after 1 minute. Look for `Location:` in the response header to find the URL for the download. Anyone with read access to the repository can use this endpoint. If the repository is private you must use an access token with the `repo` scope. GitHub Apps must have the `actions:read` permission to use this endpoint.
         *
         * Call this endpoint using the `-v` flag, which enables verbose output and allows you to see the download URL in the header. To download the file into the current working directory, specify the filename using the `-o` flag.
         * @deprecated octokit.actions.listWorkflowJobLogs() has been renamed to octokit.actions.downloadWorkflowJobLogs() (2020-05-04)
         */
        listWorkflowJobLogs: {
            (params?: RestEndpointMethodTypes["actions"]["listWorkflowJobLogs"]["parameters"]): Promise<RestEndpointMethodTypes["actions"]["listWorkflowJobLogs"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Lists artifacts for a workflow run. Anyone with read access to the repository can use this endpoint. If the repository is private you must use an access token with the `repo` scope. GitHub Apps must have the `actions:read` permission to use this endpoint.
         */
        listWorkflowRunArtifacts: {
            (params?: RestEndpointMethodTypes["actions"]["listWorkflowRunArtifacts"]["parameters"]): Promise<RestEndpointMethodTypes["actions"]["listWorkflowRunArtifacts"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Gets a redirect URL to download an archive of log files for a workflow run. This link expires after 1 minute. Look for `Location:` in the response header to find the URL for the download. Anyone with read access to the repository can use this endpoint. If the repository is private you must use an access token with the `repo` scope. GitHub Apps must have the `actions:read` permission to use this endpoint.
         *
         * Call this endpoint using the `-v` flag, which enables verbose output and allows you to see the download URL in the header. To download the file into the current working directory, specify the filename using the `-o` flag.
         * @deprecated octokit.actions.listWorkflowRunLogs() has been renamed to octokit.actions.downloadWorkflowRunLogs() (2020-05-04)
         */
        listWorkflowRunLogs: {
            (params?: RestEndpointMethodTypes["actions"]["listWorkflowRunLogs"]["parameters"]): Promise<RestEndpointMethodTypes["actions"]["listWorkflowRunLogs"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * List all workflow runs for a workflow. You can also replace `:workflow_id` with `:workflow_file_name`. For example, you could use `main.yml`. You can use parameters to narrow the list of results. For more information about using parameters, see [Parameters](https://developer.github.com/v3/#parameters).
         *
         * Anyone with read access to the repository can use this endpoint. If the repository is private you must use an access token with the `repo` scope.
         */
        listWorkflowRuns: {
            (params?: RestEndpointMethodTypes["actions"]["listWorkflowRuns"]["parameters"]): Promise<RestEndpointMethodTypes["actions"]["listWorkflowRuns"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Lists all workflow runs for a repository. You can use parameters to narrow the list of results. For more information about using parameters, see [Parameters](https://developer.github.com/v3/#parameters).
         *
         * Anyone with read access to the repository can use this endpoint. If the repository is private you must use an access token with the `repo` scope. GitHub Apps must have the `actions:read` permission to use this endpoint.
         */
        listWorkflowRunsForRepo: {
            (params?: RestEndpointMethodTypes["actions"]["listWorkflowRunsForRepo"]["parameters"]): Promise<RestEndpointMethodTypes["actions"]["listWorkflowRunsForRepo"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Re-runs your workflow run using its `id`. You must authenticate using an access token with the `repo` scope to use this endpoint. GitHub Apps must have the `actions:write` permission to use this endpoint.
         */
        reRunWorkflow: {
            (params?: RestEndpointMethodTypes["actions"]["reRunWorkflow"]["parameters"]): Promise<RestEndpointMethodTypes["actions"]["reRunWorkflow"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Removes a repository from an organization secret when the `visibility` for repository access is set to `selected`. The visibility is set when you [Create or update an organization secret](https://developer.github.com/v3/actions/secrets/#create-or-update-an-organization-secret). You must authenticate using an access token with the `admin:org` scope to use this endpoint. GitHub Apps must have the `secrets` organization permission to use this endpoint.
         */
        removeSelectedRepoFromOrgSecret: {
            (params?: RestEndpointMethodTypes["actions"]["removeSelectedRepoFromOrgSecret"]["parameters"]): Promise<RestEndpointMethodTypes["actions"]["removeSelectedRepoFromOrgSecret"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Forces the removal of a self-hosted runner from a repository. You can use this endpoint to completely remove the runner when the machine you were using no longer exists. You must authenticate using an access token with the `repo` scope to use this endpoint.
         * @deprecated octokit.actions.removeSelfHostedRunner() has been renamed to octokit.actions.deleteSelfHostedRunnerFromRepo() (2020-04-22)
         */
        removeSelfHostedRunner: {
            (params?: RestEndpointMethodTypes["actions"]["removeSelfHostedRunner"]["parameters"]): Promise<RestEndpointMethodTypes["actions"]["removeSelfHostedRunner"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Replaces all repositories for an organization secret when the `visibility` for repository access is set to `selected`. The visibility is set when you [Create or update an organization secret](https://developer.github.com/v3/actions/secrets/#create-or-update-an-organization-secret). You must authenticate using an access token with the `admin:org` scope to use this endpoint. GitHub Apps must have the `secrets` organization permission to use this endpoint.
         */
        setSelectedReposForOrgSecret: {
            (params?: RestEndpointMethodTypes["actions"]["setSelectedReposForOrgSecret"]["parameters"]): Promise<RestEndpointMethodTypes["actions"]["setSelectedReposForOrgSecret"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
    };
    activity: {
        checkRepoIsStarredByAuthenticatedUser: {
            (params?: RestEndpointMethodTypes["activity"]["checkRepoIsStarredByAuthenticatedUser"]["parameters"]): Promise<RestEndpointMethodTypes["activity"]["checkRepoIsStarredByAuthenticatedUser"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * @deprecated octokit.activity.checkStarringRepo() has been renamed to octokit.activity.checkRepoIsStarredByAuthenticatedUser() (2020-03-25)
         */
        checkStarringRepo: {
            (params?: RestEndpointMethodTypes["activity"]["checkStarringRepo"]["parameters"]): Promise<RestEndpointMethodTypes["activity"]["checkStarringRepo"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * This endpoint should only be used to stop watching a repository. To control whether or not you wish to receive notifications from a repository, [set the repository's subscription manually](https://developer.github.com/v3/activity/watching/#set-a-repository-subscription).
         */
        deleteRepoSubscription: {
            (params?: RestEndpointMethodTypes["activity"]["deleteRepoSubscription"]["parameters"]): Promise<RestEndpointMethodTypes["activity"]["deleteRepoSubscription"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Mutes all future notifications for a conversation until you comment on the thread or get an **@mention**. If you are watching the repository of the thread, you will still receive notifications. To ignore future notifications for a repository you are watching, use the [Set a thread subscription](https://developer.github.com/v3/activity/notifications/#set-a-thread-subscription) endpoint and set `ignore` to `true`.
         */
        deleteThreadSubscription: {
            (params?: RestEndpointMethodTypes["activity"]["deleteThreadSubscription"]["parameters"]): Promise<RestEndpointMethodTypes["activity"]["deleteThreadSubscription"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * GitHub provides several timeline resources in [Atom](http://en.wikipedia.org/wiki/Atom_(standard)) format. The Feeds API lists all the feeds available to the authenticated user:
         *
         * *   **Timeline**: The GitHub global public timeline
         * *   **User**: The public timeline for any user, using [URI template](https://developer.github.com/v3/#hypermedia)
         * *   **Current user public**: The public timeline for the authenticated user
         * *   **Current user**: The private timeline for the authenticated user
         * *   **Current user actor**: The private timeline for activity created by the authenticated user
         * *   **Current user organizations**: The private timeline for the organizations the authenticated user is a member of.
         * *   **Security advisories**: A collection of public announcements that provide information about security-related vulnerabilities in software on GitHub.
         *
         * **Note**: Private feeds are only returned when [authenticating via Basic Auth](https://developer.github.com/v3/#basic-authentication) since current feed URIs use the older, non revocable auth tokens.
         */
        getFeeds: {
            (params?: RestEndpointMethodTypes["activity"]["getFeeds"]["parameters"]): Promise<RestEndpointMethodTypes["activity"]["getFeeds"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        getRepoSubscription: {
            (params?: RestEndpointMethodTypes["activity"]["getRepoSubscription"]["parameters"]): Promise<RestEndpointMethodTypes["activity"]["getRepoSubscription"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        getThread: {
            (params?: RestEndpointMethodTypes["activity"]["getThread"]["parameters"]): Promise<RestEndpointMethodTypes["activity"]["getThread"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Marks all notifications as "read" removes it from the [default view on GitHub](https://github.com/notifications). If the number of notifications is too large to complete in one request, you will receive a `202 Accepted` status and GitHub will run an asynchronous process to mark notifications as "read." To check whether any "unread" notifications remain, you can use the [List notifications for the authenticated user](https://developer.github.com/v3/activity/notifications/#list-notifications-for-the-authenticated-user) endpoint and pass the query parameter `all=false`.
         * @deprecated octokit.activity.getThreadSubscription() has been renamed to octokit.activity.getThreadSubscriptionForAuthenticatedUser() (2020-03-25)
         */
        getThreadSubscription: {
            (params?: RestEndpointMethodTypes["activity"]["getThreadSubscription"]["parameters"]): Promise<RestEndpointMethodTypes["activity"]["getThreadSubscription"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * This checks to see if the current user is subscribed to a thread. You can also [get a repository subscription](https://developer.github.com/v3/activity/watching/#get-a-repository-subscription).
         *
         * Note that subscriptions are only generated if a user is participating in a conversation--for example, they've replied to the thread, were **@mentioned**, or manually subscribe to a thread.
         */
        getThreadSubscriptionForAuthenticatedUser: {
            (params?: RestEndpointMethodTypes["activity"]["getThreadSubscriptionForAuthenticatedUser"]["parameters"]): Promise<RestEndpointMethodTypes["activity"]["getThreadSubscriptionForAuthenticatedUser"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * If you are authenticated as the given user, you will see your private events. Otherwise, you'll only see public events.
         */
        listEventsForAuthenticatedUser: {
            (params?: RestEndpointMethodTypes["activity"]["listEventsForAuthenticatedUser"]["parameters"]): Promise<RestEndpointMethodTypes["activity"]["listEventsForAuthenticatedUser"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * This is the user's organization dashboard. You must be authenticated as the user to view this.
         * @deprecated octokit.activity.listEventsForOrg() has been renamed to octokit.activity.listOrgEventsForAuthenticatedUser() (2020-03-25)
         */
        listEventsForOrg: {
            (params?: RestEndpointMethodTypes["activity"]["listEventsForOrg"]["parameters"]): Promise<RestEndpointMethodTypes["activity"]["listEventsForOrg"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * If you are authenticated as the given user, you will see your private events. Otherwise, you'll only see public events.
         * @deprecated octokit.activity.listEventsForUser() has been renamed to octokit.activity.listEventsForAuthenticatedUser() (2020-03-25)
         */
        listEventsForUser: {
            (params?: RestEndpointMethodTypes["activity"]["listEventsForUser"]["parameters"]): Promise<RestEndpointMethodTypes["activity"]["listEventsForUser"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * GitHub provides several timeline resources in [Atom](http://en.wikipedia.org/wiki/Atom_(standard)) format. The Feeds API lists all the feeds available to the authenticated user:
         *
         * *   **Timeline**: The GitHub global public timeline
         * *   **User**: The public timeline for any user, using [URI template](https://developer.github.com/v3/#hypermedia)
         * *   **Current user public**: The public timeline for the authenticated user
         * *   **Current user**: The private timeline for the authenticated user
         * *   **Current user actor**: The private timeline for activity created by the authenticated user
         * *   **Current user organizations**: The private timeline for the organizations the authenticated user is a member of.
         * *   **Security advisories**: A collection of public announcements that provide information about security-related vulnerabilities in software on GitHub.
         *
         * **Note**: Private feeds are only returned when [authenticating via Basic Auth](https://developer.github.com/v3/#basic-authentication) since current feed URIs use the older, non revocable auth tokens.
         * @deprecated octokit.activity.listFeeds() has been renamed to octokit.activity.getFeeds() (2020-03-25)
         */
        listFeeds: {
            (params?: RestEndpointMethodTypes["activity"]["listFeeds"]["parameters"]): Promise<RestEndpointMethodTypes["activity"]["listFeeds"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * List all notifications for the current user, sorted by most recently updated.
         *
         * The following example uses the `since` parameter to list notifications that have been updated after the specified time.
         * @deprecated octokit.activity.listNotifications() has been renamed to octokit.activity.listNotificationsForAuthenticatedUser() (2020-03-25)
         */
        listNotifications: {
            (params?: RestEndpointMethodTypes["activity"]["listNotifications"]["parameters"]): Promise<RestEndpointMethodTypes["activity"]["listNotifications"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * List all notifications for the current user, sorted by most recently updated.
         *
         * The following example uses the `since` parameter to list notifications that have been updated after the specified time.
         */
        listNotificationsForAuthenticatedUser: {
            (params?: RestEndpointMethodTypes["activity"]["listNotificationsForAuthenticatedUser"]["parameters"]): Promise<RestEndpointMethodTypes["activity"]["listNotificationsForAuthenticatedUser"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * List all notifications for the current user.
         * @deprecated octokit.activity.listNotificationsForRepo() has been renamed to octokit.activity.listRepoNotificationsForAuthenticatedUser() (2020-03-25)
         */
        listNotificationsForRepo: {
            (params?: RestEndpointMethodTypes["activity"]["listNotificationsForRepo"]["parameters"]): Promise<RestEndpointMethodTypes["activity"]["listNotificationsForRepo"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * This is the user's organization dashboard. You must be authenticated as the user to view this.
         */
        listOrgEventsForAuthenticatedUser: {
            (params?: RestEndpointMethodTypes["activity"]["listOrgEventsForAuthenticatedUser"]["parameters"]): Promise<RestEndpointMethodTypes["activity"]["listOrgEventsForAuthenticatedUser"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * We delay the public events feed by five minutes, which means the most recent event returned by the public events API actually occurred at least five minutes ago.
         */
        listPublicEvents: {
            (params?: RestEndpointMethodTypes["activity"]["listPublicEvents"]["parameters"]): Promise<RestEndpointMethodTypes["activity"]["listPublicEvents"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * @deprecated octokit.activity.listPublicEventsForOrg() has been renamed to octokit.activity.listPublicOrgEvents() (2020-03-25)
         */
        listPublicEventsForOrg: {
            (params?: RestEndpointMethodTypes["activity"]["listPublicEventsForOrg"]["parameters"]): Promise<RestEndpointMethodTypes["activity"]["listPublicEventsForOrg"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        listPublicEventsForRepoNetwork: {
            (params?: RestEndpointMethodTypes["activity"]["listPublicEventsForRepoNetwork"]["parameters"]): Promise<RestEndpointMethodTypes["activity"]["listPublicEventsForRepoNetwork"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        listPublicEventsForUser: {
            (params?: RestEndpointMethodTypes["activity"]["listPublicEventsForUser"]["parameters"]): Promise<RestEndpointMethodTypes["activity"]["listPublicEventsForUser"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        listPublicOrgEvents: {
            (params?: RestEndpointMethodTypes["activity"]["listPublicOrgEvents"]["parameters"]): Promise<RestEndpointMethodTypes["activity"]["listPublicOrgEvents"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * These are events that you've received by watching repos and following users. If you are authenticated as the given user, you will see private events. Otherwise, you'll only see public events.
         */
        listReceivedEventsForUser: {
            (params?: RestEndpointMethodTypes["activity"]["listReceivedEventsForUser"]["parameters"]): Promise<RestEndpointMethodTypes["activity"]["listReceivedEventsForUser"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        listReceivedPublicEventsForUser: {
            (params?: RestEndpointMethodTypes["activity"]["listReceivedPublicEventsForUser"]["parameters"]): Promise<RestEndpointMethodTypes["activity"]["listReceivedPublicEventsForUser"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        listRepoEvents: {
            (params?: RestEndpointMethodTypes["activity"]["listRepoEvents"]["parameters"]): Promise<RestEndpointMethodTypes["activity"]["listRepoEvents"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * List all notifications for the current user.
         */
        listRepoNotificationsForAuthenticatedUser: {
            (params?: RestEndpointMethodTypes["activity"]["listRepoNotificationsForAuthenticatedUser"]["parameters"]): Promise<RestEndpointMethodTypes["activity"]["listRepoNotificationsForAuthenticatedUser"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Lists repositories the authenticated user has starred.
         *
         * You can also find out _when_ stars were created by passing the following custom [media type](https://developer.github.com/v3/media/) via the `Accept` header:
         */
        listReposStarredByAuthenticatedUser: {
            (params?: RestEndpointMethodTypes["activity"]["listReposStarredByAuthenticatedUser"]["parameters"]): Promise<RestEndpointMethodTypes["activity"]["listReposStarredByAuthenticatedUser"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Lists repositories a user has starred.
         *
         * You can also find out _when_ stars were created by passing the following custom [media type](https://developer.github.com/v3/media/) via the `Accept` header:
         */
        listReposStarredByUser: {
            (params?: RestEndpointMethodTypes["activity"]["listReposStarredByUser"]["parameters"]): Promise<RestEndpointMethodTypes["activity"]["listReposStarredByUser"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Lists repositories a user is watching.
         */
        listReposWatchedByUser: {
            (params?: RestEndpointMethodTypes["activity"]["listReposWatchedByUser"]["parameters"]): Promise<RestEndpointMethodTypes["activity"]["listReposWatchedByUser"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Lists the people that have starred the repository.
         *
         * You can also find out _when_ stars were created by passing the following custom [media type](https://developer.github.com/v3/media/) via the `Accept` header:
         */
        listStargazersForRepo: {
            (params?: RestEndpointMethodTypes["activity"]["listStargazersForRepo"]["parameters"]): Promise<RestEndpointMethodTypes["activity"]["listStargazersForRepo"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Lists repositories the authenticated user is watching.
         */
        listWatchedReposForAuthenticatedUser: {
            (params?: RestEndpointMethodTypes["activity"]["listWatchedReposForAuthenticatedUser"]["parameters"]): Promise<RestEndpointMethodTypes["activity"]["listWatchedReposForAuthenticatedUser"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Lists the people watching the specified repository.
         */
        listWatchersForRepo: {
            (params?: RestEndpointMethodTypes["activity"]["listWatchersForRepo"]["parameters"]): Promise<RestEndpointMethodTypes["activity"]["listWatchersForRepo"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Marks all notifications as "read" removes it from the [default view on GitHub](https://github.com/notifications). If the number of notifications is too large to complete in one request, you will receive a `202 Accepted` status and GitHub will run an asynchronous process to mark notifications as "read." To check whether any "unread" notifications remain, you can use the [List notifications for the authenticated user](https://developer.github.com/v3/activity/notifications/#list-notifications-for-the-authenticated-user) endpoint and pass the query parameter `all=false`.
         * @deprecated octokit.activity.markAsRead() has been renamed to octokit.activity.markNotificationsAsRead() (2020-03-25)
         */
        markAsRead: {
            (params?: RestEndpointMethodTypes["activity"]["markAsRead"]["parameters"]): Promise<RestEndpointMethodTypes["activity"]["markAsRead"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Marks all notifications as "read" removes it from the [default view on GitHub](https://github.com/notifications). If the number of notifications is too large to complete in one request, you will receive a `202 Accepted` status and GitHub will run an asynchronous process to mark notifications as "read." To check whether any "unread" notifications remain, you can use the [List notifications for the authenticated user](https://developer.github.com/v3/activity/notifications/#list-notifications-for-the-authenticated-user) endpoint and pass the query parameter `all=false`.
         */
        markNotificationsAsRead: {
            (params?: RestEndpointMethodTypes["activity"]["markNotificationsAsRead"]["parameters"]): Promise<RestEndpointMethodTypes["activity"]["markNotificationsAsRead"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Marks all notifications in a repository as "read" removes them from the [default view on GitHub](https://github.com/notifications). If the number of notifications is too large to complete in one request, you will receive a `202 Accepted` status and GitHub will run an asynchronous process to mark notifications as "read." To check whether any "unread" notifications remain, you can use the [List repository notifications for the authenticated user](https://developer.github.com/v3/activity/notifications/#list-repository-notifications-for-the-authenticated-user) endpoint and pass the query parameter `all=false`.
         * @deprecated octokit.activity.markNotificationsAsReadForRepo() has been renamed to octokit.activity.markRepoNotificationsAsRead() (2020-03-25)
         */
        markNotificationsAsReadForRepo: {
            (params?: RestEndpointMethodTypes["activity"]["markNotificationsAsReadForRepo"]["parameters"]): Promise<RestEndpointMethodTypes["activity"]["markNotificationsAsReadForRepo"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Marks all notifications in a repository as "read" removes them from the [default view on GitHub](https://github.com/notifications). If the number of notifications is too large to complete in one request, you will receive a `202 Accepted` status and GitHub will run an asynchronous process to mark notifications as "read." To check whether any "unread" notifications remain, you can use the [List repository notifications for the authenticated user](https://developer.github.com/v3/activity/notifications/#list-repository-notifications-for-the-authenticated-user) endpoint and pass the query parameter `all=false`.
         */
        markRepoNotificationsAsRead: {
            (params?: RestEndpointMethodTypes["activity"]["markRepoNotificationsAsRead"]["parameters"]): Promise<RestEndpointMethodTypes["activity"]["markRepoNotificationsAsRead"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        markThreadAsRead: {
            (params?: RestEndpointMethodTypes["activity"]["markThreadAsRead"]["parameters"]): Promise<RestEndpointMethodTypes["activity"]["markThreadAsRead"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * If you would like to watch a repository, set `subscribed` to `true`. If you would like to ignore notifications made within a repository, set `ignored` to `true`. If you would like to stop watching a repository, [delete the repository's subscription](https://developer.github.com/v3/activity/watching/#delete-a-repository-subscription) completely.
         */
        setRepoSubscription: {
            (params?: RestEndpointMethodTypes["activity"]["setRepoSubscription"]["parameters"]): Promise<RestEndpointMethodTypes["activity"]["setRepoSubscription"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * If you are watching a repository, you receive notifications for all threads by default. Use this endpoint to ignore future notifications for threads until you comment on the thread or get an **@mention**.
         *
         * You can also use this endpoint to subscribe to threads that you are currently not receiving notifications for or to subscribed to threads that you have previously ignored.
         *
         * Unsubscribing from a conversation in a repository that you are not watching is functionally equivalent to the [Delete a thread subscription](https://developer.github.com/v3/activity/notifications/#delete-a-thread-subscription) endpoint.
         */
        setThreadSubscription: {
            (params?: RestEndpointMethodTypes["activity"]["setThreadSubscription"]["parameters"]): Promise<RestEndpointMethodTypes["activity"]["setThreadSubscription"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Note that you'll need to set `Content-Length` to zero when calling out to this endpoint. For more information, see "[HTTP verbs](https://developer.github.com/v3/#http-verbs)."
         * @deprecated octokit.activity.starRepo() has been renamed to octokit.activity.starRepoForAuthenticatedUser() (2020-03-25)
         */
        starRepo: {
            (params?: RestEndpointMethodTypes["activity"]["starRepo"]["parameters"]): Promise<RestEndpointMethodTypes["activity"]["starRepo"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Note that you'll need to set `Content-Length` to zero when calling out to this endpoint. For more information, see "[HTTP verbs](https://developer.github.com/v3/#http-verbs)."
         */
        starRepoForAuthenticatedUser: {
            (params?: RestEndpointMethodTypes["activity"]["starRepoForAuthenticatedUser"]["parameters"]): Promise<RestEndpointMethodTypes["activity"]["starRepoForAuthenticatedUser"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * @deprecated octokit.activity.unstarRepo() has been renamed to octokit.activity.unstarRepoForAuthenticatedUser() (2020-03-25)
         */
        unstarRepo: {
            (params?: RestEndpointMethodTypes["activity"]["unstarRepo"]["parameters"]): Promise<RestEndpointMethodTypes["activity"]["unstarRepo"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        unstarRepoForAuthenticatedUser: {
            (params?: RestEndpointMethodTypes["activity"]["unstarRepoForAuthenticatedUser"]["parameters"]): Promise<RestEndpointMethodTypes["activity"]["unstarRepoForAuthenticatedUser"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
    };
    apps: {
        /**
         * Add a single repository to an installation. The authenticated user must have admin access to the repository.
         *
         * You must use a personal access token (which you can create via the [command line](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/) or the [OAuth Authorizations API](https://developer.github.com/v3/oauth_authorizations/#create-a-new-authorization)) or [Basic Authentication](https://developer.github.com/v3/auth/#basic-authentication) to access this endpoint.
         */
        addRepoToInstallation: {
            (params?: RestEndpointMethodTypes["apps"]["addRepoToInstallation"]["parameters"]): Promise<RestEndpointMethodTypes["apps"]["addRepoToInstallation"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Shows whether the user or organization account actively subscribes to a plan listed by the authenticated GitHub App. When someone submits a plan change that won't be processed until the end of their billing cycle, you will also see the upcoming pending change.
         *
         * GitHub Apps must use a [JWT](https://developer.github.com/apps/building-github-apps/authenticating-with-github-apps/#authenticating-as-a-github-app) to access this endpoint. OAuth Apps must use [basic authentication](https://developer.github.com/v3/auth/#basic-authentication) with their client ID and client secret to access this endpoint.
         * @deprecated octokit.apps.checkAccountIsAssociatedWithAny() has been renamed to octokit.apps.getSubscriptionPlanForAccount() (2020-03-08)
         */
        checkAccountIsAssociatedWithAny: {
            (params?: RestEndpointMethodTypes["apps"]["checkAccountIsAssociatedWithAny"]["parameters"]): Promise<RestEndpointMethodTypes["apps"]["checkAccountIsAssociatedWithAny"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Shows whether the user or organization account actively subscribes to a plan listed by the authenticated GitHub App. When someone submits a plan change that won't be processed until the end of their billing cycle, you will also see the upcoming pending change.
         *
         * GitHub Apps must use a [JWT](https://developer.github.com/apps/building-github-apps/authenticating-with-github-apps/#authenticating-as-a-github-app) to access this endpoint. OAuth Apps must use [basic authentication](https://developer.github.com/v3/auth/#basic-authentication) with their client ID and client secret to access this endpoint.
         * @deprecated octokit.apps.checkAccountIsAssociatedWithAnyStubbed() has been renamed to octokit.apps.getSubscriptionPlanForAccountStubbed() (2020-03-08)
         */
        checkAccountIsAssociatedWithAnyStubbed: {
            (params?: RestEndpointMethodTypes["apps"]["checkAccountIsAssociatedWithAnyStubbed"]["parameters"]): Promise<RestEndpointMethodTypes["apps"]["checkAccountIsAssociatedWithAnyStubbed"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * OAuth applications can use a special API method for checking OAuth token validity without exceeding the normal rate limits for failed login attempts. Authentication works differently with this particular endpoint. You must use [Basic Authentication](https://developer.github.com/v3/auth#basic-authentication) to use this endpoint, where the username is the OAuth application `client_id` and the password is its `client_secret`. Invalid tokens will return `404 NOT FOUND`.
         */
        checkToken: {
            (params?: RestEndpointMethodTypes["apps"]["checkToken"]["parameters"]): Promise<RestEndpointMethodTypes["apps"]["checkToken"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Creates an attachment under a content reference URL in the body or comment of an issue or pull request. Use the `id` of the content reference from the [`content_reference` event](https://developer.github.com/webhooks/event-payloads/#content_reference) to create an attachment.
         *
         * The app must create a content attachment within six hours of the content reference URL being posted. See "[Using content attachments](https://developer.github.com/apps/using-content-attachments/)" for details about content attachments.
         *
         * You must use an [installation access token](https://developer.github.com/apps/building-github-apps/authenticating-with-github-apps/#authenticating-as-an-installation) to access this endpoint.
         *
         * This example creates a content attachment for the domain `https://errors.ai/`.
         */
        createContentAttachment: {
            (params?: RestEndpointMethodTypes["apps"]["createContentAttachment"]["parameters"]): Promise<RestEndpointMethodTypes["apps"]["createContentAttachment"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Use this endpoint to complete the handshake necessary when implementing the [GitHub App Manifest flow](https://developer.github.com/apps/building-github-apps/creating-github-apps-from-a-manifest/). When you create a GitHub App with the manifest flow, you receive a temporary `code` used to retrieve the GitHub App's `id`, `pem` (private key), and `webhook_secret`.
         */
        createFromManifest: {
            (params?: RestEndpointMethodTypes["apps"]["createFromManifest"]["parameters"]): Promise<RestEndpointMethodTypes["apps"]["createFromManifest"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Creates an installation access token that enables a GitHub App to make authenticated API requests for the app's installation on an organization or individual account. Installation tokens expire one hour from the time you create them. Using an expired token produces a status code of `401 - Unauthorized`, and requires creating a new installation token. By default the installation token has access to all repositories that the installation can access. To restrict the access to specific repositories, you can provide the `repository_ids` when creating the token. When you omit `repository_ids`, the response does not contain the `repositories` key.
         *
         * You must use a [JWT](https://developer.github.com/apps/building-github-apps/authenticating-with-github-apps/#authenticating-as-a-github-app) to access this endpoint.
         *
         * This example grants the token "Read and write" permission to `issues` and "Read" permission to `contents`, and restricts the token's access to the repository with an `id` of 1296269.
         */
        createInstallationAccessToken: {
            (params?: RestEndpointMethodTypes["apps"]["createInstallationAccessToken"]["parameters"]): Promise<RestEndpointMethodTypes["apps"]["createInstallationAccessToken"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Creates an installation access token that enables a GitHub App to make authenticated API requests for the app's installation on an organization or individual account. Installation tokens expire one hour from the time you create them. Using an expired token produces a status code of `401 - Unauthorized`, and requires creating a new installation token. By default the installation token has access to all repositories that the installation can access. To restrict the access to specific repositories, you can provide the `repository_ids` when creating the token. When you omit `repository_ids`, the response does not contain the `repositories` key.
         *
         * You must use a [JWT](https://developer.github.com/apps/building-github-apps/authenticating-with-github-apps/#authenticating-as-a-github-app) to access this endpoint.
         *
         * This example grants the token "Read and write" permission to `issues` and "Read" permission to `contents`, and restricts the token's access to the repository with an `id` of 1296269.
         * @deprecated octokit.apps.createInstallationToken() has been renamed to octokit.apps.createInstallationAccessToken() (2020-06-04)
         */
        createInstallationToken: {
            (params?: RestEndpointMethodTypes["apps"]["createInstallationToken"]["parameters"]): Promise<RestEndpointMethodTypes["apps"]["createInstallationToken"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * OAuth application owners can revoke a grant for their OAuth application and a specific user. You must use [Basic Authentication](https://developer.github.com/v3/auth#basic-authentication) when accessing this endpoint, using the OAuth application's `client_id` and `client_secret` as the username and password. You must also provide a valid OAuth `access_token` as an input parameter and the grant for the token's owner will be deleted.
         *
         * Deleting an OAuth application's grant will also delete all OAuth tokens associated with the application for the user. Once deleted, the application will have no access to the user's account and will no longer be listed on [the application authorizations settings screen within GitHub](https://github.com/settings/applications#authorized).
         */
        deleteAuthorization: {
            (params?: RestEndpointMethodTypes["apps"]["deleteAuthorization"]["parameters"]): Promise<RestEndpointMethodTypes["apps"]["deleteAuthorization"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Uninstalls a GitHub App on a user, organization, or business account. If you prefer to temporarily suspend an app's access to your account's resources, then we recommend the "[Suspend an app installation](https://developer.github.com/v3/apps/#suspend-an-app-installation)" endpoint.
         *
         * You must use a [JWT](https://developer.github.com/apps/building-github-apps/authenticating-with-github-apps/#authenticating-as-a-github-app) to access this endpoint.
         */
        deleteInstallation: {
            (params?: RestEndpointMethodTypes["apps"]["deleteInstallation"]["parameters"]): Promise<RestEndpointMethodTypes["apps"]["deleteInstallation"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * OAuth application owners can revoke a single token for an OAuth application. You must use [Basic Authentication](https://developer.github.com/v3/auth#basic-authentication) when accessing this endpoint, using the OAuth application's `client_id` and `client_secret` as the username and password.
         */
        deleteToken: {
            (params?: RestEndpointMethodTypes["apps"]["deleteToken"]["parameters"]): Promise<RestEndpointMethodTypes["apps"]["deleteToken"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Returns the GitHub App associated with the authentication credentials used. To see how many app installations are associated with this GitHub App, see the `installations_count` in the response. For more details about your app's installations, see the "[List installations for the authenticated app](https://developer.github.com/v3/apps/#list-installations-for-the-authenticated-app)" endpoint.
         *
         * You must use a [JWT](https://developer.github.com/apps/building-github-apps/authenticating-with-github-apps/#authenticating-as-a-github-app) to access this endpoint.
         */
        getAuthenticated: {
            (params?: RestEndpointMethodTypes["apps"]["getAuthenticated"]["parameters"]): Promise<RestEndpointMethodTypes["apps"]["getAuthenticated"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * **Note**: The `:app_slug` is just the URL-friendly name of your GitHub App. You can find this on the settings page for your GitHub App (e.g., `https://github.com/settings/apps/:app_slug`).
         *
         * If the GitHub App you specify is public, you can access this endpoint without authenticating. If the GitHub App you specify is private, you must authenticate with a [personal access token](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/) or an [installation access token](https://developer.github.com/apps/building-github-apps/authenticating-with-github-apps/#authenticating-as-an-installation) to access this endpoint.
         */
        getBySlug: {
            (params?: RestEndpointMethodTypes["apps"]["getBySlug"]["parameters"]): Promise<RestEndpointMethodTypes["apps"]["getBySlug"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Enables an authenticated GitHub App to find an installation's information using the installation id. The installation's account type (`target_type`) will be either an organization or a user account, depending which account the repository belongs to.
         *
         * You must use a [JWT](https://developer.github.com/apps/building-github-apps/authenticating-with-github-apps/#authenticating-as-a-github-app) to access this endpoint.
         */
        getInstallation: {
            (params?: RestEndpointMethodTypes["apps"]["getInstallation"]["parameters"]): Promise<RestEndpointMethodTypes["apps"]["getInstallation"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Enables an authenticated GitHub App to find the organization's installation information.
         *
         * You must use a [JWT](https://developer.github.com/apps/building-github-apps/authenticating-with-github-apps/#authenticating-as-a-github-app) to access this endpoint.
         */
        getOrgInstallation: {
            (params?: RestEndpointMethodTypes["apps"]["getOrgInstallation"]["parameters"]): Promise<RestEndpointMethodTypes["apps"]["getOrgInstallation"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Enables an authenticated GitHub App to find the repository's installation information. The installation's account type will be either an organization or a user account, depending which account the repository belongs to.
         *
         * You must use a [JWT](https://developer.github.com/apps/building-github-apps/authenticating-with-github-apps/#authenticating-as-a-github-app) to access this endpoint.
         */
        getRepoInstallation: {
            (params?: RestEndpointMethodTypes["apps"]["getRepoInstallation"]["parameters"]): Promise<RestEndpointMethodTypes["apps"]["getRepoInstallation"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Shows whether the user or organization account actively subscribes to a plan listed by the authenticated GitHub App. When someone submits a plan change that won't be processed until the end of their billing cycle, you will also see the upcoming pending change.
         *
         * GitHub Apps must use a [JWT](https://developer.github.com/apps/building-github-apps/authenticating-with-github-apps/#authenticating-as-a-github-app) to access this endpoint. OAuth Apps must use [basic authentication](https://developer.github.com/v3/auth/#basic-authentication) with their client ID and client secret to access this endpoint.
         */
        getSubscriptionPlanForAccount: {
            (params?: RestEndpointMethodTypes["apps"]["getSubscriptionPlanForAccount"]["parameters"]): Promise<RestEndpointMethodTypes["apps"]["getSubscriptionPlanForAccount"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Shows whether the user or organization account actively subscribes to a plan listed by the authenticated GitHub App. When someone submits a plan change that won't be processed until the end of their billing cycle, you will also see the upcoming pending change.
         *
         * GitHub Apps must use a [JWT](https://developer.github.com/apps/building-github-apps/authenticating-with-github-apps/#authenticating-as-a-github-app) to access this endpoint. OAuth Apps must use [basic authentication](https://developer.github.com/v3/auth/#basic-authentication) with their client ID and client secret to access this endpoint.
         */
        getSubscriptionPlanForAccountStubbed: {
            (params?: RestEndpointMethodTypes["apps"]["getSubscriptionPlanForAccountStubbed"]["parameters"]): Promise<RestEndpointMethodTypes["apps"]["getSubscriptionPlanForAccountStubbed"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Enables an authenticated GitHub App to find the user’s installation information.
         *
         * You must use a [JWT](https://developer.github.com/apps/building-github-apps/authenticating-with-github-apps/#authenticating-as-a-github-app) to access this endpoint.
         */
        getUserInstallation: {
            (params?: RestEndpointMethodTypes["apps"]["getUserInstallation"]["parameters"]): Promise<RestEndpointMethodTypes["apps"]["getUserInstallation"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Returns user and organization accounts associated with the specified plan, including free plans. For per-seat pricing, you see the list of accounts that have purchased the plan, including the number of seats purchased. When someone submits a plan change that won't be processed until the end of their billing cycle, you will also see the upcoming pending change.
         *
         * GitHub Apps must use a [JWT](https://developer.github.com/apps/building-github-apps/authenticating-with-github-apps/#authenticating-as-a-github-app) to access this endpoint. OAuth Apps must use [basic authentication](https://developer.github.com/v3/auth/#basic-authentication) with their client ID and client secret to access this endpoint.
         */
        listAccountsForPlan: {
            (params?: RestEndpointMethodTypes["apps"]["listAccountsForPlan"]["parameters"]): Promise<RestEndpointMethodTypes["apps"]["listAccountsForPlan"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Returns repository and organization accounts associated with the specified plan, including free plans. For per-seat pricing, you see the list of accounts that have purchased the plan, including the number of seats purchased. When someone submits a plan change that won't be processed until the end of their billing cycle, you will also see the upcoming pending change.
         *
         * GitHub Apps must use a [JWT](https://developer.github.com/apps/building-github-apps/authenticating-with-github-apps/#authenticating-as-a-github-app) to access this endpoint. OAuth Apps must use [basic authentication](https://developer.github.com/v3/auth/#basic-authentication) with their client ID and client secret to access this endpoint.
         */
        listAccountsForPlanStubbed: {
            (params?: RestEndpointMethodTypes["apps"]["listAccountsForPlanStubbed"]["parameters"]): Promise<RestEndpointMethodTypes["apps"]["listAccountsForPlanStubbed"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Returns user and organization accounts associated with the specified plan, including free plans. For per-seat pricing, you see the list of accounts that have purchased the plan, including the number of seats purchased. When someone submits a plan change that won't be processed until the end of their billing cycle, you will also see the upcoming pending change.
         *
         * GitHub Apps must use a [JWT](https://developer.github.com/apps/building-github-apps/authenticating-with-github-apps/#authenticating-as-a-github-app) to access this endpoint. OAuth Apps must use [basic authentication](https://developer.github.com/v3/auth/#basic-authentication) with their client ID and client secret to access this endpoint.
         * @deprecated octokit.apps.listAccountsUserOrOrgOnPlan() has been renamed to octokit.apps.listAccountsForPlan() (2020-03-04)
         */
        listAccountsUserOrOrgOnPlan: {
            (params?: RestEndpointMethodTypes["apps"]["listAccountsUserOrOrgOnPlan"]["parameters"]): Promise<RestEndpointMethodTypes["apps"]["listAccountsUserOrOrgOnPlan"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Returns repository and organization accounts associated with the specified plan, including free plans. For per-seat pricing, you see the list of accounts that have purchased the plan, including the number of seats purchased. When someone submits a plan change that won't be processed until the end of their billing cycle, you will also see the upcoming pending change.
         *
         * GitHub Apps must use a [JWT](https://developer.github.com/apps/building-github-apps/authenticating-with-github-apps/#authenticating-as-a-github-app) to access this endpoint. OAuth Apps must use [basic authentication](https://developer.github.com/v3/auth/#basic-authentication) with their client ID and client secret to access this endpoint.
         * @deprecated octokit.apps.listAccountsUserOrOrgOnPlanStubbed() has been renamed to octokit.apps.listAccountsForPlanStubbed() (2020-03-04)
         */
        listAccountsUserOrOrgOnPlanStubbed: {
            (params?: RestEndpointMethodTypes["apps"]["listAccountsUserOrOrgOnPlanStubbed"]["parameters"]): Promise<RestEndpointMethodTypes["apps"]["listAccountsUserOrOrgOnPlanStubbed"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * List repositories that the authenticated user has explicit permission (`:read`, `:write`, or `:admin`) to access for an installation.
         *
         * The authenticated user has explicit permission to access repositories they own, repositories where they are a collaborator, and repositories that they can access through an organization membership.
         *
         * You must use a [user-to-server OAuth access token](https://developer.github.com/apps/building-github-apps/identifying-and-authorizing-users-for-github-apps/#identifying-users-on-your-site), created for a user who has authorized your GitHub App, to access this endpoint.
         *
         * The access the user has to each repository is included in the hash under the `permissions` key.
         */
        listInstallationReposForAuthenticatedUser: {
            (params?: RestEndpointMethodTypes["apps"]["listInstallationReposForAuthenticatedUser"]["parameters"]): Promise<RestEndpointMethodTypes["apps"]["listInstallationReposForAuthenticatedUser"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * You must use a [JWT](https://developer.github.com/apps/building-github-apps/authenticating-with-github-apps/#authenticating-as-a-github-app) to access this endpoint.
         *
         * The permissions the installation has are included under the `permissions` key.
         */
        listInstallations: {
            (params?: RestEndpointMethodTypes["apps"]["listInstallations"]["parameters"]): Promise<RestEndpointMethodTypes["apps"]["listInstallations"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Lists installations of your GitHub App that the authenticated user has explicit permission (`:read`, `:write`, or `:admin`) to access.
         *
         * You must use a [user-to-server OAuth access token](https://developer.github.com/apps/building-github-apps/identifying-and-authorizing-users-for-github-apps/#identifying-users-on-your-site), created for a user who has authorized your GitHub App, to access this endpoint.
         *
         * The authenticated user has explicit permission to access repositories they own, repositories where they are a collaborator, and repositories that they can access through an organization membership.
         *
         * You can find the permissions for the installation under the `permissions` key.
         */
        listInstallationsForAuthenticatedUser: {
            (params?: RestEndpointMethodTypes["apps"]["listInstallationsForAuthenticatedUser"]["parameters"]): Promise<RestEndpointMethodTypes["apps"]["listInstallationsForAuthenticatedUser"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Lists the active subscriptions for the authenticated user. You must use a [user-to-server OAuth access token](https://developer.github.com/apps/building-github-apps/identifying-and-authorizing-users-for-github-apps/#identifying-users-on-your-site), created for a user who has authorized your GitHub App, to access this endpoint. . OAuth Apps must authenticate using an [OAuth token](https://developer.github.com/apps/building-github-apps/authenticating-with-github-apps/).
         * @deprecated octokit.apps.listMarketplacePurchasesForAuthenticatedUser() has been renamed to octokit.apps.listSubscriptionsForAuthenticatedUser() (2020-03-08)
         */
        listMarketplacePurchasesForAuthenticatedUser: {
            (params?: RestEndpointMethodTypes["apps"]["listMarketplacePurchasesForAuthenticatedUser"]["parameters"]): Promise<RestEndpointMethodTypes["apps"]["listMarketplacePurchasesForAuthenticatedUser"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Lists the active subscriptions for the authenticated user. You must use a [user-to-server OAuth access token](https://developer.github.com/apps/building-github-apps/identifying-and-authorizing-users-for-github-apps/#identifying-users-on-your-site), created for a user who has authorized your GitHub App, to access this endpoint. . OAuth Apps must authenticate using an [OAuth token](https://developer.github.com/apps/building-github-apps/authenticating-with-github-apps/).
         * @deprecated octokit.apps.listMarketplacePurchasesForAuthenticatedUserStubbed() has been renamed to octokit.apps.listSubscriptionsForAuthenticatedUserStubbed() (2020-03-08)
         */
        listMarketplacePurchasesForAuthenticatedUserStubbed: {
            (params?: RestEndpointMethodTypes["apps"]["listMarketplacePurchasesForAuthenticatedUserStubbed"]["parameters"]): Promise<RestEndpointMethodTypes["apps"]["listMarketplacePurchasesForAuthenticatedUserStubbed"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Lists all plans that are part of your GitHub Marketplace listing.
         *
         * GitHub Apps must use a [JWT](https://developer.github.com/apps/building-github-apps/authenticating-with-github-apps/#authenticating-as-a-github-app) to access this endpoint. OAuth Apps must use [basic authentication](https://developer.github.com/v3/auth/#basic-authentication) with their client ID and client secret to access this endpoint.
         */
        listPlans: {
            (params?: RestEndpointMethodTypes["apps"]["listPlans"]["parameters"]): Promise<RestEndpointMethodTypes["apps"]["listPlans"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Lists all plans that are part of your GitHub Marketplace listing.
         *
         * GitHub Apps must use a [JWT](https://developer.github.com/apps/building-github-apps/authenticating-with-github-apps/#authenticating-as-a-github-app) to access this endpoint. OAuth Apps must use [basic authentication](https://developer.github.com/v3/auth/#basic-authentication) with their client ID and client secret to access this endpoint.
         */
        listPlansStubbed: {
            (params?: RestEndpointMethodTypes["apps"]["listPlansStubbed"]["parameters"]): Promise<RestEndpointMethodTypes["apps"]["listPlansStubbed"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * List repositories that an app installation can access.
         *
         * You must use an [installation access token](https://developer.github.com/apps/building-github-apps/authenticating-with-github-apps/#authenticating-as-an-installation) to access this endpoint.
         * @deprecated octokit.apps.listRepos() has been renamed to octokit.apps.listReposAccessibleToInstallation() (2020-06-04)
         */
        listRepos: {
            (params?: RestEndpointMethodTypes["apps"]["listRepos"]["parameters"]): Promise<RestEndpointMethodTypes["apps"]["listRepos"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * List repositories that an app installation can access.
         *
         * You must use an [installation access token](https://developer.github.com/apps/building-github-apps/authenticating-with-github-apps/#authenticating-as-an-installation) to access this endpoint.
         */
        listReposAccessibleToInstallation: {
            (params?: RestEndpointMethodTypes["apps"]["listReposAccessibleToInstallation"]["parameters"]): Promise<RestEndpointMethodTypes["apps"]["listReposAccessibleToInstallation"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Lists the active subscriptions for the authenticated user. You must use a [user-to-server OAuth access token](https://developer.github.com/apps/building-github-apps/identifying-and-authorizing-users-for-github-apps/#identifying-users-on-your-site), created for a user who has authorized your GitHub App, to access this endpoint. . OAuth Apps must authenticate using an [OAuth token](https://developer.github.com/apps/building-github-apps/authenticating-with-github-apps/).
         */
        listSubscriptionsForAuthenticatedUser: {
            (params?: RestEndpointMethodTypes["apps"]["listSubscriptionsForAuthenticatedUser"]["parameters"]): Promise<RestEndpointMethodTypes["apps"]["listSubscriptionsForAuthenticatedUser"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Lists the active subscriptions for the authenticated user. You must use a [user-to-server OAuth access token](https://developer.github.com/apps/building-github-apps/identifying-and-authorizing-users-for-github-apps/#identifying-users-on-your-site), created for a user who has authorized your GitHub App, to access this endpoint. . OAuth Apps must authenticate using an [OAuth token](https://developer.github.com/apps/building-github-apps/authenticating-with-github-apps/).
         */
        listSubscriptionsForAuthenticatedUserStubbed: {
            (params?: RestEndpointMethodTypes["apps"]["listSubscriptionsForAuthenticatedUserStubbed"]["parameters"]): Promise<RestEndpointMethodTypes["apps"]["listSubscriptionsForAuthenticatedUserStubbed"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Remove a single repository from an installation. The authenticated user must have admin access to the repository.
         *
         * You must use a personal access token (which you can create via the [command line](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/) or the [OAuth Authorizations API](https://developer.github.com/v3/oauth_authorizations/#create-a-new-authorization)) or [Basic Authentication](https://developer.github.com/v3/auth/#basic-authentication) to access this endpoint.
         */
        removeRepoFromInstallation: {
            (params?: RestEndpointMethodTypes["apps"]["removeRepoFromInstallation"]["parameters"]): Promise<RestEndpointMethodTypes["apps"]["removeRepoFromInstallation"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * OAuth applications can use this API method to reset a valid OAuth token without end-user involvement. Applications must save the "token" property in the response because changes take effect immediately. You must use [Basic Authentication](https://developer.github.com/v3/auth#basic-authentication) when accessing this endpoint, using the OAuth application's `client_id` and `client_secret` as the username and password. Invalid tokens will return `404 NOT FOUND`.
         */
        resetToken: {
            (params?: RestEndpointMethodTypes["apps"]["resetToken"]["parameters"]): Promise<RestEndpointMethodTypes["apps"]["resetToken"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Revokes the installation token you're using to authenticate as an installation and access this endpoint.
         *
         * Once an installation token is revoked, the token is invalidated and cannot be used. Other endpoints that require the revoked installation token must have a new installation token to work. You can create a new token using the "[Create an installation access token for an app](https://developer.github.com/v3/apps/#create-an-installation-access-token-for-an-app)" endpoint.
         *
         * You must use an [installation access token](https://developer.github.com/apps/building-github-apps/authenticating-with-github-apps/#authenticating-as-an-installation) to access this endpoint.
         */
        revokeInstallationAccessToken: {
            (params?: RestEndpointMethodTypes["apps"]["revokeInstallationAccessToken"]["parameters"]): Promise<RestEndpointMethodTypes["apps"]["revokeInstallationAccessToken"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Revokes the installation token you're using to authenticate as an installation and access this endpoint.
         *
         * Once an installation token is revoked, the token is invalidated and cannot be used. Other endpoints that require the revoked installation token must have a new installation token to work. You can create a new token using the "[Create an installation access token for an app](https://developer.github.com/v3/apps/#create-an-installation-access-token-for-an-app)" endpoint.
         *
         * You must use an [installation access token](https://developer.github.com/apps/building-github-apps/authenticating-with-github-apps/#authenticating-as-an-installation) to access this endpoint.
         * @deprecated octokit.apps.revokeInstallationToken() has been renamed to octokit.apps.revokeInstallationAccessToken() (2020-06-04)
         */
        revokeInstallationToken: {
            (params?: RestEndpointMethodTypes["apps"]["revokeInstallationToken"]["parameters"]): Promise<RestEndpointMethodTypes["apps"]["revokeInstallationToken"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * **Note:** Suspending a GitHub App installation is currently in beta and subject to change. Before you can suspend a GitHub App, the app owner must enable suspending installations for the app by opting-in to the beta. For more information, see "[Suspending a GitHub App installation](https://developer.github.com/apps/managing-github-apps/suspending-a-github-app-installation/)."
         *
         * Suspends a GitHub App on a user, organization, or business account, which blocks the app from accessing the account's resources. When a GitHub App is suspended, the app's access to the GitHub API or webhook events is blocked for that account.
         *
         * To suspend a GitHub App, you must be an account owner or have admin permissions in the repository or organization where the app is installed.
         *
         * You must use a [JWT](https://developer.github.com/apps/building-github-apps/authenticating-with-github-apps/#authenticating-as-a-github-app) to access this endpoint.
         */
        suspendInstallation: {
            (params?: RestEndpointMethodTypes["apps"]["suspendInstallation"]["parameters"]): Promise<RestEndpointMethodTypes["apps"]["suspendInstallation"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * **Note:** Suspending a GitHub App installation is currently in beta and subject to change. Before you can suspend a GitHub App, the app owner must enable suspending installations for the app by opting-in to the beta. For more information, see "[Suspending a GitHub App installation](https://developer.github.com/apps/managing-github-apps/suspending-a-github-app-installation/)."
         *
         * Removes a GitHub App installation suspension.
         *
         * To unsuspend a GitHub App, you must be an account owner or have admin permissions in the repository or organization where the app is installed and suspended.
         *
         * You must use a [JWT](https://developer.github.com/apps/building-github-apps/authenticating-with-github-apps/#authenticating-as-a-github-app) to access this endpoint.
         */
        unsuspendInstallation: {
            (params?: RestEndpointMethodTypes["apps"]["unsuspendInstallation"]["parameters"]): Promise<RestEndpointMethodTypes["apps"]["unsuspendInstallation"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
    };
    checks: {
        /**
         * **Note:** The Checks API only looks for pushes in the repository where the check suite or check run were created. Pushes to a branch in a forked repository are not detected and return an empty `pull_requests` array.
         *
         * Creates a new check run for a specific commit in a repository. Your GitHub App must have the `checks:write` permission to create check runs.
         */
        create: {
            (params?: RestEndpointMethodTypes["checks"]["create"]["parameters"]): Promise<RestEndpointMethodTypes["checks"]["create"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * **Note:** The Checks API only looks for pushes in the repository where the check suite or check run were created. Pushes to a branch in a forked repository are not detected and return an empty `pull_requests` array and a `null` value for `head_branch`.
         *
         * By default, check suites are automatically created when you create a [check run](https://developer.github.com/v3/checks/runs/). You only need to use this endpoint for manually creating check suites when you've disabled automatic creation using "[Update repository preferences for check suites](https://developer.github.com/v3/checks/suites/#update-repository-preferences-for-check-suites)". Your GitHub App must have the `checks:write` permission to create check suites.
         */
        createSuite: {
            (params?: RestEndpointMethodTypes["checks"]["createSuite"]["parameters"]): Promise<RestEndpointMethodTypes["checks"]["createSuite"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * **Note:** The Checks API only looks for pushes in the repository where the check suite or check run were created. Pushes to a branch in a forked repository are not detected and return an empty `pull_requests` array.
         *
         * Gets a single check run using its `id`. GitHub Apps must have the `checks:read` permission on a private repository or pull access to a public repository to get check runs. OAuth Apps and authenticated users must have the `repo` scope to get check runs in a private repository.
         */
        get: {
            (params?: RestEndpointMethodTypes["checks"]["get"]["parameters"]): Promise<RestEndpointMethodTypes["checks"]["get"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * **Note:** The Checks API only looks for pushes in the repository where the check suite or check run were created. Pushes to a branch in a forked repository are not detected and return an empty `pull_requests` array and a `null` value for `head_branch`.
         *
         * Gets a single check suite using its `id`. GitHub Apps must have the `checks:read` permission on a private repository or pull access to a public repository to get check suites. OAuth Apps and authenticated users must have the `repo` scope to get check suites in a private repository.
         */
        getSuite: {
            (params?: RestEndpointMethodTypes["checks"]["getSuite"]["parameters"]): Promise<RestEndpointMethodTypes["checks"]["getSuite"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Lists annotations for a check run using the annotation `id`. GitHub Apps must have the `checks:read` permission on a private repository or pull access to a public repository to get annotations for a check run. OAuth Apps and authenticated users must have the `repo` scope to get annotations for a check run in a private repository.
         */
        listAnnotations: {
            (params?: RestEndpointMethodTypes["checks"]["listAnnotations"]["parameters"]): Promise<RestEndpointMethodTypes["checks"]["listAnnotations"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * **Note:** The Checks API only looks for pushes in the repository where the check suite or check run were created. Pushes to a branch in a forked repository are not detected and return an empty `pull_requests` array.
         *
         * Lists check runs for a commit ref. The `ref` can be a SHA, branch name, or a tag name. GitHub Apps must have the `checks:read` permission on a private repository or pull access to a public repository to get check runs. OAuth Apps and authenticated users must have the `repo` scope to get check runs in a private repository.
         */
        listForRef: {
            (params?: RestEndpointMethodTypes["checks"]["listForRef"]["parameters"]): Promise<RestEndpointMethodTypes["checks"]["listForRef"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * **Note:** The Checks API only looks for pushes in the repository where the check suite or check run were created. Pushes to a branch in a forked repository are not detected and return an empty `pull_requests` array.
         *
         * Lists check runs for a check suite using its `id`. GitHub Apps must have the `checks:read` permission on a private repository or pull access to a public repository to get check runs. OAuth Apps and authenticated users must have the `repo` scope to get check runs in a private repository.
         */
        listForSuite: {
            (params?: RestEndpointMethodTypes["checks"]["listForSuite"]["parameters"]): Promise<RestEndpointMethodTypes["checks"]["listForSuite"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * **Note:** The Checks API only looks for pushes in the repository where the check suite or check run were created. Pushes to a branch in a forked repository are not detected and return an empty `pull_requests` array and a `null` value for `head_branch`.
         *
         * Lists check suites for a commit `ref`. The `ref` can be a SHA, branch name, or a tag name. GitHub Apps must have the `checks:read` permission on a private repository or pull access to a public repository to list check suites. OAuth Apps and authenticated users must have the `repo` scope to get check suites in a private repository.
         */
        listSuitesForRef: {
            (params?: RestEndpointMethodTypes["checks"]["listSuitesForRef"]["parameters"]): Promise<RestEndpointMethodTypes["checks"]["listSuitesForRef"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Triggers GitHub to rerequest an existing check suite, without pushing new code to a repository. This endpoint will trigger the [`check_suite` webhook](https://developer.github.com/webhooks/event-payloads/#check_suite) event with the action `rerequested`. When a check suite is `rerequested`, its `status` is reset to `queued` and the `conclusion` is cleared.
         *
         * To rerequest a check suite, your GitHub App must have the `checks:read` permission on a private repository or pull access to a public repository.
         */
        rerequestSuite: {
            (params?: RestEndpointMethodTypes["checks"]["rerequestSuite"]["parameters"]): Promise<RestEndpointMethodTypes["checks"]["rerequestSuite"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Changes the default automatic flow when creating check suites. By default, a check suite is automatically created each time code is pushed to a repository. When you disable the automatic creation of check suites, you can manually [Create a check suite](https://developer.github.com/v3/checks/suites/#create-a-check-suite). You must have admin permissions in the repository to set preferences for check suites.
         */
        setSuitesPreferences: {
            (params?: RestEndpointMethodTypes["checks"]["setSuitesPreferences"]["parameters"]): Promise<RestEndpointMethodTypes["checks"]["setSuitesPreferences"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * **Note:** The Checks API only looks for pushes in the repository where the check suite or check run were created. Pushes to a branch in a forked repository are not detected and return an empty `pull_requests` array.
         *
         * Updates a check run for a specific commit in a repository. Your GitHub App must have the `checks:write` permission to edit check runs.
         */
        update: {
            (params?: RestEndpointMethodTypes["checks"]["update"]["parameters"]): Promise<RestEndpointMethodTypes["checks"]["update"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
    };
    codeScanning: {
        /**
         * Gets a single code scanning alert. You must use an access token with the `security_events` scope to use this endpoint. GitHub Apps must have the `security_events` read permission to use this endpoint.
         *
         * The security `alert_id` is found at the end of the security alert's URL. For example, the security alert ID for `https://github.com/Octo-org/octo-repo/security/code-scanning/88` is `88`.
         */
        getAlert: {
            (params?: RestEndpointMethodTypes["codeScanning"]["getAlert"]["parameters"]): Promise<RestEndpointMethodTypes["codeScanning"]["getAlert"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Lists all open code scanning alerts for the default branch (usually `master`) and protected branches in a repository. You must use an access token with the `security_events` scope to use this endpoint. GitHub Apps must have the `security_events` read permission to use this endpoint.
         */
        listAlertsForRepo: {
            (params?: RestEndpointMethodTypes["codeScanning"]["listAlertsForRepo"]["parameters"]): Promise<RestEndpointMethodTypes["codeScanning"]["listAlertsForRepo"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
    };
    codesOfConduct: {
        getAllCodesOfConduct: {
            (params?: RestEndpointMethodTypes["codesOfConduct"]["getAllCodesOfConduct"]["parameters"]): Promise<RestEndpointMethodTypes["codesOfConduct"]["getAllCodesOfConduct"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        getConductCode: {
            (params?: RestEndpointMethodTypes["codesOfConduct"]["getConductCode"]["parameters"]): Promise<RestEndpointMethodTypes["codesOfConduct"]["getConductCode"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * This method returns the contents of the repository's code of conduct file, if one is detected.
         */
        getForRepo: {
            (params?: RestEndpointMethodTypes["codesOfConduct"]["getForRepo"]["parameters"]): Promise<RestEndpointMethodTypes["codesOfConduct"]["getForRepo"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * @deprecated octokit.codesOfConduct.listConductCodes() has been renamed to octokit.codesOfConduct.getAllCodesOfConduct() (2020-03-04)
         */
        listConductCodes: {
            (params?: RestEndpointMethodTypes["codesOfConduct"]["listConductCodes"]["parameters"]): Promise<RestEndpointMethodTypes["codesOfConduct"]["listConductCodes"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
    };
    emojis: {
        /**
         * Lists all the emojis available to use on GitHub.
         */
        get: {
            (params?: RestEndpointMethodTypes["emojis"]["get"]["parameters"]): Promise<RestEndpointMethodTypes["emojis"]["get"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
    };
    gists: {
        checkIsStarred: {
            (params?: RestEndpointMethodTypes["gists"]["checkIsStarred"]["parameters"]): Promise<RestEndpointMethodTypes["gists"]["checkIsStarred"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Allows you to add a new gist with one or more files.
         *
         * **Note:** Don't name your files "gistfile" with a numerical suffix. This is the format of the automatic naming scheme that Gist uses internally.
         */
        create: {
            (params?: RestEndpointMethodTypes["gists"]["create"]["parameters"]): Promise<RestEndpointMethodTypes["gists"]["create"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        createComment: {
            (params?: RestEndpointMethodTypes["gists"]["createComment"]["parameters"]): Promise<RestEndpointMethodTypes["gists"]["createComment"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        delete: {
            (params?: RestEndpointMethodTypes["gists"]["delete"]["parameters"]): Promise<RestEndpointMethodTypes["gists"]["delete"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        deleteComment: {
            (params?: RestEndpointMethodTypes["gists"]["deleteComment"]["parameters"]): Promise<RestEndpointMethodTypes["gists"]["deleteComment"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * **Note**: This was previously `/gists/:gist_id/fork`.
         */
        fork: {
            (params?: RestEndpointMethodTypes["gists"]["fork"]["parameters"]): Promise<RestEndpointMethodTypes["gists"]["fork"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        get: {
            (params?: RestEndpointMethodTypes["gists"]["get"]["parameters"]): Promise<RestEndpointMethodTypes["gists"]["get"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        getComment: {
            (params?: RestEndpointMethodTypes["gists"]["getComment"]["parameters"]): Promise<RestEndpointMethodTypes["gists"]["getComment"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        getRevision: {
            (params?: RestEndpointMethodTypes["gists"]["getRevision"]["parameters"]): Promise<RestEndpointMethodTypes["gists"]["getRevision"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Lists the authenticated user's gists or if called anonymously, this endpoint returns all public gists:
         */
        list: {
            (params?: RestEndpointMethodTypes["gists"]["list"]["parameters"]): Promise<RestEndpointMethodTypes["gists"]["list"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        listComments: {
            (params?: RestEndpointMethodTypes["gists"]["listComments"]["parameters"]): Promise<RestEndpointMethodTypes["gists"]["listComments"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        listCommits: {
            (params?: RestEndpointMethodTypes["gists"]["listCommits"]["parameters"]): Promise<RestEndpointMethodTypes["gists"]["listCommits"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Lists public gists for the specified user:
         */
        listForUser: {
            (params?: RestEndpointMethodTypes["gists"]["listForUser"]["parameters"]): Promise<RestEndpointMethodTypes["gists"]["listForUser"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        listForks: {
            (params?: RestEndpointMethodTypes["gists"]["listForks"]["parameters"]): Promise<RestEndpointMethodTypes["gists"]["listForks"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * List public gists sorted by most recently updated to least recently updated.
         *
         * Note: With [pagination](https://developer.github.com/v3/#pagination), you can fetch up to 3000 gists. For example, you can fetch 100 pages with 30 gists per page or 30 pages with 100 gists per page.
         */
        listPublic: {
            (params?: RestEndpointMethodTypes["gists"]["listPublic"]["parameters"]): Promise<RestEndpointMethodTypes["gists"]["listPublic"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Lists public gists for the specified user:
         * @deprecated octokit.gists.listPublicForUser() has been renamed to octokit.gists.listForUser() (2020-03-04)
         */
        listPublicForUser: {
            (params?: RestEndpointMethodTypes["gists"]["listPublicForUser"]["parameters"]): Promise<RestEndpointMethodTypes["gists"]["listPublicForUser"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * List the authenticated user's starred gists:
         */
        listStarred: {
            (params?: RestEndpointMethodTypes["gists"]["listStarred"]["parameters"]): Promise<RestEndpointMethodTypes["gists"]["listStarred"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Note that you'll need to set `Content-Length` to zero when calling out to this endpoint. For more information, see "[HTTP verbs](https://developer.github.com/v3/#http-verbs)."
         */
        star: {
            (params?: RestEndpointMethodTypes["gists"]["star"]["parameters"]): Promise<RestEndpointMethodTypes["gists"]["star"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        unstar: {
            (params?: RestEndpointMethodTypes["gists"]["unstar"]["parameters"]): Promise<RestEndpointMethodTypes["gists"]["unstar"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Allows you to update or delete a gist file and rename gist files. Files from the previous version of the gist that aren't explicitly changed during an edit are unchanged.
         */
        update: {
            (params?: RestEndpointMethodTypes["gists"]["update"]["parameters"]): Promise<RestEndpointMethodTypes["gists"]["update"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        updateComment: {
            (params?: RestEndpointMethodTypes["gists"]["updateComment"]["parameters"]): Promise<RestEndpointMethodTypes["gists"]["updateComment"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
    };
    git: {
        createBlob: {
            (params?: RestEndpointMethodTypes["git"]["createBlob"]["parameters"]): Promise<RestEndpointMethodTypes["git"]["createBlob"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Creates a new Git [commit object](https://git-scm.com/book/en/v1/Git-Internals-Git-Objects#Commit-Objects).
         *
         * In this example, the payload of the signature would be:
         *
         *
         *
         * **Signature verification object**
         *
         * The response will include a `verification` object that describes the result of verifying the commit's signature. The following fields are included in the `verification` object:
         *
         * These are the possible values for `reason` in the `verification` object:
         *
         * | Value                    | Description                                                                                                                       |
         * | ------------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
         * | `expired_key`            | The key that made the signature is expired.                                                                                       |
         * | `not_signing_key`        | The "signing" flag is not among the usage flags in the GPG key that made the signature.                                           |
         * | `gpgverify_error`        | There was an error communicating with the signature verification service.                                                         |
         * | `gpgverify_unavailable`  | The signature verification service is currently unavailable.                                                                      |
         * | `unsigned`               | The object does not include a signature.                                                                                          |
         * | `unknown_signature_type` | A non-PGP signature was found in the commit.                                                                                      |
         * | `no_user`                | No user was associated with the `committer` email address in the commit.                                                          |
         * | `unverified_email`       | The `committer` email address in the commit was associated with a user, but the email address is not verified on her/his account. |
         * | `bad_email`              | The `committer` email address in the commit is not included in the identities of the PGP key that made the signature.             |
         * | `unknown_key`            | The key that made the signature has not been registered with any user's account.                                                  |
         * | `malformed_signature`    | There was an error parsing the signature.                                                                                         |
         * | `invalid`                | The signature could not be cryptographically verified using the key whose key-id was found in the signature.                      |
         * | `valid`                  | None of the above errors applied, so the signature is considered to be verified.                                                  |
         */
        createCommit: {
            (params?: RestEndpointMethodTypes["git"]["createCommit"]["parameters"]): Promise<RestEndpointMethodTypes["git"]["createCommit"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Creates a reference for your repository. You are unable to create new references for empty repositories, even if the commit SHA-1 hash used exists. Empty repositories are repositories without branches.
         */
        createRef: {
            (params?: RestEndpointMethodTypes["git"]["createRef"]["parameters"]): Promise<RestEndpointMethodTypes["git"]["createRef"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Note that creating a tag object does not create the reference that makes a tag in Git. If you want to create an annotated tag in Git, you have to do this call to create the tag object, and then [create](https://developer.github.com/v3/git/refs/#create-a-reference) the `refs/tags/[tag]` reference. If you want to create a lightweight tag, you only have to [create](https://developer.github.com/v3/git/refs/#create-a-reference) the tag reference - this call would be unnecessary.
         *
         * **Signature verification object**
         *
         * The response will include a `verification` object that describes the result of verifying the commit's signature. The following fields are included in the `verification` object:
         *
         * These are the possible values for `reason` in the `verification` object:
         *
         * | Value                    | Description                                                                                                                       |
         * | ------------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
         * | `expired_key`            | The key that made the signature is expired.                                                                                       |
         * | `not_signing_key`        | The "signing" flag is not among the usage flags in the GPG key that made the signature.                                           |
         * | `gpgverify_error`        | There was an error communicating with the signature verification service.                                                         |
         * | `gpgverify_unavailable`  | The signature verification service is currently unavailable.                                                                      |
         * | `unsigned`               | The object does not include a signature.                                                                                          |
         * | `unknown_signature_type` | A non-PGP signature was found in the commit.                                                                                      |
         * | `no_user`                | No user was associated with the `committer` email address in the commit.                                                          |
         * | `unverified_email`       | The `committer` email address in the commit was associated with a user, but the email address is not verified on her/his account. |
         * | `bad_email`              | The `committer` email address in the commit is not included in the identities of the PGP key that made the signature.             |
         * | `unknown_key`            | The key that made the signature has not been registered with any user's account.                                                  |
         * | `malformed_signature`    | There was an error parsing the signature.                                                                                         |
         * | `invalid`                | The signature could not be cryptographically verified using the key whose key-id was found in the signature.                      |
         * | `valid`                  | None of the above errors applied, so the signature is considered to be verified.                                                  |
         */
        createTag: {
            (params?: RestEndpointMethodTypes["git"]["createTag"]["parameters"]): Promise<RestEndpointMethodTypes["git"]["createTag"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * The tree creation API accepts nested entries. If you specify both a tree and a nested path modifying that tree, this endpoint will overwrite the contents of the tree with the new path contents, and create a new tree structure.
         *
         * If you use this endpoint to add, delete, or modify the file contents in a tree, you will need to commit the tree and then update a branch to point to the commit. For more information see "[Create a commit](https://developer.github.com/v3/git/commits/#create-a-commit)" and "[Update a reference](https://developer.github.com/v3/git/refs/#update-a-reference)."
         */
        createTree: {
            (params?: RestEndpointMethodTypes["git"]["createTree"]["parameters"]): Promise<RestEndpointMethodTypes["git"]["createTree"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        deleteRef: {
            (params?: RestEndpointMethodTypes["git"]["deleteRef"]["parameters"]): Promise<RestEndpointMethodTypes["git"]["deleteRef"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * The `content` in the response will always be Base64 encoded.
         *
         * _Note_: This API supports blobs up to 100 megabytes in size.
         */
        getBlob: {
            (params?: RestEndpointMethodTypes["git"]["getBlob"]["parameters"]): Promise<RestEndpointMethodTypes["git"]["getBlob"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Gets a Git [commit object](https://git-scm.com/book/en/v1/Git-Internals-Git-Objects#Commit-Objects).
         *
         * **Signature verification object**
         *
         * The response will include a `verification` object that describes the result of verifying the commit's signature. The following fields are included in the `verification` object:
         *
         * These are the possible values for `reason` in the `verification` object:
         *
         * | Value                    | Description                                                                                                                       |
         * | ------------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
         * | `expired_key`            | The key that made the signature is expired.                                                                                       |
         * | `not_signing_key`        | The "signing" flag is not among the usage flags in the GPG key that made the signature.                                           |
         * | `gpgverify_error`        | There was an error communicating with the signature verification service.                                                         |
         * | `gpgverify_unavailable`  | The signature verification service is currently unavailable.                                                                      |
         * | `unsigned`               | The object does not include a signature.                                                                                          |
         * | `unknown_signature_type` | A non-PGP signature was found in the commit.                                                                                      |
         * | `no_user`                | No user was associated with the `committer` email address in the commit.                                                          |
         * | `unverified_email`       | The `committer` email address in the commit was associated with a user, but the email address is not verified on her/his account. |
         * | `bad_email`              | The `committer` email address in the commit is not included in the identities of the PGP key that made the signature.             |
         * | `unknown_key`            | The key that made the signature has not been registered with any user's account.                                                  |
         * | `malformed_signature`    | There was an error parsing the signature.                                                                                         |
         * | `invalid`                | The signature could not be cryptographically verified using the key whose key-id was found in the signature.                      |
         * | `valid`                  | None of the above errors applied, so the signature is considered to be verified.                                                  |
         */
        getCommit: {
            (params?: RestEndpointMethodTypes["git"]["getCommit"]["parameters"]): Promise<RestEndpointMethodTypes["git"]["getCommit"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Returns a single reference from your Git database. The `:ref` in the URL must be formatted as `heads/<branch name>` for branches and `tags/<tag name>` for tags. If the `:ref` doesn't match an existing ref, a `404` is returned.
         *
         * **Note:** You need to explicitly [request a pull request](https://developer.github.com/v3/pulls/#get-a-pull-request) to trigger a test merge commit, which checks the mergeability of pull requests. For more information, see "[Checking mergeability of pull requests](https://developer.github.com/v3/git/#checking-mergeability-of-pull-requests)".
         *
         * To get the reference for a branch named `skunkworkz/featureA`, the endpoint route is:
         */
        getRef: {
            (params?: RestEndpointMethodTypes["git"]["getRef"]["parameters"]): Promise<RestEndpointMethodTypes["git"]["getRef"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * **Signature verification object**
         *
         * The response will include a `verification` object that describes the result of verifying the commit's signature. The following fields are included in the `verification` object:
         *
         * These are the possible values for `reason` in the `verification` object:
         *
         * | Value                    | Description                                                                                                                       |
         * | ------------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
         * | `expired_key`            | The key that made the signature is expired.                                                                                       |
         * | `not_signing_key`        | The "signing" flag is not among the usage flags in the GPG key that made the signature.                                           |
         * | `gpgverify_error`        | There was an error communicating with the signature verification service.                                                         |
         * | `gpgverify_unavailable`  | The signature verification service is currently unavailable.                                                                      |
         * | `unsigned`               | The object does not include a signature.                                                                                          |
         * | `unknown_signature_type` | A non-PGP signature was found in the commit.                                                                                      |
         * | `no_user`                | No user was associated with the `committer` email address in the commit.                                                          |
         * | `unverified_email`       | The `committer` email address in the commit was associated with a user, but the email address is not verified on her/his account. |
         * | `bad_email`              | The `committer` email address in the commit is not included in the identities of the PGP key that made the signature.             |
         * | `unknown_key`            | The key that made the signature has not been registered with any user's account.                                                  |
         * | `malformed_signature`    | There was an error parsing the signature.                                                                                         |
         * | `invalid`                | The signature could not be cryptographically verified using the key whose key-id was found in the signature.                      |
         * | `valid`                  | None of the above errors applied, so the signature is considered to be verified.                                                  |
         */
        getTag: {
            (params?: RestEndpointMethodTypes["git"]["getTag"]["parameters"]): Promise<RestEndpointMethodTypes["git"]["getTag"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Returns a single tree using the SHA1 value for that tree.
         *
         * If `truncated` is `true` in the response then the number of items in the `tree` array exceeded our maximum limit. If you need to fetch more items, use the non-recursive method of fetching trees, and fetch one sub-tree at a time.
         */
        getTree: {
            (params?: RestEndpointMethodTypes["git"]["getTree"]["parameters"]): Promise<RestEndpointMethodTypes["git"]["getTree"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Returns an array of references from your Git database that match the supplied name. The `:ref` in the URL must be formatted as `heads/<branch name>` for branches and `tags/<tag name>` for tags. If the `:ref` doesn't exist in the repository, but existing refs start with `:ref`, they will be returned as an array.
         *
         * When you use this endpoint without providing a `:ref`, it will return an array of all the references from your Git database, including notes and stashes if they exist on the server. Anything in the namespace is returned, not just `heads` and `tags`.
         *
         * **Note:** You need to explicitly [request a pull request](https://developer.github.com/v3/pulls/#get-a-pull-request) to trigger a test merge commit, which checks the mergeability of pull requests. For more information, see "[Checking mergeability of pull requests](https://developer.github.com/v3/git/#checking-mergeability-of-pull-requests)".
         *
         * If you request matching references for a branch named `feature` but the branch `feature` doesn't exist, the response can still include other matching head refs that start with the word `feature`, such as `featureA` and `featureB`.
         */
        listMatchingRefs: {
            (params?: RestEndpointMethodTypes["git"]["listMatchingRefs"]["parameters"]): Promise<RestEndpointMethodTypes["git"]["listMatchingRefs"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        updateRef: {
            (params?: RestEndpointMethodTypes["git"]["updateRef"]["parameters"]): Promise<RestEndpointMethodTypes["git"]["updateRef"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
    };
    gitignore: {
        /**
         * List all templates available to pass as an option when [creating a repository](https://developer.github.com/v3/repos/#create-a-repository-for-the-authenticated-user).
         */
        getAllTemplates: {
            (params?: RestEndpointMethodTypes["gitignore"]["getAllTemplates"]["parameters"]): Promise<RestEndpointMethodTypes["gitignore"]["getAllTemplates"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * The API also allows fetching the source of a single template.
         *
         * Use the raw [media type](https://developer.github.com/v3/media/) to get the raw contents.
         */
        getTemplate: {
            (params?: RestEndpointMethodTypes["gitignore"]["getTemplate"]["parameters"]): Promise<RestEndpointMethodTypes["gitignore"]["getTemplate"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * List all templates available to pass as an option when [creating a repository](https://developer.github.com/v3/repos/#create-a-repository-for-the-authenticated-user).
         * @deprecated octokit.gitignore.listTemplates() has been renamed to octokit.gitignore.getAllTemplates() (2020-06-04)
         */
        listTemplates: {
            (params?: RestEndpointMethodTypes["gitignore"]["listTemplates"]["parameters"]): Promise<RestEndpointMethodTypes["gitignore"]["listTemplates"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
    };
    interactions: {
        /**
         * Temporarily restricts interactions to certain GitHub users in any public repository in the given organization. You must be an organization owner to set these restrictions.
         * @deprecated octokit.interactions.addOrUpdateRestrictionsForOrg() has been renamed to octokit.interactions.setRestrictionsForOrg() (2020-06-04)
         */
        addOrUpdateRestrictionsForOrg: {
            (params?: RestEndpointMethodTypes["interactions"]["addOrUpdateRestrictionsForOrg"]["parameters"]): Promise<RestEndpointMethodTypes["interactions"]["addOrUpdateRestrictionsForOrg"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Temporarily restricts interactions to certain GitHub users within the given repository. You must have owner or admin access to set restrictions.
         * @deprecated octokit.interactions.addOrUpdateRestrictionsForRepo() has been renamed to octokit.interactions.setRestrictionsForRepo() (2020-06-04)
         */
        addOrUpdateRestrictionsForRepo: {
            (params?: RestEndpointMethodTypes["interactions"]["addOrUpdateRestrictionsForRepo"]["parameters"]): Promise<RestEndpointMethodTypes["interactions"]["addOrUpdateRestrictionsForRepo"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Shows which group of GitHub users can interact with this organization and when the restriction expires. If there are no restrictions, you will see an empty response.
         */
        getRestrictionsForOrg: {
            (params?: RestEndpointMethodTypes["interactions"]["getRestrictionsForOrg"]["parameters"]): Promise<RestEndpointMethodTypes["interactions"]["getRestrictionsForOrg"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Shows which group of GitHub users can interact with this repository and when the restriction expires. If there are no restrictions, you will see an empty response.
         */
        getRestrictionsForRepo: {
            (params?: RestEndpointMethodTypes["interactions"]["getRestrictionsForRepo"]["parameters"]): Promise<RestEndpointMethodTypes["interactions"]["getRestrictionsForRepo"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Removes all interaction restrictions from public repositories in the given organization. You must be an organization owner to remove restrictions.
         */
        removeRestrictionsForOrg: {
            (params?: RestEndpointMethodTypes["interactions"]["removeRestrictionsForOrg"]["parameters"]): Promise<RestEndpointMethodTypes["interactions"]["removeRestrictionsForOrg"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Removes all interaction restrictions from the given repository. You must have owner or admin access to remove restrictions.
         */
        removeRestrictionsForRepo: {
            (params?: RestEndpointMethodTypes["interactions"]["removeRestrictionsForRepo"]["parameters"]): Promise<RestEndpointMethodTypes["interactions"]["removeRestrictionsForRepo"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Temporarily restricts interactions to certain GitHub users in any public repository in the given organization. You must be an organization owner to set these restrictions.
         */
        setRestrictionsForOrg: {
            (params?: RestEndpointMethodTypes["interactions"]["setRestrictionsForOrg"]["parameters"]): Promise<RestEndpointMethodTypes["interactions"]["setRestrictionsForOrg"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Temporarily restricts interactions to certain GitHub users within the given repository. You must have owner or admin access to set restrictions.
         */
        setRestrictionsForRepo: {
            (params?: RestEndpointMethodTypes["interactions"]["setRestrictionsForRepo"]["parameters"]): Promise<RestEndpointMethodTypes["interactions"]["setRestrictionsForRepo"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
    };
    issues: {
        /**
         * Adds up to 10 assignees to an issue. Users already assigned to an issue are not replaced.
         *
         * This example adds two assignees to the existing `octocat` assignee.
         */
        addAssignees: {
            (params?: RestEndpointMethodTypes["issues"]["addAssignees"]["parameters"]): Promise<RestEndpointMethodTypes["issues"]["addAssignees"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        addLabels: {
            (params?: RestEndpointMethodTypes["issues"]["addLabels"]["parameters"]): Promise<RestEndpointMethodTypes["issues"]["addLabels"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Checks if a user has permission to be assigned to an issue in this repository.
         *
         * If the `assignee` can be assigned to issues in the repository, a `204` header with no content is returned.
         *
         * Otherwise a `404` status code is returned.
         * @deprecated octokit.issues.checkAssignee() has been renamed to octokit.issues.checkUserCanBeAssigned() (2020-06-01)
         */
        checkAssignee: {
            (params?: RestEndpointMethodTypes["issues"]["checkAssignee"]["parameters"]): Promise<RestEndpointMethodTypes["issues"]["checkAssignee"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Checks if a user has permission to be assigned to an issue in this repository.
         *
         * If the `assignee` can be assigned to issues in the repository, a `204` header with no content is returned.
         *
         * Otherwise a `404` status code is returned.
         */
        checkUserCanBeAssigned: {
            (params?: RestEndpointMethodTypes["issues"]["checkUserCanBeAssigned"]["parameters"]): Promise<RestEndpointMethodTypes["issues"]["checkUserCanBeAssigned"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Any user with pull access to a repository can create an issue. If [issues are disabled in the repository](https://help.github.com/articles/disabling-issues/), the API returns a `410 Gone` status.
         *
         * This endpoint triggers [notifications](https://help.github.com/articles/about-notifications/). Creating content too quickly using this endpoint may result in abuse rate limiting. See "[Abuse rate limits](https://developer.github.com/v3/#abuse-rate-limits)" and "[Dealing with abuse rate limits](https://developer.github.com/v3/guides/best-practices-for-integrators/#dealing-with-abuse-rate-limits)" for details.
         */
        create: {
            (params?: RestEndpointMethodTypes["issues"]["create"]["parameters"]): Promise<RestEndpointMethodTypes["issues"]["create"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * This endpoint triggers [notifications](https://help.github.com/articles/about-notifications/). Creating content too quickly using this endpoint may result in abuse rate limiting. See "[Abuse rate limits](https://developer.github.com/v3/#abuse-rate-limits)" and "[Dealing with abuse rate limits](https://developer.github.com/v3/guides/best-practices-for-integrators/#dealing-with-abuse-rate-limits)" for details.
         */
        createComment: {
            (params?: RestEndpointMethodTypes["issues"]["createComment"]["parameters"]): Promise<RestEndpointMethodTypes["issues"]["createComment"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        createLabel: {
            (params?: RestEndpointMethodTypes["issues"]["createLabel"]["parameters"]): Promise<RestEndpointMethodTypes["issues"]["createLabel"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        createMilestone: {
            (params?: RestEndpointMethodTypes["issues"]["createMilestone"]["parameters"]): Promise<RestEndpointMethodTypes["issues"]["createMilestone"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        deleteComment: {
            (params?: RestEndpointMethodTypes["issues"]["deleteComment"]["parameters"]): Promise<RestEndpointMethodTypes["issues"]["deleteComment"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        deleteLabel: {
            (params?: RestEndpointMethodTypes["issues"]["deleteLabel"]["parameters"]): Promise<RestEndpointMethodTypes["issues"]["deleteLabel"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        deleteMilestone: {
            (params?: RestEndpointMethodTypes["issues"]["deleteMilestone"]["parameters"]): Promise<RestEndpointMethodTypes["issues"]["deleteMilestone"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * The API returns a [`301 Moved Permanently` status](https://developer.github.com/v3/#http-redirects) if the issue was [transferred](https://help.github.com/articles/transferring-an-issue-to-another-repository/) to another repository. If the issue was transferred to or deleted from a repository where the authenticated user lacks read access, the API returns a `404 Not Found` status. If the issue was deleted from a repository where the authenticated user has read access, the API returns a `410 Gone` status. To receive webhook events for transferred and deleted issues, subscribe to the [`issues`](https://developer.github.com/webhooks/event-payloads/#issues) webhook.
         *
         * **Note**: GitHub's REST API v3 considers every pull request an issue, but not every issue is a pull request. For this reason, "Issues" endpoints may return both issues and pull requests in the response. You can identify pull requests by the `pull_request` key.
         *
         * Be aware that the `id` of a pull request returned from "Issues" endpoints will be an _issue id_. To find out the pull request id, use the "[List pull requests](https://developer.github.com/v3/pulls/#list-pull-requests)" endpoint.
         */
        get: {
            (params?: RestEndpointMethodTypes["issues"]["get"]["parameters"]): Promise<RestEndpointMethodTypes["issues"]["get"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        getComment: {
            (params?: RestEndpointMethodTypes["issues"]["getComment"]["parameters"]): Promise<RestEndpointMethodTypes["issues"]["getComment"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        getEvent: {
            (params?: RestEndpointMethodTypes["issues"]["getEvent"]["parameters"]): Promise<RestEndpointMethodTypes["issues"]["getEvent"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        getLabel: {
            (params?: RestEndpointMethodTypes["issues"]["getLabel"]["parameters"]): Promise<RestEndpointMethodTypes["issues"]["getLabel"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        getMilestone: {
            (params?: RestEndpointMethodTypes["issues"]["getMilestone"]["parameters"]): Promise<RestEndpointMethodTypes["issues"]["getMilestone"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * List issues assigned to the authenticated user across all visible repositories including owned repositories, member repositories, and organization repositories. You can use the `filter` query parameter to fetch issues that are not necessarily assigned to you. See the [Parameters table](https://developer.github.com/v3/issues/#parameters) for more information.
         *
         * **Note**: GitHub's REST API v3 considers every pull request an issue, but not every issue is a pull request. For this reason, "Issues" endpoints may return both issues and pull requests in the response. You can identify pull requests by the `pull_request` key.
         *
         * Be aware that the `id` of a pull request returned from "Issues" endpoints will be an _issue id_. To find out the pull request id, use the "[List pull requests](https://developer.github.com/v3/pulls/#list-pull-requests)" endpoint.
         */
        list: {
            (params?: RestEndpointMethodTypes["issues"]["list"]["parameters"]): Promise<RestEndpointMethodTypes["issues"]["list"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Lists the [available assignees](https://help.github.com/articles/assigning-issues-and-pull-requests-to-other-github-users/) for issues in a repository.
         */
        listAssignees: {
            (params?: RestEndpointMethodTypes["issues"]["listAssignees"]["parameters"]): Promise<RestEndpointMethodTypes["issues"]["listAssignees"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Issue Comments are ordered by ascending ID.
         */
        listComments: {
            (params?: RestEndpointMethodTypes["issues"]["listComments"]["parameters"]): Promise<RestEndpointMethodTypes["issues"]["listComments"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * By default, Issue Comments are ordered by ascending ID.
         */
        listCommentsForRepo: {
            (params?: RestEndpointMethodTypes["issues"]["listCommentsForRepo"]["parameters"]): Promise<RestEndpointMethodTypes["issues"]["listCommentsForRepo"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        listEvents: {
            (params?: RestEndpointMethodTypes["issues"]["listEvents"]["parameters"]): Promise<RestEndpointMethodTypes["issues"]["listEvents"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        listEventsForRepo: {
            (params?: RestEndpointMethodTypes["issues"]["listEventsForRepo"]["parameters"]): Promise<RestEndpointMethodTypes["issues"]["listEventsForRepo"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        listEventsForTimeline: {
            (params?: RestEndpointMethodTypes["issues"]["listEventsForTimeline"]["parameters"]): Promise<RestEndpointMethodTypes["issues"]["listEventsForTimeline"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * List issues across owned and member repositories assigned to the authenticated user:
         *
         * **Note**: GitHub's REST API v3 considers every pull request an issue, but not every issue is a pull request. For this reason, "Issues" endpoints may return both issues and pull requests in the response. You can identify pull requests by the `pull_request` key.
         *
         * Be aware that the `id` of a pull request returned from "Issues" endpoints will be an _issue id_. To find out the pull request id, use the "[List pull requests](https://developer.github.com/v3/pulls/#list-pull-requests)" endpoint.
         */
        listForAuthenticatedUser: {
            (params?: RestEndpointMethodTypes["issues"]["listForAuthenticatedUser"]["parameters"]): Promise<RestEndpointMethodTypes["issues"]["listForAuthenticatedUser"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * List issues in an organization assigned to the authenticated user.
         *
         * **Note**: GitHub's REST API v3 considers every pull request an issue, but not every issue is a pull request. For this reason, "Issues" endpoints may return both issues and pull requests in the response. You can identify pull requests by the `pull_request` key.
         *
         * Be aware that the `id` of a pull request returned from "Issues" endpoints will be an _issue id_. To find out the pull request id, use the "[List pull requests](https://developer.github.com/v3/pulls/#list-pull-requests)" endpoint.
         */
        listForOrg: {
            (params?: RestEndpointMethodTypes["issues"]["listForOrg"]["parameters"]): Promise<RestEndpointMethodTypes["issues"]["listForOrg"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * List issues in a repository.
         *
         * **Note**: GitHub's REST API v3 considers every pull request an issue, but not every issue is a pull request. For this reason, "Issues" endpoints may return both issues and pull requests in the response. You can identify pull requests by the `pull_request` key.
         *
         * Be aware that the `id` of a pull request returned from "Issues" endpoints will be an _issue id_. To find out the pull request id, use the "[List pull requests](https://developer.github.com/v3/pulls/#list-pull-requests)" endpoint.
         */
        listForRepo: {
            (params?: RestEndpointMethodTypes["issues"]["listForRepo"]["parameters"]): Promise<RestEndpointMethodTypes["issues"]["listForRepo"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        listLabelsForMilestone: {
            (params?: RestEndpointMethodTypes["issues"]["listLabelsForMilestone"]["parameters"]): Promise<RestEndpointMethodTypes["issues"]["listLabelsForMilestone"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        listLabelsForRepo: {
            (params?: RestEndpointMethodTypes["issues"]["listLabelsForRepo"]["parameters"]): Promise<RestEndpointMethodTypes["issues"]["listLabelsForRepo"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        listLabelsOnIssue: {
            (params?: RestEndpointMethodTypes["issues"]["listLabelsOnIssue"]["parameters"]): Promise<RestEndpointMethodTypes["issues"]["listLabelsOnIssue"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        listMilestones: {
            (params?: RestEndpointMethodTypes["issues"]["listMilestones"]["parameters"]): Promise<RestEndpointMethodTypes["issues"]["listMilestones"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * @deprecated octokit.issues.listMilestonesForRepo() has been renamed to octokit.issues.listMilestones() (2020-06-01)
         */
        listMilestonesForRepo: {
            (params?: RestEndpointMethodTypes["issues"]["listMilestonesForRepo"]["parameters"]): Promise<RestEndpointMethodTypes["issues"]["listMilestonesForRepo"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Users with push access can lock an issue or pull request's conversation.
         *
         * Note that, if you choose not to pass any parameters, you'll need to set `Content-Length` to zero when calling out to this endpoint. For more information, see "[HTTP verbs](https://developer.github.com/v3/#http-verbs)."
         */
        lock: {
            (params?: RestEndpointMethodTypes["issues"]["lock"]["parameters"]): Promise<RestEndpointMethodTypes["issues"]["lock"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        removeAllLabels: {
            (params?: RestEndpointMethodTypes["issues"]["removeAllLabels"]["parameters"]): Promise<RestEndpointMethodTypes["issues"]["removeAllLabels"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Removes one or more assignees from an issue.
         *
         * This example removes two of three assignees, leaving the `octocat` assignee.
         */
        removeAssignees: {
            (params?: RestEndpointMethodTypes["issues"]["removeAssignees"]["parameters"]): Promise<RestEndpointMethodTypes["issues"]["removeAssignees"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Removes the specified label from the issue, and returns the remaining labels on the issue. This endpoint returns a `404 Not Found` status if the label does not exist.
         */
        removeLabel: {
            (params?: RestEndpointMethodTypes["issues"]["removeLabel"]["parameters"]): Promise<RestEndpointMethodTypes["issues"]["removeLabel"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * @deprecated octokit.issues.removeLabels() has been renamed to octokit.issues.removeAllLabels() (2020-03-04)
         */
        removeLabels: {
            (params?: RestEndpointMethodTypes["issues"]["removeLabels"]["parameters"]): Promise<RestEndpointMethodTypes["issues"]["removeLabels"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Removes any previous labels and sets the new labels for an issue.
         * @deprecated octokit.issues.replaceAllLabels() has been renamed to octokit.issues.setLabels() (2020-06-04)
         */
        replaceAllLabels: {
            (params?: RestEndpointMethodTypes["issues"]["replaceAllLabels"]["parameters"]): Promise<RestEndpointMethodTypes["issues"]["replaceAllLabels"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Removes any previous labels and sets the new labels for an issue.
         * @deprecated octokit.issues.replaceLabels() has been renamed to octokit.issues.replaceAllLabels() (2020-03-04)
         */
        replaceLabels: {
            (params?: RestEndpointMethodTypes["issues"]["replaceLabels"]["parameters"]): Promise<RestEndpointMethodTypes["issues"]["replaceLabels"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Removes any previous labels and sets the new labels for an issue.
         */
        setLabels: {
            (params?: RestEndpointMethodTypes["issues"]["setLabels"]["parameters"]): Promise<RestEndpointMethodTypes["issues"]["setLabels"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Users with push access can unlock an issue's conversation.
         */
        unlock: {
            (params?: RestEndpointMethodTypes["issues"]["unlock"]["parameters"]): Promise<RestEndpointMethodTypes["issues"]["unlock"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Issue owners and users with push access can edit an issue.
         */
        update: {
            (params?: RestEndpointMethodTypes["issues"]["update"]["parameters"]): Promise<RestEndpointMethodTypes["issues"]["update"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        updateComment: {
            (params?: RestEndpointMethodTypes["issues"]["updateComment"]["parameters"]): Promise<RestEndpointMethodTypes["issues"]["updateComment"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        updateLabel: {
            (params?: RestEndpointMethodTypes["issues"]["updateLabel"]["parameters"]): Promise<RestEndpointMethodTypes["issues"]["updateLabel"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        updateMilestone: {
            (params?: RestEndpointMethodTypes["issues"]["updateMilestone"]["parameters"]): Promise<RestEndpointMethodTypes["issues"]["updateMilestone"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
    };
    licenses: {
        get: {
            (params?: RestEndpointMethodTypes["licenses"]["get"]["parameters"]): Promise<RestEndpointMethodTypes["licenses"]["get"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        getAllCommonlyUsed: {
            (params?: RestEndpointMethodTypes["licenses"]["getAllCommonlyUsed"]["parameters"]): Promise<RestEndpointMethodTypes["licenses"]["getAllCommonlyUsed"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * This method returns the contents of the repository's license file, if one is detected.
         *
         * Similar to [Get repository content](https://developer.github.com/v3/repos/contents/#get-repository-content), this method also supports [custom media types](https://developer.github.com/v3/repos/contents/#custom-media-types) for retrieving the raw license content or rendered license HTML.
         */
        getForRepo: {
            (params?: RestEndpointMethodTypes["licenses"]["getForRepo"]["parameters"]): Promise<RestEndpointMethodTypes["licenses"]["getForRepo"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * @deprecated octokit.licenses.listCommonlyUsed() has been renamed to octokit.licenses.getAllCommonlyUsed() (2020-06-04)
         */
        listCommonlyUsed: {
            (params?: RestEndpointMethodTypes["licenses"]["listCommonlyUsed"]["parameters"]): Promise<RestEndpointMethodTypes["licenses"]["listCommonlyUsed"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
    };
    markdown: {
        render: {
            (params?: RestEndpointMethodTypes["markdown"]["render"]["parameters"]): Promise<RestEndpointMethodTypes["markdown"]["render"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * You must send Markdown as plain text (using a `Content-Type` header of `text/plain` or `text/x-markdown`) to this endpoint, rather than using JSON format. In raw mode, [GitHub Flavored Markdown](https://github.github.com/gfm/) is not supported and Markdown will be rendered in plain format like a README.md file. Markdown content must be 400 KB or less.
         */
        renderRaw: {
            (params?: RestEndpointMethodTypes["markdown"]["renderRaw"]["parameters"]): Promise<RestEndpointMethodTypes["markdown"]["renderRaw"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
    };
    meta: {
        /**
         * This endpoint provides a list of GitHub's IP addresses. For more information, see "[About GitHub's IP addresses](https://help.github.com/articles/about-github-s-ip-addresses/)."
         */
        get: {
            (params?: RestEndpointMethodTypes["meta"]["get"]["parameters"]): Promise<RestEndpointMethodTypes["meta"]["get"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
    };
    migrations: {
        /**
         * Stop an import for a repository.
         */
        cancelImport: {
            (params?: RestEndpointMethodTypes["migrations"]["cancelImport"]["parameters"]): Promise<RestEndpointMethodTypes["migrations"]["cancelImport"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Deletes a previous migration archive. Downloadable migration archives are automatically deleted after seven days. Migration metadata, which is returned in the [List user migrations](https://developer.github.com/v3/migrations/users/#list-user-migrations) and [Get a user migration status](https://developer.github.com/v3/migrations/users/#get-a-user-migration-status) endpoints, will continue to be available even after an archive is deleted.
         */
        deleteArchiveForAuthenticatedUser: {
            (params?: RestEndpointMethodTypes["migrations"]["deleteArchiveForAuthenticatedUser"]["parameters"]): Promise<RestEndpointMethodTypes["migrations"]["deleteArchiveForAuthenticatedUser"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Deletes a previous migration archive. Migration archives are automatically deleted after seven days.
         */
        deleteArchiveForOrg: {
            (params?: RestEndpointMethodTypes["migrations"]["deleteArchiveForOrg"]["parameters"]): Promise<RestEndpointMethodTypes["migrations"]["deleteArchiveForOrg"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Fetches the URL to a migration archive.
         */
        downloadArchiveForOrg: {
            (params?: RestEndpointMethodTypes["migrations"]["downloadArchiveForOrg"]["parameters"]): Promise<RestEndpointMethodTypes["migrations"]["downloadArchiveForOrg"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Fetches the URL to download the migration archive as a `tar.gz` file. Depending on the resources your repository uses, the migration archive can contain JSON files with data for these objects:
         *
         * *   attachments
         * *   bases
         * *   commit\_comments
         * *   issue\_comments
         * *   issue\_events
         * *   issues
         * *   milestones
         * *   organizations
         * *   projects
         * *   protected\_branches
         * *   pull\_request\_reviews
         * *   pull\_requests
         * *   releases
         * *   repositories
         * *   review\_comments
         * *   schema
         * *   users
         *
         * The archive will also contain an `attachments` directory that includes all attachment files uploaded to GitHub.com and a `repositories` directory that contains the repository's Git data.
         */
        getArchiveForAuthenticatedUser: {
            (params?: RestEndpointMethodTypes["migrations"]["getArchiveForAuthenticatedUser"]["parameters"]): Promise<RestEndpointMethodTypes["migrations"]["getArchiveForAuthenticatedUser"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Each type of source control system represents authors in a different way. For example, a Git commit author has a display name and an email address, but a Subversion commit author just has a username. The GitHub Importer will make the author information valid, but the author might not be correct. For example, it will change the bare Subversion username `hubot` into something like `hubot <hubot@12341234-abab-fefe-8787-fedcba987654>`.
         *
         * This endpoint and the [Map a commit author](https://developer.github.com/v3/migrations/source_imports/#map-a-commit-author) endpoint allow you to provide correct Git author information.
         */
        getCommitAuthors: {
            (params?: RestEndpointMethodTypes["migrations"]["getCommitAuthors"]["parameters"]): Promise<RestEndpointMethodTypes["migrations"]["getCommitAuthors"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * View the progress of an import.
         *
         * **Import status**
         *
         * This section includes details about the possible values of the `status` field of the Import Progress response.
         *
         * An import that does not have errors will progress through these steps:
         *
         * *   `detecting` - the "detection" step of the import is in progress because the request did not include a `vcs` parameter. The import is identifying the type of source control present at the URL.
         * *   `importing` - the "raw" step of the import is in progress. This is where commit data is fetched from the original repository. The import progress response will include `commit_count` (the total number of raw commits that will be imported) and `percent` (0 - 100, the current progress through the import).
         * *   `mapping` - the "rewrite" step of the import is in progress. This is where SVN branches are converted to Git branches, and where author updates are applied. The import progress response does not include progress information.
         * *   `pushing` - the "push" step of the import is in progress. This is where the importer updates the repository on GitHub. The import progress response will include `push_percent`, which is the percent value reported by `git push` when it is "Writing objects".
         * *   `complete` - the import is complete, and the repository is ready on GitHub.
         *
         * If there are problems, you will see one of these in the `status` field:
         *
         * *   `auth_failed` - the import requires authentication in order to connect to the original repository. To update authentication for the import, please see the [Update an import](https://developer.github.com/v3/migrations/source_imports/#update-an-import) section.
         * *   `error` - the import encountered an error. The import progress response will include the `failed_step` and an error message. Contact [GitHub Support](https://github.com/contact) or [GitHub Premium Support](https://premium.githubsupport.com) for more information.
         * *   `detection_needs_auth` - the importer requires authentication for the originating repository to continue detection. To update authentication for the import, please see the [Update an import](https://developer.github.com/v3/migrations/source_imports/#update-an-import) section.
         * *   `detection_found_nothing` - the importer didn't recognize any source control at the URL. To resolve, [Cancel the import](https://developer.github.com/v3/migrations/source_imports/#cancel-an-import) and [retry](https://developer.github.com/v3/migrations/source_imports/#start-an-import) with the correct URL.
         * *   `detection_found_multiple` - the importer found several projects or repositories at the provided URL. When this is the case, the Import Progress response will also include a `project_choices` field with the possible project choices as values. To update project choice, please see the [Update an import](https://developer.github.com/v3/migrations/source_imports/#update-an-import) section.
         *
         * **The project_choices field**
         *
         * When multiple projects are found at the provided URL, the response hash will include a `project_choices` field, the value of which is an array of hashes each representing a project choice. The exact key/value pairs of the project hashes will differ depending on the version control type.
         *
         * **Git LFS related fields**
         *
         * This section includes details about Git LFS related fields that may be present in the Import Progress response.
         *
         * *   `use_lfs` - describes whether the import has been opted in or out of using Git LFS. The value can be `opt_in`, `opt_out`, or `undecided` if no action has been taken.
         * *   `has_large_files` - the boolean value describing whether files larger than 100MB were found during the `importing` step.
         * *   `large_files_size` - the total size in gigabytes of files larger than 100MB found in the originating repository.
         * *   `large_files_count` - the total number of files larger than 100MB found in the originating repository. To see a list of these files, make a "Get Large Files" request.
         * @deprecated octokit.migrations.getImportProgress() has been renamed to octokit.migrations.getImportStatus() (2020-06-01)
         */
        getImportProgress: {
            (params?: RestEndpointMethodTypes["migrations"]["getImportProgress"]["parameters"]): Promise<RestEndpointMethodTypes["migrations"]["getImportProgress"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * View the progress of an import.
         *
         * **Import status**
         *
         * This section includes details about the possible values of the `status` field of the Import Progress response.
         *
         * An import that does not have errors will progress through these steps:
         *
         * *   `detecting` - the "detection" step of the import is in progress because the request did not include a `vcs` parameter. The import is identifying the type of source control present at the URL.
         * *   `importing` - the "raw" step of the import is in progress. This is where commit data is fetched from the original repository. The import progress response will include `commit_count` (the total number of raw commits that will be imported) and `percent` (0 - 100, the current progress through the import).
         * *   `mapping` - the "rewrite" step of the import is in progress. This is where SVN branches are converted to Git branches, and where author updates are applied. The import progress response does not include progress information.
         * *   `pushing` - the "push" step of the import is in progress. This is where the importer updates the repository on GitHub. The import progress response will include `push_percent`, which is the percent value reported by `git push` when it is "Writing objects".
         * *   `complete` - the import is complete, and the repository is ready on GitHub.
         *
         * If there are problems, you will see one of these in the `status` field:
         *
         * *   `auth_failed` - the import requires authentication in order to connect to the original repository. To update authentication for the import, please see the [Update an import](https://developer.github.com/v3/migrations/source_imports/#update-an-import) section.
         * *   `error` - the import encountered an error. The import progress response will include the `failed_step` and an error message. Contact [GitHub Support](https://github.com/contact) or [GitHub Premium Support](https://premium.githubsupport.com) for more information.
         * *   `detection_needs_auth` - the importer requires authentication for the originating repository to continue detection. To update authentication for the import, please see the [Update an import](https://developer.github.com/v3/migrations/source_imports/#update-an-import) section.
         * *   `detection_found_nothing` - the importer didn't recognize any source control at the URL. To resolve, [Cancel the import](https://developer.github.com/v3/migrations/source_imports/#cancel-an-import) and [retry](https://developer.github.com/v3/migrations/source_imports/#start-an-import) with the correct URL.
         * *   `detection_found_multiple` - the importer found several projects or repositories at the provided URL. When this is the case, the Import Progress response will also include a `project_choices` field with the possible project choices as values. To update project choice, please see the [Update an import](https://developer.github.com/v3/migrations/source_imports/#update-an-import) section.
         *
         * **The project_choices field**
         *
         * When multiple projects are found at the provided URL, the response hash will include a `project_choices` field, the value of which is an array of hashes each representing a project choice. The exact key/value pairs of the project hashes will differ depending on the version control type.
         *
         * **Git LFS related fields**
         *
         * This section includes details about Git LFS related fields that may be present in the Import Progress response.
         *
         * *   `use_lfs` - describes whether the import has been opted in or out of using Git LFS. The value can be `opt_in`, `opt_out`, or `undecided` if no action has been taken.
         * *   `has_large_files` - the boolean value describing whether files larger than 100MB were found during the `importing` step.
         * *   `large_files_size` - the total size in gigabytes of files larger than 100MB found in the originating repository.
         * *   `large_files_count` - the total number of files larger than 100MB found in the originating repository. To see a list of these files, make a "Get Large Files" request.
         */
        getImportStatus: {
            (params?: RestEndpointMethodTypes["migrations"]["getImportStatus"]["parameters"]): Promise<RestEndpointMethodTypes["migrations"]["getImportStatus"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * List files larger than 100MB found during the import
         */
        getLargeFiles: {
            (params?: RestEndpointMethodTypes["migrations"]["getLargeFiles"]["parameters"]): Promise<RestEndpointMethodTypes["migrations"]["getLargeFiles"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Fetches a single user migration. The response includes the `state` of the migration, which can be one of the following values:
         *
         * *   `pending` - the migration hasn't started yet.
         * *   `exporting` - the migration is in progress.
         * *   `exported` - the migration finished successfully.
         * *   `failed` - the migration failed.
         *
         * Once the migration has been `exported` you can [download the migration archive](https://developer.github.com/v3/migrations/users/#download-a-user-migration-archive).
         */
        getStatusForAuthenticatedUser: {
            (params?: RestEndpointMethodTypes["migrations"]["getStatusForAuthenticatedUser"]["parameters"]): Promise<RestEndpointMethodTypes["migrations"]["getStatusForAuthenticatedUser"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Fetches the status of a migration.
         *
         * The `state` of a migration can be one of the following values:
         *
         * *   `pending`, which means the migration hasn't started yet.
         * *   `exporting`, which means the migration is in progress.
         * *   `exported`, which means the migration finished successfully.
         * *   `failed`, which means the migration failed.
         */
        getStatusForOrg: {
            (params?: RestEndpointMethodTypes["migrations"]["getStatusForOrg"]["parameters"]): Promise<RestEndpointMethodTypes["migrations"]["getStatusForOrg"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Lists all migrations a user has started.
         */
        listForAuthenticatedUser: {
            (params?: RestEndpointMethodTypes["migrations"]["listForAuthenticatedUser"]["parameters"]): Promise<RestEndpointMethodTypes["migrations"]["listForAuthenticatedUser"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Lists the most recent migrations.
         */
        listForOrg: {
            (params?: RestEndpointMethodTypes["migrations"]["listForOrg"]["parameters"]): Promise<RestEndpointMethodTypes["migrations"]["listForOrg"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * List all the repositories for this organization migration.
         */
        listReposForOrg: {
            (params?: RestEndpointMethodTypes["migrations"]["listReposForOrg"]["parameters"]): Promise<RestEndpointMethodTypes["migrations"]["listReposForOrg"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Lists all the repositories for this user migration.
         */
        listReposForUser: {
            (params?: RestEndpointMethodTypes["migrations"]["listReposForUser"]["parameters"]): Promise<RestEndpointMethodTypes["migrations"]["listReposForUser"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Update an author's identity for the import. Your application can continue updating authors any time before you push new commits to the repository.
         */
        mapCommitAuthor: {
            (params?: RestEndpointMethodTypes["migrations"]["mapCommitAuthor"]["parameters"]): Promise<RestEndpointMethodTypes["migrations"]["mapCommitAuthor"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * You can import repositories from Subversion, Mercurial, and TFS that include files larger than 100MB. This ability is powered by [Git LFS](https://git-lfs.github.com). You can learn more about our LFS feature and working with large files [on our help site](https://help.github.com/articles/versioning-large-files/).
         */
        setLfsPreference: {
            (params?: RestEndpointMethodTypes["migrations"]["setLfsPreference"]["parameters"]): Promise<RestEndpointMethodTypes["migrations"]["setLfsPreference"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Initiates the generation of a user migration archive.
         */
        startForAuthenticatedUser: {
            (params?: RestEndpointMethodTypes["migrations"]["startForAuthenticatedUser"]["parameters"]): Promise<RestEndpointMethodTypes["migrations"]["startForAuthenticatedUser"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Initiates the generation of a migration archive.
         */
        startForOrg: {
            (params?: RestEndpointMethodTypes["migrations"]["startForOrg"]["parameters"]): Promise<RestEndpointMethodTypes["migrations"]["startForOrg"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Start a source import to a GitHub repository using GitHub Importer.
         */
        startImport: {
            (params?: RestEndpointMethodTypes["migrations"]["startImport"]["parameters"]): Promise<RestEndpointMethodTypes["migrations"]["startImport"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Unlocks a repository. You can lock repositories when you [start a user migration](https://developer.github.com/v3/migrations/users/#start-a-user-migration). Once the migration is complete you can unlock each repository to begin using it again or [delete the repository](https://developer.github.com/v3/repos/#delete-a-repository) if you no longer need the source data. Returns a status of `404 Not Found` if the repository is not locked.
         */
        unlockRepoForAuthenticatedUser: {
            (params?: RestEndpointMethodTypes["migrations"]["unlockRepoForAuthenticatedUser"]["parameters"]): Promise<RestEndpointMethodTypes["migrations"]["unlockRepoForAuthenticatedUser"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Unlocks a repository that was locked for migration. You should unlock each migrated repository and [delete them](https://developer.github.com/v3/repos/#delete-a-repository) when the migration is complete and you no longer need the source data.
         */
        unlockRepoForOrg: {
            (params?: RestEndpointMethodTypes["migrations"]["unlockRepoForOrg"]["parameters"]): Promise<RestEndpointMethodTypes["migrations"]["unlockRepoForOrg"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * An import can be updated with credentials or a project choice by passing in the appropriate parameters in this API request. If no parameters are provided, the import will be restarted.
         *
         * Some servers (e.g. TFS servers) can have several projects at a single URL. In those cases the import progress will have the status `detection_found_multiple` and the Import Progress response will include a `project_choices` array. You can select the project to import by providing one of the objects in the `project_choices` array in the update request.
         *
         * The following example demonstrates the workflow for updating an import with "project1" as the project choice. Given a `project_choices` array like such:
         *
         * To restart an import, no parameters are provided in the update request.
         */
        updateImport: {
            (params?: RestEndpointMethodTypes["migrations"]["updateImport"]["parameters"]): Promise<RestEndpointMethodTypes["migrations"]["updateImport"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
    };
    orgs: {
        /**
         * Only authenticated organization owners can add a member to the organization or update the member's role.
         *
         * *   If the authenticated user is _adding_ a member to the organization, the invited user will receive an email inviting them to the organization. The user's [membership status](https://developer.github.com/v3/orgs/members/#get-organization-membership-for-a-user) will be `pending` until they accept the invitation.
         *
         * *   Authenticated users can _update_ a user's membership by passing the `role` parameter. If the authenticated user changes a member's role to `admin`, the affected user will receive an email notifying them that they've been made an organization owner. If the authenticated user changes an owner's role to `member`, no email will be sent.
         *
         * **Rate limits**
         *
         * To prevent abuse, the authenticated user is limited to 50 organization invitations per 24 hour period. If the organization is more than one month old or on a paid plan, the limit is 500 invitations per 24 hour period.
         * @deprecated octokit.orgs.addOrUpdateMembership() has been renamed to octokit.orgs.setMembershipForUser() (2020-06-04)
         */
        addOrUpdateMembership: {
            (params?: RestEndpointMethodTypes["orgs"]["addOrUpdateMembership"]["parameters"]): Promise<RestEndpointMethodTypes["orgs"]["addOrUpdateMembership"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        blockUser: {
            (params?: RestEndpointMethodTypes["orgs"]["blockUser"]["parameters"]): Promise<RestEndpointMethodTypes["orgs"]["blockUser"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * If the user is blocked:
         *
         * If the user is not blocked:
         */
        checkBlockedUser: {
            (params?: RestEndpointMethodTypes["orgs"]["checkBlockedUser"]["parameters"]): Promise<RestEndpointMethodTypes["orgs"]["checkBlockedUser"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Check if a user is, publicly or privately, a member of the organization.
         * @deprecated octokit.orgs.checkMembership() has been renamed to octokit.orgs.checkMembershipForUser() (2020-06-04)
         */
        checkMembership: {
            (params?: RestEndpointMethodTypes["orgs"]["checkMembership"]["parameters"]): Promise<RestEndpointMethodTypes["orgs"]["checkMembership"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Check if a user is, publicly or privately, a member of the organization.
         */
        checkMembershipForUser: {
            (params?: RestEndpointMethodTypes["orgs"]["checkMembershipForUser"]["parameters"]): Promise<RestEndpointMethodTypes["orgs"]["checkMembershipForUser"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * @deprecated octokit.orgs.checkPublicMembership() has been renamed to octokit.orgs.checkPublicMembershipForUser() (2020-06-04)
         */
        checkPublicMembership: {
            (params?: RestEndpointMethodTypes["orgs"]["checkPublicMembership"]["parameters"]): Promise<RestEndpointMethodTypes["orgs"]["checkPublicMembership"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        checkPublicMembershipForUser: {
            (params?: RestEndpointMethodTypes["orgs"]["checkPublicMembershipForUser"]["parameters"]): Promise<RestEndpointMethodTypes["orgs"]["checkPublicMembershipForUser"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * @deprecated octokit.orgs.concealMembership() has been renamed to octokit.orgs.removePublicMembershipForAuthenticatedUser() (2020-06-04)
         */
        concealMembership: {
            (params?: RestEndpointMethodTypes["orgs"]["concealMembership"]["parameters"]): Promise<RestEndpointMethodTypes["orgs"]["concealMembership"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * When an organization member is converted to an outside collaborator, they'll only have access to the repositories that their current team membership allows. The user will no longer be a member of the organization. For more information, see "[Converting an organization member to an outside collaborator](https://help.github.com/articles/converting-an-organization-member-to-an-outside-collaborator/)".
         */
        convertMemberToOutsideCollaborator: {
            (params?: RestEndpointMethodTypes["orgs"]["convertMemberToOutsideCollaborator"]["parameters"]): Promise<RestEndpointMethodTypes["orgs"]["convertMemberToOutsideCollaborator"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Here's how you can create a hook that posts payloads in JSON format:
         * @deprecated octokit.orgs.createHook() has been renamed to octokit.orgs.createWebhook() (2020-06-04)
         */
        createHook: {
            (params?: RestEndpointMethodTypes["orgs"]["createHook"]["parameters"]): Promise<RestEndpointMethodTypes["orgs"]["createHook"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Invite people to an organization by using their GitHub user ID or their email address. In order to create invitations in an organization, the authenticated user must be an organization owner.
         *
         * This endpoint triggers [notifications](https://help.github.com/articles/about-notifications/). Creating content too quickly using this endpoint may result in abuse rate limiting. See "[Abuse rate limits](https://developer.github.com/v3/#abuse-rate-limits)" and "[Dealing with abuse rate limits](https://developer.github.com/v3/guides/best-practices-for-integrators/#dealing-with-abuse-rate-limits)" for details.
         */
        createInvitation: {
            (params?: RestEndpointMethodTypes["orgs"]["createInvitation"]["parameters"]): Promise<RestEndpointMethodTypes["orgs"]["createInvitation"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Here's how you can create a hook that posts payloads in JSON format:
         */
        createWebhook: {
            (params?: RestEndpointMethodTypes["orgs"]["createWebhook"]["parameters"]): Promise<RestEndpointMethodTypes["orgs"]["createWebhook"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * @deprecated octokit.orgs.deleteHook() has been renamed to octokit.orgs.deleteWebhook() (2020-06-04)
         */
        deleteHook: {
            (params?: RestEndpointMethodTypes["orgs"]["deleteHook"]["parameters"]): Promise<RestEndpointMethodTypes["orgs"]["deleteHook"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        deleteWebhook: {
            (params?: RestEndpointMethodTypes["orgs"]["deleteWebhook"]["parameters"]): Promise<RestEndpointMethodTypes["orgs"]["deleteWebhook"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * To see many of the organization response values, you need to be an authenticated organization owner with the `admin:org` scope. When the value of `two_factor_requirement_enabled` is `true`, the organization requires all members, billing managers, and outside collaborators to enable [two-factor authentication](https://help.github.com/articles/securing-your-account-with-two-factor-authentication-2fa/).
         *
         * GitHub Apps with the `Organization plan` permission can use this endpoint to retrieve information about an organization's GitHub plan. See "[Authenticating with GitHub Apps](https://developer.github.com/apps/building-github-apps/authenticating-with-github-apps/)" for details. For an example response, see "[Response with GitHub plan information](https://developer.github.com/v3/orgs/#response-with-github-plan-information)."
         */
        get: {
            (params?: RestEndpointMethodTypes["orgs"]["get"]["parameters"]): Promise<RestEndpointMethodTypes["orgs"]["get"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * @deprecated octokit.orgs.getHook() has been renamed to octokit.orgs.getWebhook() (2020-06-04)
         */
        getHook: {
            (params?: RestEndpointMethodTypes["orgs"]["getHook"]["parameters"]): Promise<RestEndpointMethodTypes["orgs"]["getHook"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * In order to get a user's membership with an organization, the authenticated user must be an organization member.
         * @deprecated octokit.orgs.getMembership() has been renamed to octokit.orgs.getMembershipForUser() (2020-06-04)
         */
        getMembership: {
            (params?: RestEndpointMethodTypes["orgs"]["getMembership"]["parameters"]): Promise<RestEndpointMethodTypes["orgs"]["getMembership"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        getMembershipForAuthenticatedUser: {
            (params?: RestEndpointMethodTypes["orgs"]["getMembershipForAuthenticatedUser"]["parameters"]): Promise<RestEndpointMethodTypes["orgs"]["getMembershipForAuthenticatedUser"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * In order to get a user's membership with an organization, the authenticated user must be an organization member.
         */
        getMembershipForUser: {
            (params?: RestEndpointMethodTypes["orgs"]["getMembershipForUser"]["parameters"]): Promise<RestEndpointMethodTypes["orgs"]["getMembershipForUser"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        getWebhook: {
            (params?: RestEndpointMethodTypes["orgs"]["getWebhook"]["parameters"]): Promise<RestEndpointMethodTypes["orgs"]["getWebhook"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Lists all organizations, in the order that they were created on GitHub.
         *
         * **Note:** Pagination is powered exclusively by the `since` parameter. Use the [Link header](https://developer.github.com/v3/#link-header) to get the URL for the next page of organizations.
         */
        list: {
            (params?: RestEndpointMethodTypes["orgs"]["list"]["parameters"]): Promise<RestEndpointMethodTypes["orgs"]["list"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Lists all GitHub Apps in an organization. The installation count includes all GitHub Apps installed on repositories in the organization. You must be an organization owner with `admin:read` scope to use this endpoint.
         */
        listAppInstallations: {
            (params?: RestEndpointMethodTypes["orgs"]["listAppInstallations"]["parameters"]): Promise<RestEndpointMethodTypes["orgs"]["listAppInstallations"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * List the users blocked by an organization.
         */
        listBlockedUsers: {
            (params?: RestEndpointMethodTypes["orgs"]["listBlockedUsers"]["parameters"]): Promise<RestEndpointMethodTypes["orgs"]["listBlockedUsers"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * List organizations for the authenticated user.
         *
         * **OAuth scope requirements**
         *
         * This only lists organizations that your authorization allows you to operate on in some way (e.g., you can list teams with `read:org` scope, you can publicize your organization membership with `user` scope, etc.). Therefore, this API requires at least `user` or `read:org` scope. OAuth requests with insufficient scope receive a `403 Forbidden` response.
         */
        listForAuthenticatedUser: {
            (params?: RestEndpointMethodTypes["orgs"]["listForAuthenticatedUser"]["parameters"]): Promise<RestEndpointMethodTypes["orgs"]["listForAuthenticatedUser"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * List [public organization memberships](https://help.github.com/articles/publicizing-or-concealing-organization-membership) for the specified user.
         *
         * This method only lists _public_ memberships, regardless of authentication. If you need to fetch all of the organization memberships (public and private) for the authenticated user, use the [List organizations for the authenticated user](https://developer.github.com/v3/orgs/#list-organizations-for-the-authenticated-user) API instead.
         */
        listForUser: {
            (params?: RestEndpointMethodTypes["orgs"]["listForUser"]["parameters"]): Promise<RestEndpointMethodTypes["orgs"]["listForUser"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * @deprecated octokit.orgs.listHooks() has been renamed to octokit.orgs.listWebhooks() (2020-06-04)
         */
        listHooks: {
            (params?: RestEndpointMethodTypes["orgs"]["listHooks"]["parameters"]): Promise<RestEndpointMethodTypes["orgs"]["listHooks"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Lists all GitHub Apps in an organization. The installation count includes all GitHub Apps installed on repositories in the organization. You must be an organization owner with `admin:read` scope to use this endpoint.
         * @deprecated octokit.orgs.listInstallations() has been renamed to octokit.orgs.listAppInstallations() (2020-06-04)
         */
        listInstallations: {
            (params?: RestEndpointMethodTypes["orgs"]["listInstallations"]["parameters"]): Promise<RestEndpointMethodTypes["orgs"]["listInstallations"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * List all teams associated with an invitation. In order to see invitations in an organization, the authenticated user must be an organization owner.
         */
        listInvitationTeams: {
            (params?: RestEndpointMethodTypes["orgs"]["listInvitationTeams"]["parameters"]): Promise<RestEndpointMethodTypes["orgs"]["listInvitationTeams"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * List all users who are members of an organization. If the authenticated user is also a member of this organization then both concealed and public members will be returned.
         */
        listMembers: {
            (params?: RestEndpointMethodTypes["orgs"]["listMembers"]["parameters"]): Promise<RestEndpointMethodTypes["orgs"]["listMembers"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * @deprecated octokit.orgs.listMemberships() has been renamed to octokit.orgs.listMembershipsForAuthenticatedUser() (2020-06-04)
         */
        listMemberships: {
            (params?: RestEndpointMethodTypes["orgs"]["listMemberships"]["parameters"]): Promise<RestEndpointMethodTypes["orgs"]["listMemberships"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        listMembershipsForAuthenticatedUser: {
            (params?: RestEndpointMethodTypes["orgs"]["listMembershipsForAuthenticatedUser"]["parameters"]): Promise<RestEndpointMethodTypes["orgs"]["listMembershipsForAuthenticatedUser"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * List all users who are outside collaborators of an organization.
         */
        listOutsideCollaborators: {
            (params?: RestEndpointMethodTypes["orgs"]["listOutsideCollaborators"]["parameters"]): Promise<RestEndpointMethodTypes["orgs"]["listOutsideCollaborators"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * The return hash contains a `role` field which refers to the Organization Invitation role and will be one of the following values: `direct_member`, `admin`, `billing_manager`, `hiring_manager`, or `reinstate`. If the invitee is not a GitHub member, the `login` field in the return hash will be `null`.
         */
        listPendingInvitations: {
            (params?: RestEndpointMethodTypes["orgs"]["listPendingInvitations"]["parameters"]): Promise<RestEndpointMethodTypes["orgs"]["listPendingInvitations"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Members of an organization can choose to have their membership publicized or not.
         */
        listPublicMembers: {
            (params?: RestEndpointMethodTypes["orgs"]["listPublicMembers"]["parameters"]): Promise<RestEndpointMethodTypes["orgs"]["listPublicMembers"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        listWebhooks: {
            (params?: RestEndpointMethodTypes["orgs"]["listWebhooks"]["parameters"]): Promise<RestEndpointMethodTypes["orgs"]["listWebhooks"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * This will trigger a [ping event](https://developer.github.com/webhooks/#ping-event) to be sent to the hook.
         * @deprecated octokit.orgs.pingHook() has been renamed to octokit.orgs.pingWebhook() (2020-06-04)
         */
        pingHook: {
            (params?: RestEndpointMethodTypes["orgs"]["pingHook"]["parameters"]): Promise<RestEndpointMethodTypes["orgs"]["pingHook"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * This will trigger a [ping event](https://developer.github.com/webhooks/#ping-event) to be sent to the hook.
         */
        pingWebhook: {
            (params?: RestEndpointMethodTypes["orgs"]["pingWebhook"]["parameters"]): Promise<RestEndpointMethodTypes["orgs"]["pingWebhook"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * The user can publicize their own membership. (A user cannot publicize the membership for another user.)
         *
         * Note that you'll need to set `Content-Length` to zero when calling out to this endpoint. For more information, see "[HTTP verbs](https://developer.github.com/v3/#http-verbs)."
         * @deprecated octokit.orgs.publicizeMembership() has been renamed to octokit.orgs.setPublicMembershipForAuthenticatedUser() (2020-06-04)
         */
        publicizeMembership: {
            (params?: RestEndpointMethodTypes["orgs"]["publicizeMembership"]["parameters"]): Promise<RestEndpointMethodTypes["orgs"]["publicizeMembership"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Removing a user from this list will remove them from all teams and they will no longer have any access to the organization's repositories.
         */
        removeMember: {
            (params?: RestEndpointMethodTypes["orgs"]["removeMember"]["parameters"]): Promise<RestEndpointMethodTypes["orgs"]["removeMember"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * In order to remove a user's membership with an organization, the authenticated user must be an organization owner.
         *
         * If the specified user is an active member of the organization, this will remove them from the organization. If the specified user has been invited to the organization, this will cancel their invitation. The specified user will receive an email notification in both cases.
         * @deprecated octokit.orgs.removeMembership() has been renamed to octokit.orgs.removeMembershipForUser() (2020-06-04)
         */
        removeMembership: {
            (params?: RestEndpointMethodTypes["orgs"]["removeMembership"]["parameters"]): Promise<RestEndpointMethodTypes["orgs"]["removeMembership"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * In order to remove a user's membership with an organization, the authenticated user must be an organization owner.
         *
         * If the specified user is an active member of the organization, this will remove them from the organization. If the specified user has been invited to the organization, this will cancel their invitation. The specified user will receive an email notification in both cases.
         */
        removeMembershipForUser: {
            (params?: RestEndpointMethodTypes["orgs"]["removeMembershipForUser"]["parameters"]): Promise<RestEndpointMethodTypes["orgs"]["removeMembershipForUser"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Removing a user from this list will remove them from all the organization's repositories.
         */
        removeOutsideCollaborator: {
            (params?: RestEndpointMethodTypes["orgs"]["removeOutsideCollaborator"]["parameters"]): Promise<RestEndpointMethodTypes["orgs"]["removeOutsideCollaborator"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        removePublicMembershipForAuthenticatedUser: {
            (params?: RestEndpointMethodTypes["orgs"]["removePublicMembershipForAuthenticatedUser"]["parameters"]): Promise<RestEndpointMethodTypes["orgs"]["removePublicMembershipForAuthenticatedUser"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Only authenticated organization owners can add a member to the organization or update the member's role.
         *
         * *   If the authenticated user is _adding_ a member to the organization, the invited user will receive an email inviting them to the organization. The user's [membership status](https://developer.github.com/v3/orgs/members/#get-organization-membership-for-a-user) will be `pending` until they accept the invitation.
         *
         * *   Authenticated users can _update_ a user's membership by passing the `role` parameter. If the authenticated user changes a member's role to `admin`, the affected user will receive an email notifying them that they've been made an organization owner. If the authenticated user changes an owner's role to `member`, no email will be sent.
         *
         * **Rate limits**
         *
         * To prevent abuse, the authenticated user is limited to 50 organization invitations per 24 hour period. If the organization is more than one month old or on a paid plan, the limit is 500 invitations per 24 hour period.
         */
        setMembershipForUser: {
            (params?: RestEndpointMethodTypes["orgs"]["setMembershipForUser"]["parameters"]): Promise<RestEndpointMethodTypes["orgs"]["setMembershipForUser"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * The user can publicize their own membership. (A user cannot publicize the membership for another user.)
         *
         * Note that you'll need to set `Content-Length` to zero when calling out to this endpoint. For more information, see "[HTTP verbs](https://developer.github.com/v3/#http-verbs)."
         */
        setPublicMembershipForAuthenticatedUser: {
            (params?: RestEndpointMethodTypes["orgs"]["setPublicMembershipForAuthenticatedUser"]["parameters"]): Promise<RestEndpointMethodTypes["orgs"]["setPublicMembershipForAuthenticatedUser"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        unblockUser: {
            (params?: RestEndpointMethodTypes["orgs"]["unblockUser"]["parameters"]): Promise<RestEndpointMethodTypes["orgs"]["unblockUser"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * **Parameter Deprecation Notice:** GitHub will replace and discontinue `members_allowed_repository_creation_type` in favor of more granular permissions. The new input parameters are `members_can_create_public_repositories`, `members_can_create_private_repositories` for all organizations and `members_can_create_internal_repositories` for organizations associated with an enterprise account using GitHub Enterprise Cloud or GitHub Enterprise Server 2.20+. For more information, see the [blog post](https://developer.github.com/changes/2019-12-03-internal-visibility-changes).
         *
         * Enables an authenticated organization owner with the `admin:org` scope to update the organization's profile and member privileges.
         */
        update: {
            (params?: RestEndpointMethodTypes["orgs"]["update"]["parameters"]): Promise<RestEndpointMethodTypes["orgs"]["update"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * @deprecated octokit.orgs.updateHook() has been renamed to octokit.orgs.updateWebhook() (2020-06-04)
         */
        updateHook: {
            (params?: RestEndpointMethodTypes["orgs"]["updateHook"]["parameters"]): Promise<RestEndpointMethodTypes["orgs"]["updateHook"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * @deprecated octokit.orgs.updateMembership() has been renamed to octokit.orgs.updateMembershipForAuthenticatedUser() (2020-06-04)
         */
        updateMembership: {
            (params?: RestEndpointMethodTypes["orgs"]["updateMembership"]["parameters"]): Promise<RestEndpointMethodTypes["orgs"]["updateMembership"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        updateMembershipForAuthenticatedUser: {
            (params?: RestEndpointMethodTypes["orgs"]["updateMembershipForAuthenticatedUser"]["parameters"]): Promise<RestEndpointMethodTypes["orgs"]["updateMembershipForAuthenticatedUser"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        updateWebhook: {
            (params?: RestEndpointMethodTypes["orgs"]["updateWebhook"]["parameters"]): Promise<RestEndpointMethodTypes["orgs"]["updateWebhook"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
    };
    projects: {
        /**
         * Adds a collaborator to an organization project and sets their permission level. You must be an organization owner or a project `admin` to add a collaborator.
         */
        addCollaborator: {
            (params?: RestEndpointMethodTypes["projects"]["addCollaborator"]["parameters"]): Promise<RestEndpointMethodTypes["projects"]["addCollaborator"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * **Note**: GitHub's REST API v3 considers every pull request an issue, but not every issue is a pull request. For this reason, "Issues" endpoints may return both issues and pull requests in the response. You can identify pull requests by the `pull_request` key.
         *
         * Be aware that the `id` of a pull request returned from "Issues" endpoints will be an _issue id_. To find out the pull request id, use the "[List pull requests](https://developer.github.com/v3/pulls/#list-pull-requests)" endpoint.
         */
        createCard: {
            (params?: RestEndpointMethodTypes["projects"]["createCard"]["parameters"]): Promise<RestEndpointMethodTypes["projects"]["createCard"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        createColumn: {
            (params?: RestEndpointMethodTypes["projects"]["createColumn"]["parameters"]): Promise<RestEndpointMethodTypes["projects"]["createColumn"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        createForAuthenticatedUser: {
            (params?: RestEndpointMethodTypes["projects"]["createForAuthenticatedUser"]["parameters"]): Promise<RestEndpointMethodTypes["projects"]["createForAuthenticatedUser"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Creates an organization project board. Returns a `404 Not Found` status if projects are disabled in the organization. If you do not have sufficient privileges to perform this action, a `401 Unauthorized` or `410 Gone` status is returned.
         */
        createForOrg: {
            (params?: RestEndpointMethodTypes["projects"]["createForOrg"]["parameters"]): Promise<RestEndpointMethodTypes["projects"]["createForOrg"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Creates a repository project board. Returns a `404 Not Found` status if projects are disabled in the repository. If you do not have sufficient privileges to perform this action, a `401 Unauthorized` or `410 Gone` status is returned.
         */
        createForRepo: {
            (params?: RestEndpointMethodTypes["projects"]["createForRepo"]["parameters"]): Promise<RestEndpointMethodTypes["projects"]["createForRepo"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Deletes a project board. Returns a `404 Not Found` status if projects are disabled.
         */
        delete: {
            (params?: RestEndpointMethodTypes["projects"]["delete"]["parameters"]): Promise<RestEndpointMethodTypes["projects"]["delete"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        deleteCard: {
            (params?: RestEndpointMethodTypes["projects"]["deleteCard"]["parameters"]): Promise<RestEndpointMethodTypes["projects"]["deleteCard"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        deleteColumn: {
            (params?: RestEndpointMethodTypes["projects"]["deleteColumn"]["parameters"]): Promise<RestEndpointMethodTypes["projects"]["deleteColumn"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Gets a project by its `id`. Returns a `404 Not Found` status if projects are disabled. If you do not have sufficient privileges to perform this action, a `401 Unauthorized` or `410 Gone` status is returned.
         */
        get: {
            (params?: RestEndpointMethodTypes["projects"]["get"]["parameters"]): Promise<RestEndpointMethodTypes["projects"]["get"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        getCard: {
            (params?: RestEndpointMethodTypes["projects"]["getCard"]["parameters"]): Promise<RestEndpointMethodTypes["projects"]["getCard"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        getColumn: {
            (params?: RestEndpointMethodTypes["projects"]["getColumn"]["parameters"]): Promise<RestEndpointMethodTypes["projects"]["getColumn"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Returns the collaborator's permission level for an organization project. Possible values for the `permission` key: `admin`, `write`, `read`, `none`. You must be an organization owner or a project `admin` to review a user's permission level.
         */
        getPermissionForUser: {
            (params?: RestEndpointMethodTypes["projects"]["getPermissionForUser"]["parameters"]): Promise<RestEndpointMethodTypes["projects"]["getPermissionForUser"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        listCards: {
            (params?: RestEndpointMethodTypes["projects"]["listCards"]["parameters"]): Promise<RestEndpointMethodTypes["projects"]["listCards"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Lists the collaborators for an organization project. For a project, the list of collaborators includes outside collaborators, organization members that are direct collaborators, organization members with access through team memberships, organization members with access through default organization permissions, and organization owners. You must be an organization owner or a project `admin` to list collaborators.
         */
        listCollaborators: {
            (params?: RestEndpointMethodTypes["projects"]["listCollaborators"]["parameters"]): Promise<RestEndpointMethodTypes["projects"]["listCollaborators"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        listColumns: {
            (params?: RestEndpointMethodTypes["projects"]["listColumns"]["parameters"]): Promise<RestEndpointMethodTypes["projects"]["listColumns"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Lists the projects in an organization. Returns a `404 Not Found` status if projects are disabled in the organization. If you do not have sufficient privileges to perform this action, a `401 Unauthorized` or `410 Gone` status is returned.
         *
         * s
         */
        listForOrg: {
            (params?: RestEndpointMethodTypes["projects"]["listForOrg"]["parameters"]): Promise<RestEndpointMethodTypes["projects"]["listForOrg"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Lists the projects in a repository. Returns a `404 Not Found` status if projects are disabled in the repository. If you do not have sufficient privileges to perform this action, a `401 Unauthorized` or `410 Gone` status is returned.
         */
        listForRepo: {
            (params?: RestEndpointMethodTypes["projects"]["listForRepo"]["parameters"]): Promise<RestEndpointMethodTypes["projects"]["listForRepo"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        listForUser: {
            (params?: RestEndpointMethodTypes["projects"]["listForUser"]["parameters"]): Promise<RestEndpointMethodTypes["projects"]["listForUser"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        moveCard: {
            (params?: RestEndpointMethodTypes["projects"]["moveCard"]["parameters"]): Promise<RestEndpointMethodTypes["projects"]["moveCard"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        moveColumn: {
            (params?: RestEndpointMethodTypes["projects"]["moveColumn"]["parameters"]): Promise<RestEndpointMethodTypes["projects"]["moveColumn"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Removes a collaborator from an organization project. You must be an organization owner or a project `admin` to remove a collaborator.
         */
        removeCollaborator: {
            (params?: RestEndpointMethodTypes["projects"]["removeCollaborator"]["parameters"]): Promise<RestEndpointMethodTypes["projects"]["removeCollaborator"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Returns the collaborator's permission level for an organization project. Possible values for the `permission` key: `admin`, `write`, `read`, `none`. You must be an organization owner or a project `admin` to review a user's permission level.
         * @deprecated octokit.projects.reviewUserPermissionLevel() has been renamed to octokit.projects.getPermissionForUser() (2020-06-05)
         */
        reviewUserPermissionLevel: {
            (params?: RestEndpointMethodTypes["projects"]["reviewUserPermissionLevel"]["parameters"]): Promise<RestEndpointMethodTypes["projects"]["reviewUserPermissionLevel"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Updates a project board's information. Returns a `404 Not Found` status if projects are disabled. If you do not have sufficient privileges to perform this action, a `401 Unauthorized` or `410 Gone` status is returned.
         */
        update: {
            (params?: RestEndpointMethodTypes["projects"]["update"]["parameters"]): Promise<RestEndpointMethodTypes["projects"]["update"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        updateCard: {
            (params?: RestEndpointMethodTypes["projects"]["updateCard"]["parameters"]): Promise<RestEndpointMethodTypes["projects"]["updateCard"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        updateColumn: {
            (params?: RestEndpointMethodTypes["projects"]["updateColumn"]["parameters"]): Promise<RestEndpointMethodTypes["projects"]["updateColumn"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
    };
    pulls: {
        checkIfMerged: {
            (params?: RestEndpointMethodTypes["pulls"]["checkIfMerged"]["parameters"]): Promise<RestEndpointMethodTypes["pulls"]["checkIfMerged"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Draft pull requests are available in public repositories with GitHub Free and GitHub Free for organizations, GitHub Pro, and legacy per-repository billing plans, and in public and private repositories with GitHub Team and GitHub Enterprise Cloud. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
         *
         * To open or update a pull request in a public repository, you must have write access to the head or the source branch. For organization-owned repositories, you must be a member of the organization that owns the repository to open or update a pull request.
         *
         * You can create a new pull request.
         *
         * This endpoint triggers [notifications](https://help.github.com/articles/about-notifications/). Creating content too quickly using this endpoint may result in abuse rate limiting. See "[Abuse rate limits](https://developer.github.com/v3/#abuse-rate-limits)" and "[Dealing with abuse rate limits](https://developer.github.com/v3/guides/best-practices-for-integrators/#dealing-with-abuse-rate-limits)" for details.
         */
        create: {
            (params?: RestEndpointMethodTypes["pulls"]["create"]["parameters"]): Promise<RestEndpointMethodTypes["pulls"]["create"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * **Note:** Multi-line comments on pull requests are currently in public beta and subject to change.
         *
         * Creates a review comment in the pull request diff. To add a regular comment to a pull request timeline, see "[Create an issue comment](https://developer.github.com/v3/issues/comments/#create-an-issue-comment)." We recommend creating a review comment using `line`, `side`, and optionally `start_line` and `start_side` if your comment applies to more than one line in the pull request diff.
         *
         * You can still create a review comment using the `position` parameter. When you use `position`, the `line`, `side`, `start_line`, and `start_side` parameters are not required. For more information, see [Multi-line comment summary](https://developer.github.com/v3/pulls/comments/#multi-line-comment-summary-3).
         *
         * **Note:** The position value equals the number of lines down from the first "@@" hunk header in the file you want to add a comment. The line just below the "@@" line is position 1, the next line is position 2, and so on. The position in the diff continues to increase through lines of whitespace and additional hunks until the beginning of a new file.
         *
         * This endpoint triggers [notifications](https://help.github.com/articles/about-notifications/). Creating content too quickly using this endpoint may result in abuse rate limiting. See "[Abuse rate limits](https://developer.github.com/v3/#abuse-rate-limits)" and "[Dealing with abuse rate limits](https://developer.github.com/v3/guides/best-practices-for-integrators/#dealing-with-abuse-rate-limits)" for details.
         *
         * **Multi-line comment summary**
         *
         * **Note:** New parameters and response fields are available for developers to preview. During the preview period, these response fields may change without advance notice. Please see the [blog post](https://developer.github.com/changes/2019-10-03-multi-line-comments) for full details.
         *
         * Use the `comfort-fade` preview header and the `line` parameter to show multi-line comment-supported fields in the response.
         *
         * If you use the `comfort-fade` preview header, your response will show:
         *
         * *   For multi-line comments, values for `start_line`, `original_start_line`, `start_side`, `line`, `original_line`, and `side`.
         * *   For single-line comments, values for `line`, `original_line`, and `side` and a `null` value for `start_line`, `original_start_line`, and `start_side`.
         *
         * If you don't use the `comfort-fade` preview header, multi-line and single-line comments will appear the same way in the response with a single `position` attribute. Your response will show:
         *
         * *   For multi-line comments, the last line of the comment range for the `position` attribute.
         * *   For single-line comments, the diff-positioned way of referencing comments for the `position` attribute. For more information, see `position` in the [input parameters](https://developer.github.com/v3/pulls/comments/#parameters-2) table.
         * @deprecated octokit.pulls.createComment() has been renamed to octokit.pulls.createReviewComment() (2020-06-05)
         */
        createComment: {
            (params?: RestEndpointMethodTypes["pulls"]["createComment"]["parameters"]): Promise<RestEndpointMethodTypes["pulls"]["createComment"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Creates a reply to a review comment for a pull request. For the `comment_id`, provide the ID of the review comment you are replying to. This must be the ID of a _top-level review comment_, not a reply to that comment. Replies to replies are not supported.
         *
         * This endpoint triggers [notifications](https://help.github.com/articles/about-notifications/). Creating content too quickly using this endpoint may result in abuse rate limiting. See "[Abuse rate limits](https://developer.github.com/v3/#abuse-rate-limits)" and "[Dealing with abuse rate limits](https://developer.github.com/v3/guides/best-practices-for-integrators/#dealing-with-abuse-rate-limits)" for details.
         */
        createReplyForReviewComment: {
            (params?: RestEndpointMethodTypes["pulls"]["createReplyForReviewComment"]["parameters"]): Promise<RestEndpointMethodTypes["pulls"]["createReplyForReviewComment"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * This endpoint triggers [notifications](https://help.github.com/articles/about-notifications/). Creating content too quickly using this endpoint may result in abuse rate limiting. See "[Abuse rate limits](https://developer.github.com/v3/#abuse-rate-limits)" and "[Dealing with abuse rate limits](https://developer.github.com/v3/guides/best-practices-for-integrators/#dealing-with-abuse-rate-limits)" for details.
         *
         * Pull request reviews created in the `PENDING` state do not include the `submitted_at` property in the response.
         *
         * **Note:** To comment on a specific line in a file, you need to first determine the _position_ of that line in the diff. The GitHub REST API v3 offers the `application/vnd.github.v3.diff` [media type](https://developer.github.com/v3/media/#commits-commit-comparison-and-pull-requests). To see a pull request diff, add this media type to the `Accept` header of a call to the [single pull request](https://developer.github.com/v3/pulls/#get-a-pull-request) endpoint.
         *
         * The `position` value equals the number of lines down from the first "@@" hunk header in the file you want to add a comment. The line just below the "@@" line is position 1, the next line is position 2, and so on. The position in the diff continues to increase through lines of whitespace and additional hunks until the beginning of a new file.
         */
        createReview: {
            (params?: RestEndpointMethodTypes["pulls"]["createReview"]["parameters"]): Promise<RestEndpointMethodTypes["pulls"]["createReview"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * **Note:** Multi-line comments on pull requests are currently in public beta and subject to change.
         *
         * Creates a review comment in the pull request diff. To add a regular comment to a pull request timeline, see "[Create an issue comment](https://developer.github.com/v3/issues/comments/#create-an-issue-comment)." We recommend creating a review comment using `line`, `side`, and optionally `start_line` and `start_side` if your comment applies to more than one line in the pull request diff.
         *
         * You can still create a review comment using the `position` parameter. When you use `position`, the `line`, `side`, `start_line`, and `start_side` parameters are not required. For more information, see [Multi-line comment summary](https://developer.github.com/v3/pulls/comments/#multi-line-comment-summary-3).
         *
         * **Note:** The position value equals the number of lines down from the first "@@" hunk header in the file you want to add a comment. The line just below the "@@" line is position 1, the next line is position 2, and so on. The position in the diff continues to increase through lines of whitespace and additional hunks until the beginning of a new file.
         *
         * This endpoint triggers [notifications](https://help.github.com/articles/about-notifications/). Creating content too quickly using this endpoint may result in abuse rate limiting. See "[Abuse rate limits](https://developer.github.com/v3/#abuse-rate-limits)" and "[Dealing with abuse rate limits](https://developer.github.com/v3/guides/best-practices-for-integrators/#dealing-with-abuse-rate-limits)" for details.
         *
         * **Multi-line comment summary**
         *
         * **Note:** New parameters and response fields are available for developers to preview. During the preview period, these response fields may change without advance notice. Please see the [blog post](https://developer.github.com/changes/2019-10-03-multi-line-comments) for full details.
         *
         * Use the `comfort-fade` preview header and the `line` parameter to show multi-line comment-supported fields in the response.
         *
         * If you use the `comfort-fade` preview header, your response will show:
         *
         * *   For multi-line comments, values for `start_line`, `original_start_line`, `start_side`, `line`, `original_line`, and `side`.
         * *   For single-line comments, values for `line`, `original_line`, and `side` and a `null` value for `start_line`, `original_start_line`, and `start_side`.
         *
         * If you don't use the `comfort-fade` preview header, multi-line and single-line comments will appear the same way in the response with a single `position` attribute. Your response will show:
         *
         * *   For multi-line comments, the last line of the comment range for the `position` attribute.
         * *   For single-line comments, the diff-positioned way of referencing comments for the `position` attribute. For more information, see `position` in the [input parameters](https://developer.github.com/v3/pulls/comments/#parameters-2) table.
         */
        createReviewComment: {
            (params?: RestEndpointMethodTypes["pulls"]["createReviewComment"]["parameters"]): Promise<RestEndpointMethodTypes["pulls"]["createReviewComment"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Creates a reply to a review comment for a pull request. For the `comment_id`, provide the ID of the review comment you are replying to. This must be the ID of a _top-level review comment_, not a reply to that comment. Replies to replies are not supported.
         *
         * This endpoint triggers [notifications](https://help.github.com/articles/about-notifications/). Creating content too quickly using this endpoint may result in abuse rate limiting. See "[Abuse rate limits](https://developer.github.com/v3/#abuse-rate-limits)" and "[Dealing with abuse rate limits](https://developer.github.com/v3/guides/best-practices-for-integrators/#dealing-with-abuse-rate-limits)" for details.
         * @deprecated octokit.pulls.createReviewCommentReply() has been renamed to octokit.pulls.createReplyForReviewComment() (2020-06-05)
         */
        createReviewCommentReply: {
            (params?: RestEndpointMethodTypes["pulls"]["createReviewCommentReply"]["parameters"]): Promise<RestEndpointMethodTypes["pulls"]["createReviewCommentReply"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * This endpoint triggers [notifications](https://help.github.com/articles/about-notifications/). Creating content too quickly using this endpoint may result in abuse rate limiting. See "[Abuse rate limits](https://developer.github.com/v3/#abuse-rate-limits)" and "[Dealing with abuse rate limits](https://developer.github.com/v3/guides/best-practices-for-integrators/#dealing-with-abuse-rate-limits)" for details.
         * @deprecated octokit.pulls.createReviewRequest() has been renamed to octokit.pulls.requestReviewers() (2020-06-05)
         */
        createReviewRequest: {
            (params?: RestEndpointMethodTypes["pulls"]["createReviewRequest"]["parameters"]): Promise<RestEndpointMethodTypes["pulls"]["createReviewRequest"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Deletes a review comment.
         * @deprecated octokit.pulls.deleteComment() has been renamed to octokit.pulls.deleteReviewComment() (2020-06-05)
         */
        deleteComment: {
            (params?: RestEndpointMethodTypes["pulls"]["deleteComment"]["parameters"]): Promise<RestEndpointMethodTypes["pulls"]["deleteComment"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        deletePendingReview: {
            (params?: RestEndpointMethodTypes["pulls"]["deletePendingReview"]["parameters"]): Promise<RestEndpointMethodTypes["pulls"]["deletePendingReview"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Deletes a review comment.
         */
        deleteReviewComment: {
            (params?: RestEndpointMethodTypes["pulls"]["deleteReviewComment"]["parameters"]): Promise<RestEndpointMethodTypes["pulls"]["deleteReviewComment"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * @deprecated octokit.pulls.deleteReviewRequest() has been renamed to octokit.pulls.removeRequestedReviewers() (2020-06-05)
         */
        deleteReviewRequest: {
            (params?: RestEndpointMethodTypes["pulls"]["deleteReviewRequest"]["parameters"]): Promise<RestEndpointMethodTypes["pulls"]["deleteReviewRequest"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * **Note:** To dismiss a pull request review on a [protected branch](https://developer.github.com/v3/repos/branches/), you must be a repository administrator or be included in the list of people or teams who can dismiss pull request reviews.
         */
        dismissReview: {
            (params?: RestEndpointMethodTypes["pulls"]["dismissReview"]["parameters"]): Promise<RestEndpointMethodTypes["pulls"]["dismissReview"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Draft pull requests are available in public repositories with GitHub Free and GitHub Free for organizations, GitHub Pro, and legacy per-repository billing plans, and in public and private repositories with GitHub Team and GitHub Enterprise Cloud. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
         *
         * Lists details of a pull request by providing its number.
         *
         * When you get, [create](https://developer.github.com/v3/pulls/#create-a-pull-request), or [edit](https://developer.github.com/v3/pulls/#update-a-pull-request) a pull request, GitHub creates a merge commit to test whether the pull request can be automatically merged into the base branch. This test commit is not added to the base branch or the head branch. You can review the status of the test commit using the `mergeable` key. For more information, see "[Checking mergeability of pull requests](https://developer.github.com/v3/git/#checking-mergeability-of-pull-requests)".
         *
         * The value of the `mergeable` attribute can be `true`, `false`, or `null`. If the value is `null`, then GitHub has started a background job to compute the mergeability. After giving the job time to complete, resubmit the request. When the job finishes, you will see a non-`null` value for the `mergeable` attribute in the response. If `mergeable` is `true`, then `merge_commit_sha` will be the SHA of the _test_ merge commit.
         *
         * The value of the `merge_commit_sha` attribute changes depending on the state of the pull request. Before merging a pull request, the `merge_commit_sha` attribute holds the SHA of the _test_ merge commit. After merging a pull request, the `merge_commit_sha` attribute changes depending on how you merged the pull request:
         *
         * *   If merged as a [merge commit](https://help.github.com/articles/about-merge-methods-on-github/), `merge_commit_sha` represents the SHA of the merge commit.
         * *   If merged via a [squash](https://help.github.com/articles/about-merge-methods-on-github/#squashing-your-merge-commits), `merge_commit_sha` represents the SHA of the squashed commit on the base branch.
         * *   If [rebased](https://help.github.com/articles/about-merge-methods-on-github/#rebasing-and-merging-your-commits), `merge_commit_sha` represents the commit that the base branch was updated to.
         *
         * Pass the appropriate [media type](https://developer.github.com/v3/media/#commits-commit-comparison-and-pull-requests) to fetch diff and patch formats.
         */
        get: {
            (params?: RestEndpointMethodTypes["pulls"]["get"]["parameters"]): Promise<RestEndpointMethodTypes["pulls"]["get"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * **Note:** Multi-line comments on pull requests are currently in public beta and subject to change.
         *
         * Provides details for a review comment.
         *
         * **Multi-line comment summary**
         *
         * **Note:** New parameters and response fields are available for developers to preview. During the preview period, these response fields may change without advance notice. Please see the [blog post](https://developer.github.com/changes/2019-10-03-multi-line-comments) for full details.
         *
         * Use the `comfort-fade` preview header and the `line` parameter to show multi-line comment-supported fields in the response.
         *
         * If you use the `comfort-fade` preview header, your response will show:
         *
         * *   For multi-line comments, values for `start_line`, `original_start_line`, `start_side`, `line`, `original_line`, and `side`.
         * *   For single-line comments, values for `line`, `original_line`, and `side` and a `null` value for `start_line`, `original_start_line`, and `start_side`.
         *
         * If you don't use the `comfort-fade` preview header, multi-line and single-line comments will appear the same way in the response with a single `position` attribute. Your response will show:
         *
         * *   For multi-line comments, the last line of the comment range for the `position` attribute.
         * *   For single-line comments, the diff-positioned way of referencing comments for the `position` attribute. For more information, see `position` in the [input parameters](https://developer.github.com/v3/pulls/comments/#parameters-2) table.
         *
         * The `reactions` key will have the following payload where `url` can be used to construct the API location for [listing and creating](https://developer.github.com/v3/reactions) reactions.
         * @deprecated octokit.pulls.getComment() has been renamed to octokit.pulls.getReviewComment() (2020-06-05)
         */
        getComment: {
            (params?: RestEndpointMethodTypes["pulls"]["getComment"]["parameters"]): Promise<RestEndpointMethodTypes["pulls"]["getComment"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * List comments for a specific pull request review.
         * @deprecated octokit.pulls.getCommentsForReview() has been renamed to octokit.pulls.listCommentsForReview() (2020-06-05)
         */
        getCommentsForReview: {
            (params?: RestEndpointMethodTypes["pulls"]["getCommentsForReview"]["parameters"]): Promise<RestEndpointMethodTypes["pulls"]["getCommentsForReview"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        getReview: {
            (params?: RestEndpointMethodTypes["pulls"]["getReview"]["parameters"]): Promise<RestEndpointMethodTypes["pulls"]["getReview"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * **Note:** Multi-line comments on pull requests are currently in public beta and subject to change.
         *
         * Provides details for a review comment.
         *
         * **Multi-line comment summary**
         *
         * **Note:** New parameters and response fields are available for developers to preview. During the preview period, these response fields may change without advance notice. Please see the [blog post](https://developer.github.com/changes/2019-10-03-multi-line-comments) for full details.
         *
         * Use the `comfort-fade` preview header and the `line` parameter to show multi-line comment-supported fields in the response.
         *
         * If you use the `comfort-fade` preview header, your response will show:
         *
         * *   For multi-line comments, values for `start_line`, `original_start_line`, `start_side`, `line`, `original_line`, and `side`.
         * *   For single-line comments, values for `line`, `original_line`, and `side` and a `null` value for `start_line`, `original_start_line`, and `start_side`.
         *
         * If you don't use the `comfort-fade` preview header, multi-line and single-line comments will appear the same way in the response with a single `position` attribute. Your response will show:
         *
         * *   For multi-line comments, the last line of the comment range for the `position` attribute.
         * *   For single-line comments, the diff-positioned way of referencing comments for the `position` attribute. For more information, see `position` in the [input parameters](https://developer.github.com/v3/pulls/comments/#parameters-2) table.
         *
         * The `reactions` key will have the following payload where `url` can be used to construct the API location for [listing and creating](https://developer.github.com/v3/reactions) reactions.
         */
        getReviewComment: {
            (params?: RestEndpointMethodTypes["pulls"]["getReviewComment"]["parameters"]): Promise<RestEndpointMethodTypes["pulls"]["getReviewComment"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Draft pull requests are available in public repositories with GitHub Free and GitHub Free for organizations, GitHub Pro, and legacy per-repository billing plans, and in public and private repositories with GitHub Team and GitHub Enterprise Cloud. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
         */
        list: {
            (params?: RestEndpointMethodTypes["pulls"]["list"]["parameters"]): Promise<RestEndpointMethodTypes["pulls"]["list"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * **Note:** Multi-line comments on pull requests are currently in public beta and subject to change.
         *
         * Lists all review comments for a pull request. By default, review comments are in ascending order by ID.
         *
         * **Multi-line comment summary**
         *
         * **Note:** New parameters and response fields are available for developers to preview. During the preview period, these response fields may change without advance notice. Please see the [blog post](https://developer.github.com/changes/2019-10-03-multi-line-comments) for full details.
         *
         * Use the `comfort-fade` preview header and the `line` parameter to show multi-line comment-supported fields in the response.
         *
         * If you use the `comfort-fade` preview header, your response will show:
         *
         * *   For multi-line comments, values for `start_line`, `original_start_line`, `start_side`, `line`, `original_line`, and `side`.
         * *   For single-line comments, values for `line`, `original_line`, and `side` and a `null` value for `start_line`, `original_start_line`, and `start_side`.
         *
         * If you don't use the `comfort-fade` preview header, multi-line and single-line comments will appear the same way in the response with a single `position` attribute. Your response will show:
         *
         * *   For multi-line comments, the last line of the comment range for the `position` attribute.
         * *   For single-line comments, the diff-positioned way of referencing comments for the `position` attribute. For more information, see `position` in the [input parameters](https://developer.github.com/v3/pulls/comments/#parameters-2) table.
         *
         * The `reactions` key will have the following payload where `url` can be used to construct the API location for [listing and creating](https://developer.github.com/v3/reactions) reactions.
         * @deprecated octokit.pulls.listComments() has been renamed to octokit.pulls.listReviewComments() (2020-06-05)
         */
        listComments: {
            (params?: RestEndpointMethodTypes["pulls"]["listComments"]["parameters"]): Promise<RestEndpointMethodTypes["pulls"]["listComments"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * **Note:** Multi-line comments on pull requests are currently in public beta and subject to change.
         *
         * Lists review comments for all pull requests in a repository. By default, review comments are in ascending order by ID.
         *
         * **Multi-line comment summary**
         *
         * **Note:** New parameters and response fields are available for developers to preview. During the preview period, these response fields may change without advance notice. Please see the [blog post](https://developer.github.com/changes/2019-10-03-multi-line-comments) for full details.
         *
         * Use the `comfort-fade` preview header and the `line` parameter to show multi-line comment-supported fields in the response.
         *
         * If you use the `comfort-fade` preview header, your response will show:
         *
         * *   For multi-line comments, values for `start_line`, `original_start_line`, `start_side`, `line`, `original_line`, and `side`.
         * *   For single-line comments, values for `line`, `original_line`, and `side` and a `null` value for `start_line`, `original_start_line`, and `start_side`.
         *
         * If you don't use the `comfort-fade` preview header, multi-line and single-line comments will appear the same way in the response with a single `position` attribute. Your response will show:
         *
         * *   For multi-line comments, the last line of the comment range for the `position` attribute.
         * *   For single-line comments, the diff-positioned way of referencing comments for the `position` attribute. For more information, see `position` in the [input parameters](https://developer.github.com/v3/pulls/comments/#parameters-2) table.
         *
         * The `reactions` key will have the following payload where `url` can be used to construct the API location for [listing and creating](https://developer.github.com/v3/reactions) reactions.
         * @deprecated octokit.pulls.listCommentsForRepo() has been renamed to octokit.pulls.listReviewCommentsForRepo() (2020-06-05)
         */
        listCommentsForRepo: {
            (params?: RestEndpointMethodTypes["pulls"]["listCommentsForRepo"]["parameters"]): Promise<RestEndpointMethodTypes["pulls"]["listCommentsForRepo"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * List comments for a specific pull request review.
         */
        listCommentsForReview: {
            (params?: RestEndpointMethodTypes["pulls"]["listCommentsForReview"]["parameters"]): Promise<RestEndpointMethodTypes["pulls"]["listCommentsForReview"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Lists a maximum of 250 commits for a pull request. To receive a complete commit list for pull requests with more than 250 commits, use the [List commits](https://developer.github.com/v3/repos/commits/#list-commits) endpoint.
         */
        listCommits: {
            (params?: RestEndpointMethodTypes["pulls"]["listCommits"]["parameters"]): Promise<RestEndpointMethodTypes["pulls"]["listCommits"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * **Note:** Responses include a maximum of 3000 files. The paginated response returns 30 files per page by default.
         */
        listFiles: {
            (params?: RestEndpointMethodTypes["pulls"]["listFiles"]["parameters"]): Promise<RestEndpointMethodTypes["pulls"]["listFiles"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        listRequestedReviewers: {
            (params?: RestEndpointMethodTypes["pulls"]["listRequestedReviewers"]["parameters"]): Promise<RestEndpointMethodTypes["pulls"]["listRequestedReviewers"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * **Note:** Multi-line comments on pull requests are currently in public beta and subject to change.
         *
         * Lists all review comments for a pull request. By default, review comments are in ascending order by ID.
         *
         * **Multi-line comment summary**
         *
         * **Note:** New parameters and response fields are available for developers to preview. During the preview period, these response fields may change without advance notice. Please see the [blog post](https://developer.github.com/changes/2019-10-03-multi-line-comments) for full details.
         *
         * Use the `comfort-fade` preview header and the `line` parameter to show multi-line comment-supported fields in the response.
         *
         * If you use the `comfort-fade` preview header, your response will show:
         *
         * *   For multi-line comments, values for `start_line`, `original_start_line`, `start_side`, `line`, `original_line`, and `side`.
         * *   For single-line comments, values for `line`, `original_line`, and `side` and a `null` value for `start_line`, `original_start_line`, and `start_side`.
         *
         * If you don't use the `comfort-fade` preview header, multi-line and single-line comments will appear the same way in the response with a single `position` attribute. Your response will show:
         *
         * *   For multi-line comments, the last line of the comment range for the `position` attribute.
         * *   For single-line comments, the diff-positioned way of referencing comments for the `position` attribute. For more information, see `position` in the [input parameters](https://developer.github.com/v3/pulls/comments/#parameters-2) table.
         *
         * The `reactions` key will have the following payload where `url` can be used to construct the API location for [listing and creating](https://developer.github.com/v3/reactions) reactions.
         */
        listReviewComments: {
            (params?: RestEndpointMethodTypes["pulls"]["listReviewComments"]["parameters"]): Promise<RestEndpointMethodTypes["pulls"]["listReviewComments"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * **Note:** Multi-line comments on pull requests are currently in public beta and subject to change.
         *
         * Lists review comments for all pull requests in a repository. By default, review comments are in ascending order by ID.
         *
         * **Multi-line comment summary**
         *
         * **Note:** New parameters and response fields are available for developers to preview. During the preview period, these response fields may change without advance notice. Please see the [blog post](https://developer.github.com/changes/2019-10-03-multi-line-comments) for full details.
         *
         * Use the `comfort-fade` preview header and the `line` parameter to show multi-line comment-supported fields in the response.
         *
         * If you use the `comfort-fade` preview header, your response will show:
         *
         * *   For multi-line comments, values for `start_line`, `original_start_line`, `start_side`, `line`, `original_line`, and `side`.
         * *   For single-line comments, values for `line`, `original_line`, and `side` and a `null` value for `start_line`, `original_start_line`, and `start_side`.
         *
         * If you don't use the `comfort-fade` preview header, multi-line and single-line comments will appear the same way in the response with a single `position` attribute. Your response will show:
         *
         * *   For multi-line comments, the last line of the comment range for the `position` attribute.
         * *   For single-line comments, the diff-positioned way of referencing comments for the `position` attribute. For more information, see `position` in the [input parameters](https://developer.github.com/v3/pulls/comments/#parameters-2) table.
         *
         * The `reactions` key will have the following payload where `url` can be used to construct the API location for [listing and creating](https://developer.github.com/v3/reactions) reactions.
         */
        listReviewCommentsForRepo: {
            (params?: RestEndpointMethodTypes["pulls"]["listReviewCommentsForRepo"]["parameters"]): Promise<RestEndpointMethodTypes["pulls"]["listReviewCommentsForRepo"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * @deprecated octokit.pulls.listReviewRequests() has been renamed to octokit.pulls.listRequestedReviewers() (2020-06-05)
         */
        listReviewRequests: {
            (params?: RestEndpointMethodTypes["pulls"]["listReviewRequests"]["parameters"]): Promise<RestEndpointMethodTypes["pulls"]["listReviewRequests"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * The list of reviews returns in chronological order.
         */
        listReviews: {
            (params?: RestEndpointMethodTypes["pulls"]["listReviews"]["parameters"]): Promise<RestEndpointMethodTypes["pulls"]["listReviews"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * This endpoint triggers [notifications](https://help.github.com/articles/about-notifications/). Creating content too quickly using this endpoint may result in abuse rate limiting. See "[Abuse rate limits](https://developer.github.com/v3/#abuse-rate-limits)" and "[Dealing with abuse rate limits](https://developer.github.com/v3/guides/best-practices-for-integrators/#dealing-with-abuse-rate-limits)" for details.
         */
        merge: {
            (params?: RestEndpointMethodTypes["pulls"]["merge"]["parameters"]): Promise<RestEndpointMethodTypes["pulls"]["merge"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        removeRequestedReviewers: {
            (params?: RestEndpointMethodTypes["pulls"]["removeRequestedReviewers"]["parameters"]): Promise<RestEndpointMethodTypes["pulls"]["removeRequestedReviewers"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * This endpoint triggers [notifications](https://help.github.com/articles/about-notifications/). Creating content too quickly using this endpoint may result in abuse rate limiting. See "[Abuse rate limits](https://developer.github.com/v3/#abuse-rate-limits)" and "[Dealing with abuse rate limits](https://developer.github.com/v3/guides/best-practices-for-integrators/#dealing-with-abuse-rate-limits)" for details.
         */
        requestReviewers: {
            (params?: RestEndpointMethodTypes["pulls"]["requestReviewers"]["parameters"]): Promise<RestEndpointMethodTypes["pulls"]["requestReviewers"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        submitReview: {
            (params?: RestEndpointMethodTypes["pulls"]["submitReview"]["parameters"]): Promise<RestEndpointMethodTypes["pulls"]["submitReview"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Draft pull requests are available in public repositories with GitHub Free and GitHub Free for organizations, GitHub Pro, and legacy per-repository billing plans, and in public and private repositories with GitHub Team and GitHub Enterprise Cloud. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
         *
         * To open or update a pull request in a public repository, you must have write access to the head or the source branch. For organization-owned repositories, you must be a member of the organization that owns the repository to open or update a pull request.
         */
        update: {
            (params?: RestEndpointMethodTypes["pulls"]["update"]["parameters"]): Promise<RestEndpointMethodTypes["pulls"]["update"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Updates the pull request branch with the latest upstream changes by merging HEAD from the base branch into the pull request branch.
         */
        updateBranch: {
            (params?: RestEndpointMethodTypes["pulls"]["updateBranch"]["parameters"]): Promise<RestEndpointMethodTypes["pulls"]["updateBranch"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * **Note:** Multi-line comments on pull requests are currently in public beta and subject to change.
         *
         * Enables you to edit a review comment.
         *
         * **Multi-line comment summary**
         *
         * **Note:** New parameters and response fields are available for developers to preview. During the preview period, these response fields may change without advance notice. Please see the [blog post](https://developer.github.com/changes/2019-10-03-multi-line-comments) for full details.
         *
         * Use the `comfort-fade` preview header and the `line` parameter to show multi-line comment-supported fields in the response.
         *
         * If you use the `comfort-fade` preview header, your response will show:
         *
         * *   For multi-line comments, values for `start_line`, `original_start_line`, `start_side`, `line`, `original_line`, and `side`.
         * *   For single-line comments, values for `line`, `original_line`, and `side` and a `null` value for `start_line`, `original_start_line`, and `start_side`.
         *
         * If you don't use the `comfort-fade` preview header, multi-line and single-line comments will appear the same way in the response with a single `position` attribute. Your response will show:
         *
         * *   For multi-line comments, the last line of the comment range for the `position` attribute.
         * *   For single-line comments, the diff-positioned way of referencing comments for the `position` attribute. For more information, see `position` in the [input parameters](https://developer.github.com/v3/pulls/comments/#parameters-2) table.
         * @deprecated octokit.pulls.updateComment() has been renamed to octokit.pulls.updateReviewComment() (2020-06-05)
         */
        updateComment: {
            (params?: RestEndpointMethodTypes["pulls"]["updateComment"]["parameters"]): Promise<RestEndpointMethodTypes["pulls"]["updateComment"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Update the review summary comment with new text.
         */
        updateReview: {
            (params?: RestEndpointMethodTypes["pulls"]["updateReview"]["parameters"]): Promise<RestEndpointMethodTypes["pulls"]["updateReview"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * **Note:** Multi-line comments on pull requests are currently in public beta and subject to change.
         *
         * Enables you to edit a review comment.
         *
         * **Multi-line comment summary**
         *
         * **Note:** New parameters and response fields are available for developers to preview. During the preview period, these response fields may change without advance notice. Please see the [blog post](https://developer.github.com/changes/2019-10-03-multi-line-comments) for full details.
         *
         * Use the `comfort-fade` preview header and the `line` parameter to show multi-line comment-supported fields in the response.
         *
         * If you use the `comfort-fade` preview header, your response will show:
         *
         * *   For multi-line comments, values for `start_line`, `original_start_line`, `start_side`, `line`, `original_line`, and `side`.
         * *   For single-line comments, values for `line`, `original_line`, and `side` and a `null` value for `start_line`, `original_start_line`, and `start_side`.
         *
         * If you don't use the `comfort-fade` preview header, multi-line and single-line comments will appear the same way in the response with a single `position` attribute. Your response will show:
         *
         * *   For multi-line comments, the last line of the comment range for the `position` attribute.
         * *   For single-line comments, the diff-positioned way of referencing comments for the `position` attribute. For more information, see `position` in the [input parameters](https://developer.github.com/v3/pulls/comments/#parameters-2) table.
         */
        updateReviewComment: {
            (params?: RestEndpointMethodTypes["pulls"]["updateReviewComment"]["parameters"]): Promise<RestEndpointMethodTypes["pulls"]["updateReviewComment"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
    };
    rateLimit: {
        /**
         * **Note:** Accessing this endpoint does not count against your REST API rate limit.
         *
         * **Understanding your rate limit status**
         *
         * The Search API has a [custom rate limit](https://developer.github.com/v3/search/#rate-limit), separate from the rate limit governing the rest of the REST API. The GraphQL API also has a [custom rate limit](https://developer.github.com/v4/guides/resource-limitations/#rate-limit) that is separate from and calculated differently than rate limits in the REST API.
         *
         * For these reasons, the Rate Limit API response categorizes your rate limit. Under `resources`, you'll see four objects:
         *
         * *   The `core` object provides your rate limit status for all non-search-related resources in the REST API.
         * *   The `search` object provides your rate limit status for the [Search API](https://developer.github.com/v3/search/).
         * *   The `graphql` object provides your rate limit status for the [GraphQL API](https://developer.github.com/v4/).
         * *   The `integration_manifest` object provides your rate limit status for the [GitHub App Manifest code conversion](https://developer.github.com/apps/building-github-apps/creating-github-apps-from-a-manifest/#3-you-exchange-the-temporary-code-to-retrieve-the-app-configuration) endpoint.
         *
         * For more information on the headers and values in the rate limit response, see "[Rate limiting](https://developer.github.com/v3/#rate-limiting)."
         *
         * The `rate` object (shown at the bottom of the response above) is deprecated.
         *
         * If you're writing new API client code or updating existing code, you should use the `core` object instead of the `rate` object. The `core` object contains the same information that is present in the `rate` object.
         */
        get: {
            (params?: RestEndpointMethodTypes["rateLimit"]["get"]["parameters"]): Promise<RestEndpointMethodTypes["rateLimit"]["get"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
    };
    reactions: {
        /**
         * Create a reaction to a [commit comment](https://developer.github.com/v3/repos/comments/). A response with a `Status: 200 OK` means that you already added the reaction type to this commit comment.
         */
        createForCommitComment: {
            (params?: RestEndpointMethodTypes["reactions"]["createForCommitComment"]["parameters"]): Promise<RestEndpointMethodTypes["reactions"]["createForCommitComment"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Create a reaction to an [issue](https://developer.github.com/v3/issues/). A response with a `Status: 200 OK` means that you already added the reaction type to this issue.
         */
        createForIssue: {
            (params?: RestEndpointMethodTypes["reactions"]["createForIssue"]["parameters"]): Promise<RestEndpointMethodTypes["reactions"]["createForIssue"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Create a reaction to an [issue comment](https://developer.github.com/v3/issues/comments/). A response with a `Status: 200 OK` means that you already added the reaction type to this issue comment.
         */
        createForIssueComment: {
            (params?: RestEndpointMethodTypes["reactions"]["createForIssueComment"]["parameters"]): Promise<RestEndpointMethodTypes["reactions"]["createForIssueComment"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Create a reaction to a [pull request review comment](https://developer.github.com/v3/pulls/comments/). A response with a `Status: 200 OK` means that you already added the reaction type to this pull request review comment.
         */
        createForPullRequestReviewComment: {
            (params?: RestEndpointMethodTypes["reactions"]["createForPullRequestReviewComment"]["parameters"]): Promise<RestEndpointMethodTypes["reactions"]["createForPullRequestReviewComment"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Create a reaction to a [team discussion comment](https://developer.github.com/v3/teams/discussion_comments/). OAuth access tokens require the `write:discussion` [scope](https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps/). A response with a `Status: 200 OK` means that you already added the reaction type to this team discussion comment.
         *
         * **Note:** You can also specify a team by `org_id` and `team_id` using the route `POST /organizations/:org_id/team/:team_id/discussions/:discussion_number/comments/:comment_number/reactions`.
         */
        createForTeamDiscussionCommentInOrg: {
            (params?: RestEndpointMethodTypes["reactions"]["createForTeamDiscussionCommentInOrg"]["parameters"]): Promise<RestEndpointMethodTypes["reactions"]["createForTeamDiscussionCommentInOrg"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Create a reaction to a [team discussion](https://developer.github.com/v3/teams/discussions/). OAuth access tokens require the `write:discussion` [scope](https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps/). A response with a `Status: 200 OK` means that you already added the reaction type to this team discussion.
         *
         * **Note:** You can also specify a team by `org_id` and `team_id` using the route `POST /organizations/:org_id/team/:team_id/discussions/:discussion_number/reactions`.
         */
        createForTeamDiscussionInOrg: {
            (params?: RestEndpointMethodTypes["reactions"]["createForTeamDiscussionInOrg"]["parameters"]): Promise<RestEndpointMethodTypes["reactions"]["createForTeamDiscussionInOrg"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * **Deprecation Notice:** This endpoint route is deprecated and will be removed from the Reactions API. We recommend migrating your existing code to use the new delete reactions endpoints. For more information, see this [blog post](https://developer.github.com/changes/2020-02-26-new-delete-reactions-endpoints/).
         *
         * OAuth access tokens require the `write:discussion` [scope](https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps/), when deleting a [team discussion](https://developer.github.com/v3/teams/discussions/) or [team discussion comment](https://developer.github.com/v3/teams/discussion_comments/).
         * @deprecated octokit.reactions.delete() is deprecated, see https://developer.github.com/v3/reactions/#delete-a-reaction-legacy
         */
        delete: {
            (params?: RestEndpointMethodTypes["reactions"]["delete"]["parameters"]): Promise<RestEndpointMethodTypes["reactions"]["delete"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * **Note:** You can also specify a repository by `repository_id` using the route `DELETE /repositories/:repository_id/comments/:comment_id/reactions/:reaction_id`.
         *
         * Delete a reaction to a [commit comment](https://developer.github.com/v3/repos/comments/).
         */
        deleteForCommitComment: {
            (params?: RestEndpointMethodTypes["reactions"]["deleteForCommitComment"]["parameters"]): Promise<RestEndpointMethodTypes["reactions"]["deleteForCommitComment"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * **Note:** You can also specify a repository by `repository_id` using the route `DELETE /repositories/:repository_id/issues/:issue_number/reactions/:reaction_id`.
         *
         * Delete a reaction to an [issue](https://developer.github.com/v3/issues/).
         */
        deleteForIssue: {
            (params?: RestEndpointMethodTypes["reactions"]["deleteForIssue"]["parameters"]): Promise<RestEndpointMethodTypes["reactions"]["deleteForIssue"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * **Note:** You can also specify a repository by `repository_id` using the route `DELETE delete /repositories/:repository_id/issues/comments/:comment_id/reactions/:reaction_id`.
         *
         * Delete a reaction to an [issue comment](https://developer.github.com/v3/issues/comments/).
         */
        deleteForIssueComment: {
            (params?: RestEndpointMethodTypes["reactions"]["deleteForIssueComment"]["parameters"]): Promise<RestEndpointMethodTypes["reactions"]["deleteForIssueComment"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * **Note:** You can also specify a repository by `repository_id` using the route `DELETE /repositories/:repository_id/pulls/comments/:comment_id/reactions/:reaction_id.`
         *
         * Delete a reaction to a [pull request review comment](https://developer.github.com/v3/pulls/comments/).
         */
        deleteForPullRequestComment: {
            (params?: RestEndpointMethodTypes["reactions"]["deleteForPullRequestComment"]["parameters"]): Promise<RestEndpointMethodTypes["reactions"]["deleteForPullRequestComment"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * **Note:** You can also specify a team or organization with `team_id` and `org_id` using the route `DELETE /organizations/:org_id/team/:team_id/discussions/:discussion_number/reactions/:reaction_id`.
         *
         * Delete a reaction to a [team discussion](https://developer.github.com/v3/teams/discussions/). OAuth access tokens require the `write:discussion` [scope](https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps/).
         */
        deleteForTeamDiscussion: {
            (params?: RestEndpointMethodTypes["reactions"]["deleteForTeamDiscussion"]["parameters"]): Promise<RestEndpointMethodTypes["reactions"]["deleteForTeamDiscussion"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * **Note:** You can also specify a team or organization with `team_id` and `org_id` using the route `DELETE /organizations/:org_id/team/:team_id/discussions/:discussion_number/comments/:comment_number/reactions/:reaction_id`.
         *
         * Delete a reaction to a [team discussion comment](https://developer.github.com/v3/teams/discussion_comments/). OAuth access tokens require the `write:discussion` [scope](https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps/).
         */
        deleteForTeamDiscussionComment: {
            (params?: RestEndpointMethodTypes["reactions"]["deleteForTeamDiscussionComment"]["parameters"]): Promise<RestEndpointMethodTypes["reactions"]["deleteForTeamDiscussionComment"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * **Deprecation Notice:** This endpoint route is deprecated and will be removed from the Reactions API. We recommend migrating your existing code to use the new delete reactions endpoints. For more information, see this [blog post](https://developer.github.com/changes/2020-02-26-new-delete-reactions-endpoints/).
         *
         * OAuth access tokens require the `write:discussion` [scope](https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps/), when deleting a [team discussion](https://developer.github.com/v3/teams/discussions/) or [team discussion comment](https://developer.github.com/v3/teams/discussion_comments/).
         * @deprecated octokit.reactions.deleteLegacy() is deprecated, see https://developer.github.com/v3/reactions/#delete-a-reaction-legacy
         */
        deleteLegacy: {
            (params?: RestEndpointMethodTypes["reactions"]["deleteLegacy"]["parameters"]): Promise<RestEndpointMethodTypes["reactions"]["deleteLegacy"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * List the reactions to a [commit comment](https://developer.github.com/v3/repos/comments/).
         */
        listForCommitComment: {
            (params?: RestEndpointMethodTypes["reactions"]["listForCommitComment"]["parameters"]): Promise<RestEndpointMethodTypes["reactions"]["listForCommitComment"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * List the reactions to an [issue](https://developer.github.com/v3/issues/).
         */
        listForIssue: {
            (params?: RestEndpointMethodTypes["reactions"]["listForIssue"]["parameters"]): Promise<RestEndpointMethodTypes["reactions"]["listForIssue"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * List the reactions to an [issue comment](https://developer.github.com/v3/issues/comments/).
         */
        listForIssueComment: {
            (params?: RestEndpointMethodTypes["reactions"]["listForIssueComment"]["parameters"]): Promise<RestEndpointMethodTypes["reactions"]["listForIssueComment"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * List the reactions to a [pull request review comment](https://developer.github.com/v3/pulls/comments/).
         */
        listForPullRequestReviewComment: {
            (params?: RestEndpointMethodTypes["reactions"]["listForPullRequestReviewComment"]["parameters"]): Promise<RestEndpointMethodTypes["reactions"]["listForPullRequestReviewComment"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * List the reactions to a [team discussion comment](https://developer.github.com/v3/teams/discussion_comments/). OAuth access tokens require the `read:discussion` [scope](https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps/).
         *
         * **Note:** You can also specify a team by `org_id` and `team_id` using the route `GET /organizations/:org_id/team/:team_id/discussions/:discussion_number/comments/:comment_number/reactions`.
         */
        listForTeamDiscussionCommentInOrg: {
            (params?: RestEndpointMethodTypes["reactions"]["listForTeamDiscussionCommentInOrg"]["parameters"]): Promise<RestEndpointMethodTypes["reactions"]["listForTeamDiscussionCommentInOrg"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * List the reactions to a [team discussion](https://developer.github.com/v3/teams/discussions/). OAuth access tokens require the `read:discussion` [scope](https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps/).
         *
         * **Note:** You can also specify a team by `org_id` and `team_id` using the route `GET /organizations/:org_id/team/:team_id/discussions/:discussion_number/reactions`.
         */
        listForTeamDiscussionInOrg: {
            (params?: RestEndpointMethodTypes["reactions"]["listForTeamDiscussionInOrg"]["parameters"]): Promise<RestEndpointMethodTypes["reactions"]["listForTeamDiscussionInOrg"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
    };
    repos: {
        acceptInvitation: {
            (params?: RestEndpointMethodTypes["repos"]["acceptInvitation"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["acceptInvitation"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
         *
         * Grants the specified apps push access for this branch. Only installed GitHub Apps with `write` access to the `contents` permission can be added as authorized actors on a protected branch.
         *
         * | Type    | Description                                                                                                                                                |
         * | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
         * | `array` | The GitHub Apps that have push access to this branch. Use the app's `slug`. **Note**: The list of users, apps, and teams in total is limited to 100 items. |
         */
        addAppAccessRestrictions: {
            (params?: RestEndpointMethodTypes["repos"]["addAppAccessRestrictions"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["addAppAccessRestrictions"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * This endpoint triggers [notifications](https://help.github.com/articles/about-notifications/). Creating content too quickly using this endpoint may result in abuse rate limiting. See "[Abuse rate limits](https://developer.github.com/v3/#abuse-rate-limits)" and "[Dealing with abuse rate limits](https://developer.github.com/v3/guides/best-practices-for-integrators/#dealing-with-abuse-rate-limits)" for details.
         *
         * For more information the permission levels, see "[Repository permission levels for an organization](https://help.github.com/en/github/setting-up-and-managing-organizations-and-teams/repository-permission-levels-for-an-organization#permission-levels-for-repositories-owned-by-an-organization)" in the GitHub Help documentation.
         *
         * Note that, if you choose not to pass any parameters, you'll need to set `Content-Length` to zero when calling out to this endpoint. For more information, see "[HTTP verbs](https://developer.github.com/v3/#http-verbs)."
         *
         * The invitee will receive a notification that they have been invited to the repository, which they must accept or decline. They may do this via the notifications page, the email they receive, or by using the [repository invitations API endpoints](https://developer.github.com/v3/repos/invitations/).
         *
         * **Rate limits**
         *
         * To prevent abuse, you are limited to sending 50 invitations to a repository per 24 hour period. Note there is no limit if you are inviting organization members to an organization repository.
         */
        addCollaborator: {
            (params?: RestEndpointMethodTypes["repos"]["addCollaborator"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["addCollaborator"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Here's how you can create a read-only deploy key:
         * @deprecated octokit.repos.addDeployKey() has been renamed to octokit.repos.createDeployKey() (2020-06-04)
         */
        addDeployKey: {
            (params?: RestEndpointMethodTypes["repos"]["addDeployKey"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["addDeployKey"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
         *
         * Adding admin enforcement requires admin or owner permissions to the repository and branch protection to be enabled.
         * @deprecated octokit.repos.addProtectedBranchAdminEnforcement() has been renamed to octokit.repos.setAdminBranchProtection() (2020-06-04)
         */
        addProtectedBranchAdminEnforcement: {
            (params?: RestEndpointMethodTypes["repos"]["addProtectedBranchAdminEnforcement"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["addProtectedBranchAdminEnforcement"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
         *
         * Grants the specified apps push access for this branch. Only installed GitHub Apps with `write` access to the `contents` permission can be added as authorized actors on a protected branch.
         *
         * | Type    | Description                                                                                                                                                |
         * | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
         * | `array` | The GitHub Apps that have push access to this branch. Use the app's `slug`. **Note**: The list of users, apps, and teams in total is limited to 100 items. |
         * @deprecated octokit.repos.addProtectedBranchAppRestrictions() has been renamed to octokit.repos.addAppAccessRestrictions() (2020-06-04)
         */
        addProtectedBranchAppRestrictions: {
            (params?: RestEndpointMethodTypes["repos"]["addProtectedBranchAppRestrictions"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["addProtectedBranchAppRestrictions"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
         *
         * When authenticated with admin or owner permissions to the repository, you can use this endpoint to require signed commits on a branch. You must enable branch protection to require signed commits.
         * @deprecated octokit.repos.addProtectedBranchRequiredSignatures() has been renamed to octokit.repos.createCommitSignatureProtection() (2020-06-04)
         */
        addProtectedBranchRequiredSignatures: {
            (params?: RestEndpointMethodTypes["repos"]["addProtectedBranchRequiredSignatures"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["addProtectedBranchRequiredSignatures"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
         * @deprecated octokit.repos.addProtectedBranchRequiredStatusChecksContexts() has been renamed to octokit.repos.addStatusCheckContexts() (2020-06-04)
         */
        addProtectedBranchRequiredStatusChecksContexts: {
            (params?: RestEndpointMethodTypes["repos"]["addProtectedBranchRequiredStatusChecksContexts"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["addProtectedBranchRequiredStatusChecksContexts"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
         *
         * Grants the specified teams push access for this branch. You can also give push access to child teams.
         *
         * | Type    | Description                                                                                                                                |
         * | ------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
         * | `array` | The teams that can have push access. Use the team's `slug`. **Note**: The list of users, apps, and teams in total is limited to 100 items. |
         * @deprecated octokit.repos.addProtectedBranchTeamRestrictions() has been renamed to octokit.repos.addTeamAccessRestrictions() (2020-06-04)
         */
        addProtectedBranchTeamRestrictions: {
            (params?: RestEndpointMethodTypes["repos"]["addProtectedBranchTeamRestrictions"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["addProtectedBranchTeamRestrictions"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
         *
         * Grants the specified people push access for this branch.
         *
         * | Type    | Description                                                                                                                   |
         * | ------- | ----------------------------------------------------------------------------------------------------------------------------- |
         * | `array` | Usernames for people who can have push access. **Note**: The list of users, apps, and teams in total is limited to 100 items. |
         * @deprecated octokit.repos.addProtectedBranchUserRestrictions() has been renamed to octokit.repos.addUserAccessRestrictions() (2020-06-04)
         */
        addProtectedBranchUserRestrictions: {
            (params?: RestEndpointMethodTypes["repos"]["addProtectedBranchUserRestrictions"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["addProtectedBranchUserRestrictions"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
         */
        addStatusCheckContexts: {
            (params?: RestEndpointMethodTypes["repos"]["addStatusCheckContexts"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["addStatusCheckContexts"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
         *
         * Grants the specified teams push access for this branch. You can also give push access to child teams.
         *
         * | Type    | Description                                                                                                                                |
         * | ------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
         * | `array` | The teams that can have push access. Use the team's `slug`. **Note**: The list of users, apps, and teams in total is limited to 100 items. |
         */
        addTeamAccessRestrictions: {
            (params?: RestEndpointMethodTypes["repos"]["addTeamAccessRestrictions"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["addTeamAccessRestrictions"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
         *
         * Grants the specified people push access for this branch.
         *
         * | Type    | Description                                                                                                                   |
         * | ------- | ----------------------------------------------------------------------------------------------------------------------------- |
         * | `array` | Usernames for people who can have push access. **Note**: The list of users, apps, and teams in total is limited to 100 items. |
         */
        addUserAccessRestrictions: {
            (params?: RestEndpointMethodTypes["repos"]["addUserAccessRestrictions"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["addUserAccessRestrictions"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * For organization-owned repositories, the list of collaborators includes outside collaborators, organization members that are direct collaborators, organization members with access through team memberships, organization members with access through default organization permissions, and organization owners.
         *
         * Team members will include the members of child teams.
         */
        checkCollaborator: {
            (params?: RestEndpointMethodTypes["repos"]["checkCollaborator"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["checkCollaborator"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Shows whether dependency alerts are enabled or disabled for a repository. The authenticated user must have admin access to the repository. For more information, see "[About security alerts for vulnerable dependencies](https://help.github.com/en/articles/about-security-alerts-for-vulnerable-dependencies)" in the GitHub Help documentation.
         */
        checkVulnerabilityAlerts: {
            (params?: RestEndpointMethodTypes["repos"]["checkVulnerabilityAlerts"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["checkVulnerabilityAlerts"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Both `:base` and `:head` must be branch names in `:repo`. To compare branches across other repositories in the same network as `:repo`, use the format `<USERNAME>:branch`.
         *
         * The response from the API is equivalent to running the `git log base..head` command; however, commits are returned in chronological order. Pass the appropriate [media type](https://developer.github.com/v3/media/#commits-commit-comparison-and-pull-requests) to fetch diff and patch formats.
         *
         * The response also includes details on the files that were changed between the two commits. This includes the status of the change (for example, if a file was added, removed, modified, or renamed), and details of the change itself. For example, files with a `renamed` status have a `previous_filename` field showing the previous filename of the file, and files with a `modified` status have a `patch` field showing the changes made to the file.
         *
         * **Working with large comparisons**
         *
         * The response will include a comparison of up to 250 commits. If you are working with a larger commit range, you can use the [List commits](https://developer.github.com/v3/repos/commits/#list-commits) to enumerate all commits in the range.
         *
         * For comparisons with extremely large diffs, you may receive an error response indicating that the diff took too long to generate. You can typically resolve this error by using a smaller commit range.
         *
         * **Signature verification object**
         *
         * The response will include a `verification` object that describes the result of verifying the commit's signature. The following fields are included in the `verification` object:
         *
         * These are the possible values for `reason` in the `verification` object:
         *
         * | Value                    | Description                                                                                                                       |
         * | ------------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
         * | `expired_key`            | The key that made the signature is expired.                                                                                       |
         * | `not_signing_key`        | The "signing" flag is not among the usage flags in the GPG key that made the signature.                                           |
         * | `gpgverify_error`        | There was an error communicating with the signature verification service.                                                         |
         * | `gpgverify_unavailable`  | The signature verification service is currently unavailable.                                                                      |
         * | `unsigned`               | The object does not include a signature.                                                                                          |
         * | `unknown_signature_type` | A non-PGP signature was found in the commit.                                                                                      |
         * | `no_user`                | No user was associated with the `committer` email address in the commit.                                                          |
         * | `unverified_email`       | The `committer` email address in the commit was associated with a user, but the email address is not verified on her/his account. |
         * | `bad_email`              | The `committer` email address in the commit is not included in the identities of the PGP key that made the signature.             |
         * | `unknown_key`            | The key that made the signature has not been registered with any user's account.                                                  |
         * | `malformed_signature`    | There was an error parsing the signature.                                                                                         |
         * | `invalid`                | The signature could not be cryptographically verified using the key whose key-id was found in the signature.                      |
         * | `valid`                  | None of the above errors applied, so the signature is considered to be verified.                                                  |
         */
        compareCommits: {
            (params?: RestEndpointMethodTypes["repos"]["compareCommits"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["compareCommits"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Create a comment for a commit using its `:commit_sha`.
         *
         * This endpoint triggers [notifications](https://help.github.com/articles/about-notifications/). Creating content too quickly using this endpoint may result in abuse rate limiting. See "[Abuse rate limits](https://developer.github.com/v3/#abuse-rate-limits)" and "[Dealing with abuse rate limits](https://developer.github.com/v3/guides/best-practices-for-integrators/#dealing-with-abuse-rate-limits)" for details.
         */
        createCommitComment: {
            (params?: RestEndpointMethodTypes["repos"]["createCommitComment"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["createCommitComment"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
         *
         * When authenticated with admin or owner permissions to the repository, you can use this endpoint to require signed commits on a branch. You must enable branch protection to require signed commits.
         */
        createCommitSignatureProtection: {
            (params?: RestEndpointMethodTypes["repos"]["createCommitSignatureProtection"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["createCommitSignatureProtection"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Users with push access in a repository can create commit statuses for a given SHA.
         *
         * Note: there is a limit of 1000 statuses per `sha` and `context` within a repository. Attempts to create more than 1000 statuses will result in a validation error.
         */
        createCommitStatus: {
            (params?: RestEndpointMethodTypes["repos"]["createCommitStatus"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["createCommitStatus"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Here's how you can create a read-only deploy key:
         */
        createDeployKey: {
            (params?: RestEndpointMethodTypes["repos"]["createDeployKey"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["createDeployKey"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Deployments offer a few configurable parameters with sane defaults.
         *
         * The `ref` parameter can be any named branch, tag, or SHA. At GitHub we often deploy branches and verify them before we merge a pull request.
         *
         * The `environment` parameter allows deployments to be issued to different runtime environments. Teams often have multiple environments for verifying their applications, such as `production`, `staging`, and `qa`. This parameter makes it easier to track which environments have requested deployments. The default environment is `production`.
         *
         * The `auto_merge` parameter is used to ensure that the requested ref is not behind the repository's default branch. If the ref _is_ behind the default branch for the repository, we will attempt to merge it for you. If the merge succeeds, the API will return a successful merge commit. If merge conflicts prevent the merge from succeeding, the API will return a failure response.
         *
         * By default, [commit statuses](https://developer.github.com/v3/repos/statuses) for every submitted context must be in a `success` state. The `required_contexts` parameter allows you to specify a subset of contexts that must be `success`, or to specify contexts that have not yet been submitted. You are not required to use commit statuses to deploy. If you do not require any contexts or create any commit statuses, the deployment will always succeed.
         *
         * The `payload` parameter is available for any extra information that a deployment system might need. It is a JSON text field that will be passed on when a deployment event is dispatched.
         *
         * The `task` parameter is used by the deployment system to allow different execution paths. In the web world this might be `deploy:migrations` to run schema changes on the system. In the compiled world this could be a flag to compile an application with debugging enabled.
         *
         * Users with `repo` or `repo_deployment` scopes can create a deployment for a given ref:
         *
         * A simple example putting the user and room into the payload to notify back to chat networks.
         *
         * A more advanced example specifying required commit statuses and bypassing auto-merging.
         *
         * You will see this response when GitHub automatically merges the base branch into the topic branch instead of creating a deployment. This auto-merge happens when:
         *
         * *   Auto-merge option is enabled in the repository
         * *   Topic branch does not include the latest changes on the base branch, which is `master` in the response example
         * *   There are no merge conflicts
         *
         * If there are no new commits in the base branch, a new request to create a deployment should give a successful response.
         *
         * This error happens when the `auto_merge` option is enabled and when the default branch (in this case `master`), can't be merged into the branch that's being deployed (in this case `topic-branch`), due to merge conflicts.
         *
         * This error happens when the `required_contexts` parameter indicates that one or more contexts need to have a `success` status for the commit to be deployed, but one or more of the required contexts do not have a state of `success`.
         */
        createDeployment: {
            (params?: RestEndpointMethodTypes["repos"]["createDeployment"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["createDeployment"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Users with `push` access can create deployment statuses for a given deployment.
         *
         * GitHub Apps require `read & write` access to "Deployments" and `read-only` access to "Repo contents" (for private repos). OAuth Apps require the `repo_deployment` scope.
         */
        createDeploymentStatus: {
            (params?: RestEndpointMethodTypes["repos"]["createDeploymentStatus"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["createDeploymentStatus"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * You can use this endpoint to trigger a webhook event called `repository_dispatch` when you want activity that happens outside of GitHub to trigger a GitHub Actions workflow or GitHub App webhook. You must configure your GitHub Actions workflow or GitHub App to run when the `repository_dispatch` event occurs. For an example `repository_dispatch` webhook payload, see "[RepositoryDispatchEvent](https://developer.github.com/webhooks/event-payloads/#repository_dispatch)."
         *
         * The `client_payload` parameter is available for any extra information that your workflow might need. This parameter is a JSON payload that will be passed on when the webhook event is dispatched. For example, the `client_payload` can include a message that a user would like to send using a GitHub Actions workflow. Or the `client_payload` can be used as a test to debug your workflow. For a test example, see the [input example](https://developer.github.com/v3/repos/#example-4).
         *
         * To give you write access to the repository, you must use a personal access token with the `repo` scope. For more information, see "[Creating a personal access token for the command line](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line)" in the GitHub Help documentation.
         *
         * This input example shows how you can use the `client_payload` as a test to debug your workflow.
         */
        createDispatchEvent: {
            (params?: RestEndpointMethodTypes["repos"]["createDispatchEvent"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["createDispatchEvent"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Creates a new repository for the authenticated user.
         *
         * **OAuth scope requirements**
         *
         * When using [OAuth](https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps/), authorizations must include:
         *
         * *   `public_repo` scope or `repo` scope to create a public repository
         * *   `repo` scope to create a private repository
         */
        createForAuthenticatedUser: {
            (params?: RestEndpointMethodTypes["repos"]["createForAuthenticatedUser"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["createForAuthenticatedUser"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Create a fork for the authenticated user.
         *
         * **Note**: Forking a Repository happens asynchronously. You may have to wait a short period of time before you can access the git objects. If this takes longer than 5 minutes, be sure to contact [GitHub Support](https://github.com/contact) or [GitHub Premium Support](https://premium.githubsupport.com).
         */
        createFork: {
            (params?: RestEndpointMethodTypes["repos"]["createFork"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["createFork"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Repositories can have multiple webhooks installed. Each webhook should have a unique `config`. Multiple webhooks can share the same `config` as long as those webhooks do not have any `events` that overlap.
         *
         * Here's how you can create a hook that posts payloads in JSON format:
         * @deprecated octokit.repos.createHook() has been renamed to octokit.repos.createWebhook() (2020-06-04)
         */
        createHook: {
            (params?: RestEndpointMethodTypes["repos"]["createHook"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["createHook"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Creates a new repository in the specified organization. The authenticated user must be a member of the organization.
         *
         * **OAuth scope requirements**
         *
         * When using [OAuth](https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps/), authorizations must include:
         *
         * *   `public_repo` scope or `repo` scope to create a public repository
         * *   `repo` scope to create a private repository
         */
        createInOrg: {
            (params?: RestEndpointMethodTypes["repos"]["createInOrg"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["createInOrg"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Creates a new file or replaces an existing file in a repository.
         * @deprecated octokit.repos.createOrUpdateFile() has been renamed to octokit.repos.createOrUpdateFileContents() (2020-06-04)
         */
        createOrUpdateFile: {
            (params?: RestEndpointMethodTypes["repos"]["createOrUpdateFile"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["createOrUpdateFile"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Creates a new file or replaces an existing file in a repository.
         */
        createOrUpdateFileContents: {
            (params?: RestEndpointMethodTypes["repos"]["createOrUpdateFileContents"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["createOrUpdateFileContents"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        createPagesSite: {
            (params?: RestEndpointMethodTypes["repos"]["createPagesSite"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["createPagesSite"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Users with push access to the repository can create a release.
         *
         * This endpoint triggers [notifications](https://help.github.com/articles/about-notifications/). Creating content too quickly using this endpoint may result in abuse rate limiting. See "[Abuse rate limits](https://developer.github.com/v3/#abuse-rate-limits)" and "[Dealing with abuse rate limits](https://developer.github.com/v3/guides/best-practices-for-integrators/#dealing-with-abuse-rate-limits)" for details.
         */
        createRelease: {
            (params?: RestEndpointMethodTypes["repos"]["createRelease"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["createRelease"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Users with push access in a repository can create commit statuses for a given SHA.
         *
         * Note: there is a limit of 1000 statuses per `sha` and `context` within a repository. Attempts to create more than 1000 statuses will result in a validation error.
         * @deprecated octokit.repos.createStatus() has been renamed to octokit.repos.createCommitStatus() (2020-06-04)
         */
        createStatus: {
            (params?: RestEndpointMethodTypes["repos"]["createStatus"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["createStatus"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Creates a new repository using a repository template. Use the `template_owner` and `template_repo` route parameters to specify the repository to use as the template. The authenticated user must own or be a member of an organization that owns the repository. To check if a repository is available to use as a template, get the repository's information using the [Get a repository](https://developer.github.com/v3/repos/#get-a-repository) endpoint and check that the `is_template` key is `true`.
         *
         * **OAuth scope requirements**
         *
         * When using [OAuth](https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps/), authorizations must include:
         *
         * *   `public_repo` scope or `repo` scope to create a public repository
         * *   `repo` scope to create a private repository
         */
        createUsingTemplate: {
            (params?: RestEndpointMethodTypes["repos"]["createUsingTemplate"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["createUsingTemplate"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Repositories can have multiple webhooks installed. Each webhook should have a unique `config`. Multiple webhooks can share the same `config` as long as those webhooks do not have any `events` that overlap.
         *
         * Here's how you can create a hook that posts payloads in JSON format:
         */
        createWebhook: {
            (params?: RestEndpointMethodTypes["repos"]["createWebhook"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["createWebhook"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        declineInvitation: {
            (params?: RestEndpointMethodTypes["repos"]["declineInvitation"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["declineInvitation"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Deleting a repository requires admin access. If OAuth is used, the `delete_repo` scope is required.
         *
         * If an organization owner has configured the organization to prevent members from deleting organization-owned repositories, a member will get this response:
         */
        delete: {
            (params?: RestEndpointMethodTypes["repos"]["delete"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["delete"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
         *
         * Disables the ability to restrict who can push to this branch.
         */
        deleteAccessRestrictions: {
            (params?: RestEndpointMethodTypes["repos"]["deleteAccessRestrictions"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["deleteAccessRestrictions"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
         *
         * Removing admin enforcement requires admin or owner permissions to the repository and branch protection to be enabled.
         */
        deleteAdminBranchProtection: {
            (params?: RestEndpointMethodTypes["repos"]["deleteAdminBranchProtection"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["deleteAdminBranchProtection"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
         */
        deleteBranchProtection: {
            (params?: RestEndpointMethodTypes["repos"]["deleteBranchProtection"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["deleteBranchProtection"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        deleteCommitComment: {
            (params?: RestEndpointMethodTypes["repos"]["deleteCommitComment"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["deleteCommitComment"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
         *
         * When authenticated with admin or owner permissions to the repository, you can use this endpoint to disable required signed commits on a branch. You must enable branch protection to require signed commits.
         */
        deleteCommitSignatureProtection: {
            (params?: RestEndpointMethodTypes["repos"]["deleteCommitSignatureProtection"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["deleteCommitSignatureProtection"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        deleteDeployKey: {
            (params?: RestEndpointMethodTypes["repos"]["deleteDeployKey"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["deleteDeployKey"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * To ensure there can always be an active deployment, you can only delete an _inactive_ deployment. Anyone with `repo` or `repo_deployment` scopes can delete an inactive deployment.
         *
         * To set a deployment as inactive, you must:
         *
         * *   Create a new deployment that is active so that the system has a record of the current state, then delete the previously active deployment.
         * *   Mark the active deployment as inactive by adding any non-successful deployment status.
         *
         * For more information, see "[Create a deployment](https://developer.github.com/v3/repos/deployments/#create-a-deployment)" and "[Create a deployment status](https://developer.github.com/v3/repos/deployments/#create-a-deployment-status)."
         */
        deleteDeployment: {
            (params?: RestEndpointMethodTypes["repos"]["deleteDeployment"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["deleteDeployment"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        deleteDownload: {
            (params?: RestEndpointMethodTypes["repos"]["deleteDownload"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["deleteDownload"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Deletes a file in a repository.
         *
         * You can provide an additional `committer` parameter, which is an object containing information about the committer. Or, you can provide an `author` parameter, which is an object containing information about the author.
         *
         * The `author` section is optional and is filled in with the `committer` information if omitted. If the `committer` information is omitted, the authenticated user's information is used.
         *
         * You must provide values for both `name` and `email`, whether you choose to use `author` or `committer`. Otherwise, you'll receive a `422` status code.
         */
        deleteFile: {
            (params?: RestEndpointMethodTypes["repos"]["deleteFile"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["deleteFile"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * @deprecated octokit.repos.deleteHook() has been renamed to octokit.repos.deleteWebhook() (2020-06-04)
         */
        deleteHook: {
            (params?: RestEndpointMethodTypes["repos"]["deleteHook"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["deleteHook"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        deleteInvitation: {
            (params?: RestEndpointMethodTypes["repos"]["deleteInvitation"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["deleteInvitation"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        deletePagesSite: {
            (params?: RestEndpointMethodTypes["repos"]["deletePagesSite"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["deletePagesSite"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
         */
        deletePullRequestReviewProtection: {
            (params?: RestEndpointMethodTypes["repos"]["deletePullRequestReviewProtection"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["deletePullRequestReviewProtection"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Users with push access to the repository can delete a release.
         */
        deleteRelease: {
            (params?: RestEndpointMethodTypes["repos"]["deleteRelease"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["deleteRelease"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        deleteReleaseAsset: {
            (params?: RestEndpointMethodTypes["repos"]["deleteReleaseAsset"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["deleteReleaseAsset"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        deleteWebhook: {
            (params?: RestEndpointMethodTypes["repos"]["deleteWebhook"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["deleteWebhook"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Disables automated security fixes for a repository. The authenticated user must have admin access to the repository. For more information, see "[Configuring automated security fixes](https://help.github.com/en/articles/configuring-automated-security-fixes)" in the GitHub Help documentation.
         */
        disableAutomatedSecurityFixes: {
            (params?: RestEndpointMethodTypes["repos"]["disableAutomatedSecurityFixes"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["disableAutomatedSecurityFixes"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * @deprecated octokit.repos.disablePagesSite() has been renamed to octokit.repos.deletePagesSite() (2020-06-04)
         */
        disablePagesSite: {
            (params?: RestEndpointMethodTypes["repos"]["disablePagesSite"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["disablePagesSite"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Disables dependency alerts and the dependency graph for a repository. The authenticated user must have admin access to the repository. For more information, see "[About security alerts for vulnerable dependencies](https://help.github.com/en/articles/about-security-alerts-for-vulnerable-dependencies)" in the GitHub Help documentation.
         */
        disableVulnerabilityAlerts: {
            (params?: RestEndpointMethodTypes["repos"]["disableVulnerabilityAlerts"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["disableVulnerabilityAlerts"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Gets a redirect URL to download an archive for a repository. The `:archive_format` can be either `tarball` or `zipball`. The `:ref` must be a valid Git reference. If you omit `:ref`, the repository’s default branch (usually `master`) will be used. Please make sure your HTTP framework is configured to follow redirects or you will need to use the `Location` header to make a second `GET` request.
         *
         * _Note_: For private repositories, these links are temporary and expire after five minutes.
         *
         * To follow redirects with curl, use the `-L` switch:
         */
        downloadArchive: {
            (params?: RestEndpointMethodTypes["repos"]["downloadArchive"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["downloadArchive"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Enables automated security fixes for a repository. The authenticated user must have admin access to the repository. For more information, see "[Configuring automated security fixes](https://help.github.com/en/articles/configuring-automated-security-fixes)" in the GitHub Help documentation.
         */
        enableAutomatedSecurityFixes: {
            (params?: RestEndpointMethodTypes["repos"]["enableAutomatedSecurityFixes"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["enableAutomatedSecurityFixes"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * @deprecated octokit.repos.enablePagesSite() has been renamed to octokit.repos.createPagesSite() (2020-06-04)
         */
        enablePagesSite: {
            (params?: RestEndpointMethodTypes["repos"]["enablePagesSite"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["enablePagesSite"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Enables dependency alerts and the dependency graph for a repository. The authenticated user must have admin access to the repository. For more information, see "[About security alerts for vulnerable dependencies](https://help.github.com/en/articles/about-security-alerts-for-vulnerable-dependencies)" in the GitHub Help documentation.
         */
        enableVulnerabilityAlerts: {
            (params?: RestEndpointMethodTypes["repos"]["enableVulnerabilityAlerts"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["enableVulnerabilityAlerts"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * When you pass the `scarlet-witch-preview` media type, requests to get a repository will also return the repository's code of conduct if it can be detected from the repository's code of conduct file.
         *
         * The `parent` and `source` objects are present when the repository is a fork. `parent` is the repository this repository was forked from, `source` is the ultimate source for the network.
         */
        get: {
            (params?: RestEndpointMethodTypes["repos"]["get"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["get"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
         *
         * Lists who has access to this protected branch.
         *
         * **Note**: Users, apps, and teams `restrictions` are only available for organization-owned repositories.
         */
        getAccessRestrictions: {
            (params?: RestEndpointMethodTypes["repos"]["getAccessRestrictions"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["getAccessRestrictions"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
         */
        getAdminBranchProtection: {
            (params?: RestEndpointMethodTypes["repos"]["getAdminBranchProtection"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["getAdminBranchProtection"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
         */
        getAllStatusCheckContexts: {
            (params?: RestEndpointMethodTypes["repos"]["getAllStatusCheckContexts"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["getAllStatusCheckContexts"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        getAllTopics: {
            (params?: RestEndpointMethodTypes["repos"]["getAllTopics"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["getAllTopics"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
         *
         * Lists the GitHub Apps that have push access to this branch. Only installed GitHub Apps with `write` access to the `contents` permission can be added as authorized actors on a protected branch.
         */
        getAppsWithAccessToProtectedBranch: {
            (params?: RestEndpointMethodTypes["repos"]["getAppsWithAccessToProtectedBranch"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["getAppsWithAccessToProtectedBranch"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Gets a redirect URL to download an archive for a repository. The `:archive_format` can be either `tarball` or `zipball`. The `:ref` must be a valid Git reference. If you omit `:ref`, the repository’s default branch (usually `master`) will be used. Please make sure your HTTP framework is configured to follow redirects or you will need to use the `Location` header to make a second `GET` request.
         *
         * _Note_: For private repositories, these links are temporary and expire after five minutes.
         *
         * To follow redirects with curl, use the `-L` switch:
         * @deprecated octokit.repos.getArchiveLink() has been renamed to octokit.repos.downloadArchive() (2020-06-04)
         */
        getArchiveLink: {
            (params?: RestEndpointMethodTypes["repos"]["getArchiveLink"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["getArchiveLink"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        getBranch: {
            (params?: RestEndpointMethodTypes["repos"]["getBranch"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["getBranch"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
         */
        getBranchProtection: {
            (params?: RestEndpointMethodTypes["repos"]["getBranchProtection"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["getBranchProtection"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Get the total number of clones and breakdown per day or week for the last 14 days. Timestamps are aligned to UTC midnight of the beginning of the day or week. Week begins on Monday.
         */
        getClones: {
            (params?: RestEndpointMethodTypes["repos"]["getClones"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["getClones"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Returns a weekly aggregate of the number of additions and deletions pushed to a repository.
         */
        getCodeFrequencyStats: {
            (params?: RestEndpointMethodTypes["repos"]["getCodeFrequencyStats"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["getCodeFrequencyStats"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Checks the repository permission of a collaborator. The possible repository permissions are `admin`, `write`, `read`, and `none`.
         */
        getCollaboratorPermissionLevel: {
            (params?: RestEndpointMethodTypes["repos"]["getCollaboratorPermissionLevel"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["getCollaboratorPermissionLevel"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Users with pull access in a repository can access a combined view of commit statuses for a given ref. The ref can be a SHA, a branch name, or a tag name.
         *
         * The most recent status for each context is returned, up to 100. This field [paginates](https://developer.github.com/v3/#pagination) if there are over 100 contexts.
         *
         * Additionally, a combined `state` is returned. The `state` is one of:
         *
         * *   **failure** if any of the contexts report as `error` or `failure`
         * *   **pending** if there are no statuses or a context is `pending`
         * *   **success** if the latest status for all contexts is `success`
         */
        getCombinedStatusForRef: {
            (params?: RestEndpointMethodTypes["repos"]["getCombinedStatusForRef"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["getCombinedStatusForRef"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Returns the contents of a single commit reference. You must have `read` access for the repository to use this endpoint.
         *
         * You can pass the appropriate [media type](https://developer.github.com/v3/media/#commits-commit-comparison-and-pull-requests) to fetch `diff` and `patch` formats. Diffs with binary data will have no `patch` property.
         *
         * To return only the SHA-1 hash of the commit reference, you can provide the `sha` custom [media type](https://developer.github.com/v3/media/#commits-commit-comparison-and-pull-requests) in the `Accept` header. You can use this endpoint to check if a remote reference's SHA-1 hash is the same as your local reference's SHA-1 hash by providing the local SHA-1 reference as the ETag.
         *
         * **Signature verification object**
         *
         * The response will include a `verification` object that describes the result of verifying the commit's signature. The following fields are included in the `verification` object:
         *
         * These are the possible values for `reason` in the `verification` object:
         *
         * | Value                    | Description                                                                                                                       |
         * | ------------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
         * | `expired_key`            | The key that made the signature is expired.                                                                                       |
         * | `not_signing_key`        | The "signing" flag is not among the usage flags in the GPG key that made the signature.                                           |
         * | `gpgverify_error`        | There was an error communicating with the signature verification service.                                                         |
         * | `gpgverify_unavailable`  | The signature verification service is currently unavailable.                                                                      |
         * | `unsigned`               | The object does not include a signature.                                                                                          |
         * | `unknown_signature_type` | A non-PGP signature was found in the commit.                                                                                      |
         * | `no_user`                | No user was associated with the `committer` email address in the commit.                                                          |
         * | `unverified_email`       | The `committer` email address in the commit was associated with a user, but the email address is not verified on her/his account. |
         * | `bad_email`              | The `committer` email address in the commit is not included in the identities of the PGP key that made the signature.             |
         * | `unknown_key`            | The key that made the signature has not been registered with any user's account.                                                  |
         * | `malformed_signature`    | There was an error parsing the signature.                                                                                         |
         * | `invalid`                | The signature could not be cryptographically verified using the key whose key-id was found in the signature.                      |
         * | `valid`                  | None of the above errors applied, so the signature is considered to be verified.                                                  |
         */
        getCommit: {
            (params?: RestEndpointMethodTypes["repos"]["getCommit"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["getCommit"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Returns the last year of commit activity grouped by week. The `days` array is a group of commits per day, starting on `Sunday`.
         */
        getCommitActivityStats: {
            (params?: RestEndpointMethodTypes["repos"]["getCommitActivityStats"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["getCommitActivityStats"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        getCommitComment: {
            (params?: RestEndpointMethodTypes["repos"]["getCommitComment"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["getCommitComment"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
         *
         * When authenticated with admin or owner permissions to the repository, you can use this endpoint to check whether a branch requires signed commits. An enabled status of `true` indicates you must sign commits on this branch. For more information, see [Signing commits with GPG](https://help.github.com/articles/signing-commits-with-gpg) in GitHub Help.
         *
         * **Note**: You must enable branch protection to require signed commits.
         */
        getCommitSignatureProtection: {
            (params?: RestEndpointMethodTypes["repos"]["getCommitSignatureProtection"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["getCommitSignatureProtection"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * This endpoint will return all community profile metrics, including an overall health score, repository description, the presence of documentation, detected code of conduct, detected license, and the presence of ISSUE\_TEMPLATE, PULL\_REQUEST\_TEMPLATE, README, and CONTRIBUTING files.
         */
        getCommunityProfileMetrics: {
            (params?: RestEndpointMethodTypes["repos"]["getCommunityProfileMetrics"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["getCommunityProfileMetrics"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Gets the contents of a file or directory in a repository. Specify the file path or directory in `:path`. If you omit `:path`, you will receive the contents of all files in the repository.
         *
         * Files and symlinks support [a custom media type](https://developer.github.com/v3/repos/contents/#custom-media-types) for retrieving the raw content or rendered HTML (when supported). All content types support [a custom media type](https://developer.github.com/v3/repos/contents/#custom-media-types) to ensure the content is returned in a consistent object format.
         *
         * **Note**:
         *
         * *   To get a repository's contents recursively, you can [recursively get the tree](https://developer.github.com/v3/git/trees/).
         * *   This API has an upper limit of 1,000 files for a directory. If you need to retrieve more files, use the [Git Trees API](https://developer.github.com/v3/git/trees/#get-a-tree).
         * *   This API supports files up to 1 megabyte in size.
         *
         * The response will be an array of objects, one object for each item in the directory.
         *
         * When listing the contents of a directory, submodules have their "type" specified as "file". Logically, the value _should_ be "submodule". This behavior exists in API v3 [for backwards compatibility purposes](https://git.io/v1YCW). In the next major version of the API, the type will be returned as "submodule".
         *
         * If the requested `:path` points to a symlink, and the symlink's target is a normal file in the repository, then the API responds with the content of the file (in the [format shown above](https://developer.github.com/v3/repos/contents/#response-if-content-is-a-file)).
         *
         * Otherwise, the API responds with an object describing the symlink itself:
         *
         * The `submodule_git_url` identifies the location of the submodule repository, and the `sha` identifies a specific commit within the submodule repository. Git uses the given URL when cloning the submodule repository, and checks out the submodule at that specific commit.
         *
         * If the submodule repository is not hosted on github.com, the Git URLs (`git_url` and `_links["git"]`) and the github.com URLs (`html_url` and `_links["html"]`) will have null values.
         */
        getContent: {
            (params?: RestEndpointMethodTypes["repos"]["getContent"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["getContent"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Gets the contents of a file or directory in a repository. Specify the file path or directory in `:path`. If you omit `:path`, you will receive the contents of all files in the repository.
         *
         * Files and symlinks support [a custom media type](https://developer.github.com/v3/repos/contents/#custom-media-types) for retrieving the raw content or rendered HTML (when supported). All content types support [a custom media type](https://developer.github.com/v3/repos/contents/#custom-media-types) to ensure the content is returned in a consistent object format.
         *
         * **Note**:
         *
         * *   To get a repository's contents recursively, you can [recursively get the tree](https://developer.github.com/v3/git/trees/).
         * *   This API has an upper limit of 1,000 files for a directory. If you need to retrieve more files, use the [Git Trees API](https://developer.github.com/v3/git/trees/#get-a-tree).
         * *   This API supports files up to 1 megabyte in size.
         *
         * The response will be an array of objects, one object for each item in the directory.
         *
         * When listing the contents of a directory, submodules have their "type" specified as "file". Logically, the value _should_ be "submodule". This behavior exists in API v3 [for backwards compatibility purposes](https://git.io/v1YCW). In the next major version of the API, the type will be returned as "submodule".
         *
         * If the requested `:path` points to a symlink, and the symlink's target is a normal file in the repository, then the API responds with the content of the file (in the [format shown above](https://developer.github.com/v3/repos/contents/#response-if-content-is-a-file)).
         *
         * Otherwise, the API responds with an object describing the symlink itself:
         *
         * The `submodule_git_url` identifies the location of the submodule repository, and the `sha` identifies a specific commit within the submodule repository. Git uses the given URL when cloning the submodule repository, and checks out the submodule at that specific commit.
         *
         * If the submodule repository is not hosted on github.com, the Git URLs (`git_url` and `_links["git"]`) and the github.com URLs (`html_url` and `_links["html"]`) will have null values.
         * @deprecated octokit.repos.getContents() has been renamed to octokit.repos.getContent() (2020-06-04)
         */
        getContents: {
            (params?: RestEndpointMethodTypes["repos"]["getContents"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["getContents"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * *   `total` - The Total number of commits authored by the contributor.
         *
         * Weekly Hash (`weeks` array):
         *
         * *   `w` - Start of the week, given as a [Unix timestamp](http://en.wikipedia.org/wiki/Unix_time).
         * *   `a` - Number of additions
         * *   `d` - Number of deletions
         * *   `c` - Number of commits
         */
        getContributorsStats: {
            (params?: RestEndpointMethodTypes["repos"]["getContributorsStats"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["getContributorsStats"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        getDeployKey: {
            (params?: RestEndpointMethodTypes["repos"]["getDeployKey"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["getDeployKey"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        getDeployment: {
            (params?: RestEndpointMethodTypes["repos"]["getDeployment"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["getDeployment"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Users with pull access can view a deployment status for a deployment:
         */
        getDeploymentStatus: {
            (params?: RestEndpointMethodTypes["repos"]["getDeploymentStatus"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["getDeploymentStatus"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        getDownload: {
            (params?: RestEndpointMethodTypes["repos"]["getDownload"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["getDownload"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * @deprecated octokit.repos.getHook() has been renamed to octokit.repos.getWebhook() (2020-06-04)
         */
        getHook: {
            (params?: RestEndpointMethodTypes["repos"]["getHook"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["getHook"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        getLatestPagesBuild: {
            (params?: RestEndpointMethodTypes["repos"]["getLatestPagesBuild"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["getLatestPagesBuild"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * View the latest published full release for the repository.
         *
         * The latest release is the most recent non-prerelease, non-draft release, sorted by the `created_at` attribute. The `created_at` attribute is the date of the commit used for the release, and not the date when the release was drafted or published.
         */
        getLatestRelease: {
            (params?: RestEndpointMethodTypes["repos"]["getLatestRelease"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["getLatestRelease"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        getPages: {
            (params?: RestEndpointMethodTypes["repos"]["getPages"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["getPages"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        getPagesBuild: {
            (params?: RestEndpointMethodTypes["repos"]["getPagesBuild"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["getPagesBuild"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Returns the total commit counts for the `owner` and total commit counts in `all`. `all` is everyone combined, including the `owner` in the last 52 weeks. If you'd like to get the commit counts for non-owners, you can subtract `owner` from `all`.
         *
         * The array order is oldest week (index 0) to most recent week.
         */
        getParticipationStats: {
            (params?: RestEndpointMethodTypes["repos"]["getParticipationStats"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["getParticipationStats"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
         * @deprecated octokit.repos.getProtectedBranchAdminEnforcement() has been renamed to octokit.repos.getAdminBranchProtection() (2020-06-04)
         */
        getProtectedBranchAdminEnforcement: {
            (params?: RestEndpointMethodTypes["repos"]["getProtectedBranchAdminEnforcement"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["getProtectedBranchAdminEnforcement"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
         * @deprecated octokit.repos.getProtectedBranchPullRequestReviewEnforcement() has been renamed to octokit.repos.getPullRequestReviewProtection() (2020-06-04)
         */
        getProtectedBranchPullRequestReviewEnforcement: {
            (params?: RestEndpointMethodTypes["repos"]["getProtectedBranchPullRequestReviewEnforcement"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["getProtectedBranchPullRequestReviewEnforcement"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
         *
         * When authenticated with admin or owner permissions to the repository, you can use this endpoint to check whether a branch requires signed commits. An enabled status of `true` indicates you must sign commits on this branch. For more information, see [Signing commits with GPG](https://help.github.com/articles/signing-commits-with-gpg) in GitHub Help.
         *
         * **Note**: You must enable branch protection to require signed commits.
         * @deprecated octokit.repos.getProtectedBranchRequiredSignatures() has been renamed to octokit.repos.getCommitSignatureProtection() (2020-06-04)
         */
        getProtectedBranchRequiredSignatures: {
            (params?: RestEndpointMethodTypes["repos"]["getProtectedBranchRequiredSignatures"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["getProtectedBranchRequiredSignatures"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
         * @deprecated octokit.repos.getProtectedBranchRequiredStatusChecks() has been renamed to octokit.repos.getStatusChecksProtection() (2020-06-04)
         */
        getProtectedBranchRequiredStatusChecks: {
            (params?: RestEndpointMethodTypes["repos"]["getProtectedBranchRequiredStatusChecks"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["getProtectedBranchRequiredStatusChecks"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
         *
         * Lists who has access to this protected branch.
         *
         * **Note**: Users, apps, and teams `restrictions` are only available for organization-owned repositories.
         * @deprecated octokit.repos.getProtectedBranchRestrictions() has been renamed to octokit.repos.getAccessRestrictions() (2020-06-04)
         */
        getProtectedBranchRestrictions: {
            (params?: RestEndpointMethodTypes["repos"]["getProtectedBranchRestrictions"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["getProtectedBranchRestrictions"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
         */
        getPullRequestReviewProtection: {
            (params?: RestEndpointMethodTypes["repos"]["getPullRequestReviewProtection"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["getPullRequestReviewProtection"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Each array contains the day number, hour number, and number of commits:
         *
         * *   `0-6`: Sunday - Saturday
         * *   `0-23`: Hour of day
         * *   Number of commits
         *
         * For example, `[2, 14, 25]` indicates that there were 25 total commits, during the 2:00pm hour on Tuesdays. All times are based on the time zone of individual commits.
         */
        getPunchCardStats: {
            (params?: RestEndpointMethodTypes["repos"]["getPunchCardStats"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["getPunchCardStats"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Gets the preferred README for a repository.
         *
         * READMEs support [custom media types](https://developer.github.com/v3/repos/contents/#custom-media-types) for retrieving the raw content or rendered HTML.
         */
        getReadme: {
            (params?: RestEndpointMethodTypes["repos"]["getReadme"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["getReadme"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * **Note:** This returns an `upload_url` key corresponding to the endpoint for uploading release assets. This key is a [hypermedia resource](https://developer.github.com/v3/#hypermedia).
         */
        getRelease: {
            (params?: RestEndpointMethodTypes["repos"]["getRelease"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["getRelease"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * To download the asset's binary content, set the `Accept` header of the request to [`application/octet-stream`](https://developer.github.com/v3/media/#media-types). The API will either redirect the client to the location, or stream it directly if possible. API clients should handle both a `200` or `302` response.
         */
        getReleaseAsset: {
            (params?: RestEndpointMethodTypes["repos"]["getReleaseAsset"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["getReleaseAsset"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Get a published release with the specified tag.
         */
        getReleaseByTag: {
            (params?: RestEndpointMethodTypes["repos"]["getReleaseByTag"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["getReleaseByTag"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
         */
        getStatusChecksProtection: {
            (params?: RestEndpointMethodTypes["repos"]["getStatusChecksProtection"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["getStatusChecksProtection"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
         *
         * Lists the teams who have push access to this branch. The list includes child teams.
         */
        getTeamsWithAccessToProtectedBranch: {
            (params?: RestEndpointMethodTypes["repos"]["getTeamsWithAccessToProtectedBranch"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["getTeamsWithAccessToProtectedBranch"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Get the top 10 popular contents over the last 14 days.
         */
        getTopPaths: {
            (params?: RestEndpointMethodTypes["repos"]["getTopPaths"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["getTopPaths"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Get the top 10 referrers over the last 14 days.
         */
        getTopReferrers: {
            (params?: RestEndpointMethodTypes["repos"]["getTopReferrers"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["getTopReferrers"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
         *
         * Lists the people who have push access to this branch.
         */
        getUsersWithAccessToProtectedBranch: {
            (params?: RestEndpointMethodTypes["repos"]["getUsersWithAccessToProtectedBranch"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["getUsersWithAccessToProtectedBranch"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Get the total number of views and breakdown per day or week for the last 14 days. Timestamps are aligned to UTC midnight of the beginning of the day or week. Week begins on Monday.
         */
        getViews: {
            (params?: RestEndpointMethodTypes["repos"]["getViews"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["getViews"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        getWebhook: {
            (params?: RestEndpointMethodTypes["repos"]["getWebhook"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["getWebhook"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Lists repositories that the authenticated user has explicit permission (`:read`, `:write`, or `:admin`) to access.
         *
         * The authenticated user has explicit permission to access repositories they own, repositories where they are a collaborator, and repositories that they can access through an organization membership.
         * @deprecated octokit.repos.list() has been renamed to octokit.repos.listForAuthenticatedUser() (2020-03-04)
         */
        list: {
            (params?: RestEndpointMethodTypes["repos"]["list"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["list"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * @deprecated octokit.repos.listAssetsForRelease() has been renamed to octokit.repos.listReleaseAssets() (2020-06-04)
         */
        listAssetsForRelease: {
            (params?: RestEndpointMethodTypes["repos"]["listAssetsForRelease"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["listAssetsForRelease"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        listBranches: {
            (params?: RestEndpointMethodTypes["repos"]["listBranches"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["listBranches"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
         *
         * Returns all branches where the given commit SHA is the HEAD, or latest commit for the branch.
         */
        listBranchesForHeadCommit: {
            (params?: RestEndpointMethodTypes["repos"]["listBranchesForHeadCommit"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["listBranchesForHeadCommit"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * For organization-owned repositories, the list of collaborators includes outside collaborators, organization members that are direct collaborators, organization members with access through team memberships, organization members with access through default organization permissions, and organization owners.
         *
         * Team members will include the members of child teams.
         */
        listCollaborators: {
            (params?: RestEndpointMethodTypes["repos"]["listCollaborators"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["listCollaborators"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Use the `:commit_sha` to specify the commit that will have its comments listed.
         */
        listCommentsForCommit: {
            (params?: RestEndpointMethodTypes["repos"]["listCommentsForCommit"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["listCommentsForCommit"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Commit Comments use [these custom media types](https://developer.github.com/v3/repos/comments/#custom-media-types). You can read more about the use of media types in the API [here](https://developer.github.com/v3/media/).
         *
         * Comments are ordered by ascending ID.
         * @deprecated octokit.repos.listCommitComments() has been renamed to octokit.repos.listCommitCommentsForRepo() (2020-06-04)
         */
        listCommitComments: {
            (params?: RestEndpointMethodTypes["repos"]["listCommitComments"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["listCommitComments"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Commit Comments use [these custom media types](https://developer.github.com/v3/repos/comments/#custom-media-types). You can read more about the use of media types in the API [here](https://developer.github.com/v3/media/).
         *
         * Comments are ordered by ascending ID.
         */
        listCommitCommentsForRepo: {
            (params?: RestEndpointMethodTypes["repos"]["listCommitCommentsForRepo"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["listCommitCommentsForRepo"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Users with pull access in a repository can view commit statuses for a given ref. The ref can be a SHA, a branch name, or a tag name. Statuses are returned in reverse chronological order. The first status in the list will be the latest one.
         *
         * This resource is also available via a legacy route: `GET /repos/:owner/:repo/statuses/:ref`.
         */
        listCommitStatusesForRef: {
            (params?: RestEndpointMethodTypes["repos"]["listCommitStatusesForRef"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["listCommitStatusesForRef"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * **Signature verification object**
         *
         * The response will include a `verification` object that describes the result of verifying the commit's signature. The following fields are included in the `verification` object:
         *
         * These are the possible values for `reason` in the `verification` object:
         *
         * | Value                    | Description                                                                                                                       |
         * | ------------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
         * | `expired_key`            | The key that made the signature is expired.                                                                                       |
         * | `not_signing_key`        | The "signing" flag is not among the usage flags in the GPG key that made the signature.                                           |
         * | `gpgverify_error`        | There was an error communicating with the signature verification service.                                                         |
         * | `gpgverify_unavailable`  | The signature verification service is currently unavailable.                                                                      |
         * | `unsigned`               | The object does not include a signature.                                                                                          |
         * | `unknown_signature_type` | A non-PGP signature was found in the commit.                                                                                      |
         * | `no_user`                | No user was associated with the `committer` email address in the commit.                                                          |
         * | `unverified_email`       | The `committer` email address in the commit was associated with a user, but the email address is not verified on her/his account. |
         * | `bad_email`              | The `committer` email address in the commit is not included in the identities of the PGP key that made the signature.             |
         * | `unknown_key`            | The key that made the signature has not been registered with any user's account.                                                  |
         * | `malformed_signature`    | There was an error parsing the signature.                                                                                         |
         * | `invalid`                | The signature could not be cryptographically verified using the key whose key-id was found in the signature.                      |
         * | `valid`                  | None of the above errors applied, so the signature is considered to be verified.                                                  |
         */
        listCommits: {
            (params?: RestEndpointMethodTypes["repos"]["listCommits"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["listCommits"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Lists contributors to the specified repository and sorts them by the number of commits per contributor in descending order. This endpoint may return information that is a few hours old because the GitHub REST API v3 caches contributor data to improve performance.
         *
         * GitHub identifies contributors by author email address. This endpoint groups contribution counts by GitHub user, which includes all associated email addresses. To improve performance, only the first 500 author email addresses in the repository link to GitHub users. The rest will appear as anonymous contributors without associated GitHub user information.
         */
        listContributors: {
            (params?: RestEndpointMethodTypes["repos"]["listContributors"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["listContributors"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        listDeployKeys: {
            (params?: RestEndpointMethodTypes["repos"]["listDeployKeys"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["listDeployKeys"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Users with pull access can view deployment statuses for a deployment:
         */
        listDeploymentStatuses: {
            (params?: RestEndpointMethodTypes["repos"]["listDeploymentStatuses"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["listDeploymentStatuses"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Simple filtering of deployments is available via query parameters:
         */
        listDeployments: {
            (params?: RestEndpointMethodTypes["repos"]["listDeployments"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["listDeployments"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        listDownloads: {
            (params?: RestEndpointMethodTypes["repos"]["listDownloads"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["listDownloads"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Lists repositories that the authenticated user has explicit permission (`:read`, `:write`, or `:admin`) to access.
         *
         * The authenticated user has explicit permission to access repositories they own, repositories where they are a collaborator, and repositories that they can access through an organization membership.
         */
        listForAuthenticatedUser: {
            (params?: RestEndpointMethodTypes["repos"]["listForAuthenticatedUser"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["listForAuthenticatedUser"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Lists repositories for the specified organization.
         */
        listForOrg: {
            (params?: RestEndpointMethodTypes["repos"]["listForOrg"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["listForOrg"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Lists public repositories for the specified user.
         */
        listForUser: {
            (params?: RestEndpointMethodTypes["repos"]["listForUser"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["listForUser"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        listForks: {
            (params?: RestEndpointMethodTypes["repos"]["listForks"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["listForks"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * @deprecated octokit.repos.listHooks() has been renamed to octokit.repos.listWebhooks() (2020-06-04)
         */
        listHooks: {
            (params?: RestEndpointMethodTypes["repos"]["listHooks"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["listHooks"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * When authenticating as a user with admin rights to a repository, this endpoint will list all currently open repository invitations.
         */
        listInvitations: {
            (params?: RestEndpointMethodTypes["repos"]["listInvitations"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["listInvitations"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * When authenticating as a user, this endpoint will list all currently open repository invitations for that user.
         */
        listInvitationsForAuthenticatedUser: {
            (params?: RestEndpointMethodTypes["repos"]["listInvitationsForAuthenticatedUser"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["listInvitationsForAuthenticatedUser"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Lists languages for the specified repository. The value shown for each language is the number of bytes of code written in that language.
         */
        listLanguages: {
            (params?: RestEndpointMethodTypes["repos"]["listLanguages"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["listLanguages"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        listPagesBuilds: {
            (params?: RestEndpointMethodTypes["repos"]["listPagesBuilds"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["listPagesBuilds"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
         * @deprecated octokit.repos.listProtectedBranchRequiredStatusChecksContexts() has been renamed to octokit.repos.getAllStatusCheckContexts() (2020-06-04)
         */
        listProtectedBranchRequiredStatusChecksContexts: {
            (params?: RestEndpointMethodTypes["repos"]["listProtectedBranchRequiredStatusChecksContexts"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["listProtectedBranchRequiredStatusChecksContexts"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Lists all public repositories in the order that they were created.
         *
         * Note: Pagination is powered exclusively by the `since` parameter. Use the [Link header](https://developer.github.com/v3/#link-header) to get the URL for the next page of repositories.
         */
        listPublic: {
            (params?: RestEndpointMethodTypes["repos"]["listPublic"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["listPublic"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Lists all pull requests containing the provided commit SHA, which can be from any point in the commit history. The results will include open and closed pull requests. Additional preview headers may be required to see certain details for associated pull requests, such as whether a pull request is in a draft state. For more information about previews that might affect this endpoint, see the [List pull requests](https://developer.github.com/v3/pulls/#list-pull-requests) endpoint.
         */
        listPullRequestsAssociatedWithCommit: {
            (params?: RestEndpointMethodTypes["repos"]["listPullRequestsAssociatedWithCommit"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["listPullRequestsAssociatedWithCommit"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        listReleaseAssets: {
            (params?: RestEndpointMethodTypes["repos"]["listReleaseAssets"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["listReleaseAssets"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * This returns a list of releases, which does not include regular Git tags that have not been associated with a release. To get a list of Git tags, use the [Repository Tags API](https://developer.github.com/v3/repos/#list-repository-tags).
         *
         * Information about published releases are available to everyone. Only users with push access will receive listings for draft releases.
         */
        listReleases: {
            (params?: RestEndpointMethodTypes["repos"]["listReleases"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["listReleases"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Users with pull access in a repository can view commit statuses for a given ref. The ref can be a SHA, a branch name, or a tag name. Statuses are returned in reverse chronological order. The first status in the list will be the latest one.
         *
         * This resource is also available via a legacy route: `GET /repos/:owner/:repo/statuses/:ref`.
         * @deprecated octokit.repos.listStatusesForRef() has been renamed to octokit.repos.listCommitStatusesForRef() (2020-06-04)
         */
        listStatusesForRef: {
            (params?: RestEndpointMethodTypes["repos"]["listStatusesForRef"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["listStatusesForRef"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        listTags: {
            (params?: RestEndpointMethodTypes["repos"]["listTags"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["listTags"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        listTeams: {
            (params?: RestEndpointMethodTypes["repos"]["listTeams"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["listTeams"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * @deprecated octokit.repos.listTopics() has been renamed to octokit.repos.getAllTopics() (2020-03-04)
         */
        listTopics: {
            (params?: RestEndpointMethodTypes["repos"]["listTopics"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["listTopics"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        listWebhooks: {
            (params?: RestEndpointMethodTypes["repos"]["listWebhooks"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["listWebhooks"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        merge: {
            (params?: RestEndpointMethodTypes["repos"]["merge"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["merge"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * This will trigger a [ping event](https://developer.github.com/webhooks/#ping-event) to be sent to the hook.
         * @deprecated octokit.repos.pingHook() has been renamed to octokit.repos.pingWebhook() (2020-06-04)
         */
        pingHook: {
            (params?: RestEndpointMethodTypes["repos"]["pingHook"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["pingHook"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * This will trigger a [ping event](https://developer.github.com/webhooks/#ping-event) to be sent to the hook.
         */
        pingWebhook: {
            (params?: RestEndpointMethodTypes["repos"]["pingWebhook"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["pingWebhook"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
         *
         * Removes the ability of an app to push to this branch. Only installed GitHub Apps with `write` access to the `contents` permission can be added as authorized actors on a protected branch.
         *
         * | Type    | Description                                                                                                                                                |
         * | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
         * | `array` | The GitHub Apps that have push access to this branch. Use the app's `slug`. **Note**: The list of users, apps, and teams in total is limited to 100 items. |
         */
        removeAppAccessRestrictions: {
            (params?: RestEndpointMethodTypes["repos"]["removeAppAccessRestrictions"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["removeAppAccessRestrictions"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
         * @deprecated octokit.repos.removeBranchProtection() has been renamed to octokit.repos.deleteBranchProtection() (2020-06-04)
         */
        removeBranchProtection: {
            (params?: RestEndpointMethodTypes["repos"]["removeBranchProtection"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["removeBranchProtection"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        removeCollaborator: {
            (params?: RestEndpointMethodTypes["repos"]["removeCollaborator"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["removeCollaborator"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * @deprecated octokit.repos.removeDeployKey() has been renamed to octokit.repos.deleteDeployKey() (2020-06-04)
         */
        removeDeployKey: {
            (params?: RestEndpointMethodTypes["repos"]["removeDeployKey"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["removeDeployKey"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
         *
         * Removing admin enforcement requires admin or owner permissions to the repository and branch protection to be enabled.
         * @deprecated octokit.repos.removeProtectedBranchAdminEnforcement() has been renamed to octokit.repos.deleteAdminBranchProtection() (2020-06-04)
         */
        removeProtectedBranchAdminEnforcement: {
            (params?: RestEndpointMethodTypes["repos"]["removeProtectedBranchAdminEnforcement"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["removeProtectedBranchAdminEnforcement"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
         *
         * Removes the ability of an app to push to this branch. Only installed GitHub Apps with `write` access to the `contents` permission can be added as authorized actors on a protected branch.
         *
         * | Type    | Description                                                                                                                                                |
         * | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
         * | `array` | The GitHub Apps that have push access to this branch. Use the app's `slug`. **Note**: The list of users, apps, and teams in total is limited to 100 items. |
         * @deprecated octokit.repos.removeProtectedBranchAppRestrictions() has been renamed to octokit.repos.removeAppAccessRestrictions() (2020-06-04)
         */
        removeProtectedBranchAppRestrictions: {
            (params?: RestEndpointMethodTypes["repos"]["removeProtectedBranchAppRestrictions"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["removeProtectedBranchAppRestrictions"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
         * @deprecated octokit.repos.removeProtectedBranchPullRequestReviewEnforcement() has been renamed to octokit.repos.deletePullRequestReviewProtection() (2020-06-04)
         */
        removeProtectedBranchPullRequestReviewEnforcement: {
            (params?: RestEndpointMethodTypes["repos"]["removeProtectedBranchPullRequestReviewEnforcement"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["removeProtectedBranchPullRequestReviewEnforcement"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
         *
         * When authenticated with admin or owner permissions to the repository, you can use this endpoint to disable required signed commits on a branch. You must enable branch protection to require signed commits.
         * @deprecated octokit.repos.removeProtectedBranchRequiredSignatures() has been renamed to octokit.repos.deleteCommitSignatureProtection() (2020-06-04)
         */
        removeProtectedBranchRequiredSignatures: {
            (params?: RestEndpointMethodTypes["repos"]["removeProtectedBranchRequiredSignatures"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["removeProtectedBranchRequiredSignatures"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
         * @deprecated octokit.repos.removeProtectedBranchRequiredStatusChecks() has been renamed to octokit.repos.removeStatusChecksProtection() (2020-06-04)
         */
        removeProtectedBranchRequiredStatusChecks: {
            (params?: RestEndpointMethodTypes["repos"]["removeProtectedBranchRequiredStatusChecks"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["removeProtectedBranchRequiredStatusChecks"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
         * @deprecated octokit.repos.removeProtectedBranchRequiredStatusChecksContexts() has been renamed to octokit.repos.removeStatusCheckContexts() (2020-06-04)
         */
        removeProtectedBranchRequiredStatusChecksContexts: {
            (params?: RestEndpointMethodTypes["repos"]["removeProtectedBranchRequiredStatusChecksContexts"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["removeProtectedBranchRequiredStatusChecksContexts"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
         *
         * Disables the ability to restrict who can push to this branch.
         * @deprecated octokit.repos.removeProtectedBranchRestrictions() has been renamed to octokit.repos.deleteAccessRestrictions() (2020-06-04)
         */
        removeProtectedBranchRestrictions: {
            (params?: RestEndpointMethodTypes["repos"]["removeProtectedBranchRestrictions"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["removeProtectedBranchRestrictions"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
         *
         * Removes the ability of a team to push to this branch. You can also remove push access for child teams.
         *
         * | Type    | Description                                                                                                                                         |
         * | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
         * | `array` | Teams that should no longer have push access. Use the team's `slug`. **Note**: The list of users, apps, and teams in total is limited to 100 items. |
         * @deprecated octokit.repos.removeProtectedBranchTeamRestrictions() has been renamed to octokit.repos.removeTeamAccessRestrictions() (2020-06-04)
         */
        removeProtectedBranchTeamRestrictions: {
            (params?: RestEndpointMethodTypes["repos"]["removeProtectedBranchTeamRestrictions"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["removeProtectedBranchTeamRestrictions"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
         *
         * Removes the ability of a user to push to this branch.
         *
         * | Type    | Description                                                                                                                                   |
         * | ------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
         * | `array` | Usernames of the people who should no longer have push access. **Note**: The list of users, apps, and teams in total is limited to 100 items. |
         * @deprecated octokit.repos.removeProtectedBranchUserRestrictions() has been renamed to octokit.repos.removeUserAccessRestrictions() (2020-06-04)
         */
        removeProtectedBranchUserRestrictions: {
            (params?: RestEndpointMethodTypes["repos"]["removeProtectedBranchUserRestrictions"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["removeProtectedBranchUserRestrictions"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
         */
        removeStatusCheckContexts: {
            (params?: RestEndpointMethodTypes["repos"]["removeStatusCheckContexts"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["removeStatusCheckContexts"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
         */
        removeStatusCheckProtection: {
            (params?: RestEndpointMethodTypes["repos"]["removeStatusCheckProtection"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["removeStatusCheckProtection"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
         *
         * Removes the ability of a team to push to this branch. You can also remove push access for child teams.
         *
         * | Type    | Description                                                                                                                                         |
         * | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
         * | `array` | Teams that should no longer have push access. Use the team's `slug`. **Note**: The list of users, apps, and teams in total is limited to 100 items. |
         */
        removeTeamAccessRestrictions: {
            (params?: RestEndpointMethodTypes["repos"]["removeTeamAccessRestrictions"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["removeTeamAccessRestrictions"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
         *
         * Removes the ability of a user to push to this branch.
         *
         * | Type    | Description                                                                                                                                   |
         * | ------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
         * | `array` | Usernames of the people who should no longer have push access. **Note**: The list of users, apps, and teams in total is limited to 100 items. |
         */
        removeUserAccessRestrictions: {
            (params?: RestEndpointMethodTypes["repos"]["removeUserAccessRestrictions"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["removeUserAccessRestrictions"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        replaceAllTopics: {
            (params?: RestEndpointMethodTypes["repos"]["replaceAllTopics"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["replaceAllTopics"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
         *
         * Replaces the list of apps that have push access to this branch. This removes all apps that previously had push access and grants push access to the new list of apps. Only installed GitHub Apps with `write` access to the `contents` permission can be added as authorized actors on a protected branch.
         *
         * | Type    | Description                                                                                                                                                |
         * | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
         * | `array` | The GitHub Apps that have push access to this branch. Use the app's `slug`. **Note**: The list of users, apps, and teams in total is limited to 100 items. |
         * @deprecated octokit.repos.replaceProtectedBranchAppRestrictions() has been renamed to octokit.repos.setAppAccessRestrictions() (2020-06-04)
         */
        replaceProtectedBranchAppRestrictions: {
            (params?: RestEndpointMethodTypes["repos"]["replaceProtectedBranchAppRestrictions"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["replaceProtectedBranchAppRestrictions"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
         * @deprecated octokit.repos.replaceProtectedBranchRequiredStatusChecksContexts() has been renamed to octokit.repos.setStatusCheckContexts() (2020-06-04)
         */
        replaceProtectedBranchRequiredStatusChecksContexts: {
            (params?: RestEndpointMethodTypes["repos"]["replaceProtectedBranchRequiredStatusChecksContexts"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["replaceProtectedBranchRequiredStatusChecksContexts"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
         *
         * Replaces the list of teams that have push access to this branch. This removes all teams that previously had push access and grants push access to the new list of teams. Team restrictions include child teams.
         *
         * | Type    | Description                                                                                                                                |
         * | ------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
         * | `array` | The teams that can have push access. Use the team's `slug`. **Note**: The list of users, apps, and teams in total is limited to 100 items. |
         * @deprecated octokit.repos.replaceProtectedBranchTeamRestrictions() has been renamed to octokit.repos.setTeamAccessRestrictions() (2020-06-04)
         */
        replaceProtectedBranchTeamRestrictions: {
            (params?: RestEndpointMethodTypes["repos"]["replaceProtectedBranchTeamRestrictions"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["replaceProtectedBranchTeamRestrictions"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
         *
         * Replaces the list of people that have push access to this branch. This removes all people that previously had push access and grants push access to the new list of people.
         *
         * | Type    | Description                                                                                                                   |
         * | ------- | ----------------------------------------------------------------------------------------------------------------------------- |
         * | `array` | Usernames for people who can have push access. **Note**: The list of users, apps, and teams in total is limited to 100 items. |
         * @deprecated octokit.repos.replaceProtectedBranchUserRestrictions() has been renamed to octokit.repos.setUserAccessRestrictions() (2020-06-04)
         */
        replaceProtectedBranchUserRestrictions: {
            (params?: RestEndpointMethodTypes["repos"]["replaceProtectedBranchUserRestrictions"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["replaceProtectedBranchUserRestrictions"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * @deprecated octokit.repos.replaceTopics() has been renamed to octokit.repos.replaceAllTopics() (2020-03-04)
         */
        replaceTopics: {
            (params?: RestEndpointMethodTypes["repos"]["replaceTopics"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["replaceTopics"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * You can request that your site be built from the latest revision on the default branch. This has the same effect as pushing a commit to your default branch, but does not require an additional commit. Manually triggering page builds can be helpful when diagnosing build warnings and failures.
         *
         * Build requests are limited to one concurrent build per repository and one concurrent build per requester. If you request a build while another is still in progress, the second request will be queued until the first completes.
         * @deprecated octokit.repos.requestPageBuild() has been renamed to octokit.repos.requestPagesBuild() (2020-06-04)
         */
        requestPageBuild: {
            (params?: RestEndpointMethodTypes["repos"]["requestPageBuild"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["requestPageBuild"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * You can request that your site be built from the latest revision on the default branch. This has the same effect as pushing a commit to your default branch, but does not require an additional commit. Manually triggering page builds can be helpful when diagnosing build warnings and failures.
         *
         * Build requests are limited to one concurrent build per repository and one concurrent build per requester. If you request a build while another is still in progress, the second request will be queued until the first completes.
         */
        requestPagesBuild: {
            (params?: RestEndpointMethodTypes["repos"]["requestPagesBuild"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["requestPagesBuild"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * This endpoint will return all community profile metrics, including an overall health score, repository description, the presence of documentation, detected code of conduct, detected license, and the presence of ISSUE\_TEMPLATE, PULL\_REQUEST\_TEMPLATE, README, and CONTRIBUTING files.
         * @deprecated octokit.repos.retrieveCommunityProfileMetrics() has been renamed to octokit.repos.getCommunityProfileMetrics() (2020-06-04)
         */
        retrieveCommunityProfileMetrics: {
            (params?: RestEndpointMethodTypes["repos"]["retrieveCommunityProfileMetrics"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["retrieveCommunityProfileMetrics"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
         *
         * Adding admin enforcement requires admin or owner permissions to the repository and branch protection to be enabled.
         */
        setAdminBranchProtection: {
            (params?: RestEndpointMethodTypes["repos"]["setAdminBranchProtection"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["setAdminBranchProtection"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
         *
         * Replaces the list of apps that have push access to this branch. This removes all apps that previously had push access and grants push access to the new list of apps. Only installed GitHub Apps with `write` access to the `contents` permission can be added as authorized actors on a protected branch.
         *
         * | Type    | Description                                                                                                                                                |
         * | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
         * | `array` | The GitHub Apps that have push access to this branch. Use the app's `slug`. **Note**: The list of users, apps, and teams in total is limited to 100 items. |
         */
        setAppAccessRestrictions: {
            (params?: RestEndpointMethodTypes["repos"]["setAppAccessRestrictions"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["setAppAccessRestrictions"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
         */
        setStatusCheckContexts: {
            (params?: RestEndpointMethodTypes["repos"]["setStatusCheckContexts"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["setStatusCheckContexts"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
         *
         * Replaces the list of teams that have push access to this branch. This removes all teams that previously had push access and grants push access to the new list of teams. Team restrictions include child teams.
         *
         * | Type    | Description                                                                                                                                |
         * | ------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
         * | `array` | The teams that can have push access. Use the team's `slug`. **Note**: The list of users, apps, and teams in total is limited to 100 items. |
         */
        setTeamAccessRestrictions: {
            (params?: RestEndpointMethodTypes["repos"]["setTeamAccessRestrictions"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["setTeamAccessRestrictions"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
         *
         * Replaces the list of people that have push access to this branch. This removes all people that previously had push access and grants push access to the new list of people.
         *
         * | Type    | Description                                                                                                                   |
         * | ------- | ----------------------------------------------------------------------------------------------------------------------------- |
         * | `array` | Usernames for people who can have push access. **Note**: The list of users, apps, and teams in total is limited to 100 items. |
         */
        setUserAccessRestrictions: {
            (params?: RestEndpointMethodTypes["repos"]["setUserAccessRestrictions"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["setUserAccessRestrictions"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * This will trigger the hook with the latest push to the current repository if the hook is subscribed to `push` events. If the hook is not subscribed to `push` events, the server will respond with 204 but no test POST will be generated.
         *
         * **Note**: Previously `/repos/:owner/:repo/hooks/:hook_id/test`
         * @deprecated octokit.repos.testPushHook() has been renamed to octokit.repos.testPushWebhook() (2020-06-04)
         */
        testPushHook: {
            (params?: RestEndpointMethodTypes["repos"]["testPushHook"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["testPushHook"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * This will trigger the hook with the latest push to the current repository if the hook is subscribed to `push` events. If the hook is not subscribed to `push` events, the server will respond with 204 but no test POST will be generated.
         *
         * **Note**: Previously `/repos/:owner/:repo/hooks/:hook_id/test`
         */
        testPushWebhook: {
            (params?: RestEndpointMethodTypes["repos"]["testPushWebhook"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["testPushWebhook"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * A transfer request will need to be accepted by the new owner when transferring a personal repository to another user. The response will contain the original `owner`, and the transfer will continue asynchronously. For more details on the requirements to transfer personal and organization-owned repositories, see [about repository transfers](https://help.github.com/articles/about-repository-transfers/).
         */
        transfer: {
            (params?: RestEndpointMethodTypes["repos"]["transfer"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["transfer"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * **Note**: To edit a repository's topics, use the [Replace all repository topics](https://developer.github.com/v3/repos/#replace-all-repository-topics) endpoint.
         */
        update: {
            (params?: RestEndpointMethodTypes["repos"]["update"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["update"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
         *
         * Protecting a branch requires admin or owner permissions to the repository.
         *
         * **Note**: Passing new arrays of `users` and `teams` replaces their previous values.
         *
         * **Note**: The list of users, apps, and teams in total is limited to 100 items.
         */
        updateBranchProtection: {
            (params?: RestEndpointMethodTypes["repos"]["updateBranchProtection"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["updateBranchProtection"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        updateCommitComment: {
            (params?: RestEndpointMethodTypes["repos"]["updateCommitComment"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["updateCommitComment"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * @deprecated octokit.repos.updateHook() has been renamed to octokit.repos.updateWebhook() (2020-06-04)
         */
        updateHook: {
            (params?: RestEndpointMethodTypes["repos"]["updateHook"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["updateHook"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        updateInformationAboutPagesSite: {
            (params?: RestEndpointMethodTypes["repos"]["updateInformationAboutPagesSite"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["updateInformationAboutPagesSite"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        updateInvitation: {
            (params?: RestEndpointMethodTypes["repos"]["updateInvitation"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["updateInvitation"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
         *
         * Updating pull request review enforcement requires admin or owner permissions to the repository and branch protection to be enabled.
         *
         * **Note**: Passing new arrays of `users` and `teams` replaces their previous values.
         * @deprecated octokit.repos.updateProtectedBranchPullRequestReviewEnforcement() has been renamed to octokit.repos.updatePullRequestReviewProtection() (2020-06-04)
         */
        updateProtectedBranchPullRequestReviewEnforcement: {
            (params?: RestEndpointMethodTypes["repos"]["updateProtectedBranchPullRequestReviewEnforcement"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["updateProtectedBranchPullRequestReviewEnforcement"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
         *
         * Updating required status checks requires admin or owner permissions to the repository and branch protection to be enabled.
         * @deprecated octokit.repos.updateProtectedBranchRequiredStatusChecks() has been renamed to octokit.repos.updateStatusChecksProtection() (2020-06-04)
         */
        updateProtectedBranchRequiredStatusChecks: {
            (params?: RestEndpointMethodTypes["repos"]["updateProtectedBranchRequiredStatusChecks"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["updateProtectedBranchRequiredStatusChecks"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
         *
         * Updating pull request review enforcement requires admin or owner permissions to the repository and branch protection to be enabled.
         *
         * **Note**: Passing new arrays of `users` and `teams` replaces their previous values.
         */
        updatePullRequestReviewProtection: {
            (params?: RestEndpointMethodTypes["repos"]["updatePullRequestReviewProtection"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["updatePullRequestReviewProtection"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Users with push access to the repository can edit a release.
         */
        updateRelease: {
            (params?: RestEndpointMethodTypes["repos"]["updateRelease"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["updateRelease"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Users with push access to the repository can edit a release asset.
         */
        updateReleaseAsset: {
            (params?: RestEndpointMethodTypes["repos"]["updateReleaseAsset"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["updateReleaseAsset"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
         *
         * Updating required status checks requires admin or owner permissions to the repository and branch protection to be enabled.
         */
        updateStatusCheckPotection: {
            (params?: RestEndpointMethodTypes["repos"]["updateStatusCheckPotection"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["updateStatusCheckPotection"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        updateWebhook: {
            (params?: RestEndpointMethodTypes["repos"]["updateWebhook"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["updateWebhook"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * This endpoint makes use of [a Hypermedia relation](https://developer.github.com/v3/#hypermedia) to determine which URL to access. The endpoint you call to upload release assets is specific to your release. Use the `upload_url` returned in the response of the [Create a release endpoint](https://developer.github.com/v3/repos/releases/#create-a-release) to upload a release asset.
         *
         * You need to use an HTTP client which supports [SNI](http://en.wikipedia.org/wiki/Server_Name_Indication) to make calls to this endpoint.
         *
         * Most libraries will set the required `Content-Length` header automatically. Use the required `Content-Type` header to provide the media type of the asset. For a list of media types, see [Media Types](https://www.iana.org/assignments/media-types/media-types.xhtml). For example:
         *
         * `application/zip`
         *
         * GitHub expects the asset data in its raw binary form, rather than JSON. You will send the raw binary content of the asset as the request body. Everything else about the endpoint is the same as the rest of the API. For example, you'll still need to pass your authentication to be able to upload an asset.
         *
         * **Notes:**
         *
         * *   GitHub renames asset filenames that have special characters, non-alphanumeric characters, and leading or trailing periods. The "[List assets for a release](https://developer.github.com/v3/repos/releases/#list-assets-for-a-release)" endpoint lists the renamed filenames. For more information and help, contact [GitHub Support](https://github.com/contact).
         * *   If you upload an asset with the same filename as another uploaded asset, you'll receive an error and must delete the old file before you can re-upload the new asset.
         *
         * This may leave an empty asset with a state of `starter`. It can be safely deleted.
         */
        uploadReleaseAsset: {
            (params?: RestEndpointMethodTypes["repos"]["uploadReleaseAsset"]["parameters"]): Promise<RestEndpointMethodTypes["repos"]["uploadReleaseAsset"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
    };
    search: {
        /**
         * Find file contents via various criteria. This method returns up to 100 results [per page](https://developer.github.com/v3/#pagination).
         *
         * When searching for code, you can get text match metadata for the file **content** and file **path** fields when you pass the `text-match` media type. For more details about how to receive highlighted search results, see [Text match metadata](https://developer.github.com/v3/search/#text-match-metadata).
         *
         * **Note:** You must [authenticate](https://developer.github.com/v3/#authentication) to search for code across all public repositories.
         *
         * **Considerations for code search**
         *
         * Due to the complexity of searching code, there are a few restrictions on how searches are performed:
         *
         * *   Only the _default branch_ is considered. In most cases, this will be the `master` branch.
         * *   Only files smaller than 384 KB are searchable.
         * *   You must always include at least one search term when searching source code. For example, searching for [`language:go`](https://github.com/search?utf8=%E2%9C%93&q=language%3Ago&type=Code) is not valid, while [`amazing language:go`](https://github.com/search?utf8=%E2%9C%93&q=amazing+language%3Ago&type=Code) is.
         *
         * Suppose you want to find the definition of the `addClass` function inside [jQuery](https://github.com/jquery/jquery). Your query would look something like this:
         *
         * Here, we're searching for the keyword `addClass` within a file's contents. We're making sure that we're only looking in files where the language is JavaScript. And we're scoping the search to the `repo:jquery/jquery` repository.
         */
        code: {
            (params?: RestEndpointMethodTypes["search"]["code"]["parameters"]): Promise<RestEndpointMethodTypes["search"]["code"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Find commits via various criteria. This method returns up to 100 results [per page](https://developer.github.com/v3/#pagination).
         *
         * When searching for commits, you can get text match metadata for the **message** field when you provide the `text-match` media type. For more details about how to receive highlighted search results, see [Text match metadata](https://developer.github.com/v3/search/#text-match-metadata).
         *
         * **Considerations for commit search**
         *
         * Only the _default branch_ is considered. In most cases, this will be the `master` branch.
         *
         * Suppose you want to find commits related to CSS in the [octocat/Spoon-Knife](https://github.com/octocat/Spoon-Knife) repository. Your query would look something like this:
         */
        commits: {
            (params?: RestEndpointMethodTypes["search"]["commits"]["parameters"]): Promise<RestEndpointMethodTypes["search"]["commits"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Find issues by state and keyword. This method returns up to 100 results [per page](https://developer.github.com/v3/#pagination).
         *
         * When searching for issues, you can get text match metadata for the issue **title**, issue **body**, and issue **comment body** fields when you pass the `text-match` media type. For more details about how to receive highlighted search results, see [Text match metadata](https://developer.github.com/v3/search/#text-match-metadata).
         *
         * Let's say you want to find the oldest unresolved Python bugs on Windows. Your query might look something like this.
         *
         * In this query, we're searching for the keyword `windows`, within any open issue that's labeled as `bug`. The search runs across repositories whose primary language is Python. We’re sorting by creation date in ascending order, so that the oldest issues appear first in the search results.
         */
        issuesAndPullRequests: {
            (params?: RestEndpointMethodTypes["search"]["issuesAndPullRequests"]["parameters"]): Promise<RestEndpointMethodTypes["search"]["issuesAndPullRequests"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Find labels in a repository with names or descriptions that match search keywords. Returns up to 100 results [per page](https://developer.github.com/v3/#pagination).
         *
         * When searching for labels, you can get text match metadata for the label **name** and **description** fields when you pass the `text-match` media type. For more details about how to receive highlighted search results, see [Text match metadata](https://developer.github.com/v3/search/#text-match-metadata).
         *
         * Suppose you want to find labels in the `linguist` repository that match `bug`, `defect`, or `enhancement`. Your query might look like this:
         *
         * The labels that best match for the query appear first in the search results.
         */
        labels: {
            (params?: RestEndpointMethodTypes["search"]["labels"]["parameters"]): Promise<RestEndpointMethodTypes["search"]["labels"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Find repositories via various criteria. This method returns up to 100 results [per page](https://developer.github.com/v3/#pagination).
         *
         * When searching for repositories, you can get text match metadata for the **name** and **description** fields when you pass the `text-match` media type. For more details about how to receive highlighted search results, see [Text match metadata](https://developer.github.com/v3/search/#text-match-metadata).
         *
         * Suppose you want to search for popular Tetris repositories written in Assembly. Your query might look like this.
         *
         * You can search for multiple topics by adding more `topic:` instances, and including the `mercy-preview` header. For example:
         *
         * In this request, we're searching for repositories with the word `tetris` in the name, the description, or the README. We're limiting the results to only find repositories where the primary language is Assembly. We're sorting by stars in descending order, so that the most popular repositories appear first in the search results.
         */
        repos: {
            (params?: RestEndpointMethodTypes["search"]["repos"]["parameters"]): Promise<RestEndpointMethodTypes["search"]["repos"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Find topics via various criteria. Results are sorted by best match. This method returns up to 100 results [per page](https://developer.github.com/v3/#pagination).
         *
         * When searching for topics, you can get text match metadata for the topic's **short\_description**, **description**, **name**, or **display\_name** field when you pass the `text-match` media type. For more details about how to receive highlighted search results, see [Text match metadata](https://developer.github.com/v3/search/#text-match-metadata).
         *
         * See "[Searching topics](https://help.github.com/articles/searching-topics/)" for a detailed list of qualifiers.
         *
         * Suppose you want to search for topics related to Ruby that are featured on [https://github.com/topics](https://github.com/topics). Your query might look like this:
         *
         * In this request, we're searching for topics with the keyword `ruby`, and we're limiting the results to find only topics that are featured. The topics that are the best match for the query appear first in the search results.
         *
         * **Note:** A search for featured Ruby topics only has 6 total results, so a [Link header](https://developer.github.com/v3/#link-header) indicating pagination is not included in the response.
         */
        topics: {
            (params?: RestEndpointMethodTypes["search"]["topics"]["parameters"]): Promise<RestEndpointMethodTypes["search"]["topics"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Find users via various criteria. This method returns up to 100 results [per page](https://developer.github.com/v3/#pagination).
         *
         * When searching for users, you can get text match metadata for the issue **login**, **email**, and **name** fields when you pass the `text-match` media type. For more details about highlighting search results, see [Text match metadata](https://developer.github.com/v3/search/#text-match-metadata). For more details about how to receive highlighted search results, see [Text match metadata](https://developer.github.com/v3/search/#text-match-metadata).
         *
         * Imagine you're looking for a list of popular users. You might try out this query:
         *
         * Here, we're looking at users with the name Tom. We're only interested in those with more than 42 repositories, and only if they have over 1,000 followers.
         */
        users: {
            (params?: RestEndpointMethodTypes["search"]["users"]["parameters"]): Promise<RestEndpointMethodTypes["search"]["users"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
    };
    teams: {
        /**
         * Team synchronization is available for organizations using GitHub Enterprise Cloud. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
         *
         * Adds an organization member to a team. An authenticated organization owner or team maintainer can add organization members to a team.
         *
         * **Note:** When you have team synchronization set up for a team with your organization's identity provider (IdP), you will see an error if you attempt to use the API for making changes to the team's membership. If you have access to manage group membership in your IdP, you can manage GitHub team membership through your identity provider, which automatically adds and removes team members in an organization. For more information, see "[Synchronizing teams between your identity provider and GitHub](https://help.github.com/articles/synchronizing-teams-between-your-identity-provider-and-github/)."
         *
         * An organization owner can add someone who is not part of the team's organization to a team. When an organization owner adds someone to a team who is not an organization member, this endpoint will send an invitation to the person via email. This newly-created membership will be in the "pending" state until the person accepts the invitation, at which point the membership will transition to the "active" state and the user will be added as a member of the team.
         *
         * If the user is already a member of the team, this endpoint will update the role of the team member's role. To update the membership of a team member, the authenticated user must be an organization owner or a team maintainer.
         *
         * **Note:** You can also specify a team by `org_id` and `team_id` using the route `PUT /organizations/:org_id/team/:team_id/memberships/:username`.
         */
        addOrUpdateMembershipForUserInOrg: {
            (params?: RestEndpointMethodTypes["teams"]["addOrUpdateMembershipForUserInOrg"]["parameters"]): Promise<RestEndpointMethodTypes["teams"]["addOrUpdateMembershipForUserInOrg"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Team synchronization is available for organizations using GitHub Enterprise Cloud. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
         *
         * Adds an organization member to a team. An authenticated organization owner or team maintainer can add organization members to a team.
         *
         * **Note:** When you have team synchronization set up for a team with your organization's identity provider (IdP), you will see an error if you attempt to use the API for making changes to the team's membership. If you have access to manage group membership in your IdP, you can manage GitHub team membership through your identity provider, which automatically adds and removes team members in an organization. For more information, see "[Synchronizing teams between your identity provider and GitHub](https://help.github.com/articles/synchronizing-teams-between-your-identity-provider-and-github/)."
         *
         * An organization owner can add someone who is not part of the team's organization to a team. When an organization owner adds someone to a team who is not an organization member, this endpoint will send an invitation to the person via email. This newly-created membership will be in the "pending" state until the person accepts the invitation, at which point the membership will transition to the "active" state and the user will be added as a member of the team.
         *
         * If the user is already a member of the team, this endpoint will update the role of the team member's role. To update the membership of a team member, the authenticated user must be an organization owner or a team maintainer.
         *
         * **Note:** You can also specify a team by `org_id` and `team_id` using the route `PUT /organizations/:org_id/team/:team_id/memberships/:username`.
         * @deprecated octokit.teams.addOrUpdateMembershipInOrg() has been renamed to octokit.teams.addOrUpdateMembershipForUserInOrg() (2020-06-01)
         */
        addOrUpdateMembershipInOrg: {
            (params?: RestEndpointMethodTypes["teams"]["addOrUpdateMembershipInOrg"]["parameters"]): Promise<RestEndpointMethodTypes["teams"]["addOrUpdateMembershipInOrg"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Adds an organization project to a team. To add a project to a team or update the team's permission on a project, the authenticated user must have `admin` permissions for the project. The project and team must be part of the same organization.
         *
         * **Note:** You can also specify a team by `org_id` and `team_id` using the route `PUT /organizations/:org_id/team/:team_id/projects/:project_id`.
         * @deprecated octokit.teams.addOrUpdateProjectInOrg() has been renamed to octokit.teams.addOrUpdateProjectPermissionsInOrg() (2020-06-01)
         */
        addOrUpdateProjectInOrg: {
            (params?: RestEndpointMethodTypes["teams"]["addOrUpdateProjectInOrg"]["parameters"]): Promise<RestEndpointMethodTypes["teams"]["addOrUpdateProjectInOrg"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Adds an organization project to a team. To add a project to a team or update the team's permission on a project, the authenticated user must have `admin` permissions for the project. The project and team must be part of the same organization.
         *
         * **Note:** You can also specify a team by `org_id` and `team_id` using the route `PUT /organizations/:org_id/team/:team_id/projects/:project_id`.
         */
        addOrUpdateProjectPermissionsInOrg: {
            (params?: RestEndpointMethodTypes["teams"]["addOrUpdateProjectPermissionsInOrg"]["parameters"]): Promise<RestEndpointMethodTypes["teams"]["addOrUpdateProjectPermissionsInOrg"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * To add a repository to a team or update the team's permission on a repository, the authenticated user must have admin access to the repository, and must be able to see the team. The repository must be owned by the organization, or a direct fork of a repository owned by the organization. You will get a `422 Unprocessable Entity` status if you attempt to add a repository to a team that is not owned by the organization. Note that, if you choose not to pass any parameters, you'll need to set `Content-Length` to zero when calling out to this endpoint. For more information, see "[HTTP verbs](https://developer.github.com/v3/#http-verbs)."
         *
         * **Note:** You can also specify a team by `org_id` and `team_id` using the route `PUT /organizations/:org_id/team/:team_id/repos/:owner/:repo`.
         *
         * For more information about the permission levels, see "[Repository permission levels for an organization](https://help.github.com/en/github/setting-up-and-managing-organizations-and-teams/repository-permission-levels-for-an-organization#permission-levels-for-repositories-owned-by-an-organization)" in the GitHub Help documentation.
         * @deprecated octokit.teams.addOrUpdateRepoInOrg() has been renamed to octokit.teams.addOrUpdateRepoPermissionsInOrg() (2020-06-01)
         */
        addOrUpdateRepoInOrg: {
            (params?: RestEndpointMethodTypes["teams"]["addOrUpdateRepoInOrg"]["parameters"]): Promise<RestEndpointMethodTypes["teams"]["addOrUpdateRepoInOrg"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * To add a repository to a team or update the team's permission on a repository, the authenticated user must have admin access to the repository, and must be able to see the team. The repository must be owned by the organization, or a direct fork of a repository owned by the organization. You will get a `422 Unprocessable Entity` status if you attempt to add a repository to a team that is not owned by the organization. Note that, if you choose not to pass any parameters, you'll need to set `Content-Length` to zero when calling out to this endpoint. For more information, see "[HTTP verbs](https://developer.github.com/v3/#http-verbs)."
         *
         * **Note:** You can also specify a team by `org_id` and `team_id` using the route `PUT /organizations/:org_id/team/:team_id/repos/:owner/:repo`.
         *
         * For more information about the permission levels, see "[Repository permission levels for an organization](https://help.github.com/en/github/setting-up-and-managing-organizations-and-teams/repository-permission-levels-for-an-organization#permission-levels-for-repositories-owned-by-an-organization)" in the GitHub Help documentation.
         */
        addOrUpdateRepoPermissionsInOrg: {
            (params?: RestEndpointMethodTypes["teams"]["addOrUpdateRepoPermissionsInOrg"]["parameters"]): Promise<RestEndpointMethodTypes["teams"]["addOrUpdateRepoPermissionsInOrg"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Checks whether a team has `admin`, `push`, `maintain`, `triage`, or `pull` permission for a repository. Repositories inherited through a parent team will also be checked.
         *
         * **Note:** You can also specify a team by `org_id` and `team_id` using the route `GET /organizations/:org_id/team/:team_id/repos/:owner/:repo`.
         *
         * You can also get information about the specified repository, including what permissions the team grants on it, by passing the following custom [media type](https://developer.github.com/v3/media/) via the `Accept` header:
         * @deprecated octokit.teams.checkManagesRepoInOrg() has been renamed to octokit.teams.checkPermissionsForRepoInOrg() (2020-06-01)
         */
        checkManagesRepoInOrg: {
            (params?: RestEndpointMethodTypes["teams"]["checkManagesRepoInOrg"]["parameters"]): Promise<RestEndpointMethodTypes["teams"]["checkManagesRepoInOrg"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Checks whether a team has `read`, `write`, or `admin` permissions for an organization project. The response includes projects inherited from a parent team.
         *
         * **Note:** You can also specify a team by `org_id` and `team_id` using the route `GET /organizations/:org_id/team/:team_id/projects/:project_id`.
         */
        checkPermissionsForProjectInOrg: {
            (params?: RestEndpointMethodTypes["teams"]["checkPermissionsForProjectInOrg"]["parameters"]): Promise<RestEndpointMethodTypes["teams"]["checkPermissionsForProjectInOrg"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Checks whether a team has `admin`, `push`, `maintain`, `triage`, or `pull` permission for a repository. Repositories inherited through a parent team will also be checked.
         *
         * **Note:** You can also specify a team by `org_id` and `team_id` using the route `GET /organizations/:org_id/team/:team_id/repos/:owner/:repo`.
         *
         * You can also get information about the specified repository, including what permissions the team grants on it, by passing the following custom [media type](https://developer.github.com/v3/media/) via the `Accept` header:
         */
        checkPermissionsForRepoInOrg: {
            (params?: RestEndpointMethodTypes["teams"]["checkPermissionsForRepoInOrg"]["parameters"]): Promise<RestEndpointMethodTypes["teams"]["checkPermissionsForRepoInOrg"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * To create a team, the authenticated user must be a member or owner of `:org`. By default, organization members can create teams. Organization owners can limit team creation to organization owners. For more information, see "[Setting team creation permissions](https://help.github.com/en/articles/setting-team-creation-permissions-in-your-organization)."
         *
         * When you create a new team, you automatically become a team maintainer without explicitly adding yourself to the optional array of `maintainers`. For more information, see "[About teams](https://help.github.com/en/github/setting-up-and-managing-organizations-and-teams/about-teams)" in the GitHub Help documentation.
         */
        create: {
            (params?: RestEndpointMethodTypes["teams"]["create"]["parameters"]): Promise<RestEndpointMethodTypes["teams"]["create"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Creates a new comment on a team discussion. OAuth access tokens require the `write:discussion` [scope](https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps/).
         *
         * This endpoint triggers [notifications](https://help.github.com/articles/about-notifications/). Creating content too quickly using this endpoint may result in abuse rate limiting. See "[Abuse rate limits](https://developer.github.com/v3/#abuse-rate-limits)" and "[Dealing with abuse rate limits](https://developer.github.com/v3/guides/best-practices-for-integrators/#dealing-with-abuse-rate-limits)" for details.
         *
         * **Note:** You can also specify a team by `org_id` and `team_id` using the route `POST /organizations/:org_id/team/:team_id/discussions/:discussion_number/comments`.
         */
        createDiscussionCommentInOrg: {
            (params?: RestEndpointMethodTypes["teams"]["createDiscussionCommentInOrg"]["parameters"]): Promise<RestEndpointMethodTypes["teams"]["createDiscussionCommentInOrg"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Creates a new discussion post on a team's page. OAuth access tokens require the `write:discussion` [scope](https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps/).
         *
         * This endpoint triggers [notifications](https://help.github.com/articles/about-notifications/). Creating content too quickly using this endpoint may result in abuse rate limiting. See "[Abuse rate limits](https://developer.github.com/v3/#abuse-rate-limits)" and "[Dealing with abuse rate limits](https://developer.github.com/v3/guides/best-practices-for-integrators/#dealing-with-abuse-rate-limits)" for details.
         *
         * **Note:** You can also specify a team by `org_id` and `team_id` using the route `POST /organizations/:org_id/team/:team_id/discussions`.
         */
        createDiscussionInOrg: {
            (params?: RestEndpointMethodTypes["teams"]["createDiscussionInOrg"]["parameters"]): Promise<RestEndpointMethodTypes["teams"]["createDiscussionInOrg"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Deletes a comment on a team discussion. OAuth access tokens require the `write:discussion` [scope](https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps/).
         *
         * **Note:** You can also specify a team by `org_id` and `team_id` using the route `DELETE /organizations/:org_id/team/:team_id/discussions/:discussion_number/comments/:comment_number`.
         */
        deleteDiscussionCommentInOrg: {
            (params?: RestEndpointMethodTypes["teams"]["deleteDiscussionCommentInOrg"]["parameters"]): Promise<RestEndpointMethodTypes["teams"]["deleteDiscussionCommentInOrg"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Delete a discussion from a team's page. OAuth access tokens require the `write:discussion` [scope](https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps/).
         *
         * **Note:** You can also specify a team by `org_id` and `team_id` using the route `DELETE /organizations/:org_id/team/:team_id/discussions/:discussion_number`.
         */
        deleteDiscussionInOrg: {
            (params?: RestEndpointMethodTypes["teams"]["deleteDiscussionInOrg"]["parameters"]): Promise<RestEndpointMethodTypes["teams"]["deleteDiscussionInOrg"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * To delete a team, the authenticated user must be an organization owner or team maintainer.
         *
         * **Note:** You can also specify a team by `org_id` and `team_id` using the route `DELETE /organizations/:org_id/team/:team_id`.
         *
         * If you are an organization owner, deleting a parent team will delete all of its child teams as well.
         */
        deleteInOrg: {
            (params?: RestEndpointMethodTypes["teams"]["deleteInOrg"]["parameters"]): Promise<RestEndpointMethodTypes["teams"]["deleteInOrg"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Gets a team using the team's `slug`. GitHub generates the `slug` from the team `name`.
         *
         * **Note:** You can also specify a team by `org_id` and `team_id` using the route `GET /organizations/:org_id/team/:team_id`.
         */
        getByName: {
            (params?: RestEndpointMethodTypes["teams"]["getByName"]["parameters"]): Promise<RestEndpointMethodTypes["teams"]["getByName"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Get a specific comment on a team discussion. OAuth access tokens require the `read:discussion` [scope](https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps/).
         *
         * **Note:** You can also specify a team by `org_id` and `team_id` using the route `GET /organizations/:org_id/team/:team_id/discussions/:discussion_number/comments/:comment_number`.
         */
        getDiscussionCommentInOrg: {
            (params?: RestEndpointMethodTypes["teams"]["getDiscussionCommentInOrg"]["parameters"]): Promise<RestEndpointMethodTypes["teams"]["getDiscussionCommentInOrg"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Get a specific discussion on a team's page. OAuth access tokens require the `read:discussion` [scope](https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps/).
         *
         * **Note:** You can also specify a team by `org_id` and `team_id` using the route `GET /organizations/:org_id/team/:team_id/discussions/:discussion_number`.
         */
        getDiscussionInOrg: {
            (params?: RestEndpointMethodTypes["teams"]["getDiscussionInOrg"]["parameters"]): Promise<RestEndpointMethodTypes["teams"]["getDiscussionInOrg"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Team members will include the members of child teams.
         *
         * To get a user's membership with a team, the team must be visible to the authenticated user.
         *
         * **Note:** You can also specify a team by `org_id` and `team_id` using the route `GET /organizations/:org_id/team/:team_id/memberships/:username`.
         *
         * **Note:** The `role` for organization owners returns as `maintainer`. For more information about `maintainer` roles, see [Create a team](https://developer.github.com/v3/teams/#create-a-team).
         */
        getMembershipForUserInOrg: {
            (params?: RestEndpointMethodTypes["teams"]["getMembershipForUserInOrg"]["parameters"]): Promise<RestEndpointMethodTypes["teams"]["getMembershipForUserInOrg"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Team members will include the members of child teams.
         *
         * To get a user's membership with a team, the team must be visible to the authenticated user.
         *
         * **Note:** You can also specify a team by `org_id` and `team_id` using the route `GET /organizations/:org_id/team/:team_id/memberships/:username`.
         *
         * **Note:** The `role` for organization owners returns as `maintainer`. For more information about `maintainer` roles, see [Create a team](https://developer.github.com/v3/teams/#create-a-team).
         * @deprecated octokit.teams.getMembershipInOrg() has been renamed to octokit.teams.getMembershipForUserInOrg() (2020-06-01)
         */
        getMembershipInOrg: {
            (params?: RestEndpointMethodTypes["teams"]["getMembershipInOrg"]["parameters"]): Promise<RestEndpointMethodTypes["teams"]["getMembershipInOrg"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Lists all teams in an organization that are visible to the authenticated user.
         */
        list: {
            (params?: RestEndpointMethodTypes["teams"]["list"]["parameters"]): Promise<RestEndpointMethodTypes["teams"]["list"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Lists the child teams of the team requested by `:team_slug`.
         *
         * **Note:** You can also specify a team by `org_id` and `team_id` using the route `GET /organizations/:org_id/team/:team_id/teams`.
         */
        listChildInOrg: {
            (params?: RestEndpointMethodTypes["teams"]["listChildInOrg"]["parameters"]): Promise<RestEndpointMethodTypes["teams"]["listChildInOrg"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * List all comments on a team discussion. OAuth access tokens require the `read:discussion` [scope](https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps/).
         *
         * **Note:** You can also specify a team by `org_id` and `team_id` using the route `GET /organizations/:org_id/team/:team_id/discussions/:discussion_number/comments`.
         */
        listDiscussionCommentsInOrg: {
            (params?: RestEndpointMethodTypes["teams"]["listDiscussionCommentsInOrg"]["parameters"]): Promise<RestEndpointMethodTypes["teams"]["listDiscussionCommentsInOrg"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * List all discussions on a team's page. OAuth access tokens require the `read:discussion` [scope](https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps/).
         *
         * **Note:** You can also specify a team by `org_id` and `team_id` using the route `GET /organizations/:org_id/team/:team_id/discussions`.
         */
        listDiscussionsInOrg: {
            (params?: RestEndpointMethodTypes["teams"]["listDiscussionsInOrg"]["parameters"]): Promise<RestEndpointMethodTypes["teams"]["listDiscussionsInOrg"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * List all of the teams across all of the organizations to which the authenticated user belongs. This method requires `user`, `repo`, or `read:org` [scope](https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps/) when authenticating via [OAuth](https://developer.github.com/apps/building-oauth-apps/).
         */
        listForAuthenticatedUser: {
            (params?: RestEndpointMethodTypes["teams"]["listForAuthenticatedUser"]["parameters"]): Promise<RestEndpointMethodTypes["teams"]["listForAuthenticatedUser"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Team members will include the members of child teams.
         *
         * To list members in a team, the team must be visible to the authenticated user.
         */
        listMembersInOrg: {
            (params?: RestEndpointMethodTypes["teams"]["listMembersInOrg"]["parameters"]): Promise<RestEndpointMethodTypes["teams"]["listMembersInOrg"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * The return hash contains a `role` field which refers to the Organization Invitation role and will be one of the following values: `direct_member`, `admin`, `billing_manager`, `hiring_manager`, or `reinstate`. If the invitee is not a GitHub member, the `login` field in the return hash will be `null`.
         *
         * **Note:** You can also specify a team by `org_id` and `team_id` using the route `GET /organizations/:org_id/team/:team_id/invitations`.
         */
        listPendingInvitationsInOrg: {
            (params?: RestEndpointMethodTypes["teams"]["listPendingInvitationsInOrg"]["parameters"]): Promise<RestEndpointMethodTypes["teams"]["listPendingInvitationsInOrg"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Lists the organization projects for a team.
         *
         * **Note:** You can also specify a team by `org_id` and `team_id` using the route `GET /organizations/:org_id/team/:team_id/projects`.
         */
        listProjectsInOrg: {
            (params?: RestEndpointMethodTypes["teams"]["listProjectsInOrg"]["parameters"]): Promise<RestEndpointMethodTypes["teams"]["listProjectsInOrg"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Lists a team's repositories visible to the authenticated user.
         *
         * **Note:** You can also specify a team by `org_id` and `team_id` using the route `GET /organizations/:org_id/team/:team_id/repos`.
         */
        listReposInOrg: {
            (params?: RestEndpointMethodTypes["teams"]["listReposInOrg"]["parameters"]): Promise<RestEndpointMethodTypes["teams"]["listReposInOrg"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Team synchronization is available for organizations using GitHub Enterprise Cloud. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
         *
         * To remove a membership between a user and a team, the authenticated user must have 'admin' permissions to the team or be an owner of the organization that the team is associated with. Removing team membership does not delete the user, it just removes their membership from the team.
         *
         * **Note:** When you have team synchronization set up for a team with your organization's identity provider (IdP), you will see an error if you attempt to use the API for making changes to the team's membership. If you have access to manage group membership in your IdP, you can manage GitHub team membership through your identity provider, which automatically adds and removes team members in an organization. For more information, see "[Synchronizing teams between your identity provider and GitHub](https://help.github.com/articles/synchronizing-teams-between-your-identity-provider-and-github/)."
         *
         * **Note:** You can also specify a team by `org_id` and `team_id` using the route `DELETE /organizations/:org_id/team/:team_id/memberships/:username`.
         */
        removeMembershipForUserInOrg: {
            (params?: RestEndpointMethodTypes["teams"]["removeMembershipForUserInOrg"]["parameters"]): Promise<RestEndpointMethodTypes["teams"]["removeMembershipForUserInOrg"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Team synchronization is available for organizations using GitHub Enterprise Cloud. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
         *
         * To remove a membership between a user and a team, the authenticated user must have 'admin' permissions to the team or be an owner of the organization that the team is associated with. Removing team membership does not delete the user, it just removes their membership from the team.
         *
         * **Note:** When you have team synchronization set up for a team with your organization's identity provider (IdP), you will see an error if you attempt to use the API for making changes to the team's membership. If you have access to manage group membership in your IdP, you can manage GitHub team membership through your identity provider, which automatically adds and removes team members in an organization. For more information, see "[Synchronizing teams between your identity provider and GitHub](https://help.github.com/articles/synchronizing-teams-between-your-identity-provider-and-github/)."
         *
         * **Note:** You can also specify a team by `org_id` and `team_id` using the route `DELETE /organizations/:org_id/team/:team_id/memberships/:username`.
         * @deprecated octokit.teams.removeMembershipInOrg() has been renamed to octokit.teams.removeMembershipForUserInOrg() (2020-06-01)
         */
        removeMembershipInOrg: {
            (params?: RestEndpointMethodTypes["teams"]["removeMembershipInOrg"]["parameters"]): Promise<RestEndpointMethodTypes["teams"]["removeMembershipInOrg"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Removes an organization project from a team. An organization owner or a team maintainer can remove any project from the team. To remove a project from a team as an organization member, the authenticated user must have `read` access to both the team and project, or `admin` access to the team or project. This endpoint removes the project from the team, but does not delete the project.
         *
         * **Note:** You can also specify a team by `org_id` and `team_id` using the route `DELETE /organizations/:org_id/team/:team_id/projects/:project_id`.
         */
        removeProjectInOrg: {
            (params?: RestEndpointMethodTypes["teams"]["removeProjectInOrg"]["parameters"]): Promise<RestEndpointMethodTypes["teams"]["removeProjectInOrg"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * If the authenticated user is an organization owner or a team maintainer, they can remove any repositories from the team. To remove a repository from a team as an organization member, the authenticated user must have admin access to the repository and must be able to see the team. This does not delete the repository, it just removes it from the team.
         *
         * **Note:** You can also specify a team by `org_id` and `team_id` using the route `DELETE /organizations/:org_id/team/:team_id/repos/:owner/:repo`.
         */
        removeRepoInOrg: {
            (params?: RestEndpointMethodTypes["teams"]["removeRepoInOrg"]["parameters"]): Promise<RestEndpointMethodTypes["teams"]["removeRepoInOrg"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Checks whether a team has `read`, `write`, or `admin` permissions for an organization project. The response includes projects inherited from a parent team.
         *
         * **Note:** You can also specify a team by `org_id` and `team_id` using the route `GET /organizations/:org_id/team/:team_id/projects/:project_id`.
         * @deprecated octokit.teams.reviewProjectInOrg() has been renamed to octokit.teams.checkPermissionsForProjectInOrg() (2020-06-01)
         */
        reviewProjectInOrg: {
            (params?: RestEndpointMethodTypes["teams"]["reviewProjectInOrg"]["parameters"]): Promise<RestEndpointMethodTypes["teams"]["reviewProjectInOrg"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Edits the body text of a discussion comment. OAuth access tokens require the `write:discussion` [scope](https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps/).
         *
         * **Note:** You can also specify a team by `org_id` and `team_id` using the route `PATCH /organizations/:org_id/team/:team_id/discussions/:discussion_number/comments/:comment_number`.
         */
        updateDiscussionCommentInOrg: {
            (params?: RestEndpointMethodTypes["teams"]["updateDiscussionCommentInOrg"]["parameters"]): Promise<RestEndpointMethodTypes["teams"]["updateDiscussionCommentInOrg"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Edits the title and body text of a discussion post. Only the parameters you provide are updated. OAuth access tokens require the `write:discussion` [scope](https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps/).
         *
         * **Note:** You can also specify a team by `org_id` and `team_id` using the route `PATCH /organizations/:org_id/team/:team_id/discussions/:discussion_number`.
         */
        updateDiscussionInOrg: {
            (params?: RestEndpointMethodTypes["teams"]["updateDiscussionInOrg"]["parameters"]): Promise<RestEndpointMethodTypes["teams"]["updateDiscussionInOrg"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * To edit a team, the authenticated user must either be an organization owner or a team maintainer.
         *
         * **Note:** You can also specify a team by `org_id` and `team_id` using the route `PATCH /organizations/:org_id/team/:team_id`.
         */
        updateInOrg: {
            (params?: RestEndpointMethodTypes["teams"]["updateInOrg"]["parameters"]): Promise<RestEndpointMethodTypes["teams"]["updateInOrg"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
    };
    users: {
        /**
         * This endpoint is accessible with the `user` scope.
         */
        addEmailForAuthenticated: {
            (params?: RestEndpointMethodTypes["users"]["addEmailForAuthenticated"]["parameters"]): Promise<RestEndpointMethodTypes["users"]["addEmailForAuthenticated"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * This endpoint is accessible with the `user` scope.
         * @deprecated octokit.users.addEmails() has been renamed to octokit.users.addEmailsForAuthenticated() (2020-06-04)
         */
        addEmails: {
            (params?: RestEndpointMethodTypes["users"]["addEmails"]["parameters"]): Promise<RestEndpointMethodTypes["users"]["addEmails"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        block: {
            (params?: RestEndpointMethodTypes["users"]["block"]["parameters"]): Promise<RestEndpointMethodTypes["users"]["block"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * If the user is blocked:
         *
         * If the user is not blocked:
         */
        checkBlocked: {
            (params?: RestEndpointMethodTypes["users"]["checkBlocked"]["parameters"]): Promise<RestEndpointMethodTypes["users"]["checkBlocked"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * @deprecated octokit.users.checkFollowing() has been renamed to octokit.users.checkPersonIsFollowedByAuthenticated() (2020-06-04)
         */
        checkFollowing: {
            (params?: RestEndpointMethodTypes["users"]["checkFollowing"]["parameters"]): Promise<RestEndpointMethodTypes["users"]["checkFollowing"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        checkFollowingForUser: {
            (params?: RestEndpointMethodTypes["users"]["checkFollowingForUser"]["parameters"]): Promise<RestEndpointMethodTypes["users"]["checkFollowingForUser"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        checkPersonIsFollowedByAuthenticated: {
            (params?: RestEndpointMethodTypes["users"]["checkPersonIsFollowedByAuthenticated"]["parameters"]): Promise<RestEndpointMethodTypes["users"]["checkPersonIsFollowedByAuthenticated"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Adds a GPG key to the authenticated user's GitHub account. Requires that you are authenticated via Basic Auth, or OAuth with at least `write:gpg_key` [scope](https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps/).
         * @deprecated octokit.users.createGpgKey() has been renamed to octokit.users.createGpgKeyForAuthenticated() (2020-06-04)
         */
        createGpgKey: {
            (params?: RestEndpointMethodTypes["users"]["createGpgKey"]["parameters"]): Promise<RestEndpointMethodTypes["users"]["createGpgKey"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Adds a GPG key to the authenticated user's GitHub account. Requires that you are authenticated via Basic Auth, or OAuth with at least `write:gpg_key` [scope](https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps/).
         */
        createGpgKeyForAuthenticated: {
            (params?: RestEndpointMethodTypes["users"]["createGpgKeyForAuthenticated"]["parameters"]): Promise<RestEndpointMethodTypes["users"]["createGpgKeyForAuthenticated"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Adds a public SSH key to the authenticated user's GitHub account. Requires that you are authenticated via Basic Auth, or OAuth with at least `write:public_key` [scope](https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps/).
         * @deprecated octokit.users.createPublicKey() has been renamed to octokit.users.createPublicSshKeyForAuthenticated() (2020-06-04)
         */
        createPublicKey: {
            (params?: RestEndpointMethodTypes["users"]["createPublicKey"]["parameters"]): Promise<RestEndpointMethodTypes["users"]["createPublicKey"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Adds a public SSH key to the authenticated user's GitHub account. Requires that you are authenticated via Basic Auth, or OAuth with at least `write:public_key` [scope](https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps/).
         */
        createPublicSshKeyForAuthenticated: {
            (params?: RestEndpointMethodTypes["users"]["createPublicSshKeyForAuthenticated"]["parameters"]): Promise<RestEndpointMethodTypes["users"]["createPublicSshKeyForAuthenticated"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * This endpoint is accessible with the `user` scope.
         */
        deleteEmailForAuthenticated: {
            (params?: RestEndpointMethodTypes["users"]["deleteEmailForAuthenticated"]["parameters"]): Promise<RestEndpointMethodTypes["users"]["deleteEmailForAuthenticated"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * This endpoint is accessible with the `user` scope.
         * @deprecated octokit.users.deleteEmails() has been renamed to octokit.users.deleteEmailsForAuthenticated() (2020-06-04)
         */
        deleteEmails: {
            (params?: RestEndpointMethodTypes["users"]["deleteEmails"]["parameters"]): Promise<RestEndpointMethodTypes["users"]["deleteEmails"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Removes a GPG key from the authenticated user's GitHub account. Requires that you are authenticated via Basic Auth or via OAuth with at least `admin:gpg_key` [scope](https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps/).
         * @deprecated octokit.users.deleteGpgKey() has been renamed to octokit.users.deleteGpgKeyForAuthenticated() (2020-06-04)
         */
        deleteGpgKey: {
            (params?: RestEndpointMethodTypes["users"]["deleteGpgKey"]["parameters"]): Promise<RestEndpointMethodTypes["users"]["deleteGpgKey"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Removes a GPG key from the authenticated user's GitHub account. Requires that you are authenticated via Basic Auth or via OAuth with at least `admin:gpg_key` [scope](https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps/).
         */
        deleteGpgKeyForAuthenticated: {
            (params?: RestEndpointMethodTypes["users"]["deleteGpgKeyForAuthenticated"]["parameters"]): Promise<RestEndpointMethodTypes["users"]["deleteGpgKeyForAuthenticated"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Removes a public SSH key from the authenticated user's GitHub account. Requires that you are authenticated via Basic Auth or via OAuth with at least `admin:public_key` [scope](https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps/).
         * @deprecated octokit.users.deletePublicKey() has been renamed to octokit.users.deletePublicSshKeyForAuthenticated() (2020-06-04)
         */
        deletePublicKey: {
            (params?: RestEndpointMethodTypes["users"]["deletePublicKey"]["parameters"]): Promise<RestEndpointMethodTypes["users"]["deletePublicKey"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Removes a public SSH key from the authenticated user's GitHub account. Requires that you are authenticated via Basic Auth or via OAuth with at least `admin:public_key` [scope](https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps/).
         */
        deletePublicSshKeyForAuthenticated: {
            (params?: RestEndpointMethodTypes["users"]["deletePublicSshKeyForAuthenticated"]["parameters"]): Promise<RestEndpointMethodTypes["users"]["deletePublicSshKeyForAuthenticated"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Note that you'll need to set `Content-Length` to zero when calling out to this endpoint. For more information, see "[HTTP verbs](https://developer.github.com/v3/#http-verbs)."
         *
         * Following a user requires the user to be logged in and authenticated with basic auth or OAuth with the `user:follow` scope.
         */
        follow: {
            (params?: RestEndpointMethodTypes["users"]["follow"]["parameters"]): Promise<RestEndpointMethodTypes["users"]["follow"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Lists public and private profile information when authenticated through basic auth or OAuth with the `user` scope.
         *
         * Lists public profile information when authenticated through OAuth without the `user` scope.
         */
        getAuthenticated: {
            (params?: RestEndpointMethodTypes["users"]["getAuthenticated"]["parameters"]): Promise<RestEndpointMethodTypes["users"]["getAuthenticated"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Provides publicly available information about someone with a GitHub account.
         *
         * GitHub Apps with the `Plan` user permission can use this endpoint to retrieve information about a user's GitHub plan. The GitHub App must be authenticated as a user. See "[Identifying and authorizing users for GitHub Apps](https://developer.github.com/apps/building-github-apps/identifying-and-authorizing-users-for-github-apps/)" for details about authentication. For an example response, see "[Response with GitHub plan information](https://developer.github.com/v3/users/#response-with-github-plan-information)."
         *
         * The `email` key in the following response is the publicly visible email address from your GitHub [profile page](https://github.com/settings/profile). When setting up your profile, you can select a primary email address to be “public” which provides an email entry for this endpoint. If you do not set a public email address for `email`, then it will have a value of `null`. You only see publicly visible email addresses when authenticated with GitHub. For more information, see [Authentication](https://developer.github.com/v3/#authentication).
         *
         * The Emails API enables you to list all of your email addresses, and toggle a primary email to be visible publicly. For more information, see "[Emails API](https://developer.github.com/v3/users/emails/)".
         */
        getByUsername: {
            (params?: RestEndpointMethodTypes["users"]["getByUsername"]["parameters"]): Promise<RestEndpointMethodTypes["users"]["getByUsername"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Provides hovercard information when authenticated through basic auth or OAuth with the `repo` scope. You can find out more about someone in relation to their pull requests, issues, repositories, and organizations.
         *
         * The `subject_type` and `subject_id` parameters provide context for the person's hovercard, which returns more information than without the parameters. For example, if you wanted to find out more about `octocat` who owns the `Spoon-Knife` repository via cURL, it would look like this:
         */
        getContextForUser: {
            (params?: RestEndpointMethodTypes["users"]["getContextForUser"]["parameters"]): Promise<RestEndpointMethodTypes["users"]["getContextForUser"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * View extended details for a single GPG key. Requires that you are authenticated via Basic Auth or via OAuth with at least `read:gpg_key` [scope](https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps/).
         * @deprecated octokit.users.getGpgKey() has been renamed to octokit.users.getGpgKeyForAuthenticated() (2020-06-04)
         */
        getGpgKey: {
            (params?: RestEndpointMethodTypes["users"]["getGpgKey"]["parameters"]): Promise<RestEndpointMethodTypes["users"]["getGpgKey"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * View extended details for a single GPG key. Requires that you are authenticated via Basic Auth or via OAuth with at least `read:gpg_key` [scope](https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps/).
         */
        getGpgKeyForAuthenticated: {
            (params?: RestEndpointMethodTypes["users"]["getGpgKeyForAuthenticated"]["parameters"]): Promise<RestEndpointMethodTypes["users"]["getGpgKeyForAuthenticated"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * View extended details for a single public SSH key. Requires that you are authenticated via Basic Auth or via OAuth with at least `read:public_key` [scope](https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps/).
         * @deprecated octokit.users.getPublicKey() has been renamed to octokit.users.getPublicSshKeyForAuthenticated() (2020-06-04)
         */
        getPublicKey: {
            (params?: RestEndpointMethodTypes["users"]["getPublicKey"]["parameters"]): Promise<RestEndpointMethodTypes["users"]["getPublicKey"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * View extended details for a single public SSH key. Requires that you are authenticated via Basic Auth or via OAuth with at least `read:public_key` [scope](https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps/).
         */
        getPublicSshKeyForAuthenticated: {
            (params?: RestEndpointMethodTypes["users"]["getPublicSshKeyForAuthenticated"]["parameters"]): Promise<RestEndpointMethodTypes["users"]["getPublicSshKeyForAuthenticated"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Lists all users, in the order that they signed up on GitHub. This list includes personal user accounts and organization accounts.
         *
         * Note: Pagination is powered exclusively by the `since` parameter. Use the [Link header](https://developer.github.com/v3/#link-header) to get the URL for the next page of users.
         */
        list: {
            (params?: RestEndpointMethodTypes["users"]["list"]["parameters"]): Promise<RestEndpointMethodTypes["users"]["list"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * List the users you've blocked on your personal account.
         * @deprecated octokit.users.listBlocked() has been renamed to octokit.users.listBlockedByAuthenticated() (2020-06-04)
         */
        listBlocked: {
            (params?: RestEndpointMethodTypes["users"]["listBlocked"]["parameters"]): Promise<RestEndpointMethodTypes["users"]["listBlocked"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * List the users you've blocked on your personal account.
         */
        listBlockedByAuthenticated: {
            (params?: RestEndpointMethodTypes["users"]["listBlockedByAuthenticated"]["parameters"]): Promise<RestEndpointMethodTypes["users"]["listBlockedByAuthenticated"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Lists all of your email addresses, and specifies which one is visible to the public. This endpoint is accessible with the `user:email` scope.
         * @deprecated octokit.users.listEmails() has been renamed to octokit.users.listEmailsForAuthenticated() (2020-06-04)
         */
        listEmails: {
            (params?: RestEndpointMethodTypes["users"]["listEmails"]["parameters"]): Promise<RestEndpointMethodTypes["users"]["listEmails"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Lists all of your email addresses, and specifies which one is visible to the public. This endpoint is accessible with the `user:email` scope.
         */
        listEmailsForAuthenticated: {
            (params?: RestEndpointMethodTypes["users"]["listEmailsForAuthenticated"]["parameters"]): Promise<RestEndpointMethodTypes["users"]["listEmailsForAuthenticated"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Lists the people who the authenticated user follows.
         */
        listFollowedByAuthenticated: {
            (params?: RestEndpointMethodTypes["users"]["listFollowedByAuthenticated"]["parameters"]): Promise<RestEndpointMethodTypes["users"]["listFollowedByAuthenticated"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Lists the people following the authenticated user.
         */
        listFollowersForAuthenticatedUser: {
            (params?: RestEndpointMethodTypes["users"]["listFollowersForAuthenticatedUser"]["parameters"]): Promise<RestEndpointMethodTypes["users"]["listFollowersForAuthenticatedUser"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Lists the people following the specified user.
         */
        listFollowersForUser: {
            (params?: RestEndpointMethodTypes["users"]["listFollowersForUser"]["parameters"]): Promise<RestEndpointMethodTypes["users"]["listFollowersForUser"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Lists the people who the authenticated user follows.
         * @deprecated octokit.users.listFollowingForAuthenticatedUser() has been renamed to octokit.users.listFollowedByAuthenticated() (2020-03-04)
         */
        listFollowingForAuthenticatedUser: {
            (params?: RestEndpointMethodTypes["users"]["listFollowingForAuthenticatedUser"]["parameters"]): Promise<RestEndpointMethodTypes["users"]["listFollowingForAuthenticatedUser"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Lists the people who the specified user follows.
         */
        listFollowingForUser: {
            (params?: RestEndpointMethodTypes["users"]["listFollowingForUser"]["parameters"]): Promise<RestEndpointMethodTypes["users"]["listFollowingForUser"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Lists the current user's GPG keys. Requires that you are authenticated via Basic Auth or via OAuth with at least `read:gpg_key` [scope](https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps/).
         * @deprecated octokit.users.listGpgKeys() has been renamed to octokit.users.listGpgKeysForAuthenticated() (2020-06-04)
         */
        listGpgKeys: {
            (params?: RestEndpointMethodTypes["users"]["listGpgKeys"]["parameters"]): Promise<RestEndpointMethodTypes["users"]["listGpgKeys"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Lists the current user's GPG keys. Requires that you are authenticated via Basic Auth or via OAuth with at least `read:gpg_key` [scope](https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps/).
         */
        listGpgKeysForAuthenticated: {
            (params?: RestEndpointMethodTypes["users"]["listGpgKeysForAuthenticated"]["parameters"]): Promise<RestEndpointMethodTypes["users"]["listGpgKeysForAuthenticated"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Lists the GPG keys for a user. This information is accessible by anyone.
         */
        listGpgKeysForUser: {
            (params?: RestEndpointMethodTypes["users"]["listGpgKeysForUser"]["parameters"]): Promise<RestEndpointMethodTypes["users"]["listGpgKeysForUser"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Lists your publicly visible email address, which you can set with the [Set primary email visibility for the authenticated user](https://developer.github.com/v3/users/emails/#set-primary-email-visibility-for-the-authenticated-user) endpoint. This endpoint is accessible with the `user:email` scope.
         * @deprecated octokit.users.listPublicEmails() has been renamed to octokit.users.listPublicEmailsForAuthenticatedUser() (2020-06-04)
         */
        listPublicEmails: {
            (params?: RestEndpointMethodTypes["users"]["listPublicEmails"]["parameters"]): Promise<RestEndpointMethodTypes["users"]["listPublicEmails"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Lists your publicly visible email address, which you can set with the [Set primary email visibility for the authenticated user](https://developer.github.com/v3/users/emails/#set-primary-email-visibility-for-the-authenticated-user) endpoint. This endpoint is accessible with the `user:email` scope.
         */
        listPublicEmailsForAuthenticated: {
            (params?: RestEndpointMethodTypes["users"]["listPublicEmailsForAuthenticated"]["parameters"]): Promise<RestEndpointMethodTypes["users"]["listPublicEmailsForAuthenticated"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Lists the public SSH keys for the authenticated user's GitHub account. Requires that you are authenticated via Basic Auth or via OAuth with at least `read:public_key` [scope](https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps/).
         * @deprecated octokit.users.listPublicKeys() has been renamed to octokit.users.listPublicSshKeysForAuthenticated() (2020-06-04)
         */
        listPublicKeys: {
            (params?: RestEndpointMethodTypes["users"]["listPublicKeys"]["parameters"]): Promise<RestEndpointMethodTypes["users"]["listPublicKeys"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Lists the _verified_ public SSH keys for a user. This is accessible by anyone.
         */
        listPublicKeysForUser: {
            (params?: RestEndpointMethodTypes["users"]["listPublicKeysForUser"]["parameters"]): Promise<RestEndpointMethodTypes["users"]["listPublicKeysForUser"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Lists the public SSH keys for the authenticated user's GitHub account. Requires that you are authenticated via Basic Auth or via OAuth with at least `read:public_key` [scope](https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps/).
         */
        listPublicSshKeysForAuthenticated: {
            (params?: RestEndpointMethodTypes["users"]["listPublicSshKeysForAuthenticated"]["parameters"]): Promise<RestEndpointMethodTypes["users"]["listPublicSshKeysForAuthenticated"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Sets the visibility for your primary email addresses.
         */
        setPrimaryEmailVisibilityForAuthenticated: {
            (params?: RestEndpointMethodTypes["users"]["setPrimaryEmailVisibilityForAuthenticated"]["parameters"]): Promise<RestEndpointMethodTypes["users"]["setPrimaryEmailVisibilityForAuthenticated"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Sets the visibility for your primary email addresses.
         * @deprecated octokit.users.togglePrimaryEmailVisibility() has been renamed to octokit.users.setPrimaryEmailVisibilityForAuthenticated() (2020-06-04)
         */
        togglePrimaryEmailVisibility: {
            (params?: RestEndpointMethodTypes["users"]["togglePrimaryEmailVisibility"]["parameters"]): Promise<RestEndpointMethodTypes["users"]["togglePrimaryEmailVisibility"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        unblock: {
            (params?: RestEndpointMethodTypes["users"]["unblock"]["parameters"]): Promise<RestEndpointMethodTypes["users"]["unblock"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * Unfollowing a user requires the user to be logged in and authenticated with basic auth or OAuth with the `user:follow` scope.
         */
        unfollow: {
            (params?: RestEndpointMethodTypes["users"]["unfollow"]["parameters"]): Promise<RestEndpointMethodTypes["users"]["unfollow"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        /**
         * **Note:** If your email is set to private and you send an `email` parameter as part of this request to update your profile, your privacy settings are still enforced: the email address will not be displayed on your public profile or via the API.
         */
        updateAuthenticated: {
            (params?: RestEndpointMethodTypes["users"]["updateAuthenticated"]["parameters"]): Promise<RestEndpointMethodTypes["users"]["updateAuthenticated"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
    };
};
