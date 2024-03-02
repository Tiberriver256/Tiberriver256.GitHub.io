---
published: true
layout: post
title: "ELI5: Dependency Injection"
subtitle: An attempt to explain dependency injection in simple terms
description:
  An explain it like I'm five explanation of how dependency injection works
modified: 2023-05-27
tags:
  - Development Patterns
  - Dependency Injection
categories:
  - Programming
---

A group wanted to build a tool that would whack things. They decided to call it
the ThingWhacker. The ThingWhacker was composed of two parts:

1. The base and arm
2. The whacking part

## Round one - No dependency injection

They decided to build it all as one unit:

{% include image.html path="thing-whacker-1.png" %}

This seemed like a good idea on paper. When they went to build it, though, they
found it difficult to work on the arm and base with the whacking part attached
because it was very heavy. They also found they would have to throw away a whole
base and arm every time they wanted to experiment with a different size whacking
part because it was too hard to separate the whacking part from the arm and base
after they had been stuck together.

If only they could work on the two parts independently, stick them together when
needed, and easily swap out different sizes of whackers into the same base and
arm.

## Round two - Dependency Injection

They decided to put a hole in the end of the arm that whackers could slide into.
They decided to make all the holes the same size. Six inches deep by two inches
wide. Any whacker could be plugged into the arm and base with a six-by-two-inch
rod. They decided to call this six-by-two-inch rod specification an
**interface** and built their new tool set as two different parts:

{% include image.html path="thing-whacker-2.png" %}

Now they could work on the arm & base independently of the whacker! They
assigned a couple of people to work on the perfect whacker and another couple of
people to work on a supreme arm and base.

The arm and base crew could now test how their arm and base would behave with
multiple different whackers of all different types of weights very easily and
very quickly. The whacker crew could also go crazy with all their ideas on how
to build a good whacker. They knew that as long as all their whackers had a
six-by-two-inch rod on it they would work as expected with whatever the arm and
base crew was building.

This concept, making dependencies like the different whacking devices easily
swappable through the creation of something called an interface that all
dependencies must implement is what we in software development call dependency
injection.
