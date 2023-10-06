import { getInput } from "@actions/core";
import { NoOperationTraceWriter, parseWorkflow } from "@actions/workflow-parser";
// import octokit
import { Octokit } from "@octokit/rest";
import { readFileSync } from "fs";

interface Input {
  token: string;
  owner: string;
  repo: string;
}

export function getInputs(): Input {
  const result = {} as Input;
  result.token = getInput("github-token");
  result.owner = getInput('owner');
  result.repo = getInput('repo');
  return result;
}

const run = async (): Promise<void> => {
  const inputs = getInputs();
  // get a list of changed files in this PR using octokit
  const octokit = new Octokit({ auth: inputs.token });
  const { data } = await octokit.pulls.listFiles({
    owner: "microsoft",
    repo: "vscode",
    pull_number: 1234
  });
  // filter the list of changed files to only include workflow files
  const workflowFiles = data.filter(file => file.filename.endsWith(".yml"));
  // read workflow file content
  workflowFiles.map(file => {
    return readFileSync(file.filename, "utf8");
  });

  const result = parseWorkflow({
    name: '123',
    content: '123'
  }, new NoOperationTraceWriter());

  console.log(result);
};

run();
