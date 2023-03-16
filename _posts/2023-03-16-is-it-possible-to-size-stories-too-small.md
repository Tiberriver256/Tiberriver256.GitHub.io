---
published: true
layout: post
title: 'Is it possible to make user stories too small?'
description: My thoughts on whether or not it's possible to make user stories too small 
modified: 2023-03-16
tags:
  - Agile
  - Software Development
categories:
  - Agile
  - Software Development
---

## Background

For those of you who are uninitiated into the terminology of agile software development a 'story' refers to chunk of work.
The general principle for sizing these stories is to size them with the customer/end user in mind using the following question:

> What is the smallest unit of work that will provide value to my customer?

There are lots of good reasons to keep your stories small. For a good overview you should check out [this article from the Agile Alliance](https://www.agilealliance.org/the-magic-of-small-user-stories).
I just want to clarify, I am not arguing against small stories. Small stories are good.

Now that we've got that out of the way, let's get on to the original question.

## But... is it possible to make them too small?

This question was brought up at work by a coworker who I have tremendous respect for and I stewed on it for quite a while. I think the answer is **yes** and **no**.

Before anyone gets up in arms, let me explain.

There is no such thing as a story being too small, as long as a customer would still be happy to see you deploy that small piece of
work live into their production environment (i.e., you're dutifully creating stories according to the guideline above).
There is such a thing though as work being improperly sliced/chunked though and improperly chunked work can slow down implementation work significantly.

Let's explain this concept with an overly simplified example:

I want you to wash this large truck and trailer

{% include image.html path="semi.jpeg" %}

Now, let's split the work of cleaning this truck up into three chunks of work!

1. Clean the left-side of the truck and trailer
2. Clean the right-side of the truck and trailer
3. Clean the center of the truck and trailer

{% include image.html path="semi-cleaning-split-scenario-1.excalidraw.png" %}

Let's look at what splitting the work this way is going to mean for our lovely cleaning crew:

1. They are going to have to get up and get down from top of the trailer a total of 6 times.
2. They are going to have to move very slowly and carefully in order to not wash too much (i.e., we don't want them working on anything other than their own user story).
3. Because everything is so close, it's going to be hard to avoid re-work (i.e., if they wash the left-side, right-side and then the center they are likely going to have to re-wash the left and right sides).

let's split the work up a little bit differently and see what optimizations we can get.

1. Clean the truck
2. Clean the trailer
3. Clean the wheels

Now, our cleaners get multiple benefits:

1. They only have to get up and down from the trailer once
2. There is a clear delineation of work from one story to the next since this is work split is entirely based on easily identifiable parts of the truck
3. It's going to be easy to plan the work out to minimize the risk of re-work (i.e., work on the tallest things first and work your way down)

## What's the principle here?

I used a very simplistic example of a task that was split three ways. We were able to identify that when the work of cleaning the
truck is split three ways there is a potential for a sub-optimal split. Now... let's say that we decided we want to split the 
work of cleaning the truck into **fifteen** small stories.

There's nothing inherently wrong with that goal. It is possible to do, but it's going to require a lot more planning in order to figure out the best way to split the work up.

> The smaller your stories are split, the greater your risk of improperly split the stories

## How do we avoid sub-optimal story splitting in software development?

In a Scrum shop, the people who can best answer *What is the smallest unit of work that will provide value to my customer?*
are commonly the product owner and the business analyst. Because they are the best at that, they are typically the ones best
able to create user stories.

The people who can best answer *What is the optimal way to chunk the work?* are typically the software developers.

So what's the solution?

In a Scrum shop it's typically:

**Sprint Planning & Backlog Refinement**

We have everyone necessary in a room looking at the stories created by the Product Owner and Business Analyst.
Developers can suggest the work be split differently if it's not optimally split and the team can come to an agreement on
a plan that works for everyone.

The one risk that making stories too small introduces here though is that it can mean your stories are so small they don't all make
it into a sprint planning or backlog refinement before the work starts. For example, let's say you have something split up into
fifteen work items. We only have time to go over five of those fifteen in our sprint planning session. The developers here are
not able to see the whole picture. They might suggest optimal ways to merge the five stories while being completely unaware
of the other ten sitting in the backlog that also should be merged.

So in a scrum shop, I would suggest that if the Business Analyst and Product Owner are ever on the fence about whether or
not something should be split up or kept large, they should keep it larger and split with the development team present.

## What are your thoughts?

I'd like to hear what you think on the topic. Feel free to leave me a comment or open a discussion on LinkedIn.