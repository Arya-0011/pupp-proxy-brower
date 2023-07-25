// deleteOldBranches.js
const GithubService = require("./githubService");
const EmailService = require("./reminderService");

async function deleteOldBranches() {
    try {
        const githubService = new GithubService("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");
        const userRepos = await githubService.getAuthenticatedUserRepos();
        const currentDate = new Date();
        const sixMonthsInMs = 6 * 30 * 24 * 60 * 60 * 1000; // 6 months in milliseconds

        for (const repo of userRepos) {
            const owner = repo.owner.login;
            const repoName = repo.name;

            const branches = await githubService.listBranches(owner, repoName);

            for (const branch of branches) {
                const branchName = branch.name;
                if (!branch.commit || !branch.commit.commit || !branch.commit.commit.author) {
                    console.log(`Skipping branch "${branchName}" from "${owner}/${repoName}" due to missing commit information.`);
                    continue;
                }

                const branchCreatedAt = new Date(branch.commit.commit.author.date);
                const timeDifferenceInMs = currentDate - branchCreatedAt;
                console.log(branchName);
                if (timeDifferenceInMs >= sixMonthsInMs) {
                    await githubService.deleteBranch(owner, repoName, branchName);
                    console.log(`Deleted branch "${branchName}" from "${owner}/${repoName}".`);
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
