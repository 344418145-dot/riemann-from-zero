#!/usr/bin/env bash
# Run from this source tree in a GitHub-authenticated Codex/CLI environment.
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."
command -v gh >/dev/null || { echo "GitHub CLI (gh) is unavailable" >&2; exit 2; }
gh auth status >/dev/null || { echo "GitHub account connection missing" >&2; exit 2; }
repo='344418145-dot/riemann-from-zero'
if gh repo view "$repo" >/dev/null 2>&1; then
  echo "Repository already exists: $repo; no overwrite performed" >&2
  exit 3
fi
if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  git init -b main
fi
if ! git rev-parse --verify HEAD >/dev/null 2>&1; then
  echo "No initial commit. Stage and commit reviewed project files first." >&2
  exit 4
fi
gh repo create "$repo" --private --source=. --remote=origin --push
printf 'GitHub repository ready: https://github.com/%s\n' "$repo"
