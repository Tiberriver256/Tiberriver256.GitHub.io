---
published: true
layout: post
title: "How to run Storybook with Https on localhost"
description: How to setup Storybook to run using Https on localhost
modified: 2023-01-27
tags:
  - Web Development
  - Storybook
categories:
  - Web Development
---

This is just a quick note for myself on how to do this since the Storybook docs
don't cover this topic.

The steps are:

1. Generate yourself a self-signed certificate
2. Run Storybook with the correct command line arguments to use the certificate

## Generate a self-signed certificate

There are many ways to do this. The one that seems most universal to me though
is to create the certificate using the following
[`openssl`](https://www.openssl.org/) command:

```sh
openssl req -x509 -sha256 -nodes -newkey rsa:2048 -days 365 -keyout localhost.key -out localhost.crt
```

That should generate two files `localhost.key` and `localhost.crt`

## Run Storybook with the correct command line arguments

```sh
npx start-storybook -p 6006 --https --ssl-cert ./localhost.crt --ssl-key ./localhost.key
```
