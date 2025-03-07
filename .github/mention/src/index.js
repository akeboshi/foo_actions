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
      const commentUrl = context.payload.comment.html_url;


      // 引数としてとるように変更してもよし
      const members = {
        "me": ["akeboshi"]
      };

      let newMention = null;

      for (const [key, users] of Object.entries(members)) {
        const regex = new RegExp(`\s+to\s+${key}\s+`, "g");

        if (context.eventName === "issue_comment" && context.payload.action === "edited") {
            const previousBody = context.payload.changes?.body?.from || "";
  
            // が新しく mention が追加されたかを確認
            if (!previousBody.match(regex) && commentBody.match(regex)) {
              newMention = users.map(u => `@${u}`).join(" ");
              break;
            }
          } 
          // 新規コメントの場合は通常通りチェック
          else if (regex.test(commentBody)) {
            newMention = users.map(u => `@${u}`).join(" ");
            break;
          }
      }

      if (newMention) {
        await octokit.rest.issues.createComment({
          ...repo,
          issue_number: issueNumber,
          body: `${newMention}\n[元コメント](${commentUrl})`
        });
      }
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
