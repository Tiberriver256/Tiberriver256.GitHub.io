---
published: true
layout: post
title: "Organizational Knowledge at Scale: Distribution and Demo"
description: "Share AI skills across your entire organization using VS Code workspaces. Complete end-to-end demo of building and deploying organizational knowledge."
modified: 2025-11-02
tags:
  - AI
  - GitHub Copilot
  - DevOps
  - Team Collaboration
categories:
  - AI and Technology
---

**Part 3 of 3** in the Skills Catalog series ([Part 1](/ai-and-technology/skills-catalog-part-1-indexing-ai-context) | [Part 2](/ai-and-technology/skills-catalog-part-2-building-skills-that-scale))

You've built a beautiful skills catalog. Nested domains. Scripts that execute on demand. A clean index that scales to hundreds of skills.

Now the question: **How do you share this across your 50 repositories without copy-pasting folders everywhere?**

The answer: **A shared skills repository plus VS Code workspaces.**

**The key insight**: VS Code automatically merges `.github/copilot-instructions.md` files from all workspace folders. This means you don't need to wire anything up—just add the workspace folder and the skills become available.

This final part shows you how to centralize organizational knowledge in one place and make it available to any project with a simple workspace configuration. Then we'll walk through a complete end-to-end demo—from adding a new skill to watching it work in GitHub Copilot.

## The Portability Challenge

Your `.github/skills/` directory is valuable. It contains:
- Organizational standards
- Tested scripts
- Domain expertise
- Battle-tested patterns

But every team has multiple repositories:
- Frontend apps
- Backend services
- Infrastructure as code
- Shared libraries
- Documentation sites

Do you copy `.github/skills/` into each repo? What happens when you update a script or add a new skill? Sync them all manually?

**That doesn't scale.**

## The Shared Skills Repository

**Solution**: Create one repository that holds all organizational skills. Every other repository references it.

### Repository Structure

Create a new repository called `org-skills` (or whatever you prefer):

```
org-skills/
├── README.md
├── .github/
│   ├── copilot-instructions.md
│   └── workflows/
│       └── validate-skills.yml
└── skills/
    ├── azure-devops/
    │   ├── index.md
    │   ├── pipelines.md
    │   ├── repos.md
    │   ├── work-items.md
    │   └── scripts/
    │       ├── get-related-work-items.ps1
    │       └── create-pr.ps1
    ├── aws/
    │   ├── index.md
    │   ├── ec2.md
    │   ├── s3.md
    │   └── scripts/
    ├── docker/
    │   ├── index.md
    │   ├── compose.md
    │   └── templates/
    ├── powershell/
    │   ├── index.md
    │   ├── standards.md
    │   └── modules.md
    └── react/
        ├── index.md
        ├── components.md
        └── patterns.md
```

This repository becomes your **single source of truth** for organizational knowledge.

### Benefits

1. **Version control**: Skills evolve over time; track changes
2. **Collaboration**: Teams contribute skills via PRs
3. **Validation**: CI can verify scripts work, markdown is valid, links aren't broken
4. **Discoverability**: New team members clone one repo and see all organizational knowledge
5. **Consistency**: Everyone uses the same versions of scripts and standards

## VS Code Workspaces: The Magic Distribution Mechanism

Here's the key insight: **VS Code automatically merges `.github/copilot-instructions.md` files from all folders in a workspace.**

This means you don't need templates. You don't need to wire anything up. You just need:
1. A skills table in the shared repo's `.github/copilot-instructions.md`
2. Add that repo as a workspace folder

### How It Works

In any project repository, create a `.code-workspace` file:

**`my-app.code-workspace`**:

```json
{
  "folders": [
    {
      "name": "my-app",
      "path": "."
    },
    {
      "name": "org-skills",
      "path": "../org-skills"
    }
  ],
  "settings": {
    "github.copilot.enable": {
      "*": true
    }
  }
}
```

This workspace includes:
1. The current repository (`.`)
2. The org-skills repository (`../org-skills`)

When you open this workspace in VS Code, both folders are visible. More importantly, **GitHub Copilot automatically reads `.github/copilot-instructions.md` from both folders and merges them.**

### The Shared Repo's Copilot Instructions

In your `org-skills` repository, create **`.github/copilot-instructions.md`**:

```markdown
# Organizational Skills

This repository contains organizational knowledge and standards.

## Available Skills

| Skill Name | Description | Path |
|------------|-------------|------|
| Azure DevOps | Work with Azure DevOps repos, pipelines, work items | `skills/azure-devops/index.md` |
| AWS | AWS services and patterns | `skills/aws/index.md` |
| Docker | Container standards and compose patterns | `skills/docker/index.md` |
| PowerShell | PowerShell coding standards | `skills/powershell/index.md` |
| React | React component patterns | `skills/react/index.md` |
```

Notice the paths are relative to the org-skills repository (`skills/...`), not absolute paths.

**That's it.** No wiring needed in your project repositories. VS Code merges the instructions automatically when the workspace is opened.

**You've just injected organizational knowledge without copying a single file or creating any templates.**

## Bootstrapping New Projects

When starting a new repository:

1. **Clone the shared skills repo** alongside your new project:

```bash
cd ~/projects
git clone https://github.com/your-org/my-new-app.git
git clone https://github.com/your-org/org-skills.git
```

2. **Create a workspace file** in `my-new-app`:

```bash
cd my-new-app
cat > my-new-app.code-workspace << 'EOF'
{
  "folders": [
    {
      "name": "my-new-app",
      "path": "."
    },
    {
      "name": "org-skills",
      "path": "../org-skills"
    }
  ]
}
EOF
```

3. **Open the workspace**:

```bash
code my-new-app.code-workspace
```

**Done.** Your new project now has access to all organizational skills. VS Code automatically merges the `.github/copilot-instructions.md` from both folders.

## Updating Skills Everywhere

When you add a new skill or update an existing one:

1. **Make changes in `org-skills`** repository
2. **Commit and push**
3. **Every project pulls the latest** `org-skills`:

```bash
cd ~/projects/org-skills
git pull
```

All workspaces that reference `org-skills` now see the updates. No syncing required.

## Combining Repo-Specific and Org-Wide Knowledge

Because VS Code merges `.github/copilot-instructions.md` from all workspace folders, you naturally get layered knowledge:

**`org-skills/.github/copilot-instructions.md`** provides org-wide skills:

```markdown
## Organizational Skills

| Skill Name | Path |
|------------|------|
| Azure DevOps | `skills/azure-devops/index.md` |
| PowerShell | `skills/powershell/index.md` |
```

**`my-app/.github/copilot-instructions.md`** adds project-specific context:

```markdown
## Project-Specific Knowledge

This app uses:
- Database: PostgreSQL 14 on Azure
- API Framework: .NET 8 minimal APIs
- Frontend: React 18 with Vite
```

**`my-app/.github/instructions/api.instructions.md`** adds path-specific guidance:

```markdown
---
applyTo: "src/api/**"
---

When working with API code:
- Follow REST conventions in the organizational API design skill
- Use FluentValidation for request validation
- All endpoints return `ApiResponse<T>` wrapper
- See `docs/api-standards.md` for this project's specific patterns
```

VS Code merges all of these automatically, so the AI sees:
- **Org-wide standards** from the skills repo
- **Project-specific context** from the app repo
- **Path-specific rules** from instruction files

No manual wiring required.

## End-to-End Demo: Adding a New Skill

Let's walk through the complete flow of adding a new skill, wiring a script, and using it in Copilot.

### Scenario

Your team uses GitHub Actions and wants to standardize workflow patterns. You'll create a GitHub Actions skill with a script that validates workflow YAML files.

### Step 1: Create the Skill Structure

In the `org-skills` repository:

```bash
cd ~/projects/org-skills
mkdir -p skills/github-actions/{scripts,templates}
```

### Step 2: Create the Index

**`skills/github-actions/index.md`**:

```markdown
# GitHub Actions Skill

Organizational standards for GitHub Actions workflows.

## Sub-Skills

| Sub-Skill | Description | Path |
|-----------|-------------|------|
| Workflows | Workflow patterns and standards | `./workflows.md` |
| Actions | Custom actions and reusable workflows | `./actions.md` |

## Scripts

- `scripts/validate-workflow.sh` - Validate workflow YAML syntax and best practices
- `scripts/create-workflow.sh` - Scaffold a new workflow from template

## Templates

- `templates/dotnet-build.yml` - Standard .NET build workflow
- `templates/deploy-azure.yml` - Azure deployment workflow
```

### Step 3: Create the Workflows Sub-Skill

**`skills/github-actions/workflows.md`**:

```markdown
# GitHub Actions Workflows

## Standards

All workflows must:
- Use `workflow_dispatch` for manual triggers
- Include `concurrency` groups to prevent duplicate runs
- Use official actions when available (actions/* over third-party)
- Pin action versions to specific SHA for security

## Validation

Before committing a workflow, validate it:

```bash
./org-skills/skills/github-actions/scripts/validate-workflow.sh .github/workflows/build.yml
```

## Common Pattern: Build and Test

```yaml
name: Build and Test

on:
  pull_request:
    branches: [main]
  workflow_dispatch:

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - run: npm test
```
```

### Step 4: Create the Validation Script

**`skills/github-actions/scripts/validate-workflow.sh`**:

```bash
#!/bin/bash

# Validate GitHub Actions workflow YAML

WORKFLOW_FILE=$1

if [ -z "$WORKFLOW_FILE" ]; then
  echo "Usage: validate-workflow.sh <workflow-file.yml>"
  exit 1
fi

if [ ! -f "$WORKFLOW_FILE" ]; then
  echo "Error: File not found: $WORKFLOW_FILE"
  exit 1
fi

echo "Validating $WORKFLOW_FILE..."

# Check YAML syntax
if ! command -v yamllint &> /dev/null; then
  echo "Installing yamllint..."
  pip install yamllint
fi

yamllint -d relaxed "$WORKFLOW_FILE"

# Check for common issues
if ! grep -q "workflow_dispatch" "$WORKFLOW_FILE"; then
  echo "Warning: Missing 'workflow_dispatch' trigger for manual runs"
fi

if ! grep -q "concurrency" "$WORKFLOW_FILE"; then
  echo "Warning: Missing 'concurrency' group to prevent duplicate runs"
fi

# Check action versions (should be pinned)
if grep -q "@main\|@master" "$WORKFLOW_FILE"; then
  echo "Error: Actions should be pinned to specific versions, not @main or @master"
  exit 1
fi

echo "✓ Validation complete"
```

Make it executable:

```bash
chmod +x skills/github-actions/scripts/validate-workflow.sh
```

### Step 5: Add to Main Catalog

Update your org-skills catalog in **`.github/copilot-instructions.md`**:

```markdown
| GitHub Actions | Workflow standards and validation | `skills/github-actions/index.md` |
```

### Step 6: Commit and Push

```bash
git add skills/github-actions
git add .github/copilot-instructions.md
git commit -m "Add GitHub Actions skill with workflow validation"
git push
```

### Step 7: Pull into Project

In any project that uses the workspace, pull the latest org-skills:

```bash
cd ~/projects/my-app
cd ../org-skills
git pull
cd ../my-app
```

The updated skills are now available. No need to update your project's copilot instructions—VS Code automatically merges them from the org-skills workspace folder.

### Step 8: Test in Copilot

Open the workspace in VS Code:

```bash
code my-app.code-workspace
```

Open GitHub Copilot chat and ask:

> "What are our standards for GitHub Actions workflows?"

**Expected behavior**:
1. Copilot reads merged `.github/copilot-instructions.md` from both workspace folders
2. Finds "GitHub Actions" in the skills table from org-skills
3. Loads `skills/github-actions/index.md` from org-skills folder
4. Reads `workflows.md` for details
5. Responds with your organizational standards

Ask a follow-up:

> "Create a workflow for building and testing a Node.js app"

Copilot should generate a workflow following your standards (workflow_dispatch, concurrency, pinned versions).

**You've just added organizational knowledge and watched it work in real-time.**

## Invoking MCP Servers from Skills

Earlier we mentioned wrapping MCP servers in scripts for opt-in loading. Here's how that looks in practice.

### Scenario: Jira MCP Server

Your vendor ships a Jira MCP server but no CLI. You want to use it from your Jira skill without having it always in context.

### Step 1: Create MCP Client Wrapper

**`org-skills/skills/jira/scripts/mcp-client.sh`**:

```bash
#!/bin/bash
# Lightweight MCP client for Jira operations

OPERATION=$1
shift

case $OPERATION in
  create-issue)
    SUMMARY=$1
    DESCRIPTION=$2
    npx @your-org/mcp-client \
      --server jira-mcp \
      --tool create-issue \
      --project "PROJ" \
      --summary "$SUMMARY" \
      --description "$DESCRIPTION"
    ;;
  get-issue)
    ISSUE_KEY=$1
    npx @your-org/mcp-client \
      --server jira-mcp \
      --tool get-issue \
      --key "$ISSUE_KEY"
    ;;
  *)
    echo "Unknown operation: $OPERATION"
    exit 1
    ;;
esac
```

### Step 2: Create Convenience Scripts

**`org-skills/skills/jira/scripts/create-issue.sh`**:

```bash
#!/bin/bash
./mcp-client.sh create-issue "$1" "$2"
```

### Step 3: Reference in Skill

**`skills/jira/index.md`**:

```markdown
# Jira Skill

## Scripts

- `scripts/create-issue.sh <summary> <description>` - Create a Jira issue
- `scripts/get-issue.sh <issue-key>` - Get issue details
```

Now the MCP server's capabilities are available, but only when the AI loads the Jira skill and decides to run a script.

**The server isn't in context until needed.**

## Validation and CI

Add a GitHub Actions workflow to `org-skills` to validate skills:

**`.github/workflows/validate-skills.yml`**:

```yaml
name: Validate Skills

on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Validate Markdown
        run: |
          npm install -g markdownlint-cli
          markdownlint skills/**/*.md

      - name: Check Script Syntax
        run: |
          find skills -name "*.sh" -exec bash -n {} \;
          find skills -name "*.ps1" -exec pwsh -NoProfile -Command "Test-Path {}" \;

      - name: Validate Links
        run: |
          npm install -g markdown-link-check
          find skills -name "*.md" -exec markdown-link-check {} \;
```

This ensures:
- Markdown is properly formatted
- Scripts have valid syntax
- Links aren't broken

Teams can confidently merge skill updates.

## Complete Checklist: Adding a Skill

When adding a new skill to `org-skills`:

- [ ] Create directory structure: `skills/<skill-name>/`
- [ ] Create index file: `skills/<skill-name>/index.md`
- [ ] Add sub-skill files as needed
- [ ] Create `scripts/` directory if the skill has automation
- [ ] Create `templates/` directory if the skill provides starting files
- [ ] Add scripts with proper documentation headers
- [ ] Make scripts executable (`chmod +x`)
- [ ] Reference scripts in the index or sub-skill files
- [ ] Update `.github/copilot-instructions.md` with new skill row
- [ ] Commit with clear message describing the skill
- [ ] Create PR for review
- [ ] After merge, notify teams to pull latest `org-skills`

## Distribution at Scale

For large organizations:

1. **One skills repo per division** (Engineering, DevOps, Data, etc.)
2. **Workspace includes multiple skill repos**:

```json
{
  "folders": [
    {"name": "my-app", "path": "."},
    {"name": "engineering-skills", "path": "../engineering-skills"},
    {"name": "devops-skills", "path": "../devops-skills"}
  ]
}
```

3. **Copilot instructions reference both**:

```markdown
| Azure DevOps | ... | `skills/azure-devops/index.md` |
| React | ... | `skills/react/index.md` |
```

Teams pull only the skills repos relevant to their work.

## The Flywheel Effect

As your skills catalog grows:

1. **Developers discover knowledge they didn't know existed**
   - "Oh, we have a standard pattern for this?"
2. **Tribal knowledge becomes documented**
   - "Let me add that trick to the PowerShell skill"
3. **AI becomes more helpful**
   - Consistent, accurate guidance across all projects
4. **Onboarding accelerates**
   - New hires clone org-skills, get instant context
5. **Standards spread organically**
   - Teams adopt patterns they see in skills

The catalog becomes self-reinforcing. More skills → better AI responses → more trust → more contributions → more skills.

## Measuring Success

Track these metrics:

- **Skills count**: How many domains are documented?
- **Script count**: How much automation is available?
- **Contribution rate**: How often do teams add/update skills?
- **Workspace adoption**: How many projects use the org-skills workspace?
- **AI accuracy**: Anecdotally, are Copilot suggestions improving?

If skills stagnate, they're not useful. If they're growing, you're capturing organizational knowledge.

## What You've Built

Over these three parts, you've learned:

**Part 1**: The catalog pattern—indexing knowledge so AI can discover and load it on demand, not upfront.

**Part 2**: Nested skills and scripts—organizing hundreds of domains with hierarchical structure and deterministic execution primitives.

**Part 3**: Organizational distribution—sharing knowledge across repositories with VS Code workspaces and a centralized skills repo.

You now have a system for scaling AI context to **hundreds of skills** across **dozens of repositories** without overwhelming your context window or duplicating knowledge.

## Getting Started Today

1. **Create `org-skills` repository** in your organization
2. **Add `.github/copilot-instructions.md`** with a skills table
3. **Add 2-3 skills** from frequently-asked-about domains
4. **Create workspace files** for your top 2-3 projects
5. **Test with your team**: Ask Copilot questions about those domains

Start small. Grow organically. Let the flywheel spin.

Your AI doesn't need to know everything. It just needs to know where to look.

**That's the power of the skills catalog.**

---

_Thanks for reading this series! If you build a skills catalog, I'd love to hear about it. Find me on [LinkedIn](https://linkedin.com/in/tiberriver256) or open an issue on this blog's [GitHub repo](https://github.com/Tiberriver256/Tiberriver256.GitHub.io) with your experience._
