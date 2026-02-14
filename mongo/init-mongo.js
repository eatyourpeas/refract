// init-mongo.js
// Creates a limited application user for the `refract` database.
// Hard-code credentials since _getEnv() isn't available in all shells
// These match the MONGO_APP_USER and MONGO_APP_PASS in docker-compose.yml

var appUser = "refract_user";
var appPass = "refract_pass";

db = db.getSiblingDB("admin");

print("Creating app user: " + appUser);

db.createUser({
  user: appUser,
  pwd: appPass,
  roles: [
    { role: "readWrite", db: "refract" },
    { role: "dbAdmin", db: "refract" },
    { role: "userAdminAnyDatabase", db: "admin" },
  ],
});

print("App user created successfully");
print("Done init-mongo.js");
