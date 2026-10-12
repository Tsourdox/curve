#!/bin/sh
# Static site: compile in a throwaway container, then publish only the
# files the page needs into dist/, which Caddy serves.
set -e
git pull --ff-only
docker run --rm -v "$PWD":/app -w /app node:24-slim sh -c "npm ci && npm run build"
rm -rf dist.new && mkdir dist.new
cp -r index.html favicon.ico assets build dist.new/
rm -rf dist && mv dist.new dist
