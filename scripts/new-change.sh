#!/usr/bin/env bash
# Create a new harness change from harness/changes/_template.
# Usage:
#   ./scripts/new-change.sh 001-bootstrap
#   ./scripts/new-change.sh bootstrap              # auto id → NNN-bootstrap
#   ./scripts/new-change.sh --activate auction-list

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
HARNESS="$REPO_ROOT/harness"
CHANGES="$HARNESS/changes"
TEMPLATE="$CHANGES/_template"
STATUS="$HARNESS/STATUS.md"
ACTIVE_FILE="$HARNESS/ACTIVE.md"

ACTIVATE=0
NAME=""

usage() {
  cat <<'EOF'
Usage: ./scripts/new-change.sh [--activate] <name|NNN-name>

Examples:
  ./scripts/new-change.sh 001-bootstrap
  ./scripts/new-change.sh bootstrap
  ./scripts/new-change.sh --activate auction-list
EOF
}

for arg in "$@"; do
  case "$arg" in
    -h|--help)
      usage
      exit 0
      ;;
    --activate)
      ACTIVATE=1
      ;;
    -*)
      echo "Unknown flag: $arg" >&2
      usage >&2
      exit 1
      ;;
    *)
      if [[ -n "$NAME" ]]; then
        echo "Unexpected extra arg: $arg" >&2
        exit 1
      fi
      NAME="$arg"
      ;;
  esac
done

if [[ -z "$NAME" ]]; then
  usage >&2
  exit 1
fi

if [[ ! -d "$TEMPLATE" ]]; then
  echo "Template not found: $TEMPLATE" >&2
  exit 1
fi

if [[ "$NAME" =~ ^[0-9]{3}-[a-z0-9]+([a-z0-9-]*[a-z0-9])?$ ]]; then
  FOLDER="$NAME"
elif [[ "$NAME" =~ ^[a-z0-9]+([a-z0-9-]*[a-z0-9])?$ ]]; then
  max=0
  shopt -s nullglob
  for dir in "$CHANGES"/[0-9][0-9][0-9]-*; do
    base="$(basename "$dir")"
    num="${base%%-*}"
    if [[ "$num" =~ ^[0-9]{3}$ ]]; then
      n=$((10#$num))
      if (( n > max )); then max=$n; fi
    fi
  done
  shopt -u nullglob
  next=$((max + 1))
  FOLDER="$(printf '%03d-%s' "$next" "$NAME")"
else
  echo "Invalid name: $NAME" >&2
  echo "Use slug (auction-list) or NNN-slug (003-auction-list), lowercase." >&2
  exit 1
fi

TARGET="$CHANGES/$FOLDER"

if [[ -e "$TARGET" ]]; then
  echo "Already exists: $TARGET" >&2
  exit 1
fi

cp -R "$TEMPLATE" "$TARGET"
printf 'draft\n' > "$TARGET/status.md"

if [[ ! -f "$STATUS" ]]; then
  cat > "$STATUS" <<EOF
# Status

| Change | Status |
|---|---|
| \`$FOLDER\` | draft |

Active сейчас: см. \`harness/ACTIVE.md\`.
EOF
else
  if grep -q "| \`$FOLDER\` |" "$STATUS"; then
    echo "STATUS.md already has $FOLDER (left as-is)"
  elif grep -q '| _(пока нет)_ |' "$STATUS"; then
    tmp="$(mktemp)"
    sed "s/| _(пока нет)_ | — |/| \`$FOLDER\` | draft |/" "$STATUS" > "$tmp"
    mv "$tmp" "$STATUS"
  else
    tmp="$(mktemp)"
    awk -v row="| \`$FOLDER\` | draft |" '
      BEGIN { done=0 }
      /^\| `[a-z0-9-]+` \|/ { last=NR }
      { lines[NR]=$0; n=NR }
      END {
        if (last == 0) {
          for (i=1;i<=n;i++) print lines[i]
          print row
        } else {
          for (i=1;i<=n;i++) {
            print lines[i]
            if (i==last) print row
          }
        }
      }
    ' "$STATUS" > "$tmp"
    mv "$tmp" "$STATUS"
  fi
fi

# Prefer ACTIVE.md; drop legacy ACTIVE file if present
if [[ -f "$HARNESS/ACTIVE" && ! -f "$ACTIVE_FILE" ]]; then
  mv "$HARNESS/ACTIVE" "$ACTIVE_FILE"
elif [[ -f "$HARNESS/ACTIVE" ]]; then
  rm -f "$HARNESS/ACTIVE"
fi
touch "$ACTIVE_FILE"

if [[ "$ACTIVATE" -eq 1 ]]; then
  shopt -s nullglob
  for dir in "$CHANGES"/[0-9][0-9][0-9]-*; do
    sfile="$dir/status.md"
    if [[ -f "$sfile" ]] && [[ "$(tr -d '[:space:]' < "$sfile")" == "active" ]]; then
      printf 'draft\n' > "$sfile"
      prev="$(basename "$dir")"
      if grep -q "| \`$prev\` |" "$STATUS"; then
        tmp="$(mktemp)"
        sed -E "s/\| \`$prev\` \| [^|]+ \|/| \`$prev\` | draft |/" "$STATUS" > "$tmp"
        mv "$tmp" "$STATUS"
      fi
    fi
  done
  shopt -u nullglob
  printf 'active\n' > "$TARGET/status.md"
  printf '%s\n' "$FOLDER" > "$ACTIVE_FILE"
  if grep -q "| \`$FOLDER\` |" "$STATUS"; then
    tmp="$(mktemp)"
    sed -E "s/\| \`$FOLDER\` \| [^|]+ \|/| \`$FOLDER\` | active |/" "$STATUS" > "$tmp"
    mv "$tmp" "$STATUS"
  fi
  echo "Created and activated: harness/changes/$FOLDER"
else
  echo "Created: harness/changes/$FOLDER (status: draft)"
fi

echo "Next: fill proposal/design/tasks/verify"
