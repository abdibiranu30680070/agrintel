import React, { useState } from 'react';
import { Check, X, Star, Leaf, ArrowRight } from 'lucide-react';

const Pricing = ({ setCurrentPage }) => {
  const [annual, setAnnual] = useState(true);

  const plans = [
    {
      name: 'Starter',
      description: 'Perfect for small-scale farmers',
      price: annual ? 'Free' : 'Free',
      period: 'forever',
      popular: false,
      features: [
        { included: true, text: 'Basic crop recommendations' },
        { included: true, text: 'Weather forecasts (3-day)' },
        { included: true, text: 'Market price updates (daily)' },
        { included: true, text: 'Community forum access' },
        { included: false, text: 'AI disease detection' },
        { included: false, text: 'Advanced analytics' },
        { included: false, text: 'Priority support' },
        { included: false, text: 'Offline mode' }
      ],
      cta: 'Get Started Free'
    },
    {
      name: 'Professional',
      description: 'For serious farmers growing their business',
      price: annual ? 'ETB 299' : 'ETB 399',
      period: annual ? '/year' : '/month',
      popular: true,
      features: [
        { included: true, text: 'Advanced AI crop recommendations' },
        { included: true, text: 'Weather forecasts (7-day)' },
        { included: true, text: 'Real-time market prices' },
        { included: true, text: 'AI disease detection' },
        { included: true, text: 'Yield predictions' },
        { included: true, text: 'Basic analytics dashboard' },
        { included: true, text: 'Email support' },
        { included: false, text: 'Offline mode' }
      ],
      cta: 'Start Free Trial'
    },
    {
      name: 'Enterprise',
      description: 'For cooperatives and large farms',
      price: annual ? 'ETB 999' : 'ETB 1,499',
      period: annual ? '/year' : '/month',
      popular: false,
      features: [
        { included: true, text: 'All Professional features' },
        { included: true, text: 'Unlimited farm profiles' },
        { included: true, text: 'Advanced analytics & reports' },
        { included: true, text: 'Offline mode with sync' },
        { included: true, text: 'Priority phone support' },
        { included: true, text: 'Custom integrations' },
        { included: true, text: 'Training for staff' },
        { included: true, text: 'API access' }
      ],
      cta: 'Contact Sales'
    }
  ];

  const roiData = [
    { label: 'Average yield increase', value: '+42%' },
    { label: 'Average profit increase', value: '+38%' },
    { label: 'Risk reduction', value: '-65%' },
    { label: 'Time saved on research', value: '+15hrs/week' }
  ];

  return (
    <div className="content animate-fade-in">
      <section className="hero">
        <h1>Simple, <span className="highlight">Transparent</span> Pricing</h1>
        <p>Choose the plan that fits your farming needs. All plans include a 14-day free trial.</p>
      </section>

      {/* Toggle */}
      <div className="pricing-toggle">
        <button 
          className={`toggle-btn ${!annual ? 'active' : ''}`}
          onClick={() => setAnnual(false)}
        >
          Monthly
        </button>
        <button 
          className={`toggle-btn ${annual ? 'active' : ''}`}
          onClick={() => setAnnual(true)}
        >
          Annual
          <span className="save-badge">Save 25%</span>
        </button>
      </div>

      {/* Pricing Cards */}
      <div className="pricing-grid">
        {plans.map((plan, index) => (
          <div key={index} className={`pricing-card ${plan.popular ? 'popular' : ''}`}>
            {plan.popular && (
              <div className="popular-badge">
                <Star size={16} fill="#ffb300" color="#ffb300" />
                Most Popular
              </div>
            )}
            <div className="pricing-header">
              <h3>{plan.name}</h3>
              <p className="pricing-description">{plan.description}</p>
            </div>
            <div className="pricing-price">
              <span className="price">{plan.price}</span>
              <span className="period">{plan.period}</span>
            </div>
            <button 
              className={`pricing-cta ${plan.popular ? 'primary' : 'secondary'}`}
              onClick={() => setCurrentPage('dashboard')}
            >
              {plan.cta}
              <ArrowRight size={18} />
            </button>
            <ul className="pricing-features">
              {plan.features.map((feature, i) => (
                <li key={i} className={feature.included ? 'included' : 'excluded'}>
                  {feature.included ? (
                    <Check size={18} color="#4caf50" />
                  ) : (
                    <X size={18} color="#666" />
                  )}
                  <span>{feature.text}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* ROI Section */}
      <section className="roi-section">
        <div className="section-header">
          <h2>Return on <span className="gradient-text">Investment</span></h2>
          <p>See how AgriIntel pays for itself</p>
        </div>
        <div className="roi-grid">
          {roiData.map((item, index) => (
            <div key={index} className="roi-card">
              <div className="roi-value">{item.value}</div>
              <div className="roi-label">{item.label}</div>
            </div>
          ))}
        </div>
        <div className="roi-example">
          <div className="roi-content">
            <h3>Example: 2-Hectare Farm</h3>
            <div className="roi-calculation">
              <div className="roi-row">
                <span>Traditional farming profit</span>
                <span>ETB 45,000/year</span>
              </div>
              <div className="roi-row">
                <span>With AgriIntel profit</span>
                <span className="highlight">ETB 62,100/year</span>
              </div>
              <div className="roi-row total">
                <span>Additional profit</span>
                <span className="success">+ETB 17,100/year</span>
              </div>
              <div className="roi-row">
                <span>AgriIntel cost (Professional)</span>
                <span>-ETB 299/year</span>
              </div>
              <div className="roi-row final">
                <span>Net gain</span>
                <span className="success">+ETB 16,801/year</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-section">
        <div className="section-header">
          <h2>Frequently Asked <span className="gradient-text">Questions</span></h2>
        </div>
        <div className="faq-grid">
          <div className="faq-item">
            <h3>Is there a free trial?</h3>
            <p>Yes! All plans include a 14-day free trial. No credit card required to start.</p>
          </div>
          <div className="faq-item">
            <h3>Can I change plans later?</h3>
            <p>Absolutely. You can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
          </div>
          <div className="faq-item">
            <h3>What payment methods do you accept?</h3>
            <p>We accept M-Pesa, Telebirr, bank transfers, and credit/debit cards for Ethiopian farmers.</p>
          </div>
          <div className="faq-item">
            <h3>Is there a discount for cooperatives?</h3>
            <p>Yes! We offer special pricing for farmer cooperatives and agricultural associations. Contact us for details.</p>
          </div>
          <div className="faq-item">
            <h3>Does it work offline?</h3>
            <p>The Professional and Enterprise plans include offline mode. Data syncs automatically when you're back online.</p>
          </div>
          <div className="faq-item">
            <h3>How accurate are the recommendations?</h3>
            <p>Our AI has 85-92% accuracy for crop recommendations and 90% accuracy for disease detection based on field testing.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Increase Your Farm's Profit?</h2>
          <p>Join thousands of Ethiopian farmers already using AgriIntel</p>
          <button className="cta-button primary" onClick={() => setCurrentPage('dashboard')}>
            Start Your Free Trial
            <Leaf size={20} />
          </button>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
