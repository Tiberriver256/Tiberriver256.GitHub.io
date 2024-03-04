---
published: true
layout: post
title: "ThingWorx local development environment with Docker - Part 1"
description:
  First in a series exploring setting up a local ThingWorx development
  environment with Docker
modified: 2024-03-02
tags:
  - Development
  - ThingWorx
  - Docker
categories:
  - Web Development
---

[ThingWorx](https://www.ptc.com/en/products/thingworx) is a platform for
developing "Industrial IoT solutions". They've got a lot of interesting
documentation on various setup guides but I wanted to document how to get one up
and running locally in a few minutes for the express purposes of learning and
experimentation.

A local setup doesn't usually need all the heavy duty resilience and redundancy
requirements that come with setting up a production environment. Unfortunately,
while ThingWorx has plenty of documentation on setting up a production instance
they don't have a whole lot of documentation on quickly spinning up a local
environment for experiementation.

## What is the ThingWorx architecture?

There are three basic components in ThingWorx
[documented here](https://support.ptc.com/help/thingworx/platform/r9/en/index.html#page/ThingWorx/Help/Installation/DeploymentArchitecture/thingworx_foundation_deployment_components.html)
and they are:

1. Things/Devices/Users/Clients
2. ThingWorx Foundation
3. Database

The ThingWorx Foundation application is a Java web application designed to be
hosted with Apache Tomcat. The database you choose to use with ThingWorx is
somewhat up to you. Any database that provides a JDBC driver and is ANSI SQL
capable
[should work](https://support.ptc.com/help/thingworx/platform/r9/en/index.html#page/ThingWorx/Help/ModelandDataBestPractices/persistenceProviderOptions.html),
although the officially distributed installers will make it easier if you're
using either PostgreSQL, MS SQL, or Azure SQL.

All of this looks like it's VERY dockerizable.

## Are there other attempts out there to do this with Docker?

There are of course the official Docker implementations mentioned in
[the installation guide here](https://support.ptc.com/help/thingworx/platform/r9/en/index.html#page/ThingWorx/Help/Installation/ThingWorxDockerGuide/thingworx_docker_landing_page.html#).
These are a little overkill for our needs though.

A quick Google search yielded up
[Foxoncz/docker-thingworx](https://github.com/Foxoncz/docker-thingworx) which he
describes as being a "Simple dev setup for ThingWorx." Sounds perfect for our
requirements! Let's give it a shot!

## Experimenting

Well... the first problem with this repo... there's no documentation on how we
should use it...

There is a folder called `tw` (probably short for ThingWorx). The folder
contains a a single empty file named `UNPACK_TW_HERE.txt`. Seems like the
developer probably wanted us to unpack ThingWorx there. Now... lots of questions
left. There are multiple versions of ThingWorx available for download. Which one
should we unpack there? Let's keep exploring and see if we can figure that out.

There appear to be two docker files and a `docker-compose.yml` file that
connects the two of them.

### Dockerfile 1 - Dockerfile.postgres

`Dockerfile.postgres` a very simple file seems to be the container for our
database and does three things:

1. Copies the contents of `/tw/install/` into the container
2. Sets the `twpg_init.sh` script as the entrypoint script
3. Creates the basic ThingWorx storage folders and appropriate permissions

```
FROM postgres:9.6.5

COPY /tw/install/ /twpginit/
COPY /twpg_init.sh /docker-entrypoint-initdb.d/

RUN mkdir /ThingworxPostgresqlStorage && \
    chmod 775 /ThingworxPostgresqlStorage  && \
    chown postgres:postgres /ThingworxPostgresqlStorage
```

### Dockerfile 2 - Dockerfile.tomcat

`Dockerfile.tomcat` is also a very small file that is going to host our Tomcat
server. It does three very similar things:

1. Copies the ThingWorx war file into the tomcat webapps folder
2. Copies the ThingWorx `platform-settings.json` file into the appropriate
   folder in the container
3. Creates the basic Thingworx storage folders and appropriate permissions

### What's next?

Based on the examination of those two files I'm guessing we should be extracting
the ThingWorx Postgre installation option down into the `tw` folder and then
just run `docker compose -f docker-compose.yml up`. Let's see what happens!

## Our first go at it

The documentation in the repo didn't give any specifics on what version of
ThingWorx should be used, but the latest is the greatest so let's try
downloading 9.5.

I already downloaded [Rancher Desktop][https://rancherdesktop.io/] and validated
everything in Docker land is working right by running `docker run hello-world`.

I downloaded the zip file containing ThingWorx Postgres and extracted it to the
`tw` folder and then I ran `docker compose -f docker-compose.yml up`.

This is what I got...

Exceptions! Exceptions everywhere! Haha... to be expected I suppose. It seems
we'll likely have to build our own. See you in the next post in this series!
