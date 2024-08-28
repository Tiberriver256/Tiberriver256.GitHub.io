---
published: true
layout: post
title: "Getting the related work items for an Azure Pipeline run in a monorepo"
description:
  Azure pipelines 'Related Work Items' feature doesn't support monorepos...
  let's find a solution!
modified: 2024-08-28
tags:
  - PowerShell
  - Azure DevOps
categories:
  - DevOps
---

## The problem..

I absolutely love this little ['related work items'](https://learn.microsoft.com/en-us/azure/devops/pipelines/process/environments?view=azure-devops#view-deployment-history)
feature in Azure DevOps pipelines:

{% include image.html path="related-work-items-button.png" %}

You can click on it and quickly get a view of the work items associated with that pipeline:

{% include image.html path="related-work-items-view.png" %}

This information is beneficial in two ways:

1. It is useful information for the person running a deployment
2. It can be used via ADO APIs to block deployments if related stories are in a certain status

So... what's the problem with this feature?

It doesn't support monorepos 😭😭😭

## What happens with monorepos?

Let's say I have a repository set up with the following folder structure and two azure pipelines files:

{% include image.html path="the-setup.png" %}

Then let's say I commit to the main branch twice. Each commit adds a single `index.js` file to
each folder:

{% include image.html path="the-work.png" %}

Each of those files trigger their own build runs. When I view the related work items for each though.. this happens:

{% include image.html path="the-problem.png" %}

## Does Microsoft plan to add monorepo support?

No... even though I'd think there would be plenty of support for this,
the idea has never gotten any [traction](https://stackoverflow.com/a/68729663/3317144).

## Let's find a solution

It appears from the Azure DevOps REST API documentation that we should be able to do this ourselves...
**IF** we are associating work items to our commits (via PR or otherwise). Which I so happen to be
doint already so the following method looks pretty promising:

1. Get ALL the commits related to a build pipeline via the [Get Build Changes](https://learn.microsoft.com/en-us/rest/api/azure/devops/build/builds/get-build-changes?view=azure-devops-rest-7.1) endpoint.
2. Filter those commits down to the ones we want using the [Get Commits](https://learn.microsoft.com/en-us/rest/api/azure/devops/git/commits/get-commits?view=azure-devops-rest-7.1&tabs=HTTP) endpoint using:
   1. `searchCriteria.itemPath` - to exclude commits that aren't in our trigger
   2. `searchCriteria.includeWorkItems` - to include the work items associated with the commits
3. Pull the work item ids from Step #2 to do whatever I want with

### PowerShell time!

Following the above strategy I wrote up a quick PowerShell script (gist to keep up to date) that seems to get me everything I need:

<script src="https://gist.github.com/Tiberriver256/99452a6bd254327acceb0405e34d2230.js?file=Get-BuildPipelineScopedChanges.ps1"></script>