import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = onLogin(password);
    if (!success) {
      setError('Invalid access code. Please try again.');
      setPassword('');
    }
  };

  return (
    <div className="glass-card" style={{ maxWidth: '400px', width: '100%' }}>
      <h1>Access Required</h1>
      <p style={{ textAlign: 'center', marginBottom: '2rem' }}>
        Please enter the secure access code to enter the ITS Reviewer portal.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label className="input-label" htmlFor="password">Access Code</label>
          <input
            id="password"
            type="password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter code..."
            autoFocus
          />
        </div>
        
        {error && <p style={{ color: 'var(--error-color)', fontSize: '0.875rem', marginBottom: '1rem' }}>{error}</p>}
        
        <button type="submit" className="btn">
          Authenticate <span style={{ marginLeft: '0.5rem' }}>→</span>
        </button>
      </form>
    </div>
  );
};

export default Login;
