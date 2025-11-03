---
published: true
layout: post
title: "Bringing Anthropic Skills to GitHub Copilot"
description: "Anthropic's Skills concept is brilliant: modular, discoverable AI knowledge. Here's how to adapt it for GitHub Copilot using a catalog pattern."
modified: 2025-11-02
tags:
  - AI
  - GitHub Copilot
  - Developer Tools
categories:
  - AI and Technology
---

**Part 1 of 3** in the Skills Catalog series ([Part 2](/ai-and-technology/skills-catalog-part-2-building-skills-that-scale) | [Part 3](/ai-and-technology/skills-catalog-part-3-organizational-knowledge-at-scale))

Anthropic just announced [Skills](https://www.anthropic.com/news/skills)—modular, discoverable knowledge for Claude. Each skill is a `SKILL.md` file with metadata. Claude discovers them through the `description` field. No central catalog, no manual wiring.

Can we bring this to GitHub Copilot? Yes—with one key adaptation: **a catalog table** that replaces Claude's auto-discovery.

## What Are Anthropic Skills?

From their [Skills announcement](https://www.anthropic.com/news/skills) and [official repository](https://github.com/anthropics/skills):

### The Structure

Each skill is a folder containing a `SKILL.md` file with YAML frontmatter:

```markdown
---
description: "Work with Azure DevOps pipelines, triggers, and YAML configurations"
---

# Azure DevOps Pipelines

Your skill content in markdown...
```

That's it. The `description` field is how Claude discovers what the skill does. The rest is just markdown.

### How Discovery Works

When you work with Claude (in Claude.ai, Claude Code, or via API), it scans available skills and uses the `description` field to decide which ones are relevant. No central catalog. No manual selection. Just self-describing knowledge packages.

**Example workflow**:
1. You ask: "How do I set up a monorepo trigger in Azure DevOps?"
2. Claude scans skill descriptions
3. Finds "Work with Azure DevOps pipelines, triggers..." matches
4. Loads that `SKILL.md` file
5. Uses the knowledge to answer your question

### The Core Concept

The **philosophy**:

- **Modular**: One skill = one domain
- **Discoverable**: Metadata makes skills findable
- **On-demand**: Load only when relevant
- **Self-describing**: No central registry

## Why This Concept Transfers

The underlying problem Anthropic Skills solve is universal: **how do you give AI access to vast knowledge without overwhelming the context window?**

Their answer: **hint, then dive**.

- Skills hint through `description` fields
- Claude dives into relevant skills when needed
- Irrelevant knowledge stays out of context

This pattern works regardless of the AI platform. The mechanics might differ, but the concept holds.

## Bringing It to GitHub Copilot

**The challenge**: GitHub Copilot doesn't auto-discover skills like Claude does.

Copilot reads files you explicitly include (`.github/copilot-instructions.md`), but doesn't scan skill folders or match descriptions to questions.

**The adaptation**: Replace auto-discovery with a **catalog table**.

## The Catalog Pattern

Create a lightweight index—a table listing skills with descriptions and paths:

```markdown
| Skill Name | Description | Path |
|------------|-------------|------|
| Azure DevOps Pipelines | Work with Azure DevOps YAML pipelines, triggers, variables | `.github/skills/azure-devops-pipelines.md` |
| PowerShell Standards | Coding standards and common patterns for PowerShell | `.github/skills/powershell-standards.md` |
| React Component Patterns | Approved component patterns and examples | `.github/skills/react-patterns.md` |
```

This table lives in `.github/copilot-instructions.md` (always loaded).

**How it works**:
1. You ask: "Help me set up a monorepo trigger for Azure DevOps"
2. Copilot scans the catalog table (which is always in context)
3. Matches "Azure DevOps Pipelines" description to your question
4. Reads `.github/skills/azure-devops-pipelines.md`
5. Uses that knowledge to answer

Same outcome—different discovery mechanism.

### Why the Catalog Works

The catalog is tiny: 100 skills ≈ 5,000-10,000 tokens.

Each skill file: 5,000-50,000 tokens. Loading all 100 upfront: 500,000-5,000,000 tokens.

**The catalog scales to hundreds of skills while keeping base context lean.**

Copilot loads only what it needs. Azure pipelines? Azure skill. React? React patterns.

Benefits:
- **Precision**: Only relevant knowledge loads
- **Scale**: Hundreds of skills supported  
- **Performance**: Lean context window

## Implementation

**Step 1**: Create `.github/copilot-instructions.md`:

```markdown
# Skills Catalog

This repository adapts Anthropic's Skills concept for GitHub Copilot.

## Available Skills

| Skill Name | Description | Path |
|------------|-------------|------|
| Azure DevOps Pipelines | Work with Azure DevOps YAML pipelines, triggers, variables | `.github/skills/azure-devops-pipelines.md` |
| PowerShell Standards | Coding standards and common patterns for PowerShell | `.github/skills/powershell-standards.md` |

## How to Use Skills

When you encounter a task related to a skill:
1. Read the skill file at the listed path
2. Follow any guidance, standards, or templates provided
3. Use any scripts referenced in the skill file
```

**Step 2**: Create a skill file at `.github/skills/azure-devops-pipelines.md`:

```markdown
# Azure DevOps Pipelines Skill

## Overview
Standards and patterns for Azure DevOps YAML pipelines.

## Monorepo Trigger Pattern

For monorepos, filter triggers by path:

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

## Standards
- Use YAML (no classic pipelines)
- Include `trigger.paths` for monorepos
- Use named stages for multi-stage deployments
```

Done.

## What Goes in a Skill File?

Like Anthropic's `SKILL.md` format, keep each skill focused on one domain:

1. **Overview**: What this skill covers
2. **Key concepts**: Core knowledge
3. **Standards**: Your organizational conventions
4. **Examples**: Code samples, templates
5. **Scripts**: Paths to executable automation (more on this in Part 2)
6. **References**: Links to external docs

If a skill grows beyond 10-20KB, break it into sub-skills (covered in Part 2).

## GitHub Copilot Enhancements

**Path-specific instructions** in `.github/instructions/`:

```markdown
---
applyTo: "src/api/**"
---

When working with files in src/api/:
- All API endpoints must include OpenAPI documentation
- See `.github/skills/api-patterns.md` for approved patterns
```

This builds layers:
- **Repository-wide**: `.github/copilot-instructions.md` with the skills catalog
- **Path-specific**: `.github/instructions/*.instructions.md` for targeted guidance
- **Skill files**: `.github/skills/*.md` for detailed domain knowledge

## Why This Works

Anthropic Skills separate **discovery** (`description` field) from **content** (markdown).

The catalog does the same:
- **Discovery**: Catalog table (always in context)
- **Content**: Skill files (loaded on demand)

Same benefits:
- Modular knowledge packages
- On-demand loading
- Scales to hundreds of skills

## Real-World Impact

This pattern enables:

- 50+ organizational skills
- 80%+ reduction in context bloat
- Team knowledge discovery
- Portable knowledge bases

## Next Steps

**Part 2**: How Anthropic structures complex skills (like [mcp-builder](https://github.com/anthropics/skills/tree/main/mcp-builder)) and adapting nested patterns.

**Part 3**: Distributing skills across your organization using VS Code workspaces.

Start simple:
1. Create `.github/copilot-instructions.md` with a skills catalog
2. Add 2-3 skills
3. Create one skill file with your conventions

---

_Credit: This series adapts concepts from [Anthropic Skills](https://www.anthropic.com/news/skills). The catalog pattern is the GitHub Copilot implementation of their discovery mechanism._
