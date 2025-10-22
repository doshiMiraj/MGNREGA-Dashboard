const { sequelize } = require("../src/config/database");
const District = require("../src/models/District");
const { Op } = require("sequelize");
require("dotenv").config();

async function verifyData() {
  try {
    console.log("═══════════════════════════════════════════════════");
    console.log("MGNREGA Database Verification");
    console.log("═══════════════════════════════════════════════════\n");

    await sequelize.authenticate();
    console.log("Database connected\n");

    // Overall statistics
    console.log("Overall Statistics:");
    console.log("─────────────────────────────────────────────────");

    const totalRecords = await District.count();
    console.log(`   Total records: ${totalRecords.toLocaleString()}`);

    const districts = await District.findAll({
      attributes: [
        [
          sequelize.fn("DISTINCT", sequelize.col("district_name")),
          "district_name",
        ],
      ],
      raw: true,
    });
    console.log(`   Total districts: ${districts.length}`);

    const years = await District.findAll({
      attributes: [
        [sequelize.fn("DISTINCT", sequelize.col("fin_year")), "fin_year"],
      ],
      order: [[sequelize.col("fin_year"), "DESC"]],
      raw: true,
    });
    console.log(
      `   Financial years: ${years.map((y) => y.fin_year).join(", ")}`
    );

    // Data by year
    console.log("\nData by Financial Year:");
    console.log("─────────────────────────────────────────────────");
    for (const year of years) {
      const count = await District.count({
        where: { fin_year: year.fin_year },
      });
      console.log(`   ${year.fin_year}: ${count.toLocaleString()} records`);
    }

    // Top 10 districts by household participation
    console.log("\nTop 10 Districts by Households Worked (2024-2025):");
    console.log("─────────────────────────────────────────────────");
    const topDistricts = await District.findAll({
      attributes: [
        "district_name",
        [
          sequelize.fn("MAX", sequelize.col("total_households_worked")),
          "max_households",
        ],
      ],
      where: { fin_year: "2024-2025" },
      group: ["district_name"],
      order: [
        [sequelize.fn("MAX", sequelize.col("total_households_worked")), "DESC"],
      ],
      limit: 10,
      raw: true,
    });

    topDistricts.forEach((d, i) => {
      console.log(
        `   ${i + 1}. ${d.district_name.padEnd(25)} ${parseInt(
          d.max_households
        ).toLocaleString()} households`
      );
    });

    // Expenditure statistics
    console.log("\nExpenditure Statistics (2024-2025):");
    console.log("─────────────────────────────────────────────────");
    const expStats = await District.findOne({
      attributes: [
        [sequelize.fn("SUM", sequelize.col("total_exp")), "total_expenditure"],
        [sequelize.fn("AVG", sequelize.col("total_exp")), "avg_expenditure"],
        [sequelize.fn("SUM", sequelize.col("wages")), "total_wages"],
      ],
      where: { fin_year: "2024-2025" },
      raw: true,
    });

    console.log(
      `   Total expenditure: ₹${parseFloat(
        expStats.total_expenditure
      ).toLocaleString("en-IN", { maximumFractionDigits: 2 })} lakhs`
    );
    console.log(
      `   Average per district: ₹${parseFloat(
        expStats.avg_expenditure
      ).toLocaleString("en-IN", { maximumFractionDigits: 2 })} lakhs`
    );
    console.log(
      `   Total wages paid: ₹${parseFloat(expStats.total_wages).toLocaleString(
        "en-IN",
        { maximumFractionDigits: 2 }
      )} lakhs`
    );

    // Employment statistics
    console.log("\nEmployment Statistics (2024-2025):");
    console.log("─────────────────────────────────────────────────");
    const empStats = await District.findOne({
      attributes: [
        [
          sequelize.fn("SUM", sequelize.col("total_households_worked")),
          "total_households",
        ],
        [
          sequelize.fn("SUM", sequelize.col("total_individuals_worked")),
          "total_individuals",
        ],
        [
          sequelize.fn(
            "AVG",
            sequelize.col("average_days_of_employment_provided_per_household")
          ),
          "avg_days",
        ],
        [
          sequelize.fn(
            "AVG",
            sequelize.col("average_wage_rate_per_day_per_person")
          ),
          "avg_wage",
        ],
      ],
      where: { fin_year: "2024-2025" },
      raw: true,
    });

    console.log(
      `   Total households worked: ${parseInt(
        empStats.total_households
      ).toLocaleString()}`
    );
    console.log(
      `   Total individuals worked: ${parseInt(
        empStats.total_individuals
      ).toLocaleString()}`
    );
    console.log(
      `   Average employment days: ${parseFloat(empStats.avg_days).toFixed(
        1
      )} days/household`
    );
    console.log(
      `   Average wage rate: ₹${parseFloat(empStats.avg_wage).toFixed(2)}/day`
    );

    // Works completed
    console.log("\nWorks Statistics (2024-2025):");
    console.log("─────────────────────────────────────────────────");
    const worksStats = await District.findOne({
      attributes: [
        [
          sequelize.fn("SUM", sequelize.col("number_of_completed_works")),
          "completed",
        ],
        [
          sequelize.fn("SUM", sequelize.col("number_of_ongoing_works")),
          "ongoing",
        ],
        [
          sequelize.fn("SUM", sequelize.col("total_no_of_works_takenup")),
          "total_works",
        ],
      ],
      where: { fin_year: "2024-2025" },
      raw: true,
    });

    const completionRate = (
      (parseInt(worksStats.completed) / parseInt(worksStats.total_works)) *
      100
    ).toFixed(1);
    console.log(
      `   Total works taken up: ${parseInt(
        worksStats.total_works
      ).toLocaleString()}`
    );
    console.log(
      `   Completed works: ${parseInt(worksStats.completed).toLocaleString()}`
    );
    console.log(
      `   Ongoing works: ${parseInt(worksStats.ongoing).toLocaleString()}`
    );
    console.log(`   Completion rate: ${completionRate}%`);

    // Sample district details
    console.log("\nSample District Data (LUCKNOW - Feb 2024-2025):");
    console.log("─────────────────────────────────────────────────");
    const lucknow = await District.findOne({
      where: {
        district_name: "LUCKNOW",
        fin_year: "2024-2025",
        month: "Feb",
      },
    });

    if (lucknow) {
      console.log(`   District Code: ${lucknow.district_code}`);
      console.log(
        `   Households Worked: ${lucknow.total_households_worked.toLocaleString()}`
      );
      console.log(
        `   Individuals Worked: ${lucknow.total_individuals_worked.toLocaleString()}`
      );
      console.log(
        `   Total Expenditure: ₹${lucknow.total_exp.toFixed(2)} lakhs`
      );
      console.log(`   Wages: ₹${lucknow.wages.toFixed(2)} lakhs`);
      console.log(
        `   Average Wage Rate: ₹${lucknow.average_wage_rate_per_day_per_person.toFixed(
          2
        )}/day`
      );
      console.log(
        `   Completed Works: ${lucknow.number_of_completed_works.toLocaleString()}`
      );
      console.log(
        `   Ongoing Works: ${lucknow.number_of_ongoing_works.toLocaleString()}`
      );
      console.log(
        `   Women Persondays: ${lucknow.women_persondays.toLocaleString()}`
      );
      console.log(
        `   SC Persondays: ${lucknow.sc_persondays.toLocaleString()}`
      );
      console.log(
        `   Payment Timeliness: ${lucknow.percentage_payments_gererated_within_15_days.toFixed(
          2
        )}%`
      );
    }

    console.log("\n═══════════════════════════════════════════════════");
    console.log("Verification Complete!");
    console.log("═══════════════════════════════════════════════════");
    console.log("\nYour database is ready with realistic MGNREGA data!");
    console.log("You can now start the server and test the API\n");

    process.exit(0);
  } catch (error) {
    console.error("Verification failed:", error);
    process.exit(1);
  }
}

verifyData();
