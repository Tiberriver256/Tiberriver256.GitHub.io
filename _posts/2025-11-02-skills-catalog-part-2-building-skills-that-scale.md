---
published: true
layout: post
title: "Building Skills That Scale: Nested Domains and Scripts"
description: "Learn to organize hundreds of skills with nested domains and scripts that load on demand, keeping your AI context lean while maintaining power."
modified: 2025-11-02
tags:
  - AI
  - GitHub Copilot
  - DevOps
  - Automation
categories:
  - AI and Technology
---

**Part 2 of 3** in the Skills Catalog series ([Part 1](/ai-and-technology/skills-catalog-part-1-indexing-ai-context))

In Part 1, we introduced the skills catalog pattern—a Dewey Decimal-style index for AI context. Now we tackle the real challenge: **organizing knowledge that scales to hundreds of skills without becoming a mess.**

The key is two-fold:
1. **Nested skills** that keep the top-level catalog clean while allowing deep specialization
2. **Scripts as execution primitives** that load only when invoked, not upfront

Let's build it.

## The Depth Problem

Your initial skills table might look like this:

```markdown
| Skill Name | Description | Path |
|------------|-------------|------|
| Azure DevOps | Everything about Azure DevOps | `.github/skills/azure-devops.md` |
```

But "everything about Azure DevOps" is huge:
- Repositories (branches, PRs, policies)
- Pipelines (YAML, triggers, variables, environments)
- Work items (queries, custom fields, automation)
- Boards (columns, swimlanes, sprints)
- Artifacts (feeds, packages, retention)

If you dump all that into one skill file, it becomes a 100KB document that defeats the purpose of selective loading. The AI has to wade through pipeline documentation when you're asking about work item queries.

**Solution**: Nested skills.

## Building Nested Domain Skills

Think hierarchical, like organizing a library by subject, then sub-subject, then topic.

### Top-Level Catalog

Your main `.github/copilot-instructions.md` stays focused on high-level domains:

```markdown
## Available Skills

| Skill Name | Description | Path |
|------------|-------------|------|
| Azure DevOps | Work with Azure DevOps repos, pipelines, work items, and boards | `.github/skills/azure-devops/index.md` |
| PowerShell | PowerShell coding standards, modules, and patterns | `.github/skills/powershell/index.md` |
| React | React component patterns and standards | `.github/skills/react/index.md` |
```

Notice: each skill now points to an `index.md` inside a folder, not a standalone file.

### Domain Index

`.github/skills/azure-devops/index.md` becomes a sub-catalog:

```markdown
# Azure DevOps Skill

This skill covers Azure DevOps tools and workflows.

## Sub-Skills

| Sub-Skill | Description | Path |
|-----------|-------------|------|
| Repositories | Branch policies, PRs, code reviews | `./repos.md` |
| Pipelines | YAML pipelines, triggers, monorepo support | `./pipelines.md` |
| Work Items | Queries, custom fields, automation rules | `./work-items.md` |

## Quick References

- Organization: `https://dev.azure.com/yourorg`
- Project: `YourProject`
- Common repos: `platform`, `services`, `infrastructure`

## Scripts

Scripts for Azure DevOps operations live in `./scripts/`:
- `get-related-work-items.ps1` - Get work items for a pipeline run (monorepo-aware)
- `create-pr.ps1` - Create a PR with standard template and reviewers
```

Now the AI has two levels of indexing:
1. Main catalog → Azure DevOps skill exists
2. Azure DevOps index → Pipelines sub-skill for monorepo questions

### Sub-Skill Files

`.github/skills/azure-devops/pipelines.md` contains focused, actionable knowledge:

```markdown
# Azure DevOps Pipelines

## YAML Pipeline Standards

All pipelines must:
- Use YAML (no classic pipelines)
- Include `trigger.paths` for monorepos
- Use named stages for multi-stage deployments
- Reference templates from the `pipeline-templates` repo

## Monorepo Trigger Pattern

For monorepos, always filter triggers by path:

```yaml
trigger:
  branches:
    include:
      - main
  paths:
    include:
      - services/api/*
      - shared/common/*
```

## Getting Related Work Items

Azure DevOps's built-in "Related Work Items" feature doesn't support monorepos. Use our custom script instead:

```bash
pwsh .github/skills/azure-devops/scripts/get-related-work-items.ps1 -BuildId $BUILD_BUILDID
```

See `./scripts/get-related-work-items.ps1` for details.

## Pipeline Variables

Standard variables we use:
- `BuildConfiguration` - Debug or Release
- `DeploymentEnvironment` - dev, staging, prod
- `RunTests` - true/false

## Templates

Reusable templates live in our `pipeline-templates` repo:
- `build-dotnet.yml` - Standard .NET build
- `deploy-azure-app.yml` - Azure App Service deployment
- `run-integration-tests.yml` - Integration test harness
```

Clean. Focused. No more than you need for pipeline questions.

## Directory Structure

Here's what a mature Azure DevOps skill looks like:

```
.github/skills/azure-devops/
├── index.md                    # Sub-skills catalog
├── repos.md                    # Repository sub-skill
├── pipelines.md                # Pipelines sub-skill
├── work-items.md               # Work items sub-skill
├── scripts/
│   ├── get-related-work-items.ps1
│   ├── create-pr.ps1
│   └── query-work-items.ps1
└── templates/
    ├── pr-template.md
    └── pipeline-template.yml
```

Each `.md` file is 5-15KB. Totally manageable. The AI loads the index, identifies the relevant sub-skill, and dives into just that file.

## Scripts: On-Demand Execution

Here's where it gets powerful. Scripts are knowledge that _does things_.

Traditional approach (bad): Document how to get related work items for a pipeline run. Hope the AI generates correct code every time.

**Skills approach (good)**: Provide a tested, working script. The AI invokes it.

### Script Conventions

Scripts in skill folders follow these rules:

1. **Self-contained**: Include all dependencies, parameter descriptions
2. **Documented**: Header comments explain purpose, parameters, examples
3. **Tested**: These run in production; they must work
4. **Referenced**: Skill `.md` files tell the AI when to use them

Example from `.github/skills/azure-devops/scripts/get-related-work-items.ps1`:

```powershell
#Requires -PSEdition Core

<#
.SYNOPSIS
    Retrieves commits and work items for a build pipeline with monorepo support.

.DESCRIPTION
    Azure DevOps's built-in "Related Work Items" feature doesn't filter by
    pipeline trigger paths in monorepos. This script does.

.PARAMETER BuildId
    The ID of the build. Defaults to $ENV:BUILD_BUILDID in Azure Pipelines.

.PARAMETER CollectionUri
    Azure DevOps organization URI. Defaults to $ENV:SYSTEM_COLLECTIONURI.

.EXAMPLE
    ./get-related-work-items.ps1 -BuildId 12345

.NOTES
    Requires the powershell-yaml module for parsing YAML pipeline files.
#>

[CmdletBinding()]
param (
    [Parameter()]
    [int]$BuildId = $ENV:BUILD_BUILDID,

    [Parameter()]
    [Uri]$CollectionUri = $ENV:SYSTEM_COLLECTIONURI,

    [Parameter()]
    [Guid]$ProjectId = $ENV:SYSTEM_TEAMPROJECTID,

    [Parameter()]
    $AuthorizationHeader = "Bearer $ENV:SYSTEM_ACCESSTOKEN"
)

# Script implementation...
# (Full implementation omitted for brevity - see Part 1 for complete code)
```

Now, when the AI encounters a monorepo pipeline question, it:
1. Loads the pipelines sub-skill
2. Sees the script reference
3. Suggests running the script or shows how to invoke it

**You get deterministic, tested behavior instead of AI-generated code that might have bugs.**

## Why Scripts Beat Always-On Tools

Some platforms (like Claude) support MCP (Model Context Protocol) servers—background processes that expose tools to the AI. They're powerful, but they have a cost: **they're always in your context window**, whether you need them or not.

Imagine 20 MCP servers, each advertising 10-50 tools. That's 200-1000 tool descriptions occupying your context before you've asked a single question.

**Scripts are opt-in.** They only load when:
1. The AI reads the skill file that references them
2. The skill file is relevant to your question

For Azure DevOps questions, you get Azure scripts. For React questions, you get React scripts. Not both.

### Invoking MCP via Scripts

But what if a vendor ships an MCP server without a CLI? You still want opt-in behavior.

**Solution**: Wrap the MCP server in a lightweight CLI client, then call it from scripts.

Example: A hypothetical Jira MCP server.

Create `.github/skills/jira/scripts/mcp-client.sh`:

```bash
#!/bin/bash
# Lightweight MCP client that invokes Jira MCP server tools

TOOL_NAME=$1
shift
ARGS="$@"

# Connect to MCP server and invoke tool
npx @your-org/mcp-client \
  --server jira-mcp-server \
  --tool "$TOOL_NAME" \
  --args "$ARGS"
```

Now your Jira skill can reference `./scripts/create-issue.sh`:

```bash
#!/bin/bash
# Create a Jira issue

./mcp-client.sh create-issue \
  --project "PROJ" \
  --summary "$1" \
  --description "$2"
```

The MCP server's capabilities are available, but only when the Jira skill loads and the AI decides to run the script.

**You control when capabilities enter the context.**

## Composing Skills: The Fractal Pattern

Nested skills can go deeper. Azure DevOps → Pipelines → Monorepo Triggers → Path Filtering.

Just add another layer:

```
.github/skills/azure-devops/pipelines/
├── index.md                    # Pipelines overview + sub-catalog
├── triggers.md                 # Trigger patterns
├── variables.md                # Variables and parameters
├── templates.md                # Template usage
└── monorepo/
    ├── index.md                # Monorepo-specific guidance
    ├── path-filtering.md       # Path filter patterns
    └── scripts/
        └── get-related-work-items.ps1
```

Each level maintains a catalog. The AI navigates from general to specific, loading only what it needs.

**Practical limit**: 3-4 levels deep. Beyond that, you're over-organizing.

## Section Conventions

Within each skill file, use consistent sections:

```markdown
# [Skill Name]

## Overview
What this skill covers

## Standards
Your organizational rules

## Common Patterns
Frequently used code/configs

## Scripts
Executable automation

## Templates
Starting points

## Troubleshooting
Known issues and fixes

## References
External docs, links
```

The AI learns this structure across skills, making it faster at finding information.

## Building Your First Nested Skill

Let's walk through creating a real Azure DevOps skill with sub-skills.

**Step 1**: Create the directory structure

```bash
mkdir -p .github/skills/azure-devops/{scripts,templates}
```

**Step 2**: Create the index (`.github/skills/azure-devops/index.md`)

```markdown
# Azure DevOps Skill

## Sub-Skills

| Sub-Skill | Description | Path |
|-----------|-------------|------|
| Pipelines | YAML pipelines, triggers, monorepo support | `./pipelines.md` |

## Scripts

- `scripts/get-related-work-items.ps1` - Get work items for a pipeline run
```

**Step 3**: Create the pipelines sub-skill (`.github/skills/azure-devops/pipelines.md`)

Include your team's standards, examples, script references (as shown earlier).

**Step 4**: Add a working script (`.github/skills/azure-devops/scripts/get-related-work-items.ps1`)

Copy your tested PowerShell script.

**Step 5**: Reference it in the main catalog (`.github/copilot-instructions.md`)

```markdown
| Azure DevOps | Work with Azure DevOps repos, pipelines, work items | `.github/skills/azure-devops/index.md` |
```

**Step 6**: Test it

Ask your AI: "How do I get the related work items for this pipeline run in our monorepo?"

The AI should:
1. Find Azure DevOps in the main catalog
2. Load the index
3. Identify the Pipelines sub-skill
4. Reference the script

You've just built a nested skill with executable knowledge.

## The 100-Skill Vision

With this structure, you can scale to 100+ skills:

- **10 domain skills** (Azure DevOps, AWS, Docker, React, etc.)
- **5-10 sub-skills each** (50-100 sub-skills total)
- **2-5 scripts per sub-skill** (100-500 scripts total)

Total catalog overhead: ~10KB (main) + ~50KB (indexes) = 60KB

Total knowledge base: 5-50MB of detailed docs and scripts

**The AI accesses megabytes of knowledge through a 60KB index.**

That's the power of "hint, then dive."

## Next: Organizational Distribution

You've built a skill. You've nested it. You've added scripts. It's working great in your repository.

But what about your other 50 repositories? Do you copy-paste the `.github/skills/` folder into each one?

**No.** In Part 3, we'll build a shared skills repository and use VS Code workspaces to inject those skills into any project with a few clicks. Your organizational knowledge becomes portable, versionable, and instantly available everywhere.

We'll also walk through a complete end-to-end demo: creating a new skill, wiring a script, invoking an MCP server, and watching it all work inside GitHub Copilot.

For now, start nesting:

1. Pick one skill from your catalog
2. Break it into 2-3 sub-skills
3. Move one repetitive task into a script
4. Reference the script in the skill file

You're building a library, one indexed section at a time.
