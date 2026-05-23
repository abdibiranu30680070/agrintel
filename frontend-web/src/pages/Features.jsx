import React from 'react';
import { Leaf, CloudRain, TrendingUp, Shield, Zap, Users, Smartphone, Globe, Database, Brain, MapPin, Clock } from 'lucide-react';

const Features = () => {
  const coreFeatures = [
    {
      icon: <Leaf size={32} color="#4caf50" />,
      title: 'AI Crop Recommendations',
      description: 'Our machine learning algorithms analyze soil data, weather patterns, and market trends to recommend the best crops for your specific location and conditions.',
      benefits: ['Increase yields by up to 42%', 'Reduce crop failure risk', 'Optimize planting schedules']
    },
    {
      icon: <CloudRain size={32} color="#2196f3" />,
      title: 'Weather Intelligence',
      description: 'Get hyperlocal weather forecasts with 95% accuracy. Receive early warnings for droughts, floods, and extreme weather events.',
      benefits: ['7-day advanced forecasts', 'Risk alerts for your region', 'Historical weather analysis']
    },
    {
      icon: <TrendingUp size={32} color="#ffb300" />,
      title: 'Market Price Tracking',
      description: 'Real-time market prices from major Ethiopian markets. Know when to sell for maximum profit with demand predictions.',
      benefits: ['Live price updates', 'Demand forecasting', 'Best time to sell alerts']
    },
    {
      icon: <Shield size={32} color="#9c27b0" />,
      title: 'Disease Detection',
      description: 'Take a photo of your crops and our AI will identify diseases and pests instantly with treatment recommendations.',
      benefits: ['90% accuracy rate', 'Instant diagnosis', 'Treatment suggestions']
    },
    {
      icon: <Zap size={32} color="#ff9800" />,
      title: 'Smart Farming Tips',
      description: 'Personalized farming advice based on your specific crops, soil type, and local conditions.',
      benefits: ['Daily actionable insights', 'Season-specific guidance', 'Expert agronomist tips']
    },
    {
      icon: <Users size={32} color="#f44336" />,
      title: 'Farmer Community',
      description: 'Connect with thousands of Ethiopian farmers. Share experiences, ask questions, and learn from success stories.',
      benefits: ['Peer-to-peer learning', 'Expert Q&A sessions', 'Success story sharing']
    }
  ];

  const advancedFeatures = [
    {
      icon: <Smartphone size={32} color="#4caf50" />,
      title: 'Mobile-First Design',
      description: 'Works perfectly on any device, even with limited internet. Optimized for Ethiopian network conditions.'
    },
    {
      icon: <Globe size={32} color="#2196f3" />,
      title: 'Multi-Language Support',
      description: 'Available in Amharic, Oromo, Tigrinya, and English. Breaking language barriers for all farmers.'
    },
    {
      icon: <Database size={32} color="#ffb300" />,
      title: 'Offline Mode',
      description: 'Access critical features even without internet. Data syncs automatically when connection is restored.'
    },
    {
      icon: <Brain size={32} color="#9c27b0" />,
      title: 'Predictive Analytics',
      description: 'AI-powered predictions for yield, market trends, and optimal harvest timing.'
    },
    {
      icon: <MapPin size={32} color="#ff9800" />,
      title: 'Location-Based Insights',
      description: 'Hyperlocal recommendations based on your exact farm location and microclimate.'
    },
    {
      icon: <Clock size={32} color="#f44336" />,
      title: '24/7 Availability',
      description: 'Access insights anytime, anywhere. Our AI never sleeps, so you can farm smarter around the clock.'
    }
  ];

  return (
    <div className="page-container animate-fade-in">
      <section className="hero">
        <h1>Powerful <span className="highlight">Features</span> for Smart Farming</h1>
        <p>Everything you need to transform your agricultural operations with AI-powered intelligence</p>
      </section>

      {/* Core Features */}
      <section className="features-section">
        <div className="section-header">
          <h2>Core <span className="gradient-text">Capabilities</span></h2>
          <p>Essential tools designed for Ethiopian farmers</p>
        </div>
        <div className="features-grid">
          {coreFeatures.map((feature, index) => (
            <div key={index} className="feature-card detailed">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
              <ul className="feature-benefits">
                {feature.benefits.map((benefit, i) => (
                  <li key={i}>{benefit}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Advanced Features */}
      <section className="features-section alt-bg">
        <div className="section-header">
          <h2>Advanced <span className="gradient-text">Technology</span></h2>
          <p>Cutting-edge features that set us apart</p>
        </div>
        <div className="features-grid">
          {advancedFeatures.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="comparison-section">
        <div className="section-header">
          <h2>Why Choose <span className="gradient-text">AgriIntel</span></h2>
          <p>See how we compare to traditional farming methods</p>
        </div>
        <div className="comparison-table">
          <div className="comparison-header">
            <div>Feature</div>
            <div>Traditional Farming</div>
            <div>AgriIntel</div>
          </div>
          <div className="comparison-row">
            <div>Weather Forecasting</div>
            <div>❌ Limited to radio/TV</div>
            <div>✅ Hyperlocal 7-day forecasts</div>
          </div>
          <div className="comparison-row">
            <div>Market Prices</div>
            <div>❌ Word of mouth</div>
            <div>✅ Real-time live prices</div>
          </div>
          <div className="comparison-row">
            <div>Crop Selection</div>
            <div>❌ Based on tradition</div>
            <div>✅ AI-powered recommendations</div>
          </div>
          <div className="comparison-row">
            <div>Disease Detection</div>
            <div>❌ Visual inspection only</div>
            <div>✅ AI photo diagnosis</div>
          </div>
          <div className="comparison-row">
            <div>Yield Prediction</div>
            <div>❌ Guesswork</div>
            <div>✅ Data-driven predictions</div>
          </div>
          <div className="comparison-row">
            <div>Expert Access</div>
            <div>❌ Limited availability</div>
            <div>✅ 24/7 AI assistance</div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Transform Your Farm?</h2>
          <p>Join thousands of Ethiopian farmers already using AgriIntel to increase their yields and profits.</p>
          <button className="cta-button primary">
            Get Started Free
            <Leaf size={20} />
          </button>
        </div>
      </section>
    </div>
  );
};

export default Features;
