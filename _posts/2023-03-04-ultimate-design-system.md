---
published: true
layout: post
title: 'The Ultimate Design System'
description: The ultimate design system, a developer perspective
modified: 2023-02-26
tags:
  - Design System
  - Web Development
categories:
  - Web Development
---

As a web developer, I have worked with and built design systems in several shapes and sizes. This article
isn't a description of something I have built before. This article is a description of something I wish that
I had. The ultimate design system, from a developer persective.

I am going to break this down into two categories:

* Design Side
* Technical Side

> **NOTE:**
> 
> I have very little experience with the design process. What I am familiar with and 
> will speak to is the output I (as a technical person) receive from the from the design process.

## Definitions

### Design system

A collection of UI components ([atoms + molecules + organisms](https://bradfrost.com/blog/post/atomic-web-design/)) provided as both design assets and developer assets that are kept closely in sync. The design assets are used across many high-fidelity designs and the developer assets are used across many websites and web applications. Designs should be linked to a design system asset so that an update to the design of a button triggers updates across mutliple designs. Websites and web apps should also be linked to the design system developer assets so that an update to the code for a button triggers updates across multiple websites.

#### Sample design systems

* [Material Design (Google)](https://m3.material.io/)
* [U.S. Web Design System](https://designsystem.digital.gov/)
* [Spectrum (Adobe)](https://spectrum.adobe.com/)

## Goals

The goals I have in mind for developing the ultimate design system are:

* **Ease attaining consistency** - It's an extremely complicated task for an organization to achieve design consistency across their web applications. With varying technologies in use, varying developer skill levels, and varying business goals simply publishing design assets will likely result in many websites that kind of look similar but are all different enough to be noticeable. Even if your sites don't match the design system 100%, if they are consistent it will be a better experience for users than if they are all slightly different.
* **Simplify branding updates** - Companies change branding, styling, color schemes, more frequently than you would imagine. If all designs, and all implementations of those designs are tied back to centralized assets there is a clear migration path for everyone to stay up-to-date with branding changes.
* **Ease unit/functional testing** - Even if you don't provide the testing components I will suggest in this document, developers will over time learn how components behave and will be able to write tests more easily.
* **Increase developer velocity** - The design system should be the place where developers can spend time on making things pixel perfect. When they are using that design system to implement a web site or web app they should be able to put 100% of their focus on building the functionality of the site.
* **Developer tooling agnostic** - The developer design system assets should work regardless of what front-end tooling is chosen. Front-end tooling changes too frequently for most large businesses to be able to realize the full benefits of a design system.

## Design-side outputs

* Each UI component shown in a design tool in each of it's states
* Descriptions of each UI component and how they are intended to be used
* Typography
* Iconography exportable as SVG
* A sample application showing how small components fit together in real environment
* A sample application showing how components adjust on different screen resolutions
* [Connected components](https://zeplin.io/features/connected-components/) - If a developer can click on an element in your high-fidelity page design and know exactly what developer component they should be using and what properties should be set on it there is a very low likelihood that developers will go off the rails. It's unfortunately common for developers to just make their own component on the spot that looks kind of close to your design if they can't easily figure out what developer asset they should be using.
* A method for translating the styles you used to make your design into developer styles. Most design tools (Adobe XD, Zeplin, Figma) provide approximate guesses for this automatically. A few design tools (penpot, webflow) have designers building prototypes using web styles like flexbox and grid to ensure the hand-off is exact.
* An assigned approver for developer asset changes. The designer should see and approve changes to developer assets well before they land on any particular site.


## Developer-side tooling

* **Isolated component development environment** - Storybook is the most popular tool for this today. I have also seen custom built sites that work just as well. Just make a 'page' for each UI component and ensure it has hot-reloading and that's the bare minimum of what you'll need. Storybook provides a ton of extra features though so generally you shouldn't be building your own.
* **High quality libraries provided in every possible format** - Make an npm module that integrates well into build systems and is tree-shakeable, make a module that can be easily loaded direct from the browser without a build system.
* **Framework agnostic** - The **best©** way to make something totally framework agnostic is to follow the same pattern as bootstrap. Mostly CSS with a bit of JS when you need it. It's 100% guaranteed to work smoothly wherever you need it to and whatever framework you choose. You can provide light-weight wrapper libraries for specific frontend frameworks to provide a better developer experience but they are totally unecessary to get people started. You can also do web-components with auto-generated framework shims like [StencilJS](https://stenciljs.com/) does, but adoption/support for web components is very slow so choose carefully.
* 