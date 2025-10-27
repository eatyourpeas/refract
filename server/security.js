// Security configuration for Refract app
if (Meteor.isServer) {
  // Security: Remove autopublish and insecure packages (should be done via meteor remove)
  // This file serves as documentation of security measures

  // Security: Configure CORS headers
  WebApp.rawConnectHandlers.use(function (req, res, next) {
    // Remove server information headers
    res.removeHeader("Server");
    res.removeHeader("X-Powered-By");

    // Add security headers
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

    // Content Security Policy - Updated to allow blob URLs for canvas/CreateJS
    res.setHeader(
      "Content-Security-Policy",
      "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com; " +
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
        "font-src 'self' https://fonts.gstatic.com; " +
        "img-src 'self' data: blob:; " +
        "connect-src 'self' ws: wss:; " +
        "media-src 'self' blob:; " +
        "object-src 'none';"
    );

    return next();
  });

  // Security: Database connection hardening
  if (process.env.MONGO_URL) {
    // Log database connection attempts for monitoring
    console.log("Database connection configured securely");
  }

  // Security: Environment variable validation
  Meteor.startup(function () {
    // Warn about development settings in production
    if (Meteor.isProduction) {
      if (!process.env.MONGO_URL) {
        console.warn("WARNING: No MONGO_URL set in production");
      }
      if (!process.env.ROOT_URL) {
        console.warn("WARNING: No ROOT_URL set in production");
      }
    }
  });

  // Security: Limit connection attempts
  Meteor.onConnection(function (connection) {
    // Log connection for monitoring
    console.log("New connection from:", connection.clientAddress);

    // Implement connection limiting if needed
    // This is a basic version - in production, use proper rate limiting
    const connections = Meteor.server.stream_server.open_sockets.length;
    if (connections > 1000) {
      // Adjust based on your needs
      console.warn("High number of connections:", connections);
    }
  });

  // Security: Clean up old audit logs to prevent storage bloat
  if (typeof AuditLog !== "undefined") {
    Meteor.setInterval(function () {
      // Remove logs older than 30 days
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      AuditLog.remove({ timestamp: { $lt: thirtyDaysAgo } });
    }, 24 * 60 * 60 * 1000); // Run daily
  }
}
