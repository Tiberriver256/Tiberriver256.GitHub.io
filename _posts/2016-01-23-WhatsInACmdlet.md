---
published: true
layout: post
title: "What's in a cmdlet?"
description: First release of the module.
modified: 2016-01-23
tags:
  - PowerShell
  - Cmdlet
  - Metadata
  - Get-Command
categories:
  - PowerShell
  - Utility
  - QA Testing
---

Have you ever used the magical cmdlet called **Show-Command**? Ever wonder how it knows what type of GUI form object to assign to each particular parameter in your cmdlet? Did you even know it works with any cmdlet?

It is a pretty magical cmdlet. One with which you should play sometime. Today, I am going to show you briefly how to see the same data that is used to generate those GUIs. All you would need to do is determine the specific type (i.e. string, integer, boolean) and map that to a specific form object. for example if a parameter expected a string input you would map that to a simple text input. If it expected a boolean you would map it to a checkbox. Cool, but how would I store that information for my custom cmdlets and how would I access that information? The answers are not as bad as you would think.

<!-- more -->

Storing the info = Params
Getting the info = **Get-Command**

## Params

All the information regarding what information you expect to be given to your cmdlet is defined in your params. See [this article](https://technet.microsoft.com/en-us/magazine/jj554301.aspx, "Windows PowerShell: Defining Parameters") for a simple walkthrough on params. It's an oldie but a goodie.

## Get-Command

Anyone who has watched a PowerShell tutorial knows **Get-Command**. It's one of the first things they tell you. Not sure what you are looking for? Get command takes wildcards! Use it to search for the command you are looking for like this:

<pre> <code class="ps">

Get-Command *SQL*

</code> </pre>

It should return any cmdlets that have the keyword "SQL" in them! COOL! WOW! AWESOME! We then leave the cmdlet and go on to other awesome things. Meanwhile... **Get-Command** is saying... _Wait! I can do SO much more for you!_

Check out how much info I can get on a simple command like **Read-Host**. You can see the **Parameters** property should fulfill our needs.

<pre> <code class="ps">

(Get-Command Read-Host).Parameters | ConvertTo-Json -Depth 1

</code> </pre>

## ALLLLL the info!

<pre> <code class="json">

{
    "Prompt":  {
                   "Name":  "Prompt",
                   "ParameterType":  "System.Object",
                   "ParameterSets":  "System.Collections.Generic.Dictionary`2[System.String,System.Management.Automation.ParameterSetMetadata]",
                   "IsDynamic":  false,
                   "Aliases":  "",
                   "Attributes":  "System.Management.Automation.AllowNullAttribute System.Management.Automation.ParameterAttribute",
                   "SwitchParameter":  false
               },
    "AsSecureString":  {
                           "Name":  "AsSecureString",
                           "ParameterType":  "switch",
                           "ParameterSets":  "System.Collections.Generic.Dictionary`2[System.String,System.Management.Automation.ParameterSetMetadata]",
                           "IsDynamic":  false,
                           "Aliases":  "",
                           "Attributes":  "System.Management.Automation.ParameterAttribute",
                           "SwitchParameter":  true
                       },
    "Verbose":  {
                    "Name":  "Verbose",
                    "ParameterType":  "switch",
                    "ParameterSets":  "System.Collections.Generic.Dictionary`2[System.String,System.Management.Automation.ParameterSetMetadata]",
                    "IsDynamic":  false,
                    "Aliases":  "vb",
                    "Attributes":  "System.Management.Automation.AliasAttribute System.Management.Automation.ParameterAttribute",
                    "SwitchParameter":  true
                },
    "Debug":  {
                  "Name":  "Debug",
                  "ParameterType":  "switch",
                  "ParameterSets":  "System.Collections.Generic.Dictionary`2[System.String,System.Management.Automation.ParameterSetMetadata]",
                  "IsDynamic":  false,
                  "Aliases":  "db",
                  "Attributes":  "System.Management.Automation.AliasAttribute System.Management.Automation.ParameterAttribute",
                  "SwitchParameter":  true
              },
    "ErrorAction":  {
                        "Name":  "ErrorAction",
                        "ParameterType":  "System.Management.Automation.ActionPreference",
                        "ParameterSets":  "System.Collections.Generic.Dictionary`2[System.String,System.Management.Automation.ParameterSetMetadata]",
                        "IsDynamic":  false,
                        "Aliases":  "ea",
                        "Attributes":  "System.Management.Automation.ParameterAttribute System.Management.Automation.AliasAttribute",
                        "SwitchParameter":  false
                    },
    "WarningAction":  {
                          "Name":  "WarningAction",
                          "ParameterType":  "System.Management.Automation.ActionPreference",
                          "ParameterSets":  "System.Collections.Generic.Dictionary`2[System.String,System.Management.Automation.ParameterSetMetadata]",
                          "IsDynamic":  false,
                          "Aliases":  "wa",
                          "Attributes":  "System.Management.Automation.ParameterAttribute System.Management.Automation.AliasAttribute",
                          "SwitchParameter":  false
                      },
    "InformationAction":  {
                              "Name":  "InformationAction",
                              "ParameterType":  "System.Management.Automation.ActionPreference",
                              "ParameterSets":  "System.Collections.Generic.Dictionary`2[System.String,System.Management.Automation.ParameterSetMetadata]",
                              "IsDynamic":  false,
                              "Aliases":  "infa",
                              "Attributes":  "System.Management.Automation.ParameterAttribute System.Management.Automation.AliasAttribute",
                              "SwitchParameter":  false
                          },
    "ErrorVariable":  {
                          "Name":  "ErrorVariable",
                          "ParameterType":  "string",
                          "ParameterSets":  "System.Collections.Generic.Dictionary`2[System.String,System.Management.Automation.ParameterSetMetadata]",
                          "IsDynamic":  false,
                          "Aliases":  "ev",
                          "Attributes":  "System.Management.Automation.AliasAttribute System.Management.Automation.ParameterAttribute System.Management.Automation.Internal.CommonParameters+ValidateVariableName",
                          "SwitchParameter":  false
                      },
    "WarningVariable":  {
                            "Name":  "WarningVariable",
                            "ParameterType":  "string",
                            "ParameterSets":  "System.Collections.Generic.Dictionary`2[System.String,System.Management.Automation.ParameterSetMetadata]",
                            "IsDynamic":  false,
                            "Aliases":  "wv",
                            "Attributes":  "System.Management.Automation.Internal.CommonParameters+ValidateVariableName System.Management.Automation.ParameterAttribute System.Management.Automation.AliasAttribute",
                            "SwitchParameter":  false
                        },
    "InformationVariable":  {
                                "Name":  "InformationVariable",
                                "ParameterType":  "string",
                                "ParameterSets":  "System.Collections.Generic.Dictionary`2[System.String,System.Management.Automation.ParameterSetMetadata]",
                                "IsDynamic":  false,
                                "Aliases":  "iv",
                                "Attributes":  "System.Management.Automation.Internal.CommonParameters+ValidateVariableName System.Management.Automation.ParameterAttribute System.Management.Automation.AliasAttribute",
                                "SwitchParameter":  false
                            },
    "OutVariable":  {
                        "Name":  "OutVariable",
                        "ParameterType":  "string",
                        "ParameterSets":  "System.Collections.Generic.Dictionary`2[System.String,System.Management.Automation.ParameterSetMetadata]",
                        "IsDynamic":  false,
                        "Aliases":  "ov",
                        "Attributes":  "System.Management.Automation.Internal.CommonParameters+ValidateVariableName System.Management.Automation.ParameterAttribute System.Management.Automation.AliasAttribute",
                        "SwitchParameter":  false
                    },
    "OutBuffer":  {
                      "Name":  "OutBuffer",
                      "ParameterType":  "int",
                      "ParameterSets":  "System.Collections.Generic.Dictionary`2[System.String,System.Management.Automation.ParameterSetMetadata]",
                      "IsDynamic":  false,
                      "Aliases":  "ob",
                      "Attributes":  "System.Management.Automation.ParameterAttribute System.Management.Automation.AliasAttribute System.Management.Automation.ValidateRangeAttribute",
                      "SwitchParameter":  false
                  },
    "PipelineVariable":  {
                             "Name":  "PipelineVariable",
                             "ParameterType":  "string",
                             "ParameterSets":  "System.Collections.Generic.Dictionary`2[System.String,System.Management.Automation.ParameterSetMetadata]",
                             "IsDynamic":  false,
                             "Aliases":  "pv",
                             "Attributes":  "System.Management.Automation.Internal.CommonParameters+ValidateVariableName System.Management.Automation.ParameterAttribute System.Management.Automation.AliasAttribute",
                             "SwitchParameter":  false
                         }
}



</code> </pre>
