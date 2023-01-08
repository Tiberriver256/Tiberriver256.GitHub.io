---
published: true
layout: post
title: "Adding a Notification Icon to PoshProgressBar"
description: List of problems and solutions for adding a notification icon to the PoshProgressBar module
modified: 2016-02-20
tags:
  - PowerShell
  - ProgressBar
  - XAML
categories:
  - PowerShell
  - ProgressBar
---

<figure>
	<img src="{{ site.url }}/images/PowerProgress/NotifyIcon.jpg">
</figure>

So I decided I wanted to add in a new feature to the PoshProgressBar module. It is always handy to be able to close out of a window but still be able to monitor progress via the notification area, so I decided an icon in the notification tray would be a good next step.

<!-- more -->

## Problem #1 - Override the default close action of the PoshProgressBar window.

I didn't want to clutter up the window with an extra button that said _hide_ or something like that so I wanted to just have it hide to the notification tray when you click **X** on the window. It turns out that wasn't so bad.

```powershell
$Synchash.window.Add_Closing({
                
                $SyncHash.Window.Hide()
                $_.Cancel = $true
         
         })
```

The _hide()_ method on the window will make it disappear. Setting the **Cancel** property of the closing event will then cancel out of the closing event. Nice!

## Problem #2 - Getting NotifyIcon (WinForms) to play with WPF in the same thread

I looked at a few methods of adding a notification icon with wpf and XAML but I didn't want to add another dll to the module. If you're interested in doing a true WPF notification icon you can check out [this guy](http://www.hardcodet.net/wpf-notifyicon).

I decided I was going to go with WinForms NotifyIcon. Getting them to play nicely was actually not difficult at all.

```powershell
$syncHash.Window=[Windows.Markup.XamlReader]::parse( $SyncHash.XAML )

...

$SyncHash.NotifyIcon = New-Object System.Windows.Forms.NotifyIcon

...

$SyncHash.NotifyIcon.Visible = $true

...

$syncHash.Window.Show() | Out-Null
$appContext = [System.Windows.Forms.ApplicationContext]::new()
```

Changing from using the _ShowDialog()_ method to using the _Show()_ method prevented the Window object from hogging up the whole thread. The application context allows two forms to run and will not continue the script until both are closed or the application context is exited.

## Problem #3 - Closing the progress bar

Now that I have my exit button magically used to just hide the progress bar. How do I let end users close it and exit the script if they do not want it running any more?

Adding a menu item to the notification icon seemed the easiest and most sensible method.

```powershell
$menuitem = New-Object System.Windows.Forms.MenuItem
$menuitem.Text = "Exit"

$contextmenu = New-Object System.Windows.Forms.ContextMenu
$SyncHash.NotifyIcon.ContextMenu = $contextmenu
$SyncHash.NotifyIcon.contextMenu.MenuItems.AddRange($menuitem)

...

# When Exit is clicked, close everything and kill the PowerShell process
$menuitem.add_Click({
 
    $SyncHash.NotifyIcon.Visible = $false
    $syncHash.Closing = $True
    $syncHash.Window.Close()
    [System.Windows.Forms.Application]::Exit()

})
```

Note the addition of the **Closing** property. This is used to allow the window to actually close, as we had overridden this event to solve problem #2.

Our closing event now looks like this.

```powershell
$Synchash.window.Add_Closing({

    if($SyncHash.Closing -eq $True)
    {
        
    }
    else
    {
        
        $SyncHash.Window.Hide()
        $SyncHash.NotifyIcon.BalloonTipTitle = "Your script is still running..."
        $SyncHash.NotifyIcon.BalloonTipText = "Double click to open the progress bar again."
        $SyncHash.NotifyIcon.ShowBalloonTip(100)
        $_.Cancel = $true

    }

})
```

Not too bad. Of course, you can still close the progress bar from within the script using the **Close-ProgressBar** cmdlet. Which sets the **Closing** variable to _True_. The closing variable is checked inside the update block of the progress bar and used to close it as follows.

```powershell
$updateBlock = {            
            
            
            if($SyncHash.Closing -eq $True)
            {

                $SyncHash.NotifyIcon.Visible = $false
                $syncHash.Window.Close()
                [System.Windows.Forms.Application]::Exit()
                Break
            }
            
            ...
                     
        } 
```

That's all folks!

# [Get the updated module](http://tiberriver256.github.io/PoshProgressBar/)

## More in This Series

<article>
    <ul>
        {% for post in site.tags["ProgressBar"] reversed %}{% if post.title != null %}
            <li class="entry-title"><a href="{{ site.url }}{{ post.url }}" title="{{ post.title }}">{{ post.title }}</a></li>
        {% endif %}{% endfor %}
    </ul>
</article>
