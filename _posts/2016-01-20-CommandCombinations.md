---
published: true
layout: post
title: "Command Combinations"
description: Gathering all the possible combinations of parameters that could be passed to your cmdlet.
modified: {}
tags: 
  - PowerShell
  - Strings
  - MultiArray
  - Combinations
categories: 
  - PowerShell
  - Utility
  - QA Testing
---

So I had an idea the other day. Wouldn't it be cool if I could run EVERY single possible command combinations for my [PoshProgressBar Module](https://tiberriver256.github.io/PoshProgressBar)?

That would be awesome! Wny would that be so awesome?

1. **Automated testing** -- To guarantee that every single progress bar combination actually ran as expected
2. **Screenshots** -- The website has a cool dynamic command builder form to fill out that will generate your PowerShell command. It would be sweet to hit "Preview" and see a screenshot of exactly what that particular progress bar looks like.

<!-- more -->

So... doesn't sound too bad right? All of the parameters you can use in the module have parameter sets so the possible inputs are definitely limited.

I also know you can get to all that metadata using **Get-Command** *Stay tuned for a later blog post*. But would I be able to get all the combinations? 

Let's start doing the math... wait... math is hard... let's keep it simple.

I have two arrays of three words each:

1. Cat's are scary
2. Dog's are cool

I have three possible combinations of the first word "Cat's" and each of the three words in the second array. Then I have three words in the first array so I can put it simply as 3 x 3 = 9 combinations.

If I add to that a third array of three words we get 3<sup>3</sup> or 27 possibilities. Yikes this could get complicated to build especially with the amount of values I have in each of my parameter sets.

I did however get a basic function together that would generate all possible combinations. It does not take into consideration parameter sets or required parameters yet though.

Now I just have to find the time to run through all 97920 possible command lines for my **New-ProgressBar** cmdlet with an **Invoke-Expression** calling them followed by a cmdlet to grab them with a screenshot.

One screenshot a second though... this is going to take awhile...

## Check out the code

<pre> <code class="ps">

function Get-StringCombinations
{

    Param(
        $MultiArray
    )
    
    function Recursive-Combine($MultiArray, $Count, $String)
    {

        foreach ($SubString in $MultiArray[$Count])
        {

             if( $Count -lt ( $MultiArray.count - 1 ) )
             {

                
                Recursive-Combine -MultiArray $MultiArray -Count ( $Count + 1 ) -String "$String $SubString"

             }
             else
             {

                "$String $SubString"

             }

        }

    }

    foreach ($String in $MultiArray[0]) {
            
            Recursive-Combine -MultiArray $MultiArray -Count ($Count+1) -String $String

    }

}

$CommonParamaters = @(
    "Verbose", "Debug", 
    "ErrorAction", "WarningAction", 
    "InformationAction", "ErrorVariable", 
    "WarningVariable", "InformationVariable", 
    "OutVariable", "OutBuffer", 
    "PipelineVariable"
    )

function Get-AllParameters ($Command)
{

    $Command = Get-Command $Command

    $Parameters = $Command.Parameters.Keys.ForEach({$Command.Parameters[$_]}) | where {$CommonParamaters -notcontains $_.Name}

    $ValidateSetParameters = $Parameters | where { 
    
        ( $_.Attributes | foreach { $_.TypeId.FullName } ) -contains "System.Management.Automation.ValidateSetAttribute" 
        
    }
    
    $AllParameters = @()

    foreach($Parameter in $ValidateSetParameters) { 
        
        $Array = @()

        ($Parameter.Attributes | where { 
        
                            $_.TypeId.FullName -eq "System.Management.Automation.ValidateSetAttribute" 
                        
                        } ).validValues | foreach { $Array += ( "-$($Parameter.Name) $_") } 

        $Array += ("")

        $AllParameters += @(,$Array)
        
    }

    $OtherParameters = $Parameters | where { $ValidateSetParameters -notcontains $_ }


    $PossibleValues = @{

        "System.String"="TestString"
        "System.String[]"=@("TestString1","TestString2")
        "System.Boolean"=@('$True','$False')

    }

    foreach ($Parameter in $OtherParameters) {
        
        $Array = @()

        if($Parameter.ParameterType.FullName -eq "System.Management.Automation.SwitchParameter")
        {

            $Array += ("-$($Parameter.Name)")

        } else {

            $PossibleValues["$($Parameter.ParameterType.FullName)"] | foreach {
        
                $Array += ("-$($Parameter.Name) $_")
        
            }

        }

        $Array += ("")

        $AllParameters += @(,$Array)

    }

    return $AllParameters

}

$AllParameters = Get-AllParameters -Command "New-ProgressBar"
$AllPossibleCommandlines = Get-StringCombinations $AllParameters

</code> </pre>