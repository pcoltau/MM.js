# Copilot Instructions

## Project Summary
MM.js is an HTML5 (canvas) port of the classic game Mortar Mayhem. The project is a static site with JavaScript game logic, assets, and data files.

## Tech Stack
- HTML, CSS, and vanilla JavaScript
- Canvas rendering (CreateJS and custom engine in lib/)

## Key Entry Points
- index.html: Main page and script loading order
- main.js: Application entry
- game.js and game*.js: Core game flow and screens
- drawing.js, gameGraphics.js: Rendering and visuals
- assets.js, colors.js: Asset and palette setup
- global.js: Shared state and constants
- menu.js, gameSetup*.js: UI flows

## Assets and Data
- gfx/: Image assets
- font/: Fonts
- data/: Game data files (.ETX, .cfg)
- original-source/: Original Mortar Mayhem source code in Turbo Pascal (reference)

## Original Source Code
- Find the original Turbo Pascal source under original-source/.

## Local Development
- Serve the repo with a simple static server, then open in a browser:
  - python -m SimpleHTTPServer
  - http://localhost:8000/

## Notes for Changes
- Keep script load order consistent with index.html.
- Prefer minimal dependencies; this is a static site.
- Do not rename data files unless you update all references.
