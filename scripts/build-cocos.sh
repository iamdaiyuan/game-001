#!/usr/bin/env bash
set -euo pipefail

PLATFORM="${1:-web-mobile}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
COCOS="${COCOS_CREATOR:-/Applications/Cocos/Creator/3.8.8/CocosCreator.app/Contents/MacOS/CocosCreator}"
LOG="${TMPDIR:-/tmp}/xcyh-cocos-${PLATFORM}.log"

node "$ROOT/scripts/sync-core.mjs"

"$COCOS" --project "$ROOT/apps/cocos" --build "platform=${PLATFORM};debug=true" > "$LOG" 2>&1 || true

if grep -q "build Task (${PLATFORM}) Finished" "$LOG"; then
  echo "build ok: $ROOT/apps/cocos/build/${PLATFORM}"
  exit 0
fi

echo "build failed; log: $LOG"
tail -80 "$LOG"
exit 1
