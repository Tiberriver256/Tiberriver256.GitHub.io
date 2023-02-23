---
published: true
layout: post
title: 'How To Generate A Report On Your Classic Build/Release Pipeline Agent Specifications'
description: >
  Ubuntu 16.04 is being removed from MS Azure DevOps in October 2021. Here's a quick way to find which of your classic
  build/release pipelines need to be changed.
modified: 2021-10-16
tags:
  - PowerShell
  - Azure DevOps
categories:
  - PowerShell
  - Azure DevOps
---

{% include 
    image.html 
      path="AzureDevOps-Ubuntu-Deprecated-Warning.png" 
      alt="Ubuntu 16.04 LTS environment is deprecated and will be removed on October 18, 2021. Migrate to ubuntu-latest instead. For more details, see https://github.com/actions/virtual-environments/issues/3287"
%}

> Warning ⚠
> Ubuntu 16.04 LTS environment is deprecated and will be removed on October 18, 2021. Migrate to
> ubuntu-latest instead. For more details, see <https://github.com/actions/virtual-environments/issues/3287>

Perhaps you may have seen this warning in Azure DevOps already. It's easy
enough to fix once you identify a classic build or release pipeline that
needs upgrading but it is quite the chore to click through and manually
find which pipelines need updating.

Here I'll show you a quick script to generate a report of all your classic
build and release pipelines and what agent specification they are using.

## Step 1 - Download VSTeams PowerShell Module

```ps
Install-Module VSTeam -Scope CurrentUser
```

The [VSTeam module](https://github.com/MethodsAndPractices/vsteam) is a PowerShell
module started by Donovan Brown a Microsoft employee that has since recieved
numerous contributions from the Azure DevOps community and has quite a nice set
of features for working with Azure DevOps.

## Step 2 - Generate a Personal Access Token

[Generate a personal access
token](https://docs.microsoft.com/en-us/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate?view=azure-devops&tabs=preview-page)
with the following scopes:

* Build:Read
* Release:Read

## Step 3 - Run the following script

```ps
Import-Module VSTeam

function Get-AzureDevOpsAgentSpecifications {

    [CmdletBinding()]

    param(
        [Parameter(Mandatory)]
        [string]
        $Account,

        [Parameter(Mandatory)]
        [securestring]
        $PAT
    )

    Set-VSTeamAccount -Account $Account -SecurePersonalAccessToken $PAT

    Write-Verbose "Fetching Projects from your account: [$Account]"
    $Projects = Get-VSTeamProject

    Write-Verbose "Found [$($Projects.Count)] Projects to check"

    $Report = @()

    foreach ($Project in $Projects) {
        $ClassicBuildType = "1"

        Write-Verbose "Fetching all classic pipelines from the project: [$($Project.Name)]"
        $ClassicBuilds = Get-VSTeamBuildDefinition -ProjectName $Project.Name |
            Where-Object { $_.InternalObject.process.type -eq $ClassicBuildType }

        Write-Verbose "Adding [$($ClassicBuilds.Count)] classic build pipelines to the report"

        foreach ($Build in $ClassicBuilds) {
            $Report += [pscustomobject]@{
                Organization = $Account
                Project = $Project.Name
                Name = $Build.Name
                Type = "Build"
                ReleaseStage = "N/A"
                Phase = "N/A"
                WebLink = $Build.InternalObject._links.web.href
                AgentSpecification = $Build.InternalObject.process.target.agentSpecification.identifier
            }

            $BuildPhasesWithUniqueAgent = $Build.InternalObject.process.phases | where { $Null -ne $_.target.agentSpecification }

            foreach ($BuildPhase in $BuildPhasesWithUniqueAgent) {
                $Report += [pscustomobject]@{
                    Organization = $Account
                    Project = $Project.Name
                    Name = $Build.Name
                    Type = "Build"
                    ReleaseStage = "N/A"
                    Phase = $BuildPhase.name
                    WebLink = $Build.InternalObject._links.web
                    AgentSpecification = $Build.InternalObject.process.target.agentSpecification.identifier
                }
            }
        }

        Write-Verbose "Fetching all classic release pipelines from the project: [$($Project.Name)]"
        $ReleasePipelines = Get-VSTeamReleaseDefinition -ProjectName $Project.Name | foreach { Get-VSTeamReleaseDefinition -ProjectName $Project.Name -Id $_.Id }

         Write-Verbose "Adding [$($ReleasePipelines.Count)] classic release pipelines to the report"

        foreach ($Release in $ReleasePipelines) {
            foreach ($ReleaseStage in $Release.InternalObject.environments) {
                foreach ($ReleaseStagePhase in $ReleaseStage.deployPhases) {
                    $Report += [pscustomobject]@{
                        Organization = $Account
                        Project = $Project.Name
                        Name = $Release.Name
                        Type = "Release"
                        ReleaseStage = "N/A"
                        Phase = $ReleaseStage.name
                        WebLink = $Release.Links.Web
                        AgentSpecification = $ReleaseStagePhase.deploymentInput.agentSpecification.identifier
                    }
                }
            }
        }
    }

    $Report
}
```

*NOTE: I'll keep an [updated gist
here](https://gist.github.com/Tiberriver256/afbc749e1ccc04b287fae296694fea1c) in
 case others use this and find bugs.

You can use this function by just running the command or by specifying the
`-Verbose` argument to get a little bit more detail while it runs.

```ps
Get-AzureDevOpsAgentSpecifications -Verbose
```

It will prompt you to put in the name of your Azure DevOps Account (also known
as your organization name) and a personal access token and will generate the
following output.

```txt
Organization       : tiberriver256
Project            : PowerShell Stuff
Name               : PowerShell Stuff-CI
Type               : Build
ReleaseStage       : N/A
Phase              : N/A
WebLink            : https://dev.azure.com/tiberriver256/be77c668-1e13-4360-aa08-264b1d5f64c6/_build/definition?definitionId=2
AgentSpecification : windows-2019

Organization       : tiberriver256
Project            : az-204
Name               : az-204-CI
Type               : Build
ReleaseStage       : N/A
Phase              : N/A
WebLink            : https://dev.azure.com/tiberriver256/7f6d5e26-f61e-403b-8016-2b871f88b960/_build/definition?definitionId=11
AgentSpecification : ubuntu-16.04

Organization       : tiberriver256
Project            : az-204
Name               : az-204-CI
Type               : Build
ReleaseStage       : N/A
Phase              : Agent job 1
WebLink            : @{href=https://dev.azure.com/tiberriver256/7f6d5e26-f61e-403b-8016-2b871f88b960/_build/definition?definitionId=11}
AgentSpecification : ubuntu-16.04

Organization       : tiberriver256
Project            : az-204
Name               : My Little Release
Type               : Release
ReleaseStage       : N/A
Phase              : Stage 1
WebLink            : https://dev.azure.com/tiberriver256/7f6d5e26-f61e-403b-8016-2b871f88b960/_release?definitionId=1
AgentSpecification : ubuntu-16.04

Organization       : tiberriver256
Project            : az-204
Name               : My Little Release
Type               : Release
ReleaseStage       : N/A
Phase              : Stage 2
WebLink            : https://dev.azure.com/tiberriver256/7f6d5e26-f61e-403b-8016-2b871f88b960/_release?definitionId=1
AgentSpecification : vs2017-win2016
```

If you'd like to use this output in Excel you can simply pipe it to a CSV using
the `Export-CSV` cmdlet.

```ps
$Report = Get-AzureDevOpsAgentSpecifications
$Report | Export-CSV -Path C:\my\azure-devops-report.csv
```

That should do it! Hope this was helpful to somebody else out there!
