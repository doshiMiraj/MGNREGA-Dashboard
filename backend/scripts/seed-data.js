const { sequelize } = require("../src/config/database");
const District = require("../src/models/District");
require("dotenv").config();

// All 75 districts of Uttar Pradesh with their codes
const UP_DISTRICTS = [
  { code: "3101", name: "SAHARANPUR" },
  { code: "3102", name: "MUZAFFARNAGAR" },
  { code: "3103", name: "BIJNOR" },
  { code: "3104", name: "MORADABAD" },
  { code: "3105", name: "RAMPUR" },
  { code: "3106", name: "JYOTIBA PHULE NAGAR" },
  { code: "3107", name: "MEERUT" },
  { code: "3108", name: "BAGHPAT" },
  { code: "3109", name: "GHAZIABAD" },
  { code: "3110", name: "GAUTAM BUDDHA NAGAR" },
  { code: "3111", name: "BULANDSHAHR" },
  { code: "3112", name: "ALIGARH" },
  { code: "3113", name: "MAHAMAYA NAGAR" },
  { code: "3114", name: "MATHURA" },
  { code: "3115", name: "AGRA" },
  { code: "3116", name: "FIROZABAD" },
  { code: "3117", name: "MAINPURI" },
  { code: "3118", name: "BUDAUN" },
  { code: "3119", name: "BAREILLY" },
  { code: "3120", name: "PILIBHIT" },
  { code: "3121", name: "SHAHJAHANPUR" },
  { code: "3122", name: "KHERI" },
  { code: "3123", name: "SITAPUR" },
  { code: "3124", name: "HARDOI" },
  { code: "3125", name: "UNNAO" },
  { code: "3126", name: "LUCKNOW" },
  { code: "3127", name: "RAE BARELI" },
  { code: "3128", name: "FARRUKHABAD" },
  { code: "3129", name: "KANNAUJ" },
  { code: "3130", name: "ETAWAH" },
  { code: "3131", name: "AURAIYA" },
  { code: "3132", name: "KANPUR DEHAT" },
  { code: "3133", name: "KANPUR NAGAR" },
  { code: "3134", name: "JALAUN" },
  { code: "3135", name: "JHANSI" },
  { code: "3136", name: "LALITPUR" },
  { code: "3137", name: "HAMIRPUR" },
  { code: "3138", name: "MAHOBA" },
  { code: "3139", name: "BANDA" },
  { code: "3140", name: "CHITRAKOOT" },
  { code: "3141", name: "FATEHPUR" },
  { code: "3142", name: "PRATAPGARH" },
  { code: "3143", name: "KAUSHAMBI" },
  { code: "3144", name: "ALLAHABAD" },
  { code: "3145", name: "BARABANKI" },
  { code: "3146", name: "FAIZABAD" },
  { code: "3147", name: "AMBEDKAR NAGAR" },
  { code: "3148", name: "SULTANPUR" },
  { code: "3149", name: "BAHRAICH" },
  { code: "3150", name: "SHRAWASTI" },
  { code: "3151", name: "BALRAMPUR" },
  { code: "3152", name: "GONDA" },
  { code: "3153", name: "SIDDHARTHNAGAR" },
  { code: "3154", name: "BASTI" },
  { code: "3155", name: "SANT KABIR NAGAR" },
  { code: "3156", name: "MAHARAJGANJ" },
  { code: "3157", name: "GORAKHPUR" },
  { code: "3158", name: "KUSHINAGAR" },
  { code: "3159", name: "DEORIA" },
  { code: "3160", name: "AZAMGARH" },
  { code: "3161", name: "MAU" },
  { code: "3162", name: "BALLIA" },
  { code: "3163", name: "JAUNPUR" },
  { code: "3164", name: "GHAZIPUR" },
  { code: "3165", name: "CHANDAULI" },
  { code: "3166", name: "VARANASI" },
  { code: "3167", name: "SANT RAVIDAS NAGAR" },
  { code: "3168", name: "MIRZAPUR" },
  { code: "3169", name: "SONBHADRA" },
  { code: "3170", name: "ETAH" },
  { code: "3171", name: "KANSHIRAM NAGAR" },
  { code: "3172", name: "AURAIYA" },
  { code: "3173", name: "SAMBHAL" },
  { code: "3174", name: "HAPUR" },
  { code: "3175", name: "SHAMLI" },
];

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const FINANCIAL_YEARS = ["2022-2023", "2023-2024", "2024-2025"];

// Helper function to generate random number within range
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max, decimals = 2) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

// Generate realistic MGNREGA data for a district
function generateDistrictData(district, finYear, month) {
  // Base multiplier based on district (some districts are more active)
  const districtMultiplier = randomFloat(0.7, 1.3);

  // Month multiplier (more activity in certain months)
  const monthIndex = MONTHS.indexOf(month);
  const monthMultiplier = monthIndex >= 3 && monthIndex <= 9 ? 1.2 : 0.8; // Peak season

  // Year multiplier (growth over years)
  const yearMultiplier =
    finYear === "2024-2025" ? 1.15 : finYear === "2023-2024" ? 1.05 : 1.0;

  const multiplier = districtMultiplier * monthMultiplier * yearMultiplier;

  // Base values
  const baseHouseholds = randomInt(50000, 150000);
  const totalHouseholdsWorked = Math.floor(
    baseHouseholds * randomFloat(0.4, 0.7) * multiplier
  );
  const totalIndividualsWorked = Math.floor(
    totalHouseholdsWorked * randomFloat(1.2, 1.5)
  );
  const totalActiveWorkers = Math.floor(
    totalIndividualsWorked * randomFloat(1.3, 1.8)
  );
  const totalWorkers = Math.floor(totalActiveWorkers * randomFloat(1.2, 1.5));

  // Employment metrics
  const avgDaysEmployment = randomInt(35, 65);
  const persondays = totalHouseholdsWorked * avgDaysEmployment;
  const avgWageRate = randomFloat(220, 260);

  // Works
  const totalWorksTakenup = randomInt(20000, 60000);
  const completedWorks = Math.floor(totalWorksTakenup * randomFloat(0.4, 0.7));
  const ongoingWorks =
    totalWorksTakenup - completedWorks - randomInt(1000, 5000);

  // Expenditure (in lakhs)
  const wages = (persondays * avgWageRate) / 100000; // Convert to lakhs
  const materialWages = wages * randomFloat(0.25, 0.35);
  const adminExp = wages * randomFloat(0.03, 0.06);
  const totalExp = wages + materialWages + adminExp;

  // Demographics
  const scPersondays = Math.floor(persondays * randomFloat(0.15, 0.25));
  const stPersondays = Math.floor(persondays * randomFloat(0.01, 0.08));
  const womenPersondays = Math.floor(persondays * randomFloat(0.45, 0.65));
  const scWorkers = Math.floor(totalActiveWorkers * randomFloat(0.15, 0.25));
  const stWorkers = Math.floor(totalActiveWorkers * randomFloat(0.01, 0.08));

  return {
    fin_year: finYear,
    month: month,
    state_code: "31",
    state_name: "UTTAR PRADESH",
    district_code: district.code,
    district_name: district.name,

    // Budget and Employment
    approved_labour_budget: Math.floor(persondays * randomFloat(1.1, 1.3)),
    average_wage_rate_per_day_per_person: avgWageRate,
    average_days_of_employment_provided_per_household: avgDaysEmployment,

    // Demographics
    differently_abled_persons_worked: randomInt(100, 800),
    sc_persondays: scPersondays,
    sc_workers_against_active_workers: scWorkers,
    st_persondays: stPersondays,
    st_workers_against_active_workers: stWorkers,
    women_persondays: womenPersondays,

    // Works
    number_of_completed_works: completedWorks,
    number_of_ongoing_works: ongoingWorks,
    number_of_gps_with_nil_exp: randomInt(0, 15),
    total_no_of_works_takenup: totalWorksTakenup,

    // Expenditure
    total_exp: totalExp,
    total_adm_expenditure: adminExp,
    wages: wages,
    material_and_skilled_wages: materialWages,

    // Workers and Households
    total_households_worked: totalHouseholdsWorked,
    total_individuals_worked: totalIndividualsWorked,
    total_no_of_active_job_cards: Math.floor(
      baseHouseholds * randomFloat(0.6, 0.9)
    ),
    total_no_of_active_workers: totalActiveWorkers,
    total_no_of_hhs_completed_100_days_of_wage_employment: Math.floor(
      totalHouseholdsWorked * randomFloat(0.05, 0.15)
    ),
    total_no_of_jobcards_issued: Math.floor(
      baseHouseholds * randomFloat(0.8, 1.2)
    ),
    total_no_of_workers: totalWorkers,

    // Performance Metrics
    persondays_of_central_liability_so_far: persondays,
    percent_of_category_b_works: randomInt(30, 80),
    percent_of_expenditure_on_agriculture_allied_works: randomFloat(35, 65),
    percent_of_nrm_expenditure: randomFloat(10, 30),
    percentage_payments_gererated_within_15_days: randomFloat(85, 105),

    remarks: "NA",
    last_synced_at: new Date(),
  };
}

async function seedDatabase() {
  try {
    console.log("═══════════════════════════════════════════════════");
    console.log("MGNREGA Database Seeding");
    console.log("═══════════════════════════════════════════════════\n");

    // Connect to database
    await sequelize.authenticate();
    console.log("Database connected\n");

    // Clear existing data
    console.log("Clearing existing data...");
    await District.destroy({ where: {} });
    console.log("Existing data cleared\n");

    // Generate seed data
    console.log("Generating seed data...");
    console.log(`   Districts: ${UP_DISTRICTS.length}`);
    console.log(`   Financial Years: ${FINANCIAL_YEARS.length}`);
    console.log(`   Months per year: ${MONTHS.length}`);
    console.log(
      `   Total records: ${
        UP_DISTRICTS.length * FINANCIAL_YEARS.length * MONTHS.length
      }\n`
    );

    const allData = [];
    let count = 0;

    for (const finYear of FINANCIAL_YEARS) {
      console.log(`Generating data for ${finYear}...`);

      for (const month of MONTHS) {
        for (const district of UP_DISTRICTS) {
          const data = generateDistrictData(district, finYear, month);
          allData.push(data);
          count++;

          // Show progress every 100 records
          if (count % 100 === 0) {
            process.stdout.write(`   Progress: ${count} records generated\r`);
          }
        }
      }
      console.log(
        `   ${finYear} complete (${
          UP_DISTRICTS.length * MONTHS.length
        } records)`
      );
    }

    console.log(`\nTotal records generated: ${allData.length}\n`);

    // Insert data in batches
    console.log("Inserting data into database...");
    const batchSize = 500;
    let inserted = 0;

    for (let i = 0; i < allData.length; i += batchSize) {
      const batch = allData.slice(i, i + batchSize);
      await District.bulkCreate(batch, {
        updateOnDuplicate: Object.keys(District.rawAttributes).filter(
          (key) => !["id", "created_at", "updated_at"].includes(key)
        ),
      });
      inserted += batch.length;
      process.stdout.write(
        `   Progress: ${inserted}/${allData.length} records inserted\r`
      );
    }

    console.log(`\nAll records inserted successfully!\n`);

    // Verify data
    console.log("Verifying data...");
    const totalRecords = await District.count();
    const distinctDistricts = await District.count({
      distinct: true,
      col: "district_code",
    });
    const distinctYears = await District.count({
      distinct: true,
      col: "fin_year",
    });

    console.log(`   Total records: ${totalRecords}`);
    console.log(`   Districts: ${distinctDistricts}`);
    console.log(`   Financial years: ${distinctYears}`);

    // Sample data
    console.log("\nSample data:");
    const sample = await District.findOne({
      where: { district_name: "LUCKNOW", fin_year: "2024-2025", month: "Feb" },
    });

    if (sample) {
      console.log(`   District: ${sample.district_name}`);
      console.log(`   Year: ${sample.fin_year}`);
      console.log(`   Month: ${sample.month}`);
      console.log(
        `   Households worked: ${sample.total_households_worked.toLocaleString()}`
      );
      console.log(
        `   Total expenditure: ₹${parseFloat(sample.total_exp).toFixed(
          2
        )} lakhs`
      );
      console.log(
        `   Average wage: ₹${parseFloat(
          sample.average_wage_rate_per_day_per_person
        ).toFixed(2)}/day`
      );
    }

    console.log("\n═══════════════════════════════════════════════════");
    console.log("Database seeding completed successfully!");
    console.log("═══════════════════════════════════════════════════");
    console.log("\nYou can now test the API endpoints:");
    console.log("   GET /api/districts/list");
    console.log("   GET /api/districts?finYear=2024-2025");
    console.log("   GET /api/districts/3126?finYear=2024-2025  (Lucknow)");
    console.log("   GET /api/districts/3126/summary?finYear=2024-2025");
    console.log("\nStart the server: npm run dev\n");

    process.exit(0);
  } catch (error) {
    console.error("\nSeeding failed:", error);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run seeding
seedDatabase();
