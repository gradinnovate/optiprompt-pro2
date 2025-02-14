#!/bin/bash

# Clean up previous builds
rm -rf dist release

# Ensure all directories exist
mkdir -p dist
mkdir -p build
mkdir -p release

# Rebuild native modules
npm rebuild

# Ensure entitlements file exists
if [ ! -f build/entitlements.mac.plist ]; then
  cp build/entitlements.mac.plist.template build/entitlements.mac.plist
fi

# Build React app with production settings
NODE_ENV=production npm run build

# Verify build output
if [ ! -f "dist/index.html" ]; then
  echo "Build failed: index.html not found"
  exit 1
fi

# Build electron apps
NODE_ENV=production npm run build:electron 