require("dotenv").config();
const { Octokit } = require("@octokit/rest");

const octokit = new Octokit({
  auth: process.env.ACCESS_TOKEN,
  userAgent: "jimmy-testing-locally v1.2.3", // This does not matter at all, just needs to be present
});

const REPO_OWNER = process.env.REPO_OWNER;
const REPO_NAME = process.env.REPO_NAME;
const REPO_BASE_URL = `https://github.com/${REPO_OWNER}/${REPO_NAME}/`;
const WORKFLOW_ID = 2052251; // This is mine, yours is surely different

async function getTheSameArtifactLinkThatSomehowTheyDontGiveYouEasily() {
  const workflowRunsList = await octokit.actions.listWorkflowRuns({
    owner: REPO_OWNER,
    repo: REPO_NAME,
    workflow_id: WORKFLOW_ID,
  });

  const latestWorkflowRun = await octokit.actions.getWorkflowRun({
    owner: REPO_OWNER,
    repo: REPO_NAME,
    run_id: workflowRunsList.data.workflow_runs[0].id,
  });
  const artifactsList = await octokit.actions.listWorkflowRunArtifacts({
    owner: REPO_OWNER,
    repo: REPO_NAME,
    run_id: workflowRunsList.data.workflow_runs[0].id,
  });

  const artifactId = artifactsList.data.artifacts[0].url.replace(
    `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/actions/artifacts/`,
    ""
  );
  const suiteId = latestWorkflowRun.data.check_suite_url.replace(
    `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/check-suites/`,
    ""
  );

  return `${REPO_BASE_URL}suites/${suiteId}/artifacts/${artifactId}`;
}

getTheSameArtifactLinkThatSomehowTheyDontGiveYouEasily().then((r) =>
  console.log(r)
);
