const { Octokit } = require('@octokit/rest');

const accessToken = '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';
const owner = 'arya011tp';
const octokit = new Octokit({ auth: accessToken });

async function deleteOldBranches() {
    try {
        const repos = await octokit.repos.listForUser({ username: owner });
        console.log(repos)
        const currentDate = new Date();
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        repos.data.forEach(async (repo) => {
            const branches = await octokit.repos.listBranches({ owner, repo: repo.name });

            branches.data.forEach(async (branch) => {
                const branchData = await octokit.repos.getBranch({ owner, repo: repo.name, branch: branch.name });
                const branchCreationDate = new Date(branchData.data.commit.commit.author.date);

                if (branchCreationDate < sixMonthsAgo) {
                    if (branch.name !== 'main' && branch.name !== 'master') {
                        console.log(`Deleting branch: ${branch.name} in repository: ${repo.name}`);
                        await octokit.git.deleteRef({ owner, repo: repo.name, ref: `heads/${branch.name}` });
                    }
                }
            });
        });
    } catch (error) {
        console.error('Error:', error.message);
    }
}

deleteOldBranches();
