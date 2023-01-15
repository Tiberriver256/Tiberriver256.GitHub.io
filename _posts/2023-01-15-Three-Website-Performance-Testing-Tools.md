---
published: true
layout: post
title: 'Three Tools For Website Performance Testing'
description: Walkthrough of three website performance testing tools
modified: 2023-01-15
tags:
  - Web Development
  - Web Performance Testing
categories:
  - Web Development
---

So you've built an awesome looking site. Congratulations! Curious to see how fast it is? Check
out these three tools for helping you test the performance of your website.

## [PageSpeed Insights](https://pagespeed.web.dev/)

![A sample of a PageSpeed Insights report](/images/2023-01-15-Three-Website-Performance-Testing-Tools/PageSpeedInsightsReport.jpg)

Provided by Google this tool will basically run a [lighthouse test](https://developer.chrome.com/docs/lighthouse/overview/) for you.
You'll get performance statistics for both mobile and desktop as well as metrics on accessibility, SEO, and general best practices.


Even if you've run lighthouse tests on your own PC, it's a good idea to run it again using this tool as it runs in an isolated environment.
Sometimes the extensions you've installed in your browser can interfere with the lighthouse test.

[Check out the docs](https://developers.google.com/speed/docs/insights/v5/about)

## [GTmetrix](https://gtmetrix.com/)

![A sample of a GTmetrix report](/images/2023-01-15-Three-Website-Performance-Testing-Tools/GTmetrixReport.jpg)

This tool is purely focused on performance. The measurements are similar to PageSpeed Insights but it gives a nice waterfall chart for
the loading of your site, a video and an option for monitoring/alerting with a free account.

## [WebPageTest](https://www.webpagetest.org/)

![A sample of a WebPageTest report](/images/2023-01-15-Three-Website-Performance-Testing-Tools/WebPageTestReport.jpg)

The most feature rich option of the three this one offers:

* Option to test from a variety of different devices
* Option to test from a variety of different Internet connection types
* Option to test from different locations all over the world
* Option to test on a re-load
* Option to test on various web browsers
* Export reports to a variety of different tools
* A total of 15 different reports to be gained from a single scan

## Try Them Out!

Try them out and let me know what you think. Did you find one of them more useful than the other? Also, if you're a performance junky
I would definitely recommend checking out joining the [512KB Club](https://512kb.club/). Really cool initiative.