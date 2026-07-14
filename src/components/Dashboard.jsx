import React from 'react';
import shieldImage from '../assets/image.png';

const Dashboard = ({ onStartQuiz, userName }) => {
  return (
    <div className="glass-card" style={{ maxWidth: '800px', width: '100%' }}>
      {userName && (
        <p style={{ textAlign: 'center', color: 'var(--primary-color)', fontWeight: '600', marginBottom: '0.5rem', fontSize: '1.1rem' }}>
          Welcome, {userName}!
        </p>
      )}
      <h1 style={{ marginTop: '0' }}>ITS Reviewer</h1>
      <p style={{ textAlign: 'center', marginBottom: '3rem' }}>
        Welcome to the Information Technology Security reviewer portal. Select a module below to begin your session.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', width: '100%' }}>
        <div className="glass-card topic-card" onClick={onStartQuiz} style={{ padding: '2rem' }}>
          <img src={shieldImage} alt="Network Security Shield" style={{ width: '100%', height: 'auto', borderRadius: '12px', marginBottom: '1.5rem' }} />
          <h2>Network Security</h2>
          <p>40 Questions</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
