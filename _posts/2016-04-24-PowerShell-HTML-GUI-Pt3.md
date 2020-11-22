---
published: true
layout: post
title: 'PowerShell GUI with HTML - Part 3'
description: Part 3 of 3 in a blog series about building PowerShell GUIs using HTML and javascript.
modified: {}
tags:
  - PowerShell
  - GUI
  - HTML
categories:
  - PowerShell
  - GUI
  - HTML
---

## The Series

<article>
    <ul>
        {% for post in site.tags["HTML"] %}{% if post.title != null %}
            <li class="entry-title"><a href="{{ site.url }}{{ post.url }}" title="{{ post.title }}">{{ post.title }}</a></li>
        {% endif %}{% endfor %}
    </ul>
</article>

If you have been following along with the previous two parts to this blog, I know what you have been saying. _When will we get to the GUI part!_ Everything up to this point has been all web servers and web technology. Which could come in handy but we just want to make a simple GUI in HTML that runs PowerShell. The browser thing is cool but you don't want to pop open a browser every time you want to run some scripts. Integrating that into the pipeline would be difficult too right?

Today, we finally get to the good stuff!

<!-- more -->

# Step 1 - Build our own web browser (and just not tell people it is a browser)

So, what if we take the code just below which launches a super simple XAML GUI with just a webbrowser object in it, in another runspace immediately before we run our code from the last post.

<pre> <code class="ps">
    Start-Sleep -Seconds 15
    [void][System.Reflection.Assembly]::LoadWithPartialName('presentationframework')
    [xml]$XAML = @'
    &lt;Window
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="PowerShell HTML GUI" WindowStartupLocation="CenterScreen"&gt;

            &lt;WebBrowser Name="WebBrowser"&gt;&lt;/WebBrowser&gt;

    &lt;/Window&gt;
'@

    #Read XAML
    $reader=(New-Object System.Xml.XmlNodeReader $xaml) 
    $Form=[Windows.Markup.XamlReader]::Load( $reader )
    #===========================================================================
    # Store Form Objects In PowerShell
    #===========================================================================
    $WebBrowser = $Form.FindName("WebBrowser")

    $WebBrowser.Navigate("http://localhost:8000/")

    $Form.ShowDialog()
</code> </pre>

Voila! We have our own PowerShell web browser displaying our simple form but doesn't look anything like a web browser! It looks like a regular old windows desktop application.

<figure>
	<img src="{{ site.url }}/images/PowerShellHTMLGUI.png">
</figure>

Now with this we can do some pretty amazing things but we still have a few problems to solve.

### How do we know when to shut down the web server?

If you were just going to get a single request from the browser you can close it as soon as you receive and process the request from the browser. If not you can simply build in a URL that will stop the server for example:

<pre> <code class="ps">
while($SimpleServer.IsListening)
{

    $Context = $SimpleServer.GetContext()

    # Creating a friendly way to shutdown the server
    if($Context.Request.Url.LocalPath -eq "/kill")
    {

                $Context.Response.Close()
                $SimpleServer.Stop()
                break

    }
    
    ...

}
</code> </pre>

### How do I eliminate the Start-Sleep and launch my GUI as soon as the server is ready?

You may come up with your own better method for doing this but I came up with this little function. Which will continually attempt to access the URL until it gets a response and then it will continue to load the xaml:

<pre> <code class="ps">
function Wait-ServerLaunch
{

    try {
        $url="http://localhost:8000/"
        $Test = New-Object System.Net.WebClient
        $Test.DownloadString($url);
    }
    catch
    { start-sleep -Seconds 1; Wait-ServerLaunch }

}
</code> </pre>

### How do I hide the PowerShell window so end users won't know it is there?

You would obviously want your PowerShell console showing when you are debugging but if you are using your script client-side you may not want them to know that it is there. DexterPosh had a great post on this awhile back. [Check it out here](http://www.dexterposh.com/2014/09/powershell-wpf-gui-hide-use-background.html).

### How do I include modern web technologies in this GUI? It seem to work in IE8 by default.

To make your GUI look pretty using magic like [materializecss](http://materializecss.com/) or [Office UI Fabric](http://dev.office.com/fabric/) you need the following meta tag in the header of your HTML:

{% highlight html %}

<meta http-equiv="X-UA-Compatible" content="IE=edge" />
{% endhighlight %}

This will force it to use IE Edge. For more information on that magic line see [here](<https://msdn.microsoft.com/en-us/library/jj676915(v=vs.85).aspx>).

### How do I build a complete UI that collects input and returns / displays results using the UI?

Here is my code for this solution. A usage example would be like this:

<pre> <code class="ps">
Start-PoshWebGUI -ScriptBlock {
    
    $Parameters = $Context.Request.QueryString

    switch ($Context.Request.Url.LocalPath)
    {

        "/showProcesses" { "&lt;a href='/'&gt;Main Menu&lt;/a&gt;&lt;form action='/filterProcesses'&gt;Filter:&lt;input Name='Name'&gt;&lt;/input&gt;&lt;/form&gt;$(Get-Process | select cpu,name | ConvertTo-Html -Fragment | Out-String)" }
        "/filterProcesses" { "&lt;a href='/'&gt;Main Menu&lt;/a&gt;&lt;form action='/filterProcesses'&gt;Filter:&lt;input Name='Name'&gt;&lt;/input&gt;&lt;/form&gt;$(Get-Process $Parameters["Name"] | select cpu, name | ConvertTo-Html -Fragment | Out-String)" }
        "/showServices" { "&lt;a href='/'&gt;Main Menu&lt;/a&gt;&lt;form action='/filterServices'&gt;Filter:&lt;input Name='Name'&gt;&lt;/input&gt;&lt;/form&gt;$(Get-Service | select Status,Name,DisplayName | ConvertTo-Html -Fragment | Out-String)" }
        "/filterServices" { "&lt;a href='/'&gt;Main Menu&lt;/a&gt;&lt;form action='/filterServices'&gt;Filter:&lt;input Name='Name'&gt;&lt;/input&gt;&lt;/form&gt;$(Get-Service $Parameters["Name"] | select Status,Name,DisplayName | ConvertTo-Html -Fragment | Out-String)" }
        
        default { @"
&lt;h1&gt;My Simple Task Manager&lt;/h1&gt;
&lt;a href="/showProcesses"&gt;&lt;h2&gt;Show Running Processes&lt;/h2&gt;&lt;/a&gt;
&lt;a href="/showServices"&gt;&lt;h2&gt;Show Running Services&lt;/h2&gt;&lt;/a&gt;      
"@
         }

    }

}
</code> </pre>

A not too bad chunk of code and we get this:

<figure>
	<video autoplay muted loop playsinline src="{{ site.url }}/images/PowerShellHTMLGUI.mp4">
</figure>

Awesome Right!

### Full code for _Start-PoshWebGUI_

\*NOTE: I do plan on putting this into a module fairly soon hopefully with help and examples. If you want to help out hit me up or fork [the repo on GitHub](https://github.com/Tiberriver256/New-PoshWebGUI).

<pre> <code class="ps">
Function Start-PoshWebGUI ($ScriptBlock)
{
    # We create a scriptblock that waits for the server to launch and then opens a web browser control
    $UserWindow = {
            
            # Wait-ServerLaunch will continually repeatedly attempt to get a response from the URL before continuing
            function Wait-ServerLaunch
            {

                try {
                    $url="http://localhost:8000/"
                    $Test = New-Object System.Net.WebClient
                    $Test.DownloadString($url);
                }
                catch
                { start-sleep -Seconds 1; Wait-ServerLaunch }
 
            }

            Wait-ServerLaunch
            [void][System.Reflection.Assembly]::LoadWithPartialName('presentationframework')
            [xml]$XAML = @'
            &lt;Window
                xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
                xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
                Title="PowerShell HTML GUI" WindowStartupLocation="CenterScreen"&gt;

                    &lt;WebBrowser Name="WebBrowser"&gt;&lt;/WebBrowser&gt;

            &lt;/Window&gt;
'@

            #Read XAML
            $reader=(New-Object System.Xml.XmlNodeReader $xaml) 
            $Form=[Windows.Markup.XamlReader]::Load( $reader )
            #===========================================================================
            # Store Form Objects In PowerShell
            #===========================================================================
            $WebBrowser = $Form.FindName("WebBrowser")

            $WebBrowser.Navigate("http://localhost:8000/")

            $Form.ShowDialog()
            Start-Sleep -Seconds 1

            # Once the end user closes out of the browser we send the kill url to tell the server to shut down.
            $url="http://localhost:8000/kill"
            (New-Object System.Net.WebClient).DownloadString($url);
    }
 
    $RunspacePool = [RunspaceFactory]::CreateRunspacePool()
    $RunspacePool.ApartmentState = "STA"
    $RunspacePool.Open()
    $Jobs = @()
 

       $Job = [powershell]::Create().AddScript($UserWindow).AddArgument($_)
       $Job.RunspacePool = $RunspacePool
       $Jobs += New-Object PSObject -Property @{
          RunNum = $_
          Pipe = $Job
          Result = $Job.BeginInvoke()
       }


    # Create HttpListener Object
    $SimpleServer = New-Object Net.HttpListener

    # Tell the HttpListener what port to listen on
    #    As long as we use localhost we don't need admin rights. To listen on externally accessible IP addresses we will need admin rights
    $SimpleServer.Prefixes.Add("http://localhost:8000/")

    # Start up the server
    $SimpleServer.Start()

    while($SimpleServer.IsListening)
    {
        Write-Host "Listening for request"
        # Tell the server to wait for a request to come in on that port.
        $Context = $SimpleServer.GetContext()

        #Once a request has been captured the details of the request and the template for the response are created in our $context variable
        Write-Verbose "Context has been captured"

        # $Context.Request contains details about the request
        # $Context.Response is basically a template of what can be sent back to the browser
        # $Context.User contains information about the user who sent the request. This is useful in situations where authentication is necessary


        # Sometimes the browser will request the favicon.ico which we don't care about. We just drop that request and go to the next one.
        if($Context.Request.Url.LocalPath -eq "/favicon.ico")
        {
            do
            {

                    $Context.Response.Close()
                    $Context = $SimpleServer.GetContext()

            }while($Context.Request.Url.LocalPath -eq "/favicon.ico")
        }

        # Creating a friendly way to shutdown the server
        if($Context.Request.Url.LocalPath -eq "/kill")
        {

                    $Context.Response.Close()
                    $SimpleServer.Stop()
                    break

        }
    
        $Context.Request
        # Handling different URLs

        $result = try {.$ScriptBlock} catch {$_.Exception.Message}

        if($result -ne $null) {
            if($result -is [string]){
                
                Write-Verbose "A [string] object was returned. Writing it directly to the response stream."

            } else {

                Write-Verbose "Converting PS Objects into JSON objects"
                $result = $result | ConvertTo-Json
                
            }
        }

        Write-Host "Sending response of $Result"

        # We convert the result to bytes from ASCII encoded text
        $buffer = [System.Text.Encoding]::ASCII.GetBytes($Result)

        # We need to let the browser know how many bytes we are going to be sending
        $context.Response.ContentLength64 = $buffer.Length

        # We send the response back to the browser
        $context.Response.OutputStream.Write($buffer, 0, $buffer.Length)

        # We close the response to let the browser know we are done sending the response
        $Context.Response.Close()

        $Context.Response
    }

}
</code> </pre>
