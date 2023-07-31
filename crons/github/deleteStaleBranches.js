// deleteOldBranches.js
const GithubService = require("./githubService");
const EmailService = require("./reminderService");

async function deleteOldBranches(token, organization) {
    try {
        const githubService = new GithubService(token);
        const orgRepos = await githubService.getOrganizationRepos(organization);
        const currentDate = new Date();
        const sixMonthsInMs = 6 * 30 * 24 * 60 * 60 * 1000; // 6 months in milliseconds

        for (const repo of orgRepos) {
            const owner = repo.owner.login;
            const repoName = repo.name;

            const branches = await githubService.listBranches(owner, repoName);
            for (const branch of branches) {
                const branchName = branch.name;

                if (branchName === "main" || branchName === "master") {
                    continue;
                }

                const commitInfo = await githubService.getBranchCommitInfo(owner, repoName, branchName);
                const branchCreatedAt = new Date(commitInfo.commit.author.date);
                const timeDifferenceInMs = currentDate - branchCreatedAt;

                if (timeDifferenceInMs >= sixMonthsInMs) {
                    try {
                        await githubService.deleteBranch(owner, repoName, branchName);
                        console.log(`Deleted branch "${branchName}" from "${owner}/${repoName}".`);
                    } catch (error) {
                        console.error(`Error deleting branch "${branchName}" from "${owner}/${repoName}":`, error);
                    }
                }
            }
        }
    } catch (error) {
        console.error("Error deleting old branches:", error);
    }
}
module.exports = {
    deleteOldBranches,
};
