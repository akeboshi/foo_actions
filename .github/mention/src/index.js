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

      let newCommentBody = commentBody;

      for (const [key, users] of Object.entries(members)) {
        const regex = new RegExp(`\\bto ${key}\\b`, "g");
        if (regex.test(commentBody)) {
          newCommentBody = newCommentBody.replace(regex, users.map(u => `@${u}`).join(" "));
        }
      }

      if (newCommentBody !== commentBody) {
        await octokit.rest.issues.createComment({
          ...repo,
          issue_number: issueNumber,
          body: newCommentBody
        });
      }
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
