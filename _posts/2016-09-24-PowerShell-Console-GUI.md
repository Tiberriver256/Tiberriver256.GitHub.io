---
published: true
layout: post
title: "ASCII GUI in your PowerShell Console"
description: Making a GUI in the PowerShell Console using PhonicUK's CLRCLI
modified: {}
tags:
  - PowerShell
  - GUI
  - CLRCLI
categories:
  - PowerShell
  - GUI
---

I stumbled upon this [epic .net project by PhonicUK on
Github](https://github.com/PhonicUK/CLRCLI) for "an event-driven windowing
system using a line-art interface for use by command-line applications" and
thought I would see if it worked in PowerShell. The results, I think are pretty
cool!

The code to create this is really very similar to WinForms style of coding and
can be generated very quickly. I will give a short walkthrough on how to create a
GUI using this sweet library.

# How to make the magic happen

<!-- more -->

## Build the project (to get the DLL)

1. Grab the source code from the above mentioned Github repository.
2. Open the project in VS Community 15
3. Build the solution

This should generate the DLL we will need to reference in a bin/debug folder of the project.

## Load the DLL into PowerShell

<pre> <code class="ps">
    Import-Module "Whereveryoustoredtheproject/bin/debug/CLRCLI.dll"
</code> </pre>

## Build out your GUI in something similar to WinForms style

Create a root base

<pre> <code class="ps">
    $Root = [CLRCLI.Widgets.RootWindow]::new()
</code> </pre>

Add your first dialog. The dialog is the base that you can attach buttons,
listboxes etc. to.

<pre> <code class="ps">
    $Dialog = [CLRCLI.Widgets.Dialog]::new($Root)

    $Dialog.Text = "List Running Processes"
    $Dialog.Width = 60
    $Dialog.Height = 32
    $Dialog.Top = 4
    $Dialog.Left = 4
    $Dialog.Border = [CLRCLI.BorderStyle]::Thick
</code> </pre>

Cool. Now lets add a nice label, a couple of buttons and a listbox. Note that in
the creation they are all attached to my first $Dialog.

<pre> <code class="ps">
    $Label = [CLRCLI.Widgets.Label]::new($Dialog)
    $Label.Text = "Running Processes"
    $Label.Top = 2
    $Label.Left = 2

    $Button = [CLRCLI.Widgets.Button]::new($Dialog)
    $Button.Text = "Get Processes"
    $Button.Top = 4
    $Button.Left = 6
    $Button.Width = 25

    $Button2 = [CLRCLI.Widgets.Button]::new($Dialog)
    $Button2.Text = "Show Alternate Window"
    $Button2.Top = 4
    $Button2.Left = 34
    $Button2.Width = 25

    $list = [CLRCLI.Widgets.ListBox]::new($Dialog)
    $list.top = 10
    $list.Left = 4
    $list.Width = 32
    $list.height = 6
    $list.Border = [CLRCLI.BorderStyle]::Thin
</code> </pre>

Cool. Seems pretty straightforward. Now let's build another dialog that is
hidden as basically another page.

<pre> <code class="ps">
    $Dialog2 = [CLRCLI.Widgets.Dialog]::new($Root)
    $Dialog2.Text = "ooooh"
    $Dialog2.Width = 32
    $Dialog2.Height = 5
    $Dialog2.Top = 6
    $Dialog2.Left = 6
    $Dialog2.Border = [CLRCLI.BorderStyle]::Thick
    $Dialog2.Visible = $false
</code> </pre>

Now I'm going to add a button to the second dialog window. Since the dialog is
hidden the button also will be hidden.

<pre> <code class="ps">
    $Button3 = [CLRCLI.Widgets.Button]::new($Dialog2)
    $Button3.Text = "Bye!"
    $Button3.Width = 8
    $Button3.Height =3
    $Button3.Top = 1
    $Button3.Left = 1
</code> </pre>

Sweet! Now let's make the buttons do something.

<pre> <code class="ps">
    $Button3.Add_Clicked({$Dialog2.Hide(); $Dialog.Show()})
    $Button2.Add_Clicked({$Dialog.Hide(); $Dialog2.Show()})
    $Button.Add_Clicked({ Get-Process | select -ExpandProperty ProcessName | foreach { $list.items.Add($_) }  })
</code> </pre>

You can guess what is happening from the code for Buttons 2 and 3. Those buttons
are going to be used to switch between the dialogs. The code for button one
might be a bit more complicated but basically we are adding the process names
from get-process into the listbox we created earlier.

Now, we run the GUI with by running the $Root.

<pre> <code class="ps">
    $Root.Run()
</code> </pre>

And we get the magic! Pretty awesome way to make an oldschool GUI right? This
project is pretty sweet but I would also like to check out
[CursesSharp](https://github.com/sushihangover/CursesSharp) as that project
looks to be a bit more developed.

<figure>
 <video autoplay controls muted loop playsinline>
        <source src="{{ site.url }}/images/Oldschool%20PowerShell%20UI.webm" type="video/webm">
        <source src="{{ site.url }}/images/Oldschool%20PowerShell%20UI.mp4" type="video/mp4">
    </video>
</figure>
