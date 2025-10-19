# Tiberriver256's Blog

Welcome to my personal blog! This is where I share my thoughts and experiences
on PowerShell, web development, DevOps, AI, and various technology topics.

## About

I'm **Micah Rairdon** ([@Tiberriver256](https://github.com/Tiberriver256)),
a software architect passionate about PowerShell, software development,
and building great user experiences. I currently work as a software architect
for Midmark, where I help design and build scalable solutions for complex
technical challenges.

When I'm not coding or writing, I enjoy spending time with my wife and two boys.

## Live Blog

Visit the blog at: **[https://tiberriver256.github.io](https://tiberriver256.github.io)**

## Content Focus

This blog covers a variety of topics including:

- **PowerShell** - Scripts, best practices, and automation techniques
- **Azure DevOps** - Pipelines, workflows, and DevOps practices
- **Web Development** - React, Jekyll, performance optimization, and modern
  web techniques
- **AI & Technology** - Exploring AI tools, their limitations, and practical
  applications
- **Software Development** - Architecture, design patterns, and development
  practices

With over 40+ articles, there's something for developers at all levels.

## Technical Stack

This blog is built with modern static site technologies:

### Core Technologies

- **Jekyll 3.9.0** - Static site generator
- **GitHub Pages** (gem version ~209) - Hosting platform
- **Ruby** - Runtime environment
- **Kramdown** - Markdown processor

### Theme & Design

- **Neo-HPSTR Jekyll Theme** (customized) - Based on
  [mmistakes/hpstr-jekyll-theme](https://github.com/mmistakes/hpstr-jekyll-theme)
- Responsive design optimized for mobile, tablet, and desktop
- Custom syntax highlighting for code examples
- Animated navigation menu

### Features

- **Automatic OG Image Generation** - Dynamic social media preview images using
  [Cloudinary](https://cloudinary.com/)
- **Giscus Comments** - GitHub-based commenting system
- **Google Analytics** - Visitor tracking and insights
- **RSS Feed** - Subscribe at `/feed.xml`
- **Search Functionality** - JSON-based search across all posts
- **SEO Optimized** - Meta tags, structured data, and sitemap

### Key Plugins

- `jekyll-sitemap` - Automatic sitemap generation
- `jekyll-paginate` - Post pagination (5 posts per page)

## Local Development

### Prerequisites

- Ruby (compatible with Jekyll 3.9.0)
- Bundler gem

### Setup Instructions

1. **Clone the repository**

   ```bash
   git clone https://github.com/Tiberriver256/Tiberriver256.GitHub.io.git
   cd Tiberriver256.GitHub.io
   ```

2. **Install dependencies**

   ```bash
   bundle install
   ```

3. **Run the development server**

   ```bash
   bundle exec jekyll serve
   ```

4. **View the site**

   Open your browser to `http://localhost:4000`

### Creating New Posts

Posts are located in the `_posts/` directory and follow the naming convention:

```text
YYYY-MM-DD-title-slug.md
```

Each post requires front matter with:

- `published` - Set to `true` to publish
- `layout` - Use `post` for blog posts
- `title` - Your post title (50-60 characters recommended)
- `description` - SEO description (150-160 characters max)
- `modified` - Publication date in YYYY-MM-DD format
- `tags` - Array of relevant tags (2-5 recommended)
- `categories` - Array of categories

See existing posts in `_posts/` for examples.

## Contributing

Found a typo or issue? Feel free to open an issue or submit a pull request!

## License

Content is © Micah Rairdon. Theme based on Neo-HPSTR Jekyll Theme.

## Connect

- **Blog**: [tiberriver256.github.io](https://tiberriver256.github.io)
- **GitHub**: [@Tiberriver256](https://github.com/Tiberriver256)
- **LinkedIn**: [tiberriver256](https://linkedin.com/in/tiberriver256)
