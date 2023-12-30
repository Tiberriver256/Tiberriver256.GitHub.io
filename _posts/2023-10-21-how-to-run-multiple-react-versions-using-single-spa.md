---
published: true
layout: post
title: 'How to run multiple versions of React side-by-side using Single Spa'
description: How to run multiple versions of React side-by-side when using Single Spa
modified: 2023-10-21
tags:
  - Development
  - single-spa
  - react
categories:
  - Web Development
---

This seems like it should be easy right? [Single-spa](https://single-spa.js.org/) is a micro-frontend framework
designed to handle running multiple SPA frameworks side-by-side. It's pretty straightforward in all
the other frameworks... but not so in React. Let's dig into why that is.

## What's the problem?

In order to use React you always have to install two packages:

1. `react` - The main runtime for React
2. Some other package that handles the rendering (i.e., `react-dom`/`react-canvas`/`react-native`/`react-pdf`/etc.)

This allows developers to plug multiple renderers into the React runtime and magically grants everyone who
knows React the ability to write JSX code that works in a bunch of random places.

Sounds magical! Why is this a problem again?

The problem only comes when we're trying to work with single-spa. Let's setup a quick project to show how this works:

1. I create a root config
2. I create a React project running React 17, setting up my webpack externals to look like: `{ react: 'react-17', ['react-dom']: 'react-dom-17' }`
3. I create another React project running React 18, setting up my webpack externals to look like `{ react: 'react-18', ['react-dom']: 'react-dom-18 }`
4. I add import maps for `react-17`, `react-dom-17`, `react-18`, `react-dom-18` all pointing to their various `https://cdn.jsdelivr.net/npm/` urls.

We boot up the site and we get a nice fat error message: `Unable to resolve bare specifier 'react' from https://cdn.jsdelivr.net/npm/react-dom@17.0.2/umd/react-dom.development.js`

The reason we get this error message is that `react-dom` was bundled with a dependency on `react`. So, even though
we have our application code swapping out every `react` import with either a `react-17` or a `react-18` import and
we're doing the same for where our application code references `react-dom` we can't do anything about the code inside
the `react-dom` library that is looking for a module named `react-dom`.

It's a problem unique to React because of it's two package delivery system. If they shipped it as one package like Angular/Vue/etc.
then we wouldn't be having this problem.

## The solution

We're going to re-bundle up our own distribution of the `react-dom` libraries. Running it through webpack first. That way
we can tell `react-dom-17` to import `react-17` and we can tell `react-dom-18` to import `react-18`.

What's the easiest way to do that?

Let's use `npx create-single-spa` to spin out two `utility modules`:

1. One to re-export `react-dom@17` and have it's webpack externals set to: `{ react: 'react-17' }`
2. One to re-export `react-dom@18` and have it's webpack externals set to: `{ react: 'react-18' }`

The only file in both projects will look like this:

```js
import ReactDOM from 'react-dom'
export default ReactDOM
export * from 'react-dom'
```

Now in our import maps we reference our own utility module versions of react-dom instead of the ones hosted on cdn.jsdelivr.net
and things just work!

{% include image.html path="multiple-react-versions-yay.png" %}

If you want to check out the working code, [I've got a sample repository on Github](https://github.com/Tiberriver256/multiple-react-versions-single-spa).