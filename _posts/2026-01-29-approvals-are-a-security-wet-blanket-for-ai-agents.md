---
published: true
layout: post
title: "Approvals Are a Security Wet Blanket for AI Agents"
description:
  "Approval prompts don't secure AI coding agents at scale. Reduce blast radius
  with an agent identity, isolated compute, least privilege, and egress
  controls."
modified: 2026-01-29
tags:
  - AI
  - Security
  - DevOps
categories:
  - AI and Technology
---

I was running an AI agent in a remote VM, exposed only via HTTP through a Node
web server so I could send it commands. The agent asked to kill all Node
processes. I approved it and immediately lost access to the VM.

In hindsight, obvious. In the moment, I was deep in a task and the approval
prompt looked like every other one I'd clicked that hour.

## Approval fatigue is the real problem

Approval prompts _feel_ like safety. They also feel like friction. And after the
four hundredth prompt in a week, they mostly feel like something to click so the
work can keep moving.

In a team of 20 people using agents all year, prompts pile up fast. Thousands.
Maybe millions. Most are fine, which is exactly the problem. Run tests. Format a
file. Update a dependency. Then one prompt says to download and run a script
from a link in a ticket. The approve button looks the same as all the others.

When the risky prompt shows up, the pattern is already set: click approve, keep
going. If safety depends on perfect attention, it fails.

<!-- vale Google.Colons = NO -->

## The lethal trifecta

<!-- vale Google.Colons = YES -->

Simon Willison coined the term **lethal trifecta** for prompt-injection attacks
in agents:

- The agent reads **untrusted content**—issues, pull requests, web pages,
  tickets.
- The agent **takes actions**—running commands, opening pull requests, calling
  tools.
- The agent has access to **private data**—keys, internal repos, customer data.

<!-- vale Google.Colons = NO -->

Give an agent all three and a prompt attack turns into an incident. Here's
Willison's write-up:
[The lethal trifecta](https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/).

<!-- vale Google.Colons = YES -->

## Shrink the blast radius instead

I've come to think of approvals as a speed bump, not a seatbelt. They can help,
but the control that works is a sandbox.

Start by giving the agent its own account. Don't run it as a developer. Scope it
to only what it needs—maybe just repo read access and permission to open pull
requests. Run the agent on an isolated machine, away from the rest of the
network. If a prompt tricks it, the damage stays local. Limit what the agent can
read and write. Prefer pull requests over direct pushes. Control outbound
traffic with a firewall or proxy, and log what the agent fetches.

None of this is exotic. It's like not giving your CI runner root access to prod.

## A boring setup beats a clever one

### Pull-request-only agents

If you pick one rule, pick this: the agent makes a branch and opens a pull
request. A human reviews and merges. The agent never pushes to a protected
branch. That turns agent actions into drafts. In my experience, this single
constraint stops most disasters.

### Where to run the agent

<!-- vale Google.Parens = NO -->

On macOS and Linux, sandbox options exist. Windows is harder than it looks.
Windows Subsystem for Linux isn't an isolation boundary. Docker isn't either in
many setups. For a stronger wall, use a VM like Hyper-V or VirtualBox. A cloud
machine works too.

<!-- vale Google.Parens = YES -->

Off-network is often easier. GitHub Codespaces or a cloud VM draws a clean line.
GitHub Actions runners are a good model: they start clean and use scoped access.

## Where approvals still help

I'm not saying approvals are useless. They help when they guard big,
irreversible actions: deploying to production, rotating secrets, publishing
packages and releases, writing to shared storage or outside services. Keep that
list small—that's what makes the prompts meaningful instead of noise.

## A checklist to steal

- [ ] Use a separate agent account, not a developer account.
- [ ] Scope access repo by repo.
- [ ] Let the agent open pull requests, but don't let it merge or push to
      protected branches.
- [ ] Don't put secrets in the agent environment by default.
- [ ] Log and restrict outbound traffic. Use a proxy or allowlist when possible.
- [ ] Gate high-risk actions with a small set of approvals.

## Closing thought

Approvals feel safe because they're visible, but visibility isn't control. Put
the agent in a box that's hard to escape, and give it access that can't do much
harm. That's the defense that works when you're tired and clicking through
prompts at 4 PM on a Friday.
