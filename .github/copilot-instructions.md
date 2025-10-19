# GitHub Copilot Instructions

This file provides guidance to GitHub Copilot when working with code in this repository.

## Project Overview

This is a Jekyll-based blog hosted on GitHub Pages, using the Neo-HPSTR theme. The site belongs to Micah Rairdon (Tiberriver256) and primarily focuses on PowerShell, software development, and technology topics.

## Technology Stack

- **Jekyll 3.9.0** - Static site generator
- **GitHub Pages** (gem ~> 209) - Hosting platform
- **Ruby** - Runtime environment
- **Kramdown** - Markdown processor
- **Neo-HPSTR Jekyll Theme** (customized)

## Common Development Commands

### Jekyll Development
- **Local development**: `bundle exec jekyll serve`
- **Build for production**: `bundle exec jekyll build`
- **Install dependencies**: `bundle install`

## Repository Structure

### Content Organization
- **Posts**: `_posts/` - Blog articles in markdown with YAML front matter
- **Layouts**: `_layouts/` - HTML templates (post.html, page.html, post-index.html)
- **Includes**: `_includes/` - Reusable components (head.html, header.html, footer.html, etc.)
- **Assets**: `assets/css/` and `assets/js/` for stylesheets and JavaScript
- **Images**: `images/` with subdirectories for each post's assets
- **Configuration**: `_config.yml` contains site settings, owner info, and Jekyll configuration

### Key Features
- **Automatic OG image generation**: Uses Cloudinary API for dynamic social media images
- **Giscus comments**: Integrated GitHub-based commenting system
- **Search functionality**: JSON-based search via `search.json`
- **RSS feed**: Generated at `/feed.xml`
- **Google Analytics**: Configured with tracking ID G-4DS8LE3MB2

## Content Guidelines

### Creating New Blog Posts

1. **File naming**: `YYYY-MM-DD-title-slug.md` in `_posts/` directory
2. **Required front matter**:
   ```yaml
   ---
   published: true
   layout: post
   title: "Your Title Here"
   description: "SEO description (150-160 chars max)"
   modified: YYYY-MM-DD
   tags:
     - Tag1
     - Tag2
   categories:
     - Category
   ---
   ```

### SEO Requirements
- **Title**: 50-60 characters (6-10 words ideal)
- **Description**: 150-160 characters maximum
- **Tags**: 2-5 relevant tags maximum
- **Keywords**: Include primary keyword naturally in title, description, and content

### Content Structure Standards
1. **Opening**: Hook the reader immediately
2. **Problem/Context**: Clearly define what you're addressing
3. **Solution/Content**: Provide detailed, actionable value
4. **Conclusion**: Summarize key takeaways

### Image Management
- **Storage**: `images/[post-slug]/filename.ext`
- **Reference in posts**: `{% include image.html path="filename.ext" alt="description" %}`
- **Path format**: Filename only (not full URL or folder path)
- Cloudinary handles automatic optimization and social media image generation

## Code Style and Conventions

### Writing Style (Strunk & White + Zinsser)
- **Clarity over cleverness**: "Clear thinking becomes clear writing"
- **Omit needless words**: Delete 10% of words each revision pass
- **Active voice**: "Who does what?" structure
- **Unity of design**: One paragraph = one topic
- **Write to one reader**: Personal, conversational tone
- **Read aloud**: Test for logic jumps and rhythm

### Markdown Conventions
- Use fenced code blocks with language specification
- Keep paragraphs short and scannable
- Use descriptive link text
- Include alt text for all images

## Configuration Files

- **Main config**: `_config.yml` - Site settings, owner info, and Jekyll configuration
- **Dependencies**: `Gemfile` - Specifies Jekyll 3.9.0 and github-pages ~> 209
- **Permalink structure**: `/:categories/:title/`
- **Pagination**: 5 posts per page

## Additional Resources

For comprehensive writing guidelines, refer to:
- `.github/instructions/writers-guide.instructions.md` - Detailed writer's guide
- `.github/chatmodes/editor-review.chatmode.md` - Editorial review chatmode
- `CLAUDE.md` - Claude-specific instructions

## Guest Posts

- Include attribution: `> Guest post authored by [Name](url). Additional context.`
- Follow same SEO and content structure guidelines
