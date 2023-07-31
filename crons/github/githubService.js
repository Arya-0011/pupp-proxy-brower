const { Octokit } = require("@octokit/rest");

class GithubService {
    constructor(authToken) {
        this.octokit = new Octokit({
            auth: authToken,
        });
    }

    async getAuthenticatedUserRepos() {
        try {
            const { data: userRepos } = await this.octokit.repos.listForAuthenticatedUser();
            return userRepos;
        } catch (error) {
            throw new Error("Error fetching user repositories:", error);
        }
    }

    async getOrganizationDetails(orgName) {
        try {
            const { data: organization } = await this.octokit.orgs.get({
                org: orgName,
            });
            return organization;
        } catch (error) {
            throw new Error(`Error fetching organization details for ${orgName}: ${error.message}`);
        }
    }

    async getOpenPullRequests(owner, repoName) {
        try {
            const { data: pullRequests } = await this.octokit.pulls.list({
                owner,
                repo: repoName,
                state: "open",
            });
            return pullRequests;
        } catch (error) {
            throw new Error("Error fetching open pull requests:", error);
        }
    }

    async getUserEmails() {
        try {
            const { data: userEmails } = await this.octokit.users.listEmailsForAuthenticatedUser();
            return userEmails;
        } catch (error) {
            throw new Error("Error fetching user emails:", error);
        }
    }

    async getOrganizationRepos(orgName) {
        try {
            const { data: orgRepos } = await this.octokit.repos.listForOrg({
                org: orgName,
            });
            return orgRepos;
        } catch (error) {
            throw new Error(`Error fetching organization repositories for ${orgName}: ${error.message}`);
        }
    }

    async getPullRequestCreatorEmail(username) {
        try {
            const { data: userEmails } = await this.octokit.users.listEmailsForAuthenticatedUser({
                username,
            });

            // Assuming the first email in the userEmails array is the primary email
            const creatorEmail = userEmails[0]?.email;
            return creatorEmail;
        } catch (error) {
            throw new Error(`Error fetching user emails for ${username}: ${error.message}`);
        }
    }

    async listBranches(owner, repoName) {
        try {
            const { data: branches } = await this.octokit.repos.listBranches({
                owner,
                repo: repoName,
            });
            return branches;
        } catch (error) {
            throw new Error(`Error fetching branches for ${owner}/${repoName}: ${error.message}`);
        }
    }

    async deleteBranch(owner, repoName, branchName) {
        try {
            await this.octokit.git.deleteRef({
                owner,
                repo: repoName,
                ref: `heads/${branchName}`,
            });
        } catch (error) {
            throw new Error(`Error deleting branch ${branchName} from ${owner}/${repoName}: ${error.message}`);
        }
    }

    async getBranchCommitInfo(owner, repoName, branchName) {
        try {
            const { data: commit } = await this.octokit.repos.getBranch({
                owner,
                repo: repoName,
                branch: branchName,
            });
            return commit.commit;
        } catch (error) {
            throw new Error(`Error fetching commit information for branch ${branchName} in ${owner}/${repoName}: ${error.message}`);
        }
    }
}

module.exports = GithubService;
