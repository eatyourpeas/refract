// ============================================================================
// DEPRECATED FILE - This file has been split for Meteor 3
// ============================================================================
// Server code has been moved to: /server/main.js
// Client code has been moved to: /client/main.js
// Routes have been moved to: /client/routes.js
//
// This file can be safely deleted after confirming the app works correctly
// ============================================================================

// Simple routing without BlazeLayout - using Session to track current page
FlowRouter.route("/", {
  name: "home",
  action: function () {
    Session.set("currentPage", "home");
  },
});

FlowRouter.route("/refract", {
  name: "refract",
  action: function () {
    Session.set("currentPage", "refract");
  },
});

FlowRouter.route("/contact", {
  name: "contact",
  action: function () {
    Session.set("currentPage", "contact");
  },
});

FlowRouter.route("/about", {
  name: "about",
  action: function () {
    Session.set("currentPage", "about");
  },
});

FlowRouter.route("/leaderboard", {
  name: "leaderboard",
  action: function () {
    Session.set("currentPage", "leaderboard");
  },
});

FlowRouter.route("/rules", {
  name: "rules",
  action: function () {
    Session.set("currentPage", "rules");
  },
});

//// javascript
