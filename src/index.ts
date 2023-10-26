import { getInput, setFailed, group, error, setOutput } from '@actions/core';
import { NoOperationTraceWriter, ParseWorkflowResult, parseWorkflow } from '@actions/workflow-parser';
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
    inputs.files.split(/,| /)
    :
    readdirSync(WORKFLOW_DIR)
      .filter(name => name.endsWith('.yml') || name.endsWith('.yaml'))
      .map(name => join(WORKFLOW_DIR, name));

  let results: ParseWorkflowResult[] = [];
  workflowFiles.forEach(fileName => {
    group(`Linting ${fileName}`, async () => {
      try {
        const result = parseWorkflow({
          name: fileName,
          content: readFileSync(fileName, 'utf8')
        }, new NoOperationTraceWriter());
        result.context.errors.getErrors()?.forEach(err => {
          const message = err.message.split(/\): /);
          error(
            message[1],
            {
              endColumn: err.range?.end.column,
              startColumn: err.range?.start.column,
              endLine: err.range?.end.line,
              startLine: err.range?.start.line,
              file: result.context.getFileTable()[0],
            }
          )
          results.push(result);
        });
      } catch (err) {
        setFailed(`Workflow ${fileName} failed to parse: ${(err instanceof Error) ? err.message : err}`);
        return;
      }
    });
  });
  setOutput('results', JSON.stringify(results))
};

run();
