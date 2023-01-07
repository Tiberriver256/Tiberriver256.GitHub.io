---
published: true
layout: post
title: "WPF WebBrowser / ObjectForScripting / Execute PowerShell... a possibly excellent app framework."
description: Part 4 of 3 in a blog series about building PowerShell GUIs using HTML and javascript.
modified: 2016-09-10
tags:
  - PowerShell
  - GUI
  - HTML
  - ObjectForScripting
categories:
  - PowerShell
  - GUI
  - HTML
---

## The Series

<article>
    <ul>
        {% for post in site.tags["HTML"] reversed %}{% if post.title != null %}
            <li class="entry-title"><a href="{{ site.url }}{{ post.url }}" title="{{ post.title }}">{{ post.title }}</a></li>
        {% endif %}{% endfor %}
    </ul>
</article>

Okay, so about 5 months ago I wrote a blog post on a potential method of executing PowerShell from a user interface built in HTML and javascript. It turns out that the series was one of the more popular ones I have posted and it consistently receives traffic.

## The Problem

I did not really love my other method. It was just the only method I had found. The problems were:

- Complex to learn (build a server, build a client, learn HTTP methods)
- Possible security concerns (even though we were only listening on localhost a user could potentially gain access to another user session and execute code as a different user)

<!-- more -->

## A MUCH Better method

So, this still is not cross-platform. I would still like to investigate ElectronJS and AppJS to see if integration with PowerShell would be easy to achieve and thus provide a method of making cross-platform apps using PowerShell, HTML and JavaScript but this will work for now on Windows devices and is pretty slick in my opinion.

## Step 1 - Create a WPF web browser

<pre> <code class="ps">
[xml]$xaml = @"
   &lt;Window
        xmlns=&quot;http://schemas.microsoft.com/winfx/2006/xaml/presentation&quot;
        Title=&quot;$Title&quot; Height=&quot;500&quot; Width=&quot;700&quot;&gt;
        &lt;Grid&gt;
            &lt;DockPanel&gt;
                &lt;WebBrowser Name=&quot;WebBrowser&quot; DockPanel.Dock=&quot;Top&quot; Margin=&quot;30&quot;&gt;
                &lt;/WebBrowser&gt;
            &lt;/DockPanel&gt;
        &lt;/Grid&gt;
    &lt;/Window&gt;
"@

# Read XAML
$reader=(New-Object System.Xml.XmlNodeReader $xaml)
$Form=[Windows.Markup.XamlReader]::Load( $reader )

$WebBrowser = $Form.FindName("WebBrowser")
</code> </pre>

## Step 2 - Create a C# class that is COMVisible for executing PowerShell

Okay, so this part was a little scary to figure out but it shouldn't be too hard to figure out if you have been in the PowerShell space for awhile or tinkering with PowerShell v5 Classes. Basically we want something that will execute PowerShell code and that is ComVisible.

<pre> <code class="ps">

Add-Type -TypeDefinition @&quot;
    using System.Text;
    using System.Runtime.InteropServices;

    //Add For PowerShell Invocation
    using System.Collections.ObjectModel;
    using System.Management.Automation;
    using System.Management.Automation.Runspaces;

    [ComVisible(true)]
    public class PowerShellHelper
    {

        Runspace runspace;

        public PowerShellHelper()
        {

            runspace = RunspaceFactory.CreateRunspace();
            runspace.Open();

        }

        public string InvokePowerShell(string cmd)
        {
            //Init stuff
            RunspaceInvoke scriptInvoker = new RunspaceInvoke(runspace);
            Pipeline pipeline;

            pipeline = runspace.CreatePipeline();

            //Add commands
            pipeline.Commands.AddScript(cmd);

            Collection&lt;PSObject&gt; results = pipeline.Invoke();

            //Convert records to strings
            StringBuilder stringBuilder = new StringBuilder();
            foreach (PSObject obj in results)
            {
                stringBuilder.Append(obj);
            }

            return stringBuilder.ToString();

     }

    }
&quot;@ -ReferencedAssemblies @(&quot;System.Management.Automation&quot;,&quot;Microsoft.CSharp&quot;)

</code> </pre>

## Step 3 - (The magic part) Add a new PowerShellHelper Object as the ObjectForScripting on the WPF browser

<pre> <code class="ps">
    $WebBrowser.ObjectForScripting = [PowerShellHelper]::new()
</code> </pre>

## Step 4 - Run PowerShell code from HTML

<pre> <code class="ps">
$HTML = @'
&lt;div id=&quot;results&quot;&gt;Loading processes..&lt;/div&gt;

&lt;script&gt;
    function updateProcesses()
    {

        var HTMLProcessesFromPowerShell = window.external.InvokePowerShell(&quot;Get-Process | select name, id | convertTo-HTML&quot;);

        document.getElementById(&quot;results&quot;).innerHTML = HTMLProcessesFromPowerShell;

    }
    updateProcesses();
&lt;/script&gt;
'@

$WebBrowser.NavigateToString($HTML)

# ===========================================================================
# Shows the form
# ===========================================================================
write-host "To show the form, run the following" -ForegroundColor Cyan
$Form.ShowDialog() | out-null
</code> </pre>

The result:

<figure>
 <img src="{{ site.url }}/images/PowerShell-HTML.png">
</figure>

Sweet! Now we have a simple method of executing PowerShell from HTML that does not require a server or require knowledge of HTTP. This code executes synchronously just like a good old HTA would have with your vbscript so the GUI will lock up while the code is running. [If you want to play around with one that executes asynchronously and executes a javascript function with the results when the PowerShell script is finished running you can check out my gist here](https://gist.github.com/Tiberriver256/304dc314b0260cb1c24b9b4781b1a707). The c# code is a bit more complicated there though. I may blog through this at a later date and possibly package it up as a module.

It might be nice to be able to wrap this up as something like **Invoke-PSHTA -FilePath C:\MyHTMLApp.html** right?

Let me know in the comments what you think of this method. I appreciate the read!

# More Reading

- [WPF WebBrowser ObjectForScripting](https://blogs.msdn.microsoft.com/wpf/2011/05/27/how-does-wpf-webbrowser-control-handle-window-external-notify/)
