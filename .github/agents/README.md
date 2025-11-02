# Custom Agents for Blog Content Support

This directory contains specialized GitHub Copilot agent profiles for different content creation and publishing roles.

## Overview

Each agent is designed to handle specific aspects of blog content creation, review, and publication. They can be invoked independently or as part of a coordinated workflow.

## Available Agents

### 1. **Technical Editor** (`technical-editor.md`)
Reviews blog posts for technical accuracy, grammar, style consistency, and clarity.

**When to use**: After initial draft is complete, before SEO optimization.

**Key capabilities**:
- Content structure review
- Technical accuracy verification
- Style guide enforcement (Strunk & White + Zinsser)
- Grammar and clarity improvements
- SEO frontmatter validation

### 2. **SEO Specialist** (`seo-specialist.md`)
Optimizes blog posts for search engine visibility while maintaining natural content.

**When to use**: After content is finalized, before publication.

**Key capabilities**:
- Title and description optimization
- Keyword research and placement
- Tag and category management
- Content quality for SEO
- Technical SEO validation

### 3. **Content Strategist** (`content-strategist.md`)
Plans blog content strategy, identifies topic opportunities, and maintains editorial direction.

**When to use**: Before writing starts, during content planning.

**Key capabilities**:
- Content gap analysis
- Topic ideation
- Audience analysis
- Series planning
- Editorial calendar management

### 4. **Code Reviewer** (`code-reviewer.md`)
Reviews all code examples, scripts, and technical implementations for accuracy and best practices.

**When to use**: When post contains code examples, before publication.

**Key capabilities**:
- Code accuracy verification
- Best practices review (PowerShell, Bash, YAML, etc.)
- Code explanation quality
- Code block formatting
- Security and performance checks

### 5. **Image and Media Manager** (`image-media-manager.md`)
Manages blog post images, ensuring proper formatting, optimization, and accessibility.

**When to use**: When adding images to posts, before publication.

**Key capabilities**:
- Image organization and storage
- Image include syntax validation
- Alt text quality review
- Cloudinary integration verification
- Accessibility compliance

### 6. **Publishing Workflow Manager** (`publishing-workflow-manager.md`)
Orchestrates the complete publishing workflow, ensuring all quality gates are passed.

**When to use**: Before final publication, to coordinate all specialists.

**Key capabilities**:
- Pre-publication checklist management
- Quality assurance coordination
- Jekyll build validation
- Series management
- Post-publication verification

## Typical Workflow

### For a New Blog Post:

1. **Planning Phase**
   - **Content Strategist**: Identify topic, plan outline, check for content gaps

2. **Writing Phase**
   - Author writes initial draft with `published: false`

3. **Review Phase** (can be parallel):
   - **Technical Editor**: Review for accuracy, style, and clarity
   - **Code Reviewer**: Test and validate all code examples
   - **Image Manager**: Verify all images are properly formatted

4. **Optimization Phase**:
   - **SEO Specialist**: Optimize title, description, keywords, tags

5. **Publication Phase**:
   - **Publishing Workflow Manager**: Run final checklist, build test, publish

6. **Post-Publication**:
   - **Publishing Workflow Manager**: Verify build, check rendering

### For a Multi-Part Series:

1. **Content Strategist**: Plan the entire series structure
2. Follow standard workflow for each part
3. **Publishing Workflow Manager**: Ensure proper cross-linking between parts

## How to Invoke Agents

These agents are designed to work with GitHub Copilot's custom agent system. In GitHub Copilot chat or during code review:

```
@technical-editor review this blog post for style and accuracy
@seo-specialist optimize the SEO for this post
@code-reviewer verify the PowerShell examples in this post
@image-media-manager check all images have proper alt text
@content-strategist suggest related topics for this post
@publishing-workflow-manager run the pre-publication checklist
```

## Agent Coordination

Agents can work together:

```
@publishing-workflow-manager coordinate a full review of this post
```

This will invoke all relevant specialists in the proper order.

## Customization

Each agent profile can be customized for specific needs:
- Edit the agent's `.md` file
- Modify responsibilities, checklists, or workflows
- Add domain-specific knowledge
- Include additional tools or MCP servers

## Reference Documentation

All agents reference:
- `.github/copilot-instructions.md` - Repository standards
- `.github/instructions/writers-guide.instructions.md` - Detailed writing guide
- Existing posts in `_posts/` - Style consistency examples

## Blog Technology Stack

- Jekyll 3.9.0 (static site generator)
- GitHub Pages (hosting)
- Neo-HPSTR theme (customized)
- Cloudinary (image optimization and OG images)
- Giscus (comments)
- Google Analytics (G-4DS8LE3MB2)

## Content Focus Areas

- PowerShell automation and scripting
- Azure DevOps and CI/CD
- AI/ML tools and integration
- Web development (Jekyll, React)
- Developer productivity and workflows

---

**Note**: These agents are designed specifically for this blog repository but can be adapted for other Jekyll or static site blogs with similar workflows.
