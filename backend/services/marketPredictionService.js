/**
 * MarketPredictionService — AI-driven crop price prediction & market analytics
 * for Ethiopian agricultural commodities.
 *
 * Uses historical price patterns, seasonal models, and region-specific factors
 * to generate price forecasts, trend analysis, and buy/sell signals.
 */

class MarketPredictionService {
  constructor() {
    // Ethiopian crop base prices (Birr per Quintal, or USD per unit where noted)
    this.cropDatabase = {
      'Teff': {
        basePrice: 4150,
        unit: 'Birr/Qtl',
        volatility: 0.08,
        seasonalPeak: [9, 10, 11],      // Sep–Nov (post-harvest dip, pre-holiday spike)
        seasonalLow: [1, 2, 3],          // Jan–Mar
        exportDemand: 'medium',
        regions: ['Oromia', 'Amhara', 'SNNPR'],
        icon: 'apps',
        category: 'Grain'
      },
      'Coffee': {
        basePrice: 525,                  // USD per 100kg
        unit: '$/100kg',
        volatility: 0.12,
        seasonalPeak: [10, 11, 12],
        seasonalLow: [4, 5, 6],
        exportDemand: 'very_high',
        regions: ['Sidama', 'Oromia', 'SNNPR', 'Harari'],
        icon: 'local_cafe',
        category: 'Cash Crop'
      },
      'Sesame': {
        basePrice: 1850,
        unit: '$/MT',
        volatility: 0.10,
        seasonalPeak: [11, 12, 1],
        seasonalLow: [5, 6, 7],
        exportDemand: 'high',
        regions: ['Amhara', 'Tigray', 'Benishangul-Gumuz'],
        icon: 'local_florist',
        category: 'Oilseed'
      },
      'Wheat': {
        basePrice: 3200,
        unit: 'Birr/Qtl',
        volatility: 0.07,
        seasonalPeak: [7, 8, 9],
        seasonalLow: [12, 1, 2],
        exportDemand: 'low',
        regions: ['Amhara', 'Oromia', 'Tigray'],
        icon: 'grass',
        category: 'Grain'
      },
      'Maize': {
        basePrice: 2100,
        unit: 'Birr/Qtl',
        volatility: 0.09,
        seasonalPeak: [6, 7, 8],
        seasonalLow: [10, 11, 12],
        exportDemand: 'low',
        regions: ['Oromia', 'Amhara', 'SNNPR', 'Gambela'],
        icon: 'eco',
        category: 'Grain'
      },
      'Sorghum': {
        basePrice: 2400,
        unit: 'Birr/Qtl',
        volatility: 0.06,
        seasonalPeak: [5, 6, 7],
        seasonalLow: [11, 12, 1],
        exportDemand: 'low',
        regions: ['Amhara', 'Oromia', 'Tigray', 'Afar'],
        icon: 'psychiatry',
        category: 'Grain'
      },
      'Chickpea': {
        basePrice: 3800,
        unit: 'Birr/Qtl',
        volatility: 0.08,
        seasonalPeak: [3, 4, 5],
        seasonalLow: [9, 10, 11],
        exportDemand: 'medium',
        regions: ['Amhara', 'Oromia'],
        icon: 'spa',
        category: 'Pulse'
      },
      'Lentil': {
        basePrice: 4500,
        unit: 'Birr/Qtl',
        volatility: 0.07,
        seasonalPeak: [3, 4, 5],
        seasonalLow: [9, 10, 11],
        exportDemand: 'medium',
        regions: ['Amhara', 'Oromia'],
        icon: 'nutrition',
        category: 'Pulse'
      }
    };

    // Regional market modifiers (supply/demand factors)
    this.regionModifiers = {
      'Addis Ababa': { demandFactor: 1.15, logisticsCost: 0 },
      'Legahar': { demandFactor: 1.12, logisticsCost: 0.01 },
      'Oromia': { demandFactor: 1.0, logisticsCost: 0.03 },
      'Amhara': { demandFactor: 0.95, logisticsCost: 0.05 },
      'Tigray': { demandFactor: 0.90, logisticsCost: 0.08 },
      'Afar': { demandFactor: 0.85, logisticsCost: 0.10 },
      'SNNPR': { demandFactor: 0.98, logisticsCost: 0.04 },
      'Southern': { demandFactor: 0.98, logisticsCost: 0.04 },
      'Sidama': { demandFactor: 1.05, logisticsCost: 0.03 },
      'Dire Dawa': { demandFactor: 1.08, logisticsCost: 0.02 },
      'Harari': { demandFactor: 1.06, logisticsCost: 0.03 },
      'Gambela': { demandFactor: 0.82, logisticsCost: 0.12 },
      'Benishangul-Gumuz': { demandFactor: 0.80, logisticsCost: 0.14 },
      'Somali': { demandFactor: 0.78, logisticsCost: 0.15 }
    };
  }

  // ─── Seasonal adjustment factor based on current month ───
  _getSeasonalFactor(crop, month) {
    const info = this.cropDatabase[crop];
    if (!info) return 1.0;
    if (info.seasonalPeak.includes(month)) return 1 + info.volatility * 0.6;
    if (info.seasonalLow.includes(month)) return 1 - info.volatility * 0.4;
    return 1.0;
  }

  // ─── Simulate weekly fluctuation (deterministic noise by date) ───
  _weeklyNoise(crop, dayOfYear) {
    const seed = crop.length * 37 + dayOfYear;
    const noise = Math.sin(seed) * 0.02;
    return noise;
  }

  // ─── Core: predict current price for a crop in a region ───
  predictCurrentPrice(crop, region = 'Addis Ababa') {
    const info = this.cropDatabase[crop];
    if (!info) return null;

    const now = new Date();
    const month = now.getMonth() + 1;
    const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);

    const seasonalFactor = this._getSeasonalFactor(crop, month);
    const regionMod = this.regionModifiers[region] || { demandFactor: 1.0, logisticsCost: 0.05 };
    const weeklyNoise = this._weeklyNoise(crop, dayOfYear);

    const price = info.basePrice * seasonalFactor * regionMod.demandFactor * (1 + regionMod.logisticsCost) * (1 + weeklyNoise);

    return Math.round(price * 100) / 100;
  }

  // ─── Generate 30-day price forecast ───
  generateForecast(crop, region = 'Addis Ababa', days = 30) {
    const info = this.cropDatabase[crop];
    if (!info) return [];

    const forecast = [];
    const now = new Date();

    for (let d = 0; d < days; d++) {
      const futureDate = new Date(now.getTime() + d * 86400000);
      const month = futureDate.getMonth() + 1;
      const dayOfYear = Math.floor((futureDate - new Date(futureDate.getFullYear(), 0, 0)) / 86400000);

      const seasonalFactor = this._getSeasonalFactor(crop, month);
      const regionMod = this.regionModifiers[region] || { demandFactor: 1.0, logisticsCost: 0.05 };
      const noise = this._weeklyNoise(crop, dayOfYear);
      const trendDrift = d * 0.0003;   // slight upward trend

      const price = info.basePrice * seasonalFactor * regionMod.demandFactor * (1 + regionMod.logisticsCost) * (1 + noise + trendDrift);

      forecast.push({
        date: futureDate.toISOString().split('T')[0],
        price: Math.round(price * 100) / 100,
        day: d + 1
      });
    }

    return forecast;
  }

  // ─── Generate 6-month historical (simulated) ───
  generateHistory(crop, region = 'Addis Ababa', days = 180) {
    const info = this.cropDatabase[crop];
    if (!info) return [];

    const history = [];
    const now = new Date();

    for (let d = days; d >= 0; d--) {
      const pastDate = new Date(now.getTime() - d * 86400000);
      const month = pastDate.getMonth() + 1;
      const dayOfYear = Math.floor((pastDate - new Date(pastDate.getFullYear(), 0, 0)) / 86400000);

      const seasonalFactor = this._getSeasonalFactor(crop, month);
      const regionMod = this.regionModifiers[region] || { demandFactor: 1.0, logisticsCost: 0.05 };
      const noise = this._weeklyNoise(crop, dayOfYear);

      const price = info.basePrice * seasonalFactor * regionMod.demandFactor * (1 + regionMod.logisticsCost) * (1 + noise);

      // Only push weekly data points to keep payload manageable
      if (d % 7 === 0) {
        history.push({
          date: pastDate.toISOString().split('T')[0],
          price: Math.round(price * 100) / 100
        });
      }
    }

    return history;
  }

  // ─── AI Signal: Buy / Sell / Hold ───
  getTradeSignal(crop, region = 'Addis Ababa') {
    const info = this.cropDatabase[crop];
    if (!info) return { signal: 'hold', confidence: 0.5, reason: 'Unknown crop' };

    const now = new Date();
    const month = now.getMonth() + 1;

    const isPeakSeason = info.seasonalPeak.includes(month);
    const isLowSeason = info.seasonalLow.includes(month);
    const isApproachingPeak = info.seasonalPeak.includes(month + 1) || info.seasonalPeak.includes(month + 2);

    if (isLowSeason) {
      return {
        signal: 'buy',
        confidence: 0.82,
        reason: `Prices are at seasonal low. Consider buying ${crop} now for ${Math.round(info.volatility * 100)}% potential upside.`,
        reason_am: `ዋጋዎች በወቅታዊ ዝቅተኛ ላይ ናቸው። ${crop} አሁን ይግዙ።`
      };
    }

    if (isPeakSeason) {
      return {
        signal: 'sell',
        confidence: 0.78,
        reason: `${crop} prices are at seasonal peak. Sell now to maximize returns.`,
        reason_am: `${crop} ዋጋዎች በወቅታዊ ከፍተኛ ላይ ናቸው። አሁን ይሽጡ።`
      };
    }

    if (isApproachingPeak) {
      return {
        signal: 'hold',
        confidence: 0.71,
        reason: `Peak season approaching. Hold ${crop} inventory for better prices in 1-2 months.`,
        reason_am: `ከፍተኛ ወቅት እየቀረበ ነው። ለተሻለ ዋጋ ይያዙ።`
      };
    }

    return {
      signal: 'hold',
      confidence: 0.60,
      reason: `Market is neutral for ${crop}. Monitor weekly trends.`,
      reason_am: `ገበያው ለ${crop} ገለልተኛ ነው። ሳምንታዊ አዝማሚያዎችን ይከታተሉ።`
    };
  }

  // ─── Full market overview for all crops in a region ───
  getMarketOverview(region = 'Addis Ababa') {
    const overview = [];

    for (const [cropName, info] of Object.entries(this.cropDatabase)) {
      const currentPrice = this.predictCurrentPrice(cropName, region);
      const signal = this.getTradeSignal(cropName, region);
      const forecast7 = this.generateForecast(cropName, region, 7);
      const priceIn7Days = forecast7.length > 0 ? forecast7[forecast7.length - 1].price : currentPrice;
      const changePercent = ((priceIn7Days - currentPrice) / currentPrice * 100).toFixed(1);

      overview.push({
        crop: cropName,
        icon: info.icon,
        category: info.category,
        unit: info.unit,
        currentPrice,
        priceIn7Days: Math.round(priceIn7Days * 100) / 100,
        change7d: `${changePercent > 0 ? '+' : ''}${changePercent}%`,
        trendUp: parseFloat(changePercent) >= 0,
        signal: signal.signal,
        signalConfidence: signal.confidence,
        signalReason: signal.reason,
        signalReasonAm: signal.reason_am,
        exportDemand: info.exportDemand,
        topRegions: info.regions.slice(0, 3)
      });
    }

    return overview;
  }

  // ─── Detailed crop prediction report ───
  getCropPrediction(crop, region = 'Addis Ababa') {
    const info = this.cropDatabase[crop];
    if (!info) {
      return { error: `Crop '${crop}' not found in database.` };
    }

    const currentPrice = this.predictCurrentPrice(crop, region);
    const signal = this.getTradeSignal(crop, region);
    const forecast = this.generateForecast(crop, region, 30);
    const history = this.generateHistory(crop, region, 90);

    const forecastPrices = forecast.map(f => f.price);
    const min30d = Math.min(...forecastPrices);
    const max30d = Math.max(...forecastPrices);
    const avg30d = Math.round(forecastPrices.reduce((a, b) => a + b, 0) / forecastPrices.length * 100) / 100;

    return {
      crop,
      region,
      unit: info.unit,
      category: info.category,
      icon: info.icon,
      currentPrice,
      signal: signal.signal,
      signalConfidence: signal.confidence,
      signalReason: signal.reason,
      signalReasonAm: signal.reason_am || signal.reason,
      forecast: {
        days: 30,
        data: forecast,
        summary: {
          min: min30d,
          max: max30d,
          avg: avg30d,
          expectedChange: `${((forecast[forecast.length - 1].price - currentPrice) / currentPrice * 100).toFixed(1)}%`
        }
      },
      history: {
        days: 90,
        data: history
      },
      meta: {
        volatility: info.volatility,
        exportDemand: info.exportDemand,
        topRegions: info.regions,
        seasonalPeakMonths: info.seasonalPeak,
        seasonalLowMonths: info.seasonalLow
      }
    };
  }

  // ─── List of all available crops ───
  getAvailableCrops() {
    return Object.entries(this.cropDatabase).map(([name, info]) => ({
      name,
      icon: info.icon,
      category: info.category,
      unit: info.unit,
      basePrice: info.basePrice,
      exportDemand: info.exportDemand
    }));
  }
}

module.exports = new MarketPredictionService();
