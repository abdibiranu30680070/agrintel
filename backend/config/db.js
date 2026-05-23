
const { Pool } = require('pg');
require('dotenv').config();

let pool;
try {
  pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'agriintel',
    password: process.env.DB_PASSWORD || '',
    port: process.env.DB_PORT || 5432,
    connectionTimeoutMillis: 2000,
  });
} catch (e) {
  console.warn('PostgreSQL Pool could not be initialized.');
}

const dummyData = {
  farmers: [
    { id: 1, full_name: 'Bekele Abdi', phone_number: '+251911223344', region: 'Oromia', preferred_language: 'Oromiffa' },
    { id: 2, full_name: 'Hanna Tesfaye', phone_number: '+251912556677', region: 'Amhara', preferred_language: 'Amharic' },
  ],
  crops: [
    { name: 'Teff', type: 'Cereal', ideal_soil_type: 'Black soil' },
    { name: 'Maize', type: 'Cereal', ideal_soil_type: 'Sandy loam' },
  ],
  market_prices: [
    { crop_name: 'Teff', price_per_quintal: 4500, change_pct: '+12%', trend: 'up' },
    { crop_name: 'Maize', price_per_quintal: 1800, change_pct: '+5%', trend: 'up' },
  ]
};

const query = async (text, params) => {
  try {
    return await pool.query(text, params);
  } catch (err) {
    console.error('Database connection failed. Using mock data fallback.');
    
    // Simulate PG response for common queries
    if (text.includes('FROM farmers')) return { rows: dummyData.farmers };
    if (text.includes('FROM crops')) return { rows: dummyData.crops };
    if (text.includes('FROM market_prices')) return { rows: dummyData.market_prices };
    
    return { rows: [] };
  }
};

module.exports = {
  query,
  pool
};
