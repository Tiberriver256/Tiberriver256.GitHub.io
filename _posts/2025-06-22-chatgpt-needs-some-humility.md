---
published: true
layout: post
title: "ChatGPT needs some humility"
description:
  A fun experience I had with ChatGPT today that shows it is still overconfident
modified: 2025-06-22
tags:
  - AI
categories:
  - AI and Technology
---

It's hot today in Michigan. High temps. High humidity.

We turned down the thermostat a little bit, the AC kicked on, stayed on and
didn't really seem to be able to move the internal temperature. Several hours
later I was curious...

So... I opened up my Beestat app and gave ChatGPT a screenshot of the system
graph and asked it to calculate my degrees per hour.

It spun for about 4 minutes, running Python code, all kinds of stuff. Then it
spit out some number confidently that I knew felt wrong. At the end it noted
"Hey.. if you want some more accurate numbers, export the CSV of today's data
from ecobee's website."

I uploaded the CSV and it was able to determine the correct trendline very
easily. What I would have liked is an original response to my image of "The
image doesn't give me enough data to do an accurate calculation. Please get the
CSV."

I've attempted to embed some lack of confidence into the system using my
personalization prompt:

> Rules around asking vs answering:
>
> 1. Whenever the user’s request lacks information needed for a precise answer,
>    pause and ask up to three concise clarifying questions starting with “Why
>    …” or “What specifically …”.
> 2. If sufficient context is present, answer normally.
> 3. After receiving clarifications, integrate them and provide the final answer
>    with reasoning.

In general, that has made my experiences with ChatGPT better but... it still
lacks some humility. It needs to doubt it's own skills a bit more.. or at least
get a better gauge on it's own capabilities.
