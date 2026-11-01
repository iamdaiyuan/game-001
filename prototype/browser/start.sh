#!/usr/bin/env bash
cd "$(dirname "$0")"
echo "小城烟火 Demo: http://127.0.0.1:4173"
python3 -m http.server 4173
