#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."

# Use the platform's proxy for Electron and Node's HTTPS artifact downloads.
# npm rewrites the mirror host in memory; the source lockfile is unchanged.
export ELECTRON_GET_USE_PROXY=1
export NODE_USE_ENV_PROXY=1
export XDG_CACHE_HOME=/workspace/.cache
npm ci --registry=https://registry.npmjs.org --replace-registry-host=always \
  --cache /workspace/.npm-cache --no-audit --no-fund --fetch-retries=1
npm run fetch:sidecars -- --target linux-x64
node scripts/verify-sidecar-binaries.js prebuild:linux
