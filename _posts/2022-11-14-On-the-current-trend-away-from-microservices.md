---
published: true
layout: post
title: "On the current trend away from Microservices..."
description:
  Microservices vs. Monolith... and other industry trends. Should you follow the
  trend?
modified: 2022-11-14
tags:
  - Software Architecture
categories:
  - Software Architecture
---

<figure>
  {% include image.html path="hacker-news-build-the-modular-monolith.png" %}
    <figcaption>Top trending article on Hacker News of <a href="https://news.ycombinator.com/item?id=33585104">Build the modular monolith first</a></figcaption>
</figure>

Over the past several months, you seldom go a few weeks without seeing a top
HackerNews article pulling us back towards building monoliths instead of
building with microservices. Reading the comments, it's clear people are
frustrated with their microservices architecture.

Possible reasons for their frustration:

- Microservices are complex
- They chose microservices architecture when they didn't need to and would have
  benefited from a simpler architecture
- They like to complain (who doesn't like to vent a little?)

Those reasons aside, this is a reoccurring theme in web development: we tend to
all swing from one extreme (microservices for everything!) to another (monoliths
for everything!).

Maybe there is a better way?

I present to you:

> Build the appropriate architecture for your business requirements

Sometimes... you should probably build a
[majestic monolith](https://m.signalvnoise.com/the-majestic-monolith/).
Sometimes... you should probably develop your system using distributed
computing.

If you're looking for established methodologies for helping elicit requirements
from people in the business, I'd recommend:

- [Software Engineering Institute: Attribute Driven Design](https://resources.sei.cmu.edu/library/asset-view.cfm?assetid=484077)
- [Martin Fowler's Architecture Guide](https://martinfowler.com/architecture/)
- Familiarizing yourself with various architecture patterns and understanding
  the pros/cons of each
  - [Arcitura Patterns](https://patterns.arcitura.com/)
  - [Microservices Patterns](https://microservices.io/)

## Relevant Additional Reading

I do applaud the general pull away from microservices but I'd recommend the
following articles for a bit more varied reading than the one that was cited in
Hacker News:

- [Monolith First - Martin Fowler](https://martinfowler.com/bliki/MonolithFirst.html)
- [Don't start with a monolith - Stefan Tilkov](https://martinfowler.com/articles/dont-start-monolith.html)
- [Microservices and the First Law of Distributed Objects - Martin Fowler](https://martinfowler.com/articles/distributed-objects-microservices.html)
- [The False Dichotomy of Monoliths and Microservices - Jimmy Bogard](https://jimmybogard.com/the-false-dichotomy-of-monoliths-and-microservices/)
- [Errant Architectures - Martin Fowler](https://www.drdobbs.com/errant-architectures/184414966)
- [History of web-focused distributed computing](https://kriha.de/docs/lectures/distributedsystems/services/services.pdf)
