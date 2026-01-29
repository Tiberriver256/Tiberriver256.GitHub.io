---
applyTo: "**"
---

---

layout: post title: "Writer's Guide: Adding New Blog Posts" description: A
comprehensive guide for writers on how to create optimized blog posts for this
Jekyll site modified: 2025-01-27 tags:

- Documentation
- Writing
- SEO categories:
- Documentation

---

# Writer's Guide: Adding New Blog Posts

This guide will help you create well-structured, SEO-optimized blog posts for
this Jekyll-powered blog.

## Quick Start Checklist

- [ ] Follow the file naming convention: `YYYY-MM-DD-title-slug.md`
- [ ] Use the post template from `_templates/post`
- [ ] Write an SEO-optimized title (50-60 characters)
- [ ] Craft a compelling description (150-160 characters)
- [ ] Add relevant tags (2-5 tags maximum)
- [ ] Choose appropriate category
- [ ] Set publication status

## File Structure and Naming

### File Location

All blog posts go in the `_posts/` directory.

### Naming Convention

Use this exact format: `YYYY-MM-DD-title-slug.md`

**Examples from existing posts:**

- `2025-06-22-chatgpt-needs-some-humility.md`
- `2024-08-28-azure-devops-pipelines-related-work-items-monorepo.md`
- `2023-01-11-BlogImprovements.md`

**Rules:**

- Date must be in `YYYY-MM-DD` format
- Use lowercase for the title slug (except for proper nouns like
  "BlogImprovements")
- Separate words with hyphens
- Keep slug concise but descriptive

## Using the Post Template

Start with the template in `_templates/post`:

```yaml
---
published: true
layout: post
title: { { title } }
description: { { description } }
modified: { { date } }
tags:
  - { { tag } }
categories:
  - { { category } }
---
```

## Frontmatter Configuration

### Required Fields

#### `published`

- Set to `true` to publish immediately
- Set to `false` to keep as draft

#### `layout`

Always use `post` for blog posts.

#### `title`

Your blog post title. Follow these SEO best practices:

**Length Guidelines:**

- **Desktop:** 50-60 characters (600 pixels)
- **Mobile:** 50 characters maximum (500 pixels)
- **Ideal:** 6-10 words

**SEO Best Practices:**

- Place primary keyword at the beginning if it fits naturally
- Use action words that drive clicks
- Make it emotionally compelling
- Ensure it accurately reflects your content

**Good Examples:**

- "Getting the related work items for an Azure Pipeline run in a monorepo"
- "ChatGPT needs some humility"
- "Blog Improvements"

**Title Writing Tips:**

- Use powerful, emotional words
- Include clear calls-to-action for how-to posts
- Make titles scannable and easy to read
- Avoid keyword stuffing

#### `description`

This appears in search results and social media shares.

**Guidelines:**

- **Length:** 150-160 characters maximum
- **Purpose:** Expand on the title with additional context
- **Include:** Primary keyword and value proposition
- **Tone:** Match the searcher's intent

**Good Examples:**

- "Azure pipelines 'Related Work Items' feature doesn't support monorepos...
  let's find a solution!"
- "A fun experience I had with ChatGPT today that shows it is still
  overconfident"

#### `modified`

Use `YYYY-MM-DD` format for the publication date.

#### `tags`

Use 2-5 relevant tags maximum. Avoid tag spam.

**Existing tag examples:**

- Technical: `PowerShell`, `Azure DevOps`, `AI`
- Topics: `Blogging`, `Web Development`, `DevOps`

#### `categories`

Choose from existing categories or create new ones:

- `AI and Technology`
- `DevOps`
- `Web Development`
- `Documentation`

## Content Writing Guidelines

### Structure

1. **Opening:** Hook the reader immediately
2. **Problem/Context:** Clearly define what you're addressing
3. **Solution/Content:** Provide value through detailed explanation
4. **Conclusion:** Summarize key takeaways

### Code Blocks

Use fenced code blocks with language specification:

````markdown
```powershell
# Your PowerShell code here
```
````

### Images

Use the custom image include for optimized loading:

```liquid
{% include image.html path="filename.png" alt="Description" %}
```

The path should ONLY include the filename, not the full URL or the folder name.

Images should be placed in `/images/[post-slug]/` directory.

### Links

- Use descriptive link text
- Link to authoritative sources
- Include relevant internal links to other posts

## SEO Optimization

### Keyword Strategy

- Research keywords your audience uses
- Place primary keyword in title, description, and naturally throughout content
- Use 2-3 relevant keywords maximum per post
- Focus on long-tail keyword variations

### Content Quality

- Write for humans first, search engines second
- Ensure content matches the intent suggested by your title
- Provide genuine value and actionable insights
- Keep paragraphs short and scannable

### Meta Tags

The site automatically generates:

- Open Graph tags for social sharing
- Twitter Card tags
- Structured data for search engines

## Publishing Process

1. **Create the file** using the naming convention
2. **Copy the template** and fill in frontmatter
3. **Write your content** following the guidelines above
4. **Review for SEO** - check title length, description, and keyword placement
5. **Test locally** if possible
6. **Set `published: true`** when ready to go live

## Common Mistakes to Avoid

- Don't stuff keywords unnaturally
- Don't use clickbait titles that don't match content
- Don't exceed character limits for titles and descriptions
- Don't forget to set the publication date
- Don't use too many tags (stick to 2-5)
- Don't skip the description field

## Analytics and Performance

The blog uses Google Analytics to track:

- Page views and engagement
- Click-through rates from search results
- User behavior and bounce rates

Monitor these metrics to refine your writing approach over time.

# Writing style

Below is a lean-but-layered crib-sheet that braids **Strunk & White’s rules**
with **Zinsser’s craft wisdom**, refined after four Adlerian re-reads—
Elementary (grasp the gist), Inspectional (map the parts), Analytical (x-ray the
argument), Syntopical (set the two books in dialogue). Use it as a progressive
filter: start at the top of each section, move down only when the draft resists.

## 1  Non-Negotiables — Think Before Ink

| Principle           | What Strunk Stresses                         | What Zinsser Adds                                                | Fast Check                                    |
| ------------------- | -------------------------------------------- | ---------------------------------------------------------------- | --------------------------------------------- |
| **Clarity**         | “Use definite, specific, concrete language.” | “Clear thinking becomes clear writing.”                          | Restate your main idea in one plain sentence. |
| **Simplicity**      | “Omit needless words.”                       | “Strip every sentence to its cleanest components.”               | Delete 10 % of words each pass.               |
| **Positivity**      | “Put statements in positive form.”           | Assert, don’t hedge with timid qualifiers (“sort of,” “rather”). | Replace not-X with Y.                         |
| **Active Energy**   | “Use the active voice.”                      | “Make active verbs activate your sentences.”                     | Ask: _Who does what?_                         |
| **Unity of Design** | “One paragraph = one topic.”                 | Decide _one point_ you’ll leave with the reader.                 | Can you name the single takeaway?             |

## 2  Sentence Carpentry

1. **Lead with the core, end with the punch.** (Strunk Rule 18)&#x20;
2. **Verbs first; adverbs rarely.** Strong verbs make _loud_ modifiers
   redundant—e.g., “blared loudly” ⇒ “blared.”&#x20;
3. **Nix the filler clusters.** Swap “due to the fact that”→“because,” “with the
   possible exception of”→“except.”&#x20;
4. **Positive form over “not.”** “He usually came late” beats “He was not very
   often on time.”&#x20;

## 3  Paragraph Architecture

- **Topic sentence up front; sentence order proves it; last line echoes
  it.**&#x20;
- **Keep related words together**; don’t let modifiers drift from what they
  modify (Strunk Rule 16).&#x20;
- **Think small.** Narrow the scope until you can cover it _well and
  stop._&#x20;

## 4  Revision Loop — Where the Game Is Won

1. **Rewrite relentlessly.** “Rewriting is the essence of writing well.”&#x20;
2. **Bracket clutter.** Zinsser’s Yale trick: mark every word that isn’t doing
   work, then test the sentence without it.&#x20;
3. **Read aloud.** Your ear will catch logic jumps and rhythm ruts you missed on
   screen.&#x20;
4. **Cut, then cut again.** Half of most first drafts can vanish with no loss of
   meaning or voice.&#x20;

## 5  Voice & Audience

- **Be yourself—earnestly.** The “personal transaction” of warmth and humanity
  keeps readers turning pages.&#x20;
- **Respect the reader’s 30-second attention span; don’t make her work to decode
  fog.**&#x20;
- **Write to one reader, not a demographic blur.** Direct “you” can be a godsend
  in instructional prose.&#x20;


## 6  Human Voice — Avoid the AI Tell

Vale's `Humanize` rules will flag obvious patterns, but the deeper fix is habit:

1. **One anecdote per post.** A story where you failed, learned, or were surprised.
   ("Last week I clicked approve on a script that deleted a staging database...")
2. **Hedging is human.** "I think," "in my experience," "I've seen" — these signal
   a real person with limited perspective, not an oracle.
3. **Break a list.** If you have 4+ bullet points, convert one section to prose.
4. **Vary rhythm.** Short sentence. Then a longer one that meanders a bit before
   landing. Monotonous cadence reads robotic.
5. **Name names.** Specific tools, projects, or people you worked with.
   Generalities ("many teams do X") feel templated.

## 7  Quick “Red-Flag” List

| Flabby                | Tight                             |
| --------------------- | --------------------------------- |
| at this point in time | now                               |
| He stepped down       | He resigned / retired / was fired |
| very / really / quite | — (pick a stronger verb)          |
| free up, finalize     | free, finish                      |

## 8  One-Minute Final Checklist

1. Purpose clear in first 60 words?
2. Single controlling idea tracked start→finish?
3. Sentences lean, active, positive?
4. Paragraphs unified & sequenced logically?
5. Read-aloud pass done; rhythm, seams, pronouns fixed?
6. All clutter bracketed or cut?

Strunk hands you the **rules of economy and structure**; Zinsser hands you the
**craft of selection, voice, and relentless revision**. Use this sheet as a
toggle between them: if a draft breaks a Strunk rule, repair; if it keeps a rule
but still feels dead, apply Zinsser’s human test—clarity, warmth, and hard
thinking.
