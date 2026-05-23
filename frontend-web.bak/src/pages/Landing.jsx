import React, { useState } from 'react';
import { ArrowRight, Play, Check, Star, TrendingUp, Shield, Zap, Users, Leaf, CloudRain, DollarSign } from 'lucide-react';

const Landing = ({ setCurrentPage }) => {
  const [email, setEmail] = useState('');

  const features = [
    { icon: <Leaf size={32} color="#4caf50" />, title: 'AI Crop Recommendations', desc: 'Get personalized crop suggestions based on soil, weather, and market data' },
    { icon: <CloudRain size={32} color="#2196f3" />, title: 'Weather Intelligence', desc: 'Real-time weather forecasts and risk alerts for your region' },
    { icon: <DollarSign size={32} color="#ffb300" />, title: 'Market Price Tracking', desc: 'Stay updated with live market prices and demand trends' },
    { icon: <Shield size={32} color="#9c27b0" />, title: 'Disease Detection', desc: 'AI-powered crop disease identification from photos' },
    { icon: <Zap size={32} color="#ff9800" />, title: 'Smart Farming Tips', desc: 'Actionable insights to maximize your yield and profit' },
    { icon: <Users size={32} color="#f44336" />, title: 'Farmer Community', desc: 'Connect with other farmers and share knowledge' }
  ];

  const stats = [
    { value: '50K+', label: 'Farmers Using' },
    { value: '42%', label: 'Yield Increase' },
    { value: '85%', label: 'Accuracy Rate' },
    { value: '9', label: 'Regions Covered' }
  ];

  const testimonials = [
    { name: 'Abebe Kebede', role: 'Maize Farmer, Oromia', text: 'AgriIntel helped me double my maize yield in just one season. The weather alerts saved my crops twice!', rating: 5 },
    { name: 'Tigist Haile', role: 'Coffee Farmer, Sidama', text: 'Finally, technology that understands Ethiopian farming. The market prices are always accurate.', rating: 5 },
    { name: 'Dawit Alemu', role: 'Teff Farmer, Amhara', text: 'The crop recommendations changed everything. I now know exactly what to plant and when.', rating: 5 }
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <Star size={16} color="#ffb300" />
            <span>Winner: Ethiopian Startup Competition 2026</span>
          </div>
          <h1 className="hero-title">
            Transform Your Farm with <span className="gradient-text">AI Intelligence</span>
          </h1>
          <p className="hero-subtitle">
            Join 50,000+ Ethiopian farmers using data-driven insights to increase yields, 
            reduce risks, and maximize profits. Built for Ethiopia, by Ethiopians.
          </p>
          <div className="hero-buttons">
            <button className="cta-button primary" onClick={() => setCurrentPage('dashboard')}>
              Get Started Free
              <ArrowRight size={20} />
            </button>
            <button className="cta-button secondary">
              <Play size={20} />
              Watch Demo
            </button>
          </div>
          <div className="hero-stats">
            {stats.map((stat, i) => (
              <div key={i} className="stat-item">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="hero-visual">
          <div className="floating-card card-1">
            <Leaf size={40} color="#4caf50" />
            <div>
              <div className="card-label">Crop Recommendation</div>
              <div className="card-value">Teff - 94% Match</div>
            </div>
          </div>
          <div className="floating-card card-2">
            <TrendingUp size={40} color="#4caf50" />
            <div>
              <div className="card-label">Yield Prediction</div>
              <div className="card-value">+42% Increase</div>
            </div>
          </div>
          <div className="floating-card card-3">
            <DollarSign size={40} color="#ffb300" />
            <div>
              <div className="card-label">Market Price</div>
              <div className="card-value">ETB 4,500/q</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2>Everything You Need to <span className="gradient-text">Succeed</span></h2>
          <p>Powerful tools designed specifically for Ethiopian agriculture</p>
        </div>
        <div className="features-grid">
          {features.map((feature, i) => (
            <div key={i} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="section-header">
          <h2>How <span className="gradient-text">AgriIntel</span> Works</h2>
          <p>Simple steps to transform your farming</p>
        </div>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Register Your Farm</h3>
            <p>Enter your location, soil type, and farm size</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Get AI Insights</h3>
            <p>Receive personalized recommendations instantly</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Take Action</h3>
            <p>Follow data-driven guidance for better results</p>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>Track Progress</h3>
            <p>Monitor yields, profits, and improvements over time</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <div className="section-header">
          <h2>Trusted by <span className="gradient-text">Farmers</span> Across Ethiopia</h2>
          <p>See what our community says about AgriIntel</p>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((t, i) => (
            <div key={i} className="testimonial-card">
              <div className="testimonial-rating">
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} size={16} fill="#ffb300" color="#ffb300" />
                ))}
              </div>
              <p className="testimonial-text">"{t.text}"</p>
              <div className="testimonial-author">
                <div className="author-avatar">{t.name.charAt(0)}</div>
                <div>
                  <div className="author-name">{t.name}</div>
                  <div className="author-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Transform Your Farm?</h2>
          <p>Join thousands of Ethiopian farmers already using AgriIntel to increase their yields and profits.</p>
          <div className="cta-form">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="cta-input"
            />
            <button className="cta-button primary" onClick={() => setCurrentPage('dashboard')}>
              Start Free Trial
              <ArrowRight size={20} />
            </button>
          </div>
          <div className="cta-features">
            <div className="cta-feature">
              <Check size={16} color="#4caf50" />
              <span>Free forever for small farms</span>
            </div>
            <div className="cta-feature">
              <Check size={16} color="#4caf50" />
              <span>No credit card required</span>
            </div>
            <div className="cta-feature">
              <Check size={16} color="#4caf50" />
              <span>Available in Amharic & English</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
