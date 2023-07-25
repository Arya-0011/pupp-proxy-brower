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
            console.log(userEmails);
            return userEmails;
        } catch (error) {
            throw new Error("Error fetching user emails:", error);
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
}

module.exports = GithubService;
