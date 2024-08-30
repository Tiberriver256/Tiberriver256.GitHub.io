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

Following the above strategy I wrote up a quick PowerShell script that seems to get me everything I need:

```powershell
#Requires -PSEdition Core

<#
.SYNOPSIS
    Retrieves distinct commits and associated work items for a build pipeline... with support for monorepos!
    See the blog post at https://tiberriver256.github.io/DevOps/azure-devops-pipelines-related-work-items-monorepo for more information.
.DESCRIPTION
    This script retrieves the distinct commits and associated work items for a build pipeline. It requires the following parameters:
    - BuildId: The ID of the build. If not provided, it uses the value of the environment variable BUILD_BUILDID.
    - CollectionUri: The URI of the collection. If not provided, it uses the value of the environment variable SYSTEM_COLLECTIONURI.
    - ProjectId: The ID of the project. If not provided, it uses the value of the environment variable SYSTEM_TEAMPROJECTID.
    - AuthorizationHeader: The authorization header. If not provided, it uses the value of the environment variable SYSTEM_ACCESSTOKEN.
.PARAMETER BuildId
    The ID of the build.
.PARAMETER CollectionUri
    The URI of the collection.
.PARAMETER ProjectId
    The ID of the project.
.PARAMETER AuthorizationHeader
    The authorization header.
.OUTPUTS
    Returns a PSCustomObject with the following properties:
    - DistinctCommits: An array of distinct commits.
    - AssociatedWorkItems: An array of associated work items.
.EXAMPLE
    Get-BuildPipelineScopedChanges -BuildId 12345 -CollectionUri "https://dev.azure.com/myorg/" -ProjectId "be77c668-1e13-4360-aa08-264b1d5f64c6" -AuthorizationHeader "Bearer <access_token>"
    Retrieves the distinct commits and associated work items for the build with ID 12345 in the project "be77c668-1e13-4360-aa08-264b1d5f64c6" in the Azure DevOps organization "myorg" using the specified access token.
#>

[CmdletBinding()]
param (
    [Parameter()]
    [int]
    $BuildId = $ENV:BUILD_BUILDID,

    [Parameter()]
    [Uri]
    $CollectionUri = $ENV:SYSTEM_COLLECTIONURI,

    [Parameter()]
    [Guid]
    $ProjectId = $ENV:SYSTEM_TEAMPROJECTID,

    [Parameter()]
    $AuthorizationHeader = "Bearer $ENV:SYSTEM_ACCESSTOKEN"
)

function EnsureModuleInstalled ( $name ) {  
    $module = Get-InstalledModule -Name $name  
    if ($null -eq $module) {  
        Install-Module -Name $name -Scope CurrentUser -AllowClobber  
    }  
}

EnsureModuleInstalled "powershell-yaml"

$Headers = @{
    Authorization = $AuthorizationHeader
}

$BuildUri = "$CollectionUri$ProjectId/_apis/build/builds/$BuildId"
$ChangesUri = "$CollectionUri$ProjectId/_apis/build/builds/$BuildId/changes"

$Build = Invoke-RestMethod -Uri $BuildUri -Headers $Headers
$RepositoryId = $Build.repository.id
$CommitId = $Build.sourceVersion
$BuildDefinitionId = $Build.definition.id
$BuildDefinitionRevision = $Build.definition.revision

$BuildDefinitionUri = "$CollectionUri$ProjectId/_apis/build/definitions/$($BuildDefinitionId)?revision=$BuildDefinitionRevision"
$BuildDefinition = Invoke-RestMethod -Uri $BuildDefinitionUri -Headers $Headers
$YamlFilePath = $BuildDefinition.process.yamlFilename
$YamlFileUri = "$CollectionUri$ProjectId/_apis/git/repositories/$RepositoryId/items?path=$YamlFilePath&download=true&versionDescriptor.version=$CommitId&versionDescriptor.versionType=commit"
$YamlFile = Invoke-RestMethod -Uri $YamlFileUri -Headers $Headers | ConvertFrom-Yaml 
$TriggerPaths = $YamlFile.trigger.paths.include | ForEach-Object { $_ -replace "\*", "" }

$IsMonoRepo = $TriggerPaths.Count -ge 1 -and $TriggerPaths[0] -ne "/"


$Changes = Invoke-RestMethod -Uri $ChangesUri -Headers $Headers

$LatestChangeTimeStamp = $Changes.value[0].timestamp
$OldestChangeTimeStamp = $Changes.value[-1].timestamp

$CommitsFilteredByTriggerPaths = @()
$BaseCommitsUri = "$CollectionUri$ProjectId/_apis/git/repositories/$RepositoryId/commits?searchCriteria.fromDate=$OldestChangeTimeStamp&searchCriteria.toDate=$LatestChangeTimeStamp&searchCriteria.includeWorkItems=true"

if ($IsMonoRepo) {
    foreach ($Path in $TriggerPaths) {
        $CommitsUri = "$BaseCommitsUri&searchCriteria.itemPath=$Path"
        $Commits = Invoke-RestMethod -Uri $CommitsUri -Headers $Headers
        $CommitsFilteredByTriggerPaths += $Commits.value
    }
}
else {
    $Commits = Invoke-RestMethod -Uri $BaseCommitsUri -Headers $Headers
    $CommitsFilteredByTriggerPaths = $Commits.value
}

$DistinctCommits = @($CommitsFilteredByTriggerPaths |
    Group-Object -Property commitId |
    ForEach-Object { $_.Group[0] })

$DistinctWorkItemUrls = $DistinctCommits.workItems.url | Get-Unique

$AssociatedWorkItems = @($DistinctWorkItemUrls | ForEach-Object {
        Invoke-RestMethod -Uri $_ -Headers $Headers
    })

return [PSCustomObject]@{
    DistinctCommits     = $DistinctCommits
    AssociatedWorkItems = $AssociatedWorkItems
}
```