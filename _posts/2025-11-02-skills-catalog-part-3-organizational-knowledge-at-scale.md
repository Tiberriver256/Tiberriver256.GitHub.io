---
published: true
layout: post
title: "Sharing Skills: Claude Marketplace to VS Code Workspaces"
description: "Anthropic distributes skills via Claude marketplace and API. Adapt that shareability for GitHub Copilot teams using VS Code workspaces."
modified: 2025-11-02
tags:
  - AI
  - GitHub Copilot
  - DevOps
  - Team Collaboration
categories:
  - AI and Technology
---

**Part 3 of 3** in the Skills Catalog series ([Part 1](/ai%20and%20technology/skills-catalog-part-1-indexing-ai-context) | [Part 2](/ai%20and%20technology/skills-catalog-part-2-building-skills-that-scale))

You've built a skills catalog. Nested domains. Scripts that execute on demand.

Now the final question: **How do you share this across your team?**

Anthropic distributes skills through their marketplace and Skills API—portable, reusable knowledge packages.

GitHub Copilot doesn't have a marketplace. But VS Code workspaces achieve the same outcome.

## The Problem

Your `.github/skills/` directory holds organizational standards, tested scripts, and domain expertise.

But you have multiple repositories—frontend apps, backend services, infrastructure, libraries.

Copy `.github/skills/` into each? What happens when you update a script?

**That doesn't scale.**

## The Solution: Shared Repository + Workspaces

Create one repository holding all organizational skills. Every project references it.

**The key insight**: VS Code automatically merges `.github/copilot-instructions.md` files from all workspace folders.

### Repository Structure

Create `org-skills` (or whatever you prefer):

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

This repository becomes your single source of truth.

Version control tracks changes. Teams contribute via PRs. CI validates scripts. Everyone uses the same versions.

## VS Code Workspaces

VS Code merges `.github/copilot-instructions.md` files from all workspace folders. Add a folder, skills become available.

### How It Works

Create a `.code-workspace` file in any project:

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

This workspace includes two folders: the current repository and org-skills.

Open the workspace, and **GitHub Copilot reads both `.github/copilot-instructions.md` files and merges them.**

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

Notice paths are relative to org-skills (`skills/...`), not absolute.

VS Code merges the instructions automatically. **Organizational knowledge available, no copying.**

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

**Done.** The project has access to all organizational skills.

## Updating Skills

Add or update a skill in `org-skills`, commit, and push. Every project pulls the latest:

```bash
cd ~/projects/org-skills
git pull
```

All workspaces referencing `org-skills` see the updates immediately.

## What You've Built

Over these three parts, you've adapted Anthropic's Skills concept for GitHub Copilot:

**Part 1**: Auto-discovery → Catalog pattern for navigation

**Part 2**: Nested structures and scripts → Adapted for the catalog

**Part 3**: Marketplace distribution → VS Code workspaces for sharing

A system for scaling AI context to **hundreds of skills** across **dozens of repositories**.

Your AI doesn't need to know everything. It just needs to know where to look.

---

_This approach adapts [Anthropic Skills](https://www.anthropic.com/news/skills) for GitHub Copilot. The core concepts—modular knowledge, on-demand loading, shareability—come from Anthropic's design._

_If you build a skills catalog, I'd love to hear about it. Find me on [LinkedIn](https://linkedin.com/in/tiberriver256) or open an issue on this blog's [GitHub repo](https://github.com/Tiberriver256/Tiberriver256.GitHub.io)._
