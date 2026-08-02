#!/usr/bin/env bash
# Activate an existing harness change by number or full folder name.
# Usage:
#   ./scripts/activate-change.sh 1
#   ./scripts/activate-change.sh 001
#   ./scripts/activate-change.sh 001-bootstrap

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
HARNESS="$REPO_ROOT/harness"
CHANGES="$HARNESS/changes"
STATUS="$HARNESS/STATUS.md"
ACTIVE_FILE="$HARNESS/ACTIVE.md"

usage() {
  cat <<'EOF'
Usage: ./scripts/activate-change.sh <NNN|NNN-slug>

Examples:
  ./scripts/activate-change.sh 1
  ./scripts/activate-change.sh 001
  ./scripts/activate-change.sh 001-bootstrap

Deactivates the previous active change (status → draft), then sets the target
to active and writes harness/ACTIVE.md.
EOF
}

if [[ $# -eq 0 ]] || [[ "${1:-}" == "-h" ]] || [[ "${1:-}" == "--help" ]]; then
  usage
  [[ $# -gt 0 ]] && exit 0
  exit 1
fi

if [[ $# -ne 1 ]]; then
  echo "Unexpected extra args" >&2
  usage >&2
  exit 1
fi

ARG="$1"
FOLDER=""

if [[ "$ARG" =~ ^[0-9]{1,3}$ ]]; then
  NUM="$(printf '%03d' "$((10#$ARG))")"
  shopt -s nullglob
  matches=("$CHANGES"/"$NUM"-*)
  shopt -u nullglob
  if [[ ${#matches[@]} -eq 0 ]]; then
    echo "No change found for number: $NUM" >&2
    exit 1
  fi
  if [[ ${#matches[@]} -gt 1 ]]; then
    echo "Ambiguous number $NUM:" >&2
    for m in "${matches[@]}"; do
      echo "  $(basename "$m")" >&2
    done
    echo "Pass full folder name instead." >&2
    exit 1
  fi
  FOLDER="$(basename "${matches[0]}")"
elif [[ "$ARG" =~ ^[0-9]{3}-[a-z0-9]+([a-z0-9-]*[a-z0-9])?$ ]]; then
  FOLDER="$ARG"
else
  echo "Invalid arg: $ARG" >&2
  echo "Use number (1, 001) or full name (001-bootstrap)." >&2
  exit 1
fi

TARGET="$CHANGES/$FOLDER"

if [[ ! -d "$TARGET" ]]; then
  echo "Change not found: $TARGET" >&2
  exit 1
fi

if [[ ! -f "$TARGET/status.md" ]]; then
  echo "Missing status.md: $TARGET/status.md" >&2
  exit 1
fi

CURRENT="$(tr -d '[:space:]' < "$TARGET/status.md")"
if [[ "$CURRENT" == "done" ]] || [[ "$CURRENT" == "cancelled" ]]; then
  echo "Cannot activate change in status '$CURRENT': $FOLDER" >&2
  exit 1
fi

# Prefer ACTIVE.md; drop legacy ACTIVE file if present
if [[ -f "$HARNESS/ACTIVE" && ! -f "$ACTIVE_FILE" ]]; then
  mv "$HARNESS/ACTIVE" "$ACTIVE_FILE"
elif [[ -f "$HARNESS/ACTIVE" ]]; then
  rm -f "$HARNESS/ACTIVE"
fi
touch "$ACTIVE_FILE"

PREV_ACTIVE="$(tr -d '[:space:]' < "$ACTIVE_FILE" || true)"

shopt -s nullglob
for dir in "$CHANGES"/[0-9][0-9][0-9]-*; do
  sfile="$dir/status.md"
  if [[ -f "$sfile" ]] && [[ "$(tr -d '[:space:]' < "$sfile")" == "active" ]]; then
    prev="$(basename "$dir")"
    if [[ "$prev" != "$FOLDER" ]]; then
      printf 'draft\n' > "$sfile"
      if [[ -f "$STATUS" ]] && grep -q "| \`$prev\` |" "$STATUS"; then
        tmp="$(mktemp)"
        sed -E "s/\| \`$prev\` \| [^|]+ \|/| \`$prev\` | draft |/" "$STATUS" > "$tmp"
        mv "$tmp" "$STATUS"
      fi
      echo "Deactivated: $prev → draft"
    fi
  fi
done
shopt -u nullglob

printf 'active\n' > "$TARGET/status.md"
printf '%s\n' "$FOLDER" > "$ACTIVE_FILE"

if [[ -f "$STATUS" ]]; then
  if grep -q "| \`$FOLDER\` |" "$STATUS"; then
    tmp="$(mktemp)"
    sed -E "s/\| \`$FOLDER\` \| [^|]+ \|/| \`$FOLDER\` | active |/" "$STATUS" > "$tmp"
    mv "$tmp" "$STATUS"
  else
    echo "WARN: $FOLDER not listed in STATUS.md (status.md updated anyway)" >&2
  fi
fi

if [[ -n "$PREV_ACTIVE" ]] && [[ "$PREV_ACTIVE" == "$FOLDER" ]] && [[ "$CURRENT" == "active" ]]; then
  echo "Already active: $FOLDER"
else
  echo "Activated: harness/changes/$FOLDER"
fi
