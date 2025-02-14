#!/bin/bash

# Clean up previous builds
rm -rf dist release

# Build React app
npm run build

# Build electron apps
NODE_ENV=production npm run build:electron 