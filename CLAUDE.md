# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Jekyll-based blog hosted on GitHub Pages, using the Neo-HPSTR theme. The site belongs to Micah Rairdon (Tiberriver256) and primarily focuses on PowerShell, software development, and technology topics.

## Common Development Commands

### Jekyll Development
- **Local development**: `bundle exec jekyll serve`
- **Build for production**: `bundle exec jekyll build`
- **Install dependencies**: `bundle install`

### Content Management
- **New posts**: Create markdown files in `_posts/` following the naming convention `YYYY-MM-DD-title.md`
- **Post front matter**: Include `published`, `layout`, `title`, `description`, `modified`, `tags`, and `categories`
- **Images**: Store in `images/` directory, reference using the custom `{% include image.html %}` tag

## Architecture and Structure

### Content Organization
- **Posts**: `_posts/` - Blog articles in markdown with YAML front matter
- **Layouts**: `_layouts/` - HTML templates (post.html, page.html, post-index.html)
- **Includes**: `_includes/` - Reusable components (head.html, header.html, footer.html, etc.)
- **Assets**: `assets/css/` and `assets/js/` for stylesheets and JavaScript
- **Images**: `images/` with subdirectories for each post's assets

### Key Features
- **Automatic OG image generation**: Uses Cloudinary API for dynamic social media images
- **Giscus comments**: Integrated GitHub-based commenting system
- **Search functionality**: JSON-based search via `search.json`
- **RSS feed**: Generated at `/feed.xml`

### Configuration
- **Main config**: `_config.yml` contains site settings, owner info, and Jekyll configuration
- **Dependencies**: `Gemfile` specifies Jekyll 3.9.0 and github-pages ~209 for compatibility
- **Permalink structure**: `/:categories/:title/`
- **Pagination**: 5 posts per page

### Custom Image Handling
The site uses a sophisticated Cloudinary-based system for generating social media images:
- Logo overlay in top-right corner
- Dynamic title and subtitle text
- Gravatar integration
- Background image from `site.ogImageBackground`

### Theme Integration
Based on Neo-HPSTR Jekyll theme with customizations:
- Responsive design with mobile support
- Syntax highlighting support
- Social sharing integration
- Custom 404 page

## Content Guidelines

For comprehensive writing guidelines, refer to `.github/instructions/writers-guide.instructions.md` and use the editorial review chatmode at `.github/chatmodes/editor-review.chatmode.md`.

### Post Creation Process
1. **File naming**: `YYYY-MM-DD-title-slug.md` in `_posts/` directory
2. **Use post template**:
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

### Writing Style (Strunk & White + Zinsser)
- **Clarity over cleverness**: "Clear thinking becomes clear writing"
- **Omit needless words**: Delete 10% of words each revision pass
- **Active voice**: "Who does what?" structure
- **Unity of design**: One paragraph = one topic
- **Write to one reader**: Personal, conversational tone
- **Read aloud**: Test for logic jumps and rhythm

### Image Management
- **Storage**: `images/[post-slug]/filename.ext` 
- **Reference**: `{% include image.html path="filename.ext" alt="description" %}`
- **Path format**: Filename only (not full URL or folder)
- Cloudinary handles automatic optimization and social media image generation

### Guest Posts
- Include attribution: `> Guest post authored by [Name](url). Additional context.`
- Follow same SEO and content structure guidelines
