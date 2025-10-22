const axios = require("axios");

const BASE_URL = process.env.API_BASE_URL || "http://localhost:5000";
const FIN_YEAR = "2024-2025";
const DISTRICT_CODE = "3126"; // Lucknow

const colors = {
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
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
      console.log(`${colors.green}✅ PASS${colors.reset} (${duration}ms)`);
      console.log(
        `Response preview:`,
        JSON.stringify(response.data, null, 2).substring(0, 300) + "..."
      );
      return true;
    } else {
      console.log(
        `${colors.red}❌ FAIL${colors.reset} - Status: ${response.status}`
      );
      return false;
    }
  } catch (error) {
    console.log(
      `${colors.red}❌ FAIL${colors.reset} - Error: ${error.message}`
    );
    if (error.response) {
      console.log(`Status: ${error.response.status}`);
      console.log(`Data:`, error.response.data);
    }
    return false;
  }
}

async function runTests() {
  console.log("═══════════════════════════════════════════════════");
  console.log("🧪 MGNREGA API Phase 2 Testing Suite");
  console.log("═══════════════════════════════════════════════════");

  const tests = [
    // Historical Endpoints
    {
      section: "HISTORICAL ENDPOINTS",
      tests: [
        {
          name: "District Trends",
          url: `${BASE_URL}/api/historical/district/${DISTRICT_CODE}/trends?finYear=${FIN_YEAR}`,
        },
        {
          name: "Monthly Comparison",
          url: `${BASE_URL}/api/historical/district/${DISTRICT_CODE}/monthly-comparison?years=2023-2024,2024-2025`,
        },
        {
          name: "Performance Evolution",
          url: `${BASE_URL}/api/historical/district/${DISTRICT_CODE}/performance-evolution?finYear=${FIN_YEAR}`,
        },
        {
          name: "State Trends",
          url: `${BASE_URL}/api/historical/state/trends?finYear=${FIN_YEAR}`,
        },
      ],
    },

    // Comparison Endpoints
    {
      section: "COMPARISON ENDPOINTS",
      tests: [
        {
          name: "Compare Multiple Districts",
          url: `${BASE_URL}/api/comparison/districts?codes=3126,3140,3142&finYear=${FIN_YEAR}`,
        },
        {
          name: "Compare with State Average",
          url: `${BASE_URL}/api/comparison/district/${DISTRICT_CODE}/vs-state?finYear=${FIN_YEAR}`,
        },
        {
          name: "District Rankings",
          url: `${BASE_URL}/api/comparison/rankings?finYear=${FIN_YEAR}&metric=households_worked&limit=10`,
        },
        {
          name: "Peer Comparison",
          url: `${BASE_URL}/api/comparison/district/${DISTRICT_CODE}/peers?finYear=${FIN_YEAR}`,
        },
      ],
    },

    // Statistics Endpoints
    {
      section: "STATISTICS ENDPOINTS",
      tests: [
        {
          name: "State Statistics",
          url: `${BASE_URL}/api/stats/state?finYear=${FIN_YEAR}`,
        },
        {
          name: "District Statistics",
          url: `${BASE_URL}/api/stats/district/${DISTRICT_CODE}?finYear=${FIN_YEAR}`,
        },
        {
          name: "Dashboard Overview",
          url: `${BASE_URL}/api/stats/dashboard?finYear=${FIN_YEAR}`,
        },
        {
          name: "Demographic Statistics",
          url: `${BASE_URL}/api/stats/demographics?finYear=${FIN_YEAR}`,
        },
        {
          name: "District Demographics",
          url: `${BASE_URL}/api/stats/demographics?finYear=${FIN_YEAR}&districtCode=${DISTRICT_CODE}`,
        },
      ],
    },
  ];

  let totalPassed = 0;
  let totalFailed = 0;

  for (const section of tests) {
    console.log(
      `\n${colors.blue}═══════════════════════════════════════════════════${colors.reset}`
    );
    console.log(`${colors.blue}📂 ${section.section}${colors.reset}`);
    console.log(
      `${colors.blue}═══════════════════════════════════════════════════${colors.reset}`
    );

    for (const test of section.tests) {
      const result = await testEndpoint(
        test.name,
        test.url,
        test.expectedStatus || 200
      );

      if (result) {
        totalPassed++;
      } else {
        totalFailed++;
      }

      // Wait a bit between requests
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  }

  console.log("\n═══════════════════════════════════════════════════");
  console.log("📊 Test Results:");
  console.log(`${colors.green}✅ Passed: ${totalPassed}${colors.reset}`);
  console.log(`${colors.red}❌ Failed: ${totalFailed}${colors.reset}`);
  console.log(`Total: ${totalPassed + totalFailed}`);
  console.log("═══════════════════════════════════════════════════");

  if (totalFailed === 0) {
    console.log(`\n${colors.green}🎉 All Phase 2 tests passed!${colors.reset}`);
    console.log(
      `\n${colors.blue}✨ Phase 2 is complete and ready!${colors.reset}\n`
    );
    process.exit(0);
  } else {
    console.log(
      `\n${colors.red}⚠️  Some tests failed. Please check the errors above.${colors.reset}\n`
    );
    process.exit(1);
  }
}

// Run tests
console.log(`Testing Phase 2 API at: ${BASE_URL}\n`);
runTests().catch((error) => {
  console.error(`${colors.red}Fatal error:${colors.reset}`, error.message);
  process.exit(1);
});
