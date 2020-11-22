---
published: true
layout: post
title: 'PowerShell ProgressBar -- Part 4'
description: XAML Templates -- Material Design.
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

Alright, so we have the details lined out that we want to see. We have decent performance so we know our progress bar is not going to crash anyones system or slow our awesome sauce PowerShell scripts down. Now what?

It looks decent, how about let's make it look good and add a few color options? Seems like a complicated task right? Enter... XAML templates.

## XAML Templates

<!-- more -->

So, one of the reason I love hacking stuff together in HTML is that you can Google for 5 seconds and find a million awesome looking css frameworks that you can <LINK href=> into your page and it makes you look like you are good with colors or something like that.

The same thing exists (although not quite as prevalent) in XAML.You can spec out designs for a XAML textbox, save that as a separate xaml, reference it at the beginning of your XAML and it automagically makes copies in the styling that you defined previously [(MSDN Walkthrough)](<https://msdn.microsoft.com/en-us/library/cc189093(VS.95).aspx> 'Customizing the Appearance of an Existing Control by Using a ControlTemplate').

Does this mean I made my own XAML templates? Heck no. There are free ones out there that are way better than anything I could ever come up with.

If you have not heard of Material Design yet, it is a design spec published by Google you can read about here[^1]. Basically Google sharing with us lower peeps what good looks like. Let's take a look and see what it takes to apply ButchersBoy's Material Design in XAML Toolkit[^2] to our progressbar.

[^1]: https://www.google.com/design/spec/material-design/introduction.html
[^2]: http://materialdesigninxaml.net/

## Adding in the magic

### Step 1 -- Import DLLs

You can download the compiled DLLs for his project from the github source page [here (1.68 MB)](https://github.com/ButchersBoy/MaterialDesignInXamlToolkit/releases/download/v1.1.0/MaterialDesignThemes1_1_net40.zip '.NET 4.0 compatible'). The latest build he has posted there requires .NET 4.5. It does some cool stuff but we don't need super duper fancy for our progress bars, so I went with backwards compatibility.

Unzip the DLLs into the folder of your choice and then import them using the **Import-Module** cmdlet as follows (Make sure to unblock them first):

<pre> <code class="ps">
Import-Module .\src\MaterialDesignColors.dll -ErrorAction Stop
Import-Module .\src\MaterialDesignThemes.Wpf.dll -ErrorAction Stop
</code> </pre>

### Step 2 - Referencing the Resource Dictionaries

Now, per ButchersBoy's getting started guide[^3], we need to add the proper resource dictionaries to our prior XAML code. Resource dictionaries, in case you haven't read the MSDN article above (_and you should_), are similar to css libraries in my mind. They hold the magic styling sauce for your XAML GUI.

[^3]: https://github.com/ButchersBoy/MaterialDesignInXamlToolkit/wiki/Getting-Started

Since my top level element is Window, I want to add the resource dictionaries into the following XML block:

{% highlight xml %}
<Window.Resources>
<ResourceDictionary>
<ResourceDictionary.MergedDictionaries>

                            #####
                            [Insert dictionary references here]
                            #####

                            </ResourceDictionary.MergedDictionaries>
                        </ResourceDictionary>
                    </Window.Resources>

{% endhighlight %}

He has a lot of dictionaries for us to choose from. We can choose either a dark or light theme by using the following line. I picked the Dark theme:

{% highlight xml %}
<ResourceDictionary Source="pack://application:,,,/MaterialDesignThemes.Wpf;component/Themes/MaterialDesignTheme.Dark.xaml" />
{% endhighlight %}

Then we add the default xaml file in:

{% highlight xml %}
<ResourceDictionary Source="pack://application:,,,/MaterialDesignThemes.Wpf;component/Themes/MaterialDesignTheme.Defaults.xaml" />
{% endhighlight %}

Then we pick our primary and accent colors. I picked blue for my primary and lightblue for my accent. You can see the full list of colors [here](https://github.com/ButchersBoy/MaterialDesignInXamlToolkit/tree/master/MaterialDesignColors.Wpf/Themes/Recommended).

{% highlight xml %}
<ResourceDictionary Source="pack://application:,,,/MaterialDesignColors;component/Themes/Recommended/Primary/MaterialDesignColor.Blue.xaml" />
<ResourceDictionary Source="pack://application:,,,/MaterialDesignColors;component/Themes/Recommended/Accent/MaterialDesignColor.LightBlue.xaml" />
{% endhighlight %}

Lastly we add in some extra properties to the Window element as follows:

{% highlight xml %}
<Window [...]
TextElement.Foreground="{DynamicResource MaterialDesignBody}"
Background="{DynamicResource MaterialDesignPaper}"
TextElement.FontWeight="Medium"
TextElement.FontSize="14"
FontFamily="pack://application:,,,/MaterialDesignThemes.Wpf;component/Resources/Roboto/#Roboto"
[...] >
{% endhighlight %}

That's it! Now re-run the script from last week and it will look like this:

<figure>
	<video autoplay muted loop playsinline src="{{ site.url }}/images/PowerProgress/PowerShell ProgressBar - Material Design 1.mp4">
	<figcaption>Behold Material Design in PowerShell</figcaption>
</figure>

Sweet! Now... what about one of those fancy circle progress bars? Wouldn't that be cool? Well... turns out... now that we have our framework in place all we have to change is our progress bar XAML line to look like this:

{% highlight xml %}
<ProgressBar Style="{StaticResource MaterialDesignCircularProgressBar}" Height="560" Width="560" Name="ProgressBar" />
{% endhighlight %}

Adjust the width on your window to be 630 to fit the width of the circular progressbar and voila!

<figure>
	<video autoplay muted loop playsinline src="{{ site.url }}/images/PowerProgress/PowerShell ProgressBar - Material Design 2.mp4">
	<figcaption>Behold Material Design Circlular Progress Bars in PowerShell</figcaption>
</figure>

That wasn't so bad right? Now, it's still way too much work to edit and discover all that's out there so with anything let's build it into our function.

### Step 3 - Building dynamic XAML with PowerShell herestrings

There are three different methods we could use for building out the necessary XAML to cover all possible variations of the xaml we have just looked at:

1.  We could statically type out all of the possibilities, save them as individual XAML and then import them using something like the following:

<pre> <code class="ps">
$xaml = Get-Content ".\src\$Theme_$Color_$ProgressBarStyle_$SizeVariation.xaml"
</code> </pre>

<ol start="2">
  <li>We could use the build the string as you go method with something like the following:</li>
</ol>

<pre> <code class="ps">
$xaml = @"
&lt;Window 
            xmlns=&quot;http://schemas.microsoft.com/winfx/2006/xaml/presentation&quot; 
            xmlns:x=&quot;http://schemas.microsoft.com/winfx/2006/xaml&quot; 
            Name=&quot;Window&quot; Title=&quot;Progress...&quot; WindowStartupLocation = &quot;CenterScreen&quot; 
            Width = &quot;630&quot; Height=&quot;130&quot; SizeToContent=&quot;Height&quot; ShowInTaskbar = &quot;True&quot;
            TextElement.Foreground=&quot;{DynamicResource MaterialDesignBody}&quot;
            Background=&quot;{DynamicResource MaterialDesignPaper}&quot;
            TextElement.FontWeight=&quot;Medium&quot;
            TextElement.FontSize=&quot;14&quot;
            FontFamily=&quot;pack://application:,,,/MaterialDesignThemes.Wpf;component/Resources/Roboto/#Roboto&quot;&gt; 
            
            &lt;Window.Resources&gt;
                &lt;ResourceDictionary&gt;
                    &lt;ResourceDictionary.MergedDictionaries&gt;
"@

if($Theme -eq "Dark")
{
    $xaml += '<ResourceDictionary Source="pack://application:,,,/MaterialDesignThemes.Wpf;component/Themes/MaterialDesignTheme.Dark.xaml" />'
}
</code> </pre>

<ol start="3">
  <li>We could use dynamically created here-strings.</li>
</ol>

How do we dynamically create a "here-string"? There are two types of here-strings ([Read up on them here](https://technet.microsoft.com/en-us/library/ee692792.aspx 'Windows PowerShell Tip: Using Windows PowerShell Here-Strings')).

1.  Those that start with @" and end with "@
2.  Those that start with @' and end with '@

The first type will expand any variables inside the here-string ([More on Variable Expansion in Strings](http://blogs.msdn.com/b/powershell/archive/2006/07/15/variable-expansion-in-strings-and-herestrings.aspx 'Variable Expansion in Strings')). The second will not. This means if we put an expression inside the here-string it will execute the expression and return the results directly into the string you are creating. So if I wanted to only add special properties to the window XAML element if someone uses a **-MaterialDesign** switch I could type a here-string like the following:

<pre> <code class="ps">
$syncHash.XAML = @" 
        &lt;Window 
            xmlns=&quot;http://schemas.microsoft.com/winfx/2006/xaml/presentation&quot; 
            xmlns:x=&quot;http://schemas.microsoft.com/winfx/2006/xaml&quot; 
            Name=&quot;Window&quot; Title=&quot;Progress...&quot; WindowStartupLocation = &quot;CenterScreen&quot; 
            Width = &quot;560&quot;
            $(
                if($MaterialDesign)
                {
                    @&apos;
                        TextElement.Foreground=&quot;{DynamicResource MaterialDesignBody}&quot;
                        Background=&quot;{DynamicResource MaterialDesignPaper}&quot;
                        TextElement.FontWeight=&quot;Medium&quot;
                        TextElement.FontSize=&quot;14&quot;
                        FontFamily=&quot;pack://application:,,,/MaterialDesignThemes.Wpf;component/Resources/Roboto/#Roboto&quot;
    &apos;@
                }
            )
            &gt;
"@
</code> </pre>

The middle string only gets added if the switch is present. This does make the code a bit more difficult to read but, for me at least, speeds up the development process and is a little bit of a personal preference.

I was able to code out a full function **New-ProgressBar** in a pretty short time that gives all the possible options and I think it is decently maintainable as long as you know how here-strings work.

Check it out!

<figure>
	<video autoplay muted loop playsinline src="{{ site.url }}/images/PowerProgress/PowerShell ProgressBar - Material Design 3.mp4">
	<figcaption>Behold Material Design Circlular Progress Bars in PowerShell</figcaption>
</figure>

The full code is getting pretty long to post right here so I threw it up on GitHub to [download](https://github.com/Tiberriver256/PoshProgressBar 'PoshProgressBar').

## Demo

Don't forget to change the file path of the **Import-Module** function in the **New-ProgressBar** function to match the location of your [downloaded DLLs (Reference Step 1 of this blog posting)](https://github.com/ButchersBoy/MaterialDesignInXamlToolkit/releases/download/v1.1.0/MaterialDesignThemes1_1_net40.zip '.NET 4.0 compatible') otherwise it will default to using the basic styling.

<pre> <code class="ps">
$Files = dir $env:USERPROFILE -Recurse


$ProgressBars = @()

$ProgressBars += New-ProgressBar -MaterialDesign -IsIndeterminate $true -Type Circle -PrimaryColor Green -AccentColor DeepPurple -Size Large -Theme Dark
$ProgressBars += New-ProgressBar -MaterialDesign -Type Horizontal -PrimaryColor Red -AccentColor LightBlue -Size Medium -Theme Light
$ProgressBars += New-ProgressBar -MaterialDesign -Type Vertical -PrimaryColor Amber -AccentColor DeepOrange -Size Large -Theme Dark
$ProgressBars += New-ProgressBar -MaterialDesign -Type Circle -PrimaryColor Blue -AccentColor Cyan -Size Small -Theme Light

Start-Sleep -Seconds 2

$i = 0
foreach ($File in $Files) { 
                    $i++
                    Start-Sleep -Milliseconds 2
                    foreach ($ProgressBar in $ProgressBars) {
    
    
                        Write-ProgressBar `
                                -ProgressBar $ProgressBar `
                                -Activity "Viewing Files" `
                                -PercentComplete (($i/$Files.count) * 100) `
                                -CurrentOperation $File.FullName `
                                -Status $File.Name `
                                -SecondsRemaining ($Files.Count - $i)

                    }

                }
</code> </pre>
