---
published: true
layout: post
title: "Sharing Skills: From Claude Marketplace to VS Code Workspaces"
description: "Anthropic distributes skills through Claude Code marketplace and Skills API. Here's how to adapt that shareability for GitHub Copilot teams."
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

You've built a beautiful skills catalog. Nested domains. Scripts that execute on demand. Following Anthropic's patterns, adapted for GitHub Copilot.

Now the final question: **How do you share this across your team and organization?**

Anthropic has multiple distribution channels:
- **Claude Code marketplace** for discovering and installing skills
- **Skills API** for programmatic access
- **Claude.ai** for web-based skill usage

The core concept: **skills are portable, reusable knowledge packages**.

This part shows how to adapt that shareability for GitHub Copilot using VS Code workspaces—making organizational knowledge available across all your repositories without copy-pasting.

## How Anthropic Distributes Skills

Anthropic makes skills shareable through multiple channels:

### Claude Code Marketplace

Browse, discover, and install community skills directly in Claude Code. Skills become instantly available once installed.

### Skills API

Access skills programmatically:

```javascript
import { Claude } from '@anthropic-ai/sdk';

const client = new Claude({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Load skills for the conversation
const response = await client.messages.create({
  model: 'claude-3-sonnet',
  messages: [{role: 'user', content: 'Use the mcp-builder skill...'}],
  skills: ['mcp-builder'], // Skills loaded on demand
});
```

### Claude.ai

Skills available in the web interface—select and use them in any conversation.

### The Core Concept

What makes this powerful isn't the specific distribution mechanism—it's the **philosophy**:

- **Portable**: Skills are self-contained packages
- **Reusable**: Install once, use everywhere
- **Shareable**: Community or organization-wide distribution
- **Versioned**: Skills evolve, track changes

This concept transfers to GitHub Copilot—we just need a different distribution mechanism.

## The Portability Challenge for Copilot

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

Do you copy `.github/skills/` into each repo? What happens when you update a script or add a new skill?

**That doesn't scale.**

Anthropic solved this with their marketplace and API. GitHub Copilot doesn't have those (yet), but we can achieve the same outcome.

## Adapting Distribution for GitHub Copilot

Here's the adaptation: **A shared skills repository plus VS Code workspaces.**

**The key insight**: VS Code automatically merges `.github/copilot-instructions.md` files from all workspace folders.

This achieves the same outcome as Anthropic's marketplace—portable, reusable skills—using Copilot's capabilities.

## The Shared Skills Repository

**Solution**: Create one repository holding all organizational skills. Every project references it.

Same philosophy as Anthropic's skill packages—centralized, versioned, shareable knowledge.

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

### Benefits (Like Anthropic's Distribution)

1. **Version control**: Skills evolve; track changes (like Anthropic's versioned skills)
2. **Collaboration**: Teams contribute via PRs (like Anthropic's community marketplace)
3. **Validation**: CI verifies scripts work, markdown is valid
4. **Discoverability**: One repo shows all organizational knowledge
5. **Consistency**: Everyone uses the same versions (like Anthropic's installed skills)

## VS Code Workspaces: The Distribution Mechanism

Here's where the adaptation shines: **VS Code automatically merges `.github/copilot-instructions.md` files from all workspace folders.**

This mimics Anthropic's "install and use" pattern—add a workspace folder, skills become available.

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

**That's it.** No wiring needed. VS Code merges the instructions automatically when the workspace opens.

**You've achieved Anthropic's "install and use" pattern—organizational knowledge available without copying files.**

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

Like Anthropic's marketplace where skill updates propagate automatically, your organization gets the same benefit.

## Comparing the Approaches

**Anthropic Skills Distribution**:
- Claude Code marketplace for discovery and installation
- Skills API for programmatic access
- Skills auto-update when new versions publish
- Works across Claude.ai, Claude Code, API

**GitHub Copilot Adaptation**:
- Shared repository for centralized skills
- VS Code workspaces for "installation"
- Git pull for updates
- Works across all projects that include the workspace

Different mechanisms, same outcome: **portable, reusable, shareable knowledge packages**.

## What You've Built

Over these three parts, you've adapted Anthropic's Skills concept for GitHub Copilot:

**Part 1**: Anthropic's auto-discovery → Catalog pattern for explicit navigation

**Part 2**: Anthropic's nested structures and scripts → Adapted for the catalog

**Part 3**: Anthropic's marketplace distribution → VS Code workspaces for sharing

You now have a system for scaling AI context to **hundreds of skills** across **dozens of repositories**, following Anthropic's beautiful philosophy adapted to Copilot's capabilities.

Start with one shared skills repository. Add a few key skills. Create workspace files for your top projects.

Your AI doesn't need to know everything. It just needs to know where to look.

**That's Anthropic's insight, adapted for GitHub Copilot.**

---

_Thanks for reading this series! This approach adapts [Anthropic Skills](https://www.anthropic.com/news/skills) for GitHub Copilot. The core concepts—modular knowledge, on-demand loading, shareability—come from Anthropic's brilliant design. The catalog pattern is how we bring it to Copilot._

_If you build a skills catalog, I'd love to hear about it. Find me on [LinkedIn](https://linkedin.com/in/tiberriver256) or open an issue on this blog's [GitHub repo](https://github.com/Tiberriver256/Tiberriver256.GitHub.io)._
