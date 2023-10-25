import { getInput, setOutput, setFailed, startGroup, endGroup, error } from '@actions/core';
import { NoOperationTraceWriter, parseWorkflow } from '@actions/workflow-parser';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

interface Input {
  token: string;
  owner: string;
  repo: string;
  files: string;
}
const WORKFLOW_DIR = '.github/workflows';

export function getInputs(): Input {
  const result = {} as Input;
  result.token = getInput('github-token');
  result.owner = getInput('owner');
  result.repo = getInput('repo');
  result.files = getInput('files');
  return result;
}

const run = async (): Promise<void> => {
  const inputs = getInputs();
  const workflowFiles = inputs.files ?
    inputs.files.split(', ')
    :
    readdirSync(WORKFLOW_DIR)
      .filter(name => name.endsWith('.yml') || name.endsWith('.yaml'))
      .map(name => join(WORKFLOW_DIR, name));
  startGroup(`Linting ${workflowFiles.length} workflow files`)
  workflowFiles.forEach(name => console.log(name));
  endGroup()
  if (workflowFiles.length === 0) return setFailed('No workflow files found');

  const results = workflowFiles.map(name => parseWorkflow({
    name,
    content: readFileSync(name, 'utf8')
  }, new NoOperationTraceWriter()));
  setOutput('results', JSON.stringify(results));

  results.forEach(result => {
    const errors = result.context.errors.getErrors();
    errors.forEach(err => error(err.message, {
      endColumn: err.range?.end.column,
      startColumn: err.range?.start.column,
      endLine: err.range?.end.line,
      startLine: err.range?.start.line,
      file: result.context.getFileTable()[0],
      title: err.message.split('at')[0].trim(),
    }));
  });  
};

run();
