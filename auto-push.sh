#!/bin/bash

# Auto Git Push Script — runs every 15 minutes
# Usage: ./auto-push.sh
# Stop with: Ctrl+C

BRANCH="main"
INTERVAL=900  # 15 minutes in seconds

echo "Auto-push started. Pushing every 15 minutes. Press Ctrl+C to stop."

while true; do
  echo ""
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] Checking for changes..."

  git add .

  # Only commit+push if there are actual changes
  if git diff --cached --quiet; then
    echo "No changes to commit."
  else
    TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
    git commit -m "Auto-commit: $TIMESTAMP"
    git push origin $BRANCH
    echo "Pushed to $BRANCH at $TIMESTAMP"
  fi

  echo "Next push in 15 minutes..."
  sleep $INTERVAL
done
