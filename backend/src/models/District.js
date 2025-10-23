const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const District = sequelize.define(
  "district",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fin_year: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: "Financial Year (e.g., 2024-2025)",
    },
    month: {
      type: DataTypes.STRING(10),
      allowNull: false,
      comment: "Month name",
    },
    state_code: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    state_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    district_code: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    district_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    // Budget and Employment
    approved_labour_budget: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
    },
    average_wage_rate_per_day_per_person: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    average_days_of_employment_provided_per_household: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    // Demographics
    differently_abled_persons_worked: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    sc_persondays: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
    },
    sc_workers_against_active_workers: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    st_persondays: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
    },
    st_workers_against_active_workers: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    women_persondays: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
    },

    // Works
    number_of_completed_works: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    number_of_ongoing_works: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    number_of_gps_with_nil_exp: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    total_no_of_works_takenup: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    // Expenditure
    total_exp: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0,
      comment: "Total Expenditure in Lakhs",
    },
    total_adm_expenditure: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0,
      comment: "Administrative Expenditure in Lakhs",
    },
    wages: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0,
      comment: "Wages in Lakhs",
    },
    material_and_skilled_wages: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0,
      comment: "Material and Skilled Wages in Lakhs",
    },

    // Workers and Households
    total_households_worked: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    total_individuals_worked: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    total_no_of_active_job_cards: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    total_no_of_active_workers: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    total_no_of_hhs_completed_100_days_of_wage_employment: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    total_no_of_jobcards_issued: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    total_no_of_workers: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    // Performance Metrics
    persondays_of_central_liability_so_far: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
    },
    percent_of_category_b_works: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    percent_of_expenditure_on_agriculture_allied_works: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0,
    },
    percent_of_nrm_expenditure: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0,
    },
    percentage_payments_gererated_within_15_days: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0,
    },

    remarks: {
      type: DataTypes.TEXT,
      defaultValue: "NA",
    },

    // Metadata
    last_synced_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ["district_code", "fin_year", "month"],
        unique: true,
      },
      {
        fields: ["state_name"],
      },
      {
        fields: ["district_name"],
      },
      {
        fields: ["fin_year"],
      },
    ],
    tableName: "districts",
  }
);

module.exports = District;
