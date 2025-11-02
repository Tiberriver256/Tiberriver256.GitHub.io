---
published: true
layout: post
title: "The Catalog Model: Indexing AI Context Like a Library"
description: "Stop shoving your entire library into context. Learn to build a Dewey Decimal-style index that lets AI discover and load organizational knowledge on demand."
modified: 2025-11-02
tags:
  - AI
  - GitHub Copilot
  - Developer Tools
categories:
  - AI and Technology
---

**Part 1 of 3** in the Skills Catalog series

What if I told you that the secret to scaling AI context isn't about cramming more information into the window—it's about building an index?

Think about how a library works. You don't carry every book with you when you walk in. You use the card catalog (or nowadays, the computer system) to find exactly what you need, then pull that specific book from the shelf. The Dewey Decimal System doesn't contain the knowledge—it _points_ to it.

That's the fundamental insight behind the Skills catalog pattern: **hint, then dive**.

## The Context Window Problem

Most AI implementations fall into one of two traps:

1. **The Everything Approach**: Dump all your documentation, all your scripts, all your processes into every single conversation. Your context window fills up fast, the AI gets confused by irrelevant information, and you hit token limits before you've even started solving real problems.

2. **The Nothing Approach**: Provide no context at all, forcing the AI to guess at your conventions, processes, and organizational knowledge. Every conversation starts from zero.

Neither scales. But there's a third way.

## The Library Metaphor

When you walk into a library looking for information about Azure DevOps pipelines, you don't need to see every book in the building. You need:

1. **An index** that tells you Azure DevOps resources exist
2. **Enough metadata** to decide if that's what you need
3. **A path** to the detailed information if you want it

The librarian doesn't follow you around reading every book aloud. They point you to the right section, and you decide which books to open.

Your AI should work the same way.

## The Skills Table Pattern

Here's the core mechanic: a simple markdown table that lives in a file that's _always_ in context, listing what knowledge is available:

```markdown
| Skill Name | Description | Path |
|------------|-------------|------|
| Azure DevOps Pipelines | Work with Azure DevOps YAML pipelines, triggers, variables | `.github/skills/azure-devops-pipelines.md` |
| PowerShell Standards | Coding standards and common patterns for PowerShell | `.github/skills/powershell-standards.md` |
| React Component Patterns | Approved component patterns and examples | `.github/skills/react-patterns.md` |
```

This table becomes your Dewey Decimal System. It's small—maybe a few kilobytes—so it fits comfortably in every context window. But it _hints_ at hundreds or thousands of detailed documents.

When the AI sees a question about Azure pipelines, it:
1. Scans the table
2. Recognizes "Azure DevOps Pipelines" is relevant
3. Reads `.github/skills/azure-devops-pipelines.md` for the details
4. Uses that knowledge to answer your question

The detailed information loads **on demand**, not upfront.

## Platform-Agnostic Setup

This pattern works across AI platforms because it relies on a simple principle: every platform has _some_ file that's always in context.

**The emerging standard**: `AGENTS.md` is becoming the universal instruction file adopted by 40,000+ projects and supported by OpenAI Codex, Cursor, Gemini CLI, Aider, Factory, and other tools. It's placed in your project root and discovered hierarchically up the directory tree.

**Platform-specific files** still exist for tools that haven't adopted AGENTS.md:
- **GitHub Copilot**: `.github/copilot-instructions.md`
- **Claude Code**: `CLAUDE.md`
- **Cursor**: `AGENTS.md` (primary) or `.cursorrules` (legacy)
- **Codex CLI**: `AGENTS.md` (can be generated via `/init` command)
- **Gemini CLI**: `AGENTS.md` (primary) or `GEMINI.md` (legacy)

The pattern stays the same regardless of platform: one always-loaded file contains your skills table (or references it).

### Vendor-Agnostic Implementation with AGENTS.md

The cleanest approach leverages the emerging `AGENTS.md` standard. Create it once, and tools that support the standard will automatically discover it.

**Step 1**: Create `AGENTS.md` in your repository root:

```markdown
# Skills Catalog

This repository uses a skills-based knowledge system. When working on a task, check this table to see what organizational knowledge is available.

## Available Skills

| Skill Name | Description | Path |
|------------|-------------|------|
| Azure DevOps Pipelines | Work with Azure DevOps YAML pipelines, triggers, variables, and monorepo support | `.github/skills/azure-devops-pipelines.md` |
| PowerShell Standards | Our coding standards, approved modules, and common patterns for PowerShell scripts | `.github/skills/powershell-standards.md` |

## How to Use Skills

When you encounter a task related to a skill:
1. Read the skill file at the listed path
2. Follow any guidance, standards, or templates provided
3. Use any scripts referenced in the skill file
```

**Step 2**: For tools that don't support AGENTS.md yet, create symlinks or copy the content.

For **GitHub Copilot**, create `.github/copilot-instructions.md`:

```markdown
# GitHub Copilot Instructions

Always read and follow the skills catalog in `AGENTS.md`.
```

For **Claude Code**, create a symlink (or copy) from `AGENTS.md`:

```bash
ln -s AGENTS.md CLAUDE.md
```

For **Cursor**, the tool already supports `AGENTS.md`, but you can also create `.cursorrules` as a symlink for backward compatibility:

```bash
ln -s AGENTS.md .cursorrules
```

**Migration tip**: If you have existing instruction files, consolidate them into `AGENTS.md` and create symlinks:

```bash
mv .github/copilot-instructions.md AGENTS.md
ln -s AGENTS.md .github/copilot-instructions.md
ln -s AGENTS.md CLAUDE.md
ln -s AGENTS.md .cursorrules
```

Now your skills catalog lives in one standard location. When you add a new skill, you update `AGENTS.md` once, and all AI tools configured to read it see the update.

### Alternative: Platform-Specific Instructions

If you prefer to keep everything in each platform's native file without the extra indirection, you can embed the skills table directly:

**GitHub Copilot** (`.github/copilot-instructions.md`):

```markdown
# Repository Skills Catalog

This repository uses a skills-based knowledge system. When working on a task, check this table to see what organizational knowledge is available.

## Available Skills

| Skill Name | Description | Path |
|------------|-------------|------|
| Azure DevOps Pipelines | Work with Azure DevOps YAML pipelines, triggers, variables, and monorepo support | `.github/skills/azure-devops-pipelines.md` |
| PowerShell Standards | Our coding standards, approved modules, and common patterns for PowerShell scripts | `.github/skills/powershell-standards.md` |

## How to Use Skills

When you encounter a task related to a skill:
1. Read the skill file at the listed path
2. Follow any guidance, standards, or templates provided
3. Use any scripts referenced in the skill file
```

Both approaches work. The `root-skills.md` pattern keeps your catalog truly vendor-agnostic and easier to maintain. The embedded approach requires duplicating the table across platform files but keeps each platform self-contained.

**Recommendation**: Start with `root-skills.md` for simplicity. You can always inline it later if needed.

## Why This Scales

Let's do the math. Each row in your skills table costs maybe 50-100 tokens. A catalog of 100 skills costs around 5,000-10,000 tokens—negligible in modern context windows.

But each skill file might be 5,000-50,000 tokens. If you loaded all 100 skills upfront, you'd use 500,000-5,000,000 tokens before the conversation even started.

**The catalog lets you scale to hundreds of skills while keeping your base context lean.**

More importantly, the AI only loads what it needs. Working on Azure pipelines? It loads the Azure skill. Working on React components? It ignores Azure entirely and loads React patterns instead.

You get:
- Precision: Only relevant knowledge loads
- Scale: Hundreds of skills supported
- Performance: Lean base context window
- Clarity: AI knows what it doesn't know

## The "Hint, Then Dive" Workflow

Here's what it looks like in practice:

**User**: "Help me set up a monorepo trigger for our Azure pipeline"

**AI internal process**:
1. Scans copilot-instructions.md, sees the skills table
2. Identifies "Azure DevOps Pipelines" skill mentions "monorepo support"
3. Reads `.github/skills/azure-devops-pipelines.md`
4. Finds a section on monorepo triggers with examples
5. Applies that knowledge to generate the YAML

**AI response**: "I can help with that. For monorepos, you'll want to use path filters in your trigger section..."

The AI **discovered** the Azure DevOps skill existed, **chose** to load it, and **applied** the knowledge—all without you manually selecting what to include.

## What Goes in a Skill File?

Each skill file (like `.github/skills/azure-devops-pipelines.md`) should contain:

1. **Overview**: What this skill covers
2. **Key concepts**: Core knowledge
3. **Standards**: Your organizational conventions
4. **Examples**: Code samples, templates
5. **Scripts**: Paths to executable automation (more on this in Part 2)
6. **References**: Links to external docs

Keep it focused. One skill file = one domain of knowledge.

If a skill file grows beyond 10-20KB, that's a signal to break it into sub-skills (covered in Part 2).

## Path-Specific Instructions

GitHub Copilot supports even more granularity through path-specific instruction files in `.github/instructions/`:

Create `.github/instructions/api-standards.instructions.md`:

```markdown
---
applyTo: "src/api/**"
---

When working with files in src/api/:
- All API endpoints must include OpenAPI documentation
- Use the request validation middleware
- See `.github/skills/api-patterns.md` for approved patterns
```

Now, when working on files in `src/api/`, Copilot automatically applies these rules _and_ knows to reference the API patterns skill.

You're building layers:
- **Repository-wide**: `.github/copilot-instructions.md` with the skills table
- **Path-specific**: `.github/instructions/*.instructions.md` for targeted guidance
- **Skill files**: `.github/skills/*.md` for detailed domain knowledge

## Real-World Impact

I've used this pattern to:

- Build a catalog of 50+ organizational skills across development, DevOps, and infrastructure
- Reduce context window bloat by 80%+ (from megabytes of docs to a tiny index)
- Enable teams to discover knowledge they didn't know existed
- Create portable, shareable knowledge bases

The best part? This isn't bleeding-edge tech. It's just good information architecture applied to AI context management.

## Next Steps

In **Part 2**, we'll dive into building nested skills (like Azure DevOps → Repos → Branch Policies → PR Automation) and explore how scripts become on-demand execution primitives that keep your catalog lean while maintaining power.

In **Part 3**, we'll see how to distribute a shared skills repository across your entire organization using VS Code workspaces, making organizational knowledge instantly available in any project.

But for now, start simple:

1. Create `AGENTS.md` in your repository root (this is the emerging standard supported by Codex, Cursor, Gemini CLI, and others)
2. Add a skills table with 2-3 domains you work with regularly
3. Create one skill file with your team's conventions
4. For GitHub Copilot, create `.github/copilot-instructions.md` that references `AGENTS.md`
5. For Claude Code, create a `CLAUDE.md` symlink to `AGENTS.md`
6. Watch as the AI starts discovering and applying your organizational knowledge

You're not teaching the AI everything upfront. You're teaching it where to look when it needs to know something.

That's the power of the catalog.
