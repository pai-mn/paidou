#!/usr/bin/env bash
cd "$(dirname "$0")" || exit 1

bun run build
bun start

