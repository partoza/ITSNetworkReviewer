import React, { useState, useEffect } from 'react';
import Leaderboard from './Leaderboard';

const Results = ({ score, total, userAnswers, questions, onReturnHome, onRestart, userName }) => {
  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    // Post score to the local backend
    if (userName) {
      fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: userName, score })
      }).catch(err => console.error('Failed to post score', err));
    }
  }, [userName, score]);

  const percentage = Math.round((score / total) * 100);

  return (
    <div className="glass-card" style={{ maxWidth: '800px', width: '100%' }}>
      {!showReview ? (
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ marginBottom: '0.5rem' }}>Questionnaire Complete!</h1>
          <p style={{ marginBottom: '3rem' }}>Network Security Module</p>

          <div style={{ 
            width: '200px', 
            height: '200px', 
            borderRadius: '50%', 
            background: `conic-gradient(var(--primary-color) ${percentage}%, var(--border-color) 0)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 3rem',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              width: '180px',
              height: '180px',
              background: 'var(--surface-color)',
              borderRadius: '50%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{score}</span>
              <span style={{ color: 'var(--text-secondary)' }}>out of {total}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '3rem', flexWrap: 'wrap' }}>
            <button className="btn" onClick={() => setShowReview(true)} style={{ width: 'auto', background: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}>
              View Results Review
            </button>
            <button className="btn" onClick={onRestart} style={{ width: 'auto', background: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}>
              Try Again
            </button>
            <button className="btn" onClick={onReturnHome} style={{ width: 'auto' }}>
              Return to Dashboard
            </button>
          </div>

          <Leaderboard currentUserName={userName} />
        </div>
      ) : (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2>Detailed Review</h2>
            <button 
              onClick={() => setShowReview(false)} 
              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1rem' }}
            >
              ← Back to Score
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {questions.map((q, idx) => {
              const userAnswer = userAnswers[q.id];
              
              let isCorrect = false;
              if (q.type === 'match' || q.type === 'multi-part') {
                isCorrect = Object.keys(q.correctAnswer).every(
                  def => userAnswer && userAnswer[def] === q.correctAnswer[def]
                );
              } else if (q.type === 'multiple-select') {
                isCorrect = Array.isArray(userAnswer) && 
                            userAnswer.length === q.correctAnswer.length &&
                            userAnswer.every(val => q.correctAnswer.includes(val));
              } else {
                isCorrect = userAnswer === q.correctAnswer;
              }

              return (
                <div key={idx} className={`review-item ${isCorrect ? 'correct' : 'incorrect'}`}>
                  <div className={`badge ${isCorrect ? 'correct' : 'incorrect'}`}>
                    {isCorrect ? 'Correct' : 'Incorrect'}
                  </div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>{idx + 1}. {q.question}</h3>
                  
                  {q.type === 'multiple-select' ? (
                    <div className="review-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: 'var(--bg-color)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
                      <div>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', display: 'block', marginBottom: '0.5rem' }}>Your Answers:</span>
                        {(userAnswer || []).length > 0 ? (
                          (userAnswer || []).map((ans, aIdx) => (
                            <strong key={aIdx} style={{ display: 'block', marginBottom: '0.5rem', color: q.correctAnswer.includes(ans) ? 'var(--success-color)' : 'var(--error-color)' }}>{ans}</strong>
                          ))
                        ) : (
                          <strong style={{ color: 'var(--error-color)' }}>No Answer</strong>
                        )}
                      </div>
                      {!isCorrect && (
                        <div>
                          <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', display: 'block', marginBottom: '0.5rem' }}>Correct Answers:</span>
                          {q.correctAnswer.map((ans, aIdx) => (
                            <strong key={aIdx} style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--success-color)' }}>{ans}</strong>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : q.type === 'match' || q.type === 'multi-part' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {(q.definitions || q.parts.map(p => p.label)).map((def, dIdx) => {
                        const uAns = userAnswer?.[def];
                        const cAns = q.correctAnswer[def];
                        const matchCorrect = uAns === cAns;
                        return (
                          <div key={dIdx} style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '0.5rem' }}>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>{def}</p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                              <div>
                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', display: 'block' }}>Your Match:</span>
                                <strong style={{ color: matchCorrect ? 'var(--success-color)' : 'var(--error-color)' }}>{uAns || 'No Answer'}</strong>
                              </div>
                              {!matchCorrect && (
                                <div>
                                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', display: 'block' }}>Correct Match:</span>
                                  <strong style={{ color: 'var(--success-color)' }}>{cAns}</strong>
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '0.5rem' }}>
                      <div>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', display: 'block', marginBottom: '0.25rem' }}>Your Answer:</span>
                        <strong style={{ color: isCorrect ? 'var(--success-color)' : 'var(--error-color)' }}>{userAnswer || 'No Answer'}</strong>
                      </div>
                      {!isCorrect && (
                        <div>
                          <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', display: 'block', marginBottom: '0.25rem' }}>Correct Answer:</span>
                          <strong style={{ color: 'var(--success-color)' }}>{q.correctAnswer}</strong>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <button className="btn" onClick={onReturnHome} style={{ marginTop: '2rem' }}>
            Return to Dashboard
          </button>
        </div>
      )}
    </div>
  );
};

export default Results;
