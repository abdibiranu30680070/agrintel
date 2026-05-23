
const db = require('./config/db');

const seedData = async () => {
  try {
    console.log('--- Starting Database Initialization ---');

    // 1. Create Tables (Based on db_schema.sql)
    await db.query(`
      CREATE TABLE IF NOT EXISTS farmers (
          id SERIAL PRIMARY KEY,
          full_name VARCHAR(100) NOT NULL,
          phone_number VARCHAR(15) UNIQUE NOT NULL,
          preferred_language VARCHAR(20) DEFAULT 'Amharic',
          region VARCHAR(50),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS crops (
          id SERIAL PRIMARY KEY,
          name VARCHAR(50) NOT NULL,
          type VARCHAR(50),
          ideal_soil_type VARCHAR(50),
          growth_duration VARCHAR(50),
          description TEXT
      );

      CREATE TABLE IF NOT EXISTS market_prices (
          id SERIAL PRIMARY KEY,
          crop_name VARCHAR(50),
          price_per_quintal DECIMAL(10, 2),
          change_pct VARCHAR(10),
          trend VARCHAR(10),
          market_location VARCHAR(100),
          recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Tables created successfully.');

    // 2. Seed Crops
    await db.query(`
      INSERT INTO crops (name, type, ideal_soil_type, growth_duration, description) 
      VALUES 
      ('Teff (White)', 'Cereal', 'Black soil', '90-120 days', 'Ethiopias staple food. Requires precise moisture.'),
      ('Maize', 'Cereal', 'Sandy loam', '120-150 days', 'Highly productive, requires nitrogen-rich soil.'),
      ('Coffee (Arabica)', 'Cash Crop', 'Volcanic', '3-5 years', 'Ethiopias gold. High export value.'),
      ('Wheat', 'Cereal', 'Clay loam', '100-110 days', 'Grown primarily in highlands.')
      ON CONFLICT DO NOTHING;
    `);
    console.log('✅ Crops seeded.');

    // 3. Seed Farmers
    await db.query(`
      INSERT INTO farmers (full_name, phone_number, region, preferred_language)
      VALUES 
      ('Bekele Abdi', '+251911223344', 'Oromia', 'Oromiffa'),
      ('Hanna Tesfaye', '+251912556677', 'Amhara', 'Amharic'),
      ('Mohammed Ali', '+251913889900', 'Afar', 'Amharic'),
      ('Lwam Tekle', '+251914112233', 'Tigray', 'Tigrinya')
      ON CONFLICT DO NOTHING;
    `);
    console.log('✅ Farmers seeded.');

    // 4. Seed Market Prices
    await db.query(`
      INSERT INTO market_prices (crop_name, price_per_quintal, change_pct, trend, market_location)
      VALUES 
      ('Teff', 4500, '+12%', 'up', 'Addis Ababa'),
      ('Maize', 1800, '+5%', 'up', 'Jimma'),
      ('Wheat', 3200, '-2%', 'down', 'Bahr Dar'),
      ('Coffee', 12000, '+8%', 'up', 'Hawassa')
      ON CONFLICT DO NOTHING;
    `);
    console.log('✅ Market data seeded.');

    console.log('--- Database Ready! ---');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding database:', err.message);
    process.exit(1);
  }
};

seedData();
