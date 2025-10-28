// Client entry point - loads FIRST due to Meteor's /client/lib/ convention
// Initialize RefractGameModule and set up overrides before game-ui loadss

// Use dynamic import to ensure RefractGameModule is available
// This code runs as soon as this file is loaded by Meteor
(async function initializeApp() {
  console.log("Starting async initialization...");

  try {
    s;
    const module = await import("/imports/game-module/refract-game-module.js");
    const RefractGameModule = module.RefractGameModule;

    console.log(
      "✓ RefractGameModule imported successfully:",
      typeof RefractGameModule
    );
    console.log("✓ RefractGameModule name:", RefractGameModule.name);

    // Make RefractGameModule available globally
    window.RefractGameModule = RefractGameModule;
    s;

    // Override showTheDialog to integrate with Meteor
    window.showTheDialog = function (finalscore) {
      const user = Meteor.user();
      let userName = "Player";
      if (user && user.profile && user.profile.name) {
        userName = user.profile.name;
      } else if (user && user.emails && user.emails.length > 0) {
        userName = user.emails[0].address;
      }

      bootbox.dialog({
        message:
          "Your average time to refract over " +
          Session.get("attempts") +
          " attempts was " +
          finalscore.toFixed(2).toString() +
          " seconds. Save your score (if you want to), and then click restart to begin the next level!",
        title: "Well done " + userName + "!",
        buttons: {
          success: {
            label: "Save Score",
            className: "btn-success",
            callback: function () {
              saveTheTime(finalscore);
            },
          },
          main: {
            label: "Naw. Forget it.",
            className: "btn-primary",
            callback: function () {
              console.log("forgotten");
              if (window.gameInstance) window.gameInstance.restart();
            },
          },
        },
      });
    };

    console.log("✓ showTheDialog override registered");
    console.log("✓ About to import game-ui.js...");

    // Now import game-ui.js after RefractGameModule is set up
    await import("../modules/game-ui.js");

    console.log("✓ game-ui.js imported successfully");
  } catch (error) {
    console.error("❌ ERROR in initializeApp:", error);
    console.error("Stack:", error.stack);
  }
})();
