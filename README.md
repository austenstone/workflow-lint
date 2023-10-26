# Workflow Lint 🧹

Lint GitHub Actions workflow files using [`cschleiden/github-actions-parser`](https://github.com/cschleiden/github-actions-parser).

## Usage
Create a workflow (eg: `.github/workflows/seat-count.yml`). See [Creating a Workflow file](https://help.github.com/en/articles/configuring-a-workflow#creating-a-workflow-file).

<!-- 
### PAT(Personal Access Token)

You will need to [create a PAT(Personal Access Token)](https://github.com/settings/tokens/new?scopes=admin:org) that has `admin:org` access.

Add this PAT as a secret so we can use it as input `github-token`, see [Creating encrypted secrets for a repository](https://docs.github.com/en/enterprise-cloud@latest/actions/security-guides/encrypted-secrets#creating-encrypted-secrets-for-a-repository). 
### Organizations

If your organization has SAML enabled you must authorize the PAT, see [Authorizing a personal access token for use with SAML single sign-on](https://docs.github.com/en/enterprise-cloud@latest/authentication/authenticating-with-saml-single-sign-on/authorizing-a-personal-access-token-for-use-with-saml-single-sign-on).
-->

#### Example (All)
Lint all files in `.github/workflows`
```yml
name: Usage
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
  workflow_dispatch:
permissions: write-all

jobs:
  run:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: austenstone/workflow-lint@main
```

#### Example (Changed)
Lint all changed .yml files
```yml
name: Usage
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
  workflow_dispatch:
permissions: write-all

jobs:
  run:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - id: changed-files
        uses: tj-actions/changed-files@v39
        with:
          files: "**/*.{yml,yaml}"
      - uses: austenstone/workflow-lint@main
        with:
          files: ${{ steps.changed-files.outputs.all_changed_files }}
```

## ➡️ Inputs
Various inputs are defined in [`action.yml`](action.yml):

| Name | Description | Default |
| --- | - | - |
| files | Files to lint | `.github/workflows` |


## ⬅️ Outputs
| Name | Description |
| --- | - |
| results | The JSON results. |


## Further help
To get more help on the Actions see [documentation](https://docs.github.com/en/actions).
