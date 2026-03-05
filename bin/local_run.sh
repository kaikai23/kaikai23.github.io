#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

HOST="${HOST:-127.0.0.1}"
PORT="${PORT:-4000}"
URL="http://${HOST}:${PORT}/"

if ! command -v ruby >/dev/null 2>&1; then
  echo "Ruby not found. Install Ruby first." >&2
  exit 1
fi

if ! command -v bundle >/dev/null 2>&1; then
  echo "Bundler not found. Install Bundler first: gem install bundler" >&2
  exit 1
fi

echo "Checking gems..."
if ! bundle check >/dev/null 2>&1; then
  echo "Installing gems..."
  bundle install
fi

if command -v open >/dev/null 2>&1; then
  (sleep 2 && open "$URL") >/dev/null 2>&1 &
elif command -v xdg-open >/dev/null 2>&1; then
  (sleep 2 && xdg-open "$URL") >/dev/null 2>&1 &
fi

echo "Serving at $URL"
exec bundle exec jekyll serve --livereload --host "$HOST" --port "$PORT"
