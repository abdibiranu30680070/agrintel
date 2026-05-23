require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

const axios = require('axios');

// Middleware
app.use(cors());
app.use(bodyParser.json());

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

// Basic Route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to AgriIntel Ethiopia API',
    status: 'Running',
    version: '1.0.0'
  });
});

// Recommendation Endpoint
app.post('/api/recommend', async (req, res) => {
  try {
    const { region, soil_type, land_size, season } = req.body;
    
    // Forward request to AI service
    const response = await axios.post(`${AI_SERVICE_URL}/recommend`, {
      region,
      soil_type,
      land_size,
      season
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Error calling AI service:', error.message);
    res.status(500).json({ error: 'Failed to get recommendation from AI service' });
  }
});

// Market Trends Endpoint (from Database)
app.get('/api/market-trends', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM market_prices ORDER BY recorded_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching market trends:', error.message);
    res.status(500).json({ error: 'Failed to fetch market trends' });
  }
});

const db = require('./config/db');

// Farmers Registry Endpoint (from Database)
app.get('/api/farmers', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM farmers ORDER BY created_at DESC');
    if (result.rows.length > 0) {
      res.json(result.rows);
    } else {
      // Fallback to AI service if DB is empty or during transition
      const response = await axios.get(`${AI_SERVICE_URL}/farmers`);
      res.json(response.data);
    }
  } catch (error) {
    console.error('Database error, falling back to AI service:', error.message);
    try {
      const response = await axios.get(`${AI_SERVICE_URL}/farmers`);
      res.json(response.data);
    } catch (aiError) {
      res.status(500).json({ error: 'Failed to fetch farmer registry' });
    }
  }
});

// New: Register Farmer
app.post('/api/farmers', async (req, res) => {
  const { full_name, phone_number, region, preferred_language } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO farmers (full_name, phone_number, region, preferred_language) VALUES ($1, $2, $3, $4) RETURNING *',
      [full_name, phone_number, region, preferred_language]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error registering farmer:', error.message);
    res.status(500).json({ error: 'Failed to register farmer' });
  }
});

// Crops Catalog Endpoint (from Database)
app.get('/api/crops-catalog', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM crops');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching crops:', error.message);
    res.status(500).json({ error: 'Failed to fetch crop catalog' });
  }
});

const weatherService = require('./services/weatherService');
const marketPredictionService = require('./services/marketPredictionService');

// ... existing code ...

// Real-Time Weather Service (Using Advanced WeatherService)
app.get('/api/weather', async (req, res) => {
  try {
    const region = req.query.region || 'Oromia';
    const data = await weatherService.getCurrentWeather(region);
    res.json(data);
  } catch (error) {
    console.error('Weather service error:', error.message);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

// Advanced Agricultural Weather Stats
app.get('/api/weather/agri', async (req, res) => {
  try {
    const region = req.query.region || 'Oromia';
    const data = await weatherService.getAgriculturalWeather(region);
    res.json(data);
  } catch (error) {
    console.error('Agri-weather error:', error.message);
    res.status(500).json({ error: 'Failed to fetch agricultural weather' });
  }
});

// AI Q&A Endpoint
app.post('/api/ask', async (req, res) => {
  try {
    const { question, context, language } = req.body;
    
    // Prepare request payload with agricultural context
    const payload = {
      question: question,
      context: context || {},
      language: language || 'en'
    };
    
    const response = await axios.post(`${AI_SERVICE_URL}/ask`, payload);
    res.json(response.data);
  } catch (error) {
    console.error('Error in Q&A:', error.message);
    res.status(500).json({ error: 'Failed to process AI question' });
  }
});

// Community Insights Endpoint (The Network Effect)
app.get('/api/community-insights', async (req, res) => {
  try {
    const region = req.query.region || 'Oromia';
    
    // In production, this query aggregates real data from the 'recommendations' table
    // For now, we fetch a blend of DB data and regional intelligence
    const result = await db.query(
      'SELECT crop_name, COUNT(*) as popularity FROM market_prices GROUP BY crop_name ORDER BY popularity DESC'
    );
    
    const insights = {
      region: region,
      top_crops: result.rows.map(r => r.crop_name),
      nearby_alerts: [
        { type: 'Weather', message: 'Heavy rain expected in 48 hours.', severity: 'Medium' },
        { type: 'Pest', message: 'Armyworm sighted 15km North.', severity: 'High' }
      ],
      adoption_rate: '+15% this month'
    };
    
    res.json(insights);
  } catch (error) {
    console.error('Error fetching community insights:', error.message);
    res.status(500).json({ error: 'Failed to fetch community insights' });
  }
});

// Price Forecast Endpoint (from AI XGBoost Model)
app.get('/api/price-forecast', async (req, res) => {
  try {
    const crop = req.query.crop || 'Teff';
    const response = await axios.get(`${AI_SERVICE_URL}/predict-price?crop=${crop}`);
    res.json(response.data);
  } catch (error) {
    console.error('Price forecast error:', error.message);
    res.status(500).json({ error: 'Failed to fetch price forecast' });
  }
});

// All Price Predictions Endpoint (from AI ML Model)
app.get('/api/price-predictions-all', async (req, res) => {
  try {
    const response = await axios.get(`${AI_SERVICE_URL}/predict-prices-all`);
    res.json(response.data);
  } catch (error) {
    console.error('Price predictions error:', error.message);
    res.status(500).json({ error: 'Failed to fetch price predictions' });
  }
});
app.post('/api/detect-disease', async (req, res) => {
  try {
    const response = await axios.post(`${AI_SERVICE_URL}/detect-disease`);
    res.json(response.data);
  } catch (error) {
    console.error('Error detecting disease:', error.message);
    res.status(500).json({ error: 'Failed to run disease detection' });
  }
});

// Market Prediction Service Endpoints
app.get('/api/market/overview', (req, res) => {
  try {
    const region = req.query.region || 'Addis Ababa';
    const overview = marketPredictionService.getMarketOverview(region);
    res.json(overview);
  } catch (error) {
    console.error('Error fetching market overview:', error.message);
    res.status(500).json({ error: 'Failed to fetch market overview' });
  }
});

app.get('/api/market/prediction/:crop', (req, res) => {
  try {
    const crop = req.params.crop;
    const region = req.query.region || 'Addis Ababa';
    const prediction = marketPredictionService.getCropPrediction(crop, region);
    res.json(prediction);
  } catch (error) {
    console.error('Error fetching crop prediction:', error.message);
    res.status(500).json({ error: 'Failed to fetch crop prediction' });
  }
});

app.get('/api/market/signal/:crop', (req, res) => {
  try {
    const crop = req.params.crop;
    const region = req.query.region || 'Addis Ababa';
    const signal = marketPredictionService.getTradeSignal(crop, region);
    res.json(signal);
  } catch (error) {
    console.error('Error fetching trade signal:', error.message);
    res.status(500).json({ error: 'Failed to fetch trade signal' });
  }
});

app.get('/api/market/forecast/:crop', (req, res) => {
  try {
    const crop = req.params.crop;
    const region = req.query.region || 'Addis Ababa';
    const days = parseInt(req.query.days) || 30;
    const forecast = marketPredictionService.generateForecast(crop, region, days);
    res.json({ crop, region, days, forecast });
  } catch (error) {
    console.error('Error generating forecast:', error.message);
    res.status(500).json({ error: 'Failed to generate forecast' });
  }
});

app.get('/api/market/history/:crop', (req, res) => {
  try {
    const crop = req.params.crop;
    const region = req.query.region || 'Addis Ababa';
    const days = parseInt(req.query.days) || 90;
    const history = marketPredictionService.generateHistory(crop, region, days);
    res.json({ crop, region, days, history });
  } catch (error) {
    console.error('Error generating history:', error.message);
    res.status(500).json({ error: 'Failed to generate history' });
  }
});

app.get('/api/market/crops', (req, res) => {
  try {
    const crops = marketPredictionService.getAvailableCrops();
    res.json(crops);
  } catch (error) {
    console.error('Error fetching available crops:', error.message);
    res.status(500).json({ error: 'Failed to fetch available crops' });
  }
});

app.get('/api/market/current-price/:crop', (req, res) => {
  try {
    const crop = req.params.crop;
    const region = req.query.region || 'Addis Ababa';
    const price = marketPredictionService.predictCurrentPrice(crop, region);
    res.json({ crop, region, currentPrice: price });
  } catch (error) {
    console.error('Error fetching current price:', error.message);
    res.status(500).json({ error: 'Failed to fetch current price' });
  }
});

// Serve static frontend assets from frontend-web/dist
app.use(express.static(path.join(__dirname, '../frontend-web/dist')));

// Fallback to index.html for SPA routing without using wildcard path (Express v5 safe)
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(__dirname, '../frontend-web/dist/index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
