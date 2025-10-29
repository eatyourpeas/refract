#!/usr/bin/env node

/**
 * Extract standalone game from Meteor version
 * This script transforms the Meteor game code into a standalone HTML5 game
 */

const fs = require("fs");
const path = require("path");

console.log("🎮 Extracting standalone game from Meteor version...\n");

// Read the Meteor client code
const meteorCode = fs.readFileSync("client/main.js", "utf8");

// Extract game data arrays (lines 1-260 approximately)
const dataArraysMatch = meteorCode.match(
  /\/\/ Data arrays for game[\s\S]*?negativeSnellen3 = \[[\s\S]*?\];/
);
const dataArrays = dataArraysMatch ? dataArraysMatch[0] : "";

// Extract the Template.refract.rendered initialization code
const templateRenderedMatch = meteorCode.match(
  /Template\.refract\.rendered = function \(\) \{[\s\S]*?loadCreateJS\(\);\s*\}\s*\};/
);
let initCode = "";
if (templateRenderedMatch) {
  initCode = templateRenderedMatch[0];
  // Remove Template wrapper and convert to standalone init function
  initCode = initCode
    .replace(
      "Template.refract.rendered = function () {",
      "function initializeRefractGame() {"
    )
    .replace(
      /this\.find\("#updateLabel"\)/g,
      'document.getElementById("updateLabel")'
    )
    .replace(
      /this\.find\("#specsCanvas"\)/g,
      'document.getElementById("specsCanvas")'
    )
    .replace(/if \(!this\._rendered\) \{/, "// Initialize game")
    .replace(/\}\s*\};$/, "}"); // Remove the extra closing brace from Template wrapper
}

// Extract game functions (everything after Template definitions)
// We'll find where the game functions start (after Template.refract.rendered)
const gameFunctionsStart = meteorCode.indexOf("function thisImageHasLoaded");
const gameFunctions = meteorCode.substring(gameFunctionsStart);

// Transform Meteor-specific code to standalone
let standaloneCode = `
// Standalone Refract Game
// Extracted from Meteor version - auto-generated, do not edit manually

// Global variables used by the game
var canvas, updateLabel, queue, snellenImage;
var stage, subStage, snellen_chart, animationspecs, baizeTray;
var plusLens, plusLensHitArea, minusLens, minusLensHitArea;
var restartbutton, restartbutton_black, submitbutton;
var lensesremaining, lensesremaining_black, lensesused, lensesused_black;
var snellen_text, lensContainer, positiveText, negativeText;
var clockText, diopterTotalLabel, directionsLabel;
var lensesUsedText, lensesRemainingText, lensesUsedContainer, lensesRemainingContainer;
var completedText, completedSubText, completedTextContainer;
var eyeCandyText, allCandyContainers, allLensesContainer;
var lensesLeftContainer, hitArea;
var started, startTime, addition, diopters, netDiopters, firstTime, myTotalDiopters;
var update, fadeFlag, lensInPlace, updateScreenSize, blurTick, candyTick;
var lensesInPlace = [];
var candyContainers = [];
var slideSound;
var sugar_cane, sugar_cane_filled, eye_candy_spritesheet;
var blink001, blink002, blink003, blink004, blink005;

${dataArrays}

// Simple state manager (replaces Meteor Session)
const GameState = {
  _state: {},
  get(key) {
    return this._state[key];
  },
  set(key, value) {
    this._state[key] = value;
    return value;
  },
  setDefault(key, value) {
    if (this._state[key] === undefined) {
      this._state[key] = value;
    }
  }
};

// Replace Session with GameState
const Session = GameState;

// Mock Meteor methods for standalone version
const Meteor = {
  call: function(method, ...args) {
    const callback = args[args.length - 1];
    if (typeof callback === 'function') {
      // In standalone mode, just log scores
      console.log('Demo mode - score not saved:', method, args[0]);
      callback(null, { success: true });
    }
  },
  startup: function(fn) {
    // Run immediately in standalone version
    if (typeof fn === 'function') fn();
  },
  user: function() {
    // Return a demo user for standalone mode
    return {
      profile: {
        name: 'Demo Player'
      },
      _id: 'demo-user-id'
    };
  },
  userId: function() {
    return 'demo-user-id';
  }
};

${initCode}

${gameFunctions}

// Auto-initialize game when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeRefractGame);
} else {
  // DOMContentLoaded already fired
  initializeRefractGame();
}
`;

// Transform bootbox dialogs to be demo-friendly
console.log("🔧 Transforming dialogs for demo mode...");

// Update the "Save Score" button text
standaloneCode = standaloneCode.replace(
  /"Save Score"/g,
  '"Continue (Demo Mode)"'
);

// Update the dialog message to indicate demo mode
standaloneCode = standaloneCode.replace(
  /Save your score \(if you want to\), and then click restart/g,
  "This is a demo - scores are not saved. Click continue to restart"
);

// Comment out the saveTheTime call in the success callback
standaloneCode = standaloneCode.replace(
  /saveTheTime\(finalscore\);/g,
  "// saveTheTime(finalscore); // Disabled in demo mode"
);

// Fix asset paths for GitHub Pages (remove leading slashes for relative paths)
standaloneCode = standaloneCode.replace(/src: "\/img\//g, 'src: "img/');
standaloneCode = standaloneCode.replace(/src: "\/sounds\//g, 'src: "sounds/');
standaloneCode = standaloneCode.replace(/\.src = "\/img\//g, '.src = "img/');

// Create output directory structure
const outputDir = "demo-build";
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Create js directory
if (!fs.existsSync(path.join(outputDir, "js"))) {
  fs.mkdirSync(path.join(outputDir, "js"), { recursive: true });
}

// Write standalone JS to js/ folder
fs.writeFileSync(path.join(outputDir, "js/refract-game.js"), standaloneCode);

// Create standalone HTML
const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Refract - Eye Game Demo</title>
  
  <!-- Bootstrap 3 CSS -->
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
  
  <!-- Google Fonts -->
  <link href='https://fonts.googleapis.com/css?family=Oxygen:400,300,700|Roboto:400,100|Oxygen+Mono' rel='stylesheet' type='text/css'>
  
  <link rel="icon" type="image/x-icon" href="img/favicon.ico">
  <link rel="stylesheet" href="css/refract.css">
  <link rel="stylesheet" href="css/fonts.css">
  <style>
    body {
      padding: 0;
      margin: 0;
      overflow-x: hidden;
    }
    .demo-banner {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 15px;
      text-align: center;
      font-family: 'Oxygen', sans-serif;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      margin: 0 0 15px 0;
    }
    .demo-banner h3 {
      margin: 0 0 5px 0;
      font-size: 1.2em;
    }
    .demo-banner p {
      margin: 0;
      font-size: 0.9em;
      opacity: 0.9;
    }
    .demo-banner a {
      color: #FFD700;
      text-decoration: underline;
    }
    #canvasWrapper {
      width: 100%;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f5f5f5;
    }
  </style>
</head>
<body>
  <!-- Rotation message for mobile portrait -->
  <div class="rotation-message">
    <svg class="rotate-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
      <path d="M8 21h8"></path>
      <path d="M12 17v4"></path>
      <path d="M7 7l10 10"></path>
      <path d="M17 7l-10 10"></path>
    </svg>
    <h2>📱 Please Rotate Your Device</h2>
    <p>This game is optimized for landscape mode. Please rotate your device and refresh the page to continue playing.</p>
  </div>
  
  <div class="demo-banner">
    <h3>🎮 Refract Game - Demo Version</h3>
    <p>Scores are not saved in this demo. <a href="https://github.com/eatyourpeas/refract" target="_blank">Visit our Github</a> to view the code for the larger project that has a leaderboard!</p>
  </div>
  
  <div id="canvasWrapper">
    <div id="canvascontainer">
      <canvas id="specsCanvas" width="1200" height="800"></canvas>
      <div id="updateLabel"></div>
    </div>
  </div>

  <!-- jQuery (required by Bootstrap and Bootbox) -->
  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
  
  <!-- Bootstrap 3 JS -->
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
  
  <!-- Bootbox (for modal dialogs) -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/bootbox.js/5.5.2/bootbox.min.js"></script>
  
  <!-- CreateJS for game engine -->
  <script src="js/createjs-2015.11.26.min.js"></script>
  
  <!-- Game code -->
  <script src="js/refract-game.js"></script>
  
  <script>
    // Initialize game when page loads
    window.addEventListener('DOMContentLoaded', function() {
      console.log('🎮 Starting Refract Game (Demo Version)');
      // The game auto-initializes from refract-game.js
      // The game will auto-initialize from refract-game.js
    });
  </script>
</body>
</html>
`;

fs.writeFileSync(path.join(outputDir, "index.html"), html);

// Read and convert LESS to CSS (simple version - in production use a LESS compiler)
let css = "";
if (fs.existsSync("client/refract.less")) {
  css = fs.readFileSync("client/refract.less", "utf8");
  // Simple LESS variable replacement (for production, use proper LESS compiler)
  css = css.replace(/@(\w+):\s*([^;]+);/g, "/* $1: $2 */");
}

if (!fs.existsSync(path.join(outputDir, "css"))) {
  fs.mkdirSync(path.join(outputDir, "css"), { recursive: true });
}
fs.writeFileSync(path.join(outputDir, "css/refract.css"), css);

// Copy fonts.css
if (fs.existsSync("public/css/fonts.css")) {
  fs.copyFileSync(
    "public/css/fonts.css",
    path.join(outputDir, "css/fonts.css")
  );
}
