#!/bin/bash
# Navigate to the cat-app subdirectory and run the following commands:
cd cat-app
npm install
nvm install 16
nvm use 16
npm run build
# return to main folder
cd - 
