import { getInput, setOutput } from "@actions/core";
import { context } from "@actions/github";
import { NoOperationTraceWriter, parseWorkflow } from "@actions/workflow-parser";
// import octokit
import { Octokit } from "@octokit/rest";
import { readFileSync } from "fs";
import { basename } from "path";

interface Input {
  token: string;
  owner?: string;
  repo?: string;
  pull_number?: number;
  workflow_path?: string;
}

export function getInputs(): Input {
  const result = {} as Input;
  result.token = getInput("github-token");
  result.owner = getInput('owner');
  result.repo = getInput('repo');
  result.pull_number = parseInt(getInput('pull_number'));
  result.workflow_path = getInput('workflow_path');
  return result;
}

const run = async (): Promise<void> => {
  const inputs = getInputs();
  const octokit = new Octokit({ auth: inputs.token });
  
  if (inputs.workflow_path) {
    const workflowContent = readFileSync(inputs.workflow_path, "utf8");

    const result = parseWorkflow({
      name: basename(inputs.workflow_path),
      content: workflowContent
    }, new NoOperationTraceWriter());

    setOutput("result", JSON.stringify(result));

    const errors = result.context.errors.getErrors();
    
    const check = await octokit.rest.checks.create({
      owner: context.repo.owner,
      repo: context.repo.repo,
      name: "GitHub Actions Workflow Lint",
      head_sha: context.sha,
      status: 'in_progress',
    });
    
    const annotations = errors.map(error => {
      return {
        path: inputs.workflow_path,
        start_line: error.range?.start.line,
        end_line: error.range?.end.line,
        annotation_level: "failure",
        message: error.message,
        title: error.message.split('at')[0],
      }
    });

    await octokit.rest.checks.update({
      owner: context.repo.owner,
      repo: context.repo.repo,
      check_run_id: check.data.id,
      conclusion: errors.length > 0 ? "failure" : "success",
      output: {
        title: "GitHub Actions Workflow Lint",
        summary: `${errors.length} errors found in ${inputs.workflow_path}`,
        annotations: annotations
      }
    })
  } else if (inputs.pull_number && inputs.owner && inputs.repo) {
    const { data } = await octokit.pulls.listFiles({
      owner: inputs.owner,
      repo: inputs.repo,
      pull_number: inputs.pull_number
    });
  
    const workflowFiles = data.filter(file => file.filename.endsWith(".yml"));
  
    workflowFiles.map(file => {
      return readFileSync(file.filename, "utf8");
    });

    console.log(workflowFiles);
  } else {
  }
};

run();
