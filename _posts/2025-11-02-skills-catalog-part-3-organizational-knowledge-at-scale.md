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

## What You've Built

Over these three parts, you've learned:

**Part 1**: The catalog pattern—indexing knowledge so AI can discover and load it on demand.

**Part 2**: Nested skills and scripts—organizing hundreds of domains with hierarchical structure.

**Part 3**: Organizational distribution—sharing knowledge across repositories with VS Code workspaces.

You now have a system for scaling AI context to **hundreds of skills** across **dozens of repositories** without overwhelming your context window or duplicating knowledge.

Start with one shared skills repository. Add a few key skills. Create workspace files for your top projects. Let VS Code handle the rest.

Your AI doesn't need to know everything. It just needs to know where to look.

**That's the power of the skills catalog.**

---

_Thanks for reading this series! If you build a skills catalog, I'd love to hear about it. Find me on [LinkedIn](https://linkedin.com/in/tiberriver256) or open an issue on this blog's [GitHub repo](https://github.com/Tiberriver256/Tiberriver256.GitHub.io) with your experience._
