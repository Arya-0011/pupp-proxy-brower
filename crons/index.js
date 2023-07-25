const { checkOpenPRs } = require("./github/emailPendingPRs");
const { deleteStaleBranches } = require('./github/deleteStaleBranches')

checkOpenPRs();
deleteStaleBranches()
