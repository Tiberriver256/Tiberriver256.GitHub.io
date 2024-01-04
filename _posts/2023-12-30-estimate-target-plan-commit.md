---
published: true
layout: post
title: 'Estimate, target, plan and commit'
description: What process you should be using for estimation, targeting, planning, and commitment in software development
modified: 2023-12-30
tags:
  - Development
  - Software Estimation
categories:
  - Web Development
---

I've started into "[Software Estimation: Demystifying the Black Art](https://www.amazon.com/Software-Estimation-Demystifying-Developer-Practices/dp/0735605351)" by Steve McConnell, and of course... as is my style. I'm making some conjectures about what I think software development should look
like based off of reading the first chapter. I am going to finish the book, but jotting some quick thoughts down as I go helps me to digest the book
as I go, so don't be surprised if I actually contradict something in the book. I haven't read it all yet.

## Some definitions

* **Estimate** - Something rather easily and simply generated that is roughly accurate and expected to be off within a certain range. A simple formula that may be good enough in most cases is suggested as `Effort = NumberOfRequirements * AverageEffortPerRequirement`.
* **Target** - The business wants to do *something* by *X* date. A statement of a desireable business outcome.
* **Plan** - This is a detailed schedule on how we plan to *hit* said target (it will likely include prioritization and leaving certain things out).
* **Commitment** - When someone or a team promises to hit the target with a specific level of quality.

## A logical plan

You can expect the business to come to you with targets. We should be ready with *good enough™* estimates to help produce plans that we can commit to.

So the sequence is:

1. Build a system that can be used to produce *good enough™* estimates on-demand
2. Wait for the business to bring you targets
3. Build plans to hit those targets using your estimates
4. Only build plans you're comfortable committing to

## The tricky part

It seems to me that building a data-set to produce *good enough™* estimates on-demand is the tricky part. I believe Steve is going to cover this in
more detail later in the book but my guess as to some important details would be all centered around measuring that `AverageEffortPerRequirement` and
that the keys to getting accurate measurements there are going to be around when can we say something started and when can we say something is finished?

