---
published: true
layout: post
title: "Constraints Are Good"
description: Sometimes having no constraints can be worse than having constraints.
modified: {}
tags:
  - Software Architecture
categories:
  - Software Architecture
---

One of the common benefits touted for splitting a singe REST API into many smaller REST APIs or microfrontends is that:

> Devs can choose whatever technology they want!

This sounds amazing on the surface to some people. In practice this winds up being overwhelming for developers on the team. Let's look at some examples.

## Microfrontends

### What sounds good

* I can choose react for one page and Angular for another page.
* I can selectively upgrade one microfrontend to React 18 while leaving the rest at React 17.
* I can leave all existing pages using Webpack and start all new ones using Vite

### What sounds bad

* I have 15 pages using React and 7 using Angular
* I have 2 pages using React 18, 13 pages using React 17, 2 using Angular 12, 3 using Angular 13 and 2 using Angular 14
* I have 20 pages using Webpack 4, 1 page using Webpack 5 and 1 page using Vitejs

## Backend APIs

### What sounds good

* I can choose the BEST storage technology for each service
* I can choose the BEST language/backend for each service
* I can incrementally upgrade each API to the latest technology while leaving others untouched

### What sounds bad

* I have 2 APIs using Azure SQL, 2 APIs using MongoDB and 1 API using Azure Storage Tables
* I have 2 APIs using C# ASP.NET Core, 2 using NodeJS ExpressJS, and 1 using C# Azure Functions
* I have 1 API using .NET 6, 1 API using .NET 3.1, 1 API using Node 14 + ExpressJS 4, 1 API using Node 16 + ExpressJS 5, and 1 using Azure Function Runtime 3

## Required Skillset

Let's say this system is owned by a small team of 5. That team of five must know the following technologies:

* Angular 12
* Angular 13
* Angular 14
* React 17
* React 18
* Webpack 4
* Webpack 5
* ViteJS
* Azure SQL
* MongoDB
* Azure Storage Tables
* .NET 6 ASP.NET Core
* .NET 3.1 ASP.NET Core
* Node 14
* Node 16
* ExpressJS 4
* ExpressJS 5
* Azure Functions

A single dev on this team must know **18** technologies in order to support a single web app with **22** pages.

This doesn't sound like much fun anymore does it?

## Technologies aren't the only thing that drifts

There are other things that change over time within a project and when applications are smaller devs will be much more likley to make these types of changes:

* Changes in code-style
* Changes in folder structure
* Changes in team 'best-practices'

Even with 13 microfrontends using Webpack 4 and React 17 you are likely to have microfrotnends with varying code-styles, folder structures and best-practices.

## A Comparison

Nick Craver, did an [excellent blog post](https://nickcraver.com/blog/2016/02/17/stack-overflow-the-architecture-2016-edition/) on the architecture of Stack Overflow while he still worked there.

### One Technology Stack

* .NET MVC
* IIS
* HAProxy (load balancer)
* Redis (cache)
* Elasticsearch (search)
* SQL Server

There team has to know a total of **6** technologies to maintain a HUGE number of features and pages.

### What sounds bad

* They had to upgrade their entire app in one big effort
* They couldn't use CosmosDB for things that would've been better in NoSQL instead of a relational DB
* They can't use whatever storage mechanism they want
* They can't use whatever search mechanism they want for different pages
* They can't use whatever caching mechanism they want for different pages

### What sounds good

* They did one upgrade and they were done
* All their code is on one version of MVC
* All their code uses the same storage mechanism
* All their code uses the same search mechanism
* All their code uses the same caching mechanism

### Extreme Performance

Stackoverflow is reliably adopting the latest and greatest .NET technology. They are always at the leading edge using early releases of ASP.NET Core. They handle insane amounts of traffic with excellent performance. For the longest time they only had to manage a very simple infrastructure.

Because of the smaller technology stack, the team was able to focus on deepening those technology skillsets and came out with things like:

* Dapper
* StackExchange.Redis
* A significant number of contributions to perf improvements in the .NET runtime

## Conclusion

Sometimes constraints hold us back... sometimes constraints are good.