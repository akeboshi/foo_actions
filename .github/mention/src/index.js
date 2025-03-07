const core = require("@actions/core");
const github = require("@actions/github");
const fs = require("fs");

async function run() {
  try {
    const token = core.getInput("github-token");
    const octokit = github.getOctokit(token);
    const context = github.context;

    if (context.payload.comment) {
      const commentBody = context.payload.comment.body;
      const issueNumber = context.payload.issue.number;
      const repo = context.repo;

      // 引数としてとるように変更してもよし
      const members = {
        "me": ["akeboshi"]
      };

      let newMention = null;

      for (const [key, users] of Object.entries(members)) {
        const regex = new RegExp(`\s+to\s+${key}\s+`, "g");
        if (regex.test(commentBody)) {
          newMention = users.map(u => `@${u}`).join(" ");
          break;
        }
      }

      if (newMention) {
        await octokit.rest.issues.createComment({
          ...repo,
          issue_number: issueNumber,
          body: `${newMention} ↑`
        });
      }
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
