-- Database Schema for AgriIntel Ethiopia

-- Users/Farmers
CREATE TABLE farmers (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(15) UNIQUE NOT NULL,
    preferred_language VARCHAR(20) DEFAULT 'Amharic', -- Amharic, Oromiffa, Tigrinya
    region VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Farms
CREATE TABLE farms (
    id SERIAL PRIMARY KEY,
    farmer_id INTEGER REFERENCES farmers(id),
    land_size DECIMAL(10, 2), -- in hectares
    soil_type VARCHAR(50),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crops
CREATE TABLE crops (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    ideal_soil_type VARCHAR(50)
);

-- Recommendations
CREATE TABLE recommendations (
    id SERIAL PRIMARY KEY,
    farm_id INTEGER REFERENCES farms(id),
    crop_id INTEGER REFERENCES crops(id),
    recommendation_date DATE DEFAULT CURRENT_DATE,
    confidence_score DECIMAL(3, 2),
    reasoning TEXT
);

-- Market Prices
CREATE TABLE market_prices (
    id SERIAL PRIMARY KEY,
    crop_id INTEGER REFERENCES crops(id),
    price_per_quintal DECIMAL(10, 2),
    market_location VARCHAR(100),
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Weather Alerts
CREATE TABLE weather_alerts (
    id SERIAL PRIMARY KEY,
    region VARCHAR(50),
    alert_type VARCHAR(50), -- Frost, Drought, Heavy Rain
    severity VARCHAR(20), -- Low, Medium, High
    message TEXT,
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Initial Data Seed
INSERT INTO crops (name, ideal_soil_type) VALUES 
('Teff', 'Black soil'),
('Maize', 'Sandy loam'),
('Wheat', 'Clay loam'),
('Coffee', 'Volcanic soil');
