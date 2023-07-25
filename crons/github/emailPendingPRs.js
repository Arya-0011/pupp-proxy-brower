// Assuming you have made the changes to the GithubService class as mentioned in the previous response.

const GithubService = require("./githubService");
const EmailService = require("./reminderService");

async function checkOpenPRs() {
    try {
        const githubService = new GithubService("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");
        const emailService = new EmailService();
        const userRepos = await githubService.getAuthenticatedUserRepos();
        // console.log(userRepos)
        const currentDate = new Date();

        for (const repo of userRepos) {
            const owner = repo.owner.login;
            const repoName = repo.name;

            const pullRequests = await githubService.getOpenPullRequests(owner, repoName);

            for (const pr of pullRequests) {
                const prCreatedAt = new Date(pr.created_at);
                const timeDifferenceInMs = currentDate - prCreatedAt;
                const timeDifferenceInDays = timeDifferenceInMs / (1000 * 60 * 60 * 24);

                if (timeDifferenceInDays >= 0) {
                    const userEmails = await githubService.getUserEmails();

                    if (!Array.isArray(userEmails) || userEmails.length === 0) {
                        throw new Error("User emails array is empty or not an array.");
                    }

                    const creatorEmail = userEmails.find((email) => email.primary)?.email;
                    if (creatorEmail) {
                        await emailService.sendReminderEmail(creatorEmail, pr.html_url);
                    }
                }
            }
        }
    } catch (error) {
        console.error("Error checking open PRs:", error);
    }
}

module.exports = {
    checkOpenPRs,
};
