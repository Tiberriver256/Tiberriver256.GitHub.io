---
published: true
layout: post
title: "PowerShell ProgressBar -- Part 2"
description: Performance Tuning asynchronous XAML and runspaces.
modified: 2015-12-09
tags:
  - PowerShell
  - ProgressBar
categories:
  - PowerShell
---

## The Series

<article>
    <ul>
        {% for post in site.tags["ProgressBar"] reversed%}{% if post.title != null %}
            <li class="entry-title"><a href="{{ site.url }}{{ post.url }}" title="{{ post.title }}">{{ post.title }}</a></li>
        {% endif %}{% endfor %}
    </ul>
</article>

---

Welcome back for more fun with PowerShell and XAML ProgressBars! Today we are going to tackle performance tuning all on it's own.

## The Problem

If you attempted to run the demo at the end of [PowerShell ProgressBar -- Part 1](tiberriver256.github.io/powershell/PowerShellProgress-Pt1/ "PowerShell ProgressBar -- Part 1"), and you were sneaky enough to remove my **Start-Sleep** cmdlet you may have noticed that the performance is AWFUL!

<!-- more -->

Here are the stats just running the following progress bar demo code (**Start-Sleep** removed):

```powershell
1..100 | foreach {Write-ProgressBar -ProgressBar $ProgressBar -Activity "Counting $_ out of 100" -PercentComplete $_ }
```

<figure>
    {% include image.html path="SlowPerformance.JPG" %}
	<figcaption>50 seconds to count to 100!</figcaption>
</figure>

50 seconds just to count to 100 is a lot of overhead to a script just to add a progress bar. In most cases end users want speed over shininess so we are going to need to fix this.

##The Solution
Doing a quick Google search turned up the fact that other people had experienced the same issue when using dispatcher.invoke[^1] it turns out this is because dispatcher.invoke is thread blocking (i.e. your script has to wait for the invoke function, which has quite a bit of overhead, to complete before it will continue).

Turns out the there are a few other non-threadblocking methods for updating your GUI. I chose to use something called the dispatchertimer because of this dandy article[^2] and a sweet simple demo from Richard Siddaway[^3].

What the dispatchertimer allows us to do is tell our GUI to run some code on a set interval. So, I want my GUI to update every ten milliseconds to reflect the properties on my **$Synchash** and this should dramatically increase our performance.

So, to walk it through. We added a property for the activity and a property to for the percentcomplete to our **$Synchash**

```powershell
$syncHash.Activity = ''
$syncHash.PercentComplete = 0
```

We then created a scriptblock to that we wanted to run at the set interval which will update the GUI.

```powershell
$updateBlock = {            
            
    $SyncHash.Window.Title = $SyncHash.Activity
    $SyncHash.ProgressBar.Value = $SyncHash.PercentComplete
                       
 }
```

Then we will create the dispatchtimer which will call the code and set the interval to be 10 milliseconds.

```powershell

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

```

This makes my **Write-ProgressBar** cmdlet as simple as changing a property on the variable.

```powershell

function Write-ProgressBar
{

    Param (
        [Parameter(Mandatory=$true)]
        $ProgressBar,
        [Parameter(Mandatory=$true)]
        [String]$Activity,
        [int]$PercentComplete
    ) 
   
   $ProgressBar.Activity = $Activity

   if($PercentComplete)
   {
      
       $ProgressBar.PercentComplete = $PercentComplete

   }

}

```

The end results in performance are... Drumroll please!!!

<figure>
	{% include image.html path="RockinPerformance.JPG" %}
	<figcaption>68 milliseconds to complete the same code!</figcaption>
</figure>

## Full Code

```powershell

Function New-ProgressBar {
 
    [void][System.Reflection.Assembly]::LoadWithPartialName('presentationframework') 
    $syncHash = [hashtable]::Synchronized(@{})
    $newRunspace =[runspacefactory]::CreateRunspace()
    $syncHash.Runspace = $newRunspace
    $syncHash.Activity = ''
    $syncHash.PercentComplete = 0
    $newRunspace.ApartmentState = "STA" 
    $newRunspace.ThreadOptions = "ReuseThread"           
    $data = $newRunspace.Open() | Out-Null
    $newRunspace.SessionStateProxy.SetVariable("syncHash",$syncHash)           
    $PowerShellCommand = [PowerShell]::Create().AddScript({    
        [xml]$xaml = @" 
        &lt;Window 
            xmlns=&quot;http://schemas.microsoft.com/winfx/2006/xaml/presentation&quot; 
            xmlns:x=&quot;http://schemas.microsoft.com/winfx/2006/xaml&quot; 
            Name=&quot;Window&quot; Title=&quot;Progress...&quot; WindowStartupLocation = &quot;CenterScreen&quot; 
            Width = &quot;300&quot; Height = &quot;100&quot; ShowInTaskbar = &quot;True&quot;&gt; 
            &lt;StackPanel Margin=&quot;20&quot;&gt;
               &lt;ProgressBar Name=&quot;ProgressBar&quot; /&gt;
               &lt;TextBlock Text=&quot;{Binding ElementName=ProgressBar, Path=Value, StringFormat={}{0:0}%}&quot; HorizontalAlignment=&quot;Center&quot; VerticalAlignment=&quot;Center&quot; /&gt;
            &lt;/StackPanel&gt; 
        &lt;/Window&gt; 
"@ 
  
        $reader=(New-Object System.Xml.XmlNodeReader $xaml) 
        $syncHash.Window=[Windows.Markup.XamlReader]::Load( $reader ) 
        #===========================================================================
        # Store Form Objects In PowerShell
        #===========================================================================
        $xaml.SelectNodes("//*[@Name]") | %{ $SyncHash."$($_.Name)" = $SyncHash.Window.FindName($_.Name)}

        $updateBlock = {            
            
            $SyncHash.Window.Title = $SyncHash.Activity
            $SyncHash.ProgressBar.Value = $SyncHash.PercentComplete
                       
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
        [int]$PercentComplete
    ) 
   
   $ProgressBar.Activity = $Activity

   if($PercentComplete)
   {
      
       $ProgressBar.PercentComplete = $PercentComplete

   }

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

```

## Demo

```powershell
 #Put a Start-Sleep back in if you actually want to see the progress bar up.
$ProgressBar = New-ProgressBar
Measure-Command -Expression {
    1..100 | foreach {Write-ProgressBar -ProgressBar $ProgressBar -Activity "Counting $_ out of 100" -PercentComplete $_}
}
Close-ProgressBar $ProgressBar

```

[^1]: <https://social.msdn.microsoft.com/Forums/vstudio/en-US/080f7b59-38ec-4a45-944d-e538b08f525b/why-is-the-dispatcher-so-slow?forum=wpf>
[^2]: <http://jkshay.com/implementing-the-net-dispatchertimer/>
[^3]: <https://richardspowershellblog.wordpress.com/2011/07/07/a-powershell-clock/>
