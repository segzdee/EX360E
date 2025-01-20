#!/bin/bash

# Install live-server if not already installed
npm install -g live-server

# Navigate to the preview templates directory
cd preview/templates

# Start live server
live-server
