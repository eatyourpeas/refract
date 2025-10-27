// Security Test Functions for Refract Game
// These functions test the implemented security measures
// Run tests manually in browser console: testLoginRateLimit(), testAccountCreationRateLimit(), etc.

// Use Meteor's global variables
if (Meteor.isClient) {
  // Test 1: Rate limiting for login attempts
  testLoginRateLimit = function () {
    console.log("Testing login rate limiting...");

    const testEmail = "test@example.com";
    const wrongPassword = "wrongpassword";

    // Try to exceed the rate limit (5 attempts per minute)
    for (let i = 0; i < 7; i++) {
      setTimeout(() => {
        Meteor.loginWithPassword(testEmail, wrongPassword, (error) => {
          if (error) {
            console.log(`Attempt ${i + 1}: ${error.reason}`);
          }
        });
      }, i * 1000); // Space out attempts by 1 second
    }
  };

  // Test 2: Account creation rate limiting
  testAccountCreationRateLimit = function () {
    console.log("Testing account creation rate limiting...");

    // Try to create multiple accounts quickly (limit: 3 per minute)
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const randomEmail = `test${Date.now()}${i}@example.com`;
        Accounts.createUser(
          {
            email: randomEmail,
            password: "testpassword123",
            username: `testuser${i}`,
          },
          (error) => {
            if (error) {
              console.log(`Account creation attempt ${i + 1}: ${error.reason}`);
            } else {
              console.log(`Account creation attempt ${i + 1}: Success`);
            }
          }
        );
      }, i * 1000);
    }
  };

  // Test 3: Input validation
  testInputValidation = function () {
    console.log("Testing input validation...");

    // Test with malicious input
    const maliciousInputs = [
      '<script>alert("XSS")</script>',
      '"; DROP TABLE users; --',
      "../../../etc/passwd",
      "<img src=x onerror=alert(1)>",
      "javascript:alert(document.cookie)",
    ];

    maliciousInputs.forEach((input, index) => {
      setTimeout(() => {
        Accounts.createUser(
          {
            email: `test${index}@test.com`,
            password: "validpassword123",
            username: input, // Malicious username
          },
          (error) => {
            if (error) {
              console.log(
                `Malicious input test ${index + 1}: BLOCKED - ${error.reason}`
              );
            } else {
              console.log(
                `Malicious input test ${index + 1}: ALLOWED (Security issue!)`
              );
            }
          }
        );
      }, index * 2000);
    });
  };

  // Test 4: Check security headers
  testSecurityHeaders = function () {
    console.log("Testing security headers...");

    fetch("/", {
      method: "GET",
    })
      .then((response) => {
        const headers = {
          "X-Content-Type-Options": response.headers.get(
            "X-Content-Type-Options"
          ),
          "X-Frame-Options": response.headers.get("X-Frame-Options"),
          "X-XSS-Protection": response.headers.get("X-XSS-Protection"),
          "Strict-Transport-Security": response.headers.get(
            "Strict-Transport-Security"
          ),
          "Content-Security-Policy": response.headers.get(
            "Content-Security-Policy"
          ),
        };

        console.log("Security Headers:", headers);

        // Check if essential headers are present
        const essentialHeaders = [
          "X-Content-Type-Options",
          "X-Frame-Options",
          "X-XSS-Protection",
        ];
        essentialHeaders.forEach((header) => {
          if (headers[header]) {
            console.log(`✓ ${header}: ${headers[header]}`);
          } else {
            console.log(`✗ ${header}: Missing`);
          }
        });
      })
      .catch((error) => {
        console.error("Error checking headers:", error);
      });
  };

  // Test 5: Run all security tests
  runAllSecurityTests = function () {
    console.log("Running all security tests...");
    testSecurityHeaders();
    setTimeout(testLoginRateLimit, 2000);
    setTimeout(testAccountCreationRateLimit, 10000);
    setTimeout(testInputValidation, 20000);
  };

  // Log available test functions on startup
  Meteor.startup(() => {
    console.log("🔒 Security Test Functions Available:");
    console.log("- testLoginRateLimit() - Test login rate limiting");
    console.log(
      "- testAccountCreationRateLimit() - Test account creation limits"
    );
    console.log("- testInputValidation() - Test malicious input blocking");
    console.log("- testSecurityHeaders() - Check security headers");
    console.log("- runAllSecurityTests() - Run all tests sequentially");
    console.log("Usage: Open browser console and run any function by name");
  });
}
