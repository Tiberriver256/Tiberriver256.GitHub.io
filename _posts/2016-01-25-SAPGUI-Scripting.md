---
published: true
layout: post
title: "SAPGUI Scripting with PowerShell"
description: Just some brief notes on a technique for SAPGUI scripting from PowerShell.
modified: {}
tags:
  - PowerShell
  - SAP
  - SAP GUI
categories:
  - PowerShell
  - SAP
---

Alright, so just wanted to share some brief notes here on a technique for doing SAPGUI scripting from PowerShell.

## It's not pretty

I'm sure this isn't the best way to integrate PowerShell and SAP. I'm not an SAP expert but this may help someone in a pinch so I thought I would share.

By default SAP GUI scripts are recorded in VBScript. The very first thing that is usually done is to call **GetObject("SAPGUI")**. PowerShell can sorta run **GetObject** but that has [some problems](https://technet.microsoft.com/en-us/library/ee176862.aspx?f=255&MSPPError=-2147217396). None of us want to get into reflection. So what's the trick? The **MSScriptControl.ScriptControl** in 32-bit PowerShell.

<!-- more -->

## Running SAPGUI scripts

<pre> <code class="ps">

$ScriptControl = New-Object -comobject MSScriptControl.ScriptControl
$ScriptControl.language = "vbscript"

$Username = "Myusername"
$Password = "MyPassword"

$Login = @"
    If Not IsObject(application) Then
       Set SapGuiAuto  = GetObject("SAPGUI")
       Set application = SapGuiAuto.GetScriptingEngine
    End If
    If Not IsObject(connection) Then
       Set connection = application.Children(0)
    End If
    If Not IsObject(session) Then
       Set session    = connection.Children(0)
    End If
    If IsObject(WScript) Then
       WScript.ConnectObject session,     "on"
       WScript.ConnectObject application, "on"
    End If
    session.findById("wnd[0]").resizeWorkingPane 140,23,false
    session.findById("wnd[0]/usr/txtRSYST-BNAME").text = "$UserName"
    session.findById("wnd[0]/usr/pwdRSYST-BCODE").text = "$Password"
    session.findById("wnd[0]").sendVKey 0
"@

$ScriptControl.AddCode($Login)

</code> </pre>

\*Note the username and password are passed into the script using a here-string before the script is added to the script object.

## Returning text from SAPGUI to PowerShell

<pre> <code class="ps">

$UserNameFromSAP = $ScriptControl.Eval('session.findById("wnd[0]/usr/txtRSYST-BNAME").text')

</code> </pre>

I have used AddCode to script / automate the GUI up to the point where I would need to pull data to SAP then at that point I would extract the data using the **Eval** method, run the PowerShell code, then feed it back in using a here-string built vbscript using the result of the PowerShell script.

Kind of clunky but it works. The scripting object is actually really cool. It can return entire objects from vbscriptland to PowerShell. You can almost fully bring it out of vbscript into PowerShell with this oneliner

<pre> <code class="ps">

$SAPGUI = $ScriptControl.Eval('(GetObject("SAPGUI")).GetScriptingEngine.Children(0).Children(0)')

</code> </pre>

Using this little chunk of code exposes the majorit of methods you would need to automate SAPGUI (i.e. **$SAPGUI.FindByID("wnd[0]/usr/txtRSYST-BNAME").text** would actually return the text value of that field, but I ran into areas where I would be needing to use reflection for certain methods so I dropped it.

The real problem though is that particular COM object is only available in 32-bit PowerShell which means you have to either script for 32-bit or run **Start-Job -RunAs32 -ScriptBlock { [Code here] }** which isn't the funnest way to code.

There ya have it though, I hope someone finds it useful. Like I said at the beginning of this post, there are better solutions out there for this. I know the community at AutoIT have made some nice tooling around SAPGUI scripting. It would be nice if we could bring more of it into PowerShell somehow.

P.S. If you're looking for a better script recorder than the SAPGUI built-in tooling [http://tracker.stschnell.de/](http://tracker.stschnell.de/) is the best I've found.
