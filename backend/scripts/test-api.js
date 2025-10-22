const axios = require("axios");

const BASE_URL = process.env.API_BASE_URL || "http://localhost:5000";
const FIN_YEAR = "2024-2025";

const colors = {
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  reset: "\x1b[0m",
};

async function testEndpoint(name, url, expectedStatus = 200) {
  try {
    console.log(`\n${colors.yellow}Testing: ${name}${colors.reset}`);
    console.log(`URL: ${url}`);

    const startTime = Date.now();
    const response = await axios.get(url);
    const duration = Date.now() - startTime;

    if (response.status === expectedStatus) {
      console.log(`${colors.green} PASS${colors.reset} (${duration}ms)`);
      console.log(
        `Response:`,
        JSON.stringify(response.data, null, 2).substring(0, 200) + "..."
      );
      return true;
    } else {
      console.log(
        `${colors.red}FAIL${colors.reset} - Status: ${response.status}`
      );
      return false;
    }
  } catch (error) {
    console.log(`${colors.red}FAIL${colors.reset} - Error: ${error.message}`);
    if (error.response) {
      console.log(`Status: ${error.response.status}`);
      console.log(`Data:`, error.response.data);
    }
    return false;
  }
}

async function runTests() {
  console.log("═══════════════════════════════════════════════════");
  console.log("MGNREGA API Testing Suite");
  console.log("═══════════════════════════════════════════════════");

  const tests = [
    {
      name: "Health Check",
      url: `${BASE_URL}/health`,
    },
    {
      name: "Root Endpoint",
      url: `${BASE_URL}/`,
    },
    {
      name: "Get Available Financial Years",
      url: `${BASE_URL}/api/districts/years/available`,
    },
    {
      name: "Get District List",
      url: `${BASE_URL}/api/districts/list`,
    },
    {
      name: "Get District List for Specific Year",
      url: `${BASE_URL}/api/districts/list?finYear=${FIN_YEAR}`,
    },
    {
      name: "Get All Districts for Financial Year",
      url: `${BASE_URL}/api/districts?finYear=${FIN_YEAR}`,
    },
    {
      name: "Get Specific District (LALITPUR)",
      url: `${BASE_URL}/api/districts/3140?finYear=${FIN_YEAR}`,
    },
    {
      name: "Get Latest District Data",
      url: `${BASE_URL}/api/districts/3140/latest`,
    },
    {
      name: "Get District Summary",
      url: `${BASE_URL}/api/districts/3140/summary?finYear=${FIN_YEAR}`,
    },
    {
      name: "404 Not Found Test",
      url: `${BASE_URL}/api/nonexistent`,
      expectedStatus: 404,
    },
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    const result = await testEndpoint(
      test.name,
      test.url,
      test.expectedStatus || 200
    );

    if (result) {
      passed++;
    } else {
      failed++;
    }

    // Wait a bit between requests
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  console.log("\n═══════════════════════════════════════════════════");
  console.log("Test Results:");
  console.log(`${colors.green} Passed: ${passed}${colors.reset}`);
  console.log(`${colors.red} Failed: ${failed}${colors.reset}`);
  console.log(`Total: ${passed + failed}`);
  console.log("═══════════════════════════════════════════════════");

  if (failed === 0) {
    console.log(`\n${colors.green}🎉 All tests passed!${colors.reset}`);
    process.exit(0);
  } else {
    console.log(
      `\n${colors.red} Some tests failed. Please check the errors above.${colors.reset}`
    );
    process.exit(1);
  }
}

// Run tests
console.log(`Testing API at: ${BASE_URL}\n`);
runTests().catch((error) => {
  console.error(`${colors.red}Fatal error:${colors.reset}`, error.message);
  process.exit(1);
});
