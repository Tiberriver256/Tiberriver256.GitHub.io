---
published: true
layout: post
title: "Blog Improvements"
description: Making of my new Jekyll Blog theme
modified: 2023-01-11
tags:
  - Blogging
  - Web Development
categories:
  - Web Development
---

I wanted to start off the new year with some improvements to the theme on my
blog. Ironically, I haven't spent a lot of time blogging over the last year but
I have spent a lot of time tweaking the theme to my site. So... I figured I
should just blog some of the changes I've been making to my blog.

## A Focus On Performance

The latest version of this blog got me:

1. A perfect Google Lighthouse score
2. Joined the green team in the [512kb club](https://512kb.club/)

Here's the changes that I made:

1. Went with a super minimal CSS template based off of
   [https://thejollyteapot.com/](https://thejollyteapot.com/)
2. Stripped out all my fancy pants menus and social sharing
3. Replaced Google Analytics with [Plausible.io](https://plausible.io)
4. Replaced highlight.js with Jekyll rouge

### Minimal CSS

The CSS used on [thejollyteapot.com](https://thejollyteapot.com/) is incredible:

```css
* {
  color-scheme: light dark;
}
div,
nav,
article {
  margin: 4rem auto;
  max-width: 6in;
  font: 110%/1.5 system-ui;
}
a {
  color: unset;
  text-decoration: none;
  border-bottom: solid #d92;
}
```

That's it!

His blog looked fantastic to me and was aware of the people's preferred color
scheme (dark mode/light mode).

I tweaked it further to add some of my own styles for handling
images/figures/videos etc. and changed a few minor things. It's quite a bit
longer than his now but still much smaller than the giant SaSS mess I had
before.

### Stripped out fancy pants menus and social sharing stuff

There was a lot of jquery menus and social sharing snippets built into the old
theme. I decided to just remove most of them. I might add a link to my Github
and LinkedIn profile later but really... I think I'll just keep it a text link
no need to get super fancy.

### Replaced Google Analytics with Plausible.io

I'm loving Plausible.io so far. It's does a whole lot less than Google
Analytics... but... it does exactly what I need it to and the include snippet is
only 1KB!

### Replaced highlight.js with rouge

This is really just using a built-in capability of Jekyll. Using it allows the
code highlight processing to happen pre-processed instead of client-side. It
means my syntax highlighting should work on browsers with Javascript disabled
and it also let me drop another script from my `<head>`.

## Other Tweaks

- Reformatted some code in earlier blog posts
- Added a simple copy button to code snippets
- Shrunk up my logo as an SVG (I can get it smaller if I go WEBP w/ a fallback
  to JPEG)

## To Do

- Add [Vale](https://vale.sh) to my local instance to improve my writing and
  reduce typos
