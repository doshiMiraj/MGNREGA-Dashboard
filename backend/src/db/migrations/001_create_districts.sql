-- Create districts table
CREATE TABLE IF NOT EXISTS districts (
    id SERIAL PRIMARY KEY,
    fin_year VARCHAR(20) NOT NULL,
    month VARCHAR(10) NOT NULL,
    state_code VARCHAR(10) NOT NULL,
    state_name VARCHAR(100) NOT NULL,
    district_code VARCHAR(10) NOT NULL,
    district_name VARCHAR(100) NOT NULL,
    
    -- Budget and Employment
    approved_labour_budget BIGINT DEFAULT 0,
    average_wage_rate_per_day_per_person DECIMAL(10, 2) DEFAULT 0,
    average_days_of_employment_provided_per_household INTEGER DEFAULT 0,
    
    -- Demographics
    differently_abled_persons_worked INTEGER DEFAULT 0,
    sc_persondays BIGINT DEFAULT 0,
    sc_workers_against_active_workers INTEGER DEFAULT 0,
    st_persondays BIGINT DEFAULT 0,
    st_workers_against_active_workers INTEGER DEFAULT 0,
    women_persondays BIGINT DEFAULT 0,
    
    -- Works
    number_of_completed_works INTEGER DEFAULT 0,
    number_of_ongoing_works INTEGER DEFAULT 0,
    number_of_gps_with_nil_exp INTEGER DEFAULT 0,
    total_no_of_works_takenup INTEGER DEFAULT 0,
    
    -- Expenditure
    total_exp DECIMAL(15, 2) DEFAULT 0,
    total_adm_expenditure DECIMAL(15, 2) DEFAULT 0,
    wages DECIMAL(15, 2) DEFAULT 0,
    material_and_skilled_wages DECIMAL(15, 2) DEFAULT 0,
    
    -- Workers and Households
    total_households_worked INTEGER DEFAULT 0,
    total_individuals_worked INTEGER DEFAULT 0,
    total_no_of_active_job_cards INTEGER DEFAULT 0,
    total_no_of_active_workers INTEGER DEFAULT 0,
    total_no_of_hhs_completed_100_days_of_wage_employment INTEGER DEFAULT 0,
    total_no_of_jobcards_issued INTEGER DEFAULT 0,
    total_no_of_workers INTEGER DEFAULT 0,
    
    -- Performance Metrics
    persondays_of_central_liability_so_far BIGINT DEFAULT 0,
    percent_of_category_b_works INTEGER DEFAULT 0,
    percent_of_expenditure_on_agriculture_allied_works DECIMAL(5, 2) DEFAULT 0,
    percent_of_nrm_expenditure DECIMAL(5, 2) DEFAULT 0,
    percentage_payments_gererated_within_15_days DECIMAL(5, 2) DEFAULT 0,
    
    remarks TEXT DEFAULT 'NA',
    
    -- Metadata
    last_synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Unique constraint
    UNIQUE(district_code, fin_year, month)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_districts_state_name ON districts(state_name);
CREATE INDEX IF NOT EXISTS idx_districts_district_code ON districts(district_code);
CREATE INDEX IF NOT EXISTS idx_districts_district_name ON districts(district_name);
CREATE INDEX IF NOT EXISTS idx_districts_fin_year ON districts(fin_year);
CREATE INDEX IF NOT EXISTS idx_districts_month ON districts(month);
CREATE INDEX IF NOT EXISTS idx_districts_composite ON districts(district_code, fin_year, month);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_districts_updated_at BEFORE UPDATE ON districts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE districts IS 'Stores MGNREGA district-wise data';
COMMENT ON COLUMN districts.total_exp IS 'Total Expenditure in Lakhs';
COMMENT ON COLUMN districts.wages IS 'Wages in Lakhs';
COMMENT ON COLUMN districts.total_adm_expenditure IS 'Administrative Expenditure in Lakhs';