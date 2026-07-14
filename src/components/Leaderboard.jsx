import React, { useState, useEffect } from 'react';

const TrophyIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
    <path d="M4 22h16"></path>
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
  </svg>
);

const RankMedal = ({ rank }) => {
  let color = 'var(--text-secondary)';
  if (rank === 1) color = '#F59E0B'; // Gold
  if (rank === 2) color = '#9CA3AF'; // Silver
  if (rank === 3) color = '#D97706'; // Bronze

  if (rank > 3) {
    return <div style={{ width: '24px', textAlign: 'center', fontWeight: 'bold', color: 'var(--text-secondary)' }}>{rank}</div>;
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px' }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="7"></circle>
        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
      </svg>
    </div>
  );
};

const Leaderboard = ({ currentUserName, onBack }) => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await fetch('/api/leaderboard');
        if (response.ok) {
          const data = await response.json();
          setScores(data.scores || []);
        }
      } catch (err) {
        console.error('Failed to load leaderboard', err);
      } finally {
        setLoading(false);
      }
    };
    fetchScores();
  }, []);

  return (
    <div className="glass-card" style={{ maxWidth: '600px', width: '100%', padding: '2.5rem', background: 'var(--surface-color)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: '600' }}>
          <TrophyIcon /> Leaderboard
        </h2>
        {onBack && (
          <button 
            onClick={onBack}
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontWeight: '500' }}
          >
            ← Back
          </button>
        )}
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Loading scores...</p>
      ) : scores.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No scores yet. Be the first!</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {scores.map((entry, idx) => {
            const isCurrentUser = entry.name.toLowerCase() === (currentUserName || '').toLowerCase();
            
            return (
              <div 
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem 1.25rem',
                  background: isCurrentUser ? 'rgba(0, 112, 243, 0.05)' : '#ffffff',
                  border: isCurrentUser ? '1px solid var(--primary-color)' : '1px solid #eaeaea',
                  borderRadius: '10px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <RankMedal rank={idx + 1} />
                  <div>
                    <strong style={{ display: 'block', color: 'var(--text-primary)', fontSize: '1.05rem', fontWeight: isCurrentUser ? '600' : '500' }}>
                      {entry.name} {isCurrentUser && <span style={{ color: 'var(--primary-color)', fontSize: '0.85rem', marginLeft: '0.25rem' }}>(You)</span>}
                    </strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                  {entry.score}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
