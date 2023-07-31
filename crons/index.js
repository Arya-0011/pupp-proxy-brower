const { checkOpenPRs } = require("./github/emailPendingPRs");
const { deleteOldBranches } = require('./github/deleteStaleBranches')
require('dotenv').config()

checkOpenPRs(process.env.TOKEN, process.env.ORGANIZATION, "arya.aniket@tyreplex.com", ["arya.aniket@tyreplex.com", "test.tyreplex.com"]);

deleteOldBranches(process.env.TOKEN, process.env.ORGANIZATION)
