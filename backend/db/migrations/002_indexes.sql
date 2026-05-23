CREATE INDEX IF NOT EXISTS idx_vaccinations_cat_date ON vaccinations (cat_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_medical_cat_date ON medical_entries (cat_id, date DESC);
