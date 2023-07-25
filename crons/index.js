const { checkOpenPRs } = require("./github/emailPendingPRs");
const { deleteOldBranches } = require('./github/deleteStaleBranches')

checkOpenPRs();
deleteOldBranches()
