// Client-side routing using FlowRouter
// Routes should only be defined on the client

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
