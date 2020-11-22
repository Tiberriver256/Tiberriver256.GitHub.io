---
published: true
layout: post
title: 'PowerShell ProgressBar -- Part 1'
description: Showing how to create a progress bar in PowerShell using XAML and runspaces.
modified: {}
tags:
  - PowerShell
  - ProgressBar
categories:
  - PowerShell
---

## The Series

<article>
    <ul>
        {% for post in site.tags["ProgressBar"] %}{% if post.title != null %}
            <li class="entry-title"><a href="{{ site.url }}{{ post.url }}" title="{{ post.title }}">{{ post.title }}</a></li>
        {% endif %}{% endfor %}
    </ul>
</article>

---

Making PowerShell progress bars has always been a handy feature of PowerShell. End users and admins alike love to see that bar progressing just so they know the script is going somewhere. **Write-Progress** is a great tool built into Windows but sometimes you want to hide that black scary screen and surface a beautiful shiny bar of progress that will make your end user oooo and ahhhhh and your PowerShell prowess.

<!-- more -->

What I am going to do over the next few posts is create a decent PowerShell progress bar that will have the following feautures:

1. Update asynchronous from the script (credit goes to Boe Prox[^1] and Rhys W Edwards [^2])
2. Awesome styles (Material Design and MahApps)

[^1]: <http://learn-powershell.net/2012/10/14/powershell-and-wpf-writing-data-to-a-ui-from-a-different-runspace/>
[^2]: <https://gallery.technet.microsoft.com/scriptcenter/New-ProgressBar-8468da5c>

## The Basics

This module will be made up of three cmdlets:

1. **New-ProgressBar** - Used to create a ProgressBar variable attached to progressbar in separaterunspace. Select styling.
2. **Write-ProgressBar** - Used to send progress events to the ProgressBar. _Attempts to modify the variable directly will fail due to runspace security_
3. **Close-ProgressBar** - Used to close out the ProgressBar safely and cleanly to prevent memory issues.

### New-ProgressBar

Let's start with implementing the **New-ProgressBar** cmdlet and see what all that entails. I strongly recommend reading the referenced article from Boe Prox on managing runspaces before continuing (It's short).

In order to have the progress bar run without interrupting the current process we need to create it in a separate runspace.

<pre>
<code class="ps">
    $SyncHash = [hashtable]::Synchronized(@{})
    $newRunspace =[runspacefactory]::CreateRunspace()
    $SyncHash.Runspace = $newRunspace
    $newRunspace.ApartmentState = "STA" 
    $newRunspace.ThreadOptions = "ReuseThread"           
    $newRunspace.Open() 
    $newRunspace.SessionStateProxy.SetVariable("syncHash",$syncHash)
</code>
</pre>

The **$SyncHash** variable is going to be used to manage the progress bar from the current thread as we'll see later in the **Write-Progress** cmdlet.

The next step is to create the command that will run in this alternate runspace which creates a very basic xaml progress bar and adds the elements of the progressbar to the **$SyncHash** for later modificiation.

<pre>
<code class="ps">
    $PowerShellCommand = [PowerShell]::Create().AddScript({    
        [xml]$xaml = @" 
        <Window 
            xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation" 
            xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml" 
            Name="Window" Title="Progress..." WindowStartupLocation = "CenterScreen" 
            Width = "300" Height = "100" ShowInTaskbar = "True"> 
            <StackPanel Margin="20">
               <ProgressBar Name="ProgressBar" Value="40"/>
               <TextBlock Text="{Binding ElementName=ProgressBar, Path=Value, StringFormat={}{0:0}%}" HorizontalAlignment="Center" VerticalAlignment="Center" />
            </StackPanel> 
        </Window> 
"@ 
  
        $reader=(New-Object System.Xml.XmlNodeReader $xaml) 
        $syncHash.Window=[Windows.Markup.XamlReader]::Load( $reader ) 
        #===========================================================================
        # Store Form Objects In PowerShell
        #===========================================================================
        $xaml.SelectNodes("//*[@Name]") | %{ $SyncHash."$($_.Name)" = $SyncHash.Window.FindName($_.Name)}


        $syncHash.Window.ShowDialog() | Out-Null 
        $syncHash.Error = $Error 

    }) 
    $PowerShellCommand.Runspace = $newRunspace 
    $data = $PowerShellCommand.BeginInvoke()
</code>
</pre>

At this point we should have a progress bar running asynchronously in a separate runspace. Now all we have to do is wrap this in a function and return the **$SyncHash** as the result for future modification.

I did, however, just in case someone sent it to the pipeline without storing it in a variable a sort of safeguard to close the runspace if it became orphaned or the progress bar was closed.

<pre>
<code class="ps">
Register-ObjectEvent -InputObject $SyncHash.Runspace `
            -EventName 'AvailabilityChanged' `
            -Action { 
                
                    if($Sender.RunspaceAvailability -eq "Available")
                    {
                        $Sender.Closeasync()
                        $Sender.Dispose()
                    } 
                
                }
</code>
</pre>

This will basically listen for when the availability (typically **busy** while the progress bar is running) to change and if it is **Available** go ahead and close out the runspace and dispose it.

The full function appears here:

<pre>
<code class="ps">
Function New-ProgressBar {
 
    [void][System.Reflection.Assembly]::LoadWithPartialName('presentationframework') 
    $syncHash = [hashtable]::Synchronized(@{})
    $newRunspace =[runspacefactory]::CreateRunspace()
    $syncHash.Runspace = $newRunspace
    $newRunspace.ApartmentState = "STA" 
    $newRunspace.ThreadOptions = "ReuseThread"           
    $newRunspace.Open() 
    $newRunspace.SessionStateProxy.SetVariable("syncHash",$syncHash)           
    $PowerShellCommand = [PowerShell]::Create().AddScript({    
        [xml]$xaml = @" 
        <Window 
            xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation" 
            xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml" 
            Name="Window" Title="Progress..." WindowStartupLocation = "CenterScreen" 
            Width = "300" Height = "100" ShowInTaskbar = "True"> 
            <StackPanel Margin="20">
               <ProgressBar Name="ProgressBar" Value="40"/>
               <TextBlock Text="{Binding ElementName=ProgressBar, Path=Value, StringFormat={}{0:0}%}" HorizontalAlignment="Center" VerticalAlignment="Center" />
            </StackPanel> 
        </Window> 
"@ 
  
        $reader=(New-Object System.Xml.XmlNodeReader $xaml) 
        $syncHash.Window=[Windows.Markup.XamlReader]::Load( $reader ) 
        #===========================================================================
        # Store Form Objects In PowerShell
        #===========================================================================
        $xaml.SelectNodes("//*[@Name]") | %{ $SyncHash."$($_.Name)" = $SyncHash.Window.FindName($_.Name)}


        $syncHash.Window.ShowDialog() | Out-Null 
        $syncHash.Error = $Error 

    }) 
    $PowerShellCommand.Runspace = $newRunspace 
    $data = $PowerShellCommand.BeginInvoke() 
   
    
    Register-ObjectEvent -InputObject $SyncHash.Runspace `
            -EventName 'AvailabilityChanged' `
            -Action { 
                
                    if($Sender.RunspaceAvailability -eq "Available")
                    {
                        $Sender.Closeasync()
                        $Sender.Dispose()
                    } 
                
                } 

    return $SyncHash

}
</code>
</pre>

### Write-ProgressBar

Now to build our starting **Write-ProgressBar** function. To start out we aren't going to want to mess with re-creating every functionality of **Write-Progress**, so we are just going to add the ability to pass in an updated **Activity** which will update the title of the progress bar window and **PercentComplete**.

If you didn't read Boe's article you may have already attempted to update the progressbar using the **$SyncHash** Variable. This will sadly not work. Something about security or something. So what we are going to do is modify the properties in the second runspace by using the dispatcher which is exposed in our **$SyncHash** variable.

<pre>
<code class="ps">
function Write-ProgressBar
{

    Param (
        [Parameter(Mandatory=$true)]
        [System.Object[]]$ProgressBar,
        [Parameter(Mandatory=$true)]
        [String]$Activity,
        [int]$PercentComplete
    ) 
   
   # This updates the control based on the parameters passed to the function 
   $ProgressBar.Window.Dispatcher.Invoke([action]{ 
      
      $ProgressBar.Window.Title = $Activity

   }, "Normal")

   if($PercentComplete)
   {

       $ProgressBar.Window.Dispatcher.Invoke([action]{ 
      
          $ProgressBar.ProgressBar.Value = $PercentComplete

       }, "Normal")

   }

}
</code>
</pre>

### Close-ProgressBar

The **Close-ProgressBar** function is going to be very similar.

<pre>
<code class="ps">
function Close-ProgressBar
{

    Param (
        [Parameter(Mandatory=$true)]
        [System.Object[]]$ProgressBar
    )

    $ProgressBar.Window.Dispatcher.Invoke([action]{ 
      
      $ProgressBar.Window.Close()

    }, "Normal")
 
}
</code>
</pre>

Hope you enjoy! The next posting we will get into replicating the exact functionality of the write-progress function as well as dealing with some of the performance issues you will see when running the below demo. The third we will get into styling our progress bars.

Below is the full code so far and a demo:

## Full Code

<pre>
<code class="ps">

# Function to facilitate updates to controls within the window 
Function New-ProgressBar {
 
    [void][System.Reflection.Assembly]::LoadWithPartialName('presentationframework') 
    $syncHash = [hashtable]::Synchronized(@{})
    $newRunspace =[runspacefactory]::CreateRunspace()
    $syncHash.Runspace = $newRunspace
    $newRunspace.ApartmentState = "STA" 
    $newRunspace.ThreadOptions = "ReuseThread"           
    $newRunspace.Open() 
    $newRunspace.SessionStateProxy.SetVariable("syncHash",$syncHash)           
    $PowerShellCommand = [PowerShell]::Create().AddScript({    
        [xml]$xaml = @" 
        <Window 
            xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation" 
            xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml" 
            Name="Window" Title="Progress..." WindowStartupLocation = "CenterScreen" 
            Width = "300" Height = "100" ShowInTaskbar = "True"> 
            <StackPanel Margin="20">
               <ProgressBar Name="ProgressBar" />
               <TextBlock Text="{Binding ElementName=ProgressBar, Path=Value, StringFormat={}{0:0}%}" HorizontalAlignment="Center" VerticalAlignment="Center" />
            </StackPanel> 
        </Window> 
"@ 
  
        $reader=(New-Object System.Xml.XmlNodeReader $xaml) 
        $syncHash.Window=[Windows.Markup.XamlReader]::Load( $reader ) 
        #===========================================================================
        # Store Form Objects In PowerShell
        #===========================================================================
        $xaml.SelectNodes("//*[@Name]") | %{ $SyncHash."$($_.Name)" = $SyncHash.Window.FindName($_.Name)}


        $syncHash.Window.ShowDialog() | Out-Null 
        $syncHash.Error = $Error 

    }) 
    $PowerShellCommand.Runspace = $newRunspace 
    $data = $PowerShellCommand.BeginInvoke() 
   
    
    Register-ObjectEvent -InputObject $SyncHash.Runspace `
            -EventName 'AvailabilityChanged' `
            -Action { 
                
                    if($Sender.RunspaceAvailability -eq "Available")
                    {
                        $Sender.Closeasync()
                        $Sender.Dispose()
                    } 
                
                } 

    return [System.Collections.Hashtable]$SyncHash

}
 

function Write-ProgressBar
{

    Param (
        [Parameter(Mandatory=$true)]
        [System.Object[]]$ProgressBar,
        [Parameter(Mandatory=$true)]
        [String]$Activity,
        [String]$Status,
        [int]$Id,
        [int]$PercentComplete,
        [int]$SecondsRemaining,
        [String]$CurrentOperation,
        [int]$ParentId,
        [Switch]$Completed,
        [int]$SourceID
    ) 
   
   # This updates the control based on the parameters passed to the function 
   $ProgressBar.Window.Dispatcher.Invoke([action]{ 
      
      $ProgressBar.Window.Title = $Activity

   }, "Normal")

   if($PercentComplete)
   {

       $ProgressBar.Window.Dispatcher.Invoke([action]{ 
      
          $ProgressBar.ProgressBar.Value = $PercentComplete

       }, "Normal")

   }

}


function Close-ProgressBar
{

    Param (
        [Parameter(Mandatory=$true)]
        [System.Object[]]$ProgressBar
    )

    $ProgressBar.Window.Dispatcher.Invoke([action]{ 
      
      $ProgressBar.Window.Close()

    }, "Normal")
 
}
</code>
</pre>

## Demo

_Run this after creating the above functions_

<pre>
<code class="ps">
$ProgressBar = New-ProgressBar

1..100 | foreach {Write-ProgressBar -ProgressBar $ProgressBar -Activity "Counting $_ out of 100" -PercentComplete $_; Start-Sleep -Milliseconds 250}

Close-ProgressBar $ProgressBar
</code>
</pre>
