import { getInput, setOutput, setFailed } from "@actions/core";
import { context } from "@actions/github";
import { NoOperationTraceWriter, parseWorkflow } from "@actions/workflow-parser";
// import octokit
import { Octokit } from "@octokit/rest";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";

interface Input {
  token: string;
  owner: string;
  repo: string;
  files: string;
}
const WORKFLOW_DIR = ".github/workflows";

export function getInputs(): Input {
  const result = {} as Input;
  result.token = getInput("github-token");
  result.owner = getInput('owner');
  result.repo = getInput('repo');
  result.files = getInput('files');
  return result;
}

const run = async (): Promise<void> => {
  const inputs = getInputs();
  const octokit = new Octokit({ auth: inputs.token });
  const check = await octokit.rest.checks.create({
    owner: context.repo.owner,
    repo: context.repo.repo,
    name: "GitHub Actions Workflow Lint",
    head_sha: context.sha, // context.payload.pull_request?.head.sha || 
    status: 'in_progress',
  });

  const workflowFiles = inputs.files ?
    inputs.files.split(', ')
    :
    readdirSync(WORKFLOW_DIR)
      .filter(name => name.endsWith(".yml") || name.endsWith(".yaml"))
      .map(name => join(WORKFLOW_DIR, name));
  if (workflowFiles.length === 0) return setFailed("No workflow files found");

  const results = workflowFiles.map(name => {
    return {
      path: name,
      result: parseWorkflow({
        name,
        content: readFileSync(name, "utf8")
      }, new NoOperationTraceWriter())
    };
  });
  setOutput("results", JSON.stringify(results));

  const annotations = results.reduce((acc, result) => {
    const errors = result.result.context.errors.getErrors();
    return acc.concat(errors.map(error => ({
      path: result.path,
      start_line: error.range?.start.line,
      end_line: error.range?.end.line,
      start_column: error.range?.start.column,
      end_column: error.range?.end.column,
      annotation_level: "failure",
      message: error.message,
      title: error.message.split('at')[0],
    })));
  }, [] as any[]);

  await octokit.rest.checks.update({
    owner: context.repo.owner,
    repo: context.repo.repo,
    check_run_id: check.data.id,
    conclusion: annotations.length > 0 ? 'failure' : 'success',
    output: {
      title: "GitHub Actions Workflow Lint",
      summary: `${annotations.length} errors found in ${inputs.files}`,
      annotations,
    },
  });
};

run();
