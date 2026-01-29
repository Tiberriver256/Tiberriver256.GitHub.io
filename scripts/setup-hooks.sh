#!/usr/bin/env bash
set -euo pipefail

# Configure this repo to use the versioned hooks in ./.githooks

git config core.hooksPath .githooks
chmod +x .githooks/pre-commit

echo "Git hooks installed (core.hooksPath=.githooks)."
