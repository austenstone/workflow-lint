import { getInput, setOutput } from "@actions/core";
import { context } from "@actions/github";
import { NoOperationTraceWriter, parseWorkflow } from "@actions/workflow-parser";
// import octokit
import { Octokit } from "@octokit/rest";
import { readFileSync } from "fs";

interface Input {
  token: string;
  owner: string;
  repo: string;
  files: string;
}

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
    head_sha: context.sha,
    status: 'in_progress',
  });

  const workflowFiles = inputs.files.split(',');
  const workflows = workflowFiles.map(name => ({
    name,
    content: readFileSync(name, "utf8")
  }));
  console.log(workflows);
  
  const results = workflows.map(workflow => ({
    path: workflow.name,
    result: parseWorkflow(workflow, new NoOperationTraceWriter())
  }));
  setOutput("results", JSON.stringify(results));

  const annotations = results.reduce((acc, result) => {
    const errors = result.result.context.errors.getErrors();
    const _annotations = errors.map(error => ({
      path: result.path,
      start_line: error.range?.start.line,
      end_line: error.range?.end.line,
      start_column: error.range?.start.column,
      end_column: error.range?.end.column,
      annotation_level: "failure",
      message: error.message,
      title: error.message.split('at')[0],
    }));
    return acc.concat(_annotations);
  }, [] as any[]);

  await octokit.rest.checks.update({
    owner: context.repo.owner,
    repo: context.repo.repo,
    check_run_id: check.data.id,
    conclusion: annotations.length > 0 ? "failure" : "success",
    output: {
      title: "GitHub Actions Workflow Lint",
      summary: `${annotations.length} errors found in ${inputs.files}`,
      annotations: annotations
    }
  });
};

run();
