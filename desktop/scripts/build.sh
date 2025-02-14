#!/bin/bash

# Clean up previous builds
rm -rf dist release

# Clean up electron build artifacts
rm -f electron/main.js electron/*.js.map electron/*.d.ts

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

# Verify essential files
essential_files=(
  "dist/index.html"
  "dist/assets/main-*.css"
  "dist/assets/main-*.js"
  "dist/assets/firebase-*.js"
  "dist/assets/vendor-*.js"
  "dist/logo.svg"
)

for file in "${essential_files[@]}"; do
  if ! ls $file 1> /dev/null 2>&1; then
    echo "Build failed: $file not found"
    exit 1
  fi
done

# Build electron apps
NODE_ENV=production npm run build:electron 