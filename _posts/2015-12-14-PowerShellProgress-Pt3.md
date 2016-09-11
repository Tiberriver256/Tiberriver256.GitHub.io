---
published: true
layout: post
title: "PowerShell ProgressBar -- Part 3"
description: Adding the details.
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

----

Okay, so we have a progress bar that shows percentage. Big whoop, who cares!? I need all the details! I need to show all the things! Well.... the time has come. Behold, details being added...

## Easy Peasy

At this point, in order to add in a bit of details we need to do the following tasks:
 1. Add a textblock to our XAML underneath the plain old progress bar
 2. Add an update call to the update block triggered by the timer in our previous posting.
 3. Add if statements to our **Write-ProgressBar** cmdlet

The typical **Write-Progress** cmdlet takes the following three parameters and mushes them together, in order, underneath your progressbar:
 1. Status
 2. Seconds Remaining
 3. CurrentOperation

On the cmdlet side it helps to have these split out to make calling the cmdlet easier. On the UI side though it just complicates things unnecessarily, so I simply added a single variable to my **New-ProgressBar** cmdlet called *AdditionalInfo* on my synchash:

<pre> <code class="ps">
$syncHash.AdditionalInfo = ''
</code> </pre>

We add the following textblock code to our XAML to create the label underneath the progress bar:

<pre> <code class="xml">
<TextBlock Name="AdditionalInfoTextBlock" Text="" HorizontalAlignment="Center" VerticalAlignment="Center" />
</code> </pre>

Making all three variables squished into one makes the addition to my update block a single line of code:

<pre> <code class="ps">
$SyncHash.AdditionalInfoTextBlock.Text = $SyncHash.AdditionalInfo
</code> </pre>

Now I add in the addtional parameters to the param section of my **Write-ProgressBar** cmdlet as follows:

<pre> <code class="ps">
        [String]$Status = $Null,
        [int]$SecondsRemaining = $Null,
        [String]$CurrentOperation = $Null
</code> </pre>

My if statements on whether or not to add these parameters and combining them with spacing into the AdditionalInfo paramater looks like this:

<pre> <code class="ps">
if($SecondsRemaining)
   {

       [String]$SecondsRemaining = "$SecondsRemaining Seconds Remaining"

   }
   else
   {

       [String]$SecondsRemaining = $Null

   }

   Write-Verbose -Message "Setting AdditionalInfo to $Status       $SecondsRemaining$(if($SecondsRemaining){ " seconds remaining..." }else {''})       $CurrentOperation"
   $ProgressBar.AdditionalInfo = "$Status       $SecondsRemaining       $CurrentOperation"

</code> </pre>

Now if I run the demo provided at the end of this article we get the following:

<figure>
	<img src="{{ site.url }}/images/PowerProgress/PowerShell ProgressBar.gif">
	<figcaption>Give me alllll the deets!</figcaption>
</figure>

Nice eh!?


# Full Code

<pre> <code class="ps">
Function New-ProgressBar {
 
    [void][System.Reflection.Assembly]::LoadWithPartialName('presentationframework') 
    $syncHash = [hashtable]::Synchronized(@{})
    $newRunspace =[runspacefactory]::CreateRunspace()
    $syncHash.Runspace = $newRunspace
    $syncHash.AdditionalInfo = ''
    $newRunspace.ApartmentState = "STA" 
    $newRunspace.ThreadOptions = "ReuseThread"           
    $data = $newRunspace.Open() | Out-Null
    $newRunspace.SessionStateProxy.SetVariable("syncHash",$syncHash)           
    $PowerShellCommand = [PowerShell]::Create().AddScript({    
        [string]$xaml = @" 
        &lt;Window 
            xmlns=&quot;http://schemas.microsoft.com/winfx/2006/xaml/presentation&quot; 
            xmlns:x=&quot;http://schemas.microsoft.com/winfx/2006/xaml&quot; 
            Name=&quot;Window&quot; Title=&quot;Progress...&quot; WindowStartupLocation = &quot;CenterScreen&quot; 
            Width = &quot;560&quot; Height=&quot;130&quot; SizeToContent=&quot;Height&quot; ShowInTaskbar = &quot;True&quot;&gt; 
            &lt;StackPanel Margin=&quot;20&quot;&gt;
               &lt;ProgressBar Width=&quot;560&quot; Name=&quot;ProgressBar&quot; /&gt;
               &lt;TextBlock Text=&quot;{Binding ElementName=ProgressBar, Path=Value, StringFormat={}{0:0}%}&quot; HorizontalAlignment=&quot;Center&quot; VerticalAlignment=&quot;Center&quot; /&gt;
               &lt;TextBlock Name=&quot;AdditionalInfoTextBlock&quot; Text=&quot;&quot; HorizontalAlignment=&quot;Center&quot; VerticalAlignment=&quot;Center&quot; /&gt;
            &lt;/StackPanel&gt; 
        &lt;/Window&gt;
"@ 
   
        $syncHash.Window=[Windows.Markup.XamlReader]::parse( $xaml ) 
        #===========================================================================
        # Store Form Objects In PowerShell
        #===========================================================================
        ([xml]$xaml).SelectNodes("//*[@Name]") | %{ $SyncHash."$($_.Name)" = $SyncHash.Window.FindName($_.Name)}

        $updateBlock = {            
            
            $SyncHash.Window.Title = $SyncHash.Activity
            $SyncHash.ProgressBar.Value = $SyncHash.PercentComplete
            $SyncHash.AdditionalInfoTextBlock.Text = $SyncHash.AdditionalInfo
            #$SyncHash.Window.MinWidth = $SyncHash.Window.ActualWidth
                       
        }

        ############### New Blog ##############
        $syncHash.Window.Add_SourceInitialized( {            
            ## Before the window's even displayed ...            
            ## We'll create a timer            
            $timer = new-object System.Windows.Threading.DispatcherTimer            
            ## Which will fire 4 times every second            
            $timer.Interval = [TimeSpan]"0:0:0.01"            
            ## And will invoke the $updateBlock            
            $timer.Add_Tick( $updateBlock )            
            ## Now start the timer running            
            $timer.Start()            
            if( $timer.IsEnabled ) {            
               Write-Host "Clock is running. Don't forget: RIGHT-CLICK to close it."            
            } else {            
               $clock.Close()            
               Write-Error "Timer didn't start"            
            }            
        } )

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
                
                } | Out-Null

    return $syncHash

}

function Write-ProgressBar
{

    Param (
        [Parameter(Mandatory=$true)]
        $ProgressBar,
        [Parameter(Mandatory=$true)]
        [String]$Activity,
        [int]$PercentComplete,
        [String]$Status = $Null,
        [int]$SecondsRemaining = $Null,
        [String]$CurrentOperation = $Null
    ) 
   
   Write-Verbose -Message "Setting activity to $Activity"
   $ProgressBar.Activity = $Activity

   if($PercentComplete)
   {
       
       Write-Verbose -Message "Setting PercentComplete to $PercentComplete"
       $ProgressBar.PercentComplete = $PercentComplete

   }
   
   if($SecondsRemaining)
   {

       [String]$SecondsRemaining = "$SecondsRemaining Seconds Remaining"

   }
   else
   {

       [String]$SecondsRemaining = $Null

   }

   Write-Verbose -Message "Setting AdditionalInfo to $Status       $SecondsRemaining$(if($SecondsRemaining){ " seconds remaining..." }else {''})       $CurrentOperation"
   $ProgressBar.AdditionalInfo = "$Status       $SecondsRemaining       $CurrentOperation"

}

function Close-ProgressBar
{

    Param (
        [Parameter(Mandatory=$true)]
        [System.Object[]]$ProgressBar
    )

    $ProgressBar.Window.Dispatcher.Invoke([action]{ 
      
      $ProgressBar.Window.close()

    }, "Normal")
 
}
</code> </pre>

# Demo

<pre> <code class="ps">

$ProgressBar = New-ProgressBar

Measure-Command -Expression {
    $Files = dir $env:USERPROFILE -Recurse
    $i = 0
    $Files | foreach {
    
                        $i++
                        Start-Sleep -Milliseconds 10
    
                        Write-ProgressBar `
                                -ProgressBar $ProgressBar `
                                -Activity "Viewing Files" `
                                -PercentComplete (($i/$Files.count) * 100) `
                                -CurrentOperation $_.FullName `
                                -Status $_.Name `
                                -SecondsRemaining (100 - $_.count)
                     }
}

</code> </pre>