import React from 'react';
import { Target, Eye, ShieldCheck, Heart } from 'lucide-react';

const About = () => {
  return (
    <div className="page-container animate-fade-in">
      <section className="hero">
        <h1>About <span className="highlight">AgriIntel Ethiopia</span></h1>
        <p>Bridging the data gap for a food-secure future.</p>
      </section>

      <div className="grid">
        <div className="card">
          <div className="card-header">
            <Target size={24} color="#4caf50" />
            <h3>Our Mission</h3>
          </div>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
            To provide accessible, affordable, and accurate agricultural intelligence 
            that empowers Ethiopian smallholders to increase yields and achieve financial independence.
          </p>
        </div>

        <div className="card">
          <div className="card-header">
            <Eye size={24} color="#ffb300" />
            <h3>Our Vision</h3>
          </div>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
            To be the leading digital infrastructure for smart agriculture in East Africa, 
            transforming every smallholder farm into a data-driven enterprise.
          </p>
        </div>
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <div className="card-header">
          <ShieldCheck size={24} color="#2e7d32" />
          <h3>Why We Exist</h3>
        </div>
        <div style={{ textAlign: 'left', color: 'var(--text-muted)' }}>
          <p>
            Ethiopia's agriculture sector employs over 70% of the workforce, yet millions of farmers 
            remain vulnerable to climate uncertainty and market price volatility. 
          </p>
          <p>
            AgriIntel leverages Artificial Intelligence and real-time data to transition Ethiopian 
            farming from traditional guesswork to data-driven prosperity, contributing directly to 
            national food security and the "Digital Ethiopia 2025" strategy.
          </p>
        </div>
      </div>

      <div style={{ marginTop: '4rem', padding: '2rem', background: 'rgba(46, 125, 50, 0.05)', borderRadius: '16px' }}>
        <Heart size={32} color="#4caf50" style={{ marginBottom: '1rem' }} />
        <h2>Driven by Impact</h2>
        <p style={{ color: 'var(--text-muted)' }}>
          Founded in Addis Ababa, we are a team of tech innovators and agronomists 
          dedicated to the "Last Mile" of the Ethiopian economy.
        </p>
      </div>
    </div>
  );
};

export default About;
