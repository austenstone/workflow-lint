import { getInput, info } from "@actions/core";
import { getOctokit } from "@actions/github";

interface Input {
  token: string;
}

export function getInputs(): Input {
  const result = {} as Input;
  result.token = getInput("github-token");
  return result;
}

const run = async (): Promise<void> => {
  const input = getInputs();
  const octokit = getOctokit(input.token);

  const {
    viewer: { login },
  }: any = await octokit.graphql(`{ 
    viewer {
      login
    }
  }`);

  info(`Hello, ${login}!`);
};

run();
