---
published: true
layout: post
title: 'Easy responsive images on Github Pages with Cloudinary'
description: A Github compatible Jekyll include template to produce responsive images using Cloudinary
modified: 2023-01-27
tags:
  - Github compatible responsive jekyll include
  - Jekyll Responsive Image
categories:
  - Jekyll
  - Web Development
---

> ⚠️ Brief Note For Perfection Seekers ⚠️
> 
> This is definitely not **the best**™ way to handle images. In an ideal world you would want the URLs generated off of the width and
> height of the images. You cannot do that in a plain-jane include though. You must reach for a custom Jekyll plugin
> which then makes it incompatible with the default Github Pages set of plugins.
>
> If you are looking for the optimal solution, I would look at one of these custom plugins: 
> * [jekyll-responsive-image](https://github.com/wildlyinaccurate/jekyll-responsive-image)
> * [jekyll-cloudinary](https://github.com/nhoizey/jekyll-cloudinary)

A key component to keeping your site performant is proper management of images. There are many complexities with the management
of images on your website but the big goals are:

* Serve the proper size image for your visitors device (i.e., small images for mobile, high-res images for high-res desktop devices)
* Serve the most modern image format possible (i.e., serve webp first and then fallback to jpeg)
* Serve the image only when necessary (i.e., if the image isn't in the viewport, don't waste network bandwidth loading it)

I wanted to solve these three problems keeping in mind the following three goals:

* I didn't want to slow down my site build time
* I didn't want to use extra storage by creating image formats that may never get used
* I didn't want to go through the process of setting up Jekyll + Github Pages w/ custom plugins ([like this](https://scaomath.github.io/blog/custom-plugins-jekyll-github/))
* I wanted to spend exactly **$0**

[Cloudinary](https://cloudinary.com/) made this so easy.

They provide a `fetch` method where you can just simply build a url and they will handle the rest. Here's a sample snippet they provide:

```html
<img
  src="https://res.cloudinary.com/<cloud_name>/image/fetch/c_limit,w_800,q_auto,f_auto/https://<your-domain>/assets/img.jpg"
  srcset="
    https://res.cloudinary.com/<cloud_name>/image/fetch/c_limit,w_320,q_auto,f_auto/https://<your-domain>/assets/img.jpg 320w,
    https://res.cloudinary.com/<cloud_name>/image/fetch/c_limit,w_640,q_auto,f_auto/https://<your-domain>/assets/img.jpg 640w
    https://res.cloudinary.com/<cloud_name>/image/fetch/c_limit,w_960,q_auto,f_auto/https://<your-domain>/assets/img.jpg 960w
    https://res.cloudinary.com/<cloud_name>/image/fetch/c_limit,w_1280,q_auto,f_auto/https://<your-domain>/assets/img.jpg 1280w
    https://res.cloudinary.com/<cloud_name>/image/fetch/c_limit,w_1600,q_auto,f_auto/https://<your-domain>/assets/img.jpg 1600w
    "
  sizes="(min-width: 50rem) 50rem, 90vw"
  alt="beautiful!"
  width="480"
  height="320"
/>
```

Let's break down one of those URLs here:

* `<cloud_name>` - This is a name granted to you when you create a free account
* `/image/fetch` - This specifies that cloudinary will be fetching the image for you from a URL you specify
* `c_limit` - If the asset is larger than the desired width it will shrink it to fit maintaining the original aspect ratio
* `w_800` - Specifies I want the image to be resized to a width of `800px`
* `q_auto` - Specifies I want the quality to be automatically managed by cloudinary
* `f_auto` - Specifies I want the format of the image served to be automatically the best image format supported by the client browser
* `https://<your-domain>/assets/img.jpg` - Just a sample URL, telling cloudinary where the asset should be fetched from

The full range of transformation options you can specify in the URL is pretty impressive. [Check out the docs here](https://cloudinary.com/documentation/image_optimization).

Using that HTML as a template I can write a little Jekyll liquid snippet:

```liquid
{% raw %}{% if site.url contains "localhost" %}
<img src="{{ site.url }}{{ include.path }}" loading="{{ include.loading | default: "lazy" }}" />
{% else %}
<img
    src="https://res.cloudinary.com/{{ site.cloudinary_cloud }}/image/fetch/c_limit,w_800,q_auto,f_auto/{{ site.url }}{{ include.path }}"
    srcset="
        https://res.cloudinary.com/{{ site.cloudinary_cloud }}/image/fetch/c_limit,w_320,q_auto,f_auto/{{ site.url }}{{ include.path }} 320w,
        https://res.cloudinary.com/{{ site.cloudinary_cloud }}/image/fetch/c_limit,w_640,q_auto,f_auto/{{ site.url }}{{ include.path }} 640w,
        https://res.cloudinary.com/{{ site.cloudinary_cloud }}/image/fetch/c_limit,w_960,q_auto,f_auto/{{ site.url }}{{ include.path }} 960w,
        https://res.cloudinary.com/{{ site.cloudinary_cloud }}/image/fetch/c_limit,w_1280,q_auto,f_auto/{{ site.url }}{{ include.path }} 1280w,
        https://res.cloudinary.com/{{ site.cloudinary_cloud }}/image/fetch/c_limit,w_1600,q_auto,f_auto/{{ site.url }}{{ include.path }} 1600w
    "
    sizes="(min-width: 50rem) 50rem, 90vw"
    alt="{{ include.alt }}"
    loading="{{ include.loading | default: "lazy" }}"
/>
{% endif %}{% endraw %}
```

The `if` statement is so that when working locally I can view images without having to upload them to a place Cloudinary can fetch from. I also have a parameter to allow for lazy loading. The default will always be lazy loading the images but I can optionally specify that they should be eagerly loaded when the image is above the fold.

I hope this is useful to someone out there! It was a fun weekend project that should hopefully further improve the experience for my blog readers.