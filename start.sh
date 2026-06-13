#!/bin/bash
# drain startup script — auto-rebuilds if .next is missing or stale
set -e
cd /home/ubuntu/.openclaw/workspace/projects/drain

MANIFEST=".next/prerender-manifest.json"

if [ ! -f "$MANIFEST" ]; then
  echo "[drain] .next missing — building..."
  npm run build
  echo "[drain] build complete"
else
  # Check if source is newer than the build
  NEWEST_SRC=$(find app components -name "*.js" -newer "$MANIFEST" 2>/dev/null | head -1)
  if [ -n "$NEWEST_SRC" ]; then
    echo "[drain] source changed since last build — rebuilding..."
    npm run build
    echo "[drain] rebuild complete"
  else
    echo "[drain] .next is fresh — skipping build"
  fi
fi

exec npm start
