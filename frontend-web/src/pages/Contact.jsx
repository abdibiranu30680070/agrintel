import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Clock, MessageCircle, Share2, Globe } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const contactInfo = [
    {
      icon: <Mail size={24} color="#4caf50" />,
      title: 'Email Us',
      value: 'info@agriintel.eth',
      description: 'We respond within 24 hours'
    },
    {
      icon: <Phone size={24} color="#2196f3" />,
      title: 'Call Us',
      value: '+251 911 123 456',
      description: 'Mon-Fri, 9AM-6PM EAT'
    },
    {
      icon: <MapPin size={24} color="#ffb300" />,
      title: 'Visit Us',
      value: 'Bole Subcity, Addis Ababa',
      description: 'Ethiopia'
    }
  ];

  const team = [
    { name: 'Abdi Biranu', role: 'CEO & Founder', image: 'AB' },
    { name: 'Dr. Almaz Tesfaye', role: 'Chief Agronomist', image: 'AT' },
    { name: 'Dawit Mengistu', role: 'Lead Engineer', image: 'DM' }
  ];

  return (
    <div className="content animate-fade-in">
      <section className="hero">
        <h1>Get in <span className="highlight">Touch</span></h1>
        <p>Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
      </section>

      {/* Contact Info Cards */}
      <div className="contact-info-grid">
        {contactInfo.map((info, index) => (
          <div key={index} className="contact-info-card">
            <div className="contact-icon">{info.icon}</div>
            <h3>{info.title}</h3>
            <p className="contact-value">{info.value}</p>
            <p className="contact-description">{info.description}</p>
          </div>
        ))}
      </div>

      {/* Contact Form */}
      <section className="contact-form-section">
        <div className="contact-form-container">
          <div className="contact-form-header">
            <h2>Send us a <span className="gradient-text">Message</span></h2>
            <p>Fill out the form below and we'll get back to you within 24 hours.</p>
          </div>
          
          {submitted ? (
            <div className="success-message">
              <MessageCircle size={48} color="#4caf50" />
              <h3>Message Sent!</h3>
              <p>Thank you for reaching out. We'll get back to you soon.</p>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Your Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="What's this about?"
                  required
                />
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us more..."
                  rows="5"
                  required
                />
              </div>
              <button type="submit" className="submit-button">
                Send Message
                <Send size={18} />
              </button>
            </form>
          )}
        </div>

        {/* Office Hours */}
        <div className="office-hours-card">
          <div className="office-hours-header">
            <Clock size={32} color="#4caf50" />
            <h3>Office Hours</h3>
          </div>
          <div className="hours-list">
            <div className="hours-item">
              <span>Monday - Friday</span>
              <span>9:00 AM - 6:00 PM</span>
            </div>
            <div className="hours-item">
              <span>Saturday</span>
              <span>10:00 AM - 2:00 PM</span>
            </div>
            <div className="hours-item">
              <span>Sunday</span>
              <span>Closed</span>
            </div>
          </div>
          <div className="time-zone">
            <p>All times in East Africa Time (EAT)</p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="section-header">
          <h2>Meet Our <span className="gradient-text">Team</span></h2>
          <p>The passionate people behind AgriIntel Ethiopia</p>
        </div>
        <div className="team-grid">
          {team.map((member, index) => (
            <div key={index} className="team-card">
              <div className="team-avatar">{member.image}</div>
              <h3>{member.name}</h3>
              <p className="team-role">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Social Links */}
      <section className="social-section">
        <div className="section-header">
          <h2>Connect With <span className="gradient-text">Us</span></h2>
          <p>Follow us on social media for updates and farming tips</p>
        </div>
        <div className="social-links">
          <a href="#" className="social-link">
            <Share2 size={32} />
            <span>Social Media</span>
          </a>
          <a href="#" className="social-link">
            <Globe size={32} />
            <span>Website</span>
          </a>
        </div>
      </section>

      {/* Map Section */}
      <section className="map-section">
        <div className="map-container">
          <div className="map-placeholder">
            <MapPin size={48} color="#4caf50" />
            <h3>Our Office</h3>
            <p>Bole Subcity, Addis Ababa, Ethiopia</p>
            <button className="map-button">Get Directions</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
