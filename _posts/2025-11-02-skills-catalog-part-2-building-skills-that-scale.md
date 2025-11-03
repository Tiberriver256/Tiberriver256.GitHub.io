---
published: true
layout: post
title: "Learning from Anthropic: Nested Skills and Scripts"
description: "Anthropic structures complex skills with nested folders and scripts. Here's how to adapt those patterns for GitHub Copilot's catalog approach."
modified: 2025-11-02
tags:
  - AI
  - GitHub Copilot
  - DevOps
  - Automation
categories:
  - AI and Technology
---

**Part 2 of 3** in the Skills Catalog series ([Part 1](/ai%20and%20technology/skills-catalog-part-1-indexing-ai-context) | [Part 3](/ai%20and%20technology/skills-catalog-part-3-organizational-knowledge-at-scale))

Part 1 covered the catalog pattern. Now: **how do you organize knowledge that scales to hundreds of skills?**

Anthropic's [skills repository](https://github.com/anthropics/skills) shows patterns for complex domains:

1. **Nested structures** for complex domains
2. **Scripts as executable knowledge**
3. **Supporting resources** (templates, configs)

## Anthropic's Nested Skills

The [mcp-builder skill](https://github.com/anthropics/skills/tree/main/mcp-builder):

```
mcp-builder/
├── SKILL.md                    # Main skill description
├── guides/
│   ├── getting-started.md
│   ├── server-patterns.md
│   └── testing.md
├── templates/
│   ├── basic-server.py
│   └── typescript-server/
└── scripts/
    ├── create-server.sh
    └── test-server.sh
```

**Pattern**:

1. **SKILL.md**: Overview with `description` for discovery
2. **Guides**: Detailed sub-topics
3. **Templates**: Starting code
4. **Scripts**: Executable automation

Keeps `SKILL.md` lean—points to guides. Claude loads guides selectively.

## Adapting for the Catalog

### Top-Level Catalog

`.github/copilot-instructions.md` stays high-level:

```markdown
## Available Skills

| Skill Name | Description | Path |
|------------|-------------|------|
| Azure DevOps | Work with Azure DevOps repos, pipelines, work items | `.github/skills/azure-devops/index.md` |
| React | React component patterns and standards | `.github/skills/react/index.md` |
```

Each skill points to an `index.md` (like Anthropic's `SKILL.md`).

### Domain Index (Sub-Catalog)

`.github/skills/azure-devops/index.md` becomes a second-level catalog:

```markdown
# Azure DevOps Skill

## Sub-Skills

| Sub-Skill | Description | Path |
|-----------|-------------|------|
| Repositories | Branch policies, PRs, code reviews | `./repos.md` |
| Pipelines | YAML pipelines, triggers, monorepo support | `./pipelines.md` |
| Work Items | Queries, custom fields, automation | `./work-items.md` |

## Quick References

- Organization: `https://dev.azure.com/yourorg`
- Project: `YourProject`

## Scripts

- `scripts/get-related-work-items.ps1` - Get work items for pipeline run
- `scripts/create-pr.ps1` - Create PR with template
```

Two-level indexing:
1. Main catalog → Azure DevOps skill exists
2. Azure DevOps index → Pipelines sub-skill for pipeline questions

### Sub-Skill Files

`.github/skills/azure-devops/pipelines.md` contains focused knowledge:

````markdown
# Azure DevOps Pipelines

## YAML Standards

All pipelines must:
- Use YAML (no classic pipelines)
- Include `trigger.paths` for monorepos
- Use named stages for multi-stage deployments

## Monorepo Trigger Pattern

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

Azure DevOps's built-in feature doesn't support monorepos. Use:

```bash
pwsh .github/skills/azure-devops/scripts/get-related-work-items.ps1
```

See `./scripts/get-related-work-items.ps1` for details.
````

### Directory Structure

Here's what it looks like (modeled on Anthropic's pattern):

```
.github/skills/azure-devops/
├── index.md                    # Sub-skills catalog (like Anthropic's SKILL.md)
├── repos.md                    # Repository sub-skill
├── pipelines.md                # Pipelines sub-skill
├── work-items.md               # Work items sub-skill
├── scripts/                    # Executable automation (like Anthropic)
│   ├── get-related-work-items.ps1
│   ├── create-pr.ps1
│   └── query-work-items.ps1
└── templates/                  # Starting points (like Anthropic)
    ├── pr-template.md
    └── pipeline-template.yml
```

Each `.md` file is 5-15KB. Same pattern Anthropic uses, adapted for explicit catalog navigation.

## Scripts: Learning from Anthropic

Both Anthropic Skills and the catalog pattern support **scripts as executable knowledge**.

### Anthropic's Approach

Look at the [mcp-builder skill](https://github.com/anthropics/skills/tree/main/mcp-builder). It includes:

- `scripts/create-server.sh` - Bootstrap a new MCP server
- `scripts/test-server.sh` - Validate server implementation

These aren't documentation about _how_ to create a server—they're executable scripts that _do it_. Claude can invoke them directly.

**The philosophy**: Don't just describe processes. Provide tested, working automation.

### Catalog Adaptation

Reference scripts in skill files:

**In `.github/skills/azure-devops/pipelines.md`**:

````markdown
## Getting Related Work Items

Azure DevOps's built-in feature doesn't support monorepos. Use:

```bash
pwsh .github/skills/azure-devops/scripts/get-related-work-items.ps1 -BuildId $BUILD_BUILDID
```
````

**Script conventions**:

1. **Self-contained**: Include dependencies
2. **Documented**: Header comments
3. **Tested**: Production-ready
4. **Referenced**: Skill files tell AI when to use them

Example `.github/skills/azure-devops/scripts/get-related-work-items.ps1`:

```powershell
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

# (Full implementation omitted for brevity)
```

### Why Scripts Matter

**Traditional**: AI generates code. Sometimes buggy.

**Skills approach**: AI uses tested scripts. Deterministic results.

Now, when the AI encounters a monorepo pipeline question, it:
1. Loads the pipelines sub-skill
2. Sees the script reference
3. Suggests running the script or shows how to invoke it

**You get deterministic, tested behavior instead of AI-generated code that might have bugs.**

## Why Scripts Beat Always-On Tools

MCP (Model Context Protocol) servers are powerful but costly—they're always in context.

20 MCP servers × 10-50 tools = 200-1000 tool descriptions before you've asked anything.

**Scripts are opt-in.** Load only when:
1. AI reads the skill file
2. Skill is relevant

Azure questions? Azure scripts. React questions? React scripts.

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

Each level has a catalog. AI navigates general → specific.

**Practical limit**: 3-4 levels.

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

AI learns this structure, finding information faster.

## Building a Nested Skill

Create an Azure DevOps skill:

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

Create `pipelines.md` with standards, examples, script references. Add a tested PowerShell script. Reference in main catalog.

## Key Takeaways

1. Keep main files lean—nest details
2. Provide scripts—executable knowledge
3. Use consistent structures
4. Include templates and examples

## Scaling to 100+ Skills

With this structure:

- **10 domain skills** (Azure DevOps, AWS, Docker, React, etc.)
- **5-10 sub-skills each** (50-100 sub-skills total)
- **2-5 scripts per sub-skill** (100-500 scripts total)

Total catalog overhead: ~10KB (main) + ~50KB (indexes) = 60KB

Total knowledge base: 5-50MB of detailed docs and scripts

**Megabytes of knowledge through a 60KB index.**

## Next

**Part 3**: Shared skills repository + VS Code workspaces for portable organizational knowledge.

Start nesting:

1. Pick one skill
2. Break into 2-3 sub-skills
3. Move one task into a script

---

_Credit: This series adapts patterns from [Anthropic Skills](https://www.anthropic.com/news/skills). The nested structure and script conventions mirror their [official examples](https://github.com/anthropics/skills)._
