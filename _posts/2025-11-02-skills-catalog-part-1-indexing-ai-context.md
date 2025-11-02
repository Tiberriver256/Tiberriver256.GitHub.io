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

**Part 1 of 3** in the Skills Catalog series

Anthropic just announced [Skills](https://www.anthropic.com/news/skills)—a beautiful system for giving Claude modular, discoverable knowledge. Each skill is a simple `SKILL.md` file with metadata, and Claude automatically discovers them through the `description` field. No central catalog. No manual wiring. Just self-describing knowledge packages that load on demand.

**It's a gorgeous concept.** And it got me thinking: can we bring this idea to GitHub Copilot?

The answer is yes—but with one key adaptation. Anthropic Skills rely on Claude's built-in discovery mechanism. GitHub Copilot doesn't have that (yet), so we need a different approach to achieve the same beautiful outcome: **modular, discoverable, on-demand knowledge**.

This post explains what Anthropic Skills actually are, why the concept is transferable, and how the catalog pattern adapts it for GitHub Copilot.

## What Are Anthropic Skills?

Before we dive into the adaptation, let's understand what Anthropic built. From their [Skills announcement](https://www.anthropic.com/news/skills) and the [official repository](https://github.com/anthropics/skills), here's how Skills work:

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

### The Beautiful Core Concept

What makes this brilliant isn't the file format—it's the **philosophy**:

- **Modular**: Each skill = one domain of knowledge
- **Discoverable**: Metadata makes skills findable
- **On-demand**: Skills load only when relevant
- **Self-describing**: No central registry to maintain

This is knowledge architecture done right. It's the Dewey Decimal System for AI context.

## Why This Concept Transfers

The underlying problem Anthropic Skills solve is universal: **how do you give AI access to vast knowledge without overwhelming the context window?**

Their answer: **hint, then dive**.

- Skills hint through `description` fields
- Claude dives into relevant skills when needed
- Irrelevant knowledge stays out of context

This pattern works regardless of the AI platform. The mechanics might differ, but the concept holds.

## Bringing It to GitHub Copilot

Here's where we hit the first adaptation challenge: **GitHub Copilot doesn't auto-discover skills like Claude does.**

Copilot reads files you explicitly include (like `.github/copilot-instructions.md`), but it doesn't scan a folder of skills and match them to your questions based on descriptions. That capability doesn't exist (yet).

So we need a mechanism that achieves the same outcome—on-demand knowledge loading—using Copilot's capabilities.

**The adaptation**: Replace auto-discovery with a **catalog table**.

## The Catalog Pattern: Anthropic Skills for Copilot

Instead of relying on Copilot to discover skills, we create a lightweight index that mimics what Claude does automatically—a table listing available skills with descriptions and paths:

```markdown
| Skill Name | Description | Path |
|------------|-------------|------|
| Azure DevOps Pipelines | Work with Azure DevOps YAML pipelines, triggers, variables | `.github/skills/azure-devops-pipelines.md` |
| PowerShell Standards | Coding standards and common patterns for PowerShell | `.github/skills/powershell-standards.md` |
| React Component Patterns | Approved component patterns and examples | `.github/skills/react-patterns.md` |
```

This table lives in `.github/copilot-instructions.md`, which is always loaded. It's your "Skills available here" index.

**How it works**:
1. You ask: "Help me set up a monorepo trigger for Azure DevOps"
2. Copilot scans the catalog table (which is always in context)
3. Matches "Azure DevOps Pipelines" description to your question
4. Reads `.github/skills/azure-devops-pipelines.md`
5. Uses that knowledge to answer

Same outcome as Anthropic Skills—just a different discovery mechanism.

### Why the Catalog Works

The catalog is tiny—each row costs 50-100 tokens. A catalog of 100 skills costs around 5,000-10,000 tokens.

But each skill file might be 5,000-50,000 tokens. If you loaded all 100 skills upfront, you'd burn 500,000-5,000,000 tokens before the conversation started.

**The catalog lets you scale to hundreds of skills while keeping base context lean.**

More importantly, Copilot only loads what it needs. Working on Azure pipelines? It loads the Azure skill. Working on React? It ignores Azure and loads React patterns instead.

You get:
- **Precision**: Only relevant knowledge loads
- **Scale**: Hundreds of skills supported  
- **Performance**: Lean base context window
- **Clarity**: AI knows what it doesn't know

It's Anthropic's "hint, then dive" pattern, adapted to Copilot's capabilities.

## Implementing the Catalog

Here's how to set up Anthropic's Skills concept for GitHub Copilot:

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

That's it. The catalog is live.

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

GitHub Copilot adds capabilities beyond Anthropic Skills:

**Path-specific instructions** in `.github/instructions/`:

```markdown
---
applyTo: "src/api/**"
---

When working with files in src/api/:
- All API endpoints must include OpenAPI documentation
- See `.github/skills/api-patterns.md` for approved patterns
```

You're building layers:
- **Repository-wide**: `.github/copilot-instructions.md` with the skills catalog
- **Path-specific**: `.github/instructions/*.instructions.md` for targeted guidance
- **Skill files**: `.github/skills/*.md` for detailed domain knowledge

## Why This Works

Anthropic's Skills work because they separate **discovery** (the `description` field) from **content** (the markdown).

The catalog pattern achieves the same separation:
- **Discovery**: The catalog table (always in context)
- **Content**: Individual skill files (loaded on demand)

Different mechanism, same philosophy, same benefits:
- Modular, focused knowledge packages
- On-demand loading keeps context lean
- Scales to hundreds of skills
- Self-documenting through descriptions

## Real-World Impact

I've used this adapted pattern to:

- Build 50+ organizational skills across development, DevOps, and infrastructure
- Reduce context window bloat by 80%+ (from megabytes to a tiny index)
- Enable teams to discover knowledge they didn't know existed
- Create portable, shareable knowledge bases

It's Anthropic's brilliant concept, adapted for GitHub Copilot's capabilities.

## Next Steps

In **Part 2**, we'll look at how Anthropic structures complex skills (like their [mcp-builder](https://github.com/anthropics/skills/tree/main/mcp-builder) and [algorithmic-art](https://github.com/anthropics/skills/tree/main/algorithmic-art) examples) and adapt those nested patterns for the catalog.

In **Part 3**, we'll see how to distribute skills across your organization using VS Code workspaces.

But for now, start simple:

1. Create `.github/copilot-instructions.md` with a skills catalog
2. Add 2-3 skills you work with regularly
3. Create one skill file with your team's conventions
4. Watch as Copilot starts discovering and applying your knowledge

You're bringing Anthropic's beautiful Skills concept to GitHub Copilot.

---

_Credit: This series adapts concepts from [Anthropic Skills](https://www.anthropic.com/news/skills). The catalog pattern is the GitHub Copilot implementation of their discovery mechanism._
