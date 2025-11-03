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

**Part 2 of 3** in the Skills Catalog series ([Part 1](/ai-and-technology/skills-catalog-part-1-indexing-ai-context))

In Part 1, we saw how to adapt Anthropic's Skills concept for GitHub Copilot using a catalog pattern. Now let's dive deeper: **how do you organize knowledge that scales to hundreds of skills?**

Anthropic's [official skills repository](https://github.com/anthropics/skills) shows sophisticated examples like [mcp-builder](https://github.com/anthropics/skills/tree/main/mcp-builder) and [algorithmic-art](https://github.com/anthropics/skills/tree/main/algorithmic-art). These demonstrate patterns we can learn from:

1. **Nested structures** for complex domains
2. **Scripts as executable knowledge** that load on demand
3. **Supporting resources** (templates, configs)

This post explores Anthropic's approach and shows how to adapt it for the catalog pattern.

## How Anthropic Structures Complex Skills

Let's look at a real example from Anthropic's repository: the [mcp-builder skill](https://github.com/anthropics/skills/tree/main/mcp-builder).

### Directory Structure

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

### The Pattern

Anthropic organizes complex skills into:

1. **SKILL.md**: Overview with `description` frontmatter for discovery
2. **Guides**: Detailed sub-topic explanations
3. **Templates**: Starting point code
4. **Scripts**: Executable automation

This keeps `SKILL.md` lean—it points to guides instead of containing everything. Claude can selectively load guides when needed.

### Another Example: Algorithmic Art

The [algorithmic-art skill](https://github.com/anthropics/skills/tree/main/algorithmic-art) follows a similar pattern:

```
algorithmic-art/
├── SKILL.md
├── techniques/
│   ├── generative-systems.md
│   ├── noise-algorithms.md
│   └── recursion-patterns.md
└── examples/
    ├── fractal-tree.js
    └── perlin-landscape.py
```

Again: lean main file, detailed sub-documents, practical examples.

## The Transferable Lesson

What Anthropic teaches us: **Don't put everything in one file.**

Even with auto-discovery, they nest. Why? Because:
- **Focus**: Each file covers one sub-topic
- **Selectivity**: AI can load just the relevant guide
- **Maintainability**: Easier to update specific sections
- **Scale**: Supports deep knowledge without bloat

This pattern matters even more for the catalog approach, where we're manually maintaining the index.

## Adapting Nested Skills to the Catalog

Following Anthropic's example, here's how to adapt nested structures for the catalog pattern.

### Top-Level Catalog

Your `.github/copilot-instructions.md` mirrors Anthropic's approach—stay high-level:

```markdown
## Available Skills

| Skill Name | Description | Path |
|------------|-------------|------|
| Azure DevOps | Work with Azure DevOps repos, pipelines, work items | `.github/skills/azure-devops/index.md` |
| React | React component patterns and standards | `.github/skills/react/index.md` |
```

Each skill points to an `index.md` inside a folder (like Anthropic's `SKILL.md`).

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

Now Copilot has two-level indexing like Claude's skill discovery:
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

### Adapting Scripts to the Catalog

The catalog pattern uses the same approach—reference scripts in skill files:

**In `.github/skills/azure-devops/pipelines.md`**:

````markdown
## Getting Related Work Items

Azure DevOps's built-in feature doesn't support monorepos. Use:

```bash
pwsh .github/skills/azure-devops/scripts/get-related-work-items.ps1 -BuildId $BUILD_BUILDID
```
````

**Script conventions** (same as Anthropic):

1. **Self-contained**: Include all dependencies
2. **Documented**: Header comments explain purpose, parameters
3. **Tested**: Production-ready code
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

Same philosophy as Anthropic—provide working automation, not just documentation.

### Why Scripts Matter

**Traditional approach**: AI generates code on the fly. Sometimes it works. Sometimes it has bugs.

**Skills approach** (both Anthropic and catalog): AI uses tested scripts. Deterministic, reliable results.

You're not hoping the AI writes correct PowerShell—you're providing PowerShell that already works.

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

You've just built a nested skill with executable knowledge, following Anthropic's patterns.

## What We Learned from Anthropic

Anthropic Skills taught us:

1. **Keep main files lean**—nest details in sub-documents
2. **Provide scripts**—executable knowledge beats documentation
3. **Use consistent structures**—helps AI navigate faster
4. **Support resources**—templates and examples matter

The catalog pattern adapts these lessons for GitHub Copilot's explicit navigation model.

## The 100-Skill Vision

With this structure (inspired by Anthropic), you can scale to 100+ skills:

- **10 domain skills** (Azure DevOps, AWS, Docker, React, etc.)
- **5-10 sub-skills each** (50-100 sub-skills total)
- **2-5 scripts per sub-skill** (100-500 scripts total)

Total catalog overhead: ~10KB (main) + ~50KB (indexes) = 60KB

Total knowledge base: 5-50MB of detailed docs and scripts

**The AI accesses megabytes of knowledge through a 60KB index.**

That's the power of "hint, then dive"—whether you're using Anthropic's auto-discovery or the catalog adaptation.

## Next: Organizational Distribution

You've built nested skills with scripts. They work great in your repository.

But what about your other 50 repositories? Do you copy-paste the `.github/skills/` folder?

**No.** In Part 3, we'll build a shared skills repository and use VS Code workspaces to inject those skills into any project. Your organizational knowledge becomes portable, versionable, and available everywhere.

For now, start nesting:

1. Pick one skill from your catalog
2. Break it into 2-3 sub-skills (like Anthropic's examples)
3. Move one repetitive task into a script
4. Reference the script in the skill file

You're building a library, one indexed section at a time—following Anthropic's beautiful patterns.

---

_Credit: This series adapts patterns from [Anthropic Skills](https://www.anthropic.com/news/skills). The nested structure and script conventions mirror their [official examples](https://github.com/anthropics/skills)._
