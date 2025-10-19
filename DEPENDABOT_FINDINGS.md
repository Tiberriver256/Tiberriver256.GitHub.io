# Dependabot Issues Research Findings

## Executive Summary

**You are correct!** All 7 open Dependabot PRs are for npm packages that are no longer used by your blog. These dependencies were part of the Grunt build system that you removed on **January 11, 2023** (commit 7f1125b).

## Background

Your blog originally used the **Neo-HPSTR Jekyll theme**, which included a Grunt-based build system for CSS/JS processing. The theme came with:
- `package.json` - npm package configuration
- `package-lock.json` - locked dependency versions
- `Gruntfile.js` - Grunt task configuration
- Various Grunt plugins for image optimization, JS minification, etc.

## What Changed

On **January 11, 2023**, you cleaned up the blog by:
1. Removing `package.json` and `package-lock.json` (13,600+ lines deleted!)
2. Removing `Gruntfile.js` 
3. Removing `Rakefile.rb` and `.jshintrc`
4. Simplifying to minimal, hand-written CSS and JS

The commit message was: *"Cleaning up unused files and sharing a new post"*

Your current blog now uses:
- **148 lines** of custom CSS (`assets/css/main.css`)
- **39 lines** of vanilla JavaScript (`assets/js/main.js`)
- No build process or npm dependencies

## The Dependabot PRs

All 7 open Dependabot PRs are trying to update **transitive dependencies** (dependencies of dependencies) of the Grunt build system:

1. **PR #12** - Bump async from 2.6.3 to 2.6.4 (May 2023)
   - Transitive dependency of `grunt-contrib-clean` and `grunt-contrib-watch`
   
2. **PR #11** - Bump minimist from 1.2.5 to 1.2.7 (Jan 2023)
   - Transitive dependency of Grunt ecosystem
   
3. **PR #10** - Bump qs from 6.5.2 to 6.11.0 (Dec 2022)
   - Transitive dependency of Grunt ecosystem
   
4. **PR #9** - Bump decode-uri-component from 0.2.0 to 0.2.2 (Dec 2022)
   - Transitive dependency of Grunt ecosystem
   
5. **PR #7** - Bump minimatch from 3.0.4 to 3.0.8 (Nov 2022)
   - Transitive dependency of Grunt ecosystem
   
6. **PR #5** - Bump path-parse from 1.0.6 to 1.0.7 (Aug 2021)
   - Transitive dependency of Grunt ecosystem
   
7. **PR #3** - Bump hosted-git-info from 2.8.8 to 2.8.9 (May 2021)
   - Transitive dependency of Grunt ecosystem

## Why These PRs Still Exist

Dependabot created these PRs based on branches that still contain the old `package-lock.json` file. When you removed the package files from your main branch, the Dependabot branches became orphaned - they're trying to update dependencies in files that no longer exist in your active codebase.

## Recommendation

**Safe to close all 7 Dependabot PRs.** The security vulnerabilities they address don't affect your blog since you're not using npm packages anymore.

You have three options:

1. **Close the PRs with a comment** explaining that the npm dependencies were removed in January 2023
2. **Close them with `@dependabot ignore this dependency`** to prevent future alerts
3. **Disable Dependabot for npm/yarn** in your repository settings since you no longer use npm

Your Jekyll blog uses Ruby gems (managed via Gemfile), not npm packages, so you may want to ensure Dependabot is configured to monitor Ruby dependencies instead.

## Current State Verification

✅ No `package.json` in main branch  
✅ No `package-lock.json` in main branch  
✅ No `node_modules` directory  
✅ No `Gruntfile.js`  
✅ Minimal custom CSS and JS (no build process needed)  
✅ Jekyll configured to exclude npm-related files (lines 89-91 of `_config.yml`)

Your instinct was spot on - these are indeed leftover dependencies from before you "stripped it down to just a teensy bit of CSS."
