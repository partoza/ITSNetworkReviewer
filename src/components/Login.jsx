import React, { useState } from 'react';
import { ArrowRight, LockKeyhole } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

const Login = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(password)) {
      setError('Enter the 6-digit access code.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    try {
      await onLogin(password);
    } catch (authError) {
      setError(authError.message || 'Authentication failed. Please try again.');
      setPassword('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-card" style={{ maxWidth: '400px', width: '100%' }}>
      <div className="mx-auto mb-4 grid size-12 place-items-center rounded-xl bg-neutral-100 text-neutral-700">
        <LockKeyhole className="size-6" strokeWidth={1.5} />
      </div>
      <h1>Access Required</h1>
      <p style={{ textAlign: 'center', marginBottom: '2rem' }}>
        Please enter the secure access code to enter the ITS Reviewer portal.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label className="input-label" htmlFor="password">Access Code</label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value.replace(/\D/g, '').slice(0, 6));
              if (error) setError('');
            }}
            placeholder="Enter code..."
            inputMode="numeric"
            autoComplete="current-password"
            minLength={6}
            maxLength={6}
            required
            autoFocus
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'access-code-error' : undefined}
          />
        </div>
        
        {error && <p id="access-code-error" style={{ color: 'var(--error-color)', fontSize: '0.875rem', marginBottom: '1rem' }} role="alert">{error}</p>}
        
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Authenticating…' : 'Authenticate'} {!isSubmitting && <ArrowRight />}
        </Button>
      </form>
    </div>
  );
};

export default Login;
