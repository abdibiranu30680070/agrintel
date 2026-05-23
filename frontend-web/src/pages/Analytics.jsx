import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, DollarSign, PieChart, Calculator } from 'lucide-react';

const Analytics = () => {
  const [farmSize, setFarmSize] = useState(2);
  
  const yieldData = [
    { year: '2022', traditional: 12, agriintel: 12 },
    { year: '2023', traditional: 13, agriintel: 15 },
    { year: '2024', traditional: 12, agriintel: 18 },
    { year: '2025', traditional: 14, agriintel: 22 },
    { year: '2026', traditional: 13, agriintel: 26 },
  ];

  const incomeData = [
    { crop: 'Teff', before: 45000, after: 68000 },
    { crop: 'Maize', before: 32000, after: 54000 },
    { crop: 'Wheat', before: 38000, after: 59000 },
    { crop: 'Coffee', before: 120000, after: 185000 },
  ];

  return (
    <div className="content animate-fade-in">
      <section className="hero">
        <h1>Impact <span className="highlight">Analytics</span></h1>
        <p>Visualizing the data-driven agricultural revolution in Ethiopia.</p>
      </section>

      <div className="grid">
        {/* Yield Improvement Chart */}
        <div className="card" style={{ gridColumn: 'span 2' }}>
          <div className="card-header">
            <TrendingUp size={24} color="#4caf50" />
            <h3>Yield Improvement (Quintals per Hectare)</h3>
          </div>
          <div style={{ height: '300px', width: '100%', marginTop: '1rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={yieldData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="year" stroke="#a0a0a0" />
                <YAxis stroke="#a0a0a0" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a241f', border: '1px solid rgba(255,255,255,0.1)' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Line type="monotone" dataKey="agriintel" name="With AgriIntel" stroke="#4caf50" strokeWidth={3} />
                <Line type="monotone" dataKey="traditional" name="Traditional" stroke="#f44336" strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Income Growth Chart */}
        <div className="card">
          <div className="card-header">
            <DollarSign size={24} color="#ffb300" />
            <h3>Annual Income Growth (ETB)</h3>
          </div>
          <div style={{ height: '300px', width: '100%', marginTop: '1rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={incomeData}>
                <XAxis dataKey="crop" stroke="#a0a0a0" />
                <YAxis stroke="#a0a0a0" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a241f', border: '1px solid rgba(255,255,255,0.1)' }}
                />
                <Bar dataKey="after" name="New Income" fill="#4caf50" radius={[4, 4, 0, 0]} />
                <Bar dataKey="before" name="Past Income" fill="rgba(255,255,255,0.1)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ROI Calculator */}
        <div className="card">
          <div className="card-header">
            <Calculator size={24} color="#2e7d32" />
            <h3>Profit Potential Calculator</h3>
          </div>
          <div style={{ textAlign: 'left' }}>
            <label style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Enter Farm Size (Hectares)</label>
            <input 
              type="range" 
              min="1" max="20" 
              value={farmSize} 
              onChange={(e) => setFarmSize(e.target.value)}
              style={{ width: '100%', margin: '1rem 0', accentColor: '#4caf50' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span>{farmSize} Hectares</span>
            </div>
            
            <div style={{ background: 'rgba(46, 125, 50, 0.1)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(46, 125, 50, 0.2)' }}>
              <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-muted)' }}>Estimated Profit Increase</p>
              <h2 style={{ margin: 0, color: '#4caf50' }}>{ (farmSize * 12500).toLocaleString() } ETB / Year</h2>
              <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', color: '#4caf50' }}>+42% Growth Predicted</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
