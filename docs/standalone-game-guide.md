# Standalone Game Extraction Guide

## Goal
Create a standalone demo version of the Refract game that works without Meteor's database, authentication, or server dependencies.

## Current Architecture

### Meteor Integration Points
The game currently depends on Meteor in these ways:

1. **State Management**: `Session.get()` / `Session.set()`
   - Current level, lenses used, scores, timing
   
2. **Database**: `PlayersList` collection
   - Saving scores
   - Leaderboard display
   
3. **User Auth**: `Meteor.user()`
   - User identification for scores
   
4. **Server Methods**: `Meteor.call()`
   - `addNewScore`
   - `updateTopScore`

5. **Templates**: Blaze templating system
   - HTML rendering
   - Event handlers

## Recommended Extraction Strategy

### Phase 1: Keep Meteor Version Untouched
**Status**: ✅ Complete
- Do NOT modify `/client/main.js`
- All current functionality works

### Phase 2: Create Standalone Module in /imports
**Location**: `/imports/refract-game/`

This folder contains game code that can be copied to a demo branch without Meteor dependencies.

**Files to create**:
```
/imports/refract-game/
  README.md              # Standalone game documentation
  refract-game.html      # Pure HTML (no Blaze templates)
  refract-game.css       # Compiled from LESS
  refract-game.js        # Game engine (no Meteor globals)
  game-data.js          # Data arrays
```

### Phase 3: Meteor Version Uses Global Scope
**Current**: Game code in `/client/main.js` uses global variables (compatible with Meteor)

**Important**: Do NOT use ES6 imports in `/client/main.js` as this breaks Meteor's global scope and causes helper lookup errors.

### Phase 4: Standalone Version Uses Modules
**Future**: In demo branch, use ES6 modules freely since there's no Meteor

## Next Steps

1. ✅ Created `/imports/refract-game/` folder
2. ✅ Created `game-data.js` with exported arrays
3. ⏸️ **PAUSE** - Do not modify `/client/main.js` with imports
4. ➡️ **NEXT**: Create standalone version in `/imports/refract-game/` as a reference
5. ➡️ **THEN**: Copy to demo branch when ready

## Key Decision
**Work WITH Meteor, not against it**:
- Keep global scope in `/client` folder
- Use modules only in `/imports` (for standalone demo)
- Two separate codebases is OKAY (DRY is less important than working code)
