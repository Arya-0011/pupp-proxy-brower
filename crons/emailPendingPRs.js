const { Octokit } = require("octokit");
const nodemailer = require("nodemailer");

const octokit = new Octokit({
  auth: "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",
});

let transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  auth: {
    user: "apikey",
    pass: "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"
  }
})

async function checkOpenPRs() {
  try {
    const { data: userRepos } = await octokit.rest.repos.listForAuthenticatedUser();

    const currentDate = new Date();

    userRepos.forEach(async (repo) => {
      const owner = repo.owner.login;
      const repoName = repo.name;

      const { data: pullRequests } = await octokit.rest.pulls.list({
        owner,
        repo: repoName,
        state: "open",
      });

      pullRequests.forEach(async (pr) => {
        const prCreatedAt = new Date(pr.created_at);
        const timeDifferenceInMs = currentDate - prCreatedAt;
        const timeDifferenceInDays = timeDifferenceInMs / (1000 * 60 * 60 * 24);

        if (timeDifferenceInDays >= 7) { 
          const creatorUsername = pr.user.login;
          const prUrl = pr.html_url;

          const { data: userEmails } = await octokit.rest.users.listEmailsForAuthenticated();
          const creatorEmail = userEmails.find((email) => email.primary)?.email;

          if (creatorEmail) {
            transporter.sendMail({
              from: "arya.aniket@tyreplex.com",
              to: creatorEmail,
              subject: "Test message subject",
              text: "Reminder: Your Pull Request is still open",
              html: `<b>Your Pull Request (${prUrl}) is still open after 7 days. Please consider reviewing and closing it if necessary.</b>`,
            }, function (error, info) {
              if (error) {
                console.log(error);
              } else {
                console.log('Email sent: ' + info.response);
              }
            });
          }
        }
      });
    });
  } catch (error) {
    console.error("Error checking open PRs:", error);
  }
}

checkOpenPRs();
