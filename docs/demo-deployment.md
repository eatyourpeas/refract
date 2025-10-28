# Automated Demo Deployment

## Overview

This project uses an automated workflow to extract the game from the Meteor application and deploy a standalone demo version to GitHub Pages.

## How It Works

### 1. **Single Source of Truth**

- The **main branch** contains the full Meteor application
- Game code lives in `client/main.js`
- Assets are in `public/` folder

### 2. **Automatic Extraction**

When you push to `main` branch:

- GitHub Action runs `scripts/extract-standalone-game.js`
- This script:
  - Extracts game logic from `client/main.js`
  - Replaces `Session` with a simple state manager
  - Mocks `Meteor.call()` for standalone operation
  - Creates `index.html` for the game
  - Converts LESS to CSS

### 3. **Asset Copying**

The workflow copies all game assets:

- ✅ `public/js/createjs-2015.11.26.min.js`
- ✅ `public/img/*` (all game images)
- ✅ `public/sounds/*` (game sounds)
- ✅ `public/fonts/*` (custom fonts)
- ✅ `public/css/fonts.css`


### 5. **GitHub Pages**

- The extracted bundle from the `main` branch is deployed to GitHub Pages
- Accessible at: `https://eatyourpeas.github.io/refract/`

## Workflow Trigger

The deployment runs automatically on:

- Push to `main` branch
- Manual trigger via GitHub Actions UI

## Manual Deployment

To manually trigger a deployment:

1. Go to your repository on GitHub
2. Click "Actions" tab
3. Select "Deploy Demo to GitHub Pages"
4. Click "Run workflow"

## Local Testing

To test the extraction locally:

```bash
# Run the extraction script
node scripts/extract-standalone-game.js

# This creates demo-build/ folder
# Open demo-build/index.html in a browser
# (You'll need a local server for assets to load)

# Quick local server:
cd demo-build
python3 -m http.server 8000
# Then open http://localhost:8000
```

## Benefits

✅ **One Codebase**: Maintain only the Meteor version
✅ **Auto-Deploy**: Push changes → Demo updates automatically  
✅ **No Duplicates**: No manual syncing between versions
✅ **Always In Sync**: Demo is always built from latest Meteor code
✅ **Easy Updates**: Fix bugs once, both versions benefit

## Architecture

```
Meteor Version (source)          Standalone Demo (generated)
━━━━━━━━━━━━━━━━━━━━━━━         ━━━━━━━━━━━━━━━━━━━━━━━━━━━
client/main.js                   index.html
  ├─ Session.get/set      →       ├─ GameState.get/set
  ├─ Meteor.call()        →       ├─ console.log (mock)
  ├─ Template events      →       └─ Direct event listeners
  └─ Blaze templates              
                                  refract-game.js
server/main.js                     ├─ Game data arrays
  ├─ Collections          →        ├─ Game functions
  ├─ Methods             →        └─ State manager (no server)
  └─ Publications                 
                                  css/refract.css
public/                            ├─ Compiled from LESS
  ├─ img/               →        └─ Standalone styles
  ├─ sounds/            →        
  ├─ fonts/             →        [Assets copied as-is]
  └─ js/                →        
```

## Maintenance

### Updating the Game

1. Make changes to `client/main.js` in Meteor version
2. Test in Docker
3. Commit and push
4. GitHub Actions automatically updates demo

### Troubleshooting

**Demo not deploying?**

- Check GitHub Actions tab for errors
- Ensure GitHub Pages is enabled (Settings → Pages)
- Verify `gh-pages` branch exists

**Game not working in demo?**

- Check browser console for errors
- Verify assets loaded (Network tab)
- Test extraction locally first

**Want to customize demo HTML/CSS?**

- Edit `scripts/extract-standalone-game.js`
- Modify the HTML template in that file
- Push changes → workflow runs with new template

## Future Improvements

- [ ] Use proper LESS compiler in extraction script
- [ ] Add source maps for debugging
- [ ] Minify JS/CSS for production
- [ ] Add offline/PWA support
- [ ] Generate different game variations
