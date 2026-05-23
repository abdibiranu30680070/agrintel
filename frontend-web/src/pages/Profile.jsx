import React, { useState } from 'react';
import { User, MapPin, Ruler, Leaf, Globe } from 'lucide-react';
import axios from 'axios';

const Profile = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    region: 'Oromia',
    farmSize: '',
    primaryCrops: 'Teff',
    language: 'Amharic'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Simulate registration
      setTimeout(() => {
        setLoading(false);
        setMessage('Profile updated successfully! Your AI recommendations will now be personalized.');
      }, 1500);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
      setLoading(false);
    }
  };

  return (
    <div className="content animate-fade-in">
      <section className="hero">
        <h1>Farmer <span className="highlight">Profile</span></h1>
        <p>Personalize your AgriIntel experience for better advice.</p>
      </section>

      <div className="grid">
        <div className="card" style={{ gridColumn: 'span 2' }}>
          <div className="card-header">
            <User size={24} color="#4caf50" />
            <h3>Personal & Farm Details</h3>
          </div>

          <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Full Name</label>
                <input 
                  type="text" 
                  name="fullName"
                  placeholder="e.g. Abdi Biranu"
                  value={formData.fullName}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)', color: 'white' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Region</label>
                <select 
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)', color: 'white' }}
                >
                  <option value="Oromia">Oromia</option>
                  <option value="Amhara">Amhara</option>
                  <option value="Tigray">Tigray</option>
                  <option value="SNNPR">SNNPR</option>
                  <option value="Afar">Afar</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Farm Size (Hectares)</label>
                <input 
                  type="number" 
                  name="farmSize"
                  placeholder="e.g. 2.5"
                  value={formData.farmSize}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)', color: 'white' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Primary Crop</label>
                <select 
                  name="primaryCrops"
                  value={formData.primaryCrops}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)', color: 'white' }}
                >
                  <option value="Teff">Teff</option>
                  <option value="Maize">Maize</option>
                  <option value="Wheat">Wheat</option>
                  <option value="Coffee">Coffee</option>
                </select>
              </div>
            </div>

            <button className="primary-btn" disabled={loading} style={{ width: '200px' }}>
              {loading ? 'Saving...' : 'Update Profile'}
            </button>
            {message && <p style={{ color: '#4caf50', marginTop: '1rem' }}>{message}</p>}
          </form>
        </div>

        <div className="card">
          <div className="card-header">
            <Globe size={24} color="#ffb300" />
            <h3>Language Preference</h3>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Choose your preferred language for SMS and Voice alerts.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
            {['Amharic', 'Oromiffa', 'Tigrinya', 'English'].map(lang => (
              <label key={lang} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input 
                  type="radio" 
                  name="language" 
                  value={lang} 
                  checked={formData.language === lang} 
                  onChange={handleChange}
                />
                {lang}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
