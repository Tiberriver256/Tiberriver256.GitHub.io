---
published: true
layout: post
title: "PowerShell GUI with HTML - Part 2"
description: Part 2 of 3 in a blog series about building PowerShell GUIs using HTML and javascript.
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

More boring stuff today. We are going to cover how to handle URLs in this PowerShell web server thingy and covering handling query strings. Stick with me on this though! I promise we will get to the good stuff soon.

# Handling URLs

In [part 1](http://tiberriver256.github.io/powershell/gui/html/AngularJS-PowerShell-GUI-Pt1/) of this series we covered making a basic server that just sends a single response one time back to your web browser.

We saw it responded fine when I went to http://localhost:8000 but what would I do if I wanted to send one response for http://localhost:8000 and a different response for http://localhost:8000/getProcesses ?

We are going to use a simple if-then statement and the **$Context.Request** variable to set the value of **$Result** based on the value of **$Context.Request.Url.LocalPath**.

{% raw %}
<pre> <code class="ps">
if($Context.Request.Url.LocalPath -eq "/getProcesses")
{

    $result = Get-Process | select name,cpu | ConvertTo-Html | Out-String

}
else 
{

    $result = "&lt;html&gt;&lt;body&gt;Hello World!&lt;/body&gt;&lt;/html&gt;"

}
</code> </pre>
{% endraw %}

The **localpath** property of url will remove any query strings (We'll cover those in a bit) and the beginning of the url so that you just get the path that user has requested.

You can see how the **ConvertTo-HTML** function is going to make this very easy to work with. So what is this going to get us?

We are going to run the code from [part 1](http://tiberriver256.github.io/powershell/gui/html/AngularJS-PowerShell-GUI-Pt1/) with the small change of the if-then statement above and launch Google Chrome and point it at http://localhost:8000. We get the following as a response:

<figure>
	<img src="{{ site.url }}/images/HelloWorld.png">
</figure>

My capture on the PowerShell side should have come to an end, but if I run my code again and this time point my browser at http://localhost:8000/getProcesses, I now get the following:

<figure>
	<img src="{{ site.url }}/images/WebGUIGetProcesses.png">
</figure>

Awesome! We are now able to serve up completely different user interfaces based on what the user requests with a simple if-then statement. Now onto something that also sounds scary but is cake in PowerShell.

# Handling Query Strings

Okay, so in the PowerShell world we have cmdlets or functions that run code and we have parameters that we feed to those cmdlets or functions. In the web world they have URLs instead of cmdlets and what they feed into those URLs is what is called a query string. The query string is basically identical to parameters, it is just passed in a different way.

## Basics of a query string (in PowerShell speak)

What a query string looks like is this **?ProcessName=Chrome** and breaks down like this:

* **?** - Signifies the beginning of the query string
* **ProcessName**(Part 1 of 3 in 1st parameter) - This is the parameter name. This would look like **-ProcessName** in PowerShell.
* **=**(Part 2 of 3 in 1st parameter) - Tells the server that what follows is the value that should be passed to the ProcessName parameter.
* **Chrome**(Part 3 of 3 in 1st parameter) - This is the value that is to be used for the ProcessName parameter.

So, if I wanted to write **Get-Process -Name Chrome** in a URL form it could look like this: **/getProcess?Name=Chrome**. 

If I wanted to send a second parameter I would just add a **&** to the URL and do another parameter. 

So, if I wanted to write **Get-Process -Name Chrome -ComputerName MyLabComputer2**. It would look like this: **/getProcess?Name=Chrome&ComputerName=MyLabComputer2**

Not as readable as PowerShell but not terrible once you understand it right?

## Handling query strings in PowerShell

So, you are thinking, how do I parse that query string out in PowerShell? If you're anything like me you're probably thinking, "Hey, I could split that with a regex or just a couple of splits and I could save it as hashtable! Sweet!" Well my friend. What is even sweeter is the net.httplistener object does that for you already.

So, if my browser sent a request to my PowerShell server with the above URL **/getProcess?Name=Chrome&ComputerName=MyLabComputer2**. All I would need to do to get at those parameters is this:

<pre> <code class="ps">
$Name = $Context.Request.QueryString["Name"]
$ComputerName = $Context.Request.QueryString["ComputerName"]
</code> </pre>

Nice! Now, if only there were a simple way to build a form or something in HTML that would send query strings in the URL back to PowerShell... Hmmm.... What about an HTML form?!?!

Check out how easy this is. 

{% highlight html %}
<form action="/getProcesses">
    <label for="Name">Process Name</label>
    <input name="Name"></input>
    <label for="ComputerName">Computer Name</label>
    <input name="ComputerName" value="."></input>
    <button type="Submit">Submit</button>
</form>
{% endhighlight %}

There is a parameter called **action** for the HTML form element that tells the form what URL the parameters should be sent to. The **Name** of each input sets the parameter name. The value that the user types into that input is the value that gets sent for that parameter. The button just tells the form to submit those parameters to the url path given in the action parameter.

So, if I re-write the code above I used to handle the URL like this:

{% raw %}
<pre> <code class="ps">
if($Context.Request.Url.LocalPath -eq "/getProcesses")
{

    $Name = $Context.Request.QueryString["Name"]
    $ComputerName = $Context.Request.QueryString["ComputerName"]
    $result = Get-Process -Name $Name -ComputerName $ComputerName | select name,cpu | ConvertTo-Html | Out-String

}
else 
{

    $result = @"
&lt;h1&gt; List Running Processes &lt;/h1&gt;
&lt;form action="/getProcesses"&gt;
    &lt;label for="Name"&gt;Process Name&lt;/label&gt;
    &lt;input name="Name"&gt;&lt;/input&gt;
    &lt;label for="ComputerName"&gt;Computer Name&lt;/label&gt;
    &lt;input name="ComputerName" value="."&gt;&lt;/input&gt;
    &lt;button type="Submit"&gt;Submit&lt;/button&gt;
&lt;/form&gt;
"@

}
</code> </pre>
{% endraw %}

The first time I run my server and point my browser at http://localhost:8000, I will get a nice little HTML form that looks like the following:

<figure>
	<img src="{{ site.url }}/images/PowerShellHTMLForm.png">
</figure>

Cool, and if I fill it out with Chrome as the process name, leave localhost as the default computer name start my mini PowerShell webserver listening for a request again and click submit. It now responds back with the following:

<figure>
	<img src="{{ site.url }}/images/PowerShellHTMLFormResult.png">
</figure>

Awesome! So, I built a PowerShell web server that can prompt for input and render a response in HTML to the end user. All in less than 100 lines of code. Now, stay tuned for the next blog posting where we are going to take this out of the Chrome browser and launch a PowerShell web browser that looks like a standard UI application, because when you are designing a UI for end users anyway you don't want to have them launching a browser to access what they would consider a desktop application. It would seem tacky I think.


## Full Code

{% raw %}
<pre> <code class="ps">
# Create HttpListener Object
$SimpleServer = New-Object Net.HttpListener

# Tell the HttpListener what port to listen on
#    As long as we use localhost we don't need admin rights. To listen on externally accessible IP addresses we will need admin rights
$SimpleServer.Prefixes.Add("http://localhost:8000/")

# Start up the server
$SimpleServer.Start()

# Tell the server to wait for a request to come in on that port.
$Context = $SimpleServer.GetContext()

#Once a request has been captured the details of the request and the template for the response are created in our $context variable
Write-Verbose "Context has been captured"

# $Context.Request contains details about the request
# $Context.Response is basically a template of what can be sent back to the browser
# $Context.User contains information about the user who sent the request. This is useful in situations where authentication is necessary


# Sometimes the browser will request the favicon.ico which we don't care about. We just drop that request and go to the next one.
do
{

    $Context.Response.Close()
    $Context = $SimpleServer.GetContext()

}while($Context.Request.Url.LocalPath -eq "/favicon.ico")


# Handling different URLs

if($Context.Request.Url.LocalPath -eq "/getProcesses")
{

    $Name = $Context.Request.QueryString["Name"]
    $ComputerName = $Context.Request.QueryString["ComputerName"]
    $result = Get-Process -Name $Name -ComputerName $ComputerName | select name,cpu | ConvertTo-Html | Out-String

}
else 
{

    $result = @"
&lt;h1&gt; List Running Processes &lt;/h1&gt;
&lt;form action="/getProcesses"&gt;
    &lt;label for="Name"&gt;Process Name&lt;/label&gt;
    &lt;input name="Name"&gt;&lt;/input&gt;
    &lt;label for="ComputerName"&gt;Computer Name&lt;/label&gt;
    &lt;input name="ComputerName" value="."&gt;&lt;/input&gt;
    &lt;button type="Submit"&gt;Submit&lt;/button&gt;
&lt;/form&gt;
"@

}







# In order to send it to the browser we need to convert it from ASCII encoded text into bytes.
$buffer = [System.Text.Encoding]::ASCII.GetBytes($result)

# We need to let the browser know how many bytes we are going to be sending
$context.Response.ContentLength64 = $buffer.Length

# We send the response back to the browser
$context.Response.OutputStream.Write($buffer, 0, $buffer.Length)

# We close the response to let the browser know we are done sending the response
$Context.Response.Close()

# We stop our server
$SimpleServer.Stop()
</code> </pre>
{% endraw %}