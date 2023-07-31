const GithubService = require("./githubService");
const EmailService = require("./reminderService");

async function checkOpenPRs(token, organization, fromEmail, ccEmails) {
    try {
        const githubService = new GithubService(token);
        const emailService = new EmailService();

        const org = await githubService.getOrganizationDetails(organization);
        const orgRepos = await githubService.getOrganizationRepos(organization);
        const currentDate = new Date();

        for (const repo of orgRepos) {
            const owner = repo.owner.login;
            const repoName = repo.name;
            const pullRequests = await githubService.getOpenPullRequests(owner, repoName);
            
            for (const pr of pullRequests) {
                const prCreatedAt = new Date(pr.created_at);
                const timeDifferenceInMs = currentDate - prCreatedAt;
                const timeDifferenceInDays = timeDifferenceInMs / (1000 * 60 * 60 * 24);

                if (timeDifferenceInDays >= 0) {
                    const creatorEmail = await githubService.getPullRequestCreatorEmail(pr.user.login);

                    if (creatorEmail) {
                        await emailService.sendReminderEmail(fromEmail, creatorEmail, ccEmails, pr.html_url);
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
