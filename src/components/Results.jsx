import React, { useState, useEffect } from 'react';
import Leaderboard from './Leaderboard';
import { Button } from './ui/button';

const Results = ({ score, total, userAnswers, questions, onReturnHome, onRestart, userName, subject }) => {
  const [showReview, setShowReview] = useState(false);
  const [scoreStatus, setScoreStatus] = useState('saving');
  const [scoreMessage, setScoreMessage] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    if (userName && subject) {
      setScoreStatus('saving');
      fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: userName, score, subject: subject.id }),
        signal: controller.signal,
      })
        .then(async (response) => {
          const data = await response.json().catch(() => ({}));
          if (!response.ok) throw new Error(data.error || 'Score could not be saved.');
          setScoreStatus('saved');
          setScoreMessage(`Personal best: ${data.personalBest}/${total}`);
        })
        .catch((error) => {
          if (error.name === 'AbortError') return;
          console.error('Failed to post score', error);
          setScoreStatus('error');
          setScoreMessage(error.message);
        });
    }

    return () => controller.abort();
  }, [userName, score, subject, total]);

  const percentage = Math.round((score / total) * 100);

  return (
    <div className="glass-card" style={{ maxWidth: '800px', width: '100%' }}>
      {!showReview ? (
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ marginBottom: '0.5rem' }}>Questionnaire Complete!</h1>
          <p style={{ marginBottom: '3rem' }}>{subject?.name} Module</p>
          {scoreMessage && <p className={scoreStatus === 'error' ? 'text-sm text-red-600' : 'text-sm text-emerald-700'} role="status">{scoreMessage}</p>}

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
            <Button variant="outline" onClick={() => setShowReview(true)}>
              View Results Review
            </Button>
            <Button variant="outline" onClick={onRestart}>
              Try Again
            </Button>
            <Button onClick={onReturnHome}>
              Return to Dashboard
            </Button>
          </div>

          <Leaderboard subject={subject} currentUserName={userName} refreshKey={scoreStatus} />
        </div>
      ) : (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2>Detailed Review</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowReview(false)} 
            >
              ← Back to Score
            </Button>
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

          <Button className="mt-8 w-full" onClick={onReturnHome}>
            Return to Dashboard
          </Button>
        </div>
      )}
    </div>
  );
};

export default Results;
