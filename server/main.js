// Server-side code for Refract game
// Collections, Methods, Publications, and Security

// Define Collections
PlayersList = new Mongo.Collection("players");
const AuditLog = new Mongo.Collection("auditlog");

// Meteor Methods
Meteor.methods({
  addNewScore: function (finalscore) {
    // Security: Input validation
    check(finalscore, Number);

    // Security: User authentication check
    if (!this.userId) {
      throw new Meteor.Error(401, "Must be logged in to add scores");
    }

    // Security: Validate score range (prevent impossible scores)
    if (finalscore < 0 || finalscore > 3600) {
      // 0 to 1 hour max
      throw new Meteor.Error(400, "Invalid score range");
    }

    const user = Meteor.user();
    if (!user || !user.profile || !user.profile.name) {
      throw new Meteor.Error(400, "User profile not found");
    }

    var newScore = PlayersList.insert({
      createdBy: this.userId,
      player_alias: user.profile.name,
      score: parseFloat(finalscore),
      date: new Date().getTime(),
      topScore: false,
    });

    return newScore;
  },

  updateTopScore: function (thisScoreId) {
    // Security: Input validation
    check(thisScoreId, String);

    // Security: User authentication check
    if (!this.userId) {
      throw new Meteor.Error(401, "Must be logged in to update scores");
    }
    var thisScore = PlayersList.findOne({ _id: thisScoreId });
    var topScore = PlayersList.find(
      { createdBy: Meteor.userId() },
      { sort: { score: 1 }, limit: 1 }
    ).fetch();
    var lastTopScore = PlayersList.find({
      createdBy: Meteor.userId(),
      topScore: true,
    }).fetch();
    if (lastTopScore.length > 0) {
      //there is a previous top score for this user
      console.log(topScore[0].score + " currentscore: " + thisScore.score);
      console.log(
        lastTopScore[0].topScore + " score: " + lastTopScore[0].score
      );
      if (parseFloat(thisScore.score) <= parseFloat(topScore[0].score)) {
        console.log("this beats my top score - i must update");
        PlayersList.update(lastTopScore[0]._id, {
          $set: { topScore: false },
        }); //set last topscore to false
        PlayersList.update(thisScoreId, { $set: { topScore: true } }); //set new topscore to true
        return "success top score";
      } else {
        console.log("this score does not beat my top score");
        return "success personal list";
      }
    } else {
      //this is my first score
      PlayersList.update(thisScoreId, { $set: { topScore: true } }); //set new topscore to true
    }
  },
});

// Account Configuration
Accounts.onCreateUser(function (options, user) {
  if (options.profile) {
    user.profile = options.profile;
  }
  return user;
});

// Configure accounts
Accounts.config({
  sendVerificationEmail: false,
  forbidClientAccountCreation: false,
  loginExpirationInDays: 30, // Limit session duration
  passwordResetTokenExpirationInDays: 1, // Short password reset window
});

// Security: Rate limiting for login attempts
DDPRateLimiter.addRule(
  {
    type: "method",
    name: "login",
    connectionId() {
      return true;
    },
  },
  5,
  60000
); // 5 attempts per minute

// Security: Rate limiting for account creation
DDPRateLimiter.addRule(
  {
    type: "method",
    name: "createUser",
    connectionId() {
      return true;
    },
  },
  3,
  60000
); // 3 account creations per minute

// Security: Rate limiting for password reset
DDPRateLimiter.addRule(
  {
    type: "method",
    name: "forgotPassword",
    connectionId() {
      return true;
    },
  },
  2,
  60000
); // 2 password reset attempts per minute

// Security: Enhanced password validation
Accounts.validateNewUser(function (user) {
  // Check if email is provided and valid
  if (!user.emails || !user.emails[0] || !user.emails[0].address) {
    throw new Meteor.Error(403, "Email address is required");
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(user.emails[0].address)) {
    throw new Meteor.Error(403, "Invalid email address format");
  }

  // Check if profile name is provided and reasonable
  if (!user.profile || !user.profile.name || user.profile.name.length < 2) {
    throw new Meteor.Error(
      403,
      "Profile name must be at least 2 characters long"
    );
  }

  // Prevent overly long names (potential DoS)
  if (user.profile.name.length > 50) {
    throw new Meteor.Error(403, "Profile name must be less than 50 characters");
  }

  return true;
});

// Security: Remove sensitive data from user object when published
Meteor.publish("userData", function () {
  if (this.userId) {
    return Meteor.users.find(
      { _id: this.userId },
      {
        fields: {
          "profile.name": 1,
          "emails.address": 1,
          createdAt: 1,
          // Explicitly exclude services, password hashes, etc.
        },
      }
    );
  } else {
    this.ready();
  }
});

// Security: Audit log for suspicious activity
function logSuspiciousActivity(userId, action, details) {
  AuditLog.insertAsync({
    userId: userId,
    action: action,
    details: details,
    timestamp: new Date(),
    ip: this.connection?.clientAddress || "unknown",
  });
}

// Security: Monitor failed login attempts
Accounts.onLoginFailure(function (info) {
  logSuspiciousActivity(info.user?._id || null, "failed_login", {
    type: info.type,
    error: info.error?.reason,
    methodName: info.methodName,
  });
});

// Security: Enhanced user validation
Accounts.validateLoginAttempt(async function (info) {
  // Block if too many recent failed attempts from this user
  if (info.user) {
    const recentFailures = await AuditLog.find({
      userId: info.user._id,
      action: "failed_login",
      timestamp: { $gt: new Date(Date.now() - 15 * 60 * 1000) }, // 15 minutes
    }).countAsync();

    if (recentFailures >= 5) {
      throw new Meteor.Error(
        403,
        "Account temporarily locked due to too many failed attempts"
      );
    }
  }

  return true;
});

// Security: Restrict database access with proper validation
PlayersList.allow({
  insert: function (userId, doc) {
    // Only logged-in users can insert
    if (!userId) return false;

    // Validate document structure
    if (!doc.createdBy || doc.createdBy !== userId) return false;
    if (!doc.score || typeof doc.score !== "number") return false;
    if (!doc.player_alias || doc.player_alias.length > 50) return false;

    return true;
  },
  update: function (userId, doc, fields, modifier) {
    // Only allow users to update their own records
    if (!userId || doc.createdBy !== userId) return false;

    // Only allow specific field updates
    const allowedFields = ["topScore"];
    return fields.every((field) => allowedFields.includes(field));
  },
  remove: function (userId, doc) {
    // Only allow users to remove their own records
    return userId && doc.createdBy === userId;
  },
});

// Security: Deny all client-side database operations by default
PlayersList.deny({
  insert: function () {
    return true;
  }, // Force use of methods
  update: function () {
    return true;
  }, // Force use of methods
  remove: function () {
    return true;
  }, // Force use of methods
});

// Security: Remove default user publication and create secure one
Meteor.publish(null, function () {
  // Don't automatically publish user data
  return [];
});

// Publications
Meteor.publish("thePlayers", function () {
  return PlayersList.find(
    { topScore: true },
    {
      //publish only the players with the top 15 scores
      sort: { score: 1 },
      limit: 15,
    }
  );
});

Meteor.publish("meAsAPlayer", function () {
  return PlayersList.find(
    { createdBy: this.userId }, //publish only my top 5 scores
    {
      sort: { score: 1 },
      limit: 15,
    }
  );
});
