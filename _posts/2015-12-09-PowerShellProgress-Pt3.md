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

{% highlight powershell %}
$syncHash.AdditionalInfo = ''
{% endhighlight %}

We add the following textblock code to our XAML to create the label underneath the progress bar:

{% highlight xml %}
<TextBlock Name="AdditionalInfoTextBlock" Text="" HorizontalAlignment="Center" VerticalAlignment="Center" />
{% endhighlight %}

Making all three variables squished into one makes the addition to my update block a single line of code:

{% highlight powershell %}
$SyncHash.AdditionalInfoTextBlock.Text = $SyncHash.AdditionalInfo
{% endhighlight %}

Now I add in the addtional parameters to the param section of my **Write-ProgressBar** cmdlet as follows:

{% highlight powershell %}
        [String]$Status = $Null,
        [int]$SecondsRemaining = $Null,
        [String]$CurrentOperation = $Null
{% endhighlight %}

My if statements on whether or not to add these parameters and combining them with spacing into the AdditionalInfo paramater looks like this:

{% highlight powershell %}
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

{% endhighlight %}

Now if I run the demo provided at the end of this article we get the following:

<figure>
	<img src="{{ site.url }}/images/PowerProgress/TheDetails.JPG">
	<figcaption>Give me alllll the deets!</figcaption>
</figure>

Nice eh!?